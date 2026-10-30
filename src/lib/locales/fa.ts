export const faIR: Record<string, string> = {
  // ===== منوی تنظیمات =====
  "settings.view": "نما",
  "settings.show_line_numbers": "نمایش شماره خطوط",
  "settings.word_wrap": "شکستن کلمه",
  "settings.theme": "تم",
  "settings.theme.white": "سفید",
  "settings.theme.gray": "خاکستری",
  "settings.theme.sepia": "سپیا",
  "settings.theme.green": "سبز",
  "settings.theme.dark": "تیره",
  "settings.language": "زبان",
  "settings.about": "درباره FinchPad",
  "settings.check_update": "بررسی به‌روزرسانی",
  "dialog.update_checking": "در حال بررسی به‌روزرسانی...",
  "dialog.update_latest": "شما از آخرین نسخه استفاده می‌کنید (v{version}).",
  "dialog.update_found":
    "نسخه جدید یافت شد!\nفعلی: v{current}\nآخرین: v{latest}\n\nبه GitHub برویم؟",
  "dialog.update_failed": "بررسی به‌روزرسانی انجام نشد. لطفاً اتصال شبکه را بررسی کنید.",
  "dialog.update_confirm": "دانلود",
  "dialog.update_cancel": "انصراف",

  // ===== 标签栏 =====
  "tab_bar.new_tab": "زبانه جدید",
  "tab_bar.settings": "تنظیمات",
  "tab_bar.preview": "پیش‌نمایش",

  // ===== گزینه‌های زبان =====

  // ===== منوی راست‌کلیک زبانه =====
  "tab_menu.save": "ذخیره",
  "tab_menu.save_as": "ذخیره به عنوان",
  "tab_menu.close": "بستن زبانه",
  "tab_menu.close_others": "بستن سایر زبانه‌ها",
  "tab_menu.close_left": "بستن زبانه‌های سمت چپ",
  "tab_menu.close_right": "بستن زبانه‌های سمت راست",
  "tab_menu.close_all": "بستن همه",
  "tab_menu.reopen": "بازگشایی زبانه بسته شده",
  "tab_menu.copy_path": "کپی مسیر فایل",
  "tab_menu.reveal_in_explorer": "نمایش در Explorer",
  "tab_menu.diff": "مقایسه",
  "tab_menu.rename": "تغییر نام",

  "diff.window_title": "مقایسه",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "نگه داشتن تغییرات من",
  "diff.use_disk": "استفاده از نسخه دیسک",

  // ===== منوی ناحیه خالی نوار زبانه‌ها =====
  "bar_menu.new": "زبانه جدید",
  "bar_menu.open": "باز کردن فایل",

  // ===== پنجره تغییر نام =====
  "dialog.rename_exists": "فایلی با این نام در این پوشه وجود دارد.",
  "dialog.rename_failed": "تغییر نام انجام نشد: {error}",

  // ===== منوی راست‌کلیک ویرایشگر =====
  "editor_menu.undo": "واگرد",
  "editor_menu.redo": "تکرار",
  "editor_menu.cut": "برش",
  "editor_menu.copy": "کپی",
  "editor_menu.paste": "چسباندن",
  "editor_menu.delete": "حذف",
  "editor_menu.select_all": "انتخاب همه",

  // ===== SideBar =====
  "sidebar.empty_recent": "فایل‌های اخیر وجود ندارد",
  "sidebar.empty_dir": "پوشه خالی است",
  "sidebar.up": "پوشه بالاتر",
  "sidebar.dir_unreachable": "⚠️ دسترسی به پوشه امکان‌پذیر نیست:\n{path}\n\nدلایل احتمالی: درایو USB قطع شده، درایو شبکه متصل نشده، یا نام پوشه تغییر کرده است.",

  "sidebar.recent": "فایل‌های اخیر",
  "sidebar.directory": "پوشه فعلی",
  "sidebar.file_not_found": "فایل یافت نشد یا منتقل شده است: {path}",

  // ===== نوار وضعیت =====
  "status.unsaved": "ذخیره نشده",
  "status.external_deleted": "⚠ از بیرون حذف شد",
  "status.external_unreachable": "⚠ مکان در دسترس نیست",
  "status.external_modified": "⚠ از بیرون تغییر یافت",
  "status.line_and_chars": "{lines} خط · {chars} نویسه",
  "status.selected_chars": "{chars} نویسه انتخاب شد",
  "status.selected_lines_and_chars": "{lines} خط · {chars} نویسه انتخاب شد",
  "status.short_line_numbers": "خطوط",
  "status.short_word_wrap": "شکستن کلمه",
  "status.zoom_tooltip": "میزان بزرگنمایی",
  "status.scroll_wheel": "اسکرول",
  "status.encoding_tooltip": "رمزگذاری: {encoding}",
  "status.line_ending_lf": "پایان خط یونیکس (LF)",
  "status.line_ending_crlf": "پایان خط ویندوز (CRLF)",
  "status.line_ending_cr": "پایان خط مکینتاش (CR)",

  // ===== پنجره‌های بستن/ذخیره =====
  "dialog.close_confirm": "بله",
  "dialog.close_cancel": "خیر",
  "dialog.cancel": "انصراف",
  "dialog.filter.all_files": "همه فایل‌ها",
  "dialog.filter.text_files": "فایل‌های متنی",

  "dialog.ask_save_unnamed": 'فایل "{title}" ذخیره شود؟',
  "dialog.ask_save_named": 'تغییرات "{title}" ذخیره شود؟',

  // ===== حل تداخل =====
  "dialog.conflict_title":
    "{path}\nفایل از بیرون تغییر یافته است. انتخاب کنید:",
  "dialog.conflict_overwrite": "بازنویسی",
  "dialog.conflict_discard": "بارگذاری مجدد",
  "dialog.conflict_discard_close": "دور انداختن تغییرات",
  "dialog.conflict_compare": "مقایسه",
  "dialog.conflict_save_as": "ذخیره به عنوان",
  "dialog.save_as_conflict":
    "ذخیره انجام نشد: فایل در زبانه دیگری باز است. لطفاً آن زبانه را ببندید و دوباره تلاش کنید.\nمسیر: {path}",
  "dialog.ok": "تأیید",

  // ===== پنجره بستن فایل بزرگ =====
  "dialog.large_close":
    'فایل "{title}" تغییرات ذخیره نشده دارد. با بستن این تغییرات از دست می‌روند.',
  "dialog.large_close_yes": "ذخیره",
  "dialog.large_close_no": "ذخیره نکن",

  // ===== جایگزین فایل بزرگ =====

  // ===== پنجره درباره =====
  "about.title": "FinchPad",
  "about.version": "نسخه {version}",
  "about.line1": "ویرایشگر متن ساده، مدرن، سبک و چندزبانه.",
  "about.line2": "با هدف جایگزینی بهتر برای ویرایشگر پیش‌فرض.",
  "about.tech": "فناوری: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "نویسنده: MaleyGoz",
  "about.license": "مجوز: MIT",
  "about.website": "وب‌سایت: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "تأیید",

  // ===== زبانه‌های بی‌نام =====
  "tab.unnamed": "بی‌نام {index}",
  "tab.unnamed_fallback": "بی‌نام",

  "large_file.searching": "در حال اسکن فایل...",
  "large_file.search_limit": "فقط 100 نتیجه اول نمایش داده می‌شود، لطفاً از کلمات کلیدی دقیق‌تری استفاده کنید",
  "sidebar.record_history": "ثبت تاریخچه",
  "large_file.search_placeholder": "جستجو...",
  "large_file.auto_detect": "🔄 تشخیص خودکار",
  "large_file.search_failed": "جستجو ناموفق بود، لطفاً وضعیت فایل را بررسی کنید.",
  "large_file.pending_size": "حجم فایل: {size}",
  "large_file.pending_btn": "⚡ نمای سریع فقط‌خواندنی",
  "large_file.no_results": "هیچ نتیجه منطبقی یافت نشد",
  "large_file.pending_hint": "برای روان ماندن رابط کاربری اصلی، در یک پنجره جداگانه برای رندر فوق‌سریع فقط‌خواندنی باز می‌شود.",
  "large_file.pending_title": "این فایل بزرگ است و هنوز بارگیری نشده است",
  "large_file.load_failed": "خواندن ناموفق بود. ممکن است فایل به صورت خارجی تغییر کرده یا حذف شده باشد.",
  "large_file.file_not_found": "فایل به صورت خارجی حذف یا منتقل شده است و قابل باز شدن نیست.",
  "sidebar.delete_record": "حذف رکورد",
  "sidebar.clear_history": "پاک کردن تاریخچه",

    // ===== 查找替换 =====
    "editor.find.placeholder": "جستجو",
    "editor.find.replace_placeholder": "جایگزینی",
    "editor.find.show_replace": "نمایش جایگزینی",
    "editor.find.hide_replace": "پنهان کردن جایگزینی",
    "editor.find.close": "بستن (Esc)",
    "editor.find.find_in_selection": "جستجو در انتخاب",
    "editor.find.match_case": "تطبیق حروف بزرگ/کوچک",
    "editor.find.match_whole_word": "تطبیق کل کلمه",
    "editor.find.use_regex": "استفاده از عبارت منظم",
    "editor.find.preserve_case": "حفظ حروف بزرگ/کوچک",
    "editor.find.replace": "جایگزینی",
    "editor.find.replace_all": "جایگزینی همه",
    "editor.find.prev_match": "تطابق قبلی",
    "editor.find.next_match": "تطابق بعدی",
    "editor.find.no_results": "بدون نتیجه",
    "editor.find.match_count": "{current} از {total}",

};