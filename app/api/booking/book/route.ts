import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"
import { BookingSchema } from "@/lib/validation/schemas"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { applyRateLimit, RateLimitConfig } from "@/lib/rate-limit"
import { bookingRepository } from "@/lib/db/booking-repository"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()

    // Validate input with Zod
    const validated = BookingSchema.parse(body)

    logger.debug("Calling apiClient.book", {
      hotelId: validated.hotelId,
      preBookId: validated.preBookId,
      customerName: `${validated.customer.firstName} ${validated.customer.lastName}`,
    })

    const result = await apiClient.book({
      code: validated.code,
      token: validated.token,
      preBookId: validated.preBookId,
      dateFrom: validated.dateFrom,
      dateTo: validated.dateTo,
      hotelId: validated.hotelId,
      adults: validated.adults,
      children: validated.children,
      customer: validated.customer,
      voucherEmail: validated.voucherEmail,
      agencyReference: validated.agencyReference,
    })

    logger.debug("Booking result received", {
      success: result.success,
      bookingId: result.bookingId,
      status: result.status,
    })

    if (!result.success) {
      logger.warn("Booking failed from Medici API", { error: result.error })

      // Log failed booking attempt in audit
      await bookingRepository.createAuditLog({
        action: "BOOK",
        status: "FAILED",
        apiUsed: result.apiSource || "medici-direct",
        requestData: validated,
        responseData: result,
        errorMessage: result.error,
        userEmail: validated.customer.email,
      })

      const duration = Date.now() - startTime
      logger.apiResponse("POST", "/api/booking/book", 400, duration)

      return NextResponse.json({ error: result.error || "Booking failed" }, { status: 400 })
    }

    // ✅ Medici API booking succeeded - now save to database
    // IMPORTANT: Database save happens AFTER Medici API success
    // DB errors should NOT fail the booking (only logged)
    try {
      // Calculate nights
      const dateFrom = new Date(validated.dateFrom)
      const dateTo = new Date(validated.dateTo)
      const nights = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))

      // Save booking to database
      await bookingRepository.saveBooking({
        mediciBookingId: result.bookingId || `${Date.now()}`,
        preBookId: validated.preBookId?.toString(),
        supplierReference: result.supplierReference,

        hotelId: validated.hotelId,
        hotelName: result.hotelName || "Unknown Hotel",
        roomName: result.roomName || "Unknown Room",
        roomCode: validated.code,

        dateFrom: validated.dateFrom,
        dateTo: validated.dateTo,
        nights,

        customerEmail: validated.customer.email,
        customerTitle: validated.customer.title,
        customerFirstName: validated.customer.firstName,
        customerLastName: validated.customer.lastName,
        customerPhone: validated.customer.phone,
        customerCountry: validated.customer.country,
        customerCity: validated.customer.city,
        customerAddress: validated.customer.address,
        customerZip: validated.customer.zip,

        adults: validated.adults,
        childrenAges: validated.children,

        currency: result.currency || "EUR",
        totalPrice: result.totalPrice || 0,
        pricePerNight: result.pricePerNight,

        status: "CONFIRMED",
        apiSource: result.apiSource || "medici-direct",

        voucherEmail: validated.voucherEmail,
        agencyReference: validated.agencyReference,

        mediciResponse: result,
      })

      // Create audit log
      await bookingRepository.createAuditLog({
        action: "BOOK",
        status: "SUCCESS",
        apiUsed: result.apiSource || "medici-direct",
        requestData: validated,
        responseData: result,
        userEmail: validated.customer.email,
      })

      // Enqueue confirmation email
      await bookingRepository.enqueueEmail({
        to: validated.customer.email,
        subject: "Booking Confirmation",
        emailType: "BOOKING_CONFIRMATION",
        templateData: {
          bookingId: result.bookingId,
          customerName: `${validated.customer.firstName} ${validated.customer.lastName}`,
          hotelName: result.hotelName,
          dateFrom: validated.dateFrom,
          dateTo: validated.dateTo,
          nights,
        },
      })
    } catch (dbError) {
      // CRITICAL: Database errors should NOT fail the booking
      // Medici API already succeeded - this is just for history
      logger.error("[DB] Failed to save booking (non-critical - booking still succeeded)", {
        mediciBookingId: result.bookingId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })
    }

    const duration = Date.now() - startTime
    logger.apiResponse("POST", "/api/booking/book", 200, duration)

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
    })
  } catch (error: any) {
    console.error("Book API Error:", error.message)
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 })
  }
}
