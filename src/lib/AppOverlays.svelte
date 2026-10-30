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
    export let onCheckUpdate: () => void;
    export let onShowAbout: () => void;

    // 标签页右键菜单及子菜单
    export let contextMenu: any;
    export let diffSubmenu: any;
    export let tabTitles: string[];
    export let tabDirtyStates: boolean[];
    export let tabUnnamedStates: boolean[];
    export let onMenuCloseAll: () => void;

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
            <!-- ★ 新增：如果有副标题（如文件路径），优先渲染副标题并弱化 -->
            {#if modal.subtitle}
                <div class="modal-subtitle">{modal.subtitle}</div>
            {/if}
            <!-- 主标题：显示核心提示语 -->
            <div class="modal-title">{modal.title}</div>
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
                4}px;"
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
        class="context-menu"
        class:bridge-right={!hasLeft}
        class:bridge-left={hasLeft}
        style="z-index: 1001; left: {ddLeft}px; top: {ddTop}px; max-height: 400px; overflow-y: auto;"
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
                : `right: ${contextMenu.right}px;`} top: {contextMenu.top}px;"
            onclick={(e) => e.stopPropagation()}
            oncontextmenu={(e) => e.stopPropagation()}
            role="menu"
            tabindex="-1"
        >
            <!-- 区块 1：关闭操作 -->
            <button class="context-item" onclick={onMenuCloseSingle}>
                <span>{t("tab_menu.close", undefined, $resolvedLocale)}</span>
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
                    >{t("tab_menu.close_all", undefined, $resolvedLocale)}</span
                >
            </button>
            <button
                class="context-item"
                class:disabled={!hasClosedTabs}
                disabled={!hasClosedTabs}
                onclick={onReopenClosedTab}
            >
                <span>{t("tab_menu.reopen", undefined, $resolvedLocale)}</span>
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
                <span>{t("tab_menu.save", undefined, $resolvedLocale)}</span>
                <span class="shortcut">{mod}+S</span>
            </button>
            <button
                class="context-item"
                class:disabled={(cmIsUnnamed && !cmIsDirty) || cmIsPending}
                disabled={(cmIsUnnamed && !cmIsDirty) || cmIsPending}
                onclick={onMenuSaveAs}
            >
                <span>{t("tab_menu.save_as", undefined, $resolvedLocale)}</span>
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
                <span>{t("tab_menu.rename", undefined, $resolvedLocale)}</span>
                <span class="shortcut">F2</span>
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

            <div class="context-divider"></div>

            <!-- 区块 4：新建与打开 -->
            <button class="context-item" onclick={onMenuNewFromTab}>
                <span>{t("bar_menu.new", undefined, $resolvedLocale)}</span>
                <span class="shortcut">{mod}+N</span>
            </button>
            <button class="context-item" onclick={onMenuOpenFromTab}>
                <span>{t("bar_menu.open", undefined, $resolvedLocale)}</span>
                <span class="shortcut">{mod}+O</span>
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
    {@const ddW = 220}
    {@const ddH = Math.min((tabTitles.length - 1) * 32 + 8, 300)}
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
        class="context-menu"
        style="width: {ddW}px; max-width: {ddW}px; box-sizing: border-box; left: {ddLeft}px; top: {ddTop}px; max-height: 300px; overflow-y: auto; overflow-x: hidden; z-index: 950;"
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
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", sans-serif;
        animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        color: var(--overlay-foreground);
    }

    /* ===== 主标题（核心提示语） ===== */
    .modal-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--overlay-foreground);
        line-height: 1.5;
        margin-bottom: 24px;
        white-space: pre-line;
        word-break: break-all;
    }

    /* ===== 副标题（弱化的文件路径） ===== */
    .modal-subtitle {
        font-family: "SF Mono", Menlo, Consolas, monospace;
        font-size: 13px;
        font-weight: 400;
        color: var(--status-bar-foreground-muted);
        line-height: 1.6;
        margin-bottom: 8px;
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
     关于弹窗样式 
     ========================================== */
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
    .context-menu::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .context-menu::-webkit-scrollbar-track {
        background: transparent;
    }
    .context-menu::-webkit-scrollbar-thumb {
        background: var(--overlay-foreground-muted);
        opacity: 0.5;
        border-radius: 4px;
    }
    .context-menu::-webkit-scrollbar-thumb:hover {
        background: var(--overlay-foreground);
    }
    .context-menu::-webkit-scrollbar-button {
        display: none;
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
