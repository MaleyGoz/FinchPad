; =====================================================================
; FinchPad 右键菜单多语言配置 (默认英文)
; =====================================================================

; 1. 定义 16 种语言对应的菜单名称
!define DEFAULT_CTX_MENU_NAME "Edit with FinchPad"
LangString CTX_MENU_NAME ${LANG_ENGLISH} "Edit with FinchPad"
LangString CTX_MENU_NAME ${LANG_SIMPCHINESE} "使用 FinchPad 编辑"
LangString CTX_MENU_NAME ${LANG_TRADCHINESE} "使用 FinchPad 編輯"
LangString CTX_MENU_NAME ${LANG_JAPANESE} "FinchPad で編集"
LangString CTX_MENU_NAME ${LANG_KOREAN} "FinchPad로 편집"
LangString CTX_MENU_NAME ${LANG_FRENCH} "Modifier avec FinchPad"
LangString CTX_MENU_NAME ${LANG_GERMAN} "Mit FinchPad bearbeiten"
LangString CTX_MENU_NAME ${LANG_SPANISH} "Editar con FinchPad"
LangString CTX_MENU_NAME ${LANG_ITALIAN} "Modifica con FinchPad"
LangString CTX_MENU_NAME ${LANG_RUSSIAN} "Редактировать в FinchPad"
LangString CTX_MENU_NAME ${LANG_PORTUGUESEBR} "Editar com FinchPad"
LangString CTX_MENU_NAME ${LANG_POLISH} "Edytuj za pomocą FinchPad"
LangString CTX_MENU_NAME ${LANG_DUTCH} "Bewerken met FinchPad"
LangString CTX_MENU_NAME ${LANG_TURKISH} "FinchPad ile düzenle"
LangString CTX_MENU_NAME ${LANG_VIETNAMESE} "Chỉnh sửa bằng FinchPad"
LangString CTX_MENU_NAME ${LANG_THAI} "แก้ไขด้วย FinchPad"
LangString CTX_MENU_NAME ${LANG_INDONESIAN} "Edit dengan FinchPad"

; =====================================================================
; 2. 安装时写入注册表
; =====================================================================
!macro NSIS_HOOK_POSTINSTALL
  ; 语言兜底判断
  StrCmp "$(CTX_MENU_NAME)" "" 0 +2
  StrCpy $0 "${DEFAULT_CTX_MENU_NAME}"
  StrCmp "$(CTX_MENU_NAME)" "" +2 0
  StrCpy $0 "$(CTX_MENU_NAME)"

  ; 定义注册表根路径，方便后续维护
  !define REG_PATH "Software\Classes\*\shell\FinchPad"

  ; 写入菜单名称
  WriteRegStr HKCU "${REG_PATH}" "" "$0"
  ; 写入图标 (索引 0)
  WriteRegStr HKCU "${REG_PATH}" "Icon" "$INSTDIR\FinchPad.exe,0"
  ; 尝试置顶 (兼容旧版菜单)
  WriteRegStr HKCU "${REG_PATH}" "Position" "Top" 
  ; 写入执行命令
  WriteRegStr HKCU "${REG_PATH}\command" "" '"$INSTDIR\FinchPad.exe" "%1"'
  
  ; 清理临时宏定义
  !undef REG_PATH
!macroend

; =====================================================================
; 3. 卸载时清理注册表
; =====================================================================
!macro NSIS_HOOK_PREUNINSTALL
  DeleteRegKey HKCU "Software\Classes\*\shell\FinchPad"
!macroend