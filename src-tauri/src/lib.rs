mod app;
mod io;
mod model;

use app::{
    apply_disk_version, check_file_sizes, check_tab_full_state, check_tab_state, close_diff_window,
    close_tab, discard_tab_changes, get_diff_payload, get_disk_content, get_large_dirty_tabs,
    get_tab_content, get_tab_path, get_workspace_state, get_zoom, load_pending_tab, new_tab,
    open_diff_window, open_files, reload_tab, rename_tab_file, reorder_tabs, restore_session,
    save_active_file, save_active_file_as, save_and_prepare_exit, set_editor_bg, set_locale,
    set_show_line_numbers, set_word_wrap, set_zoom, show_window, switch_tab, take_startup_files,
    tick_autosave, update_active_text, AppState,
};
use model::Workspace;
use std::sync::Mutex;
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
<<<<<<< HEAD
        .plugin(tauri_plugin_http::init())
=======
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(AppState {
            workspace: Mutex::new(Workspace::new()),
            session_dirty: std::sync::atomic::AtomicBool::new(false),
            last_medium_cache_time: std::sync::atomic::AtomicU64::new(0),
            startup_files: Mutex::new(startup_files),
            diff_payload: Mutex::new(None),
        })
        .setup(|app| {
            use tauri::Manager;
            // macOS 保持系统装饰（未来再适配）
            #[cfg(target_os = "macos")]
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_decorations(true);
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
            rename_tab_file
        ])
<<<<<<< HEAD
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Opened { urls } = event {
                use tauri::Emitter;
                use tauri::Manager;

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
        });
=======
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
}
