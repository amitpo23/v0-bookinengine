"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { GuestInfo } from "@/hooks/use-booking-engine"

interface GuestDetailsFormProps {
  onSubmit: (info: GuestInfo) => void
  isLoading?: boolean
  variant?: "default" | "dark" | "luxury" | "family"
}

export function GuestDetailsForm({ onSubmit, isLoading, variant = "default" }: GuestDetailsFormProps) {
  const { data: session } = useSession()
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

  // Auto-fill form from Google session
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(" ") || []
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(" ") || prev.lastName,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleGoogleSignIn = () => {
    signIn("google")
  }

  const inputClass =
    variant === "dark"
      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
      : variant === "luxury"
        ? "border-stone-300 focus:border-amber-500"
        : variant === "family"
          ? "border-purple-200 focus:border-orange-400 rounded-xl"
          : ""

  cons{/* Google Sign In Button */}
      {!session?.user && (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            התחבר עם Google למילוי מהיר
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${variant === "dark" ? "bg-zinc-900 text-zinc-400" : "bg-white text-gray-500"}`}>
                או מלא ידנית
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Show user info if logged in */}
      {session?.user && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
          {session.user.image && (
            <img src={session.user.image} alt={session.user.name || ""} className="h-10 w-10 rounded-full" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">מחובר כ-{session.user.name}</p>
            <p className="text-xs text-green-700">{session.user.email}</p>
          </div>
        </div>
      )}

      t labelClass =
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
