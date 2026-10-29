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
        font-family: sans-serif;
        line-height: 1.4;
        white-space: pre-wrap;
    }
    .global-tooltip.above {
        transform: translateY(-100%);
    }
</style>
