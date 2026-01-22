"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Locale } from "@/app/i18n-config" // Import Locale type

const TemplatesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const ZapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const PaletteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
  </svg>
)
const BarChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)
const MessageCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
)
const LayoutGridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const translations = {
  he: {
    brand: "BookingEngine",
    badge: "מנוע הזמנות SaaS למלונות",
    heroTitle1: "מנוע הזמנות מקצועי",
    heroTitle2: "למלון שלך",
    heroDesc:
      "הגדל את ההזמנות הישירות עם מנוע הזמנות מודרני, מהיר ומותאם אישית. הטמע בקלות באתר שלך והתחל לקבל הזמנות תוך דקות.",
    viewWidget: "מנוע הזמנות סטנדרטי",
    viewAiChat: "מנוע הזמנות AI",
    viewTemplates: "גלריית טמפלטים",
    adminPanel: "פאנל ניהול",
    login: "כניסה למערכת",
    startFree: "התחל בחינם",
    whyChoose: "למה לבחור ב-BookingEngine?",
    whyChooseDesc: "כל מה שצריך כדי לנהל הזמנות ישירות ולהגדיל הכנסות",
    feature1Title: "הטמעה בדקות",
    feature1Desc: "העתק והדבק שורת קוד אחת והמנוע פועל באתר שלך",
    feature2Title: "התאמה אישית מלאה",
    feature2Desc: "התאם צבעים, לוגו וטקסטים למיתוג המלון שלך",
    feature3Title: "תמיכה דו-לשונית",
    feature3Desc: "תמיכה מלאה בעברית ואנגלית מהקופסה",
    feature4Title: "תשלומים מאובטחים",
    feature4Desc: "אינטגרציה עם Stripe, PayPal ועוד ספקי תשלום",
    feature5Title: "ניתוח ודוחות",
    feature5Desc: "עקוב אחר הזמנות, הכנסות ותפוסה בזמן אמת",
    feature6Title: " חוויית משתמש מעולה",
    feature6Desc: "עיצוב מודרני ומהיר שממיר מבקרים להזמנות",
    enginesTitle: "שני מנועי הזמנות לבחירתך",
    enginesDesc: "בחר את המנוע שמתאים לך או השתמש בשניהם",
    standardEngine: "מנוע הזמנות סטנדרטי",
    standardEngineDesc: "טופס הזמנות קלאסי עם בחירת תאריכים, חדרים ותשלום מאובטח",
    aiEngine: "מנוע הזמנות AI",
    aiEngineDesc: "שיחה טבעית עם בוט חכם שמבין את הצרכים שלך ומציע הזמנות מותאמות",
    tryNow: "נסה עכשיו",
    pricingTitle: "תוכניות מחירים",
    pricingDesc: "בחר את התוכנית המתאימה לגודל המלון שלך",
    starter: "Starter",
    starterDesc: "למלונות קטנים",
    starterFeatures: ["עד 20 חדרים", "מנוע הזמנות סטנדרטי", "תמיכה במייל", "דוחות בסיסיים"],
    pro: "Pro",
    proDesc: "למלונות בינוניים",
    proFeatures: [
      "עד 100 חדרים",
      "מנוע סטנדרטי + AI",
      "תמיכה בצ׳אט 24/7",
      "דוחות מתקדמים",
      "אינטגרציות API",
      "מותג מותאם אישית",
    ],
    enterprise: "Enterprise",
    enterpriseDesc: "לרשתות מלונות",
    enterpriseFeatures: [
      "חדרים ללא הגבלה",
      "ריבוי נכסים",
      "מנהל לקוח ייעודי",
      "SLA מותאם",
      "אינטגרציות מותאמות",
      "הדרכה אישית",
    ],
    selectPlan: "בחר תוכנית",
    contactUs: "צור קשר",
    mostPopular: "הכי פופולרי",
    custom: "מותאם",
    perMonth: "/חודש",
    readyToStart: "מוכן להתחיל?",
    readyDesc: "הצטרף למאות מלונות שכבר משתמשים ב-BookingEngine להגדלת ההזמנות הישירות",
    startTrial: "התחל תקופת ניסיון חינם",
    scheduleDemo: "קבע שיחת הדגמה",
    terms: "תנאי שימוש",
    privacy: "פרטיות",
    contact: "צור קשר",
    blog: "בלוג",
    rights: "כל הזכויות שמורות",
    language: "שפה",
  },
  en: {
    brand: "BookingEngine",
    badge: "SaaS Booking Engine for Hotels",
    heroTitle1: "Professional Booking Engine",
    heroTitle2: "for Your Hotel",
    heroDesc:
      "Increase direct bookings with a modern, fast, and customizable booking engine. Embed easily on your website and start receiving bookings in minutes.",
    viewWidget: "Standard Booking Engine",
    viewAiChat: "AI Booking Engine",
    viewTemplates: "Template Gallery",
    adminPanel: "Admin Panel",
    login: "Login",
    startFree: "Start Free",
    whyChoose: "Why Choose BookingEngine?",
    whyChooseDesc: "Everything you need to manage direct bookings and increase revenue",
    feature1Title: "Deploy in Minutes",
    feature1Desc: "Copy and paste one line of code and the engine runs on your site",
    feature2Title: "Full Customization",
    feature2Desc: "Customize colors, logo and texts to match your hotel branding",
    feature3Title: "Bilingual Support",
    feature3Desc: "Full support for Hebrew and English out of the box",
    feature4Title: "Secure Payments",
    feature4Desc: "Integration with Stripe, PayPal and more payment providers",
    feature5Title: "Analytics & Reports",
    feature5Desc: "Track bookings, revenue and occupancy in real-time",
    feature6Title: "Excellent UX",
    feature6Desc: "Modern and fast design that converts visitors to bookings",
    enginesTitle: "Two Booking Engines to Choose From",
    enginesDesc: "Choose the engine that suits you or use both",
    standardEngine: "Standard Booking Engine",
    standardEngineDesc: "Classic booking form with date selection, rooms and secure payment",
    aiEngine: "AI Booking Engine",
    aiEngineDesc: "Natural conversation with a smart bot that understands your needs and offers tailored bookings",
    tryNow: "Try Now",
    pricingTitle: "Pricing Plans",
    pricingDesc: "Choose the plan that fits your hotel size",
    starter: "Starter",
    starterDesc: "For small hotels",
    starterFeatures: ["Up to 20 rooms", "Standard booking engine", "Email support", "Basic reports"],
    pro: "Pro",
    proDesc: "For medium hotels",
    proFeatures: [
      "Up to 100 rooms",
      "Standard + AI engines",
      "24/7 chat support",
      "Advanced reports",
      "API integrations",
      "Custom branding",
    ],
    enterprise: "Enterprise",
    enterpriseDesc: "For hotel chains",
    enterpriseFeatures: [
      "Unlimited rooms",
      "Multi-property",
      "Dedicated account manager",
      "Custom SLA",
      "Custom integrations",
      "Personal training",
    ],
    selectPlan: "Select Plan",
    contactUs: "Contact Us",
    mostPopular: "Most Popular",
    custom: "Custom",
    perMonth: "/month",
    readyToStart: "Ready to Start?",
    readyDesc: "Join hundreds of hotels already using BookingEngine to increase direct bookings",
    startTrial: "Start Free Trial",
    scheduleDemo: "Schedule a Demo",
    terms: "Terms of Use",
    privacy: "Privacy",
    contact: "Contact",
    blog: "Blog",
    rights: "All rights reserved",
    language: "Language",
  },
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("he")
  const t = translations[locale]
  const dir = locale === "he" ? "rtl" : "ltr"
  const Arrow = dir === "rtl" ? ArrowLeftIcon : ArrowRightIcon

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* DEPLOYMENT TEST - 2026-01-22 14:35 */}
      <div className="bg-red-500 text-white text-center p-2 font-bold">
        🚀 DEPLOYMENT TEST - REAL API ACTIVE - Version 2026-01-22-14:35
      </div>
      
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl">{t.brand}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/templates">
              <Button variant="ghost" className="hidden sm:flex gap-2">
                <TemplatesIcon />
                {t.viewTemplates}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <GlobeIcon />
                  <span className="hidden sm:inline">{locale === "he" ? "עברית" : "English"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("he")} className={locale === "he" ? "bg-accent" : ""}>
                  עברית
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-accent" : ""}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/admin">
              <Button variant="outline">{t.login}</Button>
            </Link>
            <Link href="/pricing">
              <Button>{t.startFree}</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <Badge className="mb-4" variant="secondary">
            {t.badge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            {t.heroTitle1}
            <br />
            <span className="text-primary">{t.heroTitle2}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">{t.heroDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/widget">
              <Button size="lg" className="text-lg px-8">
                <span className={dir === "rtl" ? "ml-2" : "mr-2"}>
                  <LayoutGridIcon />
                </span>
                {t.viewWidget}
              </Button>
            </Link>
            <Link href="/ai-chat">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <span className={dir === "rtl" ? "ml-2" : "mr-2"}>
                  <MessageCircleIcon />
                </span>
                {t.viewAiChat}
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                <span className={dir === "rtl" ? "ml-2" : "mr-2"}>
                  <TemplatesIcon />
                </span>
                {t.viewTemplates}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Templates Preview Section - Enhanced */}
      <section className="py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 text-lg px-4 py-1" variant="outline">
              {locale === "he" ? "טמפלטים למנוע הזמנות" : "Booking Engine Templates"}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {locale === "he" ? "גלריית עיצובים מקצועיים" : "Professional Design Gallery"}
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              {locale === "he"
                ? "בחרו מתוך 4 עיצובים מקצועיים שונים למנוע ההזמנות שלכם. כל טמפלט מוכן לשימוש מיידי"
                : "Choose from 4 different professional designs for your booking engine. All templates are ready to use"}
            </p>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* NARA Style Template */}
            <Link href="/templates/nara" className="group">
              <Card className="overflow-hidden border-2 hover:border-teal-500 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 bg-gradient-to-br from-teal-50 to-teal-100 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/nara-hotel-booking-modern.jpg')] bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-teal-500 text-white border-none">מקצועי</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1">NARA Style</h3>
                    <p className="text-teal-100 text-sm">עיצוב מקצועי עם השוואת מחירים</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Price comparison from Booking.com and Priceline</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Price calendar for every day</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Carousel of add-ons and discounts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Side panel with booking summary</span>
                    </div>
                  </div>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white group-hover:translate-x-1 transition-transform">
                    {locale === "he" ? "צפה ב демо" : "View Demo"}
                    <Arrow />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Modern Dark Template */}
            <Link href="/templates/modern-dark" className="group">
              <Card className="overflow-hidden border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/dark-modern-hotel-luxury.jpg')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-cyan-500 text-zinc-950 border-none">מודרני</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1">Modern Dark</h3>
                    <p className="text-zinc-300 text-sm">Dark and minimalist design</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Dark color scheme with accents in cyan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Smooth and modern animations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Minimalist and clean design</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Suitable for premium brands</span>
                    </div>
                  </div>
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-zinc-950 group-hover:translate-x-1 transition-transform">
                    {locale === "he" ? "צפה ב демо" : "View Demo"}
                    <Arrow />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Luxury Template */}
            <Link href="/templates/luxury" className="group">
              <Card className="overflow-hidden border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/luxury-boutique-hotel-elegant.jpg')] bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-amber-600 text-white border-none">יוקרתי</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1 font-serif">Luxury Boutique</h3>
                    <p className="text-stone-100 text-sm">Elegant and luxurious design</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Elegant serif typography</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Gold and stone accents</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Suitable for luxury boutique hotels</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Rich user experience</span>
                    </div>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white group-hover:translate-x-1 transition-transform">
                    {locale === "he" ? "צפה ב демо" : "View Demo"}
                    <Arrow />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Family Resort Template */}
            <Link href="/templates/family" className="group">
              <Card className="overflow-hidden border-2 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 bg-gradient-to-br from-orange-50 to-pink-50 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/family-resort-pool-kids-colorful.jpg')] bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-orange-500 text-white border-none">משפחתי</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1">Family Resort</h3>
                    <p className="text-orange-100 text-sm">Colorful and cheerful design</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Colorful and cheerful gradients</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Cute and friendly icons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Suitable for families with children</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckIcon />
                      <span>Simple and easy-to-use interface</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white group-hover:translate-x-1 transition-transform">
                    {locale === "he" ? "צפה ב демо" : "View Demo"}
                    <Arrow />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* View All Templates CTA */}
          <div className="text-center">
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 group bg-transparent">
                {locale === "he" ? "צפה בכל הטמפלטים בגלריה" : "View Full Template Gallery"}
                <Arrow className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Template Features Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-none bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <ZapIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">{locale === "he" ? "מוכן לשימוש" : "Ready to Use"}</h3>
              <p className="text-muted-foreground text-sm">
                {locale === "he"
                  ? "כל הטמפלטים מוכנים עם תהליך הזמנה מלא"
                  : "All templates ready with full booking flow"}
              </p>
            </Card>
            <Card className="text-center p-6 border-none bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <StarIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">{locale === "he" ? "מותאם אישית" : "Customizable"}</h3>
              <p className="text-muted-foreground text-sm">
                {locale === "he"
                  ? "התאם צבעים, גופנים ועיצוב למותג שלך"
                  : "Customize colors, fonts and design for your brand"}
              </p>
            </Card>
            <Card className="text-center p-6 border-none bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <TemplatesIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">{locale === "he" ? "מוכן לשימוש" : "Ready to Use"}</h3>
              <p className="text-muted-foreground text-sm">
                {locale === "he"
                  ? "כל טמפלט כולל חיפוש, בחירת חדר, פרטי אורח ותשלום"
                  : "Each template includes search, room selection, guest details and payment"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Engines Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.enginesTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.enginesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Engine Card */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
              <CardHeader className="pt-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <LayoutGridIcon />
                </div>
                <CardTitle className="text-2xl text-center">{t.standardEngine}</CardTitle>
                <CardDescription className="text-center text-base">{t.standardEngineDesc}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Link href="/widget">
                  <Button size="lg" className="px-8">
                    {t.tryNow}
                    <Arrow />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Engine Card */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader className="pt-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 mx-auto">
                  <MessageCircleIcon />
                </div>
                <CardTitle className="text-2xl text-center">{t.aiEngine}</CardTitle>
                <CardDescription className="text-center text-base">{t.aiEngineDesc}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Link href="/ai-chat">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    {t.tryNow}
                    <Arrow />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.whyChoose}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.whyChooseDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ZapIcon />
                </div>
                <CardTitle>{t.feature1Title}</CardTitle>
                <CardDescription>{t.feature1Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <PaletteIcon />
                </div>
                <CardTitle>{t.feature2Title}</CardTitle>
                <CardDescription>{t.feature2Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GlobeIcon />
                </div>
                <CardTitle>{t.feature3Title}</CardTitle>
                <CardDescription>{t.feature3Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldIcon />
                </div>
                <CardTitle>{t.feature4Title}</CardTitle>
                <CardDescription>{t.feature4Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChartIcon />
                </div>
                <CardTitle>{t.feature5Title}</CardTitle>
                <CardDescription>{t.feature5Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <StarIcon />
                </div>
                <CardTitle>{t.feature6Title}</CardTitle>
                <CardDescription>{t.feature6Desc}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.pricingTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.pricingDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card>
              <CardHeader>
                <CardTitle>{t.starter}</CardTitle>
                <CardDescription>{t.starterDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">{t.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.starterFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-green-600">
                        <CheckIcon />
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  {t.selectPlan}
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary relative">
              <div className={`absolute -top-3 ${dir === "rtl" ? "right-4" : "left-4"}`}>
                <Badge>{t.mostPopular}</Badge>
              </div>
              <CardHeader>
                <CardTitle>{t.pro}</CardTitle>
                <CardDescription>{t.proDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-muted-foreground">{t.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-green-600">
                        <CheckIcon />
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6">{t.selectPlan}</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>{t.enterprise}</CardTitle>
                <CardDescription>{t.enterpriseDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{t.custom}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.enterpriseFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-green-600">
                        <CheckIcon />
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  {t.contactUs}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t.readyToStart}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t.readyDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              {t.startTrial}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              {t.scheduleDemo}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">{t.brand}</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">
                {t.terms}
              </a>
              <a href="#" className="hover:text-foreground">
                {t.privacy}
              </a>
              <a href="#" className="hover:text-foreground">
                {t.contact}
              </a>
              <a href="#" className="hover:text-foreground">
                {t.blog}
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 {t.brand}. {t.rights}.
          </div>
        </div>
      </footer>
    </div>
  )
}
