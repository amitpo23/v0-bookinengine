import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== BOOK API ROUTE ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const {
      code,
      token,
      preBookId,
      dateFrom,
      dateTo,
      hotelId,
      adults,
      children,
      customer,
      voucherEmail,
      agencyReference,
    } = body

    // Validate required fields
    if (!code || !token || !dateFrom || !dateTo || !hotelId || !customer) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 })
    }

    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: "Customer firstName, lastName, email, and phone are required" },
        { status: 400 },
      )
    }

    const result = await mediciApi.book({
      code,
      token,
      preBookId: preBookId ? Number(preBookId) : undefined,
      dateFrom,
      dateTo,
      hotelId: Number(hotelId),
      adults: Number(adults) || 2,
      children: children || [],
      customer: {
        title: customer.title || "MR",
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        country: customer.country || "IL",
        city: customer.city || "",
        address: customer.address || "",
        zip: customer.zip || "",
      },
      voucherEmail,
      agencyReference,
    })

    console.log("[v0] Book result:", result)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Booking failed" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      supplierReference: result.supplierReference,
      status: result.status,
    })
  } catch (error: any) {
    console.error("[v0] Book API Error:", error.message)
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 })
  }
}
