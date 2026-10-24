export const zhTW: Record<string, string> = {
  // ===== 設定選單 =====
  "settings.view": "檢視",
  "settings.show_line_numbers": "顯示行號",
  "settings.word_wrap": "自動換行",
  "settings.theme": "主題",
  "settings.theme.white": "白色",
  "settings.theme.gray": "灰色",
  "settings.theme.sepia": "米黃",
  "settings.theme.green": "綠色",
  "settings.theme.dark": "深色",
  "settings.language": "語言",
  "settings.about": "關於 FinchPad",
  "settings.check_update": "檢查更新",
  "dialog.update_checking": "正在檢查更新...",
  "dialog.update_latest": "當前已是最新版本（v{version}）。",
  "dialog.update_found":
    "發現新版本！\n當前版本：v{current}\n最新版本：v{latest}\n\n是否前往 GitHub 下載？",
  "dialog.update_failed": "檢查更新失敗，請檢查網絡連接。",
  "dialog.update_confirm": "前往下載",
  "dialog.update_cancel": "取消",

  // ===== 語言選項 =====
  "locale.auto": "跟隨系統",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== 標籤右鍵選單 =====
  "tab_menu.save": "儲存",
  "tab_menu.save_as": "另存為",
  "tab_menu.close": "關閉標籤",
  "tab_menu.close_others": "關閉其他標籤",
  "tab_menu.close_left": "關閉左側標籤",
  "tab_menu.close_right": "關閉右側標籤",
  "tab_menu.copy_path": "複製檔案路徑",
  "tab_menu.reveal_in_explorer": "開啟所在資料夾",
  "tab_menu.diff": "比對",
  "tab_menu.rename": "重新命名",

  "diff.window_title": "比對",
  "diff.left_disk": "磁碟版本",
  "diff.right_editor": "編輯器版本",
  "diff.keep_mine": "保留我的修改",
  "diff.use_disk": "採用磁碟版本",

  // ===== 標籤欄空白處選單 =====
  "bar_menu.new": "新增標籤",
  "bar_menu.open": "開啟檔案",

  // ===== 重新命名彈窗提示 =====
  "dialog.rename_exists": "該檔案名稱在當前目錄下已存在。",
  "dialog.rename_failed": "重新命名失敗：{error}",

  // ===== 編輯區右鍵選單 =====
  "editor_menu.undo": "復原",
  "editor_menu.redo": "重做",
  "editor_menu.cut": "剪下",
  "editor_menu.copy": "複製",
  "editor_menu.paste": "貼上",
  "editor_menu.delete": "刪除",
  "editor_menu.select_all": "全選",

  // ===== SideBar =====
  "sidebar.recent": "最近檔案",
  "sidebar.directory": "目前目錄",
  "sidebar.file_not_found": "檔案不存在或已被移動：{path}",
  "sidebar.empty": "暫無記錄",
  "sidebar.up": "返回上一級",

  // ===== 狀態欄 =====
  "status.unsaved": "未儲存",
  "status.external_deleted": "⚠ 已被外部刪除",
  "status.external_unreachable": "⚠ 位置暫不可訪問",
  "status.external_modified": "⚠ 已被外部修改",
  "status.line_and_chars": "共 {lines} 行 · {chars} 字元",
  "status.selected_chars": "選中 {chars} 字元",
  "status.selected_lines_and_chars": "選中 {lines} 行 · {chars} 字元",
  "status.short_line_numbers": "行號",
  "status.short_word_wrap": "換行",
  "status.encoding_tooltip": "文字編碼：{encoding}",
  "status.line_ending_lf": "Unix 換行符（LF）",
  "status.line_ending_crlf": "Windows 換行符（CRLF）",
  "status.line_ending_cr": "Macintosh 換行符（CR）",

  // ===== 關閉/儲存彈窗 =====
  "dialog.close_confirm": "是(Y)",
  "dialog.close_cancel": "否(N)",
  "dialog.cancel": "取消",
  "dialog.filter.all_files": "所有檔案",
  "dialog.filter.text_files": "文字檔案",

  "dialog.ask_save_unnamed": "是否儲存檔案「{title}」？",
  "dialog.ask_save_named": "是否儲存對「{title}」的修改？",

  // ===== 衝突處理 =====
  "dialog.conflict_title": "{path}\n檔案已被外部修改，請選擇處理方式：",
  "dialog.conflict_overwrite": "覆蓋磁碟",
  "dialog.conflict_discard": "重新載入",
  "dialog.conflict_discard_close": "放棄修改",
  "dialog.conflict_compare": "比對差異",
  "dialog.conflict_save_as": "另存為",
  "dialog.save_as_conflict":
    "儲存失敗：檔案已在另一個標籤頁中開啟。請關閉該標籤後再重試。\n路徑：{path}",
  "dialog.ok": "確定",

  // ===== 大檔案關窗彈窗 =====
  "dialog.large_close": "檔案「{title}」有未儲存的修改。關閉後這些修改會丟失。",
  "dialog.large_close_yes": "儲存",
  "dialog.large_close_no": "不儲存",

  // ===== 大檔案占位 =====
  "pending.title": "此檔案較大，尚未載入",
  "pending.size": "檔案大小：{size}",
  "pending.hint": "載入後編輯器可能短暫無響應",
  "pending.load": "立即載入",

  // ===== 關於彈窗 =====
  "about.title": "FinchPad",
  "about.version": "版本 {version}",
  "about.line1": "一款現代、輕量化、多標籤的純文字編輯器。",
  "about.line2": "旨在成為更好的系統預設文字編輯器。",
  "about.tech": "技術架構：Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "作者：MaleyGoz",
  "about.license": "開源協議：MIT License",
  "about.website": "官網：https://github.com/MaleyGoz/FinchPad",
  "about.ok": "確定",

  // ===== 未命名標籤 =====
  "tab.unnamed": "未命名 {index}",
  "tab.unnamed_fallback": "未命名",
};