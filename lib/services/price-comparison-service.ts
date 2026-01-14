/**
 * Price Comparison Service
 * Compare hotel prices across multiple booking platforms
 * Find the best deals for customers
 */

// Types
export interface PriceSource {
  provider: string;
  providerLogo?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  url?: string;
  includes: string[];
  cancellationPolicy?: string;
  paymentType: 'prepay' | 'pay_at_hotel' | 'partial';
  lastUpdated: string;
}

export interface PriceComparison {
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: { adults: number; children: number };
  sources: PriceSource[];
  bestDeal: PriceSource | null;
  savings?: {
    amount: number;
    percentage: number;
    comparedTo: string;
  };
  priceHistory?: PriceHistoryPoint[];
  prediction?: PricePrediction;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  source: string;
}

export interface PricePrediction {
  trend: 'rising' | 'stable' | 'falling';
  confidence: number;
  recommendation: 'book_now' | 'wait' | 'monitor';
  expectedChange?: number;
  bestTimeToBook?: string;
}

export interface PriceAlert {
  id: string;
  customerId: string;
  hotelId: string;
  targetPrice: number;
  currentPrice: number;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
  triggeredAt?: string;
}

// Cache for price comparisons
const priceCache = new Map<string, { data: PriceComparison; timestamp: number }>();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes (prices change frequently)

function getCacheKey(hotelId: string, checkIn: string, checkOut: string): string {
  return `${hotelId}-${checkIn}-${checkOut}`;
}

/**
 * Compare prices across multiple providers
 */
export async function comparePrices(
  hotelId: string,
  hotelName: string,
  checkIn: string,
  checkOut: string,
  guests: { adults: number; children: number }
): Promise<PriceComparison | null> {
  const cacheKey = getCacheKey(hotelId, checkIn, checkOut);
  
  // Check cache
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  try {
    const response = await fetch('/api/prices/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelId,
        hotelName,
        checkIn,
        checkOut,
        guests,
      }),
    });

    if (!response.ok) {
      console.error('Failed to compare prices:', response.statusText);
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      // Process and find best deal
      const comparison = processComparison(result.data);
      
      // Cache the result
      priceCache.set(cacheKey, {
        data: comparison,
        timestamp: Date.now(),
      });
      
      return comparison;
    }

    return null;
  } catch (error) {
    console.error('Error comparing prices:', error);
    return null;
  }
}

/**
 * Process comparison data to find best deal
 */
function processComparison(data: PriceComparison): PriceComparison {
  if (!data.sources || data.sources.length === 0) {
    return { ...data, bestDeal: null };
  }

  // Sort by price
  const sortedSources = [...data.sources].sort((a, b) => a.price - b.price);
  const bestDeal = sortedSources[0];
  const highestPrice = sortedSources[sortedSources.length - 1];

  // Calculate savings
  const savings = highestPrice.price > bestDeal.price
    ? {
        amount: highestPrice.price - bestDeal.price,
        percentage: Math.round(((highestPrice.price - bestDeal.price) / highestPrice.price) * 100),
        comparedTo: highestPrice.provider,
      }
    : undefined;

  return {
    ...data,
    sources: sortedSources,
    bestDeal,
    savings,
  };
}

/**
 * Get price history for a hotel
 */
export async function getPriceHistory(
  hotelId: string,
  checkIn: string,
  checkOut: string,
  days: number = 30
): Promise<PriceHistoryPoint[]> {
  try {
    const response = await fetch('/api/prices/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelId, checkIn, checkOut, days }),
    });

    if (!response.ok) return [];

    const result = await response.json();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Get price prediction/trend analysis
 */
export async function getPricePrediction(
  hotelId: string,
  checkIn: string,
  checkOut: string
): Promise<PricePrediction | null> {
  try {
    const response = await fetch('/api/prices/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelId, checkIn, checkOut }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Create price alert
 */
export async function createPriceAlert(
  customerId: string,
  hotelId: string,
  targetPrice: number,
  checkIn: string,
  checkOut: string
): Promise<PriceAlert | null> {
  try {
    const response = await fetch('/api/prices/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        hotelId,
        targetPrice,
        checkIn,
        checkOut,
      }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Get active price alerts for customer
 */
export async function getCustomerPriceAlerts(customerId: string): Promise<PriceAlert[]> {
  try {
    const response = await fetch(`/api/prices/alerts?customerId=${customerId}`);
    if (!response.ok) return [];

    const result = await response.json();
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Delete price alert
 */
export async function deletePriceAlert(alertId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/prices/alerts/${alertId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Clear price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}

/**
 * Get cache stats
 */
export function getPriceCacheStats(): { size: number; keys: string[] } {
  return {
    size: priceCache.size,
    keys: Array.from(priceCache.keys()),
  };
}
