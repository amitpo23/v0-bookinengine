# 🚀 Quick Start Guide - Booking Engine

## ✅ What's Already Done

- ✅ Prisma schema configured (12 models, 464 lines)
- ✅ Stripe payment integration complete
- ✅ Booking API routes created
- ✅ Email confirmation service ready
- ✅ `.env.local` created with placeholders
- ✅ `NEXTAUTH_SECRET` generated
- ✅ Database setup script ready

## 🎯 Complete Setup in 3 Steps

### Step 1: Update Environment Variables

Open `.env.local` and fill in these **REQUIRED** values:

#### 🗄️ Database (Supabase)
```bash
# Get from: https://supabase.com/dashboard
# Settings → Database → Connection string
# ⚠️ IMPORTANT: Choose "Transaction Mode" (not Session Mode)

DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### 💳 Stripe (Payment Processing)
```bash
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Get from: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 🏨 Medici API (Hotel Bookings)
```bash
MEDICI_TOKEN=your_existing_medici_token
```

### Step 2: Setup Database

Run the automated setup script:

```bash
./setup-database.sh
```

This will:
- Install `@prisma/client`
- Generate Prisma client code
- Create all 12 tables in your Supabase database:
  - `users` - User management with Google Auth
  - `hotels` - Hotel information
  - `rooms` - Room types and details
  - `room_availability` - Availability calendar
  - `bookings` - Booking records with payment status
  - `sessions` - User sessions
  - `activity_logs` - Activity tracking
  - `promotions` - Promo codes and discounts
  - `template_configs` - UI template settings
  - `knowledge_articles` - Help content
  - `system_guidelines` - System rules
  - `system_logs` - Error logging

### Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📊 Database Models Overview

### Core Booking Models
- **User**: Authentication, roles (USER, ADMIN, SUPER_ADMIN, HOTEL_MANAGER)
- **Hotel**: Hotel info + Medici integration
- **Room**: Room types with pricing and amenities
- **Booking**: Full booking lifecycle with payment tracking

### Payment & Status Enums
```typescript
enum BookingStatus {
  PENDING, CONFIRMED, CHECKED_IN, 
  CHECKED_OUT, CANCELLED, NO_SHOW
}

enum PaymentStatus {
  PENDING, PROCESSING, PAID, 
  FAILED, REFUNDED, PARTIALLY_REFUNDED
}
```

## 🔧 Verify Setup

After running `./setup-database.sh`, verify in Supabase:

1. Go to: **Table Editor** in Supabase Dashboard
2. You should see all 12 tables listed
3. Check the `users` table exists with correct schema

## 🛠️ Troubleshooting

### "Error: DATABASE_URL not configured"
- Make sure you updated `DATABASE_URL` in `.env.local`
- Use **Transaction Mode** connection string (port 6543)
- Include `?pgbouncer=true` at the end

### "Prisma Client generation failed"
```bash
npm install @prisma/client
npx prisma generate
```

### "Cannot connect to database"
- Verify DATABASE_URL format is correct
- Test connection in Supabase Dashboard → Database → Connection pooler
- Ensure your IP is not blocked (check Supabase settings)

### "Stripe webhook errors"
- For local development, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
- Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## 📚 Additional Documentation

- [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) - Deployment guide
- [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md) - Authentication setup
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Full project overview

## 🎉 You're Ready!

Once setup is complete, you can:
- ✅ Create user accounts
- ✅ Search for hotels (via Medici API)
- ✅ Make bookings
- ✅ Process payments with Stripe
- ✅ Send confirmation emails
- ✅ Track booking history

---

**Need help?** Check the documentation files or review the inline code comments.
