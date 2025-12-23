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
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{hotelName} - Gallery</DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-col h-[85vh]">
          {/* Image Container */}
          <div className="flex-1 relative bg-gray-50 overflow-hidden">
            <img
              src={getImageSrc(currentImage)}
              alt={currentImage.title || `Hotel Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                  aria-label="Previous image"
                  type="button"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                  aria-label="Next image"
                  type="button"
                >
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} of {images.length}
            </div>

            {/* Image Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              {currentImage.source === 'external' && (
                <button
                  onClick={() => window.open(currentImage.url, '_blank')}
                  className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                  title="View original"
                  type="button"
                >
                  <ExternalLink className="h-5 w-5 text-gray-900" />
                </button>
              )}
              <button
                onClick={handleDownload}
                className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                title="Download image"
                type="button"
              >
                <Download className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Image Info */}
          <div className="p-6 pt-4 bg-white border-t">
            <h3 className="font-medium text-gray-900">
              {currentImage.title || `Hotel Image ${currentIndex + 1}`}
            </h3>
            {currentImage.description && (
              <p className="mt-1 text-gray-600 text-sm">{currentImage.description}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-gray-500 text-xs">
              <span>
                Source:{' '}
                {currentImage.source === 'original' ? 'Hotel Gallery' : 'Web Search'}
              </span>
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
