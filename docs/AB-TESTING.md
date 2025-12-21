# A/B Testing for AI Prompts 🧪

Test different AI prompt variations to optimize booking conversion rates and user satisfaction.

## Overview

The A/B Testing system allows you to:
- Create experiments with multiple prompt variants
- Automatically split traffic between variants
- Track performance metrics (conversion rate, response time, satisfaction)
- Determine winning variants based on statistical significance
- Optimize AI prompts for better results

## Features

- ✅ **Weighted Traffic Split** - Distribute users across variants (e.g., 50/50, 70/30)
- ✅ **Session Persistence** - Users see the same variant throughout their session
- ✅ **Real-time Analytics** - Track conversions, response times, and satisfaction scores
- ✅ **Winner Detection** - Automatic winner selection based on conversion rate
- ✅ **Multiple Experiments** - Run multiple A/B tests simultaneously
- ✅ **Database Tracking** - Complete audit trail of all assignments and results

## Quick Start

### 1. Create an Experiment

```typescript
import { experimentService } from '@/lib/ab-testing/experiment-service'

const result = await experimentService.createExperiment({
  name: 'Friendly vs Professional Tone',
  description: 'Testing if friendly tone converts better than professional',
  variants: [
    {
      name: 'Control - Professional',
      systemPrompt: `You are a professional hotel booking assistant.
                     Provide accurate information and assist with bookings.`,
      weight: 50 // 50% of traffic
    },
    {
      name: 'Variant A - Friendly',
      systemPrompt: `You are a friendly hotel booking assistant! 😊
                     Help customers find their perfect stay with enthusiasm!`,
      weight: 50 // 50% of traffic
    }
  ]
})

console.log('Experiment ID:', result.experimentId)
```

### 2. Get Variant for User Session

```typescript
// In your AI chat API route
const sessionId = `session-${Date.now()}`
const experimentId = 'exp-friendly-vs-professional'

const variant = await experimentService.getVariant(experimentId, sessionId)

if (variant) {
  // Use this variant's system prompt
  const systemPrompt = variant.systemPrompt

  // Use in your AI call
  const response = await groqClient.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })
}
```

### 3. Track Results

```typescript
// After booking is completed (or failed)
await experimentService.trackResult({
  variantId: variant.id,
  sessionId: sessionId,
  metrics: {
    conversions: 1,
    responseTime: 450, // milliseconds
    userSatisfaction: 4.5, // 1-5 rating
    completedBooking: true
  }
})
```

### 4. Get Analytics

```typescript
const analytics = await experimentService.getExperimentAnalytics(experimentId)

console.log(analytics)
/*
{
  variants: [
    {
      id: 'var-1',
      name: 'Control - Professional',
      sessions: 150,
      conversions: 18,
      conversionRate: 12.0,
      avgResponseTime: 480,
      avgSatisfaction: 4.2
    },
    {
      id: 'var-2',
      name: 'Variant A - Friendly',
      sessions: 145,
      conversions: 26,
      conversionRate: 17.93,
      avgResponseTime: 450,
      avgSatisfaction: 4.6
    }
  ],
  winner: 'var-2' // Variant A has higher conversion rate
}
*/
```

### 5. End Experiment

```typescript
const result = await experimentService.endExperiment(experimentId)

console.log('Winner:', result.winner)
console.log('Final analytics:', result.analytics)
```

## API Endpoints

### POST /api/experiments/create

Create a new A/B test experiment.

**Request:**
```json
{
  "name": "Concise vs Detailed Responses",
  "description": "Test if users prefer short or long AI responses",
  "variants": [
    {
      "name": "Control - Concise",
      "systemPrompt": "Be brief and concise. Answer in 1-2 sentences.",
      "weight": 50
    },
    {
      "name": "Variant A - Detailed",
      "systemPrompt": "Provide detailed, helpful responses with examples.",
      "weight": 50
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "experimentId": "exp-clx123456"
}
```

### GET /api/experiments/[id]/analytics

Get performance analytics for an experiment.

