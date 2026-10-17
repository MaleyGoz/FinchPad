use crate::io::file as file_io;

use crate::io::encoding::TextEncoding;
use crate::io::line_ending::LineEnding;
use crate::model::{ExternalChange, SaveOutcome, Tab, TextBuffer, Workspace};

use crate::ui;
use crate::{MainWindow, TooltipWindow};
use slint::ComponentHandle;
use std::cell::RefCell;
use std::rc::Rc;

pub struct App {
    pub workspace: Rc<RefCell<Workspace>>,
    pub pending_conflict: Rc<RefCell<Option<usize>>>,
    pub pending_light_conflict: Rc<RefCell<Option<usize>>>,
    pub pending_deleted: Rc<RefCell<Option<usize>>>,
    pub pending_deleted_save: Rc<RefCell<Option<usize>>>,
    pub deleted_prompted: Rc<RefCell<std::collections::HashSet<String>>>,
    pub pending_close: Rc<RefCell<Option<usize>>>,
    pub pending_close_queue: Rc<RefCell<Vec<usize>>>,
    pub find_position: Rc<RefCell<usize>>,
    pub drag_from: Rc<RefCell<Option<usize>>>,
    pub tooltip_window: Rc<TooltipWindow>,
    /// 1 秒周期的 autosave 定时器
    pub autosave_timer: Rc<slint::Timer>,
    /// 自上次 tick 以来有内容变化、需要写 cache 的标签 id 集合
    pub dirty_tabs: Rc<RefCell<std::collections::HashSet<String>>>,
    /// session 元数据有变化、需要在下次 tick 时写 session.json
    pub session_dirty: Rc<std::cell::Cell<bool>>,
}

// ============ IO 调度辅助函数（放在 app 层，不污染 model） ============

fn external_file_state(ws: &Workspace, index: usize) -> std::io::Result<ExternalChange> {
    let tab = ws
        .tab(index)
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;
    let Some(path) = tab.file_path.as_deref() else {
        return Ok(ExternalChange::Unchanged);
    };
    match file_io::file_mtime(path) {
        Ok(cur) => Ok(if tab.last_known_mtime != Some(cur) {
            ExternalChange::Modified
        } else {
            ExternalChange::Unchanged
        }),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            // 父目录存在 = 文件真被删；父目录也不在 = 位置暂时不可达
            let parent_ok = path.parent().map(|p| p.exists()).unwrap_or(false);
            if parent_ok {
                Ok(ExternalChange::Deleted)
            } else {
                Ok(ExternalChange::Unreachable)
            }
        }
        Err(e) => Err(e),
    }
}

fn force_save_tab_to_disk(ws: &Rc<RefCell<Workspace>>, index: usize) -> std::io::Result<()> {
    let (path, content, encoding, line_ending) = {
        let w = ws.borrow();
        let tab = w
            .tab(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;
        let path = tab.file_path.clone().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "临时标签没有关联文件")
        })?;
        (path, tab.buffer.to_string(), tab.encoding, tab.line_ending)
    };
    let new_mtime = file_io::write_file(&path, &content, encoding, line_ending)?;
    if let Some(tab) = ws.borrow_mut().tab_mut(index) {
        tab.mark_saved(new_mtime);
    }
    Ok(())
}

fn save_tab_to_disk(ws: &Rc<RefCell<Workspace>>, index: usize) -> std::io::Result<SaveOutcome> {
    let change = external_file_state(&ws.borrow(), index)?;
    match change {
        ExternalChange::Unchanged | ExternalChange::Deleted => {
            force_save_tab_to_disk(ws, index)?;
            Ok(SaveOutcome::Saved)
        }
        ExternalChange::Modified => Ok(SaveOutcome::Conflict(ExternalChange::Modified)),
        // TODO 第 3 步：改为自动调"另存为"
        ExternalChange::Unreachable => Ok(SaveOutcome::Unreachable),
    }
}

fn save_tab_as(
    ws: &Rc<RefCell<Workspace>>,
    index: usize,
    path: std::path::PathBuf,
) -> std::io::Result<()> {
    if ws.borrow().save_path_conflict(index, &path) {
        return Err(std::io::Error::new(
            std::io::ErrorKind::AlreadyExists,
            "该文件已在其他标签中打开",
        ));
    }

    let (content, encoding, line_ending) = {
        let w = ws.borrow();
        let tab = w
            .tab(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;
        (tab.buffer.to_string(), tab.encoding, tab.line_ending)
    };

    let new_mtime = file_io::write_file(&path, &content, encoding, line_ending)?;

    let title = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "未命名".to_string());

    if let Some(tab) = ws.borrow_mut().tab_mut(index) {
        tab.file_path = Some(path);
        tab.title = title;
        tab.mark_saved(new_mtime);
    }
    Ok(())
}

/// 保存遇到 `Unreachable` 时的公共处理：调起"另存为"对话框。
/// 返回 true 表示保存成功，false 表示用户取消或失败。
fn save_via_save_as_dialog(ws: &Rc<RefCell<Workspace>>, index: usize) -> bool {
    let default_name = ws.borrow().save_default_name(index);
    let Some(path) = file_io::pick_save_path(&default_name) else {
        return false; // 用户取消
    };
    match save_tab_as(ws, index, path) {
        Ok(()) => true,
        Err(e) => {
            eprintln!("另存为失败：{e}");
            false
        }
    }
}

