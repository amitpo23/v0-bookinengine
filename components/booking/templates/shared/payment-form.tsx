"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock, Shield } from "lucide-react"

interface PaymentFormProps {
  totalPrice: number
  currency: string
  onSubmit: () => void
  isLoading?: boolean
  variant?: "default" | "dark" | "luxury" | "family"
}

export function PaymentForm({ totalPrice, currency, onSubmit, isLoading, variant = "default" }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (agreed) {
      onSubmit()
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const containerClass =
    variant === "dark"
      ? "bg-zinc-800/50 border-zinc-700"
      : variant === "luxury"
        ? "bg-stone-50 border-stone-200"
        : variant === "family"
          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
          : "bg-card border"

  const inputClass =
    variant === "dark"
      ? "bg-zinc-800 border-zinc-700 text-white"
      : variant === "luxury"
        ? "border-stone-300"
        : variant === "family"
          ? "border-purple-200 rounded-xl"
          : ""

  const buttonClass =
    variant === "dark"
      ? "bg-cyan-500 hover:bg-cyan-600 text-black"
      : variant === "luxury"
        ? "bg-amber-600 hover:bg-amber-700"
        : variant === "family"
          ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl"
          : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h4 className="font-medium text-blue-900">מצב בדיקה (Demo Mode)</h4>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          ⚡ זוהי הזמנת בדיקה - לא יחויב תשלום אמיתי
          <br />
          📧 יישלח מייל אישור להדגמה
        </p>
      </div>

      <div className={`p-6 rounded-lg border ${containerClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5" />
          <h3 className="font-semibold">פרטי כרטיס אשראי</h3>
          <div className="flex-1" />
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-600">מאובטח SSL</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>מספר כרטיס</Label>
            <Input
              className={inputClass}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>שם בעל הכרטיס</Label>
            <Input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="כפי שמופיע על הכרטיס"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>תוקף</Label>
              <Input
                className={inputClass}
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>CVV</Label>
              <Input
                className={inputClass}
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="***"
                maxLength={4}
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
        <label htmlFor="terms" className="text-sm">
          קראתי ואני מסכים/ה ל
          <a href="#" className="text-primary underline">
            תנאי השימוש
          </a>{" "}
          ול
          <a href="#" className="text-primary underline">
            מדיניות הביטולים
          </a>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <div className="text-sm text-muted-foreground">סה״כ לתשלום</div>
          <div className="text-2xl font-bold">
            {currency === "ILS" ? "₪" : "$"}
            {totalPrice.toLocaleString()}
          </div>
        </div>
        <Shield className="w-8 h-8 text-green-600" />
      </div>

      <Button type="submit" className={`w-full h-12 text-lg ${buttonClass}`} disabled={isLoading || !agreed}>
        {isLoading ? "מעבד תשלום..." : "אשר הזמנה ושלם"}
      </Button>
    </form>
  )
}
