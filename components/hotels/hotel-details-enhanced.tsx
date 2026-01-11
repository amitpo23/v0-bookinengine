'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Star, MapPin, Building } from 'lucide-react';
import type { HotelData, TavilyHotelEnhancement } from '@/types/hotel-types';

type HotelDetailsEnhancedProps = {
  hotel: HotelData;
  city?: string;
};

export function HotelDetailsEnhanced({ hotel, city = 'Tel Aviv' }: HotelDetailsEnhancedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);
  
  // Mock enhanced data for demo purposes
  const mockEnhancedData: TavilyHotelEnhancement = {
    description: `${hotel.hotelName} הוא מלון מעולה ממוקם ב${city}. המלון מציע שירות מעולה וחדרים מרווחים.`,
    starRating: hotel.stars || 4,
    amenities: hotel.facilities || ['Wifi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    locationInfo: `המלון ממוקם במיקום מרכזי ב${city}, קרוב לאטרקציות תיירותיות מרכזיות.`,
    reviewsSummary: [
      {
        source: 'TripAdvisor',
        excerpt: 'מלון נהדר עם שירות מעולה ומיקום מושלם',
        score: 0.92,
        url: '#'
      },
      {
        source: 'Booking.com',
        excerpt: 'חוויה מצוינת, הצוות אדיב והחדרים נקיים',
        score: 0.88,
        url: '#'
      }
    ],
    sources: {
      reviews: ['tripadvisor.com', 'booking.com'],
      amenities: ['hotels.com'],
      location: ['google.com']
    }
  };

  const handleFetchEnhanced = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowEnhanced(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Basic Hotel Info */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          {hotel.imageUrl && (
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={hotel.imageUrl} 
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{hotel.hotelName}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{hotel.address || city}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.stars || 4 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Badge variant="secondary">{hotel.stars || 4} כוכבים</Badge>
            </div>
            {hotel.description && (
              <p className="text-sm text-muted-foreground mt-3">{hotel.description}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Image Gallery */}
      {hotel.images && hotel.images.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">גלריית תמונות</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hotel.images.slice(0, 8).map((image, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${hotel.hotelName} - ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Facilities */}
      {hotel.facilities && hotel.facilities.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">מתקנים ושירותים</h3>
          <div className="flex flex-wrap gap-2">
            {hotel.facilities.map((facility, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {facility}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Enhanced Data Toggle */}
      <div className="flex items-center justify-center">
        <Button
          onClick={handleFetchEnhanced}
          disabled={isLoading}
          variant={showEnhanced ? "outline" : "default"}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              טוען מידע מורחב...
            </>
          ) : showEnhanced ? (
            <>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              מידע מורחב מופעל
            </>
          ) : (
            <>
              <Star className="h-4 w-4" />
              הצג מידע מורחב מהאינטרנט
            </>
          )}
        </Button>
      </div>

      {/* Enhanced Data Display */}
      {showEnhanced && (
        <div className="space-y-6">
          {/* Star Rating */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">דירוג כוכבים</h3>
                <p className="text-sm text-muted-foreground">מבוסס על ביקורות באינטרנט</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold">{mockEnhancedData.starRating}</span>
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </Card>

          {/* Description */}
          {mockEnhancedData.description && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                תיאור המלון
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mockEnhancedData.description}
              </p>
            </Card>
          )}

          {/* Location Info */}
          {mockEnhancedData.locationInfo && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                מיקום ואטרקציות
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mockEnhancedData.locationInfo}
              </p>
            </Card>
          )}

          {/* Reviews Summary */}
          {mockEnhancedData.reviewsSummary && mockEnhancedData.reviewsSummary.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ביקורות מהאינטרנט</h3>
              <div className="space-y-4">
                {mockEnhancedData.reviewsSummary.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{review.source}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {(review.score * 100).toFixed(0)}% רלוונטי
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.excerpt}
                    </p>
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      קרא עוד
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Sources */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-500/20 p-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  מידע מורחב מהאינטרנט
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  המידע המורחב נאסף מ-{' '}
                  {mockEnhancedData.sources.reviews.length +
                    mockEnhancedData.sources.amenities.length +
                    mockEnhancedData.sources.location.length}{' '}
                  מקורות אמינים באינטרנט
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default HotelDetailsEnhanced;
