import { NextRequest, NextResponse } from 'next/server'

/**
 * Backend proxy for static hotel data API
 * This solves the CORS issue when fetching from static-data.innstant-servers.com
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params

    console.log(`🏨 Proxying static data request for hotel: ${hotelId}`)

    const response = await fetch(
      `https://static-data.innstant-servers.com/hotels/${hotelId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      console.error(`❌ Static data API failed: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'Failed to fetch hotel data', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`✅ Static data fetched successfully for hotel ${hotelId}`)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('❌ Static data proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
