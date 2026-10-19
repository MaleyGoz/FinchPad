export const ja: Record<string, string> = {
  // ===== 設定メニュー =====
  "settings.view": "表示",
  "settings.show_line_numbers": "行番号",
  "settings.word_wrap": "折り返し",
  "settings.theme": "テーマ",
  "settings.theme.white": "白",
  "settings.theme.gray": "グレー",
  "settings.theme.sepia": "セピア",
  "settings.theme.green": "緑",
  "settings.theme.dark": "ダーク",
  "settings.language": "言語",
  "settings.about": "FinchPad について",
  "settings.check_update": "更新を確認",
  "dialog.update_checking": "更新を確認しています...",
  "dialog.update_latest": "最新版（v{version}）です。",
  "dialog.update_found":
    "新しいバージョンが見つかりました！\n現在: v{current}\n最新: v{latest}\n\nGitHub からダウンロードしますか？",
  "dialog.update_failed": "更新の確認に失敗しました。ネットワーク接続を確認してください。",
  "dialog.update_confirm": "ダウンロード",
  "dialog.update_cancel": "キャンセル",

  // ===== 言語オプション =====
  "locale.auto": "自動",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",
  "locale.ja": "日本語",

  // ===== タブ右クリックメニュー =====
  "tab_menu.save": "保存",
  "tab_menu.save_as": "名前を付けて保存",
  "tab_menu.close": "タブを閉じる",
  "tab_menu.close_others": "他のタブを閉じる",
  "tab_menu.close_left": "左のタブを閉じる",
  "tab_menu.close_right": "右のタブを閉じる",
  "tab_menu.copy_path": "ファイルパスをコピー",
  "tab_menu.reveal_in_explorer": "エクスプローラーで表示",
  "tab_menu.diff": "比較",
  "tab_menu.rename": "名前を変更",

  "diff.window_title": "比較",
  "diff.left_disk": "ディスク",
  "diff.right_editor": "エディター",
  "diff.keep_mine": "自分の変更を保持",
  "diff.use_disk": "ディスクのバージョンを使用",

  // ===== タブバー空白部分メニュー =====
  "bar_menu.new": "新規タブ",
  "bar_menu.open": "ファイルを開く",

  // ===== 名前変更ダイアログ =====
  "dialog.rename_exists": "同じ名前のファイルが既にこのディレクトリに存在します。",
  "dialog.rename_failed": "名前の変更に失敗しました: {error}",

  // ===== エディター右クリックメニュー =====
  "editor_menu.undo": "元に戻す",
  "editor_menu.redo": "やり直す",
  "editor_menu.cut": "切り取り",
  "editor_menu.copy": "コピー",
  "editor_menu.paste": "貼り付け",
  "editor_menu.delete": "削除",
  "editor_menu.select_all": "すべて選択",

  // ===== ステータスバー =====
  "status.unsaved": "未保存",
  "status.external_deleted": "⚠ 外部から削除されました",
  "status.external_unreachable": "⚠ 場所にアクセスできません",
  "status.external_modified": "⚠ 外部から変更されました",
  "status.line_and_chars": "{lines} 行 · {chars} 文字",
  "status.selected_chars": "{chars} 文字選択中",
  "status.selected_lines_and_chars": "{lines} 行 · {chars} 文字選択中",
  "status.word_wrap_on": "折り返し: オン",
  "status.word_wrap_off": "折り返し: オフ",
  "status.encoding_tooltip": "エンコーディング: {encoding}",
  "status.line_ending_lf": "Unix 改行 (LF)",
  "status.line_ending_crlf": "Windows 改行 (CRLF)",
  "status.line_ending_cr": "Macintosh 改行 (CR)",

  // ===== 閉じる/保存ダイアログ =====
  "dialog.close_confirm": "はい",
  "dialog.close_cancel": "いいえ",
  "dialog.cancel": "キャンセル",
  "dialog.filter.all_files": "すべてのファイル",
  "dialog.filter.text_files": "テキストファイル",

  "dialog.ask_save_unnamed": "ファイル「{title}」を保存しますか？",
  "dialog.ask_save_named": "「{title}」への変更を保存しますか？",

  // ===== 競合処理 =====
  "dialog.conflict_title":
    "{path}\nファイルが外部から変更されました。処理方法を選択してください:",
  "dialog.conflict_overwrite": "上書き",
  "dialog.conflict_discard": "再読み込み",
  "dialog.conflict_discard_close": "変更を破棄",
  "dialog.conflict_compare": "比較",
  "dialog.conflict_save_as": "名前を付けて保存",
  "dialog.save_as_conflict":
    "保存に失敗しました: このファイルは別のタブで既に開かれています。そのタブを閉じてから再試行してください。\nパス: {path}",
  "dialog.ok": "OK",

  // ===== 大ファイル閉じるダイアログ =====
  "dialog.large_close":
    "ファイル「{title}」には未保存の変更があります。閉じると変更は失われます。",
  "dialog.large_close_yes": "保存",
  "dialog.large_close_no": "保存しない",

  // ===== 大ファイルプレースホルダー =====
  "pending.title": "大きなファイルのため未読み込み",
  "pending.size": "サイズ: {size}",
  "pending.hint": "読み込み後、エディターが一時的に応答しなくなる場合があります",
  "pending.load": "今すぐ読み込む",

  // ===== バージョン情報ダイアログ =====
  "about.title": "FinchPad",
  "about.version": "バージョン {version}",
  "about.line1": "モダンで軽量、マルチタブ対応のプレーンテキストエディター。",
  "about.line2": "より良い標準テキストエディターを目指しています。",
  "about.tech": "技術スタック: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "作者: MaleyGoz",
  "about.license": "ライセンス: MIT",
  "about.website": "Webサイト: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== 無題タブ =====
  "tab.unnamed": "無題 {index}",
  "tab.unnamed_fallback": "無題",
};