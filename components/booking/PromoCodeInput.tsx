"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Tag, Check, X } from "lucide-react"
import { trackPromoCodeApplied } from "@/lib/analytics/google-analytics"

interface PromoCodeInputProps {
  orderAmount: number
  template?: string
  onApply: (discount: {
    id: string
    code: string
    description: string
    discountAmount: number
    newTotal: number
  }) => void
  onRemove: () => void
  appliedCode?: {
    code: string
    discountAmount: number
  }
}

export function PromoCodeInput({
  orderAmount,
  template,
  onApply,
  onRemove,
  appliedCode,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) {
      setError("נא להזין קוד פרומו")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          orderAmount,
          template,
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setSuccess(true)
        onApply({
          id: data.promoCode.id,
          code: data.promoCode.code,
          description: data.promoCode.description,
          discountAmount: data.promoCode.discountAmount,
          newTotal: data.newTotal,
        })

        // Track in GA4
        trackPromoCodeApplied({
          code: data.promoCode.code,
          discountAmount: data.promoCode.discountAmount,
          discountType: data.promoCode.discountType,
        })
      } else {
        setError(data.error || "קוד לא תקין")
      }
    } catch (err: any) {
      setError("שגיאה בבדיקת הקוד")
      console.error("Promo validation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCode("")
    setSuccess(false)
    setError("")
    onRemove()
  }

  if (appliedCode) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                קוד פרומו הוחל
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                {appliedCode.code} • חיסכת {appliedCode.discountAmount.toFixed(2)}₪
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        קוד פרומו (אופציונלי)
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="הזן קוד פרומו"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError("")
            setSuccess(false)
          }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "החל"
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" />
          קוד פרומו הוחל בהצלחה!
        </div>
      )}
    </div>
  )
}
