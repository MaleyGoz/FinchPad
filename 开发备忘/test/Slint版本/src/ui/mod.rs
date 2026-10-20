pub mod tooltip;

use crate::model::{ExternalChange, Workspace};
use crate::MainWindow;
use slint::{ModelRc, SharedString, VecModel};
use std::cell::RefCell;
use std::rc::Rc;

/// 计算当前激活标签相对磁盘状态的变化。UI 层做一次 mtime 检查，
/// 仅为展示徽章文字，不属于核心业务。
fn active_external_change(workspace: &Workspace) -> ExternalChange {
    let tab = workspace.active_tab();
    let Some(path) = tab.file_path.as_deref() else {
        return ExternalChange::Unchanged;
    };
    match crate::io::file::file_mtime(path) {
        Ok(mtime) => {
            if tab.last_known_mtime != Some(mtime) {
                ExternalChange::Modified
            } else {
                ExternalChange::Unchanged
            }
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            let parent_ok = path.parent().map(|p| p.exists()).unwrap_or(false);
            if parent_ok {
                ExternalChange::Deleted
            } else {
                ExternalChange::Unreachable
            }
        }
        Err(_) => ExternalChange::Unchanged,
    }
}

pub fn sync_ui(window: &MainWindow, workspace: &Rc<RefCell<Workspace>>) {
    let workspace = workspace.borrow();

    let titles: Vec<SharedString> = workspace
        .tab_titles()
        .into_iter()
        .map(SharedString::from)
        .collect();
    window.set_tab_titles(ModelRc::new(VecModel::from(titles)));
    window.set_tab_dirty_states(ModelRc::new(VecModel::from(workspace.tab_dirty_states())));
    window.set_active_index(workspace.active_index() as i32);
    window.set_editor_text(workspace.active_tab().buffer.to_string().into());
    window.set_tab_paths(ModelRc::new(VecModel::from(
        workspace
            .tab_paths()
            .into_iter()
            .map(SharedString::from)
            .collect::<Vec<_>>(),
    )));

    let idx = workspace.active_index();
    let is_dirty = workspace.active_tab().is_dirty;
    let (badge_text, badge_color) = match active_external_change(&workspace) {
        ExternalChange::Deleted => (
            "⚠ 已被外部删除",
            slint::Color::from_rgb_u8(0xcc, 0x33, 0x33),
        ),
        ExternalChange::Modified => (
            "⚠ 已被外部修改",
            slint::Color::from_rgb_u8(0xcc, 0x66, 0x00),
        ),
        ExternalChange::Unreachable => (
            "⚠ 位置暂不可访问",
            slint::Color::from_rgb_u8(0x88, 0x88, 0x88),
        ),
        _ if is_dirty => ("● 未保存", slint::Color::from_rgb_u8(0xc0, 0x80, 0x00)),
        _ => ("", slint::Color::from_argb_u8(0, 0, 0, 0)),
    };
    let _ = idx;

    window.set_status_badge_text(badge_text.into());
    window.set_status_badge_color(badge_color);
    window.set_status_encoding(workspace.active_tab().encoding.name().into());
    window.set_status_line_ending(workspace.active_tab().line_ending.name().into());
    window.set_status_line_count(workspace.active_tab().line_count as i32);
    window.set_status_char_count(workspace.active_tab().char_count as i32);
}
