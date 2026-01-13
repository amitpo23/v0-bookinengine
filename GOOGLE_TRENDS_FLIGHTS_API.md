# Google Trends & Flight APIs Integration

## סקירה כללית
המערכת כוללת שני API חיצוניים חדשים:
1. **Google Trends API** - מגמות חיפוש ופופולריות יעדים
2. **Flight Search API** - חיפוש טיסות דרך Amadeus או SerpAPI

---

## 🔥 Google Trends API

### יכולות
- ✅ מגמות חיפוש ליעדי תיירות
- ✅ ציון פופולריות (0-100)
- ✅ עונתיות ותקופות מומלצות
- ✅ 10 יעדים הטרנדיים ביותר בעולם
- ✅ מילות מפתח קשורות

### הגדרה

#### אופציה 1: SerpAPI (מומלץ - יציב יותר)
```bash
# קבל API key מ-https://serpapi.com
SERPAPI_KEY=your_serpapi_key_here
```

#### אופציה 2: פועל ללא API (Mock Data)
המערכת תחזיר נתונים סימולטיביים אם אין API key.

---

## ✈️ Flight Search API

### יכולות
- ✅ חיפוש טיסות (חד כיווני/הלוך חזור)
- ✅ סינון לפי מחלקה (תיירות/עסקים/ראשונה)
- ✅ טיסות ישירות/עם עצירות
- ✅ לוח מחירים חודשי
- ✅ טיסות הזולות ביותר מנקודת מוצא

### הגדרה

#### אופציה 1: Amadeus API (מומלץ - רשמי)

1. הרשמה ל-Amadeus
```
https://developers.amadeus.com
```

2. צור אפליקציה וקבל credentials

3. הגדר ב-.env.local:
```bash
# Amadeus Flight API
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
AMADEUS_API_URL=https://test.api.amadeus.com  # או production
FLIGHT_API_PROVIDER=amadeus
```

#### אופציה 2: SerpAPI (פשוט - Google Flights)

```bash
# SerpAPI (supports both Trends + Flights)
SERPAPI_KEY=your_serpapi_key_here
FLIGHT_API_PROVIDER=serpapi
```

#### אופציה 3: פועל ללא API (Mock Data)
המערכת תחזיר נתוני טיסות סימולטיביים.

---

## 📡 API Endpoints

### 1. Google Trends

#### GET/POST `/api/trends?action=destination`
חפש מגמות ליעד ספציפי

**Query Parameters (GET):**
```
?action=destination&destination=Paris&country=FR
```

**Body (POST):**
```json
{
  "action": "destination",
  "destination": "Paris",
  "country": "FR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "Paris",
    "country": "FR",
    "popularityScore": 95,
    "seasonality": "high",
    "trending": true,
    "topReasons": [
      "Eiffel Tower",
      "Louvre Museum",
      "French cuisine"
    ],
    "bestMonths": ["May", "June", "September"]
  }
}
```

---

#### GET/POST `/api/trends?action=travel`
חפש מגמות עבור מילות מפתח

**Query Parameters (GET):**
```
?action=travel&keywords=paris,london,rome&region=IL
```

**Body (POST):**
```json
{
  "action": "travel",
  "keywords": ["paris hotels", "london vacation"],
  "region": "IL"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "keyword": "paris hotels",
      "trend": "rising",
      "interest": 85,
      "relatedQueries": [
        "paris hotels near eiffel tower",
        "best paris hotels"
      ],
      "region": "IL",
      "timestamp": "2026-01-13T10:00:00Z"
    }
  ]
}
```

---

#### GET/POST `/api/trends?action=top`
קבל את 10 היעדים הטרנדיים

**Query Parameters (GET):**
```
?action=top&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "destination": "Paris",
      "country": "France",
      "popularityScore": 95,
      "seasonality": "high",
      "trending": true,
      "topReasons": ["Cultural sites", "Food"],
      "bestMonths": ["May", "June"]
    }
  ]
}
```

---

### 2. Flight Search

#### POST `/api/flights` (action=search)
חפש טיסות

**Body:**
```json
{
  "action": "search",
  "origin": "TLV",
  "destination": "JFK",
  "departureDate": "2026-03-15",
  "returnDate": "2026-03-22",
  "adults": 2,
  "children": 0,
  "infants": 0,
  "travelClass": "ECONOMY",
  "nonStop": false,
  "maxResults": 10
}
```

