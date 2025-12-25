# 🏨 Hotel Booking Engine

*מערכת הזמנות מלונות מקצועית עם Medici Hotels API*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/guyofiror/v0-bookinengine)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/jDc2y7W56zw)

## 📖 Overview

מערכת הזמנות מלונות מלאה המבוססת על **Medici Hotels API** עם תהליך מלא של:
- 🔍 **Search** - חיפוש מלונות וחדרים
- ⏱️ **PreBook** - שמירת חדר למשך 30 דקות
- ✅ **Book** - הזמנה סופית עם אישור מיידי
- 🎨 **4 Templates** - ממשקי משתמש שונים
- 🤖 **AI Chat** - בוט הזמנות חכם

### 🚀 תכונות מרכזיות
- ✅ אינטגרציה מלאה עם Medici Hotels API
- ✅ תמיכה ב-TypeScript מלאה
- ✅ React Hooks מובנים (`useBookingEngine`)
- ✅ RBAC (Role-Based Access Control)
- ✅ Real-time availability & pricing
- ✅ Multi-language support (EN/HE)

## Deployment

Your project is live at:

**[https://vercel.com/guyofiror/v0-bookinengine](https://vercel.com/guyofiror/v0-bookinengine)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/jDc2y7W56zw](https://v0.app/chat/jDc2y7W56zw)**

## 📚 Documentation

### קבצי תיעוד מרכזיים:

1. **[SEARCH_PREBOOK_GUIDE.md](docs/SEARCH_PREBOOK_GUIDE.md)** - מדריך מלא לתהליך Search & PreBook
   - ארכיטקטורה
   - דוגמאות קוד
   - שאלות נפוצות

2. **[MEDICI_API_EXAMPLES.md](docs/MEDICI_API_EXAMPLES.md)** - דוגמאות אמיתיות מה-API
   - Request/Response מפורטים
   - Error handling
   - Best practices

3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - סיכום מקיף של הפרויקט
   - כל התכונות
   - מבנה הקבצים
   - היסטוריית פיתוח

4. **[API_MIGRATION_NOTES.md](API_MIGRATION_NOTES.md)** - הערות מעבר ל-Aether Authentication

## 🚀 Quick Start

### התקנה

```bash
# Clone the repository
git clone https://github.com/amitpo23/v0-bookinengine.git
cd v0-bookinengine

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Medici API credentials

# Run development server
pnpm dev
```

### בדיקות

```bash
# Test search API
pnpm tsx scripts/test-search-only.ts

# Test full booking flow
pnpm tsx scripts/test-real-flow.ts

# Test with real Medici API
pnpm tsx scripts/test-medici-search.ts
```

## 💻 Usage Example

```typescript
import { useBookingEngine } from '@/hooks/use-booking-engine'

export default function BookingPage() {
  const booking = useBookingEngine()

  // 1. Search
  await booking.searchHotels({
    checkIn: new Date('2025-12-11'),
    checkOut: new Date('2025-12-12'),
    adults: 2,
    children: [],
    hotelName: 'Dizengoff Inn'
  })

  // 2. Select room (includes PreBook)
  await booking.selectRoom(hotel, room)

  // 3. Set guest info
  booking.setGuestInfo({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+972501234567'
  })

  // 4. Complete booking
  await booking.completeBooking()
  
  // Success!
  console.log('Booking ID:', booking.bookingConfirmation.bookingId)
}
```

## 🎨 Templates

הפרויקט כולל 4 טמפלטים שונים:

1. **NARA** - `/templates/nara` - מודרני עם carousel
2. **Modern Dark** - `/templates/modern-dark` - עיצוב כהה מינימליסטי
3. **Luxury** - `/templates/luxury` - יוקרתי ואלגנטי
4. **Family** - `/templates/family` - ידידותי למשפחות

## 🔑 Environment Variables

```env
# Medici API
MEDICI_TOKEN=your-jwt-token-here
MEDICI_APP_KEY=your-app-key-here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net

# Supabase (for auth & database)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🏗️ Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── hotels/       # Search endpoints
│   │   └── booking/      # PreBook & Book endpoints
│   ├── templates/        # UI templates
│   └── admin/            # Admin dashboard
├── components/
│   ├── booking/          # Booking components
│   ├── ai-chat/          # AI chat assistant
│   └── ui/               # Shared UI components
├── hooks/
│   └── use-booking-engine.ts  # Main booking hook
├── lib/
│   ├── api/              # API clients
│   │   ├── medici-client.ts
│   │   └── medici-types.ts
│   └── rbac/             # RBAC system
├── docs/                 # Documentation
└── scripts/              # Test scripts
```

## 🔄 How It Works

```
User → Search Form → API /api/hotels/search
                  ↓
            Medici API (GetInnstantSearchPrice)
                  ↓
            Display Results
                  ↓
      User Selects Room → API /api/booking/prebook
                  ↓
            Medici API (pre-book)
            [Valid for 30 minutes]
                  ↓
       User Fills Details
                  ↓
       User Confirms → API /api/booking/book
                  ↓
            Medici API (book)
                  ↓
         Booking Confirmed ✅
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT

## 🆘 Support

- 📧 Email: support@example.com
- 📖 Docs: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/amitpo23/v0-bookinengine/issues)
