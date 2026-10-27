export const zhCN: Record<string, string> = {
    // ===== 设置菜单 =====
    "settings.view": "视图",
    "settings.show_line_numbers": "显示行号",
    "settings.word_wrap": "自动换行",
    "settings.theme": "主题",
    "settings.theme.white": "白色",
    "settings.theme.gray": "灰色",
    "settings.theme.sepia": "米黄",
    "settings.theme.green": "绿色",
    "settings.theme.dark": "深色",
    "settings.language": "语言",
    "settings.about": "关于FinchPad",
    "settings.check_update": "检查更新",
    "dialog.update_checking": "正在检查更新...",
    "dialog.update_latest": "当前已是最新版本（v{version}）。",
    "dialog.update_found":
        "发现新版本！\n当前版本：v{current}\n最新版本：v{latest}\n\n是否前往 GitHub 下载？",
    "dialog.update_failed": "检查更新失败，请检查网络连接。",
    "dialog.update_confirm": "前往下载",
    "dialog.update_cancel": "取消",

    // ===== 标签右键菜单 =====
    "tab_menu.save": "保存",
    "tab_menu.save_as": "另存为",
    "tab_menu.close": "关闭标签",
    "tab_menu.close_others": "关闭其它标签",
    "tab_menu.close_left": "关闭左侧标签",
    "tab_menu.close_right": "关闭右侧标签",
    "tab_menu.copy_path": "复制文件路径",
    "tab_menu.reveal_in_explorer": "打开所在文件夹",
    "tab_menu.diff": "对比",
    "tab_menu.rename": "重命名",

    "diff.window_title": "对比",
    "diff.left_disk": "磁盘版本",
    "diff.right_editor": "编辑器版本",
    "diff.keep_mine": "保留我的修改",
    "diff.use_disk": "采用磁盘版本",

    // ===== 标签栏空白处菜单 =====
    "bar_menu.new": "新建标签",
    "bar_menu.open": "打开文件",

    // ===== 重命名弹窗提示 =====
    "dialog.rename_exists": "该文件名在当前目录下已存在。",
    "dialog.rename_failed": "重命名失败：{error}",

    // ===== 编辑区右键菜单 =====
    "editor_menu.undo": "撤销",
    "editor_menu.redo": "重做",
    "editor_menu.cut": "剪切",
    "editor_menu.copy": "复制",
    "editor_menu.paste": "粘贴",
    "editor_menu.delete": "删除",
    "editor_menu.select_all": "全选",

    // ===== 侧边栏 =====
    "sidebar.recent": "最近文件",
    "sidebar.directory": "当前目录",
    "sidebar.file_not_found": "文件不存在或已被移动：{path}",
    "sidebar.empty_recent": "暂无最近文件",
    "sidebar.empty_dir": "此文件夹为空",
    "sidebar.up": "返回上一级",
    "sidebar.dir_unreachable": "⚠️ 无法访问以下目录：\n{path}\n\n可能的原因：U盘已拔出、网盘未挂载、或文件夹被重命名。",
    "sidebar.record_history": "记录历史",
    "sidebar.clear_history": "清空历史",
    "sidebar.delete_record": "删除记录",


    // ===== 状态栏 =====
    "status.unsaved": "未保存",
    "status.external_deleted": "⚠ 已被外部删除",
    "status.external_unreachable": "⚠ 位置暂不可访问",
    "status.external_modified": "⚠ 已被外部修改",
    "status.line_and_chars": "共 {lines} 行 · {chars} 字符",
    "status.selected_chars": "选中 {chars} 字符",
    "status.selected_lines_and_chars": "选中 {lines} 行 · {chars} 字符",
    "status.short_line_numbers": "行号",
    "status.short_word_wrap": "换行",
    "status.encoding_tooltip": "文本编码：{encoding}",
    "status.line_ending_lf": "Unix 换行符（LF）",
    "status.line_ending_crlf": "Windows 换行符（CRLF）",
    "status.line_ending_cr": "Macintosh 换行符（CR）",

    // ===== 关闭/保存弹窗 =====
    "dialog.close_confirm": "是(Y)",
    "dialog.close_cancel": "否(N)",
    "dialog.cancel": "取消",
    "dialog.filter.all_files": "所有文件",
    "dialog.filter.text_files": "文本文件",

    "dialog.ask_save_unnamed": "是否保存文件「{title}」？",
    "dialog.ask_save_named": "是否保存对「{title}」的修改？",

    // ===== 冲突处理 =====
    "dialog.conflict_title": "{path}\n文件已被外部修改，请选择处理方式：",
    "dialog.conflict_overwrite": "覆盖磁盘",
    "dialog.conflict_discard": "重新加载",
    "dialog.conflict_discard_close": "放弃修改",
    "dialog.conflict_compare": "对比差异",
    "dialog.conflict_save_as": "另存为",
    "dialog.save_as_conflict":
        "保存失败：文件已在另一个标签页中打开。请关闭该标签后再重试。\n路径：{path}",
    "dialog.ok": "确定",

    // ===== 大文件关窗弹窗 =====
    "dialog.large_close": "文件「{title}」有未保存的修改。关闭后这些修改会丢失。",
    "dialog.large_close_yes": "保存",
    "dialog.large_close_no": "不保存",

    // ===== 关于弹窗 =====
    "about.title": "FinchPad",
    "about.version": "版本 {version}",
    "about.line1": "一款现代、轻量化、多标签的纯文本编辑器。",
    "about.line2": "旨在成为更好的系统默认文本编辑器。",
    "about.tech": "技术架构：Tauri 2 · Svelte 5 · Rust · Monaco Editor",
    "about.author": "作者：MaleyGoz",
    "about.license": "开源协议：MIT License",
    "about.website": "官网：https://github.com/MaleyGoz/FinchPad",
    "about.ok": "确定",

    // ===== 未命名标签 =====
    "tab.unnamed": "未命名 {index}",
    "tab.unnamed_fallback": "未命名",

    // ===== 大文件 =====
    "large_file.pending_title": "此文件较大，尚未加载",
    "large_file.pending_size": "文件大小：{size}",
    "large_file.pending_hint": "为了不卡顿主界面，将在独立窗口中进行极速只读渲染。",
    "large_file.pending_btn": "⚡ 极速只读查看",
    "large_file.searching": "正在全文件扫描...",
    "large_file.no_results": "未找到匹配项",
    "large_file.search_failed": "搜索失败，请检查文件状态。",
    "large_file.search_limit": "仅显示前 100 个结果，请使用更精确的关键词",
    "large_file.file_not_found": "文件已被外部删除或移动，无法打开。",
    "large_file.load_failed": "读取失败，文件可能已被外部修改或删除。",
    "large_file.search_placeholder": "搜索...",
    "large_file.auto_detect": "🔄 自动识别",
};