**Response:**
```json
{
  "success": true,
  "data": {
    "variants": [
      {
        "id": "var-1",
        "name": "Control - Concise",
        "sessions": 200,
        "conversions": 24,
        "conversionRate": 12.0,
        "avgResponseTime": 350,
        "avgSatisfaction": 4.1
      },
      {
        "id": "var-2",
        "name": "Variant A - Detailed",
        "sessions": 195,
        "conversions": 31,
        "conversionRate": 15.9,
        "avgResponseTime": 520,
        "avgSatisfaction": 4.4
      }
    ],
    "winner": "var-2"
  }
}
```

## Integration with AI Chat

Update your booking chat API to use A/B testing:

```typescript
// app/api/ai/booking-chat/route.ts
import { experimentService } from '@/lib/ab-testing/experiment-service'

export async function POST(request: NextRequest) {
  const { messages, sessionId } = await request.json()

  // Get active experiment variant
  const EXPERIMENT_ID = process.env.ACTIVE_EXPERIMENT_ID
  let systemPrompt = getDefaultPrompt() // Fallback
  let variantId: string | null = null

  if (EXPERIMENT_ID) {
    const variant = await experimentService.getVariant(EXPERIMENT_ID, sessionId)
    if (variant) {
      systemPrompt = variant.systemPrompt
      variantId = variant.id
    }
  }

  // Track start time
  const startTime = Date.now()

  // Call AI
  const response = await groqClient.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })

  const responseTime = Date.now() - startTime

  // Track result (non-blocking)
  if (variantId) {
    experimentService.trackResult({
      variantId,
      sessionId,
      metrics: {
        responseTime,
        userSatisfaction: 0, // Will be updated later with user feedback
        completedBooking: false // Will be updated when booking completes
      }
    }).catch(console.error)
  }

  return NextResponse.json({ message: response.content })
}
```

## Database Schema

### Experiment
```prisma
model Experiment {
  id          String   @id @default(cuid())
  name        String
  description String?
  active      Boolean  @default(true)
  startDate   DateTime @default(now())
  endDate     DateTime?
  variants    PromptVariant[]
  assignments ExperimentAssignment[]
}
```

### PromptVariant
```prisma
model PromptVariant {
  id           String   @id @default(cuid())
  experimentId String
  name         String
  systemPrompt String   @db.Text
  weight       Int      @default(50) // 0-100
  active       Boolean  @default(true)
  assignments  ExperimentAssignment[]
  results      ExperimentResult[]
}
```

### ExperimentAssignment
```prisma
model ExperimentAssignment {
  id           String   @id @default(cuid())
  experimentId String
  variantId    String
  sessionId    String
  createdAt    DateTime @default(now())

  @@unique([experimentId, sessionId])
}
```

### ExperimentResult
```prisma
model ExperimentResult {
  id               String   @id @default(cuid())
  variantId        String
  sessionId        String
  conversions      Int      @default(0)
  responseTime     Int      @default(0)
  userSatisfaction Float    @default(0)
  completedBooking Boolean  @default(false)
  createdAt        DateTime @default(now())
}
```

## Best Practices

### 1. Traffic Split

**Even Split (50/50):**
```typescript
variants: [
  { name: 'Control', systemPrompt: '...', weight: 50 },
  { name: 'Variant A', systemPrompt: '...', weight: 50 }
]
```

**Conservative Test (80/20):**
```typescript
variants: [
  { name: 'Control', systemPrompt: '...', weight: 80 },
  { name: 'Variant A', systemPrompt: '...', weight: 20 }
]
```

**Multi-variant (33/33/34):**
```typescript
variants: [
  { name: 'Control', systemPrompt: '...', weight: 33 },
  { name: 'Variant A', systemPrompt: '...', weight: 33 },
  { name: 'Variant B', systemPrompt: '...', weight: 34 }
]
```

### 2. Statistical Significance

- **Minimum Sample Size:** 30+ sessions per variant
- **Confidence Level:** Wait for clear winner (>5% difference)
- **Run Duration:** At least 1 week to account for day-of-week effects

