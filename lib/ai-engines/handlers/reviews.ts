/**
 * Reviews Handler
 * Collect, manage, and analyze guest reviews
 */

// Types
export interface ReviewContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface Review {
  reviewId: string
  bookingId: string
  hotelId: string
  hotelName: string
  
  // Reviewer
  customerId: string
  customerName: string
  customerEmail: string
  isVerified: boolean
  
  // Rating breakdown
  overallRating: number // 1-5
  ratings: {
    cleanliness: number
    location: number
    service: number
    value: number
    amenities: number
    comfort: number
  }
  
  // Content
  title: string
  content: string
  pros?: string
  cons?: string
  
  // Trip info
  tripType: "business" | "leisure" | "family" | "couple" | "solo" | "group"
  stayDate: Date
  roomType: string
  
  // Metadata
  language: string
  photos?: string[]
  helpfulVotes: number
  
  // Management
  status: "pending" | "approved" | "rejected" | "flagged"
  response?: HotelResponse
  createdAt: Date
  updatedAt: Date
}

export interface HotelResponse {
  responseId: string
  responderId: string
  responderName: string
  content: string
  createdAt: Date
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { rating: number; count: number; percentage: number }[]
  categoryAverages: {
    cleanliness: number
    location: number
    service: number
    value: number
    amenities: number
    comfort: number
  }
  recentTrend: "improving" | "stable" | "declining"
  responseRate: number
}

export interface ReviewRequest {
  requestId: string
  bookingId: string
  hotelId: string
  customerId: string
  customerEmail: string
  customerName: string
  checkOutDate: Date
  sentAt?: Date
  reminderSentAt?: Date
  completedAt?: Date
  status: "pending" | "sent" | "completed" | "expired"
}

// In-memory stores
const reviews: Map<string, Review> = new Map()
const reviewRequests: Map<string, ReviewRequest> = new Map()

// Demo reviews for testing
const DEMO_REVIEWS: Review[] = [
  {
    reviewId: "demo_1",
    bookingId: "booking_demo_1",
    hotelId: "hotel_1",
    hotelName: "Dizengoff Inn",
    customerId: "cust_1",
    customerName: "John D.",
    customerEmail: "john@example.com",
    isVerified: true,
    overallRating: 4.5,
    ratings: { cleanliness: 5, location: 5, service: 4, value: 4, amenities: 4, comfort: 5 },
    title: "Great location, amazing staff!",
    content: "Loved our stay at this hotel. The location is perfect for exploring Tel Aviv. Staff was incredibly helpful with restaurant recommendations.",
    pros: "Location, friendly staff, clean rooms",
    cons: "Breakfast could be better",
    tripType: "couple",
    stayDate: new Date("2025-12-15"),
    roomType: "Deluxe Room",
    language: "en",
    helpfulVotes: 12,
    status: "approved",
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2025-12-20"),
  },
]

// Initialize demo data
DEMO_REVIEWS.forEach(r => reviews.set(r.reviewId, r))

/**
 * Request review from guest after checkout
 */
export async function requestReview(
  params: {
    bookingId: string
    hotelId: string
    hotelName: string
    customerId: string
    customerEmail: string
    customerName: string
    checkOutDate: string | Date
  },
  context?: ReviewContext
): Promise<{ requestId: string; scheduledFor: Date }> {
  console.log("[Reviews] Requesting review", { bookingId: params.bookingId })

  const checkOut = new Date(params.checkOutDate)
  
  // Schedule review request for 24 hours after checkout
  const scheduledFor = new Date(checkOut.getTime() + 24 * 60 * 60 * 1000)

  const request: ReviewRequest = {
    requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    bookingId: params.bookingId,
    hotelId: params.hotelId,
    customerId: params.customerId,
    customerEmail: params.customerEmail,
    customerName: params.customerName,
    checkOutDate: checkOut,
    status: "pending",
  }

  reviewRequests.set(request.requestId, request)

  console.log("[Reviews] Review request created", { requestId: request.requestId })

  return { requestId: request.requestId, scheduledFor }
}

/**
 * Submit a review
 */
