export const it: Record<string, string> = {
  // ===== Menu delle impostazioni =====
  "settings.view": "Visualizza",
  "settings.show_line_numbers": "Numeri di riga",
  "settings.word_wrap": "A capo automatico",
  "settings.theme": "Tema",
  "settings.theme.white": "Bianco",
  "settings.theme.gray": "Grigio",
  "settings.theme.sepia": "Seppia",
  "settings.theme.green": "Verde",
  "settings.theme.dark": "Scuro",
  "settings.language": "Lingua",
  "settings.about": "Informazioni su FinchPad",
  "settings.check_update": "Controlla aggiornamenti",
  "dialog.update_checking": "Controllo aggiornamenti...",
  "dialog.update_latest": "Stai utilizzando l'ultima versione (v{version}).",
  "dialog.update_found": "Nuova versione trovata!\nAttuale: v{current}\nUltima: v{latest}\n\nAndare su GitHub per scaricare?",
  "dialog.update_failed": "Impossibile controllare gli aggiornamenti. Si prega di controllare la rete.",
  "dialog.update_confirm": "Ultima versione",
  "dialog.update_cancel": "Annulla",

  // ===== Barra delle schede =====
  "tab_bar.new_tab": "Nuova scheda",
  "tab_bar.settings": "Impostazioni",
  "tab_bar.preview": "Anteprima",
  "tab_bar.more_tabs": "Altre schede",

  // ===== Menu contestuale delle schede =====
  "tab_menu.save": "Salva",
  "tab_menu.save_as": "Salva con nome",
  "tab_menu.close": "Chiudi scheda",
  "tab_menu.close_others": "Chiudi altre schede",
  "tab_menu.close_left": "Chiudi schede a sinistra",
  "tab_menu.close_right": "Chiudi schede a destra",
  "tab_menu.close_all": "Chiudi tutte le schede",
  "tab_menu.reopen": "Riapri scheda chiusa",
  "tab_menu.copy_path": "Copia percorso file",
  "tab_menu.reveal_in_explorer": "Mostra in Esplora file",
  "tab_menu.diff": "Confronta",
  "tab_menu.rename": "Rinomina",

  "diff.window_title": "Confronta",
  "diff.left_disk": "Versione su disco",
  "diff.right_editor": "Versione nell'editor",
  "diff.keep_mine": "Mantieni le mie modifiche",
  "diff.use_disk": "Usa versione su disco",

  // ===== Menu area vuota barra schede =====
  "bar_menu.new": "Nuova scheda",
  "bar_menu.open": "Apri file",

  // ===== Finestra di rinomina =====
  "dialog.rename_exists": "Un file con questo nome esiste già.",
  "dialog.rename_failed": "Rinomina fallita: {error}",

  // ===== Menu contestuale dell'editor =====
  "editor_menu.undo": "Annulla",
  "editor_menu.redo": "Ripeti",
  "editor_menu.cut": "Taglia",
  "editor_menu.copy": "Copia",
  "editor_menu.paste": "Incolla",
  "editor_menu.delete": "Elimina",
  "editor_menu.select_all": "Seleziona tutto",

  // ===== Barra laterale =====
  "sidebar.recent": "File recenti",
  "sidebar.directory": "Directory corrente",
  "sidebar.file_not_found": "File non trovato o spostato: {path}",
  "sidebar.empty_recent": "Nessun file recente",
  "sidebar.empty_dir": "Cartella vuota",
  "sidebar.up": "Su",
  "sidebar.dir_unreachable": "⚠️ Impossibile accedere alla directory:\n{path}\n\nPossibili cause: unità USB scollegata, unità di rete non montata o cartella rinominata.",
  "sidebar.record_history": "Registra cronologia",
  "sidebar.clear_history": "Cancella cronologia",
  "sidebar.delete_record": "Elimina record",

  // ===== Barra di stato =====
  "status.unsaved": "Non salvato",
  "status.external_deleted": "⚠ Eliminato esternamente",
  "status.external_unreachable": "⚠ Posizione irraggiungibile",
  "status.external_modified": "⚠ Modificato esternamente",
  "status.line_and_chars": "{lines} righe · {chars} car.",
  "status.selected_chars": "{chars} car. selezionati",
  "status.selected_lines_and_chars": "{lines} righe · {chars} car. selezionati",
  "status.short_line_numbers": "Numeri riga",
  "status.short_word_wrap": "A capo",
  "status.zoom_tooltip": "Zoom",
  "status.scroll_wheel": "Rotella",
  "status.encoding_tooltip": "Codifica: {encoding}",
  "status.line_ending_lf": "Fine riga Unix (LF)",
  "status.line_ending_crlf": "Fine riga Windows (CRLF)",
  "status.line_ending_cr": "Fine riga Macintosh (CR)",

  // ===== Finestre di chiusura/salvataggio =====
  "dialog.close_confirm": "Sì",
  "dialog.close_cancel": "No",
  "dialog.cancel": "Annulla",
  "dialog.filter.all_files": "Tutti i file",
  "dialog.filter.text_files": "File di testo",
  "dialog.ask_save_unnamed": "Salvare il file \"{title}\"?",
  "dialog.ask_save_named": "Salvare le modifiche a \"{title}\"?",

  // ===== Risoluzione dei conflitti =====
  "dialog.conflict_title": "{path}\nIl file è stato modificato esternamente. Scegli come procedere:",
  "dialog.conflict_overwrite": "Sovrascrivi",
  "dialog.conflict_discard": "Ricarica",
  "dialog.conflict_discard_close": "Scarta",
  "dialog.conflict_compare": "Confronta",
  "dialog.conflict_save_as": "Salva con nome",
  "dialog.save_as_conflict": "Salvataggio fallito: Il file è già aperto in un'altra scheda. Chiudilo e riprova.\nPercorso: {path}",
  "dialog.ok": "OK",
  "dialog.save_failed_title": "⚠️ Salvataggio non riuscito: Impossibile scrivere nel file.",

  // ===== Finestra chiudi file grande =====
  "dialog.large_close": "Il file \"{title}\" presenta modifiche non salvate. Andranno perse se chiudi.",
  "dialog.large_close_yes": "Salva",
  "dialog.large_close_no": "Non salvare",

  // ===== Finestra modifica codifica e fine riga =====
  "dialog.format_type_encoding": "codifica",
  "dialog.format_type_line_ending": "fine riga",
  "dialog.change_format_title": "Cambiare {typeName} in \"{value}\"?",
  "dialog.change_format_subtitle": "Il documento può essere convertito senza perdite. Il contenuto del file verrà aggiornato dopo il salvataggio.",
  "dialog.change_format_lossy_title": "⚠ Cambiare {typeName} può causare la perdita di caratteri",
  "dialog.change_format_lossy_subtitle": "Il documento contiene caratteri speciali. Dopo il passaggio a \"{value}\", questi caratteri verranno sostituiti con \"?\" e non potranno essere recuperati.",
  "encoding_group_unicode": "Estensioni Unicode",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Europa Occidentale",
  "encoding_group_central_europe": "Europa Centrale/Orientale",
  "encoding_group_cyrillic": "Cirillico",
  "encoding_group_others": "Medio Oriente e altri",
  "encoding.recommend": "Consigliato",

  // ===== Informazioni =====
  "about.title": "FinchPad",
  "about.version": "Versione {version}",
  "about.line1": "Un editor di testo semplice moderno, leggero e a più schede.",
  "about.line2": "Mirando a essere un editor di testo predefinito migliore.",
  "about.tech": "Costruito con: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autore: MaleyGoz",
  "about.license": "Licenza: MIT",
  "about.website": "Sito web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Schede senza titolo =====
  "tab.unnamed": "Senza titolo {index}",
  "tab.unnamed_fallback": "Senza titolo",

  // ===== File di grandi dimensioni =====
  "large_file.pending_title": "Questo file è grande e non è ancora stato caricato",
  "large_file.pending_size": "Dimensione file: {size}",
  "large_file.pending_hint": "Per mantenere fluida l'interfaccia, verrà aperto in una finestra separata per un rendering di sola lettura ultra-rapido.",
  "large_file.pending_btn": "⚡ Visualizzazione rapida in sola lettura",
  "large_file.searching": "Scansione del file...",
  "large_file.no_results": "Nessuna corrispondenza trovata",
  "large_file.search_failed": "Ricerca fallita, controlla lo stato del file.",
  "large_file.search_limit": "Visualizzazione dei primi 100 risultati, utilizza parole chiave più precise",
  "large_file.file_not_found": "Il file è stato eliminato o spostato esternamente e non può essere aperto.",
  "large_file.load_failed": "Lettura fallita. Il file potrebbe essere stato modificato o eliminato esternamente.",
  "large_file.search_placeholder": "Cerca...",
  "large_file.auto_detect": "🔄 Rilevamento automatico",

  // ===== Trova e sostituisci =====
  "editor.find.placeholder": "Trova",
  "editor.find.replace_placeholder": "Sostituisci",
  "editor.find.show_replace": "Mostra sostituisci",
  "editor.find.hide_replace": "Nascondi sostituisci",
  "editor.find.close": "Chiudi (Esc)",
  "editor.find.find_in_selection": "Trova nella selezione",
  "editor.find.match_case": "Maiuscole/minuscole",
  "editor.find.match_whole_word": "Parola intera",
  "editor.find.use_regex": "Espressione regolare",
  "editor.find.preserve_case": "Mantieni maiuscole/minuscole",
  "editor.find.replace": "Sostituisci",
  "editor.find.replace_all": "Sostituisci tutto",
  "editor.find.prev_match": "Corrispondenza precedente",
  "editor.find.next_match": "Corrispondenza successiva",
  "editor.find.no_results": "Nessun risultato",
  "editor.find.match_count": "{current} di {total}",

    
    // ===== Menu macOS =====
    "menu.file": "File",
    "menu.edit": "Modifica",
    "menu.view": "Vista",
    "menu.quit": "Esci da FinchPad",
};