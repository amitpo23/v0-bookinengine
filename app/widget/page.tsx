"use client"

import { BookingWidget } from "@/components/booking/booking-widget"
import { HotelConfigProvider } from "@/lib/hotel-config-context"
import { I18nProvider } from "@/lib/i18n/context"

export default function WidgetPage() {
  return (
    <HotelConfigProvider>
      <I18nProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
          <div className="max-w-4xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </I18nProvider>
    </HotelConfigProvider>
  )
}
