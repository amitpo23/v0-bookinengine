import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"

export const GET = withRBAC(
  async (req: NextRequest, user) => {
    try {
      // TODO: Query bookings from your database
      // For now, return mock data
      const mockOrders = [
        {
          id: "booking-123",
          userId: user.id,
          hotelName: "Dizengoff Inn",
          checkIn: "2025-12-23",
          checkOut: "2025-12-24",
          status: "confirmed",
          totalPrice: 500,
          createdAt: new Date().toISOString(),
        },
      ]

      return NextResponse.json({
        success: true,
        orders: mockOrders,
        count: mockOrders.length,
      })
    } catch (error: any) {
      console.error("[My Orders] Error:", error)
      return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "BOOKING.MY_ORDERS.READ" },
)
