export const es: Record<string, string> = {
  // ===== Menú de configuración =====
  "settings.view": "Ver",
  "settings.show_line_numbers": "Números de línea",
  "settings.word_wrap": "Ajuste de línea",
  "settings.theme": "Tema",
  "settings.theme.white": "Blanco",
  "settings.theme.gray": "Gris",
  "settings.theme.sepia": "Sepia",
  "settings.theme.green": "Verde",
  "settings.theme.dark": "Oscuro",
  "settings.language": "Idioma",
  "settings.about": "Acerca de FinchPad",
  "settings.check_update": "Buscar actualizaciones",
  "dialog.update_checking": "Buscando actualizaciones...",
  "dialog.update_latest": "Estás en la última versión (v{version}).",
  "dialog.update_found": "¡Nueva versión encontrada!\nActual: v{current}\nÚltima: v{latest}\n\n¿Ir a GitHub para descargar?",
  "dialog.update_failed": "Error al buscar actualizaciones. Por favor, comprueba tu red.",
  "dialog.update_confirm": "Última versión",
  "dialog.update_cancel": "Cancelar",

  // ===== Barra de pestañas =====
  "tab_bar.new_tab": "Nueva pestaña",
  "tab_bar.settings": "Ajustes",
  "tab_bar.preview": "Vista previa",
  "tab_bar.more_tabs": "Más pestañas",

  // ===== Menú contextual de pestañas =====
  "tab_menu.save": "Guardar",
  "tab_menu.save_as": "Guardar como",
  "tab_menu.close": "Cerrar pestaña",
  "tab_menu.close_others": "Cerrar otras pestañas",
  "tab_menu.close_left": "Cerrar pestañas a la izquierda",
  "tab_menu.close_right": "Cerrar pestañas a la derecha",
  "tab_menu.close_all": "Cerrar todas las pestañas",
  "tab_menu.reopen": "Reabrir pestaña cerrada",
  "tab_menu.copy_path": "Copiar ruta de archivo",
  "tab_menu.reveal_in_explorer": "Mostrar en el explorador",
  "tab_menu.diff": "Comparar",
  "tab_menu.rename": "Renombrar",

  "diff.window_title": "Comparar",
  "diff.left_disk": "Versión en disco",
  "diff.right_editor": "Versión del editor",
  "diff.keep_mine": "Mantener mis cambios",
  "diff.use_disk": "Usar versión en disco",

  // ===== Menú de área vacía de la barra de pestañas =====
  "bar_menu.new": "Nueva pestaña",
  "bar_menu.open": "Abrir archivo",

  // ===== Diálogo de renombrar =====
  "dialog.rename_exists": "Ya existe un archivo con este nombre.",
  "dialog.rename_failed": "Error al renombrar: {error}",

  // ===== Menú contextual del editor =====
  "editor_menu.undo": "Deshacer",
  "editor_menu.redo": "Rehacer",
  "editor_menu.cut": "Cortar",
  "editor_menu.copy": "Copiar",
  "editor_menu.paste": "Pegar",
  "editor_menu.delete": "Eliminar",
  "editor_menu.select_all": "Seleccionar todo",

  // ===== Barra lateral =====
  "sidebar.recent": "Archivos recientes",
  "sidebar.directory": "Directorio actual",
  "sidebar.file_not_found": "Archivo no encontrado o movido: {path}",
  "sidebar.empty_recent": "Sin archivos recientes",
  "sidebar.empty_dir": "Carpeta vacía",
  "sidebar.up": "Subir",
  "sidebar.dir_unreachable": "⚠️ No se puede acceder al directorio:\n{path}\n\nPosibles causas: unidad USB desconectada, unidad de red no montada o carpeta renombrada.",
  "sidebar.record_history": "Registrar historial",
  "sidebar.clear_history": "Borrar historial",
  "sidebar.delete_record": "Eliminar registro",

  // ===== Barra de estado =====
  "status.unsaved": "Sin guardar",
  "status.external_deleted": "⚠ Eliminado externamente",
  "status.external_unreachable": "⚠ Ubicación inaccesible",
  "status.external_modified": "⚠ Modificado externamente",
  "status.line_and_chars": "{lines} líneas · {chars} car.",
  "status.selected_chars": "{chars} car. seleccionados",
  "status.selected_lines_and_chars": "{lines} líneas · {chars} car. seleccionados",
  "status.short_line_numbers": "Núm. línea",
  "status.short_word_wrap": "Ajuste",
  "status.zoom_tooltip": "Zoom",
  "status.scroll_wheel": "Rueda",
  "status.encoding_tooltip": "Codificación: {encoding}",
  "status.line_ending_lf": "Fin de línea Unix (LF)",
  "status.line_ending_crlf": "Fin de línea Windows (CRLF)",
  "status.line_ending_cr": "Fin de línea Macintosh (CR)",

  // ===== Diálogos de cerrar/guardar =====
  "dialog.close_confirm": "Sí",
  "dialog.close_cancel": "No",
  "dialog.cancel": "Cancelar",
  "dialog.filter.all_files": "Todos los archivos",
  "dialog.filter.text_files": "Archivos de texto",
  "dialog.ask_save_unnamed": "¿Guardar archivo \"{title}\"?",
  "dialog.ask_save_named": "¿Guardar cambios en \"{title}\"?",

  // ===== Resolución de conflictos =====
  "dialog.conflict_title": "{path}\nEl archivo ha sido modificado externamente. Elige cómo proceder:",
  "dialog.conflict_overwrite": "Sobrescribir",
  "dialog.conflict_discard": "Recargar",
  "dialog.conflict_discard_close": "Descartar",
  "dialog.conflict_compare": "Comparar",
  "dialog.conflict_save_as": "Guardar como",
  "dialog.save_as_conflict": "Error al guardar: el archivo ya está abierto en otra pestaña. Ciérralo e inténtalo de nuevo.\nRuta: {path}",
  "dialog.ok": "Aceptar",
  "dialog.save_failed_title": "⚠️ Error al guardar: No se puede escribir en el archivo.",

  // ===== Diálogo de cerrar archivo grande =====
  "dialog.large_close": "El archivo \"{title}\" tiene cambios sin guardar. Se perderán si lo cierras.",
  "dialog.large_close_yes": "Guardar",
  "dialog.large_close_no": "No guardar",

  // ===== Diálogo de modificación de codificación y fin de línea =====
  "dialog.format_type_encoding": "codificación",
  "dialog.format_type_line_ending": "fin de línea",
  "dialog.change_format_title": "¿Cambiar {typeName} a \"{value}\"?",
  "dialog.change_format_subtitle": "El documento se puede convertir sin pérdidas. El contenido del archivo se actualizará después de guardar.",
  "dialog.change_format_lossy_title": "⚠ Cambiar {typeName} puede causar pérdida de caracteres",
  "dialog.change_format_lossy_subtitle": "El documento contiene caracteres especiales. Después de cambiar a \"{value}\", estos caracteres se reemplazarán por \"?\" y no se podrán recuperar.",
  "encoding_group_unicode": "Extensiones Unicode",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "Europa Occidental",
  "encoding_group_central_europe": "Europa Central/Oriental",
  "encoding_group_cyrillic": "Cirílico",
  "encoding_group_others": "Oriente Medio y otros",
  "encoding.recommend": "Recomendado",

  // ===== Acerca de =====
  "about.title": "FinchPad",
  "about.version": "Versión {version}",
  "about.line1": "Un editor de texto plano moderno, ligero y con múltiples pestañas.",
  "about.line2": "Con el objetivo de ser un mejor editor de texto predeterminado.",
  "about.tech": "Construido con: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Licencia: MIT",
  "about.website": "Sitio web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "Aceptar",

  // ===== Pestañas sin título =====
  "tab.unnamed": "Sin título {index}",
  "tab.unnamed_fallback": "Sin título",

  // ===== Archivo grande =====
  "large_file.pending_title": "Este archivo es grande y aún no se ha cargado",
  "large_file.pending_size": "Tamaño del archivo: {size}",
  "large_file.pending_hint": "Para mantener la interfaz fluida, se abrirá en una ventana separada para un renderizado de solo lectura ultrarrápido.",
  "large_file.pending_btn": "⚡ Vista rápida de solo lectura",
  "large_file.searching": "Escaneando archivo...",
  "large_file.no_results": "No se encontraron coincidencias",
  "large_file.search_failed": "Error en la búsqueda, por favor comprueba el estado del archivo.",
  "large_file.search_limit": "Mostrando solo los primeros 100 resultados, por favor usa palabras clave más precisas",
  "large_file.file_not_found": "El archivo ha sido eliminado o movido externamente y no se puede abrir.",
  "large_file.load_failed": "Error de lectura. El archivo puede haber sido modificado o eliminado externamente.",
  "large_file.search_placeholder": "Buscar...",
  "large_file.auto_detect": "🔄 Detección automática",

  // ===== Buscar y reemplazar =====
  "editor.find.placeholder": "Buscar",
  "editor.find.replace_placeholder": "Reemplazar",
  "editor.find.show_replace": "Mostrar reemplazar",
  "editor.find.hide_replace": "Ocultar reemplazar",
  "editor.find.close": "Cerrar (Esc)",
  "editor.find.find_in_selection": "Buscar en la selección",
  "editor.find.match_case": "Coincidir mayúsculas y minúsculas",
  "editor.find.match_whole_word": "Palabra completa",
  "editor.find.use_regex": "Expresión regular",
  "editor.find.preserve_case": "Preservar mayúsculas/minúsculas",
  "editor.find.replace": "Reemplazar",
  "editor.find.replace_all": "Reemplazar todo",
  "editor.find.prev_match": "Coincidencia anterior",
  "editor.find.next_match": "Siguiente coincidencia",
  "editor.find.no_results": "Sin resultados",
  "editor.find.match_count": "{current} de {total}",

    
    // ===== Menú de macOS =====
    "menu.file": "Archivo",
    "menu.edit": "Edición",
    "menu.view": "Ver",
    "menu.quit": "Salir de FinchPad",
};