"use client"

/**
 * Language Context Provider
 * Manages current language state across the application
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, getDirection } from "./config"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  direction: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const direction = getDirection(locale)

  // Load saved language from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && ["en", "he", "ar", "ru"].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // Update document direction when locale changes
  useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = locale
  }, [locale, direction])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, direction }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
