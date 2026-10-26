<script lang="ts">
    import { t, resolvedLocale } from "$lib/i18n";

    export let lineCount: number;
    export let charCount: number;
    export let selectedCount: number;
    export let selectedLineCount: number = 0;
    export let encoding: string;
    export let lineEnding: string;
    export let isDirty: boolean;
    export let diskState: string = "normal";
    export let zoom: number = 100;
    export let wordWrap: boolean = true;
    export let showLineNumbers: boolean = true;
    export let onToggleLineNumbers: () => void = () => {};
    export let wordWrapDisabled: boolean = false;
    export let onToggleWordWrap: () => void = () => {};
    export let onZoomChange: (value: number) => void = () => {};
    export let sidebarMode: "recent" | "directory" | null = null;
    export let onToggleSidebar: (
        mode: "recent" | "directory",
    ) => void = () => {};
    export let canUseDirectory = false;

    const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200, 300, 400];
    // 判断平台并生成快捷键文本
    const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const sidebarShortcut = isMac ? "Cmd+B" : "Ctrl+B";

    let zoomMenuOpen = false;

    function toggleZoomMenu() {
        zoomMenuOpen = !zoomMenuOpen;
    }

    function handleZoomRightClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        toggleZoomMenu();
    }

    function selectZoom(v: number) {
        zoomMenuOpen = false;
        onZoomChange(v);
    }

    function handleWindowClick(e: MouseEvent) {
        if (!zoomMenuOpen) return;
        const target = e.target as HTMLElement;
        if (target.closest(".zoom-wrapper")) return;
        zoomMenuOpen = false;
    }

    function lineEndingTooltip(le: string, locale?: string): string {
        switch (le) {
            case "LF":
                return t("status.line_ending_lf", undefined, locale as any);
            case "CRLF":
                return t("status.line_ending_crlf", undefined, locale as any);
            case "CR":
                return t("status.line_ending_cr", undefined, locale as any);
            default:
                return le;
        }
    }

    function encodingTooltip(enc: string, locale?: string): string {
        return t("status.encoding_tooltip", { encoding: enc }, locale as any);
    }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="status-bar" data-locale={$resolvedLocale}>
    <!-- 最近文件 -->
    <div class="tooltip-wrapper tooltip-left">
        <button
            class="sidebar-btn"
            class:active={sidebarMode === "recent"}
            onclick={() => onToggleSidebar("recent")}
            aria-label={t("sidebar.recent", undefined, $resolvedLocale)}
        >
            <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 11.6236 4.52772 11.2538 4.58123 10.8923C4.64845 10.4382 4.31609 10 3.85708 10C3.48623 10 3.161 10.2562 3.10471 10.6228C3.03576 11.0718 3 11.5317 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.69494 3 7.59227 3.86656 6 5.29168V4.25C6 3.83579 5.66421 3.5 5.25 3.5C4.83579 3.5 4.5 3.83579 4.5 4.25V7.25C4.5 7.66421 4.83579 8 5.25 8H8.25C8.66421 8 9 7.66421 9 7.25C9 6.83579 8.66421 6.5 8.25 6.5H6.90093C8.23907 5.25883 10.0309 4.5 12 4.5ZM12.5 7.75C12.5 7.33579 12.1642 7 11.75 7C11.3358 7 11 7.33579 11 7.75V12.25C11 12.6642 11.3358 13 11.75 13H14.75C15.1642 13 15.5 12.6642 15.5 12.25C15.5 11.8358 15.1642 11.5 14.75 11.5H12.5V7.75Z"
                    fill="currentColor"
                />
            </svg>
        </button>
        <!-- 修改 Tooltip：名称 + 浅色快捷键 -->
        <span class="tooltip">
            <span>{t("sidebar.recent", undefined, $resolvedLocale)}</span>
            <span class="shortcut">{sidebarShortcut}</span>
        </span>
    </div>

    <!-- 当前目录 -->
    <div class="tooltip-wrapper">
        <button
            class="sidebar-btn"
            class:active={sidebarMode === "directory"}
            onclick={() => onToggleSidebar("directory")}
            disabled={!canUseDirectory}
            aria-label={t("sidebar.directory", undefined, $resolvedLocale)}
        >
            <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3.5 6.25V8H8.12868C8.32759 8 8.51836 7.92098 8.65901 7.78033L10.1893 6.25L8.65901 4.71967C8.51836 4.57902 8.32759 4.5 8.12868 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25ZM2 6.25C2 4.45507 3.45507 3 5.25 3H8.12868C8.72542 3 9.29771 3.23705 9.71967 3.65901L11.5607 5.5H18.75C20.5449 5.5 22 6.95507 22 8.75V17.75C22 19.5449 20.5449 21 18.75 21H5.25C3.45507 21 2 19.5449 2 17.75V6.25ZM3.5 9.5V17.75C3.5 18.7165 4.2835 19.5 5.25 19.5H18.75C19.7165 19.5 20.5 18.7165 20.5 17.75V8.75C20.5 7.7835 19.7165 7 18.75 7H11.5607L9.71967 8.84099C9.29771 9.26295 8.72542 9.5 8.12868 9.5H3.5Z"
                    fill="currentColor"
                />
            </svg>
        </button>
        <!-- 修改 Tooltip：名称 + 浅色快捷键 -->
        <span class="tooltip">
            <span>{t("sidebar.directory", undefined, $resolvedLocale)}</span>
            <span class="shortcut">{sidebarShortcut}</span>
        </span>
    </div>

    <span class="sep">|</span>

    <!-- 脏标签 -->
    {#if isDirty}
        <span class="badge dirty">
            <span class="dot">●</span>{t(
                "status.unsaved",
                undefined,
                $resolvedLocale,
            )}
        </span>
        <span class="sep">|</span>
    {/if}

    <!-- 磁盘状态 -->
    {#if diskState === "deleted"}
        <span class="badge warn"
            >{t("status.external_deleted", undefined, $resolvedLocale)}</span
        >
        <span class="sep">|</span>
    {:else if diskState === "unreachable"}
        <span class="badge warn"
            >{t(
                "status.external_unreachable",
                undefined,
                $resolvedLocale,
            )}</span
        >
        <span class="sep">|</span>
    {:else if diskState === "modified"}
        <span class="badge warn"
            >{t("status.external_modified", undefined, $resolvedLocale)}</span
        >
        <span class="sep">|</span>
    {/if}

    <!-- 字符统计 -->
    <span class="main-info"
        >{t(
            "status.line_and_chars",
            { lines: lineCount, chars: charCount },
            $resolvedLocale,
        )}</span
    >
    <!-- 选中字符统计 -->
    {#if selectedCount > 0}
        <span class="sep shrink-sep">|</span>
        <span class="selected main-info">
            {#if selectedLineCount >= 2}
                {t(
                    "status.selected_lines_and_chars",
                    { lines: selectedLineCount, chars: selectedCount },
                    $resolvedLocale,
                )}
            {:else}
                {t(
                    "status.selected_chars",
                    { chars: selectedCount },
                    $resolvedLocale,
                )}
            {/if}
        </span>
    {/if}

    <span class="spacer"></span>

    <!-- 显示行号 -->
    <button
        class="status-btn"
        class:off={!showLineNumbers}
        onclick={onToggleLineNumbers}
    >
        {t("settings.show_line_numbers", undefined, $resolvedLocale)}
    </button>

    <span class="sep">|</span>

    <!-- 自动换行 -->
    <button
        class="status-btn"
        class:off={!wordWrap || wordWrapDisabled}
        onclick={onToggleWordWrap}
        disabled={wordWrapDisabled}
    >
        {t("settings.word_wrap", undefined, $resolvedLocale)}
    </button>

    <span class="sep">|</span>

    <!-- 缩放比列 -->
    <div class="zoom-wrapper">
        <span
            class="status-btn zoom-trigger"
            role="button"
            tabindex="0"
            onclick={toggleZoomMenu}
            oncontextmenu={handleZoomRightClick}
            >{zoom}%
        </span>

        {#if zoomMenuOpen}
            <div class="zoom-menu">
                {#each ZOOM_PRESETS as preset}
                    <button
                        class="zoom-item"
                        class:active={preset === zoom}
                        onclick={() => selectZoom(preset)}
                    >
                        <!-- 给文字加上 class -->
                        <span class="zoom-text">{preset}%</span>

                        <!-- 右侧勾选 -->
                        <span class="check">
                            {#if preset === zoom}
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12"
                                    ></polyline>
                                </svg>
                            {/if}
                        </span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <span class="sep">|</span>
    <span class="tooltip-wrapper">
        <span class="status-text">{encoding}</span>
        <span class="tooltip">{encodingTooltip(encoding, $resolvedLocale)}</span
        >
    </span>
    <span class="sep">|</span>

    <span class="tooltip-wrapper tooltip-right">
        <span class="status-text">{lineEnding}</span>
        <span class="tooltip"
            >{lineEndingTooltip(lineEnding, $resolvedLocale)}</span
        >
    </span>
</div>

<style>
    .status-bar {
        height: 26px;
        box-sizing: border-box;
        background: var(--status-bar-background);
        border-top: 1px solid var(--overlay-divider);
        display: flex;
        align-items: center;
        padding-left: 12px;
        padding-right: 22px;
        font-size: 12px;
        color: var(--status-bar-foreground);
        user-select: none;
        gap: 8px;
        white-space: nowrap;
        flex-shrink: 0;
    }
    .badge {
        flex-shrink: 0;
    }
    .badge.dirty {
        color: var(--warning);
    }
    .badge .dot {
        font-size: 6px;
        line-height: 1;
        margin-right: 4px;
        vertical-align: middle;
        position: relative;
        top: -1px;
    }
    .badge.warn {
        color: var(--warning-strong);
    }
    .selected {
        color: var(--accent);
    }
    .main-info {
        flex-shrink: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sep {
        color: var(--status-bar-foreground-muted);
        flex-shrink: 0;
    }
    .spacer {
        flex: 1;
    }

    .status-btn {
        background: none;
        border: none;
        /* ★ 调整：给一点内边距，这样背景色才会有呼吸感，不会紧贴着字 */
        padding: 2px 6px;
        border-radius: 4px; /* ★ 圆角让背景色显得更精致 */
        font-size: 12px;
        color: var(--status-bar-foreground); /* 开启状态颜色 */
        cursor: pointer;
        font-family: "Segoe UI", system-ui, sans-serif;
        letter-spacing: 1px;
        flex-shrink: 0;
        white-space: nowrap;
        transition: background-color 0.15s; /* ★ 只过渡背景色 */
        line-height: 1; /* ★ 核心新增：让文字盒子上下绝对对称 */
    }

    /* 关闭状态的字体颜色 */
    .status-btn.off {
        color: var(--status-bar-foreground-muted);
    }

    /* ★ 核心修改：悬停时只变背景，绝对不改字体颜色 */
    .status-btn:hover:not(:disabled) {
        background-color: color-mix(
            in srgb,
            var(--status-bar-foreground) 12%,
            transparent
        );
    }

    /* 禁用状态的样式 */
    .status-btn:disabled {
        cursor: default;
        color: var(--status-bar-foreground-muted);
        background: none; /* 禁用时取消背景色 */
    }

    .zoom-trigger {
        cursor: pointer;
    }

    .zoom-wrapper {
        position: relative;
        display: inline-flex;
        flex-shrink: 0;
    }

    .zoom-menu {
        position: absolute;
        bottom: 22px;
        right: 0;
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 4px;
        z-index: 500;
        min-width: 80px; /* 稍微加宽一点 */
    }

    .zoom-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background: none;
        border: none;
        padding: 6px 2px 6px 12px;
        font-size: 12px;
        cursor: pointer;
        color: var(--overlay-foreground);
        border-radius: 3px;
        box-sizing: border-box;
        font-family: inherit;
        /* 删除了 position: relative */
    }

    .zoom-item .zoom-text {
        text-align: center;
    }

    .zoom-item .check {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
    }

    .zoom-item:hover {
        background: var(--overlay-hover-background);
    }

    .status-text {
        color: var(--status-bar-foreground);
        flex-shrink: 0;
        white-space: nowrap;
        line-height: 1; /* ★ 核心新增：同上，保证编码、换行等文字也居中 */
    }

    .tooltip-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }

    .tooltip {
        position: absolute;
        bottom: 22px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--overlay-foreground);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 11px;
        white-space: nowrap;
        z-index: 1000;
        display: flex;
        align-items: center;

        /* ★ 核心魔法：隐藏状态下，背景透明，无边框，无阴影！ */
        opacity: 0;
        pointer-events: none;
        background: transparent;
        border: 1px solid transparent;
        box-shadow: none;

        /* 加上所有属性的平滑过渡 */
        transition:
            opacity 0.12s,
            background-color 0.12s,
            border-color 0.12s,
            box-shadow 0.12s;
    }

    /* ★ 悬停时，才把高颜值的背景、边框和阴影加回来 */
    .tooltip-wrapper:hover .tooltip {
        opacity: 1;
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .tooltip .shortcut {
        margin-left: 6px;
        color: var(--status-bar-foreground-muted);
    }

    /* 最右侧对齐修正 */
    .tooltip-wrapper.tooltip-right .tooltip {
        left: auto;
        right: 0;
        transform: none;
    }

    /* 最左侧对齐修正 */
    .tooltip-wrapper.tooltip-left .tooltip {
        left: 0;
        transform: none;
    }

    .sidebar-btn {
        background: none;
        border: none;
        /* ★ 用 padding 撑起点击区域，去掉 height: 100% */
        padding: 4px 6px;
        margin: 0;
        font-size: 12px;
        font-family: inherit;
        color: var(--status-bar-foreground);
        cursor: pointer;
        border-radius: 4px; /* 圆润一点 */
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none; /* 消除点击残影 */
    }

    .btn-icon {
        width: 16px; /* 稍微缩小一点点，显得更精致 */
        height: 16px;
        object-fit: contain;
    }

    /* 悬停状态：统一使用柔和的前景色混合背景 */
    .sidebar-btn:hover:not(:disabled) {
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 12%,
            transparent
        );
        color: var(--accent);
    }

    /* 激活状态 */
    .sidebar-btn.active {
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 20%,
            transparent
        );
        color: var(--accent);
    }

    .sidebar-btn:disabled {
        color: var(--overlay-foreground-muted);
        cursor: default;
    }
</style>
