'use client';

import { Heart, Users } from 'lucide-react';
import Image from 'next/image';
import type { HotelData } from '@/types/hotel-types';
import { getCurrentCancellationStatus } from '@/lib/utils/cancellation-policy';

// Hotel rating constants
const DEFAULT_RATING = 7.4;
const LUXURY_RATING = 8.0;
const SUPERIOR_RATING = 7.8;

// Review count calculation constants
const REVIEW_COUNT_MULTIPLIER = 2000;
const REVIEW_COUNT_BASE = 1000;

// Room availability constants
const AVAILABILITY_THRESHOLD = 0.5;
const LOW_AVAILABILITY_COUNT = 2;
const MEDIUM_AVAILABILITY_COUNT = 3;
const SHOW_AVAILABILITY_THRESHOLD = 0.3;

// Other constants
const AD_DISPLAY_PROBABILITY = 0.8;
const GOOD_RATING_THRESHOLD = 7;
const PRICE_MARKUP_FACTOR = 1.15;

type HotelCardProps = {
  hotel: HotelData;
  onSelect?: (hotel: HotelData) => void;
  className?: string;
  nights?: number;
};

type HotelImageSectionProps = {
  hotel: HotelData;
};

function HotelImageSection({ hotel }: HotelImageSectionProps) {
  const mainImage = hotel.images?.[0];

  return (
    <div className="relative h-full w-[280px] flex-shrink-0">
      {mainImage ? (
        <Image
          alt={hotel.hotelName}
          className="object-cover"
          fill
          sizes="280px"
          src={`https://cdn-images.innstant-servers.com/400x300/${mainImage.url}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}

      <button
        className="group absolute top-2 right-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
        type="button"
      >
        <Heart
          className="h-3.5 w-3.5 text-red-500 transition-colors group-hover:fill-red-500"
          strokeWidth={1.5}
        />
      </button>

      {hotel.specialOffers && hotel.specialOffers.length > 0 && (
        <div className="absolute top-2 left-2">
          <div className="rounded bg-purple-600 px-2 py-0.5 font-medium text-[10px] text-white">
            VIP Access
          </div>
        </div>
      )}

      {Math.random() > AD_DISPLAY_PROBABILITY && (
        <div className="absolute bottom-2 left-2">
          <div className="rounded bg-gray-800/70 px-1.5 py-0.5 text-[10px] text-white">
            Ad
          </div>
        </div>
      )}
    </div>
  );
}

type HotelInfoSectionProps = {
  hotel: HotelData;
  rating: number;
  reviewCount: number;
  onSelect?: (hotel: HotelData) => void;
};

function HotelInfoSection({
  hotel,
  rating,
  reviewCount,
  onSelect,
}: HotelInfoSectionProps) {
  return (
    <div className="flex-1 p-3 pr-0">
      <div className="flex h-full">
        <div className="flex-1 pr-3">
          <button
            className="mb-1 block cursor-pointer text-left font-semibold text-blue-600 text-sm leading-tight hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onSelect?.(hotel)}
            type="button"
          >
            {hotel.hotelName}
          </button>

          <div className="mb-2 text-[11px] text-gray-600">
            <span className="font-medium">
              {hotel.category === 'luxury' ? 'Downtown' : 'City Center'}
            </span>
          </div>

          <div className="mb-2 flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-400" />
            <span className="text-[11px] text-gray-600">Pool</span>
          </div>

          <div className="mb-1 font-semibold text-gray-800 text-xs">
            {hotel.roomType || 'Standard Room'}
          </div>

          <div className="text-[11px] text-gray-600 leading-relaxed">
            <div>Fully renovated resort featuring The Backyard Social</div>
            <div>Club: 2 pools, cabanas, live music, lawn games and 2</div>
            <div>poolside dining options...</div>
          </div>

          <div className="mt-2 text-[11px] text-gray-500">
            Reserve now, pay later
          </div>
        </div>

        <div className="flex flex-col items-end pr-3">
          <div className="mb-auto flex items-center gap-2">
            <div className="text-right">
              <div className="font-medium text-xs">
                {rating >= GOOD_RATING_THRESHOLD ? 'Good' : 'Fair'}
              </div>
              <div className="text-[10px] text-gray-500">
                {reviewCount.toLocaleString()} reviews
              </div>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-800 font-bold text-white text-xs">
              {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PriceSectionProps = {
  currentPrice: number;
  totalPrice: number;
  showLeftBadge: boolean;
  leftCount: number;
  onSelect?: (hotel: HotelData) => void;
  hotel: HotelData;
};

function PriceSection({
  currentPrice,
  totalPrice,
  showLeftBadge,
  leftCount,
  onSelect,
  hotel,
}: PriceSectionProps) {
  return (
    <div className="flex w-[140px] flex-col border-gray-200 border-l p-3">
      {showLeftBadge && (
        <div className="mb-2 rounded bg-green-600 px-2 py-1 text-center font-medium text-[10px] text-white">
          We have {leftCount} left at
        </div>
      )}

      <div className="flex flex-1 flex-col justify-center">
        <div className="text-right">
          <div className="text-gray-500 text-xs line-through">
            ${Math.floor(totalPrice * PRICE_MARKUP_FACTOR)}
          </div>
          <div className="mb-0.5 font-medium text-gray-500 text-sm">
            ${currentPrice} nightly
          </div>
          <div className="font-bold text-gray-900 text-lg">
            ${totalPrice} total
          </div>
        </div>
      </div>

      <div className="mb-2 text-center text-[10px] text-green-600">
        ✓ Total includes taxes and fees
      </div>

      <button
        className="w-full rounded bg-blue-600 py-2 font-medium text-white text-xs transition-colors hover:bg-blue-700"
        onClick={() => onSelect?.(hotel)}
        type="button"
      >
        Select Room
      </button>
    </div>
  );
}

export default function HotelCard({
  hotel,
  onSelect,
  className = '',
  nights = 2,
}: HotelCardProps) {
  const currentPrice = hotel.price;
  const totalPrice = currentPrice * nights;

  // Mock rating and reviews
  let rating = DEFAULT_RATING;
  if (hotel.category === 'luxury') {
    rating = LUXURY_RATING;
  } else if (hotel.category === 'superior') {
    rating = SUPERIOR_RATING;
  }
  const reviewCount = Math.floor(
    Math.random() * REVIEW_COUNT_MULTIPLIER + REVIEW_COUNT_BASE
  );

  // Get current cancellation status
  const _cancellationStatus = getCurrentCancellationStatus(hotel.cancellation);

  // Random "we have X left"
  const leftCount =
    Math.random() > AVAILABILITY_THRESHOLD
      ? LOW_AVAILABILITY_COUNT
      : MEDIUM_AVAILABILITY_COUNT;
  const showLeftBadge = Math.random() > SHOW_AVAILABILITY_THRESHOLD;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:bg-blue-50/30 hover:shadow-md ${className} overflow-hidden`}
    >
      <div className="flex h-[220px]">
        <HotelImageSection hotel={hotel} />
        <HotelInfoSection
          hotel={hotel}
          onSelect={onSelect}
          rating={rating}
          reviewCount={reviewCount}
        />
        <PriceSection
          currentPrice={currentPrice}
          hotel={hotel}
          leftCount={leftCount}
          onSelect={onSelect}
          showLeftBadge={showLeftBadge}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
}
