"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { translations, type Locale, type TranslationKey } from "./translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  dir: "rtl" | "ltr"
  dateLocale: string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  defaultLocale = "he",
}: {
  children: ReactNode
  defaultLocale?: Locale
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let text = translations[locale][key] || translations.he[key] || key

      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(`{${paramKey}}`, String(value))
        })
      }

      return text
    },
    [locale],
  )

  const dir = locale === "he" ? "rtl" : "ltr"
  const dateLocale = locale === "he" ? "he-IL" : "en-US"

  return <I18nContext.Provider value={{ locale, setLocale, t, dir, dateLocale }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
