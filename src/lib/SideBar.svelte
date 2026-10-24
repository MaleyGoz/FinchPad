<script lang="ts">
    import { onMount } from "svelte";
    import { api, type FileEntry } from "$lib/api";
    import { tooltip } from "$lib/tooltip";
    import { t, resolvedLocale } from "$lib/i18n";
    export let onClose: () => void = () => {};

    export let mode: "recent" | "directory" | null = null;
    export let activeFilePath: string = "";
    export let onOpenFile: (path: string) => void = () => {};

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
                <div class="sidebar-list">
                    {#if recentFiles.length === 0}
                        <div class="empty-hint">
                            {t(
                                "sidebar.empty_recent",
                                undefined,
                                $resolvedLocale,
                            )}
                        </div>
                    {:else}
                        {#each recentFiles as file}
                            <button
                                class="sidebar-item"
                                onclick={() => onOpenFile(file)}
                                use:tooltip={file}
                            >
                                <span class="item-name"
                                    >{file.split(/[\\/]/).pop()}</span
                                >
                                <span class="item-path">{file}</span>
                            </button>
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
                                    {file.is_dir ? "📁" : "📄"}
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
        z-index: 10;
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
    }
    /* 列表项路径 */
    .item-path {
        font-size: 10px;
        color: var(--status-bar-foreground-muted); /* ★ 改：使用状态栏弱化色 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        margin-top: 2px;
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
</style>
