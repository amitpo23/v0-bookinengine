'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User, MapPin, Phone, Mail, Calendar, Hotel } from 'lucide-react'
import { Booking } from '@/lib/supabase'

export default function MyAccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchProfile()
      fetchBookings()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/user/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country'),
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const updated = await res.json()
        setProfile(updated)
        alert('פרופיל עודכן בהצלחה!')
      }
    } catch (error) {
      alert('שגיאה בעדכון פרופיל')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center">טוען...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">האזור האישי שלי</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              פרופיל אישי
            </CardTitle>
            <CardDescription>עדכן את הפרטים שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label>שם</Label>
                <Input value={session?.user?.name || ''} disabled />
              </div>
              <div>
                <Label>אימייל</Label>
                <Input value={session?.user?.email || ''} disabled />
              </div>
              <Separator />
              <div>
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone || ''}
                  placeholder="054-123-4567"
                />
              </div>
              <div>
                <Label htmlFor="address">כתובת</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={profile?.address || ''}
                  placeholder="רחוב 123"
                />
              </div>
              <div>
                <Label htmlFor="city">עיר</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={profile?.city || ''}
                  placeholder="תל אביב"
                />
              </div>
              <div>
                <Label htmlFor="country">מדינה</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={profile?.country || ''}
                  placeholder="ישראל"
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? 'שומר...' : 'שמור שינויים'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bookings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              ההזמנות שלי
            </CardTitle>
            <CardDescription>היסטוריית ההזמנות</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">אין הזמנות עדיין</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{booking.hotel_name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.check_in).toLocaleDateString('he-IL')} -{' '}
                      {new Date(booking.check_out).toLocaleDateString('he-IL')}
                    </div>
                    <div className="text-sm">
                      <strong>מספר הזמנה:</strong> {booking.booking_reference}
                    </div>
                    <div className="text-sm">
                      <strong>מחיר:</strong> ₪{booking.total_price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
