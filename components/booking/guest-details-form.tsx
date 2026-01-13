"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, User, MapPin } from "lucide-react"

interface GuestDetailsFormProps {
  onSubmit: (details: GuestDetails) => void
  savedDetails?: GuestDetails | null
  className?: string
}

export interface GuestDetails {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  zip: string
  newsletter: boolean
  saveDetails: boolean
}

export function GuestDetailsForm({ onSubmit, savedDetails, className }: GuestDetailsFormProps) {
  const [details, setDetails] = useState<GuestDetails>(
    savedDetails || {
      title: "MR",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "IL",
      city: "",
      address: "",
      zip: "",
      newsletter: false,
      saveDetails: false,
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!details.firstName.trim()) newErrors.firstName = "שם פרטי חובה"
    if (!details.lastName.trim()) newErrors.lastName = "שם משפחה חובה"
    if (!details.email.trim()) newErrors.email = "אימייל חובה"
    if (!details.email.includes("@")) newErrors.email = "אימייל לא תקין"
    if (!details.phone.trim()) newErrors.phone = "טלפון חובה"
    if (details.phone.length < 9) newErrors.phone = "טלפון לא תקין"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit(details)
    }
  }

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // TODO: Implement social login
    console.log("Login with", provider)
  }

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="text-lg font-bold mb-4">פרטים אישיים</h3>

        {/* כניסה עם Google/Facebook */}
        <div className="space-y-2 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() => handleSocialLogin("google")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            התחבר עם Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() => handleSocialLogin("facebook")}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            התחבר עם Facebook
          </Button>
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
            או מלא את הפרטים
          </span>
        </div>

        <div className="space-y-4">
          {/* תואר */}
          <div>
            <Label htmlFor="title">תואר</Label>
            <select
              id="title"
              value={details.title}
              onChange={(e) => setDetails({ ...details, title: e.target.value })}
              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="MR">מר</option>
              <option value="MRS">גברת</option>
              <option value="MS">גב'</option>
            </select>
          </div>

          {/* שם פרטי ומשפחה */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">שם פרטי *</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  value={details.firstName}
                  onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                  className={errors.firstName ? "border-red-500 pr-10" : "pr-10"}
                  placeholder="שם פרטי"
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">שם משפחה *</Label>
              <Input
                id="lastName"
                value={details.lastName}
                onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                className={errors.lastName ? "border-red-500" : ""}
                placeholder="שם משפחה"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* אימייל */}
          <div>
            <Label htmlFor="email">דואר אלקטרוני *</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                className={errors.email ? "border-red-500 pr-10" : "pr-10"}
                placeholder="your@email.com"
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* טלפון */}
          <div>
            <Label htmlFor="phone">טלפון *</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                className={errors.phone ? "border-red-500 pr-10" : "pr-10"}
                placeholder="050-1234567"
                dir="ltr"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* כתובת */}
          <div>
            <Label htmlFor="address">כתובת</Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={details.address}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
                className="pr-10"
                placeholder="רחוב ומספר בית"
              />
            </div>
          </div>

          {/* עיר ומיקוד */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">עיר</Label>
              <Input
                id="city"
                value={details.city}
                onChange={(e) => setDetails({ ...details, city: e.target.value })}
                placeholder="תל אביב"
              />
            </div>

            <div>
              <Label htmlFor="zip">מיקוד</Label>
              <Input
                id="zip"
                value={details.zip}
                onChange={(e) => setDetails({ ...details, zip: e.target.value })}
                placeholder="12345"
              />
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="newsletter"
              checked={details.newsletter}
              onCheckedChange={(checked) => 
                setDetails({ ...details, newsletter: checked as boolean })
              }
            />
            <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
              קראתי את <button type="button" className="text-blue-600 hover:underline">המדיניות</button> ואודות המוצרים והמבצעים באימייל והטלפון
            </Label>
          </div>

          {/* שמור פרטים */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="saveDetails"
              checked={details.saveDetails}
              onCheckedChange={(checked) => 
                setDetails({ ...details, saveDetails: checked as boolean })
              }
            />
            <Label htmlFor="saveDetails" className="text-sm font-normal cursor-pointer">
              שמור את הפרטים שלי למילוי מהיר בפעם הבאה
            </Label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12"
        >
          המשך לתשלום
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          לחיצה על "המשך לתשלום" מהווה הסכמה ל<button type="button" className="text-blue-600 hover:underline">תנאי השירות</button> ול<button type="button" className="text-blue-600 hover:underline">מדיניות הפרטיות</button>
        </p>
      </form>
    </Card>
  )
}
