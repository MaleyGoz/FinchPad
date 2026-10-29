//! Tauri IPC 命令层。
//! 只保留"业务操作 → 命令函数"的映射。
//! 前端通过 `invoke('命令名', { 参数 })` 调用。

use crate::model::Workspace;
use std::sync::Mutex;

pub struct AppState {
    pub workspace: Mutex<Workspace>,
    pub session_dirty: std::sync::atomic::AtomicBool,
    pub last_medium_cache_time: std::sync::atomic::AtomicU64,
    pub startup_files: Mutex<Vec<String>>,
    /// 对比窗口的数据载荷（主窗口设置，对比窗口读取）
    pub diff_payload: Mutex<Option<DiffPayload>>,
    // ★ 新增：用于存储多个大文件窗口对应的文件路径（窗口ID -> 路径）
    pub large_file_paths: Mutex<std::collections::HashMap<String, String>>,
    // ★ 新增：防止退出时死循环的标志
    pub is_exiting: std::sync::atomic::AtomicBool,
    // ★ 新增：实时缓存的窗口物理状态（只存内存，不写磁盘）
    pub last_window_size: Mutex<Option<(f32, f32)>>,
    pub last_window_pos: Mutex<Option<(f32, f32)>>,
}

impl AppState {
    pub fn mark_session_dirty(&self) {
        self.session_dirty
            .store(true, std::sync::atomic::Ordering::Relaxed);
    }
}

/// 前端能看到的"工作区快照"。所有 IPC 返回的数据都走这个结构。
#[derive(serde::Serialize)]
pub struct WorkspaceSnapshot {
    pub tab_titles: Vec<String>,
    pub active_index: i32,
    pub active_text: String,
    // ---- 新增：状态栏字段 ----
    pub line_count: i32,
    pub char_count: i32,
    pub encoding: String,
    pub line_ending: String,
    pub is_dirty: bool,
    /// 另存为对话框的默认路径：
    ///   - 有 file_path 的标签 → 完整路径（定位到原目录、文件名预填）
    ///   - 未命名标签 → "未命名1.txt"（只预填文件名）
    pub default_save_path: String,
    pub is_unnamed: bool,
    /// Monaco 语言 id（用于语法高亮）
    pub language_id: String,
    /// 当前文件字节大小
    pub file_size: u64,
    /// 是否为大文件（> 100MB），前端需要弹窗提示
    pub large_file: bool,
    pub is_pending_load: bool,
    pub tab_dirty_states: Vec<bool>,
    pub tab_unnamed_states: Vec<bool>,
    // 是否是pending状态
    pub tab_pending_states: Vec<bool>,
    /// 每个标签的唯一 id（用于前端记录"已问过"状态）
    pub tab_ids: Vec<String>,
    /// 每个标签的完整文件路径（未命名标签为空字符串）
    pub tab_paths: Vec<String>,
    /// 当前激活标签的磁盘状态："normal" / "modified" / "deleted" / "unreachable"
    pub disk_state: String,
    /// 编辑器缩放百分比（50 ~ 400）
    pub zoom: i32,
    /// 编辑器自动换行（全局）
    pub word_wrap: bool,
    /// 用户的语言选择（"auto" / "zh-CN" / "en-US"）
    pub locale_choice: String,
    /// 是否显示行号（全局）
    pub show_line_numbers: bool,
    /// 编辑区背景主题名
    pub editor_bg: String,
    /// 最近使用的目录（用于打开/另存为对话框的默认目录）
    pub last_used_path: String,
    pub record_recent_files: bool,
    pub has_closed_tabs: bool,
}

// 编辑区域
#[tauri::command]
pub fn get_workspace_state(state: tauri::State<AppState>) -> Result<WorkspaceSnapshot, String> {
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    Ok(snapshot_from_workspace(&ws))
}

// 新建标签
#[tauri::command]
pub fn new_tab(state: tauri::State<AppState>) -> Result<i32, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.new_tab();
    state.mark_session_dirty();
    Ok(ws.active_index() as i32)
}

// 刷新
#[tauri::command]
pub fn update_active_text(state: tauri::State<AppState>, text: String) -> Result<bool, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.active_tab_mut();

    // ★ 关键修复：强制将前端传来的文本规范化，确保内存里永远是纯 \n
    let normalized_text = crate::io::line_ending::normalize(&text);
    tab.buffer = crate::model::TextBuffer::from_str(&normalized_text);

    // ★ 用 saved_hash 判定真实脏状态，而不是无条件 mark_dirty
    tab.is_dirty = tab.is_content_dirty();
    let (lines, chars) = crate::model::tab::count_text(&text);
    tab.line_count = lines;
    tab.char_count = chars;
    tab.cache_stale = true;
    state.mark_session_dirty();
    Ok(tab.is_dirty) // ★ 返回真实脏状态给前端
}

