"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const AlertCircleIcon = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const Loader2Icon = ({ className }: { className?: string }) => (
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { hotel, totalPrice } = useBooking()
  const { t, locale, dir } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const taxes = totalPrice * 0.17
  const grandTotal = totalPrice + taxes

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    if (!agreed) {
      setError(t("mustAgreeTerms"))
      return
    }

    setIsProcessing(true)
    setError(null)

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/confirmation`,
      },
      redirect: "if_required",
    })

    if (submitError) {
      setError(submitError.message || t("paymentError"))
      onError(submitError.message || "Payment failed")
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} dir={dir}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            {t("securePayment")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-background">
            <PaymentElement
              options={{ layout: "tabs", defaultValues: { billingDetails: { address: { country: "IL" } } } }}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <ShieldIcon className="h-8 w-8 text-green-600 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{t("securePaymentStripe")}</p>
              <p className="text-muted-foreground">{t("encryptedSecure")}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            <img src="/visa-card-logo.png" alt="Visa" className="h-6" />
            <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
            <img src="/generic-credit-card-logo.png" alt="Amex" className="h-6" />
            <img src="/apple-pay-logo.png" alt="Apple Pay" className="h-6" />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => {
                setAgreed(checked === true)
                if (error === t("mustAgreeTerms")) setError(null)
              }}
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                {t("termsAgree")}
                <a href="#" className="text-primary hover:underline mx-1">
                  {t("bookingTerms")}
                </a>
                {t("and")}
                <a href="#" className={`text-primary hover:underline ${dir === "rtl" ? "mr-1" : "ml-1"}`}>
                  {t("cancellationPolicy")}
                </a>
              </Label>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("vat")}</span>
                <span>{formatPrice(taxes)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-lg font-medium">{t("totalToPay")}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isProcessing || !stripe || !elements}>
              {isProcessing ? (
                <>
                  <Loader2Icon className={`h-4 w-4 animate-spin ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  {t("processingPayment")}
                </>
              ) : (
                <>
                  <LockIcon className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  {t("pay")} {formatPrice(grandTotal)}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void
}

export function StripePaymentForm({ onSuccess }: StripePaymentFormProps) {
  const { hotel, totalPrice, guestDetails, selectedRooms, search, nights } = useBooking()
  const { t, locale } = useI18n()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const taxes = totalPrice * 0.17
  const grandTotal = totalPrice + taxes

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: hotel?.currency || "ILS",
            customerEmail: guestDetails?.email,
            customerName: `${guestDetails?.firstName} ${guestDetails?.lastName}`,
            metadata: {
              hotel_id: hotel?.id,
              hotel_name: hotel?.name,
              check_in: search.checkIn?.toISOString(),
              check_out: search.checkOut?.toISOString(),
              nights: nights,
              rooms: selectedRooms.map((r) => r.room.name).join(", "),
              guest_email: guestDetails?.email,
              guest_phone: guestDetails?.phone,
            },
          }),
        })

        const data = await response.json()
        if (data.error) {
          setError(data.error)
        } else {
          setClientSecret(data.clientSecret)
        }
      } catch (err) {
        setError(t("paymentFormError"))
      } finally {
        setIsLoading(false)
      }
    }

    if (grandTotal > 0) createPaymentIntent()
  }, [grandTotal, hotel, guestDetails, search, nights, selectedRooms, t])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("loadingPaymentForm")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) return null

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0066cc",
            colorBackground: "#ffffff",
            colorText: "#1a1a1a",
            colorDanger: "#dc2626",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "8px",
          },
          rules: {
            ".Input": { border: "1px solid #e5e7eb", boxShadow: "none" },
            ".Input:focus": { border: "1px solid #0066cc", boxShadow: "0 0 0 1px #0066cc" },
          },
        },
        locale: locale === "he" ? "he" : "en",
      }}
    >
      <CheckoutForm onSuccess={onSuccess} onError={setError} />
    </Elements>
  )
}
