import type { Booking } from "@/types/booking"
import type { DashboardStats } from "@/types/admin"
import { mockRooms, mockRatePlans } from "./mock-data"
import { addDays, subDays } from "@/lib/date-utils"

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    hotelId: "hotel-1",
    confirmationNumber: "GA1234567",
    status: "confirmed",
    checkIn: addDays(new Date(), 2),
    checkOut: addDays(new Date(), 5),
    nights: 3,
    guests: { adults: 2, children: 0 },
    rooms: [
      {
        room: mockRooms[0],
        ratePlan: mockRatePlans[0],
        quantity: 1,
      },
    ],
    guestDetails: {
      firstName: "יוסי",
      lastName: "כהן",
      email: "yossi@example.com",
      phone: "+972-50-1234567",
      country: "IL",
    },
    pricing: {
      subtotal: 2550,
      taxes: 433.5,
      fees: 0,
      discount: 0,
      total: 2983.5,
      currency: "ILS",
    },
    createdAt: subDays(new Date(), 5),
  },
  {
    id: "booking-2",
    hotelId: "hotel-1",
    confirmationNumber: "GA1234568",
    status: "confirmed",
    checkIn: new Date(),
    checkOut: addDays(new Date(), 2),
    nights: 2,
    guests: { adults: 4, children: 2 },
    rooms: [
      {
        room: mockRooms[3],
        ratePlan: mockRatePlans[6],
        quantity: 1,
      },
    ],
    guestDetails: {
      firstName: "שרה",
      lastName: "לוי",
      email: "sarah@example.com",
      phone: "+972-52-9876543",
      country: "IL",
    },
    pricing: {
      subtotal: 3700,
      taxes: 629,
      fees: 0,
      discount: 0,
      total: 4329,
      currency: "ILS",
    },
    createdAt: subDays(new Date(), 10),
  },
  {
    id: "booking-3",
    hotelId: "hotel-1",
    confirmationNumber: "GA1234569",
    status: "pending",
    checkIn: addDays(new Date(), 7),
    checkOut: addDays(new Date(), 10),
    nights: 3,
    guests: { adults: 2, children: 1 },
    rooms: [
      {
        room: mockRooms[1],
        ratePlan: mockRatePlans[3],
        quantity: 1,
      },
    ],
    guestDetails: {
      firstName: "David",
      lastName: "Cohen",
      email: "david@example.com",
      phone: "+1-555-0123",
      country: "US",
    },
    pricing: {
      subtotal: 4350,
      taxes: 739.5,
      fees: 0,
      discount: 0,
      total: 5089.5,
      currency: "ILS",
    },
    createdAt: subDays(new Date(), 2),
  },
  {
    id: "booking-4",
    hotelId: "hotel-1",
    confirmationNumber: "GA1234570",
    status: "cancelled",
    checkIn: addDays(new Date(), 1),
    checkOut: addDays(new Date(), 3),
    nights: 2,
    guests: { adults: 2, children: 0 },
    rooms: [
      {
        room: mockRooms[2],
        ratePlan: mockRatePlans[5],
        quantity: 1,
      },
    ],
    guestDetails: {
      firstName: "מיכל",
      lastName: "אברהם",
      email: "michal@example.com",
      phone: "+972-54-5555555",
      country: "IL",
    },
    pricing: {
      subtotal: 1100,
      taxes: 187,
      fees: 0,
      discount: 0,
      total: 1287,
      currency: "ILS",
    },
    createdAt: subDays(new Date(), 8),
  },
]

export const mockDashboardStats: DashboardStats = {
  todayCheckIns: 3,
  todayCheckOuts: 5,
  occupancyRate: 78,
  availableRooms: 4,
  totalRooms: 18,
  monthlyRevenue: 245680,
  monthlyBookings: 87,
}

export function getBookings(): Booking[] {
  return mockBookings
}

export function getDashboardStats(): DashboardStats {
  return mockDashboardStats
}
