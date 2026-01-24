import { NextRequest, NextResponse } from "next/server"

// Types
interface AbandonedBooking {
  id: string
  templateId: string
  sessionId: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  roomType: string
  roomCode?: string
  hotelId?: string
  hotelName?: string
  checkIn: string
  checkOut: string
  guests: number
  children?: number
  totalPrice: number
  currency: string
  stage: "search" | "room_selected" | "guest_details" | "payment"
  abandonedAt: string
  recoveryAttempts: RecoveryAttempt[]
  recovered: boolean
  recoveredAt?: string
  source?: string
  createdAt: string
}

interface RecoveryAttempt {
  id: string
  type: "email" | "sms" | "whatsapp"
  sentAt: string
  opened: boolean
  clicked: boolean
  discountOffered?: number
}

// In-memory store (in production, use Supabase)
const abandonedBookings: AbandonedBooking[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")
    const recovered = searchParams.get("recovered")
    const stage = searchParams.get("stage")
    const limit = parseInt(searchParams.get("limit") || "100")

    let filteredBookings = [...abandonedBookings]

    // Filter by template
    if (templateId) {
      filteredBookings = filteredBookings.filter(b => b.templateId === templateId)
    }

    // Filter by recovered status
    if (recovered === "true") {
      filteredBookings = filteredBookings.filter(b => b.recovered)
    } else if (recovered === "false") {
      filteredBookings = filteredBookings.filter(b => !b.recovered)
    }

    // Filter by stage
    if (stage && stage !== "all") {
      filteredBookings = filteredBookings.filter(b => b.stage === stage)
    }

    // Sort by date (newest first)
    filteredBookings.sort((a, b) => 
      new Date(b.abandonedAt).getTime() - new Date(a.abandonedAt).getTime()
    )

    // Limit results
    filteredBookings = filteredBookings.slice(0, limit)

    // Calculate stats
    const stats = {
      total: filteredBookings.length,
      recovered: filteredBookings.filter(b => b.recovered).length,
      pending: filteredBookings.filter(b => !b.recovered).length,
      recoveryRate: filteredBookings.length > 0
        ? Math.round((filteredBookings.filter(b => b.recovered).length / filteredBookings.length) * 100)
        : 0,
      totalValue: filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      recoveredValue: filteredBookings
        .filter(b => b.recovered)
        .reduce((sum, b) => sum + b.totalPrice, 0),
      byStage: {
        room_selected: filteredBookings.filter(b => b.stage === "room_selected").length,
        guest_details: filteredBookings.filter(b => b.stage === "guest_details").length,
        payment: filteredBookings.filter(b => b.stage === "payment").length,
      },
    }

    return NextResponse.json({
      bookings: filteredBookings,
      stats,
    })
  } catch (error) {
    console.error("Error fetching abandoned bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch abandoned bookings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const booking: AbandonedBooking = {
      id: `ab_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      templateId: body.templateId || "scarlet",
      sessionId: body.sessionId,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      roomType: body.roomType,
      roomCode: body.roomCode,
      hotelId: body.hotelId,
      hotelName: body.hotelName,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests || 2,
      children: body.children || 0,
      totalPrice: body.totalPrice,
      currency: body.currency || "ILS",
      stage: body.stage || "room_selected",
      abandonedAt: new Date().toISOString(),
      recoveryAttempts: [],
      recovered: false,
      source: body.source,
      createdAt: new Date().toISOString(),
    }

    abandonedBookings.push(booking)

    // Keep only last 5000 in memory
    if (abandonedBookings.length > 5000) {
      abandonedBookings.shift()
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Error creating abandoned booking:", error)
    return NextResponse.json(
      { error: "Failed to create abandoned booking" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...data } = body

    const bookingIndex = abandonedBookings.findIndex(b => b.id === id)
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const booking = abandonedBookings[bookingIndex]

    if (action === "recover") {
      // Mark as recovered
      booking.recovered = true
      booking.recoveredAt = new Date().toISOString()
    } else if (action === "send_recovery") {
      // Add recovery attempt
      const attempt: RecoveryAttempt = {
        id: `ra_${Date.now()}`,
        type: data.type || "email",
        sentAt: new Date().toISOString(),
        opened: false,
        clicked: false,
        discountOffered: data.discount,
      }
      booking.recoveryAttempts.push(attempt)
    } else {
      // Update other fields
      Object.assign(booking, data)
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Error updating abandoned booking:", error)
    return NextResponse.json(
      { error: "Failed to update abandoned booking" },
      { status: 500 }
    )
  }
}
