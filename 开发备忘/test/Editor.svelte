<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import editorWorker from 'monaco-editor/editor/editor.worker?worker';
  import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';
  import { THEMES } from '$lib/themes';
  import { t, resolvedLocale } from '$lib/i18n';  

  self.MonacoEnvironment = {
    getWorker: () => new editorWorker(),
  };

  // 压制 Monaco 内部未实现的 Worker handler 报错（不影响功能）
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const msg = args.map(String).join(' ');
    if (msg.includes('Missing requestHandler or method')) return;
    originalError.apply(console, args);
  };
}
  export let value: string = '';
  export let language: string = 'plaintext';
  export let largeFile: boolean = false;
  export let isPendingLoad: boolean = false;
  export let fileSize: number = 0;
  export let zoom: number = 100;
  export let wordWrap: boolean = true;
  export let showLineNumbers: boolean = true;
  export let editorBg: string = 'white';  
  export let onChange: (text: string) => void = () => {};
  export let onStats: (
    lineCount: number,
    charCount: number,
    selectedCount: number,
    selectedLineCount: number
  ) => void = () => {};
  export let onLoadRequest: () => void = () => {};
  export let onEditorContextMenu: (info: {
    x: number;
    y: number;
    hasSelection: boolean;
    canUndo: boolean;
    canRedo: boolean;
  }) => void = () => {};  
  export let onZoomDelta: (delta: number) => void = () => {};

  const BASE_FONT_SIZE = 15;

  let container: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor | null = null;
  let suppressChange = false;

    // ★ 拦截并删除 Monaco 折叠图标的原生 title 属性，消灭系统的黑框提示
    const removeTitleHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.title) {
        target.removeAttribute('title');
      }
    };


  function calcFontSize(): number {
    return Math.round((BASE_FONT_SIZE * zoom) / 100);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function unicodeLen(s: string): number {
    return Array.from(s).length;
  }

  function reportStats() {
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;
    const lineCount = model.getLineCount();
    const fullText = model.getValue();
    const charCount = unicodeLen(fullText);
    const sel = editor.getSelection();
    const selectedCount = sel ? unicodeLen(model.getValueInRange(sel)) : 0;
    const selectedLineCount = sel ? sel.endLineNumber - sel.startLineNumber + 1 : 0;
    onStats(lineCount, charCount, selectedCount, selectedLineCount);
  }

  /** 供父组件调用：执行编辑区动作 */
  export function execEditorAction(action: string) {
    if (!editor) return;
    const model = editor.getModel();
    const selection = editor.getSelection();
    if (!model || !selection) return;

    switch (action) {
      case 'undo':
        editor.trigger('keyboard', 'undo', null);
        break;

      case 'redo':
        editor.trigger('keyboard', 'redo', null);
        break;

      case 'cut': {
        const text = model.getValueInRange(selection);
        if (!text) return;
        writeText(text)
          .then(() => {
            editor!.executeEdits('ctx', [{ range: selection, text: '' }]);
          })
          .catch((e) => console.error('剪切失败：', e));
        break;
      }

      case 'copy': {
        const text = model.getValueInRange(selection);
        if (!text) return;
        writeText(text).catch((e) => console.error('复制失败：', e));
        break;
      }

      case 'paste':
        readText()
          .then((text) => {
            if (text) {
              editor!.executeEdits('ctx', [{ range: selection, text }]);
            }
          })
          .catch((e) => console.error('粘贴失败：', e));
        break;

      case 'delete':
        if (!selection.isEmpty()) {
          editor.executeEdits('ctx', [{ range: selection, text: '' }]);
        } else {
          editor.trigger('keyboard', 'deleteRight', null);
        }
        break;

      case 'selectAll':
        editor.trigger('keyboard', 'editor.action.selectAll', null);
        break;
      
      case 'find':
        editor.getAction('actions.find')?.run();
        break;

      case 'replace':
        editor.getAction('editor.action.startFindReplaceAction')?.run();
        break;  
    }
  }  

  onMount(() => {
    // 从 THEMES 注册所有编辑区主题
    for (const [key, t] of Object.entries(THEMES)) {
      monaco.editor.defineTheme(`txt-${key}`, {
        base: key === 'dark' ? 'vs-dark' : 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': t.editor_background,
          'editorGutter.background': t.gutter_background,
          'editor.foreground': t.editor_foreground,
          'editorLineNumber.foreground': t.gutter_foreground,
          'editorLineNumber.activeForeground': t.gutter_foreground_active,
          'editorCursor.foreground': t.editor_cursor,
          'editor.selectionBackground': t.editor_selection,
        },
      });
    } 

    // Ctrl+滚轮 → 缩放（capture 模式，抢在 Monaco 前拦截）
    const wheelHandler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();
      onZoomDelta(e.deltaY < 0 ? +10 : -10);
    };
    container.addEventListener('wheel', wheelHandler, {
      passive: false,
      capture: true,
    });

    // 右键 → 上报给父组件，由父组件渲染自定义菜单
    const contextmenuHandler = (e: MouseEvent) => {
      if (!editor) return;
      e.preventDefault();
      e.stopPropagation();
      const sel = editor.getSelection();
      const model = editor.getModel();
      const hasSel = !!(sel && model && !sel.isEmpty());
      onEditorContextMenu({
        x: e.clientX,
        y: e.clientY,
        hasSelection: hasSel,
        canUndo: model?.canUndo() ?? false,
        canRedo: model?.canRedo() ?? false,
      });
    };
    container.addEventListener('contextmenu', contextmenuHandler);
    (container as any).__contextmenuHandler = contextmenuHandler;    

    container.addEventListener('mouseover', removeTitleHandler);  

    // 编辑区域初始化
    editor = monaco.editor.create(container, {
      value,
      language,
      theme: `txt-${editorBg}`,
      fontSize: calcFontSize(),
      lineHeight: Math.round(calcFontSize() * 1.5),
      fontFamily: 'Consolas, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      lineNumbers: showLineNumbers ? 'on' : 'off',
      glyphMargin: false,
      
     
      // 行号最小字符数设为当前位数
      lineNumbersMinChars: value ? value.split('\n').length.toString().length : 1, 
      // 纯文本保持 10px，代码文件设为 6px（让代码文件的右侧间距更紧凑，与 VS Code 一致）
      lineDecorationsWidth: language === 'plaintext' ? 10 : 6,

      wordWrap: 'off',
      scrollBeyondLastLine: false,
      largeFileOptimizations: true,
      maxTokenizationLineLength: 20000,
      mouseWheelZoom: false,
      unicodeHighlight: { ambiguousCharacters: false, invisibleCharacters: false },
      
      // ★ 动态控制折叠：如果是纯文本，则关闭折叠
      folding: language !== 'plaintext',                     
      showFoldingControls: 'mouseover', 
      
      bracketPairColorization: { enabled: false },       
      colorDecorators: false,                            
      quickSuggestions: false,                           
      suggestOnTriggerCharacters: false,                 
      wordBasedSuggestions: 'off',                       
      parameterHints: { enabled: false },                
      lightbulb: { enabled: 'off' as any },              
      codeLens: false,                                   
      links: false,                                      
      occurrencesHighlight: 'off',                       
      selectionHighlight: false,                         
      renderWhitespace: 'none',                          
      guides: { bracketPairs: false, indentation: false },
      hover: { enabled: 'off' as const },                
      contextmenu: false,                                
    });

    editor.onDidChangeModelContent(() => {
      if (suppressChange) return;
      onChange(editor!.getValue());
      reportStats();

      // ★ 终极修复：动态计算行号位数，保证永远不截断，且宽度自适应
      const lineCount = editor!.getModel()?.getLineCount() ?? 1;
      const digits = lineCount.toString().length;
      // 如果当前宽度限制和行数位数不一致（比如从 99 行变成了 100 行），才去更新
      if (editor!.getOption(monaco.editor.EditorOption.lineNumbersMinChars) !== digits) {
        editor!.updateOptions({ lineNumbersMinChars: digits });
      }
    });

    editor.onDidChangeCursorSelection(() => {
      reportStats();
    });

    reportStats();

    // 清理函数（onDestroy 里用）
    (container as any).__wheelHandler = wheelHandler;
  });

  $: if (editor && value !== editor.getValue()) {
    suppressChange = true;
    const pos = editor.getPosition();
    editor.setValue(value);
    if (pos) editor.setPosition(pos);
    suppressChange = false;
    reportStats();
  }

  $: if (editor) {
    const model = editor.getModel();
    if (model && model.getLanguageId() !== language) {
      monaco.editor.setModelLanguage(model, language);
    }
  }

  // ★ 缩放变化时，更新 Monaco 字体
  // 直接读 zoom，让 Svelte 5 正确追踪依赖
  $: if (editor) {
    const targetSize = Math.round((BASE_FONT_SIZE * zoom) / 100);
    const opts = editor.getOptions();
    if (opts.get(monaco.editor.EditorOption.fontSize) !== targetSize) {
      editor.updateOptions({ fontSize: targetSize });
    }
  }

  // ★ 自动换行变化时，更新 Monaco
  $: if (editor) {
    const targetWrap = wordWrap ? 'on' : 'off';
    const opts = editor.getOptions();
    if (opts.get(monaco.editor.EditorOption.wordWrap) !== targetWrap) {
      editor.updateOptions({ wordWrap: targetWrap });
    }
  }

