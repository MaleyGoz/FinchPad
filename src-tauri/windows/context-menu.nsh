; =====================================================================
; FinchPad 右键菜单多语言配置
; =====================================================================

; 1. 定义 16 种语言对应的菜单名称,根据tauri.conf.json里面的语言配置
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
  WriteRegStr HKCU "Software\Classes\*\shell\FinchPad" "" "$(CTX_MENU_NAME)"
  ; 加上 ",0" 可以确保 Windows 稳定加载主程序内置的图标
  WriteRegStr HKCU "Software\Classes\*\shell\FinchPad" "Icon" "$INSTDIR\FinchPad.exe,0"
  WriteRegStr HKCU "Software\Classes\*\shell\FinchPad\command" "" '"$INSTDIR\FinchPad.exe" "%1"'
!macroend

; =====================================================================
; 3. 卸载时清理注册表
; =====================================================================
!macro NSIS_HOOK_PREUNINSTALL
  DeleteRegKey HKCU "Software\Classes\*\shell\FinchPad"
!macroend