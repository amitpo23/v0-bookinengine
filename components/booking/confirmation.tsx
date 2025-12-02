"use client"

import { formatDate } from "@/lib/date-utils"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
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
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const MoonIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
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
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const PrinterIcon = ({ className }: { className?: string }) => (
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
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
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

interface ConfirmationProps {
  confirmationNumber: string
  paymentIntentId?: string
}

export function Confirmation({ confirmationNumber, paymentIntentId }: ConfirmationProps) {
  const { hotel, search, selectedRooms, guestDetails, nights, totalPrice } = useBooking()
  const { t, locale, dir } = useI18n()

  const taxes = totalPrice * 0.17
  const grandTotal = totalPrice + taxes
  const nightsText = nights === 1 ? t("night") : t("nights")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: hotel?.currency || "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getWeekday = (date: Date) => {
    return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", { weekday: "long" })
  }

  return (
    <div className="max-w-2xl mx-auto" dir={dir}>
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("bookingConfirmed")}</h1>
        <p className="text-muted-foreground">
          {t("confirmationSent")} <span className="font-medium">{guestDetails?.email}</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Badge variant="secondary" className="gap-1">
            <CreditCardIcon className="h-3 w-3" />
            {t("paidViaStripe")}
          </Badge>
        </div>
      </div>

      {/* Confirmation Number */}
      <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t("confirmationNumber")}</p>
          <p className="text-3xl font-bold text-primary tracking-wider">{confirmationNumber}</p>
          {paymentIntentId && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("paymentId")} {paymentIntentId.slice(0, 20)}...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Hotel Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{hotel?.name}</h2>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">
                  {hotel?.address}, {hotel?.city}
                </span>
              </div>
            </div>
            <div className="flex">
              {Array.from({ length: hotel?.stars || 0 }).map((_, i) => (
                <span key={i} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Stay Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">{t("checkIn")}</span>
              </div>
              <p className="font-semibold">{getWeekday(search.checkIn)}</p>
              <p className="text-sm">{formatDate(search.checkIn, locale)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("from")}
                {hotel?.policies.checkIn}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <MoonIcon className="h-4 w-4" />
                <span className="text-sm">{t("stayDuration")}</span>
              </div>
              <p className="text-2xl font-bold">{nights}</p>
              <p className="text-sm">{nightsText}</p>
            </div>
            <div className={dir === "rtl" ? "text-left" : "text-right"}>
              <div
                className={`flex items-center gap-2 text-muted-foreground mb-1 ${dir === "rtl" ? "justify-start" : "justify-end"}`}
              >
                <span className="text-sm">{t("checkOut")}</span>
                <CalendarIcon className="h-4 w-4" />
              </div>
              <p className={`font-semibold ${dir === "rtl" ? "text-left" : "text-right"}`}>
                {getWeekday(search.checkOut)}
              </p>
              <p className={`text-sm ${dir === "rtl" ? "text-left" : "text-right"}`}>
                {formatDate(search.checkOut, locale)}
              </p>
              <p className={`text-xs text-muted-foreground mt-1 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                {t("until")} {hotel?.policies.checkOut}
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Rooms */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              {t("bookedRooms")}
            </h3>
            <div className="space-y-3">
              {selectedRooms.map((sr) => (
                <div
                  key={`${sr.room.id}-${sr.ratePlan.id}`}
                  className="flex justify-between items-start bg-muted/30 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {sr.quantity}x {sr.room.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{sr.ratePlan.name}</p>
                  </div>
                  <p className="font-medium">{formatPrice(sr.ratePlan.price * sr.quantity * nights)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Guest Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">{t("guestDetails")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("guestName")}</p>
                <p className="font-medium">
                  {guestDetails?.firstName} {guestDetails?.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("email")}</p>
                <p className="font-medium flex items-center gap-1">
                  <MailIcon className="h-3 w-3" />
                  {guestDetails?.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("phone")}</p>
                <p className="font-medium flex items-center gap-1">
                  <PhoneIcon className="h-3 w-3" />
                  {guestDetails?.phone}
                </p>
              </div>
              {guestDetails?.arrivalTime && (
                <div>
                  <p className="text-muted-foreground">{t("estimatedArrival")}</p>
                  <p className="font-medium">{guestDetails.arrivalTime}</p>
                </div>
              )}
            </div>
            {guestDetails?.specialRequests && (
              <div className="mt-3">
                <p className="text-muted-foreground text-sm">{t("specialRequests")}</p>
                <p className="text-sm bg-muted/30 p-2 rounded mt-1">{guestDetails.specialRequests}</p>
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Pricing Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("totalRooms")}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("vat")}</span>
              <span>{formatPrice(taxes)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("totalPaid")}</span>
              <span className="text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.print()}>
          <PrinterIcon className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
          {t("printConfirmation")}
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <DownloadIcon className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
          {t("downloadPdf")}
        </Button>
      </div>

      {/* Help */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        {t("contactHelp")}{" "}
        <a href="tel:+97235555555" className="text-primary hover:underline">
          03-555-5555
        </a>
      </p>
    </div>
  )
}
