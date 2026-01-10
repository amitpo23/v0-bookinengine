"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, Star, Sparkles, Search, Filter, Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useBookingEngine } from "@/hooks/use-booking-engine"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/booking/language-switcher"
import { LoginButton } from "@/components/auth/login-button"
import { SocialShare } from "@/components/ui/social-share"

// Import Sunday components
import { HotelResults } from "@/components/hotels/hotel-results"
import { HotelCard } from "@/components/hotels/hotel-card"
import { HotelDetailsEnhanced } from "@/components/hotels/hotel-details-enhanced"
import type { HotelData } from "@/types/hotel-types"

function SundayTemplateContent() {
  const { t, locale, dir } = useI18n()
  const booking = useBookingEngine()
  
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"))
  const [checkOut, setCheckOut] = useState(format(new Date(Date.now() + 86400000 * 2), "yyyy-MM-dd"))
  const [guests, setGuests] = useState(2)
  const [destination, setDestination] = useState("Tel Aviv")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null)

  useEffect(() => {
    document.title = locale === 'he' ? 'Sunday - תצוגה מקצועית של מלונות' : 'Sunday - Professional Hotel Display'
    
    const description = locale === 'he' 
      ? 'חווית חיפוש וצפייה מתקדמת של מלונות עם רכיבי UI מקצועיים'
      : 'Advanced hotel search and display experience with professional UI components'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  }, [locale])

  const handleSearch = async () => {
    setIsSearching(true)
    setSelectedHotel(null)
    
    try {
      await booking.searchHotels({
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults: guests,
        children: [],
        hotelName: destination
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectHotel = (hotel: HotelData) => {
    setSelectedHotel(hotel)
    // Scroll to details
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
              <span className="text-sm">{t('backToTemplates')}</span>
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
              {locale === 'he' ? 'Sunday Hotel Experience' : 'Sunday Hotel Experience'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {locale === 'he' 
                ? 'חווית חיפוש וצפייה מתקדמת עם רכיבי UI מקצועיים, העשרת מידע מהרשת, וגלריות תמונות אינטראקטיביות'
                : 'Advanced search and display experience with professional UI components, web-enriched information, and interactive image galleries'
              }
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {locale === 'he' ? '8 רכיבי UI מקצועיים' : '8 Professional UI Components'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {locale === 'he' ? 'אינטגרציית Tavily' : 'Tavily Integration'}
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
                    {t('destination')}
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
                    {t('checkIn')}
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
                    {t('checkOut')}
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
                    {t('guests')}
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
                    {t('searchHotels')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {(booking.hotels.length > 0 || isSearching) && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {locale === 'he' ? 'תוצאות חיפוש' : 'Search Results'}
                </h2>
                {booking.hotels.length > 0 && (
                  <p className="text-gray-600">
                    {locale === 'he' 
                      ? `נמצאו ${booking.hotels.length} מלונות ב${destination}`
                      : `Found ${booking.hotels.length} hotels in ${destination}`
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

            {/* Hotel Results - Using Sunday Component */}
            <HotelResults
              hotels={booking.hotels}
              searchQuery={{
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                adults: guests,
                destination
              }}
              onSelectHotel={handleSelectHotel}
              isLoading={isSearching}
              viewMode={viewMode}
            />
          </div>
        </section>
      )}

      {/* Selected Hotel Details */}
      {selectedHotel && (
        <section id="hotel-details" className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedHotel(null)}
                  className="mb-4"
                >
                  {locale === 'he' ? '← חזרה לתוצאות' : '← Back to results'}
                </Button>
              </div>

              {/* Enhanced Hotel Details - Using Sunday Component with Tavily */}
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
                ? 'טמפלט Sunday משתמש ברכיבי UI המתקדמים ביותר עם אינטגרציה מלאה לשירותי העשרת מידע'
                : 'Sunday template uses the most advanced UI components with full integration to information enrichment services'
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
                  ? 'רכיבים מקצועיים לתצוגת מלונות, גלריות, דירוגים ועוד'
                  : 'Professional components for hotel display, galleries, ratings and more'
                }
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {locale === 'he' ? 'אינטגרציית Tavily' : 'Tavily Integration'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'he'
                  ? 'העשרת מידע מהרשת - ביקורות, דירוגים, תמונות נוספות'
                  : 'Web-enriched information - reviews, ratings, additional images'
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
                  ? 'Cache חכם (30 דקות) וטעינה מהירה של כל הרכיבים'
                  : 'Smart caching (30 minutes) and fast loading of all components'
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
              ? 'מופעל על ידי רכיבי Sunday המקצועיים ואינטגרציית Tavily'
              : 'Powered by Sunday professional components and Tavily integration'
            }
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <SocialShare
              variant="icon"
              shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
              title={locale === 'he' ? 'Sunday Hotel Experience' : 'Sunday Hotel Experience'}
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
