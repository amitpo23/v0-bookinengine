'use client';

import { Star } from 'lucide-react';
import type {
  HotelData,
  TavilyHotelEnhancement,
} from '@/types/hotel-types';
import type { SearchQuery } from '@/types/ui-types';
import { HotelRating } from './hotel-rating';

type HotelInfoProps = {
  hotel: HotelData;
  searchQuery?: SearchQuery | null;
  enhancedData?: TavilyHotelEnhancement | null;
};

const DEFAULT_STAR_RATING = 4;

const getStarRating = (category: string) => {
  const categoryMap: Record<string, number> = {
    luxury: 5,
    superior: 4,
    standard: 3,
    economy: 2,
  };
  return categoryMap[category?.toLowerCase()] || DEFAULT_STAR_RATING;
};

const formatBoard = (board: string) => {
  const boardMap: Record<string, string> = {
    RO: 'Room Only',
    BB: 'Bed & Breakfast',
    HB: 'Half Board',
    FB: 'Full Board',
    AI: 'All Inclusive',
  };
  return boardMap[board] || board;
};

export function HotelInfo({
  hotel,
  searchQuery,
  enhancedData,
}: HotelInfoProps) {
  const hotelCategory = hotel.category || 'standard';
  const fallbackStarRating = getStarRating(hotelCategory);

  // Use enhanced rating if available, otherwise fall back to category-based rating
  const _actualStarRating = enhancedData?.starRating || fallbackStarRating;

  return (
    <div className="mb-3">
      <h3 className="mb-1 font-semibold text-sm">{hotel.hotelName}</h3>

      <div className="text-gray-600 text-xs">
        {searchQuery?.destination || 'Destination'}
      </div>

      <div className="my-2">
        {enhancedData?.starRating ? (
          <HotelRating
            rating={enhancedData.starRating}
            showNumber={true}
            size="sm"
          />
        ) : (
          <div className="flex text-yellow-400">
            {[...Array(fallbackStarRating)].map((_, i) => (
              <div key={`star-${hotel.hotelName}-${i}`}>
                <Star className="h-3 w-3 fill-current" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-0.5 text-gray-600 text-xs">
        <div>
          Guest name: <span className="text-gray-800">Not specified</span>
        </div>
        <div>
          Room type:{' '}
          <span className="text-gray-800">
            {hotel.roomType || 'Standard Room'}
          </span>
        </div>
        <div>
          Guests:{' '}
          <span className="text-gray-800">
            {searchQuery?.adults || 2} adults
            {searchQuery?.children?.length
              ? `, ${searchQuery.children.length} children`
              : ''}
          </span>
        </div>
        <div>
          Board:{' '}
          <span className="text-gray-800">
            {formatBoard(hotel.board || 'RO')}
          </span>
        </div>
      </div>
    </div>
  );
}
