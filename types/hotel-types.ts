// Hotel Types for Sunday Components

export interface HotelData {
  hotelId: number;
  hotelName: string;
  city: string;
  stars: number;
  address: string;
  imageUrl: string;
  images: string[];
  description: string;
  facilities: string[];
  rooms: RoomData[];
}

export interface RoomData {
  code: string;
  roomId: string;
  roomName: string;
  roomCategory: string;
  categoryId: number;
  boardId: number;
  boardType: string;
  buyPrice: number;
  originalPrice: number;
  currency: string;
  maxOccupancy: number;
  size: number;
  view: string;
  bedding: string;
  amenities: string[];
  images: string[];
  cancellationPolicy: string;
  available: number;
  requestJson?: string;
  pax?: { adults: number; children: number[] };
}

export interface TavilyHotelEnhancement {
  description?: string;
  starRating?: number;
  amenities?: string[];
  locationInfo?: string;
  reviewsSummary?: TavilyReview[];
  additionalImages?: string[];
  sources: {
    reviews: string[];
    amenities: string[];
    location: string[];
  };
}

export interface TavilyReview {
  source: string;
  excerpt: string;
  score: number;
  url: string;
}

export interface SearchQuery {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children?: number[];
  destination?: string;
}
