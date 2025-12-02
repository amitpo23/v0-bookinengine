"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft, ArrowRight, Star, Zap, Shield, Globe, Palette, BarChart3 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Locale = "he" | "en"

const translations = {
  he: {
    brand: "BookingEngine",
    badge: "מנוע הזמנות SaaS למלונות",
    heroTitle1: "מנוע הזמנות מקצועי",
    heroTitle2: "למלון שלך",
    heroDesc:
      "הגדל את ההזמנות הישירות עם מנוע הזמנות מודרני, מהיר ומותאם אישית. הטמע בקלות באתר שלך והתחל לקבל הזמנות תוך דקות.",
    viewDemo: "צפה בדמו",
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
    feature6Title: "חווית משתמש מעולה",
    feature6Desc: "עיצוב מודרני ומהיר שממיר מבקרים להזמנות",
    pricingTitle: "תוכניות מחירים",
    pricingDesc: "בחר את התוכנית המתאימה לגודל המלון שלך",
    starter: "Starter",
    starterDesc: "למלונות קטנים",
    starterFeatures: ["עד 20 חדרים", "הזמנות ללא הגבלה", "תמיכה במייל", "דוחות בסיסיים"],
    pro: "Pro",
    proDesc: "למלונות בינוניים",
    proFeatures: [
      "עד 100 חדרים",
      "הזמנות ללא הגבלה",
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
    viewDemo: "View Demo",
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
    pricingTitle: "Pricing Plans",
    pricingDesc: "Choose the plan that fits your hotel size",
    starter: "Starter",
    starterDesc: "For small hotels",
    starterFeatures: ["Up to 20 rooms", "Unlimited bookings", "Email support", "Basic reports"],
    pro: "Pro",
    proDesc: "For medium hotels",
    proFeatures: [
      "Up to 100 rooms",
      "Unlimited bookings",
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

export default function DemoPage() {
  const [locale, setLocale] = useState<Locale>("he")
  const t = translations[locale]
  const dir = locale === "he" ? "rtl" : "ltr"
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  return (
    <div className="min-h-screen bg-background" dir={dir}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{locale === "he" ? "עברית" : "English"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("he")} className={locale === "he" ? "bg-accent" : ""}>
                  🇮🇱 עברית
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-accent" : ""}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/admin">
              <Button variant="outline">{t.login}</Button>
            </Link>
            <Button>{t.startFree}</Button>
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
            <Link href="/">
              <Button size="lg" className="text-lg px-8">
                {t.viewDemo}
                <Arrow className={`h-5 w-5 ${dir === "rtl" ? "mr-2" : "ml-2"}`} />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                {t.adminPanel}
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.feature1Title}</CardTitle>
                <CardDescription>{t.feature1Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.feature2Title}</CardTitle>
                <CardDescription>{t.feature2Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.feature3Title}</CardTitle>
                <CardDescription>{t.feature3Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.feature4Title}</CardTitle>
                <CardDescription>{t.feature4Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.feature5Title}</CardTitle>
                <CardDescription>{t.feature5Desc}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
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
                      <Check className="h-4 w-4 text-green-600" />
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
                      <Check className="h-4 w-4 text-green-600" />
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
                      <Check className="h-4 w-4 text-green-600" />
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
