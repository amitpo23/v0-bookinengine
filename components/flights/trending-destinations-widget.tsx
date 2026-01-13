"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TrendingDestination {
  destination: string;
  country: string;
  popularityScore: number;
  seasonality: 'high' | 'medium' | 'low';
  trending: boolean;
  topReasons: string[];
  bestMonths: string[];
}

export function TrendingDestinationsWidget() {
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch('/api/trends?action=top&limit=10');
        const result = await response.json();
        
        if (result.success) {
          setDestinations(result.data);
        } else {
          setError(result.error || 'Failed to fetch trends');
        }
      } catch (err) {
        setError('Failed to connect to trends service');
        console.error('Trends error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  function getSeasonalityColor(seasonality: string) {
    switch (seasonality) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending Destinations
          </CardTitle>
          <CardDescription>Loading popular travel destinations...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trending Destinations
        </CardTitle>
        <CardDescription>
          Popular travel destinations right now
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {destinations.map((dest, index) => (
          <Card key={dest.destination} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {dest.destination}
                          {dest.trending && (
                            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dest.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {dest.trending && (
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        🔥 Trending
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={getSeasonalityColor(dest.seasonality)}
                    >
                      {dest.seasonality} season
                    </Badge>
                  </div>

                  {dest.topReasons.length > 0 && (
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Popular for:</p>
                      <div className="flex flex-wrap gap-1">
                        {dest.topReasons.slice(0, 3).map((reason, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {dest.bestMonths.length > 0 && (
                    <div className="text-sm">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Best time: {dest.bestMonths.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Popularity Score */}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                  <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90 w-16 h-16">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - dest.popularityScore / 100)}`}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{dest.popularityScore}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">popularity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
