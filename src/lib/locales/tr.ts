export const trTR: Record<string, string> = {
  // ===== Ayarlar Menüsü =====
  "settings.view": "Görünüm",
  "settings.show_line_numbers": "Satır numaralarını göster",
  "settings.word_wrap": "Kelime kaydırma",
  "settings.theme": "Tema",
  "settings.theme.white": "Beyaz",
  "settings.theme.gray": "Gri",
  "settings.theme.sepia": "Sepya",
  "settings.theme.green": "Yeşil",
  "settings.theme.dark": "Koyu",
  "settings.language": "Dil",
  "settings.about": "FinchPad Hakkında",
  "settings.check_update": "Güncellemeleri Denetle",
  "dialog.update_checking": "Güncellemeler denetleniyor...",
  "dialog.update_latest": "Zaten en son sürümdesiniz (v{version}).",
  "dialog.update_found":
    "Yeni sürüm bulundu!\nMevcut: v{current}\nEn son: v{latest}\n\nİndirmek için GitHub'a git?",
  "dialog.update_failed": "Güncelleme denetlenemedi. Lütfen ağ bağlantınızı kontrol edin.",
  "dialog.update_confirm": "İndir",
  "dialog.update_cancel": "İptal",

  // ===== Dil Seçenekleri =====

  // ===== Sekme Bağlam Menüsü =====
  "tab_menu.save": "Kaydet",
  "tab_menu.save_as": "Farklı Kaydet",
  "tab_menu.close": "Sekmeyi Kapat",
  "tab_menu.close_others": "Diğer Sekmeleri Kapat",
  "tab_menu.close_left": "Soldaki Sekmeleri Kapat",
  "tab_menu.close_right": "Sağdaki Sekmeleri Kapat",
  "tab_menu.close_all": "Tümünü Kapat",
  "tab_menu.copy_path": "Dosya Yolunu Kopyala",
  "tab_menu.reveal_in_explorer": "Dosya Gezgini'nde Göster",
  "tab_menu.diff": "Karşılaştır",
  "tab_menu.rename": "Yeniden Adlandır",

  "diff.window_title": "Karşılaştır",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Düzenleyici",
  "diff.keep_mine": "Benimkini Koru",
  "diff.use_disk": "Disk Sürümünü Kullan",

  // ===== Sekme Çubuğu Boş Alan Menüsü =====
  "bar_menu.new": "Yeni Sekme",
  "bar_menu.open": "Dosya Aç",

  // ===== Yeniden Adlandırma İletişim Kutusu =====
  "dialog.rename_exists": "Bu dizinde aynı ada sahip bir dosya zaten var.",
  "dialog.rename_failed": "Yeniden adlandırma başarısız: {error}",

  // ===== Düzenleyici Bağlam Menüsü =====
  "editor_menu.undo": "Geri Al",
  "editor_menu.redo": "Yinele",
  "editor_menu.cut": "Kes",
  "editor_menu.copy": "Kopyala",
  "editor_menu.paste": "Yapıştır",
  "editor_menu.delete": "Sil",
  "editor_menu.select_all": "Tümünü Seç",

  // ===== SideBar =====
  "sidebar.empty_recent": "Son dosya yok",
  "sidebar.empty_dir": "Boş klasör",
  "sidebar.up": "Üst Dizine Çık",
  "sidebar.dir_unreachable": "⚠️ Dizine erişilemiyor:\n{path}\n\nOlası nedenler: USB sürücüsü çıkarıldı, ağ sürücüsü bağlanmadı veya klasör yeniden adlandırıldı.",

  "sidebar.recent": "Son Dosyalar",
  "sidebar.directory": "Mevcut Dizin",
  "sidebar.file_not_found": "Dosya bulunamadı veya taşındı: {path}",

  // ===== Durum Çubuğu =====
  "status.unsaved": "Kaydedilmedi",
  "status.external_deleted": "⚠ Dışarıdan silindi",
  "status.external_unreachable": "⚠ Konum erişilemez",
  "status.external_modified": "⚠ Dışarıdan değiştirildi",
  "status.line_and_chars": "{lines} satır · {chars} karakter",
  "status.selected_chars": "{chars} karakter seçildi",
  "status.selected_lines_and_chars": "{lines} satır · {chars} karakter seçildi",
  "status.short_line_numbers": "Satırlar",
  "status.short_word_wrap": "Kaydırma",
  "status.encoding_tooltip": "Kodlama: {encoding}",
  "status.line_ending_lf": "Unix satır sonu (LF)",
  "status.line_ending_crlf": "Windows satır sonu (CRLF)",
  "status.line_ending_cr": "Macintosh satır sonu (CR)",

  // ===== Kapatma/Kaydetme İletişim Kutuları =====
  "dialog.close_confirm": "Evet",
  "dialog.close_cancel": "Hayır",
  "dialog.cancel": "İptal",
  "dialog.filter.all_files": "Tüm Dosyalar",
  "dialog.filter.text_files": "Metin Dosyaları",

  "dialog.ask_save_unnamed": '"{title}" dosyası kaydedilsin mi?',
  "dialog.ask_save_named": '"{title}" üzerindeki değişiklikler kaydedilsin mi?',

  // ===== Çakışma Çözümü =====
  "dialog.conflict_title":
    "{path}\nDosya dışarıdan değiştirildi. Nasıl devam edilsin?",
  "dialog.conflict_overwrite": "Üzerine Yaz",
  "dialog.conflict_discard": "Yeniden Yükle",
  "dialog.conflict_discard_close": "Değişiklikleri At",
  "dialog.conflict_compare": "Karşılaştır",
  "dialog.conflict_save_as": "Farklı Kaydet",
  "dialog.save_as_conflict":
    "Kaydetme başarısız: Dosya zaten başka bir sekmede açık. Lütfen o sekmeyi kapatıp tekrar deneyin.\nYol: {path}",
  "dialog.ok": "Tamam",

  // ===== Büyük Dosya Kapatma İletişim Kutusu =====
  "dialog.large_close":
    '"{title}" dosyasında kaydedilmemiş değişiklikler var. Kapatılırsa bu değişiklikler kaybolacak.',
  "dialog.large_close_yes": "Kaydet",
  "dialog.large_close_no": "Kaydetme",

  // ===== Büyük Dosya Yer Tutucu =====

  // ===== Hakkında İletişim Kutusu =====
  "about.title": "FinchPad",
  "about.version": "Sürüm {version}",
  "about.line1": "Modern, hafif, çok sekme destekli düz metin düzenleyici.",
  "about.line2": "Daha iyi bir varsayılan metin düzenleyici olmayı hedefler.",
  "about.tech": "Teknoloji: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Yazar: MaleyGoz",
  "about.license": "Lisans: MIT",
  "about.website": "Web sitesi: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "Tamam",

  // ===== Adsız Sekmeler =====
  "tab.unnamed": "Adsız {index}",
  "tab.unnamed_fallback": "Adsız",

  "large_file.searching": "Dosya taranıyor...",
  "large_file.search_limit": "Yalnızca ilk 100 sonuç gösteriliyor, lütfen daha kesin anahtar kelimeler kullanın",
  "sidebar.record_history": "Geçmişi Kaydet",
  "large_file.search_placeholder": "Ara...",
  "large_file.auto_detect": "🔄 Otomatik Algıla",
  "large_file.search_failed": "Arama başarısız, lütfen dosya durumunu kontrol edin.",
  "large_file.pending_size": "Dosya Boyutu: {size}",
  "large_file.pending_btn": "⚡ Hızlı Salt Okunur Görünüm",
  "large_file.no_results": "Eşleşme bulunamadı",
  "large_file.pending_hint": "Ana arayüzün akıcı kalması için, ultra hızlı salt okunur oluşturma için ayrı bir pencerede açılacaktır.",
  "large_file.pending_title": "Bu dosya büyük ve henüz yüklenmedi",
  "large_file.load_failed": "Okuma başarısız. Dosya harici olarak değiştirilmiş veya silinmiş olabilir.",
  "large_file.file_not_found": "Dosya harici olarak silinmiş veya taşınmış, açılamıyor.",
  "sidebar.delete_record": "Kaydı Sil",
  "sidebar.clear_history": "Geçmişi Temizle",
};