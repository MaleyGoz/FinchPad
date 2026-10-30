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
    "settings.about": "About FinchPad",
    "settings.check_update": "Check for Updates",
    "dialog.update_checking": "Checking for updates...",
    "dialog.update_latest": "You are on the latest version (v{version}).",
    "dialog.update_found":
        "New version found!\nCurrent: v{current}\nLatest: v{latest}\n\nGo to GitHub to download?",
    "dialog.update_failed":
        "Failed to check for updates. Please check your network.",
    "dialog.update_confirm": "Download",
    "dialog.update_cancel": "Cancel",

    // ===== 标签栏 =====
    "tab_bar.new_tab": "New Tab",
    "tab_bar.settings": "Settings",
    "tab_bar.preview": "Preview",

    // ===== Tab Context Menu =====
    "tab_menu.save": "Save",
    "tab_menu.save_as": "Save As",
    "tab_menu.close": "Close Tab",
    "tab_menu.close_others": "Close Other Tabs",
    "tab_menu.close_left": "Close Tabs to the Left",
    "tab_menu.close_right": "Close Tabs to the Right",
    "tab_menu.close_all": "Close All Tabs",
    "tab_menu.reopen": "Reopen Closed Tab",
    "tab_menu.copy_path": "Copy File Path",
    "tab_menu.reveal_in_explorer": "Reveal in Explorer",
    "tab_menu.diff": "Compare",
    "tab_menu.rename": "Rename",
    "diff.window_title": "Compare",
    "diff.left_disk": "Disk",
    "diff.right_editor": "Editor",
    "diff.keep_mine": "Keep Mine",
    "diff.use_disk": "Use Disk Version",

    // ===== Tab Bar Empty Area Menu =====
    "bar_menu.new": "New Tab",
    "bar_menu.open": "Open File",

    // ===== Rename Dialog =====
    "dialog.rename_exists":
        "A file with this name already exists in the directory.",
    "dialog.rename_failed": "Rename failed: {error}",

    // ===== Editor Context Menu =====
    "editor_menu.undo": "Undo",
    "editor_menu.redo": "Redo",
    "editor_menu.cut": "Cut",
    "editor_menu.copy": "Copy",
    "editor_menu.paste": "Paste",
    "editor_menu.delete": "Delete",
    "editor_menu.select_all": "Select All",

    // ===== SideBar =====
    "sidebar.recent": "Recent Files",
    "sidebar.directory": "Current Directory",
    "sidebar.file_not_found": "File not found or has been moved: {path}",
    "sidebar.empty_recent": "No recent files",
    "sidebar.empty_dir": "Empty folder",
    "sidebar.up": "Go Up",
    "sidebar.dir_unreachable": "⚠️ Cannot access the directory:\n{path}\n\nPossible reasons: USB drive unplugged, network drive not mounted, or folder renamed.",
    "sidebar.record_history": "Record History",
    "sidebar.clear_history": "Clear History",
    "sidebar.delete_record": "Delete Record",


    // ===== Status Bar =====
    "status.unsaved": "Unsaved",
    "status.external_deleted": "⚠ Deleted externally",
    "status.external_unreachable": "⚠ Location unreachable",
    "status.external_modified": "⚠ Modified externally",
    "status.line_and_chars": "{lines} lines · {chars} chars",
    "status.selected_chars": "{chars} chars selected",
    "status.selected_lines_and_chars": "{lines} lines · {chars} chars selected",
    "status.short_line_numbers": "Line Numbers",
    "status.short_word_wrap": "Word Wrap",
    "status.zoom_tooltip": "Zoom",
    "status.scroll_wheel": "Wheel",
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

    "dialog.ask_save_unnamed": 'Save file "{title}"?',
    "dialog.ask_save_named": 'Save changes to "{title}"?',

    // ===== Conflict Resolution =====
    "dialog.conflict_title":
        "{path}\nFile has been modified externally, Choose how to proceed:",
    "dialog.conflict_overwrite": "Overwrite",
    "dialog.conflict_discard": "Reload",
    "dialog.conflict_discard_close": "Discard",
    "dialog.conflict_compare": "Compare",
    "dialog.conflict_save_as": "Save As",
    "dialog.save_as_conflict":
        "Save failed: The file is already open in another tab. Please close it and try again.\nPath: {path}",
    "dialog.ok": "OK",

    // ===== Large File Close Dialog =====
    "dialog.large_close":
        'File "{title}" has unsaved changes. They will be lost if you close.',
    "dialog.large_close_yes": "Save",
    "dialog.large_close_no": "Don't Save",

    // ===== About Dialog =====
    "about.title": "FinchPad",
    "about.version": "Version {version}",
    "about.line1": "A modern, lightweight, multi-tab plain-text editor.",
    "about.line2": "Aiming to be a better default text editor.",
    "about.tech": "Built with: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
    "about.author": "Author: MaleyGoz",
    "about.license": "License: MIT",
    "about.website": "Website: https://github.com/MaleyGoz/FinchPad",
    "about.ok": "OK",

    // ===== Untitled Tabs =====
    "tab.unnamed": "Untitled {index}",
    "tab.unnamed_fallback": "Untitled",

    // ===== Large File =====
    "large_file.pending_title": "This file is large and not yet loaded",
    "large_file.pending_size": "File Size: {size}",
    "large_file.pending_hint": "To keep the main UI smooth, it will open in a separate window for ultra-fast read-only rendering.",
    "large_file.pending_btn": "⚡ Quick Read-Only View",
    "large_file.searching": "Scanning file...",
    "large_file.no_results": "No matches found",
    "large_file.search_failed": "Search failed, please check file status.",
    "large_file.search_limit": "Showing first 100 results only, please use more precise keywords",
    "large_file.file_not_found": "The file has been deleted or moved externally and cannot be opened.",
    "large_file.load_failed": "Read failed. The file may have been modified or deleted externally.",
    "large_file.search_placeholder": "Search...",
    "large_file.auto_detect": "🔄 Auto Detect",

    // ===== Find Replace =====
    "editor.find.placeholder": "Find",
    "editor.find.replace_placeholder": "Replace",
    "editor.find.show_replace": "Show Replace",
    "editor.find.hide_replace": "Hide Replace",
    "editor.find.close": "Close (Esc)",
    "editor.find.find_in_selection": "Find in Selection",
    "editor.find.match_case": "Match Case",
    "editor.find.match_whole_word": "Match Whole Word",
    "editor.find.use_regex": "Use Regular Expression",
    "editor.find.preserve_case": "Preserve Case",
    "editor.find.replace": "Replace",
    "editor.find.replace_all": "Replace All",
    "editor.find.prev_match": "Previous Match",
    "editor.find.next_match": "Next Match",
    "editor.find.no_results": "No results",
    "editor.find.match_count": "{current} of {total}",
};
