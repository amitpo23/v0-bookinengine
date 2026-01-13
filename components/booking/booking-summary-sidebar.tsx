"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Moon, CreditCard } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { he } from "date-fns/locale"

interface BookingSummaryProps {
  room?: {
    name: string
    image: string
    boardType: string
  }
  dates?: {
    from: Date
    to: Date
  }
  guests?: {
    adults: number
    children: number[]
  }
  pricing?: {
    roomPrice: number
    nights: number
    subtotal: number
    taxes: number
    total: number
  }
  className?: string
}

export function BookingSummary({ room, dates, guests, pricing, className }: BookingSummaryProps) {
  const nights = dates ? differenceInDays(dates.to, dates.from) : 0

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">סיכום ההזמנה</h3>

        {/* פרטי החדר */}
        {room && (
          <div className="mb-4">
            <div className="flex gap-3 mb-3">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">{room.name}</div>
                <Badge variant="outline" className="text-xs">
                  {room.boardType}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* תאריכים */}
        {dates && (
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 text-sm">
                <div className="font-medium">תאריכים</div>
                <div className="text-muted-foreground">
                  {format(dates.from, "EEE, d MMM yyyy", { locale: he })}
                  {" → "}
                  {format(dates.to, "EEE, d MMM yyyy", { locale: he })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Moon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 text-sm">
                <div className="font-medium">לילות</div>
                <div className="text-muted-foreground">
                  {nights} {nights === 1 ? "לילה" : "לילות"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* אורחים */}
        {guests && (
          <div className="flex items-start gap-2 mb-4">
            <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1 text-sm">
              <div className="font-medium">אורחים</div>
              <div className="text-muted-foreground">
                {guests.adults} {guests.adults === 1 ? "מבוגר" : "מבוגרים"}
                {guests.children.length > 0 && 
                  `, ${guests.children.length} ${guests.children.length === 1 ? "ילד" : "ילדים"}`
                }
              </div>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* פירוט מחיר */}
        {pricing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>₪{pricing.roomPrice.toLocaleString()} × {pricing.nights} לילות</span>
              <span>₪{pricing.subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>מע"ם ודמי שירות</span>
              <span>₪{pricing.taxes.toLocaleString()}</span>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between font-bold text-lg">
              <span>סה"כ לתשלום</span>
              <span>₪{pricing.total.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <CreditCard className="h-3 w-3" />
              <span>תשלום מאובטח</span>
            </div>
          </div>
        )}

        {/* הערה */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-900">
          <strong>חשוב לדעת:</strong> ביטול חינם עד 48 שעות לפני ההגעה
        </div>
      </div>
    </Card>
  )
}
