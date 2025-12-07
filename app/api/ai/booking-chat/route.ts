import { generateText } from "ai"
import type { HotelConfig } from "@/types/saas"
import { getBookingAgentPrompt } from "@/lib/prompts/booking-agent-prompt"

const MEDICI_API_BASE = "https://medici-backend.azurewebsites.net"
const MEDICI_TOKEN =
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U"

const DEFAULT_HOTEL_NAME = "Dizengoff Inn"

async function searchMediciHotels(params: {
  hotelName?: string
  city?: string
  dateFrom: string
  dateTo: string
  adults: number
  children: number[]
}) {
  console.log("[v0] Searching Medici API with params:", params)

  const url = `${MEDICI_API_BASE}/api/hotels/GetInnstantSearchPrice`

  const body: Record<string, any> = {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    pax: [
      {
        adults: params.adults || 2,
        children: params.children || [],
      },
    ],
    ShowExtendedData: true,
    limit: 10,
  }

  if (params.city) {
    body.city = params.city
  } else if (params.hotelName) {
    body.hotelName = params.hotelName
  } else {
    body.city = "Dubai"
  }

  console.log("[v0] Request body:", JSON.stringify(body, null, 2))

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Error response:", errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Response items count:", data?.items?.length || 0)
    return data
  } catch (error) {
    console.error("[v0] Search error:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { messages, hotelConfig, language } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[]
      hotelConfig: HotelConfig
      language: "he" | "en"
    }

    const isHebrew = language === "he"
    const hotelName = hotelConfig?.name || "Dizengoff Inn"
    const hotelApiName = hotelConfig?.apiSettings?.mediciHotelName || DEFAULT_HOTEL_NAME
    const hotelCity = hotelConfig?.apiSettings?.mediciCity || hotelConfig?.city || "Tel Aviv"

    console.log("[v0] Chat request - Hotel:", hotelName, "API Name:", hotelApiName)

    const today = new Date().toISOString().split("T")[0]

    const systemPrompt = getBookingAgentPrompt(language, hotelName, hotelCity, today)

    console.log("[v0] Calling AI model...")

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    })

    console.log("[v0] AI response:", text.slice(0, 500))

    const searchMatch = text.match(/\[SEARCH\](.*?)\[\/SEARCH\]/s)

    if (searchMatch) {
      console.log("[v0] Found search request:", searchMatch[1])

      try {
        const searchParams = JSON.parse(searchMatch[1])
        console.log("[v0] Parsed search params:", searchParams)

        const searchResults = await searchMediciHotels({
          hotelName: hotelApiName,
          city: searchParams.city || hotelCity,
          dateFrom: searchParams.dateFrom,
          dateTo: searchParams.dateTo,
          adults: searchParams.adults || 2,
          children: searchParams.children || [],
        })

        let rooms: any[] = []

        console.log("[v0] Processing search results")

        if (searchResults?.items && Array.isArray(searchResults.items)) {
          rooms = searchResults.items
          console.log("[v0] Found", rooms.length, "room options in items")
        } else if (Array.isArray(searchResults)) {
          rooms = searchResults
        } else if (searchResults?.hotels) {
          rooms = searchResults.hotels
        }

        console.log("[v0] Total rooms found:", rooms.length)

        if (rooms.length > 0) {
          const formattedRooms = rooms.slice(0, 6).map((room: any) => {
            const firstItem = room.items?.[0] || room
            const price = room.price?.amount || room.netPrice?.amount || room.price || 0
            const currency = room.price?.currency || room.netPrice?.currency || "USD"

            return {
              code: room.code || "",
              hotelId: firstItem.hotelId || room.hotelId || 0,
              name: firstItem.hotelName || firstItem.name || "Room",
              hotelName: firstItem.hotelName || hotelName,
              roomType: firstItem.name || firstItem.category || "Standard Room",
              board: firstItem.board || "RO",
              price: price,
              currency: currency,
              cancellation: room.cancellation?.type || "non-refundable",
              confirmation: room.confirmation || "immediate",
              image: firstItem.images?.[0] || firstItem.image || null,
              images: firstItem.images || [],
              facilities: firstItem.facilities || [],
              description: firstItem.description || "",
              location: firstItem.city || searchParams.city || hotelCity,
              rating: firstItem.stars || 4,
            }
          })

          console.log("[v0] Formatted rooms:", JSON.stringify(formattedRooms.slice(0, 2), null, 2))

          const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

          const roomsList = formattedRooms
            .map((r, i) => {
              const label =
                i === 0
                  ? isHebrew
                    ? " (הכי משתלם)"
                    : " (Best Value)"
                  : i === formattedRooms.length - 1
                    ? isHebrew
                      ? " (הכי גמיש)"
                      : " (Most Flexible)"
                    : ""

              return isHebrew
                ? `${i + 1}. ${r.hotelName} - ${r.roomType}${label}\n   מחיר: $${r.price} ${r.currency}\n   פנסיון: ${r.board === "RO" ? "ללא ארוחות" : r.board === "BB" ? "ארוחת בוקר" : r.board}\n   ביטול: ${r.cancellation === "fully-refundable" ? "ניתן לביטול חינם" : "לא ניתן לביטול"}`
                : `${i + 1}. ${r.hotelName} - ${r.roomType}${label}\n   Price: $${r.price} ${r.currency}\n   Board: ${r.board === "RO" ? "Room Only" : r.board === "BB" ? "Breakfast" : r.board}\n   Cancellation: ${r.cancellation === "fully-refundable" ? "Free cancellation" : "Non-refundable"}`
            })
            .join("\n\n")

          return Response.json({
            message:
              cleanText +
              "\n\n" +
              (isHebrew
                ? `מצאתי ${formattedRooms.length} אפשרויות זמינות עבורך:\n\n${roomsList}\n\nאיזה חדר מעניין אותך? לחץ על "בחר והמשך" כדי להתחיל בתהליך ההזמנה.`
                : `I found ${formattedRooms.length} available options for you:\n\n${roomsList}\n\nWhich room interests you? Click "Select & Continue" to start the booking process.`),
            bookingData: {
              type: "search_results",
              data: {
                rooms: formattedRooms,
                searchContext: {
                  dateFrom: searchParams.dateFrom,
                  dateTo: searchParams.dateTo,
                  adults: searchParams.adults || 2,
                  children: searchParams.children || [],
                  city: searchParams.city || hotelCity,
                },
              },
            },
            searchContext: {
              dateFrom: searchParams.dateFrom,
              dateTo: searchParams.dateTo,
              adults: searchParams.adults || 2,
              children: searchParams.children || [],
              city: searchParams.city || hotelCity,
            },
          })
        } else {
          const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

          return Response.json({
            message:
              cleanText +
              "\n\n" +
              (isHebrew
                ? "לצערי לא מצאתי חדרים זמינים בתאריכים אלה. אפשרויות:\n- לנסות תאריכים אחרים (±1-2 ימים)\n- לחפש באזור אחר\n- לשנות את מספר האורחים\n\nמה תרצה לנסות?"
                : "Unfortunately, I couldn't find available rooms for these dates. Options:\n- Try different dates (±1-2 days)\n- Search in a different area\n- Change the number of guests\n\nWhat would you like to try?"),
          })
        }
      } catch (error) {
        console.error("[v0] Search error:", error)

        const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

        return Response.json({
          message:
            cleanText +
            "\n\n" +
            (isHebrew
              ? "הייתה בעיה ביצירת קשר עם מערכת ההזמנות. אנא נסה שוב בעוד מספר רגעים או נסה תאריכים/יעד אחרים."
              : "There was an issue contacting the booking system. Please try again in a few moments or try different dates/destination."),
        })
      }
    }

    const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

    return Response.json({ message: cleanText })
  } catch (error) {
    console.error("[v0] AI Chat error:", error)
    return Response.json(
      {
        message: "Sorry, an error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}
