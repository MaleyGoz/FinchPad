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
  "settings.about": "关于 TXT Editor",

  // ===== 语言选项 =====
  "locale.auto": "跟随系统",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",

  // ===== 标签右键菜单 =====
  "tab_menu.save": "保存",
  "tab_menu.save_as": "另存为",
  "tab_menu.close": "关闭标签",
  "tab_menu.close_others": "关闭其它标签",
  "tab_menu.close_left": "关闭左侧标签",
  "tab_menu.close_right": "关闭右侧标签",
  "tab_menu.copy_path": "复制文件路径",
  "tab_menu.reveal_in_explorer": "打开所在文件夹",

  // ===== 标签栏空白处菜单 =====
  "bar_menu.new": "新建标签",
  "bar_menu.open": "打开文件",

  // ===== 编辑区右键菜单 =====
  "editor_menu.undo": "撤销",
  "editor_menu.redo": "重做",
  "editor_menu.cut": "剪切",
  "editor_menu.copy": "复制",
  "editor_menu.paste": "粘贴",
  "editor_menu.delete": "删除",
  "editor_menu.select_all": "全选",

  // ===== 状态栏 =====
  "status.unsaved": "未保存",
  "status.external_deleted": "⚠ 已被外部删除",
  "status.external_unreachable": "⚠ 位置暂不可访问",
  "status.external_modified": "⚠ 已被外部修改",
  "status.line_and_chars": "共 {lines} 行 · {chars} 字符",
  "status.selected_chars": "选中 {chars} 字符",
  "status.selected_lines_and_chars": "选中 {lines} 行 · {chars} 字符",
  "status.word_wrap_on": "自动换行：是",
  "status.word_wrap_off": "自动换行：否",
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
  "dialog.save": "保存",
  "dialog.discard": "不保存",

  "dialog.ask_save_unnamed": "是否保存文件「{title}」？",
  "dialog.ask_save_named": "是否保存对「{title}」的修改？",

  // ===== 冲突处理 =====
  "dialog.conflict_title": "文件已被外部修改。请选择处理方式。",
  "dialog.conflict_overwrite": "覆盖磁盘",
  "dialog.conflict_discard": "放弃修改",
  "dialog.conflict_compare": "对比差异",
  "dialog.conflict_save_as": "另存为",
  "dialog.conflict_not_implemented": "对比差异功能即将推出",

  // ===== 外部变化弹窗 =====
  "dialog.external_modified":
    "此文件被另一个程序修改了。是否重新加载文件并放弃在 TXT Editor 中的更改？",
  "dialog.external_deleted_keep":
    "文件「{title}」已经从磁盘上删除。是否在编辑器中保留它？",
  "dialog.external_deleted_save":
    "文件「{title}」已从磁盘删除。是否保存内容以重建该文件？",
  "dialog.external_unreachable_save":
    "文件「{title}」所在位置当前不可访问。是否另存为其它位置？",

  // ===== 大文件关窗弹窗 =====
  "dialog.large_close": "文件「{title}」有未保存的修改。关闭后这些修改会丢失。",
  "dialog.large_close_yes": "保存",
  "dialog.large_close_no": "不保存",

  // ===== 大文件占位 =====
  "pending.title": "此文件较大，尚未加载",
  "pending.size": "文件大小：{size}",
  "pending.hint": "加载后编辑器可能短暂无响应",
  "pending.load": "立即加载",

  // ===== 关于弹窗 =====
  "about.title": "TXT Editor",
  "about.version": "版本 {version}",
  "about.line1": "一款现代、轻量化、多标签的纯文本编辑器。",
  "about.line2": "旨在成为更好的系统默认文本编辑器。",
  "about.tech": "技术架构：Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "作者：MaleyGoz",
  "about.license": "开源协议：MIT License",
  "about.website": "官网：https://github.com/MaleyGoz/TXT-Editor",
  "about.ok": "确定",

  // ===== 未命名标签 =====
  "tab.unnamed": "未命名 {index}",
  "tab.unnamed_fallback": "未命名",
  "tab.unnamed_default": "未命名.txt",
};
