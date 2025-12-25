'use client';

import React from 'react';
import { useFeature, useFeatures } from '@/lib/features-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Star,
  Bell,
  TrendingDown,
  Gift,
  Mail,
  MessageSquare,
  Info,
} from 'lucide-react';

interface FeatureWrapperProps {
  featureId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  templateId?: string;
}

/**
 * קומפוננטה שעוטפת תכונה ומציגה אותה רק אם היא מופעלת
 */
export function FeatureWrapper({
  featureId,
  children,
  fallback = null,
  templateId,
}: FeatureWrapperProps) {
  const enabled = useFeature(featureId as any, 'template', templateId);

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * דוגמאות לשימוש בתכונות בטמפלטים
 */

// דוגמה 1: מפה של Google (רק אם מופעל)
export function HotelMapFeature({ hotelId, templateId }: { hotelId: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="google-maps" templateId={templateId}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Hotel Location
          </CardTitle>
          <CardDescription>מיקום המלון במפה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
            {/* TODO: הוסף Google Maps */}
            <p className="text-muted-foreground">Google Maps Integration</p>
          </div>
        </CardContent>
      </Card>
    </FeatureWrapper>
  );
}

// דוגמה 2: ביקורות (רק אם מופעל)
export function ReviewsFeature({ hotelId, templateId }: { hotelId: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="reviews-system" templateId={templateId}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Guest Reviews
          </CardTitle>
          <CardDescription>ביקורות אורחים</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">4.8 / 5.0</span>
              <Badge variant="secondary">125 reviews</Badge>
            </div>
            {/* TODO: הוסף רשימת ביקורות */}
          </div>
        </CardContent>
      </Card>
    </FeatureWrapper>
  );
}

// דוגמה 3: התראות מחיר (רק אם מופעל)
export function PriceAlertFeature({ hotelId, templateId }: { hotelId: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="price-alerts" templateId={templateId}>
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>רוצה לקבל התראה כשהמחיר יורד?</span>
            <Button size="sm" variant="outline">
              הפעל התראות
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </FeatureWrapper>
  );
}

// דוגמה 4: היסטוריית מחירים (Premium)
export function PriceHistoryFeature({ hotelId, templateId }: { hotelId: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="price-history" templateId={templateId}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Price History
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
          <CardDescription>מגמת מחירים ב-30 הימים האחרונים</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            {/* TODO: הוסף גרף מחירים */}
            <p className="text-muted-foreground">Price Chart</p>
          </div>
        </CardContent>
      </Card>
    </FeatureWrapper>
  );
}

// דוגמה 5: תוכנית נאמנות
export function LoyaltyProgramFeature({ templateId }: { templateId: string }) {
  return (
    <FeatureWrapper featureId="loyalty-program" templateId={templateId}>
      <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <Gift className="h-4 w-4 text-purple-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-purple-900">הצטרף לתוכנית הנאמנות!</p>
              <p className="text-sm text-purple-700">צבור נקודות על כל הזמנה וקבל הנחות</p>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              הצטרף עכשיו
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </FeatureWrapper>
  );
}

// דוגמה 6: התראות Email
export function EmailNotificationsFeature({ templateId }: { templateId: string }) {
  const enabled = useFeature('email-notifications', 'template', templateId);

  if (!enabled) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Mail className="h-4 w-4" />
      <span>תקבל אישור הזמנה באימייל</span>
    </div>
  );
}

// דוגמה 7: מזג אוויר
export function WeatherInfoFeature({ location, templateId }: { location: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="weather-info" templateId={templateId}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">🌤️ Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl">☀️</div>
            <div>
              <p className="font-semibold">28°C</p>
              <p className="text-xs text-muted-foreground">Sunny, light breeze</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureWrapper>
  );
}

// דוגמה 8: אטרקציות בקרבת מקום
export function NearbyAttractionsFeature({ hotelId, templateId }: { hotelId: string; templateId: string }) {
  return (
    <FeatureWrapper featureId="nearby-attractions" templateId={templateId}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Attractions
          </CardTitle>
          <CardDescription>מה יש בקרבת מקום?</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Badge variant="outline">0.5 km</Badge>
              <span>Beach</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Badge variant="outline">1.2 km</Badge>
              <span>Old Town</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Badge variant="outline">2.0 km</Badge>
              <span>Museum</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </FeatureWrapper>
  );
}

// דוגמה 9: תמיכת צ'אט
export function ChatSupportFeature({ templateId }: { templateId: string }) {
  return (
    <FeatureWrapper featureId="chat-support" templateId={templateId}>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        aria-label="Open chat support"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        צריך עזרה?
      </Button>
    </FeatureWrapper>
  );
}

// דוגמה 10: סיכום כל התכונות המופעלות
export function FeaturesShowcase({ templateId }: { templateId: string }) {
  const { getEnabledFeatures } = useFeatures();
  const enabledFeatures = getEnabledFeatures('template', templateId);

  if (enabledFeatures.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Available Features
        </CardTitle>
        <CardDescription>תכונות זמינות בטמפלט זה</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {enabledFeatures.map((featureId) => (
            <Badge key={featureId} variant="secondary">
              {featureId}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
