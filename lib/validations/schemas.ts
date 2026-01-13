/**
 * Zod Validation Schemas
 * Centralized validation schemas for the entire app
 */

import { z } from 'zod'

// ============================================
// USER SCHEMAS
// ============================================

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('אימייל לא תקין'),
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN', 'HOTEL_MANAGER']).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})

// ============================================
// HOTEL SCHEMAS
// ============================================

export const hotelSchema = z.object({
  name: z.string().min(2, 'שם מלון חייב להכיל לפחות 2 תווים'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug יכול להכיל רק אותיות אנגליות קטנות, מספרים ומקפים'),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().regex(/^[+]?[0-9\s-()]+$/, 'מספר טלפון לא תקין').optional(),
  email: z.string().email('אימייל לא תקין').optional(),
  website: z.string().url('URL לא תקין').optional(),
  currency: z.string().length(3, 'מטבע חייב להיות 3 תווים (ILS, USD, EUR)').default('ILS'),
  timezone: z.string().default('Asia/Jerusalem'),
})

// ============================================
// ROOM SCHEMAS
// ============================================

export const roomSchema = z.object({
  name: z.string().min(2, 'שם חדר חייב להכיל לפחות 2 תווים'),
  type: z.string().min(2, 'סוג חדר חייב להכיל לפחות 2 תווים'),
  description: z.string().optional(),
  maxOccupancy: z.number().int().min(1).max(10),
  basePrice: z.number().positive('מחיר חייב להיות חיובי'),
  size: z.number().positive().optional(),
  bedType: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true),
})

export const roomAvailabilitySchema = z.object({
  roomId: z.string(),
  date: z.string().datetime().or(z.date()),
  available: z.boolean().default(true),
  price: z.number().positive().optional(),
  minStay: z.number().int().min(1).optional(),
})

// ============================================
// BOOKING SCHEMAS
// ============================================

export const guestDetailsSchema = z.object({
  firstName: z.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
  lastName: z.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
  email: z.string().email('אימייל לא תקין'),
  phone: z.string().regex(/^[+]?[0-9\s-()]+$/, 'מספר טלפון לא תקין'),
  country: z.string().min(2).optional(),
  idNumber: z.string().optional(),
})

export const bookingSchema = z.object({
  roomId: z.string(),
  hotelId: z.string(),
  checkIn: z.string().datetime().or(z.date()),
  checkOut: z.string().datetime().or(z.date()),
  adults: z.number().int().min(1, 'חייב להיות לפחות מבוגר אחד').max(10),
  children: z.number().int().min(0).max(10),
  guestDetails: guestDetailsSchema,
  specialRequests: z.string().max(500, 'בקשות מיוחדות לא יכולות לעלות על 500 תווים').optional(),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    return checkOut > checkIn
  },
  {
    message: 'תאריך צ\'ק-אאוט חייב להיות אחרי תאריך צ\'ק-אין',
    path: ['checkOut'],
  }
).refine(
  (data) => {
    const checkIn = new Date(data.checkIn)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return checkIn >= today
  },
  {
    message: 'לא ניתן להזמין תאריכים בעבר',
    path: ['checkIn'],
  }
)

export const cancellationSchema = z.object({
  bookingId: z.string(),
  reason: z.string().min(10, 'סיבת ביטול חייבת להכיל לפחות 10 תווים'),
  email: z.string().email('אימייל לא תקין'),
})

// ============================================
// PROMOTION SCHEMAS
// ============================================

export const promotionSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/, 'קוד יכול להכיל רק אותיות אנגליות גדולות, מספרים ומקפים'),
  name: z.string().min(2, 'שם מבצע חייב להכיל לפחות 2 תווים'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_NIGHT']),
  discountValue: z.number().positive('ערך הנחה חייב להיות חיובי'),
  minNights: z.number().int().min(1).optional(),
  minAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  validFrom: z.string().datetime().or(z.date()),
  validUntil: z.string().datetime().or(z.date()),
}).refine(
  (data) => new Date(data.validUntil) > new Date(data.validFrom),
  {
    message: 'תאריך סיום חייב להיות אחרי תאריך התחלה',
    path: ['validUntil'],
  }
)

// ============================================
// AI CHAT SCHEMAS
// ============================================

export const chatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1, 'הודעה לא יכולה להיות ריקה'),
})

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema),
  sessionId: z.string().optional(),
  hotelId: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().max(4000).optional(),
})

// ============================================
// ANALYTICS SCHEMAS
// ============================================

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  hotelId: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
})

// ============================================
// PAYMENT SCHEMAS
// ============================================

export const paymentIntentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive('סכום חייב להיות חיובי'),
  currency: z.string().length(3).default('ILS'),
})

export const refundSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive('סכום חייב להיות חיובי'),
  reason: z.string().min(10, 'סיבה חייבת להכיל לפחות 10 תווים'),
})

// ============================================
// HELPER FUNCTIONS
// ============================================

export function validateRequest<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, errors: result.error }
  }
}

// Helper to format validation errors in Hebrew
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.join('.')
    return `${path ? path + ': ' : ''}${err.message}`
  })
}
