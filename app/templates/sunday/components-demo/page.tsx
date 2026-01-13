"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HotelCard,
  HotelResults,
  HotelRating,
  HotelAmenities,
  HotelInfo,
  HotelImageGallery,
  HotelDetailsEnhanced
} from "@/components/hotels"
import type { HotelData } from "@/types/hotel-types"

// Demo hotel data
const demoHotel: HotelData = {
  hotelId: 1,
  hotelName: "Luxury Beach Resort",
  city: "Tel Aviv",
  stars: 5,
  address: "123 Beach Front, Tel Aviv, Israel",
  imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  ],
  description: "מלון יוקרתי על חוף הים עם נוף מרהיב לים התיכון. חדרים מרווחים עם מרפסות פרטיות.",
  facilities: ["Wifi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Beach Access", "Parking", "Room Service", "Conference Rooms"],
  rooms: []
}

const demoHotels: HotelData[] = [
  demoHotel,
  {
    hotelId: 2,
    hotelName: "City Center Boutique",
    city: "Tel Aviv",
    stars: 4,
    address: "Rothschild Blvd, Tel Aviv",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    ],
    description: "מלון בוטיק מודרני במרכז העיר",
    facilities: ["Wifi", "Gym", "Restaurant", "Business Center"],
    rooms: []
  },
  {
    hotelId: 3,
    hotelName: "Garden Suites",
    city: "Tel Aviv",
    stars: 4,
    address: "Park Street, Tel Aviv",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    description: "סוויטות מעוצבות עם גינה",
    facilities: ["Wifi", "Kitchen", "Garden", "Terrace"],
    rooms: []
  }
]

export default function ComponentsDemo() {
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/templates/sunday" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span>חזרה ל-Sunday</span>
            </Link>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              דוגמאות רכיבים
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sunday Components Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            דוגמאות מקיפות לכל 8 רכיבי Sunday UI
          </p>
        </div>

        <Tabs defaultValue="hotel-card" className="w-full" dir="rtl">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full mb-8">
            <TabsTrigger value="hotel-card">HotelCard</TabsTrigger>
            <TabsTrigger value="hotel-results">HotelResults</TabsTrigger>
            <TabsTrigger value="hotel-rating">HotelRating</TabsTrigger>
            <TabsTrigger value="hotel-amenities">HotelAmenities</TabsTrigger>
            <TabsTrigger value="hotel-info">HotelInfo</TabsTrigger>
            <TabsTrigger value="hotel-gallery">ImageGallery</TabsTrigger>
            <TabsTrigger value="hotel-details">DetailsEnhanced</TabsTrigger>
            <TabsTrigger value="all">הכל ביחד</TabsTrigger>
          </TabsList>

          {/* HotelCard Demo */}
          <TabsContent value="hotel-card" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelCard - כרטיס מלון מקצועי</CardTitle>
                <p className="text-sm text-gray-600">
                  רכיב לתצוגת מלון בודד עם תמונות, מחירים, דירוג ושירותים
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-w-4xl mx-auto">
                  <HotelCard
                    hotel={demoHotel}
                    nights={3}
                    onSelect={(hotel) => alert(`נבחר: ${hotel.hotelName}`)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelResults Demo */}
          <TabsContent value="hotel-results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelResults - תצוגת תוצאות חיפוש</CardTitle>
                <p className="text-sm text-gray-600">
                  רכיב לתצוגת רשימת מלונות עם אנימציות טעינה ותמיכה ב-grid/list
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">תצוגת List (ברירת מחדל)</h3>
                    <HotelResults
                      hotels={demoHotels}
                      onSelectHotel={setSelectedHotel}
                      isLoading={false}
                      viewMode="list"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">תצוגת Grid</h3>
                    <HotelResults
                      hotels={demoHotels}
                      onSelectHotel={setSelectedHotel}
                      isLoading={false}
                      viewMode="grid"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelRating Demo */}
          <TabsContent value="hotel-rating" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelRating - דירוג כוכבים</CardTitle>
                <p className="text-sm text-gray-600">
                  רכיב גמיש להצגת דירוג כוכבים עם סגנונות שונים
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-32">5 כוכבים:</span>
                    <HotelRating rating={5} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-32">4 כוכבים:</span>
                    <HotelRating rating={4} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-32">3 כוכבים:</span>
                    <HotelRating rating={3} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-32">גדול:</span>
                    <HotelRating rating={5} size="lg" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-32">קטן:</span>
                    <HotelRating rating={4} size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelAmenities Demo */}
          <TabsContent value="hotel-amenities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelAmenities - שירותי מלון</CardTitle>
                <p className="text-sm text-gray-600">
                  תצוגת שירותים עם אייקונים מותאמים אוטומטית
                </p>
              </CardHeader>
              <CardContent>
                <HotelAmenities amenities={demoHotel.facilities} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelInfo Demo */}
          <TabsContent value="hotel-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelInfo - מידע מפורט על מלון</CardTitle>
                <p className="text-sm text-gray-600">
                  תצוגה מאורגנת של כל פרטי המלון
                </p>
              </CardHeader>
              <CardContent>
                <HotelInfo hotel={demoHotel} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelImageGallery Demo */}
          <TabsContent value="hotel-gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelImageGallery - גלריית תמונות</CardTitle>
                <p className="text-sm text-gray-600">
                  גלריה רספונסיבית עם מודל תמונות מלא מסך
                </p>
              </CardHeader>
              <CardContent>
                <HotelImageGallery
                  hotel={demoHotel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* HotelDetailsEnhanced Demo */}
          <TabsContent value="hotel-details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HotelDetailsEnhanced - פרטים מורחבים עם Tavily</CardTitle>
                <p className="text-sm text-gray-600">
                  רכיב מתקדם המשלב את כל הרכיבים האחרים + העשרת מידע מהאינטרנט
                </p>
              </CardHeader>
              <CardContent>
                <HotelDetailsEnhanced
                  hotel={demoHotel}
                  city="Tel Aviv"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Together Demo */}
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>כל הרכיבים ביחד</CardTitle>
                <p className="text-sm text-gray-600">
                  דוגמה לשילוב של כל רכיבי Sunday במסך אחד
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Rating */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">דירוג המלון</h3>
                  <HotelRating rating={demoHotel.stars} size="lg" showNumber />
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">תמונות</h3>
                  <HotelImageGallery
                    hotel={demoHotel}
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">פרטי המלון</h3>
                  <HotelInfo hotel={demoHotel} />
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">שירותים</h3>
                  <HotelAmenities amenities={demoHotel.facilities} />
                </div>

                {/* Card in Grid */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">תצוגת כרטיסים</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {demoHotels.slice(0, 2).map((hotel) => (
                      <HotelCard
                        key={hotel.hotelId}
                        hotel={hotel}
                        nights={2}
                        onSelect={setSelectedHotel}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Hotel Display */}
        {selectedHotel && (
          <Card className="mt-8 border-2 border-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>מלון שנבחר</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedHotel(null)}>
                  סגור
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-2">{selectedHotel.hotelName}</h3>
                <p className="text-gray-600">{selectedHotel.address}</p>
                <div className="mt-4">
                  <HotelRating rating={selectedHotel.stars} size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
