import { type NextRequest, NextResponse } from "next/server"
import { voucherGenerator } from "@/lib/pdf/voucher-generator"
import { logger } from "@/lib/logger"
import { bookingRepository } from "@/lib/db/booking-repository"

/**
 * POST /api/voucher/generate
 * Generate PDF voucher for a booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 })
    }

    logger.info("[Voucher API] Generating voucher", { bookingId })

    // Get booking from database
    const booking = await bookingRepository.getBookingByMediciId(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Generate PDF voucher
    const pdfData = voucherGenerator.generateVoucher({
      bookingId: booking.mediciBookingId,
      supplierReference: booking.supplierReference || "",
      customerName: `${booking.customerFirstName} ${booking.customerLastName}`,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      hotelName: booking.hotelName,
      roomType: booking.roomName,
      checkIn: booking.dateFrom.toISOString().split("T")[0],
      checkOut: booking.dateTo.toISOString().split("T")[0],
      nights: booking.nights,
      adults: booking.adults,
      children: booking.childrenAges.length,
      totalPrice: Number(booking.totalPrice),
      currency: booking.currency,
      language: "en", // TODO: Get from booking metadata
    })

    logger.info("[Voucher API] ✅ Voucher generated", { bookingId })

    return NextResponse.json({
      success: true,
      pdfData, // Base64 encoded PDF
      filename: `voucher-${bookingId}.pdf`,
    })
  } catch (error: any) {
    logger.error("[Voucher API] Error", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate voucher",
      },
      { status: 500 }
    )
  }
}
