# Hotel Display Components Guide

This guide documents the enhanced hotel display components integrated from the sunday-main project.

## Overview

The project now includes a comprehensive set of components for displaying hotel information, including:
- Advanced hotel cards with pricing and availability
- Image galleries with modal viewers
- Rating systems and amenities display
- Animated loading states
- Enhanced error handling

## Components

### 1. HotelCard

A comprehensive hotel card component that displays hotel information, pricing, and booking options.

**Location**: `components/hotels/hotel-card.tsx`

**Features**:
- Image display with fallback
- Dynamic pricing with nightly and total costs
- Rating and review count display
- Availability indicators
- Favorite/wishlist button
- Special offers display

**Usage**:
```tsx
import { HotelCard } from '@/components/hotels';

<HotelCard
  hotel={hotelData}
  onSelect={(hotel) => handleHotelSelection(hotel)}
  nights={3}
  className="custom-class"
/>
```

**Props**:
- `hotel`: HotelData - The hotel data object
- `onSelect`: (hotel: HotelData) => void - Callback when hotel is selected
- `nights`: number (optional, default: 2) - Number of nights for pricing
- `className`: string (optional) - Additional CSS classes

### 2. HotelResults

Container component for displaying search results with loading states.

**Location**: `components/hotels/hotel-results.tsx`

**Features**:
- Animated circular progress bar during search
- Real-time progress stages (connecting, authenticating, searching, etc.)
- Empty state when no results
- Responsive grid layout

**Usage**:
```tsx
import { HotelResults } from '@/components/hotels';

<HotelResults
  hotels={searchResults}
  searchQuery={query}
  onSelectHotel={handleSelection}
  isLoading={isSearching}
/>
```

**Props**:
- `hotels`: HotelData[] - Array of hotel results
- `searchQuery`: SearchQuery (optional) - Search parameters for calculating nights
- `onSelectHotel`: (hotel: HotelData) => void - Selection callback
- `isLoading`: boolean (optional, default: false) - Loading state

### 3. HotelInfo

Displays detailed hotel information including rating, location, and guest details.

**Location**: `components/hotels/hotel-info.tsx`

**Features**:
- Star rating display
- Location information
- Guest count display
- Board type (meal plan) formatting
- Enhanced data support from external sources

**Usage**:
```tsx
import { HotelInfo } from '@/components/hotels';

<HotelInfo
  hotel={hotelData}
  searchQuery={query}
  enhancedData={tavilyData}
/>
```

**Props**:
- `hotel`: HotelData - Hotel information
- `searchQuery`: SearchQuery (optional) - Search parameters
- `enhancedData`: TavilyHotelEnhancement (optional) - Additional data from external sources

### 4. HotelRating

Star rating component with customizable size and display options.

**Location**: `components/hotels/hotel-rating.tsx`

**Features**:
- Star visualization
- Optional numeric display
- Size variants (sm, md, lg)
- Accessible implementation

**Usage**:
```tsx
import { HotelRating } from '@/components/hotels';

<HotelRating
  rating={4}
  showNumber={true}
  size="md"
/>
```

**Props**:
- `rating`: number - Rating value (0-5)
- `showNumber`: boolean (optional, default: false) - Show numeric rating
- `size`: 'sm' | 'md' | 'lg' (optional, default: 'md') - Size variant
- `className`: string (optional) - Additional CSS classes

### 5. HotelAmenities

Displays hotel amenities with icons in a grid layout.

**Location**: `components/hotels/hotel-amenities.tsx`

**Features**:
- Icon mapping for common amenities
- Truncation for long lists
- Responsive grid layout
- Fallback icons for unknown amenities

**Usage**:
```tsx
import { HotelAmenities } from '@/components/hotels';

<HotelAmenities
  amenities={['WiFi', 'Pool', 'Parking', 'Gym']}
  className="custom-class"
/>
```

**Props**:
- `amenities`: string[] - List of amenity names
- `className`: string (optional) - Additional CSS classes

### 6. HotelImageGallery

Image gallery with thumbnail grid and modal viewer.

**Location**: `components/hotels/hotel-image-gallery.tsx`

**Features**:
- Responsive grid layout
- Main image + additional thumbnails
- Click to open modal viewer
- Support for external images
- Fallback for missing images

**Usage**:
```tsx
import { HotelImageGallery } from '@/components/hotels';

<HotelImageGallery
  hotel={hotelData}
  enhancedData={tavilyData}
/>
```

**Props**:
- `hotel`: HotelData - Hotel data with images
- `enhancedData`: TavilyHotelEnhancement (optional) - Additional images

### 7. HotelImageGalleryModal

Full-screen modal for viewing hotel images.

**Location**: `components/hotels/hotel-image-gallery-modal.tsx`

**Features**:
- Full-screen image viewing
- Navigation arrows
- Thumbnail strip
- Download functionality
- External link support
- Keyboard navigation

**Usage**:
```tsx
import { HotelImageGalleryModal } from '@/components/hotels';

<HotelImageGalleryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  images={imageArray}
  initialIndex={0}
  hotelName="Hotel Name"
/>
```

