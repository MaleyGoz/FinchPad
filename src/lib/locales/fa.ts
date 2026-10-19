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

  // ===== گزینه‌های زبان =====
  "locale.auto": "خودکار",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== منوی راست‌کلیک زبانه =====
  "tab_menu.save": "ذخیره",
  "tab_menu.save_as": "ذخیره به عنوان",
  "tab_menu.close": "بستن زبانه",
  "tab_menu.close_others": "بستن سایر زبانه‌ها",
  "tab_menu.close_left": "بستن زبانه‌های سمت چپ",
  "tab_menu.close_right": "بستن زبانه‌های سمت راست",
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

  // ===== نوار وضعیت =====
  "status.unsaved": "ذخیره نشده",
  "status.external_deleted": "⚠ از بیرون حذف شد",
  "status.external_unreachable": "⚠ مکان در دسترس نیست",
  "status.external_modified": "⚠ از بیرون تغییر یافت",
  "status.line_and_chars": "{lines} خط · {chars} نویسه",
  "status.selected_chars": "{chars} نویسه انتخاب شد",
  "status.selected_lines_and_chars": "{lines} خط · {chars} نویسه انتخاب شد",
  "status.word_wrap_on": "شکستن: روشن",
  "status.word_wrap_off": "شکستن: خاموش",
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
  "pending.title": "این فایل بزرگ است و هنوز بارگذاری نشده",
  "pending.size": "اندازه: {size}",
  "pending.hint": "پس از بارگذاری، ویرایشگر ممکن است کوتاه‌مدت پاسخگو نباشد",
  "pending.load": "بارگذاری هم‌اکنون",

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
};