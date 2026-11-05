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
    mouseY: number;
    onRenameRequest: () => void;
    onCopyPath: () => void;
    onReopenTab: () => void;
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

    // 重命名F2
    if (e.key === "F2") {
        e.preventDefault();
        e.stopPropagation();
        if (ctx.mouseY < 60) {
            ctx.onRenameRequest();
        }
        return;
    }

    // ==========================================
    // ★ 第一优先级：强制仅限 Ctrl 的快捷键（切换标签）
    // ==========================================
    // 为了避开 Mac 的 Cmd+Tab，这里强制判断 e.ctrlKey
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

    // ★ 核心接管：Mac 下的 Ctrl 文本快捷键
    const isTextAction = ["z", "y", "x", "c", "v"].includes(key);
    if (isTextAction && e.ctrlKey) {
        // 确保焦点在 Monaco 编辑器内，否则不拦截（比如搜索框里的复制粘贴）
        if (document.activeElement?.closest(".monaco-editor")) {
            if (ctx.isMac) {
                // ★ Mac 专属桥接：拦截并直接调用我们封装好的 Tauri 剪贴板动作
                e.preventDefault();
                if (key === "z") ctx.editorRef?.execEditorAction(e.shiftKey ? "redo" : "undo");
                else if (key === "y") ctx.editorRef?.execEditorAction("redo");
                else if (key === "x") ctx.editorRef?.execEditorAction("cut");
                else if (key === "c") ctx.editorRef?.execEditorAction("copy");
                else if (key === "v") ctx.editorRef?.execEditorAction("paste");
                return;
            } else {
                return; // Windows/Linux 放行给 Monaco 原生处理，性能最高
            }
        }
    }

    // ★ 新增：兼容 Mac 用户习惯，Cmd+Y 触发重做
    if (e.metaKey && key === "y") {
        e.preventDefault();
        ctx.editorRef?.execEditorAction("redo");
        return;
    }

    // 查找 / 替换 (Ctrl+F / Cmd+F)
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

    // 复制文件路径 (Ctrl+Shift+C / Cmd+Shift+C)
    if (e.shiftKey && key === "c") {
        // ★ 隐患1防御：如果焦点在输入框里，直接放行，不要拦截
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
            return;
        }
        // ★ 隐患2防御：如果焦点在 Monaco 编辑器，且用户选中了文本，直接放行去复制文本
        if (document.activeElement?.closest(".monaco-editor") && ctx.editorRef?.hasSelection()) {
            return;
        }
        // 如果以上都不是（比如焦点在标签栏，或者编辑器里没选中文字），则执行复制文件路径
        e.preventDefault();
        e.stopPropagation();
        ctx.onCopyPath();
        return;
    }

    // 文件操作
    if ((key === "n" || key === "t") && !e.shiftKey) {
        e.preventDefault();
        ctx.handleNew();
    } else if (key === "t" && e.shiftKey) {
        e.preventDefault();
        ctx.onReopenTab();
    } else if (key === "o" && !e.shiftKey) {
        e.preventDefault();
        ctx.handleOpen();
    } else if (key === "s" && e.shiftKey) {
        e.preventDefault();
        ctx.handleSaveAs();
    } else if (key === "s" && !e.shiftKey) {
        e.preventDefault();
        ctx.handleSave();
    } else if (key === "w" && e.shiftKey) {
        e.preventDefault();
        ctx.closeWindow();
    } else if (key === "w" && !e.shiftKey) {
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