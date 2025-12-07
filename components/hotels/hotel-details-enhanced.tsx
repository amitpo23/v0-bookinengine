'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Star } from 'lucide-react';
import type { HotelData, TavilyHotelEnhancement } from '@/types/hotel-types';
import { HotelImageGallery } from './hotel-image-gallery';
import { HotelAmenities } from './hotel-amenities';
import { HotelInfo } from './hotel-info';
import { getEnhancedHotelData } from '@/lib/services/tavily-hotel-service';

type HotelDetailsEnhancedProps = {
  hotel: HotelData;
  city?: string;
};

export function HotelDetailsEnhanced({ hotel, city = 'Tel Aviv' }: HotelDetailsEnhancedProps) {
  const [enhancedData, setEnhancedData] = useState<TavilyHotelEnhancement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEnhanced, setShowEnhanced] = useState(false);

  const fetchEnhancedData = async () => {
    if (enhancedData) {
      // Already have data, just show it
      setShowEnhanced(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getEnhancedHotelData(hotel.hotelName, city);
      if (data) {
        setEnhancedData(data);
        setShowEnhanced(true);
      } else {
        setError('לא ניתן לטעון מידע מורחב כרגע');
      }
    } catch (err) {
      setError('שגיאה בטעינת מידע מורחב');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Hotel Info */}
      <Card className="p-6">
        <HotelInfo hotel={hotel} enhancedData={enhancedData} />
        
        {hotel.images && hotel.images.length > 0 && (
          <div className="mt-4">
            <HotelImageGallery hotel={hotel} enhancedData={enhancedData} />
          </div>
        )}
      </Card>

      {/* Enhanced Data Toggle */}
      <div className="flex items-center justify-center">
        <Button
          onClick={fetchEnhancedData}
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

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {/* Enhanced Data Display */}
      {showEnhanced && enhancedData && (
        <div className="space-y-6">
          {/* Description */}
          {enhancedData.description && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                תיאור המלון
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancedData.description}
              </p>
            </Card>
          )}

          {/* Star Rating */}
          {enhancedData.starRating && (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">דירוג כוכבים</h3>
                  <p className="text-sm text-muted-foreground">מבוסס על ביקורות באינטרנט</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold">{enhancedData.starRating}</span>
                  <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </Card>
          )}

          {/* Amenities from Tavily */}
          {enhancedData.amenities && enhancedData.amenities.length > 0 && (
            <HotelAmenities amenities={enhancedData.amenities} />
          )}

          {/* Location Info */}
          {enhancedData.locationInfo && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">מיקום ואטרקציות</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancedData.locationInfo}
              </p>
            </Card>
          )}

          {/* Reviews Summary */}
          {enhancedData.reviewsSummary && enhancedData.reviewsSummary.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ביקורות מהאינטרנט</h3>
              <div className="space-y-4">
                {enhancedData.reviewsSummary.map((review, index) => (
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
                  {enhancedData.sources.reviews.length +
                    enhancedData.sources.amenities.length +
                    enhancedData.sources.location.length}{' '}
                  מקורות אמינים באינטרנט באמצעות Tavily
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
