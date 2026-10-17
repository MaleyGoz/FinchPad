//! 缓存加密（AES-256-GCM）。
//!
//! 密钥加载策略：
//!   - macOS: 完全绕过系统钥匙串，强制使用 `<config>/finchpad/key.bin`，消除钥匙串弹窗。
//!   - Windows / Linux: 
//!     1. 从 OS keyring 读取
//!     2. 从 `<config>/finchpad/key.bin` 读取
//!     3. 都没有 → 生成 32 字节随机密钥，先试 keyring，失败则写 key.bin
//!
//! 密文格式：
//!   [magic "TXTC" 4B][version 1B][nonce 12B][AES-GCM 密文+tag]

use aes_gcm::aead::{rand_core::RngCore, Aead, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Key, Nonce};
use std::cell::RefCell;
use std::fs;
use std::path::PathBuf;

const MAGIC: &[u8; 4] = b"TXTC";
const VERSION: u8 = 1;
const NONCE_LEN: usize = 12;
const KEY_LEN: usize = 32;
const KEYRING_SERVICE: &str = "finchpad";
const KEYRING_USER: &str = "cache-key";

thread_local! {
    /// 进程级密钥缓存：
    ///   None           = 还没尝试加载
    ///   Some(None)     = 加载失败（禁用 cache）
    ///   Some(Some(k))  = 加载成功
    static KEY_CACHE: RefCell<Option<Option<[u8; KEY_LEN]>>> = const { RefCell::new(None) };
}

fn key_path() -> PathBuf {
    crate::io::session::session_dir().join("key.bin")
}

// ============ 密钥加载/生成 ============

// ==========================================
// Windows / Linux 专属：保留原有的 Keyring 优先策略
// ==========================================
#[cfg(not(target_os = "macos"))]
fn load_or_create_key() -> Option<[u8; KEY_LEN]> {
    // 1. 优先 keyring
    match keyring_get() {
        Ok(Some(k)) => return Some(k),
        Ok(None) => {}
        Err(e) => eprintln!("keyring 读取失败：{e}"),
    }

    // 2. 尝试 key.bin
    if let Some(k) = file_get() {
        // keyring 之前失败，尝试补写一次（不阻塞）
        let _ = keyring_set(&k);
        return Some(k);
    }

    // 3. 全新生成
    let mut k = [0u8; KEY_LEN];
    OsRng.fill_bytes(&mut k);

    if keyring_set(&k).is_ok() {
        return Some(k);
    }
    if file_set(&k).is_ok() {
        return Some(k);
    }

    eprintln!("警告：无法生成或保存加密密钥，缓存功能已禁用");
    None
}

// ==========================================
// macOS 专属：绕过 Keyring，只使用私有目录文件密钥
// ==========================================
#[cfg(target_os = "macos")]
fn load_or_create_key() -> Option<[u8; KEY_LEN]> {
    // 1. 尝试读取本地私有文件 key.bin
    if let Some(k) = file_get() {
        return Some(k);
    }

    // 2. 文件不存在或损坏（用户手动删除等），重新生成
    eprintln!("macOS: 密钥文件不存在，正在生成新的本地密钥...");
    let mut k = [0u8; KEY_LEN];
    OsRng.fill_bytes(&mut k);

    if file_set(&k).is_ok() {
        return Some(k);
    }

    eprintln!("警告：无法生成或保存加密密钥，缓存功能已禁用");
    None
}

// ============ Keyring 操作（仅限非 Mac 平台） ============

#[cfg(not(target_os = "macos"))]
fn keyring_get() -> Result<Option<[u8; KEY_LEN]>, keyring::Error> {
    let entry = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER)?;
    match entry.get_password() {
        Ok(s) => {
            let Some(bytes) = hex_decode(&s) else {
                return Ok(None);
            };
            if bytes.len() != KEY_LEN {
                return Ok(None);
            }
            let mut k = [0u8; KEY_LEN];
            k.copy_from_slice(&bytes);
            Ok(Some(k))
        }
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e),
    }
}

