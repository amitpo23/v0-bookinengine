import { generateText } from "ai"
import type { HotelConfig } from "@/types/saas"
import { getBookingAgentPrompt } from "@/lib/prompts/booking-agent-prompt"
import { groqClient, GROQ_MODELS } from "@/lib/ai/groq-client"
import { langsmithTracer } from "@/lib/ai/langsmith-tracer"
import { logger } from "@/lib/logger"

const MEDICI_API_BASE = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://cdn.medicihotels.com/images/"
const MEDICI_TOKEN = process.env.MEDICI_TOKEN

// AI Provider Selection: "groq" (faster, cheaper) or "claude" (smarter)
const AI_PROVIDER = process.env.AI_PROVIDER || "groq"
const USE_GROQ = AI_PROVIDER === "groq" && groqClient.isConfigured()

// Warn if not set but don't throw during build
if (!MEDICI_TOKEN && typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    console.error("⚠️  MEDICI_TOKEN not set! Add to Vercel Environment Variables.")
  }
}

logger.info("[Booking AI] Provider configured", {
  provider: USE_GROQ ? "GROQ" : "Claude",
  langsmith: langsmithTracer.isEnabled(),
})

const DEFAULT_HOTEL_NAME = "Dizengoff Inn"

function buildImageUrl(imageUrl: string | { url?: string } | null): string {
  if (!imageUrl) return ""
  const url = typeof imageUrl === "object" ? imageUrl.url : imageUrl
  if (!url) return ""
  if (url.startsWith("http")) return url
  return `${MEDICI_IMAGES_BASE}${url}`
}

function getMainImage(images: any[]): string {
  if (!images || images.length === 0) return ""
  const mainImage = images.find((img) => img.title === "mainimage")
  if (mainImage) return buildImageUrl(mainImage)
  return buildImageUrl(images[0])
}

function buildImageGallery(images: any[]): string[] {
  if (!images || images.length === 0) return []
  return images
    .slice(0, 10)
    .map((img) => buildImageUrl(img))
    .filter(Boolean)
}

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

    // Use requestJson from API response (as per new API spec)
    const requestJson = data.requestJson || JSON.stringify(body)
    console.log("[v0] Captured requestJson:", {
      source: data.requestJson ? "API response" : "fallback (request body)",
      hasRequestJson: !!requestJson,
      length: requestJson?.length || 0,
    })

    return {
      results: data,
      jsonRequest: requestJson,
    }
  } catch (error) {
    console.error("[v0] Search error:", error)
    throw error
  }
}

