<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        Menu,
        Submenu,
        MenuItem,
        CheckMenuItem,
        PredefinedMenuItem,
    } from "@tauri-apps/api/menu";
    import {
        t,
        resolvedLocale,
        localeChoice,
        LOCALE_OPTIONS,
        LANGUAGE_NAMES,
        type LocaleChoice,
    } from "$lib/i18n";
    import { THEME_ORDER } from "$lib/themes";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { get } from "svelte/store";

    // 接收来自 +page.svelte 的状态和回调
    export let isMac: boolean = false;
    export let snapshot: any;
    export let showLineNumbers: boolean = true;
    export let wordWrap: boolean = true;
    export let editorBg: string = "white";
    export let aboutVisible: boolean = false;
    export let renamingIndex: number = -1;

    export let checkForUpdates: () => void;
    export let handleNew: () => void;
    export let handleOpen: () => void;
    export let handleSave: () => void;
    export let handleSaveAs: () => void;
    export let handleClose: (i: number) => void;
    export let startCloseQueue: (ids: string[]) => void;
    export let handleReopenTab: () => void;
    export let revealItemInDir: (p: string) => void;
    export let openTabDiff: (l: number, r: number) => void;
    export let editorRef: any;
    export let toggleShowLineNumbers: () => void;
    export let handleToggleWordWrap: () => void;
    export let setTheme: (name: string) => void;
    export let setLocale: (choice: LocaleChoice) => void;

    // 供外部控制是否显示大文件菜单
    export let mode: string | null = null;

    let macMenu: Menu | null = null;
    let chkShowLineNumbers: CheckMenuItem | null = null;
    let chkWordWrap: CheckMenuItem | null = null;
    let macMenuTimer: ReturnType<typeof setTimeout> | null = null;

    async function buildMacMenu() {
        if (!isMac) return;
        const locale = get(resolvedLocale);

        try {
            const appMenu = await Submenu.new({
                text: "FinchPad",
                items: [
                    await MenuItem.new({
                        text:
                            t("settings.about", undefined, locale) ||
                            "About FinchPad",
                        action: () => {
                            aboutVisible = true;
                        },
                    }),
                    await MenuItem.new({
                        text:
                            t("settings.check_update", undefined, locale) ||
                            "Check for Updates",
                        action: () => {
                            checkForUpdates();
                        },
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text:
                            t("menu.quit", undefined, locale) ||
                            "Quit FinchPad",
                        action: () => {
                            getCurrentWindow().close();
                        },
                    }),
                ],
            });

            if (mode === "large_viewer" || mode === "diff") {
                macMenu = await Menu.new({ items: [appMenu] });
                await macMenu.setAsAppMenu();
                return;
            }

            const isPending = snapshot.is_pending_load;
            const isUnnamed = snapshot.is_unnamed;
            const hasTabs = snapshot.tab_titles.length > 0;

            const compareItems = [];
            for (let i = 0; i < snapshot.tab_titles.length; i++) {
                if (
                    i !== snapshot.active_index &&
                    !snapshot.tab_pending_states[i]
                ) {
                    compareItems.push(
                        await MenuItem.new({
                            text: snapshot.tab_titles[i],
                            action: () => openTabDiff(snapshot.active_index, i),
                        }),
                    );
                }
            }

            const fileMenu = await Submenu.new({
                text: t("menu.file", undefined, locale) || "File",
                items: [
                    await MenuItem.new({
                        text:
                            t("tab_bar.new_tab", undefined, locale) ||
                            "New Tab",
                        accelerator: "CmdOrCtrl+N",
                        action: () => handleNew(),
                    }),
                    await MenuItem.new({
                        text:
                            t("bar_menu.open", undefined, locale) ||
                            "Open File...",
                        accelerator: "CmdOrCtrl+O",
                        action: () => handleOpen(),
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text: t("tab_menu.save", undefined, locale) || "Save",
                        accelerator: "CmdOrCtrl+S",
                        enabled: !isPending,
                        action: () => handleSave(),
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.save_as", undefined, locale) ||
                            "Save As...",
                        accelerator: "CmdOrCtrl+Shift+S",
                        enabled: !isPending,
                        action: () => handleSaveAs(),
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.rename", undefined, locale) || "Rename",
                        accelerator: "F2",
                        enabled: !isPending && !isUnnamed,
                        action: () => {
                            renamingIndex = snapshot.active_index;
                        },
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.close", undefined, locale) ||
                            "Close Tab",
                        accelerator: "CmdOrCtrl+W",
                        enabled: hasTabs,
                        action: () => handleClose(snapshot.active_index),
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.close_others", undefined, locale) ||
                            "Close Others",
                        enabled: hasTabs && snapshot.tab_titles.length > 1,
                        action: () => {
                            const ids = snapshot.tab_ids.filter(
                                (_: any, i: number) =>
                                    i !== snapshot.active_index,
                            );
                            startCloseQueue(ids);
                        },
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.close_right", undefined, locale) ||
                            "Close to the Right",
                        enabled:
                            hasTabs &&
                            snapshot.active_index <
                                snapshot.tab_titles.length - 1,
                        action: () => {
                            const ids = snapshot.tab_ids.slice(
                                snapshot.active_index + 1,
                            );
                            startCloseQueue(ids);
                        },
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.close_all", undefined, locale) ||
                            "Close All",
                        enabled: hasTabs,
                        action: () => startCloseQueue(snapshot.tab_ids),
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.reopen", undefined, locale) ||
                            "Reopen Closed Tab",
                        accelerator: "CmdOrCtrl+Shift+T",
                        enabled: snapshot.has_closed_tabs,
                        action: () => handleReopenTab(),
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text:
                            t(
                                "tab_menu.reveal_in_explorer",
                                undefined,
                                locale,
                            ) || "Reveal in Explorer",
                        enabled: !isPending && !isUnnamed,
                        action: () => {
                            const p = snapshot.tab_paths[snapshot.active_index];
                            if (p) revealItemInDir(p);
                        },
                    }),
                    await MenuItem.new({
                        text:
                            t("tab_menu.copy_path", undefined, locale) ||
                            "Copy File Path",
                        accelerator: "CmdOrCtrl+Shift+C",
                        enabled: !isPending && !isUnnamed,
                        action: () => {
                            const p = snapshot.tab_paths[snapshot.active_index];
                            if (p) navigator.clipboard.writeText(p);
                        },
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await Submenu.new({
                        text:
                            t("tab_menu.diff", undefined, locale) || "Compare",
                        enabled: compareItems.length > 0,
                        items: compareItems,
                    }),
                ],
            });

            const editMenu = await Submenu.new({
                text: t("menu.edit", undefined, locale) || "Edit",
                items: [
                    await MenuItem.new({
                        text:
                            t("editor_menu.undo", undefined, locale) || "Undo",
                        accelerator: "CmdOrCtrl+Z",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("undo"),
                    }),
                    await MenuItem.new({
                        text:
                            t("editor_menu.redo", undefined, locale) || "Redo",
                        accelerator: "CmdOrCtrl+Shift+Z",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("redo"),
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text: t("editor_menu.cut", undefined, locale) || "Cut",
                        accelerator: "CmdOrCtrl+X",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("cut"),
                    }),
                    await MenuItem.new({
                        text:
                            t("editor_menu.copy", undefined, locale) || "Copy",
                        accelerator: "CmdOrCtrl+C",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("copy"),
                    }),
                    await MenuItem.new({
                        text:
                            t("editor_menu.paste", undefined, locale) ||
                            "Paste",
                        accelerator: "CmdOrCtrl+V",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("paste"),
                    }),
                    await MenuItem.new({
                        text:
                            t("editor_menu.delete", undefined, locale) ||
                            "Delete",
                        accelerator: "Delete",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("delete"),
                    }),
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    await MenuItem.new({
                        text:
                            t("editor_menu.select_all", undefined, locale) ||
                            "Select All",
                        accelerator: "CmdOrCtrl+A",
                        enabled: !isPending,
                        action: () => editorRef?.execEditorAction("selectAll"),
                    }),
                ],
            });

            chkShowLineNumbers = await CheckMenuItem.new({
                text:
                    t("settings.show_line_numbers", undefined, locale) ||
                    "Show Line Numbers",
                checked: showLineNumbers,
                enabled: !isPending,
                action: () => toggleShowLineNumbers(),
            });
            chkWordWrap = await CheckMenuItem.new({
                text: t("settings.word_wrap", undefined, locale) || "Word Wrap",
                checked: wordWrap,
                enabled: !isPending && !snapshot.large_file,
                action: () => handleToggleWordWrap(),
            });

            const themeItems = [];
            for (const themeKey of THEME_ORDER) {
                themeItems.push(
                    await CheckMenuItem.new({
                        text: t(
                            `settings.theme.${themeKey}`,
                            undefined,
                            locale,
                        ),
                        checked: editorBg === themeKey,
                        action: () => setTheme(themeKey),
                    }),
                );
            }
            const themeMenu = await Submenu.new({
                text: t("settings.theme", undefined, locale) || "Theme",
                items: themeItems,
            });

            const langItems = [];
            for (const opt of LOCALE_OPTIONS) {
                langItems.push(
                    await CheckMenuItem.new({
                        text: LANGUAGE_NAMES[opt.key] || opt.key,
                        checked: get(localeChoice) === opt.key,
                        action: () => setLocale(opt.key as LocaleChoice),
                    }),
                );
            }
            const langMenu = await Submenu.new({
                text: t("settings.language", undefined, locale) || "Language",
                items: langItems,
            });

            const viewMenu = await Submenu.new({
                text: t("menu.view", undefined, locale) || "View",
                items: [
                    chkShowLineNumbers,
                    chkWordWrap,
                    await PredefinedMenuItem.new({ item: "Separator" }),
                    themeMenu,
                    langMenu,
                ],
            });

            macMenu = await Menu.new({
                items: [appMenu, fileMenu, editMenu, viewMenu],
            });
            await macMenu.setAsAppMenu();
        } catch (e) {
            console.error("Mac 菜单构建失败:", e);
        }
    }

    // 精准监听依赖项，防抖重建
    $: menuTrigger = [
        $resolvedLocale,
        $localeChoice,
        snapshot.tab_titles.join(","),
        snapshot.active_index,
        snapshot.tab_pending_states.join(","),
        snapshot.tab_ids.join(","),
        snapshot.is_pending_load,
        snapshot.is_unnamed,
        snapshot.has_closed_tabs,
        snapshot.large_file,
        editorBg,
        isMac,
        mode,
    ].join("|");

    $: if (isMac && menuTrigger) {
        if (macMenuTimer) clearTimeout(macMenuTimer);
        macMenuTimer = setTimeout(() => {
            buildMacMenu();
        }, 50);
    }

    // 单独同步勾选状态
    $: if (isMac && chkShowLineNumbers)
        chkShowLineNumbers.setChecked(showLineNumbers).catch(console.error);
    $: if (isMac && chkWordWrap)
        chkWordWrap.setChecked(wordWrap).catch(console.error);

    onDestroy(() => {
        if (macMenuTimer) clearTimeout(macMenuTimer);
    });
</script>
