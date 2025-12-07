# Tavily Integration - Hotel Data Enhancement

## Overview
This integration uses Tavily's advanced search API to enrich hotel information with real-time data from the web, including reviews, amenities, ratings, and location information.

## Features

### 🔍 What Tavily Provides
- **Star Ratings**: Extracted from multiple review sources
- **Hotel Descriptions**: Comprehensive information about the property
- **Reviews Summary**: Aggregated reviews from various platforms
- **Amenities**: Detected amenities and facilities
- **Location Info**: Nearby attractions and location details
- **Additional Images**: High-quality images from the web

### 🎯 Use Cases
1. **Enhanced Room Display**: Show richer information to users
2. **Review Aggregation**: Display reviews from multiple sources
3. **Image Enrichment**: Add more photos beyond hotel's official gallery
4. **Star Rating**: Show authentic ratings from review sites

## Setup

### 1. Get Tavily API Key
1. Visit [Tavily](https://tavily.com)
2. Sign up for an account
3. Get your API key from the dashboard

### 2. Environment Configuration
Add to your `.env.local`:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

### 3. API Endpoint
The integration adds a new API endpoint:
- **Path**: `/api/tavily/hotel-search`
- **Method**: POST
- **Body**:
  ```json
  {
    "hotelName": "Grand Hotel",
    "city": "Tel Aviv",
    "checkIn": "2024-01-01",  // Optional
    "checkOut": "2024-01-05"  // Optional
  }
  ```

## Usage Examples

### Basic Usage in Components

```typescript
import { getEnhancedHotelData } from '@/lib/services/tavily-hotel-service';

// Fetch enhanced data
const enhancedData = await getEnhancedHotelData('Grand Hotel', 'Tel Aviv');

if (enhancedData) {
  console.log('Star Rating:', enhancedData.starRating);
  console.log('Description:', enhancedData.description);
  console.log('Amenities:', enhancedData.amenities);
}
```

### Using HotelDetailsEnhanced Component

```typescript
import { HotelDetailsEnhanced } from '@/components/hotels';

<HotelDetailsEnhanced 
  hotel={hotelData} 
  city="Tel Aviv" 
/>
```

## Caching

The integration includes intelligent caching:
- **Duration**: 30 minutes per hotel
- **Key**: `hotelName-city` combination
- **Benefits**: Reduces API calls and improves performance

### Cache Management

```typescript
import { clearCache, getCacheSize } from '@/lib/services/tavily-hotel-service';

// Clear cache
clearCache();

// Check cache size
const size = getCacheSize();
console.log(`Cache contains ${size} entries`);
```

## Response Structure

### TavilyHotelEnhancement Type

```typescript
type TavilyHotelEnhancement = {
  hotelName: string;
  city: string;
  starRating: number | null;
  description: string;
  reviewsSummary: Array<{
    source: string;
    url: string;
    excerpt: string;
    score: number;
  }>;
  amenities: string[];
  locationInfo: string;
  additionalImages: Array<{
    url: string;
    description?: string;
  }>;
  sources: {
    reviews: Array<{ title: string; url: string; content: string; score: number }>;
    amenities: Array<{ title: string; url: string; content: string; score: number }>;
    location: Array<{ title: string; url: string; content: string; score: number }>;
  };
};
```

## Performance Considerations

### Query Optimization
The integration performs 3 parallel searches:
1. Reviews and ratings
2. Amenities and facilities
3. Location and attractions

### Rate Limiting
- Tavily has rate limits based on your plan
- Cache helps reduce API calls
- Failed requests return `null` gracefully

## Error Handling

The integration handles errors gracefully:
- Missing API key: Returns 500 error
- Invalid request: Returns 400 error
- Tavily API errors: Returns null, allows app to continue
- Network errors: Caught and logged

## Admin Panel Integration

The Rooms Showcase in admin panel includes two tabs:
1. **Basic Info**: Standard hotel information
2. **Enhanced Info (Tavily)**: Rich data from Tavily
   - Click "הצג מידע מורחב מהאינטרנט" to fetch data
   - Shows loading state while fetching
   - Displays comprehensive information once loaded

## Best Practices

### 1. Use Caching
Always rely on the built-in cache to minimize API calls:
```typescript
// Service automatically handles caching
const data = await getEnhancedHotelData(name, city);
```

### 2. Handle Null Responses
Always check for null responses:
```typescript
const enhancedData = await getEnhancedHotelData(name, city);
if (enhancedData) {
  // Use the data
} else {
  // Fall back to basic information
}
```

### 3. Progressive Enhancement
Use Tavily data to enhance, not replace, existing information:
- Show basic info first
- Load enhanced data on demand
- Display both original and enhanced images

### 4. User Feedback
Always show loading states when fetching:
```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  const data = await getEnhancedHotelData(name, city);
  setIsLoading(false);
};
```

## Cost Optimization

### Tips to Reduce Costs
1. **Leverage Cache**: 30-minute cache reduces duplicate requests
2. **Lazy Loading**: Load enhanced data only when needed
3. **Batch Processing**: If enriching multiple hotels, consider timing
4. **Monitor Usage**: Track API calls in Tavily dashboard

## Troubleshooting

### Common Issues

#### 1. "Tavily API key not configured"
**Solution**: Add `TAVILY_API_KEY` to `.env.local`

#### 2. No enhanced data returned
**Possible causes**:
- Hotel name doesn't match online sources
- City name is incorrect
- Tavily can't find relevant information
**Solution**: Check hotel name spelling, try variations

#### 3. Rate limit exceeded
**Solution**: 
- Upgrade Tavily plan
- Increase cache duration
- Reduce number of concurrent requests

#### 4. Slow response times
**Solution**:
- Check network connection
- Tavily performs 3 parallel searches (takes 2-5 seconds)
- Use loading states to improve UX

## Future Enhancements

Potential improvements:
- [ ] Add support for date-specific searches
- [ ] Include weather data for location
- [ ] Add language preferences for searches
- [ ] Support for hotel chains and brands
- [ ] Integration with other review platforms

## Related Files

- `/app/api/tavily/hotel-search/route.ts` - API endpoint
- `/lib/services/tavily-hotel-service.ts` - Client service
- `/components/hotels/hotel-details-enhanced.tsx` - Enhanced display component
- `/types/hotel-types.ts` - TypeScript definitions
- `/components/admin/rooms-showcase.tsx` - Admin integration

## Support

For Tavily-specific issues:
- [Tavily Documentation](https://docs.tavily.com)
- [Tavily Support](https://tavily.com/support)

For integration issues:
- Check this documentation
- Review error logs
- Test with different hotel names
