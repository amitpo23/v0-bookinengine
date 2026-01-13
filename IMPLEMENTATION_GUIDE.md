# 🚀 מנוע הזמנות מלונות - מערכת מקיפה

## ⚡ מה חדש - שיפורים שהוספו

### 🔐 אבטחה מתקדמת
- ✅ **Rate Limiting** - הגנה מפני DDoS (100 בקשות לדקה)
- ✅ **CSRF Protection** - הגנה מפני התקפות cross-site
- ✅ **Security Headers** - X-Frame-Options, CSP, וכו'
- ✅ **Input Validation** - Zod schemas לכל endpoint

### 🗄️ מסד נתונים
- ✅ **Prisma Schema** מלא עם:
  - Users, Hotels, Rooms, Bookings
  - Sessions, Activity Logs, System Logs
  - Promotions, Template Configs
  - Knowledge Base, System Guidelines
- ✅ PostgreSQL ready (Supabase)

### 🎨 UI/UX שיפורים
- ✅ **Error Boundary** - טיפול גלובלי בשגיאות
- ✅ **Skeleton Loaders** - 8 סוגי loaders שונים
- ✅ **Mobile Drawer** - תפריט מובייל מקצועי (vaul)
- ✅ **Toast Notifications** - במקום alerts (sonner)

### 🤖 AI מתקדם
- ✅ **AI Service** - תמיכה ב-3 ספקים:
  - OpenAI (GPT-4)
  - Anthropic (Claude)
  - Groq (Llama 3)
- ✅ **Universal LLM Integration**
- ✅ Embeddings support (OpenAI)

### 📊 Analytics
- ✅ **Analytics API** - נתונים בזמן אמת:
  - Revenue by day/week/month
  - Occupancy rates
  - Room type distribution
  - Booking sources
  - Guest demographics

### 🔄 API Routes חדשים
```
✅ POST   /api/bookings              - צור הזמנה
✅ GET    /api/bookings              - קבל הזמנות
✅ PATCH  /api/bookings              - עדכן הזמנה
✅ POST   /api/bookings/cancel       - בטל הזמנה
✅ GET    /api/bookings/cancel       - בדוק מדיניות ביטול
✅ POST   /api/ai/chat               - צ'אט AI (חדש)
✅ GET    /api/analytics/dashboard   - נתוני אנליטיקה
✅ GET    /api/system-logs           - לוגים טכניים
✅ POST   /api/system-logs           - צור לוג
✅ PATCH  /api/system-logs           - סמן לוג כפתור
```

### 📐 Validation מלא
- ✅ **30+ Zod Schemas**:
  - User, Hotel, Room, Booking
  - Promotion, Payment, Refund
  - AI Chat, Analytics
- ✅ Hebrew error messages
- ✅ Helper functions

### 🛠️ מערכות ניהול
- ✅ **Booking Management** - CRUD מלא
- ✅ **Cancellation System** - מדיניות ביטול חכמה:
  - 7+ ימים: החזר מלא (100%)
  - 3-7 ימים: החזר חלקי (50%)
  - 1-3 ימים: החזר חלקי (25%)
  - פחות מיום: ללא החזר
- ✅ **System Logs** - רישום אירועים טכניים

---

## 🏗️ מבנה הפרויקט

