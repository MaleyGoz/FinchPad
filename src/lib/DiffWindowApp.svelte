<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as monaco from "monaco-editor";
    import editorWorker from "monaco-editor/editor/editor.worker?worker";
    import { listen } from "@tauri-apps/api/event";
    import { api, type DiffPayload } from "$lib/api";
    import { t, resolvedLocale } from "$lib/i18n";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    const appWindow = getCurrentWindow();

    if (!(self as any).MonacoEnvironment) {
        (self as any).MonacoEnvironment = {
            getWorker: () => new editorWorker(),
        };
    }

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

    // ★ 动态设置原生窗口标题
    $: if (appWindow && $resolvedLocale) {
        appWindow.setTitle(t("diff.window_title", undefined, $resolvedLocale));
    }

    onMount(() => {
        let unlistenPayload: (() => void) | null = null;

        (async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const theme = urlParams.get("theme") ?? "white";

            payload = await api.getDiffPayload();
            if (payload) buildDiff(payload, theme);

            listen("diff-payload-updated", async () => {
                payload = await api.getDiffPayload();
                if (payload) buildDiff(payload, theme);
            }).then((fn) => (unlistenPayload = fn));
        })();

        return () => {
            if (unlistenPayload) unlistenPayload();
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
            e.preventDefault();
            api.closeDiffWindow();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="diff-window">
    <!-- 左右标题栏：最左侧放按钮，右侧显示路径 -->
    <div class="diff-titles-row">
        <!-- 悬浮的按钮区域 -->
        <div class="titles-actions">
            <button class="text-btn" on:click={toggleWordWrap}>
                {wordWrap
                    ? t("status.word_wrap_on", undefined, $resolvedLocale)
                    : t("status.word_wrap_off", undefined, $resolvedLocale)}
            </button>

            {#if payload?.mode === "disk"}
                <button class="text-btn" on:click={handleKeepMine}>
                    {t("diff.keep_mine", undefined, $resolvedLocale)}
                </button>
                <button class="text-btn primary" on:click={handleUseDisk}>
                    {t("diff.use_disk", undefined, $resolvedLocale)}
                </button>
            {/if}
        </div>

        <!-- 占满全宽的路径区域 -->
        <div class="titles-paths">
            <div class="diff-title-cell" title={payload?.left_title ?? ""}>
                <span class="diff-title-text">{payload?.left_title ?? ""}</span>
            </div>
            <div class="diff-title-cell" title={payload?.right_title ?? ""}>
                <span class="diff-title-text">{payload?.right_title ?? ""}</span
                >
            </div>
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
        background: var(--tab-bar-background, #d8dde3);
    }

    /* 标题行总容器 */
    .diff-titles-row {
        display: flex;
        height: 32px;
        flex-shrink: 0;
        background: var(--status-bar-background, #f3f3f3);
        border-bottom: 1px solid var(--overlay-divider);
        user-select: none;
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
        background: var(--status-bar-background, #f3f3f3);
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
        min-width: 0;
        display: flex;
        align-items: center;
        padding: 0 12px;
        overflow: hidden;
    }

    /* ★ 左侧路径：给按钮留出空间，并用 box-shadow 代替 border 避免挤压 */
    .diff-title-cell:first-child {
        padding-left: 120px;
        box-shadow: 1px inset var(--overlay-divider); /* 向左画内部阴影，充当分割线且不占宽度 */
        /* 或者用外面的 border-right 也可以，主要靠 Grid 保证宽度 */
    }

    /* 路径文字 */
    .diff-title-text {
        font-size: 12px;
        color: var(--status-bar-foreground, #555);
        font-family: "Consolas", monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        direction: rtl;
        text-align: left;
    }

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
</style>
