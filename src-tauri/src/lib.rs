mod app;
mod io;
mod model;

use app::{
    apply_disk_version, check_tab_full_state, check_tab_state, clear_recent_files,
    close_diff_window, close_tab, discard_tab_changes, get_diff_payload, get_disk_content,
    get_large_dirty_tabs, get_recent_files, get_tab_content, get_tab_path, get_workspace_state,
    get_zoom, load_pending_tab, new_tab, open_diff_window, open_files, read_dir, reload_tab,
    remove_recent_file, rename_tab_file, reorder_tabs, restore_session, save_active_file,
    save_active_file_as, save_and_prepare_exit, set_editor_bg, set_locale, set_record_recent_files,
    set_show_line_numbers, set_word_wrap, set_zoom, show_window, switch_tab, take_startup_files,
    tick_autosave, update_active_text, AppState,
};
use model::Workspace;
use std::sync::Mutex;
use tauri::Manager;

/// 从命令行参数中解析文件路径。
/// 处理两类情况：
///   1. 每个参数是一个完整路径（Windows 双击时的正常情况）
///   2. 多个参数拼起来才是一个完整路径（命令行未加引号时）
fn parse_file_args(args: &[String]) -> Vec<String> {
    let raw: Vec<&String> = args
        .iter()
        .skip(1) // 跳过 exe 自身路径
        .filter(|a| !a.starts_with('-'))
        .collect();

    let mut result = Vec::new();
    let mut i = 0;
    while i < raw.len() {
        // 1. 单个参数就是有效路径
        if std::path::Path::new(raw[i]).exists() {
            result.push(raw[i].clone());
            i += 1;
            continue;
        }
        // 2. 尝试拼接后续参数
        let mut merged = raw[i].clone();
        let mut j = i + 1;
        let mut found = false;
        while j < raw.len() {
            merged.push(' ');
            merged.push_str(raw[j]);
            if std::path::Path::new(&merged).exists() {
                result.push(merged.clone());
                i = j + 1;
                found = true;
                break;
            }
            j += 1;
        }
        // 3. 拼不出存在的路径 → 跳过（可能是无效参数）
        if !found {
            i += 1;
        }
    }
    result
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 1. 读取本进程的命令行参数（首次启动的 .txt 文件）
    let args: Vec<String> = std::env::args().collect();
    let startup_files = parse_file_args(&args);

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            use tauri::Emitter;
            let files = parse_file_args(&argv);

            if !files.is_empty() {
                let _ = app.emit("single-instance-files", files);
            }

            use tauri::Manager;
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(AppState {
            workspace: Mutex::new(Workspace::new()),
            session_dirty: std::sync::atomic::AtomicBool::new(false),
            last_medium_cache_time: std::sync::atomic::AtomicU64::new(0),
            startup_files: Mutex::new(startup_files),
            diff_payload: Mutex::new(None),
            is_exiting: std::sync::atomic::AtomicBool::new(false), // ★ 新增
            // ★ 新增
            last_window_size: Mutex::new(None),
            last_window_pos: Mutex::new(None),
        })
        .setup(|app| {
            use tauri::Manager;
            // macOS 保持系统装饰（未来再适配）
            #[cfg(target_os = "macos")]
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_decorations(true);
            }

            // ★ 修正：使用 on_window_event 监听窗口大小和位置变化
            if let Some(window) = app.get_webview_window("main") {
                let app_handle = app.handle().clone();
                window.on_window_event(move |event| {
                    match event {
                        tauri::WindowEvent::Resized(size) => {
                            // ★ 核心防御 3：过滤掉任何小于 200x200 的异常尺寸（比如启动瞬间的 0x0）
                            if size.width < 200 || size.height < 200 {
                                return;
                            }
                            if let Ok(scale) = app_handle
                                .get_webview_window("main")
                                .and_then(|w| w.scale_factor().ok())
                                .ok_or(())
                            {
                                if let Some(state) = app_handle.try_state::<AppState>() {
                                    if let Ok(mut s) = state.last_window_size.lock() {
                                        *s = Some((
                                            size.width as f32 / scale as f32,
                                            size.height as f32 / scale as f32,
                                        ));
                                    }
                                    state.mark_session_dirty();
                                }
                            }
                        }
                        tauri::WindowEvent::Moved(pos) => {
                            // 位置校验（可选）：过滤极端坐标
                            if pos.x.abs() > 50000 || pos.y.abs() > 50000 {
                                return;
                            }
                            if let Ok(scale) = app_handle
                                .get_webview_window("main")
                                .and_then(|w| w.scale_factor().ok())
                                .ok_or(())
                            {
                                if let Some(state) = app_handle.try_state::<AppState>() {
                                    if let Ok(mut p) = state.last_window_pos.lock() {
                                        *p = Some((
                                            pos.x as f32 / scale as f32,
                                            pos.y as f32 / scale as f32,
                                        ));
                                    }
                                    state.mark_session_dirty();
                                }
                            }
                        }
                        _ => {}
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_workspace_state,
            new_tab,
            update_active_text,
            switch_tab,
            close_tab,
            open_files,
            save_active_file,
            save_active_file_as,
            load_pending_tab,
            check_tab_state,
            reload_tab,
            check_tab_full_state,
            get_tab_path,
            get_large_dirty_tabs,
            discard_tab_changes,
            save_and_prepare_exit,
            restore_session,
            reorder_tabs,
            get_zoom,
            set_zoom,
            set_word_wrap,
            set_show_line_numbers,
            set_editor_bg,
            show_window,
            take_startup_files,
            tick_autosave,
            set_locale,
            get_disk_content,
            get_tab_content,
            open_diff_window,
            get_diff_payload,
            close_diff_window,
            apply_disk_version,
            rename_tab_file,
            read_dir,
            get_recent_files,
            set_record_recent_files,
            clear_recent_files,
            remove_recent_file,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            match event {
                #[cfg(target_os = "macos")]
                tauri::RunEvent::Opened { urls } => {
                    use tauri::Emitter;
                    let paths: Vec<String> = urls
                        .into_iter()
                        .filter_map(|url| url.to_file_path().ok())
                        .map(|p| p.to_string_lossy().into_owned())
                        .collect();

                    if !paths.is_empty() {
                        // 冷启动：存入状态供前端 take
                        if let Some(state) = app_handle.try_state::<AppState>() {
                            if let Ok(mut files) = state.startup_files.lock() {
                                files.extend(paths.clone());
                            }
                        }
                        // 热启动：发事件给前端
                        let _ = app_handle.emit("single-instance-files", paths);
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.set_focus();
                            let _ = window.unminimize();
                        }
                    }
                }

                // ★ 新增：拦截系统级退出（包括 macOS 的 Cmd+Q 和 Windows 的强制退出）
                tauri::RunEvent::ExitRequested { api, .. } => {
                    use std::sync::atomic::Ordering;

                    if let Some(state) = app_handle.try_state::<AppState>() {
                        // 如果已经在退出流程中，直接放行，防止死循环
                        if state.is_exiting.load(Ordering::Relaxed) {
                            return;
                        }

                        // 标记为正在退出
                        state.is_exiting.store(true, Ordering::Relaxed);

                        // 阻止本次默认退出，给我们时间保存
                        api.prevent_exit();

                        // 执行兜底保存
                        if let Err(e) = app::do_save_session(&app_handle, &state) {
                            eprintln!("退出时保存会话失败: {}", e);
                        }

                        // 保存完毕后，彻底退出进程
                        std::process::exit(0);
                    }
                }

                _ => {}
            }
        });
}
