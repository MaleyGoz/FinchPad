//! UI 组件层。

pub mod dialog;
pub mod editor_view;
pub mod status_bar;
pub mod tab_bar;

use iced::Color;
use iced_code_editor::theme::Style;

// ===== 全局配色 =====
pub const UI_BG: Color = Color::from_rgb(0.93, 0.94, 0.96); // 标签栏 / 状态栏 / 行号栏
pub const TAB_ACTIVE_BG: Color = Color::WHITE; // 激活标签
pub const TAB_HOVER_BG: Color = Color::from_rgb(0.87, 0.89, 0.92);
pub const TEXT_PRIMARY: Color = Color::from_rgb(0.15, 0.15, 0.18);
pub const TEXT_SECONDARY: Color = Color::from_rgb(0.45, 0.45, 0.50); // 状态栏文字 / 行号文字
pub const TEXT_DIRTY: Color = Color::from_rgb(0.85, 0.55, 0.10);
pub const BORDER_COLOR: Color = Color::from_rgb(0.82, 0.84, 0.87);
pub const OVERLAY: Color = Color::from_rgba(0.0, 0.0, 0.0, 0.3);

// ===== 编辑器专属配色 =====
pub const EDITOR_BG: Color = Color::WHITE; // 编辑区背景
pub const EDITOR_TEXT: Color = Color::BLACK; // 编辑区文字（纯黑）
pub const EDITOR_CURRENT_LINE: Color = Color::from_rgb(0.97, 0.98, 1.00); // 当前行浅蓝
pub const SCROLLBAR_BG: Color = Color::from_rgb(0.95, 0.95, 0.96);
pub const SCROLLER_COLOR: Color = Color::from_rgb(0.78, 0.79, 0.82);

/// 编辑器主题。
/// 行号栏背景与 UI_BG 一致，行号文字与 TEXT_SECONDARY 一致 → 与状态栏呼应。
/// 编辑器主题。
/// - 行号栏背景 = UI_BG，行号文字 = TEXT_SECONDARY → 与状态栏呼应
/// - 空格圆点 / 缩进引导线刻意调得极淡 → 不干扰阅读
pub fn editor_theme() -> Style {
    Style {
        // ===== 编辑区 =====
        background: EDITOR_BG,   // 白
        text_color: EDITOR_TEXT, // 近黑

        // ===== 行号栏 =====
        gutter_background: UI_BG,          // 浅灰（和状态栏一致）
        gutter_border: BORDER_COLOR,       // 分隔线
        line_number_color: TEXT_SECONDARY, // 中灰，不抢眼

        // ===== 滚动条 =====
        scrollbar_background: SCROLLBAR_BG,
        scroller_color: SCROLLER_COLOR,

        // ===== 当前行高亮 =====
        current_line_highlight: EDITOR_CURRENT_LINE, // 极淡蓝

        // ===== 空格 / Tab 可见字符 =====
        // 调成接近背景色 —— 视觉上"看不见"，但仍保留功能
        whitespace_color: Color::from_rgb(0.93, 0.93, 0.95),

        // ===== 缩进引导线 =====
        // 同样调淡，只留一丝轮廓
        indent_guide_color: Color::from_rgb(0.90, 0.91, 0.93),

        // ===== 搜索匹配 =====
        search_match_color: Color::from_rgb(1.00, 0.95, 0.60), // 淡黄
        search_match_current_color: Color::from_rgb(1.00, 0.80, 0.30), // 深黄

        // ===== 选区 =====
        selection_color: Color::from_rgb(0.75, 0.85, 1.00), // 淡蓝

        // ===== 括号匹配 =====
        bracket_match_color: Color::from_rgb(0.80, 0.90, 1.00), // 淡蓝

        // ===== IME 预编辑背景（中文输入法候选词组字区域）=====
        ime_preedit_background_color: Color::from_rgb(0.95, 0.95, 1.00), // 极淡紫
    }
}