### 3. What to Test

**Good Tests:**
- ✅ Friendly vs Professional tone
- ✅ Concise vs Detailed responses
- ✅ Emoji usage vs No emojis
- ✅ Proactive suggestions vs Reactive answers
- ✅ Different greeting messages

**Bad Tests:**
- ❌ Testing completely different functionality
- ❌ Too many variants (>3)
- ❌ Changes that affect UX outside of AI chat

### 4. Winner Selection

The system automatically selects a winner when:
- Each variant has ≥30 sessions
- One variant has clearly higher conversion rate

```typescript
const analytics = await experimentService.getExperimentAnalytics(expId)

if (analytics.winner) {
  console.log(`🏆 Winner: ${analytics.winner}`)

  // End experiment and apply winner
  await experimentService.endExperiment(expId)

  // Update production prompt to use winning variant
  const winningVariant = analytics.variants.find(v => v.id === analytics.winner)
  console.log('Use this prompt:', winningVariant.systemPrompt)
}
```

## Examples

### Example 1: Test Emoji Usage

```typescript
await experimentService.createExperiment({
  name: 'Emoji vs No Emoji',
  description: 'Do emojis increase conversion?',
  variants: [
    {
      name: 'Control - No Emoji',
      systemPrompt: 'You are a professional booking assistant.',
      weight: 50
    },
    {
      name: 'Variant A - With Emoji',
      systemPrompt: 'You are a friendly booking assistant! 🏨✨',
      weight: 50
    }
  ]
})
```

### Example 2: Test Response Length

```typescript
await experimentService.createExperiment({
  name: 'Response Length Test',
  description: 'Short vs Long responses',
  variants: [
    {
      name: 'Control - Short',
      systemPrompt: 'Be concise. Answer in 1-2 sentences max.',
      weight: 50
    },
    {
      name: 'Variant A - Detailed',
      systemPrompt: 'Provide helpful, detailed answers with examples.',
      weight: 50
    }
  ]
})
```

### Example 3: Test Proactive Suggestions

```typescript
await experimentService.createExperiment({
  name: 'Proactive vs Reactive',
  description: 'Should AI suggest next steps?',
  variants: [
    {
      name: 'Control - Reactive',
      systemPrompt: 'Answer user questions directly.',
      weight: 50
    },
    {
      name: 'Variant A - Proactive',
      systemPrompt: 'Answer questions AND suggest helpful next steps.',
      weight: 50
    }
  ]
})
```

## Metrics to Track

1. **Conversion Rate** - % of sessions that complete a booking
2. **Response Time** - How fast AI responds (milliseconds)
3. **User Satisfaction** - User rating (1-5 stars)
4. **Completed Bookings** - Boolean flag

## Environment Variables

```bash
# Optional: ID of currently active experiment
ACTIVE_EXPERIMENT_ID=exp-clx123456
```

## Troubleshooting

### Variant Not Assigned

**Problem:** `getVariant()` returns `null`

**Solutions:**
- Check experiment is active
- Verify variant weights sum to 100
- Ensure experiment ID is correct

### No Winner Detected

**Problem:** `analytics.winner` is `undefined`

**Solutions:**
- Wait for more sessions (need ≥30 per variant)
- Check if conversion rates are too similar
- Verify results are being tracked

### Sessions Not Tracked

**Problem:** Analytics shows 0 sessions

**Solutions:**
- Verify `trackResult()` is called
- Check database for `ExperimentResult` records
- Ensure session IDs are unique

## Next Steps

1. ✅ **Create First Experiment** - Test friendly vs professional tone
2. 📊 **Monitor Analytics** - Check conversion rates daily
3. 🏆 **Select Winner** - End experiment when clear winner emerges
4. 🚀 **Apply Winner** - Update production prompts
5. 🔄 **Iterate** - Run new experiments to continue optimizing

---

**Questions?** Check the code in `/lib/ab-testing/experiment-service.ts` or reach out for support.
