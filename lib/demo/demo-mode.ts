import type { PreBookResponse, BookResponse } from "@/lib/api/medici-types"

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

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
