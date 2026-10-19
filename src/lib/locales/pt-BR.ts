export const pt: Record<string, string> = {
  // ===== Menu Configurações =====
  "settings.view": "Exibir",
  "settings.show_line_numbers": "Números de linha",
  "settings.word_wrap": "Quebra de linha",
  "settings.theme": "Tema",
  "settings.theme.white": "Branco",
  "settings.theme.gray": "Cinza",
  "settings.theme.sepia": "Sépia",
  "settings.theme.green": "Verde",
  "settings.theme.dark": "Escuro",
  "settings.language": "Idioma",
  "settings.about": "Sobre o FinchPad",
  "settings.check_update": "Verificar atualizações",
  "dialog.update_checking": "Verificando atualizações...",
  "dialog.update_latest": "Você está na versão mais recente (v{version}).",
  "dialog.update_found":
    "Nova versão encontrada!\nAtual: v{current}\nMais recente: v{latest}\n\nIr para o GitHub para baixar?",
  "dialog.update_failed": "Falha ao verificar atualizações. Verifique sua rede.",
  "dialog.update_confirm": "Baixar",
  "dialog.update_cancel": "Cancelar",

  // ===== Opções de Idioma =====
  "locale.auto": "Automático",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.pt-BR": "Português (Brasil)",

  // ===== Menu de Contexto da Guia =====
  "tab_menu.save": "Salvar",
  "tab_menu.save_as": "Salvar como",
  "tab_menu.close": "Fechar guia",
  "tab_menu.close_others": "Fechar outras guias",
  "tab_menu.close_left": "Fechar guias à esquerda",
  "tab_menu.close_right": "Fechar guias à direita",
  "tab_menu.copy_path": "Copiar caminho do arquivo",
  "tab_menu.reveal_in_explorer": "Revelar no Explorador",
  "tab_menu.diff": "Comparar",
  "tab_menu.rename": "Renomear",

  "diff.window_title": "Comparar",
  "diff.left_disk": "Disco",
  "diff.right_editor": "Editor",
  "diff.keep_mine": "Manter o meu",
  "diff.use_disk": "Usar versão do disco",

  // ===== Menu da Área Vazia da Barra de Guias =====
  "bar_menu.new": "Nova guia",
  "bar_menu.open": "Abrir arquivo",

  // ===== Diálogo de Renomear =====
  "dialog.rename_exists": "Já existe um arquivo com este nome no diretório.",
  "dialog.rename_failed": "Falha ao renomear: {error}",

  // ===== Menu de Contexto do Editor =====
  "editor_menu.undo": "Desfazer",
  "editor_menu.redo": "Refazer",
  "editor_menu.cut": "Recortar",
  "editor_menu.copy": "Copiar",
  "editor_menu.paste": "Colar",
  "editor_menu.delete": "Excluir",
  "editor_menu.select_all": "Selecionar tudo",

  // ===== Barra de Status =====
  "status.unsaved": "Não salvo",
  "status.external_deleted": "⚠ Excluído externamente",
  "status.external_unreachable": "⚠ Localização inacessível",
  "status.external_modified": "⚠ Modificado externamente",
  "status.line_and_chars": "{lines} linhas · {chars} caracteres",
  "status.selected_chars": "{chars} caracteres selecionados",
  "status.selected_lines_and_chars": "{lines} linhas · {chars} caracteres selecionados",
  "status.word_wrap_on": "Quebra: Ligada",
  "status.word_wrap_off": "Quebra: Desligada",
  "status.encoding_tooltip": "Codificação: {encoding}",
  "status.line_ending_lf": "Final de linha Unix (LF)",
  "status.line_ending_crlf": "Final de linha Windows (CRLF)",
  "status.line_ending_cr": "Final de linha Macintosh (CR)",

  // ===== Diálogos de Fechar/Salvar =====
  "dialog.close_confirm": "Sim",
  "dialog.close_cancel": "Não",
  "dialog.cancel": "Cancelar",
  "dialog.filter.all_files": "Todos os arquivos",
  "dialog.filter.text_files": "Arquivos de texto",

  "dialog.ask_save_unnamed": 'Salvar arquivo "{title}"?',
  "dialog.ask_save_named": 'Salvar alterações em "{title}"?',

  // ===== Resolução de Conflitos =====
  "dialog.conflict_title": "{path}\nO arquivo foi modificado externamente. Escolha como prosseguir:",
  "dialog.conflict_overwrite": "Sobrescrever",
  "dialog.conflict_discard": "Recarregar",
  "dialog.conflict_discard_close": "Descartar",
  "dialog.conflict_compare": "Comparar",
  "dialog.conflict_save_as": "Salvar como",
  "dialog.save_as_conflict":
    "Falha ao salvar: O arquivo já está aberto em outra guia. Feche-a e tente novamente.\nCaminho: {path}",
  "dialog.ok": "OK",

  // ===== Diálogo de Fechar Arquivo Grande =====
  "dialog.large_close": 'O arquivo "{title}" tem alterações não salvas. Elas serão perdidas se você fechar.',
  "dialog.large_close_yes": "Salvar",
  "dialog.large_close_no": "Não salvar",

  // ===== Placeholder de Arquivo Grande =====
  "pending.title": "Arquivo grande, ainda não carregado",
  "pending.size": "Tamanho: {size}",
  "pending.hint": "O editor pode ficar brevemente sem resposta após o carregamento",
  "pending.load": "Carregar agora",

  // ===== Diálogo Sobre =====
  "about.title": "FinchPad",
  "about.version": "Versão {version}",
  "about.line1": "Um editor de texto simples, moderno, leve e com várias guias.",
  "about.line2": "Com o objetivo de ser um editor de texto padrão melhor.",
  "about.tech": "Construído com: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "Autor: MaleyGoz",
  "about.license": "Licença: MIT",
  "about.website": "Site: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "OK",

  // ===== Guias Sem Título =====
  "tab.unnamed": "Sem título {index}",
  "tab.unnamed_fallback": "Sem título",
};