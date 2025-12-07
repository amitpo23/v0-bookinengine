// UI-specific types for search and display

export type SearchQuery = {
  destination: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  children?: number[];
  rooms?: number;
  city?: string;
  hotelName?: string;
};

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc';

export type FilterOptions = {
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  amenities?: string[];
  cancellationPolicy?: 'free' | 'non-refundable' | 'all';
  mealPlan?: string[];
};
