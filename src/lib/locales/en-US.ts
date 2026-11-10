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
    "dialog.update_confirm": "Latest Release",
    "dialog.update_cancel": "Cancel",

    // ===== Tab Bar =====
    "tab_bar.new_tab": "New Tab",
    "tab_bar.settings": "Settings",
    "tab_bar.preview": "Preview",

    // ===== Tab Context Menu =====
    "tab_menu.save": "Save",
    "tab_menu.save_as": "Save As",
    "tab_menu.close": "Close Tab",
    "tab_bar.more_tabs": "More Tabs",
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
    "dialog.save_failed_title": "⚠️ Save failed: Cannot write to file.",


    // ===== Large File Close Dialog =====
    "dialog.large_close":
        'File "{title}" has unsaved changes. They will be lost if you close.',
    "dialog.large_close_yes": "Save",
    "dialog.large_close_no": "Don't Save",

    // ===== Encoding and Line Ending Modification Dialog =====
    "dialog.format_type_encoding": "encoding",
    "dialog.format_type_line_ending": "line ending",
    "dialog.change_format_title": "Change {typeName} to \"{value}\"?",
    "dialog.change_format_subtitle": "The document can be converted losslessly. File content will be updated after saving.",
    "dialog.change_format_lossy_title": "⚠ Changing {typeName} may cause character loss",
    "dialog.change_format_lossy_subtitle": "The document contains special characters. After switching to \"{value}\", these characters will be replaced with \"?\" and cannot be recovered.",
    "encoding_group_unicode": "Unicode Extensions",
    "encoding_group_cjk": "CJK",
    "encoding_group_western": "Western",
    "encoding_group_central_europe": "Central/Eastern Europe",
    "encoding_group_cyrillic": "Cyrillic",
    "encoding_group_others": "Middle East & Others",
    "encoding.recommend": "Recommended",

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
    // ===== New Tab & Content Added to the "About" Modal =====
    "about.tab.about": "About",
    "about.tab.privacy": "Privacy & Security",
    "about.tab.features": "Features",
    "about.tab.license": "License",

    "about.check_update": "Check for Updates",
    "about.checking": "Checking...",
    "about.is_latest": "Up to date",
    "about.found_update": "New version found, redirecting to download",
    "about.check_failed": "Check failed, please check network",

    "about.privacy.intro": "FinchPad adheres to a local-first and privacy-first design philosophy. Your data remains entirely under your control.",
    "about.privacy.local_title": "Local Storage & Encryption",
    "about.privacy.local_desc": "All cached data, tab contents, session states, and settings are stored locally and secured with AES-256-GCM encryption.",
    "about.privacy.telemetry_title": "No Telemetry & Tracking",
    "about.privacy.telemetry_desc": "We do not collect or upload your file contents, usage habits, or device information. There is no background telemetry or behavioral tracking.",
    "about.privacy.network_title": "Network Connections",
    "about.privacy.network_desc": "Network requests are only made to the GitHub API when checking for updates. Markdown/HTML previews may load external network resources referenced in the document. Otherwise, no proactive network requests are initiated.",
    "about.privacy.session_title": "Session Recovery",
    "about.privacy.session_desc": "Automatically encrypts and caches all open regular small file tabs, allowing you to restore your previous work session after unexpected exits or system interruptions.",

    "about.features.nav.shortcuts": "Shortcuts",
    "about.features.nav.tabs": "Tab Management",
    "about.features.nav.session": "Session Recovery",
    "about.features.nav.encoding": "Text & Encoding",
    "about.features.nav.large_file": "Large File Engine",
    "about.features.nav.preview": "Markdown / HTML",
    "about.features.nav.diff": "Text Diff",

    "about.features.shortcuts.title": "Shortcuts",
    "about.features.shortcuts.intro": "Shortcuts follow mainstream editor defaults for zero learning curve.<br><strong>Ctrl</strong> series shortcuts also work on macOS without needing to switch muscle memory.",

    "about.features.tabs.title": "Tab Management",
    "about.features.tabs.desc": "<strong>Flexible Multi-Tab Management</strong><br>Chrome-like tab interaction supporting multi-tabs, drag-and-drop reordering, Ctrl multi-select, and Shift range-select.<br><br><strong>Convenient Tab Actions</strong><br>Support for closing single, other, right, and all tabs, as well as reopening closed tabs.",

    "about.features.session.title": "Session Recovery",
    "about.features.session.desc": "<strong>Smart Encrypted Caching</strong><br>Automatically caches all open regular small file tabs including text content, tab states, and metadata, protected by AES-256-GCM encryption.<br><br><strong>Exception Recovery</strong><br>Automatically restores previous work sessions upon restart, supporting recovery after abnormal exits, crashes, or system interruptions.<br><br><strong>Smart State Validation</strong><br>Compares cache with disk files upon recovery to identify external modifications, deletions, or inaccessible paths, preventing accidental overwrites.",

    "about.features.encoding.title": "Text & Encoding",
    "about.features.encoding.desc": "<strong>New Files</strong><br>Defaults to UTF-8 without BOM, with line endings automatically set based on the operating system.<br><br><strong>Smart Encoding Detection</strong><br>Uses chardetng to automatically detect file encoding and line endings, supporting over 30 common encodings.<br><br><strong>Preserve Original Format</strong><br>Retains original encoding, BOM, line endings, and trailing empty line status upon saving.<br><br><strong>Modify Encoding</strong><br>Supports manual modification of file encoding and line endings with a confirmation prompt to prevent misoperations.",

    "about.features.large_file.title": "Large File Engine",
    "about.features.large_file.desc": "<strong>Ultra-Fast Opening</strong><br>Automatically enables large file mode for files over 50MB using streaming reads, supporting fast opening of GB, TB, or even larger files.<br><br><strong>Efficient Browsing</strong><br>Supports quick search, specified line jumping, and smart encoding detection.<br><br><strong>Independent Read-Only Mode</strong><br>Loaded on-demand via Pending tabs for read-only browsing in a separate large file window. Editing is not supported.",

    "about.features.preview.title": "Markdown / HTML Preview",
    "about.features.preview.desc": "<strong>Real-Time Split Preview</strong><br>When opening Markdown or HTML files, a preview button (eye icon) appears in the top right. Click it to enable split-pane preview with real-time synchronization between editing and preview effects.",

    "about.features.diff.title": "Text Diff",
    "about.features.diff.desc": "<strong>Difference Highlighting</strong><br>Supports small file comparison, automatically detecting and highlighting differences between two texts (large files not supported).<br><br><strong>Two Comparison Entry Points</strong><br>• Hold Ctrl or Shift to select two tabs, right-click and choose \"Compare\".<br>• Right-click a single tab and select another target tab in the \"Compare\" menu.",

    // ===== Keyboard Shortcuts Table =====
    "about.features.shortcuts.th_op": "Operation",
    "about.features.shortcuts.th_win": "Windows / Linux",
    "about.features.shortcuts.th_mac": "macOS",

    "about.features.shortcuts.op_new": "New File / Tab",
    "about.features.shortcuts.op_open_save": "Open / Save",
    "about.features.shortcuts.op_save_as": "Save As",
    "about.features.shortcuts.op_close_tab": "Close Tab",
    "about.features.shortcuts.op_copy_path": "Copy File Path",
    "about.features.shortcuts.op_rename": "Rename",
    "about.features.shortcuts.op_copy_paste": "Copy / Paste / Cut / Select All",
    "about.features.shortcuts.op_undo_redo": "Undo / Redo",
    "about.features.shortcuts.key_undo_win": "Ctrl + Z / Y or Shift + Z",
    "about.features.shortcuts.key_undo_mac": "Cmd + Z / Y / Shift + Z",
    "about.features.shortcuts.op_find_replace": "Find / Replace",
    "about.features.shortcuts.op_show_sidebar": "Toggle Sidebar",
    "about.features.shortcuts.op_switch_tab": "Switch Tab",
    "about.features.shortcuts.op_zoom": "Zoom",
    "about.features.shortcuts.key_zoom_win": "Ctrl + + / - / 0 / Mouse Wheel",
    "about.features.shortcuts.key_zoom_mac": "Cmd + + / - / 0 / Mouse Wheel",
    "about.features.shortcuts.op_close_modal": "Close Modal",
    "about.features.shortcuts.op_quit": "Quit Application",


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

    // ===== macOS Menu =====
    "menu.file": "File",
    "menu.edit": "Edit",
    "menu.view": "View",
    "menu.quit": "Quit FinchPad",
};
