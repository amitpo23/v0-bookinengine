"use client"

/**
 * Custom hook for using translations in client components
 * Wrapper around next-intl with fallback support
 */

import { useTranslations as useNextIntlTranslations } from "next-intl"
import { useLanguage } from "./language-context"

export function useTranslations(namespace?: string) {
  const { locale } = useLanguage()

  // If no namespace provided, use the entire translation object
  const t = useNextIntlTranslations(namespace)

  return t
}

// Helper to get translations synchronously (for server components)
export async function getTranslations(locale: string, namespace?: string) {
  const messages = await import(`../../locales/${locale}.json`)

  if (!namespace) {
    return messages.default
  }

  // Navigate to nested namespace (e.g., "common.search")
  const parts = namespace.split(".")
  let result = messages.default

  for (const part of parts) {
    result = result[part]
    if (!result) break
  }

  return result || messages.default
}
