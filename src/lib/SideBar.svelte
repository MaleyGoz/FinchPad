<script lang="ts">
    import { onMount } from "svelte";
    import { api, type FileEntry } from "$lib/api";
    import { tooltip } from "$lib/tooltip";
    import { t, resolvedLocale } from "$lib/i18n";
    import FileIcon from "$lib/FileIcon.svelte";
    import Toggle from "$lib/Toggle.svelte";

    export let onClose: () => void = () => {};
    export let mode: "recent" | "directory" | null = null;
    export let activeFilePath: string = "";
    export let onOpenFile: (path: string) => void = () => {};
    export let recentFilesVersion = 0;
    export let recordRecentFiles: boolean = true;
    export let onToggleRecordRecentFiles: (value: boolean) => void = () => {};

    let recentFiles: string[] = [];
    let currentDirFiles: FileEntry[] = [];
    let currentBrowsePath = "";
    let baseDir = "";
    let dirLoading = false;
    let dirError = false;

    const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    function getSep(path: string) {
        return path.includes("\\") ? "\\" : "/";
    }

    // 清空操作
    async function handleClearRecent() {
        await api.clearRecentFiles();
        recentFiles = [];
        // 触发父组件版本号变化，如果是普通情况可以直接在这里更新
        // 假设父组件传入的 recentFilesVersion 会有变化
    }

    // 单条删除
    async function handleRemoveRecent(e: MouseEvent, path: string) {
        e.stopPropagation();
        await api.removeRecentFile(path);
        recentFiles = recentFiles.filter((f) => f !== path);
    }

    // 加载最近文件
    async function loadRecentFiles() {
        try {
            recentFiles = await api.getRecentFiles();
        } catch (e) {
            console.error("加载最近文件失败", e);
        }
    }

    // 加载目录
    async function loadDirectory(path: string, isSilent = false) {
        // 如果是静默重试（比如窗口重新获得焦点），不显示 Loading 动画，防止界面闪烁
        if (!isSilent) {
            dirLoading = true;
        }
        dirError = false;
        try {
            currentDirFiles = await api.readDir(path);
            currentBrowsePath = path;
        } catch (e) {
            console.error("读取目录失败:", e);
            if (path === baseDir) {
                dirError = true;
                currentDirFiles = [];
            } else {
                goUp();
            }
        } finally {
            if (!isSilent) {
                dirLoading = false;
            }
        }
    }

    // 进入子文件夹
    function enterFolder(folderName: string) {
        const sep = getSep(currentBrowsePath);
        loadDirectory(`${currentBrowsePath}${sep}${folderName}`);
    }

    // 返回上一级（沙盒限制）
    function goUp() {
        if (currentBrowsePath === baseDir || !currentBrowsePath) return;
        const sep = getSep(currentBrowsePath);
        const lastIndex = currentBrowsePath.lastIndexOf(sep);
        if (lastIndex <= 0) return;
        const parentPath = currentBrowsePath.substring(0, lastIndex);
        if (parentPath.length < baseDir.length) return;
        loadDirectory(parentPath);
    }

    // 记录上一次的状态，用于判断是否真的发生了切换
    let lastActivePath = "";
    let wasOpen = false;

    // ★ 新增：监听最近文件模式
    // 只要切到最近文件面板，或者 recentFilesVersion 变化（有关闭标签操作），就去重新拉取
    $: if (mode === "recent") {
        void recentFilesVersion;
        loadRecentFiles();
    }

    // 触发时机 1 & 2：面板打开、标签切换
    $: {
        if (mode === "directory") {
            if (!wasOpen) {
                // 时机 1：侧边栏从隐藏变显示
                wasOpen = true;
                if (activeFilePath) {
                    lastActivePath = activeFilePath;
                    const sep = getSep(activeFilePath);
                    baseDir = activeFilePath.substring(
                        0,
                        activeFilePath.lastIndexOf(sep),
                    );
                    currentBrowsePath = baseDir;
                    loadDirectory(baseDir);
                }
            } else if (activeFilePath && activeFilePath !== lastActivePath) {
                // 时机 2：切到了有路径的文件
                lastActivePath = activeFilePath;
                const sep = getSep(activeFilePath);
                baseDir = activeFilePath.substring(
                    0,
                    activeFilePath.lastIndexOf(sep),
                );
                currentBrowsePath = baseDir;
                loadDirectory(baseDir);
            } else if (!activeFilePath) {
                // 策略 A：切到了未命名标签，保留现有视图，但清空记录以便下次能触发
                lastActivePath = "";
            }
        } else {
            // 侧边栏关闭，重置状态
            wasOpen = false;
            lastActivePath = "";
        }
    }

    // 触发时机 3：窗口重新获得焦点（应对 U 盘重插、网盘重连）
    onMount(() => {
        const handleWindowFocus = () => {
            // 只有在报错状态下，才去静默重试一次
            if (dirError && currentBrowsePath) {
                console.log("窗口获得焦点，静默重试读取目录...");
                loadDirectory(currentBrowsePath, true);
            }
        };

        window.addEventListener("focus", handleWindowFocus);
        return () => window.removeEventListener("focus", handleWindowFocus);
    });
