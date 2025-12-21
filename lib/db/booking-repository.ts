/**
 * Booking Repository
 * Handles all database operations for bookings
 * IMPORTANT: Does NOT modify Medici API calls - only saves data AFTER API success
 */

import { prisma } from "./prisma"
import { logger } from "@/lib/logger"
import type { Booking, BookingStatus, AuditLog, EmailType } from "@prisma/client"

export interface SaveBookingParams {
  // Medici API Response
  mediciBookingId: string
  preBookId?: string
  supplierReference?: string

  // Hotel & Room Details
  hotelId: number
  hotelName: string
  roomName: string
  roomCode: string

  // Booking Dates
  dateFrom: string // ISO string
  dateTo: string // ISO string
  nights: number

  // Guest Information
  customerEmail: string
  customerTitle: string
  customerFirstName: string
  customerLastName: string
  customerPhone: string
  customerCountry?: string
  customerCity?: string
  customerAddress?: string
  customerZip?: string

  // Occupancy
  adults: number
  childrenAges?: number[]

  // Pricing
  currency?: string
  totalPrice: number
  pricePerNight?: number

  // Status
  status: BookingStatus
  apiSource: "medici-direct" | "manus"

  // Voucher
  voucherEmail?: string
  agencyReference?: string

  // Complete Medici API response for audit
  mediciResponse: any
}

export interface CreateAuditLogParams {
  bookingId?: string
  action: "SEARCH" | "PREBOOK" | "BOOK" | "CANCEL" | "UPDATE_PRICE"
  status: "SUCCESS" | "FAILED"
  apiUsed: "medici-direct" | "manus"
  requestData?: any
  responseData?: any
  errorMessage?: string
  errorCode?: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
}

export class BookingRepository {
  /**
   * Save booking to database AFTER Medici API success
   * This does NOT call the Medici API - only saves the result
   */
  async saveBooking(params: SaveBookingParams): Promise<Booking | null> {
    try {
      logger.info("[DB] Saving booking to database", {
        mediciBookingId: params.mediciBookingId,
        customerEmail: params.customerEmail,
      })

      const booking = await prisma.booking.create({
        data: {
          mediciBookingId: params.mediciBookingId,
          preBookId: params.preBookId,
          supplierReference: params.supplierReference,

          hotelId: params.hotelId,
          hotelName: params.hotelName,
          roomName: params.roomName,
          roomCode: params.roomCode,

          dateFrom: new Date(params.dateFrom),
          dateTo: new Date(params.dateTo),
          nights: params.nights,

          customerEmail: params.customerEmail,
          customerTitle: params.customerTitle,
          customerFirstName: params.customerFirstName,
          customerLastName: params.customerLastName,
          customerPhone: params.customerPhone,
          customerCountry: params.customerCountry,
          customerCity: params.customerCity,
          customerAddress: params.customerAddress,
          customerZip: params.customerZip,

          adults: params.adults,
          childrenAges: params.childrenAges || [],

          currency: params.currency || "EUR",
          totalPrice: params.totalPrice,
          pricePerNight: params.pricePerNight,

          status: params.status,
          apiSource: params.apiSource,

          voucherEmail: params.voucherEmail,
          agencyReference: params.agencyReference,

          // Store complete Medici response for audit trail
          metadata: params.mediciResponse,
        },
      })

      logger.info("[DB] ✅ Booking saved successfully", {
        id: booking.id,
        mediciBookingId: booking.mediciBookingId,
      })

      return booking
    } catch (error: any) {
      // CRITICAL: Database errors should NOT fail the booking
      // Medici API already succeeded - this is just for history
      logger.error("[DB] ❌ Failed to save booking to database (non-critical)", {
        mediciBookingId: params.mediciBookingId,
        error: error.message,
      })
      return null
    }
  }

