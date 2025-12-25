# 🎯 מדריך מערכות: קודי פרומו, מועדון לקוחות ו-Affiliate Tracking

## סקירה כללית

המערכת כוללת 3 מערכות משולבות:
1. **קודי פרומו** - הנחות עם מגבלות שימוש
2. **מועדון לקוחות** - 4 דרגות חברות עם הנחות אוטומטיות
3. **Affiliate Tracking** - מעקב אחר מקורות הפניה והמרות

---

## 📊 מבנה Database

### טבלאות (ב-Supabase)

#### 1. `promo_codes`
```sql
- id (uuid)
- code (text, unique) - הקוד עצמו (אותיות גדולות)
- description (text) - תיאור הקוד
- discount_type (text) - 'percentage' או 'fixed'
- discount_value (numeric) - אחוז או סכום
- min_purchase_amount (numeric, nullable)
- max_discount_amount (numeric, nullable)
- usage_limit (int, nullable)
- usage_count (int, default: 0)
- valid_from (timestamp)
- valid_until (timestamp, nullable)
- is_active (boolean, default: true)
- applicable_templates (text[], nullable)
```

#### 2. `loyalty_members`
```sql
- id (uuid)
- user_id (uuid, nullable) - קישור ל-users table
- email (text, unique)
- first_name (text)
- last_name (text)
- phone (text)
- membership_tier (text) - 'bronze', 'silver', 'gold', 'platinum'
- discount_percentage (numeric) - 5, 10, 15, 20
- points (int, default: 0)
- total_bookings (int, default: 0)
- total_spent (numeric, default: 0)
- last_booking_at (timestamp)
- is_active (boolean, default: true)
```

**דרגות חברות:**
- 🥉 Bronze: 5% הנחה (ברירת מחדל)
- 🥈 Silver: 10% הנחה (מעל 2,000₪)
- 🥇 Gold: 15% הנחה (מעל 5,000₪)
- 💎 Platinum: 20% הנחה (מעל 10,000₪)

#### 3. `affiliate_tracking`
```sql
- id (uuid)
- session_id (text, unique)
- utm_source (text)
- utm_medium (text)
- utm_campaign (text)
- utm_term (text)
- utm_content (text)
- referrer_url (text)
- landing_page (text)
- affiliate_code (text)
- booking_id (uuid, nullable)
- converted (boolean, default: false)
- conversion_value (numeric)
- commission_amount (numeric)
- commission_rate (numeric)
- ip_address (text)
- user_agent (text)
- device_type (text)
- browser (text)
- country (text)
- city (text)
- converted_at (timestamp)
```

#### 4. `promo_code_usage`
```sql
- id (uuid)
- promo_code_id (uuid) - FK to promo_codes
- booking_id (uuid)
- user_email (text)
- discount_amount (numeric)
- order_amount (numeric)
- used_at (timestamp)
```

### Trigger אוטומטי
**update_loyalty_tier()** - משדרג אוטומטית את דרגת החברות לפי סכום ההוצאה:
- Silver: ≥2,000₪
- Gold: ≥5,000₪
- Platinum: ≥10,000₪

---

## 🔌 API Routes

### Promo Codes

#### POST `/api/promo/validate`
בדיקת תקינות קוד פרומו
```typescript
Request: {
  code: string
  orderAmount: number
  template?: string
}

Response: {
  valid: boolean
  promoCode?: {
    id: string
    code: string
    description: string
    discountType: string
    discountValue: number
    discountAmount: number
  }
  newTotal?: number
  error?: string
}
```

#### POST `/api/promo/redeem`
מימוש קוד פרומו (אחרי הזמנה מוצלחת)
```typescript
Request: {
  promoCodeId: string
  bookingId: string
  userEmail?: string
  discountAmount: number
  orderAmount: number
}

Response: {
  success: boolean
}
```

### Loyalty Club

#### POST `/api/loyalty/join`
הרשמה למועדון לקוחות
```typescript
Request: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

Response: {
  success: boolean
  member: {
    id: string
    membership_tier: string
    discount_percentage: number
  }
  message?: string
  alreadyMember?: boolean
}
```

#### POST `/api/loyalty/check`
בדיקת סטטוס חבר מועדון
```typescript
Request: {
  email: string
}

Response: {
  isMember: boolean
  member?: {
    id: string
    email: string
    firstName: string
    lastName: string
    tier: string
    discount: number
    points: number
    totalBookings: number
  }
}
```

#### POST `/api/loyalty/update-booking`
עדכון פרטי חבר אחרי הזמנה (נקודות, סכום כולל, שדרוג דרגה)
```typescript
Request: {
  email: string
  bookingAmount: number
}

Response: {
  success: boolean
  member: {
    // updated member data with new tier if upgraded
  }
}
```

