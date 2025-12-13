"use client"

import { useState } from "react"
import Image from "next/image"
import type { Room, RatePlan } from "@/types/booking"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { getRoomRatePlans } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RoomCardProps {
  room: Room
  onBook?: (roomId: string, rateId: string, hotelId: number) => void}

export function RoomCard({ room, onBook }: RoomCardProps) {
  const { addRoom, nights, hotel } = useBooking()
  const { t, locale, dir } = useI18n()
  const [expanded, setExpanded] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const ratePlans = getRoomRatePlans(room.id)

  const getMealPlanIcon = (mealPlan: RatePlan["mealPlan"]) => {
    switch (mealPlan) {
      case "breakfast":
        return <Icons.coffee className="h-4 w-4" />
      case "half-board":
      case "full-board":
      case "all-inclusive":
        return <Icons.utensils className="h-4 w-4" />
      default:
        return null
    }
  }

  const getMealPlanLabel = (mealPlan: RatePlan["mealPlan"]) => {
    switch (mealPlan) {
      case "room-only":
        return t("roomOnly")
      case "breakfast":
        return t("breakfast")
      case "half-board":
        return t("halfBoard")
      case "full-board":
        return t("fullBoard")
      case "all-inclusive":
        return t("allInclusive")
    }
  }

  const getCancellationBadge = (policy: RatePlan["cancellationPolicy"]) => {
    switch (policy) {
      case "free":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
            {t("freeCancellation")}
          </Badge>
        )
      case "non-refundable":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            {t("nonRefundable")}
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            {t("partialRefund")}
          </Badge>
        )
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nightsText = nights === 1 ? t("night") : t("nights")

  return (
    <>
      <div
        className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        dir={dir}
      >
        {/* Room Header */}
        <div className="flex flex-col md:flex-row">
          {/* Room Image */}
          <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0">
            <Image
              src={room.images[selectedImage] || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowGallery(true)}
            />
            {room.images.length > 1 && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === selectedImage ? "bg-white" : "bg-white/50",
                    )}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            )}
            {room.available <= 3 && (
              <Badge className={cn("absolute top-2 bg-red-500 hover:bg-red-500", dir === "rtl" ? "right-2" : "left-2")}>
                {t("roomsLeft", { count: room.available })}
              </Badge>
            )}
          </div>

          {/* Room Info */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-foreground">{room.name}</h3>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground md:hidden"
              >
                {expanded ? <Icons.chevronUp className="h-5 w-5" /> : <Icons.chevronDown className="h-5 w-5" />}
              </button>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{room.description}</p>

            {/* Room Features */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Icons.users className="h-4 w-4" />
                <span>{t("upToGuests", { count: room.maxGuests })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.maximize className="h-4 w-4" />
                <span>
                  {room.size} {t("sqm")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.bed className="h-4 w-4" />
                <span>{room.bedType}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 5).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{room.amenities.length - 5}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Rate Plans */}
        {expanded && (
          <div className="border-t border-border">
            <div className="divide-y divide-border">
              {ratePlans.map((ratePlan) => (
                <div key={ratePlan.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Rate Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{ratePlan.name}</h4>
                        {getCancellationBadge(ratePlan.cancellationPolicy)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        {getMealPlanIcon(ratePlan.mealPlan)}
                        <span>{getMealPlanLabel(ratePlan.mealPlan)}</span>
                      </div>

                      {/* Includes */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {ratePlan.includes.map((item) => (
                          <div key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icons.check className="h-3 w-3 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Book */}
                    <div
                      className={cn(
                        "flex items-center gap-4 md:flex-col",
                        dir === "rtl" ? "md:items-start" : "md:items-end",
                      )}
                    >
                      <div className={dir === "rtl" ? "text-left md:text-left" : "text-right md:text-right"}>
                        {ratePlan.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(ratePlan.originalPrice * nights)}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-foreground">{formatPrice(ratePlan.price * nights)}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("forNights", { count: nights, nightsText })}
                        </div>
                      </div>
            <Button onClick={() => onBook?.(room.id, ratePlan.id, hotel?.id || 0)} className="min-w-[100px]">                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{room.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            <Image
              src={room.images[selectedImage] || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 ring-2 transition-all",
                  idx === selectedImage ? "ring-primary" : "ring-transparent hover:ring-muted-foreground",
                )}
              >
                <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
