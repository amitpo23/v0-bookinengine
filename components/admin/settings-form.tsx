"use client"

import { useState } from "react"
import type { Hotel } from "@/types/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const HotelIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
    <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
    <path d="M8 7h.01" />
    <path d="M16 7h.01" />
    <path d="M12 7h.01" />
    <path d="M12 11h.01" />
    <path d="M16 11h.01" />
    <path d="M8 11h.01" />
    <path d="M10 22v-6.5m4 0V22" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const PaletteIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const SaveIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
)

interface SettingsFormProps {
  hotel: Hotel
  onSave: (hotel: Hotel) => void
}

export function SettingsForm({ hotel: initialHotel, onSave }: SettingsFormProps) {
  const [hotel, setHotel] = useState(initialHotel)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSave(hotel)
    setIsSaving(false)
  }

  const updateField = (field: keyof Hotel, value: any) => {
    setHotel((prev) => ({ ...prev, [field]: value }))
  }

  const updatePolicy = (field: keyof Hotel["policies"], value: string) => {
    setHotel((prev) => ({
      ...prev,
      policies: { ...prev.policies, [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HotelIcon className="h-5 w-5" />
            פרטי מלון בסיסיים
          </CardTitle>
          <CardDescription>מידע כללי על המלון שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">שם המלון</Label>
              <Input id="name" value={hotel.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">כתובת URL (Slug)</Label>
              <Input id="slug" value={hotel.slug} onChange={(e) => updateField("slug", e.target.value)} dir="ltr" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={hotel.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>דירוג כוכבים</Label>
            <Select
              value={hotel.stars.toString()}
              onValueChange={(value) => updateField("stars", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5].map((stars) => (
                  <SelectItem key={stars} value={stars.toString()}>
                    {stars} כוכבים
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            מיקום
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">כתובת</Label>
            <Input id="address" value={hotel.address} onChange={(e) => updateField("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">עיר</Label>
              <Input id="city" value={hotel.city} onChange={(e) => updateField("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">מדינה</Label>
              <Input id="country" value={hotel.country} onChange={(e) => updateField("country", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            מדיניות המלון
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">שעת צ׳ק-אין</Label>
              <Input
                id="checkIn"
                value={hotel.policies.checkIn}
                onChange={(e) => updatePolicy("checkIn", e.target.value)}
                placeholder="15:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">שעת צ׳ק-אאוט</Label>
              <Input
                id="checkOut"
                value={hotel.policies.checkOut}
                onChange={(e) => updatePolicy("checkOut", e.target.value)}
                placeholder="11:00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cancellation">מדיניות ביטולים</Label>
            <Textarea
              id="cancellation"
              value={hotel.policies.cancellation}
              onChange={(e) => updatePolicy("cancellation", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaletteIcon className="h-5 w-5" />
            מראה ומיתוג
          </CardTitle>
          <CardDescription>התאם אישית את מראה מנוע ההזמנות</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">צבע עיקרי</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={hotel.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={hotel.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  placeholder="#1e3a5f"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">מטבע</Label>
              <Select value={hotel.currency} onValueChange={(value) => updateField("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ILS">ILS (₪)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              שומר...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4 ml-2" />
              שמור שינויים
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
