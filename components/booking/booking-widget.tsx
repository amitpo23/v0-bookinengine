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
    setGuestDetails,
    selectedRooms,
    searchResults,
    isSearching,
    searchError,
  } = useBooking()
  const { t, locale, dir } = useI18n()

  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")

  const handleGuestSubmit = (details: GuestDetails) => {
    setGuestDetails(details)
    setCurrentStep(4)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentIntentId(paymentId)
    setConfirmationNumber(`BK${Date.now().toString(36).toUpperCase()}`)
    setCurrentStep(5)
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
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  {locale === "he" ? "מנוע הזמנות" : "Booking Engine"}
                </h1>
                <span className="text-xs text-muted-foreground">{poweredByText} Medici Hotels</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {currentStep > 1 && currentStep < 5 && (
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                  <BackArrow className={`h-4 w-4 ${dir === "rtl" ? "ml-1" : "mr-1"}`} />
                  {backText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Steps */}
        {currentStep < 5 && <BookingSteps currentStep={currentStep} />}

        {searchError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Search */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <SearchForm />
            {isSearching ? (
              <div className="text-center py-12">
                <LoaderIcon className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">
                  {locale === "he" ? "מחפש מלונות זמינים..." : "Searching available hotels..."}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{selectDatesText}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Room Selection - Now with API Results */}
        {currentStep === 2 && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <SearchForm />
              <h2 className="text-xl font-bold text-foreground">{availableRoomsText}</h2>

              {isSearching ? (
                <div className="text-center py-12">
                  <LoaderIcon className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">{locale === "he" ? "מחפש..." : "Searching..."}</p>
                </div>
              ) : searchResults.length > 0 ? (
                <HotelSearchResults results={searchResults} />
              ) : (
                <div className="space-y-4">
                  {mockRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </div>
            <div className="lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <BookingSummary />
            </div>
          </div>
        )}

        {/* Step 3: Guest Details */}
        {currentStep === 3 && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <GuestForm onSubmit={handleGuestSubmit} />
            </div>
            <div className="lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <BookingSummary showContinue={false} />
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <StripePaymentForm onSuccess={handlePaymentSuccess} />
            </div>
            <div className="lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <BookingSummary showContinue={false} />
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <Confirmation confirmationNumber={confirmationNumber} paymentIntentId={paymentIntentId} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Booking Engine. {rightsText}.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">
                {termsText}
              </a>
              <a href="#" className="hover:text-foreground">
                {privacyText}
              </a>
              <a href="#" className="hover:text-foreground">
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
