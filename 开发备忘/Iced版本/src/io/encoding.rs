//! 文本编码检测与转换：字节流 ↔ String
//!
//! 检测顺序：
//!   1. BOM（UTF-8 / UTF-16 LE / UTF-16 BE）
//!   2. 严格 UTF-8 解码
//!   3. chardetng 全球编码检测
//!      （GBK / GB18030 / Big5 / Shift_JIS / EUC-JP / EUC-KR /
//!        ISO-8859-x / windows-125x / KOI8-R / KOI8-U / IBM866 / macintosh …）

use encoding_rs::{Encoding, UTF_8, UTF_16BE, UTF_16LE};

/// 编辑器识别出的文本编码。
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TextEncoding {
    Utf8,
    Utf8Bom,
    Utf16Le,
    Utf16Be,
    /// 其它所有编码，由 encoding_rs 提供。覆盖全球主要字符集。
    Other(&'static Encoding),
}

impl TextEncoding {
    /// 标准名称，用于状态栏显示与持久化。
    pub fn name(&self) -> &'static str {
        match self {
            TextEncoding::Utf8 => "UTF-8",
            TextEncoding::Utf8Bom => "UTF-8 BOM",
            TextEncoding::Utf16Le => "UTF-16 LE",
            TextEncoding::Utf16Be => "UTF-16 BE",
            TextEncoding::Other(e) => e.name(),
        }
    }

    /// 从持久化字符串还原；未知名称回退 UTF-8。
    pub fn from_name(name: &str) -> Self {
        match name {
            "UTF-8" => TextEncoding::Utf8,
            "UTF-8 BOM" => TextEncoding::Utf8Bom,
            "UTF-16 LE" => TextEncoding::Utf16Le,
            "UTF-16 BE" => TextEncoding::Utf16Be,
            other => Encoding::for_label(other.as_bytes())
                .map(TextEncoding::Other)
                .unwrap_or(TextEncoding::Utf8),
        }
    }
}

/// 字节流 → String，并返回检测到的编码。
pub fn decode(bytes: &[u8]) -> (String, TextEncoding) {
    // 1. BOM 优先，绝对可信
    if let Some((enc, bom_len)) = Encoding::for_bom(bytes) {
        let text = enc.decode(&bytes[bom_len..]).0.into_owned();
        let tag = if enc == UTF_8 {
            TextEncoding::Utf8Bom
        } else if enc == UTF_16LE {
            TextEncoding::Utf16Le
        } else if enc == UTF_16BE {
            TextEncoding::Utf16Be
        } else {
            TextEncoding::Other(enc)
        };
        return (text, tag);
    }

    // 2. 严格 UTF-8：通过即认定。短 ASCII 文本靠这步避免被误判
    if let Ok(s) = std::str::from_utf8(bytes) {
        return (s.to_owned(), TextEncoding::Utf8);
    }

    // 3. chardetng 猜全球编码
    let mut detector = chardetng::EncodingDetector::new();
    detector.feed(bytes, true);
    let enc = detector.guess(None, true);

    let text = enc.decode(bytes).0.into_owned();
    (text, TextEncoding::Other(enc))
}

/// String → 字节流，按指定编码写出（BOM 会按需补上）。
pub fn encode(text: &str, encoding: TextEncoding) -> Vec<u8> {
    match encoding {
        TextEncoding::Utf8 => text.as_bytes().to_vec(),

        TextEncoding::Utf8Bom => {
            let mut v = Vec::with_capacity(3 + text.len());
            v.extend_from_slice(&[0xEF, 0xBB, 0xBF]);
            v.extend_from_slice(text.as_bytes());
            v
        }

        TextEncoding::Utf16Le => {
            let mut v = Vec::with_capacity(2 + text.len() * 2);
            v.extend_from_slice(&[0xFF, 0xFE]);
            for u in text.encode_utf16() {
                v.extend_from_slice(&u.to_le_bytes());
            }
            v
        }

        TextEncoding::Utf16Be => {
            let mut v = Vec::with_capacity(2 + text.len() * 2);
            v.extend_from_slice(&[0xFE, 0xFF]);
            for u in text.encode_utf16() {
                v.extend_from_slice(&u.to_be_bytes());
            }
            v
        }

        TextEncoding::Other(enc) => enc.encode(text).0.into_owned(),
    }
}

/// 目标编码能否无损表示这段文本。
/// 保存前检查：false 表示有字符会被写成 '?' 或 U+FFFD。
pub fn can_encode(text: &str, encoding: TextEncoding) -> bool {
    match encoding {
        TextEncoding::Utf8
        | TextEncoding::Utf8Bom
        | TextEncoding::Utf16Le
        | TextEncoding::Utf16Be => true,
        TextEncoding::Other(enc) => {
            let (bytes, _, _) = enc.encode(text);
            let (decoded, _, _) = enc.decode(&bytes);
            decoded == text
        }
    }
}
