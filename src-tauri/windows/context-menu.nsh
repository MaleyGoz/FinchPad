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
  ; --- 右键菜单逻辑 ---
  StrCmp "$(CTX_MENU_NAME)" "" 0 +2
  StrCpy $0 "${DEFAULT_CTX_MENU_NAME}"
  StrCmp "$(CTX_MENU_NAME)" "" +2 0
  StrCpy $0 "$(CTX_MENU_NAME)"

  !define REG_PATH "Software\Classes\*\shell\FinchPad"

  WriteRegStr HKCU "${REG_PATH}" "" "$0"
  WriteRegStr HKCU "${REG_PATH}" "Icon" "$INSTDIR\FinchPad.exe,0"
  WriteRegStr HKCU "${REG_PATH}" "Position" "Top" 
  WriteRegStr HKCU "${REG_PATH}\command" "" '"$INSTDIR\FinchPad.exe" "%1"'
  
  !undef REG_PATH

  ; ===== ★ 新增：覆盖 .txt 的 ProgID 默认图标 =====
  ; 2.1 读取 .txt 当前的 ProgID（例如 txtfile）
  ReadRegStr $1 HKCU "Software\Classes\.txt" ""
  StrCmp $1 "" +3 ; 如果读取为空，跳过 ProgID 覆盖
  
  ; 2.2 将 ProgID 的 DefaultIcon 指向你的专属图标
  WriteRegStr HKCU "Software\Classes\$1\DefaultIcon" "" "$INSTDIR\file_txt.ico,0"
  
  ; ===== 原有 SystemFileAssociations 逻辑（作为后备，保持不变） =====
  WriteRegStr HKCU "Software\Classes\SystemFileAssociations\.txt\DefaultIcon" "" "$INSTDIR\file_txt.ico,0"
  
  ; 2.3 通知系统刷新图标缓存（重要：否则装完可能看不到变化）
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend

; =====================================================================
; 3. 卸载时清理注册表
; =====================================================================
!macro NSIS_HOOK_PREUNINSTALL
  ; 清理右键菜单
  DeleteRegKey HKCU "Software\Classes\*\shell\FinchPad"
  
  ; ★ 清理专属 txt 图标注册表，恢复系统默认
  DeleteRegKey HKCU "Software\Classes\SystemFileAssociations\.txt\DefaultIcon"
!macroend