</script>

{#if mode}
    <div class="sidebar">
        <div class="sidebar-header" data-tauri-drag-region>
            <!-- Mac 专属：红绿灯占位区 -->
            {#if isMac}
                <div class="mac-traffic-spacer" data-tauri-drag-region></div>
            {:else}
                <!-- Windows/Linux 专属：Logo -->
                <div class="app-logo" data-tauri-drag-region>
                    <img src="/tab-icon.png" alt="FinchPad" />
                </div>
            {/if}

            <!-- ★ 绝对居中的假标签文字 -->
            <div class="fake-tab-title-wrapper" data-tauri-drag-region>
                <span class="fake-tab-title">
                    {mode === "recent"
                        ? t("sidebar.recent", undefined, $resolvedLocale)
                        : t("sidebar.directory", undefined, $resolvedLocale)}
                </span>
            </div>

            <!-- ★ 关闭按钮 -->
            <button
                class="close-sidebar-btn"
                onclick={onClose}
                aria-label="Close Sidebar"
            >
                ×
            </button>
        </div>
        <div class="sidebar-body">
            <!-- 最近文件 -->
            {#if mode === "recent"}
                <!-- ★ 新增：悬浮置顶工具栏 -->
                <div class="recent-toolbar">
                    <!-- 记录历史按钮 -->
                    <button
                        class="record-btn"
                        onclick={() =>
                            onToggleRecordRecentFiles(!recordRecentFiles)}
                    >
                        <span style="transform: translateY(-0.5px);">
                            {t(
                                "sidebar.record_history",
                                undefined,
                                $resolvedLocale,
                            )}
                        </span>

                        <Toggle
                            checked={recordRecentFiles}
                            onChange={onToggleRecordRecentFiles}
                        />
                    </button>
                    <!-- 清空按钮 -->
                    <button class="clear-btn" onclick={handleClearRecent}>
                        {t("sidebar.clear_history", undefined, $resolvedLocale)}
                    </button>
                </div>

                <!-- 最近文件列表 -->
                <div class="sidebar-list">
                    {#if recentFiles.length === 0}
                        <div
                            class="empty-hint"
                            style="color: var(--status-bar-foreground); opacity: 0.6;"
                        >
                            {t(
                                "sidebar.empty_recent",
                                undefined,
                                $resolvedLocale,
                            )}
                        </div>
                    {:else}
                        {#each recentFiles as file}
                            <div
                                class="sidebar-item recent-item"
                                onclick={() => onOpenFile(file)}
                                onkeydown={(e) =>
                                    e.key === "Enter" && onOpenFile(file)}
                                use:tooltip={file}
                                role="button"
                                tabindex="0"
                            >
                                <span
                                    class="item-name"
                                    style="flex: 1; overflow: hidden; text-overflow: ellipsis;"
                                >
                                    {file.split(/[\\/]/).pop()}
                                </span>
                                <button
                                    class="delete-btn"
                                    onclick={(e) => handleRemoveRecent(e, file)}
                                    aria-label={t(
                                        "sidebar.delete_record",
                                        undefined,
                                        $resolvedLocale,
                                    )}
                                >
                                    ×
                                </button>
                            </div>
                        {/each}
                    {/if}
                </div>
            {/if}

            <!-- 当前目录 -->
            {#if mode === "directory"}
                <div class="dir-toolbar">
                    <button
                        class="dir-up-btn"
                        onclick={goUp}
                        disabled={currentBrowsePath === baseDir ||
                            dirLoading ||
                            dirError}
                    >
                        ⬆️ {t("sidebar.up", undefined, $resolvedLocale)}
                    </button>
                    <span class="dir-path-text" use:tooltip={currentBrowsePath}>
                        {currentBrowsePath.split(/[\\/]/).pop() ||
                            currentBrowsePath}
                    </span>
                </div>

                <div class="sidebar-list">
                    {#if dirLoading}
                        <div class="empty-hint">Loading...</div>
                    {:else if dirError}
                        <!-- ★ 新增：目录不可达提示 -->
                        <div class="dir-error-hint">
                            {t(
                                "sidebar.dir_unreachable",
                                { path: baseDir },
                                $resolvedLocale,
                            )}
                        </div>
                    {:else if currentDirFiles.length === 0}
                        <div class="empty-hint">
                            {t("sidebar.empty_dir", undefined, $resolvedLocale)}
                        </div>
                    {:else}
                        {#each currentDirFiles as file}
                            <button
                                class="sidebar-item"
                                use:tooltip={file.path}
                                onclick={() =>
                                    file.is_dir
                                        ? enterFolder(file.name)
                                        : onOpenFile(file.path)}
                            >
                                <span class="item-name">
                                    <FileIcon
                                        name={file.name}
                                        isDir={file.is_dir}
                                    />
                                    {file.name}
                                </span>
                            </button>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* 侧边栏外层容器 */
    .sidebar {
        width: 250px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        background: var(--status-bar-background); /* ★ 改：主体用状态栏背景 */
        border-right: 1px solid var(--overlay-divider); /* 右侧分割线 */
    }

    /* 头部假标签 */
    .sidebar-header {
        display: flex;
        align-items: center;
        height: 38px;
        background: var(--tab-bar-background); /* 头部用标签栏背景 */
        border-bottom: 1px solid var(--tab-border);
        box-sizing: border-box;
        user-select: none;
        flex-shrink: 0;
        position: relative; /* ★ 核心修复：让内部的绝对定位有参考系 */
    }

    /* Mac 红绿灯占位 */
    .mac-traffic-spacer {
        width: 75px; /* 和之前的宽度保持一致 */
        height: 100%;
        flex-shrink: 0;
    }

    /* Windows/Linux Logo */
    .app-logo {
        width: 28px;
        height: 28px;
        margin-left: 6px;
        margin-right: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .app-logo img {
        width: 18px;
        height: 18px;
        display: block;
        pointer-events: none;
    }

    /* 文字外壳：绝对定位实现完美居中 */
    .fake-tab-title-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 假标签文字本体 */
    .fake-tab-title {
        font-size: 13px;
        font-weight: 500;
        padding-top: 5px;
        color: var(--tab-foreground);
        white-space: nowrap;
        /* 删除了 padding、border-radius、transition */
    }

    /* 关闭按钮 (位置固定在右侧) */
    .close-sidebar-btn {
        position: absolute;
        right: 0;
        background: none;
        border: none;
        font-size: 16px;
        color: var(--tab-foreground);
        cursor: pointer;
        padding: 5px 12px 0;
        height: 100%;
        display: flex;
        align-items: center;
        opacity: 0;
        transition:
            opacity 0.15s,
            color 0.15s;
    }
    .sidebar-header:hover .close-sidebar-btn {
        opacity: 1;
    }
    .close-sidebar-btn:hover {
        color: var(--accent);
    }

    .close-sidebar-btn:hover {
        color: var(--accent);
    }
    .sidebar-body {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden; /* ★ 新增：彻底锁死横向滚动条 */
    }
    .sidebar-list {
        display: flex;
        flex-direction: column;
        padding: 4px;
    }
    /* 空状态提示 */
    .empty-hint {
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: var(--status-bar-foreground-muted);
    }
    .sidebar-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 6px 8px;
        background: none;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
    /* 悬停背景 */
    .sidebar-item:hover {
        /* 使用带透明度的前景色，这样在深浅主题下都能自然融合 */
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 10%,
            transparent
        );
    }
    /* 列表项文件名 */
    .item-name {
        font-size: 13px;
        color: var(
            --status-bar-foreground
        ); /* ★ 改：使用状态栏前景色，与背景更搭 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0; /* ★ 新增：黄金法则！允许 Flex 子项缩小到比文字内容更小，从而触发省略号 */
    }

    .dir-toolbar {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        gap: 8px;
        border-bottom: 1px solid var(--overlay-divider);
        background: var(--status-bar-background);
    }
    .dir-up-btn {
        background: none;
        border: 1px solid var(--overlay-border);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        color: var(--overlay-foreground);
        cursor: pointer;
    }
    .dir-up-btn:hover:not(:disabled) {
        background: var(--overlay-hover-background);
    }
    .dir-up-btn:disabled {
        opacity: 0.3;
        cursor: default;
    }
    .dir-path-text {
        font-size: 12px;
        font-weight: 600;
        color: var(--overlay-foreground);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }
    /* 目录不可达的错误提示面板 */
    .dir-error-hint {
        padding: 32px 16px;
        text-align: center;
        font-size: 12px;
        color: var(--warning-strong);
        line-height: 1.6;
        white-space: pre-line; /* 关键：让 \n 生效换行 */
        word-break: break-all; /* 防止超长路径撑破侧边栏 */
        opacity: 0.9;
    }

    /* 悬浮置顶工具栏 */
    .recent-toolbar {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px;
        background: var(--status-bar-background);
        border-bottom: 1px solid var(--overlay-divider);
        z-index: 2;
    }

    /* ★ 完美复刻状态栏的按钮样式 */
    .record-btn {
        background: none;
        border: none;
        padding: 0;
        font-size: 12px;
        color: var(--status-bar-foreground);
        cursor: pointer;
        font-family: "Segoe UI", system-ui, sans-serif;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: color 0.15s;
        line-height: 1; /* ★ 新增：抹平文字默认的上下行距，强制居中 */
    }

    .record-btn:hover {
        color: var(--accent);
    }

    .clear-btn {
        background: none;
        border: none;
        font-size: 12px;
        color: var(--status-bar-foreground);
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
        transition: all 0.15s;
    }

    .clear-btn:hover {
        background: var(--overlay-hover-background);
        color: var(--accent);
    }

    .clear-btn {
        background: none;
        border: none;
        font-size: 12px;
        color: var(--accent);
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
    }

    .clear-btn:hover {
        background: var(--overlay-hover-background);
    }

    /* 单条记录悬停与删除按钮 */
    .recent-item {
        position: relative;
        display: flex;
        flex-direction: row; /* 改为横向排列 */
        align-items: center;
        padding: 6px 28px 6px 8px; /* 右侧留出删除按钮的空间 */
    }

    .delete-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: var(--status-bar-foreground-muted);
        font-size: 16px;
        cursor: pointer;
        opacity: 0;
        transition:
            opacity 0.15s,
            color 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 4px;
    }

    .recent-item:hover .delete-btn {
        opacity: 1;
    }

    .delete-btn:hover {
        color: var(--danger); /* 假设你有这个颜色，如果没有可以用 red */
        background: var(--overlay-hover-background);
    }

    /* ==========================================
       侧边栏滚动条（参数 100% 对齐 Monaco 编辑器）
       ========================================== */
    .sidebar-body::-webkit-scrollbar {
        width: 10px; /* 对应 Monaco 的 10px 宽度 */
        height: 10px;
    }

    .sidebar-body::-webkit-scrollbar-track {
        background: transparent; /* 轨道透明 */
    }

    .sidebar-body::-webkit-scrollbar-thumb {
        /* 使用带透明度的前景色，完美适配所有主题 */
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 25%,
            transparent
        );
        border-radius: 5px; /* 对应 Monaco 的 5px 圆角 */
        min-height: 40px; /* 对应 Monaco 的 40px 最小高度 */
        transition: background 0.2s ease-in-out; /* 对应 Monaco 的平滑过渡 */

        /* 关键技巧：加一圈透明边框，让原生滑块显得更细，留出呼吸感 */
        border: 2px solid transparent;
        background-clip: padding-box;
    }

    .sidebar-body::-webkit-scrollbar-thumb:hover {
        /* 悬停时加深 */
        background: color-mix(
            in srgb,
            var(--status-bar-foreground) 50%,
            transparent
        );
    }

    /* 隐藏原生的上下小箭头 */
    .sidebar-body::-webkit-scrollbar-button {
        display: none;
    }
</style>
