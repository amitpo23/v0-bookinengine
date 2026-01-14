/**
 * Travel Bundle Service
 * Find and manage flight+hotel packages for better deals
 * Combines multiple travel components into bundles
 */

// Types
export interface FlightInfo {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  origin: string;
  originAirport: string;
  destination: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopLocations?: string[];
  class: 'economy' | 'premium_economy' | 'business' | 'first';
  baggage: {
    cabin: string;
    checked: string;
  };
  price: number;
  currency: string;
}

export interface HotelBundleInfo {
  hotelId: string;
  hotelName: string;
  stars: number;
  roomType: string;
  boardType: 'room_only' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive';
  price: number;
  currency: string;
  image?: string;
}

export interface TransferInfo {
  type: 'private' | 'shared' | 'taxi' | 'bus';
  provider: string;
  price: number;
  currency: string;
  included: boolean;
}

export interface TravelBundle {
  id: string;
  type: 'flight_hotel' | 'flight_hotel_transfer' | 'hotel_only' | 'custom';
  
  // Flight details (if included)
  outboundFlight?: FlightInfo;
  returnFlight?: FlightInfo;
  
  // Hotel details
  hotel: HotelBundleInfo;
  
  // Transfer details (if included)
  transfer?: TransferInfo;
  
  // Dates
  checkIn: string;
  checkOut: string;
  nights: number;
  
  // Pricing
  totalPrice: number;
  originalPrice: number; // Sum of individual components
  savings: number;
  savingsPercentage: number;
  currency: string;
  pricePerPerson?: number;
  
  // Extras
  extras?: BundleExtra[];
  
  // Provider info
  provider: string;
  providerLogo?: string;
  bookingUrl?: string;
  
  // Validity
  validUntil: string;
  seatsRemaining?: number;
}

export interface BundleExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  included: boolean;
  type: 'insurance' | 'tours' | 'car_rental' | 'lounge_access' | 'fast_track' | 'other';
}

export interface BundleSearchParams {
  origin: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  class?: FlightInfo['class'];
  hotelStars?: number[];
  boardType?: HotelBundleInfo['boardType'];
  maxBudget?: number;
  directFlightsOnly?: boolean;
  includeTransfer?: boolean;
}

export interface BundleSearchResult {
  bundles: TravelBundle[];
  totalResults: number;
  filters: {
    airlines: string[];
    hotelStars: number[];
    priceRange: { min: number; max: number };
    boardTypes: HotelBundleInfo['boardType'][];
  };
  bestDeal?: TravelBundle;
  cheapest?: TravelBundle;
  fastest?: TravelBundle;
}

// Cache
const bundleCache = new Map<string, { data: BundleSearchResult; timestamp: number }>();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getCacheKey(params: BundleSearchParams): string {
  return JSON.stringify(params);
}

/**
 * Search for travel bundles (flight + hotel packages)
 */
export async function searchBundles(params: BundleSearchParams): Promise<BundleSearchResult | null> {
  const cacheKey = getCacheKey(params);
  
  // Check cache
  const cached = bundleCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  try {
    const response = await fetch('/api/bundles/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error('Failed to search bundles:', response.statusText);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      // Process and identify best deals
      const processedResult = processBundleResults(result.data);
      
      // Cache the result
      bundleCache.set(cacheKey, {
        data: processedResult,
        timestamp: Date.now(),
      });
      
      return processedResult;
    }

    return null;
  } catch (error) {
    console.error('Error searching bundles:', error);
    return null;
  }
}

/**
 * Process bundle results to identify best options
 */
function processBundleResults(data: BundleSearchResult): BundleSearchResult {
  if (!data.bundles || data.bundles.length === 0) {
    return data;
  }

  // Sort by savings percentage to find best deal
  const sortedBySavings = [...data.bundles].sort(
    (a, b) => b.savingsPercentage - a.savingsPercentage
  );
  
  // Sort by price to find cheapest
  const sortedByPrice = [...data.bundles].sort(
    (a, b) => a.totalPrice - b.totalPrice
  );
  
  // Sort by flight duration to find fastest
  const sortedByDuration = [...data.bundles]
    .filter(b => b.outboundFlight)
    .sort((a, b) => {
      const getDuration = (flight?: FlightInfo) => {
        if (!flight) return Infinity;
        // Parse duration like "2h 30m" to minutes
        const match = flight.duration.match(/(\d+)h\s*(\d+)?m?/);
        if (!match) return Infinity;
        return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
      };
      return getDuration(a.outboundFlight) - getDuration(b.outboundFlight);
    });

  return {
    ...data,
    bestDeal: sortedBySavings[0],
    cheapest: sortedByPrice[0],
    fastest: sortedByDuration[0],
  };
}

/**
 * Get bundle details by ID
 */
export async function getBundleDetails(bundleId: string): Promise<TravelBundle | null> {
  try {
    const response = await fetch(`/api/bundles/${bundleId}`);
    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Check bundle availability before booking
 */
export async function checkBundleAvailability(bundleId: string): Promise<{
  available: boolean;
  price?: number;
  changes?: string[];
}> {
  try {
    const response = await fetch(`/api/bundles/${bundleId}/availability`);
    if (!response.ok) return { available: false };

    const result = await response.json();
    return result.success ? result.data : { available: false };
  } catch {
    return { available: false };
  }
}

/**
 * Create custom bundle from individual components
 */
export async function createCustomBundle(components: {
  flightIds?: string[];
  hotelId: string;
  roomCode: string;
  checkIn: string;
  checkOut: string;
  transferType?: TransferInfo['type'];
  extras?: string[];
}): Promise<TravelBundle | null> {
  try {
    const response = await fetch('/api/bundles/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(components),
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Get price breakdown for bundle
 */
export async function getBundlePriceBreakdown(bundleId: string): Promise<{
  flight?: number;
  hotel: number;
  transfer?: number;
  extras?: { name: string; price: number }[];
  taxes: number;
  fees: number;
  discount: number;
  total: number;
  currency: string;
} | null> {
  try {
    const response = await fetch(`/api/bundles/${bundleId}/breakdown`);
    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Clear bundle cache
 */
export function clearBundleCache(): void {
  bundleCache.clear();
}

/**
 * Get cache stats
 */
export function getBundleCacheStats(): { size: number; keys: string[] } {
  return {
    size: bundleCache.size,
    keys: Array.from(bundleCache.keys()),
  };
}
