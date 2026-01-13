"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { 
  Users, 
  Bed, 
  Maximize, 
  Wifi, 
  Wind,
  Coffee,
  ChevronRight,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleRoomCardProps {
  room: {
    id: string
    name: string
    images: string[]
    price: number
    originalPrice?: number
    discount?: number
    size: number
    maxOccupancy: number
    bedType: string
    boardType: string
    amenities: string[]
    description?: string
  }
  onBook: (roomId: string) => void
  onViewDetails: (roomId: string) => void
}

export function SimpleRoomCard({ room, onBook, onViewDetails }: SimpleRoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const amenityIcons: Record<string, any> = {
    "WiFi": Wifi,
    "מיזוג": Wind,
    "ארוחת בוקר": Coffee,
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === room.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? room.images.length - 1 : prev - 1
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid md:grid-cols-[300px_1fr] gap-0">
        {/* תמונות */}
        <div className="relative h-64 md:h-full bg-gray-100">
          {room.images.length > 0 ? (
            <>
              <div className="relative w-full h-full">
                <img
                  src={room.images[currentImageIndex]}
                  alt={room.name}
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* נקודות ניווט */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {room.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentImageIndex 
                        ? "bg-white w-6" 
                        : "bg-white/60"
                    )}
                  />
                ))}
              </div>

              {/* חיצים */}
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* מונה תמונות */}
              <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {room.images.length}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              אין תמונה
            </div>
          )}

          {/* הנחה */}
          {room.discount && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white">
              -{room.discount}%
            </Badge>
          )}
        </div>

        {/* פרטי החדר */}
        <div className="p-6 flex flex-col">
          <div className="flex-1">
            {/* כותרת */}
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  <span>{room.size} מ"ר</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>עד {room.maxOccupancy} אורחים</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{room.bedType}</span>
                </div>
              </div>
            </div>

            {/* סוג לינה */}
            <div className="mb-4">
              <Badge variant="outline" className="text-sm">
                {room.boardType}
              </Badge>
            </div>

            {/* תיאור */}
            {room.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {room.description}
              </p>
            )}

            {/* שירותים */}
            <div className="flex flex-wrap gap-3 mb-4">
              {room.amenities.slice(0, 4).map((amenity) => {
                const Icon = amenityIcons[amenity] || Star
                return (
                  <div key={amenity} className="flex items-center gap-1 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{amenity}</span>
                  </div>
                )
              })}
              {room.amenities.length > 4 && (
                <span className="text-sm text-muted-foreground">
                  +{room.amenities.length - 4} נוספים
                </span>
              )}
            </div>
          </div>

          {/* מחיר ופעולות */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                החל מ-
              </div>
              <div className="flex items-baseline gap-2">
                {room.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₪{room.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold">
                  ₪{room.price.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                כולל מע"ם
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onViewDetails(room.id)}
              >
                פרטים נוספים
              </Button>
              <Button
                onClick={() => onBook(room.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                הזמנה
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
