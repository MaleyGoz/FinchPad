/**
 * ============================================================================
 * 🌟 FinchPad 多语言扩展指南 (How to add a new language)
 * ============================================================================
 *
 * 1. 准备语言包：
 *    在 `src/lib/locales/` 目录下新建一个 `.ts` 文件，命名格式建议为标准的语言代码（如 `ja.ts`、`fr.ts`）。
 *    复制 `zh-CN.ts` 的内容，将里面的翻译替换为对应语言。
 *
 * 2. 导入语言包：
 *    在下方 `import` 区域引入新建的语言包：
 *    import { ja } from "./locales/ja";
 *
 * 3. 注册语言包：
 *    找到 `LOCALES` 字典，将新语言加进去：
 *    const LOCALES: Record<string, Record<string, string>> = {
 *      // ... 现有语言
 *      "ja": ja,
 *    };
 *
 * 4. 添加显示名称：
 *    找到 `LANGUAGE_NAMES` 字典，加上该语言的本土名称（加上双引号）：
 *    "ja": "日本語",
 *
 * 5. 后端同步：
 *    确保 Rust 端（app.rs）在保存 `locale_choice` 时，能够正确识别并持久化这个新的语言代码。
 * ============================================================================
 */

import { derived, get, writable } from "svelte/store";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";
import { de } from "./locales/de";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { ko } from "./locales/ko";
import { ptBR } from "./locales/pt-BR";
import { ru } from "./locales/ru";
import { zhTW } from "./locales/zh-TW";

// ==========================================
// 1. 类型定义与语言字典
// ==========================================
/** 用户选择（"auto" 或具体的语言代码） */
export type LocaleChoice = "auto" | string;

/** 实际生效的语言 */
export type Locale = string;

/** 所有可用语言的本地名称（用其母语显示，符合国际惯例） */
export const LANGUAGE_NAMES: Record<string, string> = {
  "en-US": "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "es": "Español",
  "ja": "日本語",
  "fr": "Français",
  "de": "Deutsch",
  "ru": "Русский",
  "pt-BR": "Português (Brasil)",
  "ko": "한국어",
  "it": "Italiano",
  "ar": "العربية",
  "id": "Bahasa Indonesia",
  "tr": "Türkçe",
  "nl": "Nederlands",
  "pl": "Polski",
  "vi": "Tiếng Việt",
  "th": "ไทย",
  "fa": "فارسی",
  "hi": "हिन्दी",
};

/** 语言下拉菜单的显示项 */
export const LOCALE_OPTIONS: { key: LocaleChoice; label: string }[] = [
  ...Object.entries(LANGUAGE_NAMES).map(([key, label]) => ({ key, label })),
];

/**
 * 所有可用语言及词条
 * ★ 待你准备好素材后，在这里导入并加入即可
 */
const LOCALES: Record<string, Record<string, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS, // 注意：语言代码规范一般用 en，但如果你用 en-US 也行，只要保持一致即可
};

// ==========================================
// 2. 核心逻辑
// ==========================================
/** 检测系统语言 */
function detectSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = (navigator.language || "en").replace("_", "-"); // 统一成 zh-CN 格式

  // 1. 精确匹配（如系统是 ja，字典里有 ja）
  if (LOCALES[lang]) return lang;

  // 2. 前缀匹配（如系统是 en-GB，字典里有 en，就取 en）
  const prefix = lang.split("-")[0];
  if (LOCALES[prefix]) return prefix;

  // 3. 特殊处理：如果系统是 zh-TW / zh-HK，且字典里有 zh-TW，就匹配；否则可能退回到 zh-CN 或 en
  if (prefix === "zh") {
    if (LOCALES["zh-TW"] && (lang.includes("TW") || lang.includes("HK")))
      return "zh-TW";
    if (LOCALES["zh-CN"]) return "zh-CN";
  }

  // 4. 都没匹配上，默认回退到英文
  return "en";
}

/** 用户选择 */
export const localeChoice = writable<LocaleChoice>("auto");

/** 实际生效的语言 */
export const resolvedLocale = derived(localeChoice, ($choice): Locale => {
  if ($choice === "auto") return detectSystemLocale();
  return $choice;
});

/** 翻译函数 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  localeOverride?: Locale,
): string {
  const lang = localeOverride ?? get(resolvedLocale);

  // 回退策略：当前语言 -> 英文(en) -> 中文(zh-CN) -> key 本身
  let text =
    LOCALES[lang]?.[key] ??
    LOCALES["en"]?.[key] ??
    LOCALES["zh-CN"]?.[key] ??
    key;

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
}
