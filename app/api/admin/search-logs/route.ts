/**
 * API Route for Search Logs Admin
 * Handles getting, filtering, and deleting search logs
 */

import { NextRequest, NextResponse } from "next/server"
import { SearchLogger } from "@/lib/search-logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const search = searchParams.get("search") || undefined
    const status = searchParams.get("status") || "all"
    const source = searchParams.get("source") || "all"
    const dateFromStr = searchParams.get("dateFrom")
    const dateToStr = searchParams.get("dateTo")
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const filters: any = {
      limit,
      offset,
    }

    if (status !== "all") {
      filters.success = status === "success"
    }

    if (source !== "all") {
      filters.source = source
    }

    if (dateFromStr) {
      filters.dateFrom = new Date(dateFromStr)
    }

    if (dateToStr) {
      const dateTo = new Date(dateToStr)
      dateTo.setHours(23, 59, 59, 999)
      filters.dateTo = dateTo
    }

    const { logs, total } = await SearchLogger.getSearchLogs(filters)

    // Get stats
    const statsFilters: any = {}
    if (dateFromStr) statsFilters.dateFrom = new Date(dateFromStr)
    if (dateToStr) {
      const dateTo = new Date(dateToStr)
      dateTo.setHours(23, 59, 59, 999)
      statsFilters.dateTo = dateTo
    }
    const stats = await SearchLogger.getSearchStats(statsFilters)

    return NextResponse.json({
      logs,
      total,
      stats,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[Search Logs API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch search logs" },
      { status: 500 }
    )
  }
}
