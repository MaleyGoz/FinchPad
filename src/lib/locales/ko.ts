export const ko: Record<string, string> = {
  // ===== 설정 메뉴 =====
  "settings.view": "보기",
  "settings.show_line_numbers": "줄 번호",
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
  "dialog.update_checking": "업데이트를 확인하는 중...",
  "dialog.update_latest": "최신 버전입니다 (v{version}).",
  "dialog.update_found":
    "새 버전을 찾았습니다!\n현재: v{current}\n최신: v{latest}\n\nGitHub에서 다운로드하시겠습니까?",
  "dialog.update_failed": "업데이트 확인에 실패했습니다. 네트워크를 확인해주세요.",
  "dialog.update_confirm": "다운로드",
  "dialog.update_cancel": "취소",

  // ===== 언어 옵션 =====
  "locale.auto": "자동",
  "locale.zh-CN": "简体中文",
  "locale.en-US": "English",
  "locale.ko": "한국어",

  // ===== 탭 컨텍스트 메뉴 =====
  "tab_menu.save": "저장",
  "tab_menu.save_as": "다른 이름으로 저장",
  "tab_menu.close": "탭 닫기",
  "tab_menu.close_others": "다른 탭 닫기",
  "tab_menu.close_left": "왼쪽 탭 닫기",
  "tab_menu.close_right": "오른쪽 탭 닫기",
  "tab_menu.copy_path": "파일 경로 복사",
  "tab_menu.reveal_in_explorer": "탐색기에서 열기",
  "tab_menu.diff": "비교",
  "tab_menu.rename": "이름 바꾸기",

  "diff.window_title": "비교",
  "diff.left_disk": "디스크",
  "diff.right_editor": "편집기",
  "diff.keep_mine": "내 버전 유지",
  "diff.use_disk": "디스크 버전 사용",

  // ===== 탭 바 빈 영역 메뉴 =====
  "bar_menu.new": "새 탭",
  "bar_menu.open": "파일 열기",

  // ===== 이름 바꾸기 대화상자 =====
  "dialog.rename_exists": "이 디렉토리에 같은 이름의 파일이 이미 있습니다.",
  "dialog.rename_failed": "이름 바꾸기 실패: {error}",

  // ===== 편집기 컨텍스트 메뉴 =====
  "editor_menu.undo": "실행 취소",
  "editor_menu.redo": "다시 실행",
  "editor_menu.cut": "잘라내기",
  "editor_menu.copy": "복사",
  "editor_menu.paste": "붙여넣기",
  "editor_menu.delete": "삭제",
  "editor_menu.select_all": "모두 선택",

  // ===== SideBar =====
  "sidebar.recent": "최근 파일",
  "sidebar.directory": "현재 디렉토리",
  "sidebar.file_not_found": "파일을 찾을 수 없거나 이동되었습니다: {path}",
  "sidebar.empty": "기록 없음",
  "sidebar.up": "상위 폴더로",

  // ===== 상태 표시줄 =====
  "status.unsaved": "저장되지 않음",
  "status.external_deleted": "⚠ 외부에서 삭제됨",
  "status.external_unreachable": "⚠ 위치에 접근할 수 없음",
  "status.external_modified": "⚠ 외부에서 수정됨",
  "status.line_and_chars": "{lines}줄 · {chars}글자",
  "status.selected_chars": "{chars}글자 선택됨",
  "status.selected_lines_and_chars": "{lines}줄 · {chars}글자 선택됨",
  "status.short_line_numbers": "줄 번호",
  "status.short_word_wrap": "줄 바꿈",
  "status.encoding_tooltip": "인코딩: {encoding}",
  "status.line_ending_lf": "Unix 줄 끝 (LF)",
  "status.line_ending_crlf": "Windows 줄 끝 (CRLF)",
  "status.line_ending_cr": "Macintosh 줄 끝 (CR)",

  // ===== 닫기/저장 대화상자 =====
  "dialog.close_confirm": "예",
  "dialog.close_cancel": "아니오",
  "dialog.cancel": "취소",
  "dialog.filter.all_files": "모든 파일",
  "dialog.filter.text_files": "텍스트 파일",

  "dialog.ask_save_unnamed": '파일 "{title}"을(를) 저장하시겠습니까?',
  "dialog.ask_save_named": '"{title}"의 변경 사항을 저장하시겠습니까?',

  // ===== 충돌 해결 =====
  "dialog.conflict_title": "{path}\n파일이 외부에서 수정되었습니다. 진행 방법을 선택하세요:",
  "dialog.conflict_overwrite": "덮어쓰기",
  "dialog.conflict_discard": "다시 로드",
  "dialog.conflict_discard_close": "변경 취소",
  "dialog.conflict_compare": "비교",
  "dialog.conflict_save_as": "다른 이름으로 저장",
  "dialog.save_as_conflict":
    "저장 실패: 파일이 다른 탭에서 이미 열려 있습니다. 해당 탭을 닫고 다시 시도하세요.\n경로: {path}",
  "dialog.ok": "확인",

  // ===== 큰 파일 닫기 대화상자 =====
  "dialog.large_close": '파일 "{title}"에 저장되지 않은 변경 사항이 있습니다. 닫으면 손실됩니다.',
  "dialog.large_close_yes": "저장",
  "dialog.large_close_no": "저장하지 않음",

  // ===== 큰 파일 플레이스홀더 =====
  "pending.title": "큰 파일, 아직 로드되지 않음",
  "pending.size": "크기: {size}",
  "pending.hint": "로드 후 편집기가 잠시 응답하지 않을 수 있습니다",
  "pending.load": "지금 로드",

  // ===== 정보 대화상자 =====
  "about.title": "FinchPad",
  "about.version": "버전 {version}",
  "about.line1": "현대적이고 가벼운 멀티탭 일반 텍스트 편집기입니다.",
  "about.line2": "더 나은 기본 텍스트 편집기를 목표로 합니다.",
  "about.tech": "기술 스택: Tauri 2 · Svelte 5 · Rust · Monaco Editor",
  "about.author": "저자: MaleyGoz",
  "about.license": "라이선스: MIT",
  "about.website": "웹사이트: https://github.com/MaleyGoz/FinchPad",
  "about.ok": "확인",

  // ===== 제목 없는 탭 =====
  "tab.unnamed": "제목 없음 {index}",
  "tab.unnamed_fallback": "제목 없음",
};