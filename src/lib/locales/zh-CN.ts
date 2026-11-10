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
    "dialog.update_latest": "当前已是最新版本（v{version}）",
    "dialog.update_found":
        "发现新版本！\n当前版本：v{current}\n最新版本：v{latest}\n\n是否前往 GitHub 下载？",
    "dialog.update_failed": "检查更新失败，请检查网络连接。",
    "dialog.update_confirm": "前往下载",
    "dialog.update_cancel": "取消",

    // ===== 标签栏 =====
    "tab_bar.new_tab": "新建标签",
    "tab_bar.settings": "设置",
    "tab_bar.preview": "预览",

    // ===== 标签右键菜单 =====
    "tab_menu.save": "保存",
    "tab_menu.save_as": "另存为",
    "tab_menu.close": "关闭标签",
    "tab_bar.more_tabs": "更多标签",
    "tab_menu.close_others": "关闭其它标签",
    "tab_menu.close_left": "关闭左侧标签",
    "tab_menu.close_right": "关闭右侧标签",
    "tab_menu.close_all": "关闭全部标签",
    "tab_menu.reopen": "恢复关闭的标签",
    "tab_menu.copy_path": "复制文件路径",
    "tab_menu.reveal_in_explorer": "打开所在文件夹",
    "tab_menu.diff": "对比",
    "tab_menu.rename": "重命名",
    "diff.window_title": "对比",
    "diff.left_disk": "磁盘版本",
    "diff.right_editor": "编辑器版本",
    "diff.keep_mine": "保留我的修改",
    "diff.use_disk": "采用磁盘版本",

    // ===== 标签栏空白处右键菜单 =====
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
    "status.zoom_tooltip": "缩放比例",
    "status.scroll_wheel": "滚轮",
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
    "dialog.save_failed_title": "⚠️ 保存失败：无法写入文件。",


    // ===== 大文件关窗弹窗 =====
    "dialog.large_close": "文件「{title}」有未保存的修改。关闭后这些修改会丢失。",
    "dialog.large_close_yes": "保存",
    "dialog.large_close_no": "不保存",

    // ===== 编码、换行符修改弹窗 =====
    "dialog.format_type_encoding": "编码",
    "dialog.format_type_line_ending": "换行符",
    "dialog.change_format_title": "是否更改{typeName}为「{value}」？",
    "dialog.change_format_subtitle": "当前文档可以无损转换为该格式，保存后文件内容将被更新。",
    "dialog.change_format_lossy_title": "⚠ 更换{typeName}可能导致字符丢失",
    "dialog.change_format_lossy_subtitle": "当前文档包含特殊字符，切换到「{value}」后，这些字符将无法正确表示，会被替换为「?」且不可恢复。",
    "encoding_group_unicode": "Unicode 扩展",
    "encoding_group_cjk": "中日韩",
    "encoding_group_western": "西欧/西文",
    "encoding_group_central_europe": "东欧/中欧",
    "encoding_group_cyrillic": "西里尔文",
    "encoding_group_others": "中东与其它",
    "encoding.recommend": "推荐",


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
    "about.tab.about": "关于",
    "about.tab.privacy": "隐私与安全",
    "about.tab.features": "功能说明",
    "about.tab.license": "开源协议",

    "about.check_update": "检查更新",
    "about.checking": "正在检查...",
    "about.is_latest": "已是最新版本",
    "about.found_update": "发现新版本，即将前往下载页",
    "about.check_failed": "检查失败，请检查网络",

    "about.privacy.intro": "FinchPad 坚持本地存储、隐私优先的设计理念，你的数据始终由自己掌控。",
    "about.privacy.local_title": "本地存储与加密",
    "about.privacy.local_desc": "所有缓存数据、标签内容、会话状态及软件设置均存储于本地，并采用 AES-256-GCM 加密保护。",
    "about.privacy.telemetry_title": "无遥测与追踪",
    "about.privacy.telemetry_desc": "不收集、不上传用户文件内容、使用习惯或设备信息，不包含后台遥测及行为追踪。",
    "about.privacy.network_title": "网络连接",
    "about.privacy.network_desc": "仅在检查更新时请求 GitHub API；Markdown / HTML 预览可能加载文档引用的外部网络资源。除此之外，不主动发起网络请求。",
    "about.privacy.session_title": "会话恢复",
    "about.privacy.session_desc": "自动加密缓存所有打开的普通小文件标签，异常退出或系统意外中断后，可恢复此前的工作会话。",

    "about.features.nav.shortcuts": "快捷键",
    "about.features.nav.tabs": "标签管理",
    "about.features.nav.session": "会话恢复",
    "about.features.nav.encoding": "文本与编码",
    "about.features.nav.large_file": "大文件引擎",
    "about.features.nav.preview": "Markdown / HTML",
    "about.features.nav.diff": "文本对比",

    "about.features.shortcuts.title": "快捷键",
    "about.features.shortcuts.intro": "快捷键沿用主流编辑器的默认方案，上手零学习成本。<br>其中 <strong>Ctrl</strong> 系列快捷键在 macOS 上同样生效，无需切换肌肉记忆。",

    "about.features.tabs.title": "标签管理",
    "about.features.tabs.desc": "<strong>灵活的多标签管理</strong><br>采用类似 Chrome 的标签交互方式，支持多标签、拖拽排序、Ctrl 多选与 Shift 连选。<br><br><strong>便捷的标签操作</strong><br>支持关闭单个、其他、右侧及全部标签，并可恢复已关闭的标签。",

    "about.features.session.title": "会话恢复",
    "about.features.session.desc": "<strong>智能加密缓存</strong><br>自动缓存所有打开的普通小文件标签，包括文本内容、标签状态及相关信息，所有缓存均采用 AES-256-GCM 加密。<br><br><strong>异常恢复</strong><br>软件重启后自动恢复此前的工作会话，包括标签、文本内容及编辑状态，支持异常退出、崩溃及系统意外中断后的恢复。<br><br><strong>智能状态校验</strong><br>恢复时自动比对缓存与磁盘文件，识别外部修改、文件删除或无法访问等情况，避免误覆盖原始文件。",

    "about.features.encoding.title": "文本与编码",
    "about.features.encoding.desc": "<strong>新建文件</strong><br>默认使用 UTF-8 无 BOM 编码，换行符随操作系统自动设置。<br><br><strong>智能编码识别</strong><br>使用 chardetng 自动识别文件编码与换行符，支持 30 余种常见编码。<br><br><strong>保留原始格式</strong><br>保存时保留原有编码、BOM、换行符及末尾空行状态。<br><br><strong>修改编码</strong><br>支持手动修改文件编码与换行符，操作前弹窗确认，避免误操作。",

    "about.features.large_file.title": "大文件引擎",
    "about.features.large_file.desc": "<strong>极速打开</strong><br>超过 50MB 自动启用大文件模式，采用流式读取，支持 GB、TB 乃至更大规模文件的快速打开。<br><br><strong>高效浏览</strong><br>支持快速搜索、指定行跳转及智能编码识别。<br><br><strong>独立只读模式</strong><br>通过 Pending 标签按需加载，在独立大文件窗口中进行只读浏览，暂不支持编辑。",

    "about.features.preview.title": "Markdown / HTML 预览",
    "about.features.preview.desc": "<strong>实时分屏预览</strong><br>打开 Markdown 或 HTML 文件时，右上角会出现预览按钮（眼睛图标），点击即可开启分屏预览，编辑内容与预览效果实时同步。",

    "about.features.diff.title": "文本对比",
    "about.features.diff.desc": "<strong>差异高亮</strong><br>支持小文件对比，自动识别并高亮显示两份文本之间的差异（不支持大文件）。<br><br><strong>两种对比入口</strong><br>• 按住 Ctrl 或 Shift 选中两个标签，右键点击「对比」。<br>• 右键单个标签，在「对比」菜单中选择另一个标签。",

    // ===== 快捷键表格 =====
    "about.features.shortcuts.th_op": "操作",
    "about.features.shortcuts.th_win": "Windows / Linux",
    "about.features.shortcuts.th_mac": "macOS",

    "about.features.shortcuts.op_new": "新建文件 / 标签",
    "about.features.shortcuts.op_open_save": "打开 / 保存",
    "about.features.shortcuts.op_save_as": "另存为",
    "about.features.shortcuts.op_close_tab": "关闭标签",
    "about.features.shortcuts.op_copy_path": "复制文件路径",
    "about.features.shortcuts.op_rename": "重命名",
    "about.features.shortcuts.op_copy_paste": "复制 / 粘贴 / 剪切 / 全选",
    "about.features.shortcuts.op_undo_redo": "撤销 / 重做",
    "about.features.shortcuts.key_undo_win": "Ctrl + Z / Y 或 Shift + Z",
    "about.features.shortcuts.key_undo_mac": "Cmd + Z / Y / Shift + Z",
    "about.features.shortcuts.op_find_replace": "查找 / 替换",
    "about.features.shortcuts.op_show_sidebar": "显示侧边栏",
    "about.features.shortcuts.op_switch_tab": "切换标签",
    "about.features.shortcuts.op_zoom": "缩放",
    "about.features.shortcuts.key_zoom_win": "Ctrl + + / - / 0 / 鼠标滚轮",
    "about.features.shortcuts.key_zoom_mac": "Cmd + + / - / 0 / 鼠标滚轮",
    "about.features.shortcuts.op_close_modal": "关闭弹窗",
    "about.features.shortcuts.op_quit": "退出程序",

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

    // ===== 查找替换 =====
    "editor.find.placeholder": "查找",
    "editor.find.replace_placeholder": "替换",
    "editor.find.show_replace": "展开替换",
    "editor.find.hide_replace": "收起替换",
    "editor.find.close": "关闭 (Esc)",
    "editor.find.find_in_selection": "在选定内容中查找",
    "editor.find.match_case": "区分大小写",
    "editor.find.match_whole_word": "全字匹配",
    "editor.find.use_regex": "使用正则表达式",
    "editor.find.preserve_case": "保留大小写",
    "editor.find.replace": "替换",
    "editor.find.replace_all": "全部替换",
    "editor.find.prev_match": "上一个匹配项",
    "editor.find.next_match": "下一个匹配项",
    "editor.find.no_results": "无结果",
    "editor.find.match_count": "第 {current} 项，共 {total} 项",

    // ===== macOS菜单 =====
    "menu.file": "文件",
    "menu.edit": "编辑",
    "menu.view": "视图",
    "menu.quit": "退出 FinchPad",

};
