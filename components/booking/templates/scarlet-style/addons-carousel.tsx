"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Addon {
  id: string
  name: string
  description: string
  price: number
  image: string
  moreInfoLink?: string
}

interface ScarletAddonsCarouselProps {
  addons: Addon[]
  onAddAddon?: (addon: Addon) => void
  currency?: string
}

export function ScarletAddonsCarousel({ addons, onAddAddon, currency = "₪" }: ScarletAddonsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  return (
    <div className="w-full bg-gradient-to-b from-black to-gray-900 p-8 rounded-lg" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-6 w-6 text-red-500" />
          <h3 className="text-2xl font-bold text-white">שדרגו את החוויה</h3>
          <Heart className="h-6 w-6 text-pink-500" />
        </div>
        <p className="text-lg text-gray-300">
          הוסיפו את אחת מחבילות הפינוק שלנו או המשיכו לאישור הזמנתכם
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 shadow-xl shadow-red-500/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Addons Grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-xl overflow-hidden border border-red-500/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={addon.image || "/placeholder.svg"} 
                  alt={addon.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-white text-xl mb-3">{addon.name}</h3>

                <p className="text-sm text-gray-300 line-clamp-2 mb-4">{addon.description}</p>

                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => onAddAddon?.(addon)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white gap-2 shadow-lg shadow-red-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    הוסף
                  </Button>
                  <span className="text-2xl font-bold text-white">
                    {addon.price} <span className="text-red-400">{currency}</span>
                  </span>
                </div>

                {addon.moreInfoLink && (
                  <button className="text-pink-400 text-sm hover:text-pink-300 mt-3 underline">
                    קרא עוד
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 shadow-xl shadow-red-500/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Skip Button */}
      <div className="text-center mt-8">
        <button className="text-gray-400 hover:text-white underline transition-colors">
          דלג ומשך להזמנה
        </button>
      </div>
    </div>
  )
}
