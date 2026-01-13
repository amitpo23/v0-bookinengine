// Enhanced PreBook API Route with all new features
import { type NextRequest, NextResponse } from "next/server"
import { mediciApi } from "@/lib/api/medici-client"
import { preBookManager } from "@/lib/api/prebook-manager"
import { retryHandler } from "@/lib/api/booking-retry-handler"
import { bookingLogger } from "@/lib/api/booking-logger"
import { DEMO_MODE, mockPreBook } from "@/lib/demo/demo-mode"

export async function POST(request: NextRequest) {
  try {
    if (DEMO_MODE) {
      const mockResult = await mockPreBook()
      return NextResponse.json(mockResult)
    }

    const body = await request.json()
    const { jsonRequest, roomCode, hotelId } = body

    if (!jsonRequest || typeof jsonRequest !== "string") {
      return NextResponse.json(
        {
          error: "jsonRequest is required - must be the requestJson from search results",
          received: { jsonRequest: typeof jsonRequest },
        },
        { status: 400 },
      )
    }

    if (!roomCode) {
      return NextResponse.json(
        { error: "roomCode is required for PreBook management" },
        { status: 400 }
      )
    }

    // Log PreBook started
    bookingLogger.logPreBookStarted(roomCode, hotelId || 'unknown')

    // Check if we already have a valid PreBook
    const existingPreBook = preBookManager.getPreBook(roomCode)
    if (existingPreBook) {
      const timeRemaining = preBookManager.getTimeRemaining(roomCode)
      
      bookingLogger.log({
        eventType: 'prebook_completed',
        roomCode,
        hotelId,
        preBookId: existingPreBook.token,
        price: existingPreBook.priceConfirmed,
        currency: 'USD',
        metadata: { cached: true, timeRemaining }
      })

      return NextResponse.json({
        success: true,
        token: existingPreBook.token,
        priceConfirmed: existingPreBook.priceConfirmed,
        currency: 'USD',
        status: 'done',
        expiresAt: existingPreBook.expiresAt,
        timeRemaining,
        cached: true,
        message: `PreBook still valid for ${timeRemaining} minutes`
      })
    }

    // Perform new PreBook with retry
    const result = await retryHandler.preBookWithRetry({
      jsonRequest,
      roomCode
    })

    if (!result.success || !result.data) {
      bookingLogger.logPreBookFailed(roomCode, result.error || 'Unknown error')
      
      return NextResponse.json(
        {
          success: false,
          error: result.error || "PreBook failed - room may no longer be available",
          attempts: result.attempts
        },
        { status: 400 },
      )
    }

    const preBookData = result.data

    // Get saved PreBook data
    const savedPreBook = preBookManager.getPreBook(roomCode)
    if (!savedPreBook) {
      return NextResponse.json(
        { error: "Failed to save PreBook data" },
        { status: 500 }
      )
    }

    bookingLogger.logPreBookCompleted({
      roomCode,
      hotelId: hotelId || 'unknown',
      preBookId: preBookData.preBookId?.toString() || 'unknown',
      token: preBookData.token,
      price: preBookData.priceConfirmed,
      currency: preBookData.currency || 'USD'
    })

    return NextResponse.json({
      success: true,
      preBookId: preBookData.preBookId,
      token: preBookData.token,
      priceConfirmed: preBookData.priceConfirmed,
      currency: preBookData.currency,
      status: preBookData.status,
      expiresAt: savedPreBook.expiresAt,
      timeRemaining: preBookManager.getTimeRemaining(roomCode),
      cached: false,
      attempts: result.attempts,
      requestJson: preBookData.requestJson,
      responseJson: preBookData.responseJson,
    })
  } catch (error: any) {
    console.error("PreBook API Error:", error.message)
    
    bookingLogger.log({
      eventType: 'prebook_failed',
      error: error.message
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message || "PreBook failed",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to check PreBook status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomCode = searchParams.get('roomCode')

    if (!roomCode) {
      return NextResponse.json(
        { error: 'roomCode parameter is required' },
        { status: 400 }
      )
    }

    const preBook = preBookManager.getPreBook(roomCode)
    
    if (!preBook) {
      return NextResponse.json({
        valid: false,
        message: 'PreBook not found or expired'
      })
    }

    const timeRemaining = preBookManager.getTimeRemaining(roomCode)

    return NextResponse.json({
      valid: true,
      token: preBook.token,
      priceConfirmed: preBook.priceConfirmed,
      expiresAt: preBook.expiresAt,
      timeRemaining,
      isWarning: timeRemaining < 5
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
