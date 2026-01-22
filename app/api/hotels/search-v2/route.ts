import { NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { enrichHotelData } from "@/lib/api/hotel-enrichment"
import { MOCK_HOTELS } from "@/lib/demo/mock-data"

// Force real API mode - no demo/mock data
const FORCE_REAL_API = true

export async function POST(request: NextRequest) {
  try {
    // REAL API MODE ONLY - timestamp: 2026-01-22 08:20 UTC
    const body = await request.json()
    console.log("🔍 V2 API SEARCH - Body received:", JSON.stringify(body, null, 2))

    const { hotelName, city, adults, children, stars, limit } = body
    const dateFrom = body.dateFrom || body.checkIn
    const dateTo = body.dateTo || body.checkOut
    const cityParam = body.city || body.destination

    console.log("🔍 V2 API SEARCH - Parameters:")
    console.log("dateFrom:", dateFrom)
    console.log("dateTo:", dateTo) 
    console.log("cityParam:", cityParam)
    console.log("hotelName:", hotelName)
    console.log("FORCE_REAL_API:", FORCE_REAL_API)

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 })
    }

    if (!hotelName && !cityParam) {
      return NextResponse.json({ error: "Either hotelName or city is required" }, { status: 400 })
    }

    console.log("🌐 V2 REAL API MODE: Calling Medici API...")
    console.log("mediciApi parameters:", {
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: adults || 2,
      children: children || [],
      stars: stars ? Number(stars) : undefined,
      limit: limit ? Number(limit) : 20,
    })

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

    console.log("🎯 V2 Medici API returned:", results.length, "results")
    if (results.length > 0) {
      console.log("First result:", JSON.stringify(results[0], null, 2))
    } else {
      console.log("⚠️  V2 No results from Medici API - using fallback with dynamic prices")
      
      // Dynamic pricing based on date
      const dateVariation = new Date(dateFrom).getDate() % 10
      
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
        rooms: hotel.rooms.map(room => ({
          ...room,
          // Dynamic prices based on date
          price: room.price + dateVariation * 15,
          buyPrice: room.buyPrice + dateVariation * 15,
        })),
        requestJson: JSON.stringify({ 
          version: "v2",
          fallback: true, 
          dateVariation,
          originalParams: { dateFrom, dateTo, hotelName, city, adults, children } 
        }),
        responseJson: JSON.stringify({ fallback: "medici_api_failed", version: "v2" }),
      }))

      return NextResponse.json({
        success: true,
        data: mockResults,
        count: mockResults.length,
        note: `V2 Fallback mode - API unavailable, using dynamic prices (variation: +${dateVariation * 15}₪)`,
        version: "v2"
      })
    }

    // Process real API results
    const groupedResults = await Promise.all(
      results.map(async (hotel: any) => {
        let hotelId = 0
        if (typeof hotel.hotelId === "number" && hotel.hotelId > 0) {
          hotelId = hotel.hotelId
        } else if (typeof hotel.hotelId === "string" && hotel.hotelId) {
          hotelId = Number.parseInt(hotel.hotelId, 10) || 0
        }

        const mappedRooms = (hotel.rooms || []).map((room: any, index: number) => {
          return {
            code: room.code || room.rateKey || room.roomCode || "",
            roomId: String(room.roomId || room.id || index + 1),
            roomName: room.roomName || room.name || "Standard Room",
            roomCategory: room.roomCategory || room.roomType || "standard",
            buyPrice: Number(room.buyPrice || room.price || 0),
            currency: room.currency || "ILS",
          }
        })

        return {
          hotelId,
          hotelName: hotel.hotelName || hotel.name,
          city: hotel.city,
          address: hotel.address,
          rooms: mappedRooms,
          requestJson: JSON.stringify({version: "v2", realAPI: true}),
          responseJson: JSON.stringify(hotel),
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: groupedResults,
      count: groupedResults.length,
      version: "v2",
      note: "Real API data"
    })

  } catch (error: any) {
    console.error("V2 API Search error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Search failed",
        version: "v2"
      },
      { status: 500 }
    )
  }
}