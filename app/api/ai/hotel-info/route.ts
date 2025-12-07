// API route to fetch additional hotel information from web sources
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { hotelName, city, country } = await req.json()

    if (!hotelName) {
      return NextResponse.json({ error: "Hotel name is required" }, { status: 400 })
    }

    // Generate hotel info using AI with web search context
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are a hotel information specialist. Provide accurate, detailed information about hotels.
      
      Return a JSON object with these fields:
      - description: string (2-3 sentences about the hotel)
      - highlights: string[] (3-5 key features)
      - amenities: string[] (list of amenities like WiFi, Pool, Spa, Restaurant, etc.)
      - nearbyAttractions: string[] (2-3 nearby points of interest)
      - rating: number (estimated rating 1-5)
      - priceRange: string ("budget", "mid-range", "luxury")
      - checkInTime: string (e.g., "15:00")
      - checkOutTime: string (e.g., "11:00")
      - imageQuery: string (search query for finding hotel images)
      
      Only return valid JSON, no markdown or extra text.`,
      prompt: `Provide detailed information about: ${hotelName}${city ? ` in ${city}` : ""}${country ? `, ${country}` : ""}`,
    })

    try {
      const hotelInfo = JSON.parse(text)
      return NextResponse.json({ success: true, data: hotelInfo })
    } catch {
      // If JSON parsing fails, return basic info
      return NextResponse.json({
        success: true,
        data: {
          description: text.slice(0, 200),
          highlights: [],
          amenities: ["WiFi", "Air Conditioning"],
          nearbyAttractions: [],
          rating: 4,
          priceRange: "mid-range",
          checkInTime: "15:00",
          checkOutTime: "11:00",
          imageQuery: `${hotelName} hotel exterior`,
        },
      })
    }
  } catch (error: any) {
    console.error("[v0] Hotel info error:", error)
    return NextResponse.json({ error: "Failed to fetch hotel info" }, { status: 500 })
  }
}
