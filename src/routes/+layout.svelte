<script lang="ts">
    import { tooltipStore } from "$lib/tooltip";
    import { currentTheme, THEMES } from "$lib/themes";
    import DiffWindowApp from "$lib/DiffWindowApp.svelte";

    // 检测是否对比窗口
    const urlParams =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : new URLSearchParams();
    const isDiffWindow = urlParams.get("mode") === "diff";
    const themeFromUrl = urlParams.get("theme");

    // 对比窗口用 URL 参数指定的主题
    if (isDiffWindow && themeFromUrl) {
        currentTheme.set(themeFromUrl);
    }

    $: {
        const theme = THEMES[$currentTheme] ?? THEMES.white;
        const root = document.documentElement;
        root.style.setProperty(
            "--tab-bar-background",
            theme.tab_bar_background,
        );
        root.style.setProperty(
            "--tab-bar-background-inactive",
            theme.tab_bar_background_inactive,
        );
        root.style.setProperty(
            "--tab-background-active",
            theme.tab_background_active,
        );
        root.style.setProperty("--tab-foreground", theme.tab_foreground);
        root.style.setProperty(
            "--tab-foreground-active",
            theme.tab_foreground_active,
        );
        root.style.setProperty("--tab-border", theme.tab_border);
        root.style.setProperty(
            "--status-bar-background",
            theme.status_bar_background,
        );
        root.style.setProperty(
            "--status-bar-foreground",
            theme.status_bar_foreground,
        );
        root.style.setProperty(
            "--status-bar-foreground-muted",
            theme.status_bar_foreground_muted,
        );
        root.style.setProperty(
            "--overlay-background",
            theme.overlay_background,
        );
        root.style.setProperty(
            "--overlay-foreground",
            theme.overlay_foreground,
        );
        root.style.setProperty(
            "--overlay-foreground-muted",
            theme.overlay_foreground_muted,
        );
        root.style.setProperty("--overlay-border", theme.overlay_border);
        root.style.setProperty(
            "--overlay-hover-background",
            theme.overlay_hover_background,
        );
        root.style.setProperty("--overlay-divider", theme.overlay_divider);
        root.style.setProperty("--accent", theme.accent);
        // ★ 新增这一行：把光标颜色注入为全局 CSS 变量
        root.style.setProperty("--editor-cursor", theme.editor_cursor);
        root.style.setProperty("--warning", theme.warning);
        root.style.setProperty("--warning-strong", theme.warning_strong);
    }
</script>

<svelte:window
    on:contextmenu={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".monaco-editor")) return;
        e.preventDefault();
    }}
/>

{#if isDiffWindow}
    <DiffWindowApp />
{:else}
    <slot />
{/if}

<!-- ★ 核心修改：把全局 Tooltip 移出 else 分支，让对比窗口也能使用它 -->
{#if $tooltipStore.visible}
    <div
        class="global-tooltip"
        class:above={$tooltipStore.placeAbove}
        style="left: {$tooltipStore.x}px; top: {$tooltipStore.y}px;"
    >
        {$tooltipStore.text}
    </div>
{/if}

<style>
    /* ==========================================
       1. 全局字体与基础变量定义 (唯一真理源)
       ========================================== */
    :global(:root) {
        /* 
         * 全球多语言 UI 无衬线字体栈 (已具备极佳的全球多语言覆盖)
         */
        --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", "Noto Sans", "PingFang SC", "Microsoft YaHei",
            "WenQuanYi Micro Hei", sans-serif;

        /* 
         * 全球多语言代码/路径等宽字体栈（全球化无乱码终极版）
         * 策略：平台精品西文 -> 跨平台顶级开源西文 -> 全球全语系开源兜底 (Noto Sans Mono) -> CJK/地区专用兜底
         */
        --font-mono: 
            /* 1. Windows 顶级西文等宽（兼顾非纯白背景清晰度） */ "Consolas",
            /* 2. 现代跨平台高性能西文等宽（带连字与优秀抗锯齿） */
                "Cascadia Code",
            /* 3. macOS 顶级专有等宽 */ "SF Mono", "Menlo", "Monaco",
            /* 4. Linux 与通用开源优秀西文等宽 */ "Ubuntu Mono",
            "DejaVu Sans Mono", "Source Code Pro",
            /* 5. 【核心】Google Noto 全球多语言等宽兜底（消灭全世界绝大部分非拉丁语系乱码） */
                "Noto Sans Mono",
            /* 6. CJK（中日韩）等宽与各平台本地化字体兜底（防止中日韩混排错位） */
                "Noto Sans Mono CJK SC",
            "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB",
            "WenQuanYi Micro Hei", monospace;
    }
    /* 强制表单元素继承全局 UI 字体 */
    :global(button),
    :global(input),
    :global(select),
    :global(textarea) {
        font-family: inherit;
    }

    /* ==========================================
       2. 全局 Body 基础样式
       ========================================== */
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;

        /* 默认继承全局的 UI 无衬线字体 */
        font-family: var(--font-sans);

        /* 开启字体抗锯齿，让文字在 Windows 上也能像 macOS 一样极致平滑 */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* ==========================================
       3. 全局 Tooltip 浮层样式
       ========================================== */
    .global-tooltip {
        position: fixed;
        background: var(--overlay-background);
        color: var(--overlay-foreground);
        border: 1px solid var(--overlay-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 6px 10px;
        font-size: 12px;
        max-width: 500px;
        word-break: break-all;
        z-index: 10000;
        pointer-events: none;

        /* 使用全局统一的 UI 无衬线字体 */
        font-family: var(--font-sans);

        line-height: 1.4;
        white-space: pre-wrap;
    }
    .global-tooltip.above {
        transform: translateY(-100%);
    }
</style>
