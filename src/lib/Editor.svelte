<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as monaco from "monaco-editor";
    import { get } from "svelte/store";
    import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
    import { THEMES } from "$lib/themes";
    import { t, resolvedLocale, localeChoice } from "$lib/i18n";

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
    export let onToggleSidebarRequest: () => void = () => {};
    export let loadPendingError: string = "";

    const BASE_FONT_SIZE = 15;

    let container: HTMLDivElement;
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;
    let suppressChange = false;

    // ★ 查找框专用的局部 Tooltip 状态
    let localTooltipVisible = false;
    let localTooltipText = "";
    let localTooltipX = 0;
    let localTooltipY = 0;

    // 仅删除 Monaco 折叠图标的 title，避免影响其他按钮的 Tooltip
    const removeTitleHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const foldingIcon = target.closest(
            ".codicon-folding-expanded, .codicon-folding-collapsed",
        );
        if (!foldingIcon) return;
        const titledElement = foldingIcon.closest<HTMLElement>("[title]");
        if (titledElement) {
            titledElement.removeAttribute("title");
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

    // ==========================================
    // 函数 1：查找框自定义 Tooltip（局部浮层版）
    // ==========================================
    function setupFindWidgetTooltip(container: HTMLElement) {
        let titleUpdateTimeout: any;

        const findWidgetObserver = new MutationObserver(() => {
            clearTimeout(titleUpdateTimeout);
            titleUpdateTimeout = setTimeout(() => {
                const findWidget = container.querySelector(".find-widget");
                if (!findWidget) return;

                // 通用绑定函数，增加 closeOnClick 参数
                const bind = (
                    el: Element | null,
                    i18nKey: string,
                    fallbackText: string,
                    closeOnClick = false, // ★ 默认不响应点击隐藏
                ) => {
                    if (!el || (el as any).__local_tooltip_bound) return;
                    (el as any).__local_tooltip_bound = true;

                    el.addEventListener("mouseenter", (e) => {
                        const rect = (
                            e.currentTarget as HTMLElement
                        ).getBoundingClientRect();

                        // 悬浮瞬间获取当前语言
                        try {
                            localTooltipText =
                                t(i18nKey, undefined, get(resolvedLocale)) ||
                                fallbackText;
                        } catch {
                            localTooltipText = fallbackText;
                        }

                        localTooltipX = rect.left + rect.width / 2;
                        localTooltipY = rect.bottom + 8;
                        localTooltipVisible = true;
                    });

                    el.addEventListener("mouseleave", () => {
                        localTooltipVisible = false;
                    });

                    // 只有在明确要求时才添加点击隐藏
                    if (closeOnClick) {
                        el.addEventListener("click", () => {
                            localTooltipVisible = false;
                        });
                    }
                };

                // 绑定普通按钮（不传第4个参数，保持原本的移出消失逻辑）
                bind(
                    findWidget.querySelector(".codicon-find-selection"),
                    "editor.find.find_in_selection",
                    "Find in Selection",
                );
                bind(
                    findWidget.querySelector(".codicon-case-sensitive"),
                    "editor.find.match_case",
                    "Match Case",
                );
                bind(
                    findWidget.querySelector(".codicon-whole-word"),
                    "editor.find.match_whole_word",
                    "Match Whole Word",
                );
                bind(
                    findWidget.querySelector(".codicon-regex"),
                    "editor.find.use_regex",
                    "Use Regular Expression",
                );
                bind(
                    findWidget.querySelector(".codicon-find-previous-match"),
                    "editor.find.prev_match",
                    "Previous Match",
                );
                bind(
                    findWidget.querySelector(".codicon-find-next-match"),
                    "editor.find.next_match",
                    "Next Match",
                );
                bind(
                    findWidget.querySelector(".codicon-preserve-case"),
                    "editor.find.preserve_case",
                    "Preserve Case",
                );
                bind(
                    findWidget.querySelector(".codicon-find-replace"),
                    "editor.find.replace",
                    "Replace",
                );
                bind(
                    findWidget.querySelector(".codicon-find-replace-all"),
                    "editor.find.replace_all",
                    "Replace All",
                );

                // ★ 关闭按钮：传入 true，点击立即消失
                bind(
                    findWidget.querySelector(".codicon-widget-close"),
                    "editor.find.close",
                    "Close (Esc)",
                    true,
                );

                // ★ 核心逻辑：针对“展开/收起”按钮的动态状态绑定
                const toggleReplaceBtn = findWidget.querySelector(
                    ".codicon-find-expanded, .codicon-find-collapsed",
                );

                if (
                    toggleReplaceBtn &&
                    !(toggleReplaceBtn as any).__toggle_replace_bound
                ) {
                    (toggleReplaceBtn as any).__toggle_replace_bound = true;

                    toggleReplaceBtn.addEventListener("mouseenter", (e) => {
                        const rect = (
                            e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        const currentEl = e.currentTarget as HTMLElement;

                        // 动态判断当前是展开还是收起
                        let text = "";
                        if (
                            currentEl.classList.contains(
                                "codicon-find-expanded",
                            )
                        ) {
                            text =
                                t(
                                    "editor.find.hide_replace",
                                    undefined,
                                    get(resolvedLocale),
                                ) || "Hide Replace";
                        } else {
                            text =
                                t(
                                    "editor.find.show_replace",
                                    undefined,
                                    get(resolvedLocale),
                                ) || "Show Replace";
                        }

                        localTooltipText = text;
                        localTooltipX = rect.left + rect.width / 2;
                        localTooltipY = rect.bottom + 8;
                        localTooltipVisible = true;
                    });

                    toggleReplaceBtn.addEventListener("mouseleave", () => {
                        localTooltipVisible = false;
                    });

                    // ★ 展开/收起按钮：点击立即消失
                    toggleReplaceBtn.addEventListener("click", () => {
                        localTooltipVisible = false;
                    });
                }
            }, 50);
        });
        findWidgetObserver.observe(container, {
            childList: true,
            subtree: true,
        });

        // 拦截并移除 Monaco 原生 Tooltip 的大杀器
        const destroyTooltipObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.classList.contains("context-view"))
                            node.remove();
                        else
                            node
                                .querySelectorAll?.(".context-view")
                                .forEach((t) => t.remove());
                    }
                });
            });
        });
        destroyTooltipObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return { findWidgetObserver, destroyTooltipObserver };
    }

    // ==========================================
    // 函数 2：监听模块（i18n 实时更新版）
    // ==========================================
    function setupFindWidgetI18n(container: HTMLElement) {
        const i18nObserver = new MutationObserver(() => {
            const findWidget = container.querySelector(".find-widget");
            if (!findWidget) return;
            applyFindWidgetI18n(findWidget as HTMLElement);
        });

        i18nObserver.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        return i18nObserver;
    }

    // ==========================================
    // 函数 3：响应式：当语言变化时，强制刷新查找框
    // ==========================================
    $: if (editor && $resolvedLocale) {
        setTimeout(() => {
            const findWidget = container?.querySelector(".find-widget");
            if (findWidget) {
                // ★ 直接调用强刷函数，不要再去手动改 "Find" 了
                applyFindWidgetI18n(findWidget as HTMLElement);
            }
        }, 100);
    }

    // ==========================================
    // 函数4：强制应用翻译（根据 Index 暴力覆盖）
    // ==========================================
    function applyFindWidgetI18n(findWidget: HTMLElement) {
        const isMacPlatform =
            typeof navigator !== "undefined" &&
            /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
        const modKey = isMacPlatform ? "Cmd" : "Ctrl";

        const tr = (key: string, fallback: string, params?: any) => {
            try {
                return t(key, params, get(resolvedLocale)) || fallback;
            } catch {
                return fallback;
            }
        };

        const targetFindText = `${tr("editor.find.placeholder", "Find")} (${modKey}+F)`;
        const targetReplaceText = `${tr("editor.find.replace_placeholder", "Replace")} (${modKey}+H)`;

        // ★ 核心修复：直接根据索引强行覆盖，无视它之前是什么语言
        const inputs = findWidget.querySelectorAll(".monaco-inputbox .input");
        inputs.forEach((input, index) => {
            const el = input as HTMLInputElement;
            if (index === 0 && el.placeholder !== targetFindText) {
                el.placeholder = targetFindText;
            } else if (index === 1 && el.placeholder !== targetReplaceText) {
                el.placeholder = targetReplaceText;
            }
        });

        // 处理结果计数
        const matchesCount = findWidget.querySelector(".matchesCount");
        if (matchesCount && matchesCount.textContent) {
            const text = matchesCount.textContent;
            if (text === "No results" || text === "无结果") {
                const noRes = tr("editor.find.no_results", "No results");
                if (text !== noRes) matchesCount.textContent = noRes;
            } else if (text.includes(" of ") || text.includes("项")) {
                const match = text.match(/(\d+)\s+(?:of|项，共)\s+(\d+\+?)/);
                if (match) {
                    const countText = tr(
                        "editor.find.match_count",
                        "{current} of {total}",
                        { current: match[1], total: match[2] },
                    );
                    if (text !== countText)
                        matchesCount.textContent = countText;
                }
            }
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

        // ★ 核心修复：在捕获阶段强行拦截 Mac 的 Ctrl+O以及Ctrl+B
        const keydownHandler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
                e.preventDefault();
                e.stopPropagation();
                onOpenRequest();
            }
            // ★ 新增：拦截 Ctrl/Cmd + B
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault();
                e.stopPropagation();
                onToggleSidebarRequest();
            }
        };
        container.addEventListener("keydown", keydownHandler, {
            capture: true,
        });
        (container as any).__keydownHandler = keydownHandler;

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
            hover: { enabled: "off" },
            contextmenu: false,

            useShadowDOM: false,
            find: {
                addExtraSpaceOnTop: false,
            },
            // ★ 核心终极杀招：彻底禁止渲染任何语法/语义校验的波浪线
            renderValidationDecorations: "off",
        });

        // ★ 查找框修改
        const tooltipObservers = setupFindWidgetTooltip(container);
        const i18nObserver = setupFindWidgetI18n(container);

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
        // 保存到 container 上以便在 onDestroy 清理
        (container as any).__findWidgetObserver =
            tooltipObservers.findWidgetObserver;
        // ★ 加回这一行
        (container as any).__destroyTooltipObserver =
            tooltipObservers.destroyTooltipObserver;
        (container as any).__i18nObserver = i18nObserver;
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

    // 清理函数
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
        const kh = (container as any).__keydownHandler;
        if (kh) {
            container.removeEventListener("keydown", kh, { capture: true });
        }

        // 清理查找框相关的 Observer（合并为一组，绝不重复）
        const fob = (container as any).__findWidgetObserver;
        if (fob) fob.disconnect();

        const dtob = (container as any).__destroyTooltipObserver;
        if (dtob) dtob.disconnect();

        const iob = (container as any).__i18nObserver;
        if (iob) iob.disconnect();

        editor?.dispose();
    });
