import { type NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics/analytics-service"
import { logger } from "@/lib/logger"
import { subDays } from "date-fns"

/**
 * GET /api/analytics/dashboard
 * Get comprehensive analytics dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const days = parseInt(searchParams.get("days") || "30")
    const dateFrom = subDays(new Date(), days)
    const dateTo = new Date()

    logger.info("[Analytics API] Fetching dashboard data", { days })

    const data = await analyticsService.getDashboardData({
      dateFrom,
      dateTo,
    })

    return NextResponse.json({
      success: true,
      data,
      period: {
        days,
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
    })
  } catch (error: any) {
    logger.error("[Analytics API] Error", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch analytics",
      },
      { status: 500 }
    )
  }
}
