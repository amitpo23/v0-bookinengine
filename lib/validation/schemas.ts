import { z } from "zod"

/**
 * Booking Search Validation Schema
 * Validates hotel search parameters
 */
export const BookingSearchSchema = z
  .object({
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD"),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD"),
    adults: z.number().int().min(1, "At least 1 adult required").max(20, "Maximum 20 adults"),
    children: z
      .array(z.number().int().min(0, "Child age cannot be negative").max(17, "Child age max 17"))
      .max(10, "Maximum 10 children")
      .default([]),
    hotelName: z.string().min(2, "Hotel name too short").max(200).optional(),
    city: z.string().min(2, "City name too short").max(100).optional(),
    stars: z.number().int().min(1).max(5).optional().nullable(),
    limit: z.number().int().min(1).max(100).optional().nullable(),
  })
  .refine(
    (data) => {
      const from = new Date(data.dateFrom)
      const to = new Date(data.dateTo)
      return to > from
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["dateTo"],
    }
  )
  .refine(
    (data) => {
      const from = new Date(data.dateFrom)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return from >= today
    },
    {
      message: "Check-in date cannot be in the past",
      path: ["dateFrom"],
    }
  )

/**
 * Customer Information Validation Schema
 */
export const CustomerSchema = z.object({
  title: z.enum(["MR", "MRS", "MS", "DR"]).default("MR"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .regex(/^[a-zA-Z\s\u0590-\u05FF-']+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .regex(/^[a-zA-Z\s\u0590-\u05FF-']+$/, "Last name contains invalid characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    ),
  country: z.string().length(2, "Country code must be 2 characters").default("IL"),
  city: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  zip: z.string().max(20).optional(),
})

/**
 * PreBook Request Validation Schema
 */
export const PreBookSchema = z.object({
  code: z.string().min(5, "Booking code must be at least 5 characters"),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hotelId: z.number().int().positive("Invalid hotel ID"),
  adults: z.number().int().min(1).max(20).default(2),
  children: z.array(z.number().int().min(0).max(17)).default([]),
})

/**
 * Booking Request Validation Schema
 */
export const BookingSchema = z.object({
  code: z.string().min(5, "Booking code required"),
  token: z.string().min(5, "Booking token required"),
  preBookId: z.number().int().positive().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hotelId: z.number().int().positive(),
  adults: z.number().int().min(1).max(20),
  children: z.array(z.number().int().min(0).max(17)),
  customer: CustomerSchema,
  voucherEmail: z.string().email().optional(),
  agencyReference: z.string().max(100).optional(),
})

/**
 * Payment Intent Validation Schema
 */
export const PaymentIntentSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(100000, "Amount exceeds maximum allowed (100,000)"),
  currency: z.enum(["ILS", "USD", "EUR"]).default("ILS"),
  customerEmail: z.string().email("Invalid customer email"),
  customerName: z.string().min(2, "Customer name required").max(100),
  metadata: z.object({
    bookingId: z.string().optional(),
    hotelId: z.number().int().positive().optional(),
    roomId: z.string().optional(),
  }),
})

/**
 * Room Cancellation Schema
 */
export const RoomCancellationSchema = z.object({
  prebookId: z.number().int().positive("Invalid prebook ID"),
})

/**
 * Type exports for use in API routes
 */
export type BookingSearchInput = z.infer<typeof BookingSearchSchema>
export type CustomerInput = z.infer<typeof CustomerSchema>
export type PreBookInput = z.infer<typeof PreBookSchema>
export type BookingInput = z.infer<typeof BookingSchema>
export type PaymentIntentInput = z.infer<typeof PaymentIntentSchema>
export type RoomCancellationInput = z.infer<typeof RoomCancellationSchema>
