import { generateText } from "ai"
import type { HotelConfig } from "@/types/saas"
import { getBookingAgentPrompt } from "@/lib/prompts/booking-agent-prompt"

const MEDICI_API_BASE = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://cdn.medicihotels.com/images/"
const MEDICI_TOKEN = process.env.MEDICI_TOKEN

if (!MEDICI_TOKEN) {
  throw new Error("❌ MEDICI_TOKEN environment variable is not set")
}

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

    return {
      results: data,
      jsonRequest: JSON.stringify(body),
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
  console.log("[v0] PreBook with params:", params)

  const url = `${MEDICI_API_BASE}/api/hotels/PreBook`

  const body = {
    jsonRequest: params.requestJson,
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
      console.log("[v0] PreBook error:", errorText)
      throw new Error(`PreBook error: ${response.status}`)
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
    const hotelCity = hotelConfig?.apiSettings?.mediciCity || hotelConfig?.city || "Tel Aviv"

    console.log("[v0] Chat request - Hotel:", hotelName, "API Name:", hotelApiName)
    console.log("[v0] Booking state:", bookingState)

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

        const { results: searchResults, jsonRequest } = await searchMediciHotels({
          hotelName: hotelApiName,
          city: searchParams.city || hotelCity,
          dateFrom: searchParams.dateFrom,
          dateTo: searchParams.dateTo,
          adults: searchParams.adults || 2,
          children: searchParams.children || [],
        })

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
    }

    const bookMatch = text.match(/\[BOOK\](.*?)\[\/BOOK\]/s)
    if (bookMatch && bookingState?.preBookData) {
      console.log("[v0] Completing booking...")

      try {
        const customerDetails = JSON.parse(bookMatch[1])
        const bookingResult = await bookRoom({
          token: bookingState.preBookData.token,
          preBookId: bookingState.preBookData.preBookId,
          customer: customerDetails,
        })

        const cleanText = text.replace(/\[BOOK\].*?\[\/BOOK\]/s, "").trim()

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
