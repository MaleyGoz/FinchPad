use crate::io::encoding::{self, TextEncoding};
use crate::io::line_ending::{self, LineEnding};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

pub fn read_file(path: &Path) -> io::Result<(String, TextEncoding, LineEnding, SystemTime)> {
    let bytes = fs::read(path)?;
    let (content, encoding) = encoding::decode(&bytes);
    let ending = line_ending::detect(&bytes);
    let content = line_ending::normalize(&content);
    let mtime = fs::metadata(path)?.modified()?;
    Ok((content, encoding, ending, mtime))
}

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

    let temp_path = parent.join(format!(".{}.finchpad-{}.tmp", name, std::process::id()));

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
