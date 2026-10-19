<script lang="ts">
  import { onMount } from 'svelte';
  import TabBar from '$lib/TabBar.svelte';
  import Editor from '$lib/Editor.svelte';
  import StatusBar from '$lib/StatusBar.svelte';
  import { api, type Snapshot } from '$lib/api';
  import { currentTheme, THEMES, THEME_ORDER, THEME_LABELS } from '$lib/themes';
  import { open, save } from '@tauri-apps/plugin-dialog';
  import { getCurrentWebview } from '@tauri-apps/api/webview';
  import { listen } from '@tauri-apps/api/event';  
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { revealItemInDir, openUrl } from '@tauri-apps/plugin-opener';
  import { writeText } from '@tauri-apps/plugin-clipboard-manager';
  import { get } from 'svelte/store';
  import { t, resolvedLocale, LOCALE_OPTIONS, LANGUAGE_NAMES, localeChoice, setLocaleChoice, type LocaleChoice } from '$lib/i18n';

  let snapshot: Snapshot = {
    tab_titles: [],
    active_index: 0,
    active_text: '',
    line_count: 1,
    char_count: 0,
    encoding: 'UTF-8',
    line_ending: 'LF',
    is_dirty: false,
    default_save_path: '',
    is_unnamed: true,
    language_id: 'plaintext',
    file_size: 0,
    is_pending_load: false,
    large_file: false,
    tab_dirty_states: [],
    tab_unnamed_states: [],
    tab_ids: [],
    tab_paths: [],
    disk_state: 'normal',
    zoom: 100,
    word_wrap: true,
    locale_choice: 'auto',
    show_line_numbers: true,
    editor_bg: 'white',
    last_used_path: '',
  };

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  /** 防抖队列里还没同步给 Rust 的最新文本；null 表示没有待同步编辑 */
  let pendingText: string | null = null;
  let selectedCount = 0;
  let selectedLineCount = 0;  
  // tabId -> 用户最后一次看到冲突弹窗时的磁盘 mtime（秒级时间戳）
  // 用于区分"同一次外部修改"和"新的外部修改"
  let acknowledgedDiskMtime = new Map<string, number>();
  let zoom = 100;
  let wordWrap = true;
  let showLineNumbers = true;
  let editorBg = 'white';  
  let closeQueueTabIds: string[] = [];
  let renamingIndex = -1;
  let isWindowFocused = true;

  // 编辑器组件引用（用于调用编辑区方法）
  let editorRef: Editor;

  // 编辑区右键菜单
  type EditorContextMenuState = {
    visible: boolean;
    left: number | null;
    right: number | null;
    top: number;
    hasSelection: boolean;
    canUndo: boolean;
    canRedo: boolean;
  };
  let editorContextMenu: EditorContextMenuState = {
    visible: false,
    left: 0,
    right: null,
    top: 0,
    hasSelection: false,
    canUndo: false,
    canRedo: false,
  };

  // 平台检测：决定显示 Ctrl 还是 Cmd
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const mod = isMac ? 'Cmd' : 'Ctrl';  

  // 设置菜单
  type SettingsMenuState = { visible: boolean; anchorRight: number; anchorBottom: number };
  let settingsMenu: SettingsMenuState = { visible: false, anchorRight: 0, anchorBottom: 0 };
  let aboutVisible = false;
  const APP_VERSION = '0.3.0';  // 和 Cargo.toml / package.json 里的版本号保持一致  

  function handleSettingsClick(anchorRight: number, anchorBottom: number) {
    closeContextMenu();
    closeBarContextMenu();
    settingsMenu = { visible: true, anchorRight, anchorBottom };
  }

  function closeSettingsMenu() {
    settingsMenu = { visible: false, anchorRight: 0, anchorBottom: 0 };
  }

  // 比较版本号 (例如 v0.3.0 vs 0.4.0)
  function isNewerVersion(current: string, latest: string): boolean {
    // 去掉可能存在的 'v' 前缀
    const cleanCurrent = current.replace(/^v/, '').split('.').map(Number);
    const cleanLatest = latest.replace(/^v/, '').split('.').map(Number);

    for (let i = 0; i < Math.max(cleanCurrent.length, cleanLatest.length); i++) {
      const c = cleanCurrent[i] || 0;
      const l = cleanLatest[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }

  // 检查更新主逻辑
  async function checkForUpdates() {
    closeSettingsMenu();
    
    // 弹出“正在检查”弹窗
    modal = {
      visible: true,
      title: t('dialog.update_checking', undefined, get(resolvedLocale)),
      rows: [], // 没有按钮，纯提示
    };

    try {
      const res = await fetch("https://api.github.com/repos/MaleyGoz/FinchPad/releases/latest");
      if (!res.ok) throw new Error("Network response was not ok");
      
      const data = await res.json();
      const latestVersion = data.tag_name; // 例如 "v0.4.0"
      
      if (isNewerVersion(APP_VERSION, latestVersion)) {
        // 发现新版本
        modal = {
          visible: true,
          title: t('dialog.update_found', { 
            current: APP_VERSION, 
            latest: latestVersion.replace(/^v/, '') 
          }, get(resolvedLocale)),
          rows: [
            [
              { label: t('dialog.update_cancel'), action: closeModal },
              { 
                label: t('dialog.update_confirm'), 
                style: 'primary', 
                action: async () => {
                  closeModal();
                  await openUrl('https://github.com/MaleyGoz/FinchPad/releases/latest');
                } 
              }
            ]
          ]
        };
      } else {
        // 已是最新版本
        modal = {
          visible: true,
          title: t('dialog.update_latest', { version: APP_VERSION }, get(resolvedLocale)),
          rows: [[{ label: t('dialog.ok'), style: 'primary', action: closeModal }]]
        };
      }
    } catch (err) {
      console.error("检查更新失败:", err);
      // 网络错误提示
      modal = {
        visible: true,
        title: t('dialog.update_failed', undefined, get(resolvedLocale)),
        rows: [[{ label: t('dialog.ok'), style: 'primary', action: closeModal }]]
      };
    }
  }  

  async function openGitHub() {
    try {
      await openUrl('https://github.com/MaleyGoz/FinchPad');
    } catch (e) {
      console.error('打开链接失败：', e);
    }
  }  

  async function toggleShowLineNumbers() {
    showLineNumbers = !showLineNumbers;
    await api.setShowLineNumbers(showLineNumbers);
  }

  async function toggleWordWrapFromSettings() {
    if (snapshot.large_file) return;
    wordWrap = !wordWrap;
    await api.setWordWrap(wordWrap);
  }

  async function setTheme(name: string) {
    editorBg = name;
    currentTheme.set(name);
    closeSettingsMenu();
    await api.setEditorBg(name);
  }

  async function setLocale(choice: LocaleChoice) {
    setLocaleChoice(choice);
    closeSettingsMenu();
    const actual = get(resolvedLocale);
    const template = t('tab.unnamed', undefined, actual);
    await api.setLocale(actual, template, choice);
  }  

  type BarContextMenuState = {
    visible: boolean;
    left: number | null;
    right: number | null;
    top: number;
  };
  let barContextMenu: BarContextMenuState = {
    visible: false,
    left: 0,
    right: null,
    top: 0,
  };

  async function refresh() {
    snapshot = await api.getWorkspaceState();
  }

  async function handleNew() {
    await flushPendingEdit();
    await api.newTab();
    await refresh();
  }

  async function handleSelect(i: number) {
    if (i === snapshot.active_index) return;
    await flushPendingEdit();
    await api.switchTab(i);
    await refresh();

    lastDetectTime = 0;
    await detectExternalChanges();
  }


  // 检测冷却：1 秒内只检测一次，防止频繁触发
  let lastDetectTime = 0;

  /**
   * 统一的外部变化检测入口。
   * 
   * 触发时机：窗口获得焦点、鼠标点击、键盘按键、切换标签。
   * 核心流程：先同步未保存编辑 → 拉最新状态 → 判定并处理。
   */
  async function detectExternalChanges() {
    // 弹窗已显示 → 跳过
    if (modal.visible) return;

    // 冷却：1 秒内只检测一次
    const now = Date.now();
    if (now - lastDetectTime < 1000) return;
    lastDetectTime = now;

    const idx = snapshot.active_index;
    const tabId = snapshot.tab_ids[idx];
    if (!tabId) return;

    // ★ 先把本地未同步的编辑写回 Rust（不触发 refresh）
    await flushPendingEdit();

    // ★ 只读查询状态，不刷新 snapshot.active_text（关键修复）
    const full = await api.checkTabFullState(idx);

    // 只更新状态栏字段，不动 active_text
    snapshot = { ...snapshot, disk_state: full.disk_state };

    if (full.disk_state === 'modified') {
      if (full.is_dirty) {
        // 脏 + Modified → 弹冲突框（用 mtime 判断是否是新冲突）
        const diskMtime = full.disk_mtime ?? 0;
        const lastSeen = acknowledgedDiskMtime.get(tabId) ?? -1;
        if (diskMtime !== lastSeen) {
          acknowledgedDiskMtime.set(tabId, diskMtime);
          showSaveConflictModal(idx);
        }
      } else {
        // 干净 + Modified → 静默重载（保持不变）
        snapshot = await api.reloadTab(idx);
      }
    } else if (full.disk_state === 'deleted' || full.disk_state === 'unreachable') {
      // ★ 新增：如果文件被删除或路径不可达，强制将其标记为脏标签
      // 这样关闭时一定会弹窗提示保存，防止内容丢失
      if (!snapshot.tab_dirty_states[idx]) {
        const newDirtyStates = [...snapshot.tab_dirty_states];
        newDirtyStates[idx] = true;
        snapshot = {
          ...snapshot,
          is_dirty: true,
          tab_dirty_states: newDirtyStates,
        };
      }
    }
  }

  async function handleRenameCommit(index: number, newName: string) {
    try {
      snapshot = await api.renameTabFile(index, newName);
      renamingIndex = -1;
    } catch (e) {
      renamingIndex = -1;
      // ★ 把 e 强制转换成字符串进行比较和传参
      const errStr = String(e); 
      
      if (errStr === "FileExists") {
        alert(t('dialog.rename_exists', undefined, get(resolvedLocale)));
      } else {
        alert(t('dialog.rename_failed', { error: errStr }, get(resolvedLocale)));
      }
    }
  }

  function handleRenameCancel() {
    renamingIndex = -1;
  }

  async function handleClose(i: number) {
    // ★ 方案 A：如果目标标签不是激活标签，先切过去（让用户看清冲突）
    if (i !== snapshot.active_index) {
      await api.switchTab(i);
    }
    await flushPendingEdit();
    await refresh();

    const isDirty = snapshot.tab_dirty_states[i] ?? false;
    const isUnnamed = snapshot.tab_unnamed_states[i] ?? false;
    const title = snapshot.tab_titles[i] ?? t('tab.unnamed_fallback', undefined, get(resolvedLocale));

    if (!isDirty) {
      // 干净标签 → 直接关
      await api.closeTab(i);
      await refresh();
      return;
    }

    // ★ 新增：已命名 + modified → 弹 5 按钮冲突框（关闭模式）
    if (!isUnnamed) {
      const full = await api.checkTabFullState(i);
      if (full.disk_state === 'modified') {
        showSaveConflictModal(i, 'close', () => discardAndClose(i));
        return;
      }
    }

    // 其它脏标签（含未命名）→ 弹"是否保存"
    const message = isUnnamed
      ? t('dialog.ask_save_unnamed', { title })
      : t('dialog.ask_save_named', { title });

    modal = {
      visible: true,
      title: message,
      rows: [
        [
          { label: t('dialog.close_confirm'), style: 'primary', action: () => saveAndClose(i, isUnnamed) },
          { label: t('dialog.close_cancel'), action: () => discardAndClose(i) },
          { label: t('dialog.cancel'), action: closeModal },
        ],
      ],
    };
  }

  function handleContextMenu(i: number, x: number, y: number) {
    // 标签右键菜单大约 220px 宽、360px 高（8 项 + 分隔线）
    const pos = clampMenuPos(x, y, 220, 360);
    contextMenu = {
      visible: true,
      index: i,
      left: pos.left,
      right: pos.right,
      top: pos.top,
    };
  }

  function handleBarContextMenu(x: number, y: number) {
    closeContextMenu();
    // 空白区菜单只有 2 项，约 200×80
    const pos = clampMenuPos(x, y, 200, 80);
    barContextMenu = {
      visible: true,
      left: pos.left,
      right: pos.right,
      top: pos.top,
    };
  }

  function handleEditorContextMenu(info: {
    x: number;
    y: number;
    hasSelection: boolean;
    canUndo: boolean;
    canRedo: boolean;
  }) {
    // 关掉其它菜单避免重叠
    closeContextMenu();
    closeBarContextMenu();

    const pos = clampMenuPos(info.x, info.y, 220, 260);
    editorContextMenu = {
      visible: true,
      left: pos.left,
      right: pos.right,
      top: pos.top,
      hasSelection: info.hasSelection,
      canUndo: info.canUndo,
      canRedo: info.canRedo,
    };
  }

  function closeEditorContextMenu() {
    editorContextMenu = { ...editorContextMenu, visible: false };
  }

  function runEditorAction(action: string) {
    closeEditorContextMenu();
    editorRef?.execEditorAction(action);
  }

  function closeBarContextMenu() {
    barContextMenu = { visible: false, left: 0, right: null, top: 0 };
  }

  function barMenuNew() {
    closeBarContextMenu();
    handleNew();
  }

  function barMenuOpen() {
    closeBarContextMenu();
    handleOpen();
  }  

  async function handleReorder(from: number, to: number) {
    try {
      await api.reorderTabs(from, to);
      await refresh();
    } catch (e) {
      console.error('重排标签失败：', e);
    }
  }

  // 处理三种批量关闭
  function menuCloseOthers() {
    const keepId = snapshot.tab_ids[contextMenu.index];
    closeContextMenu();
    const ids = snapshot.tab_ids.filter((id) => id !== keepId);
    startCloseQueue(ids);
  }

  function menuCloseLeft() {
    const idx = contextMenu.index;
    closeContextMenu();
    const ids = snapshot.tab_ids.slice(0, idx);
    startCloseQueue(ids);
  }

  function menuCloseRight() {
    const idx = contextMenu.index;
    closeContextMenu();
    const ids = snapshot.tab_ids.slice(idx + 1);
    startCloseQueue(ids);
  }

  function menuCloseSingle() {
    const idx = contextMenu.index;
    closeContextMenu();
    handleClose(idx);
  }

  async function menuSave() {
    const idx = contextMenu.index;
    closeContextMenu();
    await api.switchTab(idx);
    await refresh();

    if (snapshot.is_unnamed) {
      // 未命名 → 走另存为
      const path = await save({
        defaultPath: snapshot.default_save_path,
        filters: [
            { name: t('dialog.filter.text_files', undefined, get(resolvedLocale)), extensions: ['txt'] },
            { name: t('dialog.filter.all_files', undefined, get(resolvedLocale)), extensions: ['*'] },
        ],
      });
      if (!path) return;
      try {
        snapshot = await api.saveActiveFileAs(path);
      } catch (e) {
        if (e === "FileAlreadyOpen") {
          modal = { visible: true, title: t('dialog.save_as_conflict', { path }, get(resolvedLocale)), rows: [[{ label: t('dialog.ok'), style: 'primary', action: closeModal }]] };
        } else {
          console.error('保存失败：', e);
        }
      }
      return;
    }

    // ★ 新增：已命名 + modified → 弹 5 按钮冲突框
    const full = await api.checkTabFullState(idx);
    if (full.disk_state === 'modified') {
      showSaveConflictModal(idx);
      return;
    }

    snapshot = await api.saveActiveFile();
  }

  async function menuSaveAs() {
    const idx = contextMenu.index;
    closeContextMenu();
    await api.switchTab(idx);
    await refresh();
    await handleSaveAs();
  }

//   复制路径
  async function menuCopyPath() {
    const idx = contextMenu.index;
    const path = await api.getTabPath(idx);
    closeContextMenu();
    if (!path) return;
    try {
      await writeText(path);
    } catch (e) {
      console.error('复制路径失败：', e);
    }
  }
// 打开文件夹
  async function menuRevealInExplorer() {
    const idx = contextMenu.index;
    const path = await api.getTabPath(idx);
    closeContextMenu();
    if (!path) return;
    try {
      await revealItemInDir(path);
    } catch (e) {
      console.error('打开文件夹失败：', e);
    }
  }

  // 队列调度
  async function startCloseQueue(ids: string[]) {
    if (ids.length === 0) return;
    if (closeQueueActive) return;  // 防止重复触发
    closeQueueActive = true;
    closeQueue = [...ids];
    await processNextClose();
  }

  async function processNextClose() {
    if (closeQueue.length === 0) {
      closeQueueActive = false;
      return;
    }

    const tabId = closeQueue.shift()!;
    await flushPendingEdit();
    await refresh();

    const idx = snapshot.tab_ids.indexOf(tabId);
    if (idx === -1) {
      return processNextClose();
    }

    const isDirty = snapshot.tab_dirty_states[idx] ?? false;
    const isUnnamed = snapshot.tab_unnamed_states[idx] ?? false;

    if (!isDirty) {
      await api.closeTab(idx);
      await refresh();
      return processNextClose();
    }

    // ★ 新增：已命名 + modified → 弹 5 按钮冲突框（关闭模式）
    if (!isUnnamed) {
      const full = await api.checkTabFullState(idx);
      if (full.disk_state === 'modified') {
        // 方案 A：先切到该标签，让用户看清冲突
        await api.switchTab(idx);
        await refresh();

        showSaveConflictModal(
          idx,
          'close',
          async () => {
            // onComplete：用户处理完（覆盖/放弃）→ 关闭该标签，继续队列
            await api.closeTab(idx);
            await refresh();
            processNextClose();
          },
          () => {
            // onAbort：用户中止（对比/另存为/取消）→ 清空队列
            closeQueue = [];
            closeQueueActive = false;
          }
        );
        return;
      }
    }

    // 其它脏标签（含未命名）→ 弹"是否保存"
    const title = snapshot.tab_titles[idx] ?? t('tab.unnamed_fallback', undefined, get(resolvedLocale));
    const message = isUnnamed
      ? t('dialog.ask_save_unnamed', { title })
      : t('dialog.ask_save_named', { title });

    modal = {
      visible: true,
      title: message,
      rows: [
        [
          { label: t('dialog.close_confirm'), style: 'primary', action: () => queueSaveAndClose(idx, isUnnamed) },
          { label: t('dialog.close_cancel'), action: () => queueDiscardAndClose(idx) },
          { label: t('dialog.cancel'), action: queueCancel },
        ],
      ],
    };
  }

  async function queueSaveAndClose(idx: number, isUnnamed: boolean) {
    closeModal();
    await api.switchTab(idx);
    await refresh();

    if (isUnnamed) {
      const path = await save({
        defaultPath: snapshot.default_save_path,
        filters: [
            { name: t('dialog.filter.text_files', undefined, get(resolvedLocale)), extensions: ['txt'] },
            { name: t('dialog.filter.all_files', undefined, get(resolvedLocale)), extensions: ['*'] },
        ],
      });
      if (!path) {
        // 用户取消文件对话框 → 中止整个队列
        closeQueue = [];
        closeQueueActive = false;
        return;
      }
      try {
        await api.saveActiveFileAs(path);
      } catch (e) {
        if (e === "FileAlreadyOpen") {
          modal = { visible: true, title: t('dialog.save_as_conflict', { path }, get(resolvedLocale)), rows: [[{ label: t('dialog.ok'), style: 'primary', action: closeModal }]] };
          // 保存失败，中止当前关闭队列
          closeQueue = [];
          closeQueueActive = false;
          return;
        } else {
          console.error('保存失败：', e);
          closeQueue = [];
          closeQueueActive = false;
          return;
        }
      }
    } else {
      await api.saveActiveFile();
    }

    await api.closeTab(idx);
    await refresh();
    processNextClose();
  }

  async function queueDiscardAndClose(idx: number) {
    closeModal();
    await api.closeTab(idx);
    await refresh();
    processNextClose();
  }

  function queueCancel() {
    closeModal();
    closeQueue = [];
    closeQueueActive = false;
  }  

  // ============ 关闭窗口 ============
  async function handleWindowClose(event: { preventDefault: () => void }) {
    event.preventDefault();

    try {
      await flushPendingEdit();
      await refresh();

      const largeDirtyIds = await api.getLargeDirtyTabs();

      if (largeDirtyIds.length === 0) {
        try {
          await api.saveAndPrepareExit();
        } catch (e) {
          console.error('关闭失败：', e);
        }
        return;
      }

      closeQueueTabIds = [...largeDirtyIds];
      await processNextLargeTabClose();
    } catch (e) {
      console.error('关闭失败：', e);
    }
  }

  async function processNextLargeTabClose() {
    if (closeQueueTabIds.length === 0) {
      await api.saveAndPrepareExit();
      // save_and_prepare_exit 内部会调用 app.exit(0)
      return;
    }

    const tabId = closeQueueTabIds.shift()!;
    const idx = snapshot.tab_ids.indexOf(tabId);
    if (idx === -1) {
      return processNextLargeTabClose();
    }

    const title = snapshot.tab_titles[idx] ?? t('tab.unnamed_fallback', undefined, get(resolvedLocale));
    modal = {
      visible: true,
      title: t('dialog.large_close', { title }),
      rows: [
        [
          { label: t('dialog.large_close_yes'), style: 'primary', action: () => largeTabSave(idx) },
          { label: t('dialog.large_close_no'), action: () => largeTabDiscard(idx) },
          { label: t('dialog.cancel'), action: largeTabCancel },
        ],
      ],
    };
  }

  async function largeTabSave(idx: number) {
    closeModal();
    try {
      await api.switchTab(idx);
      await refresh();
      await api.saveActiveFile();
    } catch (e) {
      if (e === "NeedsSaveAs") {
        // ★ 遇到不可达状态，引导用户另存为
        await handleSaveAs(); // 注意：这会切换当前激活标签
      } else {
        console.error('保存失败：', e);
        closeQueueTabIds = [];
        return;
      }
    }
    await processNextLargeTabClose();
  }

  async function largeTabDiscard(idx: number) {
    closeModal();
    try {
      await api.discardTabChanges(idx);
    } catch (e) {
      console.error('丢弃修改失败：', e);
    }
    await processNextLargeTabClose();
  }

  function largeTabCancel() {
    closeModal();
    closeQueueTabIds = [];
    // 不关闭窗口
  }  

  async function saveAndClose(i: number, isUnnamed: boolean) {
    closeModal();

    // 先切到该标签（这样保存命令操作的是它）
    await api.switchTab(i);
    await refresh();

    if (isUnnamed) {
      // 未命名 → 走另存为
      const path = await save({
        defaultPath: snapshot.default_save_path,
        filters: [
            { name: t('dialog.filter.text_files', undefined, get(resolvedLocale)), extensions: ['txt'] },
            { name: t('dialog.filter.all_files', undefined, get(resolvedLocale)), extensions: ['*'] },
        ],
      });
      if (!path) return;  // 用户取消 → 不关闭
      await api.saveActiveFileAs(path);
    } else {
      await api.saveActiveFile();
    }

    await api.closeTab(i);
    await refresh();
  }

  async function discardAndClose(i: number) {
    closeModal();
    await api.closeTab(i);
    await refresh();
  }
  

  function handleTextChange(text: string) {
    // ★ 乐观更新：先设为脏，给用户即时反馈
    const newDirtyStates = [...snapshot.tab_dirty_states];
    newDirtyStates[snapshot.active_index] = true;
    snapshot = {
      ...snapshot,
      active_text: text,
      is_dirty: true,
      tab_dirty_states: newDirtyStates,
    };
    pendingText = text;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      flushPendingEdit();
    }, 500);
  }

  // 窗口标题：跟随激活标签
  $: {
    const idx = snapshot.active_index;
    const titles = snapshot.tab_titles;
    if (titles && titles.length > 0 && idx >= 0 && idx < titles.length) {
      const isDirty = snapshot.tab_dirty_states?.[idx] ?? false;
      const path = snapshot.tab_paths?.[idx] ?? '';
      const title = titles[idx] ?? '';
      const name = path || title;
      const prefix = isDirty ? '● ' : '';
      getCurrentWindow()
        .setTitle(`${prefix}${name} - FinchPad`)
        .catch(console.error);
    }
  }  

  async function handleLoadPending() {
    if (!snapshot.is_pending_load) return;
    snapshot = await api.loadPendingTab(snapshot.active_index);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  async function handleOpen() {
    const selected = await open({
      multiple: true,
      defaultPath: snapshot.last_used_path || undefined,
      filters: [
        { name: t('dialog.filter.all_files', undefined, get(resolvedLocale)), extensions: ['*'] },
        { name: t('dialog.filter.text_files', undefined, get(resolvedLocale)), extensions: ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'py', 'log', 'yaml', 'yml', 'ini', 'conf', 'toml', 'sh', 'bat', 'ps1', 'rs', 'java', 'c', 'cpp', 'h', 'hpp', 'go', 'php', 'rb', 'swift', 'kt'] },
      ],
    });
    if (!selected) return;
    const paths = Array.isArray(selected) ? selected : [selected];
    await flushPendingEdit();
    snapshot = await api.openFiles(paths);
  }

  async function handleSave() {
    // 弹窗已显示时忽略快捷键，避免弹窗重叠
    if (modal.visible) return;
    await flushPendingEdit();
    await refresh();

    // 未命名 + 空/回到初始 → 无动作
    if (snapshot.is_unnamed && !snapshot.is_dirty) return;
    // 未命名 + 有内容 → 走另存为
    if (snapshot.is_unnamed) {
      await handleSaveAs();
      return;
    }
    // 已命名 + 干净 → 无动作
    if (!snapshot.is_dirty) return;

    // 已命名 + 脏 → 检查磁盘状态
    const idx = snapshot.active_index;
    const full = await api.checkTabFullState(idx);

    switch (full.disk_state) {
      case 'normal':
        try {
          snapshot = await api.saveActiveFile();
        } catch (e) {
          // ★ 处理竞态条件：检查状态到保存之间，U盘可能被拔了
          if (e === "NeedsSaveAs") {
            await handleSaveAs();
          } else {
            console.error('保存失败：', e);
          }
        }
        break;
      case 'deleted':
        // 文件已被外部删除，直接走另存为（安全兜底，防止覆盖空内容）
        await handleSaveAs();
        break;
      case 'unreachable':
        // 位置不可达 → 自动走另存为
        await handleSaveAs();
        break;
      case 'modified':
        // 冲突 → 弹 5 按钮框
        showSaveConflictModal(idx);
        break;
    }
  }

  async function handleSaveAs() {
    await flushPendingEdit();
    await refresh();

    // 未命名 + 空/回到初始 → 无动作
    if (snapshot.is_unnamed && !snapshot.is_dirty) return;

    // 其它情况：弹另存为
    const path = await save({
      defaultPath: snapshot.default_save_path,
        filters: [
            { name: t('dialog.filter.text_files', undefined, get(resolvedLocale)), extensions: ['txt'] },
            { name: t('dialog.filter.all_files', undefined, get(resolvedLocale)), extensions: ['*'] },
        ],
    });
    if (!path) return;
    
    // ★ 捕获后端错误
    try {
      snapshot = await api.saveActiveFileAs(path);
    } catch (e) {
      if (e === "FileAlreadyOpen") {
        modal = {
          visible: true,
          title: t('dialog.save_as_conflict', { path }, get(resolvedLocale)),
          rows: [
            [
              { label: t('dialog.ok'), style: 'primary', action: closeModal }
            ]
          ]
        };
      } else {
        console.error('另存为失败：', e);
      }
    }
  }

  function showSaveConflictModal(
    idx: number,
    mode: 'save' | 'close' = 'save',
    onComplete?: () => void,
    onAbort?: () => void
  ) {
    const isCloseMode = mode === 'close';
    const secondLabel = isCloseMode
      ? t('dialog.conflict_discard_close')
      : t('dialog.conflict_discard');

    // ★ 新增：从 snapshot 取路径（优先完整路径，回退到标题）
    const filePath = snapshot.tab_paths[idx] || snapshot.tab_titles[idx] || '';
    const modalTitle = t('dialog.conflict_title', { path: filePath });

    modal = {
      visible: true,
      title: modalTitle,
      rows: [
        // 第一排：2 个大按钮
        [
          {
            label: t('dialog.conflict_overwrite'),
            style: 'primary',
            size: 'large',
            action: async () => {
              await overwriteDisk();
              onComplete?.();
            },
          },
          {
            label: secondLabel,
            style: 'primary',
            size: 'large',
            action: async () => {
              if (isCloseMode) {
                closeModal();
                onComplete?.();
              } else {
                await discardAndReload(idx);
              }
            },
          },
        ],
        // 第二排：3 个小按钮
        [
          {
            label: t('dialog.conflict_compare'),
            size: 'small',
            action: async () => {
              await openConflictDiff(idx);
              onAbort?.();
            },
          },
          {
            label: t('dialog.conflict_save_as'),
            size: 'small',
            action: async () => {
              await saveAsFromConflict();
              onAbort?.();
            },
          },
          {
            label: t('dialog.cancel'),
            size: 'small',
            action: () => {
              closeModal();
              onAbort?.();
            },
          },
        ],
      ],
      onAbort,  // ★ 存到 modal 对象里
    };
  }

  /** 覆盖磁盘：用编辑器内容强制写盘 */
  async function overwriteDisk() {
    closeModal();
    try {
      snapshot = await api.saveActiveFile();
    } catch (e) {
      console.error('覆盖保存失败:', e);
    }
  }

  /** 放弃修改：重载磁盘版本 */
  async function discardAndReload(idx: number) {
    closeModal();
    snapshot = await api.reloadTab(idx);
  }

  /** 从冲突框走另存为 */
  async function saveAsFromConflict() {
    closeModal();
    await handleSaveAs();
  }

  function handleStats(
    lineCount: number,
    charCount: number,
    selCount: number,
    selLineCount: number
  ) {
    snapshot = { ...snapshot, line_count: lineCount, char_count: charCount };
    selectedCount = selCount;
    selectedLineCount = selLineCount;
  }

  // ============ 缩放 ============
  function applyZoomDelta(delta: number) {
    setZoomValue(zoom + delta);
  }

  function setZoomValue(value: number) {
    const clamped = Math.max(50, Math.min(400, value));
    if (clamped === zoom) return;
    zoom = clamped;
    api.setZoom(clamped).catch(console.error);
  }

  async function handleToggleWordWrap() {
    // 大文件不允许切换
    if (snapshot.large_file) return;
    wordWrap = !wordWrap;
    await api.setWordWrap(wordWrap);
  }  

  // ============ 标签切换 ============
  function switchToNextTab() {
    const n = snapshot.tab_titles.length;
    if (n <= 1) return;
    const next = (snapshot.active_index + 1) % n;
    handleSelect(next);
  }

  function switchToPrevTab() {
    const n = snapshot.tab_titles.length;
    if (n <= 1) return;
    const prev = (snapshot.active_index - 1 + n) % n;
    handleSelect(prev);
  }  

  /** 把当前 pending 的编辑同步给 Rust；如果没有则什么也不做 */
  async function flushPendingEdit() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (pendingText === null) return;
    const text = pendingText;
    pendingText = null;

    // ★ 后端返回真实脏状态（输入后删除 → false）
    const isDirty = await api.updateActiveText(text);

    // 用真实值覆盖乐观更新
    const idx = snapshot.active_index;
    const newDirtyStates = [...snapshot.tab_dirty_states];
    newDirtyStates[idx] = isDirty;
    snapshot = {
      ...snapshot,
      is_dirty: isDirty,
      tab_dirty_states: newDirtyStates,
    };
  }

  // 拖拽
  async function setupDragDrop() {
    const webview = getCurrentWebview();
    const unlisten = await webview.onDragDropEvent(async (event) => {
      if (event.payload.type === 'drop') {
        const paths = event.payload.paths;
        if (!paths || paths.length === 0) return;
        await flushPendingEdit();
        snapshot = await api.openFiles(paths);
      }
      // 'over' / 'leave' 事件目前不处理，后续可用来显示拖拽悬停提示
    });
    return unlisten;
  }