// 切换标签
#[tauri::command]
pub fn switch_tab(state: tauri::State<AppState>, index: i32) -> Result<(), String> {
    if index < 0 {
        return Err("无效的标签索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.switch_to(index as usize);
    state.mark_session_dirty();
    Ok(())
}

// 关闭标签
#[tauri::command]
pub fn close_tab(state: tauri::State<AppState>, index: i32) -> Result<(), String> {
    if index < 0 {
        return Err("无效的标签索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;

    // ★ 核心修改：推入 Workspace 的栈中
    if let Some(tab) = ws.tab(index as usize) {
        if let Some(path) = &tab.file_path {
            let path_str = path.to_string_lossy().into_owned();
            ws.add_closed_tab(path_str);
        }
    }

    let tab_id = ws.tab(index as usize).map(|t| t.id.clone());
    ws.close_tab(index as usize);
    if let Some(id) = tab_id {
        crate::io::session::remove_cache(&id);
    }
    state.mark_session_dirty();
    Ok(())
}
// ============ 打开 / 保存 ============
fn default_save_path_for(ws: &crate::model::Workspace, index: usize) -> String {
    if let Some(tab) = ws.tab(index) {
        if let Some(p) = &tab.file_path {
            return p.to_string_lossy().into_owned();
        }
        let file_name = format!("{}.txt", tab.title);
        if let Some(dir) = ws.last_used_path() {
            return dir.join(&file_name).to_string_lossy().into_owned();
        }
        return file_name;
    }
    "未命名.txt".to_string()
}

/// 判断逻辑坐标 (x, y) 是否落在任意一个显示器的工作区内
fn is_position_visible(window: &tauri::WebviewWindow, x: f32, y: f32) -> bool {
    let Ok(monitors) = window.available_monitors() else {
        return false;
    };
    for m in monitors {
        let pos = m.position();
        let size = m.size();
        let scale = m.scale_factor();
        let m_left = pos.x as f32 / scale as f32;
        let m_top = pos.y as f32 / scale as f32;
        let m_right = m_left + size.width as f32 / scale as f32;
        let m_bottom = m_top + size.height as f32 / scale as f32;
        if x >= m_left && x < m_right && y >= m_top && y < m_bottom {
            return true;
        }
    }
    false
}

/// 计算一个标签的磁盘状态字符串
fn disk_state_string(tab: &crate::model::Tab) -> String {
    let Some(path) = tab.file_path.as_deref() else {
        return "normal".to_string();
    };
    match std::fs::metadata(path) {
        Ok(m) => {
            let now = m.modified().ok();
            if tab.last_known_mtime.is_some() && tab.last_known_mtime != now {
                "modified".to_string()
            } else {
                "normal".to_string()
            }
        }
        Err(_) => {
            // 文件不存在，检查父目录
            if path.parent().map(|p| p.exists()).unwrap_or(false) {
                "deleted".to_string()
            } else {
                "unreachable".to_string()
            }
        }
    }
}

fn snapshot_from_workspace(ws: &crate::model::Workspace) -> WorkspaceSnapshot {
    let tab = ws.active_tab();

    // 获取文件大小（未命名标签为 0）
    let file_size = tab
        .file_path
        .as_ref()
        .and_then(|p| std::fs::metadata(p).ok())
        .map(|m| m.len())
        .unwrap_or(0);

    // 大文件（> 5MB）强制 plaintext，避免高亮卡顿
    let language_id = if file_size > 5 * 1024 * 1024 {
        "plaintext".to_string()
    } else {
        tab.file_path
            .as_deref()
            .map(ext_to_language)
            .unwrap_or("plaintext")
            .to_string()
    };

    WorkspaceSnapshot {
        tab_titles: ws.tab_titles(),
        active_index: ws.active_index() as i32,
        active_text: tab.buffer.to_string(),
        line_count: tab.line_count as i32,
        char_count: tab.char_count as i32,
        encoding: tab.encoding.name().to_string(),
        line_ending: tab.line_ending.name().to_string(),

        // ★ 修复：Pending 状态下强制干净，强制磁盘状态为 normal，不读真实磁盘
        is_dirty: if tab.is_pending_load {
            false
        } else {
            tab.is_content_dirty()
        },

        is_unnamed: tab.file_path.is_none(),
        default_save_path: default_save_path_for(ws, ws.active_index()),
        language_id,
        file_size,
        large_file: file_size >= LARGE_FILE_THRESHOLD,
        is_pending_load: tab.is_pending_load,
        tab_dirty_states: ws.tabs().iter().map(|t| t.is_content_dirty()).collect(),
        tab_unnamed_states: ws.tabs().iter().map(|t| t.file_path.is_none()).collect(),
        tab_pending_states: ws.tabs().iter().map(|t| t.is_pending_load).collect(),
        tab_ids: ws.tabs().iter().map(|t| t.id.clone()).collect(),
        tab_paths: ws
            .tabs()
            .iter()
            .map(|t| {
                t.file_path
                    .as_ref()
                    .map(|p| p.to_string_lossy().into_owned())
                    .unwrap_or_default()
            })
            .collect(),

        disk_state: if tab.is_pending_load {
            "normal".to_string()
        } else {
            disk_state_string(&ws.active_tab())
        },

        zoom: ws.zoom(),
        word_wrap: ws.word_wrap(),
        locale_choice: ws.locale_choice().to_string(),
        show_line_numbers: ws.show_line_numbers(),
        editor_bg: ws.editor_bg().to_string(),
        last_used_path: ws
            .last_used_path()
            .map(|p| p.to_string_lossy().into_owned())
            .unwrap_or_default(),
        record_recent_files: ws.record_recent_files(),
        has_closed_tabs: ws.has_closed_tabs(),
    }
}

/// 实时计算当前已加载标签的总字节数（懒加载标签算 0）
fn total_loaded_bytes(ws: &crate::model::Workspace) -> u64 {
    ws.tabs()
        .iter()
        .filter(|t| !t.is_pending_load)
        .map(|t| t.file_size)
        .sum()
}

/// 打开一批文件（路径由前端对话框插件提供）
#[tauri::command]
pub fn open_files(
    state: tauri::State<AppState>,
    paths: Vec<String>,
) -> Result<WorkspaceSnapshot, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;

    // 1. 收集每个文件的路径、大小、原始顺序索引
    let files: Vec<(String, u64)> = paths
        .iter()
        .map(|p| {
            let size = std::fs::metadata(p).map(|m| m.len()).unwrap_or(0);
            (p.clone(), size)
        })
        .collect();

    // 2. 按大小排序，决定每个文件是否懒加载
    let mut order: Vec<usize> = (0..files.len()).collect();
    order.sort_by_key(|&i| files[i].1);

    let mut lazy_flags = vec![false; files.len()];
    let mut total = total_loaded_bytes(&ws);

    for &i in &order {
        let size = files[i].1;
        if size >= LARGE_FILE_THRESHOLD {
            // 单文件超大 → 懒加载
            lazy_flags[i] = true;
        } else if size < SMALL_FILE_THRESHOLD {
            // 小文件豁免 → 无条件加载
            lazy_flags[i] = false;
            total += size;
        } else if total + size > TOTAL_LOADED_THRESHOLD {
            // 累计超总阈值 → 懒加载
            lazy_flags[i] = true;
        } else {
            lazy_flags[i] = false;
            total += size;
        }
    }

    // 3. 按原始顺序执行加载
    for (i, (path_str, size)) in files.iter().enumerate() {
        let path = std::path::PathBuf::from(path_str);
        if lazy_flags[i] {
            ws.open_file_lazy(path, *size);
            // ★ 新增：懒加载的文件也算成功打开，记录到最近文件
            ws.add_recent_file(path_str.clone());
        } else {
            match crate::io::file::read_file(&path) {
                Ok((content, encoding, line_ending, mtime)) => {
                    ws.open_file(path, &content, encoding, line_ending, mtime);
                    let idx = ws.active_index();
                    if let Some(tab) = ws.tab_mut(idx) {
                        tab.file_size = *size;
                    }
                    // ★ 新增：读取成功的文件，记录到最近文件
                    ws.add_recent_file(path_str.clone());
                }
                Err(e) => eprintln!("打开失败 {path_str}: {e}"),
            }
        }
    }

    // 4. 记录最近打开的目录（只记录成功加载的文件，取最后一个）
    let mut last_dir: Option<std::path::PathBuf> = None;
    for (i, (path_str, _)) in files.iter().enumerate() {
        let path = std::path::PathBuf::from(path_str);

        // 沿用原逻辑：懒加载算成功，非懒加载判断文件是否存在
        let opened_ok = if lazy_flags[i] { true } else { path.exists() };

        if opened_ok {
            // ★ 不 break，持续覆盖，最终留下最后一个成功打开的目录
            last_dir = path.parent().map(|p| p.to_path_buf());
        }
    }
    if let Some(dir) = last_dir {
        ws.set_last_used_path(Some(dir));
    }

    // 5. 标记状态
    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

// 大文件占位标签
#[tauri::command]
pub fn load_pending_tab(
    state: tauri::State<AppState>,
    index: i32,
) -> Result<WorkspaceSnapshot, String> {
    if index < 0 {
        return Err("无效的标签索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let i = index as usize;

    let path = ws
        .tab(i)
        .and_then(|t| t.file_path.clone())
        .ok_or("标签无效或未关联文件")?;

    let (content, encoding, line_ending, mtime) =
        crate::io::file::read_file(&path).map_err(|e| e.to_string())?;

    if let Some(tab) = ws.tab_mut(i) {
        tab.buffer = crate::model::TextBuffer::from_str(&content);
        tab.encoding = encoding;
        tab.line_ending = line_ending;
        tab.last_known_mtime = Some(mtime);
        let (lines, chars) = crate::model::tab::count_text(&content);
        tab.line_count = lines;
        tab.char_count = chars;
        tab.is_pending_load = false;
        tab.is_dirty = false;
        // 更新 saved_hash 让它"干净"
        tab.mark_saved(mtime);
    }
    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

/// 保存
#[tauri::command]
pub fn save_active_file(state: tauri::State<AppState>) -> Result<WorkspaceSnapshot, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let idx = ws.active_index();

    if ws.tab(idx).map_or(true, |t| t.is_pending_load) {
        return Err("PendingLoadCannotSave".to_string());
    }

    // 未命名 → 让前端走另存为
    if ws.tab(idx).map_or(true, |t| t.file_path.is_none()) {
        return Err("NeedsSaveAs".to_string());
    }

    // ★ 新增：检查磁盘状态，若不可达或被删除，强制走另存为
    if let Some(tab) = ws.tab(idx) {
        let state_str = disk_state_string(tab);
        if state_str == "unreachable" || state_str == "deleted" {
            return Err("NeedsSaveAs".to_string());
        }
    }

    let (path, content, encoding, line_ending) = {
        let tab = ws.tab(idx).ok_or("标签无效")?;
        (
            tab.file_path.clone().unwrap(),
            tab.buffer.to_string(),
            tab.encoding,
            tab.line_ending,
        )
    };

    let new_mtime = crate::io::file::write_file(&path, &content, encoding, line_ending)
        .map_err(|e| e.to_string())?;

    if let Some(tab) = ws.tab_mut(idx) {
        tab.mark_saved(new_mtime);
    }
    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

/// 另存为
#[tauri::command]
pub fn save_active_file_as(
    state: tauri::State<AppState>,
    path: String,
) -> Result<WorkspaceSnapshot, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let idx = ws.active_index();
    let path_buf = std::path::PathBuf::from(&path);

    if ws.tab(idx).map_or(true, |t| t.is_pending_load) {
        return Err("PendingLoadCannotSave".to_string());
    }

    if ws.save_path_conflict(idx, &path_buf) {
        // ★ 返回标准错误码，方便前端识别并做多语言提示
        return Err("FileAlreadyOpen".to_string());
    }

    let (content, encoding, line_ending) = {
        let tab = ws.tab(idx).ok_or("标签无效")?;
        (tab.buffer.to_string(), tab.encoding, tab.line_ending)
    };

    let new_mtime = crate::io::file::write_file(&path_buf, &content, encoding, line_ending)
        .map_err(|e| e.to_string())?;
    // ★ 新增：另存为成功后，记录新路径到最近文件
    ws.add_recent_file(path.clone());
    let title = path_buf
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "未命名".to_string());

    // ★ 记录最近另存为的目录（必须在 path_buf 被 move 之前）
    if let Some(parent) = path_buf.parent() {
        ws.set_last_used_path(Some(parent.to_path_buf()));
    }
    if let Some(tab) = ws.tab_mut(idx) {
        tab.file_path = Some(path_buf);
        tab.title = title;
        tab.mark_saved(new_mtime);
    }
    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

/// 重命名已打开的标签及其对应的物理文件
#[tauri::command]
pub fn rename_tab_file(
    state: tauri::State<AppState>,
    index: i32,
    new_name: String,
) -> Result<WorkspaceSnapshot, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let idx = index as usize;

    let tab = ws.tab(idx).ok_or("标签无效")?;
    let old_path = tab.file_path.clone().ok_or("未命名标签无法重命名")?;
    let parent = old_path.parent().ok_or("无法获取父目录")?;

    let new_path = parent.join(&new_name);

    // 如果新路径和旧路径一样，直接返回
    if new_path == old_path {
        return Ok(snapshot_from_workspace(&ws));
    }

    // 检查目标文件是否已存在（防覆盖）
    if new_path.exists() {
        return Err("FileExists".to_string());
    }

    // 执行物理重命名
    std::fs::rename(&old_path, &new_path).map_err(|e| format!("RenameFailed: {}", e))?;

    // 更新内存中的 Tab 状态
    if let Some(tab) = ws.tab_mut(idx) {
        tab.file_path = Some(new_path);
        tab.title = new_name;
        if let Ok(m) = std::fs::metadata(tab.file_path.as_ref().unwrap()) {
            tab.file_size = m.len();
            tab.last_known_mtime = m.modified().ok();
        }
        tab.cache_stale = true;
    }

    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

/// 根据文件扩展名推断 Monaco 语言 id。
/// 未知扩展名、无扩展名、.txt 都返回 "plaintext"。
fn ext_to_language(path: &std::path::Path) -> &'static str {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();
    match ext.as_str() {
        "rs" => "rust",
        "py" => "python",
        "js" | "mjs" | "cjs" => "javascript",
        "ts" | "tsx" => "typescript",
        "json" => "json",
        "md" | "markdown" => "markdown",
        "html" | "htm" => "html",
        "css" => "css",
        "yaml" | "yml" => "yaml",
        "toml" => "toml",
        "ini" | "conf" | "cfg" => "ini",
        "sh" | "bash" => "shell",
        "bat" | "cmd" => "bat",
        "xml" => "xml",
        "sql" => "sql",
        "c" | "h" => "c",
        "cpp" | "cc" | "cxx" | "hpp" => "cpp",
        "java" => "java",
        "go" => "go",
        "lua" => "lua",
        "php" => "php",
        "rb" => "ruby",
        "swift" => "swift",
        _ => "plaintext",
    }
}

/// 大文件提示阈值：50MB
/// 超过这个大小的文件，打开前会弹窗询问用户。
pub const LARGE_FILE_THRESHOLD: u64 = 50 * 1024 * 1024;
/// 小文件豁免阈值：< 1MB 无条件加载
pub const SMALL_FILE_THRESHOLD: u64 = 1024 * 1024;
/// 总加载量阈值：已加载标签累计超过 50MB 时，新文件走懒加载
pub const TOTAL_LOADED_THRESHOLD: u64 = 50 * 1024 * 1024;
/// 中等文件阈值：10MB。10-50MB 的脏标签每 60 秒才写 cache。
pub const MEDIUM_FILE_THRESHOLD: u64 = 10 * 1024 * 1024;

/// 检测指定标签的磁盘状态，返回字符串
#[tauri::command]
pub fn check_tab_state(state: tauri::State<AppState>, index: i32) -> Result<String, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.tab(index as usize).ok_or("标签无效")?;
    Ok(disk_state_string(tab))
}

/// 静默重载标签内容（用于干净 + Modified 场景）
#[tauri::command]
pub fn reload_tab(state: tauri::State<AppState>, index: i32) -> Result<WorkspaceSnapshot, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let i = index as usize;

    let path = ws
        .tab(i)
        .and_then(|t| t.file_path.clone())
        .ok_or("标签无关联文件")?;

    let (content, encoding, line_ending, mtime) =
        crate::io::file::read_file(&path).map_err(|e| e.to_string())?;

    if let Some(tab) = ws.tab_mut(i) {
        tab.buffer = crate::model::TextBuffer::from_str(&content);
        tab.encoding = encoding;
        tab.line_ending = line_ending;
        let (lines, chars) = crate::model::tab::count_text(&content);
        tab.line_count = lines;
        tab.char_count = chars;
        tab.mark_saved(mtime);
    }
    state.mark_session_dirty();
    Ok(snapshot_from_workspace(&ws))
}

#[derive(serde::Serialize)]
pub struct TabFullState {
    pub disk_state: String,
    pub is_dirty: bool,
    /// ★ 新增：磁盘文件的修改时间（秒级 Unix 时间戳），用于前端判断"外部是否又改了"
    pub disk_mtime: Option<u64>,
}

/// 只读命令：查询某个标签的磁盘状态和真实脏状态，不返回内容。
/// 用途：外部变化检测时用，避免刷新 snapshot 覆盖 Monaco 的输入。
#[tauri::command]
pub fn check_tab_full_state(
    state: tauri::State<AppState>,
    index: i32,
) -> Result<TabFullState, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.tab(index as usize).ok_or("标签无效")?;

    // ★ 新增：读取磁盘文件的 mtime（秒级时间戳）
    let disk_mtime = tab.file_path.as_deref().and_then(|path| {
        std::fs::metadata(path)
            .ok()
            .and_then(|m| m.modified().ok())
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs())
    });

    Ok(TabFullState {
        disk_state: disk_state_string(tab),
        is_dirty: tab.is_content_dirty(),
        disk_mtime,
    })
}

/// 获取指定标签的文件绝对路径（未命名返回空字符串）
#[tauri::command]
pub fn get_tab_path(state: tauri::State<AppState>, index: i32) -> Result<String, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.tab(index as usize).ok_or("标签无效")?;
    Ok(tab
        .file_path
        .as_ref()
        .map(|p| p.to_string_lossy().into_owned())
        .unwrap_or_default())
}