</script>

<div
    class="editor-container"
    class:is-plaintext={language === "plaintext"}
    class:no-lines={!showLineNumbers}
    data-theme={editorBg}
    style="position: relative; width: 100%; height: 100%;"
>
    <!-- ★ 查找框专用的局部 Tooltip 浮层 -->
    {#if localTooltipVisible}
        <div
            class="editor-local-tooltip"
            style="left: {localTooltipX}px; top: {localTooltipY}px;"
        >
            {localTooltipText}
        </div>
    {/if}

    <div bind:this={container} style="width: 100%; height: 100%;"></div>

    <!-- 大文件提示 -->
    {#if isPendingLoad}
        <div class="pending-overlay">
            <div class="pending-card">
                <div class="pending-title" style="font-weight: 600;">
                    {t("large_file.pending_title", undefined, $resolvedLocale)}
                </div>
                <div class="pending-size">
                    {t(
                        "large_file.pending_size",
                        { size: formatSize(fileSize) },
                        $resolvedLocale,
                    )}
                </div>
                <div
                    class="pending-hint"
                    style="margin-bottom: 16px; color: var(--status-bar-foreground-muted); font-size: 12px;"
                >
                    {t("large_file.pending_hint", undefined, $resolvedLocale)}
                </div>

                <!-- ★ 内联错误提示 -->
                {#if loadPendingError}
                    <div class="pending-error">
                        ⚠️ {loadPendingError}
                    </div>
                {/if}

                <!-- ★ 唯一的按钮 -->
                <button class="pending-btn" onclick={onLoadRequest}>
                    {t("large_file.pending_btn", undefined, $resolvedLocale)}
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* ======================================================
       ★ 终极原生双色指针（外圈文字色 + 内芯背景色）
       ====================================================== */

    /* 白色主题：外黑内白 */
    .editor-container[data-theme="white"]
        :global(.monaco-editor .monaco-mouse-cursor-text),
    .editor-container[data-theme="white"] :global(.monaco-editor .view-lines) {
        cursor:
            url('data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cg stroke="%23000000" stroke-width="2" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3Cg stroke="%23FFFFFF" stroke-width="0.8" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3C/svg%3E')
                8 2,
            text !important;
    }

    /* 灰色主题：外黑内灰 */
    .editor-container[data-theme="gray"]
        :global(.monaco-editor .monaco-mouse-cursor-text),
    .editor-container[data-theme="gray"] :global(.monaco-editor .view-lines) {
        cursor:
            url('data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cg stroke="%23000000" stroke-width="2" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3Cg stroke="%23C0C0C0" stroke-width="0.8" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3C/svg%3E')
                8 2,
            text !important;
    }

    /* 米黄主题：外深青内米黄 */
    .editor-container[data-theme="sepia"]
        :global(.monaco-editor .monaco-mouse-cursor-text),
    .editor-container[data-theme="sepia"] :global(.monaco-editor .view-lines) {
        cursor:
            url('data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cg stroke="%233A4A52" stroke-width="2" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3Cg stroke="%23FDF6E3" stroke-width="0.8" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3C/svg%3E')
                8 2,
            text !important;
    }

    /* 护眼绿主题：外深绿内浅绿 */
    .editor-container[data-theme="green"]
        :global(.monaco-editor .monaco-mouse-cursor-text),
    .editor-container[data-theme="green"] :global(.monaco-editor .view-lines) {
        cursor:
            url('data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cg stroke="%231A3A1A" stroke-width="2" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3Cg stroke="%23CCE8CF" stroke-width="0.8" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3C/svg%3E')
                8 2,
            text !important;
    }

    /* 深色主题：外浅灰内深黑 */
    .editor-container[data-theme="dark"]
        :global(.monaco-editor .monaco-mouse-cursor-text),
    .editor-container[data-theme="dark"] :global(.monaco-editor .view-lines) {
        cursor:
            url('data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Cg stroke="%23D4D4D4" stroke-width="2" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3Cg stroke="%231E1E1E" stroke-width="0.8" fill="none" stroke-linecap="round"%3E%3Cpath d="M8 2v12M5 2h6M5 14h6"/%3E%3C/g%3E%3C/svg%3E')
                8 2,
            text !important;
    }
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

    .pending-error {
        color: var(--warning-strong);
        font-size: 12px;
        margin: 0 auto 16px auto;
        padding: 6px 12px;
        background: color-mix(in srgb, var(--warning-strong) 10%, transparent);
        border: 1px solid var(--warning-strong);
        border-radius: 4px;
        text-align: center;
        max-width: 90%;
    }

    /* ======================================================
       Monaco 查找替换弹窗 (Find Widget) 纯净美化版
       ====================================================== */

    /* 1. 整体容器：只做主题换肤，不碰任何定位属性 */
    :global(.monaco-editor .find-widget) {
        background-color: var(--overlay-background) !important;
        border: 1px solid var(--overlay-border) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        border-radius: 8px !important;
        color: var(--overlay-foreground) !important;
    }

    /* 2. 终极隐藏防御：只要它关闭，立刻物理消灭，杜绝残影 */
    :global(.monaco-editor .find-widget.hiddenEditor) {
        display: none !important;
        box-shadow: none !important;
        border: none !important;
        background-color: transparent !important;
    }

    /* 3. 输入框及文字颜色 */
    :global(.monaco-editor .find-widget .monaco-inputbox) {
        background-color: var(--editor-background) !important;
        border: 1px solid var(--overlay-border) !important;
        border-radius: 4px !important;
        color: var(--tab-foreground) !important;
    }
    :global(.monaco-editor .find-widget .monaco-inputbox .input) {
        color: var(--tab-foreground) !important;
    }

    /* 4. 查找/替换按钮的悬停效果 */
    :global(.monaco-editor .find-widget .button) {
        border-radius: 4px !important;
        transition: background-color 0.15s !important;
    }
    :global(.monaco-editor .find-widget .button:hover) {
        background-color: var(--overlay-hover-background) !important;
    }

    /* 5. 匹配数量文字 */
    :global(.monaco-editor .find-widget .matchesCount) {
        color: var(--status-bar-foreground-muted) !important;
    }

    /* 6. 开关激活状态（如开启大小写匹配） */
    :global(.monaco-editor .find-widget .button.toggle.checked) {
        background-color: var(--accent) !important;
        color: #ffffff !important;
    }
    :global(.monaco-editor .find-widget .button.toggle.checked::before) {
        color: #ffffff !important;
    }

    /* 7. 左侧拖拽条的透明化与悬停变色 */
    :global(.monaco-editor .find-widget > .monaco-sash) {
        background-color: transparent !important;
        width: 4px !important;
    }
    :global(.monaco-editor .find-widget > .monaco-sash:hover) {
        background-color: var(--accent) !important;
    }

    /* 8. 正则报错时的圆角红框 */
    :global(.monaco-editor .find-widget .monaco-inputbox .message) {
        border-radius: 4px !important;
        margin-top: 4px !important;
        padding: 2px 6px !important;
        background-color: color-mix(
            in srgb,
            var(--warning-strong) 15%,
            transparent
        ) !important;
        color: var(--warning-strong) !important;
        border: 1px solid var(--warning-strong) !important;
    }
    /* ======================================================
       ★ 查找框专属轻量级 Tooltip（完全隔离，不污染全局）
       ====================================================== */
    .editor-local-tooltip {
        position: fixed;
        transform: translateX(-50%); /* 水平居中 */
        background: var(--overlay-background);
        color: var(--overlay-foreground);
        border: 1px solid var(--overlay-border);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        padding: 4px 10px 6px;
        font-size: 11px;

        /* 强制单行 */
        white-space: nowrap !important;
        word-break: normal !important;

        z-index: 99999;
        pointer-events: none; /* 不阻挡鼠标事件 */
        font-family: sans-serif;
        line-height: 1.4;
    }
    /* ======================================================
       ★ 终极防御：从 CSS 层面彻底抹杀 Monaco 原生 Tooltip
       ====================================================== */
    :global(.monaco-hover),
    :global(.monaco-editor .context-view) {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }
</style>
