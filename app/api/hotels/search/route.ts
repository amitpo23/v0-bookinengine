import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/api-client"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Search API called")
    console.log("[v0] MEDICI_TOKEN exists:", !!process.env.MEDICI_TOKEN)
    console.log("[v0] MEDICI_BASE_URL exists:", !!process.env.MEDICI_BASE_URL)

    const body = await request.json()

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelName && !city) {
      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    const results = await apiClient.searchHotels({
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: adults || 2,
      children: children || [],
      stars: stars ? Number(stars) : undefined,
      limit: limit ? Number(limit) : 20,
    })

    const groupedResults = results.map((hotel: any) => {
      let hotelId = 0
      if (typeof hotel.hotelId === "number" && hotel.hotelId > 0) {
        hotelId = hotel.hotelId
      } else if (typeof hotel.hotelId === "string" && hotel.hotelId) {
        hotelId = Number.parseInt(hotel.hotelId, 10) || 0
      }

      const mappedRooms = (hotel.rooms || []).map((room: any, index: number) => {
        const roomCode = room.code || room.rateKey || room.roomCode || ""

        return {
          code: roomCode,
          roomId: String(room.roomId || room.id || index + 1),
          roomName: room.roomName || room.name || "Standard Room",
          roomCategory: room.roomCategory || room.roomType || room.category || "standard",
          categoryId: room.categoryId || getCategoryIdFromName(room.roomCategory || room.roomType),
          boardId: room.boardId || getBoardIdFromCode(room.board || room.boardType),
          boardType: room.boardType || room.board || "RO",
          buyPrice: Number(room.buyPrice) || Number(room.price) || 0,
          originalPrice: Number(room.originalPrice) || 0,
          currency: room.currency || "ILS",
          maxOccupancy: room.maxOccupancy || room.pax?.adults || 2,
          size: room.size || room.roomSize || 0,
          view: room.view || "",
          bedding: room.bedding || "",
          amenities: room.amenities || room.facilities || [],
          images: room.images || [],
          cancellationPolicy: room.cancellationPolicy || "free",
          available: room.available || room.quantity?.max || 1,
        }
      })

      return {
        hotelId,
        hotelName: hotel.hotelName || hotel.name || "Unknown Hotel",
        city: hotel.city || "",
        stars: hotel.stars || hotel.rating || 0,
        address: hotel.address || hotel.location || "",
        imageUrl: hotel.hotelImage || hotel.imageUrl || "",
        images: hotel.images || [],
        description: hotel.description || "",
        facilities: hotel.facilities || hotel.amenities || [],
        rooms: mappedRooms,
        requestJson: hotel.requestJson,
        responseJson: hotel.responseJson,
      }
    })

    return NextResponse.json({
      success: true,
      data: groupedResults,
      count: groupedResults.length,
    })
  } catch (error: any) {
    console.error("Search API Error:", error.message)
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
