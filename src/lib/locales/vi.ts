export const viVN: Record<string, string> = {
  // ===== Menu Cài đặt =====
  "settings.view": "Hiển thị",
  "settings.show_line_numbers": "Hiển thị số dòng",
  "settings.word_wrap": "Ngắt dòng",
  "settings.theme": "Giao diện",
  "settings.theme.white": "Trắng",
  "settings.theme.gray": "Xám",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Xanh lá",
  "settings.theme.dark": "Tối",
  "settings.language": "Ngôn ngữ",
  "settings.about": "Giới thiệu FinchPad",
  "settings.check_update": "Kiểm tra cập nhật",
  "dialog.update_checking": "Đang kiểm tra cập nhật...",
  "dialog.update_latest": "Bạn đang dùng phiên bản mới nhất (v{version}).",
  "dialog.update_found":
    "Đã tìm thấy phiên bản mới!\nHiện tại: v{current}\nMới nhất: v{latest}\n\nMở GitHub để tải xuống?",
  "dialog.update_failed": "Kiểm tra cập nhật thất bại. Vui lòng kiểm tra kết nối mạng.",
  "dialog.update_confirm": "Tải xuống",
  "dialog.update_cancel": "Hủy",

  // ===== Tùy chọn ngôn ngữ =====
  "locale.auto": "Tự động",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== Menu chuột phải trên thẻ =====
  "tab_menu.save": "Lưu",
  "tab_menu.save_as": "Lưu thành",
  "tab_menu.close": "Đóng thẻ",
  "tab_menu.close_others": "Đóng các thẻ khác",
  "tab_menu.close_left": "Đóng thẻ bên trái",
  "tab_menu.close_right": "Đóng thẻ bên phải",
  "tab_menu.copy_path": "Sao chép đường dẫn tệp",
  "tab_menu.reveal_in_explorer": "Mở trong Explorer",
  "tab_menu.diff": "So sánh",
  "tab_menu.rename": "Đổi tên",

  "diff.window_title": "So sánh",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Trình soạn thảo",
  "diff.keep_mine": "Giữ bản của tôi",
  "diff.use_disk": "Dùng bản trên đĩa",

  // ===== Menu vùng trống thanh thẻ =====
  "bar_menu.new": "Thẻ mới",
  "bar_menu.open": "Mở tệp",

  // ===== Hộp thoại đổi tên =====
  "dialog.rename_exists": "Đã tồn tại tệp có tên này trong thư mục.",
  "dialog.rename_failed": "Đổi tên thất bại: {error}",

  // ===== Menu chuột phải trình soạn thảo =====
  "editor_menu.undo": "Hoàn tác",
  "editor_menu.redo": "Làm lại",
  "editor_menu.cut": "Cắt",
  "editor_menu.copy": "Sao chép",
  "editor_menu.paste": "Dán",
  "editor_menu.delete": "Xóa",
  "editor_menu.select_all": "Chọn tất cả",

  // ===== SideBar =====
  "sidebar.empty_recent": "Không có tệp gần đây",
  "sidebar.empty_dir": "Thư mục trống",
  "sidebar.up": "Lên một cấp",
  "sidebar.dir_unreachable": "⚠️ Không thể truy cập thư mục:\n{path}\n\nNguyên nhân có thể: Ổ USB đã rút, ổ mạng chưa được gắn, hoặc thư mục đã đổi tên.",
  "sidebar.recent": "Tệp gần đây",
  "sidebar.directory": "Thư mục hiện tại",
  "sidebar.file_not_found": "Không tìm thấy tệp hoặc đã bị di chuyển: {path}",

  // ===== Thanh trạng thái =====
  "status.unsaved": "Chưa lưu",
  "status.external_deleted": "⚠ Đã bị xóa từ bên ngoài",
  "status.external_unreachable": "⚠ Vị trí không thể truy cập",
  "status.external_modified": "⚠ Đã bị sửa đổi từ bên ngoài",
  "status.line_and_chars": "{lines} dòng · {chars} ký tự",
  "status.selected_chars": "Đã chọn {chars} ký tự",
  "status.selected_lines_and_chars": "Đã chọn {lines} dòng · {chars} ký tự",
  "status.short_line_numbers": "Số dòng",
  "status.short_word_wrap": "Ngắt dòng",
  "status.encoding_tooltip": "Bảng mã: {encoding}",
  "status.line_ending_lf": "Ký tự xuống dòng Unix (LF)",
  "status.line_ending_crlf": "Ký tự xuống dòng Windows (CRLF)",
  "status.line_ending_cr": "Ký tự xuống dòng Macintosh (CR)",

  // ===== Hộp thoại đóng/lưu =====
  "dialog.close_confirm": "Có",
  "dialog.close_cancel": "Không",
  "dialog.cancel": "Hủy",
  "dialog.filter.all_files": "Tất cả tệp",
  "dialog.filter.text_files": "Tệp văn bản",

  "dialog.ask_save_unnamed": 'Lưu tệp "{title}"?',
  "dialog.ask_save_named": 'Lưu thay đổi cho "{title}"?',

  // ===== Xử lý xung đột =====
  "dialog.conflict_title":
    "{path}\nTệp đã bị sửa đổi từ bên ngoài. Chọn cách xử lý:",
  "dialog.conflict_overwrite": "Ghi đè",
  "dialog.conflict_discard": "Tải lại",
  "dialog.conflict_discard_close": "Hủy thay đổi",
  "dialog.conflict_compare": "So sánh",
  "dialog.conflict_save_as": "Lưu thành",
  "dialog.save_as_conflict":
    "Lưu thất bại: Tệp đã được mở ở thẻ khác. Vui lòng đóng thẻ đó và thử lại.\nĐường dẫn: {path}",
  "dialog.ok": "OK",

  // ===== Hộp thoại đóng tệp lớn =====
  "dialog.large_close":
    'Tệp "{title}" có thay đổi chưa được lưu. Các thay đổi này sẽ bị mất nếu đóng.',
  "dialog.large_close_yes": "Lưu",
  "dialog.large_close_no": "Không lưu",

  // ===== Vùng giữ chỗ tệp lớn =====
  "pending.title": "Tệp này khá lớn, chưa được tải",
  "pending.size": "Kích thước: {size}",
  "pending.hint": "Trình soạn thảo có thể tạm thời không phản hồi sau khi tải",
  "pending.load": "Tải ngay",

  // ===== Hộp thoại Giới thiệu =====
  "about.title": "FinchPad",
  "about.version": "Phiên bản {version}",
  "about.line1": "Trình soạn thảo văn bản thuần túy hiện đại, nhẹ và đa thẻ.",
  "about.line2": "Hướng tới mục tiêu trở thành trình soạn thảo văn bản mặc định tốt hơn.",
  "about.tech": "Công nghệ: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Tác giả: MaleyGoz",
  "about.license": "Giấy phép: MIT",
  "about.website": "Trang web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Thẻ chưa đặt tên =====
  "tab.unnamed": "Chưa đặt tên {index}",
  "tab.unnamed_fallback": "Chưa đặt tên",
};