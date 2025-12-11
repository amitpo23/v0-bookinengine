"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Facebook, Mail } from "lucide-react"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface BookingSidebarProps {
  checkIn?: Date
  checkOut?: Date
  nights?: number
  rooms?: number
  guests?: number
  selectedRoom?: {
    name: string
    board: string
    price: number
    specialOffer?: string
  }
  totalPrice?: number
  onBook?: () => void
  currency?: string
}

export function BookingSidebar({
  checkIn,
  checkOut,
  nights = 1,
  rooms = 1,
  guests = 2,
  selectedRoom,
  totalPrice,
  onBook,
  currency = "₪",
}: BookingSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0" dir="rtl">
      {/* Search Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">פרטי חיפוש</h3>
          {/* Share Icons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">שתפו</span>
            <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm mb-2">
          {checkOut && <span>{format(checkOut, "d בMMM", { locale: he })}</span>}
          <ChevronLeft className="w-4 h-4" />
          {checkIn && <span>{format(checkIn, "d בMMM yyyy", { locale: he })}</span>}
          <span className="text-gray-500">| לילה {nights}</span>
        </div>

        {/* Room & Guests */}
        <div className="text-sm text-gray-600 space-y-1">
          <div>חדר {rooms}</div>
          <div>{guests} מבוגרים</div>
        </div>
      </div>

      {/* Selected Room Summary */}
      {selectedRoom && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-teal-600 font-bold">
              {totalPrice} {currency}
            </span>
            <span className="text-sm">נבחרו {rooms} חדרים</span>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-bold mb-2">{selectedRoom.name}</h4>
            {selectedRoom.specialOffer && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="text-yellow-500">?</span> {selectedRoom.specialOffer}
              </div>
            )}
            <div className="text-sm text-gray-600">{selectedRoom.board}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-teal-600 font-bold">
                {selectedRoom.price} {currency}
              </span>
              <span className="text-sm">מחיר</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      <Button
        onClick={onBook}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg"
        disabled={!selectedRoom}
      >
        הזמן עכשיו
      </Button>

      {/* Decorative Wave */}
      <div className="flex justify-center my-4">
        <svg className="w-12 h-6 text-gray-300" viewBox="0 0 48 24">
          <path d="M0 12 Q12 0, 24 12 T48 12" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Important Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold mb-4">מידע חשוב לאתר</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">✓</span>
            <span>הזמנה ישירה למלון באופן מיידי</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">✓</span>
            <span>חיסכון בזמן ללא המתנה בטלפון</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">✓</span>
            <span>קבלת חדרים ימים ראשון עד שישי החל מהשעה 15:00, ימי שבת ומוצאי חג: החל משעתיים לאחר צאת השבת/חג.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">✓</span>
            <span>
              עזיבת חדרים באמצע השבוע: עד השעה 11:00, ימי שבת וחגים עד השעה 12:00 תוספת של 300 ₪ לחדר עבור עזיבה מאוחרת
              לאחר השעה שנקבעה בתקנון ולא יאוחר משעה 18:00.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
