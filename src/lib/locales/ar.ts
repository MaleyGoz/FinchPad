export const ar: Record<string, string> = {
    // ===== قائمة الإعدادات =====
    "settings.view": "عرض",
    "settings.show_line_numbers": "أرقام الأسطر",
    "settings.word_wrap": "التفاف النص",
    "settings.theme": "المظهر",
    "settings.theme.white": "أبيض",
    "settings.theme.gray": "رمادي",
    "settings.theme.sepia": "بني داكن",
    "settings.theme.green": "أخضر",
    "settings.theme.dark": "داكن",
    "settings.language": "اللغة",
    "settings.about": "حول FinchPad",
    "settings.check_update": "التحقق من التحديثات",
    "dialog.update_checking": "جارٍ التحقق من التحديثات...",
    "dialog.update_latest": "أنت تستخدم أحدث إصدار (v{version}).",
    "dialog.update_found": "تم العثور على إصدار جديد!\nالحالي: v{current}\nالأحدث: v{latest}\n\nالانتقال إلى GitHub للتنزيل؟",
    "dialog.update_failed": "فشل التحقق من التحديثات. يرجى التحقق من شبكتك.",
    "dialog.update_confirm": "أحدث إصدار",
    "dialog.update_cancel": "إلغاء",

    // ===== شريط التبويبات =====
    "tab_bar.new_tab": "تبويب جديد",
    "tab_bar.settings": "الإعدادات",
    "tab_bar.preview": "معاينة",
    "tab_bar.more_tabs": "المزيد من التبويبات",

    // ===== قائمة النقر بزر الماوس الأيمن على التبويب =====
    "tab_menu.save": "حفظ",
    "tab_menu.save_as": "حفظ باسم",
    "tab_menu.close": "إغلاق التبويب",
    "tab_menu.close_others": "إغلاق التبويبات الأخرى",
    "tab_menu.close_left": "إغلاق التبويبات إلى اليسار",
    "tab_menu.close_right": "إغلاق التبويبات إلى اليمين",
    "tab_menu.close_all": "إغلاق كل التبويبات",
    "tab_menu.reopen": "إعادة فتح التبويب المغلق",
    "tab_menu.copy_path": "نسخ مسار الملف",
    "tab_menu.reveal_in_explorer": "إظهار في المستكشف",
    "tab_menu.diff": "مقارنة",
    "tab_menu.rename": "إعادة تسمية",

    "diff.window_title": "مقارنة",
    "diff.left_disk": "إصدار القرص",
    "diff.right_editor": "إصدار المحرر",
    "diff.keep_mine": "الاحتفاظ بتغييراتي",
    "diff.use_disk": "استخدام إصدار القرص",

    // ===== قائمة المنطقة الفارغة في شريط التبويبات =====
    "bar_menu.new": "تبويب جديد",
    "bar_menu.open": "فتح ملف",

    // ===== مربع حوار إعادة التسمية =====
    "dialog.rename_exists": "يوجد ملف بهذا الاسم بالفعل.",
    "dialog.rename_failed": "فشلت إعادة التسمية: {error}",

    // ===== قائمة النقر بزر الماوس الأيمن في المحرر =====
    "editor_menu.undo": "تراجع",
    "editor_menu.redo": "إعادة",
    "editor_menu.cut": "قص",
    "editor_menu.copy": "نسخ",
    "editor_menu.paste": "لصق",
    "editor_menu.delete": "حذف",
    "editor_menu.select_all": "تحديد الكل",

    // ===== الشريط الجانبي =====
    "sidebar.recent": "الملفات الأخيرة",
    "sidebar.directory": "الدليل الحالي",
    "sidebar.file_not_found": "الملف غير موجود أو تم نقله: {path}",
    "sidebar.empty_recent": "لا توجد ملفات حديثة",
    "sidebar.empty_dir": "مجلد فارغ",
    "sidebar.up": "للأعلى",
    "sidebar.dir_unreachable": "⚠️ لا يمكن الوصول إلى الدليل:\n{path}\n\nالأسباب المحتملة: تم فصل محرك أقراص USB، أو لم يتم تحميل محرك أقراص الشبكة، أو تمت إعادة تسمية المجلد.",
    "sidebar.record_history": "تسجيل السجل",
    "sidebar.clear_history": "مسح السجل",
    "sidebar.delete_record": "حذف السجل",

    // ===== شريط الحالة =====
    "status.unsaved": "غير محفوظ",
    "status.external_deleted": "⚠ تم الحذف خارجيًا",
    "status.external_unreachable": "⚠ الموقع غير قابل للوصول",
    "status.external_modified": "⚠ تم التعديل خارجيًا",
    "status.line_and_chars": "{lines} أسطر · {chars} حرفًا",
    "status.selected_chars": "تم تحديد {chars} حرفًا",
    "status.selected_lines_and_chars": "تم تحديد {lines} أسطر · {chars} حرفًا",
    "status.short_line_numbers": "أرقام الأسطر",
    "status.short_word_wrap": "التفاف",
    "status.zoom_tooltip": "تكبير/تصغير",
    "status.scroll_wheel": "عجلة",
    "status.encoding_tooltip": "الترميز: {encoding}",
    "status.line_ending_lf": "نهاية سطر Unix (LF)",
    "status.line_ending_crlf": "نهاية سطر Windows (CRLF)",
    "status.line_ending_cr": "نهاية سطر Macintosh (CR)",

    // ===== مربعات حوار الإغلاق/الحفظ =====
    "dialog.close_confirm": "نعم",
    "dialog.close_cancel": "لا",
    "dialog.cancel": "إلغاء",
    "dialog.filter.all_files": "كل الملفات",
    "dialog.filter.text_files": "ملفات نصية",
    "dialog.ask_save_unnamed": "حفظ الملف \"{title}\"؟",
    "dialog.ask_save_named": "حفظ التغييرات في \"{title}\"؟",

    // ===== حل التعارضات =====
    "dialog.conflict_title": "{path}\nتم تعديل الملف خارجيًا. اختر كيفية المتابعة:",
    "dialog.conflict_overwrite": "استبدال",
    "dialog.conflict_discard": "إعادة تحميل",
    "dialog.conflict_discard_close": "تجاهل",
    "dialog.conflict_compare": "مقارنة",
    "dialog.conflict_save_as": "حفظ باسم",
    "dialog.save_as_conflict": "فشل الحفظ: الملف مفتوح بالفعل في تبويب آخر. يرجى إغلاقه والمحاولة مرة أخرى.\nالمسار: {path}",
    "dialog.ok": "موافق",
    "dialog.save_failed_title": "⚠️ فشل الحفظ: تعذرت الكتابة إلى الملف.",

    // ===== مربع حوار إغلاق الملف الكبير =====
    "dialog.large_close": "الملف \"{title}\" يحتوي على تغييرات غير محفوظة. ستفقد إذا قمت بالإغلاق.",
    "dialog.large_close_yes": "حفظ",
    "dialog.large_close_no": "عدم الحفظ",

    // ===== مربع حوار تغيير الترميز ونهاية السطر =====
    "dialog.format_type_encoding": "الترميز",
    "dialog.format_type_line_ending": "نهاية السطر",
    "dialog.change_format_title": "تغيير {typeName} إلى \"{value}\"؟",
    "dialog.change_format_subtitle": "يمكن تحويل المستند دون فقدان. سيتم تحديث محتوى الملف بعد الحفظ.",
    "dialog.change_format_lossy_title": "⚠ قد يؤدي تغيير {typeName} إلى فقدان الأحرف",
    "dialog.change_format_lossy_subtitle": "يحتوي المستند على أحرف خاصة. بعد التبديل إلى \"{value}\"، سيتم استبدال هذه الأحرف بـ \"?\" ولا يمكن استردادها.",
    "encoding_group_unicode": "ملحقات Unicode",
    "encoding_group_cjk": "CJK",
    "encoding_group_western": "أوروبا الغربية",
    "encoding_group_central_europe": "أوروبا الوسطى/الشرقية",
    "encoding_group_cyrillic": "السيريلية",
    "encoding_group_others": "الشرق الأوسط وأخرى",
    "encoding.recommend": "موصى به",

    // ===== حول =====
    "about.title": "FinchPad",
    "about.version": "الإصدار {version}",
    "about.line1": "محرر نصوص عادي حديث وخفيف الوزن ومتعدد التبويبات.",
    "about.line2": "يهدف إلى أن يكون محرر النصوص الافتراضي الأفضل.",
    "about.tech": "بُني باستخدام: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
    "about.author": "المؤلف: MaleyGoz",
    "about.license": "الترخيص: MIT",
    "about.website": "الموقع: https://github.com/MaleyGoz/FinchPad",
    "about.ok": "موافق",

    // ===== تبويبات بلا عنوان =====
    "tab.unnamed": "بلا عنوان {index}",
    "tab.unnamed_fallback": "بلا عنوان",

    // ===== ملف كبير =====
    "large_file.pending_title": "هذا الملف كبير ولم يتم تحميله بعد",
    "large_file.pending_size": "حجم الملف: {size}",
    "large_file.pending_hint": "للحفاظ على سلاسة الواجهة الرئيسية، سيتم فتحه في نافذة منفصلة لعرض سريع للغاية للقراءة فقط.",
    "large_file.pending_btn": "⚡ عرض سريع للقراءة فقط",
    "large_file.searching": "جارٍ فحص الملف...",
    "large_file.no_results": "لم يتم العثور على تطابقات",
    "large_file.search_failed": "فشل البحث، يرجى التحقق من حالة الملف.",
    "large_file.search_limit": "يتم عرض أول 100 نتيجة فقط، يرجى استخدام كلمات رئيسية أكثر دقة",
    "large_file.file_not_found": "تم حذف الملف أو نقله خارجيًا ولا يمكن فتحه.",
    "large_file.load_failed": "فشلت القراءة. ربما تم تعديل الملف أو حذفه خارجيًا.",
    "large_file.search_placeholder": "بحث...",
    "large_file.auto_detect": "🔄 اكتشاف تلقائي",

    // ===== البحث والاستبدال =====
    "editor.find.placeholder": "بحث",
    "editor.find.replace_placeholder": "استبدال",
    "editor.find.show_replace": "إظهار الاستبدال",
    "editor.find.hide_replace": "إخفاء الاستبدال",
    "editor.find.close": "إغلاق (Esc)",
    "editor.find.find_in_selection": "بحث في التحديد",
    "editor.find.match_case": "مطابقة حالة الأحرف",
    "editor.find.match_whole_word": "مطابقة الكلمة بأكملها",
    "editor.find.use_regex": "استخدام تعبير نمطي",
    "editor.find.preserve_case": "الحفاظ على حالة الأحرف",
    "editor.find.replace": "استبدال",
    "editor.find.replace_all": "استبدال الكل",
    "editor.find.prev_match": "التطابق السابق",
    "editor.find.next_match": "التطابق التالي",
    "editor.find.no_results": "لا توجد نتائج",
    "editor.find.match_count": "{current} من {total}",

    
    // ===== قائمة macOS =====
    "menu.file": "ملف",
    "menu.edit": "تحرير",
    "menu.view": "عرض",
    "menu.quit": "إنهاء FinchPad",
};