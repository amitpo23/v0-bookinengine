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

    const groupedResults = results.map((hotel: any) => {
      const hotelId = typeof hotel.hotelId === "number" ? hotel.hotelId : Number.parseInt(hotel.hotelId, 10) || 0

      console.log(`[v0] Mapping hotel: ${hotel.hotelName}, hotelId: ${hotelId}`)

      return {
        hotelId, // Ensure number
        hotelName: hotel.hotelName,
        city: hotel.city,
        stars: hotel.stars,
        address: hotel.location || hotel.address || "",
        imageUrl: hotel.hotelImage || hotel.imageUrl || "",
        images: hotel.images || [],
        description: hotel.description || "",
        facilities: hotel.facilities || [],
        rooms: hotel.rooms.map((room: any, index: number) => {
          // Log each room's price data for debugging
          console.log(`[v0] Room ${room.roomName}: code=${room.code}, price=${room.price}, buyPrice=${room.buyPrice}`)

          return {
            code: room.code || room.roomId || `room-${index}`, // Ensure code is passed
            roomId: room.roomId || index + 1,
            roomName: room.roomName || "Standard Room",
            roomCategory: room.roomType || room.roomCategory || "standard",
            categoryId: getCategoryIdFromName(room.roomType || room.roomCategory),
            boardId: room.boardId || getBoardIdFromCode(room.board),
            boardType: room.board || "RO",
            buyPrice: room.price || room.buyPrice || 0,
            originalPrice: room.originalPrice || 0,
            currency: room.currency || "ILS",
            maxOccupancy: room.maxOccupancy || 2,
            size: room.size || 0,
            view: room.view || "",
            bedding: room.bedding || "",
            amenities: room.amenities || [],
            roomImage: room.roomImage || "",
            images: room.images || [],
            cancellationPolicy: room.cancellationPolicy || "free",
            available: room.available || 1,
          }
        }),
      }
    })

    console.log("[v0] Returning", groupedResults.length, "hotels")
    if (groupedResults.length > 0) {
      console.log("[v0] First hotel hotelId:", groupedResults[0].hotelId, "type:", typeof groupedResults[0].hotelId)
      if (groupedResults[0].rooms.length > 0) {
        console.log("[v0] First hotel first room:", {
          code: groupedResults[0].rooms[0].code,
          buyPrice: groupedResults[0].rooms[0].buyPrice,
        })
      }
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
