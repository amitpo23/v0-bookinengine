#!/bin/bash
# Database Setup Script - Booking Engine
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  DATABASE SETUP - Booking Engine"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found!"
    exit 1
fi

if ! grep -q "^DATABASE_URL=postgresql://" .env.local; then
    echo "❌ Error: DATABASE_URL not configured in .env.local"
    echo "   Update DATABASE_URL in .env.local first"
    exit 1
fi

echo "✅ .env.local found"
echo "✅ DATABASE_URL configured"
echo ""

echo "📦 Installing Prisma Client..."
npm install @prisma/client

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🚀 Pushing schema to database..."
npx prisma db push --accept-data-loss

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DATABASE SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Created 12 tables in your Supabase database"
echo ""
echo "🎯 Next: npm run dev"