### Affiliate Tracking

#### POST `/api/affiliate/track`
מעקב אחר מקור הפניה (נקרא אוטומטית מ-AffiliateTracker)
```typescript
Request: {
  sessionId: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  referrerUrl?: string
  landingPage?: string
  affiliateCode?: string
}

Response: {
  success: boolean
  trackingId: string
}
```

#### POST `/api/affiliate/convert`
רישום המרה (נקרא אחרי הזמנה מוצלחת)
```typescript
Request: {
  sessionId: string
  bookingId: string
  conversionValue: number
  commissionRate?: number
}

Response: {
  success: boolean
}
```

---

## 🎨 UI Components

### 1. `<PromoCodeInput>`
קומפוננטה להזנת קוד פרומו

```tsx
import { PromoCodeInput } from "@/components/booking/PromoCodeInput"

<PromoCodeInput
  orderAmount={1500}
  template="modern-dark"
  onApply={(discount) => {
    console.log("Promo applied:", discount)
    // Update total price
  }}
  onRemove={() => {
    console.log("Promo removed")
    // Reset to original price
  }}
  appliedCode={appliedPromo} // optional, shows applied state
/>
```

**Features:**
- ✅ Validation אוטומטית
- ✅ הצגת שגיאות בעברית
- ✅ חישוב הנחה אוטומטי
- ✅ התראה על חיסכון
- ✅ אפשרות להסרת קוד

### 2. `<LoyaltySignup>`
מודל להרשמה למועדון לקוחות

```tsx
import { LoyaltySignup } from "@/components/booking/LoyaltySignup"

const [showLoyalty, setShowLoyalty] = useState(false)

<LoyaltySignup
  open={showLoyalty}
  onOpenChange={setShowLoyalty}
  onJoined={(member) => {
    console.log("Member joined:", member)
    // Apply member discount
  }}
  email={userEmail} // optional pre-fill
  firstName={firstName}
  lastName={lastName}
  phone={phone}
/>
```

**Features:**
- ✅ הצגת כל 4 הדרגות
- ✅ רשימת יתרונות
- ✅ טופס הרשמה מלא
- ✅ עיצוב מודרני עם גרדיאנטים
- ✅ מעקב GA4 אוטומטי

### 3. `<LoyaltyBadge>`
תג המציג את דרגת החברות

```tsx
import { LoyaltyBadge } from "@/components/booking/LoyaltyBadge"

<LoyaltyBadge
  tier="gold"
  discount={15}
  points={3450}
  className="mb-4"
/>
```

**Features:**
- ✅ צבעים ייחודיים לכל דרגה
- ✅ אייקונים מתאימים
- ✅ הצגת אחוז הנחה ונקודות

---

## 📈 Google Analytics 4

### Setup
הוסף ל-`.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Events נתמכים

#### E-commerce Events
```typescript
import * as ga from "@/lib/analytics/google-analytics"

// Search results viewed
ga.trackSearchResults({
  searchTerm: "תל אביב",
  checkIn: "2025-01-15",
  checkOut: "2025-01-17",
  guests: 2,
  resultsCount: 15
})

// Room viewed
ga.trackViewItem({
  itemId: "room-123",
  itemName: "Superior Room",
  itemCategory: "Hotel Rooms",
  price: 500
})

// Room selected
ga.trackSelectRoom({
  itemId: "room-123",
  itemName: "Superior Room",
  itemCategory: "Hotel Rooms",
  price: 1000,
  nights: 2
})

// Checkout started
ga.trackBeginCheckout({
  value: 1000,
  items: [{ itemId: "room-123", itemName: "Superior Room", price: 500, quantity: 2 }]
})

// Payment info added
ga.trackAddPaymentInfo({
  value: 1000,
  paymentType: "credit_card"
})

// Purchase completed
ga.trackPurchase({
  transactionId: "booking-456",
  value: 850,
  items: [{ itemId: "room-123", itemName: "Superior Room", itemCategory: "Hotel", price: 500, quantity: 2 }],
  promoCode: "SUMMER20",
  loyaltyDiscount: 150
})
```

#### Custom Events
```typescript
// Promo code applied
ga.trackPromoCodeApplied({
  code: "SUMMER20",
  discountAmount: 200,
  discountType: "percentage"
})

// Loyalty club joined
ga.trackLoyaltyJoin({ tier: "bronze" })

// Filter applied
ga.trackFilterApplied({
  filterType: "board_basis",
  filterValue: ["BB", "HB"]
})

// Sort changed
ga.trackSortChanged({ sortBy: "price_asc" })

// AI chat interaction
ga.trackAIChatMessage({
  messageType: "user",
  intent: "search_hotels"
})

