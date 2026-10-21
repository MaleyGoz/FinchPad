use super::TextBuffer;
use crate::io::encoding::TextEncoding;
use crate::io::line_ending::LineEnding;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
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
    pub id: String,
    /// 缓存：当前文本的字符数（Unicode scalar 数，不是字节数）。
    pub char_count: usize,
    /// 大文件占位状态：true 时 buffer 为空，等待用户触发加载
    pub is_pending_load: bool,
    /// 文件的字节大小（未命名标签为 0）
    pub file_size: u64,
    /// 光标位置。当前 Slint TextEdit 不暴露该属性，暂为占位；
    /// 未来若可用，只需在 app.rs 的 sync 中更新，结构本身不动。
    pub cursor_line: usize,
    pub cursor_column: usize,
    /// 会话恢复时，如果文件位置暂时不可达（如移动硬盘未连接），
    /// 内容留空、路径保留、此标记为 true。切换到此标签时若路径恢复可达，
    /// 会自动静默重载。
    pub needs_reload: bool,
    /// 上一次"干净状态"的内容哈希：
    ///   - 有名标签：磁盘内容的哈希
    ///   - 未命名标签：空字符串的哈希
    /// 用于判定"输入后又删除"是否真的回到了干净状态。
    pub saved_hash: u64,
    ///缓存是否失效（需要重新写入缓存）
    pub cache_stale: bool,
}

impl Tab {
    pub fn hash_of(s: &str) -> u64 {
        let mut h = DefaultHasher::new();
        s.hash(&mut h);
        h.finish()
    }

    pub fn is_content_dirty(&self) -> bool {
        // 如果还是占位状态，一律视为干净
        if self.is_pending_load {
            return false;
        }
        Self::hash_of(&self.buffer.to_string()) != self.saved_hash
    }

    /// 创建一个全新的空白临时标签
    pub fn new_blank(title: String) -> Self {
        Self {
            buffer: TextBuffer::new(),
            file_path: None,
            is_dirty: false,
            last_known_mtime: None,
            title,
            encoding: TextEncoding::Utf8,
            line_ending: LineEnding::platform_default(),
            line_count: 1,
            id: uuid::Uuid::new_v4().to_string(),
            char_count: 0,
            cursor_line: 1,
            cursor_column: 1,
            needs_reload: false,
            saved_hash: Self::hash_of(""),
            is_pending_load: false,
            file_size: 0, // from_file 里改成从参数或 metadata 获取
            cache_stale: true,
        }
    }

    /// 创建一个"待加载"的大文件占位标签（不读内容）
    pub fn from_pending_file(path: PathBuf, size: u64) -> Self {
        let title = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "未命名".to_string());
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            buffer: TextBuffer::new(),
            file_path: Some(path),
            is_dirty: false,
            last_known_mtime: None,
            title,
            encoding: TextEncoding::Utf8,
            line_ending: LineEnding::platform_default(),
            line_count: 1,
            char_count: 0,
            cursor_line: 1,
            cursor_column: 1,
            needs_reload: false,
            saved_hash: Self::hash_of(""), // ★ 修复：空文本的哈希，而不是 0
            is_pending_load: true,
            file_size: size,
            cache_stale: true,
        }
    }

    /// 把一个已存在的标签转成"待加载"状态（用于复用空标签打开大文件）
    pub fn make_pending(&mut self, path: PathBuf, size: u64) {
        let title = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "未命名".to_string());
        self.buffer = TextBuffer::new();
        self.file_path = Some(path);
        self.title = title;
        self.is_dirty = false;
        self.last_known_mtime = None;
        self.line_count = 1;
        self.char_count = 0;
        self.is_pending_load = true;
        self.file_size = size;
        self.needs_reload = false;
        self.saved_hash = Self::hash_of(""); // ★ 修复：确保哈希对应空内容
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
            id: uuid::Uuid::new_v4().to_string(),
            cursor_line: 1,
            cursor_column: 1,
            needs_reload: false,
            saved_hash: Self::hash_of(content),
            is_pending_load: false,
            file_size: 0, // from_file 里改成从参数或 metadata 获取
            cache_stale: true,
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
        self.saved_hash = Self::hash_of(content);
        self.cache_stale = true;
    }

    /// 判断这个标签是否"空白且未编辑过"(用于决定 Ctrl+O 是复用还是新建)
    pub fn is_blank_unedited(&self) -> bool {
        self.file_path.is_none() && !self.is_dirty && self.buffer.is_empty()
    }

    /// 保存成功后调用,清除脏标记并更新已知的磁盘修改时间
    pub fn mark_saved(&mut self, new_mtime: SystemTime) {
        self.is_dirty = false;
        self.last_known_mtime = Some(new_mtime);
        self.saved_hash = Self::hash_of(&self.buffer.to_string());
        self.cache_stale = true;
    }
}
