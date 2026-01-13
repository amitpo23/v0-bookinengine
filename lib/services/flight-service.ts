/**
 * Flight Search Service
 * Supports Amadeus API and SerpAPI for flight searches
 */

export interface FlightSearchParams {
  origin: string; // IATA code (e.g., TLV)
  destination: string; // IATA code (e.g., JFK)
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD (for round trip)
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  maxResults?: number;
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
    base: string;
    fees: string;
  };
  itineraries: FlightItinerary[];
  travelerPricings: TravelerPricing[];
  validatingAirlineCodes: string[];
  numberOfBookableSeats?: number;
}

export interface FlightItinerary {
  duration: string; // PT12H30M format
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: FlightPoint;
  arrival: FlightPoint;
  carrierCode: string; // Airline code (e.g., LY)
  carrierName?: string;
  flightNumber: string;
  aircraft?: {
    code: string;
    name?: string;
  };
  duration: string;
  numberOfStops: number;
  blacklistedInEU?: boolean;
}

export interface FlightPoint {
  iataCode: string;
  terminal?: string;
  at: string; // ISO datetime
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: 'ADULT' | 'CHILD' | 'INFANT';
  price: {
    total: string;
    base: string;
  };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    brandedFare?: string;
    class: string;
    includedCheckedBags?: {
      quantity: number;
    };
  }>;
}

// Amadeus OAuth token cache
let amadeusToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Amadeus access token
 */
async function getAmadeusToken(): Promise<string> {
  // Return cached token if still valid
  if (amadeusToken && Date.now() < tokenExpiry) {
    return amadeusToken;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  const apiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus credentials not configured');
  }

  try {
    const response = await fetch(`${apiUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Amadeus auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    amadeusToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 min early

    if (!amadeusToken) {
      throw new Error('Failed to get access token from Amadeus');
    }

    return amadeusToken;
  } catch (error) {
    console.error('[Flights] Amadeus authentication error:', error);
    throw error;
  }
}

/**
 * Search for flight offers using Amadeus API
 */
export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  try {
    const provider = process.env.FLIGHT_API_PROVIDER || 'amadeus';

    if (provider === 'amadeus') {
      return await searchFlightsAmadeus(params);
    } else if (provider === 'serpapi') {
      return await searchFlightsSerpAPI(params);
    } else {
      console.warn('[Flights] No provider configured, returning mock data');
      return getMockFlights(params);
    }
  } catch (error) {
    console.error('[Flights] Search error:', error);
    return getMockFlights(params);
  }
}

/**
 * Search flights via Amadeus API
 */
async function searchFlightsAmadeus(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  const token = await getAmadeusToken();
  const apiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';

  const queryParams = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    max: (params.maxResults || 10).toString(),
    currencyCode: 'USD',
  });

  if (params.returnDate) {
    queryParams.append('returnDate', params.returnDate);
  }

  if (params.children) {
    queryParams.append('children', params.children.toString());
  }

  if (params.infants) {
    queryParams.append('infants', params.infants.toString());
  }

  if (params.travelClass) {
    queryParams.append('travelClass', params.travelClass);
  }

  if (params.nonStop) {
    queryParams.append('nonStop', 'true');
  }

  const response = await fetch(
    `${apiUrl}/v2/shopping/flight-offers?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Amadeus API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Search flights via SerpAPI (Google Flights)
 */
async function searchFlightsSerpAPI(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error('SerpAPI key not configured');
  }

  const queryParams = new URLSearchParams({
    engine: 'google_flights',
    departure_id: params.origin,
    arrival_id: params.destination,
    outbound_date: params.departureDate,
    type: params.returnDate ? '1' : '2', // 1=round trip, 2=one way
    adults: params.adults.toString(),
    currency: 'USD',
    hl: 'en',
    api_key: apiKey,
  });

  if (params.returnDate) {
    queryParams.append('return_date', params.returnDate);
  }

  if (params.children) {
    queryParams.append('children', params.children.toString());
  }

  if (params.travelClass) {
    const classMap: Record<string, string> = {
      ECONOMY: '1',
      PREMIUM_ECONOMY: '2',
      BUSINESS: '3',
      FIRST: '4',
    };
    queryParams.append('travel_class', classMap[params.travelClass] || '1');
  }

  const response = await fetch(`https://serpapi.com/search?${queryParams}`);

  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.statusText}`);
  }

  const data = await response.json();
  return convertSerpAPIToFlightOffers(data);
}

/**
 * Get flight price calendar
 */
export async function getFlightPriceCalendar(
  origin: string,
  destination: string,
  departureMonth: string // YYYY-MM
): Promise<Record<string, { price: number; currency: string }>> {
  try {
    const token = await getAmadeusToken();
    const apiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';

    const response = await fetch(
      `${apiUrl}/v1/shopping/flight-dates?origin=${origin}&destination=${destination}&departureDate=${departureMonth}-01,${departureMonth}-31&oneWay=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    const calendar: Record<string, { price: number; currency: string }> = {};

    if (data.data) {
      data.data.forEach((item: any) => {
        calendar[item.departureDate] = {
          price: parseFloat(item.price.total),
          currency: 'USD',
        };
      });
    }

    return calendar;
  } catch (error) {
    console.error('[Flights] Calendar error:', error);
    return {};
  }
}

