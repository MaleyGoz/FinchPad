import { invoke } from "@tauri-apps/api/core";

export type FileSizeInfo = {
  path: string;
  size: number;
  is_large: boolean;
};

export type TabFullState = {
  disk_state: string;
  is_dirty: boolean;
  /** ★ 新增：磁盘文件 mtime（秒级时间戳），null 表示文件不可达 */
  disk_mtime: number | null;
};

export type Snapshot = {
  tab_titles: string[];
  active_index: number;
  active_text: string;
  line_count: number;
  char_count: number;
  encoding: string;
  line_ending: string;
  is_dirty: boolean;
  default_save_path: string;
  is_unnamed: boolean;
  language_id: string;
  file_size: number;
  is_pending_load: boolean;
  large_file: boolean;
  tab_dirty_states: boolean[];
  tab_unnamed_states: boolean[];
  tab_ids: string[];
  tab_paths: string[];
  disk_state: string;
  zoom: number;
  word_wrap: boolean;
  locale_choice: string;
  show_line_numbers: boolean;
  editor_bg: string;
  last_used_path: string;
};

export type DiffPayload = {
  mode: "tabs" | "disk";
  left_title: string;
  right_title: string;
  left_content: string;
  right_content: string;
  conflict_idx: number;
};

export const api = {
  getWorkspaceState: () => invoke<Snapshot>("get_workspace_state"),
  newTab: () => invoke("new_tab"),
  switchTab: (index: number) => invoke("switch_tab", { index }),
  closeTab: (index: number) => invoke("close_tab", { index }),
  updateActiveText: (text: string) =>
    invoke<boolean>("update_active_text", { text }),
  openFiles: (paths: string[]) => invoke<Snapshot>("open_files", { paths }),
  saveActiveFile: () => invoke<Snapshot>("save_active_file"),
  saveActiveFileAs: (path: string) =>
    invoke<Snapshot>("save_active_file_as", { path }),
  renameTabFile: (index: number, newName: string) =>
    invoke<Snapshot>("rename_tab_file", { index, newName }),
  checkFileSizes: (paths: string[]) =>
    invoke<FileSizeInfo[]>("check_file_sizes", { paths }),
  loadPendingTab: (index: number) =>
    invoke<Snapshot>("load_pending_tab", { index }),
  checkTabState: (index: number) =>
    invoke<string>("check_tab_state", { index }),
  reloadTab: (index: number) => invoke<Snapshot>("reload_tab", { index }),
  checkTabFullState: (index: number) =>
    invoke<TabFullState>("check_tab_full_state", { index }),
  getTabPath: (index: number) => invoke<string>("get_tab_path", { index }),
  getLargeDirtyTabs: () => invoke<string[]>("get_large_dirty_tabs"),
  discardTabChanges: (index: number) =>
    invoke("discard_tab_changes", { index }),
  saveAndPrepareExit: () => invoke("save_and_prepare_exit"),
  restoreSession: () => invoke<Snapshot | null>("restore_session"),
  tickAutosave: () => invoke("tick_autosave"),
  getZoom: () => invoke<number>("get_zoom"),
  setZoom: (zoom: number) => invoke("set_zoom", { zoom }),
  setWordWrap: (value: boolean) => invoke("set_word_wrap", { value }),
  setShowLineNumbers: (value: boolean) =>
    invoke("set_show_line_numbers", { value }),
  setEditorBg: (value: string) => invoke("set_editor_bg", { value }),
  showWindow: () => invoke("show_window"),
  takeStartupFiles: () => invoke<string[]>("take_startup_files"),
  reorderTabs: (from: number, to: number) =>
    invoke("reorder_tabs", { from, to }),
  setLocale: (locale: string, unnamedTemplate: string, localeChoice: string) =>
    invoke("set_locale", { locale, unnamedTemplate, localeChoice }),
  getTabContent: (index: number) =>
    invoke<string>("get_tab_content", { index }),
  getDiskContent: (index: number) =>
    invoke<string>("get_disk_content", { index }),
  openDiffWindow: (payload: DiffPayload) =>
    invoke("open_diff_window", { payload }),
  getDiffPayload: () => invoke<DiffPayload | null>("get_diff_payload"),
  closeDiffWindow: () => invoke("close_diff_window"),
  applyDiskVersion: (idx: number) => invoke("apply_disk_version", { idx }),
};