// ============ 关闭窗口 ============

/// 返回所有"脏 + 有内容 + 大小 ≥ 50MB"的标签 id
#[tauri::command]
pub fn get_large_dirty_tabs(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let ids: Vec<String> = ws
        .tabs()
        .iter()
        .filter(|t| {
            !t.is_pending_load && t.is_content_dirty() && t.file_size >= LARGE_FILE_THRESHOLD
        })
        .map(|t| t.id.clone())
        .collect();
    Ok(ids)
}

/// 丢弃指定标签的未保存修改（用户选"不保存"时调用）
#[tauri::command]
pub fn discard_tab_changes(state: tauri::State<AppState>, index: i32) -> Result<(), String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    if let Some(tab) = ws.tab_mut(index as usize) {
        tab.is_dirty = false;
    }
    state.mark_session_dirty();
    Ok(())
}

/// 纯 Rust 端调用的保存会话逻辑（不退出应用），供前端和系统退出共用
pub fn do_save_session(app: &tauri::AppHandle, state: &AppState) -> Result<(), String> {
    use tauri::Manager;

    // 1. 写缓存和构建 session
    let mut keep_ids: Vec<String> = Vec::new();
    let mut session = {
        let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;

        for tab in ws.tabs_mut().iter_mut() {
            if tab.is_pending_load {
                continue;
            }
            if tab.file_size >= LARGE_FILE_THRESHOLD {
                continue;
            }

            keep_ids.push(tab.id.clone());
            if !tab.cache_stale {
                continue;
            }

            let content = tab.buffer.to_string();
            if crate::io::session::write_cache(&tab.id, &content).is_ok() {
                tab.cache_stale = false;
            }
        }
        build_session_from_ws(&ws)
    };

    crate::io::session::cleanup_orphan_cache(&keep_ids);

    // 2. 优先从内存中读取实时缓存的窗口信息（完美解决 Cmd+Q 拿不到窗口的痛点）
    let mut size_updated = false;
    let mut pos_updated = false;

    if let Ok(s) = state.last_window_size.lock() {
        if let Some((w, h)) = *s {
            session.window.width = w;
            session.window.height = h;
            size_updated = true;
        }
    }
    if let Ok(p) = state.last_window_pos.lock() {
        if let Some((x, y)) = *p {
            session.window.x = x;
            session.window.y = y;
            pos_updated = true;
        }
    }

    // 兜底：如果内存里没有（比如第一次启动没拖动过），再去从当前窗口获取一次
    if !size_updated || !pos_updated {
        if let Some(window) = app.get_webview_window("main") {
            if let Ok(scale) = window.scale_factor() {
                if !size_updated {
                    if let Ok(size) = window.inner_size() {
                        // ★ 改用 inner_size 规避 Mac 偏差
                        session.window.width = size.width as f32 / scale as f32;
                        session.window.height = size.height as f32 / scale as f32;
                    }
                }
                if !pos_updated {
                    if let Ok(pos) = window.inner_position() {
                        // ★ 改用 inner_position
                        session.window.x = pos.x as f32 / scale as f32;
                        session.window.y = pos.y as f32 / scale as f32;
                    }
                }
            }
        }
    }

    // 更新 last_used_path
    {
        let ws = state.workspace.lock().map_err(|e| e.to_string())?;
        session.window.last_used_path = ws.last_used_path().cloned();
    }

    if let Err(e) = crate::io::session::save(&session) {
        eprintln!("写 session 失败：{e}");
    }

    Ok(())
}

