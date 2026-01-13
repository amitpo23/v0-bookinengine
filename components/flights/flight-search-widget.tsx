"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, Calendar, Users, Loader2, TrendingUp, Clock, MapPin } from 'lucide-react';
import { showToast } from '@/components/templates/enhanced-ui';

interface FlightResult {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      carrierName?: string;
      numberOfStops: number;
    }>;
  }>;
  validatingAirlineCodes: string[];
}

export function FlightSearchWidget() {
  const [origin, setOrigin] = useState('TLV');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState('1');
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!destination || !departureDate) {
      showToast.error('Missing fields', 'Please fill origin, destination and departure date');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departureDate,
          returnDate: returnDate || undefined,
          adults: parseInt(adults),
          travelClass,
          maxResults: 10
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFlights(result.data);
        showToast.success('Success', `Found ${result.data.length} flights`);
      } else {
        showToast.error('Error', result.error || 'Failed to search flights');
      }
    } catch (error) {
      showToast.error('Error', 'Failed to connect to flight service');
      console.error('Flight search error:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(duration: string) {
    return duration
      .replace('PT', '')
      .replace('H', 'h ')
      .replace('M', 'm');
  }

  function formatDateTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flight Search
          </CardTitle>
          <CardDescription>
            Search for flights worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From (IATA Code)</Label>
                <Input
                  id="origin"
                  placeholder="TLV"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  maxLength={3}
                  required
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  e.g., TLV, JFK, LHR, CDG
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">To (IATA Code)</Label>
                <Input
                  id="destination"
                  placeholder="JFK"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  maxLength={3}
                  required
                  className="uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Departure Date
                </Label>
                <Input
                  id="departure"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={today}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return">Return Date (Optional)</Label>
                <Input
                  id="return"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || today}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Adults
                </Label>
                <Input
                  id="adults"
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  min="1"
                  max="9"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Travel Class</Label>
                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger id="class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECONOMY">Economy</SelectItem>
                    <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="FIRST">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Flights...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  Search Flights
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {flights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Found {flights.length} flights
          </h3>
          
          {flights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="text-xs">
                          {flight.validatingAirlineCodes[0]}
                        </Badge>
                        {flight.itineraries[0].segments[0].carrierName && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {flight.itineraries[0].segments[0].carrierName}
                          </span>
                        )}
                      </div>
                      <Badge variant={flight.itineraries[0].segments.length === 1 ? "default" : "outline"}>
                        {flight.itineraries[0].segments.length === 1 
                          ? 'Direct' 
                          : `${flight.itineraries[0].segments.length - 1} stop${flight.itineraries[0].segments.length > 2 ? 's' : ''}`}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-lg">
                          {flight.itineraries[0].segments[0].departure.iataCode}
                        </div>
                        <div className="text-muted-foreground">
                          {formatDateTime(flight.itineraries[0].segments[0].departure.at)}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                        <div className="text-xs text-muted-foreground">
                          {formatDuration(flight.itineraries[0].duration)}
                        </div>
                        <div className="w-full h-px bg-border mt-1" />
                      </div>

                      <div>
                        <div className="font-semibold text-lg">
                          {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                        </div>
                        <div className="text-muted-foreground">
                          {formatDateTime(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end justify-center border-l pl-6">
                    <div className="text-3xl font-bold text-primary">
                      ${flight.price.total}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per person
                    </div>
                    <Button className="mt-3" size="sm">
                      Select Flight
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && flights.length === 0 && departureDate && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No flights found. Try different dates or destinations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
