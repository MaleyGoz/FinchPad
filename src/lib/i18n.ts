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
};

/** 语言下拉菜单的显示项 */
export const LOCALE_OPTIONS: { key: LocaleChoice; label: string }[] = [
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
export const resolvedLocale = derived(localeChoice, ($choice): Locale => {
  if ($choice === "auto") return detectSystemLocale();
  return $choice;
});

/** 翻译函数。用法：t('menu.view') 或 t('status.line_and_chars', { lines: '5', chars: '20' }) */
export function t(
  key: string,
  params?: Record<string, string | number>,
  localeOverride?: Locale,
): string {
  const lang = localeOverride ?? get(resolvedLocale);
  let text = LOCALES[lang]?.[key] ?? LOCALES["zh-CN"][key] ?? key;
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
