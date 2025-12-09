"use client"

import type React from "react"
import { useState } from "react"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import type { GuestDetails } from "@/types/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface GuestFormProps {
  onSubmit: (details: GuestDetails) => void
}

export function GuestForm({ onSubmit }: GuestFormProps) {
  const { hotel } = useBooking()
  const { t, locale, dir } = useI18n()

  const countries = [
    { code: "IL", name: locale === "he" ? "ישראל" : "Israel" },
    { code: "US", name: locale === "he" ? 'ארה"ב' : "USA" },
    { code: "GB", name: locale === "he" ? "בריטניה" : "UK" },
    { code: "DE", name: locale === "he" ? "גרמניה" : "Germany" },
    { code: "FR", name: locale === "he" ? "צרפת" : "France" },
  ]

  const arrivalTimes = [
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00+",
  ]

  const [formData, setFormData] = useState<
    GuestDetails & { firstNameHe?: string; lastNameHe?: string; firstNameEn?: string; lastNameEn?: string }
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "IL",
    specialRequests: "",
    arrivalTime: "",
    firstNameHe: "",
    lastNameHe: "",
    firstNameEn: "",
    lastNameEn: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const requiredText = locale === "he" ? "שדה חובה" : "Required"
    const invalidEmailText = locale === "he" ? "אימייל לא תקין" : "Invalid email"
    const invalidPhoneText = locale === "he" ? "טלפון לא תקין" : "Invalid phone"

    if (!formData.firstNameHe?.trim()) newErrors.firstNameHe = requiredText
    if (!formData.lastNameHe?.trim()) newErrors.lastNameHe = requiredText
    if (!formData.firstNameEn?.trim()) newErrors.firstNameEn = requiredText
    if (!formData.lastNameEn?.trim()) newErrors.lastNameEn = requiredText
    if (!formData.email.trim()) {
      newErrors.email = requiredText
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = invalidEmailText
    }
    if (!formData.phone.trim()) {
      newErrors.phone = requiredText
    } else if (!/^[0-9+\-\s()]{9,}$/.test(formData.phone)) {
      newErrors.phone = invalidPhoneText
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...formData,
        firstName: formData.firstNameEn || formData.firstNameHe || "",
        lastName: formData.lastNameEn || formData.lastNameHe || "",
      })
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} dir={dir}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-xl text-gray-900">
            {locale === "he" ? "פרטים אישיים" : "Personal Details"}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {locale === "he" ? "השדות המסומנים בכוכבית הינם שדות חובה" : "Fields marked with asterisk are required"}
          </p>
        </CardHeader>
        <CardContent className="px-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">{locale === "he" ? "שם בעברית" : "Name in Hebrew"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstNameHe" className="text-gray-700">
                  {locale === "he" ? "שם פרטי" : "First Name"} *
                </Label>
                <Input
                  id="firstNameHe"
                  value={formData.firstNameHe}
                  onChange={(e) => updateField("firstNameHe", e.target.value)}
                  className={errors.firstNameHe ? "border-red-500" : "border-gray-300"}
                  placeholder={locale === "he" ? "הזן שם פרטי" : "Enter first name"}
                />
                {errors.firstNameHe && <p className="text-xs text-red-500">{errors.firstNameHe}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastNameHe" className="text-gray-700">
                  {locale === "he" ? "שם משפחה" : "Last Name"} *
                </Label>
                <Input
                  id="lastNameHe"
                  value={formData.lastNameHe}
                  onChange={(e) => updateField("lastNameHe", e.target.value)}
                  className={errors.lastNameHe ? "border-red-500" : "border-gray-300"}
                  placeholder={locale === "he" ? "הזן שם משפחה" : "Enter last name"}
                />
                {errors.lastNameHe && <p className="text-xs text-red-500">{errors.lastNameHe}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">{locale === "he" ? "שם באנגלית" : "Name in English"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstNameEn" className="text-gray-700">
                  {locale === "he" ? "שם פרטי" : "First Name"} *
                </Label>
                <Input
                  id="firstNameEn"
                  value={formData.firstNameEn}
                  onChange={(e) => updateField("firstNameEn", e.target.value)}
                  className={errors.firstNameEn ? "border-red-500" : "border-gray-300"}
                  placeholder="Enter first name"
                  dir="ltr"
                />
                {errors.firstNameEn && <p className="text-xs text-red-500">{errors.firstNameEn}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastNameEn" className="text-gray-700">
                  {locale === "he" ? "שם משפחה" : "Last Name"} *
                </Label>
                <Input
                  id="lastNameEn"
                  value={formData.lastNameEn}
                  onChange={(e) => updateField("lastNameEn", e.target.value)}
                  className={errors.lastNameEn ? "border-red-500" : "border-gray-300"}
                  placeholder="Enter last name"
                  dir="ltr"
                />
                {errors.lastNameEn && <p className="text-xs text-red-500">{errors.lastNameEn}</p>}
              </div>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">{locale === "he" ? "פרטי התקשרות" : "Contact Details"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 flex items-center gap-1">
                  <Icons.mail className="h-4 w-4" />
                  {locale === "he" ? 'דוא"ל' : "Email"} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-red-500" : "border-gray-300"}
                  placeholder="example@email.com"
                  dir="ltr"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 flex items-center gap-1">
                  <Icons.phone className="h-4 w-4" />
                  {locale === "he" ? "טלפון" : "Phone"} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : "border-gray-300"}
                  placeholder="050-1234567"
                  dir="ltr"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Country & Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-1">
                <Icons.globe className="h-4 w-4" />
                {locale === "he" ? "מדינה" : "Country"}
              </Label>
              <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-1">
                <Icons.clock className="h-4 w-4" />
                {locale === "he" ? "שעת הגעה משוערת" : "Estimated Arrival"}
              </Label>
              <Select value={formData.arrivalTime} onValueChange={(value) => updateField("arrivalTime", value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder={locale === "he" ? "בחר שעה" : "Select time"} />
                </SelectTrigger>
                <SelectContent>
                  {arrivalTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests" className="text-gray-700 flex items-center gap-1">
              <Icons.messageSquare className="h-4 w-4" />
              {locale === "he" ? "בקשות מיוחדות" : "Special Requests"}
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => updateField("specialRequests", e.target.value)}
              placeholder={locale === "he" ? "בקשות מיוחדות (אופציונלי)" : "Special requests (optional)"}
              rows={3}
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              {locale === "he"
                ? "בקשות מיוחדות כפופות לזמינות ואינן מובטחות"
                : "Special requests are subject to availability and not guaranteed"}
            </p>
          </div>

          {/* Check-in Policy */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-2">
              {locale === "he"
                ? `מדיניות כניסה - ${hotel?.name || "המלון"}`
                : `Check-in Policy - ${hotel?.name || "Hotel"}`}
            </p>
            <p className="text-blue-700">
              {locale === "he" ? "צ'ק-אין" : "Check-in"}: {hotel?.policies?.checkIn || "15:00"} |{" "}
              {locale === "he" ? "צ'ק-אאוט" : "Check-out"}: {hotel?.policies?.checkOut || "11:00"}
            </p>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            {locale === "he" ? "המשך לתשלום" : "Continue to Payment"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
