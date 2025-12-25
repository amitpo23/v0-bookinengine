# 🏨 מדריך מלא - מערכת Search & PreBook

## 📚 תוכן עניינים
1. [מבוא](#מבוא)
2. [ארכיטקטורה](#ארכיטקטורה)
3. [תהליך ההזמנה](#תהליך-ההזמנה)
4. [דוגמאות קוד](#דוגמאות-קוד)
5. [קבצים חשובים](#קבצים-חשובים)
6. [בדיקות](#בדיקות)
7. [שאלות נפוצות](#שאלות-נפוצות)

---

## מבוא

מערכת הזמנות מלונות מלאה המבוססת על **Medici Hotels API**. 

### תכונות עיקריות:
- ✅ חיפוש מלונות וחדרים בזמן אמת
- ✅ טרום-הזמנה (PreBook) לשמירת חדר למשך 30 דקות
- ✅ הזמנה סופית עם אישור מיידי
- ✅ ביטול הזמנות
- ✅ תמיכה מלאה ב-TypeScript
- ✅ 4 טמפלטים שונים של UI

---

## ארכיטקטורה

### מבנה תיקיות

```
lib/api/
├── medici-client.ts     # הקלאס הראשי של ה-API
└── medici-types.ts      # כל ה-TypeScript types

app/api/
├── hotels/
│   └── search/
│       └── route.ts     # API endpoint לחיפוש
└── booking/
    ├── prebook/
    │   └── route.ts     # API endpoint ל-PreBook
    └── book/
        └── route.ts     # API endpoint ל-Book

hooks/
└── use-booking-engine.ts  # React Hook לניהול תהליך ההזמנה

components/booking/
├── templates/
│   ├── nara-style/      # טמפלט NARA
│   ├── modern-dark/     # טמפלט Modern Dark
│   ├── luxury/          # טמפלט Luxury
│   └── family/          # טמפלט Family
└── shared/              # קומפוננטות משותפות
```

### זרימת מידע

```
┌─────────────────┐
│  Frontend UI    │ (React Components)
└────────┬────────┘
         │
         ↓ useBookingEngine() hook
         │
┌────────┴────────┐
│  API Routes     │ (/api/hotels/search, /api/booking/prebook, etc.)
└────────┬────────┘
         │
         ↓ mediciApi.searchHotels()
         │
┌────────┴────────┐
│ Medici Client   │ (lib/api/medici-client.ts)
└────────┬────────┘
         │
         ↓ HTTP Requests
         │
┌────────┴────────┐
│  Medici API     │ (medici-backend.azurewebsites.net)
└─────────────────┘
```

---

## תהליך ההזמנה

### שלב 1: חיפוש (Search)

**קובץ:** [app/api/hotels/search/route.ts](../app/api/hotels/search/route.ts)

```typescript
// Frontend Call
const response = await fetch('/api/hotels/search', {
  method: 'POST',
  body: JSON.stringify({
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    hotelName: 'Dizengoff Inn',
    adults: 2,
    children: []
  })
})

const data = await response.json()
// data.results = array of HotelSearchResult[]
```

**תשובה:**
```typescript
{
  success: true,
  results: [
    {
      hotelId: 697024,
      hotelName: "Dizengoff Inn",
      rooms: [
        {
          code: "697024:standard:double:RO:6881f6a596dd21...",
          roomName: "Standard Double",
          price: 109.61,
          currency: "USD",
          board: "RO",
          ...
        }
      ]
    }
  ],
  count: 1
}
```

**שדות חשובים:**
- `room.code` - **חובה לשמור!** משמש לכל השלבים הבאים
- `room.price` / `room.netPrice` - המחיר
- `hotel.hotelId` - מזהה המלון

---

### שלב 2: טרום-הזמנה (PreBook)

**קובץ:** [app/api/booking/prebook/route.ts](../app/api/booking/prebook/route.ts)

**⏱️ חשוב:** PreBook תקף ל-**30 דקות בלבד!**

```typescript
// Frontend Call
const response = await fetch('/api/booking/prebook', {
  method: 'POST',
  body: JSON.stringify({
    jsonRequest: selectedRoom.requestJson  // מתוצאות החיפוש
  })
})

const data = await response.json()
```

**תשובה:**
```typescript
{
  success: true,
  preBookId: 12345,
  token: "5C0A00D2",           // ⭐ חשוב! לשמירה להזמנה הסופית
  priceConfirmed: 109.61,
  currency: "USD",
  status: "done",
  requestJson: "...",           // ⭐ לשמירה להזמנה הסופית
  responseJson: {...}
}
```

**שדות חשובים:**
- `token` - **חובה לשמור!** משמש להזמנה הסופית
- `priceConfirmed` - המחיר הסופי שאושר
- `requestJson` - נדרש לשלב Book

**טיימר:**
```typescript
// הצג למשתמש כמה זמן נשאר
const expiryTime = Date.now() + (30 * 60 * 1000) // 30 minutes
setInterval(() => {
  const remaining = expiryTime - Date.now()
  if (remaining <= 0) {
    alert('PreBook expired! Please search again.')
  }
}, 1000)
```

---

### שלב 3: הזמנה סופית (Book)

**קובץ:** [app/api/booking/book/route.ts](../app/api/booking/book/route.ts)

```typescript
// Frontend Call
const response = await fetch('/api/booking/book', {
  method: 'POST',
  body: JSON.stringify({
    jsonRequest: buildBookRequest({
      token: prebookData.token,
      customer: guestInfo,
      ...
    })
  })
})

const data = await response.json()
```

**תשובה:**
```typescript
{
  success: true,
  bookingId: "3632487",              // ⭐ מזהה ההזמנה
  supplierReference: "ME5PPX",       // ⭐ מספר אישור מהמלון
  status: "confirmed"                // ⭐ חייב להיות "confirmed"
}
```

**Status Codes:**
- `"confirmed"` ✅ - הזמנה אושרה בהצלחה
- `"pending"` ⏳ - ממתין לאישור
- `"failed"` ❌ - נכשל

---

## דוגמאות קוד

### דוגמה 1: שימוש ב-`useBookingEngine` Hook

```tsx
'use client'

import { useBookingEngine } from '@/hooks/use-booking-engine'
import { addDays } from 'date-fns'

export default function BookingPage() {
  const booking = useBookingEngine()

  const handleSearch = async () => {
    const checkIn = new Date()
    const checkOut = addDays(checkIn, 2)
    
    await booking.searchHotels({
      checkIn,
      checkOut,
      adults: 2,
      children: [5, 8],  // 2 ילדים: גיל 5 וגיל 8
      hotelName: 'Dizengoff Inn'
    })
  }

  const handleSelectRoom = async (hotel, room) => {
    const success = await booking.selectRoom(hotel, room)
    if (success) {
      // PreBook הצליח! עבור לפרטי אורח
      booking.goToStep('details')
    }
  }

  const handleCompleteBooking = async () => {
    const success = await booking.completeBooking()
    if (success) {
      // הזמנה הושלמה!
      console.log('Booking ID:', booking.bookingConfirmation?.bookingId)
    }
  }

  return (
    <div>
      {/* Search Form */}
      {booking.step === 'search' && (
        <button onClick={handleSearch}>חפש</button>
      )}

      {/* Results */}
      {booking.step === 'results' && (
        <div>
          {booking.searchResults.map(hotel => (
            <div key={hotel.hotelId}>
              <h3>{hotel.hotelName}</h3>
              {hotel.rooms.map(room => (
                <button 
                  key={room.roomId}
                  onClick={() => handleSelectRoom(hotel, room)}
                >
                  {room.roomName} - ${room.price}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Guest Details */}
      {booking.step === 'details' && (
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          booking.setGuestInfo({
            title: 'Mr',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
          })
          booking.goToStep('payment')
        }}>
          {/* Form fields */}
        </form>
      )}

      {/* Payment */}
      {booking.step === 'payment' && (
        <button onClick={handleCompleteBooking}>
          שלם ${booking.totalPrice}
        </button>
      )}

      {/* Confirmation */}
      {booking.step === 'confirmation' && (
        <div>
          <h2>הזמנה אושרה! 🎉</h2>
          <p>מספר הזמנה: {booking.bookingConfirmation?.bookingId}</p>
        </div>
      )}

      {/* Loading & Errors */}
      {booking.isLoading && <div>טוען...</div>}
      {booking.error && <div>שגיאה: {booking.error}</div>}
    </div>
  )
}
```

### דוגמה 2: שימוש ישיר ב-API Client

```typescript
import { mediciApi } from '@/lib/api/medici-client'

async function bookHotel() {
  // 1. חיפוש
  const hotels = await mediciApi.searchHotels({
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    hotelName: 'Dizengoff Inn',
    adults: 2,
    children: []
  })

  const room = hotels[0].rooms[0]

  // 2. PreBook
  const prebook = await mediciApi.preBook({
    jsonRequest: buildPrebookRequest(room)
  })

  // 3. Book
  const booking = await mediciApi.book({
    jsonRequest: buildBookRequest(prebook, customerInfo)
  })

  if (booking.status === 'confirmed') {
    console.log('Success! Booking ID:', booking.bookingId)
  }
}
```

### דוגמה 3: בניית requestJson ידנית

```typescript
function buildPrebookRequest(room: RoomResult, searchParams: any) {
  return JSON.stringify({
    services: [{
      searchCodes: [{
        code: room.code,
        pax: [{
          adults: searchParams.adults,
          children: searchParams.children
        }]
      }],
      searchRequest: {
        currencies: ['USD'],
        customerCountry: 'IL',
        dates: {
          from: searchParams.dateFrom,
          to: searchParams.dateTo
        },
        destinations: [{
          id: Number(room.hotelId),
          type: 'hotel'
        }],
        filters: [
          { name: 'payAtTheHotel', value: true },
          { name: 'onRequest', value: false },
          { name: 'showSpecialDeals', value: true }
        ],
        pax: [{
          adults: searchParams.adults,
          children: searchParams.children
        }],
        service: 'hotels'
      }
    }]
  })
}
```

---

## קבצים חשובים

### 1. `lib/api/medici-client.ts`
הקלאס הראשי של ה-API. מכיל את כל הפונקציות:
- `searchHotels()` - חיפוש מלונות
- `preBook()` - טרום-הזמנה
- `book()` - הזמנה סופית
- `cancelBooking()` - ביטול
- ועוד...

### 2. `lib/api/medici-types.ts`
כל ה-TypeScript interfaces:
- `HotelSearchResult`
- `RoomResult`
- `PreBookResponse`
- `BookResponse`

### 3. `hooks/use-booking-engine.ts`
React Hook שמנהל את כל תהליך ההזמנה.
מכיל:
- State management
- API calls
- Error handling
- Step navigation

### 4. `app/api/booking/*/route.ts`
Next.js API Routes שמקשרים בין ה-Frontend ל-Medici API.

---

## בדיקות

### הרצת בדיקות

```bash
# בדיקת חיפוש בלבד
pnpm tsx scripts/test-search-only.ts

# בדיקת Flow מלא (Search → PreBook → Book)
pnpm tsx scripts/test-real-flow.ts

# בדיקה עם Medici API ישיר
pnpm tsx scripts/test-medici-search.ts
```

### Environment Variables נדרשים

```env
# .env.local
MEDICI_TOKEN=your-jwt-token-here
MEDICI_APP_KEY=your-app-key-here (optional)
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
```

---

## שאלות נפוצות

### ❓ מה זה ה-`code` של החדר?

זהו מפתח ייחודי לכל חדר בחיפוש:
```
"697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t"
```
**חובה לשמור אותו בדיוק כפי שמתקבל!** הוא משמש בכל השלבים.

### ❓ למה PreBook תקף רק 30 דקות?

זה מדיניות של ה-API. אחרי 30 דקות המחיר עלול להשתנות והזמינות עלולה להשתנות.

### ❓ מה קורה אם PreBook פג?

צריך לעשות חיפוש מחדש ו-PreBook חדש. המחיר עלול להשתנות.

### ❓ איך יודעים שהזמנה הצליחה?

בודקים את ה-`status` בתשובה:
```typescript
if (bookResponse.status === 'confirmed') {
  // הזמנה הצליחה! ✅
}
```

### ❓ מה ההבדל בין `price` ל-`netPrice`?

- `price` - המחיר הגולמי
- `netPrice` - המחיר הנקי (אחרי עמלות)

בדרך כלל הם זהים. המערכת משתמשת ב-`netPrice` כברירת מחדל.

### ❓ איך מטפלים בשגיאות?

```typescript
try {
  const result = await mediciApi.searchHotels(params)
} catch (error) {
  if (error.message.includes('401')) {
    // טוקן לא תקף
  } else if (error.message.includes('404')) {
    // לא נמצא
  } else {
    // שגיאה כללית
  }
}
```

### ❓ איך מבטלים הזמנה?

```typescript
const result = await mediciApi.cancelBooking(preBookId)
if (result.success) {
  console.log('ההזמנה בוטלה')
}
```

### ❓ מה ה-Board Types?

```
RO = Room Only (לינה בלבד)
BB = Bed & Breakfast (ארוחת בוקר)
HB = Half Board (חצי פנסיון)
FB = Full Board (פנסיון מלא)
AI = All Inclusive (הכל כלול)
```

---

## תמיכה

לשאלות או בעיות:
1. בדוק את [docs/MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md) לדוגמאות מפורטות
2. הרץ את הבדיקות: `pnpm tsx scripts/test-search-only.ts`
3. בדוק את הלוגים בקונסולה
4. צור Issue ב-GitHub

---

**עודכן:** 25 דצמבר 2025  
**מפתח:** v0.app  
**גרסה:** 2.0
