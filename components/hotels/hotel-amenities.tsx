'use client';

import {
  Car,
  Coffee,
  Dumbbell,
  MapPin,
  Shield,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from 'lucide-react';

type HotelAmenitiesProps = {
  amenities: string[];
  className?: string;
};

// Constants
const MAX_DISPLAYED_AMENITIES = 8;

// Amenity keyword mappings to icons
const AMENITY_ICON_MAP = [
  { keywords: ['wifi', 'internet'], icon: Wifi },
  { keywords: ['parking', 'garage'], icon: Car },
  { keywords: ['breakfast', 'coffee'], icon: Coffee },
  { keywords: ['gym', 'fitness'], icon: Dumbbell },
  { keywords: ['restaurant', 'dining'], icon: UtensilsCrossed },
  { keywords: ['concierge', 'service'], icon: Shield },
  { keywords: ['air conditioning', 'ac'], icon: Wind },
  { keywords: ['pool', 'spa'], icon: Waves },
];

// Map amenity names to icons using lookup table
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();

  const match = AMENITY_ICON_MAP.find(({ keywords }) =>
    keywords.some((keyword) => amenityLower.includes(keyword))
  );

  const IconComponent = match?.icon || MapPin;
  return <IconComponent className="h-3.5 w-3.5" />;
};

export function HotelAmenities({
  amenities,
  className = '',
}: HotelAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  // Show max amenities to avoid overcrowding
  const displayAmenities = amenities.slice(0, MAX_DISPLAYED_AMENITIES);
  const hasMore = amenities.length > MAX_DISPLAYED_AMENITIES;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-3 ${className}`}
    >
      <h4 className="mb-2 font-semibold text-gray-900 text-sm">
        Amenities & Services
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {displayAmenities.map((amenity) => (
          <div
            className="flex items-center gap-2 text-gray-700 text-xs"
            key={amenity}
          >
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-gray-600">
              {getAmenityIcon(amenity)}
            </div>
            <span className="truncate">{amenity}</span>
          </div>
        ))}

        {hasMore && (
          <div className="col-span-2 flex items-center gap-2 text-gray-500 text-xs">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-50 text-gray-400">
              <span className="text-xs">+</span>
            </div>
            <span>
              +{amenities.length - MAX_DISPLAYED_AMENITIES} more amenities
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
