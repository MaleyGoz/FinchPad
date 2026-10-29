import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import monacoEditorPlugin from '@dvaji/vite-plugin-monaco-editor';
// @ts-ignore
import path from "path"; // ★ 加上 // @ts-ignore 屏蔽红线
// @ts-expect-error type error without @types/node package
import process from "node:process";
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
    plugins: [
        sveltekit(),
        // ★ 核心：必须传入一个配置对象。即使为空对象 {}，也能消除 TS 报错
        monacoEditorPlugin({
            // ★ 核心尝试：加上前后的斜杠，强制使用绝对路径
            publicPath: './monacoeditorwork',
            customDistPath: (root, buildOutDir) => {
                return path.resolve(buildOutDir, 'monacoeditorwork');
            }
        })

    ],

    optimizeDeps: { include: ["monaco-editor"] },

    // 让插件接管 Worker 打包，删掉自定义分包逻辑
    build: {
        rollupOptions: {
            output: {
                // 如果无特殊需求，可以让这个函数为空，或者直接删除整个 build.rollupOptions 块
                manualChunks: (id) => { }
            },
        },
    },

    resolve: {
        // 删掉之前所有关于 monaco worker 的 alias 配置，避免和插件冲突
        alias: {},
    },

    clearScreen: false,
    server: {
        port: 5173,
        strictPort: true,
        host: host || "127.0.0.1",
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 5173,
            }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
}));