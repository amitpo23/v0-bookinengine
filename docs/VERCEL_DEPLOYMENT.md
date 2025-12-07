# 🚀 Vercel Deployment Guide

## Overview
This guide covers deploying the booking engine with Sunday integration to Vercel.

## Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- (Optional) Tavily API key for enhanced features

## Quick Deploy

### Method 1: Automatic Deployment (Recommended)
Vercel automatically deploys when you push to the main branch:

1. **Merge the PR**
   ```bash
   # In GitHub, merge pull request #1
   ```

2. **Vercel deploys automatically**
   - Triggered on push to main
   - Build process runs
   - Deploy to production

### Method 2: Manual Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Environment Variables

### Required Variables
None! All features work without configuration.

### Optional Variables (for Tavily)
In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add:
   ```
   TAVILY_API_KEY=your_tavily_api_key
   ```

## Build Configuration

### Build Command
```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Output Directory
```
.next
```

### Install Command
```bash
npm install
# or
pnpm install
# or
yarn install
```

## Next.js Configuration

The project is configured for Vercel with:

```javascript
// next.config.mjs
{
  typescript: {
    ignoreBuildErrors: true  // For faster builds
  },
  images: {
    unoptimized: true,       // For Vercel's Image Optimization
    remotePatterns: [        // Allow external images
      {
        protocol: 'https',
        hostname: 'cdn-images.innstant-servers.com',
      }
    ]
  }
}
```

## Vercel-Specific Features

### Edge Functions
All API routes are automatically deployed as Edge Functions:
- `/api/tavily/hotel-search` - Tavily integration
- All existing API routes

### Image Optimization
Next.js Image component works seamlessly:
```typescript
<Image
  src="https://cdn-images.innstant-servers.com/..."
  width={800}
  height={600}
  alt="Hotel"
/>
```

### Automatic HTTPS
All routes served over HTTPS automatically.

### Global CDN
Content distributed globally for fast access.

## Build Optimization

### Recommended Settings
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

### Performance Tips
1. **Image Optimization**: Already configured
2. **Code Splitting**: Automatic with Next.js
3. **Static Generation**: Used where possible
4. **Edge Caching**: Automatic for static assets

## Testing Before Deploy

### Local Production Build
```bash
# Build the project
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

### Check Build Output
Look for:
- ✅ No TypeScript errors (or only expected ones)
- ✅ All pages build successfully
- ✅ API routes compiled
- ✅ Static assets optimized

## Deployment Checklist

### Pre-Deployment
- [ ] All commits pushed to branch
- [ ] PR reviewed and approved
- [ ] Local build successful
- [ ] Environment variables configured (if needed)

### Post-Deployment
- [ ] Visit production URL
- [ ] Test admin panel
- [ ] Check "תצוגת חדרים" tab
- [ ] Verify image loading
- [ ] Test Tavily integration (if configured)
- [ ] Check console for errors

## Common Issues

### Issue 1: Build Fails
**Symptoms**: Deployment fails during build
**Solutions**:
```bash
# Check local build
npm run build

# Fix TypeScript errors if needed
npm run lint
```

### Issue 2: Images Not Loading
**Symptoms**: Hotel images show broken
**Solutions**:
1. Check `next.config.mjs` has correct domains
2. Verify image URLs are HTTPS
3. Check Vercel logs for image errors

### Issue 3: API Routes 404
**Symptoms**: `/api/tavily/hotel-search` returns 404
**Solutions**:
1. Check file structure: `app/api/tavily/hotel-search/route.ts`
2. Verify exports: `export async function POST(...)`
3. Check Vercel Functions logs

### Issue 4: Environment Variables
**Symptoms**: Tavily integration not working
**Solutions**:
1. Add `TAVILY_API_KEY` in Vercel Dashboard
2. Redeploy after adding variables
3. Check variable is available: `process.env.TAVILY_API_KEY`

## Monitoring