**Props**:
- `isOpen`: boolean - Modal visibility state
- `onClose`: () => void - Close callback
- `images`: CombinedImage[] - Array of images
- `initialIndex`: number - Starting image index
- `hotelName`: string - Hotel name for alt text

## MagicUI Components

### AnimatedCircularProgressBar

Animated progress indicator for loading states.

**Location**: `components/magicui/animated-circular-progress-bar.tsx`

**Features**:
- Smooth animations
- Customizable colors
- Percentage display
- Accessibility support

**Usage**:
```tsx
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';

<AnimatedCircularProgressBar
  value={progress}
  gaugePrimaryColor="rgb(59 130 246)"
  gaugeSecondaryColor="rgba(59, 130, 246, 0.1)"
  className="size-20"
/>
```

**Props**:
- `value`: number - Progress value (0-100)
- `max`: number (optional, default: 100) - Maximum value
- `min`: number (optional, default: 0) - Minimum value
- `gaugePrimaryColor`: string - Progress bar color
- `gaugeSecondaryColor`: string - Background color
- `className`: string (optional) - Additional CSS classes

## Types

### HotelData

Main hotel data structure:

```typescript
type HotelData = {
  hotelName: string;
  hotelId: string;
  price: number;
  netPrice?: number;
  images?: Array<{
    id: number;
    width: number;
    height: number;
    title: string;
    url: string;
  }>;
  roomType?: string;
  category: string;
  bedding?: string;
  board?: string;
  cancellation: {
    type: string;
    frames?: CancellationFrame[];
  };
  confirmation?: string;
  paymentType?: string;
  commissionable?: boolean;
  specialOffers?: SpecialOffer[];
  providers?: { id?: number; name: string }[];
  items?: HotelUIItem[];
  roomOptions?: Array<RoomOption>;
};
```

### SearchQuery

Search parameters:

```typescript
type SearchQuery = {
  destination: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  children?: number[];
  rooms?: number;
  city?: string;
  hotelName?: string;
};
```

## Utilities

### Cancellation Policy Utilities

**Location**: `lib/utils/cancellation-policy.ts`

Functions for handling hotel cancellation policies:

- `getCurrentCancellationStatus(cancellation)` - Gets current cancellation status
- `getCancellationMessage(cancellation)` - User-friendly cancellation message
- `getCancellationStyle(cancellation)` - CSS classes for status display

**Usage**:
```typescript
import {
  getCurrentCancellationStatus,
  getCancellationMessage,
  getCancellationStyle,
} from '@/lib/utils/cancellation-policy';

const status = getCurrentCancellationStatus(hotel.cancellation);
const message = getCancellationMessage(hotel.cancellation);
const styleClass = getCancellationStyle(hotel.cancellation);
```

## API Error Handling

### Enhanced Error Classes

**Location**: `lib/api/errors.ts`

Custom error classes for structured API error handling:

- `ApiError` - Base error class
- `ValidationError` - 400 Bad Request
- `AuthenticationError` - 401 Unauthorized
- `AuthorizationError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `ConflictError` - 409 Conflict
- `RateLimitError` - 429 Too Many Requests
- `ExternalServiceError` - 502 Bad Gateway
- `ServiceUnavailableError` - 503 Service Unavailable
- `HotelNotAvailableError` - Hotel-specific error
- `BookingError` - Booking-specific error
- `PaymentError` - Payment-specific error

**Usage in API Routes**:
```typescript
import {
  ValidationError,
  handleApiError,
  RateLimitError,
} from '@/lib/api/errors';

export async function POST(request: NextRequest) {
  try {
    // Validation
    if (!dateFrom || !dateTo) {
      throw new ValidationError('Check-in and check-out dates are required');
    }

    // API logic...

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Best Practices

### Image Optimization

All components use Next.js Image component for automatic optimization:
- Lazy loading
- Responsive sizing
- Format optimization
- CDN integration

### Accessibility

Components include proper accessibility features:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management

### Performance

- Component-level code splitting
- Memoization where appropriate
- Efficient re-rendering
- Progressive image loading

### Error Handling

- Graceful degradation
- User-friendly error messages
- Fallback UI states
- Error boundary integration

## Integration Example

Complete example of integrating hotel search and display:

```tsx
'use client';

import { useState } from 'react';
import { HotelResults } from '@/components/hotels';
import type { HotelData, SearchQuery } from '@/types/hotel-types';

export default function HotelSearchPage() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);

  const handleSearch = async (query: SearchQuery) => {
    setLoading(true);
    setSearchQuery(query);

    try {
      const response = await fetch('/api/booking/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
          adults: query.adults,
          children: query.children || [],
          city: query.city,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHotels(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelection = (hotel: HotelData) => {
    // Navigate to hotel details or booking page
    console.log('Selected hotel:', hotel);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Hotel Search</h1>
      
      {/* Search form component would go here */}
      
      <HotelResults
        hotels={hotels}
        searchQuery={searchQuery}
        onSelectHotel={handleHotelSelection}
        isLoading={loading}
      />
    </div>
  );
}
```

## Notes

- All components are client-side ('use client') for interactive features
- Images are loaded from CDN with configurable quality
- TypeScript types are fully defined for type safety
- Components are designed to be composable and reusable
- Error boundaries should be implemented at the page level
