/**
 * Travel Insurance Handler
 * Offer and manage travel insurance for bookings
 */

// Types
export interface InsuranceContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface InsurancePlan {
  id: string
  name: string
  nameHe: string
  description: string
  descriptionHe: string
  coverage: InsuranceCoverage[]
  pricePerDay: number
  pricePerPerson: number
  currency: string
  provider: string
  terms: string
  termsHe: string
}

export interface InsuranceCoverage {
  type: string
  typeHe: string
  maxAmount: number
  currency: string
  description: string
  descriptionHe: string
}

export interface InsuranceQuote {
  quoteId: string
  planId: string
  planName: string
  totalPrice: number
  priceBreakdown: {
    basePrice: number
    perDayPrice: number
    perPersonPrice: number
    taxes: number
  }
  currency: string
  coverage: InsuranceCoverage[]
  validUntil: Date
  bookingId?: string
}

export interface InsurancePolicy {
  policyId: string
  quoteId: string
  planId: string
  bookingId: string
  customerId: string
  customerName: string
  customerEmail: string
  travelers: string[]
  startDate: Date
  endDate: Date
  totalPrice: number
  currency: string
  status: "active" | "cancelled" | "expired" | "claimed"
  policyNumber: string
  documentUrl?: string
  createdAt: Date
}

