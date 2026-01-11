"use client";

import { useState, type ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Hotel,
  MapPin,
  Star,
  Users,
  Calendar,
  Search,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Wind,
  Car,
  Shield,
  Clock,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SundayHotelTemplate() {
  return (
    <I18nProvider>
      <SundayHotelContent />
    </I18nProvider>
  );
}

function SundayHotelContent() {
  const { t } = useI18n();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const hotels = [
    {
      id: 1,
      name: "Grand Sunset Resort",
      location: "Miami Beach, Florida",
      rating: 4.8,
      reviews: 1250,
      price: 299,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      amenities: ["Wifi", "Pool", "Spa", "Gym", "Restaurant"],
    },
    {
      id: 2,
      name: "Mountain View Lodge",
      location: "Aspen, Colorado",
      rating: 4.6,
      reviews: 890,
      price: 349,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      amenities: ["Wifi", "Parking", "Breakfast", "Gym", "Ski Access"],
    },
    {
      id: 3,
      name: "Seaside Paradise Hotel",
      location: "Malibu, California",
      rating: 4.9,
      reviews: 1580,
      price: 449,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      amenities: ["Wifi", "Beach", "Pool", "Spa", "Bar"],
    },
  ];

  const amenitiesIcons: { [key: string]: ReactNode } = {
    Wifi: <Wifi className="w-4 h-4" />,
    Pool: <Wind className="w-4 h-4" />,
    Spa: <Heart className="w-4 h-4" />,
    Gym: <Dumbbell className="w-4 h-4" />,
    Restaurant: <Utensils className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    Breakfast: <Coffee className="w-4 h-4" />,
    "Ski Access": <Shield className="w-4 h-4" />,
    Beach: <Globe className="w-4 h-4" />,
    Bar: <Coffee className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Sunday Hotels
                </h1>
                <p className="text-xs text-slate-600">Find your perfect stay</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-600">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Discover Amazing Hotels
            </h2>
            <p className="text-xl text-slate-700">
              Book your dream vacation with exclusive deals and instant confirmation
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Check-in
                  </label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Check-out
                  </label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border-slate-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Guests
                  </label>
                  <Input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button className="w-full h-11 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">Featured Hotels</h3>
            <p className="text-slate-600 mt-1">Handpicked properties for your perfect stay</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">
              <Star className="w-3 h-3 mr-1" />
              Top Rated
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${hotel.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                  >
                    <Heart className="w-4 h-4 text-pink-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                  >
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    {hotel.rating}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-slate-700 border-0">
                    {hotel.reviews} reviews
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5">
                <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {hotel.name}
                </h4>
                <div className="flex items-center gap-1 text-slate-600 mb-4">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">{hotel.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="bg-gradient-to-r from-orange-50 to-pink-50 text-slate-700 border border-orange-200"
                    >
                      {amenitiesIcons[amenity]}
                      <span className="ml-1 text-xs">{amenity}</span>
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm text-slate-600">From</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      ${hotel.price}
                    </p>
                    <p className="text-xs text-slate-500">per night</p>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 border-0 overflow-hidden">
          <CardContent className="p-12">
            <div className="text-center text-white mb-12">
              <h3 className="text-4xl font-bold mb-4">Why Choose Sunday Hotels?</h3>
              <p className="text-xl opacity-90">
                Experience the best in hospitality with our premium service
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">Best Price Guarantee</h4>
                <p className="text-white/80 text-sm">
                  Find a lower price? We'll match it and give you 10% off
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">24/7 Support</h4>
                <p className="text-white/80 text-sm">
                  Our team is always here to help you anytime, anywhere
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">Verified Reviews</h4>
                <p className="text-white/80 text-sm">
                  Real reviews from real guests who stayed at these properties
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">Loyalty Rewards</h4>
                <p className="text-white/80 text-sm">
                  Earn points on every booking and unlock exclusive benefits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Sunday Hotels</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted partner for unforgettable hotel experiences around the world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Press</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Cancellation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1-800-SUNDAY</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@sunday.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>www.sunday-hotels.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2026 Sunday Hotels. All rights reserved. • Template Demo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
