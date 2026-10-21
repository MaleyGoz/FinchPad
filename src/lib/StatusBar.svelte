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
    export let wordWrapDisabled: boolean = false;
    export let onToggleWordWrap: () => void = () => {};
    export let onZoomChange: (value: number) => void = () => {};

    const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200, 300, 400];

    let zoomMenuOpen = false;

    function toggleZoomMenu() {
        zoomMenuOpen = !zoomMenuOpen;
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

<svelte:window on:click={handleWindowClick} />

<div class="status-bar" data-locale={$resolvedLocale}>
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

    <span class="main-info"
        >{t(
            "status.line_and_chars",
            { lines: lineCount, chars: charCount },
            $resolvedLocale,
        )}</span
    >
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

    <button
        class="status-btn"
        class:off={!wordWrap || wordWrapDisabled}
        on:click={onToggleWordWrap}
        disabled={wordWrapDisabled}
        >{wordWrap && !wordWrapDisabled
            ? t("status.word_wrap_on", undefined, $resolvedLocale)
            : t("status.word_wrap_off", undefined, $resolvedLocale)}</button
    >

    <span class="sep">|</span>

    <div class="zoom-wrapper">
        <span
            class="status-btn zoom-trigger"
            role="button"
            tabindex="0"
            on:click={toggleZoomMenu}
            on:contextmenu|preventDefault|stopPropagation={toggleZoomMenu}
            >{zoom}%</span
        >

        {#if zoomMenuOpen}
            <div class="zoom-menu">
                {#each ZOOM_PRESETS as preset}
                    <button
                        class="zoom-item"
                        class:active={preset === zoom}
                        on:click={() => selectZoom(preset)}
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
        height: 24px;
        background: var(--status-bar-background);
        border-top: 1px solid var(--overlay-divider);
        display: flex;
        align-items: center;
        padding: 0 12px;
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
        padding: 0;
        font-size: 12px;
        color: var(--status-bar-foreground);
        cursor: pointer;
        font-family: inherit;
        flex-shrink: 0;
        white-space: nowrap;
    }
    .status-btn.off {
        color: var(--status-bar-foreground-muted);
    }
    .status-btn:disabled {
        cursor: default;
        color: var(--status-bar-foreground-muted);
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
        background: var(--overlay-background);
        color: var(--overlay-foreground);
        border: 1px solid var(--overlay-border);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.12s;
        z-index: 1000;
    }
    .tooltip-wrapper:hover .tooltip {
        opacity: 1;
    }

    /* 最右侧 tooltip 右对齐，避免超出窗口 */
    .tooltip-wrapper.tooltip-right .tooltip {
        left: auto;
        right: 0;
        transform: none;
    }
</style>
