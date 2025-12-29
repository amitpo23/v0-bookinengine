"use client"

import { Button } from "@/components/ui/button"
import { Heart, Calendar, Users, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface ScarletBookingSidebarProps {
  checkIn?: Date
  checkOut?: Date
  nights?: number
  rooms?: number
  guests?: number
  selectedRoom?: {
    name: string
    board?: string
    price: number
    specialOffer?: string
  }
  addons?: Array<{
    name: string
    price: number
  }>
  totalPrice?: number
  onBook?: () => void
  currency?: string
}

export function ScarletBookingSidebar({
  checkIn,
  checkOut,
  nights = 1,
  rooms = 1,
  guests = 2,
  selectedRoom,
  addons = [],
  totalPrice,
  onBook,
  currency = "₪",
}: ScarletBookingSidebarProps) {
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0)
  const finalTotal = (totalPrice || 0) + addonsTotal

  return (
    <div className="w-96 flex-shrink-0" dir="rtl">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-center">
          <Heart className="h-10 w-10 text-white mx-auto mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-white">סיכום ההזמנה</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dates */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-red-400" />
              <span className="text-white font-semibold">תאריכי השהייה</span>
            </div>
            <div className="text-gray-300 space-y-2">
              {checkIn && (
                <div className="flex justify-between">
                  <span className="text-gray-400">כניסה:</span>
                  <span className="font-medium">{format(checkIn, "d בMMM yyyy", { locale: he })}</span>
                </div>
              )}
              {checkOut && (
                <div className="flex justify-between">
                  <span className="text-gray-400">יציאה:</span>
                  <span className="font-medium">{format(checkOut, "d בMMM yyyy", { locale: he })}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-gray-400">סך הכל:</span>
                <span className="font-bold text-white">{nights} לילות</span>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-pink-400" />
              <span className="text-white font-semibold">פרטי האירוח</span>
            </div>
            <div className="text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">חדרים:</span>
                <span className="font-medium">{rooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">אורחים:</span>
                <span className="font-medium">{guests} מבוגרים</span>
              </div>
            </div>
          </div>

          {/* Selected Room */}
          {selectedRoom && (
            <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-semibold">החדר שבחרתם</span>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">{selectedRoom.name}</h4>
              {selectedRoom.board && (
                <p className="text-gray-300 text-sm mb-2">{selectedRoom.board}</p>
              )}
              {selectedRoom.specialOffer && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded px-3 py-2 mb-3">
                  <span className="text-yellow-300 text-sm">✨ {selectedRoom.specialOffer}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-gray-400">מחיר לילה:</span>
                <span className="text-red-400 font-bold text-xl">
                  {selectedRoom.price} {currency}
                </span>
              </div>
            </div>
          )}

          {/* Addons */}
          {addons.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">תוספות שנבחרו</h4>
              <div className="space-y-2">
                {addons.map((addon, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-300">• {addon.name}</span>
                    <span className="text-gray-300">
                      {addon.price} {currency}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                  <span className="text-white">סה"כ תוספות:</span>
                  <span className="text-pink-400">
                    {addonsTotal} {currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-5 text-center">
            <p className="text-white/90 text-sm mb-2">סה"כ לתשלום</p>
            <p className="text-white font-bold text-4xl mb-1">
              {finalTotal} <span className="text-2xl">{currency}</span>
            </p>
            <p className="text-white/70 text-xs">כולל מע"ם</p>
          </div>

          {/* Book Button */}
          {onBook && (
            <Button
              onClick={onBook}
              className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              <Heart className="w-5 h-5 ml-2 text-red-500" />
              השלם הזמנה
            </Button>
          )}

          {/* Social Share */}
          <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
            <span className="text-gray-400 text-sm">שתפו:</span>
            <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
