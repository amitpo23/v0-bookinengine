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

export function HotelAmenities({
  amenities,
  className = '',
}: HotelAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const displayAmenities = amenities.slice(0, MAX_DISPLAYED_AMENITIES);
  const hasMore = amenities.length > MAX_DISPLAYED_AMENITIES;

  return (
    <div className={className}>
      <h4>Amenities & Services</h4>
      {displayAmenities.map((amenity) => (
        <div key={amenity}>{amenity}</div>
      ))}
      {hasMore && <div>+{amenities.length - MAX_DISPLAYED_AMENITIES} more</div>}
    </div>
  );
}
