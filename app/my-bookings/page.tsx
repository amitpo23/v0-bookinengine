"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookingHistoryTable } from "@/components/booking/booking-history-table"

export default function MyBookingsPage() {
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSearchEmail(email.trim())
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View your booking history and manage your reservations
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Bookings</CardTitle>
            <CardDescription>
              Enter the email address you used when making your booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {searchEmail && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Bookings for {searchEmail}
            </h2>
            <BookingHistoryTable email={searchEmail} />
          </div>
        )}
      </div>
    </div>
  )
}
