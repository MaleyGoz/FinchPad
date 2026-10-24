export type ShortcutContext = {
    isAnyModalOpen: boolean;
    isMac: boolean;
    modal: any;
    aboutVisible: boolean;
    settingsMenu: any;
    editorContextMenu: any;
    contextMenu: any;
    barContextMenu: any;
    handleModalDismiss: () => void;
    closeSettingsMenu: () => void;
    closeEditorContextMenu: () => void;
    closeContextMenu: () => void;
    closeBarContextMenu: () => void;
    switchToPrevTab: () => void;
    switchToNextTab: () => void;
    tabTitlesLength: number;
    handleSelect: (idx: number) => void;
    editorRef: any;
    handleNew: () => void;
    handleOpen: () => void;
    handleSaveAs: () => void;
    handleSave: () => void;
    closeWindow: () => void;
    handleClose: (index: number) => void;
    activeIndex: number;
    applyZoomDelta: (delta: number) => void;
    setZoomValue: (val: number) => void;
    onToggleSidebarShortcut: () => void;
};

export function handleGlobalShortcut(e: KeyboardEvent, ctx: ShortcutContext) {
    // ★ 弹窗打开时，屏蔽除 Escape 外的所有快捷键
    if (ctx.isAnyModalOpen) {
        if (e.key === "Escape") {
            if (ctx.modal.visible) ctx.handleModalDismiss();
            else if (ctx.aboutVisible) ctx.aboutVisible = false;
            else if (ctx.settingsMenu.visible) ctx.closeSettingsMenu();
            else if (ctx.editorContextMenu.visible) ctx.closeEditorContextMenu();
            else if (ctx.contextMenu.visible) ctx.closeContextMenu();
            else if (ctx.barContextMenu.visible) ctx.closeBarContextMenu();
            e.preventDefault();
        }
        return;
    }

    // 屏蔽 F2 键，防止触发浏览器的默认聚焦行为
    if (e.key === "F2") {
        e.preventDefault();
        return;
    }

    // ==========================================
    // ★ 第一优先级：强制仅限 Ctrl 的快捷键
    // ==========================================
    if (e.ctrlKey && e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) ctx.switchToPrevTab();
        else ctx.switchToNextTab();
        return;
    }

    if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < ctx.tabTitlesLength) {
            e.preventDefault();
            ctx.handleSelect(idx);
        }
        return;
    }

    // ==========================================
    // ★ 第二优先级：支持 Ctrl 和 Cmd 双轨
    // ==========================================
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;

    const key = e.key.toLowerCase();

    // 查找 / 替换
    if (key === "f" && !e.shiftKey) {
        e.preventDefault();
        ctx.editorRef?.execEditorAction("find");
        return;
    }
    if (key === "h" && !e.shiftKey) {
        e.preventDefault();
        ctx.editorRef?.execEditorAction("replace");
        return;
    }

    // 侧边栏切换 (Ctrl+B / Cmd+B)
    if (key === "b" && !e.shiftKey) {
        e.preventDefault();
        ctx.onToggleSidebarShortcut();
        return;
    }

    // 文件操作
    if ((key === "n" || key === "t") && !e.shiftKey) {
        e.preventDefault();
        ctx.handleNew();
    } else if (key === "o" && !e.shiftKey) {
        e.preventDefault();
        ctx.handleOpen();
    } else if (key === "s" && e.shiftKey) {
        e.preventDefault();
        ctx.handleSaveAs();
    } else if (key === "s") {
        e.preventDefault();
        ctx.handleSave();
    } else if (key === "w" && e.shiftKey) {
        e.preventDefault();
        ctx.closeWindow();
    } else if (key === "w") {
        e.preventDefault();
        ctx.handleClose(ctx.activeIndex);
    }
    // 缩放
    else if (key === "=" || key === "+") {
        e.preventDefault();
        ctx.applyZoomDelta(+10);
    } else if (key === "-" || key === "_") {
        e.preventDefault();
        ctx.applyZoomDelta(-10);
    } else if (key === "0") {
        e.preventDefault();
        ctx.setZoomValue(100);
    }
}