/// 前端关闭窗口时调用的命令
#[tauri::command]
pub fn save_and_prepare_exit(
    app: tauri::AppHandle,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    do_save_session(&app, &state)?;
    app.exit(0);
    Ok(())
}

fn build_session_from_ws(ws: &crate::model::Workspace) -> crate::io::session::Session {
    let mut session = crate::io::session::Session::new();

    for tab in ws.tabs().iter() {
        // 空的未命名标签跳过
        if tab.file_path.is_none() && tab.buffer.is_empty() && !tab.is_content_dirty() {
            continue;
        }
        session.tabs.push(crate::io::session::TabSession {
            id: tab.id.clone(),
            title: tab.title.clone(),
            path: tab.file_path.clone(),
            encoding: tab.encoding.name().to_string(),
            line_ending: tab.line_ending.name().to_string(),
            is_dirty: tab.is_content_dirty(),
            cursor_line: tab.cursor_line,
            cursor_column: tab.cursor_column,
            // ★ 新增：转成秒级时间戳保存
            last_known_mtime: tab.last_known_mtime.and_then(|t| {
                t.duration_since(std::time::UNIX_EPOCH)
                    .ok()
                    .map(|d| d.as_secs())
            }),
        });
    }

    session.active_index = if session.tabs.is_empty() {
        0
    } else {
        ws.active_index().min(session.tabs.len() - 1)
    };

    // ★ 关键修复：无条件填充所有 window 字段
    session.window.zoom = ws.zoom();
    session.window.word_wrap = ws.word_wrap();
    session.window.show_line_numbers = ws.show_line_numbers();
    session.window.editor_bg = ws.editor_bg().to_string();
    session.window.locale_choice = ws.locale_choice().to_string();
    // ★ 新增：把最近文件存入 session
    session.recent_files = ws.recent_files().to_vec();
    session.window.record_recent_files = ws.record_recent_files();

    session
}
// ============ 会话恢复 ============
/// 启动时恢复上次会话。返回 None 表示没有可恢复的 session。
#[tauri::command]
pub fn restore_session(
    app: tauri::AppHandle,
    state: tauri::State<AppState>,
) -> Result<Option<WorkspaceSnapshot>, String> {
    use tauri::Manager;

    let Some(session) = crate::io::session::load() else {
        return Ok(None);
    };

    // 1. 逐个恢复标签
    let mut tabs: Vec<crate::model::Tab> = Vec::new();
    let mut old_to_new: Vec<Option<usize>> = Vec::with_capacity(session.tabs.len());

    for ts in &session.tabs {
        if let Some(tab) = restore_one_tab(ts) {
            old_to_new.push(Some(tabs.len()));
            tabs.push(tab);
        } else {
            old_to_new.push(None);
        }
    }

    // 2. 计算新的 active_index
    let new_active = if session.active_index < old_to_new.len() {
        old_to_new[session.active_index]
            .or_else(|| {
                // 原激活标签被丢弃 → 找最近的有效索引
                (0..session.active_index)
                    .rev()
                    .find_map(|i| old_to_new.get(i).copied().flatten())
            })
            .unwrap_or(0)
    } else {
        0
    };

    // 3. 替换 workspace
    {
        let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
        ws.restore(tabs, new_active);
        ws.set_zoom(session.window.zoom);
        // ★ 新增：恢复最近文件
        ws.set_recent_files(session.recent_files.clone());

        ws.set_word_wrap(session.window.word_wrap);
        ws.set_show_line_numbers(session.window.show_line_numbers);
        ws.set_editor_bg(session.window.editor_bg.clone());
        ws.locale_choice_restore(session.window.locale_choice.clone());
        ws.set_last_used_path(session.window.last_used_path.clone()); // ★ 新增
        ws.set_record_recent_files(session.window.record_recent_files);
    }

    // 4. 恢复窗口大小和位置
    if let Some(window) = app.get_webview_window("main") {
        let mut w = session.window.width;
        let mut h = session.window.height;

        // ★ 核心防御 1：如果宽高异常（比如被 dev 模式写成了 1x1），强制重置为默认的 800x600
        if w < 400.0 || h < 300.0 {
            w = 800.0;
            h = 600.0;
        }

        let _ = window.set_size(tauri::LogicalSize::new(w, h));

        let x = session.window.x;
        let y = session.window.y;
        // ★ 核心防御 2：坐标也不能是极端的负数
        if x >= 0.0 && y >= 0.0 {
            if is_position_visible(&window, x, y) {
                let _ = window.set_position(tauri::LogicalPosition::new(x, y));
            } else {
                let _ = window.center();
            }
        }
    }

    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    Ok(Some(snapshot_from_workspace(&ws)))
}

