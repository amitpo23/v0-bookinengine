# WhatsApp Integration Setup 💬

Complete WhatsApp messaging integration using Twilio for booking notifications, customer support, and engagement.

## Features

- ✅ **Booking Confirmations** - Instant WhatsApp confirmation when booking is complete
- ✅ **Cancellation Notifications** - Automatic cancellation and refund notifications
- ✅ **Check-in Reminders** - Automated reminders 1 day before check-in
- ✅ **Customer Support** - Two-way messaging for customer inquiries
- ✅ **Multi-language** - Messages in English, Hebrew, Arabic, and Russian
- ✅ **Media Support** - Send images, PDFs (vouchers), and other media
- ✅ **Webhook Handling** - Receive and respond to incoming messages

## Quick Start

### 1. Get Twilio Account

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get **$15 free credit** for testing
3. Navigate to [Twilio Console](https://console.twilio.com)

### 2. Get Your Credentials

**Account SID and Auth Token:**

1. Go to Twilio Console Dashboard
2. Copy your **Account SID** (starts with `AC...`)
3. Copy your **Auth Token** (click to reveal)

**WhatsApp Sandbox (for Development):**

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join the sandbox:
   - Send WhatsApp message to `+1 415 523 8886`
   - Send the code shown (e.g., `join <your-code>`)
3. Sandbox number: `whatsapp:+14155238886`

### 3. Configure Environment Variables

Edit `.env.local`:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# For Development: Use Twilio Sandbox
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# For Production: Use your WhatsApp Business number
# TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
```

### 4. Test the Integration

Send a test booking confirmation:

```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "booking-confirmation",
    "to": "+1234567890",
    "customerName": "John Doe",
    "bookingId": "BK123456",
    "hotelName": "Grand Hotel",
    "checkIn": "2024-12-25",
    "checkOut": "2024-12-28",
    "totalPrice": 450,
    "currency": "USD",
    "language": "en"
  }'
```

**Important:** Replace `+1234567890` with your WhatsApp number (must join sandbox first).

## Production Setup

### 1. Get WhatsApp Business Account

To send messages to any number (not just sandbox):

1. Go to Twilio Console → **Messaging** → **Senders** → **WhatsApp senders**
2. Click **Request to enable my WhatsApp enabled Twilio number**
3. Fill out the WhatsApp Business Profile
4. Submit for approval (takes 1-3 business days)

### 2. Create Message Templates

WhatsApp requires pre-approved templates for outbound messages:

1. Go to **Messaging** → **Content** → **Content Editor**
2. Create templates for:
   - Booking Confirmation
   - Cancellation Notification
   - Check-in Reminder
3. Submit for approval

### 3. Update Configuration

```bash
# Your approved WhatsApp Business number
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
```

### 4. Configure Webhook

Set up webhook for incoming messages:

1. Go to Twilio Console → **Messaging** → **Settings** → **WhatsApp sandbox settings**
2. Set **When a message comes in**: `https://yourdomain.com/api/whatsapp/webhook`
3. Method: `POST`
4. Save

For production:
1. **Messaging** → **Senders** → Your WhatsApp number → **Sandbox Configuration**
2. Same webhook URL

## Usage Examples

### Send Booking Confirmation

```typescript
import { whatsappService } from "@/lib/whatsapp/whatsapp-service"

await whatsappService.sendBookingConfirmation({
  to: "+972501234567", // Customer's WhatsApp number
  customerName: "יוסי כהן",
  bookingId: "BK789012",
  hotelName: "מלון ים המלח",
  checkIn: "2024-12-25",
  checkOut: "2024-12-28",
  totalPrice: 1800,
  currency: "USD",
  language: "he", // Hebrew message
})
```

### Send Cancellation Notification

```typescript
await whatsappService.sendCancellationNotification({
  to: "+97212345678",
  customerName: "أحمد محمد",
  bookingId: "BK345678",
  hotelName: "فندق القدس",
  refundAmount: 500,
  currency: "USD",
  language: "ar", // Arabic message
})
```

