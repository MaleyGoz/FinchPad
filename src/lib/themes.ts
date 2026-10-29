// 主题文件：统一颜色规范，优化辅助文字可读性与交互反馈
// 支持平台：Windows、Linux、macOS
// 白色、灰色主题的标签栏统一采用原 macOS 配色，不再区分操作系统。

import { writable } from "svelte/store";

export type Theme = {
    // 编辑区
    editor_background: string;
    editor_foreground: string;
    editor_cursor: string;
    editor_selection: string;
    gutter_background: string;
    gutter_foreground: string;
    gutter_foreground_active: string;

    // 标签栏
    tab_bar_background: string;
    tab_bar_background_inactive: string;
    tab_background_active: string;
    tab_foreground: string;
    tab_foreground_active: string;
    tab_border: string;

    // 状态栏
    status_bar_background: string;
    status_bar_foreground: string;
    status_bar_foreground_muted: string;

    // 浮层（菜单 / tooltip / 弹窗）
    overlay_background: string;
    overlay_foreground: string;
    overlay_foreground_muted: string;
    overlay_border: string;
    overlay_hover_background: string;
    overlay_divider: string;

    // 通用
    accent: string;
    warning: string;
    warning_strong: string;

    // 滚动条
    scrollbar_slider: string;
    scrollbar_slider_hover: string;
};