/// 尝试为一个"待重载"的标签从磁盘恢复内容。
/// 只在 `needs_reload == true` 且路径可达时执行；否则什么都不做。
fn try_reload_if_pending(ws: &Rc<RefCell<Workspace>>, index: usize) {
    let (needs, path) = {
        let w = ws.borrow();
        let Some(tab) = w.tab(index) else { return };
        (tab.needs_reload, tab.file_path.clone())
    };
    if !needs {
        return;
    }
    let Some(path) = path else { return };
    let Ok((content, encoding, line_ending, mtime)) = file_io::read_file(&path) else {
        // 仍然不可达，保持 needs_reload 为 true，什么都不做
        return;
    };
    if let Some(tab) = ws.borrow_mut().tab_mut(index) {
        tab.refresh_from_disk(&content, encoding, line_ending, mtime);
        tab.needs_reload = false;
    }
}

fn reload_tab_from_disk(ws: &Rc<RefCell<Workspace>>, index: usize) -> std::io::Result<()> {
    let path = {
        let w = ws.borrow();
        let tab = w
            .tab(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;
        tab.file_path.clone().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "临时标签没有关联文件")
        })?
    };

    let (content, encoding, line_ending, mtime) = file_io::read_file(&path)?;
    if let Some(tab) = ws.borrow_mut().tab_mut(index) {
        tab.refresh_from_disk(&content, encoding, line_ending, mtime);
    }
    Ok(())
}

// ============ 冲突提示文案 ============

fn conflict_text_for(
    ws: &Rc<RefCell<Workspace>>,
    idx: usize,
    change: ExternalChange,
) -> (String, String) {
    let w = ws.borrow();
    let name = w.tab_title(idx).unwrap_or_else(|| "未命名".to_string());
    let title = match change {
        ExternalChange::Modified => "文件已被外部修改",
        ExternalChange::Deleted => "文件已被外部删除",
        ExternalChange::Unreachable => "文件位置不可访问",
        ExternalChange::Unchanged => "文件状态异常",
    };
    let message = match change {
        ExternalChange::Modified => format!(
            "「{}」在磁盘上已被其他程序修改。\n你的编辑与磁盘版本可能冲突，请选择处理方式。",
            name
        ),
        ExternalChange::Deleted => format!(
            "「{}」在磁盘上已被删除。\n你的编辑仍保留在编辑器中，请选择处理方式。",
            name
        ),
        ExternalChange::Unreachable => format!(
            "「{}」所在的位置当前无法访问（例如移动硬盘未连接）。\n请选择处理方式。",
            name
        ),
        ExternalChange::Unchanged => String::new(),
    };
    (title.to_string(), message)
}

fn light_conflict_text_for(ws: &Rc<RefCell<Workspace>>, idx: usize) -> (String, String) {
    let w = ws.borrow();
    let name = w.tab_title(idx).unwrap_or_else(|| "未命名".to_string());
    (
        "文件已被外部修改".to_string(),
        format!(
            "「{}」在磁盘上已被其他程序修改。\n你在编辑器里还有未保存的修改，是否重新加载？",
            name
        ),
    )
}

fn deleted_confirm_text_for(ws: &Workspace, idx: usize) -> (String, String) {
    let path = ws
        .tab(idx)
        .and_then(|t| t.file_path.as_ref())
        .map(|p| p.to_string_lossy().into_owned())
        .unwrap_or_else(|| ws.tab_title(idx).unwrap_or_else(|| "未命名".to_string()));
    (
        "文件已被外部删除".to_string(),
        format!("文件「{}」已经不存在了。\n是否在编辑器里保留它？", path),
    )
}

/// 尝试从会话元数据恢复一个标签。
/// 返回 `None` 表示这个标签应该被丢弃（D1 情况：干净+文件被外部删除）。
fn restore_one_tab(ts: &crate::io::session::TabSession) -> Option<Tab> {
    let encoding = TextEncoding::from_name(&ts.encoding);
    let line_ending = LineEnding::from_name(&ts.line_ending);

    let (content, from_cache, needs_reload) =
        if let Some(cache) = crate::io::session::read_cache(&ts.id) {
            // 有缓存 → 用缓存内容（说明原来是脏的/未命名）
            (cache, true, false)
        } else if let Some(path) = &ts.path {
            // 无缓存 + 有路径 → 从磁盘读
            match file_io::read_file(path) {
                Ok((content, _, _, _)) => (content, false, false),
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                    let parent_ok = path.parent().map(|p| p.exists()).unwrap_or(false);
                    if parent_ok {
                        // D1：干净 + 文件真被删 → 丢弃
                        return None;
                    }
                    // Unreachable：保留路径，内容为空，标记待重载
                    (String::new(), false, true)
                }
                Err(_) => return None,
            }
        } else {
            // 无缓存 + 无路径 → 未命名空标签，丢弃
            return None;
        };

    let mut tab = Tab::new_blank(ts.title.clone());
    tab.id = ts.id.clone();
    tab.title = ts.title.clone();
    tab.file_path = ts.path.clone();
    tab.encoding = encoding;
    tab.line_ending = line_ending;
    tab.buffer = TextBuffer::from_str(&content);
    let (l, c) = crate::model::tab::count_text(&content);
    tab.line_count = l;
    tab.char_count = c;
    tab.is_dirty = from_cache || ts.is_dirty;
    tab.cursor_line = ts.cursor_line;
    tab.cursor_column = ts.cursor_column;
    tab.needs_reload = needs_reload;

    if let Some(path) = &tab.file_path {
        if let Ok(m) = file_io::file_mtime(path) {
            tab.last_known_mtime = Some(m);
        }
    }

    Some(tab)
}

// ============ 关闭队列 ============

