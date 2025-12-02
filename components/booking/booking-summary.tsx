"use client"

import { formatDate } from "@/lib/date-utils"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface BookingSummaryProps {
  showContinue?: boolean
  onContinue?: () => void
  className?: string
}

export function BookingSummary({ showContinue = true, onContinue, className }: BookingSummaryProps) {
  const { hotel, search, selectedRooms, removeRoom, updateRoomQuantity, nights, totalPrice, setCurrentStep } =
    useBooking()
  const { t, locale, dir } = useI18n()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const taxes = totalPrice * 0.17 // VAT
  const grandTotal = totalPrice + taxes
  const nightsText = nights === 1 ? t("night") : t("nights")

  const handleContinue = () => {
    setCurrentStep(3)
    onContinue?.()
  }

  if (selectedRooms.length === 0) {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-6", className)} dir={dir}>
        <h3 className="font-semibold text-lg mb-4">{t("bookingSummary")}</h3>
        <p className="text-muted-foreground text-sm text-center py-8">{t("noRoomsSelected")}</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border p-6", className)} dir={dir}>
      <h3 className="font-semibold text-lg mb-4">{t("bookingSummary")}</h3>

      {/* Stay Details */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.calendar className="h-4 w-4" />
          <span>
            {formatDate(search.checkIn, locale)} - {formatDate(search.checkOut, locale)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.moon className="h-4 w-4" />
          <span>
            {nights} {nightsText}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.users className="h-4 w-4" />
          <span>
            {search.adults} {t("adults")}
            {search.children > 0 ? `, ${search.children} ${t("children")}` : ""}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Selected Rooms */}
      <div className="space-y-4">
        {selectedRooms.map((sr) => (
          <div key={`${sr.room.id}-${sr.ratePlan.id}`} className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{sr.room.name}</p>
                <p className="text-xs text-muted-foreground">{sr.ratePlan.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeRoom(sr.room.id, sr.ratePlan.id)}
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => updateRoomQuantity(sr.room.id, sr.ratePlan.id, sr.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-6 text-center text-sm">{sr.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => updateRoomQuantity(sr.room.id, sr.ratePlan.id, sr.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <span className="font-medium">{formatPrice(sr.ratePlan.price * sr.quantity * nights)}</span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Pricing */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("totalRooms")}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("vat")}</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-bold">
          <span>{t("totalToPay")}</span>
          <span className="text-primary">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {showContinue && (
        <Button className="w-full mt-6" size="lg" onClick={handleContinue}>
          {t("continueToBooking")}
        </Button>
      )}
    </div>
  )
}
