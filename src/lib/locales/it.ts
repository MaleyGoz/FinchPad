export const it: Record<string, string> = {
  // ===== Menu Impostazioni =====
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
  "settings.check_update": "Verifica aggiornamenti",
  "dialog.update_checking": "Controllo aggiornamenti in corso...",
  "dialog.update_latest": "Sei all'ultima versione (v{version}).",
  "dialog.update_found":
    "Nuova versione trovata!\nCorrente: v{current}\nUltima: v{latest}\n\nAndare su GitHub per scaricare?",
  "dialog.update_failed": "Impossibile verificare gli aggiornamenti. Controlla la rete.",
  "dialog.update_confirm": "Scarica",
  "dialog.update_cancel": "Annulla",

  // ===== Opzioni Lingua =====
  "locale.auto": "Auto",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.it": "Italiano",

  // ===== Menu Contestuale Scheda =====
  "tab_menu.save": "Salva",
  "tab_menu.save_as": "Salva con nome",
  "tab_menu.close": "Chiudi scheda",
  "tab_menu.close_others": "Chiudi altre schede",
  "tab_menu.close_left": "Chiudi schede a sinistra",
  "tab_menu.close_right": "Chiudi schede a destra",
  "tab_menu.copy_path": "Copia percorso file",
  "tab_menu.reveal_in_explorer": "Mostra in Esplora risorse",
  "tab_menu.diff": "Confronta",
  "tab_menu.rename": "Rinomina",

  "diff.window_title": "Confronto",
  "diff.left_disk": "Disco",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Mantieni il mio",
  "diff.use_disk": "Usa versione su disco",

  // ===== Menu Area Vuota Barra Schede =====
  "bar_menu.new": "Nuova scheda",
  "bar_menu.open": "Apri file",

  // ===== Finestra di Rinomina =====
  "dialog.rename_exists": "Esiste già un file con questo nome nella directory.",
  "dialog.rename_failed": "Rinomina fallita: {error}",

  // ===== Menu Contestuale Editor =====
  "editor_menu.undo": "Annulla",
  "editor_menu.redo": "Ripristina",
  "editor_menu.cut": "Taglia",
  "editor_menu.copy": "Copia",
  "editor_menu.paste": "Incolla",
  "editor_menu.delete": "Elimina",
  "editor_menu.select_all": "Seleziona tutto",

  // ===== SideBar =====
  "sidebar.empty_recent": "Nessun file recente",
  "sidebar.empty_dir": "Cartella vuota",
  "sidebar.up": "Cartella superiore",
  "sidebar.dir_unreachable": "⚠️ Impossibile accedere alla directory:\n{path}\n\nPossibili cause: unità USB scollegata, unità di rete non montata o cartella rinominata.",

  "sidebar.recent": "File recenti",
  "sidebar.directory": "Directory corrente",
  "sidebar.file_not_found": "File non trovato o spostato: {path}",

  // ===== Barra di Stato =====
  "status.unsaved": "Non salvato",
  "status.external_deleted": "⚠ Eliminato esternamente",
  "status.external_unreachable": "⚠ Posizione non raggiungibile",
  "status.external_modified": "⚠ Modificato esternamente",
  "status.line_and_chars": "{lines} righe · {chars} caratteri",
  "status.selected_chars": "{chars} caratteri selezionati",
  "status.selected_lines_and_chars": "{lines} righe · {chars} caratteri selezionati",
  "status.short_line_numbers": "Righe",
  "status.short_word_wrap": "A capo",
  "status.encoding_tooltip": "Codifica: {encoding}",
  "status.line_ending_lf": "Termine riga Unix (LF)",
  "status.line_ending_crlf": "Termine riga Windows (CRLF)",
  "status.line_ending_cr": "Termine riga Macintosh (CR)",

  // ===== Finestre di Chiusura/Salvataggio =====
  "dialog.close_confirm": "Sì",
  "dialog.close_cancel": "No",
  "dialog.cancel": "Annulla",
  "dialog.filter.all_files": "Tutti i file",
  "dialog.filter.text_files": "File di testo",

  "dialog.ask_save_unnamed": 'Salvare il file "{title}"?',
  "dialog.ask_save_named": 'Salvare le modifiche a "{title}"?',

  // ===== Risoluzione Conflitti =====
  "dialog.conflict_title": "{path}\nIl file è stato modificato esternamente. Scegli come procedere:",
  "dialog.conflict_overwrite": "Sovrascrivi",
  "dialog.conflict_discard": "Ricarica",
  "dialog.conflict_discard_close": "Ignora",
  "dialog.conflict_compare": "Confronta",
  "dialog.conflict_save_as": "Salva con nome",
  "dialog.save_as_conflict":
    "Salvataggio fallito: Il file è già aperto in un'altra scheda. Chiudila e riprova.\nPercorso: {path}",
  "dialog.ok": "OK",

  // ===== Finestra Chiusura File Grande =====
  "dialog.large_close": 'Il file "{title}" ha modifiche non salvate. Andranno perse se chiudi.',
  "dialog.large_close_yes": "Salva",
  "dialog.large_close_no": "Non salvare",

  // ===== Placeholder File Grande =====
  "pending.title": "File grande, non ancora caricato",
  "pending.size": "Dimensione: {size}",
  "pending.hint": "L'editor potrebbe non rispondere brevemente dopo il caricamento",
  "pending.load": "Carica ora",

  // ===== Finestra Informazioni =====
  "about.title": "FinchPad",
  "about.version": "Versione {version}",
  "about.line1": "Un editor di testo semplice, moderno, leggero e multi-scheda.",
  "about.line2": "Miriamo a essere un editor di testo predefinito migliore.",
  "about.tech": "Realizzato con: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autore: MaleyGoz",
  "about.license": "Licenza: MIT",
  "about.website": "Sito web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Schede Senza Titolo =====
  "tab.unnamed": "Senza titolo {index}",
  "tab.unnamed_fallback": "Senza titolo",
};