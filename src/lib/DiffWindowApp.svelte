<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import editorWorker from 'monaco-editor/editor/editor.worker?worker';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { listen } from '@tauri-apps/api/event';
  import { api, type DiffPayload } from '$lib/api';
  import { t, resolvedLocale } from '$lib/i18n';

  if (!(self as any).MonacoEnvironment) {
    (self as any).MonacoEnvironment = {
      getWorker: () => new editorWorker(),
    };
  }

  const BASE_FONT_SIZE = 15;
  const appWindow = getCurrentWindow();

  let payload: DiffPayload | null = null;
  let container: HTMLDivElement;
  let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
  let isMaximized = false;

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
      wordWrap: 'off',
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
    let unlistenResize: (() => void) | null = null;

    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const theme = urlParams.get('theme') ?? 'white';

      payload = await api.getDiffPayload();
      if (payload) buildDiff(payload, theme);

      listen('diff-payload-updated', async () => {
        payload = await api.getDiffPayload();
        if (payload) buildDiff(payload, theme);
      }).then((fn) => (unlistenPayload = fn));

      isMaximized = await appWindow.isMaximized();
      unlistenResize = await appWindow.onResized(async () => {
        isMaximized = await appWindow.isMaximized();
      });
    })();

    return () => {
      if (unlistenPayload) unlistenPayload();
      if (unlistenResize) unlistenResize();
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
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="diff-window">
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
        <button class="text-btn" on:click={handleKeepMine}>
          {t('diff.keep_mine', undefined, $resolvedLocale)}
        </button>
        <button class="text-btn primary" on:click={handleUseDisk}>
          {t('diff.use_disk', undefined, $resolvedLocale)}
        </button>
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
  </div>

  <!-- Monaco Diff Editor -->
  <div class="diff-body" bind:this={container}></div>

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
    flex-shrink: 0;
    background: var(--status-bar-background, #F3F3F3);
    border-bottom: 1px solid var(--overlay-divider);
    user-select: none;
  }
  .diff-title-cell {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-right: 1px solid var(--overlay-divider);
    overflow: hidden;
  }
  .diff-title-cell:last-child {
    border-right: none;
  }
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
  /* direction: rtl + text-align: left 让长路径优先显示尾部 */

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