"use client"

import type React from "react"
import { useState } from "react"
import { useBooking } from "@/lib/booking-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
)

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
)

interface PaymentFormProps {
  onSubmit: () => void
  isProcessing: boolean
}

export function PaymentForm({ onSubmit, isProcessing }: PaymentFormProps) {
  const { hotel, totalPrice } = useBooking()
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const taxes = totalPrice * 0.17
  const grandTotal = totalPrice + taxes

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
    if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2, 4)
    return v
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) newErrors.cardNumber = "מספר כרטיס לא תקין"
    if (!expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = "תוקף לא תקין"
    if (!cvv.match(/^\d{3,4}$/)) newErrors.cvv = "CVV לא תקין"
    if (!cardName.trim()) newErrors.cardName = "שדה חובה"
    if (!agreed) newErrors.agreed = "יש לאשר את תנאי ההזמנה"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            פרטי תשלום
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">מספר כרטיס אשראי</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                dir="ltr"
                className={errors.cardNumber ? "border-destructive" : ""}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                <img src="/visa-card-logo.png" alt="Visa" className="h-5" />
                <img src="/mastercard-logo.png" alt="MC" className="h-5" />
              </div>
            </div>
            {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">תוקף</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                dir="ltr"
                className={errors.expiry ? "border-destructive" : ""}
              />
              {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
                dir="ltr"
                type="password"
                className={errors.cvv ? "border-destructive" : ""}
              />
              {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">שם בעל הכרטיס</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="ISRAEL ISRAELI"
              dir="ltr"
              className={errors.cardName ? "border-destructive" : ""}
            />
            {errors.cardName && <p className="text-xs text-destructive">{errors.cardName}</p>}
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <ShieldIcon className="h-8 w-8 text-green-600" />
            <div className="text-sm">
              <p className="font-medium">תשלום מאובטח</p>
              <p className="text-muted-foreground">הפרטים שלך מוצפנים ומאובטחים בתקן PCI-DSS</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                קראתי ואני מסכים/ה ל
                <a href="#" className="text-primary hover:underline">
                  תנאי ההזמנה
                </a>{" "}
                ול
                <a href="#" className="text-primary hover:underline">
                  מדיניות הביטולים
                </a>
              </Label>
              {errors.agreed && <p className="text-xs text-destructive">{errors.agreed}</p>}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">סה״כ לתשלום</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">◌</span>מעבד תשלום...
                </>
              ) : (
                <>
                  <LockIcon className="h-4 w-4 mr-2" />
                  אשר והזמן
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