**Parameters:**
- `origin`: קוד IATA של שדה תעופה (3 אותיות, למשל TLV)
- `destination`: קוד IATA של יעד
- `departureDate`: תאריך יציאה (YYYY-MM-DD)
- `returnDate`: תאריך חזרה (אופציונלי, לטיסת חזור)
- `adults`: מספר מבוגרים (1+)
- `children`: מספר ילדים (0-17)
- `infants`: מספר תינוקות (0-2)
- `travelClass`: `ECONOMY` | `PREMIUM_ECONOMY` | `BUSINESS` | `FIRST`
- `nonStop`: רק טיסות ישירות (true/false)
- `maxResults`: מספר תוצאות מקסימלי

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "offer-123",
      "price": {
        "total": "850.50",
        "currency": "USD",
        "base": "820.50",
        "fees": "30.00"
      },
      "itineraries": [
        {
          "duration": "PT12H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "TLV",
                "terminal": "3",
                "at": "2026-03-15T10:00:00"
              },
              "arrival": {
                "iataCode": "JFK",
                "terminal": "4",
                "at": "2026-03-15T22:30:00"
              },
              "carrierCode": "LY",
              "carrierName": "El Al",
              "flightNumber": "002",
              "duration": "PT12H30M",
              "numberOfStops": 0
            }
          ]
        }
      ],
      "validatingAirlineCodes": ["LY"],
      "numberOfBookableSeats": 9
    }
  ],
  "count": 5
}
```

---

#### POST `/api/flights` (action=calendar)
קבל לוח מחירים לחודש

**Body:**
```json
{
  "action": "calendar",
  "origin": "TLV",
  "destination": "JFK",
  "departureMonth": "2026-03"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "2026-03-01": { "price": 750, "currency": "USD" },
    "2026-03-02": { "price": 780, "currency": "USD" },
    "2026-03-15": { "price": 850, "currency": "USD" }
  }
}
```

---

#### POST `/api/flights` (action=cheapest)
מצא את הטיסות הזולות ביותר

**Body:**
```json
{
  "action": "cheapest",
  "origin": "TLV",
  "destination": "JFK"  // אופציונלי - אם לא מוגדר, יחזיר כל היעדים
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "destination": "JFK",
      "price": 650,
      "currency": "USD",
      "departureDate": "2026-04-10"
    },
    {
      "destination": "CDG",
      "price": 450,
      "currency": "USD",
      "departureDate": "2026-03-25"
    }
  ]
}
```

---

## 💻 דוגמאות שימוש בקוד

### 1. חיפוש מגמות יעד

```typescript
// Client Component
async function searchDestinationTrends(destination: string) {
  const response = await fetch('/api/trends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'destination',
      destination: 'Tel Aviv',
      country: 'IL'
    })
  });
  
  const result = await response.json();
  console.log('Popularity:', result.data.popularityScore);
  console.log('Best months:', result.data.bestMonths);
}
```

### 2. חיפוש טיסות

```typescript
// Client Component
async function searchFlights() {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'search',
      origin: 'TLV',
      destination: 'JFK',
      departureDate: '2026-03-15',
      returnDate: '2026-03-22',
      adults: 2,
      travelClass: 'ECONOMY'
    })
  });
  
  const result = await response.json();
  
  result.data.forEach((flight: any) => {
    console.log(`Price: $${flight.price.total}`);
    console.log(`Airline: ${flight.validatingAirlineCodes[0]}`);
    console.log(`Duration: ${flight.itineraries[0].duration}`);
  });
}
```

### 3. שימוש ישיר בשירותים (Server Side)

```typescript
// Server Component or API Route
import { getDestinationTrends } from '@/lib/services/google-trends-service';
import { searchFlights } from '@/lib/services/flight-service';

