<<<<<<< HEAD
/**
 * ============================================================================
 * 🌟 FinchPad 多语言核心引擎 (最终版)
 * 以后只需 2 步：
 * 1. 在 `./locales/` 目录下新建 `<语言代码>.ts`（如 `ja.ts`）。
 *    复制 `zh-CN.ts` 的内容进行翻译，随便怎么导出（`export const xx` 或 `export default`）。
 * 
 * 2. 在此文件的 `LANGUAGE_NAMES` 字典中加上该语言的母语显示名。
 *    例： "ja": "日本語",
 * 
 * 完成！底层引擎会自动扫描并加载，无需修改逻辑代码，重启即生效。
============================================================================
 */

import { derived, get, writable } from "svelte/store";

// ==========================================
// 1. 自动扫描并加载所有语言文件
// ==========================================
const modules = import.meta.glob("./locales/*.ts", { eager: true });
const LOCALES: Record<string, Record<string, string>> = {};

for (const path in modules) {
  const langCode = path.replace("./locales/", "").replace(".ts", "");
  const module = modules[path] as Record<string, any>;
  const dictionary = module.default || Object.values(module)[0];
  
  if (dictionary && typeof dictionary === "object") {
    LOCALES[langCode] = dictionary as Record<string, string>;
  }
}

// ==========================================
// 2. 语言显示名称 (已精确对齐你的 20 个文件)
// ==========================================
export type LocaleChoice = "auto" | string;
export type Locale = string;

export const LANGUAGE_NAMES: Record<string, string> = {
"en-US": "English",
"zh-CN": "简体中文",
"zh-TW": "繁體中文",
"hi": "हिन्दी",
"es": "Español",
"fr": "Français",
"ar": "العربية",
"ru": "Русский",
"pt-BR": "Português",
"de": "Deutsch",
"ja": "日本語",
"tr": "Türkçe",
"vi": "Tiếng Việt",
"ko": "한국어",
"it": "Italiano",
"th": "ไทย",
"id": "Bahasa Indonesia",
"pl": "Polski",
"nl": "Nederlands",
"fa": "فارسی",
=======
import { derived, get, writable } from "svelte/store";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";

/** 用户选择（持久化到 session） */
export type LocaleChoice = "auto" | "zh-CN" | "en-US";

/** 实际生效的语言（不做 'auto'） */
export type Locale = "zh-CN" | "en-US";

/** 所有可用语言及词条 —— 加新语言只需在这里加一行 */
const LOCALES: Record<Locale, Record<string, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS,
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
};

/** 语言下拉菜单的显示项 */
export const LOCALE_OPTIONS: { key: LocaleChoice; label: string }[] = [
<<<<<<< HEAD
  ...Object.entries(LANGUAGE_NAMES).map(([key, label]) => ({ key, label })),
];

// ==========================================
// 3. 核心系统逻辑
// ==========================================

/** 智能检测系统语言 */
function detectSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en-US";
  const systemLang = (navigator.language || "en-US").replace("_", "-");

  // 1. 精确匹配
  if (LOCALES[systemLang]) return systemLang;

  // 2. 前缀匹配 (兼容系统的 en-GB 等)
  const prefix = systemLang.split("-")[0];
  if (prefix === "en") return "en-US"; 
  if (prefix === "pt") return "pt-BR"; 
  if (LOCALES[prefix]) return prefix;  

  // 3. 中文特殊处理
  if (prefix === "zh") {
    if (LOCALES["zh-TW"] && (systemLang.includes("TW") || systemLang.includes("HK"))) return "zh-TW";
    return "zh-CN";
  }

  // 4. 兜底
  return "en-US";
}

/** 用户的语言选择 */
export const localeChoice = writable<LocaleChoice>("auto");

/** 实际生效的语言（响应式） */
=======
  { key: "auto", label: "跟随系统" },
  { key: "zh-CN", label: "简体中文" },
  { key: "en-US", label: "English" },
];

/** 检测系统语言 */
function detectSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en-US";
  const lang = (navigator.language || "en-US").toLowerCase();
  if (lang.startsWith("zh")) return "zh-CN";
  return "en-US";
}

/** 用户选择（'auto' / 'zh-CN' / 'en-US'） */
export const localeChoice = writable<LocaleChoice>("auto");

/** 实际生效的语言 —— 跟随系统时动态解析 */
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
export const resolvedLocale = derived(localeChoice, ($choice): Locale => {
  if ($choice === "auto") return detectSystemLocale();
  return $choice;
});

<<<<<<< HEAD
/** 翻译函数 */
=======
/** 翻译函数。用法：t('menu.view') 或 t('status.line_and_chars', { lines: '5', chars: '20' }) */
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
export function t(
  key: string,
  params?: Record<string, string | number>,
  localeOverride?: Locale,
): string {
  const lang = localeOverride ?? get(resolvedLocale);
<<<<<<< HEAD

  let text =
    LOCALES[lang]?.[key] ??
    LOCALES["en-US"]?.[key] ??
    LOCALES["zh-CN"]?.[key] ??
    key;

=======
  let text = LOCALES[lang]?.[key] ?? LOCALES["zh-CN"][key] ?? key;
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.split(`{${k}}`).join(String(v));
    }
  }
  return text;
}

/** 设置用户选择 */
export function setLocaleChoice(choice: LocaleChoice) {
  localeChoice.set(choice);
  const actual = choice === "auto" ? detectSystemLocale() : choice;
  document.documentElement.lang = actual;
<<<<<<< HEAD
}
=======
}
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
