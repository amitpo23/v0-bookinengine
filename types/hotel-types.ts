// Hotel booking related types - Enhanced version from sunday-main project

// API Request types
export type HotelSearchParams = {
  dateFrom: string;
  dateTo: string;
  pax: Array<{ age?: number; typeId: number }>;
  stars?: number | null;
  limit?: number | null;
  city?: string;
  hotelName?: string;
};

export type HotelItem = {
  name?: string;
  code?: string;
  board?: string;
  price?: {
    amount: number;
    currency: string;
  };
  cancellation?: unknown;
  confirmation?: string;
  items?: unknown[];
  images?: unknown[];
  _rawHotelData?: unknown;
};

export type BookingPaxInfo = {
  adults: number;
  children?: number[];
};

export type CancellationFrame = {
  from: string;
  to: string;
  penalty: {
    amount: number;
    currency: string;
  };
};

export type CancellationPolicy = {
  type: string;
  frames?: CancellationFrame[];
};

export type CancellationStatus = {
  isRefundable: boolean;
  status: 'free' | 'non-refundable' | 'expired' | 'unknown';
  message: string;
  penalty: { amount: number; currency: string } | null;
  daysRemaining?: number;
  deadline?: Date;
};

export type BookingRequest = {
  dateFrom: string;
  dateTo: string;
  pax: BookingPaxInfo[];
  selectedHotel: string;
  preBookId?: string;
  searchResults: unknown;
};

export type PreBookRequest = {
  dateFrom: string;
  dateTo: string;
  pax: BookingPaxInfo[];
  selectedHotel: string;
  searchResults: unknown;
};

// UI Component Hotel types
export type HotelImage = {
  id: number;
  url: string;
  title: string;
  width: number;
  height: number;
};

export type HotelRoom = {
  id: string;
  type: string;
  board: string;
  price: number;
  availability: number;
};

// API response hotel data structure
export type HotelApiData = {
  hotelName: string;
  hotelId: string;
  price?: { amount: number };
  roomType: string;
  board: string;
  allImages?: string[];
  mainImage?: string;
  totalRoomOptions: number;
  allRooms: HotelRoom[];
  cancellation?: { type: string };
};

// UI component hotel data structure
export type HotelData = {
  hotelName: string;
  hotelId: string;
  price: number;
  netPrice?: number;
  images?: Array<{
    id: number;
    width: number;
    height: number;
    title: string;
    url: string;
  }>;
  roomType?: string;
  category: string;
  bedding?: string;
  board?: string;
  cancellation: {
    type: string;
    frames?: Array<{
      from: string;
      to: string;
      penalty: {
        amount: number;
        currency: string;
      };
    }>;
  };
  confirmation?: string;
  paymentType?: string;
  commissionable?: boolean;
  specialOffers?: SpecialOffer[];
  providers?: { id?: number; name: string }[];
  items?: HotelUIItem[];
  roomOptions?: Array<{
    roomType: string;
    category: string;
    bedding: string;
    board: string;
    price: number;
    netPrice: number;
    cancellation: {
      type: string;
      frames?: Array<{
        from: string;
        to: string;
        penalty: {
          amount: number;
          currency: string;
        };
      }>;
    };
    specialOffers: SpecialOffer[];
  }>;
};

export type SpecialOffer = {
  id: string;
  title: string;
  description: string;
  discount?: number;
};

export type HotelUIItem = {
  id: string;
  name: string;
  type: string;
  included: boolean;
};

export type TransformedHotel = {
  hotelName: string;
  hotelId: string;
  price: number;
  roomType: string;
  board: string;
  images: HotelImage[];
  totalRoomOptions: number;
  allRooms: HotelRoom[];
  category: string;
  cancellation: { type: string };
  netPrice: number;
  bedding: string;
  confirmation: string;
  paymentType: string;
  commissionable: boolean;
  specialOffers: SpecialOffer[];
  providers: { id: number; name: string }[];
  items: HotelUIItem[];
};

export type HotelSearchResult = {
  success: boolean;
  hotels: HotelApiData[];
};

// Enhanced hotel data from external sources (Tavily, etc.)
export type TavilyHotelEnhancement = {
  hotelName: string;
  city: string;
  starRating: number | null;
  description: string;
  reviewsSummary: Array<{
    source: string;
    url: string;
    excerpt: string;
    score: number;
  }>;
  amenities: string[];
  locationInfo: string;
  additionalImages: Array<{
    url: string;
    description?: string;
  }>;
  sources: {
    reviews: Array<{
      title: string;
      url: string;
      content: string;
      score: number;
    }>;
    amenities: Array<{
      title: string;
      url: string;
      content: string;
      score: number;
    }>;
    location: Array<{
      title: string;
      url: string;
      content: string;
      score: number;
    }>;
  };
};

// Enhanced hotel data combining original + external enhancements
export type EnhancedHotelData = HotelData & {
  tavilyEnhancement?: TavilyHotelEnhancement;
};
