use crate::app::AppState;
use encoding_rs::Encoding;
use tauri::Manager;

// 大文件独立窗口
#[tauri::command]
pub async fn open_large_file_window(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    path: String,
    theme_background_color: String, // ★ 前端传来的背景色
) -> Result<(), String> {
    use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

    // ==========================================
    // 1. 检查文件是否存在（第一道防线，绝不能被吃）
    // ==========================================
    if !std::path::Path::new(&path).exists() {
        return Err("FileNotFound".to_string()); // ★ 只返回错误码
    }

    // ==========================================
    // 2. 检查是否已经打开过该文件（去重聚焦）
    // ==========================================
    {
        let map = state.large_file_paths.lock().map_err(|e| e.to_string())?;
        if let Some((existing_label, _)) = map.iter().find(|(_, p)| **p == path) {
            if let Some(window) = app.get_webview_window(existing_label) {
                let _ = window.set_focus();
                let _ = window.unminimize();
                return Ok(());
            }
        }
    }

    // ==========================================
    // 3. 获取当前主界面的主题和语言
    // ==========================================
    let (theme, locale) = {
        let ws = state.workspace.lock().map_err(|e| e.to_string())?;
        (ws.editor_bg().to_string(), ws.locale().to_string())
    };

    // ==========================================
    // 4. 生成唯一窗口标签并存入全局字典
    // ==========================================
    let window_label = format!("large_viewer_{}", uuid::Uuid::new_v4());
    {
        let mut map = state.large_file_paths.lock().map_err(|e| e.to_string())?;
        map.insert(window_label.clone(), path.clone());
    }

    // ==========================================
    // 5. 动态生成标题与拼接 URL
    // ==========================================
    let view_text = if locale.starts_with("zh") {
        "极速查看"
    } else {
        "Quick View"
    };
    let window_title = format!("{} - FinchPad {}", path, view_text);

    let url = format!(
        "/?mode=large_viewer&id={}&theme={}&locale={}",
        window_label, theme, locale
    );

    let app_clone = app.clone();
    let label_clone = window_label.clone();

    // ==========================================
    // 6. 创建窗口（隐藏状态，防止白屏）
    // ==========================================
    // 6.1 先创建 builder，保留所有公共配置（绝对不影响 Win/Linux）
    #[allow(unused_mut)]
    let mut builder = WebviewWindowBuilder::new(&app, &window_label, WebviewUrl::App(url.into()))
        .title(window_title)
        .inner_size(1000.0, 700.0)
        .min_inner_size(600.0, 400.0)
        .theme(if theme == "dark" {
            Some(tauri::Theme::Dark)
        } else {
            Some(tauri::Theme::Light)
        })
        .background_color(parse_hex_color(&theme_background_color))
        .visible(false);

    // ★ Windows/Linux：彻底无边框
    #[cfg(not(target_os = "macos"))]
    {
        builder = builder.decorations(false);
    }

    // 6.2 ★ macOS：恢复原生装饰（必须为 true，红绿灯才会出来），并悬浮在内容上
    #[cfg(target_os = "macos")]
    {
        builder = builder.decorations(true);
        builder = builder.title_bar_style(tauri::TitleBarStyle::Overlay);
        builder = builder.hidden_title(true);
    }

    // 6.3 最后构建并显示窗口
    let window = builder.build().map_err(|e| e.to_string())?;

    // ==========================================
    // 7. 窗口销毁时的清理逻辑
    // ==========================================
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::Destroyed = event {
            if let Some(state) = app_clone.try_state::<AppState>() {
                if let Ok(mut map) = state.large_file_paths.lock() {
                    map.remove(&label_clone);
                }
            }
        }
    });

    Ok(())
}

// 获取大文件路径
#[tauri::command]
pub fn get_large_file_path(
    state: tauri::State<'_, AppState>,
    window_id: String,
) -> Result<String, String> {
    let map = state.large_file_paths.lock().map_err(|e| e.to_string())?;
    map.get(&window_id)
        .cloned()
        .ok_or_else(|| "未找到该窗口的大文件路径".to_string())
}

#[derive(serde::Serialize)]
pub struct ChunkResult {
    pub content: String,
    pub total_lines: usize, // 返回读取到的实际行数，0 表示到了文件末尾
}

