# מדריך שימוש במערכת ההזמנות המשופרת

## 📚 סקירה כללית

המערכת כוללת 4 רבדים חדשים:
1. **PreBook Manager** - ניהול תוקף PreBook (30 דקות)
2. **Booking Validator** - בדיקות קלט
3. **Retry Handler** - ניסיונות חוזרים חכמים
4. **Booking Logger** - מעקב ולוגים

---

## 🚀 דוגמאות שימוש

### 1. חיפוש בסיסי עם Retry

```typescript
import { bookingService } from '@/lib/api/booking-service'

const results = await bookingService.search({
  dateFrom: '2025-12-11',
  dateTo: '2025-12-12',
  hotelName: 'Dizengoff Inn',
  adults: 2,
  children: []
})

// המערכת תנסה שוב אוטומטית עד 3 פעמים במקרה של כשל
```

### 2. PreBook עם ניהול תוקף אוטומטי

```typescript
const selectedRoom = results[0].rooms[0]

const preBookResult = await bookingService.preBook(
  selectedRoom,
  '2025-12-11',
  '2025-12-12',
  2,
  []
)

if ('error' in preBookResult) {
  console.error('PreBook failed:', preBookResult.error)
} else {
  // ✅ PreBook הצליח!
  console.log('Token:', preBookResult.token)
  console.log('Price:', preBookResult.priceConfirmed)
  console.log('Time remaining:', preBookResult.timeRemaining, 'minutes')
  console.log('Expires at:', preBookResult.expiresAt)
}
```

### 3. בדיקת תוקף PreBook

```typescript
import { preBookManager } from '@/lib/api/prebook-manager'

// בדיקה אם PreBook עדיין תקף
const isValid = preBookManager.isValid(roomCode)

// זמן שנותר (בדקות)
const timeRemaining = preBookManager.getTimeRemaining(roomCode)

if (timeRemaining < 5) {
  alert('מהר! נשארו רק ' + timeRemaining + ' דקות!')
}
```

### 4. הזמנה עם ולידציה מלאה

```typescript
const guestDetails = {
  title: 'MR',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+972501234567',
  country: 'IL',
  city: 'Tel Aviv',
  address: 'Dizengoff 1',
  zip: '12345'
}

try {
  const bookResult = await bookingService.book(
    selectedRoom,
    preBookResult.token,
    '2025-12-11',
    '2025-12-12',
    2,
    [],
    guestDetails
  )

  // ✅ הזמנה הצליחה!
  console.log('Booking ID:', bookResult.bookingId)
  console.log('Supplier Reference:', bookResult.supplierReference)
  
} catch (error) {
  // שגיאה בולידציה או בהזמנה
  console.error('Booking failed:', error.message)
}
```

### 5. שימוש ב-Validator באופן עצמאי

```typescript
import { bookingValidator } from '@/lib/api/booking-validator'

// בדיקת תאריכים
const dateValidation = bookingValidator.validateDates(
  '2025-12-11',
  '2025-12-12'
)

if (!dateValidation.valid) {
  console.error('Date errors:', dateValidation.errors)
}

// בדיקת אורחים
const guestValidation = bookingValidator.validateGuests(2, [5, 8])

if (guestValidation.warnings.length > 0) {
  console.warn('Warnings:', guestValidation.warnings)
}
```

### 6. ניסיון חוזר ידני

```typescript
import { retryHandler } from '@/lib/api/booking-retry-handler'

const result = await retryHandler.preBookWithRetry({
  jsonRequest: room.requestJson,
  roomCode: room.code
})

if (result.success) {
  console.log('PreBook succeeded after', result.attempts, 'attempts')
} else {
  console.error('PreBook failed after', result.attempts, 'attempts')
}
```

### 7. שחזור מכשל PreBook

```typescript
const recoveryResult = await retryHandler.recoverFromPreBookFailure({
  roomCode: selectedRoom.code,
  originalSearchParams: {
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    hotelName: 'Dizengoff Inn',
    adults: 2
  }
})

if (recoveryResult.success) {
  console.log('Recovered successfully!')
}
```

### 8. צפייה בלוגים וסטטיסטיקות

```typescript
import { bookingLogger } from '@/lib/api/booking-logger'

// סטטיסטיקות
const stats = bookingLogger.getStats()
console.log('Successful bookings:', stats.successfulBookings)
console.log('Failed bookings:', stats.failedBookings)
console.log('PreBook success rate:', 
  stats.successfulPreBooks / (stats.successfulPreBooks + stats.failedPreBooks)
)

// ייצוא ל-CSV
const csv = bookingLogger.exportToCsv()
console.log(csv)
```

---

## 🎨 שימוש ב-React Components

### PreBook Timer

```tsx
import { PreBookTimer } from '@/components/booking/prebook-timer'

export function BookingForm() {
  const [preBookData, setPreBookData] = useState(null)

  return (
    <div>
      {preBookData && (
        <PreBookTimer
          expiresAt={preBookData.expiresAt}
          onExpired={() => {
            alert('PreBook expired! Please search again.')
            setPreBookData(null)
          }}
          warningMinutes={5}
        />
      )}
      
      {/* Form fields... */}
    </div>
  )
}
```

### PreBook Timer Hook

