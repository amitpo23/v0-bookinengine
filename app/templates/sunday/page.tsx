"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, Star, Sparkles, Search, Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/booking/language-switcher"
import { LoginButton } from "@/components/auth/login-button"
import { SocialShare } from "@/components/ui/social-share"
import { HotelDetailsEnhanced } from "@/components/hotels/hotel-details-enhanced"
import type { HotelData } from "@/types/hotel-types"

// Demo hotels data
const demoHotels: HotelData[] = [
  {
    hotelId: 1,
    hotelName: "Grand Beach Resort",
    city: "Tel Aviv",
    stars: 5,
    address: "Tel Aviv Beach Front",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
    ],
    description: "מלון יוקרתי על חוף הים עם נוף מרהיב",
    facilities: ["Wifi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Beach Access"],
    rooms: []
  },
  {
    hotelId: 2,
    hotelName: "City Center Hotel",
    city: "Tel Aviv",
    stars: 4,
    address: "Rothschild Blvd",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    ],
    description: "מלון מודרני במרכז העיר",
    facilities: ["Wifi", "Gym", "Restaurant", "Business Center"],
    rooms: []
  },
  {
    hotelId: 3,
    hotelName: "Boutique Suites",
    city: "Tel Aviv",
    stars: 4,
    address: "Dizengoff Street",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    ],
    description: "סוויטות בוטיק מעוצבות",
    facilities: ["Wifi", "Kitchen", "Terrace", "City View"],
    rooms: []
  }
]

function SundayTemplateContent() {
  const { t, locale, dir } = useI18n()
  
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"))
  const [checkOut, setCheckOut] = useState(format(new Date(Date.now() + 86400000 * 2), "yyyy-MM-dd"))
  const [guests, setGuests] = useState(2)
  const [destination, setDestination] = useState("Tel Aviv")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSearching, setIsSearching] = useState(false)
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null)

  useEffect(() => {
    document.title = locale === 'he' ? 'Sunday - תצוגה מקצועית של מלונות' : 'Sunday - Professional Hotel Display'
  }, [locale])

  const handleSearch = async () => {
    setIsSearching(true)
    setSelectedHotel(null)
    
    // Simulate search
    setTimeout(() => {
      setHotels(demoHotels)
      setIsSearching(false)
    }, 1500)
  }

  const handleSelectHotel = (hotel: HotelData) => {
    setSelectedHotel(hotel)
    const detailsElement = document.getElementById('hotel-details')
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/templates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span className="text-sm">{locale === 'he' ? '← חזרה לטמפלטים' : '← Back to Templates'}</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {locale === 'he' ? 'Sunday פרימיום' : 'Sunday Premium'}
              </Badge>
              <LanguageSwitcher />
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
              <Star className="w-3 h-3 mr-1" />
              {locale === 'he' ? 'טכנולוגיית תצוגה מתקדמת' : 'Advanced Display Technology'}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sunday Hotel Experience
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {locale === 'he' 
                ? 'חווית חיפוש וצפייה מתקדמת עם רכיבי UI מקצועיים'
                : 'Advanced search and display experience with professional UI components'
              }
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {locale === 'he' ? '8 רכיבי UI מקצועיים' : '8 Professional UI Components'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {locale === 'he' ? 'העשרת מידע' : 'Information Enrichment'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                {locale === 'he' ? 'Cache חכם' : 'Smart Caching'}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Destination */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {locale === 'he' ? 'יעד' : 'Destination'}
                  </label>
                  <Input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={locale === 'he' ? 'איפה תרצה לשהות?' : 'Where would you like to stay?'}
                    className="h-12"
                  />
                </div>

                {/* Check-in */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {locale === 'he' ? 'צ\'ק-אין' : 'Check-in'}
                  </label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {locale === 'he' ? 'צ\'ק-אאוט' : 'Check-out'}
                  </label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className="h-12"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    {locale === 'he' ? 'אורחים' : 'Guests'}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="h-12"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full mt-6 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {locale === 'he' ? 'מחפש...' : 'Searching...'}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {locale === 'he' ? 'חפש מלונות' : 'Search Hotels'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {(hotels.length > 0 || isSearching) && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {locale === 'he' ? 'תוצאות חיפוש' : 'Search Results'}
                </h2>
                {hotels.length > 0 && (
                  <p className="text-gray-600">
                    {locale === 'he' 
                      ? `נמצאו ${hotels.length} מלונות ב${destination}`
                      : `Found ${hotels.length} hotels in ${destination}`
                    }
                  </p>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hotels Grid */}
            {isSearching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
                {hotels.map((hotel) => (
                  <Card 
                    key={hotel.hotelId}
                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => handleSelectHotel(hotel)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={hotel.imageUrl} 
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-gray-900">
                          {hotel.stars} <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold mb-2">{hotel.hotelName}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{hotel.address}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {hotel.facilities.slice(0, 3).map((facility) => (
                          <Badge key={facility} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {hotel.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hotel.facilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Selected Hotel Details */}
      {selectedHotel && (
        <section id="hotel-details" className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setSelectedHotel(null)}
                className="mb-4"
              >
                {locale === 'he' ? '← חזרה לתוצאות' : '← Back to results'}
              </Button>
              
              <HotelDetailsEnhanced
                hotel={selectedHotel}
                city={destination}
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'he' ? 'תכונות מתקדמות' : 'Advanced Features'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'he'
                ? 'טמפלט Sunday משתמש ברכיבי UI המתקדמים ביותר'
                : 'Sunday template uses the most advanced UI components'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {locale === 'he' ? '8 רכיבי UI' : '8 UI Components'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'he'
                  ? 'רכיבים מקצועיים לתצוגת מלונות'
                  : 'Professional hotel display components'
                }
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {locale === 'he' ? 'העשרת מידע' : 'Data Enrichment'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'he'
                  ? 'מידע מורחב מהאינטרנט'
                  : 'Extended information from the web'
                }
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {locale === 'he' ? 'ביצועים מהירים' : 'Fast Performance'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'he'
                  ? 'Cache חכם וטעינה מהירה'
                  : 'Smart caching and fast loading'
                }
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Sunday Template</h3>
          <p className="text-gray-400 mb-6">
            {locale === 'he'
              ? 'מופעל על ידי רכיבי Sunday המקצועיים'
              : 'Powered by Sunday professional components'
            }
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <SocialShare
              variant="icon"
              title="Sunday Hotel Experience"
            />
          </div>

          <div className="text-sm text-gray-500">
            © 2026 Sunday Template. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SundayTemplate() {
  return (
    <I18nProvider>
      <SundayTemplateContent />
    </I18nProvider>
  )
}
