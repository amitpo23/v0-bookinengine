"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdvancedDatePicker } from "./advanced-date-picker"
import { GuestSelector } from "./guest-selector"
import { Search } from "lucide-react"

interface SearchFormProps {
  onSearch: (params: SearchParams) => void
  className?: string
}

export interface SearchParams {
  dates: {
    from: Date
    to?: Date
  }
  guests: {
    adults: number
    children: number[]
  }
}

export function EnhancedSearchForm({ onSearch, className }: SearchFormProps) {
  const [dates, setDates] = useState<SearchParams["dates"]>({
    from: new Date(),
    to: undefined
  })
  
  const [guests, setGuests] = useState<SearchParams["guests"]>({
    adults: 2,
    children: []
  })

  const handleSearch = () => {
    if (dates.from && dates.to) {
      onSearch({ dates, guests })
    }
  }

  const isValid = dates.from && dates.to

  return (
    <Card className={className}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">בחרו את תאריך החדר המתאים לכם ביותר</h2>
        
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
          {/* בחירת תאריכים */}
          <AdvancedDatePicker 
            onDateChange={setDates}
            className="md:col-span-1"
          />

          {/* בחירת אורחים */}
          <GuestSelector 
            onGuestsChange={setGuests}
            className="md:col-span-1"
          />

          {/* כפתור חיפוש */}
          <Button
            onClick={handleSearch}
            disabled={!isValid}
            className="h-16 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
          >
            <Search className="h-5 w-5 ml-2" />
            בדיקת זמינות
          </Button>
        </div>

        {/* הסבר קצר */}
        <p className="text-sm text-muted-foreground mt-4 text-center">
          מחפשים את המחירים הטובים ביותר עבורכם...
        </p>
      </div>
    </Card>
  )
}
