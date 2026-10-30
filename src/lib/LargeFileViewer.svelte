<script lang="ts">
    import * as monaco from "monaco-editor";
    // ★ 核心新增：显式引入 Worker，由 Vite 处理其打包路径
    // @ts-ignore
    import editorWorker from "monaco-editor/editor/editor.worker?worker";
    import { onMount, onDestroy, tick } from "svelte";
    import { api } from "$lib/api";
    import { tooltip } from "$lib/tooltip";
    import type { SearchResult } from "$lib/api";
    import { THEMES, currentTheme as themeStore } from "$lib/themes";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import Toggle from "$lib/Toggle.svelte"; // ★ 新增
    import { t, resolvedLocale } from "$lib/i18n"; // 确保有这两项
    import { listen } from "@tauri-apps/api/event";
    import { setLocaleChoice, type LocaleChoice } from "$lib/i18n"; // 确保有这些
    const appWindow = getCurrentWindow();
    // ==========================================
    // 无边框设计
    // ==========================================
    const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    // ★ 核心新增：绝密隔离！
    // 1. 只有是 Mac 系统
    // 2. 只有是打包后的生产环境 (import.meta.env.PROD)
    // 同时满足时，才强制使用 Vite 正确打包出的 Worker，覆盖插件在 Mac 下失效的路径。
    // Windows/Linux 下，这段代码连进都不会进，100% 保持原状！

    // ★ 核心修复：去掉所有条件限制，让 Windows 和 Mac 在 build 之后都能拿到正确的 Worker
    if (typeof window !== "undefined") {
        (window as any).MonacoEnvironment = {
            getWorker: function () {
                return new editorWorker();
            },
        };
    }

    // 下面是macOS生效的版本，如果mac对比功能没有差异高亮，则换下面的代码
    // if (isMac && import.meta.env.PROD && typeof window !== "undefined") {
    //     (window as any).MonacoEnvironment = {
    //         getWorker: function (_workerId: string, _label: string) {
    //             return new editorWorker();
    //         },
    //     };
    // }

    let isMaximized = false;
    // ★ 新增：拖拽逻辑
    function handleDragStart(e: MouseEvent) {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        // 过滤掉可交互元素，防止拖拽误触
        if (target.closest("button, input, select, .tool-item, .toggle"))
            return;
        appWindow.startDragging().catch(console.error);
    }
    // ★ 新增：窗口按钮逻辑
    async function handleMinimize() {
        await appWindow.minimize();
    }
    async function handleToggleMaximize() {
        await appWindow.toggleMaximize();
        isMaximized = await appWindow.isMaximized();
    }
    async function handleClose() {
        await appWindow.close();
    }
    // ★ 新增：获取纯文件名（用于左侧显示）
    $: fileName = filePath
        ? filePath.split(/[\\/]/).pop() || filePath
        : "大文件";

    // self.MonacoEnvironment = {
    //     getWorker: () => new editorWorker(),
    // };

    let isLimitReached = false; // ★ 搜索是否达到上限
    let themeForceUpdate = 0; // ★ 用于强制触发 Svelte 重绘
    let wordWrap = false; // ★ 新增：大文件默认关闭换行
    let filePath = "";
    let errorMsg = "";
    let showToast = false;
    let toastMessage = "";
    // ★ 同步解析 URL 参数，保证第一帧渲染就是正确的主题
    let currentTheme = "white";
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        currentTheme = params.get("theme") || "white";
    }

    let monacoContainer: HTMLDivElement;
    let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

    // 流式加载状态
    let isLoadingChunk = false;
    let loadedLines = 0;
    const CHUNK_SIZE = 5000;
    const INITIAL_CHUNK_SIZE = 1000; // ★ 新增：首次极速加载

    // 搜索与跳转
    let searchKeyword = "";
    let isSearching = false;
    let searchResults: SearchResult[] = [];
    let showResults = false;
    let jumpLineInput = "";

    // DOM 引用，用于快捷键聚焦
    let jumpInputEl: HTMLInputElement;
    let searchInputEl: HTMLInputElement;

    let totalLines = 0; // 记录总行数
    let isJumpError = false;
    let lineNumberOffset = 0; // 记录当前模型第一行在原文件中的偏移量
    // 用于存储搜索高亮的装饰器集合
    let searchDecorations: monaco.editor.IEditorDecorationsCollection | null =
        null;

    // 编码支持
    let currentEncoding = "UTF-8"; //
    const ENCODINGS = [
        "AutoDetect", // ★ 置顶：自动探测
        "UTF-8",
        "UTF-16LE",
        "UTF-16BE",
        "GBK",
        "GB18030",
        "Big5",
        "Shift_JIS",
        "EUC-JP",
        "ISO-2022-JP",
        "EUC-KR",
        "Windows-1252",
        "ISO-8859-1",
        "ISO-8859-15",
        "Windows-1251",
        "KOI8-R",
        "Windows-1250",
        "ISO-8859-2",
        "Windows-1256",
        "Windows-874",
    ];

    // ★ 新增：获取真实编码（如果是 Auto，则让后端探测）
    async function getActualEncoding(): Promise<string> {
        if (currentEncoding === "AutoDetect") {
            try {
                const enc = await api.getFileEncoding(filePath);
                if (enc.includes("GBK") || enc.includes("gbk")) return "GBK";
                if (enc.includes("GB18030")) return "GB18030";
                return enc;
            } catch (e) {
                console.warn("编码探测失败，默认UTF-8", e);
                return "UTF-8";
            }
        }
        return currentEncoding;
    }

    // ★ 全局快捷键拦截
    function handleWindowKeydown(e: KeyboardEvent) {
        const mod = e.ctrlKey || e.metaKey;

        if (mod) {
            switch (e.key.toLowerCase()) {
                case "f": {
                    e.preventDefault();

                    // ★ 核心新增：选中即搜
                    let hasSelection = false;
                    if (editorInstance) {
                        const sel = editorInstance.getSelection();
                        const model = editorInstance.getModel();
                        if (sel && model && !sel.isEmpty()) {
                            const selectedText = model
                                .getValueInRange(sel)
                                .trim();
                            // 限制长度且不能有换行，防止把大段代码填进搜索框
                            if (
                                selectedText.length > 0 &&
                                selectedText.length <= 100 &&
                                !selectedText.includes("\n")
                            ) {
                                searchKeyword = selectedText;
                                hasSelection = true;
                            }
                        }
                    }

                    // 聚焦并全选搜索框内容
                    searchInputEl?.focus();
                    if (!hasSelection) {
                        searchInputEl?.select();
                    }
                    break;
                }
                case "g":
                    e.preventDefault();
                    jumpInputEl?.focus();
                    jumpInputEl?.select();
                    break;
            }
        } else if (e.key === "Escape") {
            // ★ 增强版 Esc 退出逻辑
            if (showResults) {
                showResults = false; // 优先关下拉框
            } else if (
                document.activeElement === searchInputEl ||
                document.activeElement === jumpInputEl
            ) {
                (document.activeElement as HTMLElement).blur(); // 输入框失焦

                // 如果是在搜索框按 Esc，顺便清空搜索词和高亮
                if (document.activeElement === searchInputEl) {
                    clearSearch();
                }
            } else if (editorInstance) {
                // 如果焦点在编辑器，按 Esc 则取消编辑器里选中高亮的词
                editorInstance.setSelection(new monaco.Range(1, 1, 1, 1));
            }
        }
    }

    // ★ 一键清空搜索状态
    function clearSearch() {
        searchKeyword = "";
        showResults = false;
        searchResults = [];
        if (editorInstance) {
            // 顺便清除掉编辑器里因跳转产生的选中高亮
            const currentSelection = editorInstance.getSelection();
            if (currentSelection) {
                editorInstance.setSelection(
                    new monaco.Range(
                        currentSelection.startLineNumber,
                        1,
                        currentSelection.startLineNumber,
                        1,
                    ),
                );
            }
        }
    }

    // 声明监听器变量，供 onDestroy 清理
    let unlistenLocale: (() => void) | null = null;
    let unlistenTheme: (() => void) | null = null;

    onMount(async () => {
        // ★ 新增：监听窗口最大化状态
        appWindow.isMaximized().then((v) => (isMaximized = v));
        const unlistenResize = appWindow.onResized(async () => {
            isMaximized = await appWindow.isMaximized();
        });

        // ==========================================
        // 1. 启动事件监听（用于主界面实时切换同步）
        // ==========================================
        try {
            unlistenLocale = await listen<string>(
                "broadcast-locale",
                (event) => {
                    setLocaleChoice(event.payload as LocaleChoice);
                },
            );

            unlistenTheme = await listen<string>("broadcast-theme", (event) => {
                currentTheme = event.payload;
                if (editorInstance) {
                    monaco.editor.setTheme(`txt-${currentTheme}`);
                }
                document.body.style.backgroundColor =
                    THEMES[currentTheme]?.editor_background || "#ffffff";
                themeForceUpdate += 1;
                themeStore.set(currentTheme); // ★ 核心新增：通知全局更新 CSS 变量
            });
        } catch (e) {
            console.error("监听事件注册失败:", e);
        }

        // ==========================================
        // 2. 初始化界面与数据加载
        // ==========================================
        try {
            const params = new URLSearchParams(window.location.search);
            const windowId = params.get("id");
            const urlLocale = params.get("locale");

            // 应用 URL 里的主题和语言（解决初始语言和主题不对的问题）
            currentTheme = params.get("theme") || "white";
            themeStore.set(currentTheme); // ★ 核心新增：第一帧就同步给全局，让 Tooltip 一开始颜色就对

            if (urlLocale) {
                setLocaleChoice(urlLocale as LocaleChoice);
            }

            if (!windowId) throw new Error("无效的窗口参数");

            document.body.style.backgroundColor =
                THEMES[currentTheme]?.editor_background || "#ffffff";

            // 获取文件路径
            filePath = await api.getLargeFilePath(windowId);

            // 读取首批数据（获取真实编码）
            const actualEnc = await getActualEncoding();
            currentEncoding = actualEnc; // ★ 核心：立刻把下拉框显示为真实编码
            const res = await api.readLargeChunk(filePath, 0, 5000, actualEnc);

            loadedLines = res.total_lines;

            await tick();
            initMonaco(res.content || "");

            // 后台静默统计总行数
            api.countLargeFileLines(filePath)
                .then((count) => {
                    totalLines = count;
                })
                .catch((err) => console.error("统计行数失败", err));
        } catch (e) {
            console.error(e);
            errorMsg = String(e);
        } finally {
            // ==========================================
            // 3. 强制等待 100ms 并显示窗口（完美防白屏闪烁）
            // ==========================================
            try {
                await new Promise((resolve) => setTimeout(resolve, 100));
                await api.showWindow();
            } catch (showErr) {
                console.error("显示窗口失败:", showErr);
            }
        }
    });

    // ==========================================
    // 4. 统一清理资源，防止内存泄漏
    // ==========================================
    onDestroy(() => {
        if (unlistenLocale) unlistenLocale();
        if (unlistenTheme) unlistenTheme();
        if (editorInstance) editorInstance.dispose();
    });

    function initMonaco(initialText: string) {
        if (!monacoContainer) return;

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
                    // ★ 新增：强行覆盖当前行的背景和边框颜色，让它明显且克制
                    "editor.lineHighlightBackground":
                        key === "dark" ? "#ffffff15" : "#00000010",
                    "editor.lineHighlightBorder": "#00000000", // 去掉边框更极简
                },
            });
        }

        editorInstance = monaco.editor.create(monacoContainer, {
            value: initialText,
            language: "plaintext",
            theme: `txt-${currentTheme}`,
            readOnly: true,
            domReadOnly: true,
            lineNumbers: (n) => (n + lineNumberOffset).toString(), // 自定义左侧行号的显示
            minimap: { enabled: false },
            folding: false,
            wordWrap: wordWrap ? "on" : "off",
            scrollBeyondLastLine: false,
            largeFileOptimizations: true,

            renderLineHighlight: "line", // ★ 开启当前行高亮
            occurrencesHighlight: "off", // ★ 核心：关闭光标相同的单词高亮（解决干扰）
            selectionHighlight: false, // ★ 核心：关闭选中高亮

            automaticLayout: true,
            scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                useShadows: false,
            },
            unicodeHighlight: {
                ambiguousCharacters: false,
                invisibleCharacters: false,
            },
            // ★ 核心终极杀招：彻底禁止渲染任何语法/语义校验的波浪线
            renderValidationDecorations: "off",
        });

        // 屏蔽 Monaco 内部快捷键
        editorInstance.onKeyDown((e) => {
            const mod = e.ctrlKey || e.metaKey;

            // 1. 屏蔽全选
            if (mod && e.keyCode === monaco.KeyCode.KeyA) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // 2. 屏蔽自带的查找替换、跳转，交还给全局快捷键
            if (
                mod &&
                (e.keyCode === monaco.KeyCode.KeyF ||
                    e.keyCode === monaco.KeyCode.KeyH ||
                    e.keyCode === monaco.KeyCode.KeyG)
            ) {
                e.preventDefault();
                e.stopPropagation();
                if (e.keyCode === monaco.KeyCode.KeyF) searchInputEl?.focus();
                if (e.keyCode === monaco.KeyCode.KeyG) jumpInputEl?.focus();
                return;
            }
        });

        // 滚动加载防抖
        let scrollTimeout: any;
        editorInstance.onDidScrollChange(() => {
            if (isLoadingChunk) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(async () => {
                if (!editorInstance) return;
                const scrollTop = editorInstance.getScrollTop();
                const scrollHeight = editorInstance.getScrollHeight();
                const clientHeight = editorInstance.getLayoutInfo().height;

                if (scrollTop + clientHeight >= scrollHeight - 2000) {
                    await loadNextChunk();
                }
            }, 100);
        });
    }

    async function loadNextChunk() {
        if (isLoadingChunk || !editorInstance) return;
        isLoadingChunk = true;

        try {
            const actualEnc = await getActualEncoding();
            const res = await api.readLargeChunk(
                filePath,
                loadedLines,
                CHUNK_SIZE,
                actualEnc,
            );
            if (!res || res.total_lines === 0) return;

            const model = editorInstance.getModel();
            if (model) {
                const lastLine = model.getLineCount();
                const lastLineMaxColumn = model.getLineMaxColumn(lastLine);
                model.applyEdits([
                    {
                        range: new monaco.Range(
                            lastLine,
                            lastLineMaxColumn,
                            lastLine,
                            lastLineMaxColumn,
                        ),
                        text: res.content,
                    },
                ]);
            }
            loadedLines += res.total_lines;
        } catch (e) {
            console.error("加载下一块失败:", e);
            toastMessage = t(
                "large_file.load_failed",
                undefined,
                $resolvedLocale,
            );
            showToast = true;
        } finally {
            isLoadingChunk = false;
        }
    }

    async function handleSearch() {
        if (!searchKeyword.trim() || isSearching) return;
        isSearching = true;
        showResults = true;
        searchResults = [];
        isLimitReached = false; // ★ 重置

        try {
            const actualEnc = await getActualEncoding();
            const res = await api.searchInLargeFile(
                filePath,
                searchKeyword,
                actualEnc,
            );
            searchResults = res.results;
            isLimitReached = res.is_limit_reached; // ★ 记录是否被截断
        } catch (e) {
            console.error("搜索失败:", e);
            toastMessage = t(
                "large_file.search_failed",
                undefined,
                $resolvedLocale,
            );
            showToast = true;
        } finally {
            isSearching = false;
        }
    }

    function handleJumpInput() {
        const raw = jumpLineInput.trim();

        // 1. 正则匹配：允许开头结尾的空格，允许带小数点（如 " 123. " 或 "123.0"）
        // 但不允许夹杂字母等非法字符
        const regex = /^\s*[+-]?\d+(\.\d*)?\s*$/;

        if (!regex.test(raw)) {
            isJumpError = true; // 非法字符，标红
            return;
        }

        // 2. 提取整数部分
        const parsed = parseFloat(raw);

        // 3. 校验必须是正数
        if (isNaN(parsed) || parsed < 1) {
            isJumpError = true;
            return;
        }

        const targetLine = Math.floor(parsed);

        // 4. 校验是否越界（前提是总行数已经获取到了）
        if (totalLines > 0 && targetLine > totalLines) {
            isJumpError = true; // 超出总行数，标红
            return;
        }

        // 5. 合法：清除错误状态，格式化输入框（去掉小数点和多余空格），执行跳转
        isJumpError = false;
        jumpLineInput = String(targetLine); // 回写清洗后的数字，比如 " 123.5 " 变成 "123"
        jumpToLine(targetLine);
    }

    function triggerJumpError() {
        isJumpError = true;
        setTimeout(() => {
            isJumpError = false;
        }, 500); // 500ms 后恢复
    }

    async function jumpToLine(targetLine: number) {
        if (targetLine < 1) return;
        showResults = false; // 跳转后自动收起搜索结果下拉框

        const fetchStart = Math.max(0, targetLine - 100);
        try {
            const actualEnc = await getActualEncoding();
            const res = await api.readLargeChunk(
                filePath,
                fetchStart,
                CHUNK_SIZE,
                actualEnc,
            );
            if (editorInstance) {
                lineNumberOffset = fetchStart;
                editorInstance.setValue(res.content);

                editorInstance.updateOptions({
                    lineNumbers: (n) => (n + lineNumberOffset).toString(),
                });

                const relativeLine = targetLine - fetchStart;
                editorInstance.revealLineInCenter(relativeLine);

                // 初始化或清空之前的搜索高亮
                if (!searchDecorations) {
                    searchDecorations =
                        editorInstance.createDecorationsCollection([]);
                } else {
                    searchDecorations.clear();
                }

                // ★ 核心：使用装饰器来给搜索词加超级显眼的背景
                if (searchKeyword.trim()) {
                    const lineContent =
                        editorInstance
                            .getModel()
                            ?.getLineContent(relativeLine) || "";
                    const matchIndex = lineContent.indexOf(searchKeyword);

                    if (matchIndex !== -1) {
                        // 1. 设置光标位置并选中，方便用户直接 Ctrl+C 复制
                        editorInstance.setSelection(
                            new monaco.Range(
                                relativeLine,
                                matchIndex + 1,
                                relativeLine,
                                matchIndex + 1 + searchKeyword.length,
                            ),
                        );

                        // 2. 添加专属的高亮装饰器（金黄/高亮色背景）
                        searchDecorations.set([
                            {
                                range: new monaco.Range(
                                    relativeLine,
                                    matchIndex + 1,
                                    relativeLine,
                                    matchIndex + 1 + searchKeyword.length,
                                ),
                                options: {
                                    inlineClassName: "search-match-highlight", // 使用自定义 CSS 类
                                },
                            },
                        ]);
                    } else {
                        editorInstance.setSelection(
                            new monaco.Range(relativeLine, 1, relativeLine, 1),
                        );
                    }
                } else {
                    editorInstance.setSelection(
                        new monaco.Range(relativeLine, 1, relativeLine, 1),
                    );
                }

                loadedLines = fetchStart + res.total_lines;
            }
        } catch (e) {
            console.error("跳转失败:", e);
        }
    }

    async function handleEncodingChange(e: Event) {
        const selectedValue = (e.target as HTMLSelectElement).value;

        if (selectedValue === "AutoDetect") {
            currentEncoding = "AutoDetect"; // 临时设为它，触发重新探测
            const actualEnc = await getActualEncoding();
            currentEncoding = actualEnc; // 探测完立刻变回真实编码
        } else {
            currentEncoding = selectedValue;
        }

        showResults = false;
        searchResults = [];

        if (!editorInstance) return;

        isLoadingChunk = true;
        try {
            const res = await api.readLargeChunk(
                filePath,
                0,
                CHUNK_SIZE,
                currentEncoding,
            );
            if (editorInstance) {
                lineNumberOffset = 0;
                editorInstance.setValue(res.content);
                editorInstance.updateOptions({
                    lineNumbers: (n) => (n + lineNumberOffset).toString(),
                });
                loadedLines = res.total_lines;
                editorInstance.revealLine(1);
            }
        } catch (err) {
            console.error("切换编码失败:", err);
        } finally {
            isLoadingChunk = false;
        }
    }

    function handleToggleWordWrap() {
        wordWrap = !wordWrap;
        if (editorInstance) {
            editorInstance.updateOptions({
                wordWrap: wordWrap ? "on" : "off",
            });
        }
    }
