export const ru: Record<string, string> = {
  // ===== Меню настроек =====
  "settings.view": "Вид",
  "settings.show_line_numbers": "Номера строк",
  "settings.word_wrap": "Перенос по словам",
  "settings.theme": "Тема",
  "settings.theme.white": "Светлая",
  "settings.theme.gray": "Серая",
  "settings.theme.sepia": "Сепия",
  "settings.theme.green": "Зелёная",
  "settings.theme.dark": "Тёмная",
  "settings.language": "Язык",
  "settings.about": "О программе FinchPad",
  "settings.check_update": "Проверить обновления",
  "dialog.update_checking": "Проверка обновлений...",
  "dialog.update_latest": "У вас последняя версия (v{version}).",
  "dialog.update_found":
    "Найдена новая версия!\nТекущая: v{current}\nПоследняя: v{latest}\n\nПерейти на GitHub для загрузки?",
  "dialog.update_failed": "Не удалось проверить обновления. Проверьте подключение к сети.",
  "dialog.update_confirm": "Загрузить",
  "dialog.update_cancel": "Отмена",

  // ===== 标签栏 =====
  "tab_bar.new_tab": "Новая вкладка",
  "tab_bar.settings": "Настройки",
  "tab_bar.preview": "Предпросмотр",

  // ===== Языковые опции =====

  // ===== Контекстное меню вкладки =====
  "tab_menu.save": "Сохранить",
  "tab_menu.save_as": "Сохранить как",
  "tab_menu.close": "Закрыть вкладку",
  "tab_menu.close_others": "Закрыть другие вкладки",
  "tab_menu.close_left": "Закрыть вкладки слева",
  "tab_menu.close_right": "Закрыть вкладки справа",
  "tab_menu.close_all": "Закрыть все",
  "tab_menu.reopen": "Открыть закрытую вкладку",
  "tab_menu.copy_path": "Копировать путь к файлу",
  "tab_menu.reveal_in_explorer": "Показать в проводнике",
  "tab_menu.diff": "Сравнить",
  "tab_menu.rename": "Переименовать",

  "diff.window_title": "Сравнение",
  "diff.left_disk": "Диск",
  "diff.right_editor": "Редактор",
  "diff.keep_mine": "Оставить мою версию",
  "diff.use_disk": "Использовать версию с диска",

  // ===== Меню пустой области панели вкладок =====
  "bar_menu.new": "Новая вкладка",
  "bar_menu.open": "Открыть файл",

  // ===== Диалог переименования =====
  "dialog.rename_exists": "Файл с таким именем уже существует в этой папке.",
  "dialog.rename_failed": "Ошибка переименования: {error}",

  // ===== Контекстное меню редактора =====
  "editor_menu.undo": "Отменить",
  "editor_menu.redo": "Повторить",
  "editor_menu.cut": "Вырезать",
  "editor_menu.copy": "Копировать",
  "editor_menu.paste": "Вставить",
  "editor_menu.delete": "Удалить",
  "editor_menu.select_all": "Выделить всё",

  // ===== SideBar =====
  "sidebar.empty_recent": "Нет недавних файлов",
  "sidebar.empty_dir": "Пустая папка",
  "sidebar.up": "На уровень выше",
  "sidebar.dir_unreachable": "⚠️ Невозможно получить доступ к каталогу:\n{path}\n\nВозможные причины: USB-накопитель отключен, сетевой диск не смонтирован или папка переименована.",

  "sidebar.recent": "Недавние файлы",
  "sidebar.directory": "Текущая папка",
  "sidebar.file_not_found": "Файл не найден или перемещён: {path}",

  // ===== Строка состояния =====
  "status.unsaved": "Не сохранено",
  "status.external_deleted": "⚠ Удалён извне",
  "status.external_unreachable": "⚠ Расположение недоступно",
  "status.external_modified": "⚠ Изменён извне",
  "status.line_and_chars": "{lines} строк · {chars} символов",
  "status.selected_chars": "Выбрано {chars} символов",
  "status.selected_lines_and_chars": "Выбрано {lines} строк · {chars} символов",
  "status.short_line_numbers": "Строки",
  "status.short_word_wrap": "Перенос",
  "status.zoom_tooltip": "Масштаб",
  "status.scroll_wheel": "Колесо",
  "status.encoding_tooltip": "Кодировка: {encoding}",
  "status.line_ending_lf": "Концы строк Unix (LF)",
  "status.line_ending_crlf": "Концы строк Windows (CRLF)",
  "status.line_ending_cr": "Концы строк Macintosh (CR)",

  // ===== Диалоги закрытия/сохранения =====
  "dialog.close_confirm": "Да",
  "dialog.close_cancel": "Нет",
  "dialog.cancel": "Отмена",
  "dialog.filter.all_files": "Все файлы",
  "dialog.filter.text_files": "Текстовые файлы",

  "dialog.ask_save_unnamed": 'Сохранить файл «{title}»?',
  "dialog.ask_save_named": 'Сохранить изменения в «{title}»?',

  // ===== Разрешение конфликтов =====
  "dialog.conflict_title": "{path}\nФайл был изменён извне. Выберите способ обработки:",
  "dialog.conflict_overwrite": "Перезаписать",
  "dialog.conflict_discard": "Перезагрузить",
  "dialog.conflict_discard_close": "Отбросить",
  "dialog.conflict_compare": "Сравнить",
  "dialog.conflict_save_as": "Сохранить как",
  "dialog.save_as_conflict":
    "Ошибка сохранения: Файл уже открыт в другой вкладке. Закройте её и повторите попытку.\nПуть: {path}",
  "dialog.ok": "ОК",

  // ===== Диалог закрытия большого файла =====
  "dialog.large_close": 'Файл «{title}» содержит несохранённые изменения. Они будут потеряны при закрытии.',
  "dialog.large_close_yes": "Сохранить",
  "dialog.large_close_no": "Не сохранять",

  // ===== Заглушка большого файла =====

  // ===== Диалог «О программе» =====
  "about.title": "FinchPad",
  "about.version": "Версия {version}",
  "about.line1": "Современный, лёгкий текстовый редактор с несколькими вкладками.",
  "about.line2": "Стремится стать лучшим текстовым редактором по умолчанию.",
  "about.tech": "Создан с помощью: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Автор: MaleyGoz",
  "about.license": "Лицензия: MIT",
  "about.website": "Веб-сайт: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "ОК",

  // ===== Безымянные вкладки =====
  "tab.unnamed": "Безымянный {index}",
  "tab.unnamed_fallback": "Без имени",

  "large_file.searching": "Сканирование файла...",
  "large_file.search_limit": "Показаны только первые 100 результатов, используйте более точные ключевые слова",
  "sidebar.record_history": "Записывать историю",
  "large_file.search_placeholder": "Поиск...",
  "large_file.auto_detect": "🔄 Автоопределение",
  "large_file.search_failed": "Ошибка поиска, проверьте состояние файла.",
  "large_file.pending_size": "Размер файла: {size}",
  "large_file.pending_btn": "⚡ Быстрый просмотр только для чтения",
  "large_file.no_results": "Совпадений не найдено",
  "large_file.pending_hint": "Чтобы основной интерфейс работал плавно, он откроется в отдельном окне для сверхбыстрого рендеринга только для чтения.",
  "large_file.pending_title": "Этот файл большой и еще не загружен",
  "large_file.load_failed": "Ошибка чтения. Файл мог быть изменен или удален извне.",
  "large_file.file_not_found": "Файл был удален или перемещен извне, невозможно открыть.",
  "sidebar.delete_record": "Удалить запись",
  "sidebar.clear_history": "Очистить историю",

    // ===== 查找替换 =====
    "editor.find.placeholder": "Найти",
    "editor.find.replace_placeholder": "Заменить",
    "editor.find.show_replace": "Показать Заменить",
    "editor.find.hide_replace": "Скрыть Заменить",
    "editor.find.close": "Закрыть (Esc)",
    "editor.find.find_in_selection": "Искать в выделенном",
    "editor.find.match_case": "Учитывать регистр",
    "editor.find.match_whole_word": "Слово целиком",
    "editor.find.use_regex": "Использовать регулярное выражение",
    "editor.find.preserve_case": "Сохранить регистр",
    "editor.find.replace": "Заменить",
    "editor.find.replace_all": "Заменить все",
    "editor.find.prev_match": "Предыдущее совпадение",
    "editor.find.next_match": "Следующее совпадение",
    "editor.find.no_results": "Нет результатов",
    "editor.find.match_count": "{current} из {total}",

};