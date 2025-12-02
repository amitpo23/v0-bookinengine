export interface BookingStatus {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  revenue: number
}

export interface DashboardStats {
  todayCheckIns: number
  todayCheckOuts: number
  occupancyRate: number
  availableRooms: number
  totalRooms: number
  monthlyRevenue: number
  monthlyBookings: number
}

export interface HotelSettings {
  name: string
  slug: string
  description: string
  address: string
  city: string
  country: string
  stars: number
  primaryColor: string
  logo?: string
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: string
  currency: string
  taxRate: number
}
