export const nlNL: Record<string, string> = {
  // ===== Instellingenmenu =====
  "settings.view": "Weergave",
  "settings.show_line_numbers": "Regelnummers tonen",
  "settings.word_wrap": "Tekstterugloop",
  "settings.theme": "Thema",
  "settings.theme.white": "Wit",
  "settings.theme.gray": "Grijs",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Groen",
  "settings.theme.dark": "Donker",
  "settings.language": "Taal",
  "settings.about": "Over FinchPad",
  "settings.check_update": "Controleren op updates",
  "dialog.update_checking": "Bezig met controleren op updates...",
  "dialog.update_latest": "U gebruikt al de nieuwste versie (v{version}).",
  "dialog.update_found":
    "Nieuwe versie gevonden!\nHuidig: v{current}\nNieuwste: v{latest}\n\nNaar GitHub om te downloaden?",
  "dialog.update_failed": "Controleren op updates mislukt. Controleer uw netwerkverbinding.",
  "dialog.update_confirm": "Downloaden",
  "dialog.update_cancel": "Annuleren",

  // ===== Taalopties =====

  // ===== Tabblad-contextmenu =====
  "tab_menu.save": "Opslaan",
  "tab_menu.save_as": "Opslaan als",
  "tab_menu.close": "Tabblad sluiten",
  "tab_menu.close_others": "Andere tabbladen sluiten",
  "tab_menu.close_left": "Tabbladen links sluiten",
  "tab_menu.close_right": "Tabbladen rechts sluiten",
  "tab_menu.copy_path": "Bestandspad kopiëren",
  "tab_menu.reveal_in_explorer": "Weergeven in Verkenner",
  "tab_menu.diff": "Vergelijken",
  "tab_menu.rename": "Hernoemen",

  "diff.window_title": "Vergelijken",
  "diff.left_disk": "Disk",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Mijn wijzigingen behouden",
  "diff.use_disk": "Diskversie gebruiken",

  // ===== Leeg gebied tabbladbalk menu =====
  "bar_menu.new": "Nieuw tabblad",
  "bar_menu.open": "Bestand openen",

  // ===== Hernoemdialoog =====
  "dialog.rename_exists": "Er bestaat al een bestand met deze naam in de map.",
  "dialog.rename_failed": "Hernoemen mislukt: {error}",

  // ===== Editor-contextmenu =====
  "editor_menu.undo": "Ongedaan maken",
  "editor_menu.redo": "Opnieuw uitvoeren",
  "editor_menu.cut": "Knippen",
  "editor_menu.copy": "Kopiëren",
  "editor_menu.paste": "Plakken",
  "editor_menu.delete": "Verwijderen",
  "editor_menu.select_all": "Alles selecteren",

  // ===== SideBar =====
  "sidebar.empty_recent": "Geen recente bestanden",
  "sidebar.empty_dir": "Lege map",
  "sidebar.up": "Omhoog",
  "sidebar.dir_unreachable": "⚠️ Kan geen toegang krijgen tot de map:\n{path}\n\nMogelijke oorzaken: USB-station losgekoppeld, netwerkschijf niet gekoppeld of map hernoemd.",

  "sidebar.recent": "Recente bestanden",
  "sidebar.directory": "Huidige map",
  "sidebar.file_not_found": "Bestand niet gevonden of verplaatst: {path}",

  // ===== Statusbalk =====
  "status.unsaved": "Niet opgeslagen",
  "status.external_deleted": "⚠ Extern verwijderd",
  "status.external_unreachable": "⚠ Locatie onbereikbaar",
  "status.external_modified": "⚠ Extern gewijzigd",
  "status.line_and_chars": "{lines} regels · {chars} tekens",
  "status.selected_chars": "{chars} tekens geselecteerd",
  "status.selected_lines_and_chars": "{lines} regels · {chars} tekens geselecteerd",
  "status.short_line_numbers": "Regels",
  "status.short_word_wrap": "Terugloop",
  "status.encoding_tooltip": "Codering: {encoding}",
  "status.line_ending_lf": "Unix regeleinde (LF)",
  "status.line_ending_crlf": "Windows regeleinde (CRLF)",
  "status.line_ending_cr": "Macintosh regeleinde (CR)",

  // ===== Sluiten/Opslaan-dialogen =====
  "dialog.close_confirm": "Ja",
  "dialog.close_cancel": "Nee",
  "dialog.cancel": "Annuleren",
  "dialog.filter.all_files": "Alle bestanden",
  "dialog.filter.text_files": "Tekstbestanden",

  "dialog.ask_save_unnamed": 'Bestand "{title}" opslaan?',
  "dialog.ask_save_named": 'Wijzigingen aan "{title}" opslaan?',

  // ===== Conflictoplossing =====
  "dialog.conflict_title":
    "{path}\nBestand is extern gewijzigd. Kies een actie:",
  "dialog.conflict_overwrite": "Overschrijven",
  "dialog.conflict_discard": "Opnieuw laden",
  "dialog.conflict_discard_close": "Wijzigingen negeren",
  "dialog.conflict_compare": "Vergelijken",
  "dialog.conflict_save_as": "Opslaan als",
  "dialog.save_as_conflict":
    "Opslaan mislukt: Het bestand is al geopend in een ander tabblad. Sluit dat tabblad en probeer opnieuw.\nPad: {path}",
  "dialog.ok": "OK",

  // ===== Groot bestand sluitdialoog =====
  "dialog.large_close":
    'Bestand "{title}" heeft niet-opgeslagen wijzigingen. Deze gaan verloren als u sluit.',
  "dialog.large_close_yes": "Opslaan",
  "dialog.large_close_no": "Niet opslaan",

  // ===== Groot bestand tijdelijke tekst =====

  // ===== Over-dialoog =====
  "about.title": "FinchPad",
  "about.version": "Versie {version}",
  "about.line1": "Een moderne, lichtgewicht, multi-tab platte-teksteditor.",
  "about.line2": "Ontworpen om een betere standaardteksteditor te zijn.",
  "about.tech": "Gebouwd met: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Auteur: MaleyGoz",
  "about.license": "Licentie: MIT",
  "about.website": "Website: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Naamloze tabbladen =====
  "tab.unnamed": "Naamloos {index}",
  "tab.unnamed_fallback": "Naamloos",

  "large_file.searching": "Bestand scannen...",
  "large_file.search_limit": "Alleen de eerste 100 resultaten worden weergegeven, gebruik specifiekere zoekwoorden",
  "sidebar.record_history": "Geschiedenis opnemen",
  "large_file.search_placeholder": "Zoeken...",
  "large_file.auto_detect": "🔄 Automatische detectie",
  "large_file.search_failed": "Zoeken mislukt, controleer de bestandsstatus.",
  "large_file.pending_size": "Bestandsgrootte: {size}",
  "large_file.pending_btn": "⚡ Snelle alleen-lezen weergave",
  "large_file.no_results": "Geen overeenkomsten gevonden",
  "large_file.pending_hint": "Om de hoofdinterface soepel te houden, wordt het geopend in een apart venster voor ultrasnelle alleen-lezen weergave.",
  "large_file.pending_title": "Dit bestand is groot en nog niet geladen",
  "large_file.load_failed": "Lezen mislukt. Het bestand is mogelijk extern gewijzigd of verwijderd.",
  "large_file.file_not_found": "Het bestand is extern verwijderd of verplaatst en kan niet worden geopend.",
  "sidebar.delete_record": "Record verwijderen",
  "sidebar.clear_history": "Geschiedenis wissen",
};