/// 处理恢复时的冲突裁决（比对缓存与磁盘内容），并更新 Tab 的状态。
/// 返回值：无。直接修改传入的 tab。
fn resolve_restore_state(
    tab: &mut crate::model::Tab,
    ts: &crate::io::session::TabSession,
    cached_content: &str,
    disk_text: &str,
    disk_mtime: Option<std::time::SystemTime>,
) {
    use crate::model::tab::count_text;
    use crate::model::TextBuffer;

    let cached_hash = crate::model::Tab::hash_of(cached_content);
    let disk_hash = crate::model::Tab::hash_of(disk_text);

    if cached_hash != disk_hash {
        // ★ 绝对真理：只要内容不一样，无论是谁改的，绝对不覆盖 buffer，强行标脏！
        tab.is_dirty = true;
        tab.saved_hash = disk_hash;

        let current_mtime_sec = disk_mtime.and_then(|t| {
            t.duration_since(std::time::UNIX_EPOCH)
                .ok()
                .map(|d| d.as_secs())
        });

        let is_time_changed = match (ts.last_known_mtime, current_mtime_sec) {
            (Some(old_mt), Some(new_mt)) => old_mt != new_mt,
            _ => false,
        };

        if is_time_changed {
            // 正常情况：外部改了文件，时间也变了。保留旧时间触发前端 modified 弹窗
            tab.last_known_mtime = ts.last_known_mtime.and_then(|sec| {
                std::time::UNIX_EPOCH.checked_add(std::time::Duration::from_secs(sec))
            });
        } else {
            // 极端情况：内容变了，但 mtime 没变。强制设为旧时间以触发弹窗
            tab.last_known_mtime = Some(std::time::UNIX_EPOCH);
        }
    } else {
        // ★ 内容完全一致（只是假脏）：信任 session 状态，直接用磁盘内容覆盖 buffer
        tab.is_dirty = ts.is_dirty;
        if let Some(mt) = disk_mtime {
            tab.last_known_mtime = Some(mt);
        }

        // 强制抛弃缓存中的格式差异，用磁盘内容重建 buffer
        tab.buffer = TextBuffer::from_str(disk_text);
        let (lines, chars) = count_text(disk_text);
        tab.line_count = lines;
        tab.char_count = chars;
        tab.saved_hash = disk_hash;
    }
}

