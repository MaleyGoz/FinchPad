use crate::io::encoding::TextEncoding;
use crate::io::file;
use crate::io::line_ending::LineEnding;
use crate::model::tab::Tab;
use std::path::{Path, PathBuf};

/// 磁盘文件相对上次已知状态的变化情况。
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExternalChange {
    Unchanged,
    Modified,
    Deleted,
}

/// 一次保存操作的结果。
#[derive(Debug)]
pub enum SaveOutcome {
    Saved,
    Conflict(ExternalChange),
}

/// 标签集合 + 激活索引。管理所有打开的标签及其生命周期。
pub struct Workspace {
    tabs: Vec<Tab>,
    active_index: usize,
    untitled_counter: u32,
}

impl Workspace {
    pub fn new() -> Self {
        Self {
            tabs: vec![Tab::new_blank()],
            active_index: 0,
            untitled_counter: 1,
        }
    }

    // ===== 打开 / 查找 =====
    pub fn open_file(
        &mut self,
        path: PathBuf,
        content: &str,
        encoding: TextEncoding,
        line_ending: LineEnding,
        mtime: std::time::SystemTime,
    ) {
        if let Some(index) = self.find_tab_by_path(&path) {
            // 已打开：检查外部是否变化
            let should_reload = {
                let tab = &self.tabs[index];
                // 外部变了（mtime 不同） + 标签是干净的 → 允许重载
                tab.last_known_mtime != Some(mtime) && !tab.is_dirty
            };

            if should_reload {
                let tab = &mut self.tabs[index];
                tab.refresh_from_disk(&content, encoding, line_ending, mtime);
            }
            // 如果标签是脏的，保留用户修改，不做任何事

            self.switch_to(index);
            return;
        }

        // 未打开：走原来的逻辑
        if self.active_tab().is_blank_unedited() {
            self.active_tab_mut()
                .load_from_file(path, content, encoding, line_ending, mtime);
        } else {
            self.tabs
                .push(Tab::from_file(path, content, encoding, line_ending, mtime));
            self.active_index = self.tabs.len() - 1;
        }
    }

    pub fn find_tab_by_path(&self, path: &Path) -> Option<usize> {
        self.tabs.iter().position(|tab| {
            tab.file_path
                .as_deref()
                .is_some_and(|open_path| file::same_path(open_path, path))
        })
    }

    // ===== 保存 =====

    pub fn save_active_needs_dialog(&self) -> bool {
        !self.active_tab().is_persisted()
    }

    pub fn save_active_to_disk(&mut self) -> std::io::Result<SaveOutcome> {
        self.save_tab_to_disk(self.active_index)
    }

    pub fn save_active_as(&mut self, path: PathBuf) -> std::io::Result<()> {
        self.save_tab_as(self.active_index, path)
    }

    pub fn save_tab_to_disk(&mut self, index: usize) -> std::io::Result<SaveOutcome> {
        match self.external_file_state(index)? {
            ExternalChange::Unchanged => {
                self.force_save_tab_to_disk(index)?;
                Ok(SaveOutcome::Saved)
            }
            change => Ok(SaveOutcome::Conflict(change)),
        }
    }

