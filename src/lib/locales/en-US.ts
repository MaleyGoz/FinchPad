export const enUS: Record<string, string> = {
  // ===== Settings Menu =====
  "settings.view": "View",
  "settings.show_line_numbers": "Line Numbers",
  "settings.word_wrap": "Word Wrap",
  "settings.theme": "Theme",
  "settings.theme.white": "White",
  "settings.theme.gray": "Gray",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Green",
  "settings.theme.dark": "Dark",
  "settings.language": "Language",
  "settings.about": "About TXT Editor",

  // ===== Language Options =====
  "locale.auto": "Auto",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",

  // ===== Tab Context Menu =====
  "tab_menu.save": "Save",
  "tab_menu.save_as": "Save As",
  "tab_menu.close": "Close Tab",
  "tab_menu.close_others": "Close Other Tabs",
  "tab_menu.close_left": "Close Tabs to the Left",
  "tab_menu.close_right": "Close Tabs to the Right",
  "tab_menu.copy_path": "Copy File Path",
  "tab_menu.reveal_in_explorer": "Reveal in Explorer",

  // ===== Tab Bar Empty Area Menu =====
  "bar_menu.new": "New Tab",
  "bar_menu.open": "Open File",

  // ===== Editor Context Menu =====
  "editor_menu.undo": "Undo",
  "editor_menu.redo": "Redo",
  "editor_menu.cut": "Cut",
  "editor_menu.copy": "Copy",
  "editor_menu.paste": "Paste",
  "editor_menu.delete": "Delete",
  "editor_menu.select_all": "Select All",

  // ===== Status Bar =====
  "status.unsaved": "Unsaved",
  "status.external_deleted": "⚠ Deleted externally",
  "status.external_unreachable": "⚠ Location unreachable",
  "status.external_modified": "⚠ Modified externally",
  "status.line_and_chars": "{lines} lines · {chars} chars",
  "status.selected_chars": "{chars} chars selected",
  "status.selected_lines_and_chars": "{lines} lines · {chars} chars selected",
  "status.word_wrap_on": "Wrap: On",
  "status.word_wrap_off": "Wrap: Off",
  "status.encoding_tooltip": "Encoding: {encoding}",
  "status.line_ending_lf": "Unix line ending (LF)",
  "status.line_ending_crlf": "Windows line ending (CRLF)",
  "status.line_ending_cr": "Macintosh line ending (CR)",

  // ===== Close/Save Dialogs =====
  "dialog.close_confirm": "Yes",
  "dialog.close_cancel": "No",
  "dialog.cancel": "Cancel",
  "dialog.filter.all_files": "All Files",
  "dialog.filter.text_files": "Text Files",
  "dialog.save": "Save",
  "dialog.discard": "Don't Save",

  "dialog.ask_save_unnamed": 'Save file "{title}"?',
  "dialog.ask_save_named": 'Save changes to "{title}"?',

  // ===== Conflict Resolution =====
  "dialog.conflict_title":
    "File has been modified externally. Choose how to proceed.",
  "dialog.conflict_overwrite": "Overwrite",
  "dialog.conflict_discard": "Discard Changes",
  "dialog.conflict_compare": "Compare",
  "dialog.conflict_save_as": "Save As",
  "dialog.conflict_not_implemented": "Compare feature coming soon",

  // ===== External Changes Dialogs =====
  "dialog.external_modified":
    "This file has been modified by another program. Reload and discard changes in TXT Editor?",
  "dialog.external_deleted_keep":
    'File "{title}" has been deleted from disk. Keep it in the editor?',
  "dialog.external_deleted_save":
    'File "{title}" has been deleted from disk. Save to recreate it?',
  "dialog.external_unreachable_save":
    'File "{title}" is currently unreachable. Save to another location?',

  // ===== Large File Close Dialog =====
  "dialog.large_close":
    'File "{title}" has unsaved changes. They will be lost if you close.',
  "dialog.large_close_yes": "Save",
  "dialog.large_close_no": "Don't Save",

  // ===== Large File Placeholder =====
  "pending.title": "Large file, not loaded yet",
  "pending.size": "Size: {size}",
  "pending.hint": "Editor may be briefly unresponsive after loading",
  "pending.load": "Load Now",

  // ===== About Dialog =====
  "about.title": "TXT Editor",
  "about.version": "Version {version}",
  "about.line1": "A modern, lightweight, multi-tab plain-text editor.",
  "about.line2": "Aiming to be a better default text editor.",
  "about.tech": "Built with: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Author: MaleyGoz",
  "about.license": "License: MIT",
  "about.website": "Website: https://github.com/MaleyGoz/TXT-Editor",
  "about.ok": "OK",

  // ===== Untitled Tabs =====
  "tab.unnamed": "Untitled {index}",
  "tab.unnamed_fallback": "Untitled",
  "tab.unnamed_default": "Untitled.txt",
};