### Vercel Analytics
Built-in analytics available:
```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Error Tracking
Check Vercel Dashboard for:
- Build errors
- Runtime errors
- Function timeouts
- Memory issues

## Performance Optimization

### Caching Strategy
```typescript
// API Route with caching
export const revalidate = 1800; // 30 minutes

export async function GET() {
  // Your code
}
```

### Static Generation
Pages are pre-rendered where possible:
- Admin panel: SSR (Server-Side Rendering)
- Hotel components: Client-side with SSR
- API routes: Edge Functions

## Domains & URLs

### Default Vercel URL
```
https://your-project.vercel.app
```

### Custom Domain
In Vercel Dashboard:
1. Go to Settings > Domains
2. Add your domain
3. Update DNS records

## Rollback Strategy

### If Something Goes Wrong
```bash
# Via Vercel Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"

# Via CLI
vercel rollback
```

## CI/CD Pipeline

### Automatic Workflow
```
Push to branch → Vercel Preview Deploy
      ↓
Merge to main → Vercel Production Deploy
      ↓
Auto-assign domain
```

### Preview Deployments
Every PR gets a preview URL:
- Unique URL per PR
- Automatic updates on push
- Share with team for review

## Scaling

### Vercel Automatically Handles
- ✅ Traffic spikes
- ✅ Global distribution
- ✅ DDoS protection
- ✅ SSL certificates
- ✅ CDN caching

### No Configuration Needed!

## Cost Optimization

### Free Tier Includes
- Unlimited deployments
- Automatic HTTPS
- Edge Network
- Serverless Functions (100GB-hours)
- Image Optimization (1000 images)

### For Production
Consider Pro plan for:
- Team collaboration
- Advanced analytics
- Priority support
- More resources

## Security

### Automatically Enabled
- HTTPS everywhere
- Secure headers
- DDoS protection
- WAF (Web Application Firewall)

### Environment Variables
- Never commit `.env` files
- Use Vercel Dashboard for secrets
- Separate dev/prod variables

## Backup Strategy

### Git as Backup
All code in GitHub:
- Complete version history
- Easy rollback
- Team collaboration

### Database Backups
If using database:
- Regular automated backups
- Point-in-time recovery
- Export capabilities

## Support Resources

### Vercel
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Discord Community](https://vercel.com/discord)

### This Project
- [Sunday Integration Guide](./SUNDAY_INTEGRATION.md)
- [Tavily Integration Guide](./TAVILY_INTEGRATION.md)
- [Integration Summary](../INTEGRATION_SUMMARY.md)

## Success Metrics

### After Deployment, Verify
- ✅ Admin panel loads
- ✅ Hotel cards display
- ✅ Images load from CDN
- ✅ Tavily integration works (if configured)
- ✅ No console errors
- ✅ Fast page loads (<3s)
- ✅ Mobile responsive

## Quick Reference

### Useful Commands
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Inspect deployment
vercel inspect <url>

# Remove deployment
vercel rm <deployment-id>
```

### Useful URLs
```bash
# Project Dashboard
https://vercel.com/dashboard

# Deployment logs
https://vercel.com/[team]/[project]/[deployment]

# Analytics
https://vercel.com/[team]/[project]/analytics
```

## Troubleshooting Checklist

If deployment fails:
1. [ ] Check build logs in Vercel
2. [ ] Verify `package.json` scripts
3. [ ] Test local build
4. [ ] Check environment variables
5. [ ] Review recent commits
6. [ ] Check Vercel status page
7. [ ] Contact support if needed

## Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Monitor performance
3. ✅ Set up custom domain (optional)
4. ✅ Configure analytics
5. ✅ Plan for scaling
6. ✅ Document for team

## Conclusion

Your booking engine with Sunday integration is now ready for Vercel! 🚀

The platform handles:
- Automatic deployments
- Global CDN
- SSL/HTTPS
- Scaling
- Performance optimization

Focus on building features, Vercel handles infrastructure.