async function getPageData() {
  // Get trends
  const trends = await getDestinationTrends('Paris', 'FR');
  
  // Get flights
  const flights = await searchFlights({
    origin: 'TLV',
    destination: 'CDG',
    departureDate: '2026-05-01',
    adults: 2
  });
  
  return { trends, flights };
}
```

### 4. יצירת רכיב טיסות

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FlightSearchWidget() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const response = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        origin: formData.get('origin'),
        destination: formData.get('destination'),
        departureDate: formData.get('departureDate'),
        returnDate: formData.get('returnDate'),
        adults: parseInt(formData.get('adults') as string)
      })
    });

    const result = await response.json();
    setFlights(result.data);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <Input name="origin" placeholder="From (TLV)" required />
        <Input name="destination" placeholder="To (JFK)" required />
        <Input name="departureDate" type="date" required />
        <Input name="returnDate" type="date" />
        <Input name="adults" type="number" defaultValue="1" min="1" />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </form>

      {flights.map((flight: any) => (
        <div key={flight.id}>
          <h3>${flight.price.total}</h3>
          <p>{flight.validatingAirlineCodes.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔑 קודי IATA נפוצים

### ישראל
- **TLV** - Ben Gurion Airport, Tel Aviv
- **ETM** - Ramon Airport, Eilat
- **ETH** - Eilat Airport (old)
- **HFA** - Haifa Airport
- **SDV** - Sde Dov Airport

### ארה"ב
- **JFK** - New York JFK
- **LAX** - Los Angeles
- **MIA** - Miami
- **SFO** - San Francisco
- **ORD** - Chicago
- **BOS** - Boston

### אירופה
- **LHR** - London Heathrow
- **CDG** - Paris Charles de Gaulle
- **FRA** - Frankfurt
- **AMS** - Amsterdam
- **FCO** - Rome Fiumicino
- **MAD** - Madrid
- **BCN** - Barcelona

### מזרח תיכון
- **DXB** - Dubai
- **DOH** - Doha
- **IST** - Istanbul

---

## 🎯 מקרי שימוש

### 1. המלצות חכמות
```typescript
// קבל יעדים טרנדיים + טיסות זולות
const trending = await getTopTrendingDestinations(5);
const cheapFlights = await getCheapestFlights('TLV');

// שלב ביניהם
const recommendations = trending.map(dest => {
  const flight = cheapFlights.find(f => f.destination === dest.destination);
  return { ...dest, flightPrice: flight?.price };
});
```

### 2. עונתיות ומחירים
```typescript
// בדוק עונתיות
const trends = await getDestinationTrends('Barcelona', 'ES');

// קבל מחירים לחודשים הטובים
const prices = await getFlightPriceCalendar('TLV', 'BCN', '2026-05');

console.log(`Best months: ${trends.bestMonths}`);
console.log(`Prices for May: ${JSON.stringify(prices)}`);
```

### 3. השוואת מחירים
```typescript
// חפש טיסות למספר תאריכים
const dates = ['2026-03-15', '2026-03-22', '2026-03-29'];

const results = await Promise.all(
  dates.map(date => searchFlights({
    origin: 'TLV',
    destination: 'JFK',
    departureDate: date,
    adults: 1
  }))
);

// מצא את התאריך הזול ביותר
const cheapest = results.reduce((min, curr) => 
  parseFloat(curr[0].price.total) < parseFloat(min[0].price.total) ? curr : min
);
```

---

## ⚠️ הערות חשובות

### מגבלות API
- **SerpAPI**: 100 חיפושים חינם/חודש
- **Amadeus Test**: 1000 קריאות/חודש (חינם)
- **Amadeus Production**: תשלום לפי שימוש

### Cache
- מגמות: 1 שעה
- טיסות: ללא cache (מחירים משתנים)

### Performance
- SerpAPI: ~2-3 שניות
- Amadeus: ~1-2 שניות
- Mock data: <100ms

### שגיאות נפוצות
```typescript
// 401 - API key לא תקין
// 400 - פרמטרים חסרים/שגויים
// 429 - חריגה ממגבלת API
// 500 - שגיאת שרת
```

---

## 📊 Monitoring

```typescript
// בדוק סטטוס API
const trendsStatus = process.env.SERPAPI_KEY ? '✅' : '❌';
const flightsStatus = 
  process.env.AMADEUS_CLIENT_ID ? '✅ Amadeus' :
  process.env.SERPAPI_KEY ? '✅ SerpAPI' :
  '⚠️ Mock Data';

console.log('Trends API:', trendsStatus);
console.log('Flights API:', flightsStatus);
```

---

## 🚀 Next Steps

1. ✅ הוסף API keys ל-.env.local
2. ✅ בדוק את ה-endpoints ב-Postman/Thunder Client
3. ✅ צור רכיבי UI לחיפוש טיסות
4. ✅ אינטגרציה עם מערכת ה-AI (המלצות חכמות)
5. ✅ הוסף analytics למעקב אחר חיפושים

---

## 📞 תמיכה

**שגיאות נפוצות:**
- "API key not configured" → הוסף את המפתחות ל-.env.local
- "Invalid IATA code" → השתמש בקודים תקינים (3 אותיות)
- "Date format error" → השתמש בפורמט YYYY-MM-DD

**קישורים:**
- [SerpAPI Docs](https://serpapi.com/google-trends-api)
- [Amadeus Docs](https://developers.amadeus.com/self-service/category/flights)
- [IATA Codes](https://www.iata.org/en/publications/directories/code-search/)