    /// 跳过外部状态检查，直接写盘。用于"覆盖磁盘"。
    pub fn force_save_tab_to_disk(&mut self, index: usize) -> std::io::Result<()> {
        let tab = self
            .tabs
            .get_mut(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;

        let path = tab.file_path.clone().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "临时标签没有关联文件")
        })?;

        let content = tab.buffer.to_string();
        let encoding = tab.encoding;
        let line_ending = tab.line_ending;
        let mtime = file::write_file(&path, &content, encoding, line_ending)?;
        tab.mark_saved(mtime);
        Ok(())
    }

    pub fn save_tab_as(&mut self, index: usize, path: PathBuf) -> std::io::Result<()> {
        if self.save_path_conflict(index, &path) {
            return Err(std::io::Error::new(
                std::io::ErrorKind::AlreadyExists,
                "该文件已在其他标签中打开",
            ));
        }

        let tab = self
            .tabs
            .get_mut(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;

        let content = tab.buffer.to_string();
        let encoding = tab.encoding;
        let line_ending = tab.line_ending;
        let mtime = file::write_file(&path, &content, encoding, line_ending)?;

        let title = path
            .file_name()
            .map(|name| name.to_string_lossy().to_string())
            .unwrap_or_else(|| "未命名".to_string());

        tab.file_path = Some(path);
        tab.title = title;
        tab.mark_saved(mtime);

        Ok(())
    }

    pub fn save_default_name(&self, index: usize) -> String {
        self.tabs
            .get(index)
            .and_then(|tab| tab.file_path.as_ref())
            .and_then(|path| path.file_name())
            .map(|name| name.to_string_lossy().into_owned())
            .unwrap_or_else(|| "未命名.txt".to_string())
    }

    pub fn save_path_conflict(&self, index: usize, path: &Path) -> bool {
        self.tabs.iter().enumerate().any(|(other_index, tab)| {
            if index == other_index {
                return false;
            }

            tab.file_path
                .as_deref()
                .is_some_and(|open_path| file::same_path(open_path, path))
        })
    }

    // ===== 外部状态 =====

    pub fn external_file_state(&self, index: usize) -> std::io::Result<ExternalChange> {
        let tab = self
            .tabs
            .get(index)
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效"))?;

        let Some(path) = tab.file_path.as_deref() else {
            return Ok(ExternalChange::Unchanged);
        };

        match file::file_mtime(path) {
            Ok(current_mtime) => {
                if tab.last_known_mtime != Some(current_mtime) {
                    Ok(ExternalChange::Modified)
                } else {
                    Ok(ExternalChange::Unchanged)
                }
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
                Ok(ExternalChange::Deleted)
            }
            Err(error) => Err(error),
        }
    }

    /// 从磁盘重新读取，替换缓冲区并清除脏标记。用于"放弃我的修改"。
    pub fn reload_tab_from_disk(&mut self, index: usize) -> std::io::Result<()> {
        let path = {
            let tab = self.tabs.get(index).ok_or_else(|| {
                std::io::Error::new(std::io::ErrorKind::InvalidInput, "标签索引无效")
            })?;
            tab.file_path.clone().ok_or_else(|| {
                std::io::Error::new(std::io::ErrorKind::InvalidInput, "临时标签没有关联文件")
            })?
        };

        let (content, encoding, line_ending, mtime) = file::read_file(&path)?;

        let tab = self.tabs.get_mut(index).unwrap();
        tab.refresh_from_disk(&content, encoding, line_ending, mtime);
        Ok(())
    }

    /// 文件已被外部删除且用户放弃修改：把标签整体重置为空白。
    pub fn reset_to_blank(&mut self, index: usize) {
        if let Some(tab) = self.tabs.get_mut(index) {
            *tab = Tab::new_blank();
        }
    }

    // ===== 标签管理 =====

    pub fn new_tab(&mut self) {
        self.tabs.push(Tab::new_blank());
        self.active_index = self.tabs.len() - 1;
        self.active_index = self.tabs.len() - 1;
    }

    pub fn close_tab(&mut self, index: usize) {
        if index >= self.tabs.len() {
            return;
        }

        self.tabs.remove(index);

        if self.tabs.is_empty() {
            self.untitled_counter += 1;
            self.tabs.push(Tab::new_unnamed(self.untitled_counter));
            self.active_index = 0;
        } else if index < self.active_index {
            self.active_index -= 1;
        } else if index == self.active_index {
            self.active_index = self.active_index.min(self.tabs.len() - 1);
        }
    }

    pub fn switch_to(&mut self, index: usize) {
        if index < self.tabs.len() {
            self.active_index = index;
        }
    }

    pub fn switch_to_next(&mut self) {
        if self.tabs.len() > 1 {
            self.active_index = (self.active_index + 1) % self.tabs.len();
        }
    }

    /// 拖拽标签重排
    pub fn reorder_tabs(&mut self, from: usize, to: usize) {
        let len = self.tabs.len();
        if from >= len || to >= len || from == to {
            return;
        }

        let item = self.tabs.remove(from);
        self.tabs.insert(to, item);

        if self.active_index == from {
            self.active_index = to;
        } else if from < self.active_index && self.active_index <= to {
            self.active_index -= 1;
        } else if to <= self.active_index && self.active_index < from {
            self.active_index += 1;
        }
    }

    // ===== 访问器 =====

    pub fn active_tab_mut(&mut self) -> &mut Tab {
        &mut self.tabs[self.active_index]
    }

    pub fn active_tab(&self) -> &Tab {
        &self.tabs[self.active_index]
    }

    pub fn active_index(&self) -> usize {
        self.active_index
    }

    /// 遍历所有标签（只读），供 UI 层使用。
    pub fn tabs(&self) -> &[Tab] {
        &self.tabs
    }

    /// 索引是否有效。
    pub fn is_valid_index(&self, index: usize) -> bool {
        index < self.tabs.len()
    }

    pub fn tab_title(&self, index: usize) -> Option<String> {
        self.tabs.get(index).map(|tab| tab.title.clone())
    }

    pub fn tab_needs_close_confirmation(&self, index: usize) -> bool {
        self.tabs
            .get(index)
            .map(|tab| tab.is_dirty)
            .unwrap_or(false)
    }

    pub fn save_tab_needs_dialog(&self, index: usize) -> bool {
        self.tabs
            .get(index)
            .map(|tab| !tab.is_persisted())
            .unwrap_or(false)
    }

    pub fn tab_count(&self) -> usize {
        self.tabs.len()
    }
}

impl Default for Workspace {
    fn default() -> Self {
        Self::new()
    }
}
