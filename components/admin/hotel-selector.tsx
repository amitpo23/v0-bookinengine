"use client"

import { useSaaS } from "@/lib/saas-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function HotelSelector() {
  const { hotels, currentHotel, setCurrentHotel } = useSaaS()

  if (hotels.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="font-medium text-sm">{currentHotel?.name}</span>
      </div>
    )
  }

  return (
    <Select
      value={currentHotel?.id}
      onValueChange={(value) => {
        const hotel = hotels.find((h) => h.id === value)
        if (hotel) setCurrentHotel(hotel)
      }}
    >
      <SelectTrigger className="w-[250px] bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <SelectValue placeholder="בחר מלון" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {hotels.map((hotel) => (
          <SelectItem key={hotel.id} value={hotel.id}>
            <div className="flex items-center gap-2">
              <span>{hotel.name}</span>
              <Badge variant="outline" className="text-xs">
                {hotel.stars} כוכבים
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
