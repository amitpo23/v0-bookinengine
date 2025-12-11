"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Addon {
  id: string
  name: string
  description: string
  price: number
  image: string
  moreInfoLink?: string
}

interface AddonsCarouselProps {
  addons: Addon[]
  onAddAddon?: (addon: Addon) => void
  currency?: string
}

export function AddonsCarousel({ addons, onAddAddon, currency = "₪" }: AddonsCarouselProps) {
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
    <div className="w-full" dir="rtl">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700">
          שדרגו את החופשה עם אחת מחבילות הפינוק שלנו או דלגו לאישור הזמנתכם בלחיצה על{" "}
          <button className="text-teal-600 font-bold underline">הזמן עכשיו</button>
        </p>
      </div>

      {/* Room Info Badge */}
      <div className="flex justify-end mb-4">
        <div className="bg-gray-100 px-4 py-2 rounded">
          <span className="font-medium">חדר#</span>
          <span className="mr-2">2 מבוגרים</span>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Addons Grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img src={addon.image || "/placeholder.svg"} alt={addon.name} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">{addon.name}</h3>

                <div className="flex items-center justify-between mb-3">
                  <Button
                    onClick={() => onAddAddon?.(addon)}
                    className="bg-teal-600 hover:bg-teal-700 text-white gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף
                  </Button>
                  <span className="text-xl font-bold">
                    {addon.price} {currency}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{addon.description}</p>

                {addon.moreInfoLink && <button className="text-teal-600 text-sm hover:underline mt-2">קרא עוד</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
