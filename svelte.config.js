// svelte.config.js
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            fallback: "index.html",
        }),
        // ★ 已移除 paths 配置。因为 vite-plugin-monaco-editor 会接管 Worker 路径，
        // 不需要在 SvelteKit 层面硬改 base 路径，保持默认即可。
    },
};

export default config;