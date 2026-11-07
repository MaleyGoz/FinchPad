export const pl: Record<string, string> = {
  // ===== Menu ustawień =====
  "settings.view": "Widok",
  "settings.show_line_numbers": "Numery wierszy",
  "settings.word_wrap": "Zawijanie wierszy",
  "settings.theme": "Motyw",
  "settings.theme.white": "Biały",
  "settings.theme.gray": "Szary",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Zielony",
  "settings.theme.dark": "Ciemny",
  "settings.language": "Język",
  "settings.about": "O programie FinchPad",
  "settings.check_update": "Sprawdź aktualizacje",
  "dialog.update_checking": "Sprawdzanie aktualizacji...",
  "dialog.update_latest": "Używasz najnowszej wersji (v{version}).",
  "dialog.update_found": "Znaleziono nową wersję!\nAktualna: v{current}\nNajnowsza: v{latest}\n\nPrzejść do GitHub, aby pobrać?",
  "dialog.update_failed": "Nie udało się sprawdzić aktualizacji. Sprawdź połączenie sieciowe.",
  "dialog.update_confirm": "Najnowsza wersja",
  "dialog.update_cancel": "Anuluj",

  // ===== Pasek kart =====
  "tab_bar.new_tab": "Nowa karta",
  "tab_bar.settings": "Ustawienia",
  "tab_bar.preview": "Podgląd",
  "tab_bar.more_tabs": "Więcej kart",

  // ===== Menu kontekstowe karty =====
  "tab_menu.save": "Zapisz",
  "tab_menu.save_as": "Zapisz jako",
  "tab_menu.close": "Zamknij kartę",
  "tab_menu.close_others": "Zamknij inne karty",
  "tab_menu.close_left": "Zamknij karty po lewej",
  "tab_menu.close_right": "Zamknij karty po prawej",
  "tab_menu.close_all": "Zamknij wszystkie karty",
  "tab_menu.reopen": "Otwórz ponownie zamkniętą kartę",
  "tab_menu.copy_path": "Kopiuj ścieżkę pliku",
  "tab_menu.reveal_in_explorer": "Pokaż w Eksploratorze",
  "tab_menu.diff": "Porównaj",
  "tab_menu.rename": "Zmień nazwę",

  "diff.window_title": "Porównaj",
  "diff.left_disk": "Wersja na dysku",
  "diff.right_editor": "Wersja w edytorze",
  "diff.keep_mine": "Zachowaj moje zmiany",
  "diff.use_disk": "Użyj wersji z dysku",

  // ===== Menu pustego obszaru paska kart =====
  "bar_menu.new": "Nowa karta",
  "bar_menu.open": "Otwórz plik",

  // ===== Okno zmiany nazwy =====
  "dialog.rename_exists": "Plik o tej nazwie już istnieje.",
  "dialog.rename_failed": "Zmiana nazwy nie powiodła się: {error}",

  // ===== Menu kontekstowe edytora =====
  "editor_menu.undo": "Cofnij",
  "editor_menu.redo": "Przywróć",
  "editor_menu.cut": "Wytnij",
  "editor_menu.copy": "Kopiuj",
  "editor_menu.paste": "Wklej",
  "editor_menu.delete": "Usuń",
  "editor_menu.select_all": "Zaznacz wszystko",

  // ===== Pasek boczny =====
  "sidebar.recent": "Ostatnie pliki",
  "sidebar.directory": "Bieżący katalog",
  "sidebar.file_not_found": "Nie znaleziono pliku lub został przeniesiony: {path}",
  "sidebar.empty_recent": "Brak ostatnich plików",
  "sidebar.empty_dir": "Pusty folder",
  "sidebar.up": "W górę",
  "sidebar.dir_unreachable": "⚠️ Brak dostępu do katalogu:\n{path}\n\nMożliwe przyczyny: odłączony dysk USB, niezamontowany dysk sieciowy lub zmieniona nazwa folderu.",
  "sidebar.record_history": "Zapisuj historię",
  "sidebar.clear_history": "Wyczyść historię",
  "sidebar.delete_record": "Usuń wpis",

  // ===== Pasek stanu =====
  "status.unsaved": "Niezapisane",
  "status.external_deleted": "⚠ Usunięto zewnętrznie",
  "status.external_unreachable": "⚠ Lokalizacja niedostępna",
  "status.external_modified": "⚠ Zmodyfikowano zewnętrznie",
  "status.line_and_chars": "{lines} wierszy · {chars} znaków",
  "status.selected_chars": "Zaznaczono {chars} znaków",
  "status.selected_lines_and_chars": "Zaznaczono {lines} wierszy · {chars} znaków",
  "status.short_line_numbers": "Numery wierszy",
  "status.short_word_wrap": "Zawijanie",
  "status.zoom_tooltip": "Powiększenie",
  "status.scroll_wheel": "Kółko",
  "status.encoding_tooltip": "Kodowanie: {encoding}",
  "status.line_ending_lf": "Koniec wiersza Unix (LF)",
  "status.line_ending_crlf": "Koniec wiersza Windows (CRLF)",
  "status.line_ending_cr": "Koniec wiersza Macintosh (CR)",

  // ===== Okna zamykania/zapisu =====
  "dialog.close_confirm": "Tak",
  "dialog.close_cancel": "Nie",
  "dialog.cancel": "Anuluj",
  "dialog.filter.all_files": "Wszystkie pliki",
  "dialog.filter.text_files": "Pliki tekstowe",
  "dialog.ask_save_unnamed": "Zapisać plik \"{title}\"?",
  "dialog.ask_save_named": "Zapisać zmiany w \"{title}\"?",

  // ===== Rozwiązywanie konfliktów =====
  "dialog.conflict_title": "{path}\nPlik został zmodyfikowany zewnętrznie. Wybierz, jak kontynuować:",
  "dialog.conflict_overwrite": "Nadpisz",
  "dialog.conflict_discard": "Odśwież",
  "dialog.conflict_discard_close": "Odrzuć",
  "dialog.conflict_compare": "Porównaj",
  "dialog.conflict_save_as": "Zapisz jako",
  "dialog.save_as_conflict": "Zapis nie powiódł się: Plik jest już otwarty na innej karcie. Zamknij go i spróbuj ponownie.\nŚcieżka: {path}",
  "dialog.ok": "OK",
  "dialog.save_failed_title": "⚠️ Zapis nie powiódł się: Nie można zapisać do pliku.",

  // ===== Okno zamykania dużego pliku =====
  "dialog.large_close": "Plik \"{title}\" ma niezapisane zmiany. Zostaną one utracone po zamknięciu.",
  "dialog.large_close_yes": "Zapisz",
  "dialog.large_close_no": "Nie zapisuj",

  // ===== Okno zmiany kodowania i końca wiersza =====
  "dialog.format_type_encoding": "kodowanie",
  "dialog.format_type_line_ending": "koniec wiersza",
  "dialog.change_format_title": "Zmienić {typeName} na \"{value}\"?",
  "dialog.change_format_subtitle": "Dokument można przekonwertować bezstratnie. Zawartość pliku zostanie zaktualizowana po zapisaniu.",
  "dialog.change_format_lossy_title": "⚠ Zmiana {typeName} może spowodować utratę znaków",
  "dialog.change_format_lossy_subtitle": "Dokument zawiera znaki specjalne. Po przełączeniu na \"{value}\" znaki te zostaną zastąpione przez \"?\" i nie będzie można ich odzyskać.",
  "encoding_group_unicode": "Rozszerzenia Unicode",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Europa Zachodnia",
  "encoding_group_central_europe": "Europa Środkowo-Wschodnia",
  "encoding_group_cyrillic": "Cyrylica",
  "encoding_group_others": "Bliski Wschód i inne",
  "encoding.recommend": "Zalecane",

  // ===== O programie =====
  "about.title": "FinchPad",
  "about.version": "Wersja {version}",
  "about.line1": "Nowoczesny, lekki edytor tekstu z wieloma kartami.",
  "about.line2": "Dążący do bycia lepszym domyślnym edytorem tekstu.",
  "about.tech": "Zbudowany za pomocą: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Licencja: MIT",
  "about.website": "Strona internetowa: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Karty bez nazwy =====
  "tab.unnamed": "Bez nazwy {index}",
  "tab.unnamed_fallback": "Bez nazwy",

  // ===== Duży plik =====
  "large_file.pending_title": "Ten plik jest duży i nie został jeszcze załadowany",
  "large_file.pending_size": "Rozmiar pliku: {size}",
  "large_file.pending_hint": "Aby zachować płynność interfejsu, zostanie on otwarty w osobnym oknie w celu ultraszybkiego renderowania w trybie tylko do odczytu.",
  "large_file.pending_btn": "⚡ Szybki podgląd tylko do odczytu",
  "large_file.searching": "Skanowanie pliku...",
  "large_file.no_results": "Nie znaleziono dopasowań",
  "large_file.search_failed": "Wyszukiwanie nie powiodło się, sprawdź stan pliku.",
  "large_file.search_limit": "Wyświetlanych jest tylko pierwszych 100 wyników, użyj dokładniejszych słów kluczowych",
  "large_file.file_not_found": "Plik został usunięty lub przeniesiony zewnętrznie i nie można go otworzyć.",
  "large_file.load_failed": "Odczytywanie nie powiodło się. Plik mógł zostać zmodyfikowany lub usunięty zewnętrznie.",
  "large_file.search_placeholder": "Szukaj...",
  "large_file.auto_detect": "🔄 Autodetekcja",

  // ===== Znajdź i zamień =====
  "editor.find.placeholder": "Znajdź",
  "editor.find.replace_placeholder": "Zamień",
  "editor.find.show_replace": "Pokaż zamianę",
  "editor.find.hide_replace": "Ukryj zamianę",
  "editor.find.close": "Zamknij (Esc)",
  "editor.find.find_in_selection": "Znajdź w zaznaczeniu",
  "editor.find.match_case": "Uwzględnij wielkość liter",
  "editor.find.match_whole_word": "Całe wyrazy",
  "editor.find.use_regex": "Wyrażenie regularne",
  "editor.find.preserve_case": "Zachowaj wielkość liter",
  "editor.find.replace": "Zamień",
  "editor.find.replace_all": "Zamień wszystko",
  "editor.find.prev_match": "Poprzednie dopasowanie",
  "editor.find.next_match": "Następne dopasowanie",
  "editor.find.no_results": "Brak wyników",
  "editor.find.match_count": "{current} z {total}",

    
    // ===== Menu macOS =====
    "menu.file": "Plik",
    "menu.edit": "Edycja",
    "menu.view": "Widok",
    "menu.quit": "Zakończ FinchPad",
};