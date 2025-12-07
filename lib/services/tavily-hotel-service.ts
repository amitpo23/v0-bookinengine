import type { TavilyHotelEnhancement } from '@/types/hotel-types';

// Constants
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const CACHE_DURATION_MINUTES = 30;
const CACHE_DURATION =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * CACHE_DURATION_MINUTES;

// Module-level cache
const cache = new Map<string, TavilyHotelEnhancement>();
const cacheTimestamps = new Map<string, number>();

function isCacheValid(cacheKey: string): boolean {
  const timestamp = cacheTimestamps.get(cacheKey);
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Get enhanced hotel data from Tavily API
 * This enriches hotel information with reviews, amenities, and images from the web
 */
export async function getEnhancedHotelData(
  hotelName: string,
  city: string,
  checkIn?: string,
  checkOut?: string
): Promise<TavilyHotelEnhancement | null> {
  const cacheKey = `${hotelName.toLowerCase()}-${city.toLowerCase()}`;

  // Check cache first
  if (isCacheValid(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await fetch('/api/tavily/hotel-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hotelName,
        city,
        checkIn,
        checkOut,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      // Cache the result
      cache.set(cacheKey, result.data);
      cacheTimestamps.set(cacheKey, Date.now());

      return result.data;
    }

    return null;
  } catch (_error) {
    return null;
  }
}

export function clearCache(): void {
  cache.clear();
  cacheTimestamps.clear();
}

export function getCacheSize(): number {
  return cache.size;
}
