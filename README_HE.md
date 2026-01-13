# 🏨 מערכת הזמנות מלונות AI - Medici API

<div dir="rtl">

## 📋 תוכן עניינים
- [סקירה כללית](#סקירה-כללית)
- [מה חיפשת - חיבור Medici API](#מה-חיפשת---חיבור-medici-api)
- [תכונות](#תכונות)
- [התקנה](#התקנה)
- [שימוש](#שימוש)
- [שיפורים חדשים](#שיפורים-חדשים)
- [תיעוד מפורט](#תיעוד-מפורט)

---

## סקירה כללית

מערכת הזמנות מלונות מתקדמת עם אינטגרציה מלאה ל-**Medici Hotels API**. 
המערכת כוללת תהליך הזמנה מלא: חיפוש → PreBook → Book, עם כלים מתקדמים לניהול, ולידציה, ומעקב.

---

## מה חיפשת - חיבור Medici API

### ✅ **כן! המערכת מחוברת במלואה ל-Medici API**

#### 📁 קבצי הליבה

1. **`lib/api/medici-client.ts`** (729 שורות)
   - הלקוח המלא של Medici API
   - כל הפונקציות: Search, PreBook, Book, Cancel
   - ניהול אוטומטי של Token
   - Retry mechanism מובנה

2. **`lib/api/medici-types.ts`**
   - הגדרות TypeScript מלאות
   - כל ה-Interfaces

3. **`lib/api/booking-service.ts`**
   - Service Layer מלא
   - תהליך הזמנה מקצה לקצה

#### 🔄 תהליך ההזמנה (3 שלבים)

```typescript
// שלב 1: חיפוש חדרים
POST /api/booking/search
{
  "dateFrom": "2025-12-11",
  "dateTo": "2025-12-12",
  "hotelName": "Dizengoff Inn",
  "adults": 2,
  "children": []
}
// ✅ מחזיר: רשימת חדרים עם code ייחודי

// שלב 2: PreBook - וידוא זמינות
POST /api/booking/prebook
{
  "jsonRequest": "{...}" // מה-Search
}
// ✅ מחזיר: TOKEN + מחיר מאושר
// ⏰ תקף: 30 דקות!

// שלב 3: Book - הזמנה סופית
POST /api/booking/book
{
  "jsonRequest": "{...}" // מה-PreBook
}
// ✅ מחזיר: bookingId + supplierReference
// 📧 שולח אימייל אוטומטי
```

### 🎯 **כן! PRE-BOOK ו-BOOK קיימים ועובדים!**

#### דוגמה מהירה:

```typescript
import { mediciApi } from '@/lib/api/medici-client'

// חיפוש
const rooms = await mediciApi.searchHotels({
  dateFrom: "2025-12-11",
  dateTo: "2025-12-12",
  hotelName: "Dizengoff Inn",
  adults: 2,
  children: []
})

// PreBook
const preBookResult = await mediciApi.preBook({
  jsonRequest: rooms[0].requestJson
})
console.log('Token:', preBookResult.token)
console.log('Price:', preBookResult.priceConfirmed)

// Book
const bookResult = await mediciApi.book({
  jsonRequest: preBookResult.requestJson
})
console.log('Booking ID:', bookResult.bookingId)
```

---

## תכונות

### תכונות בסיסיות (קיימות)
- ✅ **חיפוש מלונות** - חיפוש מתקדם לפי תאריכים, עיר, מלון, דירוג
- ✅ **PreBook** - וידוא זמינות וקבלת מחיר מאושר (תקף 30 דקות)
- ✅ **Book** - הזמנה סופית עם פרטי אורח
- ✅ **ביטול הזמנות** - ביטול PreBook או הזמנה
- ✅ **אימיילים אוטומטיים** - אישור הזמנה נשלח באימייל
- ✅ **ניהול מלאי** - חדרים פעילים, נמכרו, בוטלו
- ✅ **Dashboard** - סטטיסטיקות והזדמנויות
- ✅ **תמחור דינמי** - עדכון מחירים

### 🚀 תכונות חדשות (הוספתי היום!)

1. **PreBook Manager** ⏰
   - ניהול אוטומטי של תוקף PreBook (30 דקות)
   - בדיקה אם PreBook עדיין תקף
   - רענון אוטומטי אם קרוב לפוג
   - ניקוי אוטומטי של PreBooks שפג תוקפם

2. **Booking Validator** ✅
   - בדיקות קלט מלאות לפני הזמנה
   - בדיקת פרטי אורח (שם, אימייל, טלפון)
   - בדיקת תאריכים ומספר אורחים
   - החזרת שגיאות + אזהרות

3. **Retry Handler** 🔄
   - ניסיונות חוזרים חכמים עם Exponential Backoff
   - זיהוי שגיאות שלא כדאי לנסות שוב
   - שחזור אוטומטי מכשלונות
   - PreBook, Book, Search עם retry

4. **Booking Logger** 📊
   - מעקב מלא אחר תהליך ההזמנה
   - רישום כל אירוע (search, prebook, book)
   - סטטיסטיקות (הצלחות, כשלונות)
   - ייצוא ל-CSV
   - שליחה ל-Google Analytics

5. **PreBook Timer Component** ⏱️
   - תצוגת טיימר למשתמש
   - Progress bar
   - אזהרה ב-5 דקות אחרונות
   - התראה כשפג תוקף

---

## התקנה

### דרישות מקדימות
- Node.js 18+
- npm או pnpm
- חשבון Medici API (TOKEN)

### צעדים

```bash
# שכפול הפרויקט
git clone <repository-url>
cd v0-bookinengine

# התקנת תלויות
npm install

# הגדרת משתני סביבה
cp .env.local.example .env.local

# ערוך את .env.local:
MEDICI_TOKEN=your-token-here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net

# הרצת השרת
npm run dev
```

השרת יעלה ב-http://localhost:3000

---

## שימוש

### שימוש בסיסי - תהליך הזמנה מלא

```typescript
import { bookingService } from '@/lib/api/booking-service'

async function bookHotel() {
  // 1. חיפוש
  const results = await bookingService.search({
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    city: 'Tel Aviv',
    adults: 2,
    children: []
  })

  const selectedRoom = results[0].rooms[0]

  // 2. PreBook
  const preBookResult = await bookingService.preBook(
    selectedRoom,
    '2025-12-11',
    '2025-12-12',
    2,
    []
  )

  if ('error' in preBookResult) {
    console.error(preBookResult.error)
    return
  }

  console.log('זמן נותר:', preBookResult.timeRemaining, 'דקות')

  // 3. הזמנה סופית
  const guestDetails = {
    title: 'MR',
    firstName: 'ישראל',
    lastName: 'ישראלי',
    email: 'israel@example.com',
    phone: '+972501234567',
    country: 'IL',
    city: 'תל אביב',
    address: 'דיזנגוף 1',
    zip: '12345'
  }

  const bookResult = await bookingService.book(
    selectedRoom,
    preBookResult.token,
    '2025-12-11',
    '2025-12-12',
    2,
    [],
    guestDetails
  )

  console.log('הזמנה הושלמה!')
  console.log('מספר הזמנה:', bookResult.bookingId)
  console.log('אסמכתא:', bookResult.supplierReference)
}
```

### שימוש עם התכונות החדשות

```typescript
import { preBookManager } from '@/lib/api/prebook-manager'
import { bookingValidator } from '@/lib/api/booking-validator'
import { bookingLogger } from '@/lib/api/booking-logger'

// בדיקת תוקף PreBook
const isValid = preBookManager.isValid(roomCode)
const timeRemaining = preBookManager.getTimeRemaining(roomCode)

if (timeRemaining < 5) {
  alert(`מהר! נשארו רק ${timeRemaining} דקות!`)
}

// בדיקת קלט לפני הזמנה
const validation = await bookingValidator.validateBooking({
  roomCode: room.code,
  token: preBookResult.token,
  guestDetails: guestData,
  priceConfirmed: room.price
})

if (!validation.valid) {
  console.error('שגיאות:', validation.errors)
}

if (validation.warnings.length > 0) {
  console.warn('אזהרות:', validation.warnings)
}

// סטטיסטיקות
const stats = bookingLogger.getStats()
console.log('הזמנות מוצלחות:', stats.successfulBookings)
console.log('הזמנות כושלות:', stats.failedBookings)
```

### שימוש ב-React Component

```tsx
import { PreBookTimer } from '@/components/booking/prebook-timer'

export function BookingPage() {
  const [preBookData, setPreBookData] = useState(null)

  return (
    <div>
      {preBookData && (
        <PreBookTimer
          expiresAt={preBookData.expiresAt}
          onExpired={() => {
            alert('זמן ההזמנה פג. אנא חפש שוב.')
            setPreBookData(null)
          }}
          warningMinutes={5}
        />
      )}
      
      {/* שאר הטופס... */}
    </div>
  )
}
```

---

## שיפורים חדשים

### השוואה - לפני ואחרי

| תכונה | לפני | אחרי |
|-------|------|------|
| ניהול תוקף PreBook | ❌ ידני | ✅ אוטומטי |
| בדיקות קלט | ❌ חלקי | ✅ מלא |
| ניסיונות חוזרים | ⚠️ בסיסי | ✅ חכם (exponential backoff) |
| לוגים | ⚠️ console.log | ✅ מערכת לוגים מלאה |
| מעקב זמן | ❌ | ✅ טיימר + התראות |
| Analytics | ❌ | ✅ Google Analytics |
| שחזור מכשלים | ❌ | ✅ Recovery mechanism |
| סטטיסטיקות | ❌ | ✅ Dashboard |

### קבצים חדשים שנוספו

1. `lib/api/prebook-manager.ts` - ניהול PreBook
2. `lib/api/booking-validator.ts` - בדיקות קלט
3. `lib/api/booking-retry-handler.ts` - ניסיונות חוזרים
4. `lib/api/booking-logger.ts` - לוגים וסטטיסטיקות
5. `components/booking/prebook-timer.tsx` - טיימר למשתמש
6. `components/ui/progress.tsx` - Progress bar
7. `app/api/booking/prebook-enhanced/route.ts` - API משופר
8. `docs/ENHANCED_BOOKING_GUIDE.md` - מדריך מפורט
9. `SYSTEM_SUMMARY.md` - סיכום המערכת

**סה"כ: ~1,500 שורות קוד חדש!**

---

## תיעוד מפורט

### קבצי תיעוד

1. **[SYSTEM_SUMMARY.md](SYSTEM_SUMMARY.md)** - סיכום מקיף של המערכת
2. **[docs/ENHANCED_BOOKING_GUIDE.md](docs/ENHANCED_BOOKING_GUIDE.md)** - מדריך שימוש מפורט
3. **[docs/MEDICI_API_EXAMPLES.md](docs/MEDICI_API_EXAMPLES.md)** - דוגמאות API אמיתיות
4. **[README.md](README.md)** - המסמך הזה

### API Endpoints

#### חיפוש
```
POST /api/booking/search
Body: { dateFrom, dateTo, hotelName?, city?, adults, children }
```

#### PreBook
```
POST /api/booking/prebook
Body: { jsonRequest, roomCode, hotelId }
```

#### PreBook מצב (חדש!)
```
GET /api/booking/prebook-enhanced?roomCode=...
Returns: { valid, timeRemaining, expiresAt }
```

#### Book
```
POST /api/booking/book
Body: { jsonRequest }
```

#### ביטול
```
POST /api/booking/cancel
Body: { bookingId, reason? }
```

---

## דוגמאות נוספות

### בדיקת תאריכים
```typescript
import { bookingValidator } from '@/lib/api/booking-validator'

const dateValidation = bookingValidator.validateDates(
  '2025-12-11',
  '2025-12-12'
)

if (!dateValidation.valid) {
  dateValidation.errors.forEach(err => console.error(err))
}
```

### שחזור מכשל PreBook
```typescript
import { retryHandler } from '@/lib/api/booking-retry-handler'

const result = await retryHandler.recoverFromPreBookFailure({
  roomCode: selectedRoom.code,
  originalSearchParams: {
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    hotelName: 'Dizengoff Inn',
    adults: 2
  }
})

if (result.success) {
  console.log('התאוששנו מכשל!')
}
```

### ייצוא לוגים ל-CSV
```typescript
import { bookingLogger } from '@/lib/api/booking-logger'

const csv = bookingLogger.exportToCsv()
// הורד כקובץ או שלח לשרת
```

---

## הגדרות נוספות

### משתני סביבה

```env
# Medici API (חובה)
MEDICI_TOKEN=your-jwt-token-here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
MEDICI_CLIENT_SECRET=your-secret-here

# Supabase (אופציונלי)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Email (אופציונלי)
RESEND_API_KEY=your-resend-key

# Analytics (אופציונלי)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### שינוי תוקף PreBook

```typescript
// ב-lib/api/prebook-manager.ts
private readonly PREBOOK_VALIDITY_MINUTES = 30
// שנה ל-45 אם רוצה יותר זמן
```

### שינוי מספר ניסיונות

```typescript
// ב-lib/api/booking-retry-handler.ts
private defaultConfig: RetryConfig = {
  maxRetries: 3,      // שנה ל-5 ליותר ניסיונות
  retryDelay: 1000,   // זמן המתנה בין ניסיונות
  backoffMultiplier: 2 // גורם הכפלה
}
```

---

## תמיכה ובעיות

### בעיות נפוצות

#### PreBook פג תוקף
```typescript
const preBook = preBookManager.getPreBook(roomCode)
if (!preBook) {
  // PreBook פג - צריך לחפש שוב
  const newResults = await bookingService.search(params)
}
```

#### חדר לא זמין
```typescript
const preBookResult = await bookingService.preBook(...)
if ('error' in preBookResult) {
  // נסה לשחזר או חפש חדר אחר
  const recovery = await retryHandler.recoverFromPreBookFailure(...)
}
```

#### Token לא תקף
המערכת מרעננת אוטומטית את ה-Token. אם עדיין יש בעיה:
```typescript
// בדוק את MEDICI_TOKEN ב-.env.local
// וודא שהוא תקף ולא פג
```

---

## רישיון

MIT

---

## מחבר

נבנה עם ❤️ באמצעות:
- Next.js 16
- TypeScript
- Medici Hotels API
- Radix UI
- Tailwind CSS

---

## קישורים

- [תיעוד Medici API](docs/MEDICI_API_EXAMPLES.md)
- [מדריך שימוש מפורט](docs/ENHANCED_BOOKING_GUIDE.md)
- [סיכום המערכת](SYSTEM_SUMMARY.md)

---

</div>

**הכל מוכן לשימוש! 🎉**

השתמש ב-`npm run dev` להפעלה והתחל להזמין מלונות! 🏨
