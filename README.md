# 🏨 Hotel Booking Engine with Sunday Integration

*מערכת הזמנות מלונות מקצועית עם Medici Hotels API ורכיבי UI מתקדמים*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/guyofiror/v0-bookinengine)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

## 📖 Overview

מערכת הזמנות מלונות מלאה המבוססת על **Medici Hotels API** עם תהליך מלא של:
- 🔍 **Search** - חיפוש מלונות וחדרים
- ⏱️ **PreBook** - שמירת חדר למשך 30 דקות
- ✅ **Book** - הזמנה סופית עם אישור מיידי
- 🎨 **10 Templates** - ממשקי משתמש שונים לכל צורך
  - 🏨 **Hotel Booking**: NARA, Modern Dark, Luxury, Family, Scarlet, Sunday
  - 🤖 **AI Chat Platforms**: AI Travel Agent, ChatBot UI, Knowaachat
  - 🌟 **Hotel Showcase**: Sunday Hotels
- 🤖 **AI Chat** - בוט הזמנות חכם עם מספר engines
- 🏨 **Sunday Components** - 8 רכיבי UI מקצועיים לתצוגת חדרים

## ✨ Features

### Core Booking Engine
- ✅ אינטגרציה מלאה עם Medici Hotels API
- ✅ תמיכה ב-TypeScript מלאה
- ✅ React Hooks מובנים (`useBookingEngine`)
- ✅ RBAC (Role-Based Access Control)
- ✅ Real-time availability & pricing
- ✅ Multi-language support (EN/HE)
- 💳 Stripe payment integration
- 📅 Dynamic pricing calendar
- 🎯 Admin dashboard
- 📊 Analytics and reporting

### 🆕 Sunday Integration (NEW!)
- **8 Professional UI Components** for room display
- **Tavily API Integration** for web-based hotel enrichment
- **Advanced Image Galleries** with modal view
- **Smart Caching** for optimal performance (30-minute cache)
- **Enhanced Admin Panel** with room showcase
- **Full TypeScript Support** throughout
- ⭐ **Web Reviews Integration** via Tavily
- 🖼️ **Additional Images** from multiple sources
- 🏷️ **Star Ratings** extracted from web
- 🎨 **Amenities Display** with icon mapping
- 📍 **Location Information** and attractions

## 🚀 Quick Start

### Installation
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

# Open http://localhost:3000
```

### Environment Variables
Create `.env.local`:
```env
# Medici API (Required)
MEDICI_TOKEN=your_medici_api_token_here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net

# Database (Supabase - Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Tavily API (Optional - for enhanced hotel information via Sunday components)
TAVILY_API_KEY=your_tavily_api_key_here

# Google Trends & Flights (Optional - NEW!)
SERPAPI_KEY=your_serpapi_key_here                    # For both Trends + Flights
# OR use Amadeus for flights:
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
AMADEUS_API_URL=https://test.api.amadeus.com        # or production
FLIGHT_API_PROVIDER=amadeus                          # or 'serpapi'

# AI/LLM Providers (Optional)
OPENAI_API_KEY=your_openai_key                       # For GPT-4
ANTHROPIC_API_KEY=your_anthropic_key                 # For Claude
GROQ_API_KEY=your_groq_key                           # For Llama (Fast & Free!)
AI_PROVIDER=groq                                      # Default: groq
```

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

הפרויקט כולל 10 טמפלטים שונים המבוססים על פרויקטים אמיתיים:

### 🏨 Hotel Booking Templates
1. **Scarlet** - `/templates/scarlet` 🆕 - מלון בוטיק רומנטי ומודרני
2. **NARA** - `/templates/nara` - סגנון NARA Hotels מקצועי
3. **Modern Dark** - `/templates/modern-dark` - עיצוב כהה מינימליסטי
4. **Luxury** - `/templates/luxury` - יוקרתי ואלגנטי
5. **Family** - `/templates/family` - ידידותי למשפחות
6. **Sunday Professional** - `/templates/sunday` 🆕 - תצוגה מקצועית עם 8 רכיבי UI

### 🤖 AI Chat Platform Templates
7. **AI Travel Agent** - `/templates/ai-travel-agent` 🆕 - פלטפורמת סוכני נסיעות AI
8. **ChatBot UI** - `/templates/chatbot-ui` 🆕 - ממשק צ'אט קוד פתוח
9. **Knowaachat** - `/templates/knowaachat` 🆕 - מערכת ניהול ידע עם AI

### 🌟 Hotel Showcase Template
10. **Sunday Hotels** - `/templates/sunday-hotel` 🆕 - אתר הזמנת מלונות מלא

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
=======
# See .env.example for complete list
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

## 📦 What's New - Sunday Integration

### Components Added
- `HotelCard` - Professional room display cards
- `HotelResults` - Smart results with loading states
- `HotelImageGallery` - Responsive image galleries
- `HotelDetailsEnhanced` - Tavily-enriched information
- `HotelAmenities` - Amenities display with icons
- `HotelRating` - Star ratings component
- `HotelInfo` - Basic hotel information
- `HotelImageGalleryModal` - Full-screen image viewer

### Admin Panel Enhancement
New "תצוגת חדרים" tab with:
- Grid/List view modes
- Basic/Enhanced information tabs
- Real-time room selection
- Professional image galleries

## 📚 Documentation

### קבצי תיעוד מרכזיים:

1. **[SEARCH_PREBOOK_GUIDE.md](docs/SEARCH_PREBOOK_GUIDE.md)** - מדריך מלא לתהליך Search & PreBook
2. **[MEDICI_API_EXAMPLES.md](docs/MEDICI_API_EXAMPLES.md)** - דוגמאות אמיתיות מה-API
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - סיכום מקיף של הפרויקט
4. **[SUNDAY_INTEGRATION.md](docs/SUNDAY_INTEGRATION.md)** - מדריך אינטגרציית Sunday
5. **[TAVILY_INTEGRATION.md](docs/TAVILY_INTEGRATION.md)** - הגדרת Tavily API
6. **[GOOGLE_TRENDS_FLIGHTS_API.md](GOOGLE_TRENDS_FLIGHTS_API.md)** - 🆕 Google Trends & Flights API
7. **[PRIVACY_LAW_COMPLIANCE.md](PRIVACY_LAW_COMPLIANCE.md)** - תיקון 14 לחוק הגנת הפרטיות
5. **[TAVILY_INTEGRATION.md](docs/TAVILY_INTEGRATION.md)** - הגדרת Tavily API
6. **[VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)** - מדריך פריסה לפרודקשיין

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

### Using Sunday Components

```typescript
import { HotelResults, HotelDetailsEnhanced } from '@/components/hotels'

