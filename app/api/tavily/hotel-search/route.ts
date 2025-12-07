import { type NextRequest, NextResponse } from 'next/server';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_BASE_URL = 'https://api.tavily.com';

// Constants
const MAX_SOURCES_PER_CATEGORY = 3;
const MAX_REVIEW_SOURCES = 5;
const REVIEW_EXCERPT_LENGTH = 200;
const LOCATION_DESCRIPTION_LENGTH = 300;
const MIN_RATING = 1;
const MAX_RATING = 5;

// Star rating regex patterns (moved to top level for performance)
const STAR_RATING_PATTERNS = [
  /(\d\.?\d?)\s*(?:star|stars)/i,
  /(\d\.?\d?)\/5/i,
  /rated\s*(\d\.?\d?)/i,
  /(\d\.?\d?)\s*out\s*of\s*5/i,
];

type TavilySearchRequest = {
  query: string;
  search_depth?: 'basic' | 'advanced';
  topic?: 'general' | 'news';
  max_results?: number;
  include_answer?: boolean;
  include_raw_content?: boolean;
  include_images?: boolean;
  include_image_descriptions?: boolean;
  include_favicon?: boolean;
};

type TavilySearchResponse = {
  query: string;
  answer?: string;
  images?: Array<{
    url: string;
    description?: string;
  }>;
  results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    raw_content?: string;
    favicon?: string;
  }>;
  response_time: number;
};

export async function POST(request: NextRequest) {
  try {
    if (!TAVILY_API_KEY) {
      return NextResponse.json(
        { error: 'Tavily API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { hotelName, city } = body;

    if (!(hotelName && city)) {
      return NextResponse.json(
        { error: 'Hotel name and city are required' },
        { status: 400 }
      );
    }

    // Create comprehensive search query for hotel information
    const queries = [
      // Main hotel search for reviews and rating
      `${hotelName} ${city} hotel reviews ratings 2024 2025`,
      // Amenities and facilities
      `${hotelName} ${city} hotel amenities facilities services`,
      // Location and nearby attractions
      `${hotelName} ${city} hotel location attractions nearby`,
    ];

    const searchResults = await Promise.all(
      queries.map(async (query) => {
        const searchRequest: TavilySearchRequest = {
          query,
          search_depth: 'advanced',
          topic: 'general',
          max_results: 5,
          include_answer: true,
          include_images: true,
          include_image_descriptions: true,
          include_raw_content: false,
        };

        const response = await fetch(`${TAVILY_BASE_URL}/search`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TAVILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchRequest),
        });

        if (!response.ok) {
          throw new Error(`Tavily API error: ${response.status}`);
        }

        return (await response.json()) as TavilySearchResponse;
      })
    );

    // Parse and combine results
    const enhancedHotelData = parseHotelData(searchResults, hotelName, city);

    return NextResponse.json({
      success: true,
      data: enhancedHotelData,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch hotel data from Tavily' },
      { status: 500 }
    );
  }
}

function parseHotelData(
  searchResults: TavilySearchResponse[],
  hotelName: string,
  city: string
) {
  const [reviewsData, amenitiesData, locationData] = searchResults;

  // Extract star rating from content
  const starRating = extractStarRating(reviewsData.results);

  // Extract description from answer
  const description = reviewsData.answer || '';

  // Extract reviews summary
  const reviewsSummary = extractReviewsSummary(reviewsData.results);

  // Extract amenities
  const amenities = extractAmenities(amenitiesData.results);

  // Extract location info
  const locationInfo = extractLocationInfo(locationData.results);

  // Collect all images
  const additionalImages = [
    ...(reviewsData.images || []),
    ...(amenitiesData.images || []),
    ...(locationData.images || []),
  ];

  return {
    hotelName,
    city,
    starRating,
    description,
    reviewsSummary,
    amenities,
    locationInfo,
    additionalImages,
    sources: {
      reviews: reviewsData.results.slice(0, MAX_SOURCES_PER_CATEGORY),
      amenities: amenitiesData.results.slice(0, MAX_SOURCES_PER_CATEGORY),
      location: locationData.results.slice(0, MAX_SOURCES_PER_CATEGORY),
    },
  };
}

function extractStarRating(
  results: TavilySearchResponse['results']
): number | null {
  for (const result of results) {
    const content = result.content.toLowerCase();

    for (const pattern of STAR_RATING_PATTERNS) {
      const match = content.match(pattern);
      if (match) {
        const rating = Number.parseFloat(match[1]);
        if (rating >= MIN_RATING && rating <= MAX_RATING) {
          return rating;
        }
      }
    }
  }
  return null;
}

function extractReviewsSummary(results: TavilySearchResponse['results']) {
  const reviews: Array<{
    source: string;
    url: string;
    excerpt: string;
    score: number;
  }> = [];

  for (const result of results) {
    if (result.content.toLowerCase().includes('review')) {
      reviews.push({
        source: result.title,
        url: result.url,
        excerpt: `${result.content.substring(0, REVIEW_EXCERPT_LENGTH)}...`,
        score: result.score,
      });
    }
  }

  return reviews.slice(0, MAX_REVIEW_SOURCES);
}

function extractAmenities(results: TavilySearchResponse['results']): string[] {
  const amenityKeywords = [
    'wifi',
    'pool',
    'gym',
    'spa',
    'restaurant',
    'bar',
    'parking',
    'breakfast',
    'air conditioning',
    'balcony',
    'concierge',
    'room service',
    'fitness center',
    'business center',
    'laundry',
    'airport shuttle',
  ];

  const foundAmenities = new Set<string>();

  for (const result of results) {
    const content = result.content.toLowerCase();
    for (const amenity of amenityKeywords) {
      if (content.includes(amenity)) {
        foundAmenities.add(amenity.charAt(0).toUpperCase() + amenity.slice(1));
      }
    }
  }

  return Array.from(foundAmenities);
}

function extractLocationInfo(results: TavilySearchResponse['results']) {
  let locationInfo = '';

  for (const result of results) {
    if (
      result.content.includes('location') ||
      result.content.includes('nearby')
    ) {
      locationInfo = `${result.content.substring(0, LOCATION_DESCRIPTION_LENGTH)}...`;
      break;
    }
  }

  return locationInfo;
}
