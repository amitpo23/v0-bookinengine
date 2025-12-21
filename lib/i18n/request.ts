/**
 * i18n Request Configuration for Next.js App Router
 * Loads translations for server and client components
 */

import { getRequestConfig } from "next-intl/server"
import { locales, type Locale } from "./config"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return {
      locale: "he",
      messages: (await import(`../../locales/he.json`)).default,
    }
  }

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  }
})
