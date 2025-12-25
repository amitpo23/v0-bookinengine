"use client"

import { format } from "date-fns"
import { he } from "date-fns/locale"
import { Calendar, Users, Moon, Info, Shield, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface BookingSidebarProps {
  hotelName?: string
  hotelImage?: string
  hotelRating?: number
  roomName?: string
  roomImage?: string
  checkIn?: Date
  checkOut?: Date
  guests?: number
  nights?: number
  basePrice?: number
  taxes?: number
  fees?: number
  discount?: number
  totalPrice?: number
  currency?: string
  board?: string
  refundable?: boolean
  onCheckout?: () => void
  isLoading?: boolean
  showCheckoutButton?: boolean
  className?: string
}

export function EnhancedBookingSidebar({
  hotelName,
  hotelImage,
  hotelRating,
  roomName,
  roomImage,
  checkIn,
  checkOut,
  guests = 2,
  nights = 1,
  basePrice,
  taxes,
  fees,
  discount,
  totalPrice,
  currency = "₪",
  board,
  refundable,
  onCheckout,
  isLoading,
  showCheckoutButton = true,
  className,
}: BookingSidebarProps) {
  const pricePerNight = basePrice ? basePrice / nights : 0

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-6",
        className
      )}
      dir="rtl"
    >
      {/* Header with Hotel/Room Image */}
      {(hotelImage || roomImage) && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={roomImage || hotelImage}
            alt={roomName || hotelName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-bold mb-1">{roomName || hotelName}</h3>
            {hotelRating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < hotelRating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Booking Details */}
        <div className="space-y-3">
          {checkIn && checkOut && (
            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
              <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">כניסה</span>
                  <span className="font-semibold text-gray-900">
                    {format(checkIn, "dd/MM/yyyy", { locale: he })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">יציאה</span>
                  <span className="font-semibold text-gray-900">
                    {format(checkOut, "dd/MM/yyyy", { locale: he })}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Moon className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-xs text-gray-500">לילות</div>
                <div className="font-bold text-gray-900">{nights}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-xs text-gray-500">אורחים</div>
                <div className="font-bold text-gray-900">{guests}</div>
              </div>
            </div>
          </div>

          {/* Board & Refundable Status */}
          {(board || refundable !== undefined) && (
            <div className="flex flex-wrap gap-2">
              {board && (
                <Badge variant="outline" className="text-xs">
                  {board}
                </Badge>
              )}
              {refundable !== undefined && (
                <Badge
                  variant={refundable ? "default" : "secondary"}
                  className={cn(
                    "text-xs gap-1",
                    refundable
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {refundable ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      ביטול חינם
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      ללא ביטול
                    </>
                  )}
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        {basePrice !== undefined && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-600" />
              פירוט מחיר
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {currency}
                  {pricePerNight.toLocaleString("he-IL")} × {nights} לילות
                </span>
                <span className="font-medium text-gray-900">
                  {currency}
                  {basePrice.toLocaleString("he-IL")}
                </span>
              </div>

              {taxes !== undefined && taxes > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">מיסים ועמלות</span>
                  <span className="font-medium text-gray-900">
                    {currency}
                    {taxes.toLocaleString("he-IL")}
                  </span>
                </div>
              )}

              {fees !== undefined && fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">עמלת שירות</span>
                  <span className="font-medium text-gray-900">
                    {currency}
                    {fees.toLocaleString("he-IL")}
                  </span>
                </div>
              )}

              {discount !== undefined && discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>הנחה</span>
                  <span className="font-medium">
                    -{currency}
                    {discount.toLocaleString("he-IL")}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Total Price */}
            {totalPrice !== undefined && (
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200">
                <div>
                  <div className="text-sm text-gray-600 mb-1">סה״כ לתשלום</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currency}
                    {totalPrice.toLocaleString("he-IL")}
                  </div>
                  {nights > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {currency}
                      {(totalPrice / nights).toLocaleString("he-IL")} ללילה
                    </div>
                  )}
                </div>
                <Shield className="w-10 h-10 text-teal-600 opacity-20" />
              </div>
            )}
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && onCheckout && (
          <Button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>מעבד...</span>
              </div>
            ) : (
              "המשך לתשלום"
            )}
          </Button>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center pt-2 border-t border-gray-100">
          <Shield className="w-4 h-4 text-green-600" />
          <span>תשלום מאובטח וסודי</span>
        </div>
      </div>
    </div>
  )
}
