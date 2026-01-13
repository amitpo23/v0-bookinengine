"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { he } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DateRange {
  from: Date
  to?: Date
}

interface AdvancedDatePickerProps {
  onDateChange: (range: DateRange) => void
  className?: string
}

export function AdvancedDatePicker({ onDateChange, className }: AdvancedDatePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (range: any) => {
    if (range) {
      setDateRange(range)
      
      // אם נבחרו שני תאריכים, סגור את הפופאפ
      if (range.from && range.to) {
        onDateChange(range)
        setIsOpen(false)
      }
    }
  }

  const nights = dateRange.from && dateRange.to 
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="grid grid-cols-2 gap-2">
            {/* תאריך הגעה */}
            <Button
              variant="outline"
              className={cn(
                "justify-start text-right font-normal h-16 border-2",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-start w-full">
                <span className="text-xs text-muted-foreground mb-1">תאריך הגעה</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.from ? (
                    <span className="font-semibold">
                      {format(dateRange.from, "EEE d MMM", { locale: he })}
                    </span>
                  ) : (
                    <span>בחר תאריך</span>
                  )}
                </div>
              </div>
            </Button>

            {/* תאריך עזיבה */}
            <Button
              variant="outline"
              className={cn(
                "justify-start text-right font-normal h-16 border-2",
                !dateRange.to && "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-start w-full">
                <span className="text-xs text-muted-foreground mb-1">תאריך עזיבה</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.to ? (
                    <span className="font-semibold">
                      {format(dateRange.to, "EEE d MMM", { locale: he })}
                    </span>
                  ) : (
                    <span>בחר תאריך</span>
                  )}
                </div>
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={he}
            disabled={(date) => date < new Date()}
          />
          {nights > 0 && (
            <div className="p-3 border-t text-center text-sm">
              <span className="font-semibold">{nights} לילות</span>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* תצוגת מספר לילות */}
      {nights > 0 && (
        <div className="text-sm text-center text-muted-foreground">
          {nights} {nights === 1 ? "לילה" : "לילות"}
        </div>
      )}
    </div>
  )
}
