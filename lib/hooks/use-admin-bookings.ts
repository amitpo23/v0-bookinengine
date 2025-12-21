"use client"

import { useState, useEffect } from "react"
import { logger } from "@/lib/logger"

export interface AdminBooking {
  id: string
  mediciBookingId: string
  supplierReference?: string
  hotelName: string
  roomName: string
  dateFrom: string
  dateTo: string
  nights: number
  adults: number
  childrenAges: number[]
  totalPrice: number
  currency: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "EXPIRED"
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  customerPhone: string
  apiSource: string
  createdAt: string
  cancelledAt?: string
}

export interface UseAdminBookingsResult {
  bookings: AdminBooking[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAdminBookings(params?: {
  limit?: number
  offset?: number
  status?: string
  dateFrom?: string
  dateTo?: string
}): UseAdminBookingsResult {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      if (params?.offset) queryParams.append("offset", params.offset.toString())
      if (params?.status) queryParams.append("status", params.status)
      if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom)
      if (params?.dateTo) queryParams.append("dateTo", params.dateTo)

      const response = await fetch(`/api/admin/bookings?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data.bookings || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      logger.error("[Admin] Failed to fetch bookings", err)
      setError(err.message || "Failed to load bookings")
      setBookings([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [params?.limit, params?.offset, params?.status, params?.dateFrom, params?.dateTo])

  return {
    bookings,
    total,
    loading,
    error,
    refetch: fetchBookings,
  }
}
