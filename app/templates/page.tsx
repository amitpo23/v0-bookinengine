"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Check, Zap } from "lucide-react"

const templates = [
  {
    id: "scarlet",
    name: "Scarlet Hotel Tel Aviv",
    description: "מלון בוטיק רומנטי ומודרני בלב תל אביב, עם 7 סוגי חדרים ייחודיים ואמבטיות חיצוניות",
    image: "/scarlet-hotel-romantic-modern.jpg",
    tags: ["רומנטי", "מודרני", "בוטיק"],
    color: "bg-gradient-to-r from-red-600 to-pink-600",
    href: "/templates/scarlet",
    features: ["7 סוגי חדרים ייחודיים", "אמבטיות חיצוניות", "עיצוב רומנטי", "מרפסות פרטיות"],
  },
  {
    id: "nara",
    name: "NARA Style",
    description: "עיצוב מקצועי בסגנון NARA Hotels עם השוואת מחירים, לוח שנה עם מחירים ותוספות",
    image: "/nara-hotel-booking-modern.jpg",
    tags: ["מקצועי", "השוואת מחירים", "לוח שנה"],
    color: "bg-teal-500",
    href: "/templates/nara",
    features: ["השוואת מחירים מאתרים", "לוח שנה עם מחירים", "תוספות והטבות", "סיכום הזמנה"],
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "עיצוב מודרני ומינימליסטי עם ערכת צבעים כהה ואלגנטית",
    image: "/dark-modern-hotel-luxury.jpg",
    tags: ["מודרני", "כהה", "מינימליסטי"],
    color: "bg-zinc-800",
    href: "/templates/modern-dark",
    features: ["עיצוב כהה מודרני", "אנימציות חלקות", "כרטיסי חדרים אלגנטיים", "UI מינימליסטי"],
  },
  {
    id: "luxury",
    name: "Luxury Boutique",
    description: "עיצוב יוקרתי עם טיפוגרפיה אלגנטית, מתאים למלונות בוטיק יוקרתיים",
    image: "/luxury-boutique-hotel-elegant.jpg",
    tags: ["יוקרתי", "בוטיק", "אלגנטי"],
    color: "bg-amber-700",
    href: "/templates/luxury",
    features: ["טיפוגרפיה Serif יוקרתית", "צבעי זהב ושנהב", "כרטיסי סוויטות מפוארים", "סביבה פרימיום"],
  },
  {
    id: "family",
    name: "Family Resort",
    description: "עיצוב צבעוני ושמח, מותאם לאתרי נופש משפחתיים עם ילדים",
    image: "/family-resort-pool-kids-colorful.jpg",
    tags: ["משפחתי", "צבעוני", "ילדים"],
    color: "bg-gradient-to-r from-orange-400 to-pink-500",
    href: "/templates/family",
    features: ["עיצוב צבעוני ושמח", "אייקוני פעילויות", "מותאם למשפחות", "פינות ילדים"],
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl">BookingEngine</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/widget">
              <Button variant="ghost">מנוע סטנדרטי</Button>
            </Link>
            <Link href="/ai-chat">
              <Button variant="ghost">מנוע AI</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">פאנל ניהול</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 gap-1" variant="secondary">
            <Zap className="w-3 h-3" />
            זמין כעת
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            בחר את הסגנון
            <span className="text-primary"> שמתאים למלון שלך</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            מגוון טמפלטים מעוצבים מראש למנוע ההזמנות שלך. כל טמפלט מוכן לשימוש עם תהליך הזמנה מלא.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              חיפוש חדרים בזמן אמת
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              PreBook אוטומטי
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              תשלום מאובטח
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              אישור הזמנה מיידי
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-56 overflow-hidden">
                  <div className={`absolute inset-0 ${template.color}`} />
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white border-0">
                      <Zap className="w-3 h-3 ml-1" />
                      מוכן לשימוש
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{template.description}</p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {template.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={template.href}>
                    <Button className="w-full">צפה בטמפלט והתחל הזמנה</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Explanation */}
      <section className="py-16 px-6 bg-muted/30 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">תהליך ההזמנה בכל טמפלט</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: "חיפוש", desc: "בחירת תאריכים ואורחים" },
              { step: 2, title: "בחירת חדר", desc: "צפייה בחדרים זמינים" },
              { step: 3, title: "פרטי אורח", desc: "מילוי פרטים אישיים" },
              { step: 4, title: "תשלום", desc: "תשלום מאובטח" },
              { step: 5, title: "אישור", desc: "קבלת אישור מיידי" },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 4 && <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">רוצה טמפלט מותאם אישית?</h2>
          <p className="text-muted-foreground mb-8">
            צור איתנו קשר ונבנה לך טמפלט בדיוק לפי המותג והצרכים של המלון שלך
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg">צור קשר</Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
