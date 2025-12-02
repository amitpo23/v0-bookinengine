import { BookingWidget } from "@/components/booking/booking-widget"
import { mockHotel } from "@/lib/mock-data"
import type { Locale } from "@/lib/i18n/translations"

interface EmbedPageProps {
  params: Promise<{ hotelId: string }>
  searchParams: Promise<{
    primaryColor?: string
    locale?: string
    compact?: string
  }>
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { hotelId } = await params
  const { primaryColor, locale, compact } = await searchParams

  // In production, fetch hotel data based on hotelId
  const hotel = {
    ...mockHotel,
    id: hotelId,
    primaryColor: primaryColor || mockHotel.primaryColor,
  }

  const defaultLocale: Locale = locale === "en" || locale === "he" ? locale : "he"

  return (
    <div className="min-h-screen">
      <BookingWidget hotel={hotel} defaultLocale={defaultLocale} />
    </div>
  )
}
