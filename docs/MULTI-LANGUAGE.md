# Multi-Language Support 🌍

Complete internationalization (i18n) support for **4 languages**: English, Hebrew, Arabic, and Russian.

## Supported Languages

| Language | Code | Direction | Native Name | Status |
|----------|------|-----------|-------------|--------|
| **English** | `en` | LTR | English | ✅ Complete |
| **Hebrew** | `he` | RTL | עברית | ✅ Complete |
| **Arabic** | `ar` | RTL | العربية | ✅ Complete |
| **Russian** | `ru` | LTR | Русский | ✅ Complete |

## Features

- ✅ **Full RTL/LTR Support** - Automatic text direction based on language
- ✅ **AI Chat in All Languages** - System prompts and responses in native language
- ✅ **Email Templates** - Booking confirmations in all 4 languages
- ✅ **PDF Vouchers** - Printable vouchers with proper RTL layout
- ✅ **UI Components** - All interface elements translated
- ✅ **Language Switcher** - Easy language switching with persistence
- ✅ **SEO Optimized** - Proper lang and dir attributes

## Quick Start

### 1. Set Default Language

Edit `.env.local`:

```bash
# Choose: "en" | "he" | "ar" | "ru"
NEXT_PUBLIC_DEFAULT_LOCALE=he
```

### 2. Add Language Switcher to Your Layout

```tsx
import { LanguageSwitcher } from "@/components/language-switcher"
import { LanguageProvider } from "@/lib/i18n/language-context"

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <header>
        {/* Minimal variant - just a globe icon */}
        <LanguageSwitcher variant="minimal" />

        {/* Default variant - shows current language */}
        <LanguageSwitcher />
      </header>
      {children}
    </LanguageProvider>
  )
}
```

### 3. Use Translations in Components

#### Client Components

```tsx
"use client"

import { useTranslations } from "@/lib/i18n/use-translations"

export function BookingForm() {
  const t = useTranslations("booking")

  return (
    <div>
      <h1>{t("title")}</h1>
      <button>{t("bookNow")}</button>
    </div>
  )
}
```

#### Server Components

```tsx
import { getTranslations } from "@/lib/i18n/use-translations"

export async function BookingPage({ params }) {
  const messages = await getTranslations(params.locale, "booking")

  return (
    <div>
      <h1>{messages.title}</h1>
    </div>
  )
}
```

## Translation Files

All translations are stored in `/locales`:

```
locales/
├── en.json  # English
├── he.json  # Hebrew (עברית)
├── ar.json  # Arabic (العربية)
└── ru.json  # Russian (Русский)
```

### Translation Structure

```json
{
  "common": {
    "search": "Search",
    "book": "Book",
    "bookNow": "Book Now",
    ...
  },
  "search": {
    "title": "Find Your Perfect Stay",
    "destination": "Destination",
    ...
  },
  "booking": {
    "title": "Complete Your Booking",
    "firstName": "First Name",
    ...
  },
  "chat": {
    "title": "AI Booking Assistant",
    "greeting": "Hello! How can I help you?",
    ...
  },
  "email": {
    "bookingConfirmation": {
      "subject": "Booking Confirmation",
      ...
    }
  }
}
```

## AI Multi-Language Support

### System Prompts

AI system prompts are automatically selected based on user language:

```typescript
import { getSystemPrompt, getGreeting } from "@/lib/ai/prompts/multi-language"

// Get prompt for Hebrew
const hebrewPrompt = getSystemPrompt("he")

// Get greeting for Arabic
const arabicGreeting = getGreeting("ar")
```

### In Booking Chat API

```typescript
// app/api/ai/booking-chat/route.ts
import { getSystemPrompt } from "@/lib/ai/prompts/multi-language"

const systemPrompt = getSystemPrompt(language) // "en" | "he" | "ar" | "ru"

const response = await groqClient.chat({
  messages: [
    { role: "system", content: systemPrompt },
    ...messages,
  ],
})
```

## Email Templates Multi-Language

Email templates automatically adapt to user language:

```typescript
import { emailService } from "@/lib/email/email-service"

await emailService.sendBookingConfirmation({
  to: "customer@example.com",
  customerName: "John Doe",
  bookingId: "BK123456",
  // ... booking details
  language: "ar", // Arabic email
})
```

The email will:
- Use Arabic subject line
- Display content in RTL layout
- Format dates/numbers according to Arabic locale
- Include proper greeting and footer in Arabic

## PDF Vouchers Multi-Language

Vouchers support all 4 languages with proper RTL:

```typescript
import { voucherGenerator } from "@/lib/pdf/voucher-generator"

const pdfData = voucherGenerator.generateVoucher({
  bookingId: "BK123456",
  customerName: "محمد أحمد",
  // ... voucher details
  language: "ar", // Arabic voucher with RTL
})
```

