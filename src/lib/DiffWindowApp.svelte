<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as monaco from "monaco-editor";
    import { listen } from "@tauri-apps/api/event";
    import { api, type DiffPayload } from "$lib/api";
    import { get } from "svelte/store";
    import { t, resolvedLocale } from "$lib/i18n";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { showTooltip, hideTooltip } from "$lib/tooltip"; // ★ 只借用这两个底层函数，不碰全局 Action
    import Toggle from "$lib/Toggle.svelte"; // ★ 新增：替换原有的勾选框

    const appWindow = getCurrentWindow();

    // ==========================================
    // ★ 专属局部 Action：如果路径没截断，就不弹 Tooltip
    // ==========================================
    function smartPathTooltip(node: HTMLElement, text: string | undefined) {
        let timer: ReturnType<typeof setTimeout> | null = null;

        function onEnter() {
            if (!text) return;
            // ★ 核心判断：如果内容实际宽度小于等于可见宽度，说明显示完整，直接放弃弹窗
            if (node.scrollWidth <= node.clientWidth) return;

            const tooltipText = text; // ★ 核心修复：提取为常量，TS 就能锁定它必定是 string

            timer = setTimeout(() => {
                showTooltip(tooltipText, node); // 使用提取的常量
            }, 500);
        }

        function onLeave() {
            if (timer) clearTimeout(timer);
            hideTooltip();
        }

        node.addEventListener("mouseenter", onEnter);
        node.addEventListener("mouseleave", onLeave);

        return {
            update(newText: string | undefined) {
                text = newText;
            },
            destroy() {
                if (timer) clearTimeout(timer);
                node.removeEventListener("mouseenter", onEnter);
                node.removeEventListener("mouseleave", onLeave);
            },
        };
    }

    // ==========================================
    // ★ 专属对比窗口的查找框tooltip和i18n
    // ==========================================
    function setupFindWidget(container: HTMLElement) {
        // 1. 绑定 Tooltip 的通用函数
        const bind = (
            el: Element | null,
            key: string,
            fallback: string,
            closeOnClick = false,
        ) => {
            if (!el || (el as any).__local_tooltip_bound) return;
            (el as any).__local_tooltip_bound = true;

            el.addEventListener("mouseenter", (e) => {
                const text = t(key, undefined, get(resolvedLocale)) || fallback;
                showTooltip(text, e.currentTarget as HTMLElement);
            });

            el.addEventListener("mouseleave", () => {
                hideTooltip();
            });

            if (closeOnClick) {
                el.addEventListener("click", () => hideTooltip());
            }
        };

        // 2. 强制应用翻译（借鉴主界面的核心逻辑，兼容双查找框）
        const applyI18n = (widget: HTMLElement) => {
            const isMacPlatform =
                typeof navigator !== "undefined" &&
                /Mac|iPhone|iPad/.test(
                    navigator.platform || navigator.userAgent,
                );
            const modKey = isMacPlatform ? "Cmd" : "Ctrl";

            const tr = (key: string, fallback: string, params?: any) => {
                try {
                    return t(key, params, get(resolvedLocale)) || fallback;
                } catch {
                    return fallback;
                }
            };

            // ★ 核心修复：拼装出 "查找 (Ctrl+F)" 格式
            const targetFindText = `${tr("editor.find.placeholder", "Find")} (${modKey}+F)`;

            // 处理输入框 Placeholder（只处理第一个输入框）
            const inputs = widget.querySelectorAll(".monaco-inputbox .input");
            inputs.forEach((input, index) => {
                const el = input as HTMLInputElement;
                if (index === 0 && el.placeholder !== targetFindText) {
                    el.placeholder = targetFindText;
                }
            });

            // 处理结果计数 (No results / 第 X 项，共 Y 项)
            const matchesCount = widget.querySelector(".matchesCount");
            if (matchesCount && matchesCount.textContent) {
                const text = matchesCount.textContent;
                if (text === "No results" || text === "无结果") {
                    const noRes = tr("editor.find.no_results", "No results");
                    if (text !== noRes) matchesCount.textContent = noRes;
                } else if (text.includes(" of ") || text.includes("项")) {
                    const match = text.match(
                        /(\d+)\s+(?:of|项，共)\s+(\d+\+?)/,
                    );
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
        };

        // 3. 统一处理所有查找框实例（左边和右边都有）
        const processWidgets = () => {
            const widgets = container.querySelectorAll(".find-widget");
            widgets.forEach((widget) => {
                // 绑定 6 个只读模式下的按钮 Tooltip
                bind(
                    widget.querySelector(".codicon-find-selection"),
                    "editor.find.find_in_selection",
                    "Find in Selection",
                );
                bind(
                    widget.querySelector(".codicon-case-sensitive"),
                    "editor.find.match_case",
                    "Match Case",
                );
                bind(
                    widget.querySelector(".codicon-whole-word"),
                    "editor.find.match_whole_word",
                    "Match Whole Word",
                );
                bind(
                    widget.querySelector(".codicon-regex"),
                    "editor.find.use_regex",
                    "Use Regular Expression",
                );
                bind(
                    widget.querySelector(".codicon-find-previous-match"),
                    "editor.find.prev_match",
                    "Previous Match",
                );
                bind(
                    widget.querySelector(".codicon-find-next-match"),
                    "editor.find.next_match",
                    "Next Match",
                );
                bind(
                    widget.querySelector(".codicon-widget-close"),
                    "editor.find.close",
                    "Close (Esc)",
                    true,
                );

                // ★ 应用翻译
                applyI18n(widget as HTMLElement);
            });
        };

        // 初始跑一次
        processWidgets();

        // 4. 监听 DOM 变化
        const observer = new MutationObserver(() => {
            processWidgets();
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return observer;
    }

    // ==========================================
    // 1. 窗口状态与平台判断 (★ 新增)
    // ==========================================
    const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    let isMaximized = false;

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

    // ==========================================
    // 2. 手动拖拽逻辑 (★ 新增)
    // ==========================================
    function handleDragStart(e: MouseEvent) {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        // 过滤掉可交互元素
        if (target.closest("button, input, select, .tool-item, .toggle"))
            return;
        appWindow.startDragging().catch(console.error);
    }

    // ==========================================
    // 3. Monaco 环境初始化
    // ==========================================
    // if (!(self as any).MonacoEnvironment) {
    //     (self as any).MonacoEnvironment = {
    //         getWorker: () => new editorWorker(),
    //     };
    // }

    const BASE_FONT_SIZE = 15;

    let payload: DiffPayload | null = null;
    let wordWrap = false;

    function toggleWordWrap() {
        wordWrap = !wordWrap;
        if (diffEditor) {
            diffEditor.updateOptions({ wordWrap: wordWrap ? "on" : "off" });
        }
    }

    let container: HTMLDivElement;
    let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;

    // ==========================================
    // 4. 核心渲染函数 (★ 绝对未修改，100% 原版)
    // ==========================================
    function buildDiff(p: DiffPayload, theme: string) {
        if (!container) return;

        const themes: Record<string, "vs" | "vs-dark"> = {
            white: "vs",
            gray: "vs",
            sepia: "vs",
            green: "vs",
            dark: "vs-dark",
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
            fontFamily: "Consolas, monospace",
            readOnly: true,
            renderSideBySide: true,
            useInlineViewWhenSpaceIsLimited: false,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderOverviewRuler: false,
            wordWrap: wordWrap ? "on" : "off",
            originalEditable: false,
            ignoreTrimWhitespace: false,
            renderIndicators: true,
            lineNumbers: "on",
            glyphMargin: false,
            lineNumbersMinChars: 2,
            lineDecorationsWidth: 12,

            // ★ 核心修复 1：开启高级算法，专治各种不相关文件比对罢工
            diffAlgorithm: "advanced",
            // ★ 核心修复 2：开启空白行折叠（之前丢了，加上体验更好）
            hideUnchangedRegions: {
                enabled: true,
                contextLineCount: 3,
                minimumLineCount: 3,
                revealLineCount: 20,
            },
            // ★ 加入细滚动条配置
            scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                useShadows: false,
            },
        });

        const leftModel = monaco.editor.createModel(
            p.left_content,
            "plaintext",
        );
        const rightModel = monaco.editor.createModel(
            p.right_content,
            "plaintext",
        );
        diffEditor.setModel({ original: leftModel, modified: rightModel });
    }

    // 动态设置原生窗口标题
    $: if (appWindow && $resolvedLocale) {
        appWindow.setTitle(t("diff.window_title", undefined, $resolvedLocale));
    }

    // ==========================================
    // 5. 生命周期 (★ 加入了窗口最大化监听)
    // ==========================================
    onMount(() => {
        let unlistenPayload: (() => void) | null = null;
        let findWidgetObserver: MutationObserver | null = null; // ★ 新增这行

        (async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const theme = urlParams.get("theme") ?? "white";

            if (theme === "dark") {
                appWindow.setTheme("dark").catch(console.error);
            } else {
                appWindow.setTheme("light").catch(console.error);
            }

            payload = await api.getDiffPayload();
            if (payload) buildDiff(payload, theme);

            listen("diff-payload-updated", async () => {
                payload = await api.getDiffPayload();
                if (payload) buildDiff(payload, theme);
            }).then((fn) => (unlistenPayload = fn));
        })();

        // 启动查找框监听（等 DOM 稍微稳定一点）
        setTimeout(() => {
            if (container) {
                findWidgetObserver = setupFindWidget(container); // ★ 接收返回值
            }
        }, 100);

        // 监听窗口最大化状态
        appWindow.isMaximized().then((v) => (isMaximized = v));
        const unlistenResize = appWindow.onResized(async () => {
            isMaximized = await appWindow.isMaximized();
        });

        return () => {
            if (unlistenPayload) unlistenPayload();
            unlistenResize.then((fn) => fn());
            if (findWidgetObserver) findWidgetObserver.disconnect();
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

    // ==========================================
    // 6. 业务交互
    // ==========================================
    async function handleUseDisk() {
        if (!payload || payload.conflict_idx < 0) return;
        await api.applyDiskVersion(payload.conflict_idx);
        await api.closeDiffWindow();
    }

    async function handleKeepMine() {
        await api.closeDiffWindow();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            // ★ 新增这行判断：如果页面上有查找框，说明用户想先关查找框，直接 return 不关窗口
            if (document.querySelector(".find-widget")) return;
            e.preventDefault();
            api.closeDiffWindow();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="diff-window">
    <!-- ==========================================
         ★ 全新的自绘标题栏 (无边框 + 拖拽 + 胶囊开关)
         ========================================== -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="diff-titles-row"
        on:mousedown={handleDragStart}
        data-tauri-drag-region
    >
        <!-- Mac 红绿灯占位 -->
        {#if isMac}
            <div class="mac-traffic-spacer" data-tauri-drag-region></div>
        {/if}

        <!-- 左侧工具区：胶囊开关 + 按钮 -->
        <div class="titles-actions" data-tauri-drag-region="false">
            <div class="tool-item">
                <span class="tool-label">
                    {t("settings.word_wrap", undefined, $resolvedLocale)}
                </span>
                <Toggle checked={wordWrap} onChange={toggleWordWrap} />
            </div>

            {#if payload?.mode === "disk"}
                <button class="text-btn" on:click={handleKeepMine}>
                    {t("diff.keep_mine", undefined, $resolvedLocale)}
                </button>
                <button class="text-btn primary" on:click={handleUseDisk}>
                    {t("diff.use_disk", undefined, $resolvedLocale)}
                </button>
            {/if}
        </div>

        <!-- 路径区域：使用 Flex 均分，并支持悬浮 Tooltip -->
        <div class="titles-paths" data-tauri-drag-region>
            <div class="diff-title-cell">
                <span
                    class="diff-title-text"
                    use:smartPathTooltip={payload?.left_title}
                >
                    {payload?.left_title ?? ""}
                </span>
            </div>
            <div class="diff-title-cell">
                <span
                    class="diff-title-text"
                    use:smartPathTooltip={payload?.right_title}
                >
                    {payload?.right_title ?? ""}
                </span>
            </div>
        </div>

        <!-- 右侧 Windows 窗口控制按钮 -->
        {#if !isMac}
            <div class="window-controls" data-tauri-drag-region="false">
                <button
                    class="window-btn"
                    on:click={handleMinimize}
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
                    on:click={handleToggleMaximize}
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
                    on:click={handleClose}
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
            </div>
        {/if}
    </div>

    <!-- Monaco Diff Editor 容器 (未做任何 CSS 污染) -->
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
        background: var(--tab-bar-background, #d8dde3);
    }

    /* ==========================================
       ★ 新版标题栏样式 (Flex 布局)
       ========================================== */
    .diff-titles-row {
        display: flex;
        height: 38px;
        flex-shrink: 0;
        background: var(--status-bar-background, #f3f3f3);
        border-bottom: 1px solid var(--overlay-divider);
        user-select: none;
        align-items: stretch;
    }

    .mac-traffic-spacer {
        width: 100px;
        flex-shrink: 0;
    }

    .titles-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 12px;
        z-index: 10;
        flex-shrink: 0;
        border-right: 1px solid var(--overlay-divider);
    }

    .titles-actions .tool-item {
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }

    .titles-actions .tool-label {
        font-size: 12px;
        color: var(--tab-foreground);
    }

    /* 路径区域 */
    .titles-paths {
        flex: 1;
        display: flex;
        min-width: 0; /* 极其关键：防止路径撑破容器 */
    }

    .diff-title-cell {
        flex: 1; /* 1:1 平分 */
        min-width: 0; /* 极其关键：允许内部文字截断 */
        display: flex;
        align-items: center;
        padding: 0 12px;
        overflow: hidden;
    }

    .diff-title-cell:first-child {
        border-right: 1px solid var(--overlay-divider);
    }

    .diff-title-text {
        font-size: 12px;
        color: var(--status-bar-foreground, #555);
        font-family: "Consolas", monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        direction: rtl;
        text-align: left;
        unicode-bidi: plaintext; /* 修正英文标点 */
    }

    /* 右侧窗口按钮 */
    .window-controls {
        display: flex;
        flex-shrink: 0;
    }
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
        /* ★ 核心修复：使用前景色混合 15% 的透明度，确保在所有主题下都清晰可见 */
        background: color-mix(in srgb, var(--tab-foreground) 15%, transparent);
    }
    .window-btn-close:hover {
        background: #e81123;
        color: white;
    }

    /* 编辑区 */
    .diff-body {
        flex: 1;
        overflow: hidden;
        background: white;
    }

    /* 按钮样式 */
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
    .text-btn:hover {
        filter: brightness(0.95);
    }
    .text-btn.primary {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }
    .text-btn.primary:hover {
        filter: brightness(0.9);
    }

    /* ======================================================
       ★ 极简超细滚动条样式 (仅此样式，不影响核心高亮)
       ====================================================== */
    :global(.monaco-scrollable-element > .scrollbar > .slider) {
        border-radius: 5px !important;
        transition: background 0.2s ease-in-out;
    }
    :global(.monaco-scrollable-element > .scrollbar) {
        background: transparent !important;
    }
    :global(.monaco-scrollable-element > .scrollbar.vertical > .slider) {
        min-height: 40px !important;
    }
    :global(.monaco-scrollable-element > .scrollbar.horizontal > .slider) {
        min-width: 40px !important;
    }
</style>
