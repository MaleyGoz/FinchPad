export const es: Record<string, string> = {
  // ===== Menú de Configuración =====
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
  "dialog.update_latest": "Ya tienes la última versión (v{version}).",
  "dialog.update_found":
    "¡Se encontró una nueva versión!\nActual: v{current}\nÚltima: v{latest}\n\n¿Ir a GitHub para descargar?",
  "dialog.update_failed": "Error al buscar actualizaciones. Por favor, revisa tu red.",
  "dialog.update_confirm": "Descargar",
  "dialog.update_cancel": "Cancelar",

  // ===== Opciones de Idioma =====

  // ===== Menú Contextual de Pestaña =====
  "tab_menu.save": "Guardar",
  "tab_menu.save_as": "Guardar como",
  "tab_menu.close": "Cerrar pestaña",
  "tab_menu.close_others": "Cerrar otras pestañas",
  "tab_menu.close_left": "Cerrar pestañas a la izquierda",
  "tab_menu.close_right": "Cerrar pestañas a la derecha",
  "tab_menu.close_all": "Cerrar todo",
  "tab_menu.copy_path": "Copiar ruta del archivo",
  "tab_menu.reveal_in_explorer": "Mostrar en el explorador",
  "tab_menu.diff": "Comparar",
  "tab_menu.rename": "Renombrar",

  "diff.window_title": "Comparar",
  "diff.left_disk": "Disco",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Mantener el mío",
  "diff.use_disk": "Usar versión del disco",

  // ===== Menú de Área Vacía de Barra =====
  "bar_menu.new": "Nueva pestaña",
  "bar_menu.open": "Abrir archivo",

  // ===== Diálogo de Renombrar =====
  "dialog.rename_exists": "Ya existe un archivo con ese nombre en el directorio.",
  "dialog.rename_failed": "Error al renombrar: {error}",

  // ===== Menú Contextual del Editor =====
  "editor_menu.undo": "Deshacer",
  "editor_menu.redo": "Rehacer",
  "editor_menu.cut": "Cortar",
  "editor_menu.copy": "Copiar",
  "editor_menu.paste": "Pegar",
  "editor_menu.delete": "Eliminar",
  "editor_menu.select_all": "Seleccionar todo",

  // ===== SideBar =====
  "sidebar.empty_recent": "No hay archivos recientes",
  "sidebar.empty_dir": "Carpeta vacía",
  "sidebar.up": "Subir nivel",
  "sidebar.dir_unreachable": "⚠️ No se puede acceder al directorio:\n{path}\n\nPosibles razones: unidad USB desconectada, unidad de red no montada o carpeta renombrada.",

  "sidebar.recent": "Archivos recientes",
  "sidebar.directory": "Directorio actual",
  "sidebar.file_not_found": "Archivo no encontrado o movido: {path}",

  // ===== Barra de Estado =====
  "status.unsaved": "Sin guardar",
  "status.external_deleted": "⚠ Eliminado externamente",
  "status.external_unreachable": "⚠ Ubicación inaccesible",
  "status.external_modified": "⚠ Modificado externamente",
  "status.line_and_chars": "{lines} líneas · {chars} caracteres",
  "status.selected_chars": "{chars} caracteres seleccionados",
  "status.selected_lines_and_chars": "{lines} líneas · {chars} caracteres seleccionados",
  "status.short_line_numbers": "Líneas",
  "status.short_word_wrap": "Ajuste",
  "status.encoding_tooltip": "Codificación: {encoding}",
  "status.line_ending_lf": "Final de línea Unix (LF)",
  "status.line_ending_crlf": "Final de línea Windows (CRLF)",
  "status.line_ending_cr": "Final de línea Macintosh (CR)",

  // ===== Diálogos de Cierre/Guardado =====
  "dialog.close_confirm": "Sí",
  "dialog.close_cancel": "No",
  "dialog.cancel": "Cancelar",
  "dialog.filter.all_files": "Todos los archivos",
  "dialog.filter.text_files": "Archivos de texto",

  "dialog.ask_save_unnamed": '¿Guardar el archivo "{title}"?',
  "dialog.ask_save_named": '¿Guardar cambios en "{title}"?',

  // ===== Resolución de Conflictos =====
  "dialog.conflict_title": "{path}\nEl archivo ha sido modificado externamente. Elige cómo proceder:",
  "dialog.conflict_overwrite": "Sobrescribir",
  "dialog.conflict_discard": "Recargar",
  "dialog.conflict_discard_close": "Descartar",
  "dialog.conflict_compare": "Comparar",
  "dialog.conflict_save_as": "Guardar como",
  "dialog.save_as_conflict":
    "Error al guardar: El archivo ya está abierto en otra pestaña. Por favor, ciérrala e inténtalo de nuevo.\nRuta: {path}",
  "dialog.ok": "Aceptar",

  // ===== Diálogo de Cierre de Archivo Grande =====
  "dialog.large_close": 'El archivo "{title}" tiene cambios sin guardar. Se perderán si cierras.',
  "dialog.large_close_yes": "Guardar",
  "dialog.large_close_no": "No guardar",

  // ===== Marcador de Archivo Grande =====

  // ===== Diálogo Acerca de =====
  "about.title": "FinchPad",
  "about.version": "Versión {version}",
  "about.line1": "Un editor de texto plano moderno, ligero y con pestañas múltiples.",
  "about.line2": "Con el objetivo de ser un mejor editor de texto predeterminado.",
  "about.tech": "Construido con: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Licencia: MIT",
  "about.website": "Sitio web: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "Aceptar",

  // ===== Pestañas Sin Título =====
  "tab.unnamed": "Sin título {index}",
  "tab.unnamed_fallback": "Sin título",

  "large_file.searching": "Escaneando archivo...",
  "large_file.search_limit": "Mostrando solo los primeros 100 resultados, por favor usa palabras clave más precisas",
  "sidebar.record_history": "Registrar historial",
  "large_file.search_placeholder": "Buscar...",
  "large_file.auto_detect": "🔄 Detección automática",
  "large_file.search_failed": "Error en la búsqueda, por favor verifica el estado del archivo.",
  "large_file.pending_size": "Tamaño del archivo: {size}",
  "large_file.pending_btn": "⚡ Vista rápida de solo lectura",
  "large_file.no_results": "No se encontraron coincidencias",
  "large_file.pending_hint": "Para mantener fluida la interfaz principal, se abrirá en una ventana separada para una renderización de solo lectura ultrarrápida.",
  "large_file.pending_title": "Este archivo es grande y aún no se ha cargado",
  "large_file.load_failed": "Error de lectura. El archivo puede haber sido modificado o eliminado externamente.",
  "large_file.file_not_found": "El archivo ha sido eliminado o movido externamente y no se puede abrir.",
  "sidebar.delete_record": "Eliminar registro",
  "sidebar.clear_history": "Borrar historial",
};