/// 从 TabSession 恢复单个标签。返回 None 表示该标签应被丢弃。
fn restore_one_tab(ts: &crate::io::session::TabSession) -> Option<crate::model::Tab> {
    use crate::io::{encoding::TextEncoding, line_ending::LineEnding};
    use crate::model::{tab::count_text, Tab, TextBuffer};

    let encoding = TextEncoding::from_name(&ts.encoding);
    let line_ending = LineEnding::from_name(&ts.line_ending);

    // ---- 情况 1：有缓存 → 从缓存恢复内容 ----
    if let Some(content) = crate::io::session::read_cache(&ts.id) {
        let mut tab = Tab::new_blank(ts.title.clone());
        tab.id = ts.id.clone();
        tab.file_path = ts.path.clone();
        tab.title = ts.title.clone();
        tab.encoding = encoding;
        tab.line_ending = line_ending;
        tab.buffer = TextBuffer::from_str(&content);
        let (lines, chars) = count_text(&content);
        tab.line_count = lines;
        tab.char_count = chars;
        tab.cursor_line = ts.cursor_line;
        tab.cursor_column = ts.cursor_column;
        tab.is_pending_load = false;
        tab.cache_stale = true; // 恢复时，缓存刚落盘，标记为 stale 以便下次 tick 时能刷新 session 里的相关状态

        // 计算文件大小，并尝试读取磁盘（同时记录 mtime）
        let mut disk_content: Option<String> = None;
        let mut disk_mtime: Option<std::time::SystemTime> = None;

        if let Some(p) = ts.path.as_ref() {
            if let Ok(m) = std::fs::metadata(p) {
                tab.file_size = m.len();
            }
            if let Ok((c, _, _, mt)) = crate::io::file::read_file(p) {
                disk_content = Some(c);
                disk_mtime = Some(mt);
            }
        }

        match disk_content {
            Some(disk_text) => {
                resolve_restore_state(&mut tab, ts, &content, &disk_text, disk_mtime);
            }
            None => {
                // ★ 磁盘不可达（文件被删或U盘拔出）：内存里的缓存成了唯一火种，强制标脏，防止直接关闭丢失！
                tab.is_dirty = true;
            }
        }

        return Some(tab);
    }

    // ---- 情况 2：无缓存，必须有路径 ----
    let Some(path) = ts.path.clone() else {
        return None; // 无缓存 + 无路径 = 空未命名标签 → 丢弃
    };

    // 检查文件是否可达
    let Ok(m) = std::fs::metadata(&path) else {
        // 文件不可达且无缓存 → 直接丢弃标签（矩阵 v1.1 规定）
        return None;
    };
    let size = m.len();

    // 2a. 大文件 → pending 占位（懒加载，不读内容）
    if size >= LARGE_FILE_THRESHOLD {
        let mut tab = Tab::from_pending_file(path, size);
        tab.id = ts.id.clone();
        tab.title = ts.title.clone();
        tab.encoding = encoding;
        tab.line_ending = line_ending;
        return Some(tab);
    }

    // 2b. 小文件 → 从磁盘读
    match crate::io::file::read_file(&path) {
        Ok((content, actual_enc, actual_le, mtime)) => {
            let mut tab = Tab::from_file(path, &content, actual_enc, actual_le, mtime);
            tab.id = ts.id.clone();
            tab.title = ts.title.clone();
            tab.file_size = size;
            Some(tab)
        }
        Err(_) => None, // 读取失败（例如权限不足），直接丢弃
    }
}

// ============ Autosave ============
#[tauri::command]
pub fn tick_autosave(app: tauri::AppHandle, state: tauri::State<AppState>) -> Result<(), String> {
    use std::sync::atomic::Ordering;
    use std::time::{SystemTime, UNIX_EPOCH};

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let last_medium = state.last_medium_cache_time.load(Ordering::Relaxed);
    let do_medium = now.saturating_sub(last_medium) >= 60;

    // 1. 写脏标签的 cache
    {
        // ★ 修改点 1：添加 `mut`
        let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;

        // ★ 修改点 2：使用 tabs_mut().iter_mut()
        for tab in ws.tabs_mut().iter_mut() {
            if tab.is_pending_load {
                continue;
            }
            if !tab.cache_stale {
                continue; // 缓存未失效，直接跳过
            }

            let size = tab.file_size;
            if size >= LARGE_FILE_THRESHOLD {
                continue; // 大文件不缓存
            }
            let should_write = if size < MEDIUM_FILE_THRESHOLD {
                true // < 10MB：每次都写
            } else {
                do_medium // 10-50MB：每 60 秒写一次
            };

            if should_write {
                let content = tab.buffer.to_string();
                if crate::io::session::write_cache(&tab.id, &content).is_ok() {
                    // ★ 修改点 3：写入成功后，标记缓存有效
                    tab.cache_stale = false;
                }
            }
        }
    } // ★ 注意这个花括号，ws 在这里被释放，避免与后续代码发生死锁

    if do_medium {
        state.last_medium_cache_time.store(now, Ordering::Relaxed);
    }

    // 2. session 脏了就写
    if state.session_dirty.load(Ordering::Relaxed) {
        write_session_now(&app, &state)?;
        state.session_dirty.store(false, Ordering::Relaxed);
    }

    Ok(())
}