</script>

<!-- 绑定全局快捷键 -->
<svelte:window onkeydowncapture={handleWindowKeydown} />

<!-- 把这个 style 直接挂在 html 级别，保证一进页面就填满背景 -->
<svelte:head>
    <style>
            body { background-color: {THEMES[currentTheme]?.editor_background || '#ffffff'} !important; }
    </style>
</svelte:head>

<div
    class="large-viewer-container"
    style="
        --editor-background: {THEMES[currentTheme]?.editor_background ||
        '#fff'};
        --tab-bar-background: {THEMES[currentTheme]?.tab_bar_background ||
        '#f3f3f3'};
        --tab-foreground: {THEMES[currentTheme]?.tab_foreground || '#333'};
        --overlay-background: {THEMES[currentTheme]?.overlay_background ||
        '#fff'};
        --overlay-foreground: {THEMES[currentTheme]?.overlay_foreground ||
        '#333'};
        --overlay-border: {THEMES[currentTheme]?.overlay_border || '#ccc'};
        --overlay-hover-background: {THEMES[currentTheme]
        ?.overlay_hover_background || '#f0f0f0'};
        --overlay-divider: {THEMES[currentTheme]?.overlay_divider || '#e0e0e0'};
        --status-bar-foreground-muted: {THEMES[currentTheme]
        ?.status_bar_foreground_muted || '#999'};
        --warning-strong: {THEMES[currentTheme]?.warning_strong || '#cc6600'};
        --accent: {THEMES[currentTheme]?.accent || '#0db3db'};
         background: {THEMES[currentTheme]?.editor_background || '#ffffff'};
        color: {THEMES[currentTheme]?.tab_foreground || '#333'};
    "
