"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuestSelection {
  adults: number
  children: number[]
}

interface GuestSelectorProps {
  onGuestsChange: (guests: GuestSelection) => void
  maxGuests?: number
  className?: string
}

export function GuestSelector({ onGuestsChange, maxGuests = 10, className }: GuestSelectorProps) {
  const [guests, setGuests] = useState<GuestSelection>({
    adults: 2,
    children: []
  })
  const [isOpen, setIsOpen] = useState(false)

  const updateAdults = (change: number) => {
    const newAdults = Math.max(1, Math.min(maxGuests, guests.adults + change))
    const newGuests = { ...guests, adults: newAdults }
    setGuests(newGuests)
    onGuestsChange(newGuests)
  }

  const addChild = () => {
    if (guests.adults + guests.children.length < maxGuests) {
      const newGuests = { ...guests, children: [...guests.children, 5] }
      setGuests(newGuests)
      onGuestsChange(newGuests)
    }
  }

  const removeChild = (index: number) => {
    const newChildren = guests.children.filter((_, i) => i !== index)
    const newGuests = { ...guests, children: newChildren }
    setGuests(newGuests)
    onGuestsChange(newGuests)
  }

  const updateChildAge = (index: number, age: number) => {
    const newChildren = [...guests.children]
    newChildren[index] = age
    const newGuests = { ...guests, children: newChildren }
    setGuests(newGuests)
    onGuestsChange(newGuests)
  }

  const totalGuests = guests.adults + guests.children.length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-right font-normal h-16 border-2 w-full",
            className
          )}
        >
          <div className="flex flex-col items-start w-full">
            <span className="text-xs text-muted-foreground mb-1">אורחים</span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {guests.adults} {guests.adults === 1 ? "מבוגר" : "מבוגרים"}
                {guests.children.length > 0 && 
                  `, ${guests.children.length} ${guests.children.length === 1 ? "ילד" : "ילדים"}`
                }
              </span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* מבוגרים */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">מבוגרים</div>
              <div className="text-xs text-muted-foreground">גיל 18+</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateAdults(-1)}
                disabled={guests.adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{guests.adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateAdults(1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ילדים */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">ילדים</div>
                <div className="text-xs text-muted-foreground">גיל 0-17</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addChild}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-4 w-4 ml-1" />
                הוסף ילד
              </Button>
            </div>

            {guests.children.map((age, index) => (
              <div key={index} className="flex items-center gap-3 pr-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">גיל ילד {index + 1}</label>
                  <select
                    value={age}
                    onChange={(e) => updateChildAge(index, Number(e.target.value))}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} {i === 0 ? "פחות משנה" : "שנים"}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeChild(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* סיכום */}
          <div className="border-t pt-3 text-sm text-muted-foreground">
            סה"כ {totalGuests} {totalGuests === 1 ? "אורח" : "אורחים"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
