# 🚀 Feature Flags Management System

## מערכת ניהול תכונות לפי הרשאות אדמין

המערכת מאפשרת לאדמין לבחור אילו תכונות להפעיל או לכבות לכל טמפלט או ל-AI Agent.

---

## 📋 מה נוסף?

### 1. **30+ תכונות להפעלה/כיבוי:**

#### 📧 **Notifications** (התראות)
- ✉️ Email Notifications - אישורי הזמנה באימייל
- 💬 SMS Notifications - עדכונים ב-SMS (Premium)
- 🔔 Push Notifications - התראות דפדפן
- ⏰ Booking Reminders - תזכורות לפני check-in

#### 💰 **Pricing** (תמחור)
- 💵 Price Alerts - התראה כשמחיר יורד
- 📈 Price History - גרפים של מגמת מחיר (Premium)
- 🎯 Best Time to Book - המלצות AI לזמן הזמנה

#### ⭐ **Reviews** (ביקורות)
- 📝 Reviews System - ביקורות משתמשים
- 📸 Photo Uploads - העלאת תמונות
- 📊 Rating Aggregation - צבירת דירוגים (Google, TripAdvisor)

#### 🗺️ **Location** (מיקום)
- 🌍 Google Maps - מפה אינטראקטיבית
- 🏛️ Nearby Attractions - אטרקציות בקרבת מקום
- 👁️ Street View - תצוגת רחוב

#### 🎁 **Loyalty** (נאמנות)
- 🏆 Loyalty Program - נקודות ותגמולים
- 💵 Cashback - החזר כספי (Premium)
- 🤝 Referral Program - תוכנית המלצות

#### 🏨 **Booking** (הזמנות)
- 👥 Group Bookings - הזמנות קבוצתיות
- 💳 Split Payment - פיצול תשלום (Premium)
- ✏️ Booking Modification - עריכת הזמנה
- ⬆️ Room Upgrade - שדרוג חדר
- 🏨 Multi-Room Booking - מספר חדרים בעסקה אחת
- 📱 QR Check-in - צ'ק-אין ללא מגע

#### 📊 **Analytics** (אנליטיקס)
- 📈 Advanced Analytics - אנליטיקה מפורטת (Premium)
- 📄 Export to PDF - ייצוא דוחות
- 🔄 Real-time Updates - עדכונים בזמן אמת

#### 💬 **Support** (תמיכה)
- 💬 Live Chat Support - תמיכת צ'אט 24/7

#### 🌐 **Localization** (לוקליזציה)
- 🌍 Multilingual Support - תמיכה בשפות נוספות
- 💱 Currency Converter - המרת מטבעות

#### ✈️ **Travel Info** (מידע נסיעה)
- 🌤️ Weather Information - תחזית מזג אוויר
- 🎉 Local Events - אירועים מקומיים
- 🚇 Transportation Info - מידע תחבורה

---

## 🎨 **4 טמפלטים + AI Agent**

כל אחד יכול להיות עם תכונות שונות:

### 🖼️ **NARA Template** (קרוסלה)
- תכונות דיפולט: Email, Booking Reminders

### 🌑 **Modern Dark Template** (מינימליסטי)
- תכונות דיפולט: Email, Google Maps

### 💎 **Luxury Template** (אלגנטי)
- תכונות דיפולט: Email, Reviews, Maps, Loyalty

### 👨‍👩‍👧 **Family Template** (משפחתי)
- תכונות דיפולט: Email, Maps, Nearby Attractions, Weather

### 🤖 **AI Booking Assistant**
- תכונות דיפולט: Email, Price Alerts, Reviews, Maps, Weather

---

## 🔧 איך זה עובד?

### 1. **Admin Dashboard:**
```
/admin/features
```
- לחץ על הטאב של הטמפלט או AI
- הפעל/כבה תכונות עם Toggle Switch
- שמור את השינויים

### 2. **שימוש בטמפלט:**