>
    <!-- ★ 新增：悬浮错误提示条 -->
    {#if showToast}
        <div class="error-toast">
            <span>{toastMessage}</span>
            <button class="toast-close" onclick={() => (showToast = false)}
                >✕</button
            >
        </div>
    {/if}

    <!-- ★ 全新改造的顶部工具栏 (无边框拖拽 + 方案B布局) -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="tools-area"
        onmousedown={handleDragStart}
        data-tauri-drag-region
    >
        <!-- 1. 左侧区域：Mac红绿灯占位 + 文件名 -->
        <div class="tools-left" data-tauri-drag-region>
            {#if isMac}
                <div class="mac-traffic-spacer"></div>
            {/if}
            <span class="file-name-text" use:tooltip={filePath}>
                {fileName}
            </span>
        </div>

        <!-- 2. 中间区域：原有的各种工具组 -->
        <!-- 注意：必须加上 data-tauri-drag-region="false"，防止点输入框时把窗口拖飞 -->
        <div class="tools-center" data-tauri-drag-region="false">
            <!-- 1. 自动换行 -->
            <div class="tool-item">
                <span class="tool-label">
                    {t("settings.word_wrap", undefined, $resolvedLocale)}
                </span>
                <Toggle checked={wordWrap} onChange={handleToggleWordWrap} />
            </div>

            <div class="divider"></div>

            <!-- 2. 跳转区 -->
            <div class="tool-group">
                <input
                    type="text"
                    bind:this={jumpInputEl}
                    placeholder="#"
                    bind:value={jumpLineInput}
                    onkeydown={(e) => e.key === "Enter" && handleJumpInput()}
                    oninput={() => (isJumpError = false)}
                    class="tool-input jump-input"
                    class:input-error={isJumpError}
                />
                {#if totalLines > 0}
                    <span class="total-lines">
                        / {totalLines}
                    </span>
                {/if}
            </div>

            <div class="divider"></div>

            <!-- 3. 编码 -->
            <select
                class="tool-select"
                value={currentEncoding}
                onchange={handleEncodingChange}
            >
                {#each ENCODINGS as enc}
                    <option value={enc}>
                        {enc === "AutoDetect"
                            ? t(
                                  "large_file.auto_detect",
                                  undefined,
                                  $resolvedLocale,
                              )
                            : enc}
                    </option>
                {/each}
            </select>

            <div class="divider"></div>

            <!-- 4. 搜索区 -->
            <div class="tool-group">
                <div class="search-input-wrapper">
                    <input
                        type="text"
                        bind:this={searchInputEl}
                        bind:value={searchKeyword}
                        onkeydown={(e) => e.key === "Enter" && handleSearch()}
                        class="tool-input search-input"
                        placeholder={t(
                            "large_file.search_placeholder",
                            undefined,
                            $resolvedLocale,
                        )}
                    />
                    {#if searchKeyword.length > 0}
                        <button
                            class="clear-icon"
                            onclick={clearSearch}
                            aria-label="清空搜索">✕</button
                        >
                    {/if}
                </div>

                <button
                    class="icon-btn"
                    onclick={handleSearch}
                    aria-label="Search"
                >
                    {#if isSearching}
                        <span style="font-size: 11px;">...</span>
                    {:else}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    {/if}
                </button>
            </div>
        </div>

        <!-- 3. 右侧区域：窗口控制按钮 (仅非Mac) -->
        <div class="tools-right" data-tauri-drag-region="false">
            {#if !isMac}
                <button
                    class="window-btn"
                    onclick={handleMinimize}
                    aria-label="最小化"
                >
                    <svg width="10" height="10" viewBox="0 0 10 10"
                        ><line
                            x1="0"
                            y1="5"
                            x2="10"
                            y2="5"
                            stroke="currentColor"
                            stroke-width="1"
                        /></svg
                    >
                </button>
                <button
                    class="window-btn"
                    onclick={handleToggleMaximize}
                    aria-label={isMaximized ? "还原" : "最大化"}
                >
                    {#if isMaximized}
                        <svg width="10" height="10" viewBox="0 0 10 10"
                            ><rect
                                x="0"
                                y="2"
                                width="8"
                                height="8"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                            /><polyline
                                points="2,2 2,0 10,0 10,8 8,8"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                            /></svg
                        >
                    {:else}
                        <svg width="10" height="10" viewBox="0 0 10 10"
                            ><rect
                                x="0.5"
                                y="0.5"
                                width="9"
                                height="9"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                            /></svg
                        >
                    {/if}
                </button>
                <button
                    class="window-btn window-btn-close"
                    onclick={handleClose}
                    aria-label="关闭"
                >
                    <svg width="10" height="10" viewBox="0 0 10 10"
                        ><line
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="10"
                            stroke="currentColor"
                            stroke-width="1"
                        /><line
                            x1="10"
                            y1="0"
                            x2="0"
                            y2="10"
                            stroke="currentColor"
                            stroke-width="1"
                        /></svg
                    >
                </button>
            {/if}
        </div>
    </div>

    <!-- 搜索结果下拉框 -->
    {#if showResults}
        <div class="search-results-panel">
            {#if searchResults.length === 0}
                <div class="empty-hint">
                    {isSearching ? "正在全文件扫描..." : "未找到匹配项"}
                </div>
            {:else}
                {#each searchResults as res}
                    <div
                        class="result-item"
                        onclick={() => jumpToLine(res.line_number)}
                    >
                        <span class="line-num">行 {res.line_number}</span>
                        <span class="line-content">{res.content}</span>
                    </div>
                {/each}
                <!-- ★ 新增：达到上限的提示 -->
                {#if isLimitReached}
                    <div class="limit-hint">
                        {t(
                            "large_file.search_limit",
                            undefined,
                            $resolvedLocale,
                        )}
                    </div>
                {/if}
            {/if}
        </div>
    {/if}

    <!-- Monaco 编辑器容器 -->
    <div class="viewer-body">
        {#if errorMsg}
            <div class="error-msg">{errorMsg}</div>
        {:else if filePath}
            <div class="monaco-container" bind:this={monacoContainer}></div>
        {:else}
            <div class="placeholder">正在初始化...</div>
        {/if}
    </div>
</div>

<style>
    /* ==========================================
       1. 全局布局与基础容器
       ========================================== */
    .large-viewer-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .viewer-body {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    .monaco-container {
        width: 100%;
        height: 100%;
    }

    /* ==========================================
       2. 顶部工具栏 (方案B布局)
       ========================================== */
    .tools-area {
        height: 38px;
        background: var(--tab-bar-background);
        border-bottom: 1px solid var(--overlay-divider);
        display: flex;
        align-items: center;
        justify-content: space-between; /* ★ 改为两端对齐 */
        padding: 0;
        user-select: none;
        flex-shrink: 0;
    }

    /* 左侧文件名区 */
    .tools-left {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0; /* 允许文字截断 */
        padding: 0 12px;
        height: 100%;
    }
    .mac-traffic-spacer {
        width: 70px;
        flex-shrink: 0;
    }
    .file-name-text {
        font-size: 12px;
        color: var(--tab-foreground);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
    }

    /* 中间工具区 */
    .tools-center {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    /* 右侧控制按钮区 */
    .tools-right {
        display: flex;
        align-items: center;
        flex: 1; /* ★ 右边也占一份空间（在Mac下即使没按钮也占空间） */
        min-width: 0;
        justify-content: flex-end; /* 靠右对齐 */
        height: 100%;
    }

    /* 按钮基础样式 */
    .window-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--tab-foreground);
        width: 46px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.1s;
    }
    .window-btn:hover {
        background: color-mix(in srgb, var(--tab-foreground) 15%, transparent);
    }
    .window-btn-close:hover {
        background: #e81123;
        color: white;
    }

    .total-lines {
        font-size: 12px;
        color: var(--tab-foreground);
        opacity: 1;
        font-weight: 500;
        white-space: nowrap;
        margin-left: 1px;
    }

    .tool-item {
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }

    .tool-group {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .divider {
        width: 1px;
        height: 16px;
        background: var(--overlay-divider);
        margin: 0 4px;
    }

    /* ==========================================
       3. 工具栏内部元素 (文字、输入框、按钮)
       ========================================== */
    /* 统一文字颜色 */
    .tool-label,
    .tool-input,
    .tool-select {
        color: var(--tab-foreground);
    }

    .tool-label {
        font-size: 12px;
    }

    .tool-input {
        height: 24px;
        border: 1px solid var(--overlay-border);
        border-radius: 4px;
        background: var(--editor-background);
        padding: 0 8px;
        font-size: 12px;
        outline: none;
    }

    .jump-input {
        width: 60px;
        text-align: center;
    }

    .tool-select {
        height: 26px;
        border: 1px solid var(--overlay-border);
        border-radius: 4px;
        background: var(--editor-background);
        padding: 0 4px;
        font-size: 12px;
        outline: none;
        cursor: pointer;
        font-family: inherit;
    }

    .icon-btn {
        height: 26px;
        width: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--overlay-border);
        background: var(--overlay-hover-background);
        color: var(--tab-foreground);
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s;
    }

    .icon-btn:hover {
        background: var(--overlay-border);
    }

    /* ==========================================
       4. 搜索框专属定制
       ========================================== */
    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-input {
        width: 140px;
        padding-right: 24px; /* 给 X 按钮留出空间 */
    }

    .clear-icon {
        position: absolute;
        right: 6px;
        background: none;
        border: none;
        color: var(--status-bar-foreground-muted);
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: color 0.15s;
    }

    .clear-icon:hover {
        color: var(--warning-strong); /* 悬停变红，提示清除 */
    }

    /* ==========================================
       5. 输入框异常状态与动画
       ========================================== */
    .input-error {
        border-color: var(--warning-strong) !important;
        animation: shake 0.4s ease-in-out;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-4px);
        }
        75% {
            transform: translateX(4px);
        }
    }

    /* ==========================================
       6. 搜索结果下拉面板
       ========================================== */
    .search-results-panel {
        position: absolute;
        top: 38px;
        right: 16px;
        width: 400px;
        max-height: 300px;
        background: var(--overlay-background);
        color: var(--overlay-foreground);
        border: 1px solid var(--overlay-border);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 0 0 4px 4px;
        overflow-y: auto;
        z-index: 100;
    }
    /* ★ 新增：搜索结果面板的自定义滚动条 */
    .search-results-panel::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    .search-results-panel::-webkit-scrollbar-track {
        background: transparent;
    }
    .search-results-panel::-webkit-scrollbar-thumb {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 25%,
            transparent
        );
        border-radius: 5px;
        min-height: 40px;
        transition: background 0.2s ease-in-out;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    .search-results-panel::-webkit-scrollbar-thumb:hover {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 50%,
            transparent
        );
    }
    .search-results-panel::-webkit-scrollbar-button {
        display: none;
    }

    .result-item {
        display: flex;
        padding: 6px 12px;
        border-bottom: 1px solid var(--overlay-divider);
        cursor: pointer;
        font-size: 12px;
        align-items: center;
    }

    .result-item:hover {
        background: var(--overlay-hover-background);
    }

    .line-num {
        color: var(--accent);
        margin-right: 12px;
        font-weight: bold;
        white-space: nowrap;
    }

    .line-content {
        color: var(--status-bar-foreground-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .empty-hint {
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: var(--status-bar-foreground-muted);
    }
    .limit-hint {
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: var(--warning-strong);
        border-top: 1px solid var(--overlay-divider);
        background: color-mix(in srgb, var(--warning-strong) 5%, transparent);
    }

    /* ==========================================
       7. 系统提示与异常占位
       ========================================== */
    .error-msg {
        color: var(--warning-strong);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--status-bar-foreground-muted);
    }

    /* Toast 悬浮提示 */
    .error-toast {
        position: absolute;
        top: 48px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--warning-strong, #cc6600);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: toastFadeIn 0.2s ease-out;
    }

    .toast-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        opacity: 0.8;
        padding: 0;
    }

    .toast-close:hover {
        opacity: 1;
    }

    @keyframes toastFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    /* ==========================================
       8. Monaco 内部深度定制
       ========================================== */
    /* ★ 搜索词命中的超强高亮（类似浏览器的黄色底色） */
    :global(.search-match-highlight) {
        background-color: rgba(
            255,
            200,
            0,
            0.4
        ) !important; /* 耀眼的暖黄色，半透明 */
        border-radius: 2px;
        box-shadow: 0 0 0 1px rgba(255, 200, 0, 0.8); /* 加一圈细边框让它绝对显眼 */
        color: var(--editor-foreground) !important;
    }
</style>
