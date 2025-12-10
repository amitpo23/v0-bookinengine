"use client"

import type React from "react"
import { useState } from "react"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"

interface FilterOptions {
  priceRange: [number, number]
  maxOccupancy: number[]
  amenities: string[]
  roomTypes: string[]
  refundableOnly: boolean
}

interface FilterSortProps {
  onFilterChange: (filters: FilterOptions) => void
  onSortChange: (sortBy: string) => void
  language?: "en" | "he"
}

const FilterSort: React.FC<FilterSortProps> = ({ onFilterChange, onSortChange, language = "he" }) => {
  const isHebrew = language === "he"
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000],
    maxOccupancy: [],
    amenities: [],
    roomTypes: [],
    refundableOnly: false,
  })

  const amenityOptions = [
    { value: "wifi", label: "WiFi", labelHe: "WiFi" },
    { value: "tv", label: "TV", labelHe: "טלוויזיה" },
    { value: "coffee", label: "Coffee Maker", labelHe: "מכונת קפה" },
    { value: "ac", label: "Air Conditioning", labelHe: "מיזוג אוויר" },
    { value: "minibar", label: "Minibar", labelHe: "מיני בר" },
    { value: "safe", label: "Safe", labelHe: "כספת" },
    { value: "balcony", label: "Balcony", labelHe: "מרפסת" },
    { value: "sea_view", label: "Sea View", labelHe: "נוף לים" },
  ]

  const roomTypeOptions = [
    { value: "standard", label: "Standard", labelHe: "חדר סטנדרט" },
    { value: "deluxe", label: "Deluxe", labelHe: "חדר דלוקס" },
    { value: "suite", label: "Suite", labelHe: "סוויטה" },
    { value: "family", label: "Family Room", labelHe: "חדר משפחתי" },
  ]

  const sortOptions = [
    { value: "recommended", label: "Recommended", labelHe: "מומלץ" },
    { value: "price_low", label: "Price: Low to High", labelHe: "מחיר: נמוך לגבוה" },
    { value: "price_high", label: "Price: High to Low", labelHe: "מחיר: גבוה לנמוך" },
    { value: "rating", label: "Highest Rating", labelHe: "דירוג גבוה ביותר" },
    { value: "size", label: "Room Size", labelHe: "גודל החדר" },
  ]

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    handleFilterChange("amenities", newAmenities)
  }

  const toggleRoomType = (type: string) => {
    const newTypes = filters.roomTypes.includes(type)
      ? filters.roomTypes.filter((t) => t !== type)
      : [...filters.roomTypes, type]
    handleFilterChange("roomTypes", newTypes)
  }

  const toggleOccupancy = (num: number) => {
    const newOccupancy = filters.maxOccupancy.includes(num)
      ? filters.maxOccupancy.filter((o) => o !== num)
      : [...filters.maxOccupancy, num]
    handleFilterChange("maxOccupancy", newOccupancy)
  }

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 5000],
      maxOccupancy: [],
      amenities: [],
      roomTypes: [],
      refundableOnly: false,
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const activeFilterCount =
    filters.amenities.length + filters.roomTypes.length + filters.maxOccupancy.length + (filters.refundableOnly ? 1 : 0)

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 sticky top-20 z-30">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">{isHebrew ? "סינון" : "Filter"}</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium">{isHebrew ? "מיין לפי:" : "Sort by:"}</label>
          <div className="relative">
            <select
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white cursor-pointer font-medium"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {isHebrew ? option.labelHe : option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            {isHebrew ? "נקה הכל" : "Clear all"}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <h4 className="font-bold mb-3 text-gray-900">{isHebrew ? "טווח מחירים" : "Price Range"}</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange("priceRange", [0, Number.parseInt(e.target.value)])}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₪0</span>
                  <span className="font-bold text-blue-600">₪{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Occupancy */}
            <div>
              <h4 className="font-bold mb-3 text-gray-900">{isHebrew ? "מספר אורחים" : "Number of Guests"}</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => toggleOccupancy(num)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filters.maxOccupancy.includes(num)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div>
              <h4 className="font-bold mb-3 text-gray-900">{isHebrew ? "סוג חדר" : "Room Type"}</h4>
              <div className="space-y-2">
                {roomTypeOptions.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.roomTypes.includes(type.value)}
                      onChange={() => toggleRoomType(type.value)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-gray-700">{isHebrew ? type.labelHe : type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-bold mb-3 text-gray-900">{isHebrew ? "מתקנים" : "Amenities"}</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {amenityOptions.map((amenity) => (
                  <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={() => toggleAmenity(amenity.value)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-gray-700">{isHebrew ? amenity.labelHe : amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={filters.refundableOnly}
                onChange={(e) => handleFilterChange("refundableOnly", e.target.checked)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                {isHebrew ? "הצג רק תעריפים הניתנים לביטול" : "Show refundable rates only"}
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSort
