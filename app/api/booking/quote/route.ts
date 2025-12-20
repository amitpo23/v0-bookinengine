import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { mediciApi } from "@/lib/api/medici-client"

export const POST = withRBAC(
  async (req: NextRequest, user) => {
    try {
      const body = await req.json()
      const { code, hotelId, dateFrom, dateTo, adults = 2, children = 0 } = body

      if (!code || !hotelId || !dateFrom || !dateTo) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Call PreBook to get quote
      const result = await mediciApi.preBook({
        code,
        hotelId,
        dateFrom,
        dateTo,
        adults,
        children,
      })

      return NextResponse.json({
        success: true,
        quote: result,
        user: {
          id: user.id,
          role: user.role,
        },
      })
    } catch (error: any) {
      console.error("[Quote] Error:", error)
      return NextResponse.json({ error: "Quote failed", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "BOOKING.QUOTE" },
)