### Send Check-in Reminder

```typescript
await whatsappService.sendCheckInReminder({
  to: "+79161234567",
  customerName: "Иван Иванов",
  hotelName: "Гранд Отель",
  checkIn: "2024-12-25",
  language: "ru", // Russian message
})
```

### Send Custom Message

```typescript
await whatsappService.sendCustomMessage({
  to: "+1234567890",
  message: "Your room upgrade is confirmed! 🎉",
  mediaUrl: "https://yourdomain.com/room-photo.jpg", // Optional
})
```

## API Endpoints

### POST /api/whatsapp/send

Send WhatsApp messages programmatically.

**Request Body:**

```json
{
  "type": "booking-confirmation" | "cancellation" | "check-in-reminder" | "custom",
  "to": "+1234567890",
  "customerName": "John Doe",
  "bookingId": "BK123456",
  "hotelName": "Grand Hotel",
  "checkIn": "2024-12-25",
  "checkOut": "2024-12-28",
  "totalPrice": 450,
  "currency": "USD",
  "language": "en"
}
```

**Response:**

```json
{
  "success": true,
  "messageId": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### POST /api/whatsapp/webhook

Twilio webhook for incoming messages (configured in Twilio Console).

**Handles:**
- Customer replies
- Support inquiries
- Command processing (status, cancel, help)

## Automated Workflows

### 1. Booking Confirmation

Automatically send WhatsApp when booking is completed:

```typescript
// In your booking flow
const bookingResult = await createBooking(bookingData)

if (bookingResult.success && customer.phone) {
  await whatsappService.sendBookingConfirmation({
    to: customer.phone,
    customerName: customer.name,
    bookingId: bookingResult.bookingId,
    // ... other details
    language: customer.language,
  })
}
```

### 2. Check-in Reminders

Set up cron job to send reminders 24 hours before check-in:

```typescript
// cron/check-in-reminders.ts
import { prisma } from "@/lib/db"
import { whatsappService } from "@/lib/whatsapp/whatsapp-service"
import { addDays, startOfDay } from "date-fns"

