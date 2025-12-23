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
  return <IconComponent className="h-5 w-5 text-gray-600" />;
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
    <div className={className}>
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Amenities & Services</h4>
      <div className="grid grid-cols-2 gap-3">
        {displayAmenities.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-2 text-gray-700 text-sm"
          >
            {getAmenityIcon(amenity)}
            <span>{amenity}</span>
          </div>
        ))}
        {hasMore && (
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <span className="text-lg">+</span>
            <span>+{amenities.length - MAX_DISPLAYED_AMENITIES} more amenities</span>
          </div>
        )}
      </div>
    </div>
  );
}