#[cfg(not(target_os = "macos"))]
fn keyring_set(key: &[u8; KEY_LEN]) -> Result<(), keyring::Error> {
    let entry = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER)?;
    entry.set_password(&hex_encode(key))
}

// ============ 本地文件操作（全平台通用） ============

fn file_get() -> Option<[u8; KEY_LEN]> {
    let bytes = fs::read(key_path()).ok()?;
    if bytes.len() != KEY_LEN {
        return None;
    }
    let mut k = [0u8; KEY_LEN];
    k.copy_from_slice(&bytes);
    Some(k)
}

fn file_set(key: &[u8; KEY_LEN]) -> std::io::Result<()> {
    let path = key_path();
    if let Some(p) = path.parent() {
        fs::create_dir_all(p)?;
    }
    fs::write(&path, key)?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&path, fs::Permissions::from_mode(0o600));
    }
    Ok(())
}

/// 获取密钥（带进程级缓存）。None 表示密钥不可用，调用方应禁用 cache。
pub fn get_key() -> Option<[u8; KEY_LEN]> {
    KEY_CACHE.with(|cache| {
        let mut c = cache.borrow_mut();
        if let Some(k) = *c {
            return k;
        }
        let k = load_or_create_key();
        *c = Some(k);
        k
    })
}

// ============ 加解密 ============

/// 加密。返回 `[magic][version][nonce][ciphertext+tag]`。
/// 密钥不可用时返回 None。
pub fn encrypt(plaintext: &[u8]) -> Option<Vec<u8>> {
    let key = get_key()?;
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key));

    let mut nonce_bytes = [0u8; NONCE_LEN];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, plaintext).ok()?;

    let mut out = Vec::with_capacity(4 + 1 + NONCE_LEN + ciphertext.len());
    out.extend_from_slice(MAGIC);
    out.push(VERSION);
    out.extend_from_slice(&nonce_bytes);
    out.extend_from_slice(&ciphertext);
    Some(out)
}

/// 解密。失败（magic 不匹配、版本不符、密钥不可用、认证失败）返回 None。
pub fn decrypt(data: &[u8]) -> Option<Vec<u8>> {
    if data.len() < 4 + 1 + NONCE_LEN {
        return None;
    }
    if &data[0..4] != MAGIC {
        return None;
    }
    if data[4] != VERSION {
        return None;
    }
    let nonce_bytes = &data[5..5 + NONCE_LEN];
    let ciphertext = &data[5 + NONCE_LEN..];

    let key = get_key()?;
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key));
    let nonce = Nonce::from_slice(nonce_bytes);
    cipher.decrypt(nonce, ciphertext).ok()
}

/// 判断一段字节是否是我们的加密格式（用于区分"明文遗留"和"密文损坏"）。
pub fn is_encrypted(data: &[u8]) -> bool {
    data.len() >= 5 && &data[0..4] == MAGIC && data[4] == VERSION
}

// ============ hex 编解码（用于 keyring 存储） ============

#[cfg(not(target_os = "macos"))]
fn hex_encode(bytes: &[u8]) -> String {
    use std::fmt::Write;
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        let _ = write!(s, "{:02x}", b);
    }
    s
}

#[cfg(not(target_os = "macos"))]
fn hex_decode(s: &str) -> Option<Vec<u8>> {
    if s.len() % 2 != 0 {
        return None;
    }
    (0..s.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&s[i..i + 2], 16).ok())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip() {
        let plain = b"hello, TXT";
        let enc = encrypt(plain).expect("encrypt");
        assert_ne!(&enc[..], plain); // 密文和明文不同
        assert_eq!(enc[0..4], *MAGIC); // magic 正确
        let dec = decrypt(&enc).expect("decrypt");
        assert_eq!(&dec[..], plain);
    }

    #[test]
    fn decrypt_rejects_garbage() {
        assert!(decrypt(b"not encrypted").is_none());
        assert!(decrypt(&[]).is_none());
    }
}