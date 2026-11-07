export const de: Record<string, string> = {
  // ===== Einstellungsmenü =====
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
  "dialog.update_latest": "Sie verwenden die neueste Version (v{version}).",
  "dialog.update_found": "Neue Version gefunden!\nAktuell: v{current}\nNeueste: v{latest}\n\nZu GitHub wechseln, um herunterzuladen?",
  "dialog.update_failed": "Update-Suche fehlgeschlagen. Bitte überprüfen Sie Ihre Netzwerkverbindung.",
  "dialog.update_confirm": "Neueste Version",
  "dialog.update_cancel": "Abbrechen",

  // ===== Tableiste =====
  "tab_bar.new_tab": "Neuer Tab",
  "tab_bar.settings": "Einstellungen",
  "tab_bar.preview": "Vorschau",
  "tab_bar.more_tabs": "Weitere Tabs",

  // ===== Tab-Kontextmenü =====
  "tab_menu.save": "Speichern",
  "tab_menu.save_as": "Speichern unter",
  "tab_menu.close": "Tab schließen",
  "tab_menu.close_others": "Andere Tabs schließen",
  "tab_menu.close_left": "Tabs links schließen",
  "tab_menu.close_right": "Tabs rechts schließen",
  "tab_menu.close_all": "Alle Tabs schließen",
  "tab_menu.reopen": "Geschlossenen Tab wieder öffnen",
  "tab_menu.copy_path": "Dateipfad kopieren",
  "tab_menu.reveal_in_explorer": "Im Explorer anzeigen",
  "tab_menu.diff": "Vergleichen",
  "tab_menu.rename": "Umbenennen",

  "diff.window_title": "Vergleichen",
  "diff.left_disk": "Festplattenversion",
  "diff.right_editor": "Editorversion",
  "diff.keep_mine": "Meine Änderungen behalten",
  "diff.use_disk": "Festplattenversion verwenden",

  // ===== Leerer Bereich der Tableiste =====
  "bar_menu.new": "Neuer Tab",
  "bar_menu.open": "Datei öffnen",

  // ===== Umbenennen-Dialog =====
  "dialog.rename_exists": "Eine Datei mit diesem Namen existiert bereits.",
  "dialog.rename_failed": "Umbenennen fehlgeschlagen: {error}",

  // ===== Editor-Kontextmenü =====
  "editor_menu.undo": "Rückgängig",
  "editor_menu.redo": "Wiederholen",
  "editor_menu.cut": "Ausschneiden",
  "editor_menu.copy": "Kopieren",
  "editor_menu.paste": "Einfügen",
  "editor_menu.delete": "Löschen",
  "editor_menu.select_all": "Alles auswählen",

  // ===== Seitenleiste =====
  "sidebar.recent": "Letzte Dateien",
  "sidebar.directory": "Aktuelles Verzeichnis",
  "sidebar.file_not_found": "Datei nicht gefunden oder verschoben: {path}",
  "sidebar.empty_recent": "Keine letzten Dateien",
  "sidebar.empty_dir": "Leerer Ordner",
  "sidebar.up": "Nach oben",
  "sidebar.dir_unreachable": "⚠️ Zugriff auf folgendes Verzeichnis nicht möglich:\n{path}\n\nMögliche Ursachen: USB-Laufwerk getrennt, Netzlaufwerk nicht eingebunden oder Ordner umbenannt.",
  "sidebar.record_history": "Verlauf aufzeichnen",
  "sidebar.clear_history": "Verlauf löschen",
  "sidebar.delete_record": "Eintrag löschen",

  // ===== Statusleiste =====
  "status.unsaved": "Ungespeichert",
  "status.external_deleted": "⚠ Extern gelöscht",
  "status.external_unreachable": "⚠ Speicherort unzugänglich",
  "status.external_modified": "⚠ Extern geändert",
  "status.line_and_chars": "{lines} Zeilen · {chars} Zeichen",
  "status.selected_chars": "{chars} Zeichen ausgewählt",
  "status.selected_lines_and_chars": "{lines} Zeilen · {chars} Zeichen ausgewählt",
  "status.short_line_numbers": "Zeilen-Nr.",
  "status.short_word_wrap": "Umbruch",
  "status.zoom_tooltip": "Zoom",
  "status.scroll_wheel": "Mausrad",
  "status.encoding_tooltip": "Kodierung: {encoding}",
  "status.line_ending_lf": "Unix-Zeilenende (LF)",
  "status.line_ending_crlf": "Windows-Zeilenende (CRLF)",
  "status.line_ending_cr": "Macintosh-Zeilenende (CR)",

  // ===== Schließen/Speichern Dialoge =====
  "dialog.close_confirm": "Ja",
  "dialog.close_cancel": "Nein",
  "dialog.cancel": "Abbrechen",
  "dialog.filter.all_files": "Alle Dateien",
  "dialog.filter.text_files": "Textdateien",
  "dialog.ask_save_unnamed": "Datei \"{title}\" speichern?",
  "dialog.ask_save_named": "Änderungen an \"{title}\" speichern?",

  // ===== Konfliktlösung =====
  "dialog.conflict_title": "{path}\nDatei wurde extern geändert. Wie möchten Sie fortfahren?",
  "dialog.conflict_overwrite": "Überschreiben",
  "dialog.conflict_discard": "Neu laden",
  "dialog.conflict_discard_close": "Verwerfen",
  "dialog.conflict_compare": "Vergleichen",
  "dialog.conflict_save_as": "Speichern unter",
  "dialog.save_as_conflict": "Speichern fehlgeschlagen: Die Datei ist bereits in einem anderen Tab geöffnet. Bitte schließen Sie diese und versuchen Sie es erneut.\nPfad: {path}",
  "dialog.ok": "OK",
  "dialog.save_failed_title": "⚠️ Speichern fehlgeschlagen: Datei kann nicht geschrieben werden.",

  // ===== Große Datei schließen Dialog =====
  "dialog.large_close": "Die Datei \"{title}\" enthält ungespeicherte Änderungen. Diese gehen beim Schließen verloren.",
  "dialog.large_close_yes": "Speichern",
  "dialog.large_close_no": "Nicht speichern",

  // ===== Dialog zur Änderung von Kodierung und Zeilenende =====
  "dialog.format_type_encoding": "Kodierung",
  "dialog.format_type_line_ending": "Zeilenende",
  "dialog.change_format_title": "{typeName} in \"{value}\" ändern?",
  "dialog.change_format_subtitle": "Das Dokument kann verlustfrei konvertiert werden. Der Dateiinhalt wird nach dem Speichern aktualisiert.",
  "dialog.change_format_lossy_title": "⚠ Das Ändern von {typeName} kann zu Zeichenverlusten führen",
  "dialog.change_format_lossy_subtitle": "Das Dokument enthält Sonderzeichen. Nach dem Wechsel zu \"{value}\" werden diese Zeichen durch \"?\" ersetzt und können nicht wiederhergestellt werden.",
  "encoding_group_unicode": "Unicode-Erweiterungen",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Westeuropäisch",
  "encoding_group_central_europe": "Mittel-/Osteuropa",
  "encoding_group_cyrillic": "Kyrillisch",
  "encoding_group_others": "Naher Osten & Sonstige",
  "encoding.recommend": "Empfohlen",

  // ===== Über Dialog =====
  "about.title": "FinchPad",
  "about.version": "Version {version}",
  "about.line1": "Ein moderner, leichter Multi-Tab-Texteditor.",
  "about.line2": "Ziel ist es, ein besserer Standard-Texteditor zu sein.",
  "about.tech": "Technologie: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Lizenz: MIT",
  "about.website": "Website: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Unbenannte Tabs =====
  "tab.unnamed": "Unbenannt {index}",
  "tab.unnamed_fallback": "Unbenannt",

  // ===== Große Datei =====
  "large_file.pending_title": "Diese Datei ist groß und noch nicht geladen",
  "large_file.pending_size": "Dateigröße: {size}",
  "large_file.pending_hint": "Um die Hauptoberfläche flüssig zu halten, wird sie in einem separaten Fenster für eine extrem schnelle schreibgeschützte Darstellung geöffnet.",
  "large_file.pending_btn": "⚡ Schnelle schreibgeschützte Ansicht",
  "large_file.searching": "Datei wird gescannt...",
  "large_file.no_results": "Keine Übereinstimmungen gefunden",
  "large_file.search_failed": "Suche fehlgeschlagen, bitte überprüfen Sie den Dateistatus.",
  "large_file.search_limit": "Es werden nur die ersten 100 Ergebnisse angezeigt. Bitte verwenden Sie präzisere Schlüsselwörter.",
  "large_file.file_not_found": "Die Datei wurde extern gelöscht oder verschoben und kann nicht geöffnet werden.",
  "large_file.load_failed": "Lesen fehlgeschlagen. Die Datei wurde möglicherweise extern geändert oder gelöscht.",
  "large_file.search_placeholder": "Suchen...",
  "large_file.auto_detect": "🔄 Auto-Erkennung",

  // ===== Suchen und Ersetzen =====
  "editor.find.placeholder": "Suchen",
  "editor.find.replace_placeholder": "Ersetzen",
  "editor.find.show_replace": "Ersetzen anzeigen",
  "editor.find.hide_replace": "Ersetzen ausblenden",
  "editor.find.close": "Schließen (Esc)",
  "editor.find.find_in_selection": "In Auswahl suchen",
  "editor.find.match_case": "Groß-/Kleinschreibung beachten",
  "editor.find.match_whole_word": "Ganzes Wort",
  "editor.find.use_regex": "Regulärer Ausdruck",
  "editor.find.preserve_case": "Groß-/Kleinschreibung beibehalten",
  "editor.find.replace": "Ersetzen",
  "editor.find.replace_all": "Alle ersetzen",
  "editor.find.prev_match": "Vorheriges Vorkommen",
  "editor.find.next_match": "Nächstes Vorkommen",
  "editor.find.no_results": "Keine Ergebnisse",
  "editor.find.match_count": "{current} von {total}",

    
    // ===== macOS-Menü =====
    "menu.file": "Ablage",
    "menu.edit": "Bearbeiten",
    "menu.view": "Darstellung",
    "menu.quit": "FinchPad beenden",
};