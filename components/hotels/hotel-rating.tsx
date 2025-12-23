'use client';

import { Star } from 'lucide-react';

type HotelRatingProps = {
  rating: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_CLASSES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function HotelRating({
  rating,
  showNumber = false,
  size = 'md',
  className = '',
}: HotelRatingProps) {
  const stars = Math.round(rating);
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex text-yellow-400">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} className={`${sizeClass} fill-current`} />
        ))}
      </div>
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
}
