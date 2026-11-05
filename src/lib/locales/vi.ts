export const vi: Record<string, string> = {
    // ===== Menu cài đặt =====
    "settings.view": "Xem",
    "settings.show_line_numbers": "Số dòng",
    "settings.word_wrap": "Ngắt dòng tự động",
    "settings.theme": "Giao diện",
    "settings.theme.white": "Trắng",
    "settings.theme.gray": "Xám",
    "settings.theme.sepia": "Nâu đỏ",
    "settings.theme.green": "Xanh lá",
    "settings.theme.dark": "Tối",
    "settings.language": "Ngôn ngữ",
    "settings.about": "Giới thiệu FinchPad",
    "settings.check_update": "Kiểm tra cập nhật",
    "dialog.update_checking": "Đang kiểm tra cập nhật...",
    "dialog.update_latest": "Bạn đang sử dụng phiên bản mới nhất (v{version}).",
    "dialog.update_found": "Đã tìm thấy phiên bản mới!\nHiện tại: v{current}\nMới nhất: v{latest}\n\nTruy cập GitHub để tải xuống?",
    "dialog.update_failed": "Không thể kiểm tra cập nhật. Vui lòng kiểm tra mạng của bạn.",
    "dialog.update_confirm": "Bản mới nhất",
    "dialog.update_cancel": "Hủy bỏ",

    // ===== Thanh tab =====
    "tab_bar.new_tab": "Tab mới",
    "tab_bar.settings": "Cài đặt",
    "tab_bar.preview": "Xem trước",
    "tab_bar.more_tabs": "Thêm tab",

    // ===== Menu chuột phải trên tab =====
    "tab_menu.save": "Lưu",
    "tab_menu.save_as": "Lưu thành",
    "tab_menu.close": "Đóng tab",
    "tab_menu.close_others": "Đóng các tab khác",
    "tab_menu.close_left": "Đóng các tab bên trái",
    "tab_menu.close_right": "Đóng các tab bên phải",
    "tab_menu.close_all": "Đóng tất cả các tab",
    "tab_menu.reopen": "Mở lại tab đã đóng",
    "tab_menu.copy_path": "Sao chép đường dẫn",
    "tab_menu.reveal_in_explorer": "Hiển thị trong thư mục",
    "tab_menu.diff": "So sánh",
    "tab_menu.rename": "Đổi tên",

    "diff.window_title": "So sánh",
    "diff.left_disk": "Phiên bản trên đĩa",
    "diff.right_editor": "Phiên bản trong trình soạn thảo",
    "diff.keep_mine": "Giữ thay đổi của tôi",
    "diff.use_disk": "Dùng phiên bản trên đĩa",

    // ===== Menu vùng trống thanh tab =====
    "bar_menu.new": "Tab mới",
    "bar_menu.open": "Mở tệp",

    // ===== Hộp thoại đổi tên =====
    "dialog.rename_exists": "Tệp có tên này đã tồn tại.",
    "dialog.rename_failed": "Đổi tên thất bại: {error}",

    // ===== Menu chuột phải trình soạn thảo =====
    "editor_menu.undo": "Hoàn tác",
    "editor_menu.redo": "Làm lại",
    "editor_menu.cut": "Cắt",
    "editor_menu.copy": "Sao chép",
    "editor_menu.paste": "Dán",
    "editor_menu.delete": "Xóa",
    "editor_menu.select_all": "Chọn tất cả",

    // ===== Thanh bên =====
    "sidebar.recent": "Tệp gần đây",
    "sidebar.directory": "Thư mục hiện tại",
    "sidebar.file_not_found": "Không tìm thấy tệp hoặc đã bị di chuyển: {path}",
    "sidebar.empty_recent": "Không có tệp gần đây",
    "sidebar.empty_dir": "Thư mục trống",
    "sidebar.up": "Đi lên",
    "sidebar.dir_unreachable": "⚠️ Không thể truy cập thư mục:\n{path}\n\nNguyên nhân có thể: Ổ USB đã rút, ổ mạng chưa được gắn hoặc thư mục bị đổi tên.",
    "sidebar.record_history": "Ghi lại lịch sử",
    "sidebar.clear_history": "Xóa lịch sử",
    "sidebar.delete_record": "Xóa bản ghi",

    // ===== Thanh trạng thái =====
    "status.unsaved": "Chưa lưu",
    "status.external_deleted": "⚠ Đã bị xóa bên ngoài",
    "status.external_unreachable": "⚠ Không thể truy cập vị trí",
    "status.external_modified": "⚠ Đã bị sửa đổi bên ngoài",
    "status.line_and_chars": "{lines} dòng · {chars} ký tự",
    "status.selected_chars": "Đã chọn {chars} ký tự",
    "status.selected_lines_and_chars": "Đã chọn {lines} dòng · {chars} ký tự",
    "status.short_line_numbers": "Số dòng",
    "status.short_word_wrap": "Ngắt dòng",
    "status.zoom_tooltip": "Thu phóng",
    "status.scroll_wheel": "Con lăn",
    "status.encoding_tooltip": "Bảng mã: {encoding}",
    "status.line_ending_lf": "Ký tự xuống dòng Unix (LF)",
    "status.line_ending_crlf": "Ký tự xuống dòng Windows (CRLF)",
    "status.line_ending_cr": "Ký tự xuống dòng Macintosh (CR)",

    // ===== Hộp thoại Đóng/Lưu =====
    "dialog.close_confirm": "Có",
    "dialog.close_cancel": "Không",
    "dialog.cancel": "Hủy bỏ",
    "dialog.filter.all_files": "Tất cả các tệp",
    "dialog.filter.text_files": "Tệp văn bản",
    "dialog.ask_save_unnamed": "Lưu tệp \"{title}\"?",
    "dialog.ask_save_named": "Lưu thay đổi vào \"{title}\"?",

    // ===== Giải quyết xung đột =====
    "dialog.conflict_title": "{path}\nTệp đã bị sửa đổi bên ngoài. Chọn cách tiếp tục:",
    "dialog.conflict_overwrite": "Ghi đè",
    "dialog.conflict_discard": "Tải lại",
    "dialog.conflict_discard_close": "Hủy bỏ",
    "dialog.conflict_compare": "So sánh",
    "dialog.conflict_save_as": "Lưu thành",
    "dialog.save_as_conflict": "Lưu thất bại: Tệp đã được mở trong một tab khác. Vui lòng đóng nó và thử lại.\nĐường dẫn: {path}",
    "dialog.ok": "Đồng ý",

    // ===== Hộp thoại đóng tệp lớn =====
    "dialog.large_close": "Tệp \"{title}\" có các thay đổi chưa lưu. Chúng sẽ bị mất nếu bạn đóng.",
    "dialog.large_close_yes": "Lưu",
    "dialog.large_close_no": "Không lưu",

    // ===== Hộp thoại sửa đổi bảng mã và ký tự xuống dòng =====
    "dialog.format_type_encoding": "bảng mã",
    "dialog.format_type_line_ending": "ký tự xuống dòng",
    "dialog.change_format_title": "Đổi {typeName} thành \"{value}\"?",
    "dialog.change_format_subtitle": "Tài liệu có thể được chuyển đổi không mất dữ liệu. Nội dung tệp sẽ được cập nhật sau khi lưu.",
    "dialog.change_format_lossy_title": "⚠ Thay đổi {typeName} có thể gây mất ký tự",
    "dialog.change_format_lossy_subtitle": "Tài liệu chứa các ký tự đặc biệt. Sau khi chuyển sang \"{value}\", các ký tự này sẽ được thay thế bằng \"?\" và không thể khôi phục.",
    "encoding_group_unicode": "Mở rộng Unicode",
    "encoding_group_cjk": "CJK",
    "encoding_group_western": "Tây Âu",
    "encoding_group_central_europe": "Trung/Đông Âu",
    "encoding_group_cyrillic": "Kirin",
    "encoding_group_others": "Trung Đông & Khác",
    "encoding.recommend": "Đề xuất",

    // ===== Giới thiệu =====
    "about.title": "FinchPad",
    "about.version": "Phiên bản {version}",
    "about.line1": "Một trình soạn thảo văn bản thuần hiện đại, nhẹ, đa tab.",
    "about.line2": "Hướng tới việc trở thành trình soạn thảo văn bản mặc định tốt hơn.",
    "about.tech": "Được xây dựng với: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
    "about.author": "Tác giả: MaleyGoz",
    "about.license": "Giấy phép: MIT",
    "about.website": "Trang web: https://github.com/MaleyGoz/FinchPad",
    "about.ok": "Đồng ý",

    // ===== Tab không tên =====
    "tab.unnamed": "Không tên {index}",
    "tab.unnamed_fallback": "Không tên",

    // ===== Tệp lớn =====
    "large_file.pending_title": "Tệp này lớn và chưa được tải",
    "large_file.pending_size": "Kích thước tệp: {size}",
    "large_file.pending_hint": "Để giữ giao diện chính mượt mà, nó sẽ mở trong một cửa sổ riêng để hiển thị chỉ đọc cực nhanh.",
    "large_file.pending_btn": "⚡ Xem nhanh chỉ đọc",
    "large_file.searching": "Đang quét tệp...",
    "large_file.no_results": "Không tìm thấy kết quả phù hợp",
    "large_file.search_failed": "Tìm kiếm thất bại, vui lòng kiểm tra trạng thái tệp.",
    "large_file.search_limit": "Chỉ hiển thị 100 kết quả đầu tiên, vui lòng sử dụng từ khóa chính xác hơn",
    "large_file.file_not_found": "Tệp đã bị xóa hoặc di chuyển bên ngoài và không thể mở.",
    "large_file.load_failed": "Đọc thất bại. Tệp có thể đã bị sửa đổi hoặc xóa bên ngoài.",
    "large_file.search_placeholder": "Tìm kiếm...",
    "large_file.auto_detect": "🔄 Tự động phát hiện",

    // ===== Tìm và thay thế =====
    "editor.find.placeholder": "Tìm",
    "editor.find.replace_placeholder": "Thay thế",
    "editor.find.show_replace": "Hiện thay thế",
    "editor.find.hide_replace": "Ẩn thay thế",
    "editor.find.close": "Đóng (Esc)",
    "editor.find.find_in_selection": "Tìm trong vùng chọn",
    "editor.find.match_case": "Phân biệt chữ hoa/chữ thường",
    "editor.find.match_whole_word": "Toàn bộ từ",
    "editor.find.use_regex": "Biểu thức chính quy",
    "editor.find.preserve_case": "Giữ nguyên chữ hoa/thường",
    "editor.find.replace": "Thay thế",
    "editor.find.replace_all": "Thay thế tất cả",
    "editor.find.prev_match": "Kết quả trước",
    "editor.find.next_match": "Kết quả tiếp theo",
    "editor.find.no_results": "Không có kết quả",
    "editor.find.match_count": "{current} / {total}",

    
    // ===== Menu macOS =====
    "menu.file": "Tệp",
    "menu.edit": "Sửa",
    "menu.view": "Xem",
    "menu.quit": "Thoát FinchPad",
};