export async function sendCheckInReminders() {
  const tomorrow = startOfDay(addDays(new Date(), 1))

  // Find bookings with check-in tomorrow
  const bookings = await prisma.booking.findMany({
    where: {
      dateFrom: {
        gte: tomorrow,
        lt: addDays(tomorrow, 1),
      },
      status: "CONFIRMED",
    },
  })

  // Send reminders
  for (const booking of bookings) {
    if (booking.customerPhone) {
      await whatsappService.sendCheckInReminder({
        to: booking.customerPhone,
        customerName: `${booking.customerFirstName} ${booking.customerLastName}`,
        hotelName: booking.hotelName,
        checkIn: booking.dateFrom.toISOString().split("T")[0],
        language: booking.language || "en",
      })
    }
  }
}
```

Schedule with Vercel Cron:

```typescript
// app/api/cron/check-in-reminders/route.ts
export async function GET(request: NextRequest) {
  // Verify cron secret
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await sendCheckInReminders()

  return NextResponse.json({ success: true })
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-in-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

## Message Templates

All messages support 4 languages with proper formatting:

### Booking Confirmation

**English:**
```
🎉 Booking Confirmed!

Dear John Doe,

Your reservation is confirmed!

📋 Booking Details:
• Booking ID: BK123456
• Hotel: Grand Hotel
• Check-in: 2024-12-25
• Check-out: 2024-12-28
• Total: USD 450.00

We look forward to welcoming you!

Questions? Reply to this message.
```

**Hebrew (RTL):**
```
🎉 ההזמנה אושרה!

יוסי כהן שלום,

ההזמנה שלך אושרה!

📋 פרטי הזמנה:
• מספר הזמנה: BK123456
• מלון: מלון הים
• צ'ק-אין: 2024-12-25
• צ'ק-אאוט: 2024-12-28
• סה"כ: USD 450.00

אנחנו מצפים לארח אותך!

שאלות? השב להודעה זו.
```

### Incoming Message Commands

Customers can send commands:

- **`help`** or **`?`** - Show available commands
- **`status BK123456`** - Check booking status
- **`cancel BK123456`** - Request cancellation

## Security

### 1. Validate Twilio Signature

The webhook automatically validates Twilio signatures:

```typescript
const isValid = twilio.validateRequest(
  TWILIO_AUTH_TOKEN,
  twilioSignature,
  url,
  params
)

if (!isValid) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
}
```

### 2. Phone Number Validation

Always validate phone numbers before sending:

```typescript
function isValidPhoneNumber(phone: string): boolean {
  // Must start with + and country code
  return /^\+[1-9]\d{1,14}$/.test(phone)
}
```

### 3. Rate Limiting

Twilio has built-in rate limits:
- **Sandbox**: 200 messages/day
- **Production**: Based on your plan

Implement your own rate limiting:

```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 messages per minute
})

const { success } = await ratelimit.limit(customerPhone)
if (!success) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
}
```

## Pricing

### Development (Sandbox)

- **Free** - $15 credit included
- No templates needed
- Messages to sandbox-joined numbers only

### Production

**Twilio WhatsApp Pricing:**
- **Conversation-based** pricing
- Business-initiated: $0.005-0.042 per conversation (varies by country)
- User-initiated: Free or lower cost
- 24-hour conversation window

**Example costs for Israel (+972):**
- Business-initiated: ~$0.025 per conversation
- User-initiated: ~$0.011 per conversation
- 1000 confirmations/month: ~$25

[See full pricing](https://www.twilio.com/en-us/messaging/pricing/whatsapp)

## Troubleshooting

### Messages Not Sending

1. **Check credentials:**
   ```bash
   echo $TWILIO_ACCOUNT_SID
   echo $TWILIO_AUTH_TOKEN
   ```

2. **Verify phone number format:**
   - Must include country code: `+1234567890`
   - Sandbox: User must join first

3. **Check Twilio logs:**
   - Go to Console → Monitor → Logs → Messaging

### Webhook Not Working

1. **Verify webhook URL** in Twilio Console
2. **Check HTTPS** - Webhooks require HTTPS
3. **Test locally** with ngrok:
   ```bash
   ngrok http 3000
   # Use ngrok URL in Twilio: https://abc123.ngrok.io/api/whatsapp/webhook
   ```

### Template Rejected

WhatsApp templates must:
- Be clear and concise
- Not be promotional
- Include opt-out instructions
- Follow WhatsApp Business Policy

## Best Practices

1. ✅ **Get consent** - Only send to users who opted in
2. ✅ **Respect 24-hour window** - Respond within 24 hours of user message
3. ✅ **Use templates** - Pre-approved templates for outbound messages
4. ✅ **Provide opt-out** - Always include way to unsubscribe
5. ✅ **Be timely** - Send confirmations immediately, reminders at appropriate times
6. ✅ **Handle errors** - Gracefully handle failed messages
7. ✅ **Log everything** - Keep audit trail of all messages

## Examples

See working examples in:
- `lib/whatsapp/whatsapp-service.ts` - Service implementation
- `app/api/whatsapp/send/route.ts` - Send API
- `app/api/whatsapp/webhook/route.ts` - Webhook handler

## Next Steps

1. ✅ **Setup Complete** - Twilio configured
2. 📱 **Test in Sandbox** - Send test messages
3. 🏢 **Apply for Business Account** - For production use
4. 📝 **Create Templates** - Submit for approval
5. 🤖 **Automate Workflows** - Set up cron jobs
6. 📊 **Monitor Usage** - Track in Twilio Console

---

**Questions?** Check [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp) or reach out to support.
