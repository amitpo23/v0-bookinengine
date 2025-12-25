# Hotel Data Enrichment Setup

The hotel data enrichment service automatically fetches additional information from external sources when hotel data is incomplete.

## How It Works

The enrichment service is called automatically during hotel search when:
- Hotel description is missing or too short (< 50 characters)
- Hotel images are missing
- Hotel facilities list is empty

## Enrichment Strategies

### 1. Google Places API (Primary - Recommended)
**Best for:** Images, descriptions, ratings, reviews, contact info

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Places API** and **Maps JavaScript API**
4. Create credentials (API Key)
5. Add to `.env`:
   ```
   GOOGLE_PLACES_API_KEY=your_key_here
   ```

**Features:**
- ✅ High-quality hotel photos (up to 10 images)
- ✅ Editorial summaries and descriptions
- ✅ Google ratings and review counts
- ✅ Contact information (phone, website, address)
- ✅ GPS coordinates

**Pricing:** Free tier includes 25,000 requests/month

---

### 2. Bing Search API (Secondary - Optional)
**Best for:** Text descriptions when Google Places is unavailable

**Setup:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create **Bing Search v7** resource
3. Get API key from resource
4. Add to `.env`:
   ```
   BING_SEARCH_API_KEY=your_key_here
   ```

**Features:**
- ✅ Hotel descriptions from web results
- ✅ Fast text-based search
- ❌ No images
- ❌ No structured data

**Pricing:** Free tier includes 1,000 requests/month

---

### 3. Wikipedia/DBpedia (Fallback - Free)
**Best for:** Basic descriptions for famous hotels

**Setup:** No API key needed (built-in)

**Features:**
- ✅ Free, no rate limits
- ✅ Descriptions for well-known hotels
- ❌ Limited coverage
- ❌ No images

---

### 4. AI-Generated Descriptions (Final Fallback)
**Best for:** Creating descriptions from facility lists

**Setup:** No API key needed (built-in)

**Features:**
- ✅ Always works
- ✅ Uses existing facility data
- ❌ Generic descriptions
- ❌ No images

---

## Configuration

### Minimal Setup (No External APIs)
Just use Medici's extended data:
```env
# medici-client.ts already configured with:
ShowExtendedData: true
```

This will provide:
- ✅ Hotel images from Medici database
- ✅ Descriptions from Medici
- ✅ Facilities list from Medici
- ✅ GPS coordinates, ratings, etc.

### Recommended Setup (Google Places)
Add Google Places API for best results:
```env
GOOGLE_PLACES_API_KEY=AIzaSy...your_key
```

This adds:
- 📸 More high-quality photos
- ⭐ Google ratings and reviews
- 📝 Editorial summaries
- 📞 Contact information

### Full Setup (All Sources)
For maximum data coverage:
```env
GOOGLE_PLACES_API_KEY=AIzaSy...your_key
BING_SEARCH_API_KEY=your_bing_key
```

---

## Usage Example

The enrichment happens automatically:

```typescript
// In app/api/hotels/search/route.ts
const enrichment = await enrichHotelData(
  hotelName,
  city,
  {
    description: existingDescription,
    images: existingImages,
    facilities: existingFacilities
  }
)
```

---

## Performance

- **Parallel Processing:** Enriches multiple hotels concurrently
- **Rate Limiting:** 200ms delay between requests to avoid API limits
- **Smart Caching:** Only fetches missing data
- **Fallback Chain:** Uses multiple sources for reliability

---

## Cost Estimate

### Google Places API
- **Free Tier:** 25,000 requests/month
- **Cost:** $0 for most small/medium sites
- **Per Request:** $0.017 (after free tier)

**Example:** 100 searches/day × 30 days = 3,000 requests/month = FREE ✅

### Bing Search API
- **Free Tier:** 1,000 requests/month
- **Cost:** $7/1,000 requests (after free tier)

---

## Testing

Test enrichment in development:

```bash
# Search for a hotel with minimal data
curl -X POST http://localhost:3000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "dateFrom": "2025-12-25",
    "dateTo": "2025-12-26",
    "hotelName": "Dizengoff Inn",
    "adults": 2
  }'
```

Check the response for:
- ✅ `images` array populated
- ✅ `description` with detailed text
- ✅ `facilities` array with amenities

---

## Troubleshooting

### No enrichment happening
- Check `.env` file exists and has API keys
- Verify API keys are valid
- Check console for error messages

### Slow searches
- Enrichment adds 200-500ms per hotel
- Disable by removing API keys to use only Medici data

### API quota exceeded
- Google: Upgrade to paid tier or reduce searches
- Bing: Use only Google Places
- Fallback: System will use AI-generated descriptions

---

## Environment Variables Summary

```env
# Required for search
MEDICI_TOKEN=your_token

# Optional for enrichment (in order of priority)
GOOGLE_PLACES_API_KEY=your_key      # Best option
BING_SEARCH_API_KEY=your_key        # Backup option

# Already included in Medici response with ShowExtendedData: true
# - Hotel images
# - Hotel descriptions  
# - Facilities list
# - GPS coordinates
# - Star ratings
```
