# 🚀 Quick Setup Guide

## Step 1: Clone Repository (if needed)
```bash
git clone https://github.com/amitpo23/v0-bookinengine.git
cd v0-bookinengine
```

## Step 2: Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

## Step 3: Environment Variables

### Create .env.local file:
```bash
cp .env.local.example .env.local
```

### Add Tavily API Key:
Open `.env.local` and add:
```env
TAVILY_API_KEY=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
```

**Note:** This key is already configured in the example file!

## Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test Tavily Integration

1. Go to **Admin Panel**: `http://localhost:3000/admin`
2. Click on **"תצוגת חדרים"** tab in the sidebar
3. Select a hotel room
4. Click the **"מידע מורחב (Tavily)"** tab
5. Click **"הצג מידע מורחב מהאינטרנט"**
6. ✅ You should see enhanced hotel data!

## Vercel Deployment

### Method 1: Merge PR (Automatic)
1. Merge PR #1 to main branch
2. Vercel deploys automatically
3. Add environment variable in Vercel Dashboard

### Method 2: Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Add Tavily Key in Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `TAVILY_API_KEY`
   - **Value**: `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`
   - **Environment**: All (Production, Preview, Development)
5. Click **Save**
6. Redeploy if needed

## Verify Installation

### Check Admin Panel
- ✅ Navigate to `/admin`
- ✅ See "תצוגת חדרים" in sidebar
- ✅ Hotel cards display correctly
- ✅ Image galleries work

### Check Tavily Integration
- ✅ Click hotel to see details
- ✅ Switch to "מידע מורחב" tab
- ✅ Click "הצג מידע מורחב"
- ✅ See reviews, ratings, amenities from web

### Check Console
Open browser console (F12):
- ❌ No errors
- ✅ Clean console
- ✅ Successful API calls

## Troubleshooting

### Issue: Tavily not working
**Solution:**
1. Check `.env.local` has the API key
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check console for errors

### Issue: Images not loading
**Solution:**
1. Check `next.config.mjs` has image domains
2. Verify internet connection
3. Check image URLs in console

### Issue: Build fails
**Solution:**
```bash
# Clean build
rm -rf .next
npm run build

# If TypeScript errors
npm run lint
```

## Features to Test

### 1. Hotel Cards ✨
- Professional room display
- Images from CDN
- Pricing information
- Availability badges

### 2. Image Galleries 🖼️
- Click image to open modal
- Navigate with arrows
- Download images
- Responsive thumbnails

### 3. Tavily Integration 🌐
- Star ratings from web
- Reviews aggregation
- Amenities detection
- Location information
- Additional images

### 4. Admin Panel 📊
- Dashboard overview
- Room showcase tab
- Grid/List views
- Basic/Enhanced tabs

## Next Steps

1. ✅ Setup complete
2. ✅ Test all features
3. ✅ Merge PR to main
4. ✅ Deploy to Vercel
5. ✅ Add Tavily key in Vercel
6. ✅ Production ready!

## Support

### Documentation
- [Sunday Integration](./SUNDAY_INTEGRATION.md)
- [Tavily Integration](./TAVILY_INTEGRATION.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)

### Quick Commands
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Deploy to Vercel
vercel --prod
```

## Environment Variables Summary

| Variable | Required | Purpose |
|----------|----------|---------|
| `TAVILY_API_KEY` | No* | Hotel data enrichment |

*Optional but recommended for best experience

---

**You're all set! 🎉**

The Tavily API key is configured and ready to use.
Just run `npm run dev` and start exploring! 🚀
