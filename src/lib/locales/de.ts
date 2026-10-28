export const de: Record<string, string> = {
  // ===== Einstellungen-Menü =====
  "settings.view": "Ansicht",
  "settings.show_line_numbers": "Zeilennummern",
  "settings.word_wrap": "Zeilenumbruch",
  "settings.theme": "Design",
  "settings.theme.white": "Weiß",
  "settings.theme.gray": "Grau",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Grün",
  "settings.theme.dark": "Dunkel",
  "settings.language": "Sprache",
  "settings.about": "Über FinchPad",
  "settings.check_update": "Nach Updates suchen",
  "dialog.update_checking": "Suche nach Updates...",
  "dialog.update_latest": "Sie haben die neueste Version (v{version}).",
  "dialog.update_found":
    "Neue Version gefunden!\nAktuell: v{current}\nNeueste: v{latest}\n\nZu GitHub wechseln und herunterladen?",
  "dialog.update_failed": "Update-Prüfung fehlgeschlagen. Bitte Netzwerk prüfen.",
  "dialog.update_confirm": "Herunterladen",
  "dialog.update_cancel": "Abbrechen",

  // ===== Sprachoptionen =====

  // ===== Tab-Kontextmenü =====
  "tab_menu.save": "Speichern",
  "tab_menu.save_as": "Speichern unter",
  "tab_menu.close": "Tab schließen",
  "tab_menu.close_others": "Andere Tabs schließen",
  "tab_menu.close_left": "Tabs links schließen",
  "tab_menu.close_right": "Tabs rechts schließen",
  "tab_menu.close_all": "Alle schließen",
  "tab_menu.copy_path": "Dateipfad kopieren",
  "tab_menu.reveal_in_explorer": "Im Explorer anzeigen",
  "tab_menu.diff": "Vergleichen",
  "tab_menu.rename": "Umbenennen",

  "diff.window_title": "Vergleichen",
  "diff.left_disk": "Festplatte",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Meine behalten",
  "diff.use_disk": "Festplattenversion verwenden",

  // ===== Leerraum-Menü der Tableiste =====
  "bar_menu.new": "Neuer Tab",
  "bar_menu.open": "Datei öffnen",

  // ===== Umbenennen-Dialog =====
  "dialog.rename_exists": "Eine Datei mit diesem Namen existiert bereits im Verzeichnis.",
  "dialog.rename_failed": "Umbenennen fehlgeschlagen: {error}",

  // ===== Editor-Kontextmenü =====
  "editor_menu.undo": "Rückgängig",
  "editor_menu.redo": "Wiederholen",
  "editor_menu.cut": "Ausschneiden",
  "editor_menu.copy": "Kopieren",
  "editor_menu.paste": "Einfügen",
  "editor_menu.delete": "Löschen",
  "editor_menu.select_all": "Alles auswählen",

  // ===== SideBar =====
  "sidebar.empty_recent": "Keine aktuellen Dateien",
  "sidebar.empty_dir": "Leerer Ordner",
  "sidebar.up": "Übergeordneter Ordner",
  "sidebar.dir_unreachable": "⚠️ Auf das Verzeichnis kann nicht zugegriffen werden:\n{path}\n\nMögliche Ursachen: USB-Laufwerk entfernt, Netzlaufwerk nicht eingebunden oder Ordner umbenannt.",

  "sidebar.recent": "Zuletzt verwendet",
  "sidebar.directory": "Aktuelles Verzeichnis",
  "sidebar.file_not_found": "Datei nicht gefunden oder verschoben: {path}",

  // ===== Statusleiste =====
  "status.unsaved": "Nicht gespeichert",
  "status.external_deleted": "⚠ Extern gelöscht",
  "status.external_unreachable": "⚠ Speicherort nicht erreichbar",
  "status.external_modified": "⚠ Extern geändert",
  "status.line_and_chars": "{lines} Zeilen · {chars} Zeichen",
  "status.selected_chars": "{chars} Zeichen ausgewählt",
  "status.selected_lines_and_chars": "{lines} Zeilen · {chars} Zeichen ausgewählt",
  "status.short_line_numbers": "Zeilen",
  "status.short_word_wrap": "Umbruch",
  "status.encoding_tooltip": "Kodierung: {encoding}",
  "status.line_ending_lf": "Unix-Zeilenende (LF)",
  "status.line_ending_crlf": "Windows-Zeilenende (CRLF)",
  "status.line_ending_cr": "Macintosh-Zeilenende (CR)",

  // ===== Schließen/Speichern-Dialoge =====
  "dialog.close_confirm": "Ja",
  "dialog.close_cancel": "Nein",
  "dialog.cancel": "Abbrechen",
  "dialog.filter.all_files": "Alle Dateien",
  "dialog.filter.text_files": "Textdateien",

  "dialog.ask_save_unnamed": 'Datei „{title}" speichern?',
  "dialog.ask_save_named": 'Änderungen an „{title}" speichern?',

  // ===== Konfliktlösung =====
  "dialog.conflict_title": "{path}\nDie Datei wurde extern geändert. Wählen Sie eine Option:",
  "dialog.conflict_overwrite": "Überschreiben",
  "dialog.conflict_discard": "Neu laden",
  "dialog.conflict_discard_close": "Verwerfen",
  "dialog.conflict_compare": "Vergleichen",
  "dialog.conflict_save_as": "Speichern unter",
  "dialog.save_as_conflict":
    "Speichern fehlgeschlagen: Die Datei ist bereits in einem anderen Tab geöffnet. Bitte schließen Sie diesen und versuchen Sie es erneut.\nPfad: {path}",
  "dialog.ok": "OK",

  // ===== Große Datei schließen =====
  "dialog.large_close": 'Die Datei „{title}" hat ungespeicherte Änderungen. Diese gehen beim Schließen verloren.',
  "dialog.large_close_yes": "Speichern",
  "dialog.large_close_no": "Nicht speichern",

  // ===== Platzhalter für große Datei =====

  // ===== Über-Dialog =====
  "about.title": "FinchPad",
  "about.version": "Version {version}",
  "about.line1": "Ein moderner, leichter Texteditor mit mehreren Tabs.",
  "about.line2": "Das Ziel: ein besserer Standard-Texteditor zu sein.",
  "about.tech": "Erstellt mit: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Lizenz: MIT",
  "about.website": "Webseite: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Unbenannte Tabs =====
  "tab.unnamed": "Unbenannt {index}",
  "tab.unnamed_fallback": "Unbenannt",

  "large_file.searching": "Datei wird durchsucht...",
  "large_file.search_limit": "Es werden nur die ersten 100 Ergebnisse angezeigt, bitte präzisere Suchbegriffe verwenden",
  "sidebar.record_history": "Verlauf aufzeichnen",
  "large_file.search_placeholder": "Suchen...",
  "large_file.auto_detect": "🔄 Automatische Erkennung",
  "large_file.search_failed": "Suche fehlgeschlagen, bitte Dateistatus prüfen.",
  "large_file.pending_size": "Dateigröße: {size}",
  "large_file.pending_btn": "⚡ Schnellansicht (schreibgeschützt)",
  "large_file.no_results": "Keine Treffer gefunden",
  "large_file.pending_hint": "Um die Hauptoberfläche flüssig zu halten, wird sie in einem separaten Fenster für eine ultraschnelle schreibgeschützte Darstellung geöffnet.",
  "large_file.pending_title": "Diese Datei ist groß und noch nicht geladen",
  "large_file.load_failed": "Lesen fehlgeschlagen. Die Datei wurde möglicherweise extern geändert oder gelöscht.",
  "large_file.file_not_found": "Die Datei wurde extern gelöscht oder verschoben und kann nicht geöffnet werden.",
  "sidebar.delete_record": "Eintrag löschen",
  "sidebar.clear_history": "Verlauf löschen",
};