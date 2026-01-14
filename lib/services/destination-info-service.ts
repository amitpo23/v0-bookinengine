/**
 * Destination Info Service
 * Uses Tavily API to get real-time information about travel destinations
 * Including weather, events, attractions, and travel tips
 */

import type { TavilyHotelEnhancement } from '@/types/hotel-types';

// Types
export interface DestinationInfo {
  destination: string;
  country: string;
  weather?: WeatherInfo;
  events?: EventInfo[];
  attractions?: AttractionInfo[];
  travelTips?: string[];
  bestTimeToVisit?: string;
  averagePrices?: PriceRange;
  safety?: SafetyInfo;
  localInfo?: LocalInfo;
  lastUpdated: string;
}

export interface WeatherInfo {
  current?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  forecast?: {
    date: string;
    high: number;
    low: number;
    condition: string;
  }[];
  seasonal?: string;
}

export interface EventInfo {
  name: string;
  date?: string;
  type: 'festival' | 'concert' | 'exhibition' | 'sports' | 'holiday' | 'other';
  description?: string;
  url?: string;
}

export interface AttractionInfo {
  name: string;
  type: 'landmark' | 'museum' | 'beach' | 'restaurant' | 'shopping' | 'nature' | 'entertainment';
  rating?: number;
  description?: string;
  address?: string;
  priceRange?: string;
  url?: string;
}

export interface PriceRange {
  budget: { min: number; max: number };
  midRange: { min: number; max: number };
  luxury: { min: number; max: number };
  currency: string;
}

export interface SafetyInfo {
  level: 'safe' | 'moderate' | 'caution' | 'avoid';
  advisories?: string[];
  tips?: string[];
}

export interface LocalInfo {
  language: string;
  currency: string;
  timezone: string;
  emergencyNumber?: string;
  tipping?: string;
}

// Cache
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
const destinationCache = new Map<string, { data: DestinationInfo; timestamp: number }>();

function getCacheKey(destination: string, dates?: { checkIn?: string; checkOut?: string }): string {
  return `${destination.toLowerCase()}-${dates?.checkIn || 'any'}-${dates?.checkOut || 'any'}`;
}

function isCacheValid(key: string): boolean {
  const cached = destinationCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION_MS;
}

/**
 * Get comprehensive destination information using Tavily search
 */
export async function getDestinationInfo(
  destination: string,
  options?: {
    checkIn?: string;
    checkOut?: string;
    includeWeather?: boolean;
    includeEvents?: boolean;
    includeAttractions?: boolean;
  }
): Promise<DestinationInfo | null> {
  const cacheKey = getCacheKey(destination, options);
  
  // Check cache
  if (isCacheValid(cacheKey)) {
    return destinationCache.get(cacheKey)!.data;
  }

  try {
    const response = await fetch('/api/destination/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination,
        ...options,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch destination info:', response.statusText);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      // Cache the result
      destinationCache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
      });
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching destination info:', error);
    return null;
  }
}

/**
 * Get weather forecast for destination
 */
export async function getDestinationWeather(
  destination: string,
  dates?: { checkIn?: string; checkOut?: string }
): Promise<WeatherInfo | null> {
  try {
    const response = await fetch('/api/destination/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, ...dates }),
    });

    if (!response.ok) return null;
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Get events happening at destination during travel dates
 */
export async function getDestinationEvents(
  destination: string,
  checkIn: string,
  checkOut: string
): Promise<EventInfo[]> {
  try {
    const response = await fetch('/api/destination/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, checkIn, checkOut }),
    });

    if (!response.ok) return [];
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Get top attractions at destination
 */
export async function getDestinationAttractions(
  destination: string,
  type?: AttractionInfo['type']
): Promise<AttractionInfo[]> {
  try {
    const response = await fetch('/api/destination/attractions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, type }),
    });

    if (!response.ok) return [];
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Clear destination cache
 */
export function clearDestinationCache(): void {
  destinationCache.clear();
}

/**
 * Get cache statistics
 */
export function getDestinationCacheStats(): { size: number; keys: string[] } {
  return {
    size: destinationCache.size,
    keys: Array.from(destinationCache.keys()),
  };
}
