import { generateText } from "ai"
import type { HotelConfig } from "@/types/saas"
import { getBookingAgentPrompt } from "@/lib/prompts/booking-agent-prompt"
import { emailService } from "@/lib/email/email-service"
import { SearchLogger } from "@/lib/search-logger"
import { format } from "date-fns"

const MEDICI_API_BASE = "https://medici-backend.azurewebsites.net"
const MEDICI_IMAGES_BASE = "https://cdn.medicihotels.com/images/"
const MEDICI_TOKEN =
  "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE"

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
  searchRequestJson: string
}) {
  console.log("[v0] PreBook with params:", params)

  const url = `${MEDICI_API_BASE}/api/hotels/PreBook`

  // Parse the original search request to build PreBook request
  let searchRequest
  try {
    searchRequest = JSON.parse(params.searchRequestJson)
  } catch (error) {
    console.error("[v0] Failed to parse search request:", error)
    throw new Error("Invalid search request JSON")
  }

  // Build PreBook request according to Medici API format
  const prebookRequest = {
    services: [
      {
        searchCodes: [
          {
            code: params.code,
            pax: [
              {
                adults: params.adults,
                children: params.children,
              },
            ],
          },
        ],
        searchRequest: searchRequest,
      },
    ],
  }

  const body = {
    jsonRequest: JSON.stringify(prebookRequest),
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
  searchRequestJson: string
  roomCode: string
  adults: number
  children: number[]
}) {
  console.log("[v0] Book with params:", params)

  const url = `${MEDICI_API_BASE}/api/hotels/Book`

  // Parse search request
  let searchRequest
  try {
    searchRequest = JSON.parse(params.searchRequestJson)
  } catch (error) {
    console.error("[v0] Failed to parse search request:", error)
    throw new Error("Invalid search request JSON")
  }

  // Build adult guests array
  const adultGuests = []
  for (let i = 0; i < params.adults; i++) {
    adultGuests.push({
      title: "MR",
      name: {
        first: i === 0 ? params.customer.firstName : `Guest${i + 1}`,
        last: params.customer.lastName,
      },
      birthDate: "1990-01-01",
    })
  }

  // Build Book request according to Medici API format
  const bookRequest = {
    customer: {
      title: "MR",
      name: {
        first: params.customer.firstName,
        last: params.customer.lastName,
      },
      birthDate: "1990-01-01",
      contact: {
        email: params.customer.email,
        phone: params.customer.phone,
      },
    },
    paymentMethod: {
      methodName: "account_credit",
    },
    reference: {
      agency: "v0-bookinengine-ai-chat",
      voucherEmail: params.customer.email,
    },
    services: [
      {
        bookingRequest: [
          {
            code: params.roomCode,
            pax: [
              {
                adults: adultGuests,
                children: [],
              },
            ],
            token: params.token,
          },
        ],
        searchRequest: searchRequest,
      },
    ],
  }

  const body = {
    jsonRequest: JSON.stringify(bookRequest),
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

          // Log the search
          SearchLogger.logSearch({
            hotelName: hotelApiName,
            city: searchParams.city || hotelCity,
            dateFrom: searchParams.dateFrom,
            dateTo: searchParams.dateTo,
            adults: searchParams.adults || 2,
            children: searchParams.children || 0,
            resultsCount: formattedRooms.length,
            foundHotels: rooms.length,
            foundRooms: formattedRooms.length,
            success: true,
            source: "chat",
            channel: "web",
            metadata: {
              hotelId: hotelConfig?.id,
              userMessage: messages[messages.length - 1]?.content.substring(0, 100),
            }
          }).catch(err => console.error("Failed to log search:", err))

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
        
        // Log the failed search
        SearchLogger.logSearch({
          hotelName: hotelApiName,
          city: searchParams?.city || hotelCity,
          dateFrom: searchParams?.dateFrom,
          dateTo: searchParams?.dateTo,
          adults: searchParams?.adults || 2,
          children: searchParams?.children || 0,
          resultsCount: 0,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown search error",
          source: "chat",
          channel: "web",
          metadata: {
            hotelId: hotelConfig?.id,
            error: error instanceof Error ? error.toString() : String(error),
          }
        }).catch(err => console.error("Failed to log search error:", err))
        
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
          searchRequestJson: bookingState.jsonRequest,
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
    if (bookMatch && bookingState?.preBookData && bookingState?.selectedRoom && bookingState?.jsonRequest) {
      console.log("[v0] Completing booking...")

      try {
        const customerDetails = JSON.parse(bookMatch[1])
        const bookingResult = await bookRoom({
          token: bookingState.preBookData.token,
          preBookId: bookingState.preBookData.preBookId,
          customer: customerDetails,
          searchRequestJson: bookingState.jsonRequest,
          roomCode: bookingState.selectedRoom.code,
          adults: bookingState.searchContext?.adults || 2,
          children: bookingState.searchContext?.children || [],
        })

        // Send confirmation email (non-blocking)
        if (bookingResult.bookingId && bookingResult.supplierReference && emailService.isEnabled()) {
          try {
            const searchRequest = JSON.parse(bookingState.jsonRequest)
            const checkInDate = searchRequest.dates?.from || new Date().toISOString()
            const checkOutDate = searchRequest.dates?.to || new Date().toISOString()
            const nights = Math.ceil(
              (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
            )

            emailService
              .sendBookingConfirmation({
                to: customerDetails.email,
                customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
                bookingId: bookingResult.bookingId,
                supplierReference: bookingResult.supplierReference,
                hotelName: bookingState.selectedRoom?.hotelName || hotelName,
                roomType: bookingState.selectedRoom?.roomName || "Room",
                checkIn: format(new Date(checkInDate), "MMM dd, yyyy"),
                checkOut: format(new Date(checkOutDate), "MMM dd, yyyy"),
                nights,
                adults: bookingState.searchContext?.adults || 2,
                children: bookingState.searchContext?.children?.length || 0,
                totalPrice: bookingState.preBookData?.netPrice || 0,
                currency: searchRequest.currencies?.[0] || "USD",
                language: language,
              })
              .then((emailResult) => {
                if (emailResult.success) {
                  console.log("[AI Chat] ✅ Confirmation email sent", {
                    bookingId: bookingResult.bookingId,
                    emailId: emailResult.emailId,
                  })
                } else {
                  console.warn("[AI Chat] ⚠️ Email failed (non-critical)", emailResult.error)
                }
              })
              .catch((error) => {
                console.error("[AI Chat] Email error (non-critical):", error)
              })
          } catch (error) {
            console.error("[AI Chat] Failed to parse search request for email:", error)
          }
        }

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
