"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GuestInfo } from "@/hooks/use-booking-engine"

interface GuestDetailsFormProps {
  onSubmit: (info: GuestInfo) => void
  isLoading?: boolean
  variant?: "default" | "dark" | "luxury" | "family"
}

export function GuestDetailsForm({ onSubmit, isLoading, variant = "default" }: GuestDetailsFormProps) {
  const [formData, setFormData] = useState<GuestInfo>({
    title: "MR",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "IL",
    city: "",
    address: "",
    zip: "",
    specialRequests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClass =
    variant === "dark"
      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
      : variant === "luxury"
        ? "border-stone-300 focus:border-amber-500"
        : variant === "family"
          ? "border-purple-200 focus:border-orange-400 rounded-xl"
          : ""

  const labelClass =
    variant === "dark"
      ? "text-zinc-300"
      : variant === "luxury"
        ? "text-stone-700 font-serif"
        : variant === "family"
          ? "text-purple-700 font-medium"
          : ""

  const buttonClass =
    variant === "dark"
      ? "bg-cyan-500 hover:bg-cyan-600 text-black"
      : variant === "luxury"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : variant === "family"
          ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl"
          : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={labelClass}>תואר *</Label>
          <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MR">מר</SelectItem>
              <SelectItem value="MRS">גברת</SelectItem>
              <SelectItem value="MS">גב׳</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>שם פרטי *</Label>
          <Input
            required
            className={inputClass}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="הכנס שם פרטי"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>שם משפחה *</Label>
          <Input
            required
            className={inputClass}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="הכנס שם משפחה"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>דוא״ל *</Label>
          <Input
            required
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>טלפון *</Label>
          <Input
            required
            type="tel"
            className={inputClass}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="050-0000000"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>מדינה</Label>
          <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IL">ישראל</SelectItem>
              <SelectItem value="US">ארה״ב</SelectItem>
              <SelectItem value="GB">בריטניה</SelectItem>
              <SelectItem value="DE">גרמניה</SelectItem>
              <SelectItem value="FR">צרפת</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>עיר</Label>
          <Input
            className={inputClass}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="שם העיר"
          />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>כתובת</Label>
          <Input
            className={inputClass}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="רחוב ומספר"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>בקשות מיוחדות</Label>
        <Textarea
          className={inputClass}
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="אלרגיות, העדפות חדר, וכו׳"
          rows={3}
        />
      </div>

      <Button type="submit" className={`w-full ${buttonClass}`} disabled={isLoading}>
        {isLoading ? "טוען..." : "המשך לתשלום"}
      </Button>
    </form>
  )
}