```tsx
import { FeatureWrapper } from '@/components/features/feature-components';

// תציג מפה רק אם Feature מופעל
<FeatureWrapper featureId="google-maps" templateId="nara">
  <GoogleMap hotelLocation={hotel.location} />
</FeatureWrapper>
```

### 3. **בדיקה אם Feature מופעל:**

```tsx
import { useFeature } from '@/lib/features-context';

const isMapEnabled = useFeature('google-maps', 'template', 'nara');

if (isMapEnabled) {
  // הצג מפה
}
```

### 4. **קבלת רשימת Features:**

```tsx
import { useFeatures } from '@/lib/features-context';

const { getEnabledFeatures } = useFeatures();
const enabledFeatures = getEnabledFeatures('template', 'nara');

console.log('NARA has:', enabledFeatures);
// ['email-notifications', 'booking-reminders']
```

---

## 📚 דוגמאות לשימוש:

### דוגמה 1: מפה בעמוד מלון
```tsx
<HotelMapFeature hotelId="123" templateId="nara" />
```
- אם Feature מופעל → תראה Google Map
- אם לא → לא יופיע כלום

### דוגמה 2: ביקורות
```tsx
<ReviewsFeature hotelId="123" templateId="luxury" />
```
- אם Feature מופעל → תראה כוכבים וביקורות
- אם לא → לא יופיע כלום

### דוגמה 3: התראות מחיר
```tsx
<PriceAlertFeature hotelId="123" templateId="modern-dark" />
```
- אם Feature מופעל → כפתור "הפעל התראות"
- אם לא → לא יופיע כלום

### דוגמה 4: תוכנית נאמנות
```tsx
<LoyaltyProgramFeature templateId="luxury" />
```
- אם Feature מופעל → באנר "הצטרף לתוכנית הנאמנות"
- אם לא → לא יופיע כלום

---

## 🔐 הרשאות:

- **USER/AGENT:** לא רואים את עמוד ניהול Features
- **ADMIN/SUPER_ADMIN:** גישה מלאה לניהול Features

---

## 💾 שמירת הגדרות:

1. **LocalStorage** - שמירה זמנית בדפדפן
2. **API** - `/api/admin/features` (TODO: חיבור ל-Supabase)

---

## 🎯 יתרונות:

✅ **גמישות** - כל טמפלט עם תכונות שונות  
✅ **בקרה מלאה** - אדמין מחליט מה להציג  
✅ **קל לשימוש** - Toggle פשוט  
✅ **Premium Features** - תכונות בתשלום  
✅ **API Requirements** - התראה על APIs נדרשים  
✅ **Real-time** - שינויים מיידיים  

---

## 📦 הקבצים החדשים:

```
types/
  └── features.ts                     // טיפוסים + רשימת כל התכונות

lib/
  └── features-context.tsx            // Context Provider + Hooks

components/
  ├── admin/
  │   └── features-management.tsx    // UI לניהול Features
  └── features/
      └── feature-components.tsx     // דוגמאות לשימוש

app/
  ├── admin/features/
  │   └── page.tsx                   // עמוד Admin
  ├── api/admin/features/
  │   └── route.ts                   // API endpoints
  └── layout.tsx                     // + FeaturesProvider
```

---

## 🚀 השלבים הבאים:

1. ✅ מערכת Feature Flags - **הושלם!**
2. ✅ Email System (Resend) - **מחובר ומוכן!**
3. ⏳ חיבור ל-Supabase לשמירת הגדרות Features
4. ⏳ יישום תכונות נוספות:
   - Google Maps Integration
   - Reviews System
   - Payment Split (Stripe)
   - Weather API
   - etc.

---

## 📖 תיעוד נוסף:

- [types/features.ts](types/features.ts) - רשימה מלאה של כל התכונות
- [lib/features-context.tsx](lib/features-context.tsx) - Context API
- [components/features/feature-components.tsx](components/features/feature-components.tsx) - דוגמאות שימוש

---

**האדמין עכשיו יכול לבחור בדיוק אילו תכונות יהיו בכל טמפלט או ב-AI!** 🎉