// ★ 当语言切换时，动态调整折叠和右侧装饰区宽度（纯文本 10px 保持不变，代码文件设为 6px）
  $: if (editor) {
    const isPlaintext = language === 'plaintext';
    
    // 1. 控制折叠开关
    const opts = editor.getOptions();
    if (opts.get(monaco.editor.EditorOption.folding) === isPlaintext) {
      editor.updateOptions({ folding: !isPlaintext });
    }

    // 2. 纯文本保持 10px（绝对不动它），代码文件设为 6px 缩窄右侧
    const targetDecorWidth = isPlaintext ? 10 : 6;
    if (editor.getOption(monaco.editor.EditorOption.lineDecorationsWidth) !== targetDecorWidth) {
      editor.updateOptions({ lineDecorationsWidth: targetDecorWidth });
    }
  }


  // ★ 动态计算：位数 + 3 确保右侧绝对有空间，左右内边距由 CSS 统一锁死为 10px
  $: if (editor) {
    const lineCount = editor.getModel()?.getLineCount() ?? 1;
    const digits = lineCount.toString().length;
    const targetMinChars = Math.max(3, digits + 3);
    
    if (editor.getOption(monaco.editor.EditorOption.lineNumbersMinChars) !== targetMinChars) {
      editor.updateOptions({ lineNumbersMinChars: targetMinChars });
    }

    const isPlaintext = language === 'plaintext';
    const targetDecorWidth = isPlaintext ? 10 : 20;
    if (editor.getOption(monaco.editor.EditorOption.lineDecorationsWidth) !== targetDecorWidth) {
      editor.updateOptions({ lineDecorationsWidth: targetDecorWidth });
    }
  }

  // ★ 行号显示/隐藏
  $: if (editor) {
    const target = showLineNumbers ? 'on' : 'off';
    const current = editor.getOptions().get(monaco.editor.EditorOption.lineNumbers);
    if ((current.renderType as unknown as string) !== target) {
      editor.updateOptions({ lineNumbers: target as unknown as 'on' });
    }
  }

  // ★ 编辑区背景切换
  $: if (editor) {
    monaco.editor.setTheme(`txt-${editorBg}`);
  }  

  onDestroy(() => {
    if (container) {
      container.removeEventListener('mouseover', removeTitleHandler);
    }
    const wh = (container as any).__wheelHandler;
    if (wh) {
      container.removeEventListener('wheel', wh, { capture: true });
    }
    const ch = (container as any).__contextmenuHandler;
    if (ch) {
      container.removeEventListener('contextmenu', ch);
    }
    editor?.dispose();
  });
