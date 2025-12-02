import { type NextRequest, NextResponse } from "next/server"
import { mockHotel, mockRooms, mockRatePlans } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params

  // In production, fetch from database based on hotelId
  const config = {
    hotel: mockHotel,
    rooms: mockRooms,
    ratePlans: mockRatePlans,
  }

  return NextResponse.json(config, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
