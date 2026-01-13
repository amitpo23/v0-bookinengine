import { NextRequest, NextResponse } from 'next/server';
import {
  searchFlights,
  getFlightPriceCalendar,
  getCheapestFlights,
  type FlightSearchParams,
} from '@/lib/services/flight-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action = 'search',
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      infants = 0,
      travelClass = 'ECONOMY',
      nonStop = false,
      maxResults = 10,
      departureMonth,
    } = body;

    // Search flights
    if (action === 'search') {
      if (!origin || !destination || !departureDate) {
        return NextResponse.json(
          {
            error: 'Missing required fields: origin, destination, departureDate',
          },
          { status: 400 }
        );
      }

      // Validate IATA codes (3 letters)
      if (origin.length !== 3 || destination.length !== 3) {
        return NextResponse.json(
          {
            error: 'Invalid IATA codes. Use 3-letter codes (e.g., TLV, JFK)',
          },
          { status: 400 }
        );
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(departureDate)) {
        return NextResponse.json(
          {
            error: 'Invalid date format. Use YYYY-MM-DD',
          },
          { status: 400 }
        );
      }

      if (returnDate && !dateRegex.test(returnDate)) {
        return NextResponse.json(
          {
            error: 'Invalid return date format. Use YYYY-MM-DD',
          },
          { status: 400 }
        );
      }

      const params: FlightSearchParams = {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        travelClass,
        nonStop,
        maxResults,
      };

      const flights = await searchFlights(params);

      return NextResponse.json({
        success: true,
        data: flights,
        count: flights.length,
        params,
      });
    }

    // Price calendar
    if (action === 'calendar') {
      if (!origin || !destination || !departureMonth) {
        return NextResponse.json(
          {
            error: 'Missing required fields: origin, destination, departureMonth',
          },
          { status: 400 }
        );
      }

      const calendar = await getFlightPriceCalendar(
        origin.toUpperCase(),
        destination.toUpperCase(),
        departureMonth
      );

      return NextResponse.json({
        success: true,
        data: calendar,
      });
    }

    // Cheapest flights
    if (action === 'cheapest') {
      if (!origin) {
        return NextResponse.json(
          {
            error: 'Origin is required',
          },
          { status: 400 }
        );
      }

      const cheapest = await getCheapestFlights(
        origin.toUpperCase(),
        destination?.toUpperCase()
      );

      return NextResponse.json({
        success: true,
        data: cheapest,
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action. Use: search, calendar, or cheapest',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API Flights] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search flights',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'search';

    // Cheapest flights lookup
    if (action === 'cheapest') {
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');

      if (!origin) {
        return NextResponse.json(
          {
            error: 'Origin parameter is required',
          },
          { status: 400 }
        );
      }

      const cheapest = await getCheapestFlights(
        origin.toUpperCase(),
        destination?.toUpperCase()
      );

      return NextResponse.json({
        success: true,
        data: cheapest,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Use POST method for flight searches',
      supportedActions: ['search', 'calendar', 'cheapest'],
    });
  } catch (error: any) {
    console.error('[API Flights] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
