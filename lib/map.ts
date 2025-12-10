// lib/map.ts
import { Room, Rate } from "@/types/booking";

export function mapMediciRatesToRooms(rooms: Room[], mediciRates: any[]): Rate[] {
  return mediciRates.map((rate) => ({
    id: rate.RateId,
    roomCategory: rate.RoomCategory,
    roomCode: rate.RoomCode,
    price: rate.Price,
    currency: rate.Currency,
    cancellationPolicy: rate.CancellationPolicy,
    included: rate.Included,
  }));
}
