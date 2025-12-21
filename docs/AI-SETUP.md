# AI Configuration Guide - GROQ & LangSmith

## Overview

Your booking engine now supports **two AI providers** for the booking assistant:

1. **GROQ** (Recommended) - Ultra-fast, cost-effective, excellent Hebrew support
2. **Claude** - More advanced reasoning, higher cost

Plus **LangSmith** for complete AI observability and monitoring.

---

## 🚀 GROQ API Setup (Recommended)

### Why GROQ?
- ⚡ **10x faster** than Claude (200-500ms response time)
- 💰 **10x cheaper** (free tier: 14,400 requests/day)
- 🌍 **Excellent Hebrew support** (Mixtral-8x7B model)
- 🎯 **Perfect for production** booking engines

### Setup Steps:

**1. Get Your GROQ API Key:**
```bash
# Visit https://console.groq.com
# Sign up for free account
# Go to API Keys
# Create new API key
```

**2. Add to `.env`:**
```bash
# AI Provider (choose groq or claude)
AI_PROVIDER=groq

# GROQ API Key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**3. Test:**
```bash
# Start your dev server
npm run dev

# Visit http://localhost:3000
# Test the booking chat - you'll see:
# "[Booking AI] Using GROQ for ultra-fast inference"
```

### Available GROQ Models:

| Model | Best For | Speed | Hebrew Support |
|-------|----------|-------|----------------|
| `mixtral-8x7b-32768` | **Production** (Recommended) | Ultra-fast | ⭐⭐⭐⭐⭐ |
| `llama-3.3-70b-versatile` | Complex reasoning | Fast | ⭐⭐⭐⭐ |
| `llama-3.1-8b-instant` | Simple queries | Instant | ⭐⭐⭐ |

**Default:** `mixtral-8x7b-32768` (best balance for Hebrew/English booking chat)

---

## 📊 LangSmith Setup (Optional but Recommended)

### Why LangSmith?
- 📈 Track all AI conversations and performance
- 🐛 Debug issues with conversation replays
- 📊 Analyze booking conversion rates
- ⚡ Monitor latency and costs
- 👥 Understand user behavior patterns

### Setup Steps:

**1. Create LangSmith Account:**
```bash
# Visit https://smith.langchain.com
# Sign up for free account (free tier available)
# Create new project: "booking-engine"
# Generate API key
```

**2. Add to `.env`:**
```bash
# LangSmith API Key
LANGSMITH_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxx
LANGSMITH_PROJECT=booking-engine
```

**3. View Traces:**
```bash
# Visit https://smith.langchain.com/projects/booking-engine
# See all conversations, searches, and bookings in real-time
```

### What Gets Tracked:

| Event | Tracked Data |
|-------|--------------|
| **AI Chat** | User message, AI response, model, duration, language |
| **Hotel Search** | Search params, results count, API used, success/failure |
| **Booking Completion** | Booking ID, hotel, dates, price, revenue, success/failure |
| **Errors** | Full error messages and stack traces |

### LangSmith Dashboard Features:

```
📊 Conversations Tab:
- See every user interaction
- Replay conversations step-by-step
- View exact prompts and responses
- Filter by success/failure

📈 Analytics Tab:
- Average response time
- Token usage and costs
- Success rate per operation
- Most common user queries

🐛 Debugging:
- See full trace of failed operations
- Identify which step failed (search/prebook/book)
- Compare successful vs failed patterns
```

---

## 🔄 Switching Between Providers

### Use GROQ (Production):
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxx...
```

**Best for:**
- Production booking engine
- High traffic websites
- Cost optimization
- Hebrew/English support

### Use Claude (Advanced Features):
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxx...
```

**Best for:**
- Complex reasoning
- Better understanding of nuanced requests
- Lower traffic (higher costs)

---

## 💰 Cost Comparison

### GROQ (Free Tier):
- **14,400 requests/day** = FREE
- **After:** $0.10 per 1M tokens (~$0.001 per conversation)
- **Example:** 10,000 monthly bookings = ~$10/month

### Claude (Anthropic):
- **No free tier**
- **$3 per 1M tokens** (~$0.03 per conversation)
- **Example:** 10,000 monthly bookings = ~$300/month

💡 **Recommendation:** Use GROQ for production unless you need advanced Claude features.

---

## 🔧 Code Configuration

Your booking AI (`/app/api/ai/booking-chat/route.ts`) automatically:

1. Checks `AI_PROVIDER` environment variable
2. Uses GROQ if available and configured
3. Falls back to Claude if needed
4. Traces all interactions with LangSmith (if configured)

### Flow:

```
User Message
    ↓
Check AI_PROVIDER
    ↓
┌─────────────┬──────────────┐
│    GROQ     │    Claude    │
│  (Default)  │   (Fallback) │
└─────────────┴──────────────┘
    ↓                ↓
LangSmith Tracing (if enabled)
    ↓
Response to User
```

---

## 📝 Verification

### Check GROQ is Working:

```bash
# Watch your server logs:
npm run dev

# You should see:
[Booking AI] Provider configured { provider: 'GROQ', langsmith: true }
[Booking AI] Using GROQ for ultra-fast inference
[GROQ] ✅ Chat completion generated { model: 'mixtral-8x7b-32768', duration: '234ms' }
```

### Check LangSmith is Working:

```bash
# Server logs:
[LangSmith] Tracing enabled { project: 'booking-engine' }
[LangSmith] ✅ Chat interaction traced { conversationId: 'booking_xxx' }

# LangSmith Dashboard:
# Visit https://smith.langchain.com/projects/booking-engine
# You'll see live traces appearing
```

---

## 🎯 Best Practices

### Production Setup:
```env
# Use GROQ for speed and cost efficiency
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxx...

# Enable LangSmith for monitoring
LANGSMITH_API_KEY=lsv2_pt_xxx...
LANGSMITH_PROJECT=booking-engine

# Keep Medici API as primary (unchanged)
MEDICI_BEARER_TOKEN=xxx...
```

### Development Setup:
```env
# Test with GROQ (faster iteration)
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxx...

# Optional: Enable LangSmith for debugging
LANGSMITH_API_KEY=lsv2_pt_xxx...
LANGSMITH_PROJECT=booking-engine-dev
```

---

## 🚨 Troubleshooting

### GROQ not working?

```bash
# Check API key is set:
echo $GROQ_API_KEY

# Check provider is set:
echo $AI_PROVIDER

# Check server logs for errors:
[GROQ] ❌ Chat completion failed { error: 'Invalid API key' }
```

### LangSmith not showing traces?

```bash
# Verify API key:
echo $LANGSMITH_API_KEY

# Check project name matches:
echo $LANGSMITH_PROJECT

# Look for success logs:
[LangSmith] ✅ Chat interaction traced
```

### Slow responses?

- **If using Claude:** Switch to GROQ (10x faster)
- **If using GROQ:** Already optimized! Check network/API latency

---

## 📚 Resources

- **GROQ Console:** https://console.groq.com
- **GROQ Docs:** https://console.groq.com/docs
- **LangSmith:** https://smith.langchain.com
- **LangSmith Docs:** https://docs.smith.langchain.com

---

## ✅ Summary

You now have:

1. ✅ **GROQ integration** - Ultra-fast, cheap AI inference
2. ✅ **LangSmith tracing** - Complete observability
3. ✅ **Flexible provider selection** - Switch between GROQ/Claude
4. ✅ **Full monitoring** - Track every conversation, search, booking

**Next:** Configure your `.env` and start using the booking AI with GROQ!
