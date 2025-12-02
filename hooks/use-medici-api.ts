"use client"

import useSWR from "swr"
import { useState, useCallback } from "react"

const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "API Error")
  }
  return res.json()
}

const postFetcher = async ([url, body]: [string, object]) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "API Error")
  }
  return res.json()
}

// Hook for searching hotels
export function useHotelSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(
    async (params: {
      dateFrom: string
      dateTo: string
      hotelName?: string
      city?: string
      adults?: number
      paxChildren?: number[]
      stars?: number
      limit?: number
    }) => {
      setIsSearching(true)
      setError(null)

      try {
        const response = await fetch("/api/hotels/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Search failed")
        }

        setResults(data.data || [])
        return data.data
      } catch (err: any) {
        setError(err.message)
        return []
      } finally {
        setIsSearching(false)
      }
    },
    [],
  )

  return { search, results, isSearching, error, setResults }
}

// Hook for dashboard data
export function useDashboard(params?: object) {
  const { data, error, isLoading, mutate } = useSWR(
    params ? ["/api/hotels/dashboard", params] : null,
    postFetcher,
    { refreshInterval: 30000 }, // Refresh every 30 seconds
  )

  return {
    dashboard: data?.data,
    isLoading,
    error: error?.message,
    refresh: mutate,
  }
}

// Hook for active rooms
export function useActiveRooms(params?: object) {
  const { data, error, isLoading, mutate } = useSWR(["/api/hotels/rooms/active", params || {}], postFetcher)

  return {
    rooms: data?.data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  }
}

// Hook for sold rooms
export function useSoldRooms(params?: object) {
  const { data, error, isLoading, mutate } = useSWR(["/api/hotels/rooms/sales", params || {}], postFetcher)

  return {
    rooms: data?.data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  }
}

// Hook for cancelled rooms
export function useCancelledRooms(params?: object) {
  const { data, error, isLoading, mutate } = useSWR(["/api/hotels/rooms/cancelled", params || {}], postFetcher)

  return {
    rooms: data?.data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  }
}

// Hook for opportunities
export function useOpportunities() {
  const { data, error, isLoading, mutate } = useSWR("/api/hotels/opportunities", fetcher)

  const createOpportunity = useCallback(
    async (params: {
      hotelId?: number
      destinationId?: number
      startDateStr: string
      endDateStr: string
      boardId: number
      categoryId: number
      buyPrice: number
      pushPrice: number
      maxRooms: number
    }) => {
      const response = await fetch("/api/hotels/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create opportunity")
      }

      await mutate()
      return data
    },
    [mutate],
  )

  return {
    opportunities: data?.data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
    createOpportunity,
  }
}

// Hook for room actions
export function useRoomActions() {
  const [isLoading, setIsLoading] = useState(false)

  const updatePrice = useCallback(async (prebookId: number, newPushPrice: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/hotels/rooms/update-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prebookId, newPushPrice }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update price")
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelRoom = useCallback(async (prebookId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/hotels/rooms/cancel?prebookId=${prebookId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel room")
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const bookRoom = useCallback(async (opportunityId: number, code?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/hotels/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book room")
      }

      return { success: true, bookingId: data.bookingId }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { updatePrice, cancelRoom, bookRoom, isLoading }
}
