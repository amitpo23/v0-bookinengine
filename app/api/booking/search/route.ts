import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import {
  ValidationError,
  RateLimitError,
  ServiceUnavailableError,
  ExternalServiceError,
  handleApiError,
} from "@/lib/api/errors"

// HTTP Status Code Constants
const HTTP_STATUS_BAD_REQUEST = 400
const HTTP_STATUS_TOO_MANY_REQUESTS = 429
const HTTP_STATUS_BAD_GATEWAY = 502
const HTTP_STATUS_SERVICE_UNAVAILABLE = 503

function validateSearchRequest(body: Record<string, unknown>) {
  if (!(body.dateFrom && body.dateTo)) {
    throw new ValidationError("Check-in and check-out dates are required")
  }

  const checkIn = new Date(body.dateFrom as string)
  const checkOut = new Date(body.dateTo as string)

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new ValidationError("Invalid date format. Please use YYYY-MM-DD")
  }

  if (checkIn >= checkOut) {
    throw new ValidationError("Check-out date must be after check-in date")
  }

  if (checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new ValidationError("Check-in date cannot be in the past")
  }

  // Validate adults count
  const adults = body.adults as number
  if (adults && (adults < 1 || adults > 10)) {
    throw new ValidationError("Adults count must be between 1 and 10")
  }

  // Validate children array
  const children = body.children as number[]
  if (children && children.length > 5) {
    throw new ValidationError("Maximum 5 children per booking")
  }
}

function handleApiResponseError(response: Response, errorText: string) {
  if (response.status === HTTP_STATUS_TOO_MANY_REQUESTS) {
    throw new RateLimitError(
      "Too many search requests. Please wait a moment and try again."
    )
  }

  if (
    response.status === HTTP_STATUS_SERVICE_UNAVAILABLE ||
    response.status === HTTP_STATUS_BAD_GATEWAY
  ) {
    throw new ServiceUnavailableError(
      "Hotel search service is temporarily unavailable. Please try again later."
    )
  }

  if (response.status === HTTP_STATUS_BAD_REQUEST) {
    try {
      const errorData = JSON.parse(errorText)
      throw new ValidationError(
        errorData.message || "Invalid search parameters"
      )
    } catch {
      throw new ValidationError("Invalid search parameters")
    }
  }

  throw new ExternalServiceError(
    `Hotel search failed: ${errorText || response.statusText}`
  )
}

function formatSearchResponse(data: unknown) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return NextResponse.json({
      success: true,
      message: "No hotels found for the selected criteria",
      results: [],
      count: 0,
    })
  }

  const results = Array.isArray(data) ? data : [data]
  return NextResponse.json({
    success: true,
    results,
    count: results.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    validateSearchRequest(body)

    const { dateFrom, dateTo, hotelName, city, adults, children, stars, limit } = body

    const results = await mediciApi.searchHotels({
      dateFrom,
      dateTo,
      hotelName: hotelName || undefined,
      city: city || undefined,
      adults: adults || 2,
      children: children || [],
      stars: stars || undefined,
      limit: limit || 50,
    })

    return formatSearchResponse(results)
  } catch (error) {
    console.error("Search API Error:", error)
    return handleApiError(error)
  }
}
