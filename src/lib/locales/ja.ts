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

  // ===== 标签栏 =====
  "tab_bar.new_tab": "新しいタブ",
  "tab_bar.settings": "設定",
  "tab_bar.preview": "プレビュー",

  // ===== 言語オプション =====

  // ===== タブ右クリックメニュー =====
  "tab_menu.save": "保存",
  "tab_menu.save_as": "名前を付けて保存",
  "tab_menu.close": "タブを閉じる",
  "tab_menu.close_others": "他のタブを閉じる",
  "tab_menu.close_left": "左のタブを閉じる",
  "tab_menu.close_right": "右のタブを閉じる",
  "tab_menu.close_all": "すべてを閉じる",
  "tab_menu.reopen": "閉じたタブを再度開く",
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

  // ===== SideBar =====
  "sidebar.empty_recent": "最近のファイルはありません",
  "sidebar.empty_dir": "空のフォルダ",
  "sidebar.up": "上の階層へ",
  "sidebar.dir_unreachable": "⚠️ ディレクトリにアクセスできません:\n{path}\n\n考えられる原因：USBドライブが抜かれている、ネットワークドライブがマウントされていない、またはフォルダ名が変更されている。",

  "sidebar.recent": "最近のファイル",
  "sidebar.directory": "現在のディレクトリ",
  "sidebar.file_not_found": "ファイルが見つからないか、移動されました: {path}",

  // ===== ステータスバー =====
  "status.unsaved": "未保存",
  "status.external_deleted": "⚠ 外部から削除されました",
  "status.external_unreachable": "⚠ 場所にアクセスできません",
  "status.external_modified": "⚠ 外部から変更されました",
  "status.line_and_chars": "{lines} 行 · {chars} 文字",
  "status.selected_chars": "{chars} 文字選択中",
  "status.selected_lines_and_chars": "{lines} 行 · {chars} 文字選択中",
  "status.short_line_numbers": "行番号",
  "status.short_word_wrap": "折り返し",
  "status.zoom_tooltip": "ズーム倍率",
  "status.scroll_wheel": "ホイール",
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

  "large_file.searching": "ファイルをスキャン中...",
  "large_file.search_limit": "最初の100件のみを表示しています。より具体的なキーワードを使用してください",
  "sidebar.record_history": "履歴を記録",
  "large_file.search_placeholder": "検索...",
  "large_file.auto_detect": "🔄 自動検出",
  "large_file.search_failed": "検索に失敗しました。ファイルの状態を確認してください。",
  "large_file.pending_size": "ファイルサイズ：{size}",
  "large_file.pending_btn": "⚡ 高速読み取り専用表示",
  "large_file.no_results": "一致するものが見つかりません",
  "large_file.pending_hint": "メイン画面の動作を維持するため、別ウィンドウで超高速の読み取り専用表示を行います。",
  "large_file.pending_title": "このファイルは大きいため、まだ読み込まれていません",
  "large_file.load_failed": "読み取りに失敗しました。ファイルが外部で変更または削除された可能性があります。",
  "large_file.file_not_found": "ファイルが外部で削除または移動されたため、開くことができません。",
  "sidebar.delete_record": "レコードを削除",
  "sidebar.clear_history": "履歴を消去",

    // ===== 查找替换 =====
    "editor.find.placeholder": "検索",
    "editor.find.replace_placeholder": "置換",
    "editor.find.show_replace": "置換を表示",
    "editor.find.hide_replace": "置換を非表示",
    "editor.find.close": "閉じる (Esc)",
    "editor.find.find_in_selection": "選択範囲内を検索",
    "editor.find.match_case": "大文字と小文字を区別",
    "editor.find.match_whole_word": "単語単位で検索",
    "editor.find.use_regex": "正規表現を使用",
    "editor.find.preserve_case": "大文字と小文字を保持",
    "editor.find.replace": "置換",
    "editor.find.replace_all": "すべて置換",
    "editor.find.prev_match": "前へ",
    "editor.find.next_match": "次へ",
    "editor.find.no_results": "結果なし",
    "editor.find.match_count": "{current} / {total}",

};