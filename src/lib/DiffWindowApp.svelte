<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import editorWorker from 'monaco-editor/editor/editor.worker?worker';
<<<<<<< HEAD
  import { listen } from '@tauri-apps/api/event';
  import { api, type DiffPayload } from '$lib/api';
  import { t, resolvedLocale } from '$lib/i18n';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  const appWindow = getCurrentWindow();

=======
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { listen } from '@tauri-apps/api/event';
  import { api, type DiffPayload } from '$lib/api';
  import { t, resolvedLocale } from '$lib/i18n';
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368

  if (!(self as any).MonacoEnvironment) {
    (self as any).MonacoEnvironment = {
      getWorker: () => new editorWorker(),
    };
  }

  const BASE_FONT_SIZE = 15;
<<<<<<< HEAD

  let payload: DiffPayload | null = null;
  let wordWrap = false;

  function toggleWordWrap() {
    wordWrap = !wordWrap;
    if (diffEditor) {
      diffEditor.updateOptions({ wordWrap: wordWrap ? 'on' : 'off' });
    }
  }

  let container: HTMLDivElement;
  let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
=======
  const appWindow = getCurrentWindow();

  let payload: DiffPayload | null = null;
  let container: HTMLDivElement;
  let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
  let isMaximized = false;
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368

  function buildDiff(p: DiffPayload, theme: string) {
    if (!container) return;

    const themes: Record<string, 'vs' | 'vs-dark'> = {
      white: 'vs',
      gray: 'vs',
      sepia: 'vs',
      green: 'vs',
      dark: 'vs-dark',
    };
    for (const [key, base] of Object.entries(themes)) {
      monaco.editor.defineTheme(`diff-${key}`, {
        base,
        inherit: true,
        rules: [],
        colors: {},
      });
    }

    if (diffEditor) {
      diffEditor.dispose();
    }

    diffEditor = monaco.editor.createDiffEditor(container, {
      theme: `diff-${theme}`,
      fontSize: BASE_FONT_SIZE,
      fontFamily: 'Consolas, monospace',
      readOnly: true,
      renderSideBySide: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderOverviewRuler: false,
<<<<<<< HEAD
      wordWrap: wordWrap ? 'on' : 'off',
=======
      wordWrap: 'off',
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
      originalEditable: false,
      ignoreTrimWhitespace: false,
      renderIndicators: true,
      lineNumbers: 'on',
      glyphMargin: false,
      lineNumbersMinChars: 2,
      lineDecorationsWidth: 12,
    });

    const leftModel = monaco.editor.createModel(p.left_content, 'plaintext');
    const rightModel = monaco.editor.createModel(p.right_content, 'plaintext');
    diffEditor.setModel({ original: leftModel, modified: rightModel });
  }

  onMount(() => {
    let unlistenPayload: (() => void) | null = null;
<<<<<<< HEAD

  // ★ 动态设置原生窗口标题
  $: if (appWindow && $resolvedLocale) {
    appWindow.setTitle(t('diff.window_title', undefined, $resolvedLocale));
  }
=======
    let unlistenResize: (() => void) | null = null;
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368

    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const theme = urlParams.get('theme') ?? 'white';

      payload = await api.getDiffPayload();
      if (payload) buildDiff(payload, theme);

      listen('diff-payload-updated', async () => {
        payload = await api.getDiffPayload();
        if (payload) buildDiff(payload, theme);
      }).then((fn) => (unlistenPayload = fn));
<<<<<<< HEAD
=======

      isMaximized = await appWindow.isMaximized();
      unlistenResize = await appWindow.onResized(async () => {
        isMaximized = await appWindow.isMaximized();
      });
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
    })();

    return () => {
      if (unlistenPayload) unlistenPayload();
<<<<<<< HEAD
=======
      if (unlistenResize) unlistenResize();
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
    };
  });

  onDestroy(() => {
    if (diffEditor) {
      const model = diffEditor.getModel();
      model?.original?.dispose();
      model?.modified?.dispose();
      diffEditor.dispose();
    }
  });

<<<<<<< HEAD
=======
  async function handleMinimize() {
    await appWindow.minimize();
  }
  async function handleToggleMaximize() {
    await appWindow.toggleMaximize();
    isMaximized = await appWindow.isMaximized();
  }
  async function handleClose() {
    await api.closeDiffWindow();
  }