fn write_session_now(app: &tauri::AppHandle, state: &AppState) -> Result<(), String> {
    use tauri::Manager;
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let mut session = build_session_from_ws(&ws);
    session.window.last_used_path = ws.last_used_path().cloned();

    // ★ 替换开始：优先从内存读取窗口尺寸和位置
    let mut size_updated = false;
    let mut pos_updated = false;

    if let Ok(s) = state.last_window_size.lock() {
        if let Some((w, h)) = *s {
            session.window.width = w;
            session.window.height = h;
            size_updated = true;
        }
    }
    if let Ok(p) = state.last_window_pos.lock() {
        if let Some((x, y)) = *p {
            session.window.x = x;
            session.window.y = y;
            pos_updated = true;
        }
    }

    // 兜底：如果内存里没有（比如刚启动没动过），再去读当前窗口
    if !size_updated || !pos_updated {
        if let Some(window) = app.get_webview_window("main") {
            if let Ok(scale) = window.scale_factor() {
                if !size_updated {
                    if let Ok(size) = window.inner_size() {
                        session.window.width = size.width as f32 / scale as f32;
                        session.window.height = size.height as f32 / scale as f32;
                    }
                }
                if !pos_updated {
                    if let Ok(pos) = window.inner_position() {
                        session.window.x = pos.x as f32 / scale as f32;
                        session.window.y = pos.y as f32 / scale as f32;
                    }
                }
            }
        }
    }
    // ★ 替换结束

    crate::io::session::save(&session).map_err(|e| e.to_string())
}

// ============ 缩放 ============

#[tauri::command]
pub fn get_zoom(state: tauri::State<AppState>) -> Result<i32, String> {
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    Ok(ws.zoom())
}

#[tauri::command]
pub fn set_zoom(state: tauri::State<AppState>, zoom: i32) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_zoom(zoom);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

// 设置换行
#[tauri::command]
pub fn set_word_wrap(state: tauri::State<AppState>, value: bool) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_word_wrap(value);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

// 设置行号
#[tauri::command]
pub fn set_show_line_numbers(state: tauri::State<AppState>, value: bool) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_show_line_numbers(value);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

#[tauri::command]
pub fn set_editor_bg(
    app: tauri::AppHandle, // ★ 新增
    state: tauri::State<AppState>,
    value: String,
) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_editor_bg(value.clone()); // 拿到 value
    drop(ws);
    state.mark_session_dirty();

    use tauri::Emitter;
    // ★ 广播给所有窗口
    let _ = app.emit("broadcast-theme", value);

    Ok(())
}

// ============ 标签重排 ============

#[tauri::command]
pub fn reorder_tabs(state: tauri::State<AppState>, from: i32, to: i32) -> Result<(), String> {
    if from < 0 || to < 0 {
        return Err("无效索引".to_string());
    }
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.reorder_tabs(from as usize, to as usize);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

// ============ 窗口控制 ============
#[tauri::command]
pub fn show_window(window: tauri::Window) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())
}

// ============ 启动文件参数 ============
/// 读取并清空启动文件参数（前端只调用一次）
#[tauri::command]
pub fn take_startup_files(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let mut files = state.startup_files.lock().map_err(|e| e.to_string())?;
    let result = std::mem::take(&mut *files);
    Ok(result)
}

#[tauri::command]
pub fn set_locale(
    app: tauri::AppHandle,
    state: tauri::State<AppState>,
    locale: String,
    unnamed_template: String,
    locale_choice: String,
) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_locale(locale.clone(), unnamed_template, locale_choice); // 存真实的 locale
    drop(ws);
    state.mark_session_dirty();

    use tauri::Emitter;
    // ★ 广播真实的 locale (例如 "zh-CN" 或 "en-US")，而不是 "auto"
    let _ = app.emit("broadcast-locale", locale);

    Ok(())
}

/// 读取指定标签对应文件的磁盘内容（用于冲突对比模式）
#[tauri::command]
pub fn get_disk_content(state: tauri::State<AppState>, index: i32) -> Result<String, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.tab(index as usize).ok_or("标签无效")?;
    let path = tab.file_path.clone().ok_or("标签无关联文件")?;

    let bytes = std::fs::read(&path).map_err(|e| e.to_string())?;
    let (content, _) = crate::io::encoding::decode(&bytes);
    Ok(crate::io::line_ending::normalize(&content))
}

/// 读取指定标签的内存内容（用于标签对比）
#[tauri::command]
pub fn get_tab_content(state: tauri::State<AppState>, index: i32) -> Result<String, String> {
    if index < 0 {
        return Err("无效索引".to_string());
    }
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    let tab = ws.tab(index as usize).ok_or("标签无效")?;
    Ok(tab.buffer.to_string())
}

// ============ 对比窗口 ============

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct DiffPayload {
    /// "tabs" = 两个标签对比；"disk" = 磁盘 vs 编辑器（冲突场景）
    pub mode: String,
    pub left_title: String,
    pub right_title: String,
    pub left_content: String,
    pub right_content: String,
    /// 仅 conflict 模式使用；-1 表示不适用
    pub conflict_idx: i32,
}

