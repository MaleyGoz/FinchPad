export const idID: Record<string, string> = {
  // ===== Settings Menu =====
  "settings.view": "Tampilan",
  "settings.show_line_numbers": "Tampilkan nomor baris",
  "settings.word_wrap": "Word Wrap",
  "settings.theme": "Tema",
  "settings.theme.white": "Putih",
  "settings.theme.gray": "Abu-abu",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Hijau",
  "settings.theme.dark": "Gelap",
  "settings.language": "Bahasa",
  "settings.about": "Tentang FinchPad",
  "settings.check_update": "Periksa Pembaruan",
  "dialog.update_checking": "Memeriksa pembaruan...",
  "dialog.update_latest": "Anda menggunakan versi terbaru (v{version}).",
  "dialog.update_found":
    "Versi baru ditemukan!\nSaat ini: v{current}\nTerbaru: v{latest}\n\nBuka GitHub untuk mengunduh?",
  "dialog.update_failed": "Gagal memeriksa pembaruan. Periksa koneksi jaringan Anda.",
  "dialog.update_confirm": "Unduh",
  "dialog.update_cancel": "Batal",

  // ===== Language Options =====
  "locale.auto": "Otomatis",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== Tab Context Menu =====
  "tab_menu.save": "Simpan",
  "tab_menu.save_as": "Simpan Sebagai",
  "tab_menu.close": "Tutup Tab",
  "tab_menu.close_others": "Tutup Tab Lainnya",
  "tab_menu.close_left": "Tutup Tab di Kiri",
  "tab_menu.close_right": "Tutup Tab di Kanan",
  "tab_menu.copy_path": "Salin Jalur File",
  "tab_menu.reveal_in_explorer": "Tampilkan di Explorer",
  "tab_menu.diff": "Bandingkan",
  "tab_menu.rename": "Ganti Nama",

  "diff.window_title": "Bandingkan",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Pertahankan Milik Saya",
  "diff.use_disk": "Gunakan Versi Disk",

  // ===== Tab Bar Empty Area Menu =====
  "bar_menu.new": "Tab Baru",
  "bar_menu.open": "Buka File",

  // ===== Rename Dialog =====
  "dialog.rename_exists": "File dengan nama ini sudah ada di direktori tersebut.",
  "dialog.rename_failed": "Gagal mengganti nama: {error}",

  // ===== Editor Context Menu =====
  "editor_menu.undo": "Urungkan",
  "editor_menu.redo": "Ulangi",
  "editor_menu.cut": "Potong",
  "editor_menu.copy": "Salin",
  "editor_menu.paste": "Tempel",
  "editor_menu.delete": "Hapus",
  "editor_menu.select_all": "Pilih Semua",

  // ===== SideBar =====
  "sidebar.recent": "File Terbaru",
  "sidebar.directory": "Direktori Saat Ini",
  "sidebar.file_not_found": "File tidak ditemukan atau telah dipindahkan: {path}",
  "sidebar.empty": "Tidak ada catatan",
  "sidebar.up": "Naik Satu Tingkat",

  // ===== Status Bar =====
  "status.unsaved": "Belum Disimpan",
  "status.external_deleted": "⚠ Dihapus dari luar",
  "status.external_unreachable": "⚠ Lokasi tidak dapat dijangkau",
  "status.external_modified": "⚠ Dimodifikasi dari luar",
  "status.line_and_chars": "{lines} baris · {chars} karakter",
  "status.selected_chars": "{chars} karakter dipilih",
  "status.selected_lines_and_chars": "{lines} baris · {chars} karakter dipilih",
  "status.short_line_numbers": "Baris",
  "status.short_word_wrap": "Wrap",
  "status.encoding_tooltip": "Encoding: {encoding}",
  "status.line_ending_lf": "Akhiran baris Unix (LF)",
  "status.line_ending_crlf": "Akhiran baris Windows (CRLF)",
  "status.line_ending_cr": "Akhiran baris Macintosh (CR)",

  // ===== Close/Save Dialogs =====
  "dialog.close_confirm": "Ya",
  "dialog.close_cancel": "Tidak",
  "dialog.cancel": "Batal",
  "dialog.filter.all_files": "Semua File",
  "dialog.filter.text_files": "File Teks",

  "dialog.ask_save_unnamed": 'Simpan file "{title}"?',
  "dialog.ask_save_named": 'Simpan perubahan ke "{title}"?',

  // ===== Conflict Resolution =====
  "dialog.conflict_title":
    "{path}\nFile telah dimodifikasi dari luar. Pilih tindakan:",
  "dialog.conflict_overwrite": "Timpa",
  "dialog.conflict_discard": "Muat Ulang",
  "dialog.conflict_discard_close": "Buang Perubahan",
  "dialog.conflict_compare": "Bandingkan",
  "dialog.conflict_save_as": "Simpan Sebagai",
  "dialog.save_as_conflict":
    "Gagal menyimpan: File sudah terbuka di tab lain. Tutup tab tersebut dan coba lagi.\nPath: {path}",
  "dialog.ok": "OK",

  // ===== Large File Close Dialog =====
  "dialog.large_close":
    'File "{title}" memiliki perubahan yang belum disimpan. Perubahan akan hilang jika ditutup.',
  "dialog.large_close_yes": "Simpan",
  "dialog.large_close_no": "Jangan Simpan",

  // ===== Large File Placeholder =====
  "pending.title": "File besar, belum dimuat",
  "pending.size": "Ukuran: {size}",
  "pending.hint": "Editor mungkin tidak responsif sebentar setelah dimuat",
  "pending.load": "Muat Sekarang",

  // ===== About Dialog =====
  "about.title": "FinchPad",
  "about.version": "Versi {version}",
  "about.line1": "Editor teks polos modern, ringan, dan multi-tab.",
  "about.line2": "Dibuat untuk menjadi editor teks default yang lebih baik.",
  "about.tech": "Dibangun dengan: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Penulis: MaleyGoz",
  "about.license": "Lisensi: MIT",
  "about.website": "Situs web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Untitled Tabs =====
  "tab.unnamed": "Tanpa Judul {index}",
  "tab.unnamed_fallback": "Tanpa Judul",
};