// Template viewed
ga.trackTemplateView({ templateName: "modern-dark" })
```

---

## 🔄 Integration Flow

### תהליך הזמנה מלא עם כל המערכות

```typescript
// 1. בדיקת חבר מועדון (בעמוד פרטי אורח)
const checkLoyalty = async (email: string) => {
  const res = await fetch("/api/loyalty/check", {
    method: "POST",
    body: JSON.stringify({ email })
  })
  const data = await res.json()
  if (data.isMember) {
    // Apply member discount
    setMemberDiscount(data.member.discount)
  }
}

// 2. בדיקת קוד פרומו (בעמוד תשלום)
const applyPromo = async (code: string) => {
  const res = await fetch("/api/promo/validate", {
    method: "POST",
    body: JSON.stringify({
      code,
      orderAmount: totalPrice,
      template: currentTemplate
    })
  })
  const data = await res.json()
  if (data.valid) {
    // Update total
    setPromoDiscount(data.promoCode.discountAmount)
    setFinalTotal(data.newTotal)
  }
}

// 3. השלמת הזמנה
const completeBooking = async () => {
  // Create booking
  const booking = await createBooking(...)
  
  // Track GA4 purchase
  ga.trackPurchase({
    transactionId: booking.id,
    value: finalTotal,
    items: [...],
    promoCode: appliedPromo?.code,
    loyaltyDiscount: memberDiscount
  })
  
  // Redeem promo code
  if (appliedPromo) {
    await fetch("/api/promo/redeem", {
      method: "POST",
      body: JSON.stringify({
        promoCodeId: appliedPromo.id,
        bookingId: booking.id,
        userEmail: email,
        discountAmount: promoDiscount,
        orderAmount: totalPrice
      })
    })
  }
  
  // Update loyalty member
  if (isMember) {
    await fetch("/api/loyalty/update-booking", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        bookingAmount: finalTotal
      })
    })
  }
  
  // Track affiliate conversion
  const trackingData = localStorage.getItem("affiliate_tracking")
  if (trackingData) {
    const { sessionId } = JSON.parse(trackingData)
    await fetch("/api/affiliate/convert", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        bookingId: booking.id,
        conversionValue: finalTotal,
        commissionRate: 10 // 10% commission
      })
    })
  }
}
```

---

## 🛠️ Setup Instructions

### 1. הרץ את ה-SQL Schema
```bash
# Connect to Supabase and run:
psql -h <your-supabase-host> -U postgres -d postgres < scripts/04-promo-loyalty-affiliate.sql
```

או דרך Supabase Dashboard:
1. SQL Editor → New Query
2. העתק את התוכן מ-`scripts/04-promo-loyalty-affiliate.sql`
3. Run

### 2. הגדר משתני סביבה
```env
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. צור קוד פרומו לדוגמה (דרך SQL)
```sql
INSERT INTO promo_codes (code, description, discount_type, discount_value, valid_from, usage_limit)
VALUES 
  ('WELCOME10', 'הנחת פתיחה 10%', 'percentage', 10, NOW(), 100),
  ('SUMMER50', 'הנחה קבועה 50₪', 'fixed', 50, NOW(), NULL);
```

### 4. בדוק את המערכות
```bash
# Test promo validation
curl -X POST http://localhost:3000/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10","orderAmount":1000}'

# Test loyalty join
curl -X POST http://localhost:3000/api/loyalty/join \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test"}'

# Test affiliate tracking
curl -X POST http://localhost:3000/api/affiliate/track \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123","utmSource":"google","utmMedium":"cpc"}'
```

---

## 📊 Admin Dashboard (Coming Next)

השלב הבא - פאנל אדמין לניהול:
- 📋 קודי פרומו (יצירה, עריכה, מחיקה, צפייה בשימוש)
- 👥 חברי מועדון (צפייה, חיפוש, שדרוג ידני)
- 🔗 Affiliate Analytics (דשבורד עם גרפים, המרות, ROI)

---

## 🔐 Security Notes

- ✅ RLS Policies מוגדרות על כל הטבלאות
- ✅ קודי פרומו נבדקים server-side בלבד
- ✅ חברי מועדון לא יכולים לערוך את הדרגה שלהם
- ✅ Affiliate tracking לא חושף מידע אישי
- ✅ Commission rates מוגדרים server-side בלבד

---

## 📝 Notes

- קודי פרומו לא case-sensitive (מומרים אוטומטית לאותיות גדולות)
- חברי מועדון משודרגים אוטומטית בעת הזמנה
- Affiliate tracking עובד אוטומטית דרך URL parameters
- GA4 events נשלחים רק אם הוגדר `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- כל המערכות עובדות ללא תלות אחת בשנייה

---

**נוצר:** 25 דצמבר 2025  
**גרסה:** 1.0.0