//保存关闭相关
  type ModalButton = {
    label: string;
    style?: 'primary' | 'secondary';
    size?: 'large' | 'small';
    action: () => void | Promise<void>;
  };
  type ModalState = {
    visible: boolean;
    title: string;
    rows: ModalButton[][];
    onAbort?: () => void;
  };
  let modal: ModalState = { visible: false, title: '', rows: [] };

  // ============ 对比视图 ============
  type DiffState = {
    visible: boolean;
    mode: 'tabs' | 'disk';
    leftTitle: string;
    rightTitle: string;
    leftContent: string;
    rightContent: string;
    // tabs 模式：左右标签索引
    leftIndex: number;
    rightIndex: number;
    // disk 模式：冲突标签索引
    conflictIdx: number;
  };
  let diffState: DiffState = {
    visible: false,
    mode: 'tabs',
    leftTitle: '',
    rightTitle: '',
    leftContent: '',
    rightContent: '',
    leftIndex: -1,
    rightIndex: -1,
    conflictIdx: -1,
  };

  function closeDiff() {
    diffState = { ...diffState, visible: false };
  }

  async function openTabDiff(leftIndex: number, rightIndex: number) {
    // 防止自己和自己对比，并确保索引有效
    if (leftIndex === rightIndex || leftIndex < 0 || rightIndex < 0) return;

    closeDiffSubmenu();
    closeContextMenu();

    // 优先显示完整路径，无路径时回退到标题
    const leftTitle = snapshot.tab_paths[leftIndex] || snapshot.tab_titles[leftIndex] || '';
    const rightTitle = snapshot.tab_paths[rightIndex] || snapshot.tab_titles[rightIndex] || '';

    try {
      // 必须通过 api 获取左侧内容，因为左侧可能是非激活标签（B）
      const leftContent = await api.getTabContent(leftIndex);
      const rightContent = await api.getTabContent(rightIndex);
      
      await api.openDiffWindow({
        mode: 'tabs',
        left_title: leftTitle,
        right_title: rightTitle,
        left_content: leftContent,
        right_content: rightContent,
        conflict_idx: -1,
      });
    } catch (e) {
      console.error('打开对比失败：', e);
    }
  }

  async function openConflictDiff(idx: number) {
    closeModal();
    try {
      const diskContent = await api.getDiskContent(idx);
      const editorContent = snapshot.active_text;
      const title = snapshot.tab_paths[idx] || snapshot.tab_titles[idx] || '';
      const diskLabel = t('diff.left_disk', undefined, get(resolvedLocale));
      const editorLabel = t('diff.right_editor', undefined, get(resolvedLocale));
      await api.openDiffWindow({
        mode: 'disk',
        left_title: `${diskLabel} · ${title}`,
        right_title: `${editorLabel} · ${title}`,
        left_content: diskContent,
        right_content: editorContent,
        conflict_idx: idx,
      });
    } catch (e) {
      console.error('打开对比失败：', e);
    }
  }

  /** 冲突模式：保留我的修改 */
  async function diffKeepMine() {
    closeDiff();
    // 什么都不做——用户保留内存内容
  }

  /** 冲突模式：采用磁盘版本 */
  async function diffUseDisk() {
    const idx = diffState.conflictIdx;
    closeDiff();
    if (idx < 0) return;
    snapshot = await api.reloadTab(idx);
  }

  type DiffSubmenuState = {
    visible: boolean;
    anchorLeft: number;
    anchorRight: number;
    anchorTop: number;
  };
  let diffSubmenu: DiffSubmenuState = {
    visible: false,
    anchorLeft: 0,
    anchorRight: 0,
    anchorTop: 0,
  };
  let diffSubmenuCloseTimer: ReturnType<typeof setTimeout> | null = null;

  // 语言二级菜单
  type LangSubmenuState = { visible: boolean; anchorLeft: number; anchorRight: number; anchorTop: number; };
  let langSubmenu: LangSubmenuState = { visible: false, anchorLeft: 0, anchorRight: 0, anchorTop: 0 };

  // ★ 新增：点击触发二级菜单
  function toggleLangSubmenu(e: MouseEvent) {
    if (langSubmenu.visible) {
      langSubmenu.visible = false;
      return;
    }
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    langSubmenu = { visible: true, anchorLeft: rect.left, anchorRight: rect.right, anchorTop: rect.top };
  }

  function selectLanguage(choice: LocaleChoice) {
    langSubmenu.visible = false;
    setLocale(choice);
  }
  // 语言二级菜单  

  // ★ 任何 modal 打开时为 true，用于屏蔽全局快捷键
  $: isAnyModalOpen = modal.visible
    || aboutVisible
    || settingsMenu.visible
    || editorContextMenu.visible
    || contextMenu.visible
    || barContextMenu.visible
    || diffSubmenu.visible
    || renamingIndex !== -1
    || langSubmenu.visible

  function closeDiffSubmenu() {
    if (diffSubmenuCloseTimer) {
      clearTimeout(diffSubmenuCloseTimer);
      diffSubmenuCloseTimer = null;
    }
    diffSubmenu = { visible: false, anchorLeft: 0, anchorRight: 0, anchorTop: 0 };
  }

  /** hover 打开子菜单 */
  function showDiffSubmenu(e: MouseEvent) {
    if (diffSubmenuCloseTimer) {
      clearTimeout(diffSubmenuCloseTimer);
      diffSubmenuCloseTimer = null;
    }
    if (snapshot.tab_titles.length <= 1) return;

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    diffSubmenu = {
      visible: true,
      anchorLeft: rect.left,
      anchorRight: rect.right,
      anchorTop: rect.top,
    };
  }

  /** 延迟关闭（给鼠标时间移动到子菜单） */
  function scheduleCloseDiffSubmenu() {
    if (diffSubmenuCloseTimer) clearTimeout(diffSubmenuCloseTimer);
    diffSubmenuCloseTimer = setTimeout(() => {
      diffSubmenu = { visible: false, anchorLeft: 0, anchorRight: 0, anchorTop: 0 };
      diffSubmenuCloseTimer = null;
    }, 250);
  }

  /** 鼠标进入子菜单时取消关闭 */
  function cancelCloseDiffSubmenu() {
    if (diffSubmenuCloseTimer) {
      clearTimeout(diffSubmenuCloseTimer);
      diffSubmenuCloseTimer = null;
    }
  }

  function selectDiffTarget(rightIndex: number) {
    const leftIndex = contextMenu.index; // 捕获右键点击的基准标签（B）
    closeDiffSubmenu();
    closeContextMenu();
    openTabDiff(leftIndex, rightIndex);  // 传入基准标签和右侧选择的标签
  }

  type ContextMenuState = {
    visible: boolean;
    index: number;
    left: number | null;
    right: number | null;
    top: number;
  };
  let contextMenu: ContextMenuState = {
    visible: false,
    index: -1,
    left: 0,
    right: null,
    top: 0,
  };

  // 关闭队列
  let closeQueue: string[] = [];
  let closeQueueActive = false;

  function closeContextMenu() {
    contextMenu = { visible: false, index: -1, left: 0, right: null, top: 0 };
    diffSubmenu = { visible: false, anchorLeft: 0, anchorRight: 0, anchorTop: 0 };
  }

  /** 修正菜单位置，避免超出窗口右/下边界 */
  function clampMenuPos(
    x: number,
    y: number,
    menuWidth: number,
    menuHeight: number
  ): { left: number | null; right: number | null; top: number } {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const margin = 8;

    let left: number | null = x;
    let right: number | null = null;

    if (x + menuWidth + margin > winW) {
      // 靠右 → 用 right 定位，菜单右边缘贴住鼠标
      left = null;
      right = winW - x;
      // 如果鼠标也靠左（菜单宽度大于剩余空间），兜底贴左
      if (right + menuWidth + margin > winW) {
        left = margin;
        right = null;
      }
    }

    let top = y;
    if (y + menuHeight + margin > winH) {
      top = Math.max(margin, winH - menuHeight - margin);
    }

    return { left, right, top };
  }  

  function handleModalDismiss() {
    const abort = modal.onAbort;
    closeModal();
    abort?.();
  }


  function closeModal() {
    modal = { visible: false, title: '', rows: [] };
  }
  
  
  onMount(() => {
    // autosave 定时器：每秒 tick 一次
    const autosaveTimer = setInterval(() => {
      api.tickAutosave().catch(console.error);
    }, 1000);

    // 1. 尝试恢复会话 → 处理启动文件 → 显示窗口
    (async () => {
      try {
        const restored = await api.restoreSession();
        if (restored) {
          snapshot = restored;
          zoom = restored.zoom;
          wordWrap = restored.word_wrap;
          showLineNumbers = restored.show_line_numbers;
          editorBg = restored.editor_bg;
          currentTheme.set(restored.editor_bg);
          // 恢复用户语言选择
          if (restored.locale_choice) {
            setLocaleChoice(restored.locale_choice as LocaleChoice);
            // 同步后端 locale 和模板（此时 localeChoice 已是恢复后的值）
            const actualLocale = get(resolvedLocale);
            const actualTemplate = t('tab.unnamed', undefined, actualLocale);
            await api.setLocale(actualLocale, actualTemplate, get(localeChoice));
          }
        } else {
          await refresh();
          const actualLocale = get(resolvedLocale);
          const actualTemplate = t('tab.unnamed', undefined, actualLocale);
          await api.setLocale(actualLocale, actualTemplate, get(localeChoice));
        }

        // 处理启动文件（双击 .txt 启动时的文件参数）
        const startupFiles = await api.takeStartupFiles();
        if (startupFiles.length > 0) {
          snapshot = await api.openFiles(startupFiles);
        }
      } catch (e) {
        console.error('启动流程失败：', e);
        try {
          await refresh();
        } catch (e2) {
          console.error('刷新失败：', e2);
        }
      } finally {
        try {
          await api.showWindow();
        } catch (e) {
          console.error('显示窗口失败：', e);
        }
      }
    })();

    // 2. 启动拖拽监听
    setupDragDrop().catch(console.error);
        // 监听窗口焦点
    const handleFocus = () => { isWindowFocused = true; };
    const handleBlur = () => { isWindowFocused = false; };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // 3. 外部变化检测
    const handleDetect = () => {
      // ★ 新增：如果正在重命名，或者有弹窗，不去检测，防止干扰 DOM 和状态
      if (isAnyModalOpen || renamingIndex !== -1) return;
      detectExternalChanges().catch(console.error);
    };
    window.addEventListener('focus', handleDetect);
    window.addEventListener('mousedown', handleDetect);

    // 4. 关闭窗口监听
    let unlistenClose: (() => void) | null = null;
    getCurrentWindow()
      .onCloseRequested(handleWindowClose)
      .then((fn) => {
        unlistenClose = fn;
      })
      .catch(console.error);

    // 5. 单实例事件监听（第二次启动转发过来的文件）
    let unlistenSingleInstance: (() => void) | null = null;
    listen<string[]>('single-instance-files', async (event) => {
      if (!event.payload || event.payload.length === 0) return;
      try {
        await flushPendingEdit();
        snapshot = await api.openFiles(event.payload);
      } catch (e) {
        console.error('单实例打开文件失败：', e);
      }
    })
      .then((fn) => {
        unlistenSingleInstance = fn;
      })
      .catch(console.error);

    // 6. 监听主窗口的外部更新（来自对比窗口的"采用磁盘版本"）
    let unlistenWorkspaceUpdate: (() => void) | null = null;
    listen('workspace-updated', async () => {
      await refresh();
    })
      .then((fn) => {
        unlistenWorkspaceUpdate = fn;
      })
      .catch(console.error);

    // 7. 清理函数（必须放最后）
    return () => {
      window.removeEventListener('focus', handleDetect);
      window.removeEventListener('mousedown', handleDetect);
      if (unlistenClose) unlistenClose();
      clearInterval(autosaveTimer);
      if (unlistenSingleInstance) unlistenSingleInstance();
    };
  });
  </script>