// Available insurance plans
const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: "basic",
    name: "Basic Travel Protection",
    nameHe: "הגנה בסיסית לנסיעה",
    description: "Essential coverage for trip cancellation and medical emergencies",
    descriptionHe: "כיסוי בסיסי לביטול נסיעה ומצבי חירום רפואיים",
    coverage: [
      {
        type: "Trip Cancellation",
        typeHe: "ביטול נסיעה",
        maxAmount: 100000,
        currency: "USD",
        description: "Reimbursement for prepaid, non-refundable trip costs",
        descriptionHe: "החזר עבור עלויות נסיעה ששולמו מראש ואינן ניתנות להחזר",
      },
      {
        type: "Medical Emergency",
        typeHe: "חירום רפואי",
        maxAmount: 50000,
        currency: "USD",
        description: "Emergency medical treatment abroad",
        descriptionHe: "טיפול רפואי חירום בחו\"ל",
      },
      {
        type: "Baggage Loss",
        typeHe: "אובדן מזוודות",
        maxAmount: 1000,
        currency: "USD",
        description: "Coverage for lost or stolen baggage",
        descriptionHe: "כיסוי למזוודות שאבדו או נגנבו",
      },
    ],
    pricePerDay: 500, // $5/day in cents
    pricePerPerson: 1000, // $10/person in cents
    currency: "USD",
    provider: "TravelGuard",
    terms: "Coverage begins at trip start. Pre-existing conditions excluded.",
    termsHe: "הכיסוי מתחיל עם תחילת הנסיעה. מצבים רפואיים קיימים אינם מכוסים.",
  },
  {
    id: "premium",
    name: "Premium Travel Protection",
    nameHe: "הגנה פרימיום לנסיעה",
    description: "Comprehensive coverage including adventure activities and electronics",
    descriptionHe: "כיסוי מקיף כולל פעילויות אתגריות ומכשירים אלקטרוניים",
    coverage: [
      {
        type: "Trip Cancellation",
        typeHe: "ביטול נסיעה",
        maxAmount: 200000,
        currency: "USD",
        description: "Full reimbursement for any reason cancellation",
        descriptionHe: "החזר מלא לביטול מכל סיבה",
      },
      {
        type: "Medical Emergency",
        typeHe: "חירום רפואי",
        maxAmount: 250000,
        currency: "USD",
        description: "Comprehensive medical coverage including evacuation",
        descriptionHe: "כיסוי רפואי מקיף כולל פינוי",
      },
      {
        type: "Baggage & Electronics",
        typeHe: "מזוודות ואלקטרוניקה",
        maxAmount: 3000,
        currency: "USD",
        description: "Coverage for baggage, electronics, and valuables",
        descriptionHe: "כיסוי למזוודות, אלקטרוניקה וחפצי ערך",
      },
      {
        type: "Adventure Sports",
        typeHe: "ספורט אתגרי",
        maxAmount: 50000,
        currency: "USD",
        description: "Coverage for skiing, diving, hiking accidents",
        descriptionHe: "כיסוי לתאונות סקי, צלילה, טיולים",
      },
      {
        type: "Trip Delay",
        typeHe: "עיכוב נסיעה",
        maxAmount: 500,
        currency: "USD",
        description: "Compensation for delays over 6 hours",
        descriptionHe: "פיצוי על עיכובים של מעל 6 שעות",
      },
    ],
    pricePerDay: 1200, // $12/day
    pricePerPerson: 2500, // $25/person
    currency: "USD",
    provider: "TravelGuard",
    terms: "24/7 assistance hotline. Cancel for any reason up to 48h before.",
    termsHe: "קו חירום 24/7. ביטול מכל סיבה עד 48 שעות לפני.",
  },
  {
    id: "family",
    name: "Family Travel Protection",
    nameHe: "הגנת משפחה לנסיעה",
    description: "Specially designed for families with children",
    descriptionHe: "מותאם במיוחד למשפחות עם ילדים",
    coverage: [
      {
        type: "Trip Cancellation",
        typeHe: "ביטול נסיעה",
        maxAmount: 150000,
        currency: "USD",
        description: "Family cancellation coverage",
        descriptionHe: "כיסוי ביטול למשפחה",
      },
      {
        type: "Medical Emergency",
        typeHe: "חירום רפואי",
        maxAmount: 150000,
        currency: "USD",
        description: "Family medical coverage including pediatric care",
        descriptionHe: "כיסוי רפואי למשפחה כולל טיפול ילדים",
      },
      {
        type: "Child Care",
        typeHe: "טיפול בילדים",
        maxAmount: 5000,
        currency: "USD",
        description: "Emergency child care if parent hospitalized",
        descriptionHe: "טיפול חירום בילדים אם ההורה מאושפז",
      },
      {
        type: "Baggage Loss",
        typeHe: "אובדן מזוודות",
        maxAmount: 2000,
        currency: "USD",
        description: "Family baggage coverage",
        descriptionHe: "כיסוי מזוודות למשפחה",
      },
    ],
    pricePerDay: 800, // $8/day
    pricePerPerson: 1500, // $15/person, but children under 18 free
    currency: "USD",
    provider: "TravelGuard",
    terms: "Children under 18 included free. Max 2 adults, 4 children per policy.",
    termsHe: "ילדים עד גיל 18 ללא תשלום. מקסימום 2 מבוגרים, 4 ילדים לפוליסה.",
  },
]

/**
 * Get available insurance plans
 */
export async function getInsurancePlans(
  params: { destination?: string; tripType?: string },
  context?: InsuranceContext
): Promise<InsurancePlan[]> {
  console.log("[Insurance] Getting available plans", params)
  
  // In production, would filter based on destination regulations
  return INSURANCE_PLANS
}

/**
 * Get insurance quote for a booking
 */
export async function getInsuranceQuote(
  params: {
    planId: string
    bookingId?: string
    checkIn: string | Date
    checkOut: string | Date
    travelers: number
    childrenUnder18?: number
  },
  context?: InsuranceContext
): Promise<InsuranceQuote> {
  console.log("[Insurance] Generating quote", { planId: params.planId, travelers: params.travelers })

  const plan = INSURANCE_PLANS.find(p => p.id === params.planId)
  if (!plan) {
    throw new Error(`Insurance plan not found: ${params.planId}`)
  }

  const checkIn = new Date(params.checkIn)
  const checkOut = new Date(params.checkOut)
  const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate price
  let travelers = params.travelers
  // Family plan: children under 18 are free
  if (params.planId === "family" && params.childrenUnder18) {
    travelers = Math.max(0, travelers - params.childrenUnder18)
  }

  const perDayPrice = plan.pricePerDay * days
  const perPersonPrice = plan.pricePerPerson * travelers
  const basePrice = perDayPrice + perPersonPrice
  const taxes = Math.round(basePrice * 0.05) // 5% tax
  const totalPrice = basePrice + taxes

  const quote: InsuranceQuote = {
    quoteId: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    planId: plan.id,
    planName: plan.name,
    totalPrice,
    priceBreakdown: {
      basePrice,
      perDayPrice,
      perPersonPrice,
      taxes,
    },
    currency: plan.currency,
    coverage: plan.coverage,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid 24 hours
    bookingId: params.bookingId,
  }

  console.log("[Insurance] Quote generated", { quoteId: quote.quoteId, totalPrice })

  return quote
}

