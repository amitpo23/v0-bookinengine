import { generateText } from "ai"
import type { HotelConfig } from "@/types/saas"

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

  // According to docs: use either HotelName OR City, not both
  // Format: adults as number, paxChildren as array of ages
  const body: Record<string, any> = {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    adults: params.adults, // number, not string
    paxChildren: params.children || [], // array of ages, e.g. [10, 13]
    stars: null,
    limit: 10,
  }

  // Use hotelName OR city - not both!
  if (params.hotelName) {
    body.hotelName = params.hotelName
  } else if (params.city) {
    body.city = params.city
  } else {
    body.hotelName = DEFAULT_HOTEL_NAME
  }

  console.log("[v0] Request URL:", url)
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
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("[v0] Raw response:", responseText.slice(0, 2000))

    if (!response.ok) {
      console.log("[v0] Error response:", responseText)
      throw new Error(`API error: ${response.status} - ${responseText}`)
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText)
      console.log("[v0] Parsed response type:", typeof data, Array.isArray(data) ? "array" : "object")
      console.log("[v0] Response keys:", data ? Object.keys(data) : "null")
      return data
    } catch (e) {
      console.log("[v0] Response is not JSON, returning as text")
      return { rawResponse: responseText }
    }
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

    console.log("[v0] Chat request - Hotel:", hotelName, "API Name:", hotelApiName, "City:", hotelCity)

    const today = new Date().toISOString().split("T")[0]

    const systemPrompt = isHebrew
      ? `
אתה עוזר הזמנות AI של ${hotelName}. תפקידך לעזור לאורחים להזמין חדרים במלון.

כללים:
1. היה ידידותי ומקצועי
2. כשאורח מבקש להזמין - שאל על תאריכים (צ'ק-אין וצ'ק-אאוט) ומספר אורחים
3. כשיש לך את כל הפרטים - חפש זמינות ב-API והצג תוצאות
4. עזור לאורח לבחור חדר ולהשלים את ההזמנה
5. תמיד ענה בעברית

התאריך היום הוא: ${today}

מידע על המלון:
- שם: ${hotelName}
- עיר: ${hotelCity}

אם האורח שואל על זמינות או רוצה להזמין, אסוף את הפרטים הבאים:
- תאריך צ'ק-אין (בפורמט YYYY-MM-DD)
- תאריך צ'ק-אאוט (בפורמט YYYY-MM-DD)
- מספר מבוגרים (ברירת מחדל: 2)

חשוב: התאריכים חייבים להיות בעתיד!

כשיש לך את כל הפרטים, הוסף בסוף ההודעה:
[SEARCH]{"dateFrom": "YYYY-MM-DD", "dateTo": "YYYY-MM-DD", "adults": 2}[/SEARCH]

לדוגמה אם מישהו רוצה 10-12 ביוני 2026:
[SEARCH]{"dateFrom": "2026-06-10", "dateTo": "2026-06-12", "adults": 2}[/SEARCH]
`
      : `
You are the AI booking assistant for ${hotelName}. Your role is to help guests book rooms.

Rules:
1. Be friendly and professional
2. When a guest wants to book - ask about dates and number of guests
3. When you have all details - search availability and show results
4. Always respond in English

Today's date is: ${today}

Hotel Information:
- Name: ${hotelName}
- City: ${hotelCity}

Collect these details for booking:
- Check-in date (YYYY-MM-DD format)
- Check-out date (YYYY-MM-DD format)
- Number of adults (default: 2)

Important: Dates must be in the future!

When you have all details, add at the end:
[SEARCH]{"dateFrom": "YYYY-MM-DD", "dateTo": "YYYY-MM-DD", "adults": 2}[/SEARCH]

Example for June 10-12, 2026:
[SEARCH]{"dateFrom": "2026-06-10", "dateTo": "2026-06-12", "adults": 2}[/SEARCH]
`

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
          city: hotelCity,
          dateFrom: searchParams.dateFrom,
          dateTo: searchParams.dateTo,
          adults: searchParams.adults || 2,
          children: searchParams.children || [],
        })

        // Handle response - Medici returns array of hotels/rooms
        let rooms: any[] = []

        console.log("[v0] Processing search results:", typeof searchResults)

        if (Array.isArray(searchResults)) {
          rooms = searchResults
          console.log("[v0] Results is array with", rooms.length, "items")
        } else if (searchResults?.hotels) {
          rooms = searchResults.hotels
        } else if (searchResults?.rooms) {
          rooms = searchResults.rooms
        } else if (searchResults?.data) {
          rooms = Array.isArray(searchResults.data) ? searchResults.data : [searchResults.data]
        } else if (searchResults && typeof searchResults === "object") {
          // Maybe it's a single result
          rooms = [searchResults]
        }

        console.log("[v0] Found rooms/hotels:", rooms.length)
        if (rooms.length > 0) {
          console.log("[v0] First room sample:", JSON.stringify(rooms[0], null, 2).slice(0, 500))
        }

        if (rooms.length > 0) {
          const formattedRooms = rooms.slice(0, 5).map((room: any) => {
            const price = room.buyPrice || room.price?.amount || room.totalPrice || room.netPrice || room.price || 0
            return {
              name: room.hotelName || room.roomName || room.room_name || room.name || "Standard Room",
              roomType: room.roomType || room.categoryName || room.room_type || room.category || "",
              board: room.boardName || room.board_name || room.board || "Room Only",
              price: typeof price === "object" ? price.amount : price,
              currency: room.currency || room.price?.currency || "USD",
              code: room.code || room.hotelCode || room.id,
              cancellation: room.cancellation?.type || room.cancellationType || "non-refundable",
            }
          })

          console.log("[v0] Formatted rooms:", JSON.stringify(formattedRooms, null, 2))

          const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

          const roomsList = formattedRooms
            .map((r, i) =>
              isHebrew
                ? `${i + 1}. ${r.name} - ${r.roomType || r.board}\n   מחיר: ${r.price} ${r.currency}\n   ביטול: ${r.cancellation === "fully-refundable" ? "ניתן לביטול חינם" : "לא ניתן לביטול"}`
                : `${i + 1}. ${r.name} - ${r.roomType || r.board}\n   Price: ${r.price} ${r.currency}\n   Cancellation: ${r.cancellation}`,
            )
            .join("\n\n")

          return Response.json({
            message:
              cleanText +
              "\n\n" +
              (isHebrew
                ? `מצאתי ${formattedRooms.length} אפשרויות זמינות עבורך:\n\n${roomsList}\n\nאיזה חדר תרצה להזמין?`
                : `I found ${formattedRooms.length} available options for you:\n\n${roomsList}\n\nWhich room would you like to book?`),
            bookingData: {
              type: "search_results",
              data: { rooms: formattedRooms },
            },
          })
        } else {
          const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

          return Response.json({
            message:
              cleanText +
              "\n\n" +
              (isHebrew
                ? "מצטער, לא מצאתי חדרים זמינים בתאריכים אלה. האם תרצה לנסות תאריכים אחרים?"
                : "Sorry, I couldn't find available rooms for these dates. Would you like to try different dates?"),
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
              ? "מצטער, נתקלתי בבעיה בחיפוש. אנא נסה שוב."
              : "Sorry, I encountered an issue while searching. Please try again."),
        })
      }
    }

    // Regular response
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