<svelte:window
  on:keydown={(e) => {
    // ★ 弹窗打开时，屏蔽除 Escape 外的所有快捷键
    if (isAnyModalOpen) {
      if (e.key === 'Escape') {
        if (modal.visible) handleModalDismiss();
        else if (aboutVisible) aboutVisible = false;
        else if (settingsMenu.visible) closeSettingsMenu();
        else if (editorContextMenu.visible) closeEditorContextMenu();
        else if (contextMenu.visible) closeContextMenu();
        else if (barContextMenu.visible) closeBarContextMenu();
        e.preventDefault();
      }
      return;
    }

    // 屏蔽 F2 键，防止触发浏览器的默认聚焦行为
    if (e.key === 'F2') {
      e.preventDefault();
      return;
    }    

    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const key = e.key.toLowerCase();

    // Ctrl+F / Ctrl+H 转交给 Monaco（避免 WebView2 弹出浏览器自带查找）
    if (key === 'f' && !e.shiftKey) {
      e.preventDefault();
      editorRef?.execEditorAction('find');
      return;
    }
    if (key === 'h' && !e.shiftKey) {
      e.preventDefault();
      editorRef?.execEditorAction('replace');
      return;
    }

    // 文件操作
    if (key === 'n' && !e.shiftKey) {
      e.preventDefault();
      handleNew();
    } else if (key === 'o' && !e.shiftKey) {
      e.preventDefault();
      handleOpen();
    } else if (key === 's' && e.shiftKey) {
      e.preventDefault();
      handleSaveAs();
    } else if (key === 's') {
      e.preventDefault();
      handleSave();
    } else if (key === 'w' && e.shiftKey) {
      e.preventDefault();
      getCurrentWindow().close();
    } else if (key === 'w') {
      e.preventDefault();
      handleClose(snapshot.active_index);
    }
    // 标签切换
    else if (key === 'tab' && e.shiftKey) {
      e.preventDefault();
      switchToPrevTab();
    } else if (key === 'tab') {
      e.preventDefault();
      switchToNextTab();
    }
    // 缩放
    else if (key === '=' || key === '+') {
      e.preventDefault();
      applyZoomDelta(+10);
    } else if (key === '-' || key === '_') {
      e.preventDefault();
      applyZoomDelta(-10);
    } else if (key === '0') {
      e.preventDefault();
      setZoomValue(100);
    }
    // Ctrl+1~9
    else if (/^[1-9]$/.test(key)) {
      const idx = parseInt(key, 10) - 1;
      if (idx < snapshot.tab_titles.length) {
        e.preventDefault();
        handleSelect(idx);
      }
    }
  }}
