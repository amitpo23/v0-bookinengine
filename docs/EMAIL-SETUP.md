# Email Integration Setup 📧

מערכת שליחת אימיילים אוטומטית עם React Email ו-Resend.

## תכונות

✅ **אימיילי אישור הזמנה** - אימייל מיידי עם פרטי ההזמנה
✅ **אימיילי ביטול** - הודעה על ביטול ההזמנה
✅ **תמיכה בעברית ואנגלית** - Templates דו-לשוניים
✅ **עיצוב מקצועי** - React Email components
✅ **ללא תלות** - לא דורש Prisma או database

## התקנה מהירה

### 1. התקן את ה-Dependencies

```bash
npm install resend @react-email/components @react-email/render
# או
yarn add resend @react-email/components @react-email/render
# או
pnpm add resend @react-email/components @react-email/render
```

### 2. הגדר Environment Variables

הוסף ל-`.env.local`:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration
FROM_EMAIL=bookings@youraitravelagent.com
FROM_NAME=Booking Engine
```

### 3. אמת את הדומיין ב-Resend

1. לך ל [Resend Dashboard](https://resend.com/domains)
2. לחץ על "Add Domain"
3. הזן את הדומיין שלך: `youraitravelagent.com`
4. הוסף את רשומות ה-DNS (SPF, DKIM, DMARC)
5. המתן לאימות (עד 48 שעות)

## שימוש בקוד

### שליחת אימייל אישור הזמנה

```typescript
import { emailService } from '@/lib/email/email-service'

// בקוד ההזמנה (app/api/booking/book/route.ts)
const result = await emailService.sendBookingConfirmation({
  to: guestDetails.email,
  customerName: guestDetails.firstName + ' ' + guestDetails.lastName,
  bookingId: data.bookingId,
  supplierReference: data.supplierReference || 'N/A',
  hotelName: hotelName,
  roomType: roomType,
  checkIn: dateFrom,
  checkOut: dateTo,
  nights: calculateNights(dateFrom, dateTo),
  adults: adults,
  children: children.length,
  totalPrice: totalPrice,
  currency: 'USD',
  hotelAddress: hotelAddress,
  hotelPhone: hotelPhone,
  cancellationPolicy: cancellationPolicy,
  language: 'he', // או 'en'
})

if (result.success) {
  console.log('Email sent successfully:', result.emailId)
} else {
  console.error('Failed to send email:', result.error)
}
```

### שליחת אימייל ביטול

```typescript
import { emailService } from '@/lib/email/email-service'

const result = await emailService.sendCancellationConfirmation({
  to: customerEmail,
  customerName: customerName,
  bookingId: bookingId,
  hotelName: hotelName,
  checkIn: checkIn,
  checkOut: checkOut,
  totalPrice: originalPrice,
  currency: 'USD',
  refundAmount: refundAmount,
  refundDate: estimatedRefundDate,
  cancellationReason: reason,
  language: 'he',
})
```

## בדיקה (Testing)

### 1. בדיקת Email בסביבת Development

אפשר להשתמש ב-Resend Test Mode:

```typescript
// הוסף ל-.env.local
RESEND_API_KEY=re_test_xxxxxxxxxxxx
```

כל האימיילים יישלחו ל-delivered@resend.dev

### 2. בדיקה ידנית

צור API endpoint לבדיקה:

```typescript
// app/api/test-email/route.ts
import { emailService } from '@/lib/email/email-service'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await emailService.sendBookingConfirmation({
    to: 'test@example.com',
    customerName: 'Test User',
    bookingId: 'TEST-123',
    supplierReference: 'HTL-456',
    hotelName: 'Test Hotel',
    roomType: 'Deluxe Room',
    checkIn: '2025-12-25',
    checkOut: '2025-12-28',
    nights: 3,
    adults: 2,
    children: 0,
    totalPrice: 450,
    currency: 'USD',
    language: 'he',
  })

  return NextResponse.json(result)
}
```

גש ל: `http://localhost:3000/api/test-email`

## קבצים שנוספו

```
v0-bookinengine/
├── emails/
│   ├── booking-confirmation.tsx       # Template אימייל אישור
│   └── cancellation-confirmation.tsx  # Template אימייל ביטול
├── lib/
│   └── email/
│       └── email-service.ts           # Email Service (Resend)
└── docs/
    └── EMAIL-SETUP.md                  # מסמך זה
```

## Troubleshooting

### "Email service not configured"

✅ ודא ש-`RESEND_API_KEY` מוגדר ב-`.env.local`  
✅ הפעל מחדש את שרת הפיתוח (`npm run dev`)

### "Domain not verified"

✅ ודא שהדומיין אומת ב-Resend Dashboard  
✅ בדוק שרשומות ה-DNS הוגדרו נכון  
✅ המתן עד 48 שעות לאימות מלא

### "Failed to send email"

✅ בדוק את ה-Logs ב-Resend Dashboard  
✅ ודא שכתובת האימייל תקינה  
✅ בדוק שלא עברת את ה-rate limit

## מחירים (Resend)

- **Free Tier**: 100 אימיילים ליום, 3,000 לחודש
- **Pro Plan**: $20/חודש - 50,000 אימיילים לחודש
- **Scale Plan**: מחירים מותאמים אישית

👉 [Resend Pricing](https://resend.com/pricing)

## שדרוגים עתידיים

🔄 Email Queue (עם Prisma)  
🔄 Email Analytics & Tracking  
🔄 Email Templates Editor  
🔄 WhatsApp Integration  
🔄 SMS Notifications

---

✅ **המערכת מוכנה לשימוש!**  
📧 כל הזמנה חדשה תשלח אימייל אוטומטית למזמין.

**שאלות?** פתח issue ב-GitHub או צור קשר עם התמיכה.
