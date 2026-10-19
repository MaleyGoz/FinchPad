export const fr: Record<string, string> = {
  // ===== Menu Paramètres =====
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
  "dialog.update_checking": "Recherche de mises à jour...",
  "dialog.update_latest": "Vous êtes à jour (v{version}).",
  "dialog.update_found":
    "Nouvelle version disponible !\nActuelle : v{current}\nDernière : v{latest}\n\nAller sur GitHub pour télécharger ?",
  "dialog.update_failed": "Échec de la vérification des mises à jour. Vérifiez votre réseau.",
  "dialog.update_confirm": "Télécharger",
  "dialog.update_cancel": "Annuler",

  // ===== Options de Langue =====
  "locale.auto": "Auto",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.fr": "Français",

  // ===== Menu Contextuel d'Onglet =====
  "tab_menu.save": "Enregistrer",
  "tab_menu.save_as": "Enregistrer sous",
  "tab_menu.close": "Fermer l'onglet",
  "tab_menu.close_others": "Fermer les autres onglets",
  "tab_menu.close_left": "Fermer les onglets à gauche",
  "tab_menu.close_right": "Fermer les onglets à droite",
  "tab_menu.copy_path": "Copier le chemin du fichier",
  "tab_menu.reveal_in_explorer": "Ouvrir dans l'explorateur",
  "tab_menu.diff": "Comparer",
  "tab_menu.rename": "Renommer",

  "diff.window_title": "Comparer",
  "diff.left_disk": "Disque",
  "diff.right_editor": "Éditeur",
  "diff.keep_mine": "Garder ma version",
  "diff.use_disk": "Utiliser la version disque",

  // ===== Menu Zone Vide de la Barre =====
  "bar_menu.new": "Nouvel onglet",
  "bar_menu.open": "Ouvrir un fichier",

  // ===== Dialogue de Renommage =====
  "dialog.rename_exists": "Un fichier portant ce nom existe déjà dans ce dossier.",
  "dialog.rename_failed": "Échec du renommage : {error}",

  // ===== Menu Contextuel de l'Éditeur =====
  "editor_menu.undo": "Annuler",
  "editor_menu.redo": "Rétablir",
  "editor_menu.cut": "Couper",
  "editor_menu.copy": "Copier",
  "editor_menu.paste": "Coller",
  "editor_menu.delete": "Supprimer",
  "editor_menu.select_all": "Tout sélectionner",

  // ===== Barre d'État =====
  "status.unsaved": "Non enregistré",
  "status.external_deleted": "⚠ Supprimé de l'extérieur",
  "status.external_unreachable": "⚠ Emplacement inaccessible",
  "status.external_modified": "⚠ Modifié de l'extérieur",
  "status.line_and_chars": "{lines} lignes · {chars} caractères",
  "status.selected_chars": "{chars} caractères sélectionnés",
  "status.selected_lines_and_chars": "{lines} lignes · {chars} caractères sélectionnés",
  "status.word_wrap_on": "Retour : Activé",
  "status.word_wrap_off": "Retour : Désactivé",
  "status.encoding_tooltip": "Encodage : {encoding}",
  "status.line_ending_lf": "Saut de ligne Unix (LF)",
  "status.line_ending_crlf": "Saut de ligne Windows (CRLF)",
  "status.line_ending_cr": "Saut de ligne Macintosh (CR)",

  // ===== Dialogues Fermeture/Enregistrement =====
  "dialog.close_confirm": "Oui",
  "dialog.close_cancel": "Non",
  "dialog.cancel": "Annuler",
  "dialog.filter.all_files": "Tous les fichiers",
  "dialog.filter.text_files": "Fichiers texte",

  "dialog.ask_save_unnamed": 'Enregistrer le fichier « {title} » ?',
  "dialog.ask_save_named": 'Enregistrer les modifications de « {title} » ?',

  // ===== Résolution de Conflits =====
  "dialog.conflict_title": "{path}\nLe fichier a été modifié de l'extérieur. Choisissez comment procéder :",
  "dialog.conflict_overwrite": "Écraser",
  "dialog.conflict_discard": "Recharger",
  "dialog.conflict_discard_close": "Ignorer",
  "dialog.conflict_compare": "Comparer",
  "dialog.conflict_save_as": "Enregistrer sous",
  "dialog.save_as_conflict":
    "Échec de l'enregistrement : Le fichier est déjà ouvert dans un autre onglet. Veuillez le fermer et réessayer.\nChemin : {path}",
  "dialog.ok": "OK",

  // ===== Dialogue de Fermeture Gros Fichier =====
  "dialog.large_close": 'Le fichier « {title} » contient des modifications non sauvegardées. Elles seront perdues si vous fermez.',
  "dialog.large_close_yes": "Enregistrer",
  "dialog.large_close_no": "Ne pas enregistrer",

  // ===== Placeholder Gros Fichier =====
  "pending.title": "Fichier volumineux, pas encore chargé",
  "pending.size": "Taille : {size}",
  "pending.hint": "L'éditeur peut être brièvement indisponible après le chargement",
  "pending.load": "Charger maintenant",

  // ===== Dialogue À Propos =====
  "about.title": "FinchPad",
  "about.version": "Version {version}",
  "about.line1": "Un éditeur de texte brut moderne, léger et multi-onglets.",
  "about.line2": "Vise à devenir un meilleur éditeur de texte par défaut.",
  "about.tech": "Construit avec : Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Auteur : MaleyGoz",
  "about.license": "Licence : MIT",
  "about.website": "Site Web : https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Onglets Sans Titre =====
  "tab.unnamed": "Sans titre {index}",
  "tab.unnamed_fallback": "Sans titre",
};