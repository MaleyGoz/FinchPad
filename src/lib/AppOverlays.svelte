<script lang="ts">
    import {
        t,
        resolvedLocale,
        LANGUAGE_NAMES,
        LOCALE_OPTIONS,
        localeChoice,
    } from "$lib/i18n";
    import { THEMES, THEME_ORDER } from "$lib/themes";
    import Toggle from "$lib/Toggle.svelte";

    // ★ 新增：关于弹窗的选项卡状态
    let activeAboutTab: "about" | "privacy" | "features" | "license" = "about";
    // ★ 新增：功能说明的左侧导航状态
    let activeFeatureNav:
        | "shortcuts"
        | "tabs"
        | "session"
        | "encoding"
        | "large_file"
        | "preview"
        | "diff" = "shortcuts";

    // 接收父组件传来的更新状态
    export let updateStatus:
        | "idle"
        | "checking"
        | "latest"
        | "found"
        | "error" = "idle";
    export let updateLatestVersion = ""; // ★ 新增
    export let checkForUpdates: () => void;
    export let handleUpdateDownload: () => void; // ★ 新增

    // 接收从父组件传来的状态和数据
    export let modal: any;
    export let aboutVisible: boolean;
    export let APP_VERSION: string;

    // 设置菜单和语言菜单的状态
    export let settingsMenu: any;
    export let langSubmenu: any;
    export let showLineNumbers: boolean;
    export let wordWrap: boolean;
    export let largeFile: boolean;
    export let editorBg: string;

    // 接收从父组件传来的回调事件
    export let onCloseModal: () => void;
    export let onCloseAbout: () => void;
    export let onOpenGitHub: () => void;
    export let onMenuNewFromTab: () => void;
    export let onMenuOpenFromTab: () => void;

    // 设置与语言菜单的回调
    export let onCloseSettings: () => void;
    export let onToggleLineNumbers: () => void;
    export let onToggleWordWrap: () => void;
    export let onSetTheme: (name: string) => void;
    export let onToggleLangSubmenu: (e: MouseEvent) => void;
    export let onShowLangSubmenu: (e: MouseEvent) => void;
    export let onScheduleCloseLangSubmenu: () => void;
    export let onCancelCloseLangSubmenu: () => void;
    export let onCloseLangSubmenu: () => void;
    export let onSelectLanguage: (key: string) => void;
    // export let onCheckUpdate: () => void;
    export let onShowAbout: () => void;

    // 标签页右键菜单及子菜单
    export let contextMenu: any;
    export let diffSubmenu: any;
    export let tabTitles: string[];
    export let tabDirtyStates: boolean[];
    export let tabUnnamedStates: boolean[];
    export let onMenuCloseAll: () => void;

    export let selectedTabIdsCount: number = 0;
    export let onMenuCloseSelected: () => void;
    export let onMenuDiffSelected: () => void;

    // 空白处右键菜单
    export let barContextMenu: any;

    // 编辑器右键菜单
    export let editorContextMenu: any;

    // 快捷键修饰符（Cmd/Ctrl）
    export let mod: string;

    // 标签页右键菜单事件回调
    export let onCloseContextMenu: () => void;
    export let onMenuSave: () => void;
    export let onMenuSaveAs: () => void;
    export let onShowDiffSubmenu: (e: MouseEvent) => void;
    export let onScheduleCloseDiffSubmenu: () => void;
    export let onMenuCloseSingle: () => void;
    export let onMenuCloseOthers: () => void;
    export let onMenuCloseLeft: () => void;
    export let onMenuCloseRight: () => void;
    export let onTriggerRename: (index: number) => void;
    export let onMenuCopyPath: () => void;
    export let onMenuRevealInExplorer: () => void;
    export let hasClosedTabs: boolean;
    export let onReopenClosedTab: () => void;
    // 对比二级菜单事件回调
    export let onCloseDiffSubmenu: () => void;
    export let onCancelCloseDiffSubmenu: () => void;
    export let onSelectDiffTarget: (idx: number) => void;

    // 空白处右键菜单事件回调
    export let onCloseBarContextMenu: () => void;
    export let onBarMenuNew: () => void;
    export let onBarMenuOpen: () => void;

    export let tabPendingStates: boolean[] = []; // ★ 接收所有标签的 pending 状态
    // 编辑器右键菜单事件回调
    export let onCloseEditorContextMenu: () => void;
    export let onRunEditorAction: (action: string) => void;
    // 开源协议常量（全局通用，无需国际化翻译）
    const MIT_LICENSE_TEXT = `MIT License

Copyright (c) 2026 MaleyGoz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

    // 快捷键数据列表 (改为响应式，语言切换时自动更新)
    $: shortcutList = [
        {
            op: t(
                "about.features.shortcuts.op_new",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + N / T",
            mac: "Cmd + N / T",
        },
        {
            op: t(
                "about.features.shortcuts.op_open_save",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + O / S",
            mac: "Cmd + O / S",
        },
        {
            op: t(
                "about.features.shortcuts.op_save_as",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + Shift + S",
            mac: "Cmd + Shift + S",
        },
        {
            op: t(
                "about.features.shortcuts.op_close_tab",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + W",
            mac: "Cmd + W",
        },
        {
            op: t(
                "about.features.shortcuts.op_copy_path",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + Shift + C",
            mac: "Cmd + Shift + C",
        },
        {
            op: t(
                "about.features.shortcuts.op_rename",
                undefined,
                $resolvedLocale,
            ),
            win: "F2",
            mac: "F2",
        },
        {
            op: t(
                "about.features.shortcuts.op_copy_paste",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + C / V / X / A",
            mac: "Cmd + C / V / X / A",
        },
        {
            op: t(
                "about.features.shortcuts.op_undo_redo",
                undefined,
                $resolvedLocale,
            ),
            win: t(
                "about.features.shortcuts.key_undo_win",
                undefined,
                $resolvedLocale,
            ),
            mac: t(
                "about.features.shortcuts.key_undo_mac",
                undefined,
                $resolvedLocale,
            ),
        },
        {
            op: t(
                "about.features.shortcuts.op_find_replace",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + F / H",
            mac: "Cmd + F / H",
        },
        {
            op: t(
                "about.features.shortcuts.op_show_sidebar",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + B",
            mac: "Cmd + B",
        },
        {
            op: t(
                "about.features.shortcuts.op_switch_tab",
                undefined,
                $resolvedLocale,
            ),
            win: "Ctrl + Tab / 1~9",
            mac: "Ctrl + Tab / 1~9",
        },
        {
            op: t(
                "about.features.shortcuts.op_zoom",
                undefined,
                $resolvedLocale,
            ),
            win: t(
                "about.features.shortcuts.key_zoom_win",
                undefined,
                $resolvedLocale,
            ),
            mac: t(
                "about.features.shortcuts.key_zoom_mac",
                undefined,
                $resolvedLocale,
            ),
        },
        {
            op: t(
                "about.features.shortcuts.op_close_modal",
                undefined,
                $resolvedLocale,
            ),
            win: "Esc",
            mac: "Esc",
        },
        {
            op: t(
                "about.features.shortcuts.op_quit",
                undefined,
                $resolvedLocale,
            ),
            win: "Alt + F4",
            mac: "Cmd + Q",
        },
    ];

    // ★ 核心修复：当 aboutVisible 变为 true（即弹窗打开时）时，强制重置为第一个选项卡
    $: if (aboutVisible) {
        activeAboutTab = "about";
    }
</script>

<!-- 通用弹窗 (modal) -->
{#if modal.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" role="presentation">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
            class="modal"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            tabindex="-1"
        >
            <!-- 主标题：显示核心提示语 -->
            <div class="modal-title">{modal.title}</div>
            <!-- 副标题：弱化的说明或路径，放在主标题下方 -->
            {#if modal.subtitle}
                <div class="modal-subtitle">{modal.subtitle}</div>
            {/if}

            {#each modal.rows as row}
                <div class="modal-row" class:narrow-btns={row.length === 2}>
                    {#each row as btn}
                        <button
                            class="modal-btn"
                            class:primary={btn.style === "primary"}
                            class:secondary={btn.style === "secondary"}
                            class:large={btn.size === "large"}
                            class:small={btn.size === "small"}
                            onclick={btn.action}>{btn.label}</button
                        >
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{/if}

<!-- 设置菜单 -->
{#if settingsMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={() => {
            onCloseSettings();
            onCloseLangSubmenu(); // 顺带关闭语言子菜单
        }}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseSettings();
            onCloseLangSubmenu();
        }}
        role="presentation"
    >
        <div
            class="context-menu settings-menu"
            style="right: {window.innerWidth -
                settingsMenu.anchorRight}px; top: {settingsMenu.anchorBottom +
                4}px; max-height: calc(100vh - {settingsMenu.anchorBottom +
                12}px); overflow-y: auto;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <div class="settings-group-title">
                {t("settings.view", undefined, $resolvedLocale)}
            </div>
            <!-- 显示行号开关 -->
            <button
                class="context-item"
                class:disabled={largeFile}
                disabled={largeFile}
                onclick={onToggleLineNumbers}
            >
                <span
                    >{t(
                        "settings.show_line_numbers",
                        undefined,
                        $resolvedLocale,
                    )}</span
                >
                <Toggle
                    checked={showLineNumbers}
                    onChange={onToggleLineNumbers}
                    disabled={largeFile}
                />
            </button>
            <!-- 自动换行开关 -->
            <button
                class="context-item"
                class:disabled={largeFile}
                disabled={largeFile}
                onclick={onToggleWordWrap}
            >
                <span
                    >{t("settings.word_wrap", undefined, $resolvedLocale)}</span
                >

                <Toggle
                    checked={wordWrap}
                    onChange={onToggleWordWrap}
                    disabled={largeFile}
                />
            </button>

            <div class="context-divider"></div>

            <div class="settings-group-title">
                {t("settings.theme", undefined, $resolvedLocale)}
            </div>
            {#each THEME_ORDER as key}
                <button class="context-item" onclick={() => onSetTheme(key)}>
                    <span class="theme-label">
                        <span
                            class="theme-swatch"
                            style="background: {THEMES[key]
                                .editor_background}; border-color: {THEMES[key]
                                .overlay_border};"
                        ></span>
                        <span
                            >{t(
                                "settings.theme." + key,
                                undefined,
                                $resolvedLocale,
                            )}</span
                        >
                    </span>
                    {#if editorBg === key}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style="margin-left: auto;"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    {/if}
                </button>
            {/each}

            <div class="context-divider"></div>

            <!-- 语言选择 -->
            <button
                class="context-item"
                style="margin-top: 4px;"
                onmouseenter={onShowLangSubmenu}
                onmouseleave={onScheduleCloseLangSubmenu}
            >
                <span>
                    {t("settings.language", undefined, $resolvedLocale)}: {LANGUAGE_NAMES[
                        $resolvedLocale
                    ] || $resolvedLocale}
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="margin-left: auto; color: var(--overlay-foreground);"
                >
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <div class="context-divider"></div>
            <!-- 检查更新入口 -->
            <!-- <button class="context-item" onclick={onCheckUpdate}>
                <span
                    >{t(
                        "settings.check_update",
                        undefined,
                        $resolvedLocale,
                    )}</span
                >
            </button> -->

            <button class="context-item" onclick={onShowAbout}>
                <span>{t("settings.about", undefined, $resolvedLocale)}</span>
            </button>
        </div>
    </div>
{/if}

<!-- 语言二级菜单 -->
{#if langSubmenu.visible}
    {@const ddW = 180}
    <!-- ★ 动态计算可用高度 -->
    {@const maxMenuHeight = window.innerHeight - 16}
    {@const ddH = Math.min(LOCALE_OPTIONS.length * 32 + 8, maxMenuHeight)}
    {@const hasLeft = langSubmenu.anchorLeft - ddW - 8 >= 0}
    <!-- ★ 核心修改：使用 right 定位，让右侧贴边，彻底消除宽度偏差导致的空隙 -->
    {@const ddStyle = hasLeft
        ? `right: ${window.innerWidth - langSubmenu.anchorLeft + 6}px;`
        : `left: ${langSubmenu.anchorRight + 6}px;`}
    {@const ddTop = Math.max(
        8,
        Math.min(langSubmenu.anchorTop, window.innerHeight - ddH - 8),
    )}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-menu lang-submenu"
        class:bridge-right={!hasLeft}
        class:bridge-left={hasLeft}
        style="z-index: 1001; {ddStyle} top: {ddTop}px; max-height: {maxMenuHeight}px; overflow-y: auto;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        onmouseenter={onCancelCloseLangSubmenu}
        onmouseleave={onScheduleCloseLangSubmenu}
        role="menu"
        tabindex="-1"
    >
        {#each LOCALE_OPTIONS as opt}
            <button
                class="context-item"
                onclick={() => onSelectLanguage(opt.key)}
            >
                <span>{LANGUAGE_NAMES[opt.key]}</span>
                {#if $localeChoice === opt.key}
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        style="margin-left: auto;"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                {/if}
            </button>
        {/each}
    </div>
{/if}

<!-- 标签页右键菜单 -->
{#if contextMenu.visible}
    {@const cmIndex = contextMenu.index}
    {@const cmTabCount = tabTitles.length}
    {@const cmIsDirty = tabDirtyStates[cmIndex] ?? false}
    {@const cmIsUnnamed = tabUnnamedStates[cmIndex] ?? false}
    {@const cmIsPending = tabPendingStates[cmIndex] ?? false}
    {@const cmCanCloseOthers = cmTabCount > 1}
    {@const cmCanCloseRight = cmIndex < cmTabCount - 1}
    {@const cmHasValidDiffTargets = tabTitles.some(
        (_, i) => i !== cmIndex && !tabPendingStates[i],
    )}

    <!-- 遮罩层 -->
    <div
        class="context-overlay"
        onclick={() => {
            onCloseContextMenu();
            onCloseDiffSubmenu();
        }}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseContextMenu();
            onCloseDiffSubmenu();
        }}
        role="presentation"
    >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- 菜单主体 -->
        <div
            class="context-menu"
            style="{contextMenu.left !== null
                ? `left: ${contextMenu.left}px;`
                : `right: ${contextMenu.right}px;`} {contextMenu.top >
            window.innerHeight / 2
                ? `bottom: ${window.innerHeight - contextMenu.top}px;`
                : `top: ${contextMenu.top}px;`} max-height: calc(100vh - 16px); overflow-y: auto;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            {#if contextMenu.isMultiSelect}
                <!-- 多选专属极简菜单 -->
                <!-- 关闭标签（） -->
                <button class="context-item" onclick={onMenuCloseSelected}>
                    <!-- ★ 把原来的 - 换成括号包裹 -->
                    <span
                        >{t("tab_menu.close", undefined, $resolvedLocale)} ({selectedTabIdsCount})</span
                    >
                </button>
                <!-- 对比标签 -->
                <button
                    class="context-item"
                    class:disabled={!contextMenu.canDiffSelected}
                    disabled={!contextMenu.canDiffSelected}
                    onclick={onMenuDiffSelected}
                >
                    <span
                        >{t(
                            "diff.window_title",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                </button>
            {:else}
                <!-- 单选菜单（原本的所有代码放这里面） -->
                <!-- 区块 1：关闭操作 -->
                <button class="context-item" onclick={onMenuCloseSingle}>
                    <span
                        >{t("tab_menu.close", undefined, $resolvedLocale)}</span
                    >
                    <span class="shortcut">{mod}+W</span>
                </button>
                <button
                    class="context-item"
                    class:disabled={!cmCanCloseOthers}
                    disabled={!cmCanCloseOthers}
                    onclick={onMenuCloseOthers}
                >
                    <span
                        >{t(
                            "tab_menu.close_others",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                </button>
                <button
                    class="context-item"
                    class:disabled={!cmCanCloseRight}
                    disabled={!cmCanCloseRight}
                    onclick={onMenuCloseRight}
                >
                    <span
                        >{t(
                            "tab_menu.close_right",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                </button>
                <button class="context-item" onclick={onMenuCloseAll}>
                    <span
                        >{t(
                            "tab_menu.close_all",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                </button>
                <button
                    class="context-item"
                    class:disabled={!hasClosedTabs}
                    disabled={!hasClosedTabs}
                    onclick={onReopenClosedTab}
                >
                    <span
                        >{t(
                            "tab_menu.reopen",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                    <span class="shortcut">{mod}+Shift+T</span>
                </button>

                <div class="context-divider"></div>

                <!-- 区块 2：保存与对比 -->
                <button
                    class="context-item"
                    class:disabled={!cmIsDirty || cmIsPending}
                    disabled={!cmIsDirty || cmIsPending}
                    onclick={onMenuSave}
                >
                    <span>{t("tab_menu.save", undefined, $resolvedLocale)}</span
                    >
                    <span class="shortcut">{mod}+S</span>
                </button>
                <button
                    class="context-item"
                    class:disabled={(cmIsUnnamed && !cmIsDirty) || cmIsPending}
                    disabled={(cmIsUnnamed && !cmIsDirty) || cmIsPending}
                    onclick={onMenuSaveAs}
                >
                    <span
                        >{t(
                            "tab_menu.save_as",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                    <span class="shortcut">{mod}+Shift+S</span>
                </button>

                <button
                    class="context-item"
                    class:disabled={cmTabCount <= 1 ||
                        cmIsPending ||
                        !cmHasValidDiffTargets}
                    disabled={cmTabCount <= 1 ||
                        cmIsPending ||
                        !cmHasValidDiffTargets}
                    onmouseenter={(e) => {
                        if (
                            cmTabCount > 1 &&
                            !cmIsPending &&
                            cmHasValidDiffTargets
                        ) {
                            onShowDiffSubmenu(e);
                        }
                    }}
                    onmouseleave={onScheduleCloseDiffSubmenu}
                >
                    <span>{t("tab_menu.diff", undefined, $resolvedLocale)}</span
                    >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        style="margin-left: auto;"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <div class="context-divider"></div>

                <!-- 区块 3：文件操作 -->
                <button
                    class="context-item"
                    class:disabled={cmIsUnnamed}
                    disabled={cmIsUnnamed}
                    onclick={() => onTriggerRename(cmIndex)}
                >
                    <span
                        >{t(
                            "tab_menu.rename",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                    <span class="shortcut">F2</span>
                </button>
                <button
                    class="context-item"
                    class:disabled={cmIsUnnamed}
                    disabled={cmIsUnnamed}
                    onclick={onMenuCopyPath}
                >
                    <span
                        >{t(
                            "tab_menu.copy_path",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                    <span class="shortcut">{mod}+Shift+C</span>
                </button>
                <button
                    class="context-item"
                    class:disabled={cmIsUnnamed}
                    disabled={cmIsUnnamed}
                    onclick={onMenuRevealInExplorer}
                >
                    <span
                        >{t(
                            "tab_menu.reveal_in_explorer",
                            undefined,
                            $resolvedLocale,
                        )}</span
                    >
                </button>

                <!-- <div class="context-divider"></div> -->

                <!-- 区块 4：新建与打开 v0.9.2精简标签右键菜单时删除-->
                <!-- <button class="context-item" onclick={onMenuNewFromTab}>
                    <span>{t("bar_menu.new", undefined, $resolvedLocale)}</span>
                    <span class="shortcut">{mod}+N</span>
                </button>
                <button class="context-item" onclick={onMenuOpenFromTab}>
                    <span>{t("bar_menu.open", undefined, $resolvedLocale)}</span
                    >
                    <span class="shortcut">{mod}+O</span>
                </button> -->
            {/if}
        </div>
    </div>
{/if}

<!-- 标签栏空白处菜单 -->
{#if barContextMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={onCloseBarContextMenu}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseBarContextMenu();
        }}
        role="presentation"
    >
        <div
            class="context-menu"
            style="{barContextMenu.left !== null
                ? `left: ${barContextMenu.left}px;`
                : `right: ${barContextMenu.right}px;`} top: {barContextMenu.top}px;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <button class="context-item" onclick={onBarMenuNew}>
                <span>{t("bar_menu.new", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+N</span>
            </button>
            <button class="context-item" onclick={onBarMenuOpen}>
                <span>{t("bar_menu.open", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+O</span>
            </button>
        </div>
    </div>
{/if}

<!-- 对比子菜单 -->
{#if diffSubmenu.visible}
    {@const ddW = 220}
    <!-- ★ 动态计算可用高度 -->
    {@const maxMenuHeight = window.innerHeight - 16}
    {@const ddH = Math.min((tabTitles.length - 1) * 32 + 8, maxMenuHeight)}
    {@const hasRight = diffSubmenu.anchorRight + ddW + 8 <= window.innerWidth}
    {@const ddLeft = hasRight
        ? diffSubmenu.anchorRight + 6
        : Math.max(8, diffSubmenu.anchorLeft - ddW - 6)}
    {@const ddTop = Math.max(
        8,
        Math.min(diffSubmenu.anchorTop, window.innerHeight - ddH - 8),
    )}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-menu"
        style="width: {ddW}px; max-width: {ddW}px; box-sizing: border-box; left: {ddLeft}px; top: {ddTop}px; max-height: {maxMenuHeight}px; overflow-y: auto; overflow-x: hidden; z-index: 950;"
        onclick={(e) => e.stopPropagation()}
        oncontextmenu={(e) => e.stopPropagation()}
        onmouseenter={onCancelCloseDiffSubmenu}
        onmouseleave={onScheduleCloseDiffSubmenu}
        role="menu"
        tabindex="-1"
    >
        {#each tabTitles as title, idx}
            {#if idx !== contextMenu.index && !tabPendingStates[idx]}
                <button
                    class="context-item diff-item-btn"
                    onclick={() => onSelectDiffTarget(idx)}
                    {title}
                >
                    <span class="diff-item-text">{title}</span>
                </button>
            {/if}
        {/each}
    </div>
{/if}

<!-- 编辑器右键菜单 -->
{#if editorContextMenu.visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={onCloseEditorContextMenu}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseEditorContextMenu();
        }}
        role="presentation"
    >
        <div
            class="context-menu"
            style="{editorContextMenu.left !== null
                ? `left: ${editorContextMenu.left}px;`
                : `right: ${editorContextMenu.right}px;`} top: {editorContextMenu.top}px;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <button
                class="context-item"
                class:disabled={!editorContextMenu.canUndo}
                disabled={!editorContextMenu.canUndo}
                onclick={() => onRunEditorAction("undo")}
            >
                <span>{t("editor_menu.undo", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+Z</span>
            </button>
            <button
                class="context-item"
                class:disabled={!editorContextMenu.canRedo}
                disabled={!editorContextMenu.canRedo}
                onclick={() => onRunEditorAction("redo")}
            >
                <span>{t("editor_menu.redo", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+Shift+Z</span>
            </button>

            <div class="context-divider"></div>

            <button
                class="context-item"
                class:disabled={!editorContextMenu.hasSelection}
                disabled={!editorContextMenu.hasSelection}
                onclick={() => onRunEditorAction("cut")}
            >
                <span>{t("editor_menu.cut", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+X</span>
            </button>
            <button
                class="context-item"
                class:disabled={!editorContextMenu.hasSelection}
                disabled={!editorContextMenu.hasSelection}
                onclick={() => onRunEditorAction("copy")}
            >
                <span>{t("editor_menu.copy", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+C</span>
            </button>
            <button
                class="context-item"
                onclick={() => onRunEditorAction("paste")}
            >
                <span>{t("editor_menu.paste", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+V</span>
            </button>
            <button
                class="context-item"
                onclick={() => onRunEditorAction("delete")}
            >
                <span
                    >{t("editor_menu.delete", undefined, $resolvedLocale)}</span
                ><span class="shortcut">Delete</span>
            </button>

            <div class="context-divider"></div>

            <button
                class="context-item"
                onclick={() => onRunEditorAction("selectAll")}
            >
                <span
                    >{t(
                        "editor_menu.select_all",
                        undefined,
                        $resolvedLocale,
                    )}</span
                ><span class="shortcut">{mod}+A</span>
            </button>
        </div>
    </div>
{/if}

<!-- 关于弹窗 (about) -->
{#if aboutVisible}
    <!-- ★ 核心：移除了 onclick，点击遮罩层不再关闭弹窗 -->
    <div class="modal-overlay" role="presentation">
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions (内部已有真实 button 承担键盘操作) -->
        <div
            class="about-card"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => {
                // 如果按下了 Ctrl+A 或 Cmd+A
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
                    // 检查当前焦点是否在开源协议文本区
                    const isLicenseTarget = (
                        e.target as HTMLElement
                    )?.classList?.contains("about-page-license");
                    if (isLicenseTarget) {
                        // 允许协议区正常全选，但坚决阻止冒泡，不让外层 Monaco 响应！
                        e.stopPropagation();
                    } else {
                        // 其他页面禁止全选穿透
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }}
            role="dialog"
            tabindex="-1"
        >
            <!-- 右上角悬浮关闭按钮 -->
            <button
                class="about-close-btn-float"
                onclick={onCloseAbout}
                aria-label="Close"
            >
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
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>

            <!-- 选项卡导航（居中） -->
            <div class="about-tabs">
                <button
                    class:active={activeAboutTab === "about"}
                    onclick={() => (activeAboutTab = "about")}
                >
                    {t("about.tab.about", undefined, $resolvedLocale)}
                </button>
                <button
                    class:active={activeAboutTab === "privacy"}
                    onclick={() => (activeAboutTab = "privacy")}
                >
                    {t("about.tab.privacy", undefined, $resolvedLocale)}
                </button>
                <button
                    class:active={activeAboutTab === "features"}
                    onclick={() => (activeAboutTab = "features")}
                >
                    {t("about.tab.features", undefined, $resolvedLocale)}
                </button>
                <button
                    class:active={activeAboutTab === "license"}
                    onclick={() => (activeAboutTab = "license")}
                >
                    {t("about.tab.license", undefined, $resolvedLocale)}
                </button>
            </div>

            <!-- 内容区域（独立滚动） -->
            <div class="about-content">
                {#if activeAboutTab === "about"}
                    <div class="about-page-about">
                        <img
                            src="/about_logo.png"
                            alt="FinchPad"
                            class="about-logo-img"
                        />
                        <h2 class="about-app-name">FinchPad</h2>
                        <p class="about-app-desc">
                            {t("about.line1", undefined, $resolvedLocale)}
                        </p>
                        <p class="about-app-desc">
                            {t("about.line2", undefined, $resolvedLocale)}
                        </p>
                        <div class="about-divider"></div>
                        <div class="about-info-list">
                            <div>
                                {t("about.tech", undefined, $resolvedLocale)}
                            </div>
                            <div>
                                {t("about.author", undefined, $resolvedLocale)}
                            </div>
                            <div>
                                {t("about.license", undefined, $resolvedLocale)}
                            </div>
                            <div>
                                <span
                                    class="link"
                                    role="link"
                                    tabindex="0"
                                    onclick={onOpenGitHub}
                                    onkeydown={(e) =>
                                        e.key === "Enter" && onOpenGitHub()}
                                >
                                    {t(
                                        "about.website",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                {:else if activeAboutTab === "privacy"}
                    <div class="about-page-privacy text-content">
                        <p>
                            {t(
                                "about.privacy.intro",
                                undefined,
                                $resolvedLocale,
                            )}
                        </p>
                        <h4>
                            {t(
                                "about.privacy.local_title",
                                undefined,
                                $resolvedLocale,
                            )}
                        </h4>
                        <p>
                            {t(
                                "about.privacy.local_desc",
                                undefined,
                                $resolvedLocale,
                            )}
                        </p>
                        <h4>
                            {t(
                                "about.privacy.telemetry_title",
                                undefined,
                                $resolvedLocale,
                            )}
                        </h4>
                        <p>
                            {t(
                                "about.privacy.telemetry_desc",
                                undefined,
                                $resolvedLocale,
                            )}
                        </p>
                        <h4>
                            {t(
                                "about.privacy.network_title",
                                undefined,
                                $resolvedLocale,
                            )}
                        </h4>
                        <p>
                            {t(
                                "about.privacy.network_desc",
                                undefined,
                                $resolvedLocale,
                            )}
                        </p>
                        <h4>
                            {t(
                                "about.privacy.session_title",
                                undefined,
                                $resolvedLocale,
                            )}
                        </h4>
                        <p>
                            {t(
                                "about.privacy.session_desc",
                                undefined,
                                $resolvedLocale,
                            )}
                        </p>
                    </div>
                {:else if activeAboutTab === "features"}
                    <div class="about-page-features">
                        <!-- 左侧导航 -->
                        <div class="feature-nav">
                            <button
                                class:active={activeFeatureNav === "shortcuts"}
                                onclick={() => (activeFeatureNav = "shortcuts")}
                                >{t(
                                    "about.features.nav.shortcuts",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "tabs"}
                                onclick={() => (activeFeatureNav = "tabs")}
                                >{t(
                                    "about.features.nav.tabs",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "session"}
                                onclick={() => (activeFeatureNav = "session")}
                                >{t(
                                    "about.features.nav.session",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "encoding"}
                                onclick={() => (activeFeatureNav = "encoding")}
                                >{t(
                                    "about.features.nav.encoding",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "large_file"}
                                onclick={() =>
                                    (activeFeatureNav = "large_file")}
                                >{t(
                                    "about.features.nav.large_file",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "preview"}
                                onclick={() => (activeFeatureNav = "preview")}
                                >{t(
                                    "about.features.nav.preview",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                            <button
                                class:active={activeFeatureNav === "diff"}
                                onclick={() => (activeFeatureNav = "diff")}
                                >{t(
                                    "about.features.nav.diff",
                                    undefined,
                                    $resolvedLocale,
                                )}</button
                            >
                        </div>
                        <!-- 右侧内容 -->
                        <div class="feature-content text-content">
                            {#if activeFeatureNav === "shortcuts"}
                                <h3>
                                    {t(
                                        "about.features.shortcuts.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.shortcuts.intro",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>

                                <!-- 精美的快捷键表格 -->
                                <table class="feature-table">
                                    <thead>
                                        <tr>
                                            <th
                                                >{t(
                                                    "about.features.shortcuts.th_op",
                                                    undefined,
                                                    $resolvedLocale,
                                                )}</th
                                            >
                                            <th
                                                >{t(
                                                    "about.features.shortcuts.th_win",
                                                    undefined,
                                                    $resolvedLocale,
                                                )}</th
                                            >
                                            <th
                                                >{t(
                                                    "about.features.shortcuts.th_mac",
                                                    undefined,
                                                    $resolvedLocale,
                                                )}</th
                                            >
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each shortcutList as row}
                                            <tr>
                                                <td>{row.op}</td>
                                                <td>{row.win}</td>
                                                <td>{row.mac}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            {:else if activeFeatureNav === "tabs"}
                                <h3>
                                    {t(
                                        "about.features.tabs.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.tabs.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {:else if activeFeatureNav === "session"}
                                <h3>
                                    {t(
                                        "about.features.session.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.session.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {:else if activeFeatureNav === "encoding"}
                                <h3>
                                    {t(
                                        "about.features.encoding.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.encoding.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {:else if activeFeatureNav === "large_file"}
                                <h3>
                                    {t(
                                        "about.features.large_file.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.large_file.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {:else if activeFeatureNav === "preview"}
                                <h3>
                                    {t(
                                        "about.features.preview.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.preview.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {:else if activeFeatureNav === "diff"}
                                <h3>
                                    {t(
                                        "about.features.diff.title",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </h3>
                                <p>
                                    {@html t(
                                        "about.features.diff.desc",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </p>
                            {/if}
                        </div>
                    </div>
                {:else if activeAboutTab === "license"}
                    <div
                        class="about-page-license text-content"
                        style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 12px; line-height: 1.5;"
                    >
                        {MIT_LICENSE_TEXT}
                    </div>
                {/if}
            </div>

            <!-- 底部版本与检查更新（仅在关于选项卡显示） -->
            {#if activeAboutTab === "about"}
                <div class="about-footer">
                    <span class="version-text"
                        >{t(
                            "about.version",
                            { version: APP_VERSION },
                            $resolvedLocale,
                        )}</span
                    >

                    <!-- 中间：更新状态反馈区 -->
                    <div class="update-status-center">
                        {#if updateStatus === "error"}
                            <!-- ★ 情况1：检查失败，显示提示及前往下载按钮 -->
                            <span class="update-error-text">
                                {t(
                                    "about.check_failed",
                                    undefined,
                                    $resolvedLocale,
                                )}
                                <button
                                    class="link-btn update-action-btn"
                                    onclick={handleUpdateDownload}
                                >
                                    {t(
                                        "dialog.update_confirm",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </button>
                            </span>
                        {:else if updateStatus === "found"}
                            <!-- ★ 情况3：发现新版本，显示提示及前往下载按钮 -->
                            <span class="update-found-text">
                                {t(
                                    "about.found_update",
                                    undefined,
                                    $resolvedLocale,
                                )}
                                <button
                                    class="link-btn update-action-btn"
                                    onclick={handleUpdateDownload}
                                >
                                    {t(
                                        "dialog.update_confirm",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                </button>
                            </span>
                        {:else if updateStatus === "latest"}
                            <!-- 情况2：已是最新版本，保持现状 -->
                            <span class="update-latest-text"
                                >{t(
                                    "about.is_latest",
                                    undefined,
                                    $resolvedLocale,
                                )}</span
                            >
                        {/if}
                    </div>

                    <!-- 右侧：检查更新按钮 -->
                    <button
                        class="update-btn"
                        onclick={checkForUpdates}
                        disabled={updateStatus === "checking" ||
                            updateStatus === "found"}
                    >
                        {#if updateStatus === "checking"}
                            {t("about.checking", undefined, $resolvedLocale)}...
                        {:else}
                            {t(
                                "about.check_update",
                                undefined,
                                $resolvedLocale,
                            )}
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* ==========================================
     现代化弹窗基础
     ========================================== */
    /* ===== 遮罩层与毛玻璃背景 ===== */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
    }

    /* ===== 弹窗主体：参考图的玻璃质感 ===== */
    .modal {
        width: 440px;
        max-width: 90vw;
        padding: 24px 28px 20px;
        background: color-mix(
            in srgb,
            var(--overlay-background) 85%,
            transparent
        );
        backdrop-filter: blur(30px) saturate(200%);
        -webkit-backdrop-filter: blur(30px) saturate(200%);
        border-radius: 18px;
        box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.2) inset,
            0 0 0 0.5px rgba(0, 0, 0, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
        font-family: var(--font-sans);
        animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        color: var(--overlay-foreground);
    }

    /* ===== 主标题（核心提示语） ===== */
    .modal-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--overlay-foreground);
        line-height: 1.5;
        margin-bottom: 12px; /* 让主标题和下方的说明保持适度间距 */
        white-space: pre-line;
        word-break: break-all;
    }

    /* 如果没有副标题，主标题自己撑开与按钮的间距 */
    .modal-title:last-child {
        margin-bottom: 24px;
    }

    /* ===== 副标题（弱化的说明/路径） ===== */
    .modal-subtitle {
        font-family: var(
            --font-sans
        ); /* ★ 核心修改：改成无衬线字体，不再用代码字体！ */
        font-size: 13px; /* 字体稍小 */
        font-weight: 400;
        color: var(--status-bar-foreground-muted); /* 灰色，弱化存在感 */
        line-height: 1.6;
        margin-bottom: 24px; /* 让说明文字与下方按钮保持明确距离 */
        word-break: break-all;
    }

    /* ==========================================
     弹窗按钮系统
     ========================================== */
    .modal-row {
        display: flex;
        gap: 10px;
        margin-top: 12px;
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    /* ===== 按钮基础瘦身统一样式 ===== */
    .modal-btn {
        height: 34px;
        padding: 0 16px;
        border-radius: 8px;
        border: none;
        /* ★ 核心绝杀：摧毁浏览器原生按钮白底 */
        appearance: none;
        -webkit-appearance: none;
        background: transparent;

        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        outline: none;
        flex: none;
    }

    .modal-btn.large {
        min-width: 130px;
        flex: 0 1 130px;
    }

    /* ===== 第一排第一个按钮：Overwrite（主操作），保持主题色 ===== */
    .modal-row:first-of-type .modal-btn.large:first-child {
        background: #0db3db !important;
        color: #ffffff !important;
        box-shadow: 0 2px 6px rgba(13, 179, 219, 0.25) !important;
    }
    .modal-row:first-of-type .modal-btn.large:first-child:hover {
        background: #0c9fbd !important;
    }

    /* ===== 第一排第二个按钮：Discard/Reload（回归正常的次级质感） ===== */
    .modal-btn.secondary {
        /* 背景：保持高级的“主题自适应灰” */
        background: color-mix(
            in srgb,
            var(--overlay-background) 88%,
            var(--overlay-foreground) 12%
        ) !important;

        /* 边框：稍深一点的灰色，勾勒轮廓 */
        border: 1px solid
            color-mix(
                in srgb,
                var(--overlay-background) 70%,
                var(--overlay-foreground) 30%
            ) !important;

        /* ★ 核心修改：使用标准的弹窗文字颜色，绝对不突兀 */
        color: var(--overlay-foreground) !important;

        /* 稍微降低一点字重，和主按钮（500）拉开微小的差距 */
        font-weight: 400;
        box-shadow: none !important;
        transition: all 0.2s ease;
    }

    /* 悬停状态：背景稍微加深，不再泛红 */
    .modal-btn.secondary:hover {
        background: color-mix(
            in srgb,
            var(--overlay-background) 80%,
            var(--overlay-foreground) 20%
        ) !important;
        border-color: color-mix(
            in srgb,
            var(--overlay-background) 60%,
            var(--overlay-foreground) 40%
        ) !important;
    }

    /* ===== 第二排的三个小按钮 (Compare, Save As, Cancel) ===== */
    .modal-btn.small {
        background: transparent;
        color: var(--overlay-foreground-muted);
        padding: 0 12px;
        font-weight: 400;
    }
    .modal-btn.small:hover {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 8%,
            transparent
        );
        color: var(--overlay-foreground);
        border-radius: 6px;
    }

    /* ===== 普通按钮 (适用于图2的三个按钮：Yes / No / Cancel) ===== */
    .modal-btn:not(.large):not(.small) {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 8%,
            transparent
        );
        color: var(--overlay-foreground);
        min-width: 90px;
        border: 0.5px solid
            color-mix(in srgb, var(--overlay-foreground) 10%, transparent);
    }
    .modal-btn:not(.large):not(.small):hover {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 12%,
            transparent
        );
    }

    /* 图2的 Yes (主操作) 依然是主题色 */
    .modal-btn.primary {
        background: #0db3db !important;
        color: #ffffff !important;
        border: none !important;
        box-shadow: 0 2px 6px rgba(13, 179, 219, 0.25);
    }
    .modal-btn.primary:hover {
        background: #0c9fbd !important;
    }

    /* 保证只有单个按钮时居中 */
    .modal-row > .modal-btn:only-child {
        margin: 0 auto;
    }

    /* ==========================================
       全新关于弹窗优化样式 (统一字体与颜色)
       ========================================== */
    .about-card {
        position: relative;
        width: 700px;
        height: 520px;
        max-width: 95vw;
        max-height: 95vh;
        background: var(--overlay-background);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid var(--overlay-border);
        /* ★ 核心：全局强制统一为无衬线字体 */
        font-family: var(--font-sans);
    }

    /* 悬浮关闭按钮 */
    .about-close-btn-float {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 28px;
        height: 28px;
        border-radius: 50%; /* ★ 变身为完美的圆形悬停背景 */
        background: transparent;
        border: none;
        color: var(--overlay-foreground-muted);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transition:
            background-color 0.15s ease,
            color 0.15s ease;
    }

    .about-close-btn-float:hover {
        background: var(
            --overlay-hover-background
        ); /* ★ 复用全局统一的 hover 背景色 */
        color: var(--overlay-foreground);
    }

    /* 选项卡导航 */
    .about-tabs {
        display: flex;
        justify-content: center;
        padding: 20px 20px 0;
        border-bottom: 1px solid var(--overlay-divider);
        gap: 32px;
        flex-shrink: 0;
    }
    .about-tabs button {
        background: none;
        border: none;
        padding: 12px 0;
        font-size: 14px;
        font-weight: 500;
        font-family: var(--font-sans);
        /* ★ 颜色统一：未选中为正文色 */
        color: var(--overlay-foreground-muted);
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
    }
    .about-tabs button:hover {
        color: var(--overlay-foreground); /* 悬停时变为标题色 */
    }
    .about-tabs button.active {
        color: var(--accent); /* 激活时保留主题色，最醒目 */
        border-bottom-color: var(--accent);
    }

    /* 内容区域 */
    .about-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        box-sizing: border-box;
    }

    .text-content {
        font-size: 13px;
        line-height: 1.6;
        font-family: var(--font-sans);
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
    }
    .text-content h3 {
        margin-top: 0;
        margin-bottom: 12px;
        font-size: 16px;
        color: var(--overlay-foreground); /* 标题色 */
        font-weight: 600;
    }
    .text-content h4 {
        margin-top: 20px;
        margin-bottom: 6px;
        font-size: 14px;
        color: var(--overlay-foreground); /* 标题色 */
        font-weight: 600;
    }
    .text-content p {
        margin-top: 0;
        margin-bottom: 12px;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
    }

    /* 关于页样式 */
    .about-page-about {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: flex-start;
        min-height: 100%;
        padding: 10px 0;
        box-sizing: border-box;
    }
    .about-logo-img {
        width: 80px;
        height: 80px;
        border-radius: 18px;
        margin-bottom: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .about-app-name {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: var(--overlay-foreground); /* 标题色 */
    }
    .about-app-desc {
        font-size: 13px;
        margin: 0 0 4px 0;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
    }
    .about-divider {
        width: 60%;
        height: 1px;
        background: var(--overlay-divider);
        margin: 24px 0;
    }

    .about-info-list {
        text-align: center;
        font-size: 13px;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        line-height: 2.2;
        align-self: center;
        width: 100%;
        font-family: var(--font-sans);
    }

    /* 功能说明页左右布局 */
    .about-page-features {
        display: flex;
        height: 100%;
        gap: 24px;
    }
    .feature-nav {
        display: flex;
        flex-direction: column;
        width: 140px;
        flex-shrink: 0;
        gap: 4px;
    }
    .feature-nav button {
        background: none;
        border: none;
        text-align: left;
        padding: 8px 12px;
        font-size: 13px;
        border-radius: 6px;
        font-family: var(--font-sans);
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        cursor: pointer;
        transition:
            background 0.2s,
            color 0.2s;
    }
    .feature-nav button:hover {
        background: var(--overlay-hover-background);
    }
    .feature-nav button.active {
        background: var(--overlay-hover-background);
        color: var(--overlay-foreground); /* 激活时变为标题色 */
        font-weight: 600;
    }
    .feature-content {
        flex: 1;
        overflow-y: auto;
        padding-right: 10px;
    }

    /* ★ 开源协议专属：唯一使用等宽字体的地方 */
    .about-page-license {
        font-family: var(--font-mono) !important;
        font-size: 13px;
        line-height: 1.6;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        white-space: pre-wrap;
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 3%,
            transparent
        );
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid var(--overlay-divider);
    }

    /* 底部栏 */
    .about-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        height: 48px;
        border-top: 1px solid var(--overlay-divider);
        background: color-mix(
            in srgb,
            var(--overlay-background) 95%,
            var(--overlay-foreground) 5%
        );
        flex-shrink: 0;
        font-family: var(--font-sans);
    }
    .version-text {
        font-size: 12px;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        min-width: 80px;
    }

    /* 中间状态区 */
    .update-status-center {
        flex: 1;
        text-align: center;
        padding: 0 16px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .update-error-text {
        color: var(--warning-strong);
        font-weight: 500;
    }
    .update-found-text {
        color: var(--overlay-foreground);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .update-latest-text {
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
    }
    /* 嵌入在状态提示中的下载动作按钮 */
    .update-action-btn {
        background: none;
        border: none;
        font-size: 12px;
        color: var(--accent); /* 使用主题色突出可点击感 */
        cursor: pointer;
        padding: 2px 6px;
        margin-left: 6px;
        border-radius: 4px;
        transition: all 0.15s;
        font-family: var(--font-sans);
        display: inline-flex;
        align-items: center;
    }
    .update-action-btn:hover {
        background: var(--overlay-hover-background);
        text-decoration: underline;
    }

    /* 官网链接专属样式 */
    .link {
        /* ★ 使用主题色，让人一看就知道可以点击 */
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        cursor: pointer;
        text-decoration: none;
        transition: text-decoration 0.2s;
    }

    /* 悬停时增加下划线 */
    .link:hover {
        text-decoration: underline;
    }

    /* 右侧按钮区 */
    .update-btn {
        background: none;
        border: none;
        font-size: 12px;
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 6px;
        transition: all 0.15s;
        min-width: 80px;
        text-align: right;
        font-family: var(--font-sans);
    }
    .update-btn:hover:not(:disabled) {
        color: var(--overlay-foreground);
        background: var(--overlay-hover-background);
    }
    .update-btn:disabled {
        cursor: default;
        opacity: 0.6;
    }

    /* ==========================================
       功能说明页表格样式（完全复用弹窗已有变量）
       ========================================== */
    .feature-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
        font-size: 13px;
        font-family: var(--font-sans);
        text-align: left;
    }

    .feature-table th,
    .feature-table td {
        padding: 10px 12px; /* 增加上下内边距，告别拥挤感 */
        border-bottom: 1px solid var(--overlay-divider);
    }

    .feature-table th {
        font-weight: 600;
        color: var(--overlay-foreground);
        background: transparent;
        border-bottom: 2px solid var(--overlay-divider); /* 表头下加粗线条，更有层次 */
    }

    .feature-table td {
        color: color-mix(in srgb, var(--overlay-foreground) 90%, transparent);
    }

    /* 针对 macOS / Windows 快捷键列采用稍弱的颜色或者等宽对齐，增加精致感 */
    .feature-table td:nth-child(2),
    .feature-table td:nth-child(3) {
        font-family: var(--font-mono);
        font-size: 12px;
        color: color-mix(in srgb, var(--overlay-foreground) 80%, transparent);
    }
    /* ==========================================
       ★ 新增：关于弹窗的细长胶囊滚动条
       ========================================== */
    .about-content::-webkit-scrollbar,
    .feature-content::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .about-content::-webkit-scrollbar-track,
    .feature-content::-webkit-scrollbar-track {
        background: transparent;
    }

    .about-content::-webkit-scrollbar-thumb,
    .feature-content::-webkit-scrollbar-thumb {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 30%,
            transparent
        );
        border-radius: 4px;
        transition: background 0.2s ease;
    }

    .about-content::-webkit-scrollbar-thumb:hover,
    .feature-content::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 60%,
            transparent
        );
    }

    .about-content,
    .feature-content {
        scrollbar-width: thin;
        scrollbar-color: color-mix(
                in srgb,
                var(--overlay-foreground-muted) 30%,
                transparent
            )
            transparent;
    }

    /* ==========================================
     通用菜单及设置菜单样式
     ========================================== */
    .context-overlay {
        position: fixed;
        inset: 0;
        z-index: 900;
    }
    .context-menu {
        position: fixed;
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        border-radius: 8px;
        padding: 4px;
        min-width: 160px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        font-family: var(--font-sans);
    }

    .settings-menu {
        min-width: 150px;
    }
    .settings-group-title {
        padding: 6px 12px 4px;
        font-size: 11px;
        color: var(--overlay-foreground-muted);
        user-select: none;
    }
    .settings-menu .context-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .theme-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .theme-swatch {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 3px;
        border: 1px solid;
        flex-shrink: 0;
        box-sizing: border-box;
    }
    .settings-menu .check {
        color: var(--overlay-foreground);
        font-size: 12px;
        margin-left: 6px;
    }
    .context-item {
        background: none;
        border: none;
        text-align: left;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
        border-radius: 4px;
        color: var(--overlay-foreground);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
    }
    .context-item:hover {
        background: var(--overlay-hover-background);
        color: var(--accent);
    }
    .context-item.disabled,
    .context-item:disabled {
        color: var(--overlay-foreground-muted);
        cursor: default;
        background: none;
    }
    .context-item.disabled:hover,
    .context-item:disabled:hover {
        background: none;
        color: var(--overlay-foreground-muted);
    }
    .context-divider {
        height: 1px;
        background: var(--overlay-divider);
        margin: 4px 0;
    }
    .shortcut {
        font-size: 11px;
        color: var(--overlay-foreground-muted);
        margin-left: auto;
    }
    .context-item.disabled .shortcut {
        color: var(--overlay-foreground-muted);
    }

    /* ==========================================
     对比菜单里的列表项
     ========================================== */
    .diff-item-btn {
        display: block;
        width: 100%;
        min-width: 0;
        text-align: left;
        overflow: hidden;
        flex-shrink: 0;
        padding: 6px 12px;
        line-height: 1.5;
        box-sizing: border-box;
    }
    .diff-item-text {
        display: block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ==========================================
     极简超细滚动条定制
     ========================================== */
    /* 1. 通用菜单滚动条优化（修复 opacity 不生效问题） */
    .context-menu::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .context-menu::-webkit-scrollbar-track {
        background: transparent;
    }
    .context-menu::-webkit-scrollbar-thumb {
        /* 使用 30% 透明度的灰色，替代无效的 opacity 属性 */
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 30%,
            transparent
        );
        border-radius: 4px;
    }
    .context-menu::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 60%,
            transparent
        );
    }
    .context-menu::-webkit-scrollbar-button {
        display: none;
    }

    /* 2. 专门针对语言菜单强化滚动条样式，彻底干掉原生粗滚动条 */
    .context-menu.lang-submenu::-webkit-scrollbar {
        width: 6px;
    }
    .context-menu.lang-submenu::-webkit-scrollbar-track {
        background: transparent;
    }
    .context-menu.lang-submenu::-webkit-scrollbar-thumb {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 30%,
            transparent
        );
        border-radius: 4px;
    }
    .context-menu.lang-submenu::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(
            in srgb,
            var(--overlay-foreground-muted) 60%,
            transparent
        );
    }

    /* 3. 兼容 Firefox 浏览器的滚动条 */
    .context-menu {
        scrollbar-width: thin;
        scrollbar-color: color-mix(
                in srgb,
                var(--overlay-foreground-muted) 30%,
                transparent
            )
            transparent;
    }
    .context-menu.bridge-left::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -8px;
        width: 8px;
    }
    .context-menu.bridge-right::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: -8px;
        width: 8px;
    }

    /* ==========================================
     弹窗动画
     ========================================== */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