Features:
- Proper RTL text alignment for Hebrew/Arabic
- Localized date formatting
- Currency formatting per locale
- Native language labels and headers

## RTL/LTR Handling

### Automatic Direction

The app automatically sets `dir` attribute based on language:

```typescript
// lib/i18n/config.ts
export const rtlLocales = ["he", "ar"]

export function getDirection(locale) {
  return rtlLocales.includes(locale) ? "rtl" : "ltr"
}
```

### In Components

```tsx
import { useLanguage } from "@/lib/i18n/language-context"

function MyComponent() {
  const { direction } = useLanguage()

  return (
    <div dir={direction}>
      {/* Content automatically flows RTL or LTR */}
    </div>
  )
}
```

## Adding New Languages

### 1. Create Translation File

Create `/locales/fr.json` (example for French):

```json
{
  "common": {
    "search": "Rechercher",
    "book": "Réserver",
    ...
  },
  ...
}
```

### 2. Update Config

Edit `/lib/i18n/config.ts`:

```typescript
export const locales = ["en", "he", "ar", "ru", "fr"] as const

export const localeNames: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ar: "العربية",
  ru: "Русский",
  fr: "Français", // New
}

// If language is RTL, add to rtlLocales array
export const rtlLocales: Locale[] = ["he", "ar"]
```

### 3. Add AI System Prompt

Edit `/lib/ai/prompts/multi-language.ts`:

```typescript
export const systemPrompts: Record<Locale, string> = {
  // ... existing languages
  fr: `Vous êtes un assistant professionnel de réservation d'hôtels...`,
}

export const greetingMessages: Record<Locale, string> = {
  // ... existing languages
  fr: "Bonjour! Je suis votre assistant de réservation IA...",
}
```

### 4. Done!

The language will automatically appear in the language switcher.

## Language Persistence

User language preference is automatically saved to `localStorage`:

```typescript
// Automatically saved when user switches language
localStorage.setItem("locale", "ar")

// Automatically loaded on page load
const savedLocale = localStorage.getItem("locale")
```

## Best Practices

### 1. Always Use Translation Keys

❌ **Don't:**
```tsx
<button>Book Now</button>
```

✅ **Do:**
```tsx
const t = useTranslations("common")
<button>{t("bookNow")}</button>
```

### 2. Handle Plural Forms

```json
{
  "nights": "nights",
  "night": "night"
}
```

```tsx
const t = useTranslations("common")
const text = nights === 1 ? t("night") : t("nights")
```

### 3. Use Proper Date/Number Formatting

```tsx
// Format date according to locale
const formattedDate = new Date().toLocaleDateString(locale)

// Format currency
const price = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD"
}).format(450)
```

### 4. Test RTL Layout

Always test Hebrew and Arabic to ensure:
- Text flows right-to-left
- Icons/buttons are mirrored correctly
- Padding/margins work in RTL
- Tables and forms align properly

## Troubleshooting

### Language Not Updating

Clear localStorage and refresh:

```javascript
localStorage.removeItem("locale")
window.location.reload()
```

### Missing Translation

Check console for warnings:

```
Warning: Missing translation for key "booking.title" in locale "ar"
```

Add the missing key to `/locales/ar.json`

### RTL Layout Issues

Ensure container has `dir` attribute:

```tsx
<div dir={direction}>
  {/* Content */}
</div>
```

## Performance

- **Translation files are code-split** - Only loaded when needed
- **Cached in browser** - Subsequent loads are instant
- **No runtime overhead** - Translations are static JSON
- **SSR compatible** - Works with server-side rendering

## Analytics

Track language usage in LangSmith:

```typescript
await langsmithTracer.traceChat({
  // ...
  metadata: {
    language: locale, // "en" | "he" | "ar" | "ru"
  },
  tags: ["booking-ai", locale],
})
```

## Examples

See working examples:
- `components/language-switcher.tsx` - Language dropdown
- `app/api/ai/booking-chat/route.ts` - AI chat with multi-language
- `emails/booking-confirmation.tsx` - Email template with i18n
- `lib/pdf/voucher-generator.ts` - PDF with RTL support

## Next Steps

1. ✅ **Setup Complete** - All 4 languages ready to use
2. 📝 **Customize Translations** - Edit `/locales/*.json` files
3. 🎨 **Test RTL Layout** - Verify Hebrew/Arabic display correctly
4. 🌍 **Add More Languages** - Follow "Adding New Languages" guide
5. 📊 **Monitor Usage** - Check LangSmith for language analytics

---

**Need Help?** Check the translation files in `/locales` or reach out to support.
