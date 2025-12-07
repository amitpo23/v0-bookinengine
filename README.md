# 🏨 Hotel Booking Engine with Sunday Integration

*Professional hotel booking system with advanced room display capabilities*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/guyofiror/v0-bookinengine)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

## ✨ Features

### Core Booking Engine
- 🏨 Hotel room search and booking
- 💳 Stripe payment integration
- 📅 Dynamic pricing calendar
- 🎯 Admin dashboard
- 🤖 AI-powered chat assistant
- 📊 Analytics and reporting

### 🆕 Sunday Integration (NEW!)
- **8 Professional UI Components** for room display
- **Tavily API Integration** for web-based hotel enrichment
- **Advanced Image Galleries** with modal view
- **Smart Caching** for optimal performance
- **Enhanced Admin Panel** with room showcase
- **Full TypeScript Support** throughout

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables
Create `.env.local`:
```env
# Optional - for enhanced hotel information
TAVILY_API_KEY=your_tavily_api_key

# Add other variables as needed
```

See `.env.example` for complete list.

## 📦 What's New - Sunday Integration

### Components Added
- `HotelCard` - Professional room display cards
- `HotelResults` - Smart results with loading states
- `HotelImageGallery` - Responsive image galleries
- `HotelDetailsEnhanced` - Tavily-enriched information
- And 4 more components!

### New Features
- ⭐ **Web Reviews Integration** via Tavily
- 🖼️ **Additional Images** from multiple sources
- 🏷️ **Star Ratings** extracted from web
- 🎨 **Amenities Display** with icon mapping
- 📍 **Location Information** and attractions
- 🔄 **Smart Caching** (30-minute cache)

### Admin Panel Enhancement
New "תצוגת חדרים" tab with:
- Grid/List view modes
- Basic/Enhanced information tabs
- Real-time room selection
- Professional image galleries

## 📚 Documentation

### Complete Guides
- **[Sunday Integration Guide](./docs/SUNDAY_INTEGRATION.md)** - Complete integration overview
- **[Tavily Integration Guide](./docs/TAVILY_INTEGRATION.md)** - External API setup
- **[Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md)** - Deploy to production
- **[Integration Summary](./INTEGRATION_SUMMARY.md)** - Quick reference

### Quick Links
```
docs/
├── SUNDAY_INTEGRATION.md      # Main integration guide
├── TAVILY_INTEGRATION.md      # Tavily setup & usage
└── VERCEL_DEPLOYMENT.md       # Deployment instructions
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 100%
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Payment**: Stripe
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel
- **External APIs**: Tavily (optional)

### Project Structure
```
webapp/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── booking/       # Booking endpoints
│   │   └── tavily/        # Tavily integration
│   └── ...
├── components/
│   ├── admin/             # Admin components
│   ├── booking/           # Booking flow
│   ├── hotels/            # 🆕 Hotel display components
│   │   ├── hotel-card.tsx
│   │   ├── hotel-results.tsx
│   │   ├── hotel-details-enhanced.tsx
│   │   └── ...
│   └── ui/                # Base UI components
├── lib/
│   ├── services/          # 🆕 External services
│   │   └── tavily-hotel-service.ts
│   └── utils/             # 🆕 Utility functions
│       └── cancellation-policy.ts
├── types/                 # 🆕 TypeScript definitions
│   ├── hotel-types.ts
│   └── ui-types.ts
└── docs/                  # 🆕 Documentation
    ├── SUNDAY_INTEGRATION.md
    ├── TAVILY_INTEGRATION.md
    └── VERCEL_DEPLOYMENT.md
```

## 🎯 Usage Examples

### Display Hotel Results
```typescript
import { HotelResults } from '@/components/hotels';

<HotelResults
  hotels={hotelData}
  searchQuery={searchQuery}
  onSelectHotel={handleSelect}
  isLoading={false}
/>
```

### Enhanced Hotel Details
```typescript
import { HotelDetailsEnhanced } from '@/components/hotels';

<HotelDetailsEnhanced 
  hotel={hotel} 
  city="Tel Aviv" 
/>
```

### Use Cancellation Utility
```typescript
import { getCurrentCancellationStatus } from '@/lib/utils/cancellation-policy';

const status = getCurrentCancellationStatus(hotel.cancellation);
```

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to main branch
2. Vercel deploys automatically
3. Configure environment variables in Vercel Dashboard

See [Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md) for details.

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
- ✅ Web-based data enrichment
- ✅ Smart caching
- ✅ Enhanced admin panel
- ✅ 100% TypeScript
- ✅ Production ready

## 🎨 Screenshots

### Admin Panel - Room Showcase
New tab with professional room display and Tavily integration.

### Hotel Card Component
Beautiful room cards with images, pricing, and availability.

### Image Gallery
Responsive gallery with modal view and external image support.

## 📊 Stats

- **Components**: 8 new hotel components
- **API Routes**: 1 new Tavily endpoint
- **Utilities**: 2 new utility modules
- **Types**: Complete TypeScript coverage
- **Documentation**: 1,000+ lines
- **Code Quality**: 100% TypeScript, zero breaking changes

## 🔐 Security

- Environment variables for sensitive data
- Server-side API calls only
- Input validation throughout
- HTTPS enforced on Vercel
- Regular dependency updates

## 🤝 Contributing

This is a private project. For any questions or suggestions:
1. Create an issue
2. Submit a pull request
3. Contact the maintainers

## 📄 License

Private - All rights reserved

## 🙏 Acknowledgments

- **Sunday Project** - Source of advanced UI components
- **Tavily** - Hotel data enrichment API
- **Vercel** - Hosting and deployment
- **Next.js** - Framework
- **Radix UI** - Component primitives

## 📞 Support

### Documentation
- Main: [SUNDAY_INTEGRATION.md](./docs/SUNDAY_INTEGRATION.md)
- Tavily: [TAVILY_INTEGRATION.md](./docs/TAVILY_INTEGRATION.md)
- Deploy: [VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md)

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tavily API](https://docs.tavily.com)

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