export const THEMES: Record<string, Theme> = {
    // ==================================================
    // White：白色主题
    // ==================================================
    white: {
        // 编辑区：保留原有配色
        editor_background: "#FFFFFF",
        editor_foreground: "#000000",
        editor_cursor: "#000000",
        editor_selection: "#B3D7FF",

        // 行号栏：加深普通行号，提高辨识度
        gutter_background: "#F3F3F3",
        gutter_foreground: "#8A8A8A",
        gutter_foreground_active: "#666666",

        // 标签栏：统一采用原 macOS 配色
        tab_bar_background: "#E5E5EA",
        tab_bar_background_inactive: "#F2F2F2",
        tab_background_active: "#FFFFFF",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        // 状态栏：弱化文字不再过淡
        status_bar_background: "#F3F3F3",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#888888",

        // 浮层
        overlay_background: "#FFFFFF",
        overlay_foreground: "#222222",
        overlay_foreground_muted: "#777777",
        overlay_border: "#CCCCCC",
        overlay_hover_background: "#F0F0F0",
        overlay_divider: "#E0E0E0",

        // 通用
        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        // 滚动条
        scrollbar_slider: "#8b8b8b80",
        scrollbar_slider_hover: "#8b8b8bcc",
    },

    // ==================================================
    // Gray：灰色主题
    // ==================================================
    gray: {
        // 编辑区：保留原有配色
        editor_background: "#C0C0C0",
        editor_foreground: "#000000",
        editor_cursor: "#000000",
        editor_selection: "#9DA8B8",

        // 行号栏：保持层次，提高普通行号的辨识度
        gutter_background: "#e4e4e4",
        gutter_foreground: "#777777",
        gutter_foreground_active: "#444444",

        // 标签栏：统一采用原 macOS 配色
        tab_bar_background: "#B8B8B8",
        tab_bar_background_inactive: "#C8C8C8",
        tab_background_active: "#D9D9D9",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#A0A0A0",

        // 状态栏
        status_bar_background: "#e4e4e4",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#777777",

        // 浮层：修复悬停背景与普通背景相同的问题
        overlay_background: "#e4e4e4",
        overlay_foreground: "#000000",
        overlay_foreground_muted: "#666666",
        overlay_border: "#C0C0C0",
        overlay_hover_background: "#D6D6D6",
        overlay_divider: "#D0D0D0",

        // 通用
        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        // 滚动条
        scrollbar_slider: "#a0a0a080",
        scrollbar_slider_hover: "#888888cc",
    },

    // ==================================================
    // Sepia：米黄主题
    // ==================================================
    sepia: {
        // 编辑区：保留原有配色
        editor_background: "#FDF6E3",
        editor_foreground: "#3A4A52",
        editor_cursor: "#3A4A52",
        editor_selection: "#E8D9A8",

        // 行号栏：保持暖色氛围，提高普通行号的辨识度
        gutter_background: "#F0EAD8",
        gutter_foreground: "#938B7A",
        gutter_foreground_active: "#7A8A90",

        // 标签栏
        tab_bar_background: "#D8CDB8",
        tab_bar_background_inactive: "#E5DCC9",
        tab_background_active: "#FDF6E3",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        // 状态栏
        status_bar_background: "#F0EAD8",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#82796B",

        // 浮层：保留米黄色背景与暖色文字
        overlay_background: "#FDF6E3",
        overlay_foreground: "#3A4A52",
        overlay_foreground_muted: "#7B7160",
        overlay_border: "#D8CDB8",
        overlay_hover_background: "#F2EAD3",
        overlay_divider: "#E5DCC9",

        // 通用
        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        // 滚动条
        scrollbar_slider: "#d8cdb880",
        scrollbar_slider_hover: "#c0b59fcc",
    },

    // ==================================================
    // Green：护眼绿主题
    // ==================================================
    green: {
        // 编辑区：保留原有配色
        editor_background: "#CCE8CF",
        editor_foreground: "#1A3A1A",
        editor_cursor: "#1A3A1A",
        editor_selection: "#A8D8AE",

        // 行号栏：保留绿色倾向，提高普通行号的辨识度
        gutter_background: "#BEE0C2",
        gutter_foreground: "#628A67",
        gutter_foreground_active: "#4A7A4A",

        // 标签栏
        tab_bar_background: "#A8C5B0",
        tab_bar_background_inactive: "#C0D6C4",
        tab_background_active: "#CCE8CF",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        // 状态栏
        status_bar_background: "#BEE0C2",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#55775A",

        // 浮层
        overlay_background: "#F0F7F0",
        overlay_foreground: "#1A3A1A",
        overlay_foreground_muted: "#55775A",
        overlay_border: "#B5D6B9",
        overlay_hover_background: "#E0EFE3",
        overlay_divider: "#CCE8CF",

        // 通用
        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        // 滚动条
        scrollbar_slider: "#9dc0a380",
        scrollbar_slider_hover: "#82a888cc",
    },

    // ==================================================
    // Dark：深色主题
    // ==================================================
    dark: {
        // 编辑区：保留原有配色
        editor_background: "#1E1E1E",
        editor_foreground: "#D4D4D4",
        editor_cursor: "#D4D4D4",
        editor_selection: "#264F78",

        // 行号栏
        gutter_background: "#252526",
        gutter_foreground: "#808080",
        gutter_foreground_active: "#A0A0A0",

        // 标签栏
        tab_bar_background: "#2D2D2D",
        tab_bar_background_inactive: "#2D2D2D",
        tab_background_active: "#1E1E1E",

        tab_foreground: "#999999",
        tab_foreground_active: "#FFFFFF",
        tab_border: "#404040",

        // 状态栏
        status_bar_background: "#252526",
        status_bar_foreground: "#CCCCCC",
        status_bar_foreground_muted: "#8A8A8A",

        // 浮层
        overlay_background: "#2D2D2D",
        overlay_foreground: "#DDDDDD",
        overlay_foreground_muted: "#A0A0A0",
        overlay_border: "#444444",
        overlay_hover_background: "#3A3A3A",
        overlay_divider: "#404040",

        // 通用
        accent: "#4A9EFF",
        warning: "#E0A040",
        warning_strong: "#E08040",

        // 滚动条
        scrollbar_slider: "#424242",
        scrollbar_slider_hover: "#4f4f4f",
    },
};

/** 菜单显示顺序（从亮到暗） */
export const THEME_ORDER: string[] = [
    "white",
    "gray",
    "sepia",
    "green",
    "dark",
];

/** 菜单显示名 */
export const THEME_LABELS: Record<string, string> = {
    white: "白色",
    gray: "灰色",
    sepia: "米黄",
    green: "护眼绿",
    dark: "深色",
};

/** 判断是否深色主题 */
export function isDarkTheme(name: string): boolean {
    return name === "dark";
}

/** 当前主题名（响应式 store） */
export const currentTheme = writable<string>("white");