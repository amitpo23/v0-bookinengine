'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { HotelCard, HotelResults, HotelImageGallery, HotelAmenities } from '@/components/hotels';
import type { HotelData } from '@/types/hotel-types';
import type { SearchQuery } from '@/types/ui-types';

type RoomsShowcaseProps = {
  rooms?: HotelData[];
  searchQuery?: SearchQuery;
};

export function RoomsShowcase({ rooms = [], searchQuery }: RoomsShowcaseProps) {
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Demo data if no rooms provided
  const demoRooms: HotelData[] = rooms.length > 0 ? rooms : [
    {
      hotelName: 'Luxury Suite',
      hotelId: 'room-1',
      price: 299,
      netPrice: 280,
      category: 'luxury',
      roomType: 'Deluxe Suite',
      board: 'BB',
      images: [
        {
          id: 1,
          url: 'sample-room-1.jpg',
          title: 'Luxury Suite Main View',
          width: 800,
          height: 600,
        },
      ],
      cancellation: {
        type: 'free',
        frames: [
          {
            from: new Date().toISOString(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            penalty: {
              amount: 0,
              currency: 'USD',
            },
          },
        ],
      },
      specialOffers: [
        {
          id: 'offer-1',
          title: 'Early Bird',
          description: '20% off for bookings 30 days in advance',
          discount: 20,
        },
      ],
    },
    {
      hotelName: 'Standard Room',
      hotelId: 'room-2',
      price: 149,
      netPrice: 135,
      category: 'standard',
      roomType: 'Standard Double',
      board: 'RO',
      images: [
        {
          id: 2,
          url: 'sample-room-2.jpg',
          title: 'Standard Room Main View',
          width: 800,
          height: 600,
        },
      ],
      cancellation: {
        type: 'non-refundable',
      },
    },
  ];

  const displayRooms = rooms.length > 0 ? rooms : demoRooms;
  const demoSearchQuery: SearchQuery = searchQuery || {
    destination: 'Tel Aviv',
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    adults: 2,
    children: [],
  };

  const handleSelectHotel = (hotel: HotelData) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">תצוגת חדרים מתקדמת</h2>
          <p className="text-sm text-muted-foreground mt-1">
            תצוגה מקדימה של החדרים עם כל המידע והתמונות
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            רשימה
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            רשת
          </button>
        </div>
      </div>

      {/* Rooms Display */}
      {viewMode === 'list' ? (
        <HotelResults
          hotels={displayRooms}
          searchQuery={demoSearchQuery}
          onSelectHotel={handleSelectHotel}
          isLoading={false}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRooms.map((hotel, index) => (
            <HotelCard
              key={hotel.hotelId || index}
              hotel={hotel}
              onSelect={handleSelectHotel}
              nights={3}
            />
          ))}
        </div>
      )}

      {/* Selected Hotel Details */}
      {selectedHotel && (
        <Card className="p-6 mt-6 border-2 border-primary/20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">פרטי חדר נבחר</h3>
            <button
              onClick={() => setSelectedHotel(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              סגור
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">{selectedHotel.hotelName}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedHotel.roomType || 'Standard Room'}
              </p>
            </div>

            {selectedHotel.images && selectedHotel.images.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2">גלריית תמונות</h5>
                <HotelImageGallery hotel={selectedHotel} />
              </div>
            )}

            {selectedHotel.specialOffers && selectedHotel.specialOffers.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2">מבצעים</h5>
                <div className="space-y-2">
                  {selectedHotel.specialOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                    >
                      <div className="font-medium text-sm">{offer.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {offer.description}
                      </div>
                      {offer.discount && (
                        <div className="text-xs font-semibold text-purple-600 mt-1">
                          {offer.discount}% הנחה
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">מחיר ללילה</div>
                <div className="text-2xl font-bold">${selectedHotel.price}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">קטגוריה</div>
                <div className="text-lg font-medium capitalize">{selectedHotel.category}</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Info Box */}
      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-500/20 p-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">
              תצוגה מתקדמת של חדרים
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              קומפוננטות אלו משתמשות בטכנולוגיות מתקדמות מפרויקט Sunday לתצוגה מקצועית של חדרים,
              כולל גלריות תמונות, מידע מפורט, ואנימציות.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
