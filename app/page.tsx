import { BookingWidget } from "@/components/booking/booking-widget"
import { mockHotel } from "@/lib/mock-data"

export default function Home() {
  return <BookingWidget hotel={mockHotel} />
}
