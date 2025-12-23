'use client';

import { useEffect, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';
import type { HotelData } from '@/types/hotel-types';
import type { SearchQuery } from '@/types/ui-types';
import HotelCard from './hotel-card';

// Progress constants
const PROGRESS_COMPLETE = 100;
const PROGRESS_RESET_DELAY = 500;
const PROGRESS_CAP = 85;
const PROGRESS_INCREMENT_BASE = 5;
const PROGRESS_INCREMENT_MULTIPLIER = 10;
const PROGRESS_INTERVAL = 800;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_SECOND * 60 * 60 * 24;

// Progress stage thresholds
const PROGRESS_CONNECTING = 20;
const PROGRESS_AUTHENTICATING = 40;
const PROGRESS_SEARCHING = 60;
const PROGRESS_PROCESSING = 80;

type HotelResultsProps = {
  hotels: HotelData[];
  searchQuery?: SearchQuery;
  onSelectHotel: (hotel: HotelData) => void;
  isLoading?: boolean;
};

export function HotelResults({
  hotels,
  searchQuery,
  onSelectHotel,
  isLoading = false,
}: HotelResultsProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleSearchStart = () => {
      setProgress(0);
      // Simulate realistic API progress stages
      const progressStages = [
        { value: 15, delay: 200 }, // Connecting to server
        { value: 35, delay: 800 }, // Authenticating
        { value: 55, delay: 1200 }, // Searching hotels
        { value: 75, delay: 1800 }, // Processing results
        { value: 90, delay: 2200 }, // Finalizing
      ];

      for (const { value, delay } of progressStages) {
        setTimeout(() => setProgress(value), delay);
      }
    };

    const handleSearchResults = () => {
      setProgress(PROGRESS_COMPLETE);
      setTimeout(() => setProgress(0), PROGRESS_RESET_DELAY); // Reset after completion
    };

    // Listen to real-time hotel search events
    window.addEventListener('hotelSearchStart', handleSearchStart);
    window.addEventListener('hotelSearchResults', handleSearchResults);

    return () => {
      window.removeEventListener('hotelSearchStart', handleSearchStart);
      window.removeEventListener('hotelSearchResults', handleSearchResults);
    };
  }, []);

  // Fallback progress for generic loading states
  useEffect(() => {
    if (isLoading && progress === 0) {
      setProgress(10);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= PROGRESS_CAP) {
            return prev; // Cap at 85% until real completion
          }
          return (
            prev +
            Math.random() * PROGRESS_INCREMENT_MULTIPLIER +
            PROGRESS_INCREMENT_BASE
          );
        });
      }, PROGRESS_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isLoading, progress]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AnimatedCircularProgressBar
            className="relative size-20 font-semibold text-sm"
            gaugePrimaryColor="rgb(59 130 246)" // blue-500
            gaugeSecondaryColor="rgba(59, 130, 246, 0.1)"
            value={progress}
          />
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              Searching for hotels...
            </p>
            <p className="text-muted-foreground/70 text-xs">
              {progress < PROGRESS_CONNECTING && 'Connecting to server...'}
              {progress >= PROGRESS_CONNECTING &&
                progress < PROGRESS_AUTHENTICATING &&
                'Authenticating...'}
              {progress >= PROGRESS_AUTHENTICATING &&
                progress < PROGRESS_SEARCHING &&
                'Searching hotels...'}
              {progress >= PROGRESS_SEARCHING &&
                progress < PROGRESS_PROCESSING &&
                'Processing results...'}
              {progress >= PROGRESS_PROCESSING &&
                progress < PROGRESS_COMPLETE &&
                'Finalizing...'}
              {progress >= PROGRESS_COMPLETE && 'Complete!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex min-h-[calc(70vh-8rem)] items-center justify-center text-center text-muted-foreground">
        <div>
          <svg
            aria-label="No hotels found"
            className="mx-auto mb-4 h-12 w-12 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>No hotels found</title>
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No hotel search yet
          </h3>
          <p className="text-muted-foreground">
            Search for hotels in your desired destination.
          </p>
        </div>
      </div>
    );
  }

  const nights = searchQuery
    ? Math.ceil(
        (new Date(searchQuery.dateTo).getTime() -
          new Date(searchQuery.dateFrom).getTime()) /
          MILLISECONDS_PER_DAY
      )
    : 2;

  return (
    <div className="@container/hotels w-full space-y-2 md:space-y-3">
      {/* Hotels */}
      {hotels.map((hotel, index) => (
        <HotelCard
          hotel={hotel}
          key={`${hotel.hotelId}-${index}`}
          nights={nights}
          onSelect={onSelectHotel}
        />
      ))}
    </div>
  );
}
