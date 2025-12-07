'use client';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type CombinedImage = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  source: 'original' | 'external';
};

type HotelImageGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: CombinedImage[];
  initialIndex: number;
  hotelName: string;
};

export function HotelImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  hotelName,
}: HotelImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images.length) {
    return null;
  }

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getImageSrc = (image: CombinedImage) => {
    if (image.source === 'original') {
      // Use high quality version for modal
      return `https://cdn-images.innstant-servers.com/800x600/${image.url}`;
    }
    return image.url;
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = getImageSrc(currentImage);
      link.download = `${hotelName}-image-${currentIndex + 1}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Silent fail for download errors
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{hotelName} - Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full flex-col">
          {/* Image Container */}
          <div className="relative flex-1 overflow-hidden rounded-lg bg-gray-100">
            <div
              aria-label={
                currentImage.title || `${hotelName} image ${currentIndex + 1}`
              }
              className="h-full w-full bg-center bg-contain bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url(${getImageSrc(currentImage)})` }}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  className="-translate-y-1/2 absolute top-1/2 left-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  onClick={goToPrevious}
                  type="button"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  aria-label="Next image"
                  className="-translate-y-1/2 absolute top-1/2 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  onClick={goToNext}
                  type="button"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="-translate-x-1/2 absolute bottom-4 left-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} of {images.length}
            </div>

            {/* Image Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              {currentImage.source === 'external' && (
                <button
                  className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  onClick={() => window.open(currentImage.url, '_blank')}
                  title="View original"
                  type="button"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}

              <button
                className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                onClick={handleDownload}
                title="Download image"
                type="button"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image Info */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {currentImage.title || `Hotel Image ${currentIndex + 1}`}
                </h3>
                {currentImage.description && (
                  <p className="mt-1 text-gray-600 text-sm">
                    {currentImage.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4 text-gray-500 text-xs">
                  <span>
                    Source:{' '}
                    {currentImage.source === 'original'
                      ? 'Hotel Gallery'
                      : 'Web Search'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      index === currentIndex
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    type="button"
                  >
                    <div
                      aria-label={`Thumbnail ${index + 1}`}
                      className="h-full w-full bg-center bg-cover"
                      role="img"
                      style={{ backgroundImage: `url(${getImageSrc(image)})` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