/**
 * Get cheapest flight quotes
 */
export async function getCheapestFlights(
  origin: string,
  destination?: string
): Promise<Array<{ destination: string; price: number; currency: string; departureDate: string }>> {
  try {
    const token = await getAmadeusToken();
    const apiUrl = process.env.AMADEUS_API_URL || 'https://test.api.amadeus.com';

    const queryParams = new URLSearchParams({
      origin,
      maxPrice: '2000',
      max: '10',
    });

    if (destination) {
      queryParams.append('destination', destination);
    }

    const response = await fetch(
      `${apiUrl}/v1/shopping/flight-destinations?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('[Flights] Cheapest flights error:', error);
    return [];
  }
}

// Helper functions

function convertSerpAPIToFlightOffers(data: any): FlightOffer[] {
  const flights = data.best_flights || data.other_flights || [];

  return flights.map((flight: any, index: number) => {
    const segments = flight.flights || [];

    return {
      id: `serp-${index}`,
      price: {
        total: flight.price?.toString() || '0',
        currency: 'USD',
        base: flight.price?.toString() || '0',
        fees: '0',
      },
      itineraries: [
        {
          duration: `PT${Math.floor(flight.total_duration / 60)}H${flight.total_duration % 60}M`,
          segments: segments.map((seg: any) => ({
            departure: {
              iataCode: seg.departure_airport.id,
              at: seg.departure_airport.time,
            },
            arrival: {
              iataCode: seg.arrival_airport.id,
              at: seg.arrival_airport.time,
            },
            carrierCode: seg.airline,
            carrierName: seg.airline_name || seg.airline,
            flightNumber: seg.flight_number,
            duration: `PT${Math.floor(seg.duration / 60)}H${seg.duration % 60}M`,
            numberOfStops: 0,
          })),
        },
      ],
      travelerPricings: [],
      validatingAirlineCodes: [segments[0]?.airline || 'XX'],
    };
  });
}

function getMockFlights(params: FlightSearchParams): FlightOffer[] {
  const basePrice = 500 + Math.random() * 1000;

  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock-${i}`,
    price: {
      total: (basePrice + i * 50).toFixed(2),
      currency: 'USD',
      base: (basePrice + i * 50 - 30).toFixed(2),
      fees: '30.00',
    },
    itineraries: [
      {
        duration: 'PT12H30M',
        segments: [
          {
            departure: {
              iataCode: params.origin,
              at: new Date(params.departureDate).toISOString(),
            },
            arrival: {
              iataCode: params.destination,
              at: new Date(new Date(params.departureDate).getTime() + 12.5 * 3600000).toISOString(),
            },
            carrierCode: i === 0 ? 'LY' : i === 1 ? 'UA' : 'BA',
            carrierName: i === 0 ? 'El Al' : i === 1 ? 'United' : 'British Airways',
            flightNumber: `${100 + i}`,
            duration: 'PT12H30M',
            numberOfStops: i % 2,
          },
        ],
      },
    ],
    travelerPricings: [
      {
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          total: (basePrice + i * 50).toFixed(2),
          base: (basePrice + i * 50 - 30).toFixed(2),
        },
        fareDetailsBySegment: [
          {
            segmentId: '1',
            cabin: params.travelClass || 'ECONOMY',
            fareBasis: 'K',
            class: 'K',
            includedCheckedBags: {
              quantity: 1,
            },
          },
        ],
      },
    ],
    validatingAirlineCodes: [i === 0 ? 'LY' : i === 1 ? 'UA' : 'BA'],
    numberOfBookableSeats: 9,
  }));
}

/**
 * Get airline name by IATA code
 */
export function getAirlineName(iataCode: string): string {
  const airlines: Record<string, string> = {
    LY: 'El Al Israel Airlines',
    UA: 'United Airlines',
    BA: 'British Airways',
    AF: 'Air France',
    LH: 'Lufthansa',
    TK: 'Turkish Airlines',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    SQ: 'Singapore Airlines',
    AA: 'American Airlines',
    DL: 'Delta Air Lines',
    AC: 'Air Canada',
  };

  return airlines[iataCode] || iataCode;
}
