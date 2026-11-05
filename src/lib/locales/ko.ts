export const ko: Record<string, string> = {
  // ===== 설정 메뉴 =====
  "settings.view": "보기",
  "settings.show_line_numbers": "줄 번호 표시",
  "settings.word_wrap": "자동 줄 바꿈",
  "settings.theme": "테마",
  "settings.theme.white": "화이트",
  "settings.theme.gray": "그레이",
  "settings.theme.sepia": "세피아",
  "settings.theme.green": "그린",
  "settings.theme.dark": "다크",
  "settings.language": "언어",
  "settings.about": "FinchPad 정보",
  "settings.check_update": "업데이트 확인",
  "dialog.update_checking": "업데이트 확인 중...",
  "dialog.update_latest": "최신 버전입니다 (v{version}).",
  "dialog.update_found": "새 버전 발견!\n현재 버전: v{current}\n최신 버전: v{latest}\n\nGitHub로 이동하여 다운로드하시겠습니까?",
  "dialog.update_failed": "업데이트 확인 실패. 네트워크 연결을 확인하세요.",
  "dialog.update_confirm": "최신 릴리스",
  "dialog.update_cancel": "취소",

  // ===== 탭 바 =====
  "tab_bar.new_tab": "새 탭",
  "tab_bar.settings": "설정",
  "tab_bar.preview": "미리보기",
  "tab_bar.more_tabs": "더 많은 탭",

  // ===== 탭 우클릭 메뉴 =====
  "tab_menu.save": "저장",
  "tab_menu.save_as": "다른 이름으로 저장",
  "tab_menu.close": "탭 닫기",
  "tab_menu.close_others": "다른 탭 닫기",
  "tab_menu.close_left": "왼쪽 탭 닫기",
  "tab_menu.close_right": "오른쪽 탭 닫기",
  "tab_menu.close_all": "모든 탭 닫기",
  "tab_menu.reopen": "닫힌 탭 다시 열기",
  "tab_menu.copy_path": "파일 경로 복사",
  "tab_menu.reveal_in_explorer": "탐색기에서 열기",
  "tab_menu.diff": "비교",
  "tab_menu.rename": "이름 바꾸기",

  "diff.window_title": "비교",
  "diff.left_disk": "디스크 버전",
  "diff.right_editor": "편집기 버전",
  "diff.keep_mine": "내 수정 유지",
  "diff.use_disk": "디스크 버전 사용",

  // ===== 탭 바 빈 공간 메뉴 =====
  "bar_menu.new": "새 탭",
  "bar_menu.open": "파일 열기",

  // ===== 이름 바꾸기 대화상자 =====
  "dialog.rename_exists": "해당 이름의 파일이 이미 존재합니다.",
  "dialog.rename_failed": "이름 바꾸기 실패: {error}",

  // ===== 편집기 우클릭 메뉴 =====
  "editor_menu.undo": "실행 취소",
  "editor_menu.redo": "다시 실행",
  "editor_menu.cut": "잘라내기",
  "editor_menu.copy": "복사",
  "editor_menu.paste": "붙여넣기",
  "editor_menu.delete": "삭제",
  "editor_menu.select_all": "모두 선택",

  // ===== 사이드바 =====
  "sidebar.recent": "최근 파일",
  "sidebar.directory": "현재 디렉토리",
  "sidebar.file_not_found": "파일을 찾을 수 없거나 이동되었습니다: {path}",
  "sidebar.empty_recent": "최근 파일 없음",
  "sidebar.empty_dir": "빈 폴더",
  "sidebar.up": "상위로 이동",
  "sidebar.dir_unreachable": "⚠️ 디렉토리에 액세스할 수 없습니다:\n{path}\n\n가능한 원인: USB 드라이브 분리, 네트워크 드라이브 마운트 해제 또는 폴더 이름 변경.",
  "sidebar.record_history": "기록 저장",
  "sidebar.clear_history": "기록 지우기",
  "sidebar.delete_record": "기록 삭제",

  // ===== 상태 표시줄 =====
  "status.unsaved": "저장되지 않음",
  "status.external_deleted": "⚠ 외부에서 삭제됨",
  "status.external_unreachable": "⚠ 위치에 액세스할 수 없음",
  "status.external_modified": "⚠ 외부에서 수정됨",
  "status.line_and_chars": "{lines} 줄 · {chars} 자",
  "status.selected_chars": "{chars} 자 선택됨",
  "status.selected_lines_and_chars": "{lines} 줄 · {chars} 자 선택됨",
  "status.short_line_numbers": "줄 번호",
  "status.short_word_wrap": "줄 바꿈",
  "status.zoom_tooltip": "확대/축소",
  "status.scroll_wheel": "휠",
  "status.encoding_tooltip": "인코딩: {encoding}",
  "status.line_ending_lf": "Unix 줄바꿈 (LF)",
  "status.line_ending_crlf": "Windows 줄바꿈 (CRLF)",
  "status.line_ending_cr": "Macintosh 줄바꿈 (CR)",

  // ===== 닫기/저장 대화상자 =====
  "dialog.close_confirm": "예(Y)",
  "dialog.close_cancel": "아니오(N)",
  "dialog.cancel": "취소",
  "dialog.filter.all_files": "모든 파일",
  "dialog.filter.text_files": "텍스트 파일",
  "dialog.ask_save_unnamed": "파일 \"{title}\"을(를) 저장하시겠습니까?",
  "dialog.ask_save_named": "\"{title}\"의 변경 사항을 저장하시겠습니까?",

  // ===== 충돌 해결 =====
  "dialog.conflict_title": "{path}\n파일이 외부에서 수정되었습니다. 처리 방법을 선택하세요:",
  "dialog.conflict_overwrite": "덮어쓰기",
  "dialog.conflict_discard": "다시 로드",
  "dialog.conflict_discard_close": "변경 사항 버리기",
  "dialog.conflict_compare": "차이점 비교",
  "dialog.conflict_save_as": "다른 이름으로 저장",
  "dialog.save_as_conflict": "저장 실패: 파일이 이미 다른 탭에서 열려 있습니다. 닫고 다시 시도하세요.\n경로: {path}",
  "dialog.ok": "확인",

  // ===== 대용량 파일 닫기 대화상자 =====
  "dialog.large_close": "파일 \"{title}\"에 저장되지 않은 변경 사항이 있습니다. 닫으면 유실됩니다.",
  "dialog.large_close_yes": "저장",
  "dialog.large_close_no": "저장 안 함",

  // ===== 인코딩, 줄바꿈 수정 대화상자 =====
  "dialog.format_type_encoding": "인코딩",
  "dialog.format_type_line_ending": "줄바꿈 문자",
  "dialog.change_format_title": "{typeName}을(를) \"{value}\"(으)로 변경하시겠습니까?",
  "dialog.change_format_subtitle": "이 문서는 무손실로 변환할 수 있습니다. 저장 후 파일 내용이 업데이트됩니다.",
  "dialog.change_format_lossy_title": "⚠ {typeName} 변경 시 문자 손실이 발생할 수 있습니다",
  "dialog.change_format_lossy_subtitle": "문서에 특수 문자가 포함되어 있습니다. \"{value}\"(으)로 변경하면 이 문자들이 \"?\"로 대체되며 복구할 수 없습니다.",
  "encoding_group_unicode": "Unicode 확장",
  "encoding_group_cjk": "CJK",
  "encoding_group_western": "서유럽/서구",
  "encoding_group_central_europe": "중부/동부 유럽",
  "encoding_group_cyrillic": "키릴 문자",
  "encoding_group_others": "중동 및 기타",
  "encoding.recommend": "권장",

  // ===== 정보 대화상자 =====
  "about.title": "FinchPad",
  "about.version": "버전 {version}",
  "about.line1": "현대적이고 가벼운 멀티탭 일반 텍스트 편집기.",
  "about.line2": "더 나은 기본 텍스트 편집기를 목표로 합니다.",
  "about.tech": "기술 스택: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "제작자: MaleyGoz",
  "about.license": "라이선스: MIT License",
  "about.website": "웹사이트: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "확인",

  // ===== 제목 없는 탭 =====
  "tab.unnamed": "제목 없음 {index}",
  "tab.unnamed_fallback": "제목 없음",

  // ===== 대용량 파일 =====
  "large_file.pending_title": "이 파일은 커서 아직 로드되지 않았습니다",
  "large_file.pending_size": "파일 크기: {size}",
  "large_file.pending_hint": "메인 UI의 부드러움을 유지하기 위해 별도의 창에서 초고속 읽기 전용 렌더링을 수행합니다.",
  "large_file.pending_btn": "⚡ 빠른 읽기 전용 보기",
  "large_file.searching": "파일 스캔 중...",
  "large_file.no_results": "일치하는 항목 없음",
  "large_file.search_failed": "검색 실패. 파일 상태를 확인하세요.",
  "large_file.search_limit": "처음 100개 결과만 표시됩니다. 더 정확한 키워드를 사용하세요",
  "large_file.file_not_found": "파일이 외부에서 삭제되거나 이동되어 열 수 없습니다.",
  "large_file.load_failed": "읽기 실패. 파일이 외부에서 수정되거나 삭제되었을 수 있습니다.",
  "large_file.search_placeholder": "검색...",
  "large_file.auto_detect": "🔄 자동 감지",

  // ===== 찾기 및 바꾸기 =====
  "editor.find.placeholder": "찾기",
  "editor.find.replace_placeholder": "바꾸기",
  "editor.find.show_replace": "바꾸기 표시",
  "editor.find.hide_replace": "바꾸기 숨기기",
  "editor.find.close": "닫기 (Esc)",
  "editor.find.find_in_selection": "선택 영역에서 찾기",
  "editor.find.match_case": "대/소문자 구분",
  "editor.find.match_whole_word": "단어 단위로 찾기",
  "editor.find.use_regex": "정규식 사용",
  "editor.find.preserve_case": "대/소문자 유지",
  "editor.find.replace": "바꾸기",
  "editor.find.replace_all": "모두 바꾸기",
  "editor.find.prev_match": "이전 일치 항목",
  "editor.find.next_match": "다음 일치 항목",
  "editor.find.no_results": "결과 없음",
  "editor.find.match_count": "{current} / {total}",

    
    // ===== macOS 메뉴 =====
    "menu.file": "파일",
    "menu.edit": "편집",
    "menu.view": "보기",
    "menu.quit": "FinchPad 종료",
};