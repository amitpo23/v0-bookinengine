/**
 * Google Trends Service
 * Provides travel trends and destination popularity data
 */

export interface TrendData {
  keyword: string;
  trend: 'rising' | 'stable' | 'falling';
  interest: number; // 0-100
  relatedQueries: string[];
  region: string;
  timestamp: Date;
}

export interface DestinationTrend {
  destination: string;
  country: string;
  popularityScore: number; // 0-100
  seasonality: 'high' | 'medium' | 'low';
  trending: boolean;
  topReasons: string[];
  bestMonths: string[];
}

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const trendsCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Get travel trends for a specific destination
 */
export async function getDestinationTrends(
  destination: string,
  country: string = 'IL'
): Promise<DestinationTrend | null> {
  const cacheKey = `dest-${destination}-${country}`;
  
  // Check cache
  const cached = trendsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Using SerpAPI for Google Trends data (more reliable than google-trends-api)
    const apiKey = process.env.SERPAPI_KEY;
    
    if (!apiKey) {
      console.warn('[Trends] SERPAPI_KEY not configured, returning mock data');
      return getMockDestinationTrend(destination, country);
    }

    const query = `${destination} ${country} travel hotel vacation`;
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&geo=${country}&api_key=${apiKey}`
    );

    if (!response.ok) {
      console.error('[Trends] SerpAPI error:', response.statusText);
      return getMockDestinationTrend(destination, country);
    }

    const data = await response.json();
    const trend = parseGoogleTrendsData(data, destination, country);
    
    // Cache the result
    trendsCache.set(cacheKey, { data: trend, timestamp: Date.now() });
    
    return trend;
  } catch (error) {
    console.error('[Trends] Error fetching trends:', error);
    return getMockDestinationTrend(destination, country);
  }
}

/**
 * Get popular travel keywords and trends
 */
export async function getTravelTrends(
  keywords: string[],
  region: string = 'IL'
): Promise<TrendData[]> {
  const cacheKey = `travel-${keywords.join(',')}-${region}`;
  
  const cached = trendsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const apiKey = process.env.SERPAPI_KEY;
    
    if (!apiKey) {
      return keywords.map(keyword => getMockTrendData(keyword, region));
    }

    const trends: TrendData[] = [];
    
    for (const keyword of keywords) {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&geo=${region}&api_key=${apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        trends.push(parseTrendData(data, keyword, region));
      }
    }
    
    trendsCache.set(cacheKey, { data: trends, timestamp: Date.now() });
    return trends;
  } catch (error) {
    console.error('[Trends] Error fetching travel trends:', error);
    return keywords.map(keyword => getMockTrendData(keyword, region));
  }
}

/**
 * Get top trending destinations worldwide
 */
export async function getTopTrendingDestinations(
  limit: number = 10
): Promise<DestinationTrend[]> {
  const cacheKey = `top-destinations-${limit}`;
  
  const cached = trendsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const apiKey = process.env.SERPAPI_KEY;
    
    if (!apiKey) {
      return getMockTopDestinations(limit);
    }

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_trends&q=travel+destinations&geo=US&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      return getMockTopDestinations(limit);
    }

    const data = await response.json();
    const destinations = parseTopDestinations(data, limit);
    
    trendsCache.set(cacheKey, { data: destinations, timestamp: Date.now() });
    return destinations;
  } catch (error) {
    console.error('[Trends] Error fetching top destinations:', error);
    return getMockTopDestinations(limit);
  }
}

// Helper functions

function parseGoogleTrendsData(data: any, destination: string, country: string): DestinationTrend {
  // Parse real Google Trends data
  const interestOverTime = data.interest_over_time?.timeline_data || [];
  const relatedQueries = data.related_queries?.rising || [];
  
  const avgInterest = interestOverTime.reduce((sum: number, item: any) => 
    sum + (item.values?.[0]?.value || 0), 0) / (interestOverTime.length || 1);
  
  const trending = avgInterest > 50;
  const seasonality = avgInterest > 70 ? 'high' : avgInterest > 40 ? 'medium' : 'low';
  
  return {
    destination,
    country,
    popularityScore: Math.round(avgInterest),
    seasonality,
    trending,
    topReasons: relatedQueries.slice(0, 5).map((q: any) => q.query || ''),
    bestMonths: getBestMonths(interestOverTime)
  };
}

function parseTrendData(data: any, keyword: string, region: string): TrendData {
  const timeline = data.interest_over_time?.timeline_data || [];
  const related = data.related_queries?.rising || [];
  
  const avgValue = timeline.reduce((sum: number, item: any) => 
    sum + (item.values?.[0]?.value || 0), 0) / (timeline.length || 1);
  
  const trend = avgValue > 60 ? 'rising' : avgValue < 30 ? 'falling' : 'stable';
  
  return {
    keyword,
    trend,
    interest: Math.round(avgValue),
    relatedQueries: related.slice(0, 10).map((q: any) => q.query || ''),
    region,
    timestamp: new Date()
  };
}

function parseTopDestinations(data: any, limit: number): DestinationTrend[] {
  const queries = data.related_queries?.top || [];
  
  return queries.slice(0, limit).map((query: any, index: number) => ({
    destination: query.query || `Destination ${index + 1}`,
    country: 'Various',
    popularityScore: query.value || 0,
    seasonality: 'medium' as const,
    trending: query.value > 50,
    topReasons: ['Popular search', 'Rising interest'],
    bestMonths: ['Summer', 'Spring']
  }));
}

function getBestMonths(timeline: any[]): string[] {
  if (!timeline.length) return ['Summer', 'Winter'];
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthlyData = timeline.map((item: any) => ({
    month: item.date || '',
    value: item.values?.[0]?.value || 0
  }));
  
  const sorted = monthlyData.sort((a, b) => b.value - a.value);
  return sorted.slice(0, 3).map(d => {
    const monthMatch = d.month.match(/(\w+)/);
    return monthMatch ? monthMatch[1] : '';
  }).filter(Boolean);
}

// Mock data generators (fallback when API not configured)

function getMockDestinationTrend(destination: string, country: string): DestinationTrend {
  const mockScores: Record<string, number> = {
    'Tel Aviv': 85,
    'Jerusalem': 78,
    'Eilat': 72,
    'Paris': 95,
    'London': 92,
    'New York': 88,
    'Dubai': 90,
    'Barcelona': 87,
    'Rome': 84,
    'Amsterdam': 81
  };
  
  const score = mockScores[destination] || Math.floor(Math.random() * 30) + 50;
  
  return {
    destination,
    country,
    popularityScore: score,
    seasonality: score > 80 ? 'high' : score > 60 ? 'medium' : 'low',
    trending: score > 75,
    topReasons: [
      'Beautiful beaches',
      'Rich culture',
      'Great food',
      'Historical sites',
      'Shopping destinations'
    ],
    bestMonths: ['May', 'June', 'September', 'October']
  };
}

function getMockTrendData(keyword: string, region: string): TrendData {
  const mockInterest = Math.floor(Math.random() * 50) + 30;
  
  return {
    keyword,
    trend: mockInterest > 60 ? 'rising' : mockInterest < 40 ? 'falling' : 'stable',
    interest: mockInterest,
    relatedQueries: [
      `${keyword} hotels`,
      `${keyword} vacation packages`,
      `${keyword} things to do`,
      `${keyword} weather`,
      `${keyword} flights`
    ],
    region,
    timestamp: new Date()
  };
}

function getMockTopDestinations(limit: number): DestinationTrend[] {
  const destinations = [
    { name: 'Paris', country: 'France', score: 95 },
    { name: 'London', country: 'UK', score: 92 },
    { name: 'Dubai', country: 'UAE', score: 90 },
    { name: 'New York', country: 'USA', score: 88 },
    { name: 'Barcelona', country: 'Spain', score: 87 },
    { name: 'Rome', country: 'Italy', score: 84 },
    { name: 'Tokyo', country: 'Japan', score: 86 },
    { name: 'Amsterdam', country: 'Netherlands', score: 81 },
    { name: 'Istanbul', country: 'Turkey', score: 79 },
    { name: 'Tel Aviv', country: 'Israel', score: 85 }
  ];
  
  return destinations.slice(0, limit).map(dest => ({
    destination: dest.name,
    country: dest.country,
    popularityScore: dest.score,
    seasonality: dest.score > 85 ? 'high' : 'medium',
    trending: dest.score > 85,
    topReasons: ['Popular destination', 'Rich culture', 'Great attractions'],
    bestMonths: ['May', 'June', 'September']
  }));
}

export function clearTrendsCache(): void {
  trendsCache.clear();
}
