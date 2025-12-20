import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { mediciApi } from "@/lib/api/medici-client"

export const POST = withRBAC(
  async (req: NextRequest, user) => {
    try {
      const body = await req.json()
      const { destination, checkIn, checkOut, adults = 2, children = 0 } = body

      if (!destination || !checkIn || !checkOut) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Call Medici API
      const result = await mediciApi.searchHotels({
        hotelName: destination,
        dateFrom: checkIn,
        dateTo: checkOut,
        adults,
        children,
      })

      return NextResponse.json({
        success: true,
        ...result,
        user: {
          id: user.id,
          role: user.role,
        },
      })
    } catch (error: any) {
      console.error("[Search Protected] Error:", error)
      return NextResponse.json({ error: "Search failed", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "BOOKING.SEARCH" },
)
