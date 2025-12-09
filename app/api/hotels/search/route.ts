import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ====== SEARCH API ROUTE ======")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body

    // Validate required fields
    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelName && !city) {
      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    const results = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: Number(adults) || 2,
      children: children || [],
      stars: stars ? Number(stars) : undefined,
      limit: limit ? Number(limit) : 20,
    })

    console.log("[v0] Search returned", results.length, "hotel results")

    // Each result is a HotelSearchResult with rooms: RoomResult[]
    const groupedResults = results.map((hotel) => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      city: hotel.city,
      stars: hotel.stars,
      address: hotel.address,
      imageUrl: hotel.imageUrl,
      images: hotel.images,
      description: hotel.description,
      facilities: hotel.facilities,
      rooms: hotel.rooms.map((room, index) => ({
        code: room.code,
        roomId: room.roomId || index + 1,
        roomName: room.roomName,
        roomCategory: room.roomCategory,
        categoryId: room.categoryId || getCategoryIdFromName(room.roomCategory),
        boardId: room.boardId || getBoardIdFromCode(room.boardType),
        boardType: room.boardType,
        buyPrice: room.buyPrice, // Use buyPrice directly from transform
        currency: room.currency || "USD",
        maxOccupancy: room.maxOccupancy || 2,
        cancellationPolicy: room.cancellationPolicy || "fully-refundable",
      })),
    }))

    console.log("[v0] Returning", groupedResults.length, "hotels")
    if (groupedResults.length > 0) {
      console.log(
        "[v0] First hotel rooms:",
        groupedResults[0].rooms.map((r) => ({ name: r.roomName, price: r.buyPrice })),
      )
    }

    return NextResponse.json({
      success: true,
      data: groupedResults,
      count: groupedResults.length,
    })
  } catch (error: any) {
    console.error("[v0] Search API Error:", error.message)
    return NextResponse.json({ error: error.message || "Failed to search hotels" }, { status: 500 })
  }
}

function getCategoryIdFromName(category: string): number {
  const categories: Record<string, number> = {
    standard: 1,
    superior: 2,
    deluxe: 3,
    suite: 4,
    "junior suite": 5,
    family: 6,
  }
  return categories[category?.toLowerCase()] || 1
}

function getBoardIdFromCode(boardCode: string): number {
  const boards: Record<string, number> = {
    ro: 1,
    bb: 2,
    hb: 3,
    fb: 4,
    ai: 5,
  }
  return boards[boardCode?.toLowerCase()] || 1
}
