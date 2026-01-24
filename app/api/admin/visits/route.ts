import { NextRequest, NextResponse } from "next/server"

// Visits API - returns empty array until connected to analytics
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const template = searchParams.get("template")

  // TODO: Connect to analytics service (e.g., Google Analytics, Vercel Analytics)
  // For now, return empty array
  return NextResponse.json({
    success: true,
    visits: [],
    message: "Connect to analytics service for real data"
  })
}
