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
  "locale.auto": "Automatisch",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.zh-TW": "繁體中文",

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

  // ===== Statusbalk =====
  "status.unsaved": "Niet opgeslagen",
  "status.external_deleted": "⚠ Extern verwijderd",
  "status.external_unreachable": "⚠ Locatie onbereikbaar",
  "status.external_modified": "⚠ Extern gewijzigd",
  "status.line_and_chars": "{lines} regels · {chars} tekens",
  "status.selected_chars": "{chars} tekens geselecteerd",
  "status.selected_lines_and_chars": "{lines} regels · {chars} tekens geselecteerd",
  "status.word_wrap_on": "Terugloop: Aan",
  "status.word_wrap_off": "Terugloop: Uit",
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
  "pending.title": "Dit bestand is groot en nog niet geladen",
  "pending.size": "Grootte: {size}",
  "pending.hint": "Na het laden kan de editor kortdurend niet reageren",
  "pending.load": "Nu laden",

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
};