#[tauri::command]
pub async fn open_diff_window(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    payload: DiffPayload,
) -> Result<(), String> {
    use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

    // 读取当前主题、语言，作为 URL 参数传给对比窗口
    let (theme, locale) = {
        let ws = state.workspace.lock().map_err(|e| e.to_string())?;
        (ws.editor_bg().to_string(), ws.locale().to_string())
    };

    // 1. 存储 payload
    {
        let mut p = state.diff_payload.lock().map_err(|e| e.to_string())?;
        *p = Some(payload);
    }

    // 2. 如果窗口已存在，聚焦 + 通知刷新
    if let Some(existing) = app.get_webview_window("diff") {
        let _ = existing.set_focus();
        let _ = existing.unminimize();
        use tauri::Emitter;
        let _ = existing.emit("diff-payload-updated", ());
        return Ok(());
    }

    // 3. 创建新窗口

    let url = format!("/?mode=diff&theme={}&locale={}", theme, locale);
    let app_clone = app.clone();
    let window = WebviewWindowBuilder::new(&app, "diff", WebviewUrl::App(url.into()))
        .title("Compare")
        .inner_size(1200.0, 700.0)
        .min_inner_size(600.0, 400.0)
        // 根据当前主题强制切换原生标题栏颜色
        .theme(if theme == "dark" {
            Some(tauri::Theme::Dark)
        } else {
            Some(tauri::Theme::Light)
        })
        .decorations(false) // ★ 核心新增：去掉系统原生标题栏（Windows/Linux 彻底无边框）
        .build()
        .map_err(|e| e.to_string())?;

    // ★ 核心保留：如果是 macOS，恢复原生红绿灯，完美复刻主界面的沉浸体验
    #[cfg(target_os = "macos")]
    {
        let _ = window.set_decorations(true);
    }

    // 4. 窗口关闭时清除 payload
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::Destroyed = event {
            if let Some(state) = app_clone.try_state::<AppState>() {
                if let Ok(mut p) = state.diff_payload.lock() {
                    *p = None;
                }
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub fn get_diff_payload(state: tauri::State<'_, AppState>) -> Result<Option<DiffPayload>, String> {
    let p = state.diff_payload.lock().map_err(|e| e.to_string())?;
    Ok(p.clone())
}

#[tauri::command]
pub fn close_diff_window(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    use tauri::Manager;
    if let Some(w) = app.get_webview_window("diff") {
        let _ = w.close();
    }
    if let Ok(mut p) = state.diff_payload.lock() {
        *p = None;
    }
    Ok(())
}

/// 冲突场景下，把磁盘版本应用到指定标签，并通知主窗口刷新
#[tauri::command]
pub fn apply_disk_version(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    idx: i32,
) -> Result<(), String> {
    if idx < 0 {
        return Err("无效索引".to_string());
    }
    {
        let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
        let i = idx as usize;
        let path = ws
            .tab(i)
            .and_then(|t| t.file_path.clone())
            .ok_or("标签无关联文件")?;
        let (content, encoding, line_ending, mtime) =
            crate::io::file::read_file(&path).map_err(|e| e.to_string())?;
        if let Some(tab) = ws.tab_mut(i) {
            tab.buffer = crate::model::TextBuffer::from_str(&content);
            tab.encoding = encoding;
            tab.line_ending = line_ending;
            let (lines, chars) = crate::model::tab::count_text(&content);
            tab.line_count = lines;
            tab.char_count = chars;
            tab.mark_saved(mtime);
        }
    }

    use tauri::Emitter;
    let _ = app.emit_to("main", "workspace-updated", ());

    Ok(())
}

// ===========侧边栏功能相关开始================
#[derive(serde::Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}
/// 读取指定目录下的文件和文件夹，简单化处理，不判断隐藏属性
#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<FileEntry>, String> {
    let dir_path = std::path::Path::new(&path);
    if !dir_path.is_dir() {
        return Err("Not a directory".to_string());
    }

    let mut entries = Vec::new();
    if let Ok(read_dir) = std::fs::read_dir(dir_path) {
        for entry in read_dir.flatten() {
            // ★ 修正：使用 file_type() 替代 metadata()，性能更好
            if let Ok(file_type) = entry.file_type() {
                let file_name = entry.file_name().to_string_lossy().to_string();
                let file_path = entry.path().to_string_lossy().to_string();
                entries.push(FileEntry {
                    name: file_name,
                    path: file_path,
                    is_dir: file_type.is_dir(), // ★ 现在这里能匹配上了
                });
            }
        }
    }

    // 排序：文件夹优先，然后按名字排序（忽略大小写）
    entries.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        } else if a.is_dir {
            std::cmp::Ordering::Less
        } else {
            std::cmp::Ordering::Greater
        }
    });

    Ok(entries)
}

/// 获取最近文件列表
#[tauri::command]
pub fn get_recent_files(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let ws = state.workspace.lock().map_err(|e| e.to_string())?;
    Ok(ws.recent_files().to_vec())
}
// ===========侧边栏功能相关结束================

#[tauri::command]
pub fn set_record_recent_files(state: tauri::State<AppState>, value: bool) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.set_record_recent_files(value);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

#[tauri::command]
pub fn clear_recent_files(state: tauri::State<AppState>) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.clear_recent_files();
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

#[tauri::command]
pub fn remove_recent_file(state: tauri::State<AppState>, path: String) -> Result<(), String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;
    ws.remove_recent_file(&path);
    drop(ws);
    state.mark_session_dirty();
    Ok(())
}

#[tauri::command]
pub fn check_file_exists(path: String) -> Result<bool, String> {
    Ok(std::path::Path::new(&path).exists())
}

#[tauri::command]
pub fn reopen_closed_tab(state: tauri::State<AppState>) -> Result<WorkspaceSnapshot, String> {
    let mut ws = state.workspace.lock().map_err(|e| e.to_string())?;

    while let Some(path) = ws.pop_closed_tab() {
        let file_path = std::path::PathBuf::from(&path);
        if file_path.exists() {
            // ★ 核心修复：判断文件大小
            if let Ok(metadata) = std::fs::metadata(&file_path) {
                let size = metadata.len();
                if size >= LARGE_FILE_THRESHOLD {
                    // 大文件：恢复为 Pending 占位标签
                    ws.open_file_lazy(file_path, size);
                    state.mark_session_dirty();
                    return Ok(snapshot_from_workspace(&ws));
                }
            }

            // 小文件：尝试读取
            if let Ok((content, encoding, line_ending, mtime)) =
                crate::io::file::read_file(&file_path)
            {
                ws.open_file(file_path, &content, encoding, line_ending, mtime);
                state.mark_session_dirty();
                return Ok(snapshot_from_workspace(&ws));
            }
            // ★ 注意：如果 read_file 失败（比如权限被拒），循环会自动继续去找下一个文件
        }
    }
    Err("NoValidTabsToReopen".to_string())
}