fn request_next_close(window: &MainWindow, app: &App) {
    if app.pending_close.borrow().is_some() {
        return;
    }
    if app.pending_deleted_save.borrow().is_some() {
        return;
    }

    let Some(index) = app.pending_close_queue.borrow_mut().pop() else {
        return;
    };
    let tab_count = app.workspace.borrow().tab_count();
    if index >= tab_count {
        request_next_close(window, app);
        return;
    }
    // 关闭前校验脏状态（输入后又删除 → 视为干净）
    {
        let mut ws = app.workspace.borrow_mut();
        if let Some(tab) = ws.tab_mut(index) {
            tab.is_dirty = tab.is_content_dirty();
        }
    }

    // 先取磁盘状态，决定走哪条弹窗
    let change =
        external_file_state(&app.workspace.borrow(), index).unwrap_or(ExternalChange::Unchanged);

    let (title, path, is_dirty) = {
        let ws = app.workspace.borrow();
        let Some(tab) = ws.tab(index) else {
            drop(ws);
            request_next_close(window, app);
            return;
        };
        let title = tab.title.clone();
        let path = tab
            .file_path
            .as_ref()
            .map(|p| p.to_string_lossy().into_owned());
        (title, path, tab.is_dirty)
    };

    // 情况 A: 文件真删除 / 位置不可达 → 弹 [3]
    if matches!(
        change,
        ExternalChange::Deleted | ExternalChange::Unreachable
    ) {
        *app.pending_deleted_save.borrow_mut() = Some(index);
        let (t, m) = match change {
            ExternalChange::Deleted => (
                "文件已被外部删除".to_string(),
                format!(
                    "文件「{}」已从磁盘删除。\n是否保存内容以重建该文件？",
                    path.unwrap_or_default()
                ),
            ),
            ExternalChange::Unreachable => (
                "文件位置暂不可访问".to_string(),
                format!(
                    "文件「{}」所在位置当前不可访问。\n是否另存为其他位置？",
                    path.unwrap_or_default()
                ),
            ),
            _ => unreachable!(),
        };
        window.set_deleted_save_title(t.into());
        window.set_deleted_save_message(m.into());
        window.set_deleted_save_visible(true);
        return;
    }

    // 情况 B: 脏标签 → 弹 [1]
    if is_dirty {
        *app.pending_close.borrow_mut() = Some(index);
        window.set_confirm_title(title.into());
        window.set_confirm_visible(true);
        return;
    }

    // 情况 C: 干净且文件存在 → 直接关
    app.workspace.borrow_mut().close_tab(index);
    app.mark_session_dirty();
    ui::sync_ui(window, &app.workspace);
    request_next_close(window, app);
}

fn start_close_request(window: &MainWindow, app: &App, indices: Vec<usize>) {
    if app.pending_close.borrow().is_some() {
        return;
    }
    app.pending_close_queue.borrow_mut().extend(indices);
    request_next_close(window, app);
}

// ============ App 实现 ============

impl App {
    pub fn new(tooltip_window: Rc<TooltipWindow>) -> Self {
        Self {
            workspace: Rc::new(RefCell::new(Workspace::new())),
            pending_conflict: Rc::new(RefCell::new(None)),
            pending_light_conflict: Rc::new(RefCell::new(None)),
            pending_deleted: Rc::new(RefCell::new(None)),
            pending_deleted_save: Rc::new(RefCell::new(None)),
            deleted_prompted: Rc::new(RefCell::new(std::collections::HashSet::new())),
            pending_close: Rc::new(RefCell::new(None)),
            pending_close_queue: Rc::new(RefCell::new(Vec::new())),
            find_position: Rc::new(RefCell::new(0)),
            drag_from: Rc::new(RefCell::new(None)),
            tooltip_window,
            autosave_timer: Rc::new(slint::Timer::default()),
            dirty_tabs: Rc::new(RefCell::new(std::collections::HashSet::new())),
            session_dirty: Rc::new(std::cell::Cell::new(false)),
        }
    }

    pub fn sync_ui(&self, window: &MainWindow) {
        ui::sync_ui(window, &self.workspace);
    }

    /// 启动时调用：尝试恢复上次会话。
    /// 若 session 不存在或全部标签被丢弃，保持默认空白标签。
    pub fn restore_session(&self, window: &MainWindow) {
        let Some(session) = crate::io::session::load() else {
            return;
        };

        // 窗口状态先恢复（即使 tabs 为空也要恢复窗口）
        window.window().set_size(slint::LogicalSize::new(
            session.window.width,
            session.window.height,
        ));
        window.set_zoom(session.window.zoom);

        let old_active = session.active_index;
        let mut restored: Vec<Tab> = Vec::new();
        let mut restored_active = 0;

        for (i, ts) in session.tabs.iter().enumerate() {
            if let Some(tab) = restore_one_tab(ts) {
                if i == old_active {
                    restored_active = restored.len();
                }
                restored.push(tab);
            }
        }

        if restored.is_empty() {
            return;
        }

        if restored_active >= restored.len() {
            restored_active = restored.len() - 1;
        }

        self.workspace
            .borrow_mut()
            .restore(restored, restored_active);
    }

    /// 标记：session 元数据有变化，下次 tick 时写盘。
    pub fn mark_session_dirty(&self) {
        self.session_dirty.set(true);
    }