// 大文件流式读取
#[tauri::command]
pub fn read_large_chunk(
    path: String,
    start_line: usize,
    lines_count: usize,
    encoding: Option<String>,
) -> Result<ChunkResult, String> {
    use std::fs::File;
    use std::io::{BufRead, BufReader};

    let file = File::open(&path).map_err(|e| format!("打开文件失败: {}", e))?;
    let mut reader = BufReader::new(file);

    // ★ 恢复为直接匹配编码，前端保证不传 "Auto" 进来
    let enc = encoding
        .as_deref()
        .and_then(|name| Encoding::for_label(name.as_bytes()))
        .unwrap_or(encoding_rs::UTF_8);

    let mut result = String::new();
    let mut current_line = 0;
    let mut read_count = 0;
    let mut buf = Vec::new();

    loop {
        buf.clear();
        let bytes_read = reader
            .read_until(b'\n', &mut buf)
            .map_err(|e| e.to_string())?;
        if bytes_read == 0 {
            break;
        }

        if current_line >= start_line {
            let (decoded, _, _) = enc.decode(&buf);
            result.push_str(&decoded);
            read_count += 1;
            if read_count >= lines_count {
                break;
            }
        }
        current_line += 1;
    }

    Ok(ChunkResult {
        content: result,
        total_lines: read_count,
    })
}

// 大文件流式搜索
#[derive(serde::Serialize)]
pub struct SearchResult {
    pub line_number: usize,
    pub content: String,
}

#[derive(serde::Serialize)]
pub struct SearchResponse {
    pub results: Vec<SearchResult>,
    pub is_limit_reached: bool,
}

#[tauri::command]
pub fn search_in_large_file(
    path: String,
    keyword: String,
    encoding: Option<String>,
) -> Result<SearchResponse, String> {
    use std::fs::File;
    use std::io::{BufRead, BufReader};

    if keyword.is_empty() {
        return Ok(SearchResponse {
            results: vec![],
            is_limit_reached: false,
        });
    }

    let file = File::open(&path).map_err(|e| format!("打开文件失败: {}", e))?;
    let mut reader = BufReader::new(file);

    let enc = encoding
        .as_deref()
        .and_then(|name| Encoding::for_label(name.as_bytes()))
        .unwrap_or(encoding_rs::UTF_8);

    let mut results = Vec::new();
    let mut current_line = 0;
    let limit = 100;
    let mut is_limit_reached = false;
    let mut buf = Vec::new();

    loop {
        buf.clear();
        let bytes_read = reader
            .read_until(b'\n', &mut buf)
            .map_err(|e| e.to_string())?;
        if bytes_read == 0 {
            break;
        }
        current_line += 1;

        let (decoded, _, _) = enc.decode(&buf);
        let line_str = decoded.trim_end_matches(['\r', '\n']);

        if line_str.contains(&keyword) {
            // ★ 核心修复：先判断字节长度，再用 chars().take() 按“字符”安全截断，防止汉字被切断导致 Panic
            let content = if line_str.len() > 200 {
                let truncated: String = line_str.chars().take(200).collect();
                format!("{}...", truncated)
            } else {
                line_str.to_string()
            };

            results.push(SearchResult {
                line_number: current_line,
                content,
            });

            if results.len() >= limit {
                is_limit_reached = true;
                break;
            }
        }
    }

    Ok(SearchResponse {
        results,
        is_limit_reached,
    })
}

// 获取文件编码
#[tauri::command]
pub fn get_file_encoding(path: String) -> Result<String, String> {
    use std::fs::File;
    use std::io::Read;

    let mut file = File::open(&path).map_err(|e| e.to_string())?;
    // 读取前 1MB 用于探测，对 chardetng 足够了
    let mut buf = vec![0; 1024 * 1024];
    let bytes_read = file.read(&mut buf).map_err(|e| e.to_string())?;
    buf.truncate(bytes_read);

    let mut detector = chardetng::EncodingDetector::new();
    detector.feed(&buf, true);
    let encoding = detector.guess(None, true);

    Ok(encoding.name().to_string())
}

// 解析主题颜色
fn parse_hex_color(hex: &str) -> tauri::window::Color {
    let hex = hex.trim_start_matches('#');
    if hex.len() == 6 {
        if let (Ok(r), Ok(g), Ok(b)) = (
            u8::from_str_radix(&hex[0..2], 16),
            u8::from_str_radix(&hex[2..4], 16),
            u8::from_str_radix(&hex[4..6], 16),
        ) {
            return tauri::window::Color(r, g, b, 255);
        }
    }
    tauri::window::Color(255, 255, 255, 255)
}

// 获取大文件的行数
#[tauri::command]
pub fn count_large_file_lines(path: String) -> Result<usize, String> {
    use std::fs::File;
    use std::io::{BufRead, BufReader};

    let file = File::open(&path).map_err(|e| e.to_string())?;
    let mut reader = BufReader::with_capacity(1024 * 1024, file); // 1MB 缓冲区，飞速读取
    let mut buf = Vec::new();
    let mut count = 0;

    loop {
        buf.clear();
        let bytes_read = reader
            .read_until(b'\n', &mut buf)
            .map_err(|e| e.to_string())?;
        if bytes_read == 0 {
            break;
        }
        count += 1;
    }

    Ok(count)
}