async function prebookRoom(params: {
  code: string
  hotelId: number
  dateFrom: string
  dateTo: string
  adults: number
  children: number[]
  requestJson: string
}) {
  console.log("[v0] PreBook with params:", {
    code: params.code,
    hotelId: params.hotelId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    hasRequestJson: !!params.requestJson,
    requestJsonLength: params.requestJson?.length || 0,
  })

  const url = `${MEDICI_API_BASE}/api/hotels/PreBook`

  const body = {
    jsonRequest: params.requestJson,
  }

  console.log("[v0] PreBook request body:", JSON.stringify(body).substring(0, 200) + "...")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] PreBook response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] PreBook API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`PreBook API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] PreBook success:", data)
    return data
  } catch (error) {
    console.error("[v0] PreBook error:", error)
    throw error
  }
}

async function bookRoom(params: {
  token: string
  preBookId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}) {
  console.log("[v0] Book with params:", params)

  const url = `${MEDICI_API_BASE}/api/hotels/Book`

  const body = {
    jsonRequest: JSON.stringify({
      customer: {
        firstName: params.customer.firstName,
        lastName: params.customer.lastName,
        email: params.customer.email,
        phone: params.customer.phone,
      },
      paymentMethod: "card",
      services: [
        {
          token: params.token,
          bookingRequest: {
            preBookId: params.preBookId,
          },
        },
      ],
    }),
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEDICI_TOKEN}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Book error:", errorText)
      throw new Error(`Book error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Book success:", data)
    return data
  } catch (error) {
    console.error("[v0] Book error:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { messages, hotelConfig, language, bookingState } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[]
      hotelConfig: HotelConfig
      language: "he" | "en"
      bookingState?: {
        step?: "search" | "select" | "prebook" | "details" | "book"
        selectedRoom?: any
        jsonRequest?: string
        preBookData?: any
        searchContext?: any
      }
    }

    const isHebrew = language === "he"
    const hotelName = hotelConfig?.name || "Dizengoff Inn"
    const hotelApiName = hotelConfig?.apiSettings?.mediciHotelName || DEFAULT_HOTEL_NAME
    const hotelCity = hotelConfig?.city || "Tel Aviv"

    console.log("[v0] Chat request - Hotel:", hotelName, "API Name:", hotelApiName)
    console.log("[v0] Booking state:", bookingState)

    const today = new Date().toISOString().split("T")[0]

    const systemPrompt = getBookingAgentPrompt(language, hotelName, hotelCity, today)

    const conversationId = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const userMessage = messages[messages.length - 1]?.content || ""

    console.log("[v0] Calling AI model...", { provider: USE_GROQ ? "GROQ" : "Claude" })

    let text: string
    let aiDuration: number
    const startAI = Date.now()

    if (USE_GROQ) {
      // Use GROQ - Faster and cheaper (best for Hebrew with Mixtral)
      logger.info("[Booking AI] Using GROQ for ultra-fast inference")
      const response = await groqClient.chat({
        model: GROQ_MODELS.MIXTRAL_8X7B, // Excellent for Hebrew + English
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
        temperature: 0.7,
        maxTokens: 2048,
      })
      text = response.content
      aiDuration = response.duration
    } else {
      // Use Claude - Smarter but slower/more expensive
      logger.info("[Booking AI] Using Claude for enhanced intelligence")
      const response = await generateText({
        model: "anthropic/claude-sonnet-4-20250514",
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      })
      text = response.text
      aiDuration = Date.now() - startAI
    }

    console.log("[v0] AI response:", text.slice(0, 500))

    // LangSmith: Trace AI interaction
    await langsmithTracer.traceChat({
      conversationId,
      userMessage,
      aiResponse: text,
      model: USE_GROQ ? GROQ_MODELS.MIXTRAL_8X7B : "claude-sonnet-4",
      duration: aiDuration,
      metadata: {
        hotelName,
        language,
        bookingStep: bookingState?.step || "conversation",
      },
      tags: ["booking-ai", language, USE_GROQ ? "groq" : "claude"],
    })

    const searchMatch = text.match(/\[SEARCH\](.*?)\[\/SEARCH\]/s)
    if (searchMatch) {
      console.log("[v0] Found search request:", searchMatch[1])

      const searchStartTime = Date.now()
      let searchSuccess = false
      let searchError: string | undefined

      try {
        const searchParams = JSON.parse(searchMatch[1])
        console.log("[v0] Parsed search params:", searchParams)

        const { results: searchResults, jsonRequest } = await searchMediciHotels({
          hotelName: hotelApiName,
          city: searchParams.city || hotelCity,
          dateFrom: searchParams.dateFrom,
          dateTo: searchParams.dateTo,
          adults: searchParams.adults || 2,
          children: searchParams.children || [],
        })

        searchSuccess = true

        let rooms: any[] = []

        if (searchResults?.items && Array.isArray(searchResults.items)) {
          rooms = searchResults.items
        } else if (Array.isArray(searchResults)) {
          rooms = searchResults
        } else if (searchResults?.hotels) {
          rooms = searchResults.hotels
        }

        if (rooms.length > 0) {
          const formattedRooms = rooms.slice(0, 6).map((room: any, index: number) => {
            const price = room.price?.amount || room.netPrice?.amount || room.price || 0
            const currency = room.price?.currency || room.netPrice?.currency || "USD"
            const rawImages = room.images || []
            const mainImage = getMainImage(rawImages)
            const imageGallery = buildImageGallery(rawImages)
            const facilities = room.facilities?.tags || room.facilities?.list || []

            return {
              code: room.code || `${room.hotelId || hotelName}:${index}:${Date.now()}`,
              hotelId: room.hotelId || 0,
              name: room.hotelName || room.name || "Hotel",
              hotelName: room.hotelName || hotelName,
              roomType: room.name || room.category || "Standard Room",
              board: room.board || "RO",
              price: price,
              currency: currency,
              cancellation: room.cancellation?.type || "non-refundable",
              confirmation: room.confirmation || "immediate",
              image: mainImage,
              images: imageGallery,
              description: room.description || "",
              facilities: facilities,
              location: room.city || searchParams.city || hotelCity,
              address: room.address || "",
              rating: room.stars || 4,
            }
          })

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
                ? `${i + 1}. ${r.hotelName} - ${r.roomType}${label}\n   מחיר: $${r.price} ${r.currency}\n   קוד חדר: ${r.code}\n   ביטול: ${r.cancellation === "fully-refundable" ? "ניתן לביטול חינם" : "לא ניתן לביטול"}`
                : `${i + 1}. ${r.hotelName} - ${r.roomType}${label}\n   Price: $${r.price} ${r.currency}\n   Room code: ${r.code}\n   Cancellation: ${r.cancellation === "fully-refundable" ? "Free cancellation" : "Non-refundable"}`
            })
            .join("\n\n")

          // LangSmith: Trace successful search
          await langsmithTracer.traceBookingSearch({
            searchId: conversationId,
            query: {
              dateFrom: searchParams.dateFrom,
              dateTo: searchParams.dateTo,
              hotelName: hotelApiName,
              city: searchParams.city || hotelCity,
              adults: searchParams.adults || 2,
              children: searchParams.children || [],
            },
            results: formattedRooms,
            duration: Date.now() - searchStartTime,
            apiUsed: "medici-direct",
            success: true,
          })

          return Response.json({
            message:
              cleanText +
              "\n\n" +
              (isHebrew
                ? `מצאתי ${formattedRooms.length} אפשרויות זמינות:\n\n${roomsList}\n\nאיזה חדר מעניין אותך? כתוב את המספר או "אני רוצה את חדר מספר X"`
                : `I found ${formattedRooms.length} available options:\n\n${roomsList}\n\nWhich room interests you? Write the number or "I want room number X"`),
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
                jsonRequest: jsonRequest,
              },
            },
          })
        }
      } catch (error) {
        console.error("[v0] Search error:", error)
        searchError = error instanceof Error ? error.message : String(error)

        // LangSmith: Trace failed search
        await langsmithTracer.traceBookingSearch({
          searchId: conversationId,
          query: {
            dateFrom: "",
            dateTo: "",
            hotelName: hotelApiName,
            city: hotelCity,
            adults: 2,
            children: [],
          },
          results: [],
          duration: Date.now() - searchStartTime,
          apiUsed: "medici-direct",
          success: false,
          error: searchError,
        })

        const cleanText = text.replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "").trim()
        return Response.json({
          message:
            cleanText +
            "\n\n" +
            (isHebrew
              ? "הייתה בעיה ביצירת קשר עם מערכת ההזמנות. אנא נסה שוב."
              : "There was an issue contacting the booking system. Please try again."),
        })
      }
    }

    const selectMatch = text.match(/\[SELECT_ROOM\](.*?)\[\/SELECT_ROOM\]/s)
    if (selectMatch && bookingState?.jsonRequest) {
      console.log("[v0] Room selected, calling PreBook...")

      try {
        const selection = JSON.parse(selectMatch[1])
        const preBookData = await prebookRoom({
          code: selection.code,
          hotelId: selection.hotelId,
          dateFrom: bookingState.searchContext.dateFrom,
          dateTo: bookingState.searchContext.dateTo,
          adults: bookingState.searchContext.adults,
          children: bookingState.searchContext.children,
          requestJson: bookingState.jsonRequest,
        })

        const cleanText = text.replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s, "").trim()

        return Response.json({
          message:
            cleanText +
            "\n\n" +
            (isHebrew
              ? `מעולה! שמרתי את החדר עבורך.\nעכשיו אני צריך כמה פרטים:\n- שם מלא\n- דוא"ל\n- מספר טלפון`
              : `Great! I've reserved the room for you.\nNow I need some details:\n- Full name\n- Email\n- Phone number`),
          bookingData: {
            type: "prebook_complete",
            data: {
              preBookData: preBookData,
              selectedRoom: selection,
            },
          },
        })
      } catch (error) {
        console.error("[v0] PreBook error:", error)
        return Response.json({
          message: isHebrew
            ? "הייתה בעיה בשמירת החדר. אנא נסה שוב או בחר חדר אחר."
            : "There was an issue reserving the room. Please try again or select another room.",
        })
      }
    } else if (selectMatch && !bookingState?.jsonRequest) {
      // User selected a room but jsonRequest is missing (e.g., page refresh or session lost)
      console.error("[v0] Missing jsonRequest for PreBook - session may have been lost")
      return Response.json({
        message: isHebrew
          ? "נראה שהמידע על החיפוש אבד. אנא חפש שוב את המלונות כדי להמשיך עם ההזמנה."
          : "It seems the search information was lost. Please search for hotels again to continue with the booking.",
      })
    }

    const bookMatch = text.match(/\[BOOK\](.*?)\[\/BOOK\]/s)
    if (bookMatch && bookingState?.preBookData) {
      console.log("[v0] Completing booking...")

      const bookStartTime = Date.now()

      try {
        const customerDetails = JSON.parse(bookMatch[1])
        const bookingResult = await bookRoom({
          token: bookingState.preBookData.token,
          preBookId: bookingState.preBookData.preBookId,
          customer: customerDetails,
        })

        const cleanText = text.replace(/\[BOOK\].*?\[\/BOOK\]/s, "").trim()

        // LangSmith: Trace successful booking completion
        await langsmithTracer.traceBooking({
          bookingId: bookingResult.bookingId,
          hotelName: bookingState.selectedRoom?.hotelName || hotelName,
          dateFrom: bookingState.searchContext?.dateFrom || "",
          dateTo: bookingState.searchContext?.dateTo || "",
          totalPrice: bookingState.selectedRoom?.price || 0,
          currency: bookingState.selectedRoom?.currency || "USD",
          duration: Date.now() - bookStartTime,
          apiUsed: "medici-direct",
          success: true,
        })

        return Response.json({
          message:
            cleanText +
            "\n\n" +
            (isHebrew
              ? `🎉 ההזמנה הושלמה בהצלחה!\n\nמספר הזמנה: ${bookingResult.bookingId}\nאסמכתא: ${bookingResult.supplierReference}\n\nקיבלת אישור במייל ${customerDetails.email}`
              : `🎉 Booking completed successfully!\n\nBooking ID: ${bookingResult.bookingId}\nReference: ${bookingResult.supplierReference}\n\nYou've received confirmation at ${customerDetails.email}`),
          bookingData: {
            type: "booking_complete",
            data: {
              bookingId: bookingResult.bookingId,
              supplierReference: bookingResult.supplierReference,
            },
          },
        })
      } catch (error) {
        console.error("[v0] Book error:", error)
        const bookError = error instanceof Error ? error.message : String(error)

        // LangSmith: Trace failed booking
        await langsmithTracer.traceBooking({
          bookingId: "",
          hotelName: bookingState.selectedRoom?.hotelName || hotelName,
          dateFrom: bookingState.searchContext?.dateFrom || "",
          dateTo: bookingState.searchContext?.dateTo || "",
          totalPrice: bookingState.selectedRoom?.price || 0,
          currency: bookingState.selectedRoom?.currency || "USD",
          duration: Date.now() - bookStartTime,
          apiUsed: "medici-direct",
          success: false,
          error: bookError,
        })

        return Response.json({
          message: isHebrew
            ? "הייתה בעיה בסיום ההזמנה. אנא נסה שוב או צור קשר עם התמיכה."
            : "There was an issue completing the booking. Please try again or contact support.",
        })
      }
    }

    const cleanText = text
      .replace(/\[SEARCH\].*?\[\/SEARCH\]/s, "")
      .replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s, "")
      .replace(/\[BOOK\].*?\[\/BOOK\]/s, "")
      .trim()

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
