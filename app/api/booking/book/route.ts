import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { DEMO_MODE, mockBook } from "@/lib/demo/demo-mode"
import { emailService } from "@/lib/email/email-service"
import { format } from "date-fns"

export async function POST(request: NextRequest) {
  try {
    if (DEMO_MODE) {
      const mockResult = await mockBook()
      return NextResponse.json(mockResult)
    }

    const body = await request.json()
    const { jsonRequest } = body

    if (!jsonRequest || typeof jsonRequest !== "string") {
      return NextResponse.json(
        {
          error: "jsonRequest is required - must be from PreBook response",
          received: { jsonRequest: typeof jsonRequest },
        },
        { status: 400 },
      )
    }

    const result = await mediciApi.book({
      jsonRequest,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Booking failed" }, { status: 400 })
    }

    // Parse the jsonRequest to extract booking details for email
    let bookingDetails: any = {}
    try {
      bookingDetails = JSON.parse(jsonRequest)
    } catch (e) {
      console.warn("[Book API] Could not parse jsonRequest for email", e)
    }

    // Send confirmation email (non-blocking)
    if (result.bookingId && result.supplierReference && emailService.isEnabled()) {
      const customer = bookingDetails.customer
      const service = bookingDetails.services?.[0]
      const searchRequest = service?.searchRequest
      const bookingRequest = service?.bookingRequest?.[0]

      if (customer && searchRequest && bookingRequest) {
        const checkInDate = searchRequest.dates?.from || new Date().toISOString()
        const checkOutDate = searchRequest.dates?.to || new Date().toISOString()
        const nights = Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
        )

        // Send email asynchronously (don't wait for it)
        emailService
          .sendBookingConfirmation({
            to: customer.contact?.email || bookingDetails.reference?.voucherEmail,
            customerName: `${customer.name?.first} ${customer.name?.last}`,
            bookingId: result.bookingId,
            supplierReference: result.supplierReference,
            hotelName: "Hotel Name", // TODO: Get from search results
            roomType: bookingRequest.code || "Room",
            checkIn: format(new Date(checkInDate), "MMM dd, yyyy"),
            checkOut: format(new Date(checkOutDate), "MMM dd, yyyy"),
            nights,
            adults: searchRequest.pax?.[0]?.adults || 1,
            children: searchRequest.pax?.[0]?.children?.length || 0,
            totalPrice: result.totalPrice || 0,
            currency: searchRequest.currencies?.[0] || "USD",
            language: "en",
          })
          .then((emailResult) => {
            if (emailResult.success) {
              console.log("[Book API] ✅ Confirmation email sent", {
                bookingId: result.bookingId,
                emailId: emailResult.emailId,
              })
            } else {
              console.warn("[Book API] ⚠️ Email failed (non-critical)", emailResult.error)
            }
          })
          .catch((error) => {
            console.error("[Book API] Email error (non-critical):", error)
          })
      } else {
        console.warn("[Book API] Missing email data, skipping email")
      }
    }

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
