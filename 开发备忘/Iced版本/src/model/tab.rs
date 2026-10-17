use crate::io::encoding::TextEncoding;
use crate::io::line_ending::LineEnding;
use crate::model::buffer::TextBuffer;
use std::path::PathBuf;
use std::time::SystemTime;

/// 统计文本的行数和字符数。
/// 规则：空字符串算 1 行；"a\n" 算 1 行（结尾换行不算新行）。
pub fn count_text(text: &str) -> (usize, usize) {
    let chars = text.chars().count();
    let lines = if text.is_empty() {
        1
    } else {
        text.lines().count().max(1)
    };
    (lines, chars)
}

/// 代表一个打开的标签页:内容 + 文件路径 + 状态元数据
pub struct Tab {
    pub buffer: TextBuffer,
    /// None 表示这是一个从未保存过的临时标签(比如新建的空白页)
    pub file_path: Option<PathBuf>,
    /// 是否有未落盘的改动
    pub is_dirty: bool,
    /// 上一次已知的磁盘文件修改时间,用于检测"外部是否改过这个文件"
    pub last_known_mtime: Option<SystemTime>,
    /// 标签栏上显示的标题(文件名,或"未命名"这类占位符)
    pub title: String,
    /// 这个标签的文本编码。新建标签默认 UTF-8，打开文件时记录检测结果。
    /// 保存时按它写回，不改变原始文件编码。
    pub encoding: TextEncoding,
    /// 这个标签的换行符。新建标签用平台默认，打开文件时记录检测结果。
    pub line_ending: LineEnding,
    /// 缓存：当前文本的逻辑行数。空文件算 1 行。
    pub line_count: usize,
    /// 缓存：当前文本的字符数（Unicode scalar 数，不是字节数）。
    pub char_count: usize,
}

impl Tab {
    /// 创建一个带编号的未命名标签（未命名1、未命名2...）
    pub fn new_unnamed(n: u32) -> Self {
        let mut tab = Self::new_blank();
        tab.title = format!("未命名{}", n);
        tab
    }

    /// 创建一个全新的空白临时标签
    pub fn new_blank() -> Self {
        Self {
            buffer: TextBuffer::new(),
            file_path: None,
            is_dirty: false,
            last_known_mtime: None,
            title: "未命名".to_string(),
            encoding: TextEncoding::Utf8,
            line_ending: LineEnding::platform_default(),
            line_count: 1,
            char_count: 0,
        }
    }

    /// 从磁盘上的已有文件创建标签
    pub fn from_file(
        path: PathBuf,
        content: &str,
        encoding: TextEncoding,
        line_ending: LineEnding,
        mtime: SystemTime,
    ) -> Self {
        let title = path
            .file_name()
            .map(|name| name.to_string_lossy().to_string())
            .unwrap_or_else(|| "未命名".to_string());
        let (line_count, char_count) = count_text(content);

        Self {
            buffer: TextBuffer::from_str(content),
            file_path: Some(path),
            is_dirty: false,
            last_known_mtime: Some(mtime),
            title,
            encoding,
            line_ending,
            line_count,
            char_count,
        }
    }

    /// 把当前标签的内容替换成磁盘上某个文件的内容(用于复用空白标签打开文件)
    pub fn load_from_file(
        &mut self,
        path: PathBuf,
        content: &str,
        encoding: TextEncoding,
        line_ending: LineEnding,
        mtime: SystemTime,
    ) {
        let title = path
            .file_name()
            .map(|name| name.to_string_lossy().to_string())
            .unwrap_or_else(|| "未命名".to_string());

        self.buffer = TextBuffer::from_str(content);
        self.file_path = Some(path);
        self.is_dirty = false;
        self.last_known_mtime = Some(mtime);
        self.title = title;
        self.encoding = encoding;
        self.line_ending = line_ending;
        let (line_count, char_count) = count_text(content);
        self.line_count = line_count;
        self.char_count = char_count;
    }

    /// 判断这个标签是否"空白且未编辑过"(用于决定 Ctrl+O 是复用还是新建)
    pub fn is_blank_unedited(&self) -> bool {
        self.file_path.is_none() && !self.is_dirty && self.buffer.is_empty()
    }

    /// 标记这个标签有未保存的改动(每次编辑后调用)
    pub fn mark_dirty(&mut self) {
        self.is_dirty = true;
    }

    /// 保存成功后调用,清除脏标记并更新已知的磁盘修改时间
    pub fn mark_saved(&mut self, new_mtime: SystemTime) {
        self.is_dirty = false;
        self.last_known_mtime = Some(new_mtime);
    }

    /// 这个标签是否已经关联到磁盘上的真实文件
    pub fn is_persisted(&self) -> bool {
        self.file_path.is_some()
    }

    /// 用磁盘上的新内容刷新当前标签（保留 file_path 与 title）。
    pub fn refresh_from_disk(
        &mut self,
        content: &str,
        encoding: TextEncoding,
        line_ending: LineEnding,
        mtime: SystemTime,
    ) {
        self.buffer = TextBuffer::from_str(content);
        self.encoding = encoding;
        self.line_ending = line_ending;
        let (line_count, char_count) = count_text(content);
        self.line_count = line_count;
        self.char_count = char_count;
        self.is_dirty = false;
        self.last_known_mtime = Some(mtime);
    }
}
