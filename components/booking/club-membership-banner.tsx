"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"

interface ClubMembershipBannerProps {
  savings: number
  regularPrice: number
  clubPrice: number
  onJoin?: () => void
  onLogin?: () => void
}

export function ClubMembershipBanner({ savings, regularPrice, clubPrice, onJoin, onLogin }: ClubMembershipBannerProps) {
  const { locale, dir } = useI18n()
  const [showLoginOptions, setShowLoginOptions] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6" dir={dir}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left side - Club login */}
        <div className="flex-shrink-0">
          <h3 className="font-bold text-amber-900 mb-2">{locale === "he" ? "התחברות לחוג השמש" : "Sun Club Login"}</h3>
          <div className="flex flex-col gap-1">
            <button
              className="text-sm text-blue-600 hover:underline text-start"
              onClick={() => setShowLoginOptions(true)}
            >
              {locale === "he" ? "כניסה עם קוד חד פעמי" : "Login with one-time code"}
            </button>
            <button className="text-sm text-blue-600 hover:underline text-start" onClick={onLogin}>
              {locale === "he" ? "כניסה עם סיסמא" : "Login with password"}
            </button>
          </div>
        </div>

        {/* Center - Offer text */}
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold text-amber-900 mb-1">
            {locale === "he"
              ? "רוצים להצטרף למועדון חוג השמש ולהתחיל לחסוך?"
              : "Want to join the Sun Club and start saving?"}
          </h2>
          <p className="text-amber-800">
            {locale === "he"
              ? `הצטרפות לחוג השמש תחסוך לך ${formatPrice(savings)}`
              : `Joining the Sun Club will save you ${formatPrice(savings)}`}
          </p>
          <button className="text-sm text-blue-600 hover:underline mt-1">
            {locale === "he" ? "לצפייה בהטבות המועדון" : "View club benefits"}
          </button>
        </div>

        {/* Right side - Prices and Join button */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 line-through">{formatPrice(regularPrice)}</p>
            <p className="text-xl font-bold text-amber-900">{formatPrice(clubPrice)}</p>
            <p className="text-xs text-amber-700">{locale === "he" ? "מחיר מועדון" : "Club price"}</p>
          </div>
          <Button onClick={onJoin} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg">
            <div className="text-center">
              <div className="font-bold">{locale === "he" ? "כאן מצטרפים" : "Join here"}</div>
              <div className="text-xs opacity-90">
                {locale === "he" ? 'עלות לשנתיים: 250 ש"ח' : "2-year cost: ₪250"}
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
