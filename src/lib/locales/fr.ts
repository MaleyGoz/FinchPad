export const fr: Record<string, string> = {
  // ===== Menu des paramètres =====
  "settings.view": "Affichage",
  "settings.show_line_numbers": "Numéros de ligne",
  "settings.word_wrap": "Retour à la ligne",
  "settings.theme": "Thème",
  "settings.theme.white": "Blanc",
  "settings.theme.gray": "Gris",
  "settings.theme.sepia": "Sépia",
  "settings.theme.green": "Vert",
  "settings.theme.dark": "Sombre",
  "settings.language": "Langue",
  "settings.about": "À propos de FinchPad",
  "settings.check_update": "Vérifier les mises à jour",
  "dialog.update_checking": "Vérification des mises à jour...",
  "dialog.update_latest": "Vous êtes sur la dernière version (v{version}).",
  "dialog.update_found": "Nouvelle version trouvée !\nActuelle : v{current}\nDernière : v{latest}\n\nAller sur GitHub pour télécharger ?",
  "dialog.update_failed": "Échec de la vérification des mises à jour. Veuillez vérifier votre réseau.",
  "dialog.update_confirm": "Dernière version",
  "dialog.update_cancel": "Annuler",

  // ===== Barre d'onglets =====
  "tab_bar.new_tab": "Nouvel onglet",
  "tab_bar.settings": "Paramètres",
  "tab_bar.preview": "Aperçu",
  "tab_bar.more_tabs": "Plus d'onglets",

  // ===== Menu contextuel des onglets =====
  "tab_menu.save": "Enregistrer",
  "tab_menu.save_as": "Enregistrer sous",
  "tab_menu.close": "Fermer l'onglet",
  "tab_menu.close_others": "Fermer les autres onglets",
  "tab_menu.close_left": "Fermer les onglets à gauche",
  "tab_menu.close_right": "Fermer les onglets à droite",
  "tab_menu.close_all": "Fermer tous les onglets",
  "tab_menu.reopen": "Rouvrir l'onglet fermé",
  "tab_menu.copy_path": "Copier le chemin",
  "tab_menu.reveal_in_explorer": "Afficher dans l'explorateur",
  "tab_menu.diff": "Comparer",
  "tab_menu.rename": "Renommer",

  "diff.window_title": "Comparer",
  "diff.left_disk": "Version disque",
  "diff.right_editor": "Version éditeur",
  "diff.keep_mine": "Garder mes modifications",
  "diff.use_disk": "Utiliser la version disque",

  // ===== Menu vide de la barre d'onglets =====
  "bar_menu.new": "Nouvel onglet",
  "bar_menu.open": "Ouvrir un fichier",

  // ===== Dialogue de renommage =====
  "dialog.rename_exists": "Un fichier avec ce nom existe déjà.",
  "dialog.rename_failed": "Échec du renommage : {error}",

  // ===== Menu contextuel de l'éditeur =====
  "editor_menu.undo": "Annuler",
  "editor_menu.redo": "Rétablir",
  "editor_menu.cut": "Couper",
  "editor_menu.copy": "Copier",
  "editor_menu.paste": "Coller",
  "editor_menu.delete": "Supprimer",
  "editor_menu.select_all": "Tout sélectionner",

  // ===== Barre latérale =====
  "sidebar.recent": "Fichiers récents",
  "sidebar.directory": "Répertoire actuel",
  "sidebar.file_not_found": "Fichier introuvable ou déplacé : {path}",
  "sidebar.empty_recent": "Aucun fichier récent",
  "sidebar.empty_dir": "Dossier vide",
  "sidebar.up": "Remonter",
  "sidebar.dir_unreachable": "⚠️ Impossible d'accéder au répertoire :\n{path}\n\nCauses possibles : clé USB débranchée, lecteur réseau non monté ou dossier renommé.",
  "sidebar.record_history": "Historique",
  "sidebar.clear_history": "Effacer l'historique",
  "sidebar.delete_record": "Supprimer l'entrée",

  // ===== Barre d'état =====
  "status.unsaved": "Non enregistré",
  "status.external_deleted": "⚠ Supprimé en externe",
  "status.external_unreachable": "⚠ Emplacement inaccessible",
  "status.external_modified": "⚠ Modifié en externe",
  "status.line_and_chars": "{lines} lignes · {chars} car.",
  "status.selected_chars": "{chars} car. sélectionnés",
  "status.selected_lines_and_chars": "{lines} lignes · {chars} car. sélectionnés",
  "status.short_line_numbers": "N° de ligne",
  "status.short_word_wrap": "Retour",
  "status.zoom_tooltip": "Zoom",
  "status.scroll_wheel": "Molette",
  "status.encoding_tooltip": "Encodage : {encoding}",
  "status.line_ending_lf": "Fin de ligne Unix (LF)",
  "status.line_ending_crlf": "Fin de ligne Windows (CRLF)",
  "status.line_ending_cr": "Fin de ligne Macintosh (CR)",

  // ===== Dialogues Fermer/Enregistrer =====
  "dialog.close_confirm": "Oui",
  "dialog.close_cancel": "Non",
  "dialog.cancel": "Annuler",
  "dialog.filter.all_files": "Tous les fichiers",
  "dialog.filter.text_files": "Fichiers texte",
  "dialog.ask_save_unnamed": "Enregistrer le fichier \"{title}\" ?",
  "dialog.ask_save_named": "Enregistrer les modifications de \"{title}\" ?",

  // ===== Résolution de conflit =====
  "dialog.conflict_title": "{path}\nLe fichier a été modifié en externe. Choisissez comment procéder :",
  "dialog.conflict_overwrite": "Écraser",
  "dialog.conflict_discard": "Recharger",
  "dialog.conflict_discard_close": "Abandonner",
  "dialog.conflict_compare": "Comparer",
  "dialog.conflict_save_as": "Enregistrer sous",
  "dialog.save_as_conflict": "Échec de l'enregistrement : le fichier est déjà ouvert dans un autre onglet. Veuillez le fermer et réessayer.\nChemin : {path}",
  "dialog.ok": "OK",
  "dialog.save_failed_title": "⚠️ Échec de l'enregistrement : Impossible d'écrire dans le fichier.",

  // ===== Grand fichier fermer dialogue =====
  "dialog.large_close": "Le fichier \"{title}\" contient des modifications non enregistrées. Elles seront perdues si vous fermez.",
  "dialog.large_close_yes": "Enregistrer",
  "dialog.large_close_no": "Ne pas enregistrer",

  // ===== Dialogue de modification d'encodage et de fin de ligne =====
  "dialog.format_type_encoding": "encodage",
  "dialog.format_type_line_ending": "fin de ligne",
  "dialog.change_format_title": "Changer {typeName} en \"{value}\" ?",
  "dialog.change_format_subtitle": "Le document peut être converti sans perte. Le contenu du fichier sera mis à jour après l'enregistrement.",
  "dialog.change_format_lossy_title": "⚠ Le changement de {typeName} peut entraîner une perte de caractères",
  "dialog.change_format_lossy_subtitle": "Le document contient des caractères spéciaux. Après le passage à \"{value}\", ces caractères seront remplacés par \"?\" et ne pourront pas être récupérés.",
  "encoding_group_unicode": "Extensions Unicode",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Europe de l'Ouest",
  "encoding_group_central_europe": "Europe centrale/orientale",
  "encoding_group_cyrillic": "Cyrillique",
  "encoding_group_others": "Moyen-Orient et autres",
  "encoding.recommend": "Recommandé",

  // ===== À propos =====
  "about.title": "FinchPad",
  "about.version": "Version {version}",
  "about.line1": "Un éditeur de texte brut moderne, léger et multi-onglets.",
  "about.line2": "Visant à être un meilleur éditeur de texte par défaut.",
  "about.tech": "Développé avec : Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Auteur : MaleyGoz",
  "about.license": "Licence : MIT",
  "about.website": "Site Web : https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Onglets sans titre =====
  "tab.unnamed": "Sans titre {index}",
  "tab.unnamed_fallback": "Sans titre",

  // ===== Grand fichier =====
  "large_file.pending_title": "Ce fichier est volumineux et n'est pas encore chargé",
  "large_file.pending_size": "Taille : {size}",
  "large_file.pending_hint": "Pour garder l'interface fluide, il s'ouvrira dans une fenêtre séparée pour un rendu en lecture seule ultra-rapide.",
  "large_file.pending_btn": "⚡ Aperçu rapide en lecture seule",
  "large_file.searching": "Analyse du fichier...",
  "large_file.no_results": "Aucun résultat trouvé",
  "large_file.search_failed": "Échec de la recherche, veuillez vérifier l'état du fichier.",
  "large_file.search_limit": "Affichage des 100 premiers résultats uniquement, veuillez utiliser des mots-clés plus précis",
  "large_file.file_not_found": "Le fichier a été supprimé ou déplacé en externe et ne peut pas être ouvert.",
  "large_file.load_failed": "Échec de la lecture. Le fichier a peut-être été modifié ou supprimé en externe.",
  "large_file.search_placeholder": "Rechercher...",
  "large_file.auto_detect": "🔄 Détection auto",

  // ===== Rechercher et remplacer =====
  "editor.find.placeholder": "Rechercher",
  "editor.find.replace_placeholder": "Remplacer",
  "editor.find.show_replace": "Afficher remplacer",
  "editor.find.hide_replace": "Masquer remplacer",
  "editor.find.close": "Fermer (Échap)",
  "editor.find.find_in_selection": "Chercher dans la sélection",
  "editor.find.match_case": "Respecter la casse",
  "editor.find.match_whole_word": "Mot entier",
  "editor.find.use_regex": "Expression régulière",
  "editor.find.preserve_case": "Préserver la casse",
  "editor.find.replace": "Remplacer",
  "editor.find.replace_all": "Tout remplacer",
  "editor.find.prev_match": "Correspondance précédente",
  "editor.find.next_match": "Correspondance suivante",
  "editor.find.no_results": "Aucun résultat",
  "editor.find.match_count": "{current} sur {total}",

    
    // ===== Menu macOS =====
    "menu.file": "Fichier",
    "menu.edit": "Édition",
    "menu.view": "Présentation",
    "menu.quit": "Quitter FinchPad",
};