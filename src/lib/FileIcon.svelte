<script lang="ts">
    export let name: string;
    export let isDir: boolean;

    // 获取文件扩展名
    $: ext = name.split(".").pop()?.toLowerCase() || "";

    // 获取当前平台（Tauri 环境变量）
    const isMac =
        typeof window !== "undefined" &&
        (window as any).__TAURI_INTERNALS__?.metadata?.currentPlatform ===
            "macos";

    // 根据后缀名判断类型
    $: type = (() => {
        if (isDir) return "folder";

        // 统一转为小写以便安全匹配
        const lowerExt = ext ? ext.toLowerCase() : "";

        // 文本与配置类
        if (
            [
                "txt",
                "md",
                "markdown",
                "log",
                "json",
                "xml",
                "csv",
                "tsv",
                "yaml",
                "yml",
                "toml",
                "ini",
                "conf",
                "config",
                "rtf",
                "patch",
                "diff",
                "gitignore",
            ].includes(lowerExt)
        )
            return "text";

        // 代码类
        if (
            [
                // JS / TS 生态
                "js",
                "mjs",
                "cjs",
                "ts",
                "tsx",
                "jsx",
                "vue",
                "svelte",
                "astro",
                "html",
                "htm",
                "css",
                "scss",
                "sass",
                "less",
                "styl",
                "graphql",
                "gql",
                // 常见编程语言
                "py",
                "rs",
                "go",
                "java",
                "c",
                "h",
                "cpp",
                "hpp",
                "cc",
                "cxx",
                "cs",
                "php",
                "rb",
                "swift",
                "kt",
                "kts",
                "lua",
                "sql",
                "r",
                "tex",
                // 脚本与终端
                "sh",
                "zsh",
                "fish",
                "bat",
                "cmd",
                "ps1",
            ].includes(lowerExt)
        )
            return "code";

        // 图片类
        if (
            [
                "png",
                "jpg",
                "jpeg",
                "gif",
                "svg",
                "webp",
                "ico",
                "bmp",
                "avif",
                "heic",
                "tiff",
                "tif",
            ].includes(lowerExt)
        )
            return "picture";

        // 多媒体类
        if (
            [
                // 视频
                "mp4",
                "mkv",
                "avi",
                "mov",
                "webm",
                "wmv",
                "flv",
                "m4v",
                // 音频
                "mp3",
                "wav",
                "flac",
                "ogg",
                "m4a",
                "aac",
                "wma",
                "opus",
            ].includes(lowerExt)
        )
            return "media";

        return "unknown";
    })();
</script>

