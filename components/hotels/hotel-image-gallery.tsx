'use client';

import Image from 'next/image';
import { useState } from 'react';
import type {
  HotelData,
  TavilyHotelEnhancement,
} from '@/types/hotel-types';
import { HotelImageGalleryModal } from './hotel-image-gallery-modal';

// Image gallery constants
const ADDITIONAL_IMAGES_START_INDEX = 1;
const MAX_ADDITIONAL_IMAGES = 7;
const TABLET_BREAKPOINT_INDEX = 4;

type HotelImageGalleryProps = {
  hotel: HotelData;
  enhancedData?: TavilyHotelEnhancement | null;
};

type CombinedImage = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  source: 'original' | 'external';
};

// Helper function to combine original and external images
function combineImages(
  hotel: HotelData,
  enhancedData?: TavilyHotelEnhancement | null
): CombinedImage[] {
  const combined: CombinedImage[] = [];

  // Add original hotel images first
  if (hotel.images && hotel.images.length > 0) {
    hotel.images.forEach((image, index) => {
      combined.push({
        id: `original-${image.id || index}`,
        url: image.url,
        title: image.title,
        source: 'original',
      });
    });
  }

  // Add enhanced images if available
  if (
    enhancedData?.additionalImages &&
    enhancedData.additionalImages.length > 0
  ) {
    enhancedData.additionalImages.forEach((image, index) => {
      // Only add if the URL is valid and not a duplicate
      if (
        image.url &&
        !combined.some((existing) => existing.url === image.url)
      ) {
        combined.push({
          id: `external-${index}`,
          url: image.url,
          description: image.description,
          source: 'external',
        });
      }
    });
  }

  return combined;
}

// Component to handle both internal and external images with accessibility
function FlexibleImage({
  src,
  alt,
  className,
  width,
  height,
  onClick,
}: {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
  onClick?: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  // Check if it's an external image
  const isExternal = !src.includes('cdn-images.innstant-servers.com');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (imageFailed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-200`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        aria-label={alt}
        className={`${className} border-0 p-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {isExternal ? (
          <div
            aria-label={alt}
            className="h-full w-full bg-center bg-cover bg-no-repeat"
            role="img"
            style={{
              backgroundImage: `url(${src})`,
              width,
              height,
            }}
          />
        ) : (
          <Image
            alt={alt}
            className="h-full w-full object-cover"
            height={height}
            onError={() => setImageFailed(true)}
            src={src}
            width={width}
          />
        )}
      </button>
    );
  }

  if (isExternal) {
    return (
      <div
        aria-label={alt}
        className={`${className} bg-center bg-cover bg-no-repeat`}
        role="img"
        style={{
          backgroundImage: `url(${src})`,
          width,
          height,
        }}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      onError={() => setImageFailed(true)}
      src={src}
      width={width}
    />
  );
}

type MainImageProps = {
  images: CombinedImage[];
  hotelName: string;
  onClick: () => void;
};

function MainImage({ images, hotelName, onClick }: MainImageProps) {
  const mainImage = images[0];

  return (
    <div className="relative">
      {mainImage ? (
        <FlexibleImage
          alt={`${hotelName} main view`}
          className="h-full w-full object-cover transition-opacity hover:opacity-90"
          height={128}
          onClick={onClick}
          src={
            mainImage.source === 'original'
              ? `https://cdn-images.innstant-servers.com/128x128/${mainImage.url}`
              : mainImage.url
          }
          width={128}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-300">
          <span className="text-gray-500 text-xs">Main Photo</span>
        </div>
      )}
    </div>
  );
}

type AdditionalImagesProps = {
  images: CombinedImage[];
  hotelName: string;
  onImageClick: (index: number) => void;
};

function AdditionalImages({
  images,
  hotelName,
  onImageClick,
}: AdditionalImagesProps) {
  // Generate all possible additional image slots
  const imageSlots = Array.from(
    { length: MAX_ADDITIONAL_IMAGES },
    (_, index) => {
      const imageIndex = index + ADDITIONAL_IMAGES_START_INDEX;
      const image = images[imageIndex];
      const isLastSlot = index === MAX_ADDITIONAL_IMAGES - 1;
      const hasMoreImages = images.length > MAX_ADDITIONAL_IMAGES + 1;

      // Responsive classes for each slot
      const getResponsiveClasses = () => {
        if (index === 0) {
          return ''; // Always show first additional image
        }
        if (index === 1) {
          return ''; // Always show second additional image
        }
        if (index <= TABLET_BREAKPOINT_INDEX) {
          return 'hidden md:block'; // Show on tablet and up
        }
        return 'hidden lg:block'; // Show on desktop only
      };

      return (
        <div
          className={`relative ${getResponsiveClasses()}`}
          key={image?.id || `empty-${index}`}
        >
          {image ? (
            <FlexibleImage
              alt={`${hotelName} additional view`}
              className="h-full w-full object-cover transition-opacity hover:opacity-90"
              height={128}
              onClick={() => onImageClick(imageIndex)}
              src={
                image.source === 'original'
                  ? `https://cdn-images.innstant-servers.com/128x128/${image.url}`
                  : image.url
              }
              width={128}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xs">Photo {index + 2}</span>
            </div>
          )}

          {/* Show "+X photos" overlay on last visible image if there are more */}
          {isLastSlot && hasMoreImages && image && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-medium text-white text-xs">
                +{images.length - (MAX_ADDITIONAL_IMAGES + 1)} photos
              </span>
            </div>
          )}
        </div>
      );
    }
  );

  return <>{imageSlots}</>;
}

export function HotelImageGallery({
  hotel,
  enhancedData,
}: HotelImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const combinedImages = combineImages(hotel, enhancedData);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mb-3 grid h-24 grid-cols-3 gap-0.5 overflow-hidden rounded-lg md:h-28 md:grid-cols-6 lg:h-32 lg:grid-cols-8">
        <MainImage
          hotelName={hotel.hotelName}
          images={combinedImages}
          onClick={() => openModal(0)}
        />
        <AdditionalImages
          hotelName={hotel.hotelName}
          images={combinedImages}
          onImageClick={openModal}
        />
      </div>

      <HotelImageGalleryModal
        hotelName={hotel.hotelName}
        images={combinedImages}
        initialIndex={selectedIndex}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
