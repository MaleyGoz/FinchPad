export const thTH: Record<string, string> = {
  // ===== เมนูการตั้งค่า =====
  "settings.view": "มุมมอง",
  "settings.show_line_numbers": "แสดงเลขบรรทัด",
  "settings.word_wrap": "ตัดบรรทัด",
  "settings.theme": "ธีม",
  "settings.theme.white": "สีขาว",
  "settings.theme.gray": "สีเทา",
  "settings.theme.sepia": "เซเปีย",
  "settings.theme.green": "สีเขียว",
  "settings.theme.dark": "สีเข้ม",
  "settings.language": "ภาษา",
  "settings.about": "เกี่ยวกับ FinchPad",
  "settings.check_update": "ตรวจสอบการอัปเดต",
  "dialog.update_checking": "กำลังตรวจสอบการอัปเดต...",
  "dialog.update_latest": "คุณกำลังใช้เวอร์ชันล่าสุด (v{version}) แล้ว",
  "dialog.update_found":
    "พบเวอร์ชันใหม่!\nปัจจุบัน: v{current}\nล่าสุด: v{latest}\n\nไปที่ GitHub เพื่อดาวน์โหลดหรือไม่?",
  "dialog.update_failed": "การตรวจสอบการอัปเดตล้มเหลว กรุณาตรวจสอบการเชื่อมต่อเครือข่าย",
  "dialog.update_confirm": "ดาวน์โหลด",
  "dialog.update_cancel": "ยกเลิก",

  // ===== ตัวเลือกภาษา =====
  "locale.auto": "ตามระบบ",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== เมนูคลิกขวาที่แท็บ =====
  "tab_menu.save": "บันทึก",
  "tab_menu.save_as": "บันทึกเป็น",
  "tab_menu.close": "ปิดแท็บ",
  "tab_menu.close_others": "ปิดแท็บอื่น",
  "tab_menu.close_left": "ปิดแท็บด้านซ้าย",
  "tab_menu.close_right": "ปิดแท็บด้านขวา",
  "tab_menu.copy_path": "คัดลอกที่อยู่ไฟล์",
  "tab_menu.reveal_in_explorer": "เปิดใน Explorer",
  "tab_menu.diff": "เปรียบเทียบ",
  "tab_menu.rename": "เปลี่ยนชื่อ",

  "diff.window_title": "เปรียบเทียบ",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "เก็บเวอร์ชันของฉัน",
  "diff.use_disk": "ใช้เวอร์ชันบนดิสก์",

  // ===== เมนูพื้นที่ว่างแถบแท็บ =====
  "bar_menu.new": "แท็บใหม่",
  "bar_menu.open": "เปิดไฟล์",

  // ===== กล่องโต้ตอบเปลี่ยนชื่อ =====
  "dialog.rename_exists": "มีไฟล์ชื่อนี้อยู่แล้วในโฟลเดอร์นี้",
  "dialog.rename_failed": "เปลี่ยนชื่อล้มเหลว: {error}",

  // ===== เมนูคลิกขวาในตัวแก้ไข =====
  "editor_menu.undo": "เลิกทำ",
  "editor_menu.redo": "ทำซ้ำ",
  "editor_menu.cut": "ตัด",
  "editor_menu.copy": "คัดลอก",
  "editor_menu.paste": "วาง",
  "editor_menu.delete": "ลบ",
  "editor_menu.select_all": "เลือกทั้งหมด",

  // ===== แถบสถานะ =====
  "status.unsaved": "ยังไม่ได้บันทึก",
  "status.external_deleted": "⚠ ถูกลบจากภายนอก",
  "status.external_unreachable": "⚠ ไม่สามารถเข้าถึงตำแหน่งได้",
  "status.external_modified": "⚠ ถูกแก้ไขจากภายนอก",
  "status.line_and_chars": "{lines} บรรทัด · {chars} ตัวอักษร",
  "status.selected_chars": "เลือก {chars} ตัวอักษร",
  "status.selected_lines_and_chars": "เลือก {lines} บรรทัด · {chars} ตัวอักษร",
  "status.word_wrap_on": "ตัดบรรทัด: เปิด",
  "status.word_wrap_off": "ตัดบรรทัด: ปิด",
  "status.encoding_tooltip": "การเข้ารหัส: {encoding}",
  "status.line_ending_lf": "ขึ้นบรรทัดใหม่แบบ Unix (LF)",
  "status.line_ending_crlf": "ขึ้นบรรทัดใหม่แบบ Windows (CRLF)",
  "status.line_ending_cr": "ขึ้นบรรทัดใหม่แบบ Macintosh (CR)",

  // ===== กล่องโต้ตอบปิด/บันทึก =====
  "dialog.close_confirm": "ใช่",
  "dialog.close_cancel": "ไม่",
  "dialog.cancel": "ยกเลิก",
  "dialog.filter.all_files": "ไฟล์ทั้งหมด",
  "dialog.filter.text_files": "ไฟล์ข้อความ",

  "dialog.ask_save_unnamed": 'บันทึกไฟล์ "{title}" หรือไม่?',
  "dialog.ask_save_named": 'บันทึกการเปลี่ยนแปลงใน "{title}" หรือไม่?',

  // ===== การแก้ไขความขัดแย้ง =====
  "dialog.conflict_title":
    "{path}\nไฟล์ถูกแก้ไขจากภายนอก เลือกวิธีจัดการ:",
  "dialog.conflict_overwrite": "เขียนทับ",
  "dialog.conflict_discard": "โหลดใหม่",
  "dialog.conflict_discard_close": "ยกเลิกการเปลี่ยนแปลง",
  "dialog.conflict_compare": "เปรียบเทียบ",
  "dialog.conflict_save_as": "บันทึกเป็น",
  "dialog.save_as_conflict":
    "บันทึกไม่สำเร็จ: ไฟล์ถูกเปิดในแท็บอื่นอยู่ กรุณาปิดแท็บนั้นแล้วลองใหม่\nที่อยู่: {path}",
  "dialog.ok": "ตกลง",

  // ===== กล่องโต้ตอบปิดไฟล์ใหญ่ =====
  "dialog.large_close":
    'ไฟล์ "{title}" มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก การเปลี่ยนแปลงเหล่านี้จะสูญหายหากปิด',
  "dialog.large_close_yes": "บันทึก",
  "dialog.large_close_no": "ไม่บันทึก",

  // ===== ข้อความแสดงไฟล์ใหญ่ =====
  "pending.title": "ไฟล์นี้มีขนาดใหญ่ ยังไม่ได้โหลด",
  "pending.size": "ขนาด: {size}",
  "pending.hint": "ตัวแก้ไขอาจไม่ตอบสนองชั่วคราวหลังจากโหลด",
  "pending.load": "โหลดตอนนี้",

  // ===== กล่องโต้ตอบเกี่ยวกับ =====
  "about.title": "FinchPad",
  "about.version": "เวอร์ชัน {version}",
  "about.line1": "โปรแกรมแก้ไขข้อความแบบธรรมดา ที่ทันสมัย เบา และรองรับหลายแท็บ",
  "about.line2": "มุ่งมั่นที่จะเป็นโปรแกรมแก้ไขข้อความเริ่มต้นที่ดีกว่า",
  "about.tech": "เทคโนโลยี: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "ผู้สร้าง: MaleyGoz",
  "about.license": "สัญญาอนุญาต: MIT",
  "about.website": "เว็บไซต์: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "ตกลง",

  // ===== แท็บที่ยังไม่ได้ตั้งชื่อ =====
  "tab.unnamed": "ไม่มีชื่อ {index}",
  "tab.unnamed_fallback": "ไม่มีชื่อ",
};