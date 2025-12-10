"use client"

import type React from "react"
import { CheckCircle, X, Calendar, Users, Moon, CreditCard, Shield } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  bookingDetails: {
    roomName: string
    roomNameHe: string
    rateName: string
    rateNameHe: string
    checkIn: Date
    checkOut: Date
    nights: number
    guests: {
      adults: number
      children: number
    }
    price: number
    refundable: boolean
  }
  language?: "en" | "he"
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  language = "he",
}) => {
  const isHebrew = language === "he"

  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isHebrew ? "he-IL" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const totalGuests = bookingDetails.guests.adults + bookingDetails.guests.children

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isHebrew ? "אישור הזמנה" : "Confirm Booking"}</h2>
                <p className="text-blue-100 mt-1">
                  {isHebrew
                    ? "אנא בדקו את פרטי ההזמנה לפני המשך"
                    : "Please review your booking details before proceeding"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Room Details */}
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {isHebrew ? bookingDetails.roomNameHe : bookingDetails.roomName}
            </h3>
            <div className="text-blue-700 font-semibold">
              {isHebrew ? bookingDetails.rateNameHe : bookingDetails.rateName}
            </div>
            {bookingDetails.refundable && (
              <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                {isHebrew ? "ניתן לביטול בחינם" : "Free Cancellation"}
              </div>
            )}
          </div>

          {/* Stay Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">{isHebrew ? "תאריכי השהייה" : "Stay Dates"}</div>
                <div className="text-gray-700">
                  <div>{formatDate(bookingDetails.checkIn)}</div>
                  <div className="text-gray-400 my-1">↓</div>
                  <div>{formatDate(bookingDetails.checkOut)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Moon className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{isHebrew ? "משך השהייה" : "Duration"}</div>
                <div className="text-gray-700">
                  {bookingDetails.nights} {isHebrew ? "לילות" : `night${bookingDetails.nights > 1 ? "s" : ""}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{isHebrew ? "אורחים" : "Guests"}</div>
                <div className="text-gray-700">
                  {totalGuests} {isHebrew ? "אורחים" : `guest${totalGuests > 1 ? "s" : ""}`} (
                  {bookingDetails.guests.adults}{" "}
                  {isHebrew ? "מבוגרים" : `adult${bookingDetails.guests.adults > 1 ? "s" : ""}`}
                  {bookingDetails.guests.children > 0 &&
                    `, ${bookingDetails.guests.children} ${isHebrew ? "ילדים" : `child${bookingDetails.guests.children > 1 ? "ren" : ""}`}`}
                  )
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 mb-4">{isHebrew ? "סיכום מחירים" : "Price Summary"}</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>
                  ₪{(bookingDetails.price / bookingDetails.nights).toLocaleString()} × {bookingDetails.nights}{" "}
                  {isHebrew ? "לילות" : "nights"}
                </span>
                <span>₪{bookingDetails.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{isHebrew ? "דמי שירות" : "Service Fee"}</span>
                <span>₪0</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{isHebrew ? "מיסים" : "Taxes"}</span>
                <span>{isHebrew ? "כלול במחיר" : "Included"}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">{isHebrew ? "סה״כ לתשלום" : "Total to Pay"}</span>
                <span className="text-3xl font-bold text-blue-600">₪{bookingDetails.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <CreditCard className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-gray-900 mb-1">{isHebrew ? "תשלום במלון" : "Pay at Hotel"}</div>
              <div className="text-sm text-gray-700">
                {isHebrew
                  ? "לא נדרש תשלום עכשיו. תשלמו במלון בעת הצ׳ק-אין."
                  : "No payment required now. You will pay at the hotel upon check-in."}
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="text-xs text-gray-500 space-y-2">
            <p>{isHebrew ? "• זמני צ׳ק-אין: החל מ-15:00" : "• Check-in time: From 3:00 PM"}</p>
            <p>{isHebrew ? "• זמני צ׳ק-אאוט: עד 11:00" : "• Check-out time: Until 11:00 AM"}</p>
            <p>
              {isHebrew
                ? "• אישור ההזמנה יישלח לכתובת האימייל שלכם"
                : "• Booking confirmation will be sent to your email"}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              {isHebrew ? "חזור" : "Go Back"}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              {isHebrew ? "אשר והמשך" : "Confirm & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