</script>

<div class="editor-container" class:is-plaintext={language === 'plaintext'} style="position: relative; width: 100%; height: 100%;">
  <div bind:this={container} style="width: 100%; height: 100%;"></div>

  {#if isPendingLoad}
    <div class="pending-overlay">
      <div class="pending-card">
        <div class="pending-title">{t('pending.title', undefined, $resolvedLocale)}</div>
        <div class="pending-size">{t('pending.size', { size: formatSize(fileSize) }, $resolvedLocale)}</div>
        <div class="pending-hint">{t('pending.hint', undefined, $resolvedLocale)}</div>
        <button class="pending-btn" onclick={onLoadRequest}>{t('pending.load', undefined, $resolvedLocale)}</button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* 行号栏左侧内边距 */
  /* :global(.monaco-editor .line-numbers) {
    padding-left: 12px !important;
  } */

/* 1. 行号数字栏：左侧内边距固定 10px，右侧为 0，文字在格子内居中（纯文本完美保持，绝对不碰） */
  :global(.monaco-editor .line-numbers) {
    text-align: center !important;
    padding-left: 10px !important;
    padding-right: 0 !important;
  }

  /* 2. 纯文本的右侧装饰区宽度保持 10px 不变 */
  :global(.editor-container.is-plaintext .monaco-editor .line-decorations) {
    width: 10px !important;
    min-width: 10px !important;
    max-width: 10px !important;
    position: relative !important;
  }

  /* 3. 【新增】仅针对代码文件：将右侧装饰区（折叠区）宽度缩窄为 6px，彻底解决代码文件右侧太宽的问题 */
  :global(.editor-container:not(.is-plaintext) .monaco-editor .line-decorations) {
    width: 6px !important;
    min-width: 6px !important;
    max-width: 6px !important;
    position: relative !important;
  }

  /* 4. 让代码折叠符号精准、绝对地居中显示在右侧装饰区正中央 */
  :global(.monaco-editor .codicon-folding-expanded),
  :global(.monaco-editor .codicon-folding-collapsed) {
    font-size: 11px !important; 
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

  /* 隐藏行号时，margin 至少保留一点宽度，避免编辑内容贴左边缘 */
  /* :global(.monaco-editor .margin) {
    min-width: 8px !important;
  } */


  .pending-overlay {
    position: absolute;
    inset: 0;
    background: var(--overlay-background);
    opacity: 0.98;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    z-index: 10;
  }
  .pending-card {
    text-align: center;
    padding: 24px 32px;
    border: 1px solid var(--overlay-border);
    border-radius: 8px;
    background: var(--overlay-background);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .pending-title {
    font-size: 15px;
    color: var(--overlay-foreground);
    margin-bottom: 8px;
  }
  .pending-size {
    font-size: 13px;
    color: var(--overlay-foreground-muted);
    margin-bottom: 4px;
  }
  .pending-hint {
    font-size: 12px;
    color: var(--overlay-foreground-muted);
    margin-bottom: 16px;
  }
  .pending-btn {
    padding: 6px 20px;
    font-size: 14px;
    cursor: pointer;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
  }
  .pending-btn:hover {
    filter: brightness(0.9);
  }
</style>