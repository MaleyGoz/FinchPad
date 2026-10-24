export const plPL: Record<string, string> = {
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
  "settings.about": "O FinchPad",
  "settings.check_update": "Sprawdź aktualizacje",
  "dialog.update_checking": "Sprawdzanie aktualizacji...",
  "dialog.update_latest": "Używasz najnowszej wersji (v{version}).",
  "dialog.update_found":
    "Znaleziono nową wersję!\nObecna: v{current}\nNajnowsza: v{latest}\n\nPrzejść do GitHub, aby pobrać?",
  "dialog.update_failed": "Sprawdzanie aktualizacji nie powiodło się. Sprawdź połączenie sieciowe.",
  "dialog.update_confirm": "Pobierz",
  "dialog.update_cancel": "Anuluj",

  // ===== Opcje języka =====
  "locale.auto": "Automatycznie",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

  // ===== Menu kontekstowe karty =====
  "tab_menu.save": "Zapisz",
  "tab_menu.save_as": "Zapisz jako",
  "tab_menu.close": "Zamknij kartę",
  "tab_menu.close_others": "Zamknij pozostałe karty",
  "tab_menu.close_left": "Zamknij karty po lewej",
  "tab_menu.close_right": "Zamknij karty po prawej",
  "tab_menu.copy_path": "Kopiuj ścieżkę pliku",
  "tab_menu.reveal_in_explorer": "Pokaż w Eksploratorze",
  "tab_menu.diff": "Porównaj",
  "tab_menu.rename": "Zmień nazwę",

  "diff.window_title": "Porównaj",
  "diff.left_disk": "Dysk",
  "diff.right_editor": "Edytor",
  "diff.keep_mine": "Zachowaj moje zmiany",
  "diff.use_disk": "Użyj wersji z dysku",

  // ===== Menu pustego obszaru paska kart =====
  "bar_menu.new": "Nowa karta",
  "bar_menu.open": "Otwórz plik",

  // ===== Okno zmiany nazwy =====
  "dialog.rename_exists": "Plik o tej nazwie już istnieje w tym katalogu.",
  "dialog.rename_failed": "Zmiana nazwy nie powiodła się: {error}",

  // ===== Menu kontekstowe edytora =====
  "editor_menu.undo": "Cofnij",
  "editor_menu.redo": "Ponów",
  "editor_menu.cut": "Wytnij",
  "editor_menu.copy": "Kopiuj",
  "editor_menu.paste": "Wklej",
  "editor_menu.delete": "Usuń",
  "editor_menu.select_all": "Zaznacz wszystko",

  // ===== SideBar =====
  "sidebar.empty_recent": "Brak ostatnich plików",
  "sidebar.empty_dir": "Pusty folder",
  "sidebar.up": "W górę",
  "sidebar.dir_unreachable": "⚠️ Nie można uzyskać dostępu do katalogu:\n{path}\n\nMożliwe przyczyny: odłączony dysk USB, niezamontowany dysk sieciowy lub zmieniona nazwa folderu.",

  "sidebar.recent": "Ostatnie pliki",
  "sidebar.directory": "Bieżący katalog",
  "sidebar.file_not_found": "Plik nie znaleziony lub przeniesiony: {path}",

  // ===== Pasek stanu =====
  "status.unsaved": "Nie zapisano",
  "status.external_deleted": "⚠ Usunięto z zewnątrz",
  "status.external_unreachable": "⚠ Lokalizacja nieosiągalna",
  "status.external_modified": "⚠ Zmodyfikowano z zewnątrz",
  "status.line_and_chars": "{lines} wierszy · {chars} znaków",
  "status.selected_chars": "Zaznaczono {chars} znaków",
  "status.selected_lines_and_chars": "Zaznaczono {lines} wierszy · {chars} znaków",
  "status.short_line_numbers": "Wiersze",
  "status.short_word_wrap": "Zawijanie",
  "status.encoding_tooltip": "Kodowanie: {encoding}",
  "status.line_ending_lf": "Koniec wiersza Unix (LF)",
  "status.line_ending_crlf": "Koniec wiersza Windows (CRLF)",
  "status.line_ending_cr": "Koniec wiersza Macintosh (CR)",

  // ===== Okna zamykania/zapisywania =====
  "dialog.close_confirm": "Tak",
  "dialog.close_cancel": "Nie",
  "dialog.cancel": "Anuluj",
  "dialog.filter.all_files": "Wszystkie pliki",
  "dialog.filter.text_files": "Pliki tekstowe",

  "dialog.ask_save_unnamed": 'Zapisać plik "{title}"?',
  "dialog.ask_save_named": 'Zapisać zmiany w pliku "{title}"?',

  // ===== Rozwiązywanie konfliktów =====
  "dialog.conflict_title":
    "{path}\nPlik został zmodyfikowany z zewnątrz. Wybierz akcję:",
  "dialog.conflict_overwrite": "Nadpisz",
  "dialog.conflict_discard": "Przeładuj",
  "dialog.conflict_discard_close": "Odrzuć zmiany",
  "dialog.conflict_compare": "Porównaj",
  "dialog.conflict_save_as": "Zapisz jako",
  "dialog.save_as_conflict":
    "Zapisywanie nie powiodło się: Plik jest już otwarty w innej karcie. Zamknij tę kartę i spróbuj ponownie.\nŚcieżka: {path}",
  "dialog.ok": "OK",

  // ===== Okno zamykania dużego pliku =====
  "dialog.large_close":
    'Plik "{title}" ma niezapisane zmiany. Zamknięcie spowoduje ich utratę.',
  "dialog.large_close_yes": "Zapisz",
  "dialog.large_close_no": "Nie zapisuj",

  // ===== Placeholder dużego pliku =====
  "pending.title": "Ten plik jest duży i nie został jeszcze wczytany",
  "pending.size": "Rozmiar: {size}",
  "pending.hint": "Po wczytaniu edytor może przez chwilę nie odpowiadać",
  "pending.load": "Wczytaj teraz",

  // ===== Okno „O programie” =====
  "about.title": "FinchPad",
  "about.version": "Wersja {version}",
  "about.line1": "Nowoczesny, lekki, wielokartowy edytor czystego tekstu.",
  "about.line2": "Lepszy domyślny edytor tekstu.",
  "about.tech": "Technologia: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Licencja: MIT",
  "about.website": "Strona: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Nie nazwane karty =====
  "tab.unnamed": "Bez nazwy {index}",
  "tab.unnamed_fallback": "Bez nazwy",
};