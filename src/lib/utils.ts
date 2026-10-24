// src/lib/utils.ts
import { fetch } from "@tauri-apps/plugin-http";
import { openUrl } from "@tauri-apps/plugin-opener";

// 1. 比较版本号
export function isNewerVersion(current: string, latest: string): boolean {
    const cleanCurrent = current.replace(/^v/, "").split(".").map(Number);
    const cleanLatest = latest.replace(/^v/, "").split(".").map(Number);
    for (let i = 0; i < Math.max(cleanCurrent.length, cleanLatest.length); i++) {
        const c = cleanCurrent[i] || 0;
        const l = cleanLatest[i] || 0;
        if (l > c) return true;
        if (l < c) return false;
    }
    return false;
}

// 2. 修正菜单位置
export function clampMenuPos(
    x: number,
    y: number,
    menuWidth: number,
    menuHeight: number,
): { left: number | null; right: number | null; top: number } {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const margin = 8;
    let left: number | null = x;
    let right: number | null = null;

    if (x + menuWidth + margin > winW) {
        left = null;
        right = winW - x;
        if (right + menuWidth + margin > winW) {
            left = margin;
            right = null;
        }
    }
    let top = y;
    if (y + menuHeight + margin > winH) {
        top = Math.max(margin, winH - menuHeight - margin);
    }
    return { left, right, top };
}

// 3. 检查更新（纯网络请求）
export async function checkForUpdatesApi(currentVersion: string) {
    try {
        const res = await fetch("https://api.github.com/repos/MaleyGoz/FinchPad/releases/latest");
        if (!res.ok) {
            if (res.status === 403) throw new Error("RATE_LIMIT");
            throw new Error(`HTTP_ERROR_${res.status}`);
        }
        const data = await res.json();
        const latestVersion = data.tag_name;
        if (isNewerVersion(currentVersion, latestVersion)) {
            return { status: "found", latestVersion: latestVersion.replace(/^v/, "") };
        } else {
            return { status: "latest" };
        }
    } catch (err: any) {
        return { status: "error", error: err.message };
    }
}

// 4. 打开下载页
export async function openReleasePage() {
    await openUrl("https://github.com/MaleyGoz/FinchPad/releases/latest");
}