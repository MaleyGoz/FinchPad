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
  tab_background: string;
  tab_background_active: string;
  tab_foreground: string;
  tab_foreground_active: string;
  tab_border: string;

  // 状态栏
  status_bar_background: string;
  status_bar_foreground: string;
  status_bar_foreground_muted: string;

  // 浮层（菜单/tooltip/弹窗）
  overlay_background: string;
  overlay_foreground: string;
  overlay_foreground_muted: string;
  overlay_border: string;
  overlay_hover_background: string;
  overlay_divider: string;

  // 通用
  accent: string;
  warning: string; // 一般警告（未保存）
  warning_strong: string; // 严重警告（外部删除/修改）
};

export const THEMES: Record<string, Theme> = {
  white: {
    editor_background: "#FFFFFF",
    editor_foreground: "#000000",
    editor_cursor: "#000000",
    editor_selection: "#B3D7FF",
    gutter_background: "#F3F3F3",
    gutter_foreground: "#C8C8C8",
    gutter_foreground_active: "#666666",
    tab_bar_background: "#D8DDE3",
    tab_background: "#D8DDE3",
    tab_background_active: "#FFFFFF",
    tab_foreground: "#333333",
    tab_foreground_active: "#000000",
    tab_border: "#C0C5CC",
    status_bar_background: "#F3F3F3",
    status_bar_foreground: "#555555",
    status_bar_foreground_muted: "#CCCCCC",
    overlay_background: "#FFFFFF",
    overlay_foreground: "#222222",
    overlay_foreground_muted: "#999999",
    overlay_border: "#CCCCCC",
    overlay_hover_background: "#F0F0F0",
    overlay_divider: "#E0E0E0",
    accent: "#0066CC",
    warning: "#C08000",
    warning_strong: "#CC6600",
  },
  gray: {
    editor_background: "#C0C0C0",
    editor_foreground: "#000000",
    editor_cursor: "#000000",
    editor_selection: "#9DA8B8",
    gutter_background: "#e4e4e4",
    gutter_foreground: "#888888",
    gutter_foreground_active: "#444444",
    tab_bar_background: "#D8DDE3",
    tab_background: "#D8DDE3",
    tab_background_active: "#E5E5E5",
    tab_foreground: "#333333",
    tab_foreground_active: "#000000",
    tab_border: "#C0C5CC",
    status_bar_background: "#e4e4e4",
    status_bar_foreground: "#555555",
    status_bar_foreground_muted: "#CCCCCC",
    overlay_background: "#FFFFFF",
    overlay_foreground: "#222222",
    overlay_foreground_muted: "#999999",
    overlay_border: "#CCCCCC",
    overlay_hover_background: "#F0F0F0",
    overlay_divider: "#E0E0E0",
    accent: "#0066CC",
    warning: "#C08000",
    warning_strong: "#CC6600",
  },
  sepia: {
    editor_background: "#FDF6E3",
    editor_foreground: "#3A4A52",
    editor_cursor: "#586E75",
    editor_selection: "#E8D9A8",
    gutter_background: "#F0EAD8",
    gutter_foreground: "#B8C0C0",
    gutter_foreground_active: "#7A8A90",
    tab_bar_background: "#D8DDE3",
    tab_background: "#D8DDE3",
    tab_background_active: "#FDF6E3",
    tab_foreground: "#333333",
    tab_foreground_active: "#000000",
    tab_border: "#C0C5CC",
    status_bar_background: "#F0EAD8",
    status_bar_foreground: "#555555",
    status_bar_foreground_muted: "#CCCCCC",
    overlay_background: "#FFFFFF",
    overlay_foreground: "#222222",
    overlay_foreground_muted: "#999999",
    overlay_border: "#CCCCCC",
    overlay_hover_background: "#F0F0F0",
    overlay_divider: "#E0E0E0",
    accent: "#0066CC",
    warning: "#C08000",
    warning_strong: "#CC6600",
  },
  green: {
    editor_background: "#CCE8CF",
    editor_foreground: "#1A3A1A",
    editor_cursor: "#1A3A1A",
    editor_selection: "#A8D8AE",
    gutter_background: "#BEE0C2",
    gutter_foreground: "#88B088",
    gutter_foreground_active: "#4A7A4A",
    tab_bar_background: "#D8DDE3",
    tab_background: "#D8DDE3",
    tab_background_active: "#CCE8CF",
    tab_foreground: "#333333",
    tab_foreground_active: "#000000",
    tab_border: "#C0C5CC",
    status_bar_background: "#BEE0C2",
    status_bar_foreground: "#555555",
    status_bar_foreground_muted: "#CCCCCC",
    overlay_background: "#FFFFFF",
    overlay_foreground: "#222222",
    overlay_foreground_muted: "#999999",
    overlay_border: "#CCCCCC",
    overlay_hover_background: "#F0F0F0",
    overlay_divider: "#E0E0E0",
    accent: "#0066CC",
    warning: "#C08000",
    warning_strong: "#CC6600",
  },
  dark: {
    editor_background: "#1E1E1E",
    editor_foreground: "#D4D4D4",
    editor_cursor: "#D4D4D4",
    editor_selection: "#264F78",
    gutter_background: "#252526",
    gutter_foreground: "#606060",
    gutter_foreground_active: "#A0A0A0",
    tab_bar_background: "#2D2D2D",
    tab_background: "#2D2D2D",
    tab_background_active: "#1E1E1E",
    tab_foreground: "#999999",
    tab_foreground_active: "#FFFFFF",
    tab_border: "#404040",
    status_bar_background: "#252526",
    status_bar_foreground: "#CCCCCC",
    status_bar_foreground_muted: "#666666",
    overlay_background: "#2D2D2D",
    overlay_foreground: "#DDDDDD",
    overlay_foreground_muted: "#888888",
    overlay_border: "#444444",
    overlay_hover_background: "#3A3A3A",
    overlay_divider: "#404040",
    accent: "#4A9EFF",
    warning: "#E0A040",
    warning_strong: "#E08040",
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