export async function submitReview(
  params: {
    bookingId: string
    hotelId: string
    customerId: string
    customerName: string
    customerEmail: string
    overallRating: number
    ratings: Review["ratings"]
    title: string
    content: string
    pros?: string
    cons?: string
    tripType: Review["tripType"]
    roomType: string
    photos?: string[]
  },
  context?: ReviewContext
): Promise<{ reviewId: string; status: string }> {
  console.log("[Reviews] Submitting review", { bookingId: params.bookingId, rating: params.overallRating })

  // Validate rating
  if (params.overallRating < 1 || params.overallRating > 5) {
    throw new Error("Rating must be between 1 and 5")
  }

  // Check for existing review
  const existing = Array.from(reviews.values()).find(r => r.bookingId === params.bookingId)
  if (existing) {
    throw new Error("A review already exists for this booking")
  }

  const review: Review = {
    reviewId: `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    bookingId: params.bookingId,
    hotelId: params.hotelId,
    hotelName: "", // Would fetch from database
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    isVerified: true, // Verified because it's linked to a booking
    overallRating: params.overallRating,
    ratings: params.ratings,
    title: params.title,
    content: params.content,
    pros: params.pros,
    cons: params.cons,
    tripType: params.tripType,
    stayDate: new Date(),
    roomType: params.roomType,
    language: context?.locale || "en",
    photos: params.photos,
    helpfulVotes: 0,
    status: "pending", // Requires moderation
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  reviews.set(review.reviewId, review)

  // Update review request status
  const request = Array.from(reviewRequests.values()).find(r => r.bookingId === params.bookingId)
  if (request) {
    request.status = "completed"
    request.completedAt = new Date()
    reviewRequests.set(request.requestId, request)
  }

  console.log("[Reviews] Review submitted", { reviewId: review.reviewId })

  return { reviewId: review.reviewId, status: review.status }
}

/**
 * Get reviews for a hotel
 */
export async function getHotelReviews(
  params: {
    hotelId: string
    status?: Review["status"]
    minRating?: number
    sortBy?: "recent" | "rating" | "helpful"
    limit?: number
    offset?: number
  },
  context?: ReviewContext
): Promise<{ reviews: Review[]; total: number; stats: ReviewStats }> {
  console.log("[Reviews] Getting hotel reviews", { hotelId: params.hotelId })

  let hotelReviews = Array.from(reviews.values()).filter(r => r.hotelId === params.hotelId)

  // Filter by status
  if (params.status) {
    hotelReviews = hotelReviews.filter(r => r.status === params.status)
  } else {
    // Default to approved only
    hotelReviews = hotelReviews.filter(r => r.status === "approved")
  }

  // Filter by rating
  if (params.minRating) {
    hotelReviews = hotelReviews.filter(r => r.overallRating >= params.minRating!)
  }

  // Sort
  switch (params.sortBy) {
    case "rating":
      hotelReviews.sort((a, b) => b.overallRating - a.overallRating)
      break
    case "helpful":
      hotelReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes)
      break
    case "recent":
    default:
      hotelReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const total = hotelReviews.length

  // Pagination
  if (params.offset) {
    hotelReviews = hotelReviews.slice(params.offset)
  }
  if (params.limit) {
    hotelReviews = hotelReviews.slice(0, params.limit)
  }

  // Calculate stats
  const stats = calculateReviewStats(hotelReviews)

  return { reviews: hotelReviews, total, stats }
}

/**
 * Calculate review statistics
 */
function calculateReviewStats(reviewList: Review[]): ReviewStats {
  if (reviewList.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({ rating, count: 0, percentage: 0 })),
      categoryAverages: { cleanliness: 0, location: 0, service: 0, value: 0, amenities: 0, comfort: 0 },
      recentTrend: "stable",
      responseRate: 0,
    }
  }

  // Average rating
  const averageRating = reviewList.reduce((sum, r) => sum + r.overallRating, 0) / reviewList.length

  // Rating distribution
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviewList.forEach(r => {
    const rounded = Math.round(r.overallRating)
    distribution[rounded]++
  })
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: distribution[rating],
    percentage: (distribution[rating] / reviewList.length) * 100,
  }))

  // Category averages
  const categories = ["cleanliness", "location", "service", "value", "amenities", "comfort"] as const
  const categoryAverages = {} as ReviewStats["categoryAverages"]
  categories.forEach(cat => {
    categoryAverages[cat] = reviewList.reduce((sum, r) => sum + r.ratings[cat], 0) / reviewList.length
  })

  // Response rate
  const withResponses = reviewList.filter(r => r.response).length
  const responseRate = (withResponses / reviewList.length) * 100

  // Trend (compare last 30 days vs previous 30 days)
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000

  const recent = reviewList.filter(r => r.createdAt.getTime() > thirtyDaysAgo)
  const previous = reviewList.filter(r => r.createdAt.getTime() > sixtyDaysAgo && r.createdAt.getTime() <= thirtyDaysAgo)

  let recentTrend: ReviewStats["recentTrend"] = "stable"
  if (recent.length > 0 && previous.length > 0) {
    const recentAvg = recent.reduce((sum, r) => sum + r.overallRating, 0) / recent.length
    const previousAvg = previous.reduce((sum, r) => sum + r.overallRating, 0) / previous.length
    if (recentAvg > previousAvg + 0.2) recentTrend = "improving"
    else if (recentAvg < previousAvg - 0.2) recentTrend = "declining"
  }

  return {
    totalReviews: reviewList.length,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    categoryAverages,
    recentTrend,
    responseRate: Math.round(responseRate),
  }
}

/**
 * Moderate a review
 */
export async function moderateReview(
  params: {
    reviewId: string
    action: "approve" | "reject" | "flag"
    reason?: string
  },
  context?: ReviewContext
): Promise<{ success: boolean; status: Review["status"] }> {
  console.log("[Reviews] Moderating review", { reviewId: params.reviewId, action: params.action })

  const review = reviews.get(params.reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  review.status = params.action === "approve" ? "approved" 
    : params.action === "reject" ? "rejected" 
    : "flagged"
  review.updatedAt = new Date()

  reviews.set(params.reviewId, review)

  return { success: true, status: review.status }
}

/**
 * Respond to a review
 */
export async function respondToReview(
  params: {
    reviewId: string
    responderId: string
    responderName: string
    content: string
  },
  context?: ReviewContext
): Promise<{ success: boolean; responseId: string }> {
  console.log("[Reviews] Responding to review", { reviewId: params.reviewId })

  const review = reviews.get(params.reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  review.response = {
    responseId: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    responderId: params.responderId,
    responderName: params.responderName,
    content: params.content,
    createdAt: new Date(),
  }
  review.updatedAt = new Date()

  reviews.set(params.reviewId, review)

  console.log("[Reviews] Response added", { responseId: review.response.responseId })

  return { success: true, responseId: review.response.responseId }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(
  params: { reviewId: string; userId: string },
  context?: ReviewContext
): Promise<{ helpfulVotes: number }> {
  const review = reviews.get(params.reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  review.helpfulVotes++
  reviews.set(params.reviewId, review)

  return { helpfulVotes: review.helpfulVotes }
}

/**
 * Generate review summary using AI
 */
export async function generateReviewSummary(
  params: { hotelId: string },
  context?: ReviewContext
): Promise<{
  summary: string
  summaryHe: string
  highlights: string[]
  concerns: string[]
}> {
  console.log("[Reviews] Generating review summary", { hotelId: params.hotelId })

  const hotelReviews = Array.from(reviews.values())
    .filter(r => r.hotelId === params.hotelId && r.status === "approved")

  if (hotelReviews.length === 0) {
    return {
      summary: "No reviews yet.",
      summaryHe: "אין עדיין ביקורות.",
      highlights: [],
      concerns: [],
    }
  }

  // Extract common themes (simplified - would use AI in production)
  const allPros = hotelReviews.map(r => r.pros).filter(Boolean).join(" ")
  const allCons = hotelReviews.map(r => r.cons).filter(Boolean).join(" ")

  const highlights: string[] = []
  const concerns: string[] = []

  if (allPros.toLowerCase().includes("location")) highlights.push("Great location")
  if (allPros.toLowerCase().includes("staff") || allPros.toLowerCase().includes("service")) highlights.push("Excellent service")
  if (allPros.toLowerCase().includes("clean")) highlights.push("Very clean")

  if (allCons.toLowerCase().includes("breakfast")) concerns.push("Breakfast could be improved")
  if (allCons.toLowerCase().includes("noise") || allCons.toLowerCase().includes("noisy")) concerns.push("Some noise issues reported")

  const avgRating = hotelReviews.reduce((sum, r) => sum + r.overallRating, 0) / hotelReviews.length

  return {
    summary: `Based on ${hotelReviews.length} reviews, this hotel has an average rating of ${avgRating.toFixed(1)}. Guests frequently praise ${highlights.join(", ") || "the overall experience"}.`,
    summaryHe: `על בסיס ${hotelReviews.length} ביקורות, למלון דירוג ממוצע של ${avgRating.toFixed(1)}. אורחים משבחים לעיתים קרובות את ${highlights.join(", ") || "החוויה הכללית"}.`,
    highlights,
    concerns,
  }
}

/**
 * Send review request emails (batch job)
 */
export async function sendReviewRequests(
  params: { dryRun?: boolean },
  context?: ReviewContext
): Promise<{ sent: number; errors: string[] }> {
  console.log("[Reviews] Sending review requests", { dryRun: params.dryRun })

  const now = Date.now()
  const pendingRequests = Array.from(reviewRequests.values()).filter(r => {
    if (r.status !== "pending") return false
    // Check if 24 hours after checkout
    const sendTime = r.checkOutDate.getTime() + 24 * 60 * 60 * 1000
    return now >= sendTime
  })

  let sent = 0
  const errors: string[] = []

  for (const request of pendingRequests) {
    if (!params.dryRun) {
      // In production, would send email
      request.status = "sent"
      request.sentAt = new Date()
      reviewRequests.set(request.requestId, request)
    }
    sent++
  }

  console.log("[Reviews] Review requests sent", { sent })

  return { sent, errors }
}

// Export handlers map for registry
export const reviewHandlers = {
  requestReview,
  submitReview,
  getHotelReviews,
  moderateReview,
  respondToReview,
  markReviewHelpful,
  generateReviewSummary,
  sendReviewRequests,
}