>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
  async function handleUseDisk() {
    if (!payload || payload.conflict_idx < 0) return;
    await api.applyDiskVersion(payload.conflict_idx);
    await api.closeDiffWindow();
  }

  async function handleKeepMine() {
    await api.closeDiffWindow();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
<<<<<<< HEAD
      api.closeDiffWindow();
=======
      handleClose();
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="diff-window">
<<<<<<< HEAD


  <!-- 左右标题栏：最左侧放按钮，右侧显示路径 -->
  <div class="diff-titles-row">
    
    <!-- 悬浮的按钮区域 -->
    <div class="titles-actions">
      <button class="text-btn" on:click={toggleWordWrap}>
        {wordWrap ? t('status.word_wrap_on', undefined, $resolvedLocale) : t('status.word_wrap_off', undefined, $resolvedLocale)}
      </button>
      
      {#if payload?.mode === 'disk'}
=======
  <!-- 窗口标题栏：图标+标题 | 按钮(冲突模式) | 拖动区 | 窗口按钮 -->
  <div class="diff-titlebar" data-tauri-drag-region>
    <div class="titlebar-left" data-tauri-drag-region>
      <svg class="titlebar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
        <rect x="1.5" y="3" width="5" height="10" rx="1" />
        <rect x="9.5" y="3" width="5" height="10" rx="1" />
      </svg>
      <span class="titlebar-title">{t('diff.window_title', undefined, $resolvedLocale)}</span>
    </div>

    {#if payload?.mode === 'disk'}
      <div class="titlebar-actions">
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
        <button class="text-btn" on:click={handleKeepMine}>
          {t('diff.keep_mine', undefined, $resolvedLocale)}
        </button>
        <button class="text-btn primary" on:click={handleUseDisk}>
          {t('diff.use_disk', undefined, $resolvedLocale)}
        </button>
<<<<<<< HEAD
      {/if}
    </div>

    <!-- 占满全宽的路径区域 -->
    <div class="titles-paths">
      <div class="diff-title-cell" title={payload?.left_title ?? ''}>
        <span class="diff-title-text">{payload?.left_title ?? ''}</span>
      </div>
      <div class="diff-title-cell" title={payload?.right_title ?? ''}>
        <span class="diff-title-text">{payload?.right_title ?? ''}</span>
      </div>
    </div>
    
=======
      </div>
    {/if}

    <div class="drag-spacer" data-tauri-drag-region></div>

    <button class="window-btn" on:click={handleMinimize} aria-label="Minimize">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>
    <button class="window-btn" on:click={handleToggleMaximize} aria-label="Maximize">
      {#if isMaximized}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <rect x="0" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1" />
          <polyline points="2,2 2,0 10,0 10,8 8,8" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {:else}
        <svg width="10" height="10" viewBox="0 0 10 10">
          <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {/if}
    </button>
    <button class="window-btn window-btn-close" on:click={handleClose} aria-label="Close">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1" />
        <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>
  </div>

  <!-- 左右标题栏：各占 50% -->
  <div class="diff-titles-row">
    <div class="diff-title-cell" title={payload?.left_title ?? ''}>
      <span class="diff-title-text">{payload?.left_title ?? ''}</span>
    </div>
    <div class="diff-title-cell" title={payload?.right_title ?? ''}>
      <span class="diff-title-text">{payload?.right_title ?? ''}</span>
    </div>
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
  </div>

  <!-- Monaco Diff Editor -->
  <div class="diff-body" bind:this={container}></div>
<<<<<<< HEAD
=======

>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: sans-serif;
  }

  .diff-window {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: var(--tab-bar-background, #D8DDE3);
  }

<<<<<<< HEAD
  /* 标题行总容器 */
  .diff-titles-row {
    display: flex;
    height: 32px;
=======
  .diff-titlebar {
    display: flex;
    align-items: center;
    height: 38px;
    flex-shrink: 0;
    background: var(--tab-bar-background);
    border-bottom: 1px solid var(--overlay-divider);
    user-select: none;
  }

  .drag-spacer {
    flex: 1;
    height: 100%;
  }

  .titlebar-left {
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 8px;
    flex-shrink: 0;
    height: 100%;
  }
  .titlebar-icon {
    color: var(--tab-foreground);
    flex-shrink: 0;
  }
  .titlebar-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--tab-foreground);
    user-select: none;
  }
  .titlebar-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px;
    flex-shrink: 0;
  }  

  .window-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--tab-foreground);
    width: 46px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.1s;
    flex-shrink: 0;
  }
  .window-btn:hover { background: var(--overlay-hover-background); }
  .window-btn-close:hover { background: #E81123; color: white; }

  /* 左右标题栏（两个等宽 cell，各自显示对应编辑区的文件名） */
  .diff-titles-row {
    display: flex;
    height: 28px;
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
    flex-shrink: 0;
    background: var(--status-bar-background, #F3F3F3);
    border-bottom: 1px solid var(--overlay-divider);
    user-select: none;
<<<<<<< HEAD
    position: relative;
  }

  /* 左侧按钮区域：绝对定位 */
  .titles-actions {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 12px;
    z-index: 10;
    background: var(--status-bar-background, #F3F3F3);
    border-right: 1px solid var(--overlay-divider);
  }
  
  .titles-actions .text-btn {
    padding: 2px 10px; 
    font-size: 11px;
  }

  /* ★ 改为 Grid 布局，绝对 50/50 平分 */
  .titles-paths {
    display: grid;
    grid-template-columns: 51% 49%;
    width: 100%; 
  }

  /* 单个路径单元格 */
  .diff-title-cell {
    box-sizing: border-box; /* 确保 padding 不撑破宽度 */
=======
  }
  .diff-title-cell {
    flex: 1 1 0;
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
    min-width: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
<<<<<<< HEAD
    overflow: hidden;
  }
  
  /* ★ 左侧路径：给按钮留出空间，并用 box-shadow 代替 border 避免挤压 */
  .diff-title-cell:first-child {
    padding-left: 120px; 
    box-shadow: 1px inset var(--overlay-divider); /* 向左画内部阴影，充当分割线且不占宽度 */
    /* 或者用外面的 border-right 也可以，主要靠 Grid 保证宽度 */
  }

  /* 路径文字 */
=======
    border-right: 1px solid var(--overlay-divider);
    overflow: hidden;
  }
  .diff-title-cell:last-child {
    border-right: none;
  }
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
  .diff-title-text {
    font-size: 12px;
    color: var(--status-bar-foreground, #555);
    font-family: 'Consolas', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;
    text-align: left;
  }
<<<<<<< HEAD
=======
  /* direction: rtl + text-align: left 让长路径优先显示尾部 */
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368

  .diff-body {
    flex: 1;
    overflow: hidden;
    background: white;
  }

  .text-btn {
    padding: 4px 12px;
    font-size: 12px;
    background: var(--overlay-hover-background);
    border: 1px solid var(--overlay-border);
    color: var(--overlay-foreground);
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
  }
  .text-btn:hover { filter: brightness(0.95); }
  .text-btn.primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  .text-btn.primary:hover { filter: brightness(0.9); }
</style>