<!-- 统一控制图标大小 -->
<div class="icon-wrapper">
    {#if type === "folder"}
        {#if isMac}
            <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="48px"
                height="48px"
                viewBox="0 0 48 48"
                enable-background="new 0 0 48 48"
                xml:space="preserve"
            >
                <image
                    id="image0"
                    width="48"
                    height="48"
                    x="0"
                    y="0"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAIGNIUk0AAHomAACAhAAA+gAAAIDo
AAB1MAAA6mAAADqYAAAXcJy6UTwAAALWUExURf///wAAAAEAAAQAAAgHBgsLCwoKCgUEBCA1Pl2o
yWa842W54WS432e95Wi94z1pfRAdJkB1jDBmez1whStngTWj1SmFsCqIsiqJtCqKtSmPvTWDpxkm
LCdhe0e67g4XHRVXdhldewRNcAZZgRxYdSFjgjptgz95kT5xh0N9lDxvhUF7kzpuhUB6kzpuhD96
kjlthD55kjhthD14kTdshDt4kTdrgzt3kTZqgzp2kDRqgjl1kDNpgTh1jzd0jzJogTZ0jjFngDVy
jjBngDRyjS9mfzNxjS5lfjJxiy1lfjFwiy1kfjFviyxkfS9viipjfC5uiipjfStlfy5viyllgCxt
ihMyQBY6SiBSaSNYcgAAAAAAAAYRFREsOREsOBArNxItOQcSFwAAAG/Z+2/p/17M/1/M/l/N/l7L
/mPV/3v4/2bl/0+05FK451G35VG97mjd/13W/zqs4Saj3iql3imi2yqp5D7G/0DI/1O145TR7ZDP
7I3O7I3N64rM7ZHb/Zfm/5bm/5bl/5jm/53o/23l/0vI/+v1+v///+/0+FfY/2HR/9z2/7Xn/a7k
+7Dl+6/k+7Pm/N/4/2nU/3jo/2jP+lnH9lzI9mbO+Xro/4r2/23M9nDN9mzM9Yr1/4Ty/2/M9YPw
/4Hw/23L9IDu/37v/2vK9H7t/33t/2rJ833s/3zs/2nI8nvr/3nr/2fH8Xnp/3bq/2TG8XXo/3Xn
/2PE8HXm/3Tm/2LD73Pl/3Hl/2DC7nHj/2/k/17B7W7i/27j/13A7W3h/23i/1y/7Gzg/2rf/1q9
62re/2jf/1i96Wfe/2bd/1a76WXb/2Tc/1W66GTa/2La/1O552HZ/2DY/1/Y/1G35l/X/1zX/062
5VzV/1rW/0y15VnU/1rU/0yz5FnS/1nZ/0iw4Umy41nY/1bX/1DG/Em050m26Ui050/E+ljc/0q6
7k/D+k3A9Uy/9Eu88PTXO9oAAABjdFJOUwAAAAALDw0GRtjz7uzz84oznYqYoe/Q09TW3L0zof4s
oY6hq6GtoayhrKGsoayhrKGsoayhrKGsoayhrKGsrKGsoayhrKGsoayhrKGsoayhrKGhrZumaXOo
sQMCTXl2dHlQBPub87QAAAABYktHRACIBR1IAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH
6goaBjQCX7bTdwAAAa1JREFUSMdjYBgFRAFGRiYWVjYIYGVnxA/AGjg4ubh5IICXj5+wBoHklNS0
dAjIyMwSJKhBKDsnFw7y8guEmQloECksKi6Bg9KyclExcQksQFJKWgasQbaisqq6Bg5q6+obGpuw
gOaWVjl5kAaFtvYO4kBnlyJIg1J3T29fP2EwYeKkycogDSpTpk6bTgyYNmOmKkiD2qzZc4gDc+ep
gzRozF9ALFioCdKgtWgxsWCJNkiDztJlxILluiANeitWEgtW6YM0GKxeQyxYawjSYLRuPbFggzFI
g8nGTcSCzaYgDWZbthILtpmDNFhs30Es2GkJ0mC1azexYI81SIPN3n3Egv22YA0HDhILDtmBNNgf
PkIsOOoA0uB47Dix4IQTSIPzyVPEgtMuIA2uZ84SC865gTS4n79ALLjoAdLgeekyseCKF0iD95Vc
YsFVH5AG32vXiQU3/EAa/G/eIhbcDgBpCLxzl1hwD6wh6P4DYsHDYJCGkEePnxAHHj8NBWkIe/b8
xUtiwKvXb8LBNVDE23fvPxAG7999jIwCa4iOiY2LJwziEhKTGAe6Qh4YAAA3qvk9BYlnKgAAACV0
RVh0ZGF0ZTpjcmVhdGUAMjAyNi0xMC0yNlQwNjo1MjowMiswMDowMN5/TJwAAAAldEVYdGRhdGU6
bW9kaWZ5ADIwMjYtMTAtMjZUMDY6NTI6MDIrMDA6MDCvIvQgAAAAKHRFWHRkYXRlOnRpbWVzdGFt
cAAyMDI2LTEwLTI2VDA2OjUyOjAyKzAwOjAw+DfV/wAAAEp0RVh0c2lnbmF0dXJlADlhZGFiODdj
ZmIyMDkzNmQ3YmIyMmFiZTlkNzE0NTAyNWIxMDgxNTk3YWEzZTFlNzM1YmVjMTAyMGY1OTExYTEa
D/75AAAAAElFTkSuQmCC"
                />
            </svg>
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
            >
                <defs>
                    <!-- 后方底板渐变（深黄色） -->
                    <linearGradient
                        id="win-back-grad"
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#FFC927" />
                        <stop offset="100%" stop-color="#EAA100" />
                    </linearGradient>

                    <!-- 前方盖板渐变（亮黄色） -->
                    <linearGradient
                        id="win-front-grad"
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#FFE885" />
                        <stop offset="100%" stop-color="#F9BA1F" />
                    </linearGradient>

                    <!-- 前盖顶部边缘亮边高光 -->
                    <linearGradient
                        id="win-top-highlight"
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stop-color="#FFFFFF"
                            stop-opacity="0.6"
                        />
                        <stop
                            offset="100%"
                            stop-color="#FFFFFF"
                            stop-opacity="0"
                        />
                    </linearGradient>

                    <!-- 底部柔和投影 -->
                    <filter
                        id="win-shadow"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="130%"
                    >
                        <feDropShadow
                            dx="0"
                            dy="1.5"
                            stdDeviation="1.2"
                            flood-color="#8F5D00"
                            flood-opacity="0.3"
                        />
                    </filter>
                </defs>

                <g filter="url(#win-shadow)">
                    <!-- 第一层：后方底板与 Win11 独特的立体切角标签页 -->
                    <path
                        d="M 6,10 
             C 6,8.34 7.34,7 9,7 
             L 19,7 
             C 20.2,7 21.2,7.7 22,8.8 
             L 24,11.2 
             C 24.8,12.3 25.8,13 27,13 
             L 39,13 
             C 40.66,13 42,14.34 42,16 
             L 42,39 
             C 42,40.66 40.66,42 39,42 
             L 9,42 
             C 7.34,42 6,40.66 6,39 Z"
                        fill="url(#win-back-grad)"
                    />

                    <!-- 第二层：前方主盖板（圆角矩形） -->
                    <rect
                        x="6"
                        y="15"
                        width="36"
                        height="26"
                        rx="3.5"
                        ry="3.5"
                        fill="url(#win-front-grad)"
                    />

                    <!-- 第三层：前盖顶部的高光线条 -->
                    <path
                        d="M 9.5,15 L 38.5,15 C 40.4,15 42,16.6 42,18.5 L 42,19 C 42,17.1 40.4,15.5 38.5,15.5 L 9.5,15.5 C 7.6,15.5 6,17.1 6,19 L 6,18.5 C 6,16.6 7.6,15 9.5,15 Z"
                        fill="url(#win-top-highlight)"
                    />
                </g>
            </svg>
        {/if}
    {:else if type === "text"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
        >
            <defs>
                <linearGradient id="txt-bg" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" />
                    <stop offset="100%" stop-color="#E5E9EE" />
                </linearGradient>
                <linearGradient
                    id="txt-fold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#D0D5DD" />
                    <stop offset="100%" stop-color="#B0B7C3" />
                </linearGradient>
                <filter
                    id="txt-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                >
                    <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1.2"
                        flood-color="#101828"
                        flood-opacity="0.15"
                    />
                </filter>
            </defs>
            <g filter="url(#txt-shadow)">
                <!-- 纸张主体（带右上角折线） -->
                <path
                    d="M 8,6 C 8,4.34 9.34,3 11,3 L 27,3 L 40,16 L 40,41 C 40,42.66 38.66,44 37,44 L 11,44 C 9.34,44 8,42.66 8,41 Z"
                    fill="url(#txt-bg)"
                />
                <!-- 右上角折角 -->
                <path
                    d="M 27,3 L 40,16 L 30,16 C 28.34,16 27,14.66 27,13 Z"
                    fill="url(#txt-fold)"
                />
                <!-- 文本线条细节 -->
                <rect
                    x="15"
                    y="18"
                    width="18"
                    height="2.5"
                    rx="1.2"
                    fill="#98A2B3"
                />
                <rect
                    x="15"
                    y="24"
                    width="18"
                    height="2.5"
                    rx="1.2"
                    fill="#98A2B3"
                />
                <rect
                    x="15"
                    y="30"
                    width="13"
                    height="2.5"
                    rx="1.2"
                    fill="#98A2B3"
                />
            </g>
        </svg>
    {:else if type === "code"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
        >
            <defs>
                <linearGradient
                    id="code-bg"
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#38BDF8" />
                    <stop offset="100%" stop-color="#0284C7" />
                </linearGradient>
                <linearGradient
                    id="code-fold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#BAE6FD" />
                    <stop offset="100%" stop-color="#7DD3FC" />
                </linearGradient>
                <filter
                    id="code-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                >
                    <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1.2"
                        flood-color="#0369A1"
                        flood-opacity="0.25"
                    />
                </filter>
            </defs>
            <g filter="url(#code-shadow)">
                <!-- 纸张主体 -->
                <path
                    d="M 8,6 C 8,4.34 9.34,3 11,3 L 27,3 L 40,16 L 40,41 C 40,42.66 38.66,44 37,44 L 11,44 C 9.34,44 8,42.66 8,41 Z"
                    fill="url(#code-bg)"
                />
                <!-- 右上角折角 -->
                <path
                    d="M 27,3 L 40,16 L 30,16 C 28.34,16 27,14.66 27,13 Z"
                    fill="url(#code-fold)"
                />
                <!-- 代码符号 </ > -->
                <path
                    d="M 18,22 L 13,26 L 18,30 M 30,22 L 35,26 L 30,30 M 26,20 L 22,32"
                    stroke="#FFFFFF"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                />
            </g>
        </svg>
    {:else if type === "picture"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
        >
            <defs>
                <linearGradient id="img-bg" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#34D399" />
                    <stop offset="100%" stop-color="#059669" />
                </linearGradient>
                <linearGradient
                    id="img-fold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#A7F3D0" />
                    <stop offset="100%" stop-color="#6EE7B7" />
                </linearGradient>
                <filter
                    id="img-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                >
                    <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1.2"
                        flood-color="#047857"
                        flood-opacity="0.25"
                    />
                </filter>
            </defs>
            <g filter="url(#img-shadow)">
                <!-- 纸张主体 -->
                <path
                    d="M 8,6 C 8,4.34 9.34,3 11,3 L 27,3 L 40,16 L 40,41 C 40,42.66 38.66,44 37,44 L 11,44 C 9.34,44 8,42.66 8,41 Z"
                    fill="url(#img-bg)"
                />
                <!-- 右上角折角 -->
                <path
                    d="M 27,3 L 40,16 L 30,16 C 28.34,16 27,14.66 27,13 Z"
                    fill="url(#img-fold)"
                />
                <!-- 太阳 -->
                <circle cx="17" cy="22" r="2.5" fill="#FFFFFF" />
                <!-- 山峰弧度与图案 -->
                <path
                    d="M 14,34 L 20,26 L 25,31 L 28,27 L 34,34 Z"
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                />
            </g>
        </svg>
    {:else if type === "media"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
        >
            <defs>
                <linearGradient
                    id="media-bg"
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#F43F5E" />
                    <stop offset="100%" stop-color="#BE123C" />
                </linearGradient>
                <linearGradient
                    id="media-fold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#FECDD3" />
                    <stop offset="100%" stop-color="#FDA4AF" />
                </linearGradient>
                <filter
                    id="media-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                >
                    <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1.2"
                        flood-color="#881337"
                        flood-opacity="0.25"
                    />
                </filter>
            </defs>
            <g filter="url(#media-shadow)">
                <!-- 纸张主体 -->
                <path
                    d="M 8,6 C 8,4.34 9.34,3 11,3 L 27,3 L 40,16 L 40,41 C 40,42.66 38.66,44 37,44 L 11,44 C 9.34,44 8,42.66 8,41 Z"
                    fill="url(#media-bg)"
                />
                <!-- 右上角折角 -->
                <path
                    d="M 27,3 L 40,16 L 30,16 C 28.34,16 27,14.66 27,13 Z"
                    fill="url(#media-fold)"
                />
                <!-- 播放按钮外圈 -->
                <circle
                    cx="24"
                    cy="28"
                    r="7.5"
                    fill="#FFFFFF"
                    fill-opacity="0.2"
                />
                <!-- 播放三角箭号 -->
                <path d="M 22,23.5 L 28,28 L 22,32.5 Z" fill="#FFFFFF" />
            </g>
        </svg>
    {:else}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
        >
            <defs>
                <linearGradient id="unk-bg" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#94A3B8" />
                    <stop offset="100%" stop-color="#475569" />
                </linearGradient>
                <linearGradient
                    id="unk-fold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#E2E8F0" />
                    <stop offset="100%" stop-color="#CBD5E1" />
                </linearGradient>
                <filter
                    id="unk-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                >
                    <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1.2"
                        flood-color="#1E293B"
                        flood-opacity="0.25"
                    />
                </filter>
            </defs>
            <g filter="url(#unk-shadow)">
                <!-- 纸张主体 -->
                <path
                    d="M 8,6 C 8,4.34 9.34,3 11,3 L 27,3 L 40,16 L 40,41 C 40,42.66 38.66,44 37,44 L 11,44 C 9.34,44 8,42.66 8,41 Z"
                    fill="url(#unk-bg)"
                />
                <!-- 右上角折角 -->
                <path
                    d="M 27,3 L 40,16 L 30,16 C 28.34,16 27,14.66 27,13 Z"
                    fill="url(#unk-fold)"
                />
                <!-- 问号图案 -->
                <path
                    d="M 20.5,23 C 20.5,20.8 22,19.5 24,19.5 C 26,19.5 27.5,20.8 27.5,22.3 C 27.5,23.8 26.2,24.8 24.8,25.8 C 24.2,26.2 24,26.8 24,27.5 L 24,28.5"
                    stroke="#FFFFFF"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    fill="none"
                />
                <circle cx="24" cy="32.5" r="1.3" fill="#FFFFFF" />
            </g>
        </svg>
    {/if}
</div>

<style>
    .icon-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        flex-shrink: 0;
    }

    /* 确保 svg 能自适应容器大小 */
    :global(.icon-wrapper svg) {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
