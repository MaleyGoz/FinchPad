<script lang="ts">
    import { t, resolvedLocale } from "$lib/i18n";

    export let lineCount: number;
    export let charCount: number;
    export let selectedCount: number;
    export let selectedLineCount: number = 0;
    export let encoding: string;
    export let lineEnding: string;
    export let diskEncoding: string = ""; // ★ 新增：磁盘原始编码
    export let diskLineEnding: string = ""; // ★ 新增：磁盘原始换行符
    export let onFormatChange: (
        type: "encoding" | "line_ending",
        value: string,
    ) => void = () => {}; // ★ 新增
    export let isDirty: boolean;
    export let diskState: string = "normal";
    export let zoom: number = 100;
    export let wordWrap: boolean = true;
    export let showLineNumbers: boolean = true;
    export let lineNumbersDisabled: boolean = false; // ★ 新增：行号禁用开关
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

    // ★ 新增：编码和换行符的菜单状态
    let encodingMenuOpen = false;
    let lineEndingMenuOpen = false;
    let activeSubmenu: string | null = null; // 当前展开的二级分类
    let mainMenuWidth = 0; // ★ 用于动态记录一级菜单的宽度，以便二级菜单完美对齐
    let submenuBottom = 0; // ★ 记录二级菜单的底部定位

    // ★ 动态计算二级菜单的弹出位置（对齐触发按钮的顶部）
    function handleSubmenuEnter(e: MouseEvent, groupKey: string) {
        activeSubmenu = groupKey;
        const btn = e.currentTarget as HTMLElement;
        const wrapper = btn.closest(".format-wrapper") as HTMLElement;
        if (wrapper) {
            const wrapperRect = wrapper.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            // ★ 核心修改：按钮底部距离父容器底部的距离，加上间隙（4px）
            submenuBottom = wrapperRect.bottom - btnRect.bottom + 4;
        }
    }

    // ★ 新增：分类编码列表（支持 i18n）
    // 一级：常用（保持你定下的 6 个）
    const COMMON_ENCODINGS = [
        "UTF-8",
        "UTF-8 BOM",
        "GBK",
        "Shift_JIS",
        "Windows-1252",
        "Windows-1251",
    ];

    // 二级：分类（全部对齐 WHATWG 标准，无遗漏）
    const MORE_ENCODINGS_GROUPS = [
        {
            key: "encoding_group_unicode",
            items: ["UTF-16 LE", "UTF-16 BE"],
        },
        {
            key: "encoding_group_cjk",
            // 补齐所有 CJK 系
            items: ["GB18030", "Big5", "EUC-KR", "EUC-JP", "ISO-2022-JP"],
        },
        {
            key: "encoding_group_western",
            // 补齐西欧/地中海/拉美
            items: ["ISO-8859-15", "Macintosh", "Windows-1254", "Windows-1258"],
        },
        {
            key: "encoding_group_central_europe",
            // 补齐北欧、波罗的海、中欧、南欧
            items: [
                "ISO-8859-2",
                "Windows-1250",
                "ISO-8859-16", // 东南欧
                "ISO-8859-4", // 北欧
                "ISO-8859-10", // 北欧
                "ISO-8859-13", // 波罗的海
                "ISO-8859-14", // 凯尔特
                "Windows-1257", // 波罗的海
            ],
        },
        {
            key: "encoding_group_cyrillic",
            // 补齐所有西里尔文
            items: [
                "KOI8-R",
                "ISO-8859-5",
                "KOI8-U",
                "IBM866",
                "x-mac-cyrillic",
            ],
        },
        {
            key: "encoding_group_others",
            // 补齐中东、希腊、阿拉伯等
            items: [
                "Windows-1256", // 阿拉伯
                "Windows-1255", // 希伯来
                "Windows-874", // 泰文
                "ISO-8859-6", // 阿拉伯
                "ISO-8859-7", // 希腊
                "Windows-1253", // 希腊
                "ISO-8859-8", // 希伯来
                "ISO-8859-3", // 南欧/世界语
            ],
        },
    ];

    // ★ 核心新增：将 Rust 返回的标准名，映射为前端菜单里的漂亮名
    function formatEncodingName(rawEncoding: string): string {
        if (!rawEncoding) return "";

        // 1. 把一级和二级里所有的名字拍平成一个数组
        const allKnown = [
            ...COMMON_ENCODINGS,
            ...MORE_ENCODINGS_GROUPS.flatMap((g) => g.items),
        ];

        // 2. 核心比对逻辑：去掉空格和连字符，并且全部转小写
        // 这样无论 Rust 给的是 "UTF-16LE" 还是 "utf-16le"，都能匹配到前端的 "UTF-16 LE"
        const normalize = (s: string) => s.replace(/[\s-]/g, "").toLowerCase();
        const normalizedRaw = normalize(rawEncoding);

        // 3. 找到就返回漂亮名字，找不到就原样返回（说明是冷门编码）
        const matched = allKnown.find(
            (enc) => normalize(enc) === normalizedRaw,
        );

        return matched || rawEncoding;
    }

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
        if (!zoomMenuOpen && !encodingMenuOpen && !lineEndingMenuOpen) return;
        const target = e.target as HTMLElement;
        if (
            target.closest(".zoom-wrapper") ||
            target.closest(".format-wrapper")
        )
            return;

        zoomMenuOpen = false;
        encodingMenuOpen = false;
        lineEndingMenuOpen = false;
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
    <div class="tooltip-wrapper tooltip-left">
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
            <span class="dot"></span>{t(
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
        class:off={!showLineNumbers || lineNumbersDisabled}
        onclick={onToggleLineNumbers}
        disabled={lineNumbersDisabled}
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
    <div class="zoom-wrapper" class:has-menu-open={zoomMenuOpen}>
        <!-- 缩放比例按钮 -->
        <div class="tooltip-wrapper">
            <span
                class="status-btn zoom-trigger"
                role="button"
                tabindex="0"
                onclick={toggleZoomMenu}
                oncontextmenu={handleZoomRightClick}
                >{zoom}%
            </span>
            <!-- ★ 新增的 Tooltip 层 -->
            <span class="tooltip">
                <span
                    >{t(
                        "status.zoom_tooltip",
                        undefined,
                        $resolvedLocale,
                    )}</span
                >
                <span class="shortcut"
                    >{isMac ? "Cmd" : "Ctrl"} + {t(
                        "status.scroll_wheel",
                        undefined,
                        $resolvedLocale,
                    )} / +/-</span
                >
            </span>
        </div>
        <!-- 缩放比例弹窗 -->
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

    <!-- 编码 -->
    <div
        class="format-wrapper tooltip-wrapper"
        class:has-menu-open={encodingMenuOpen}
    >
        <span
            class="status-btn"
            role="button"
            tabindex="0"
            onclick={() => {
                encodingMenuOpen = !encodingMenuOpen;
                lineEndingMenuOpen = false;
                activeSubmenu = null;
            }}
        >
            {formatEncodingName(encoding)}
        </span>

        <!-- 编码Tooltip -->
        {#if !encodingMenuOpen}
            <span class="tooltip"
                >{encodingTooltip(
                    formatEncodingName(encoding),
                    $resolvedLocale,
                )}</span
            >
        {/if}

        {#if encodingMenuOpen}
            <!-- 主菜单 -->
            <div
                class="format-menu bottom-right main-menu"
                bind:clientWidth={mainMenuWidth}
            >
                <!-- 一级菜单：常用编码 -->
                {#each COMMON_ENCODINGS as enc}
                    <button
                        class="format-item"
                        onclick={() => {
                            onFormatChange("encoding", enc);
                            encodingMenuOpen = false;
                        }}
                    >
                        <span class="enc-label">
                            {enc}
                            <!-- ★ 核心新增：只针对 UTF-8 显示推荐置灰标记 -->
                            {#if enc === "UTF-8"}
                                <span class="recommend-tag"
                                    >{t(
                                        "encoding.recommend",
                                        undefined,
                                        $resolvedLocale,
                                    )}</span
                                >
                            {/if}
                        </span>
                        <span class="check">
                            {#if enc.toLowerCase() === encoding.toLowerCase()}
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

                <div class="context-divider" style="margin: 4px 0;"></div>

                <!-- 一级菜单：二级菜单触发按钮 -->
                {#each MORE_ENCODINGS_GROUPS as group}
                    <button
                        class="format-item submenu-trigger"
                        onmouseenter={(e) => handleSubmenuEnter(e, group.key)}
                        onclick={(e) => {
                            activeSubmenu === group.key
                                ? (activeSubmenu = null)
                                : handleSubmenuEnter(e, group.key);
                        }}
                    >
                        <span>{t(group.key, undefined, $resolvedLocale)}</span>

                        <!-- 右侧图标区 -->
                        <div class="right-icons">
                            <!-- ★ 核心新增：如果当前选中的编码在这个分组里，显示一个小圆点 -->
                            {#if group.items.some((item) => item.toLowerCase() === encoding.toLowerCase())}
                                <svg
                                    class="active-dot"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 8 8"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                >
                                    <circle cx="4" cy="4" r="3"></circle>
                                </svg>
                            {/if}

                            <!-- 原有的箭头 -->
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </button>
                {/each}
            </div>

            <!-- 独立的二级菜单浮层（向上弹出） -->
            {#if activeSubmenu}
                {@const targetGroup = MORE_ENCODINGS_GROUPS.find(
                    (g) => g.key === activeSubmenu,
                )}
                {#if targetGroup}
                    <div
                        class="format-menu submenu"
                        style="right: {mainMenuWidth +
                            1}px; bottom: {submenuBottom}px;"
                    >
                        {#each targetGroup.items as item}
                            <button
                                class="format-item"
                                onclick={() => {
                                    onFormatChange("encoding", item);
                                    encodingMenuOpen = false;
                                    activeSubmenu = null;
                                }}
                            >
                                <span>{item}</span>
                                <span class="check">
                                    {#if item.toLowerCase() === encoding.toLowerCase()}
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
            {/if}
        {/if}
    </div>

    <span class="sep">|</span>

    <!-- 换行符号 -->
    <div
        class="format-wrapper tooltip-wrapper tooltip-right"
        class:has-menu-open={lineEndingMenuOpen}
    >
        <span
            class="status-btn"
            role="button"
            tabindex="0"
            onclick={() => {
                lineEndingMenuOpen = !lineEndingMenuOpen;
                encodingMenuOpen = false;
                activeSubmenu = null;
            }}
        >
            {lineEnding}
        </span>
        {#if !lineEndingMenuOpen}
            <span class="tooltip"
                >{lineEndingTooltip(lineEnding, $resolvedLocale)}</span
            >
        {/if}

        {#if lineEndingMenuOpen}
            <div class="format-menu bottom-right" style="min-width: 200px;">
                {#each ["LF", "CRLF", "CR"] as le}
                    <button
                        class="format-item"
                        onclick={() => {
                            onFormatChange("line_ending", le);
                            lineEndingMenuOpen = false;
                        }}
                    >
                        <span>{lineEndingTooltip(le, $resolvedLocale)}</span>
                        <span class="check">
                            {#if le === lineEnding}
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><polyline points="20 6 9 17 4 12"
                                    ></polyline></svg
                                >
                            {/if}
                        </span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
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
        padding-right: 18px;
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
        font-family: var(--font-sans);
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

    /* ★ 核心新增：菜单打开时，强制隐藏悬停的 Tooltip，防止遮挡 */
    .zoom-wrapper.has-menu-open .tooltip {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: none !important; /* 瞬间消失，不留残影 */
    }

    /* ==========================================
     编码、换行符弹窗样式 
     ========================================== */
    .format-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
    }
    .format-menu {
        position: absolute;
        bottom: 24px;
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 4px;
        z-index: 500;
    }
    .format-menu.bottom-right {
        right: 0;
        left: auto;
    }

    /* 一级主菜单 */
    .main-menu {
        min-width: 180px;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* 二级子菜单 */
    .submenu {
        /* bottom: 0; */
        /* ★ 去掉了 right: 100%，因为我们在 HTML 内联样式里动态计算了 */
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* 统一滚动条 */
    .format-menu::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .format-menu::-webkit-scrollbar-track {
        background: transparent;
    }
    .format-menu::-webkit-scrollbar-thumb {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 30%,
            transparent
        );
        border-radius: 4px;
    }
    .format-menu::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 60%,
            transparent
        );
    }
    .format-menu {
        scrollbar-width: thin;
        scrollbar-color: color-mix(
                in srgb,
                var(--overlay-foreground-muted) 30%,
                transparent
            )
            transparent;
    }

    .format-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        color: var(--overlay-foreground);
        border-radius: 4px;
        box-sizing: border-box;
        font-family: inherit;
        white-space: nowrap;
    }
    .format-item:hover {
        background: var(--overlay-hover-background);
    }

    .check {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
    }

    /* 保持原来隐藏 Tooltip 的防御性代码 */
    .format-wrapper.has-menu-open .tooltip {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: none !important;
    }
    /* ★ 新增：分类右侧的图标容器 */
    .right-icons {
        display: flex;
        align-items: center;
        padding-left: 6px;
        gap: 0px;
    }

    /* ★ 新增：提示当前选中项在二级菜单的小圆点 */
    .active-dot {
        /* color: var(--accent); 使用主题色 */
    }
    /* ★ 新增：推荐标签的置灰样式 */
    .recommend-tag {
        font-size: 10px;
        color: var(--status-bar-foreground-muted);
        margin-left: 6px;
        font-weight: normal;
    }
</style>
