# ============================================
# SerpAPI Setup Guide
# ============================================

## 🎯 צעדים להפעלת SerpAPI

### 1️⃣ קבל API Key (חינם!)

1. גש ל-https://serpapi.com
2. לחץ על "Get Started Free"
3. הרשם עם Gmail/Email
4. לאחר הרשמה, קבל את ה-API key שלך מה-Dashboard

**💰 תוכנית חינם:**
- 100 חיפושים לחודש (חינם לנצח)
- מספיק לפיתוח ובדיקות
- אין צורך בכרטיס אשראי

---

### 2️⃣ הוסף את המפתח ל-.env.local

פתח/צור את הקובץ `.env.local` בשורש הפרויקט והוסף:

```bash
# SerpAPI - Google Trends & Flights
SERPAPI_KEY=your_serpapi_key_here

# (אופציונלי) הגדר SerpAPI גם לטיסות
FLIGHT_API_PROVIDER=serpapi
```

**דוגמה מלאה של .env.local:**
```bash
# Medici API (Required)
MEDICI_TOKEN=your_medici_token
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# NextAuth (Required)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# SerpAPI - NEW!
SERPAPI_KEY=abc123def456...your_actual_key
FLIGHT_API_PROVIDER=serpapi

# AI Provider (Optional)
GROQ_API_KEY=your_groq_key
AI_PROVIDER=groq
```

---

### 3️⃣ אתחל מחדש את השרת

```bash
# עצור את השרת (Ctrl+C)
# הרץ שוב:
npm run dev
```

---

## ✅ בדיקה שהכל עובד

### אופציה 1: בדיקה בדפדפן

1. פתח את הדפדפן ב-http://localhost:3000

2. פתח את ה-Console (F12)

3. הרץ:
```javascript
// בדוק Google Trends
fetch('/api/trends?action=top&limit=5')
  .then(r => r.json())
  .then(d => console.log('Trends:', d))

// בדוק Flights
fetch('/api/flights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'search',
    origin: 'TLV',
    destination: 'JFK',
    departureDate: '2026-03-15',
    adults: 1
  })
}).then(r => r.json())
  .then(d => console.log('Flights:', d))
```

### אופציה 2: בדיקה עם curl

```bash
# בדוק Trends
curl "http://localhost:3000/api/trends?action=top&limit=5"

# בדוק Flights
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "action":"search",
    "origin":"TLV",
    "destination":"JFK",
    "departureDate":"2026-03-15",
    "adults":1
  }'
```

### אופציה 3: בדיקה עם Thunder Client / Postman

**Request 1: Google Trends**
- Method: GET
- URL: `http://localhost:3000/api/trends?action=top&limit=5`

**Request 2: Flight Search**
- Method: POST
- URL: `http://localhost:3000/api/flights`
- Body (JSON):
```json
{
  "action": "search",
  "origin": "TLV",
  "destination": "JFK",
  "departureDate": "2026-03-15",
  "adults": 1
}
```

---

## 📊 מה תקבל

### תגובה מוצלחת (עם API key):
```json
{
  "success": true,
  "data": [
    {
      "destination": "Paris",
      "popularityScore": 95,
      "trending": true
    }
  ]
}
```

### תגובה ללא API key (Mock Data):
```json
{
  "success": true,
  "data": [
    {
      "destination": "Paris",
      "popularityScore": 85,
      "trending": true
    }
  ]
}
```

**שים לב:** גם ללא API key המערכת תעבוד עם נתונים סימולטיביים!

---

## 🔍 בדיקת סטטוס API

צור קובץ בדיקה: `test-serpapi.js`

```javascript
// test-serpapi.js
async function testSerpAPI() {
  const apiKey = process.env.SERPAPI_KEY;
  
  if (!apiKey) {
    console.log('❌ SERPAPI_KEY not found in environment');
    console.log('⚠️  Using mock data instead');
    return;
  }
  
  console.log('✅ SERPAPI_KEY found');
  console.log('🔍 Testing Google Trends API...');
  
  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_trends&q=travel&geo=US&api_key=${apiKey}`
    );
    
    if (response.ok) {
      console.log('✅ SerpAPI is working!');
      const data = await response.json();
      console.log('Sample data:', JSON.stringify(data, null, 2).slice(0, 200));
    } else {
      console.log('❌ SerpAPI error:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testSerpAPI();
```

הרץ:
```bash
node test-serpapi.js
```

---

## 💡 טיפים

### 1. מגבלת שימוש
- תוכנית חינם: 100 חיפושים/חודש
- הקפד לא לבצע חיפושים מיותרים בפיתוח
- השתמש ב-cache (המערכת כבר מטמיעה cache של שעה)

### 2. Fallback לנתונים סימולטיביים
- אם המפתח לא מוגדר → המערכת עובדת עם Mock Data
- אם המפתח פג → המערכת עוברת ל-Mock Data
- אם חרגת מהמכסה → המערכת עוברת ל-Mock Data

### 3. בעיות נפוצות

**"Invalid API key"**
→ בדוק שהמפתח נכון ב-.env.local

**"Rate limit exceeded"**
→ חרגת מ-100 חיפושים, חכה לחודש הבא

**"401 Unauthorized"**
→ המפתח לא תקין או פג תוקף

---

## 🎯 שילוב ברכיבי UI

### דוגמה: רכיב חיפוש טיסות עם Trends

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export function SmartFlightSearch() {
  const [trending, setTrending] = useState([]);
  const [flights, setFlights] = useState([]);

  // טען יעדים טרנדיים
  useEffect(() => {
    fetch('/api/trends?action=top&limit=5')
      .then(r => r.json())
      .then(d => setTrending(d.data || []));
  }, []);

  // חפש טיסות ליעד טרנדי
  async function searchTrendingDestination(dest: any) {
    const res = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        origin: 'TLV',
        destination: dest.destination, // צריך IATA code mapping
        departureDate: '2026-03-15',
        adults: 1
      })
    });
    
    const data = await res.json();
    setFlights(data.data || []);
  }

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2">
        <TrendingUp /> Trending Destinations
      </h2>
      
      {trending.map((dest: any) => (
        <Card key={dest.destination} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>{dest.destination}</h3>
              <p>Popularity: {dest.popularityScore}/100</p>
            </div>
            <Button onClick={() => searchTrendingDestination(dest)}>
              Find Flights
            </Button>
          </div>
        </Card>
      ))}

      {flights.length > 0 && (
        <div>
          <h3>Available Flights:</h3>
          {flights.map((f: any) => (
            <Card key={f.id} className="p-3">
              <p>${f.price.total}</p>
              <p>{f.validatingAirlineCodes[0]}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📞 תמיכה

**שאלות?**
- תיעוד מלא: `GOOGLE_TRENDS_FLIGHTS_API.md`
- דוגמאות קוד: `examples/trends-flights-examples.tsx`
- SerpAPI Docs: https://serpapi.com/google-trends-api

**בעיות טכניות?**
1. בדוק שה-.env.local נשמר
2. אתחל את השרת (Ctrl+C → npm run dev)
3. בדוק ב-console אם יש שגיאות

---

## ✨ הצעד הבא

לאחר שה-SerpAPI עובד:
1. ✅ נסה את דוגמאות הקוד ב-`examples/trends-flights-examples.tsx`
2. ✅ צור רכיבי UI משלך
3. ✅ שלב עם מערכת ה-AI למלצות חכמות
4. ✅ הוסף Analytics למעקב אחר חיפושים

**המערכת מוכנה! 🚀**
