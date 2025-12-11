"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const templates = [
  {
    id: "nara",
    name: "NARA Style",
    description: "עיצוב מקצועי בסגנון NARA Hotels עם השוואת מחירים, לוח שנה עם מחירים ותוספות",
    image: "/nara-hotel-booking-modern.jpg",
    tags: ["מקצועי", "השוואת מחירים", "לוח שנה"],
    color: "bg-teal-500",
    href: "/templates/nara",
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "עיצוב מודרני ומינימליסטי עם ערכת צבעים כהה ואלגנטית",
    image: "/dark-modern-hotel-luxury.jpg",
    tags: ["מודרני", "כהה", "מינימליסטי"],
    color: "bg-zinc-800",
    href: "/templates/modern-dark",
  },
  {
    id: "luxury",
    name: "Luxury Boutique",
    description: "עיצוב יוקרתי עם טיפוגרפיה אלגנטית, מתאים למלונות בוטיק יוקרתיים",
    image: "/luxury-boutique-hotel-elegant.jpg",
    tags: ["יוקרתי", "בוטיק", "אלגנטי"],
    color: "bg-amber-700",
    href: "/templates/luxury",
  },
  {
    id: "family",
    name: "Family Resort",
    description: "עיצוב צבעוני ושמח, מותאם לאתרי נופש משפחתיים עם ילדים",
    image: "/family-resort-pool-kids-colorful.jpg",
    tags: ["משפחתי", "צבעוני", "ילדים"],
    color: "bg-gradient-to-r from-orange-400 to-pink-500",
    href: "/templates/family",
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
          <Badge className="mb-4" variant="secondary">
            גלריית טמפלטים
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            בחר את הסגנון
            <span className="text-primary"> שמתאים למלון שלך</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מגוון טמפלטים מעוצבים מראש למנוע ההזמנות שלך. כל טמפלט כולל סרגל חיפוש, כרטיסי חדרים, טופס הזמנה ועוד.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 ${template.color}`} />
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={template.href}>
                    <Button className="w-full">צפה בטמפלט</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted/50 border-t">
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
