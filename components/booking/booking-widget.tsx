"use client"

import { useState } from "react"
import { BookingProvider, useBooking } from "@/lib/booking-context"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import type { Hotel, GuestDetails } from "@/types/booking"
import type { Locale } from "@/lib/i18n/translations"
import { SearchForm } from "./search-form"
import { RoomCard } from "./room-card"
import { BookingSummary } from "./booking-summary"
import { GuestForm } from "./guest-form"
import { StripePaymentForm } from "./stripe-payment-form"
import { Confirmation } from "./confirmation"
import { BookingSteps } from "./booking-steps"
import { LanguageSwitcher } from "./language-switcher"
import { HotelSearchResults } from "./hotel-search-results"
import { mockHotel, mockRooms } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginButton } from '@/components/auth/login-button'

// ... existing icon components ...
const ArrowRightIcon = ({ className }: { className?: string }) => (
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
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
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

const LoaderIcon = ({ className }: { className?: string }) => (
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

function BookingWidgetContent() {
  const {
    hotel,
    currentStep,
    setCurrentStep,
    guestDetails,
    setGuestDetails,
    selectedRooms,
    searchResults,
    isSearching,
    searchError,
    preBookError,
    apiBookingData,
    bookingConfirmation,
    setBookingConfirmation,
  } = useBooking()
  const { t, locale, dir } = useI18n()

  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const handleGuestSubmit = async (details: GuestDetails) => {
    setGuestDetails(details)
    setCurrentStep(4)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentIntentId(paymentId)
    setIsBooking(true)
    setBookingError(null)

    try {
      if (apiBookingData?.prebookToken) {
        const response = await fetch("/api/booking/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: apiBookingData.code,
            token: apiBookingData.prebookToken,
            preBookId: apiBookingData.preBookId,
            dateFrom: apiBookingData.dateFrom,
            dateTo: apiBookingData.dateTo,
            hotelId: apiBookingData.hotelId,
            adults: apiBookingData.adults || 2,
            children: apiBookingData.children || [],
            customer: {
              title: guestDetails?.title || "MR",
              firstName: guestDetails?.firstName || "Guest",
              lastName: guestDetails?.lastName || "User",
              email: guestDetails?.email || "guest@example.com",
              phone: guestDetails?.phone || "",
              country: "IL",
              city: "",
              address: "",
              zip: "",
            },
            voucherEmail: guestDetails?.email || "guest@example.com",
            agencyReference: paymentId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Booking failed")
        }

        setBookingConfirmation({
          confirmationCode: data.bookingId || `BK${Date.now().toString(36).toUpperCase()}`,
          bookingId: data.bookingId || paymentId,
        })
        setConfirmationNumber(data.bookingId || `BK${Date.now().toString(36).toUpperCase()}`)
      } else {
        // Fallback for non-API bookings
        setConfirmationNumber(`BK${Date.now().toString(36).toUpperCase()}`)
      }

      setCurrentStep(5)
    } catch (error: any) {
      console.error("Booking error:", error)
      setBookingError(error.message || "Failed to complete booking")
      alert(error.message || "Failed to complete booking")
    } finally {
      setIsBooking(false)
    }
  }

  const BackArrow = dir === "rtl" ? ArrowRightIcon : ArrowLeftIcon
  const backText = locale === "he" ? "חזרה" : "Back"
  const selectDatesText =
    locale === "he"
      ? "הזינו יעד, תאריכים ומספר אורחים לחיפוש זמינות"
      : "Enter destination, dates and number of guests to search availability"
  const availableRoomsText = locale === "he" ? "תוצאות חיפוש" : "Search Results"
  const termsText = locale === "he" ? "תנאי שימוש" : "Terms of Use"
  const privacyText = locale === "he" ? "מדיניות פרטיות" : "Privacy Policy"
  const contactText = locale === "he" ? "צור קשר" : "Contact Us"
  const rightsText = locale === "he" ? "כל הזכויות שמורות" : "All rights reserved"
  const poweredByText = locale === "he" ? "מופעל על ידי" : "Powered by"

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">
                  {locale === "he" ? "מנוע הזמנות" : "Booking Engine"}
                </h1>
                <span className="text-sm text-muted-foreground">{poweredByText} BookingEngine</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {currentStep > 1 && currentStep < 5 && (
                <Button variant="outline" size="default" onClick={() => setCurrentStep(currentStep - 1)}>
                  <BackArrow className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  {backText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 lg:px-12 py-8">
        {/* Steps - גדול יותר ובולט */}
        {currentStep < 5 && (
          <div className="mb-8">
            <BookingSteps currentStep={currentStep} />
          </div>
        )}

        {(searchError || preBookError || bookingError) && (
          <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{searchError || preBookError || bookingError}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Search - full width */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 lg:p-8">
              <SearchForm />
            </div>
            {isSearching ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-lg border border-border">
                <LoaderIcon className="h-12 w-12 animate-spin mx-auto text-primary mb-6" />
                <p className="text-lg text-muted-foreground">
                  {locale === "he" ? "מחפש מלונות זמינים..." : "Searching available hotels..."}
                </p>
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">{selectDatesText}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main content - takes most space */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6 lg:p-8">
                <SearchForm />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">{availableRoomsText}</h2>
                {searchResults.length > 0 && (
                  <span className="text-muted-foreground">
                    {locale === "he" ? `נמצאו ${searchResults.length} מלונות` : `Found ${searchResults.length} hotels`}
                  </span>
                )}
              </div>

              {isSearching ? (
                <div className="text-center py-16 bg-card rounded-2xl shadow-lg border border-border">
                  <LoaderIcon className="h-12 w-12 animate-spin mx-auto text-primary mb-6" />
                  <p className="text-lg text-muted-foreground">{locale === "he" ? "מחפש..." : "Searching..."}</p>
                </div>
              ) : searchResults.length > 0 ? (
                <HotelSearchResults results={searchResults} />
              ) : (
                <div className="space-y-6">
                  {mockRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - sticky */}
            <div className="xl:w-96 xl:flex-shrink-0">
              <div className="xl:sticky xl:top-28">
                <BookingSummary />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6 lg:p-8">
                <GuestForm onSubmit={handleGuestSubmit} />
              </div>
            </div>
            <div className="xl:w-96 xl:flex-shrink-0">
              <div className="xl:sticky xl:top-28">
                              <div className="mb-6 text-center">
                <LoginButton />
              </div>
                <BookingSummary showContinue={false} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6 lg:p-8">
                <StripePaymentForm onSuccess={handlePaymentSuccess} />
                {isBooking && (
                  <div className="mt-6 text-center">
                    <LoaderIcon className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
                    <p className="text-muted-foreground">
                      {locale === "he" ? "משלים את ההזמנה..." : "Completing your booking..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="xl:w-96 xl:flex-shrink-0">
              <div className="xl:sticky xl:top-28">
                <BookingSummary showContinue={false} />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="max-w-3xl mx-auto">
            <Confirmation confirmationNumber={confirmationNumber} paymentIntentId={paymentIntentId} />
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="w-full px-6 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Booking Engine. {rightsText}.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">
                {termsText}
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                {privacyText}
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                {contactText}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function BookingWidget({ hotel, defaultLocale = "he" }: { hotel?: Hotel; defaultLocale?: Locale }) {
  return (
    <I18nProvider defaultLocale={defaultLocale}>
      <BookingProvider initialHotel={hotel || mockHotel}>
        <BookingWidgetContent />
      </BookingProvider>
    </I18nProvider>
  )
}
