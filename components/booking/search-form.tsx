"use client"

import { useState, useEffect } from "react"
import { formatDateForApi } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { DatePickerInput } from "./date-picker-input"

// Inline SVG icons
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
  </svg>
)

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

const LoaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export function SearchForm({ onSearch }: { onSearch?: () => void }) {
  const {
    search,
    setSearch,
    setCurrentStep,
    setSearchResults,
    setIsSearching,
    setSearchError,
    isSearching,
    searchError,
  } = useBooking()
  const { t, locale, dir } = useI18n()
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [searchType, setSearchType] = useState<"city" | "hotel">("city")
  const [searchQuery, setSearchQuery] = useState("")
    const [autocompleteResults, setAutocompleteResults] = useState<any[]>([])

      // Autocomplete logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setAutocompleteResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/cities/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setAutocompleteResults(data.results || [])
      } catch (error) {
        console.error('Autocomplete error:', error)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError(locale === "he" ? "יש להזין עיר או שם מלון" : "Please enter a city or hotel name")
      return
    }

    if (!search.checkIn || !search.checkOut) {
      setSearchError(
        locale === "he" ? "יש לבחור תאריכי צ'ק-אין וצ'ק-אאוט" : "Please select check-in and check-out dates",
      )
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const dateFrom = formatDateForApi(search.checkIn)
      const dateTo = formatDateForApi(search.checkOut)

      const params: Record<string, any> = {
        dateFrom,
        dateTo,
        adults: search.adults,
        children: search.childrenAges || [],
        limit: 20,
      }

      if (searchType === "city") {
        params.city = searchQuery
      } else {
        params.hotelName = searchQuery
      }

      console.log("[v0] ====== SEARCH DEBUG ======")
      console.log("[v0] Check-in Date object:", search.checkIn)
      console.log("[v0] Check-out Date object:", search.checkOut)
      console.log("[v0] Formatted dateFrom:", dateFrom)
      console.log("[v0] Formatted dateTo:", dateTo)
      console.log("[v0] Full search params:", JSON.stringify(params, null, 2))

      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      console.log("[v0] Response status:", response.status)
      const data = await response.json()
      console.log("[v0] Full response data:", JSON.stringify(data, null, 2))

      if (!response.ok) {
        throw new Error(data.error || "Search failed")
      }

      const results = data.data || data.results || []
      setSearchResults(results)

      if (results.length === 0) {
        setSearchError(locale === "he" ? "לא נמצאו תוצאות" : "No results found")
      } else {
        setSearch({
          ...search,
          city: searchType === "city" ? searchQuery : "",
          hotelName: searchType === "hotel" ? searchQuery : "",
        })
        setCurrentStep(2)
        onSearch?.()
      }
    } catch (error: any) {
      console.log("[v0] Search error:", error)
      setSearchError(error.message || "Failed to search")
    } finally {
      setIsSearching(false)
    }
  }

  const searchByText = locale === "he" ? "חיפוש לפי" : "Search by"
  const cityText = locale === "he" ? "עיר" : "City"
  const hotelText = locale === "he" ? "שם מלון" : "Hotel Name"
  const cityPlaceholder = locale === "he" ? "הזן שם עיר (למשל: Dubai, Paris)" : "Enter city name (e.g., Dubai, Paris)"
  const hotelPlaceholder =
    locale === "he" ? "הזן שם מלון (למשל: Dizengoff Inn)" : "Enter hotel name (e.g., Dizengoff Inn)"

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-lg" dir={dir}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">{searchByText}:</span>
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "city" | "hotel")}>
            <TabsList className="h-8">
              <TabsTrigger value="city" className="text-xs px-3 h-7 flex items-center gap-1">
                <MapPinIcon />
                {cityText}
              </TabsTrigger>
              <TabsTrigger value="hotel" className="text-xs px-3 h-7 flex items-center gap-1">
                <BuildingIcon />
                {hotelText}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative">
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
              dir === "rtl" ? "right-3" : "left-3",
            )}
          >
            <SearchIcon />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === "city" ? cityPlaceholder : hotelPlaceholder}
            className={cn("h-12", dir === "rtl" ? "pr-10" : "pl-10")}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

              {/* Autocomplete dropdown */}
              {autocompleteResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {autocompleteResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.type === 'city') {
                          setSearchQuery(item.nameEn)
                        } else {
                          setSearchQuery(item.name)
                          setSearchType('hotel')
                        }
                        setAutocompleteResults([])
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      {item.type === 'city' ? (
                        <span className="text-sm">
                          <span className="font-semibold">{item.name}</span>
                          {item.count && <span className="text-gray-500 mr-2">({item.count} מלונות)</span>}
                        </span>
                      ) : (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <DatePickerInput
          value={search.checkIn}
          onChange={(date) => setSearch({ ...search, checkIn: date })}
          minDate={new Date()}
          label={t("checkIn")}
          placeholder={t("selectDate")}
          dir={dir}
        />

        {/* Check-out Date */}
        <DatePickerInput
          value={search.checkOut}
          onChange={(date) => setSearch({ ...search, checkOut: date })}
          minDate={search.checkIn ? new Date(search.checkIn.getTime() + 86400000) : new Date()}
          label={t("checkOut")}
          placeholder={t("selectDate")}
          dir={dir}
        />

        {/* Guests */}
        <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start h-14 px-4 bg-transparent",
                dir === "rtl" ? "text-right" : "text-left",
              )}
            >
              <div className={cn("flex flex-col gap-0.5 flex-1", "items-start")}>
                <span className="text-xs text-muted-foreground">{t("guests")}</span>
                <span className="font-medium">
                  {search.adults} {t("adults")}
                  {search.children > 0 ? `, ${search.children} ${t("children")}` : ""}
                </span>
              </div>
              <UsersIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-4" dir={dir}>
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("adults")}</p>
                  <p className="text-sm text-muted-foreground">{t("adultsAge")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, adults: Math.max(1, search.adults - 1) })}
                    disabled={search.adults <= 1}
                  >
                    <MinusIcon />
                  </Button>
                  <span className="w-8 text-center font-medium">{search.adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, adults: Math.min(10, search.adults + 1) })}
                    disabled={search.adults >= 10}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("children")}</p>
                  <p className="text-sm text-muted-foreground">{t("childrenAges")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, children: Math.max(0, search.children - 1) })}
                    disabled={search.children <= 0}
                  >
                    <MinusIcon />
                  </Button>
                  <span className="w-8 text-center font-medium">{search.children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, children: Math.min(6, search.children + 1) })}
                    disabled={search.children >= 6}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("rooms")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, rooms: Math.max(1, search.rooms - 1) })}
                    disabled={search.rooms <= 1}
                  >
                    <MinusIcon />
                  </Button>
                  <span className="w-8 text-center font-medium">{search.rooms}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setSearch({ ...search, rooms: Math.min(5, search.rooms + 1) })}
                    disabled={search.rooms >= 5}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>

              <Button className="w-full" onClick={() => setGuestsOpen(false)}>
                {t("confirm")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button className="h-14 text-base font-semibold" onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <>
              <LoaderIcon />
              <span className="ml-2">{locale === "he" ? "מחפש..." : "Searching..."}</span>
            </>
          ) : (
            t("searchAvailability")
          )}
        </Button>
      </div>

      {searchError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {searchError}
        </div>
      )}
    </div>
  )
}
