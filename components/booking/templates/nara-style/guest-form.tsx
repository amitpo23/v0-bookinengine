"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"

interface GuestFormProps {
  selectedRoom?: {
    name: string
    offer: string
    board: string
    price: number
  }
  checkIn?: Date
  checkOut?: Date
  nights?: number
  originalPrice?: number
  discount?: number
  totalPrice?: number
  onSubmit?: (data: any) => void
  onGoogleLogin?: () => void
  currency?: string
}

export function NaraGuestForm({
  selectedRoom,
  checkIn,
  checkOut,
  nights = 1,
  originalPrice,
  discount,
  totalPrice,
  onSubmit,
  onGoogleLogin,
  currency = "₪",
}: GuestFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coupon: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      {/* Date Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-6 flex items-center justify-end gap-4">
          <span className="text-gray-500">לילה {nights}</span>
          <span className="text-gray-500">|</span>
          <div className="flex items-center gap-2">
            {checkOut && <span>{checkOut.toLocaleDateString("he-IL")}</span>}
            <ChevronLeft className="w-4 h-4" />
            {checkIn && <span>{checkIn.toLocaleDateString("he-IL")}</span>}
          </div>
        </div>
      </div>

      {/* Selected Room Summary */}
      {selectedRoom && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">
                {totalPrice} {currency}
              </span>
              <div className="flex items-center gap-8 text-gray-600">
                <span>{selectedRoom.board}</span>
                <span>{selectedRoom.offer}</span>
                <span className="font-medium">{selectedRoom.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Info */}
          <div className="w-80 flex-shrink-0">
            {/* Coupon Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Label className="block mb-2">יש לכם קופון?</Label>
              <div className="flex gap-2">
                <Button variant="outline">עדכן</Button>
                <Input name="coupon" value={formData.coupon} onChange={handleChange} className="flex-1" />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="space-y-3">
                {originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {originalPrice} {currency}
                    </span>
                    <span>מחיר רגיל</span>
                  </div>
                )}
                {discount && (
                  <div className="flex justify-between text-red-500">
                    <span>
                      -{discount} {currency}
                    </span>
                    <span>חסכת</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span className="text-teal-600">
                    {totalPrice} {currency}
                  </span>
                  <span>סה"כ להזמנה כולל מע"מ</span>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-4">מידע חשוב לאתר</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-teal-500">✓</span>
                  הזמנה ישירה למלון באופן מיידי
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-500">✓</span>
                  חיסכון בזמן ללא המתנה בטלפון
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-500">✓</span>
                  קבלת חדרים ימים ראשון עד שישי החל מהשעה 15:00
                </li>
              </ul>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">פרטי אורח</h2>

              {/* Google Login */}
              <button
                onClick={onGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 mb-6"
              >
                <img src="/google-logo.png" alt="Google" className="w-6 h-6" />
                <span>כניסה בשם</span>
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">A</span>
              </button>

              <p className="text-sm text-gray-500 mb-6">שדות חובה מסומנים ב-*</p>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">שם מלא *</Label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="email">כתובת דואר אלקטרוני *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => onSubmit?.(formData)}
                className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg"
              >
                המשך לתשלום
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
