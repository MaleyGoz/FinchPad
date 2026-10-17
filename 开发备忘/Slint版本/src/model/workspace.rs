use super::Tab;
use crate::io::encoding::TextEncoding;
use crate::io::line_ending::LineEnding;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExternalChange {
    Unchanged,
    Modified,
    /// 文件真被删（父目录还在）
    Deleted,
    /// 路径暂时不可达（父目录也不在，例如移动硬盘未连接）
    Unreachable,
}

#[derive(Debug)]
pub enum SaveOutcome {
    Saved,
    /// 磁盘已被外部修改，需要用户决策
    Conflict(ExternalChange),
    /// 路径暂时不可达（外设未连接等），调用方应自动走"另存为"
    Unreachable,
}

pub struct Workspace {
    tabs: Vec<Tab>,
    active_index: usize,
}

impl Workspace {
    /// 生成一个新的未命名空白标签，编号取当前未使用的最小正整数。
    /// 例如现有 [未命名1, 未命名3]，新建得到 [未命名2]。
    fn make_blank_tab(&mut self) -> Tab {
        use std::collections::HashSet;
        let used: HashSet<usize> = self
            .tabs
            .iter()
            .filter(|t| t.file_path.is_none())
            .filter_map(|t| {
                t.title
                    .strip_prefix("未命名")
                    .and_then(|s| s.parse::<usize>().ok())
            })
            .collect();
        let mut n = 1;
        while used.contains(&n) {
            n += 1;
        }
        Tab::new_blank(format!("未命名{}", n))
    }

    pub fn new() -> Self {
        let mut ws = Self {
            tabs: Vec::new(),
            active_index: 0,
        };
        let first = ws.make_blank_tab();
        ws.tabs.push(first);
        ws
    }

    pub fn open_file(
        &mut self,
        path: PathBuf,
        content: &str,
        encoding: TextEncoding,
        line_ending: LineEnding,
        mtime: SystemTime,
    ) {
        if let Some(index) = self.find_tab_by_path(&path) {
            self.switch_to(index);
            return;
        }

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
                .is_some_and(|open_path| crate::io::file::same_path(open_path, path))
        })
    }

    pub fn new_tab(&mut self) {
        let tab = self.make_blank_tab();
        self.tabs.push(tab);
        self.active_index = self.tabs.len() - 1;
    }

    pub fn close_tab(&mut self, index: usize) {
        if index >= self.tabs.len() {
            return;
        }
        self.tabs.remove(index);
        if self.tabs.is_empty() {
            let tab = self.make_blank_tab();
            self.tabs.push(tab);
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
    pub fn tabs(&self) -> &[Tab] {
        &self.tabs
    }

    /// 用一组新标签整体替换当前状态（用于 session 恢复）。
    pub fn restore(&mut self, tabs: Vec<Tab>, active_index: usize) {
        self.tabs = tabs;
        self.active_index = if self.tabs.is_empty() {
            0
        } else {
            active_index.min(self.tabs.len() - 1)
        };
    }

    pub fn tab(&self, index: usize) -> Option<&Tab> {
        self.tabs.get(index)
    }
    pub fn tab_mut(&mut self, index: usize) -> Option<&mut Tab> {
        self.tabs.get_mut(index)
    }

    pub fn active_tab_mut(&mut self) -> &mut Tab {
        &mut self.tabs[self.active_index]
    }
    pub fn active_tab(&self) -> &Tab {
        &self.tabs[self.active_index]
    }
    pub fn active_index(&self) -> usize {
        self.active_index
    }
    pub fn tab_count(&self) -> usize {
        self.tabs.len()
    }

    pub fn tab_titles(&self) -> Vec<String> {
        self.tabs.iter().map(|tab| tab.title.clone()).collect()
    }
    pub fn tab_dirty_states(&self) -> Vec<bool> {
        self.tabs.iter().map(|tab| tab.is_dirty).collect()
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
    pub fn tab_paths(&self) -> Vec<String> {
        self.tabs
            .iter()
            .map(|tab| {
                tab.file_path
                    .as_ref()
                    .map(|p| p.to_string_lossy().into_owned())
                    .unwrap_or_default()
            })
            .collect()
    }
    pub fn save_default_name(&self, index: usize) -> String {
        let Some(tab) = self.tabs.get(index) else {
            return "未命名.txt".to_string();
        };
        // 已保存过的标签：用原文件名
        if let Some(name) = tab.file_path.as_ref().and_then(|p| p.file_name()) {
            return name.to_string_lossy().into_owned();
        }
        // 未命名标签：用 title + .txt
        format!("{}.txt", tab.title)
    }
    pub fn save_path_conflict(&self, index: usize, path: &Path) -> bool {
        self.tabs.iter().enumerate().any(|(other_index, tab)| {
            if index == other_index {
                return false;
            }
            tab.file_path
                .as_deref()
                .is_some_and(|open_path| crate::io::file::same_path(open_path, path))
        })
    }

    /// 把一个标签彻底重置为新的未命名标签。
    /// 用于"文件被外部删除且用户放弃修改"。
    pub fn reset_tab_to_blank(&mut self, index: usize) {
        if index >= self.tabs.len() {
            return;
        }
        let tab = self.make_blank_tab();
        self.tabs[index] = tab;
    }
}

impl Default for Workspace {
    fn default() -> Self {
        Self::new()
    }
}
