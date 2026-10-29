export const hiIN: Record<string, string> = {
  // ===== सेटिंग्स मेनू =====
  "settings.view": "दृश्य",
  "settings.show_line_numbers": "पंक्ति संख्या दिखाएं",
  "settings.word_wrap": "शब्द रैपिंग",
  "settings.theme": "थीम",
  "settings.theme.white": "सफेद",
  "settings.theme.gray": "ग्रे",
  "settings.theme.sepia": "सेपिया",
  "settings.theme.green": "हरा",
  "settings.theme.dark": "डार्क",
  "settings.language": "भाषा",
  "settings.about": "FinchPad के बारे में",
  "settings.check_update": "अपडेट की जाँच करें",
  "dialog.update_checking": "अपडेट की जाँच की जा रही है...",
  "dialog.update_latest": "आप नवीनतम संस्करण (v{version}) का उपयोग कर रहे हैं।",
  "dialog.update_found":
    "नया संस्करण मिला!\nवर्तमान: v{current}\nनवीनतम: v{latest}\n\nडाउनलोड करने के लिए GitHub पर जाएं?",
  "dialog.update_failed": "अपडेट जांचने में विफल। कृपया अपना नेटवर्क कनेक्शन जांचें।",
  "dialog.update_confirm": "डाउनलोड करें",
  "dialog.update_cancel": "रद्द करें",

  // ===== भाषा विकल्प =====

  // ===== टैब कॉन्टेक्स्ट मेनू =====
  "tab_menu.save": "सहेजें",
  "tab_menu.save_as": "इस रूप में सहेजें",
  "tab_menu.close": "टैब बंद करें",
  "tab_menu.close_others": "अन्य टैब बंद करें",
  "tab_menu.close_left": "बाईं ओर के टैब बंद करें",
  "tab_menu.close_right": "दाईं ओर के टैब बंद करें",
  "tab_menu.close_all": "सभी बंद करें",
  "tab_menu.copy_path": "फ़ाइल पथ कॉपी करें",
  "tab_menu.reveal_in_explorer": "Explorer में दिखाएं",
  "tab_menu.diff": "तुलना करें",
  "tab_menu.rename": "नाम बदलें",

  "diff.window_title": "तुलना करें",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "मेरा संस्करण रखें",
  "diff.use_disk": "डिस्क संस्करण का उपयोग करें",

  // ===== टैब बार खाली क्षेत्र मेनू =====
  "bar_menu.new": "नया टैब",
  "bar_menu.open": "फ़ाइल खोलें",

  // ===== नाम बदलें डायलॉग =====
  "dialog.rename_exists": "इस निर्देशिका में इस नाम की फ़ाइल पहले से मौजूद है।",
  "dialog.rename_failed": "नाम बदलने में विफल: {error}",

  // ===== एडिटर कॉन्टेक्स्ट मेनू =====
  "editor_menu.undo": "पूर्ववत करें",
  "editor_menu.redo": "फिर से करें",
  "editor_menu.cut": "काटें",
  "editor_menu.copy": "कॉपी करें",
  "editor_menu.paste": "पेस्ट करें",
  "editor_menu.delete": "हटाएं",
  "editor_menu.select_all": "सभी का चयन करें",

  // ===== SideBar =====
  "sidebar.empty_recent": "कोई हालिया फ़ाइल नहीं",
  "sidebar.empty_dir": "खाली फ़ोल्डर",
  "sidebar.up": "ऊपर जाएं",
  "sidebar.dir_unreachable": "⚠️ निर्देशिका तक पहुँचने में असमर्थ:\n{path}\n\nसंभावित कारण: USB ड्राइव हटा दी गई, नेटवर्क ड्राइव माउंट नहीं है, या फ़ोल्डर का नाम बदल दिया गया है।",

  "sidebar.recent": "हाल की फ़ाइलें",
  "sidebar.directory": "वर्तमान निर्देशिका",
  "sidebar.file_not_found": "फ़ाइल नहीं मिली या स्थानांतरित कर दी गई: {path}",

  // ===== स्टेटस बार =====
  "status.unsaved": "सहेजा नहीं गया",
  "status.external_deleted": "⚠ बाहर से हटाया गया",
  "status.external_unreachable": "⚠ स्थान अगम्य है",
  "status.external_modified": "⚠ बाहर से संशोधित",
  "status.line_and_chars": "{lines} पंक्तियां · {chars} अक्षर",
  "status.selected_chars": "{chars} अक्षर चुने गए",
  "status.selected_lines_and_chars": "{lines} पंक्तियां · {chars} अक्षर चुने गए",
  "status.short_line_numbers": "पंक्तियां",
  "status.short_word_wrap": "रैपिंग",
  "status.encoding_tooltip": "एन्कोडिंग: {encoding}",
  "status.line_ending_lf": "Unix लाइन एंडिंग (LF)",
  "status.line_ending_crlf": "Windows लाइन एंडिंग (CRLF)",
  "status.line_ending_cr": "Macintosh लाइन एंडिंग (CR)",

  // ===== बंद करें/सहेजें डायलॉग =====
  "dialog.close_confirm": "हां",
  "dialog.close_cancel": "नहीं",
  "dialog.cancel": "रद्द करें",
  "dialog.filter.all_files": "सभी फ़ाइलें",
  "dialog.filter.text_files": "टेक्स्ट फ़ाइलें",

  "dialog.ask_save_unnamed": 'फ़ाइल "{title}" को सहेजें?',
  "dialog.ask_save_named": '"{title}" में परिवर्तन सहेजें?',

  // ===== संघर्ष समाधान =====
  "dialog.conflict_title":
    "{path}\nफ़ाइल बाहर से संशोधित हो गई है। कृपया चुनें:",
  "dialog.conflict_overwrite": "अधिलेखित करें",
  "dialog.conflict_discard": "पुनः लोड करें",
  "dialog.conflict_discard_close": "परिवर्तन छोड़ें",
  "dialog.conflict_compare": "तुलना करें",
  "dialog.conflict_save_as": "इस रूप में सहेजें",
  "dialog.save_as_conflict":
    "सहेजने में विफल: फ़ाइल पहले से ही किसी अन्य टैब में खुली है। कृपया उस टैब को बंद करके पुनः प्रयास करें।\nपथ: {path}",
  "dialog.ok": "ठीक है",

  // ===== बड़ी फ़ाइल बंद करने का डायलॉग =====
  "dialog.large_close":
    'फ़ाइल "{title}" में असहेजे गए परिवर्तन हैं। बंद करने पर ये खो जाएंगे।',
  "dialog.large_close_yes": "सहेजें",
  "dialog.large_close_no": "मत सहेजें",

  // ===== बड़ी फ़ाइल प्लेसहोल्डर =====

  // ===== कार्यक्रम के बारे में डायलॉग =====
  "about.title": "FinchPad",
  "about.version": "संस्करण {version}",
  "about.line1": "एक आधुनिक, हल्का, मल्टी-टैब सादा टेक्स्ट एडिटर।",
  "about.line2": "बेहतर डिफ़ॉल्ट टेक्स्ट एडिटर बनने का लक्ष्य।",
  "about.tech": "प्रौद्योगिकी: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "लेखक: MaleyGoz",
  "about.license": "लाइसेंस: MIT",
  "about.website": "वेबसाइट: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "ठीक है",

  // ===== अनाम टैब =====
  "tab.unnamed": "बिना नाम {index}",
  "tab.unnamed_fallback": "बिना नाम",

  "large_file.searching": "फ़ाइल स्कैन हो रही है...",
  "large_file.search_limit": "केवल पहले 100 परिणाम दिखाए जा रहे हैं, कृपया अधिक सटीक कीवर्ड का उपयोग करें",
  "sidebar.record_history": "इतिहास रिकॉर्ड करें",
  "large_file.search_placeholder": "खोजें...",
  "large_file.auto_detect": "🔄 स्वतः पहचानें",
  "large_file.search_failed": "खोज विफल रही, कृपया फ़ाइल की स्थिति जांचें।",
  "large_file.pending_size": "फ़ाइल का आकार: {size}",
  "large_file.pending_btn": "⚡ त्वरित रीड-ओनली व्यू",
  "large_file.no_results": "कोई मिलान नहीं मिला",
  "large_file.pending_hint": "मुख्य UI को सुचारू रखने के लिए, इसे अल्ट्रा-फ़ास्ट रीड-ओनली रेंडरिंग के लिए एक अलग विंडो में खोला जाएगा।",
  "large_file.pending_title": "यह फ़ाइल बड़ी है और अभी तक लोड नहीं हुई है",
  "large_file.load_failed": "पढ़ना विफल रहा। फ़ाइल बाहरी रूप से संशोधित या हटा दी गई हो सकती है।",
  "large_file.file_not_found": "फ़ाइल बाहरी रूप से हटा दी गई है या स्थानांतरित कर दी गई है और खोली नहीं जा सकती।",
  "sidebar.delete_record": "रिकॉर्ड हटाएं",
  "sidebar.clear_history": "इतिहास साफ़ करें",

    // ===== 查找替换 =====
    "editor.find.placeholder": "खोजें",
    "editor.find.replace_placeholder": "बदलें",
    "editor.find.show_replace": "बदलें दिखाएं",
    "editor.find.hide_replace": "बदलें छिपाएं",
    "editor.find.close": "बंद करें (Esc)",
    "editor.find.find_in_selection": "चयन में खोजें",
    "editor.find.match_case": "मिलान कास",
    "editor.find.match_whole_word": "पूरा शब्द मिलाएं",
    "editor.find.use_regex": "रेगुलर एक्सप्रेशन का उपयोग करें",
    "editor.find.preserve_case": "केस सुरक्षित रखें",
    "editor.find.replace": "बदलें",
    "editor.find.replace_all": "सभी बदलें",
    "editor.find.prev_match": "पिछला मिलान",
    "editor.find.next_match": "अगला मिलान",
    "editor.find.no_results": "कोई परिणाम नहीं",
    "editor.find.match_count": "{current} में से {total}",

};