```
v0-bookinengine/
├── app/
│   ├── admin/                    # ממשק ניהול
│   │   ├── page.tsx             # דשבורד ראשי (+ ErrorBoundary, Drawer)
│   │   └── ...
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── route.ts         # ✨ CRUD הזמנות
│   │   │   └── cancel/
│   │   │       └── route.ts     # ✨ מערכת ביטולים
│   │   ├── ai/
│   │   │   └── chat/
│   │   │       └── route.ts     # ✨ AI Chat
│   │   ├── analytics/
│   │   │   └── dashboard/
│   │   │       └── route.ts     # ✨ Analytics
│   │   ├── system-logs/
│   │   │   └── route.ts         # ✨ System Logs
│   │   ├── auth/
│   │   ├── stripe/
│   │   └── ...
│   └── templates/                # 10 טמפלטים
│
├── components/
│   ├── error-boundary.tsx        # ✨ Error Boundary גלובלי
│   ├── ui/
│   │   ├── skeleton.tsx          # ✨ 8 Skeleton Loaders
│   │   └── drawer.tsx            # ✨ Mobile Drawer (vaul)
│   ├── admin/
│   │   ├── admin-drawer.tsx      # ✨ Admin Mobile Menu
│   │   ├── templates-management.tsx
│   │   ├── activity-logs-management.tsx
│   │   └── ...
│   └── ...
│
├── lib/
│   ├── ai/
│   │   └── ai-service.ts         # ✨ Universal LLM Service
│   ├── validations/
│   │   └── schemas.ts            # ✨ 30+ Zod Schemas
│   ├── api/
│   ├── email/
│   │   └── email-service.ts      # ✅ Resend integration
│   ├── auth.ts                   # ✅ NextAuth
│   └── ...
│
├── prisma/
│   └── schema.prisma             # ✨ Complete DB Schema
│
├── middleware.ts                 # ✨ Security Middleware
│
└── package.json

✨ = קבצים חדשים שנוספו
✅ = קבצים קיימים
```

---

## 🚦 התקנה והפעלה

### 1. התקן תלויות
```bash
npm install
# או
pnpm install
```

### 2. הגדר משתני סביבה
צור קובץ `.env.local`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI Providers (בחר אחד)
GROQ_API_KEY="..."              # מומלץ - מהיר וחינמי
OPENAI_API_KEY="..."            # GPT-4
ANTHROPIC_API_KEY="..."         # Claude
AI_PROVIDER="groq"              # groq | openai | anthropic

# Email (Resend)
RESEND_API_KEY="..."
FROM_EMAIL="bookings@yourdomain.com"

# Stripe (תשלומים)
STRIPE_SECRET_KEY="..."
STRIPE_PUBLISHABLE_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Medici API (אופציונלי)
MEDICI_API_URL="..."
MEDICI_USERNAME="..."
MEDICI_PASSWORD="..."

# Vercel Blob (תמונות)
BLOB_READ_WRITE_TOKEN="..."
```

### 3. הגדר מסד נתונים
```bash
# הרץ migrations
npx prisma migrate dev --name init

# יצר Prisma Client
npx prisma generate

# (אופציונלי) Seed data
npx prisma db seed
```

### 4. הרץ את השרת
```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) 🎉

---

## 📡 API Documentation

### Bookings API

#### צור הזמנה
```typescript
POST /api/bookings
{
  "roomId": "string",
  "hotelId": "string",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-20",
  "adults": 2,
  "children": 0,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+972501234567",
  "specialRequests": "Late check-in"
}
```

#### בטל הזמנה
```typescript
POST /api/bookings/cancel
{
  "bookingId": "booking-id",
  "reason": "Changed plans",
  "email": "john@example.com"
}
```

#### בדוק מדיניות ביטול
```typescript
GET /api/bookings/cancel?bookingId=xxx&checkIn=2026-02-15

Response:
{
  "refundPercentage": 100,
  "policy": "ביטול חינם - החזר מלא",
  "daysUntilCheckIn": 30
}
```

### AI Chat API

```typescript
POST /api/ai/chat
{
  "messages": [
    { "role": "user", "content": "אני מחפש חדר ל-2 לילות" }
  ],
  "sessionId": "session-123",
  "hotelId": "hotel-456"
}

Response:
{
  "success": true,
  "data": {
    "message": "בוודאי! באילו תאריכים תרצה להזמין?",
    "provider": "groq"
  }
}
```

### Analytics API

```typescript
GET /api/analytics/dashboard?period=month&hotelId=xxx

Response:
{
  "revenue": [...],
  "occupancy": [...],
  "metrics": {
    "totalRevenue": 421000,
    "occupancyRate": 78
  }
}
```

---

## 🔐 אבטחה

