import type { PreBookResponse, BookResponse } from "@/lib/api/medici-types"

// Force REAL API mode - no more demo/mock data
export const DEMO_MODE = false

export async function mockPreBook(): Promise<PreBookResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    preBookId: Math.floor(Math.random() * 100000),
    token: `DEMO_TOKEN_${Date.now()}`,
    status: "done",
    priceConfirmed: 1200,
    currency: "ILS",
    requestJson: '{"demo":"prebook"}',
    responseJson: '{"status":"success"}',
  }
}

export async function mockBook(): Promise<BookResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    bookingId: `DEMO${Date.now()}`,
    supplierReference: `REF${Math.floor(Math.random() * 1000000)}`,
    status: "confirmed",
  }
}
