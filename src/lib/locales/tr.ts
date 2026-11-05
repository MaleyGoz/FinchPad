export const tr: Record<string, string> = {
  // ===== Ayarlar menüsü =====
  "settings.view": "Görünüm",
  "settings.show_line_numbers": "Satır numaraları",
  "settings.word_wrap": "Kelime kaydırma",
  "settings.theme": "Tema",
  "settings.theme.white": "Beyaz",
  "settings.theme.gray": "Gri",
  "settings.theme.sepia": "Sepya",
  "settings.theme.green": "Yeşil",
  "settings.theme.dark": "Koyu",
  "settings.language": "Dil",
  "settings.about": "FinchPad Hakkında",
  "settings.check_update": "Güncellemeleri kontrol et",
  "dialog.update_checking": "Güncellemeler kontrol ediliyor...",
  "dialog.update_latest": "En son sürümü kullanıyorsunuz (v{version}).",
  "dialog.update_found": "Yeni sürüm bulundu!\nMevcut: v{current}\nEn son: v{latest}\n\nİndirmek için GitHub'a gidilsin mi?",
  "dialog.update_failed": "Güncellemeler kontrol edilemedi. Lütfen ağınızı kontrol edin.",
  "dialog.update_confirm": "Son Sürüm",
  "dialog.update_cancel": "İptal",

  // ===== Sekme çubuğu =====
  "tab_bar.new_tab": "Yeni sekme",
  "tab_bar.settings": "Ayarlar",
  "tab_bar.preview": "Önizleme",
  "tab_bar.more_tabs": "Daha fazla sekme",

  // ===== Sekme bağlam menüsü =====
  "tab_menu.save": "Kaydet",
  "tab_menu.save_as": "Farklı kaydet",
  "tab_menu.close": "Sekmeyi kapat",
  "tab_menu.close_others": "Diğer sekmeleri kapat",
  "tab_menu.close_left": "Soldaki sekmeleri kapat",
  "tab_menu.close_right": "Sağdaki sekmeleri kapat",
  "tab_menu.close_all": "Tüm sekmeleri kapat",
  "tab_menu.reopen": "Kapatılan sekmeyi yeniden aç",
  "tab_menu.copy_path": "Dosya yolunu kopyala",
  "tab_menu.reveal_in_explorer": "Gezginde göster",
  "tab_menu.diff": "Karşılaştır",
  "tab_menu.rename": "Yeniden adlandır",

  "diff.window_title": "Karşılaştır",
  "diff.left_disk": "Disk sürümü",
  "diff.right_editor": "Düzenleyici sürümü",
  "diff.keep_mine": "Değişikliklerimi koru",
  "diff.use_disk": "Disk sürümünü kullan",

  // ===== Sekme çubuğu boş alan menüsü =====
  "bar_menu.new": "Yeni sekme",
  "bar_menu.open": "Dosya aç",

  // ===== Yeniden adlandırma iletişim kutusu =====
  "dialog.rename_exists": "Bu ada sahip bir dosya zaten var.",
  "dialog.rename_failed": "Yeniden adlandırma başarısız: {error}",

  // ===== Düzenleyici bağlam menüsü =====
  "editor_menu.undo": "Geri al",
  "editor_menu.redo": "Yinele",
  "editor_menu.cut": "Kes",
  "editor_menu.copy": "Kopyala",
  "editor_menu.paste": "Yapıştır",
  "editor_menu.delete": "Sil",
  "editor_menu.select_all": "Tümünü seç",

  // ===== Kenar çubuğu =====
  "sidebar.recent": "Son dosyalar",
  "sidebar.directory": "Geçerli dizin",
  "sidebar.file_not_found": "Dosya bulunamadı veya taşındı: {path}",
  "sidebar.empty_recent": "Son dosya yok",
  "sidebar.empty_dir": "Boş klasör",
  "sidebar.up": "Yukarı",
  "sidebar.dir_unreachable": "⚠️ Dizine erişilemiyor:\n{path}\n\nOlası nedenler: USB sürücüsü çıkarıldı, ağ sürücüsü bağlanmadı veya klasör yeniden adlandırıldı.",
  "sidebar.record_history": "Geçmişi kaydet",
  "sidebar.clear_history": "Geçmişi temizle",
  "sidebar.delete_record": "Kaydı sil",

  // ===== Durum çubuğu =====
  "status.unsaved": "Kaydedilmedi",
  "status.external_deleted": "⚠ Harici olarak silindi",
  "status.external_unreachable": "⚠ Konuma ulaşılamıyor",
  "status.external_modified": "⚠ Harici olarak değiştirildi",
  "status.line_and_chars": "{lines} satır · {chars} karakter",
  "status.selected_chars": "{chars} karakter seçildi",
  "status.selected_lines_and_chars": "{lines} satır · {chars} karakter seçildi",
  "status.short_line_numbers": "Satır no.",
  "status.short_word_wrap": "Kaydırma",
  "status.zoom_tooltip": "Yakınlaştır",
  "status.scroll_wheel": "Tekerlek",
  "status.encoding_tooltip": "Kodlama: {encoding}",
  "status.line_ending_lf": "Unix satır sonu (LF)",
  "status.line_ending_crlf": "Windows satır sonu (CRLF)",
  "status.line_ending_cr": "Macintosh satır sonu (CR)",

  // ===== Kapatma/Kaydetme İletişim Kutuları =====
  "dialog.close_confirm": "Evet",
  "dialog.close_cancel": "Hayır",
  "dialog.cancel": "İptal",
  "dialog.filter.all_files": "Tüm dosyalar",
  "dialog.filter.text_files": "Metin dosyaları",
  "dialog.ask_save_unnamed": "\"{title}\" dosyası kaydedilsin mi?",
  "dialog.ask_save_named": "\"{title}\" dosyasındaki değişiklikler kaydedilsin mi?",

  // ===== Çakışma çözümü =====
  "dialog.conflict_title": "{path}\nDosya harici olarak değiştirildi. Nasıl devam edileceğini seçin:",
  "dialog.conflict_overwrite": "Üzerine yaz",
  "dialog.conflict_discard": "Yeniden yükle",
  "dialog.conflict_discard_close": "Vazgeç",
  "dialog.conflict_compare": "Karşılaştır",
  "dialog.conflict_save_as": "Farklı kaydet",
  "dialog.save_as_conflict": "Kaydetme başarısız: Dosya başka bir sekmede zaten açık. Kapatıp tekrar deneyin.\nYol: {path}",
  "dialog.ok": "Tamam",

  // ===== Büyük dosya kapatma iletişim kutusu =====
  "dialog.large_close": "\"{title}\" dosyasında kaydedilmemiş değişiklikler var. Kapatırsanız kaybolacaklar.",
  "dialog.large_close_yes": "Kaydet",
  "dialog.large_close_no": "Kaydetme",

  // ===== Kodlama ve satır sonu değiştirme iletişim kutusu =====
  "dialog.format_type_encoding": "kodlama",
  "dialog.format_type_line_ending": "satır sonu",
  "dialog.change_format_title": "{typeName} \"{value}\" olarak değiştirilsin mi?",
  "dialog.change_format_subtitle": "Belge kayıpsız olarak dönüştürülebilir. Kaydedildikten sonra dosya içeriği güncellenecektir.",
  "dialog.change_format_lossy_title": "⚠ {typeName} değişikliği karakter kaybına neden olabilir",
  "dialog.change_format_lossy_subtitle": "Belge özel karakterler içeriyor. \"{value}\" olarak değiştirildikten sonra bu karakterler \"?\" ile değiştirilecek ve kurtarılamayacaktır.",
  "encoding_group_unicode": "Unicode Uzantıları",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Batı Avrupa",
  "encoding_group_central_europe": "Orta/Doğu Avrupa",
  "encoding_group_cyrillic": "Kiril",
  "encoding_group_others": "Orta Doğu ve Diğerleri",
  "encoding.recommend": "Önerilen",

  // ===== Hakkında =====
  "about.title": "FinchPad",
  "about.version": "Sürüm {version}",
  "about.line1": "Modern, hafif, çok sekmeli bir düz metin düzenleyici.",
  "about.line2": "Daha iyi bir varsayılan metin düzenleyici olmayı hedefliyor.",
  "about.tech": "Şununla geliştirildi: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Yazar: MaleyGoz",
  "about.license": "Lisans: MIT",
  "about.website": "Web sitesi: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "Tamam",

  // ===== Adsız sekmeler =====
  "tab.unnamed": "Adsız {index}",
  "tab.unnamed_fallback": "Adsız",

  // ===== Büyük dosya =====
  "large_file.pending_title": "Bu dosya büyük ve henüz yüklenmedi",
  "large_file.pending_size": "Dosya boyutu: {size}",
  "large_file.pending_hint": "Ana arayüzün akıcı kalması için, ultra hızlı salt okunur oluşturma için ayrı bir pencerede açılacaktır.",
  "large_file.pending_btn": "⚡ Hızlı salt okunur görünüm",
  "large_file.searching": "Dosya taranıyor...",
  "large_file.no_results": "Eşleşme bulunamadı",
  "large_file.search_failed": "Arama başarısız, lütfen dosya durumunu kontrol edin.",
  "large_file.search_limit": "Yalnızca ilk 100 sonuç gösteriliyor, lütfen daha kesin anahtar kelimeler kullanın",
  "large_file.file_not_found": "Dosya harici olarak silinmiş veya taşınmış, açılamıyor.",
  "large_file.load_failed": "Okuma başarısız. Dosya harici olarak değiştirilmiş veya silinmiş olabilir.",
  "large_file.search_placeholder": "Ara...",
  "large_file.auto_detect": "🔄 Otomatik algıla",

  // ===== Bul ve değiştir =====
  "editor.find.placeholder": "Bul",
  "editor.find.replace_placeholder": "Değiştir",
  "editor.find.show_replace": "Değiştirmeyi göster",
  "editor.find.hide_replace": "Değiştirmeyi gizle",
  "editor.find.close": "Kapat (Esc)",
  "editor.find.find_in_selection": "Seçim içinde bul",
  "editor.find.match_case": "Büyük/küçük harf eşleştir",
  "editor.find.match_whole_word": "Tam kelime",
  "editor.find.use_regex": "Normal ifade kullan",
  "editor.find.preserve_case": "Büyük/küçük harfi koru",
  "editor.find.replace": "Değiştir",
  "editor.find.replace_all": "Tümünü değiştir",
  "editor.find.prev_match": "Önceki eşleşme",
  "editor.find.next_match": "Sonraki eşleşme",
  "editor.find.no_results": "Sonuç yok",
  "editor.find.match_count": "{current} / {total}",

    
    // ===== macOS Menüsü =====
    "menu.file": "Dosya",
    "menu.edit": "Düzen",
    "menu.view": "Görünüm",
    "menu.quit": "FinchPad'den Çık",
};