use crate::io::encoding::{self, TextEncoding};
use crate::io::line_ending::{self, LineEnding};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

/// 读取文件内容，自动检测编码和换行符。
/// 返回 (内容, 编码, 换行符, mtime)。内容里的换行已统一为 \n。
pub fn read_file(path: &Path) -> io::Result<(String, TextEncoding, LineEnding, SystemTime)> {
    let bytes = fs::read(path)?;
    let (content, encoding) = encoding::decode(&bytes);
    let ending = line_ending::detect(&bytes);
    let content = line_ending::normalize(&content);
    let mtime = fs::metadata(path)?.modified()?;
    Ok((content, encoding, ending, mtime))
}

/// 先写同目录临时文件，再替换目标文件。
/// 内容里的 \n 会被转换成指定的换行符，再按指定编码写出。
pub fn write_file(
    path: &Path,
    content: &str,
    encoding: TextEncoding,
    line_ending: LineEnding,
) -> io::Result<SystemTime> {
    let parent = path.parent().unwrap_or_else(|| Path::new("."));
    let name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("untitled.txt");

    let temp_path = parent.join(format!(".{}.txt-editor-{}.tmp", name, std::process::id()));

    let text = line_ending::apply(content, line_ending);
    let bytes = encoding::encode(&text, encoding);
    fs::write(&temp_path, &bytes)?;

    #[cfg(windows)]
    {
        if path.exists() {
            fs::remove_file(path)?;
        }
    }

    if let Err(error) = fs::rename(&temp_path, path) {
        let _ = fs::remove_file(&temp_path);
        return Err(error);
    }

    fs::metadata(path)?.modified()
}

/// 返回用于比较的规范化路径。
pub fn normalize_path(path: &Path) -> PathBuf {
    let path = fs::canonicalize(path).unwrap_or_else(|_| path.to_path_buf());

    #[cfg(windows)]
    {
        PathBuf::from(path.to_string_lossy().to_lowercase())
    }

    #[cfg(not(windows))]
    {
        path
    }
}

pub fn same_path(left: &Path, right: &Path) -> bool {
    normalize_path(left) == normalize_path(right)
}

pub fn file_mtime(path: &Path) -> io::Result<SystemTime> {
    fs::metadata(path)?.modified()
}

pub fn pick_open_path() -> Option<PathBuf> {
    rfd::FileDialog::new()
        .add_filter("所有文件", &["*"])
        .add_filter("文本文件", &["txt"])
        .pick_file()
}

pub fn pick_open_paths() -> Vec<PathBuf> {
    rfd::FileDialog::new()
        .add_filter("所有文件", &["*"])
        .add_filter("文本文件", &["txt"])
        .pick_files()
        .unwrap_or_default()
}

pub fn pick_save_path(default_name: &str) -> Option<PathBuf> {
    let ext = Path::new(default_name)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("txt")
        .to_string();

    let filter_label = format!("{} 文件 (*.{})", ext.to_uppercase(), ext);

    rfd::FileDialog::new()
        .set_file_name(default_name)
        .add_filter(&filter_label, &[ext.as_str()])
        .add_filter("所有文件", &["*"])
        .save_file()
}
