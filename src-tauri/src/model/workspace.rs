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

pub struct Workspace {
    tabs: Vec<Tab>,
    active_index: usize,
    /// 编辑器字体缩放百分比（50 ~ 400，100 = 100%）
    zoom: i32,
    /// 编辑器自动换行（全局）
    word_wrap: bool,
    /// 是否显示行号（全局）
    show_line_numbers: bool,
    /// 编辑区背景主题名（"white" / "sepia" / "green" / "lightgray" / "darkgray"）
    editor_bg: String,
    /// 当前语言（"zh-CN" / "en-US"），仅用于记录
    locale: String,
    /// 未命名标签的模板，例如 "未命名{index}" 或 "New {index}"
    unnamed_template: String,
    /// 用户的语言选择（"auto" / "zh-CN" / "en-US"）
    locale_choice: String,
    /// ★ 新增：最近一次成功打开/另存为时所在的目录
    last_used_path: Option<PathBuf>,
}

impl Workspace {
    /// 生成一个新的未命名空白标签，编号取当前未使用的最小正整数。
    /// 标题根据 `unnamed_template` 生成，例如 "未命名1" 或 "New 1"。
    fn make_blank_tab(&mut self) -> Tab {
        use std::collections::HashSet;

        // 从模板中提取前缀（去掉 {index} 部分），用于识别已有未命名标签的编号
        let prefix = self
            .unnamed_template
            .split("{index}")
            .next()
            .unwrap_or("未命名")
            .to_string();

        let used: HashSet<usize> = self
            .tabs
            .iter()
            .filter(|t| t.file_path.is_none())
            .filter_map(|t| {
                let rest = t.title.strip_prefix(&prefix)?;
                rest.trim().parse::<usize>().ok()
            })
            .collect();

        let mut n = 1;
        while used.contains(&n) {
            n += 1;
        }

        let title = self.unnamed_template.replace("{index}", &n.to_string());
        Tab::new_blank(title)
    }

    pub fn new() -> Self {
        let mut ws = Self {
            tabs: Vec::new(),
            active_index: 0,
            zoom: 100,
            word_wrap: true,
            show_line_numbers: true,
            editor_bg: "white".to_string(),
            locale: "zh-CN".to_string(),
            unnamed_template: "未命名{index}".to_string(),
            locale_choice: "auto".to_string(),
            last_used_path: None,
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

    /// 打开一个大文件，创建"待加载"占位标签（不读内容）
    pub fn open_file_lazy(&mut self, path: PathBuf, size: u64) {
        // 已打开 → 切换过去
        if let Some(index) = self.find_tab_by_path(&path) {
            self.switch_to(index);
            return;
        }
        // 复用空标签
        if self.active_tab().is_blank_unedited() {
            self.active_tab_mut().make_pending(path, size);
        } else {
            let tab = Tab::from_pending_file(path, size);
            self.tabs.push(tab);
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

    /// ★ 新增：可变访问器，供 app.rs 修改 cache_stale
    pub fn tabs_mut(&mut self) -> &mut [Tab] {
        &mut self.tabs
    }

    /// 用一组新标签整体替换当前状态（用于 session 恢复）。
    pub fn restore(&mut self, tabs: Vec<Tab>, active_index: usize) {
        self.tabs = tabs;
        if self.tabs.is_empty() {
            // ★ 空数组 → 自动补一个全新的空白标签，避免 active_tab 越界
            let tab = self.make_blank_tab();
            self.tabs.push(tab);
            self.active_index = 0;
        } else {
            self.active_index = active_index.min(self.tabs.len() - 1);
        }
    }

    pub fn zoom(&self) -> i32 {
        self.zoom
    }

    pub fn set_zoom(&mut self, zoom: i32) {
        self.zoom = zoom.clamp(50, 400);
    }

    pub fn word_wrap(&self) -> bool {
        self.word_wrap
    }

    pub fn set_word_wrap(&mut self, value: bool) {
        self.word_wrap = value;
    }

    pub fn show_line_numbers(&self) -> bool {
        self.show_line_numbers
    }

    pub fn set_show_line_numbers(&mut self, value: bool) {
        self.show_line_numbers = value;
    }

    pub fn editor_bg(&self) -> &str {
        &self.editor_bg
    }

    pub fn locale(&self) -> &str {
        &self.locale
    }

    pub fn locale_choice(&self) -> &str {
        &self.locale_choice
    }

    pub fn last_used_path(&self) -> Option<&PathBuf> {
        self.last_used_path.as_ref()
    }

    pub fn set_last_used_path(&mut self, path: Option<PathBuf>) {
        self.last_used_path = path;
    }

    /// 设置当前语言和未命名标签模板。
    /// 特例：如果当前只有 1 个"空白未命名标签"（首次启动状态），
    /// 顺便按新模板重命名它。
    pub fn set_locale(&mut self, locale: String, unnamed_template: String, locale_choice: String) {
        self.locale = locale;
        self.unnamed_template = unnamed_template.clone();
        self.locale_choice = locale_choice;

        if self.tabs.len() == 1 {
            let tab = &self.tabs[0];
            if tab.file_path.is_none() && !tab.is_dirty && tab.buffer.is_empty() {
                let new_title = unnamed_template.replace("{index}", "1");
                self.tabs[0].title = new_title;
            }
        }
    }

    pub fn set_editor_bg(&mut self, value: String) {
        self.editor_bg = value;
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

    pub fn tab_titles(&self) -> Vec<String> {
        self.tabs.iter().map(|tab| tab.title.clone()).collect()
    }
    pub fn tab_dirty_states(&self) -> Vec<bool> {
        self.tabs.iter().map(|tab| tab.is_dirty).collect()
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

    pub fn locale_choice_restore(&mut self, choice: String) {
        self.locale_choice = choice;
    }
}

impl Default for Workspace {
    fn default() -> Self {
        Self::new()
    }
}
