"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import Link from "next/link"

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const plans = [
  {
    id: "basic",
    name: "Basic",
    nameHe: "בסיסי",
    description: "למלונות קטנים שמתחילים",
    descriptionHe: "למלונות קטנים שמתחילים",
    price: 99,
    priceYearly: 79,
    currency: "$",
    features: ["מנוע הזמנות מסורתי", "עד 100 הזמנות בחודש", "תמיכה במייל", "עיצוב בסיסי", "דוחות בסיסיים"],
    featuresEn: [
      "Traditional Booking Widget",
      "Up to 100 bookings/month",
      "Email Support",
      "Basic Styling",
      "Basic Reports",
    ],
    popular: false,
    cta: "התחל עכשיו",
    ctaEn: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    nameHe: "מקצועי",
    description: "למלונות שרוצים יותר",
    descriptionHe: "למלונות שרוצים יותר",
    price: 249,
    priceYearly: 199,
    currency: "$",
    features: [
      "מנוע הזמנות מסורתי",
      "צ׳אט AI להזמנות",
      "עד 500 הזמנות בחודש",
      "תמיכה בצ׳אט ומייל",
      "עיצוב מותאם אישית",
      "דוחות מתקדמים",
      "אינטגרציה עם CRM",
    ],
    featuresEn: [
      "Traditional Booking Widget",
      "AI Chat Booking Assistant",
      "Up to 500 bookings/month",
      "Chat & Email Support",
      "Custom Branding",
      "Advanced Reports",
      "CRM Integration",
    ],
    popular: true,
    cta: "הכי פופולרי",
    ctaEn: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameHe: "ארגוני",
    description: "לרשתות מלונות",
    descriptionHe: "לרשתות מלונות",
    price: 599,
    priceYearly: 499,
    currency: "$",
    features: [
      "הכל מהחבילה המקצועית",
      "מספר מלונות ללא הגבלה",
      "הזמנות ללא הגבלה",
      "תמיכה 24/7",
      "מנהל לקוח ייעודי",
      "API מלא",
      "SLA מובטח",
      "התאמות מיוחדות",
    ],
    featuresEn: [
      "Everything in Professional",
      "Unlimited Hotels",
      "Unlimited Bookings",
      "24/7 Support",
      "Dedicated Account Manager",
      "Full API Access",
      "Guaranteed SLA",
      "Custom Development",
    ],
    popular: false,
    cta: "צור קשר",
    ctaEn: "Contact Us",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [language, setLanguage] = useState<"he" | "en">("he")
  const isRtl = language === "he"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            BookingEngine
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "he" ? "en" : "he")}>
              {language === "he" ? "EN" : "עב"}
            </Button>
            <Link href="/admin">
              <Button variant="outline">{isRtl ? "כניסה למערכת" : "Login"}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          {isRtl ? "מחירים שקופים" : "Transparent Pricing"}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {isRtl ? "בחר את התוכנית המתאימה לך" : "Choose the Right Plan for You"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {isRtl
            ? "מנוע הזמנות מתקדם עם צ׳אט AI שמגדיל את ההמרות ומפחית עומס על הצוות"
            : "Advanced booking engine with AI chat that increases conversions and reduces staff workload"}
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm", !isYearly && "font-semibold")}>{isRtl ? "חודשי" : "Monthly"}</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={cn("text-sm", isYearly && "font-semibold")}>
            {isRtl ? "שנתי" : "Yearly"}
            <Badge variant="secondary" className="mr-2 bg-green-500/10 text-green-600">
              {isRtl ? "חסוך 20%" : "Save 20%"}
            </Badge>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn("relative flex flex-col", plan.popular && "border-primary shadow-lg scale-105")}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    {isRtl ? "הכי פופולרי" : "Most Popular"}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{isRtl ? plan.nameHe : plan.name}</CardTitle>
                <CardDescription>{isRtl ? plan.descriptionHe : plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">
                    {plan.currency}
                    {isYearly ? plan.priceYearly : plan.price}
                  </span>
                  <span className="text-muted-foreground">/{isRtl ? "חודש" : "month"}</span>
                </div>
                <ul className="space-y-3">
                  {(isRtl ? plan.features : plan.featuresEn).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  {isRtl ? plan.cta : plan.ctaEn}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">
          {isRtl ? "השוואה בין סוגי המנועים" : "Compare Booking Engines"}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isRtl ? "מנוע הזמנות מסורתי" : "Traditional Widget"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {isRtl ? "טופס חיפוש קלאסי" : "Classic search form"}</li>
                <li>• {isRtl ? "בחירת תאריכים וחדרים" : "Date and room selection"}</li>
                <li>• {isRtl ? "תהליך הזמנה מובנה" : "Structured booking flow"}</li>
                <li>• {isRtl ? "מתאים לכל סוגי האורחים" : "Suitable for all guests"}</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isRtl ? "צ׳אט AI להזמנות" : "AI Chat Booking"}</CardTitle>
                <Badge>Pro</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {isRtl ? "שיחה טבעית עם הבוט" : "Natural conversation"}</li>
                <li>• {isRtl ? "הזמנות דרך שיחה" : "Book through chat"}</li>
                <li>• {isRtl ? "תמיכה 24/7 אוטומטית" : "24/7 automated support"}</li>
                <li>• {isRtl ? "חוויה אישית ומותאמת" : "Personalized experience"}</li>
                <li>• {isRtl ? "הגדלת המרות ב-30%" : "30% higher conversions"}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{isRtl ? "מוכנים להתחיל?" : "Ready to Get Started?"}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {isRtl
              ? "התחל תקופת ניסיון חינם של 14 יום. ללא כרטיס אשראי."
              : "Start your 14-day free trial. No credit card required."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              {isRtl ? "התחל ניסיון חינם" : "Start Free Trial"}
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              {isRtl ? "צפה בהדגמה" : "Watch Demo"}
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 BookingEngine. {isRtl ? "כל הזכויות שמורות." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  )
}
