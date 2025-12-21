/**
 * Internationalization (i18n) Configuration
 * Supports: English, Hebrew, Arabic, Russian
 */

export const locales = ["en", "he", "ar", "ru"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "he" // Default to Hebrew

export const localeNames: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ar: "العربية",
  ru: "Русский",
}

export const rtlLocales: Locale[] = ["he", "ar"]

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr"
}

// Language metadata for AI prompts
export const languageMetadata: Record<Locale, { name: string; nativeName: string; code: string }> = {
  en: { name: "English", nativeName: "English", code: "en-US" },
  he: { name: "Hebrew", nativeName: "עברית", code: "he-IL" },
  ar: { name: "Arabic", nativeName: "العربية", code: "ar-SA" },
  ru: { name: "Russian", nativeName: "Русский", code: "ru-RU" },
}
