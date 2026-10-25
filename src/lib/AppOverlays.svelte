<script lang="ts">
    import {
        t,
        resolvedLocale,
        LANGUAGE_NAMES,
        LOCALE_OPTIONS,
        localeChoice,
    } from "$lib/i18n";
    import { THEMES, THEME_ORDER } from "$lib/themes";

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
    export let onCheckUpdate: () => void;
    export let onShowAbout: () => void;

    // 标签页右键菜单及子菜单
    export let contextMenu: any;
    export let diffSubmenu: any;
    export let tabTitles: string[];
    export let tabDirtyStates: boolean[];
    export let tabUnnamedStates: boolean[];

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

    // 对比二级菜单事件回调
    export let onCloseDiffSubmenu: () => void;
    export let onCancelCloseDiffSubmenu: () => void;
    export let onSelectDiffTarget: (idx: number) => void;

    // 空白处右键菜单事件回调
    export let onCloseBarContextMenu: () => void;
    export let onBarMenuNew: () => void;
    export let onBarMenuOpen: () => void;

    // 编辑器右键菜单事件回调
    export let onCloseEditorContextMenu: () => void;
    export let onRunEditorAction: (action: string) => void;
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
            <div class="modal-title">{modal.title}</div>
            {#each modal.rows as row}
                <div class="modal-row" class:narrow-btns={row.length === 2}>
                    {#each row as btn}
                        <button
                            class="modal-btn"
                            class:primary={btn.style === "primary"}
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
        onclick={onCloseSettings}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseSettings();
        }}
        role="presentation"
    >
        <div
            class="context-menu settings-menu"
            style="right: {window.innerWidth -
                settingsMenu.anchorRight}px; top: {settingsMenu.anchorBottom +
                4}px;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <div class="settings-group-title">
                {t("settings.view", undefined, $resolvedLocale)}
            </div>
            <button class="context-item" onclick={onToggleLineNumbers}>
                <span
                    >{t(
                        "settings.show_line_numbers",
                        undefined,
                        $resolvedLocale,
                    )}</span
                >
                {#if showLineNumbers}
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
            <button
                class="context-item"
                class:disabled={largeFile}
                disabled={largeFile}
                onclick={onToggleWordWrap}
            >
                <span
                    >{t("settings.word_wrap", undefined, $resolvedLocale)}</span
                >
                {#if wordWrap && !largeFile}
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
            <button class="context-item" onclick={onCheckUpdate}>
                <span
                    >{t(
                        "settings.check_update",
                        undefined,
                        $resolvedLocale,
                    )}</span
                >
            </button>

            <button class="context-item" onclick={onShowAbout}>
                <span>{t("settings.about", undefined, $resolvedLocale)}</span>
            </button>
        </div>
    </div>
{/if}

<!-- 语言二级菜单 -->
{#if langSubmenu.visible}
    {@const ddW = 180}
    {@const ddH = Math.min(LOCALE_OPTIONS.length * 32 + 8, 400)}
    {@const hasLeft = langSubmenu.anchorLeft - ddW - 8 >= 0}
    {@const ddLeft = hasLeft
        ? langSubmenu.anchorLeft - ddW - 4
        : langSubmenu.anchorRight + 4}
    {@const ddTop = Math.max(
        8,
        Math.min(langSubmenu.anchorTop, window.innerHeight - ddH - 8),
    )}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={onCloseLangSubmenu}
        role="presentation"
    >
        <div
            class="context-menu"
            class:bridge-right={!hasLeft}
            class:bridge-left={hasLeft}
            style="left: {ddLeft}px; top: {ddTop}px; max-height: 400px; overflow-y: auto;"
            onclick={(e) => e.stopPropagation()}
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
    </div>
{/if}

<!-- 标签页右键菜单 -->
{#if contextMenu.visible}
    {@const cmIndex = contextMenu.index}
    {@const cmTabCount = tabTitles.length}
    {@const cmIsDirty = tabDirtyStates[cmIndex] ?? false}
    {@const cmIsUnnamed = tabUnnamedStates[cmIndex] ?? false}
    {@const cmCanCloseOthers = cmTabCount > 1}
    {@const cmCanCloseLeft = cmIndex > 0}
    {@const cmCanCloseRight = cmIndex < cmTabCount - 1}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={onCloseContextMenu}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseContextMenu();
        }}
        role="presentation"
    >
        <div
            class="context-menu"
            style="{contextMenu.left !== null
                ? `left: ${contextMenu.left}px;`
                : `right: ${contextMenu.right}px;`} top: {contextMenu.top}px;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <button
                class="context-item"
                class:disabled={!cmIsDirty}
                disabled={!cmIsDirty}
                onclick={onMenuSave}
            >
                <span>{t("tab_menu.save", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+S</span>
            </button>
            <button
                class="context-item"
                class:disabled={cmIsUnnamed && !cmIsDirty}
                disabled={cmIsUnnamed && !cmIsDirty}
                onclick={onMenuSaveAs}
            >
                <span>{t("tab_menu.save_as", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+Shift+S</span>
            </button>

            <div class="context-divider"></div>

            <button
                class="context-item"
                class:disabled={cmTabCount <= 1}
                disabled={cmTabCount <= 1}
                onmouseenter={onShowDiffSubmenu}
                onmouseleave={onScheduleCloseDiffSubmenu}
            >
                <span>{t("tab_menu.diff", undefined, $resolvedLocale)}</span>
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

            <button class="context-item" onclick={onMenuCloseSingle}>
                <span>{t("tab_menu.close", undefined, $resolvedLocale)}</span
                ><span class="shortcut">{mod}+W</span>
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
                class:disabled={!cmCanCloseLeft}
                disabled={!cmCanCloseLeft}
                onclick={onMenuCloseLeft}
            >
                <span
                    >{t(
                        "tab_menu.close_left",
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

            <div class="context-divider"></div>

            <button
                class="context-item"
                class:disabled={cmIsUnnamed}
                disabled={cmIsUnnamed}
                onclick={() => onTriggerRename(cmIndex)}
            >
                <span>{t("tab_menu.rename", undefined, $resolvedLocale)}</span>
            </button>

            <button
                class="context-item"
                class:disabled={cmIsUnnamed}
                disabled={cmIsUnnamed}
                onclick={onMenuCopyPath}
            >
                <span
                    >{t("tab_menu.copy_path", undefined, $resolvedLocale)}</span
                >
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
    {@const ddW = 200}
    {@const ddH = Math.min((tabTitles.length - 1) * 32 + 8, 400)}
    {@const hasRight = diffSubmenu.anchorRight + ddW + 8 <= window.innerWidth}
    {@const ddLeft = hasRight
        ? diffSubmenu.anchorRight + 4
        : Math.max(8, diffSubmenu.anchorLeft - ddW - 4)}
    {@const ddTop = Math.max(
        8,
        Math.min(diffSubmenu.anchorTop, window.innerHeight - ddH - 8),
    )}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="context-overlay"
        onclick={() => {
            onCloseDiffSubmenu();
            onCloseContextMenu();
        }}
        oncontextmenu={(e) => {
            e.preventDefault();
            onCloseDiffSubmenu();
            onCloseContextMenu();
        }}
        role="presentation"
    >
        <div
            class="context-menu"
            class:bridge-right={!hasRight}
            class:bridge-left={hasRight}
            style="left: {ddLeft}px; top: {ddTop}px; max-height: 400px; overflow-y: auto;"
            onclick={(e) => e.stopPropagation()}
            onmouseenter={onCancelCloseDiffSubmenu}
            onmouseleave={onScheduleCloseDiffSubmenu}
            role="menu"
            tabindex="-1"
        >
            {#each tabTitles as title, idx}
                {#if idx !== contextMenu.index}
                    <button
                        class="context-item"
                        onclick={() => onSelectDiffTarget(idx)}
                    >
                        <span>{title}</span>
                    </button>
                {/if}
            {/each}
        </div>
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
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-overlay" onclick={onCloseAbout} role="presentation">
        <div
            class="about-card"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            tabindex="-1"
        >
            <img src="/icon.png" alt="FinchPad" class="about-icon" />
            <div class="about-title">
                {t("about.title", undefined, $resolvedLocale)}
            </div>
            <div class="about-version">
                {t("about.version", { version: APP_VERSION }, $resolvedLocale)}
            </div>
            <div class="about-desc">
                {t("about.line1", undefined, $resolvedLocale)}
            </div>
            <div class="about-desc">
                {t("about.line2", undefined, $resolvedLocale)}
            </div>
            <div class="about-divider"></div>
            <div class="about-info">
                <div>{t("about.tech", undefined, $resolvedLocale)}</div>
                <div>{t("about.author", undefined, $resolvedLocale)}</div>
                <div>{t("about.license", undefined, $resolvedLocale)}</div>
                <div>
                    <span
                        class="link"
                        role="link"
                        tabindex="0"
                        onclick={onOpenGitHub}
                        onkeydown={(e) => e.key === "Enter" && onOpenGitHub()}
                        >{t("about.website", undefined, $resolvedLocale)}</span
                    >
                </div>
            </div>
            <button class="about-btn" onclick={onCloseAbout}
                >{t("about.ok", undefined, $resolvedLocale)}</button
            >
        </div>
    </div>
{/if}

<style>
    /* 通用弹窗样式 */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal {
        background: var(--overlay-background);
        color: var(--overlay-foreground);
        border-radius: 8px;
        padding: 16px 20px;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        font-family: sans-serif;
    }
    .modal-title {
        font-size: 13px;
        color: var(--overlay-foreground);
        margin-bottom: 12px;
        word-wrap: break-word;
        line-height: 1.5;
        white-space: pre-line;
    }
    .modal-row {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        width: 100%;
    }
    .modal-btn {
        flex: 1;
        padding: 6px 8px;
        font-size: 12px;
        background: var(--overlay-hover-background);
        border: 1px solid var(--overlay-border);
        color: var(--overlay-foreground);
        border-radius: 5px;
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
        transition:
            filter 0.1s,
            background-color 0.1s;
    }
    .modal-row > .modal-btn:only-child {
        flex: none;
        min-width: 100px;
        padding-left: 24px;
        padding-right: 24px;
        margin: 0 auto;
    }
    /* ★ 针对只有两个按钮的弹窗（如检查更新），限制宽度并居中 */
    .modal-row.narrow-btns {
        justify-content: center;
    }
    .modal-row.narrow-btns .modal-btn {
        flex: none; /* 不再强制平分 */
        min-width: 100px; /* 保证最小宽度 */
        padding: 6px 24px; /* 左右留足内边距，看起来更精致 */
    }
    .modal-btn:hover {
        filter: brightness(0.95);
    }
    .modal-btn.primary {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }
    .modal-btn.primary:hover {
        filter: brightness(0.95);
    }
    .modal-btn.large {
        padding: 9px 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .modal-btn.small {
        padding: 5px 8px;
        font-size: 12px;
        font-weight: 400;
    }

    /* 关于弹窗样式 */
    .about-card {
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
        padding: 28px 32px;
        min-width: 380px;
        max-width: 480px;
        text-align: center;
        font-family: sans-serif;
    }
    .about-icon {
        width: 64px;
        height: 64px;
        margin-bottom: 12px;
        background: transparent;
    }
    .about-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--overlay-foreground);
        margin-bottom: 4px;
    }
    .about-version {
        font-size: 12px;
        color: var(--overlay-foreground-muted);
        margin-bottom: 16px;
    }
    .about-desc {
        font-size: 13px;
        color: var(--overlay-foreground);
        line-height: 1.6;
    }
    .about-divider {
        height: 1px;
        background: var(--overlay-divider);
        margin: 16px 0;
    }
    .about-info {
        font-size: 12px;
        color: var(--overlay-foreground-muted);
        line-height: 1.8;
        text-align: left;
    }
    .link {
        color: var(--accent);
        cursor: pointer;
    }
    .link:hover {
        text-decoration: underline;
    }
    .about-btn {
        margin-top: 20px;
        padding: 6px 24px;
        font-size: 13px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
    }
    .about-btn:hover {
        filter: brightness(0.9);
    }

    /* 通用菜单及设置菜单样式 */
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
        font-family: sans-serif;
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
     极简超细滚动条定制 (让菜单和编辑器风格统一)
     ========================================== */

    /* 针对所有带有滚动条的右键菜单和二级菜单 */
    .context-menu::-webkit-scrollbar {
        width: 6px; /* 宽度极细 */
        height: 6px; /* 横向滚动条也变细 */
    }

    /* 滚动条轨道（底色）保持透明，不占用视觉空间 */
    .context-menu::-webkit-scrollbar-track {
        background: transparent;
    }

    /* 滚动条滑块（那根可以拖动的条） */
    .context-menu::-webkit-scrollbar-thumb {
        background: var(--overlay-foreground-muted);
        opacity: 0.5;
        border-radius: 4px; /* 圆角显得更柔和 */
    }

    /* 鼠标悬停在滑块上时，颜色加深，提示用户 */
    .context-menu::-webkit-scrollbar-thumb:hover {
        background: var(--overlay-foreground);
    }

    /* 隐藏原生滚动条两端的上下小箭头（极其丑陋） */
    .context-menu::-webkit-scrollbar-button {
        display: none;
    }

    /* 给靠右的子菜单加左侧隐形桥梁 */
    .context-menu.bridge-left::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -8px;
        width: 8px;
    }

    /* 给靠左的子菜单加右侧隐形桥梁 */
    .context-menu.bridge-right::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: -8px;
        width: 8px;
    }
</style>
