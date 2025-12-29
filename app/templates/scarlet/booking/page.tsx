"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { he } from "date-fns/locale"
import { Calendar, Users, Heart, ChevronLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { scarletRoomTypes, scarletHotelConfig } from "@/lib/hotels/scarlet-config"
import { LoyaltyBadge } from "@/components/promotions/loyalty-badge"
import { trackEvent, trackPageView } from "@/lib/analytics/ga4"
import { GuestDetailsForm } from "@/components/booking/templates/shared/guest-details-form"
import { PaymentForm } from "@/components/booking/templates/shared/payment-form"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/booking/language-switcher"
import Link from "next/link"

type Addon = {
  id: string
  name: string
  price: number
}

function ScarletBookingContent() {
  const { t, locale, dir } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get params from URL
  const roomTypeParam = searchParams.get('room')
  const checkInParam = searchParams.get('checkIn')
  const checkOutParam = searchParams.get('checkOut')
  const guestsParam = searchParams.get('guests')
  
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedRoom] = useState(roomTypeParam || '')
  const [checkIn] = useState<Date>(
    checkInParam ? new Date(checkInParam) : addDays(new Date(), 1)
  )
  const [checkOut] = useState<Date>(
    checkOutParam ? new Date(checkOutParam) : addDays(new Date(), 3)
  )
  const [guests] = useState<number>(guestsParam ? parseInt(guestsParam) : 2)
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([])
  const [guestDetails, setGuestDetails] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roomType = scarletRoomTypes.find(r => r.id === selectedRoom)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  const roomTotal = roomType ? roomType.basePrice * nights : 0
  const addonsTotal = selectedAddons.reduce((sum: number, addon: Addon) => sum + addon.price, 0)
  const total = roomTotal + addonsTotal

  useEffect(() => {
    trackPageView('/templates/scarlet/booking')
    trackEvent({
      event: 'booking_started',
      booking_room: selectedRoom,
    })
  }, [selectedRoom])

  useEffect(() => {
    const title = locale === 'he' 
      ? `הזמנת חדר - ${scarletHotelConfig.hebrewName}`
      : `Room Booking - Scarlet Hotel Tel Aviv`
    document.title = title
  }, [locale])

  const handleContinue = () => {
    if (bookingStep === 1) {
      trackEvent({
        event: 'addons_selected',
        addon_count: selectedAddons.length,
      })
    }
    setBookingStep(bookingStep + 1)
  }

  const handleBack = () => {
    setBookingStep(bookingStep - 1)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate booking
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setBookingStep(4)
      
      trackEvent({
        event: 'purchase',
        transaction_id: `SCARLET-${Date.now()}`,
        value: total,
      })
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!roomType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-900/80 border-red-500/30 p-8 max-w-md text-center">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-assistant)' }}>
            לא נבחר חדר
          </h1>
          <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
            אנא בחר חדר מהמלון תחילה
          </p>
          <Link href="/templates/scarlet">
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              {t('backToTemplates')}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/templates/scarlet" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-assistant)' }}>
                {scarletHotelConfig.hebrewName}
              </h1>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('completeBooking')}
              </p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  bookingStep >= step
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 h-1 ${
                    bookingStep > step ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-gradient-to-b from-gray-900 to-black border-red-500/20 p-6">
              {bookingStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                    {t('addons')}
                  </h2>
                  <div className="text-gray-300 mb-6">
                    <p>בחר תוספות מיוחדות להזמנה שלך</p>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Link href="/templates/scarlet">
                      <Button variant="outline" className="border-red-500/30">
                        <ChevronLeft className="ml-2 h-5 w-5" />
                        {t('back')}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      {t('continueToPayment')}
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                    {t('guestDetails')}
                  </h2>
                  <GuestDetailsForm
                    onSubmit={(details) => {
                      setGuestDetails(details)
                      handleContinue()
                    }}
                    isLoading={false}
                  />
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full mt-4 border-red-500/30"
                  >
                    <ChevronLeft className="ml-2 h-5 w-5" />
                    {t('back')}
                  </Button>
                </div>
              )}

              {bookingStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-assistant)' }}>
                    {t('paymentDetails')}
                  </h2>
                  <PaymentForm
                    totalPrice={total}
                    currency="ILS"
                    onSubmit={handleFinalSubmit}
                    isLoading={isSubmitting}
                  />
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full mt-4 border-red-500/30"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="ml-2 h-5 w-5" />
                    {t('back')}
                  </Button>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="text-center py-12">
                  <div className="mb-8">
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold text-white mb-2">{t('bookingConfirmed')}</h2>
                    <p className="text-gray-300 text-lg">ההזמנה שלך בוצעה בהצלחה!</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-right space-y-4 mb-8 max-w-2xl mx-auto">
                    <div className="flex justify-between pb-4 border-b border-white/10">
                      <span className="text-gray-400">{t('bookingNumber')}</span>
                      <span className="text-white font-bold">SCARLET-{Date.now()}</span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-white/10">
                      <span className="text-gray-400">{t('room')}</span>
                      <span className="text-white font-bold">{roomType.hebrewName}</span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-white/10">
                      <span className="text-gray-400">{t('dates')}</span>
                      <span className="text-white font-bold">
                        {format(checkIn, 'd בMMM', { locale: he })} - {format(checkOut, 'd בMMM yyyy', { locale: he })}
                      </span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-white/10">
                      <span className="text-gray-400">{t('nights')}</span>
                      <span className="text-white font-bold">{nights}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-400 text-lg">{t('totalPaid')}</span>
                      <span className="text-green-400 font-bold text-2xl">{total} ₪</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push('/templates/scarlet')}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-6"
                  >
                    <Heart className="ml-2" />
                    חזור למלון
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="bg-gradient-to-b from-gray-900 to-black border-red-500/20 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-assistant)' }}>
                {t('bookingSummary')}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">{t('room')}</p>
                    <p className="font-semibold text-white">{roomType.hebrewName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">{t('dates')}</p>
                    <p className="font-semibold text-white">
                      {format(checkIn, 'd בMMM', { locale: he })} - {format(checkOut, 'd בMMM', { locale: he })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">{t('guests')}</p>
                    <p className="font-semibold text-white">{guests} {t('guests')}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>{roomType.hebrewName} × {nights} {t('nights')}</span>
                  <span className="font-semibold">₪{roomTotal.toLocaleString()}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>{t('addons')} ({selectedAddons.length})</span>
                    <span className="font-semibold">₪{addonsTotal.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>{t('totalToPay')}</span>
                    <span className="text-red-500">₪{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mt-4 bg-gray-900/80 border-red-500/30 p-4">
              <div className="text-center text-gray-300 text-sm">
                <Sparkles className="h-5 w-5 mx-auto mb-2 text-red-400" />
                קוד הנחה זמין בצעד התשלום
              </div>
            </Card>

            <Card className="mt-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-4">
              <LoyaltyBadge hotelId={scarletHotelConfig.hotelId} variant="luxury" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScarletBookingPage() {
  return (
    <I18nProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }>
        <ScarletBookingContent />
      </Suspense>
    </I18nProvider>
  )
}

export default ScarletBookingPage
