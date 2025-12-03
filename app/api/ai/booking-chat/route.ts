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

  const body: Record<string, any> = {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    pax: [
      {
        adults: String(params.adults || 2), // adults as STRING per API docs
        children: params.children || [],
      },
    ],
    ShowExtendedData: true, // Get full hotel data with images, facilities, etc.
    limit: 10,
  }

  // Use city OR hotelName - not both!
  if (params.city) {
    body.city = params.city
  } else if (params.hotelName) {
    body.hotelName = params.hotelName
  } else {
    body.city = "Dubai" // Default city for testing
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

אם האורח שואל על זמינות או רוצה להזמין, אוסף את הפרטים הבאים:
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

        let rooms: any[] = []

        console.log("[v0] Processing search results")

        if (searchResults?.items && Array.isArray(searchResults.items)) {
          // Medici returns items array with room options
          rooms = searchResults.items
          console.log("[v0] Found", rooms.length, "room options in items")
        } else if (Array.isArray(searchResults)) {
          rooms = searchResults
        } else if (searchResults?.hotels) {
          rooms = searchResults.hotels
        }

        console.log("[v0] Total rooms found:", rooms.length)

        if (rooms.length > 0) {
          const formattedRooms = rooms.slice(0, 5).map((room: any) => {
            const firstItem = room.items?.[0] || room
            const price = room.price?.amount || room.netPrice?.amount || room.price || 0
            const currency = room.price?.currency || room.netPrice?.currency || "USD"

            return {
              name: firstItem.hotelName || firstItem.name || "Room",
              roomType: firstItem.name || firstItem.category || "",
              board: firstItem.board || "RO",
              price: price,
              currency: currency,
              code: room.code || "",
              cancellation: room.cancellation?.type || "non-refundable",
              confirmation: room.confirmation || "immediate",
            }
          })

          console.log("[v0] Formatted rooms:", JSON.stringify(formattedRooms, null, 2))

          const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()

          const roomsList = formattedRooms
            .map((r, i) =>
              isHebrew
                ? `${i + 1}. ${r.roomType || r.name}\n   מחיר: $${r.price} ${r.currency}\n   ארוחות: ${r.board === "RO" ? "ללא ארוחות" : r.board}\n   ביטול: ${r.cancellation === "fully-refundable" ? "ניתן לביטול חינם" : "לא ניתן לביטול"}`
                : `${i + 1}. ${r.roomType || r.name}\n   Price: $${r.price} ${r.currency}\n   Board: ${r.board}\n   Cancellation: ${r.cancellation}`,
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
                ? "מצטער, לא מצאתי חדרים זמינות בתאריכים אלה. האם תרצה לנסות תאריכים אחרים?"
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