```tsx
import { usePreBookTimer } from '@/components/booking/prebook-timer'

export function BookingStatus() {
  const { 
    minutes, 
    seconds, 
    isExpired, 
    isWarning, 
    progressPercentage 
  } = usePreBookTimer(preBookData?.expiresAt)

  if (isExpired) {
    return <div>הזמנה פגה!</div>
  }

  return (
    <div>
      <p className={isWarning ? 'text-orange-500' : 'text-blue-500'}>
        זמן נותר: {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  )
}
```

---

## 🔄 Flow מלא - דוגמה

```typescript
async function completeBookingFlow() {
  // 1. חיפוש
  bookingLogger.resetSession() // התחל סשן חדש
  
  const results = await bookingService.search({
    dateFrom: '2025-12-11',
    dateTo: '2025-12-12',
    city: 'Tel Aviv',
    adults: 2,
    children: [5]
  })

  const selectedRoom = results[0].rooms[0]

  // 2. PreBook
  const preBookResult = await bookingService.preBook(
    selectedRoom,
    '2025-12-11',
    '2025-12-12',
    2,
    [5]
  )

  if ('error' in preBookResult) {
    throw new Error(preBookResult.error)
  }

  // 3. המתן להזנת פרטים (עד 30 דקות)
  // בינתיים מציגים טיימר למשתמש
  console.log('Time remaining:', preBookResult.timeRemaining, 'minutes')

  // 4. בדיקה לפני הזמנה
  const validation = await bookingValidator.validateBooking({
    roomCode: selectedRoom.code,
    token: preBookResult.token,
    guestDetails: {
      title: 'MR',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+972501234567',
      country: 'IL',
      city: 'Tel Aviv',
      address: 'Dizengoff 1',
      zip: '12345'
    },
    priceConfirmed: preBookResult.priceConfirmed
  })

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '))
  }

  // 5. הזמנה סופית
  const bookResult = await bookingService.book(
    selectedRoom,
    preBookResult.token,
    '2025-12-11',
    '2025-12-12',
    2,
    [5],
    guestDetails
  )

  // 6. הצלחה!
  console.log('🎉 Booking completed!')
  console.log('Booking ID:', bookResult.bookingId)
  console.log('Reference:', bookResult.supplierReference)

  // 7. סטטיסטיקות
  const stats = bookingLogger.getStats()
  console.log('Session stats:', stats)
}
```

---

## ⚠️ טיפול בשגיאות נפוצות

### PreBook פג תוקף

```typescript
const preBook = preBookManager.getPreBook(roomCode)
if (!preBook) {
  // PreBook פג תוקף - צריך לחפש שוב
  const newResults = await bookingService.search(originalSearchParams)
  // בחר חדר מחדש וכו'
}
```

### Room כבר לא זמין

```typescript
const preBookResult = await bookingService.preBook(...)
if ('error' in preBookResult && 
    preBookResult.error.includes('not available')) {
  // נסה לשחזר
  const recovery = await retryHandler.recoverFromPreBookFailure({
    roomCode: room.code,
    originalSearchParams
  })
}
```

### שגיאת רשת

```typescript
// הטיפול אוטומטי - הרי-handler ינסה שוב עד 3 פעמים
const result = await bookingService.search(params)
// אם נכשל, כבר עשה 3 ניסיונות
```

---

## 📊 מעקב ואנליטיקה

המערכת שולחת אוטומטית אירועים ל-Google Analytics אם קיים:

```javascript
window.gtag('event', 'prebook_completed', {
  event_category: 'booking',
  event_label: roomCode,
  value: price
})
```

אירועים שנשלחים:
- `search_started`
- `search_completed`
- `prebook_started`
- `prebook_completed`
- `book_completed`
- `booking_cancelled`

---

## 🎯 Best Practices

1. **תמיד בדוק תוקף PreBook** לפני Book
2. **הצג טיימר למשתמש** - הוא צריך לדעת שיש לו 30 דקות
3. **שמור את originalSearchParams** - למקרה שצריך לחפש שוב
4. **טפל באזהרות (warnings)** - זה לא שגיאות אבל חשוב להציג
5. **לוג הכל** - זה עוזר לדבג בעיות
6. **אל תשכח email confirmation** - נשלח אוטומטית אבל ודא שהוא הגיע

---

## 🔧 הגדרות נוספות

### שינוי זמן תוקף PreBook

```typescript
// ב-prebook-manager.ts שנה את:
private readonly PREBOOK_VALIDITY_MINUTES = 30
// ל:
private readonly PREBOOK_VALIDITY_MINUTES = 45
```

### שינוי מספר ניסיונות

```typescript
// ב-booking-retry-handler.ts שנה את:
private defaultConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
}
```

### השבתת Logging

```typescript
// ב-booking-logger.ts הוסף:
if (process.env.DISABLE_BOOKING_LOGS === 'true') {
  return
}
```

---

## 📈 Monitoring בפרודקשן

ניתן לשלוח את הלוגים לשירות ניטור חיצוני:

```typescript
// ב-booking-logger.ts
private sendToAnalytics(entry: BookingLogEntry): void {
  // שלח ל-Sentry
  Sentry.captureEvent({
    message: entry.eventType,
    level: entry.error ? 'error' : 'info',
    extra: entry
  })
  
  // שלח ל-Mixpanel
  mixpanel.track(entry.eventType, entry)
}
```
