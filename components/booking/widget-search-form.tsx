"use client"

import { useState } from "react"
import { formatDateForApi } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useBooking } from "@/lib/booking-context"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { DatePickerInput } from "./date-picker-input"
import type { HotelConfig } from "@/types/saas"

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

interface WidgetSearchFormProps {
  hotelConfig: HotelConfig
  onSearch?: () => void
}

export function WidgetSearchForm({ hotelConfig, onSearch }: WidgetSearchFormProps) {
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

  const handleSearch = async () => {
    if (!search.checkIn || !search.checkOut) {
      setSearchError(
        locale === "he" ? "יש לבחור תאריכי צ'ק-אין וצ'ק-אאוט" : "Please select check-in and check-out dates",
      )
      return
    }

    // Use hotel config instead of user input
    const hotelName = hotelConfig.apiSettings.mediciHotelName
    if (!hotelName) {
      setSearchError(locale === "he" ? "המלון לא מוגדר במערכת" : "Hotel not configured")
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const dateFrom = formatDateForApi(search.checkIn)
      const dateTo = formatDateForApi(search.checkOut)

      const params = {
        hotelName, // Use configured hotel name
        dateFrom,
        dateTo,
        adults: search.adults,
        children: search.childrenAges || [],
        limit: 20,
      }

      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Search failed")
      }

      const results = data.data || data.results || []
      setSearchResults(results)

      if (results.length === 0) {
        setSearchError(locale === "he" ? "לא נמצאו חדרים זמינים בתאריכים אלו" : "No rooms available for these dates")
      } else {
        setCurrentStep(2)
        onSearch?.()
      }
    } catch (error: any) {
      setSearchError(error.message || "Failed to search")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-lg" dir={dir}>
      {/* Hotel Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-foreground">{hotelConfig.name}</h2>
        <p className="text-sm text-muted-foreground">{hotelConfig.city}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Button className="w-full" onClick={() => setGuestsOpen(false)}>
                {t("confirm")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Button */}
      <Button
        className="w-full h-14 text-base font-semibold mt-4"
        onClick={handleSearch}
        disabled={isSearching}
        style={{ backgroundColor: hotelConfig.widgetSettings.primaryColor }}
      >
        {isSearching ? (
          <>
            <LoaderIcon />
            <span className="ml-2">{locale === "he" ? "מחפש..." : "Searching..."}</span>
          </>
        ) : (
          t("searchAvailability")
        )}
      </Button>

      {searchError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {searchError}
        </div>
      )}
    </div>
  )
}
