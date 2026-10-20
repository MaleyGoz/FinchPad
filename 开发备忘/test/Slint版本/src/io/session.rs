//! 会话持久化：记录"上次开了哪些标签"，以及未保存标签的内容缓存。
//!
//! 存储布局：
//!   <config_dir>/txt-editor/
//!     ├── session.json          ← 元数据
//!     └── cache/
//!         └── <tab-id>.data     ← 未保存/未命名标签的内容
//!
//! 加密留给未来：只需把 write_cache / read_cache 内部
//! 套上一层 crypto::encrypt / decrypt，接口不变。

use crate::io::crypto;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

const SESSION_VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TabSession {
    pub id: String,
    pub title: String,
    pub path: Option<PathBuf>,
    pub encoding: String,
    pub line_ending: String,
    pub is_dirty: bool,
    pub cursor_line: usize,
    pub cursor_column: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowSession {
    pub width: f32,
    pub height: f32,
    pub zoom: i32,
}

impl Default for WindowSession {
    fn default() -> Self {
        Self {
            width: 800.0,
            height: 600.0,
            zoom: 100,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub version: u32,
    pub tabs: Vec<TabSession>,
    pub active_index: usize,
    pub window: WindowSession,
}

impl Session {
    pub fn new() -> Self {
        Self {
            version: SESSION_VERSION,
            tabs: Vec::new(),
            active_index: 0,
            window: WindowSession::default(),
        }
    }
}

impl Default for Session {
    fn default() -> Self {
        Self::new()
    }
}

// ========== 路径 ==========

/// `<config_dir>/txt-editor/`
pub fn session_dir() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("txt-editor")
}

/// `session_dir()/session.json`
pub fn session_path() -> PathBuf {
    session_dir().join("session.json")
}

/// `session_dir()/cache/<id>.data`
pub fn cache_path(id: &str) -> PathBuf {
    session_dir().join("cache").join(format!("{id}.data"))
}

// ========== 读写 session.json ==========

/// 读取会话。失败时把原文件备份为 `session.json.bak` 并返回 None。
pub fn load() -> Option<Session> {
    let path = session_path();
    let bytes = fs::read(&path).ok()?;

    // 明文遗留（旧版本）：直接删掉，不迁移
    if !crypto::is_encrypted(&bytes) {
        let _ = fs::remove_file(&path);
        return None;
    }

    let Some(decrypted) = crypto::decrypt(&bytes) else {
        // 密文损坏 或 密钥变了 → 备份，避免下次反复读坏文件
        eprintln!("session 解密失败，已备份为 .bak");
        let _ = fs::rename(&path, path.with_extension("json.bak"));
        return None;
    };

    match serde_json::from_slice::<Session>(&decrypted) {
        Ok(session) => Some(session),
        Err(err) => {
            eprintln!("session 解析失败（{err}），已备份为 .bak");
            let _ = fs::rename(&path, path.with_extension("json.bak"));
            None
        }
    }
}

pub fn save(session: &Session) -> io::Result<()> {
    let dir = session_dir();
    fs::create_dir_all(&dir)?;
    let json =
        serde_json::to_vec_pretty(session).map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;
    let encrypted = crypto::encrypt(&json)
        .ok_or_else(|| io::Error::new(io::ErrorKind::Other, "缓存加密密钥不可用"))?;
    fs::write(session_path(), encrypted)
}

// ========== 内容缓存 ==========

pub fn write_cache(id: &str, content: &str) -> io::Result<()> {
    let path = cache_path(id);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let encrypted = crypto::encrypt(content.as_bytes())
        .ok_or_else(|| io::Error::new(io::ErrorKind::Other, "缓存加密密钥不可用"))?;
    fs::write(path, encrypted)
}

pub fn read_cache(id: &str) -> Option<String> {
    let bytes = fs::read(cache_path(id)).ok()?;
    let decrypted = crypto::decrypt(&bytes)?;
    String::from_utf8(decrypted).ok()
}

pub fn remove_cache(id: &str) {
    let _ = fs::remove_file(cache_path(id));
}

/// 清理 cache/ 目录下所有不在 `keep_ids` 里的缓存文件。
/// App 启动恢复完成后调用一次，删掉孤儿缓存。
/// 传空数组 `&[]` 表示清空所有缓存。
/// 未来加加密后，接口不变，只在 write_cache / read_cache 内部换实现。
pub fn cleanup_orphan_cache(keep_ids: &[String]) {
    let cache_dir = session_dir().join("cache");
    let Ok(entries) = fs::read_dir(&cache_dir) else {
        return;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        let Some(stem) = path.file_stem().and_then(|s| s.to_str()) else {
            continue;
        };
        if !keep_ids.iter().any(|id| id == stem) {
            let _ = fs::remove_file(&path);
        }
    }
}

// 抑制未使用警告：这些函数会在 app.rs 接线时被调用
#[allow(dead_code)]
fn _unused(_: &Path) {}
