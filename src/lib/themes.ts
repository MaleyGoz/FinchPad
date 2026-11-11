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
    // White：白色主题（保持完美基准不变）
    // ==================================================
    white: {
        editor_background: "#FFFFFF",
        editor_foreground: "#000000",
        editor_cursor: "#000000",
        editor_selection: "#B3D7FF",

        gutter_background: "#F3F3F3",
        gutter_foreground: "#8A8A8A",
        gutter_foreground_active: "#666666",

        tab_bar_background: "#E5E5EA",
        tab_bar_background_inactive: "#F2F2F2",
        tab_background_active: "#FFFFFF",
        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        status_bar_background: "#F3F3F3",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#AAAAAA",

        overlay_background: "#FFFFFF",
        overlay_foreground: "#222222",
        overlay_foreground_muted: "#777777",
        overlay_border: "#CCCCCC",
        overlay_hover_background: "#F0F0F0",
        overlay_divider: "#E0E0E0",

        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        scrollbar_slider: "#8b8b8b80",
        scrollbar_slider_hover: "#8b8b8bcc",
    },

    // ==================================================
    // Gray：灰色主题
    // ==================================================
    gray: {
        // 编辑区：主角，保持中性舒适灰色与极扎实的墨黑文字
        editor_background: "#C4C4C4",
        editor_foreground: "#111111", // 墨黑，文字极其清晰硬朗
        editor_cursor: "#111111",
        editor_selection: "#94A3B8",

        // 行号栏：背景 #B8B8B8，加深行号前景色，杜绝弱化字发虚
        gutter_background: "#B8B8B8",
        gutter_foreground: "#555555",        // 普通行号：清晰可见的深灰
        gutter_foreground_active: "#111111", // 当前行号：醒目的深黑

        // 标签栏：背景 #B0B0B0 (压住顶栏)
        tab_bar_background: "#B0B0B0",
        tab_bar_background_inactive: "#B8B8B8",
        tab_background_active: "#C4C4C4",   // 激活标签页与编辑区无缝融为一体

        tab_foreground: "#444444",          // 未激活标签文字：深灰可读
        tab_foreground_active: "#000000",   // 激活标签文字：纯黑高亮
        tab_border: "#9E9E9E",              // 边框：恰到下分的分割线

        // 状态栏：与行号栏一致背景 #B8B8B8，弱化文字同步加深
        status_bar_background: "#B8B8B8",
        status_bar_foreground: "#222222",       // 状态栏主文字：近纯黑，一目了然
        status_bar_foreground_muted: "#555555", // 状态栏辅助信息：深灰，低调且不糊

        // 浮层（菜单 / Tooltip / 弹窗）：背景 #B8B8B8
        overlay_background: "#B8B8B8",
        overlay_foreground: "#111111",          // 菜单主文字：清晰墨黑
        overlay_foreground_muted: "#444444",    // 快捷键提示等辅助字：清晰深灰
        overlay_border: "#9E9E9E",              // 浮层边框：清晰界限
        overlay_hover_background: "#C4C4C4",    // 悬停背景：提亮与编辑区一致，反馈明显
        overlay_divider: "#A0A0A0",             // 菜单分割线

        // 通用
        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        // 滚动条：滑块颜色微调，在 #C4C4C4 编辑区上清晰可见
        scrollbar_slider: "#77777780",
        scrollbar_slider_hover: "#555555cc",
    },

    // ==================================================
    // Sepia：米黄主题（加深前景色，摆脱灰蓝软塌感）
    // ==================================================
    sepia: {
        editor_background: "#FDF6E3",
        // 【优化】将原来的偏灰蓝色 #3A4A52 加深并带一点点暖调的 #2B373D，边缘锐利度大幅提升
        editor_foreground: "#2B373D",
        editor_cursor: "#2B373D",
        editor_selection: "#E2D2A2",

        gutter_background: "#F0EAD8",
        gutter_foreground: "#857D6D",
        gutter_foreground_active: "#5A656B",

        tab_bar_background: "#D8CDB8",
        tab_bar_background_inactive: "#E5DCC9",
        tab_background_active: "#FDF6E3",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        status_bar_background: "#F0EAD8",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#B5AC9C",

        overlay_background: "#FDF6E3",
        overlay_foreground: "#2B373D",
        overlay_foreground_muted: "#7B7160",
        overlay_border: "#D8CDB8",
        overlay_hover_background: "#F2EAD3",
        overlay_divider: "#E5DCC9",

        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        scrollbar_slider: "#d8cdb880",
        scrollbar_slider_hover: "#c0b59fcc",
    },

    // ==================================================
    // Green：护眼绿主题（加深墨绿前景色，消除同色系模糊）
    // ==================================================
    green: {
        editor_background: "#CCE8CF",
        // 【优化】将原来的 #1A3A1A 加深为极具质感的深墨绿 #0F2611，配合 Consolas 字体瞬间清晰硬朗
        editor_foreground: "#0F2611",
        editor_cursor: "#0F2611",
        editor_selection: "#9ACFA2",

        gutter_background: "#B8E0BC",
        gutter_foreground: "#527557",
        gutter_foreground_active: "#355439",

        tab_bar_background: "#A8C5B0",
        tab_bar_background_inactive: "#C0D6C4",
        tab_background_active: "#CCE8CF",

        tab_foreground: "#333333",
        tab_foreground_active: "#000000",
        tab_border: "#C0C5CC",

        status_bar_background: "#B8E0BC",
        status_bar_foreground: "#555555",
        status_bar_foreground_muted: "#7E9E83",

        overlay_background: "#E8F4E9",
        overlay_foreground: "#0F2611",
        overlay_foreground_muted: "#446648",
        overlay_border: "#A9D3AD",
        overlay_hover_background: "#D5EAD8",
        overlay_divider: "#CCE8CF",

        accent: "#0db3db",
        warning: "#C08000",
        warning_strong: "#CC6600",

        scrollbar_slider: "#9dc0a380",
        scrollbar_slider_hover: "#82a888cc",
    },

    // ==================================================
    // Dark：深色主题（柔和抗疲劳版）
    // ==================================================
    dark: {
        // 编辑区：绝对主角，柔和舒适
        editor_background: "#1E1E1E",
        editor_foreground: "#CCCCCC",
        editor_cursor: "#AEAEAE",
        editor_selection: "#264F78",

        // 行号栏：背景 #252526，行号文字低调收敛
        gutter_background: "#252526",
        gutter_foreground: "#666666",        // 普通行号：暗灰低调，绝不抢编辑区风头
        gutter_foreground_active: "#B0B0B0", // 当前行号：适度高亮，清晰可辨

        // 标签栏
        tab_bar_background: "#181818",
        tab_bar_background_inactive: "#181818",
        tab_background_active: "#1E1E1E",
        tab_foreground: "#777777",
        tab_foreground_active: "#DDDDDD",
        tab_border: "#333333",

        // 状态栏：背景 #252526（与行号栏一致）
        status_bar_background: "#252526",
        status_bar_foreground: "#AAAAAA",        // 状态栏主文本：柔和可见，不刺眼
        status_bar_foreground_muted: "#666666",  // 【核心优化】Mute/置灰态：与行号同色系暗灰，完美融入底色且无违和感

        // 浮层（菜单 / Tooltip / 弹窗）
        overlay_background: "#252526",
        overlay_foreground: "#CCCCCC",
        overlay_foreground_muted: "#888888",
        overlay_border: "#3C3C3C",
        overlay_hover_background: "#333337",
        overlay_divider: "#383838",

        // 通用
        accent: "#4A9EFF",
        warning: "#E0A040",
        warning_strong: "#E08040",

        // 滚动条
        scrollbar_slider: "#42424280",
        scrollbar_slider_hover: "#4f4f4fcc",
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