### Rate Limiting
```typescript
// middleware.ts
const RATE_LIMIT = {
  windowMs: 60 * 1000,    // 1 דקה
  maxRequests: 100,       // 100 בקשות
}
```

### CSRF Protection
כל בקשות POST/PUT/DELETE/PATCH נבדקות עבור:
- Same-origin policy
- CSRF token (בפרודקשן)

### Validation
כל endpoint משתמש ב-Zod schemas:
```typescript
import { bookingSchema } from '@/lib/validations/schemas'

const validation = bookingSchema.safeParse(body)
if (!validation.success) {
  return error response
}
```

---

## 🎯 טמפלטים זמינים

1. **Nara** - מינימליסטי ומודרני
2. **Modern Dark** - עיצוב כהה
3. **Luxury** - יוקרתי
4. **Family** - משפחתי
5. **Scarlet** - צבעוני
6. **Sunday** - מקצועי עם 8 קומפוננטות
7. **Sunday Hotel** - גרסה מורחבת
8. **KnowAChat** - מבוסס צ'אט
9. **Chatbot UI** - ממשק צ'אט
10. **AI Travel Agent** - סוכן נסיעות AI

כל טמפלט ניתן להטמעה באתר עם iframe או widget.

---

## 📦 חבילות מותקנות

### Core
- **Next.js 16.0.10** - React framework
- **React 19.2.0** - UI library
- **TypeScript** - Type safety

### UI
- **Radix UI** - Headless components
- **Tailwind CSS 4.1.9** - Styling
- **Framer Motion** - Animations
- **Vaul** - Drawer component
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Database & Auth
- **Prisma** - ORM (ready to use)
- **NextAuth.js** - Authentication
- **Supabase** - Database & storage

### AI
- **OpenAI** - GPT models (optional)
- **Anthropic SDK** - Claude (optional)
- **Groq SDK** - Fast inference (optional)

### Payments
- **Stripe** - Payment processing
- **@stripe/react-stripe-js** - Stripe components

### Email
- **Resend** - Email service
- **React Email** - Email templates

### Analytics
- **@vercel/analytics** - Vercel Analytics
- **Recharts** - Charts

### Utils
- **date-fns** - Date utilities
- **clsx** - Class names
- **SWR** - Data fetching

---

## 🧪 בדיקות

```bash
# API tests
npm run test:api

# E2E tests (TODO)
npm run test:e2e
```

---

## 📚 תיעוד נוסף

- [AUTHENTICATION.md](./AUTHENTICATION.md) - מערכת אימות
- [EMAIL_INTEGRATION.md](./EMAIL_INTEGRATION.md) - אינטגרציית מיילים
- [RBAC_README.md](./RBAC_README.md) - הרשאות
- [docs/SUNDAY_INTEGRATION.md](./docs/SUNDAY_INTEGRATION.md) - טמפלט Sunday

---

## 🚀 פריסה (Deployment)

### Vercel (מומלץ)
```bash
vercel deploy
```

הגדר את כל משתני הסביבה ב-Vercel Dashboard.

### Docker
```bash
docker build -t booking-engine .
docker run -p 3000:3000 booking-engine
```

---

## 🐛 דיבאג

### בעיות נפוצות

**AI לא עובד:**
```bash
# בדוק שהגדרת API key
echo $GROQ_API_KEY  # או OPENAI_API_KEY

# בדוק ב-console
AI Service initialized: groq
```

**Database errors:**
```bash
# הרץ migrations
npx prisma migrate dev

# איפוס DB (זהירות!)
npx prisma migrate reset
```

**Rate limit errors:**
```typescript
// הגדל את הלימיט ב-middleware.ts
const RATE_LIMIT = {
  maxRequests: 200,  // הגדל ל-200
}
```

---

## 🤝 תרומה

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 רישיון

MIT License

---

## 👨‍💻 מפתח

נבנה עם ❤️ על ידי GitHub Copilot + Claude Sonnet 4.5

---

## 📞 תמיכה

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our server](#)
- 📖 Docs: [docs.yourdomain.com](#)

---

**מערכת מוכנה לפרודקשן! 🎉**