/**
 * Purchase insurance policy
 */
export async function purchaseInsurance(
  params: {
    quoteId: string
    bookingId: string
    customerId: string
    customerName: string
    customerEmail: string
    travelers: string[] // Names of all travelers
    paymentMethodId?: string
  },
  context?: InsuranceContext
): Promise<InsurancePolicy> {
  console.log("[Insurance] Purchasing policy", { quoteId: params.quoteId, bookingId: params.bookingId })

  // In production, would:
  // 1. Verify quote is still valid
  // 2. Process payment via Stripe
  // 3. Create policy with insurance provider API
  // 4. Store in database

  const policy: InsurancePolicy = {
    policyId: `policy_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    quoteId: params.quoteId,
    planId: "premium", // Would come from quote
    bookingId: params.bookingId,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    travelers: params.travelers,
    startDate: new Date(), // Would come from booking
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalPrice: 5000, // Would come from quote
    currency: "USD",
    status: "active",
    policyNumber: `TG-${Date.now().toString().slice(-8)}`,
    createdAt: new Date(),
  }

  console.log("[Insurance] Policy purchased", { policyId: policy.policyId, policyNumber: policy.policyNumber })

  return policy
}

/**
 * Get insurance policy details
 */
export async function getInsurancePolicy(
  params: { policyId?: string; bookingId?: string },
  context?: InsuranceContext
): Promise<InsurancePolicy | null> {
  console.log("[Insurance] Getting policy", params)
  
  // In production, would fetch from database
  return null
}

/**
 * Cancel insurance policy
 */
export async function cancelInsurance(
  params: {
    policyId: string
    reason?: string
  },
  context?: InsuranceContext
): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
  console.log("[Insurance] Cancelling policy", { policyId: params.policyId })

  // In production, would:
  // 1. Check cancellation policy
  // 2. Calculate refund based on start date
  // 3. Process refund
  // 4. Update policy status

  return {
    success: true,
    refundAmount: 4500, // 90% refund example
  }
}

/**
 * File insurance claim
 */
export async function fileInsuranceClaim(
  params: {
    policyId: string
    claimType: string
    description: string
    amount: number
    documents?: string[] // URLs to uploaded documents
  },
  context?: InsuranceContext
): Promise<{
  claimId: string
  status: "submitted" | "under_review" | "approved" | "rejected"
  estimatedProcessingDays: number
}> {
  console.log("[Insurance] Filing claim", { policyId: params.policyId, claimType: params.claimType })

  return {
    claimId: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    status: "submitted",
    estimatedProcessingDays: 5,
  }
}

/**
 * Get claim status
 */
export async function getClaimStatus(
  params: { claimId: string },
  context?: InsuranceContext
): Promise<{
  claimId: string
  status: string
  amount?: number
  decision?: string
  updatedAt: Date
}> {
  console.log("[Insurance] Getting claim status", { claimId: params.claimId })

  return {
    claimId: params.claimId,
    status: "under_review",
    updatedAt: new Date(),
  }
}

// Export handlers map for registry
export const insuranceHandlers = {
  getInsurancePlans,
  getInsuranceQuote,
  purchaseInsurance,
  getInsurancePolicy,
  cancelInsurance,
  fileInsuranceClaim,
  getClaimStatus,
}