    /// 组装 session 结构（不写盘）。
    fn build_session(&self, window: &MainWindow) -> crate::io::session::Session {
        let ws = self.workspace.borrow();
        let old_active = ws.active_index();

        let mut session = crate::io::session::Session::new();
        let mut new_active = 0;

        for (i, tab) in ws.tabs().iter().enumerate() {
            // 情况 1：未命名 + 空 + 干净 → 跳过
            if tab.file_path.is_none() && tab.buffer.is_empty() && !tab.is_dirty {
                continue;
            }
            if i == old_active {
                new_active = session.tabs.len();
            }
            session.tabs.push(crate::io::session::TabSession {
                id: tab.id.clone(),
                title: tab.title.clone(),
                path: tab.file_path.clone(),
                encoding: tab.encoding.name().to_string(),
                line_ending: tab.line_ending.name().to_string(),
                is_dirty: tab.is_dirty,
                cursor_line: tab.cursor_line,
                cursor_column: tab.cursor_column,
            });
        }

        session.active_index = if session.tabs.is_empty() {
            0
        } else {
            new_active.min(session.tabs.len() - 1)
        };

        let size = window.window().size();
        let scale = window.window().scale_factor();
        session.window.width = size.width as f32 / scale;
        session.window.height = size.height as f32 / scale;
        session.window.zoom = window.get_zoom();

        session
    }

    /// 写 session.json（不写 cache，不含兜底）。
    pub fn write_session(&self, window: &MainWindow) {
        let session = self.build_session(window);
        let keep_ids: Vec<String> = session.tabs.iter().map(|t| t.id.clone()).collect();
        crate::io::session::cleanup_orphan_cache(&keep_ids);
        let _ = crate::io::session::save(&session);
    }

    /// Timer 回调：写脏 cache + 按需写 session。
    pub fn tick_autosave(&self, window: &MainWindow) {
        // 0. 校验并纠正脏状态（用户可能输入后又删除）
        {
            let mut ws = self.workspace.borrow_mut();
            let mut flipped = false;
            for i in 0..ws.tab_count() {
                if let Some(tab) = ws.tab_mut(i) {
                    let now_dirty = tab.is_content_dirty();
                    if tab.is_dirty != now_dirty {
                        tab.is_dirty = now_dirty;
                        flipped = true;
                    }
                }
            }
            drop(ws);
            if flipped {
                self.mark_session_dirty();
            }
        }

        // 1. 写脏标签的 cache
        let dirty_ids: Vec<String> = self.dirty_tabs.borrow_mut().drain().collect();
        if !dirty_ids.is_empty() {
            let ws = self.workspace.borrow();
            for tab in ws.tabs() {
                if dirty_ids.iter().any(|id| id == &tab.id) {
                    let content = tab.buffer.to_string();
                    let _ = crate::io::session::write_cache(&tab.id, &content);
                }
            }
        }

        // 2. 清理已保存标签的 cache（幂等，文件不存在也无副作用）
        {
            let ws = self.workspace.borrow();
            for tab in ws.tabs() {
                if !tab.is_dirty && tab.file_path.is_some() {
                    crate::io::session::remove_cache(&tab.id);
                }
            }
        }

        // 3. session 脏了 → 写盘
        if self.session_dirty.get() {
            self.write_session(window);
            self.session_dirty.set(false);
        }
    }

    /// 退出时调用：兜底写所有脏 cache + 写 session。
    pub fn save_session_on_exit(&self, window: &MainWindow) {
        {
            let ws = self.workspace.borrow();
            for tab in ws.tabs() {
                if tab.is_dirty || tab.file_path.is_none() {
                    let content = tab.buffer.to_string();
                    if !content.is_empty() || tab.is_dirty {
                        let _ = crate::io::session::write_cache(&tab.id, &content);
                    }
                }
            }
        }
        self.write_session(window);
    }

