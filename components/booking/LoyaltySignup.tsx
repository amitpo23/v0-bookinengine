"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Crown, Sparkles, Check } from "lucide-react"
import { trackLoyaltyJoin } from "@/lib/analytics/google-analytics"

interface LoyaltySignupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoined: (member: {
    id: string
    tier: string
    discount: number
  }) => void
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
}

export function LoyaltySignup({
  open,
  onOpenChange,
  onJoined,
  email: initialEmail,
  firstName: initialFirstName,
  lastName: initialLastName,
  phone: initialPhone,
}: LoyaltySignupProps) {
  const [email, setEmail] = useState(initialEmail || "")
  const [firstName, setFirstName] = useState(initialFirstName || "")
  const [lastName, setLastName] = useState(initialLastName || "")
  const [phone, setPhone] = useState(initialPhone || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleJoin = async () => {
    if (!email.trim()) {
      setError("נא להזין כתובת אימייל")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/loyalty/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        onJoined({
          id: data.member.id,
          tier: data.member.membership_tier,
          discount: data.member.discount_percentage,
        })

        // Track in GA4
        trackLoyaltyJoin({ tier: data.member.membership_tier })

        onOpenChange(false)
      } else {
        setError(data.error || "שגיאה בהרשמה למועדון")
      }
    } catch (err: any) {
      setError("שגיאה בהרשמה")
      console.error("Loyalty join error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-yellow-500" />
            הצטרף למועדון הלקוחות
          </DialogTitle>
          <DialogDescription>
            קבל הנחות בלעדיות וצבור נקודות עם כל הזמנה
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tiers Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  Bronze
                </Badge>
              </div>
              <p className="text-xs text-orange-900 dark:text-orange-100">5% הנחה</p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-400">
                  Silver
                </Badge>
              </div>
              <p className="text-xs text-gray-900 dark:text-gray-100">10% הנחה</p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-400">
                  Gold
                </Badge>
              </div>
              <p className="text-xs text-yellow-900 dark:text-yellow-100">15% הנחה</p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-300 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-400">
                  Platinum
                </Badge>
              </div>
              <p className="text-xs text-purple-900 dark:text-purple-100">20% הנחה</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>הנחות בלעדיות על כל הזמנה</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>צבירת נקודות למתנות</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>עדכונים על מבצעים מיוחדים</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>שדרוג אוטומטי לדרגה הבאה</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">אימייל *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">שם פרטי</label>
                <Input
                  type="text"
                  placeholder="שם"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">שם משפחה</label>
                <Input
                  type="text"
                  placeholder="משפחה"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">טלפון</label>
              <Input
                type="tel"
                placeholder="05X-XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleJoin}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  הצטרף עכשיו
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
