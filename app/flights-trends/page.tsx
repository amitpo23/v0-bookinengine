"use client";

import { I18nProvider } from "@/lib/i18n/context";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { TrendingDestinationsWidget } from "@/components/flights/trending-destinations-widget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, TrendingUp, Info } from "lucide-react";

export default function FlightsAndTrendsPage() {
  return (
    <I18nProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Plane className="w-8 h-8 text-primary" />
            Flights & Travel Trends
          </h1>
          <p className="text-muted-foreground text-lg">
            Search flights and discover trending destinations worldwide
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  API Integration Status
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {process.env.SERPAPI_KEY || process.env.AMADEUS_CLIENT_ID 
                    ? '✅ Live data from external APIs' 
                    : '⚠️ Using simulated data - Add SERPAPI_KEY or AMADEUS credentials to .env.local for live data'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Flight Search
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <FlightSearchWidget />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <TrendingDestinationsWidget />
              
              {/* Additional Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About Travel Trends</CardTitle>
                  <CardDescription>
                    Data-driven insights for your next trip
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Popularity Score</h4>
                    <p className="text-muted-foreground">
                      Based on global search interest, social media mentions, and booking patterns.
                      Higher scores indicate more popular destinations.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Seasonality</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li><span className="font-medium text-red-600">High:</span> Peak season - expect higher prices</li>
                      <li><span className="font-medium text-yellow-600">Medium:</span> Shoulder season - good balance</li>
                      <li><span className="font-medium text-green-600">Low:</span> Off-season - best deals</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">🔥 Trending Status</h4>
                    <p className="text-muted-foreground">
                      Destinations marked as trending are experiencing rapid growth in interest
                      and bookings. Book early for the best prices!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Common Airport Codes (IATA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Israel</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>TLV - Tel Aviv</li>
                  <li>ETM - Eilat (Ramon)</li>
                  <li>HFA - Haifa</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">USA</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>JFK - New York</li>
                  <li>LAX - Los Angeles</li>
                  <li>MIA - Miami</li>
                  <li>SFO - San Francisco</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Europe</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>LHR - London</li>
                  <li>CDG - Paris</li>
                  <li>BCN - Barcelona</li>
                  <li>FCO - Rome</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Middle East</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>DXB - Dubai</li>
                  <li>DOH - Doha</li>
                  <li>IST - Istanbul</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </I18nProvider>
  );
}
