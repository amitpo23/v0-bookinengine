import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { DEMO_MODE } from "@/lib/demo/demo-mode"
import { MOCK_HOTELS } from "@/lib/demo/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body
    
    // Support both old and new parameter formats
    // Old: dateFrom, dateTo, hotelName, city
    // New: destination, checkIn, checkOut, pax
    const dateFrom = body.dateFrom || body.checkIn
    const dateTo = body.dateTo || body.checkOut
    const cityParam = body.city || body.destination
    const paxParam = body.pax || { adults: body.adults || 2, children: body.children || [], rooms: body.rooms || 1 }

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelName && !cityParam) {      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    if (DEMO_MODE) {
      console.log("🎭 DEMO MODE: Using mock hotel data")

      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockResults = MOCK_HOTELS.map((hotel) => ({
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        city: hotel.city,
        stars: hotel.stars,
        address: hotel.address,
        imageUrl: hotel.hotelImage,
        images: hotel.images,
        description: hotel.description,
        facilities: hotel.facilities,
        rooms: hotel.rooms,
        requestJson: hotel.requestJson,
        responseJson: hotel.responseJson,
      }))

      return NextResponse.json({
        success: true,
        data: mockResults,
        count: mockResults.length,
      })
    }

    const results = await mediciApi.searchHotels({
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