// Display hotel results
<HotelResults
  hotels={hotelData}
  searchQuery={searchQuery}
  onSelectHotel={handleSelect}
  isLoading={false}
/>

// Enhanced hotel details with Tavily
<HotelDetailsEnhanced 
  hotel={hotel} 
  city="Tel Aviv" 
/>
```

## 🎨 Templates

הפרויקט כולל 6 טמפלטים שונים:

1. **NARA** - `/templates/nara` - מודרני עם carousel
2. **Modern Dark** - `/templates/modern-dark` - עיצוב כהה מינימליסטי
3. **Luxury** - `/templates/luxury` - יוקרתי ואלגנטי
4. **Family** - `/templates/family` - ידידותי למשפחות
5. **Scarlet** - `/templates/scarlet` - מלון Scarlet עם גלריות תמונות
6. **Sunday** 🆕 - `/templates/sunday` - תצוגה מקצועית עם כל רכיבי Sunday + Tavily

## 🏗️ Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── hotels/       # Search endpoints
│   │   ├── booking/      # PreBook & Book endpoints
│   │   └── tavily/       # 🆕 Tavily integration
│   ├── templates/        # UI templates (5 templates)
│   ├── admin/            # Admin dashboard
│   └── ai-chat/          # AI chat interface
├── components/
│   ├── booking/          # Booking components
│   ├── hotels/           # 🆕 Sunday UI components (8 components)
│   │   ├── hotel-card.tsx
│   │   ├── hotel-results.tsx
│   │   ├── hotel-details-enhanced.tsx
│   │   └── ...
│   ├── ai-chat/          # AI chat assistant
│   └── ui/               # Shared UI components
├── hooks/
│   └── use-booking-engine.ts  # Main booking hook
├── lib/
│   ├── api/              # API clients
│   │   ├── medici-client.ts
│   │   └── medici-types.ts
│   ├── services/         # 🆕 External services
│   │   └── tavily-hotel-service.ts
│   ├── utils/            # 🆕 Utility functions
│   │   └── cancellation-policy.ts
│   └── rbac/             # RBAC system
├── docs/                 # Documentation
│   ├── SUNDAY_INTEGRATION.md
│   ├── TAVILY_INTEGRATION.md
│   └── VERCEL_DEPLOYMENT.md
└── scripts/              # Test scripts
```

## 🔄 How It Works

```
User → Search Form → API /api/hotels/search
                  ↓
            Medici API (GetInnstantSearchPrice)
                  ↓
            Display Results (with Sunday Components)
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
                  ↓
         Email Notification 📧
```

## 🔧 Development

### Build for Production
```bash
pnpm build
```

### Run Production Build
```bash
pnpm start
```

### Lint Code
```bash
pnpm lint
```

## 🚀 Deployment

הפרויקט פרוס אוטומטית ב-Vercel:
- **Production URL**: https://vercel.com/guyofiror/v0-bookinengine
- **Auto-deploy**: כל push ל-main גורם לפריסה אוטומטית
- **Preview**: כל PR מקבל preview deployment

### Manual Deploy
```bash
vercel --prod
```

## 🌟 Key Improvements

### Before Sunday Integration
- Basic hotel display
- Limited information
- Simple image handling
- No external enrichment

### After Sunday Integration
- ✅ Professional UI components
- ✅ Rich hotel information
- ✅ Advanced image galleries
- ✅ Web-based data enrichment via Tavily
- ✅ Smart caching (30 minutes)
- ✅ Enhanced admin panel
- ✅ 100% TypeScript
- ✅ Production ready

## 📊 Stats

- **Templates**: 5 booking templates
- **AI Engines**: 15+ pre-configured engines
- **Components**: 8 new Sunday hotel components
- **API Routes**: 30+ endpoints
- **Documentation**: 10+ comprehensive guides
- **TypeScript**: 100% coverage
- **Code Quality**: Zero breaking changes

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT

## 🆘 Support

- 📧 Email: support@example.com
- 📖 Docs: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/amitpo23/v0-bookinengine/issues)

---

**Built with ❤️ using Next.js 16, TypeScript, Medici Hotels API, and Sunday UI Components**