/>

<main data-locale={$resolvedLocale}>
  <TabBar
    titles={snapshot.tab_titles}
    activeIndex={snapshot.active_index}
    dirtyStates={snapshot.tab_dirty_states}
    paths={snapshot.tab_paths}
    onSelect={handleSelect}
    onClose={handleClose}
    onNew={handleNew}
    onContextMenu={handleContextMenu}
    onReorder={handleReorder}
    onBarContextMenu={handleBarContextMenu}
    onSettingsClick={handleSettingsClick}
    renamingIndex={renamingIndex}
    onRenameCommit={handleRenameCommit}
    onRenameCancel={handleRenameCancel}
    isWindowFocused={isWindowFocused}
  />

  <div class="editor-area">
    <Editor
      bind:this={editorRef}
      value={snapshot.active_text}
      language={snapshot.language_id}
      largeFile={snapshot.large_file}
      isPendingLoad={snapshot.is_pending_load}
      fileSize={snapshot.file_size}
      zoom={zoom}
      wordWrap={wordWrap && !snapshot.large_file}
      showLineNumbers={showLineNumbers}
      editorBg={editorBg}      
      onChange={handleTextChange}
      onStats={handleStats}
      onLoadRequest={handleLoadPending}
      onZoomDelta={applyZoomDelta}
      onEditorContextMenu={handleEditorContextMenu}
    />
  </div>

  <div style="margin-top: -1px; position: relative; z-index: 2;">
        <StatusBar
            lineCount={snapshot.line_count}
            charCount={snapshot.char_count}
            selectedCount={selectedCount}
            selectedLineCount={selectedLineCount}    
            encoding={snapshot.encoding}
            lineEnding={snapshot.line_ending}
            isDirty={snapshot.is_dirty}
            diskState={snapshot.disk_state}
            zoom={zoom}
            wordWrap={wordWrap}
            wordWrapDisabled={snapshot.large_file}
            onToggleWordWrap={handleToggleWordWrap}
            onZoomChange={setZoomValue}
        />
    </div>


  {#if contextMenu.visible}
    {@const cmIndex = contextMenu.index}
    {@const cmTabCount = snapshot.tab_titles.length}
    {@const cmIsDirty = snapshot.tab_dirty_states[cmIndex] ?? false}
    {@const cmIsUnnamed = snapshot.tab_unnamed_states[cmIndex] ?? false}
    {@const cmCanCloseOthers = cmTabCount > 1}
    {@const cmCanCloseLeft = cmIndex > 0}
    {@const cmCanCloseRight = cmIndex < cmTabCount - 1}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="context-overlay"
      onclick={closeContextMenu}
      oncontextmenu={(e) => { e.preventDefault(); closeContextMenu(); }}
      role="presentation"
    >
      <div
        class="context-menu"
        style="{contextMenu.left !== null
          ? `left: ${contextMenu.left}px;`
          : `right: ${contextMenu.right}px;`} top: {contextMenu.top}px;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        role="menu"
        tabindex="-1"
      >
        <button class="context-item" class:disabled={!cmIsDirty} disabled={!cmIsDirty} onclick={menuSave}>
          <span>{t('tab_menu.save')}</span><span class="shortcut">{mod}+S</span>
        </button>
        <button class="context-item" class:disabled={cmIsUnnamed && !cmIsDirty} disabled={cmIsUnnamed && !cmIsDirty} onclick={menuSaveAs}>
          <span>{t('tab_menu.save_as')}</span><span class="shortcut">{mod}+Shift+S</span>
        </button>

        <div class="context-divider"></div>

        <button
          class="context-item"
          class:disabled={cmTabCount <= 1}
          disabled={cmTabCount <= 1}
          onmouseenter={(e) => showDiffSubmenu(e)}
          onmouseleave={scheduleCloseDiffSubmenu}
        >
          <span>{t('tab_menu.diff')}</span>
          <span class="shortcut">▸</span>
        </button>

        <div class="context-divider"></div>

        <button class="context-item" onclick={menuCloseSingle}>
          <span>{t('tab_menu.close')}</span><span class="shortcut">{mod}+W</span>
        </button>
        <button class="context-item" class:disabled={!cmCanCloseOthers} disabled={!cmCanCloseOthers} onclick={menuCloseOthers}>
          <span>{t('tab_menu.close_others')}</span>
        </button>
        <button class="context-item" class:disabled={!cmCanCloseLeft} disabled={!cmCanCloseLeft} onclick={menuCloseLeft}>
          <span>{t('tab_menu.close_left')}</span>
        </button>
        <button class="context-item" class:disabled={!cmCanCloseRight} disabled={!cmCanCloseRight} onclick={menuCloseRight}>
          <span>{t('tab_menu.close_right')}</span>
        </button>

        <div class="context-divider"></div>

        <button
          class="context-item"
          class:disabled={cmIsUnnamed}
          disabled={cmIsUnnamed}
          onclick={() => {
            const idx = contextMenu.index;
            closeContextMenu();
            renamingIndex = idx;
          }}
        >
          <span>{t('tab_menu.rename')}</span>
        </button>

        <button class="context-item" class:disabled={cmIsUnnamed} disabled={cmIsUnnamed} onclick={menuCopyPath}>
          <span>{t('tab_menu.copy_path')}</span>
        </button>
        <button class="context-item" class:disabled={cmIsUnnamed} disabled={cmIsUnnamed} onclick={menuRevealInExplorer}>
          <span>{t('tab_menu.reveal_in_explorer')}</span>
        </button>
      </div>
    </div>
  {/if}

  {#if barContextMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="context-overlay"
      onclick={closeBarContextMenu}
      oncontextmenu={(e) => { e.preventDefault(); closeBarContextMenu(); }}
      role="presentation"
    >
      <div
        class="context-menu"
        style="{barContextMenu.left !== null
          ? `left: ${barContextMenu.left}px;`
          : `right: ${barContextMenu.right}px;`} top: {barContextMenu.top}px;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        role="menu"
        tabindex="-1"
      >
        <button class="context-item" onclick={barMenuNew}>
          <span>{t('bar_menu.new')}</span><span class="shortcut">{mod}+N</span>
        </button>
        <button class="context-item" onclick={barMenuOpen}>
          <span>{t('bar_menu.open')}</span><span class="shortcut">{mod}+O</span>
        </button>
      </div>
    </div>
  {/if}

  {#if diffSubmenu.visible}
    {@const ddW = 200}
    {@const ddH = Math.min((snapshot.tab_titles.length - 1) * 32 + 8, 400)}
    {@const hasRight = diffSubmenu.anchorRight + ddW + 8 <= window.innerWidth}
    {@const ddLeft = hasRight
      ? diffSubmenu.anchorRight + 4
      : Math.max(8, diffSubmenu.anchorLeft - ddW - 4)}
    {@const ddTop = Math.max(8, Math.min(diffSubmenu.anchorTop, window.innerHeight - ddH - 8))}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="context-overlay"
      onclick={() => { closeDiffSubmenu(); closeContextMenu(); }}
      oncontextmenu={(e) => { e.preventDefault(); closeDiffSubmenu(); closeContextMenu(); }}
      role="presentation"
    >
      <div
        class="context-menu"
        style="left: {ddLeft}px; top: {ddTop}px; max-height: 400px; overflow-y: auto;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        onmouseenter={cancelCloseDiffSubmenu}
        onmouseleave={scheduleCloseDiffSubmenu}
        role="menu"
        tabindex="-1"
      >
        {#each snapshot.tab_titles as title, idx}
          {#if idx !== contextMenu.index}
            <button
              class="context-item"
              onclick={() => selectDiffTarget(idx)}
            >
              <span>{title}</span>
            </button>
          {/if}
        {/each}

      </div>
    </div>
  {/if}
  
  {#if settingsMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="context-overlay"
      onclick={closeSettingsMenu}
      oncontextmenu={(e) => { e.preventDefault(); closeSettingsMenu(); }}
      role="presentation"
    >
      <div
        class="context-menu settings-menu"
        style="right: {window.innerWidth - settingsMenu.anchorRight}px; top: {settingsMenu.anchorBottom + 4}px;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        role="menu"
        tabindex="-1"
      >
        <div class="settings-group-title">{t('settings.view')}</div>
        <button class="context-item" onclick={toggleShowLineNumbers}>
          <span>{t('settings.show_line_numbers')}</span>
          <span class="check">{showLineNumbers ? '✔' : ''}</span>
        </button>
        <button
          class="context-item"
          class:disabled={snapshot.large_file}
          disabled={snapshot.large_file}
          onclick={toggleWordWrapFromSettings}
        >
          <span>{t('settings.word_wrap')}</span>
          <span class="check">{wordWrap && !snapshot.large_file ? '✔' : ''}</span>
        </button>

        <div class="context-divider"></div>

        <div class="settings-group-title">{t('settings.theme')}</div>
        {#each THEME_ORDER as key}
          <button class="context-item" onclick={() => setTheme(key)}>
            <span class="theme-label">
              <span
                class="theme-swatch"
                style="background: {THEMES[key].editor_background}; border-color: {THEMES[key].overlay_border};"
              ></span>
              <span>{t('settings.theme.' + key)}</span>
            </span>
            <span class="check">{editorBg === key ? '✔' : ''}</span>
          </button>
        {/each}

        <div class="context-divider"></div>

        <!-- 语言选择 -->
        <div class="settings-group-title">{t('settings.language')}</div>
        <button
          class="context-item"
          onclick={toggleLangSubmenu}
        >
          <span>
            {t('settings.language')}: {LANGUAGE_NAMES[$resolvedLocale] || $resolvedLocale}
          </span>
          <span class="shortcut">▸</span>
        </button>

        <div class="context-divider"></div>
        <!-- 检查更新入口 -->
        <button class="context-item" onclick={checkForUpdates}>
          <span>{t('settings.check_update')}</span>
        </button>

        <button class="context-item" onclick={() => { closeSettingsMenu(); aboutVisible = true; }}>
          <span>{t('settings.about')}</span>
        </button>

      </div>
    </div>
  {/if}

  {#if langSubmenu.visible}
    {@const ddW = 180}
    {@const ddH = Math.min(LOCALE_OPTIONS.length * 32 + 8, 400)}
    
    <!-- 计算方向：优先向左弹，如果左边没空间了，向右弹 -->
    {@const hasLeft = langSubmenu.anchorLeft - ddW - 8 >= 0}
    {@const ddLeft = hasLeft 
      ? langSubmenu.anchorLeft - ddW - 4 
      : langSubmenu.anchorRight + 4}
      
    <!-- 计算垂直方向：防止底部溢出 -->
    {@const ddTop = Math.max(8, Math.min(langSubmenu.anchorTop, window.innerHeight - ddH - 8))}

    <!-- ★ 关键：加一层全屏遮罩，点击空白处关闭，同时防止鼠标穿透导致菜单消失 -->
    <div class="context-overlay" onclick={() => langSubmenu.visible = false} role="presentation">
      <div
        class="context-menu"
        style="left: {ddLeft}px; top: {ddTop}px; max-height: 400px; overflow-y: auto;"
        onclick={(e) => e.stopPropagation()}
        role="menu"
        tabindex="-1"
      >
        {#each LOCALE_OPTIONS as opt}
          <button class="context-item" onclick={() => selectLanguage(opt.key)}>
            <!-- ★ 因为删除了 auto，这里直接显示对应的母语名称 -->
            <span>{LANGUAGE_NAMES[opt.key]}</span>
            <span class="check">{$localeChoice === opt.key ? '✔' : ''}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}  

  {#if aboutVisible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="modal-overlay"
      onclick={() => (aboutVisible = false)}
      role="presentation"
    >
      <div
        class="about-card"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
      >
        <img src="/icon.png" alt="FinchPad" class="about-icon" />
        <div class="about-title">{t('about.title')}</div>
        <div class="about-version">{t('about.version', { version: APP_VERSION })}</div>
        <div class="about-desc">{t('about.line1')}</div>
        <div class="about-desc">{t('about.line2')}</div>
        <div class="about-divider"></div>
        <div class="about-info">
          <div>{t('about.tech')}</div>
          <div>{t('about.author')}</div>
          <div>{t('about.license')}</div>
          <div>
            <span
              class="link"
              role="link"
              tabindex="0"
              onclick={openGitHub}
              onkeydown={(e) => e.key === 'Enter' && openGitHub()}
            >{t('about.website')}</span>
          </div>
        </div>
        <button class="about-btn" onclick={() => (aboutVisible = false)}>{t('about.ok')}</button>
      </div>
    </div>
  {/if}  

  {#if editorContextMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="context-overlay"
      onclick={closeEditorContextMenu}
      oncontextmenu={(e) => { e.preventDefault(); closeEditorContextMenu(); }}
      role="presentation"
    >
      <div
        class="context-menu"
        style="{editorContextMenu.left !== null
          ? `left: ${editorContextMenu.left}px;`
          : `right: ${editorContextMenu.right}px;`} top: {editorContextMenu.top}px;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        role="menu"
        tabindex="-1"
      >
        <button
          class="context-item"
          class:disabled={!editorContextMenu.canUndo}
          disabled={!editorContextMenu.canUndo}
          onclick={() => runEditorAction('undo')}
        >
          <span>{t('editor_menu.undo')}</span><span class="shortcut">{mod}+Z</span>
        </button>
        <button
          class="context-item"
          class:disabled={!editorContextMenu.canRedo}
          disabled={!editorContextMenu.canRedo}
          onclick={() => runEditorAction('redo')}
        >
          <span>{t('editor_menu.redo')}</span><span class="shortcut">{isMac ? mod + '+Shift+Z' : mod + '+Y'}</span>
        </button>

        <div class="context-divider"></div>

        <button
          class="context-item"
          class:disabled={!editorContextMenu.hasSelection}
          disabled={!editorContextMenu.hasSelection}
          onclick={() => runEditorAction('cut')}
        >
          <span>{t('editor_menu.cut')}</span><span class="shortcut">{mod}+X</span>
        </button>
        <button
          class="context-item"
          class:disabled={!editorContextMenu.hasSelection}
          disabled={!editorContextMenu.hasSelection}
          onclick={() => runEditorAction('copy')}
        >
          <span>{t('editor_menu.copy')}</span><span class="shortcut">{mod}+C</span>
        </button>
        <button class="context-item" onclick={() => runEditorAction('paste')}>
          <span>{t('editor_menu.paste')}</span><span class="shortcut">{mod}+V</span>
        </button>
        <button class="context-item" onclick={() => runEditorAction('delete')}>
          <span>{t('editor_menu.delete')}</span><span class="shortcut">Delete</span>
        </button>

        <div class="context-divider"></div>

        <button class="context-item" onclick={() => runEditorAction('selectAll')}>
          <span>{t('editor_menu.select_all')}</span><span class="shortcut">{mod}+A</span>
        </button>
      </div>
    </div>
  {/if}

{#if modal.visible}
  <!-- 忽略遮罩层的键盘事件警告（点击遮罩关闭不需要键盘焦点） -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" role="presentation">
    
    <!-- 忽略内部容器的键盘事件警告，并给 dialog 加上 tabindex="-1" -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
      class="modal" 
      onclick={(e) => e.stopPropagation()} 
      role="dialog" 
      tabindex="-1"
    >
      <div class="modal-title">{modal.title}</div>
      {#each modal.rows as row}
        <div class="modal-row">
          {#each row as btn}
            <button
              class="modal-btn"
              class:primary={btn.style === 'primary'}
              class:large={btn.size === 'large'}
              class:small={btn.size === 'small'}
              onclick={btn.action}
            >{btn.label}</button>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
  
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: sans-serif;
  }
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .editor-area {
    flex: 1;
    overflow: hidden;
  }

    .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: var(--overlay-background); 
    color: var(--overlay-foreground);
    border-radius: 8px;
    padding: 20px 24px;
    min-width: 360px;
    max-width: 480px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    font-family: sans-serif;
  }
  /*弹窗  */
  .modal {
    background: var(--overlay-background);
    color: var(--overlay-foreground);
    border-radius: 8px;
    padding: 16px 20px;
    min-width: 300px;              /* ★ 从 320px 缩到 300px */
    max-width: 400px;              /* ★ 从 440px 缩到 400px，整体更紧凑 */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    font-family: sans-serif;
  }
  .modal-title {
    font-size: 13px;
    color: var(--overlay-foreground);
    margin-bottom: 12px;
    word-wrap: break-word;
    line-height: 1.5;
    white-space: pre-line;    /* ★ 让 \n 生效为换行 */
  }
  .modal-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    width: 100%;                   /* ★ 关键：撑满 modal 内容宽度 */
  }
  .modal-btn {
    flex: 1;                       /* ★ 关键：同一排按钮平分整行宽度 */
    padding: 6px 8px;              /* 左右 padding 减小，因为宽度已平分 */
    font-size: 12px;
    background: var(--overlay-hover-background);
    border: 1px solid var(--overlay-border);
    color: var(--overlay-foreground);
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    /* 删除 min-width，让按钮自由平分 */
    transition: filter 0.1s, background-color 0.1s;
  }
  .modal-row > .modal-btn:only-child {
    flex: none;
    min-width: 100px;
    padding-left: 24px;
    padding-right: 24px;
    margin: 0 auto;
  }
  .modal-btn:hover {
    filter: brightness(0.95);
  }
  .modal-btn.primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  .modal-btn.primary:hover {
    filter: brightness(0.95);
  }

  /* ★ 上排大按钮：略高、字略大、字重 500 */
  .modal-btn.large {
    padding: 9px 8px;              /* 上下 9px → 高度约 36px */
    font-size: 13px;
    font-weight: 500;
  }

  /* ★ 下排小按钮：略矮、字略小、正常字重 */
  .modal-btn.small {
    padding: 5px 8px;              /* 上下 5px → 高度约 27px */
    font-size: 12px;
    font-weight: 400;
  }

    .context-overlay {
    position: fixed;
    inset: 0;
    z-index: 900;
  }
  .context-menu {
    position: fixed;
    background: var(--overlay-background);
    border: 1px solid var(--overlay-border);
    border-radius: 8px;
    padding: 4px;
    min-width: 160px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
  }

  .settings-menu {
    min-width: 150px;
  }
  .settings-group-title {
    padding: 6px 12px 4px;
    font-size: 11px;
    color: var(--overlay-foreground-muted);
    user-select: none;
  }
  .settings-menu .context-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .theme-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .theme-swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid;
    flex-shrink: 0;
    box-sizing: border-box;
  }  
  .settings-menu .check {
    color: var(--overlay-foreground);
    font-size: 12px;
    margin-left: 6px;
  }

  .context-item {
    background: none;
    border: none;
    text-align: left;
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--overlay-foreground);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }
  .context-item:hover {
    background: var(--overlay-hover-background);
    color: var(--accent);
  }

  .context-item.disabled,
  .context-item:disabled {
    color: var(--overlay-foreground-muted);
    cursor: default;
    background: none;
  }
  .context-item.disabled:hover,
  .context-item:disabled:hover {
    background: none;
    color: var(--overlay-foreground-muted);
  }
  .context-divider {
    height: 1px;
    background: var(--overlay-divider);
    margin: 4px 0;
  }
  .shortcut {
    font-size: 11px;
    color: var(--overlay-foreground-muted);
    margin-left: auto;
  }
  .context-item.disabled .shortcut {
    color: var(--overlay-foreground-muted);
  }

  .about-card {
    background: var(--overlay-background);
    border: 1px solid var(--overlay-border);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
    padding: 28px 32px;
    min-width: 380px;
    max-width: 480px;
    text-align: center;
    font-family: sans-serif;
  }
  .about-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
    background: transparent;
  }
  .about-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--overlay-foreground);
    margin-bottom: 4px;
  }
  .about-version {
    font-size: 12px;
    color: var(--overlay-foreground-muted);
    margin-bottom: 16px;
  }
  .about-desc {
    font-size: 13px;
    color: var(--overlay-foreground);
    line-height: 1.6;
  }
  .about-divider {
    height: 1px;
    background: var(--overlay-divider);
    margin: 16px 0;
  }
  .about-info {
    font-size: 12px;
    color: var(--overlay-foreground-muted);
    line-height: 1.8;
    text-align: left;
  }
  .link {
    color: var(--accent);
    cursor: pointer;
  }
  .link:hover {
    text-decoration: underline;
  }  
  .about-btn {
    margin-top: 20px;
    padding: 6px 24px;
    font-size: 13px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
  }
  .about-btn:hover {
    filter: brightness(0.9);
  }  
</style>