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
    { code: "IL", name: t("israel") },
    { code: "US", name: t("usa") },
    { code: "GB", name: t("uk") },
    { code: "DE", name: t("germany") },
    { code: "FR", name: t("france") },
    { code: "IT", name: t("italy") },
    { code: "ES", name: t("spain") },
    { code: "RU", name: t("russia") },
  ]

  const arrivalTimes = [
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
    "23:00 - 00:00",
    t("later"),
  ]

  const [formData, setFormData] = useState<GuestDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "IL",
    specialRequests: "",
    arrivalTime: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({})

  const validate = () => {
    const newErrors: Partial<Record<keyof GuestDetails, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = t("requiredField")
    if (!formData.lastName.trim()) newErrors.lastName = t("requiredField")
    if (!formData.email.trim()) {
      newErrors.email = t("requiredField")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmail")
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("requiredField")
    } else if (!/^[0-9+\-\s()]{9,}$/.test(formData.phone)) {
      newErrors.phone = t("invalidPhone")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof GuestDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} dir={dir}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.user className="h-5 w-5" />
            {t("guestDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")} *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")} *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Icons.mail className="h-4 w-4" />
                {t("email")} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
                dir="ltr"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Icons.phone className="h-4 w-4" />
                {t("phone")} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
                dir="ltr"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>

          {/* Country & Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Icons.globe className="h-4 w-4" />
                {t("country")}
              </Label>
              <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                <SelectTrigger>
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
              <Label className="flex items-center gap-1">
                <Icons.clock className="h-4 w-4" />
                {t("estimatedArrival")}
              </Label>
              <Select value={formData.arrivalTime} onValueChange={(value) => updateField("arrivalTime", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectTime")} />
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
            <Label htmlFor="specialRequests" className="flex items-center gap-1">
              <Icons.messageSquare className="h-4 w-4" />
              {t("specialRequests")}
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => updateField("specialRequests", e.target.value)}
              placeholder={t("specialRequestsPlaceholder")}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{t("specialRequestsNote")}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">{t("checkInPolicy", { hotelName: hotel?.name || "" })}</p>
            <p className="text-muted-foreground">
              {t("checkIn")}: {hotel?.policies.checkIn} | {t("checkOut")}: {hotel?.policies.checkOut}
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("continueToPayment")}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
