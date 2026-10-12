//! 换行符检测与转换。
//!
//! 策略：
//!   - 读：检测文件里第一次出现的换行符
//!   - 内部：统一用 \n
//!   - 保存：把 \n 换回原换行符
//!   - 新建：跟随当前平台

/// 文本的换行符类型。
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LineEnding {
    /// Windows: \r\n
    Crlf,
    /// Unix / macOS: \n
    Lf,
    /// 老 Mac: \r（几乎绝迹）
    Cr,
}

impl LineEnding {
    /// 状态栏显示用的短标签。
    pub fn name(self) -> &'static str {
        match self {
            LineEnding::Crlf => "CRLF",
            LineEnding::Lf => "LF",
            LineEnding::Cr => "CR",
        }
    }

    /// 当前平台新建文件的默认换行符。
    pub fn platform_default() -> Self {
        #[cfg(windows)]
        {
            LineEnding::Crlf
        }
        #[cfg(not(windows))]
        {
            LineEnding::Lf
        }
    }

    /// 从持久化字符串还原；未知名称回退 LF。
    pub fn from_name(name: &str) -> Self {
        match name {
            "CRLF" => LineEnding::Crlf,
            "CR" => LineEnding::Cr,
            _ => LineEnding::Lf,
        }
    }
}

/// 从字节流检测换行符：取第一次出现的那个。
/// 无换行符时返回平台默认。
pub fn detect(bytes: &[u8]) -> LineEnding {
    for (i, &b) in bytes.iter().enumerate() {
        match b {
            b'\r' => {
                if bytes.get(i + 1) == Some(&b'\n') {
                    return LineEnding::Crlf;
                }
                return LineEnding::Cr;
            }
            b'\n' => return LineEnding::Lf,
            _ => {}
        }
    }
    LineEnding::platform_default()
}

/// 把文本里的 \r\n 和孤立 \r 都统一成 \n（读文件时用）。
pub fn normalize(text: &str) -> String {
    if !text.contains('\r') {
        return text.to_string();
    }
    text.replace("\r\n", "\n").replace('\r', "\n")
}

/// 把内部统一的 \n 转换成目标换行符（写文件时用）。
pub fn apply(text: &str, ending: LineEnding) -> String {
    match ending {
        LineEnding::Lf => text.to_string(),
        LineEnding::Crlf => text.replace('\n', "\r\n"),
        LineEnding::Cr => text.replace('\n', "\r"),
    }
}
