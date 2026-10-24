<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/core";
    import { marked } from "marked";

    export let activeText: string = "";
    export let languageId: string = "";
    export let filePath: string = "";
    export let previewWidth: number = 50;
    export let onWidthChange: (newWidth: number) => void = () => {};

    let previewHtml = "";
    let previewDebounce: ReturnType<typeof setTimeout>;
    let isDraggingSplit = false;
    let handleY = 0;
    let isHoveringHandle = false;
    let splitStartX = 0;
    let splitStartWidth = 50;

    function startDrag(e: MouseEvent) {
        isDraggingSplit = true;
        splitStartX = e.clientX;
        splitStartWidth = previewWidth;
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", stopDrag);
        document.body.style.userSelect = "none";
    }

    function onDrag(e: MouseEvent) {
        if (!isDraggingSplit) return;
        const deltaX = splitStartX - e.clientX;
        const containerWidth = window.innerWidth;
        let newWidth = splitStartWidth + (deltaX / containerWidth) * 100;
        newWidth = Math.max(20, Math.min(80, newWidth));
        onWidthChange(newWidth); // 回调给父组件同步宽度
    }

    function stopDrag() {
        isDraggingSplit = false;
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", stopDrag);
        document.body.style.userSelect = "";
    }

    function resolveFilePath(src: string, currentFilePath: string): string {
        const normalizedSrc = src.replace(/\\/g, "/");
        const normalizedDir = currentFilePath.replace(/\\/g, "/");
        if (/^(https?|data|asset|blob|mailto):/i.test(normalizedSrc))
            return normalizedSrc;

        const isWinAbsolute = /^[a-zA-Z]:\//.test(normalizedSrc);
        const isUnixAbsolute = normalizedSrc.startsWith("/");
        let finalPath = normalizedSrc;

        if (!isWinAbsolute && !isUnixAbsolute) {
            const lastSlashIdx = normalizedDir.lastIndexOf("/");
            const baseDir =
                lastSlashIdx >= 0
                    ? normalizedDir.substring(0, lastSlashIdx)
                    : "";
            let combined = `${baseDir}/${normalizedSrc}`;
            const parts = combined.split("/");
            const stack: string[] = [];
            for (const part of parts) {
                if (!part || part === ".") continue;
                if (part === "..") {
                    if (stack.length > 0 && stack[stack.length - 1] !== "..")
                        stack.pop();
                    else stack.push("..");
                } else {
                    stack.push(part);
                }
            }
            finalPath = stack.join("/");
        }
        if (/^[a-zA-Z]:\//.test(finalPath))
            finalPath = finalPath.replace(/\//g, "\\");
        return finalPath;
    }

    function renderPreview(text: string) {
        clearTimeout(previewDebounce);
        previewDebounce = setTimeout(() => {
            if (languageId === "markdown") {
                let html = marked.parse(text) as string;
                if (filePath) {
                    html = html.replace(/<img\s+[^>]*>/gi, (match) => {
                        const srcMatch = match.match(
                            /src\s*=\s*["']([^"']+)["']/i,
                        );
                        if (!srcMatch) return match;
                        const originalSrc = srcMatch[1];
                        const absolutePath = resolveFilePath(
                            originalSrc,
                            filePath,
                        );
                        if (
                            /^(https?|data|asset|blob|mailto):/i.test(
                                absolutePath,
                            )
                        )
                            return match;
                        try {
                            const assetUrl = convertFileSrc(absolutePath);
                            return match.replace(
                                srcMatch[0],
                                `src="${assetUrl}"`,
                            );
                        } catch (e) {
                            return match;
                        }
                    });
                }
                previewHtml = html;
            } else if (languageId === "html") {
                previewHtml = text;
            }
        }, 300);
    }

    $: if (activeText !== undefined) {
        renderPreview(activeText);
    }
</script>

<!-- 拖拽手柄 -->
<div
    class="resize-handle"
    onmousedown={startDrag}
    onmousemove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleY = e.clientY - rect.top;
    }}
    onmouseenter={() => (isHoveringHandle = true)}
    onmouseleave={() => (isHoveringHandle = false)}
    role="separator"
>
    <div class="handle-line"></div>
    {#if isHoveringHandle || isDraggingSplit}
        <div class="handle-icon" style="top: {handleY}px;">
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="7 8 3 12 7 16"></polyline>
                <polyline points="17 8 21 12 17 16"></polyline>
            </svg>
        </div>
    {/if}
</div>

<!-- 预览区 -->
<div class="preview-pane" style="width: {previewWidth}%; background: #ffffff;">
    {#if languageId === "markdown"}
        <div class="markdown-body">
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            {@html previewHtml}
        </div>
    {:else if languageId === "html"}
        <div class="iframe-wrapper">
            <iframe title="HTML Preview" srcdoc={previewHtml}></iframe>
            {#if isDraggingSplit}
                <div class="iframe-overlay"></div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* 将你原本关于预览和拖拽的 CSS 全部复制到这里 */
    .preview-pane {
        height: 100%;
        overflow: auto;
        min-width: 0;
        background: #ffffff !important;
        padding: 20px;
        position: relative;
        z-index: 2;
    }
    .resize-handle {
        width: 4px;
        background: var(--overlay-divider);
        cursor: none;
        position: relative;
        z-index: 10;
        flex-shrink: 0;
    }
    .resize-handle::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -1px;
        right: -10px;
        cursor: none;
    }
    .resize-handle:hover,
    .resize-handle:active {
        background: color-mix(
            in srgb,
            var(--overlay-foreground) 50%,
            transparent
        );
        box-shadow: none;
    }
    .handle-icon {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        width: 24px;
        height: 18px;
        background: var(--overlay-background);
        border: 1px solid var(--overlay-border);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--overlay-foreground-muted);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        pointer-events: none;
        transition:
            color 0.15s,
            border-color 0.15s;
    }
    .resize-handle:hover .handle-icon,
    .resize-handle:active .handle-icon {
        color: var(--accent);
        border-color: var(--accent);
    }
    .iframe-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .iframe-wrapper iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
    }
    .iframe-overlay {
        position: absolute;
        inset: 0;
        z-index: 100;
        cursor: col-resize;
        background: transparent;
    }
    .preview-pane iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .markdown-body {
        max-width: 800px;
        margin: 0 auto;
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
        color: #333333;
        line-height: 1.6;
        font-size: 14px;
    }
    .markdown-body :global(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        color: #24292e;
    }
    .markdown-body :global(th),
    .markdown-body :global(td) {
        padding: 6px 13px;
        border: 1px solid #dfe2e5;
        text-align: center;
    }
    .markdown-body :global(th) {
        font-weight: 600;
        background-color: #f6f8fa;
    }
    .markdown-body :global(tr:nth-child(2n)) {
        background-color: #f6f8fa;
    }
    .markdown-body :global(h1),
    .markdown-body :global(h2) {
        border-bottom: 1px solid #eaecef;
        padding-bottom: 0.3em;
        color: #111111;
    }
    .markdown-body :global(h3),
    .markdown-body :global(h4) {
        color: #111111;
    }
    .markdown-body :global(code) {
        background: #f6f8fa;
        color: #24292e;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: monospace;
    }
    .markdown-body :global(pre) {
        background: #f6f8fa;
        color: #24292e;
        padding: 16px;
        overflow: auto;
        border-radius: 6px;
    }
    .markdown-body :global(pre code) {
        background: transparent;
        padding: 0;
    }
    .markdown-body :global(blockquote) {
        border-left: 4px solid #dfe2e5;
        margin: 0;
        padding-left: 16px;
        color: #6a737d;
    }
</style>
