export const ar: Record<string, string> = {
  // ===== قائمة الإعدادات =====
  "settings.view": "عرض",
  "settings.show_line_numbers": "إظهار أرقام الأسطر",
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
  "dialog.update_found":
    "تم العثور على إصدار جديد!\nالإصدار الحالي: v{current}\nأحدث إصدار: v{latest}\n\nهل تريد الانتقال إلى GitHub للتنزيل؟",
  "dialog.update_failed": "فشل التحقق من التحديثات. تحقق من اتصال الشبكة.",
  "dialog.update_confirm": "تنزيل",
  "dialog.update_cancel": "إلغاء",

  // ===== خيارات اللغة =====

  // ===== قائمة النقر بزر الماوس الأيمن على التبويب =====
  "tab_menu.save": "حفظ",
  "tab_menu.save_as": "حفظ باسم",
  "tab_menu.close": "إغلاق التبويب",
  "tab_menu.close_others": "إغلاق التبويبات الأخرى",
  "tab_menu.close_left": "إغلاق التبويبات على اليسار",
  "tab_menu.close_right": "إغلاق التبويبات على اليمين",
  "tab_menu.copy_path": "نسخ مسار الملف",
  "tab_menu.reveal_in_explorer": "إظهار في مستكشف الملفات",
  "tab_menu.diff": "مقارنة",
  "tab_menu.rename": "إعادة تسمية",

  "diff.window_title": "مقارنة",
  "diff.left_disk": "القرص",
  "diff.right_editor": "المحرر",
  "diff.keep_mine": "الاحتفاظ بتعديلاتي",
  "diff.use_disk": "استخدام إصدار القرص",

  // ===== قائمة المساحة الفارغة في شريط التبويبات =====
  "bar_menu.new": "تبويب جديد",
  "bar_menu.open": "فتح ملف",

  // ===== حوار إعادة التسمية =====
  "dialog.rename_exists": "يوجد ملف بنفس الاسم بالفعل في هذا المجلد.",
  "dialog.rename_failed": "فشلت إعادة التسمية: {error}",

  // ===== قائمة النقر بزر الماوس الأيمن في المحرر =====
  "editor_menu.undo": "تراجع",
  "editor_menu.redo": "إعادة",
  "editor_menu.cut": "قص",
  "editor_menu.copy": "نسخ",
  "editor_menu.paste": "لصق",
  "editor_menu.delete": "حذف",
  "editor_menu.select_all": "تحديد الكل",

  // ===== SideBar =====
  "sidebar.empty_recent": "لا توجد ملفات حديثة",
  "sidebar.empty_dir": "مجلد فارغ",
  "sidebar.up": "المجلد الأعلى",
  "sidebar.dir_unreachable": "⚠️ تعذر الوصول إلى المجلد:\n{path}\n\nالأسباب المحتملة: تم فصل محرك أقراص USB، أو لم يتم تركيب محرك أقراص الشبكة، أو تمت إعادة تسمية المجلد.",
  "sidebar.recent": "الملفات الأخيرة",
  "sidebar.directory": "المجلد الحالي",
  "sidebar.file_not_found": "الملف غير موجود أو تم نقله: {path}",

  // ===== شريط الحالة =====
  "status.unsaved": "غير محفوظ",
  "status.external_deleted": "⚠ تم حذفه خارجيًا",
  "status.external_unreachable": "⚠ الموقع غير قابل للوصول",
  "status.external_modified": "⚠ تم تعديله خارجيًا",
  "status.line_and_chars": "{lines} سطرًا · {chars} حرفًا",
  "status.selected_chars": "تم تحديد {chars} حرفًا",
  "status.selected_lines_and_chars": "تم تحديد {lines} سطرًا · {chars} حرفًا",
  "status.short_line_numbers": "أرقام الأسطر",
  "status.short_word_wrap": "التفاف النص",
  "status.encoding_tooltip": "الترميز: {encoding}",
  "status.line_ending_lf": "نهاية سطر Unix (LF)",
  "status.line_ending_crlf": "نهاية سطر Windows (CRLF)",
  "status.line_ending_cr": "نهاية سطر Macintosh (CR)",

  // ===== حوارات الإغلاق/الحفظ =====
  "dialog.close_confirm": "نعم",
  "dialog.close_cancel": "لا",
  "dialog.cancel": "إلغاء",
  "dialog.filter.all_files": "كل الملفات",
  "dialog.filter.text_files": "ملفات نصية",

  "dialog.ask_save_unnamed": "هل تريد حفظ الملف «{title}»؟",
  "dialog.ask_save_named": "هل تريد حفظ التغييرات على «{title}»؟",

  // ===== معالجة التعارض =====
  "dialog.conflict_title":
    "{path}\nتم تعديل الملف خارجيًا، اختر كيفية المتابعة:",
  "dialog.conflict_overwrite": "كتابة فوق",
  "dialog.conflict_discard": "إعادة تحميل",
  "dialog.conflict_discard_close": "تجاهل",
  "dialog.conflict_compare": "مقارنة",
  "dialog.conflict_save_as": "حفظ باسم",
  "dialog.save_as_conflict":
    "فشل الحفظ: الملف مفتوح بالفعل في تبويب آخر. يرجى إغلاقه ثم المحاولة مرة أخرى.\nالمسار: {path}",
  "dialog.ok": "موافق",

  // ===== حوار إغلاق ملف كبير =====
  "dialog.large_close":
    "الملف «{title}» يحتوي على تغييرات غير محفوظة. ستُفقد إذا قمت بالإغلاق.",
  "dialog.large_close_yes": "حفظ",
  "dialog.large_close_no": "عدم الحفظ",

  // ===== عنصر نائب لملف كبير =====

  // ===== حوار حول =====
  "about.title": "FinchPad",
  "about.version": "الإصدار {version}",
  "about.line1": "محرر نصوص حديث وخفيف ومتعدد التبويبات.",
  "about.line2": "يهدف ليكون محرر النصوص الافتراضي الأفضل.",
  "about.tech": "مبني بـ: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "المؤلف: MaleyGoz",
  "about.license": "الترخيص: MIT",
  "about.website": "الموقع: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "موافق",

  // ===== تبويبات بدون عنوان =====
  "tab.unnamed": "بدون عنوان {index}",
  "tab.unnamed_fallback": "بدون عنوان",

  "large_file.searching": "جاري فحص الملف...",
  "large_file.search_limit": "يتم عرض أول 100 نتيجة فقط، يرجى استخدام كلمات رئيسية أكثر دقة",
  "sidebar.record_history": "تسجيل السجل",
  "large_file.search_placeholder": "بحث...",
  "large_file.auto_detect": "🔄 اكتشاف تلقائي",
  "large_file.search_failed": "فشل البحث، يرجى التحقق من حالة الملف.",
  "large_file.pending_size": "حجم الملف: {size}",
  "large_file.pending_btn": "⚡ عرض سريع للقراءة فقط",
  "large_file.no_results": "لم يتم العثور على نتائج مطابقة",
  "large_file.pending_hint": "للحفاظ على سلاسة الواجهة الرئيسية، سيتم فتحه في نافذة منفصلة لعرض فائق السرعة للقراءة فقط.",
  "large_file.pending_title": "هذا الملف كبير ولم يتم تحميله بعد",
  "large_file.load_failed": "فشلت القراءة. ربما تم تعديل الملف أو حذفه خارجيًا.",
  "large_file.file_not_found": "تم حذف الملف أو نقله خارجيًا ولا يمكن فتحه.",
  "sidebar.delete_record": "حذف السجل",
  "sidebar.clear_history": "مسح السجل",
};