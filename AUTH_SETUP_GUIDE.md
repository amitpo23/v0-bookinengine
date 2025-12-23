# User Authentication & Profile Management Setup Guide

## Overview
This guide explains how to set up user authentication with Google OAuth, user profiles, and booking history.

## Features
- Optional user authentication (no signup required for booking)
- Google OAuth login
- User profile with saved details (name, email, phone, address)
- Auto-fill booking form with user profile data
- Personal dashboard to view booking history
- Supabase for user data storage

## Step 1: Install Required Packages

```bash
npm install next-auth@latest @auth/core @supabase/supabase-js
```

## Step 2: Setup Supabase

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note down:
   - Project URL
   - Anon/Public Key
   - Service Role Key (for admin operations)

### 2.2 Create Users Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  google_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  booking_reference TEXT UNIQUE NOT NULL,
  hotel_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests JSONB,
  total_price NUMERIC(10,2),
  status TEXT DEFAULT 'confirmed',
  booking_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
```

## Step 3: Setup Google OAuth

### 3.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://www.youraitravelagent.com/api/auth/callback/google` (production)
7. Note down:
   - Client ID
   - Client Secret

## Step 4: Environment Variables

Add to `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=https://www.youraitravelagent.com
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Step 5: File Structure

Create these files:

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          # NextAuth handler
│   ├── user/
│   │   ├── profile/
│   │   │   └── route.ts          # Get/Update user profile
│   │   └── bookings/
│   │       └── route.ts          # Get user bookings
│   └── bookings/
│       └── create/
│           └── route.ts          # Create booking (link to user)
├── my-account/
│   └── page.tsx                  # User dashboard
lib/
├── auth.ts                       # NextAuth config
├── supabase.ts                   # Supabase client
components/
└── auth/
    ├── login-button.tsx          # Google login button
    ├── user-menu.tsx             # User menu in header
    └── profile-form.tsx          # Edit profile form
```

## Step 6: Implementation Order

1. ✅ Install packages
2. ✅ Setup Supabase database
3. ✅ Configure Google OAuth
4. ✅ Add environment variables
5. Create `lib/supabase.ts` - Supabase client
6. Create `lib/auth.ts` - NextAuth configuration
7. Create `app/api/auth/[...nextauth]/route.ts` - Auth routes
8. Create `app/api/user/profile/route.ts` - User profile API
9. Create `app/api/user/bookings/route.ts` - Bookings history API
10. Create `components/auth/login-button.tsx` - Login UI
11. Add login button to booking page
12. Create auto-fill logic in booking form
13. Create `app/my-account/page.tsx` - User dashboard
14. Test complete flow

## Usage Flow

### For Guest Users (No Login)
1. User fills booking form manually
2. Booking is created without user_id
3. Confirmation sent to provided email

### For Logged-in Users
1. User clicks "Login with Google" on booking page
2. Google OAuth flow → User authenticated
3. User profile loaded from Supabase
4. Booking form auto-filled with profile data
5. User can edit any fields before submitting
6. Booking saved with user_id reference
7. User can view booking in "My Account" dashboard

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Use Row Level Security (RLS) policies in Supabase
- Validate all user inputs server-side
- Use HTTPS in production
- Implement rate limiting on API routes

## Next Steps

After setup, you can extend with:
- Email notifications
- Booking modifications/cancellations
- Loyalty points system
- Favorite hotels list
- Payment history