    pub fn bind(self: &Rc<Self>, window: &MainWindow) {
        // ---- 启动 autosave 定时器 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            self.autosave_timer.start(
                slint::TimerMode::Repeated,
                std::time::Duration::from_secs(1),
                move || {
                    if let Some(w) = window_weak.upgrade() {
                        app.tick_autosave(&w);
                    }
                },
            );
        }

        // ---- 编辑器内容变化 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_text_changed(move |new_text| {
                let mut flipped_to_dirty = false;
                {
                    let mut ws = app.workspace.borrow_mut();
                    let tab = ws.active_tab_mut();
                    let was_dirty = tab.is_dirty;
                    tab.buffer = crate::model::TextBuffer::from_str(&new_text);
                    tab.mark_dirty();
                    let (lines, chars) = crate::model::tab::count_text(&new_text);
                    tab.line_count = lines;
                    tab.char_count = chars;
                    if !was_dirty {
                        flipped_to_dirty = true;
                    }
                    let id = tab.id.clone();
                    drop(ws);
                    app.dirty_tabs.borrow_mut().insert(id);
                }
                if flipped_to_dirty {
                    app.mark_session_dirty();
                }
                if let Some(w) = window_weak.upgrade() {
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 切换标签 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_tab_clicked(move |index| {
                if index < 0 {
                    return;
                }
                let idx = index as usize;
                let mut show_light = false;
                let mut show_deleted: Option<(usize, String, String)> = None;
                {
                    let mut ws = app.workspace.borrow_mut();
                    ws.switch_to(idx);
                    let is_dirty = ws.active_tab().is_dirty;
                    match external_file_state(&ws, idx) {
                        Ok(ExternalChange::Modified) => {
                            if is_dirty {
                                show_light = true;
                            } else {
                                drop(ws);
                                let _ = reload_tab_from_disk(&app.workspace, idx);
                            }
                        }
                        Ok(ExternalChange::Deleted) => {
                            let tab_id = ws.active_tab().id.clone();
                            let already = app.deleted_prompted.borrow().contains(&tab_id);
                            if !already {
                                let (t, m) = deleted_confirm_text_for(&ws, idx);
                                show_deleted = Some((idx, t, m));
                            }
                        }
                        Ok(ExternalChange::Unreachable) => {
                            // 位置暂时不可达：不打扰用户，状态栏会提示
                        }
                        _ => {}
                    }
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                app.mark_session_dirty();
                app.sync_ui(&w);
                try_reload_if_pending(&app.workspace, idx);
                app.sync_ui(&w);
                if show_light {
                    *app.pending_light_conflict.borrow_mut() = Some(idx);
                    let (t, m) = light_conflict_text_for(&app.workspace, idx);
                    w.set_light_conflict_title(t.into());
                    w.set_light_conflict_message(m.into());
                    w.set_light_conflict_visible(true);
                }
                if let Some((idx, t, m)) = show_deleted {
                    *app.pending_deleted.borrow_mut() = Some(idx);
                    w.set_deleted_confirm_title(t.into());
                    w.set_deleted_confirm_message(m.into());
                    w.set_deleted_confirm_visible(true);
                }
            });
        }

        // ---- 拖拽重排 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_tab_drag_started({
                let app = app.clone();
                move |index| {
                    if index < 0 {
                        return;
                    }
                    *app.drag_from.borrow_mut() = Some(index as usize);
                }
            });
            window.on_tab_drag_ended(move |to_index| {
                let Some(from) = app.drag_from.borrow_mut().take() else {
                    return;
                };
                if to_index < 0 {
                    return;
                }
                let to = to_index as usize;
                if from == to {
                    return;
                }
                app.workspace.borrow_mut().reorder_tabs(from, to);
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 新建标签 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_new_tab_clicked(move || {
                app.workspace.borrow_mut().new_tab();
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 打开文件 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_open_file_requested(move || {
                let paths = file_io::pick_open_paths();
                if paths.is_empty() {
                    return;
                }
                let mut opened = false;
                {
                    let mut ws = app.workspace.borrow_mut();
                    for path in paths {
                        match file_io::read_file(&path) {
                            Ok((c, e, l, m)) => {
                                ws.open_file(path, &c, e, l, m);
                                opened = true;
                                app.mark_session_dirty();
                            }
                            Err(err) => eprintln!("打开文件失败：{err}"),
                        }
                    }
                }
                if opened {
                    if let Some(w) = window_weak.upgrade() {
                        app.sync_ui(&w);
                    }
                }
            });
        }

        // ---- 拖拽文件打开 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_files_dropped(move |data| {
                eprintln!("[debug] files_dropped 被触发");

                // 提取文件路径列表
                let paths: Vec<std::path::PathBuf> = match data.file_paths() {
                    Ok(iter) => iter.map(|p| p.to_path_buf()).collect(),
                    Err(_) => return, // 没有文件路径，忽略
                };

                let mut opened = false;
                {
                    let mut ws = app.workspace.borrow_mut();
                    for path in paths {
                        // 过滤：必须是文件（不是目录）
                        if !path.is_file() {
                            continue;
                        }

                        // 复用现有的打开逻辑
                        match file_io::read_file(&path) {
                            Ok((c, e, l, m)) => {
                                ws.open_file(path, &c, e, l, m);
                                opened = true;
                            }
                            Err(err) => eprintln!("拖入文件打开失败：{err}"),
                        }
                    }
                }
                if opened {
                    app.mark_session_dirty();
                    if let Some(w) = window_weak.upgrade() {
                        app.sync_ui(&w);
                    }
                }
            });
        }

        // ---- 保存 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_save_requested(move || {
                // 未命名 + 空内容 → 保存无意义，直接忽略
                {
                    let ws = app.workspace.borrow();
                    let idx = ws.active_index();
                    if let Some(tab) = ws.tab(idx) {
                        if tab.file_path.is_none() && tab.buffer.is_empty() {
                            return;
                        }
                    }
                }
                // 内容无变化 → 跳过保存（未命名 + 空也走这条）
                {
                    let ws = app.workspace.borrow();
                    let idx = ws.active_index();
                    if let Some(tab) = ws.tab(idx) {
                        if !tab.is_content_dirty() {
                            return;
                        }
                    }
                }

                let idx = app.workspace.borrow().active_index();
                if app.workspace.borrow().save_tab_needs_dialog(idx) {
                    let default_name = app.workspace.borrow().save_default_name(idx);
                    let Some(path) = file_io::pick_save_path(&default_name) else {
                        return;
                    };
                    match save_tab_as(&app.workspace, idx, path) {
                        Ok(()) => {
                            if let Some(w) = window_weak.upgrade() {
                                app.sync_ui(&w);
                            }
                        }
                        Err(e) => eprintln!("保存失败：{e}"),
                    }
                    return;
                }
                match save_tab_to_disk(&app.workspace, idx) {
                    Ok(SaveOutcome::Saved) => {
                        app.mark_session_dirty();
                        if let Some(w) = window_weak.upgrade() {
                            app.sync_ui(&w);
                        }
                    }
                    Ok(SaveOutcome::Unreachable) => {
                        // 位置暂不可达 → 自动调起"另存为"
                        if save_via_save_as_dialog(&app.workspace, idx) {
                            app.mark_session_dirty();
                            if let Some(w) = window_weak.upgrade() {
                                app.sync_ui(&w);
                            }
                        }
                    }
                    Ok(SaveOutcome::Conflict(change)) => {
                        *app.pending_conflict.borrow_mut() = Some(idx);
                        if let Some(w) = window_weak.upgrade() {
                            let (t, m) = conflict_text_for(&app.workspace, idx, change);
                            w.set_conflict_title(t.into());
                            w.set_conflict_message(m.into());
                            w.set_conflict_visible(true);
                        }
                    }
                    Err(e) => eprintln!("保存失败：{e}"),
                }
            });
        }

        // ---- 另存为 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_save_as_requested(move || {
                let idx = app.workspace.borrow().active_index();
                let default_name = app.workspace.borrow().save_default_name(idx);
                let Some(path) = file_io::pick_save_path(&default_name) else {
                    return;
                };
                match save_tab_as(&app.workspace, idx, path) {
                    Ok(()) => {
                        app.mark_session_dirty();
                        if let Some(w) = window_weak.upgrade() {
                            app.sync_ui(&w);
                        }
                    }
                    Err(e) => eprintln!("另存为失败：{e}"),
                }
            });
        }

        // ---- 关闭标签 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_tab_close_requested(move |index| {
                if index < 0 {
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                let index = index as usize;
                if index >= app.workspace.borrow().tab_count() {
                    return;
                }
                start_close_request(&w, &app, vec![index]);
            });
        }
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_tab_middle_close_requested(move |index| {
                if index < 0 {
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                let index = index as usize;
                if index >= app.workspace.borrow().tab_count() {
                    return;
                }
                start_close_request(&w, &app, vec![index]);
            });
        }

        // ---- 关闭其它/左/右 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_close_other_tabs_requested(move |index| {
                if index < 0 {
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                let index = index as usize;
                let count = app.workspace.borrow().tab_count();
                if index >= count {
                    return;
                }
                let indices = (0..count).filter(|&i| i != index).collect();
                start_close_request(&w, &app, indices);
            });
        }
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_close_left_tabs_requested(move |index| {
                if index <= 0 {
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                let indices = (0..index as usize).collect();
                start_close_request(&w, &app, indices);
            });
        }
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_close_right_tabs_requested(move |index| {
                if index < 0 {
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                let count = app.workspace.borrow().tab_count();
                let index = index as usize;
                if index + 1 >= count {
                    return;
                }
                let indices = ((index + 1)..count).collect();
                start_close_request(&w, &app, indices);
            });
        }

        // ---- Tooltip ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_tooltip_show_requested(move |index, tab_x, tab_bottom_y| {
                if index < 0 {
                    return;
                }
                let index = index as usize;
                let Some(path) = app
                    .workspace
                    .borrow()
                    .tab_paths()
                    .get(index)
                    .cloned()
                    .filter(|p| !p.is_empty())
                else {
                    return;
                };
                let Some(main_window) = window_weak.upgrade() else {
                    return;
                };
                let (tw, th) = ui::tooltip::estimate_tooltip_size(&path);
                app.tooltip_window.set_tooltip_text(path.into());
                app.tooltip_window
                    .window()
                    .set_size(slint::LogicalSize::new(tw, th));
                let handle = main_window.window();
                let pos = handle.position();
                let scale = handle.scale_factor();
                let gap = 35.0_f32;
                let tx = pos.x + ((tab_x + 8.0) * scale).round() as i32;
                let ty = pos.y + ((tab_bottom_y + gap) * scale).round() as i32;
                app.tooltip_window
                    .window()
                    .set_position(slint::PhysicalPosition::new(tx, ty));
                let _ = app.tooltip_window.show();
            });
        }
        {
            let app = self.clone();
            window.on_tooltip_hide_requested(move || {
                let _ = app.tooltip_window.hide();
            });
        }

        // ---- 标签右键菜单 ----
        {
            let window_weak = window.as_weak();
            window.on_tab_context_requested(move |index| {
                if index < 0 {
                    return;
                }
                if let Some(w) = window_weak.upgrade() {
                    let index = index as usize;
                    let menu_x = 10.0 + index as f32 * 124.0;
                    w.set_tab_menu_index(index as i32);
                    w.set_tab_menu_x(menu_x.min(600.0).into());
                    w.set_tab_menu_y(48.0_f32.into());
                    w.set_tab_menu_visible(true);
                }
            });
        }

        // ---- 确认保存 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_confirm_save(move || {
                let Some(index) = *app.pending_close.borrow() else {
                    return;
                };
                let needs_dialog = app.workspace.borrow().save_tab_needs_dialog(index);

                let result: Option<Result<(), String>> = if needs_dialog {
                    let default_name = app.workspace.borrow().save_default_name(index);
                    match file_io::pick_save_path(&default_name) {
                        Some(path) => Some(
                            save_tab_as(&app.workspace, index, path).map_err(|e| e.to_string()),
                        ),
                        None => None,
                    }
                } else {
                    match save_tab_to_disk(&app.workspace, index) {
                        Ok(SaveOutcome::Saved) => Some(Ok(())),
                        Ok(SaveOutcome::Unreachable) => {
                            // 位置暂不可达 → 自动调起"另存为"
                            let default_name = app.workspace.borrow().save_default_name(index);
                            match file_io::pick_save_path(&default_name) {
                                Some(path) => Some(
                                    save_tab_as(&app.workspace, index, path)
                                        .map_err(|e| e.to_string()),
                                ),
                                None => None, // 用户取消 → 不关闭标签
                            }
                        }
                        Ok(SaveOutcome::Conflict(change)) => {
                            *app.pending_conflict.borrow_mut() = Some(index);
                            if let Some(w) = window_weak.upgrade() {
                                let (t, m) = conflict_text_for(&app.workspace, index, change);
                                w.set_confirm_visible(false);
                                w.set_conflict_title(t.into());
                                w.set_conflict_message(m.into());
                                w.set_conflict_visible(true);
                            }
                            return;
                        }
                        Err(e) => Some(Err(e.to_string())),
                    }
                };

                let Some(result) = result else {
                    return;
                };
                match result {
                    Ok(()) => {
                        app.pending_close.borrow_mut().take();
                        app.workspace.borrow_mut().close_tab(index);
                        app.mark_session_dirty();
                        if let Some(w) = window_weak.upgrade() {
                            w.set_confirm_visible(false);
                            app.sync_ui(&w);
                            request_next_close(&w, &app);
                        }
                    }
                    Err(e) => eprintln!("保存失败：{e}"),
                }
            });
        }

        // ---- 放弃修改并关闭 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_confirm_discard(move || {
                let Some(index) = app.pending_close.borrow_mut().take() else {
                    return;
                };
                app.workspace.borrow_mut().close_tab(index);
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    w.set_confirm_visible(false);
                    app.sync_ui(&w);
                    request_next_close(&w, &app);
                }
            });
        }

        // ---- 取消 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_confirm_cancel(move || {
                app.pending_close.borrow_mut().take();
                if let Some(w) = window_weak.upgrade() {
                    w.set_confirm_visible(false);
                    request_next_close(&w, &app);
                }
            });
        }

        // ---- 冲突：覆盖磁盘 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_conflict_overwrite(move || {
                let Some(idx) = app.pending_conflict.borrow_mut().take() else {
                    return;
                };
                if let Err(e) = force_save_tab_to_disk(&app.workspace, idx) {
                    eprintln!("保存失败：{e}");
                    return;
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                w.set_conflict_visible(false);
                if app.pending_close.borrow().is_some() {
                    app.pending_close.borrow_mut().take();
                    app.workspace.borrow_mut().close_tab(idx);
                    app.mark_session_dirty();
                    app.sync_ui(&w);
                    request_next_close(&w, &app);
                } else {
                    app.mark_session_dirty();
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 冲突：放弃我的修改 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_conflict_discard(move || {
                let Some(idx) = app.pending_conflict.borrow_mut().take() else {
                    return;
                };

                let state_result = external_file_state(&app.workspace.borrow(), idx);
                let change = match state_result {
                    Ok(c) => c,
                    Err(e) => {
                        eprintln!("获取文件状态失败：{e}");
                        return;
                    }
                };

                // 注意：`Deleted` 场景走 deleted-confirm 弹窗（是/否），
                // 不会到达这里；这里的 "放弃我的修改" 只对 Modified 有意义。
                if matches!(change, ExternalChange::Modified) {
                    if let Err(e) = reload_tab_from_disk(&app.workspace, idx) {
                        eprintln!("重载失败：{e}");
                        return;
                    }
                }

                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                w.set_conflict_visible(false);
                if app.pending_close.borrow().is_some() {
                    app.pending_close.borrow_mut().take();
                    app.workspace.borrow_mut().close_tab(idx);
                    app.mark_session_dirty();
                    app.sync_ui(&w);
                    request_next_close(&w, &app);
                } else {
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 冲突：另存为 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_conflict_save_as(move || {
                let Some(idx) = app.pending_conflict.borrow_mut().take() else {
                    return;
                };
                app.pending_close.borrow_mut().take();
                let default_name = app.workspace.borrow().save_default_name(idx);
                let Some(path) = file_io::pick_save_path(&default_name) else {
                    return;
                };
                match save_tab_as(&app.workspace, idx, path) {
                    Ok(()) => {
                        app.mark_session_dirty();
                        if let Some(w) = window_weak.upgrade() {
                            w.set_conflict_visible(false);
                            app.sync_ui(&w);
                        }
                    }
                    Err(e) => eprintln!("另存为失败：{e}"),
                }
            });
        }

        // ---- 冲突：取消 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_conflict_cancel(move || {
                app.pending_conflict.borrow_mut().take();
                let was_closing = app.pending_close.borrow_mut().take().is_some();
                if let Some(w) = window_weak.upgrade() {
                    w.set_conflict_visible(false);
                    if was_closing {
                        w.set_confirm_visible(false);
                    }
                }
            });
        }

        // ---- 轻量冲突：重新加载 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_light_conflict_reload(move || {
                let Some(idx) = app.pending_light_conflict.borrow_mut().take() else {
                    return;
                };
                if let Err(e) = reload_tab_from_disk(&app.workspace, idx) {
                    eprintln!("重新加载失败：{e}");
                }
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    w.set_light_conflict_visible(false);
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 轻量冲突：保留我的修改 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_light_conflict_keep(move || {
                app.pending_light_conflict.borrow_mut().take();
                if let Some(w) = window_weak.upgrade() {
                    w.set_light_conflict_visible(false);
                }
            });
        }

        // ---- Ctrl+Tab ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_next_tab_requested(move || {
                if let Some(w) = window_weak.upgrade() {
                    if w.get_light_conflict_visible() || w.get_deleted_confirm_visible() {
                        return;
                    }
                }
                let mut show_light = false;
                let mut show_deleted: Option<(usize, String, String)> = None;
                let idx;
                {
                    let mut ws = app.workspace.borrow_mut();
                    ws.switch_to_next();
                    idx = ws.active_index();
                    let is_dirty = ws.active_tab().is_dirty;
                    match external_file_state(&ws, idx) {
                        Ok(ExternalChange::Modified) => {
                            if is_dirty {
                                show_light = true;
                            } else {
                                drop(ws);
                                let _ = reload_tab_from_disk(&app.workspace, idx);
                            }
                        }
                        Ok(ExternalChange::Deleted) => {
                            let tab_id = ws.active_tab().id.clone();
                            let already = app.deleted_prompted.borrow().contains(&tab_id);
                            if !already {
                                let (t, m) = deleted_confirm_text_for(&ws, idx);
                                show_deleted = Some((idx, t, m));
                            }
                        }
                        Ok(ExternalChange::Unreachable) => {
                            // 位置暂时不可达：不打扰用户，状态栏会提示
                        }
                        _ => {}
                    }
                }
                let Some(w) = window_weak.upgrade() else {
                    return;
                };
                app.mark_session_dirty();
                app.sync_ui(&w);
                try_reload_if_pending(&app.workspace, idx);
                app.sync_ui(&w);
                if show_light {
                    *app.pending_light_conflict.borrow_mut() = Some(idx);
                    let (t, m) = light_conflict_text_for(&app.workspace, idx);
                    w.set_light_conflict_title(t.into());
                    w.set_light_conflict_message(m.into());
                    w.set_light_conflict_visible(true);
                }
                if let Some((idx, t, m)) = show_deleted {
                    *app.pending_deleted.borrow_mut() = Some(idx);
                    w.set_deleted_confirm_title(t.into());
                    w.set_deleted_confirm_message(m.into());
                    w.set_deleted_confirm_visible(true);
                }
            });
        }

        // ---- 查找相关 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_find_requested(move || {
                *app.find_position.borrow_mut() = 0;
                if let Some(w) = window_weak.upgrade() {
                    w.set_find_visible(true);
                }
            });
        }
        {
            let app = self.clone();
            window.on_find_query_changed(move |_| {
                *app.find_position.borrow_mut() = 0;
            });
        }
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_find_next_requested(move || {
                let query = window_weak
                    .upgrade()
                    .map(|w| w.get_find_query().to_string())
                    .unwrap_or_default();
                if query.is_empty() {
                    return;
                }
                let text = app.workspace.borrow().active_tab().buffer.to_string();
                if text.is_empty() {
                    return;
                }
                let mut pos = app.find_position.borrow_mut();
                let start = (*pos).min(text.len());
                let found = text[start..]
                    .find(&query)
                    .map(|o| start + o)
                    .or_else(|| text.find(&query));
                if let Some(i) = found {
                    *pos = i + query.len();
                    println!("找到匹配项：第 {i} 个字节位置");
                } else {
                    *pos = 0;
                    println!("未找到：{query}");
                }
            });
        }
        {
            let window_weak = window.as_weak();
            window.on_find_close_requested(move || {
                if let Some(w) = window_weak.upgrade() {
                    w.set_find_visible(false);
                    w.set_find_query(slint::SharedString::default());
                }
            });
        }

        // ---- 已删除文件：用户选择"是"，保留标签 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_deleted_confirm_keep(move || {
                let Some(idx) = app.pending_deleted.borrow_mut().take() else {
                    return;
                };

                // 标记为"已问过"，避免切来切去反复弹
                if let Some(tab) = app.workspace.borrow().tab(idx) {
                    app.deleted_prompted.borrow_mut().insert(tab.id.clone());
                }

                // 内容现在只在内存里，磁盘上没有，所以立即标脏
                if let Some(tab) = app.workspace.borrow_mut().tab_mut(idx) {
                    tab.mark_dirty();
                }

                // TODO（下一步做 session/autosave 时补）：
                //   1. 立即把内容写入 cache/<tab-id>.data
                //   2. 立刻写一次 session.json，避免意外退出丢失状态

                if let Some(w) = window_weak.upgrade() {
                    w.set_deleted_confirm_visible(false);
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 已删除文件：用户选择"否"，关闭标签 ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_deleted_confirm_close(move || {
                let Some(idx) = app.pending_deleted.borrow_mut().take() else {
                    return;
                };

                // TODO（下一步做 session 时补）：删除 cache/<tab-id>.data

                app.workspace.borrow_mut().close_tab(idx);
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    w.set_deleted_confirm_visible(false);
                    app.sync_ui(&w);
                }
            });
        }

        // ---- 关闭"已删除/不可达"标签：用户选"保存" ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_deleted_save_save(move || {
                let Some(idx) = app.pending_deleted_save.borrow_mut().take() else {
                    return;
                };

                let change = external_file_state(&app.workspace.borrow(), idx)
                    .unwrap_or(ExternalChange::Unchanged);

                let ok = match change {
                    ExternalChange::Deleted => {
                        // 文件真删了：直接重建
                        force_save_tab_to_disk(&app.workspace, idx).is_ok()
                    }
                    ExternalChange::Unreachable => {
                        // 位置不可达：走另存为
                        save_via_save_as_dialog(&app.workspace, idx)
                    }
                    _ => true,
                };

                if !ok {
                    // 保存失败或用户取消 → 重新放回 pending，弹窗保持
                    *app.pending_deleted_save.borrow_mut() = Some(idx);
                    return;
                }

                app.workspace.borrow_mut().close_tab(idx);
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    w.set_deleted_save_visible(false);
                    app.sync_ui(&w);
                    request_next_close(&w, &app);
                }
            });
        }

        // ---- 关闭"已删除/不可达"标签：用户选"不保存" ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_deleted_save_discard(move || {
                let Some(idx) = app.pending_deleted_save.borrow_mut().take() else {
                    return;
                };

                // TODO 第 5 步：删除 cache/<tab-id>.data

                app.workspace.borrow_mut().close_tab(idx);
                app.mark_session_dirty();
                if let Some(w) = window_weak.upgrade() {
                    w.set_deleted_save_visible(false);
                    app.sync_ui(&w);
                    request_next_close(&w, &app);
                }
            });
        }

        // ---- 关闭"已删除/不可达"标签：用户选"取消" ----
        {
            let app = self.clone();
            let window_weak = window.as_weak();
            window.on_deleted_save_cancel(move || {
                app.pending_deleted_save.borrow_mut().take();
                if let Some(w) = window_weak.upgrade() {
                    w.set_deleted_save_visible(false);
                    request_next_close(&w, &app);
                }
            });
        }
    }
}