  /**
   * Get all bookings for a user by email
   */
  async getUserBookings(email: string): Promise<Booking[]> {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          customerEmail: email,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      logger.debug("[DB] Retrieved user bookings", {
        email,
        count: bookings.length,
      })

      return bookings
    } catch (error: any) {
      logger.error("[DB] Failed to get user bookings", {
        email,
        error: error.message,
      })
      return []
    }
  }

  /**
   * Get all bookings (for admin dashboard)
   */
  async getAllBookings(params?: {
    limit?: number
    offset?: number
    status?: BookingStatus
    dateFrom?: Date
    dateTo?: Date
  }): Promise<{ bookings: Booking[]; total: number }> {
    try {
      const where: any = {}

      if (params?.status) {
        where.status = params.status
      }

      if (params?.dateFrom || params?.dateTo) {
        where.dateFrom = {}
        if (params.dateFrom) {
          where.dateFrom.gte = params.dateFrom
        }
        if (params.dateTo) {
          where.dateFrom.lte = params.dateTo
        }
      }

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          take: params?.limit || 100,
          skip: params?.offset || 0,
        }),
        prisma.booking.count({ where }),
      ])

      logger.debug("[DB] Retrieved all bookings", {
        count: bookings.length,
        total,
      })

      return { bookings, total }
    } catch (error: any) {
      logger.error("[DB] Failed to get all bookings", {
        error: error.message,
      })
      return { bookings: [], total: 0 }
    }
  }

  /**
   * Get booking by Medici booking ID
   */
  async getBookingByMediciId(mediciBookingId: string): Promise<Booking | null> {
    try {
      const booking = await prisma.booking.findUnique({
        where: {
          mediciBookingId,
        },
      })

      return booking
    } catch (error: any) {
      logger.error("[DB] Failed to get booking by Medici ID", {
        mediciBookingId,
        error: error.message,
      })
      return null
    }
  }

  /**
   * Update booking status (e.g., for cancellations)
   */
  async updateBookingStatus(
    mediciBookingId: string,
    status: BookingStatus,
    cancellationReason?: string
  ): Promise<Booking | null> {
    try {
      const booking = await prisma.booking.update({
        where: {
          mediciBookingId,
        },
        data: {
          status,
          cancelledAt: status === "CANCELLED" ? new Date() : undefined,
          cancellationReason: cancellationReason || undefined,
        },
      })

      logger.info("[DB] ✅ Booking status updated", {
        mediciBookingId,
        status,
      })

      return booking
    } catch (error: any) {
      logger.error("[DB] Failed to update booking status", {
        mediciBookingId,
        status,
        error: error.message,
      })
      return null
    }
  }

  /**
   * Create audit log entry
   */
  async createAuditLog(params: CreateAuditLogParams): Promise<AuditLog | null> {
    try {
      const log = await prisma.auditLog.create({
        data: {
          bookingId: params.bookingId,
          action: params.action,
          status: params.status,
          apiUsed: params.apiUsed,
          requestData: params.requestData,
          responseData: params.responseData,
          errorMessage: params.errorMessage,
          errorCode: params.errorCode,
          userEmail: params.userEmail,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      })

      logger.debug("[DB] Audit log created", {
        action: params.action,
        status: params.status,
      })

      return log
    } catch (error: any) {
      // Audit logs are important but shouldn't fail operations
      logger.error("[DB] Failed to create audit log (non-critical)", {
        action: params.action,
        error: error.message,
      })
      return null
    }
  }

  /**
   * Enqueue email for async sending
   */
  async enqueueEmail(params: {
    to: string
    subject: string
    emailType: EmailType
    templateData: any
  }): Promise<void> {
    try {
      await prisma.emailQueue.create({
        data: {
          to: params.to,
          subject: params.subject,
          emailType: params.emailType,
          templateData: params.templateData,
        },
      })

      logger.debug("[DB] Email enqueued", {
        to: params.to,
        type: params.emailType,
      })
    } catch (error: any) {
      logger.error("[DB] Failed to enqueue email (non-critical)", {
        to: params.to,
        error: error.message,
      })
    }
  }

  /**
   * Get user by email (or create if doesn't exist)
   */
  async getOrCreateUser(email: string, data?: {
    firstName?: string
    lastName?: string
    phone?: string
    country?: string
    city?: string
    address?: string
    zip?: string
  }) {
    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: data || {},
        create: {
          email,
          ...data,
        },
      })

      return user
    } catch (error: any) {
      logger.error("[DB] Failed to get/create user", {
        email,
        error: error.message,
      })
      return null
    }
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository()
