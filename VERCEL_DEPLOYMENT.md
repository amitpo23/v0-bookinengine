# Vercel Deployment Guide

## Required Environment Variables

For the application to work properly in production, you **must** add the following environment variables in Vercel:

### 1. Go to Vercel Dashboard
1. Navigate to your project
2. Go to **Settings** → **Environment Variables**

### 2. Add These Variables:

#### Required (Critical):
```bash
MEDICI_TOKEN=your-medici-api-token-here
```

#### Optional (but recommended):
```bash
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
NODE_ENV=production
```

#### For Stripe Integration (if using payments):
```bash
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

#### For Future Features (Optional):
```bash
# If you add Redis/Upstash for caching:
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# If you add NextAuth:
NEXTAUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=https://yourdomain.com
```

## After Adding Environment Variables

1. Redeploy the project (or it will auto-deploy on next push)
2. Check the deployment logs to ensure no errors
3. Visit your deployed site and test the search functionality

## Troubleshooting

### "MEDICI_TOKEN not set" Warning
If you see this in the logs, you forgot to add `MEDICI_TOKEN` to Vercel Environment Variables.

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `MEDICI_TOKEN` with your API token
3. Redeploy

### Build Fails with TypeScript Errors
The app currently has `ignoreBuildErrors: true` to allow deployment despite TypeScript errors.

**To fix properly (later):**
1. Remove `ignoreBuildErrors` from `next.config.mjs`
2. Fix all TypeScript errors locally
3. Test with `pnpm build`
4. Deploy

### API Routes Return Errors
Make sure all required environment variables are set in Vercel.

## Where to Find the MEDICI_TOKEN

Check your `.env.local` file locally:
```bash
cat .env.local
```

Copy the `MEDICI_TOKEN` value and paste it into Vercel Environment Variables.

⚠️ **Important:** Never commit `.env.local` to git - it contains sensitive credentials!

## Current Status

✅ Application configured for Vercel deployment
✅ Environment variables properly externalized
✅ Build errors temporarily ignored for deployment
⚠️ TODO: Fix TypeScript errors and remove ignoreBuildErrors

## Production Checklist

Before going to production:
- [ ] Add MEDICI_TOKEN to Vercel
- [ ] Add Stripe keys (if using payments)
- [ ] Test all API routes work
- [ ] Test booking flow end-to-end
- [ ] Enable rate limiting monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Fix TypeScript errors
- [ ] Remove ignoreBuildErrors
