<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as monaco from "monaco-editor";
    import editorWorker from "monaco-editor/editor/editor.worker?worker";
    import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
    import { THEMES } from "$lib/themes";
    import { t, resolvedLocale } from "$lib/i18n";

    self.MonacoEnvironment = {
        getWorker: () => new editorWorker(),
    };

    // 压制 Monaco 内部未实现的 Worker handler 报错（不影响功能）
    if (typeof window !== "undefined") {
        const originalError = console.error;
        console.error = (...args: any[]) => {
            const msg = args.map(String).join(" ");
            if (msg.includes("Missing requestHandler or method")) return;
            originalError.apply(console, args);
        };
    }
    export let largeFile: boolean = false;
    export let value: string = "";
    export let language: string = "plaintext";
    export let isPendingLoad: boolean = false;
    export let fileSize: number = 0;
    export let zoom: number = 100;
    export let wordWrap: boolean = true;
    export let showLineNumbers: boolean = true;
    export let editorBg: string = "white";
    export let onChange: (text: string) => void = () => {};
    export let onStats: (
        lineCount: number,
        charCount: number,
        selectedCount: number,
        selectedLineCount: number,
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
    export let onOpenRequest: () => void = () => {};

    const BASE_FONT_SIZE = 15;

    let container: HTMLDivElement;
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;
    let suppressChange = false;

    // ★ 拦截并删除 Monaco 折叠图标的原生 title 属性，消灭系统的黑框提示
    const removeTitleHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target && target.title) {
            target.removeAttribute("title");
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
        const selectedLineCount = sel
            ? sel.endLineNumber - sel.startLineNumber + 1
            : 0;
        onStats(lineCount, charCount, selectedCount, selectedLineCount);
    }

    /** 供父组件调用：执行编辑区动作 */
    export function execEditorAction(action: string) {
        if (!editor) return;
        const model = editor.getModel();
        const selection = editor.getSelection();
        if (!model || !selection) return;

        switch (action) {
            case "undo":
                editor.trigger("keyboard", "undo", null);
                break;

            case "redo":
                editor.trigger("keyboard", "redo", null);
                break;

            case "cut": {
                const text = model.getValueInRange(selection);
                if (!text) return;
                writeText(text)
                    .then(() => {
                        editor!.executeEdits("ctx", [
                            { range: selection, text: "" },
                        ]);
                    })
                    .catch((e) => console.error("剪切失败：", e));
                break;
            }

            case "copy": {
                const text = model.getValueInRange(selection);
                if (!text) return;
                writeText(text).catch((e) => console.error("复制失败：", e));
                break;
            }

            case "paste":
                readText()
                    .then((text) => {
                        if (text) {
                            editor!.executeEdits("ctx", [
                                { range: selection, text },
                            ]);
                        }
                    })
                    .catch((e) => console.error("粘贴失败：", e));
                break;

            case "delete":
                if (!selection.isEmpty()) {
                    editor.executeEdits("ctx", [
                        { range: selection, text: "" },
                    ]);
                } else {
                    editor.trigger("keyboard", "deleteRight", null);
                }
                break;

            case "selectAll":
                editor.trigger("keyboard", "editor.action.selectAll", null);
                break;

            case "find":
                editor.getAction("actions.find")?.run();
                break;

            case "replace":
                editor.getAction("editor.action.startFindReplaceAction")?.run();
                break;
        }
    }

    // 行号栏相关
    // ★ 缓存上一次的状态，用于极速性能判断
    let lastLineCount = -1;
    let lastFontSize = -1;
    let lastIsPlaintext: boolean | null = null;
    let lastShowLineNumbers: boolean | null = null;

    // ★ 终极独立函数：按需触发，内置防抖与状态缓存
    function updateGutter() {
        if (!editor) return;
        const model = editor.getModel();
        if (!model) return;

        const lineCount = model.getLineCount();
        const digits = lineCount.toString().length;
        const isPlaintext = language === "plaintext";
        const opts = editor.getOptions();
        const currentFontSize = opts.get(monaco.editor.EditorOption.fontSize);

        // === 性能优化核心：如果这 4 个关键指标都没变，直接 return！ ===
        if (
            lineCount === lastLineCount &&
            currentFontSize === lastFontSize &&
            isPlaintext === lastIsPlaintext &&
            showLineNumbers === lastShowLineNumbers
        ) {
            return;
        }
        // 更新缓存
        lastLineCount = lineCount;
        lastFontSize = currentFontSize;
        lastIsPlaintext = isPlaintext;
        lastShowLineNumbers = showLineNumbers;

        // 1. 决定最终的目标值（初始默认）
        let targetMinChars = 0;
        let targetDecorWidth = 0;

        // === 问题 3 & 4：隐藏行号时 ===
        if (!showLineNumbers) {
            targetMinChars = 0;
            targetDecorWidth = 10; // 隐藏行号时的呼吸空间
            editor.updateOptions({ lineNumbers: "off", folding: false });
        } else {
            // === 显示行号时 ===
            editor.updateOptions({ lineNumbers: "on", folding: !isPlaintext });

            if (isPlaintext) {
                // 纯文本：宽间距居中
                targetMinChars = Math.max(4, digits + 2);
                targetDecorWidth = 0; // 纯文本右侧不需要留白，归零
            } else {
                // 代码文件：紧凑
                targetMinChars = Math.max(3, digits + 1);
                targetDecorWidth = Math.round(currentFontSize * 0.95);
            }
        }

        // 2. ★ 核心修复：统一获取当前值，同时对比两个参数
        const currentMinChars = opts.get(
            monaco.editor.EditorOption.lineNumbersMinChars,
        );
        const currentDecorWidth = opts.get(
            monaco.editor.EditorOption.lineDecorationsWidth,
        );

        if (
            currentMinChars !== targetMinChars ||
            currentDecorWidth !== targetDecorWidth
        ) {
            editor.updateOptions({
                lineNumbersMinChars: targetMinChars,
                lineDecorationsWidth: targetDecorWidth,
            });
        }
    }

    onMount(() => {
        // 从 THEMES 注册所有编辑区主题
        for (const [key, t] of Object.entries(THEMES)) {
            monaco.editor.defineTheme(`txt-${key}`, {
                base: key === "dark" ? "vs-dark" : "vs",
                inherit: true,
                rules: [],
                colors: {
                    "editor.background": t.editor_background,
                    "editorGutter.background": t.gutter_background,
                    "editor.foreground": t.editor_foreground,
                    "editorLineNumber.foreground": t.gutter_foreground,
                    "editorLineNumber.activeForeground":
                        t.gutter_foreground_active,
                    "editorCursor.foreground": t.editor_cursor,
                    "editor.selectionBackground": t.editor_selection,
                    // ★ 新增：通过 Monaco 原生主题配置滚动条颜色
                    "scrollbarSlider.background": t.scrollbar_slider,
                    "scrollbarSlider.hoverBackground": t.scrollbar_slider_hover,
                    "scrollbarSlider.activeBackground":
                        t.scrollbar_slider_hover,
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
        container.addEventListener("wheel", wheelHandler, {
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
        container.addEventListener("contextmenu", contextmenuHandler);
        (container as any).__contextmenuHandler = contextmenuHandler;

        container.addEventListener("mouseover", removeTitleHandler);

        // 编辑区域初始化
        editor = monaco.editor.create(container, {
            value,
            language,
            theme: `txt-${editorBg}`,
            fontSize: calcFontSize(),
            lineHeight: Math.round(calcFontSize() * 1.5),
            fontFamily: "Consolas, monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            lineNumbers: showLineNumbers ? "on" : "off",
            glyphMargin: false,

            // ★ 在这里添加 scrollbar 配置
            scrollbar: {
                verticalScrollbarSize: 10, // 垂直滚动条宽度，8px 是比较细腻的尺寸
                horizontalScrollbarSize: 10, // 水平滚动条高度
                useShadows: false, // 关闭滚动条阴影，让胶囊效果更干净
                alwaysConsumeMouseWheel: true, // 防止滚轮事件冒泡到编辑器外部
            },

            lineNumbersMinChars: language === "plaintext" ? 6 : 3,
            lineDecorationsWidth: language === "plaintext" ? 0 : 12,

            wordWrap: "off",
            scrollBeyondLastLine: false,
            largeFileOptimizations: true,
            maxTokenizationLineLength: 20000,
            mouseWheelZoom: false,
            unicodeHighlight: {
                ambiguousCharacters: false,
                invisibleCharacters: false,
            },

            // ★ 动态控制折叠：如果是纯文本，则关闭折叠
            folding: language !== "plaintext",
            showFoldingControls: "mouseover",

            bracketPairColorization: { enabled: false },
            colorDecorators: false,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordBasedSuggestions: "off",
            parameterHints: { enabled: false },
            lightbulb: { enabled: "off" as any },
            codeLens: false,
            links: false,
            occurrencesHighlight: "off",
            selectionHighlight: false,
            renderWhitespace: "none",
            guides: { bracketPairs: false, indentation: false },
            hover: { enabled: "off" as const },
            contextmenu: false,
        });

        // ★ 拦截 Ctrl/Cmd + O，防止 Monaco 内部把它当换行处理
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
            onOpenRequest();
        });

        // 打字内容变化时
        editor.onDidChangeModelContent(() => {
            if (suppressChange) return;
            onChange(editor!.getValue());
            reportStats();
            updateGutter();
        });

        editor.onDidChangeCursorSelection(() => {
            reportStats();
        });

        reportStats();

        // 清理函数（onDestroy 里用）
        (container as any).__wheelHandler = wheelHandler;
    });

    //   切换标签
    $: if (editor && value !== editor.getValue()) {
        suppressChange = true;
        const pos = editor.getPosition();
        editor.setValue(value);
        if (pos) editor.setPosition(pos);
        suppressChange = false;
        reportStats();
        updateGutter();
    }

    $: if (editor) {
        const model = editor.getModel();
        if (model && model.getLanguageId() !== language) {
            monaco.editor.setModelLanguage(model, language);
        }
    }

    // ★ 缩放变化时，同步更新 Monaco 的字体大小和行高
    $: if (editor) {
        const targetSize = Math.round((BASE_FONT_SIZE * zoom) / 100);
        const targetLineHeight = Math.round(targetSize * 1.5); // 行高必须跟着字体一起变！

        const opts = editor.getOptions();

        // 如果字号或行高有一个没对上，就一起更新
        if (
            opts.get(monaco.editor.EditorOption.fontSize) !== targetSize ||
            opts.get(monaco.editor.EditorOption.lineHeight) !== targetLineHeight
        ) {
            editor.updateOptions({
                fontSize: targetSize,
                lineHeight: targetLineHeight,
            });
            // ★ 关键补充：字体大小变了，行号栏和折叠区宽度必须重算！
            updateGutter(); // ✅
        }
    }

    // ★ 自动换行变化时，更新 Monaco
    $: if (editor) {
        const targetWrap = wordWrap ? "on" : "off";
        const opts = editor.getOptions();
        if (opts.get(monaco.editor.EditorOption.wordWrap) !== targetWrap) {
            editor.updateOptions({ wordWrap: targetWrap });
        }
    }

    // 监听语言、缩放比例、是否显示行号的改变
    $: if (editor && (language || zoom || showLineNumbers)) {
        updateGutter(); // ✅ 只要这三个变量有一个变了，就重新算
    }

    // ★ 行号显示/隐藏
    $: if (editor) {
        const target = showLineNumbers ? "on" : "off";
        const current = editor
            .getOptions()
            .get(monaco.editor.EditorOption.lineNumbers);
        if ((current.renderType as unknown as string) !== target) {
            editor.updateOptions({ lineNumbers: target as unknown as "on" });
        }
    }

    // ★ 编辑区背景切换
    $: if (editor) {
        monaco.editor.setTheme(`txt-${editorBg}`);
    }

    onDestroy(() => {
        if (container) {
            container.removeEventListener("mouseover", removeTitleHandler);
        }
        const wh = (container as any).__wheelHandler;
        if (wh) {
            container.removeEventListener("wheel", wh, { capture: true });
        }
        const ch = (container as any).__contextmenuHandler;
        if (ch) {
            container.removeEventListener("contextmenu", ch);
        }
        editor?.dispose();
    });
</script>

<div
    class="editor-container"
    class:is-plaintext={language === "plaintext"}
    class:no-lines={!showLineNumbers}
    style="position: relative; width: 100%; height: 100%;"
>
    <div bind:this={container} style="width: 100%; height: 100%;"></div>

    {#if isPendingLoad}
        <div class="pending-overlay">
            <div class="pending-card">
                <div class="pending-title">
                    {t("pending.title", undefined, $resolvedLocale)}
                </div>
                <div class="pending-size">
                    {t(
                        "pending.size",
                        { size: formatSize(fileSize) },
                        $resolvedLocale,
                    )}
                </div>
                <div class="pending-hint">
                    {t("pending.hint", undefined, $resolvedLocale)}
                </div>
                <button class="pending-btn" onclick={onLoadRequest}>
                    {t("pending.load", undefined, $resolvedLocale)}
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* ==========================================================================
     行号与折叠区样式配置
     ========================================================================== */
    /* 纯文本行号居中 */
    :global(.editor-container.is-plaintext .monaco-editor .line-numbers) {
        text-align: center !important;
    }
    /* 当隐藏行号时，让左侧留白（Margin/Gutter）的背景色完全透明，透出底层的 editor_background */
    :global(.editor-container.no-lines .monaco-editor .margin) {
        background-color: transparent !important;
    }
    /* ==================== 折叠符号微调（方案B） ==================== */
    /* 使用 em 相对单位，让图标随字体大小自动缩放。0.85em 在视觉上与行号完美等大 */
    :global(.monaco-editor .codicon-folding-expanded),
    :global(.monaco-editor .codicon-folding-collapsed) {
        font-size: 1.1em !important;
        /* 提示：不需要写 transform: scale()，因为字体本身的 font-size 缩小不会影响点击热区 */
    }

    /* ==========================================================================
     滚动条样式优化 —— 细长胶囊风格（模仿 Chrome/Edge）
     ========================================================================== */
    /* 核心：覆盖 Monaco 内部滑块（slider）的样式 */
    :global(.monaco-scrollable-element > .scrollbar > .slider) {
        border-radius: 5px !important; /* 10px 宽度的滚动条，5px 圆角就是完美胶囊 */
        /* 颜色交给主题配置，这里加一个顺滑过渡即可 */
        transition: background 0.2s ease-in-out;
    }
    /* 确保滚动条轨道背景透明 */
    :global(.monaco-scrollable-element > .scrollbar) {
        background: transparent !important;
    }
    /* ★ 垂直滚动条：强制最小高度，防止长文件滑块太小点不中 */
    :global(.monaco-scrollable-element > .scrollbar.vertical > .slider) {
        min-height: 40px !important; /* 滑块至少 24px 高 */
    }
    /* ★ 水平滚动条：强制最小宽度 */
    :global(.monaco-scrollable-element > .scrollbar.horizontal > .slider) {
        min-width: 40px !important; /* 滑块至少 24px 宽 */
    }

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
