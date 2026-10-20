//! Tooltip 尺寸估算。
//!
//! Windows 上使用 GDI 精确测量（和现有行为一致）；
//! 其它平台使用字符串长度估算（不需要额外的文本测量依赖）。

/// 估算 tooltip 大小。所有平台共用此接口。
pub fn estimate_tooltip_size(path: &str) -> (f32, f32) {
    #[cfg(windows)]
    {
        windows_impl::estimate(path)
    }
    #[cfg(not(windows))]
    {
        fallback_impl::estimate(path)
    }
}

// ============ Windows：GDI 精确测量 ============

#[cfg(windows)]
mod windows_impl {
    use windows::{
        Win32::Foundation::RECT,
        Win32::Graphics::Gdi::{
            CreateFontIndirectW, DeleteObject, DrawTextExW, GetDC, ReleaseDC, SelectObject,
            DT_CALCRECT, DT_NOPREFIX, DT_WORDBREAK, FONT_CHARSET, FONT_CLIP_PRECISION,
            FONT_OUTPUT_PRECISION, FONT_QUALITY, HDC, HFONT, HGDIOBJ, LOGFONTW,
        },
    };

    const MIN_WIDTH: f32 = 180.0;
    const MAX_WIDTH: f32 = 520.0;
    const MIN_HEIGHT: f32 = 32.0;
    const X_PADDING: f32 = 16.0;
    const Y_PADDING: f32 = 10.0;

    fn create_tooltip_font() -> Option<(HDC, HFONT, HGDIOBJ)> {
        let hdc = unsafe { GetDC(None) };
        if hdc.is_invalid() {
            return None;
        }

        let mut lf = LOGFONTW {
            lfHeight: -12,
            lfWidth: 0,
            lfEscapement: 0,
            lfOrientation: 0,
            lfWeight: 400,
            lfItalic: 0,
            lfUnderline: 0,
            lfStrikeOut: 0,
            lfCharSet: FONT_CHARSET(1),
            lfOutPrecision: FONT_OUTPUT_PRECISION(0),
            lfClipPrecision: FONT_CLIP_PRECISION(0),
            lfQuality: FONT_QUALITY(0),
            lfPitchAndFamily: 0,
            lfFaceName: [0; 32],
        };

        let face = "Segoe UI";
        let face_utf16: Vec<u16> = face.encode_utf16().collect();
        let len = face_utf16.len().min(31);
        let mut face_array = [0u16; 32];
        face_array[..len].copy_from_slice(&face_utf16[..len]);
        lf.lfFaceName = face_array;

        let hfont = unsafe { CreateFontIndirectW(&lf) };
        if hfont.is_invalid() {
            unsafe { ReleaseDC(None, hdc) };
            return None;
        }

        let old_font = unsafe { SelectObject(hdc, hfont) };
        if old_font.is_invalid() {
            unsafe {
                let _ = DeleteObject(hfont);
                ReleaseDC(None, hdc);
            }
            return None;
        }

        Some((hdc, hfont, old_font))
    }

    pub fn estimate(path: &str) -> (f32, f32) {
        let Some((hdc, hfont, old_font)) = create_tooltip_font() else {
            return (MIN_WIDTH, MIN_HEIGHT);
        };

        let mut rect = RECT {
            left: 0,
            top: 0,
            right: MAX_WIDTH as i32,
            bottom: 0,
        };

        let mut text = path.to_owned();
        text.push('\0');
        let mut utf16: Vec<u16> = text.encode_utf16().collect();

        unsafe {
            DrawTextExW(
                hdc,
                &mut utf16,
                &mut rect,
                DT_CALCRECT | DT_WORDBREAK | DT_NOPREFIX,
                None,
            );
        }

        let measured_width = (rect.right - rect.left) as f32;
        let measured_height = (rect.bottom - rect.top) as f32;

        unsafe {
            SelectObject(hdc, old_font);
            let _ = DeleteObject(hfont);
            ReleaseDC(None, hdc);
        }

        let width = (measured_width + X_PADDING * 2.0).clamp(MIN_WIDTH, MAX_WIDTH);
        let height = (measured_height + Y_PADDING * 2.0).max(MIN_HEIGHT);
        (width, height)
    }
}

// ============ 非 Windows：字符串长度估算 ============

#[cfg(not(windows))]
mod fallback_impl {
    pub fn estimate(path: &str) -> (f32, f32) {
        const MIN_WIDTH: f32 = 180.0;
        const MAX_WIDTH: f32 = 520.0;
        const MIN_HEIGHT: f32 = 32.0;

        // 粗略估算：ASCII 字符约 7px，非 ASCII（CJK 等）约 14px
        let width: f32 = path
            .chars()
            .map(|c| if c.is_ascii() { 7.0 } else { 14.0 })
            .sum::<f32>()
            + 32.0;

        let w = width.clamp(MIN_WIDTH, MAX_WIDTH);
        (w, MIN_HEIGHT)
    }
}
