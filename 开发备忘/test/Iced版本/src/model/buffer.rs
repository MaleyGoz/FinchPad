use ropey::Rope;

/// 对 Ropey 的薄封装,提供文本编辑的基础操作。
/// 之后如果想换缓冲区实现,只需要改这一个文件。
pub struct TextBuffer {
    rope: Rope,
}

impl TextBuffer {
    /// 创建一个空缓冲区(用于新建的空白标签)
    pub fn new() -> Self {
        Self { rope: Rope::new() }
    }

    /// 从已有字符串创建缓冲区(用于打开已有文件)
    pub fn from_str(text: &str) -> Self {
        Self {
            rope: Rope::from_str(text),
        }
    }

    /// 在指定字符位置插入文本
    pub fn insert(&mut self, char_idx: usize, text: &str) {
        self.rope.insert(char_idx, text);
    }

    /// 删除 [start, end) 区间内的字符
    pub fn remove(&mut self, start: usize, end: usize) {
        self.rope.remove(start..end);
    }

    /// 导出完整文本内容(用于写入磁盘或显示到 UI)
    pub fn to_string(&self) -> String {
        self.rope.to_string()
    }

    /// 当前字符总数
    pub fn len_chars(&self) -> usize {
        self.rope.len_chars()
    }

    /// 是否为空
    pub fn is_empty(&self) -> bool {
        self.rope.len_chars() == 0
    }
}

impl Default for TextBuffer {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_insert_and_export() {
        let mut buf = TextBuffer::new();
        buf.insert(0, "hello");
        assert_eq!(buf.to_string(), "hello");
    }

    #[test]
    fn test_remove() {
        let mut buf = TextBuffer::from_str("hello world");
        buf.remove(5, 11);
        assert_eq!(buf.to_string(), "hello");
    }
}
