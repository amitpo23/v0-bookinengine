import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = {
      hotelStars: searchParams.get("stars") ? Number.parseInt(searchParams.get("stars")!) : undefined,
      city: searchParams.get("city") || undefined,
      hotelName: searchParams.get("hotelName") || undefined,
    }

    const opportunities = await mediciApi.getOpportunities(params)

    return NextResponse.json({
      success: true,
      data: opportunities,
      count: opportunities.length,
    })
  } catch (error: any) {
    console.error("Get Opportunities Error:", error)
    return NextResponse.json({ error: error.message || "Failed to get opportunities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ["startDateStr", "endDateStr", "boardId", "categoryId", "buyPrice", "pushPrice"]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Must have hotelId or destinationId
    if (!body.hotelId && !body.destinationId) {
      return NextResponse.json({ error: "Either hotelId or destinationId is required" }, { status: 400 })
    }

    const result = await mediciApi.insertOpportunity(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to create opportunity" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      opportunityId: result.opportunityId,
    })
  } catch (error: any) {
    console.error("Create Opportunity Error:", error)
    return NextResponse.json({ error: error.message || "Failed to create opportunity" }, { status: 500 })
  }
}
