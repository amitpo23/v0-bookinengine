// Hotel Data Enrichment Service
// Fetches additional hotel information from external sources when data is missing

import "server-only"

export interface HotelEnrichmentData {
  description?: string
  images?: string[]
  facilities?: string[]
  rating?: number
  address?: string
  phone?: string
  website?: string
  reviews?: {
    rating: number
    count: number
    source: string
  }[]
}

/**
 * Enriches hotel data with information from external sources
 * Uses multiple strategies to find and fetch hotel information
 */
export async function enrichHotelData(
  hotelName: string,
  city?: string,
  existingData?: {
    description?: string
    images?: string[]
    facilities?: string[]
    address?: string
  }
): Promise<HotelEnrichmentData> {
  const enrichment: HotelEnrichmentData = {}

  // Check if we need to fetch anything
  const needsDescription = !existingData?.description || existingData.description.length < 50
  const needsImages = !existingData?.images || existingData.images.length === 0
  const needsFacilities = !existingData?.facilities || existingData.facilities.length === 0

  if (!needsDescription && !needsImages && !needsFacilities) {
    // Data is complete, no enrichment needed
    return enrichment
  }

  try {
    // Strategy 1: Try Google Places API (if API key is available)
    const googleData = await fetchFromGooglePlaces(hotelName, city)
    if (googleData) {
      if (needsDescription && googleData.description) {
        enrichment.description = googleData.description
      }
      if (needsImages && googleData.images) {
        enrichment.images = googleData.images
      }
      if (needsFacilities && googleData.facilities) {
        enrichment.facilities = googleData.facilities
      }
      enrichment.rating = googleData.rating
      enrichment.reviews = googleData.reviews
    }

    // Strategy 2: Try Bing/DuckDuckGo Search API for basic info
    if (needsDescription && !enrichment.description) {
      const searchData = await fetchFromSearchEngine(hotelName, city)
      if (searchData?.description) {
        enrichment.description = searchData.description
      }
    }

    // Strategy 3: Use AI to generate description if still missing
    if (needsDescription && !enrichment.description && existingData?.facilities && existingData.facilities.length > 0) {
      enrichment.description = generateDescriptionFromFacilities(
        hotelName,
        existingData.facilities,
        city
      )
    }

    return enrichment
  } catch (error) {
    console.error("Hotel enrichment error:", error)
    return enrichment
  }
}

/**
 * Fetch hotel data from Google Places API
 */
async function fetchFromGooglePlaces(
  hotelName: string,
  city?: string
): Promise<HotelEnrichmentData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return null
  }

  try {
    // Step 1: Find Place
    const searchQuery = city ? `${hotelName} ${city}` : hotelName
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`

    const findResponse = await fetch(findPlaceUrl)
    const findData = await findResponse.json()

    if (!findData.candidates || findData.candidates.length === 0) {
      return null
    }

    const placeId = findData.candidates[0].place_id

    // Step 2: Get Place Details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,photos,editorial_summary,types,business_status&key=${apiKey}`

    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (!detailsData.result) {
      return null
    }

    const result = detailsData.result

    // Extract photos
    const images: string[] = []
    if (result.photos) {
      for (const photo of result.photos.slice(0, 10)) {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photo.photo_reference}&key=${apiKey}`
        images.push(photoUrl)
      }
    }

    return {
      description: result.editorial_summary?.overview || result.name,
      images,
      rating: result.rating,
      address: result.formatted_address,
      phone: result.formatted_phone_number,
      website: result.website,
      reviews: [
        {
          rating: result.rating || 0,
          count: result.user_ratings_total || 0,
          source: "Google",
        },
      ],
    }
  } catch (error) {
    console.error("Google Places API error:", error)
    return null
  }
}

/**
 * Fetch hotel data from search engines (Bing/DuckDuckGo)
 */
async function fetchFromSearchEngine(
  hotelName: string,
  city?: string
): Promise<{ description?: string } | null> {
  // Use Bing Search API if available
  const bingApiKey = process.env.BING_SEARCH_API_KEY

  if (!bingApiKey) {
    return null
  }

  try {
    const searchQuery = city ? `${hotelName} hotel ${city}` : `${hotelName} hotel`
    const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(searchQuery)}&count=3`

    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": bingApiKey,
      },
    })

    const data = await response.json()

    if (data.webPages?.value && data.webPages.value.length > 0) {
      // Extract description from first result
      const firstResult = data.webPages.value[0]
      return {
        description: firstResult.snippet || "",
      }
    }

    return null
  } catch (error) {
    console.error("Bing Search API error:", error)
    return null
  }
}

/**
 * Generate a description from facilities list when no other data is available
 */
function generateDescriptionFromFacilities(
  hotelName: string,
  facilities: string[],
  city?: string
): string {
  const location = city ? ` in ${city}` : ""
  const facilitiesText = facilities.slice(0, 5).join(", ")

  return `${hotelName}${location} offers modern accommodations with excellent facilities including ${facilitiesText}. The hotel provides comfortable rooms and quality services for both leisure and business travelers.`
}

/**
 * Batch enrich multiple hotels
 */
export async function enrichHotels(
  hotels: Array<{
    hotelName: string
    city?: string
    description?: string
    images?: string[]
    facilities?: string[]
    address?: string
  }>
): Promise<Array<HotelEnrichmentData>> {
  // Enrich in parallel with rate limiting
  const enrichmentPromises = hotels.map((hotel, index) =>
    // Add delay to avoid rate limiting
    new Promise<HotelEnrichmentData>((resolve) => {
      setTimeout(async () => {
        const enrichment = await enrichHotelData(hotel.hotelName, hotel.city, {
          description: hotel.description,
          images: hotel.images,
          facilities: hotel.facilities,
          address: hotel.address,
        })
        resolve(enrichment)
      }, index * 200) // 200ms delay between requests
    })
  )

  return Promise.all(enrichmentPromises)
}

/**
 * Simple fallback: Use Wikipedia/DBpedia for hotel info
 */
async function fetchFromWikipedia(hotelName: string): Promise<{ description?: string } | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(hotelName)}&limit=1&format=json`

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data && data[2] && data[2][0]) {
      return {
        description: data[2][0],
      }
    }

    return null
  } catch (error) {
    console.error("Wikipedia API error:", error)
    return null
  }
}
