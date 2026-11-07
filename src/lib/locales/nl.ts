export const nl: Record<string, string> = {
  // ===== Instellingenmenu =====
  "settings.view": "Beeld",
  "settings.show_line_numbers": "Regelnummers",
  "settings.word_wrap": "Woordafbreking",
  "settings.theme": "Thema",
  "settings.theme.white": "Wit",
  "settings.theme.gray": "Grijs",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Groen",
  "settings.theme.dark": "Donker",
  "settings.language": "Taal",
  "settings.about": "Over FinchPad",
  "settings.check_update": "Controleren op updates",
  "dialog.update_checking": "Controleren op updates...",
  "dialog.update_latest": "Je hebt de nieuwste versie (v{version}).",
  "dialog.update_found": "Nieuwe versie gevonden!\nHuidige: v{current}\nNieuwste: v{latest}\n\nNaar GitHub gaan om te downloaden?",
  "dialog.update_failed": "Kan niet controleren op updates. Controleer je netwerk.",
  "dialog.update_confirm": "Nieuwste release",
  "dialog.update_cancel": "Annuleren",

  // ===== Tabbladbalk =====
  "tab_bar.new_tab": "Nieuw tabblad",
  "tab_bar.settings": "Instellingen",
  "tab_bar.preview": "Voorbeeld",
  "tab_bar.more_tabs": "Meer tabbladen",

  // ===== Contextmenu tabblad =====
  "tab_menu.save": "Opslaan",
  "tab_menu.save_as": "Opslaan als",
  "tab_menu.close": "Tabblad sluiten",
  "tab_menu.close_others": "Andere tabbladen sluiten",
  "tab_menu.close_left": "Tabbladen links sluiten",
  "tab_menu.close_right": "Tabbladen rechts sluiten",
  "tab_menu.close_all": "Alle tabbladen sluiten",
  "tab_menu.reopen": "Gesloten tabblad heropenen",
  "tab_menu.copy_path": "Bestandspad kopiëren",
  "tab_menu.reveal_in_explorer": "Tonen in Verkenner",
  "tab_menu.diff": "Vergelijken",
  "tab_menu.rename": "Naam wijzigen",

  "diff.window_title": "Vergelijken",
  "diff.left_disk": "Schijfversie",
  "diff.right_editor": "Editorversie",
  "diff.keep_mine": "Mijn wijzigingen behouden",
  "diff.use_disk": "Schijfversie gebruiken",

  // ===== Menu lege ruimte tabbladbalk =====
  "bar_menu.new": "Nieuw tabblad",
  "bar_menu.open": "Bestand openen",

  // ===== Naam wijzigen dialoogvenster =====
  "dialog.rename_exists": "Een bestand met deze naam bestaat al.",
  "dialog.rename_failed": "Naam wijzigen mislukt: {error}",

  // ===== Contextmenu editor =====
  "editor_menu.undo": "Ongedaan maken",
  "editor_menu.redo": "Opnieuw uitvoeren",
  "editor_menu.cut": "Knippen",
  "editor_menu.copy": "Kopiëren",
  "editor_menu.paste": "Plakken",
  "editor_menu.delete": "Verwijderen",
  "editor_menu.select_all": "Alles selecteren",

  // ===== Zijbalk =====
  "sidebar.recent": "Recente bestanden",
  "sidebar.directory": "Huidige map",
  "sidebar.file_not_found": "Bestand niet gevonden of verplaatst: {path}",
  "sidebar.empty_recent": "Geen recente bestanden",
  "sidebar.empty_dir": "Lege map",
  "sidebar.up": "Omhoog",
  "sidebar.dir_unreachable": "⚠️ Geen toegang tot de map:\n{path}\n\nMogelijke oorzaken: USB-station losgekoppeld, netwerkschijf niet gekoppeld of mapnaam gewijzigd.",
  "sidebar.record_history": "Geschiedenis opnemen",
  "sidebar.clear_history": "Geschiedenis wissen",
  "sidebar.delete_record": "Record verwijderen",

  // ===== Statusbalk =====
  "status.unsaved": "Niet opgeslagen",
  "status.external_deleted": "⚠ Extern verwijderd",
  "status.external_unreachable": "⚠ Locatie onbereikbaar",
  "status.external_modified": "⚠ Extern gewijzigd",
  "status.line_and_chars": "{lines} regels · {chars} tekens",
  "status.selected_chars": "{chars} tekens geselecteerd",
  "status.selected_lines_and_chars": "{lines} regels · {chars} tekens geselecteerd",
  "status.short_line_numbers": "Regelnr.",
  "status.short_word_wrap": "Afbreking",
  "status.zoom_tooltip": "Zoom",
  "status.scroll_wheel": "Wiel",
  "status.encoding_tooltip": "Codering: {encoding}",
  "status.line_ending_lf": "Unix regeleinde (LF)",
  "status.line_ending_crlf": "Windows regeleinde (CRLF)",
  "status.line_ending_cr": "Macintosh regeleinde (CR)",

  // ===== Sluiten/Opslaan dialoogvensters =====
  "dialog.close_confirm": "Ja",
  "dialog.close_cancel": "Nee",
  "dialog.cancel": "Annuleren",
  "dialog.filter.all_files": "Alle bestanden",
  "dialog.filter.text_files": "Tekstbestanden",
  "dialog.ask_save_unnamed": "Bestand \"{title}\" opslaan?",
  "dialog.ask_save_named": "Wijzigingen in \"{title}\" opslaan?",

  // ===== Conflictoplossing =====
  "dialog.conflict_title": "{path}\nBestand is extern gewijzigd. Kies hoe je verder wilt gaan:",
  "dialog.conflict_overwrite": "Overschrijven",
  "dialog.conflict_discard": "Herladen",
  "dialog.conflict_discard_close": "Verwijderen",
  "dialog.conflict_compare": "Vergelijken",
  "dialog.conflict_save_as": "Opslaan als",
  "dialog.save_as_conflict": "Opslaan mislukt: Het bestand is al geopend in een ander tabblad. Sluit het en probeer het opnieuw.\nPad: {path}",
  "dialog.ok": "OK",
  "dialog.save_failed_title": "⚠️ Opslaan mislukt: Kan niet naar bestand schrijven.",

  // ===== Groot bestand sluiten dialoogvenster =====
  "dialog.large_close": "Bestand \"{title}\" heeft niet-opgeslagen wijzigingen. Deze gaan verloren als je sluit.",
  "dialog.large_close_yes": "Opslaan",
  "dialog.large_close_no": "Niet opslaan",

  // ===== Dialoogvenster codering en regeleinde wijzigen =====
  "dialog.format_type_encoding": "codering",
  "dialog.format_type_line_ending": "regeleinde",
  "dialog.change_format_title": "{typeName} wijzigen in \"{value}\"?",
  "dialog.change_format_subtitle": "Het document kan verliesvrij worden geconverteerd. De bestandsinhoud wordt bijgewerkt na het opslaan.",
  "dialog.change_format_lossy_title": "⚠ Het wijzigen van {typeName} kan leiden tot gegevensverlies",
  "dialog.change_format_lossy_subtitle": "Het document bevat speciale tekens. Na het overschakelen naar \"{value}\" worden deze tekens vervangen door \"?\" en kunnen ze niet worden hersteld.",
  "encoding_group_unicode": "Unicode-extensies",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "West-Europees",
  "encoding_group_central_europe": "Centraal/Oost-Europa",
  "encoding_group_cyrillic": "Cyrillisch",
  "encoding_group_others": "Midden-Oosten & Overig",
  "encoding.recommend": "Aanbevolen",

  // ===== Over =====
  "about.title": "FinchPad",
  "about.version": "Versie {version}",
  "about.line1": "Een moderne, lichtgewicht, multi-tab platte teksteditor.",
  "about.line2": "Met als doel een betere standaard teksteditor te zijn.",
  "about.tech": "Gebouwd met: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Auteur: MaleyGoz",
  "about.license": "Licentie: MIT",
  "about.website": "Website: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Naamloze tabbladen =====
  "tab.unnamed": "Naamloos {index}",
  "tab.unnamed_fallback": "Naamloos",

  // ===== Groot bestand =====
  "large_file.pending_title": "Dit bestand is groot en nog niet geladen",
  "large_file.pending_size": "Bestandsgrootte: {size}",
  "large_file.pending_hint": "Om de hoofdinterface soepel te houden, wordt het geopend in een apart venster voor ultrasnelle alleen-lezen weergave.",
  "large_file.pending_btn": "⚡ Snelle alleen-lezen weergave",
  "large_file.searching": "Bestand scannen...",
  "large_file.no_results": "Geen overeenkomsten gevonden",
  "large_file.search_failed": "Zoeken mislukt, controleer de bestandsstatus.",
  "large_file.search_limit": "Alleen de eerste 100 resultaten worden weergegeven, gebruik nauwkeurigere trefwoorden",
  "large_file.file_not_found": "Het bestand is extern verwijderd of verplaatst en kan niet worden geopend.",
  "large_file.load_failed": "Lezen mislukt. Het bestand is mogelijk extern gewijzigd of verwijderd.",
  "large_file.search_placeholder": "Zoeken...",
  "large_file.auto_detect": "🔄 Automatische detectie",

  // ===== Zoeken en vervangen =====
  "editor.find.placeholder": "Zoeken",
  "editor.find.replace_placeholder": "Vervangen",
  "editor.find.show_replace": "Vervangen tonen",
  "editor.find.hide_replace": "Vervangen verbergen",
  "editor.find.close": "Sluiten (Esc)",
  "editor.find.find_in_selection": "Zoeken in selectie",
  "editor.find.match_case": "Hoofdlettergevoelig",
  "editor.find.match_whole_word": "Heel woord",
  "editor.find.use_regex": "Reguliere expressie",
  "editor.find.preserve_case": "Hoofdletters behouden",
  "editor.find.replace": "Vervangen",
  "editor.find.replace_all": "Alles vervangen",
  "editor.find.prev_match": "Vorige overeenkomst",
  "editor.find.next_match": "Volgende overeenkomst",
  "editor.find.no_results": "Geen resultaten",
  "editor.find.match_count": "{current} van {total}",

    
    // ===== macOS-menu =====
    "menu.file": "Archief",
    "menu.edit": "Wijzig",
    "menu.view": "Weergave",
    "menu.quit": "Stop FinchPad",
};