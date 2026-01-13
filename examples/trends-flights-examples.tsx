/**
 * Quick Examples - Google Trends & Flights API
 * Copy & paste these examples into your components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

// ============================================
// Example 1: Search Destination Trends
// ============================================

async function getDestinationPopularity() {
  const response = await fetch('/api/trends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'destination',
      destination: 'Barcelona',
      country: 'ES'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Popularity Score:', result.data.popularityScore); // 0-100
    console.log('Trending:', result.data.trending); // true/false
    console.log('Best Months:', result.data.bestMonths); // ["May", "June"]
    console.log('Top Reasons:', result.data.topReasons); // ["Beach", "Culture"]
  }
}

// ============================================
// Example 2: Get Top Trending Destinations
// ============================================

async function getTopDestinations() {
  const response = await fetch('/api/trends?action=top&limit=10');
  const result = await response.json();
  
  if (result.success) {
    result.data.forEach((dest: any) => {
      console.log(`${dest.destination}: ${dest.popularityScore}/100`);
    });
  }
}

// ============================================
// Example 3: Search Flights (One Way)
// ============================================

async function searchOneWayFlights() {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'search',
      origin: 'TLV',          // Tel Aviv
      destination: 'JFK',      // New York
      departureDate: '2026-03-15',
      adults: 1,
      travelClass: 'ECONOMY'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    result.data.forEach((flight: any) => {
      console.log(`Price: $${flight.price.total}`);
      console.log(`Airline: ${flight.validatingAirlineCodes[0]}`);
      console.log(`Duration: ${flight.itineraries[0].duration}`);
    });
  }
}

// ============================================
// Example 4: Search Flights (Round Trip)
// ============================================

async function searchRoundTripFlights() {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'search',
      origin: 'TLV',
      destination: 'LHR',      // London
      departureDate: '2026-05-01',
      returnDate: '2026-05-08',
      adults: 2,
      children: 1,
      travelClass: 'BUSINESS',
      nonStop: true,           // Only direct flights
      maxResults: 5
    })
  });
  
  const result = await response.json();
  console.log(`Found ${result.count} flights`);
}

// ============================================
// Example 5: Get Cheapest Flights
// ============================================

async function findCheapestFlights() {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'cheapest',
      origin: 'TLV'
      // No destination = all destinations
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    result.data.forEach((deal: any) => {
      console.log(`${deal.destination}: $${deal.price} on ${deal.departureDate}`);
    });
  }
}

// ============================================
// Example 6: Get Flight Price Calendar
// ============================================

async function getMonthlyPrices() {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'calendar',
      origin: 'TLV',
      destination: 'CDG',      // Paris
      departureMonth: '2026-06'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    Object.entries(result.data).forEach(([date, info]: [string, any]) => {
      console.log(`${date}: $${info.price}`);
    });
  }
}

// ============================================
// Example 7: React Component - Flight Search
// ============================================

function QuickFlightSearch() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          origin: formData.get('origin'),
          destination: formData.get('destination'),
          departureDate: formData.get('departureDate'),
          returnDate: formData.get('returnDate') || undefined,
          adults: parseInt(formData.get('adults') as string) || 1
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFlights(result.data);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to search flights');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input 
            name="origin" 
            placeholder="From (e.g., TLV)" 
            required 
            maxLength={3}
          />
          <Input 
            name="destination" 
            placeholder="To (e.g., JFK)" 
            required 
            maxLength={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Input 
            name="departureDate" 
            type="date" 
            required 
            min={new Date().toISOString().split('T')[0]}
          />
          <Input 
            name="returnDate" 
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <Input 
          name="adults" 
          type="number" 
          placeholder="Adults"
          defaultValue="1" 
          min="1" 
          max="9"
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </form>

      <div className="space-y-3">
        {flights.map((flight) => (
          <Card key={flight.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">${flight.price.total}</p>
                <p className="text-sm text-muted-foreground">
                  {flight.validatingAirlineCodes.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {flight.itineraries[0].duration.replace('PT', '').replace('H', 'h ').replace('M', 'm')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {flight.itineraries[0].segments.length === 1 ? 'Direct' : 
                   `${flight.itineraries[0].segments.length} stops`}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 8: React Component - Trending Destinations
// ============================================

function TrendingDestinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch('/api/trends?action=top&limit=5');
        const result = await response.json();
        
        if (result.success) {
          setDestinations(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) {
    return <div>Loading trending destinations...</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Trending Destinations
      </h3>
      
      {destinations.map((dest) => (
        <Card key={dest.destination} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{dest.destination}</h4>
              <p className="text-sm text-muted-foreground">{dest.country}</p>
              <div className="flex gap-2 mt-2">
                {dest.trending && (
                  <Badge variant="default" className="bg-green-500">
                    🔥 Trending
                  </Badge>
                )}
                <Badge variant="outline">
                  {dest.seasonality} season
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{dest.popularityScore}</div>
              <div className="text-xs text-muted-foreground">popularity</div>
            </div>
          </div>
          
          <div className="mt-3 text-sm">
            <p className="text-muted-foreground">Best months:</p>
            <p className="font-medium">{dest.bestMonths.join(', ')}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// Example 9: Combine Trends + Flights
// ============================================

async function getTrendingDealsWithFlights() {
  // Get trending destinations
  const trendsRes = await fetch('/api/trends?action=top&limit=5');
  const trends = await trendsRes.json();
  
  // Get cheapest flights from TLV
  const flightsRes = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'cheapest',
      origin: 'TLV'
    })
  });
  const flights = await flightsRes.json();
  
  // Match trending destinations with cheap flights
  const deals = trends.data.map((dest: any) => {
    const flight = flights.data.find((f: any) => 
      f.destination.toLowerCase().includes(dest.destination.toLowerCase())
    );
    
    return {
      destination: dest.destination,
      popularity: dest.popularityScore,
      trending: dest.trending,
      flightPrice: flight?.price || 'N/A',
      departureDate: flight?.departureDate
    };
  });
  
  console.log('Hot Deals:', deals);
  return deals;
}

// ============================================
// Example 10: Server Component with Direct Import
// ============================================

// app/destinations/page.tsx
import { getDestinationTrends } from '@/lib/services/google-trends-service';
import { searchFlights } from '@/lib/services/flight-service';

export default async function DestinationPage({
  params
}: {
  params: { city: string }
}) {
  // Server-side data fetching
  const trends = await getDestinationTrends(params.city, 'US');
  
  const flights = await searchFlights({
    origin: 'TLV',
    destination: 'JFK', // This would come from city mapping
    departureDate: '2026-06-01',
    adults: 1
  });
  
  return (
    <div>
      <h1>{params.city}</h1>
      <p>Popularity: {trends?.popularityScore}/100</p>
      <p>Starting from: ${flights[0]?.price.total}</p>
    </div>
  );
}

// ============================================
// IATA Code Helper
// ============================================

const popularAirports = {
  // Israel
  'Tel Aviv': 'TLV',
  'Eilat': 'ETM',
  
  // USA
  'New York': 'JFK',
  'Los Angeles': 'LAX',
  'Miami': 'MIA',
  'Chicago': 'ORD',
  
  // Europe
  'London': 'LHR',
  'Paris': 'CDG',
  'Barcelona': 'BCN',
  'Rome': 'FCO',
  'Amsterdam': 'AMS',
  
  // Asia
  'Dubai': 'DXB',
  'Istanbul': 'IST',
  'Bangkok': 'BKK',
  'Tokyo': 'NRT'
};

function getIATACode(city: string): string {
  return popularAirports[city as keyof typeof popularAirports] || '';
}

// Usage:
const code = getIATACode('Paris'); // "CDG"
