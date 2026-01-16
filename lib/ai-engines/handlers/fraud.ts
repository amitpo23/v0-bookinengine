/**
 * Fraud Detection Handler
 * Analyze bookings for suspicious patterns and fraud risk
 */

// Types
export interface FraudContext {
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
}

export interface RiskScore {
  score: number // 0-100, higher = more risky
  level: "low" | "medium" | "high" | "critical"
  factors: RiskFactor[]
  recommendation: "approve" | "review" | "block"
  details: string
}

export interface RiskFactor {
  name: string
  nameHe: string
  score: number // 0-100 contribution to total
  weight: number // 0-1
  description: string
  descriptionHe: string
}

export interface FraudCheck {
  checkType: string
  passed: boolean
  details: string
  score: number
}

export interface SuspiciousActivity {
  id: string
  type: "velocity" | "mismatch" | "pattern" | "blacklist" | "geolocation" | "device"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  bookingId?: string
  customerId?: string
  data: Record<string, any>
  createdAt: Date
}

// Risk thresholds
const RISK_THRESHOLDS = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 90,
}

// Suspicious patterns database (would be in Supabase in production)
const SUSPICIOUS_PATTERNS = {
  disposableEmailDomains: [
    "tempmail.com", "throwaway.email", "guerrillamail.com", "10minutemail.com",
    "mailinator.com", "yopmail.com", "trashmail.com", "fakeinbox.com",
  ],
  highRiskCountries: ["XX", "YY"], // Placeholder - configure based on business rules
  velocityLimits: {
    bookingsPerHour: 3,
    bookingsPerDay: 10,
    totalValuePerDay: 1000000, // In cents ($10,000)
  },
}

// In-memory velocity tracking (would use Redis/Supabase in production)
const velocityStore: Map<string, { count: number; total: number; timestamp: number }> = new Map()

/**
 * Calculate overall risk score for a booking
 */
export async function analyzeBookingRisk(
  params: {
    bookingId: string
    customerEmail: string
    customerName: string
    customerPhone?: string
    amount: number
    currency: string
    hotelId: string
    checkIn: string | Date
    checkOut: string | Date
    ipAddress?: string
    userAgent?: string
    paymentMethod?: string
    billingCountry?: string
  },
  context?: FraudContext
): Promise<RiskScore> {
  console.log("[Fraud] Analyzing booking risk", { bookingId: params.bookingId })

  const factors: RiskFactor[] = []
  let totalScore = 0
  let totalWeight = 0

  // 1. Email analysis
  const emailFactor = analyzeEmail(params.customerEmail)
  factors.push(emailFactor)
  totalScore += emailFactor.score * emailFactor.weight
  totalWeight += emailFactor.weight

  // 2. Velocity check
  const velocityFactor = await checkVelocity(params.customerEmail, params.amount)
  factors.push(velocityFactor)
  totalScore += velocityFactor.score * velocityFactor.weight
  totalWeight += velocityFactor.weight

  // 3. Amount analysis
  const amountFactor = analyzeAmount(params.amount)
  factors.push(amountFactor)
  totalScore += amountFactor.score * amountFactor.weight
  totalWeight += amountFactor.weight

  // 4. Name/email mismatch
  const mismatchFactor = checkNameEmailMismatch(params.customerName, params.customerEmail)
  factors.push(mismatchFactor)
  totalScore += mismatchFactor.score * mismatchFactor.weight
  totalWeight += mismatchFactor.weight

  // 5. Booking pattern analysis
  const patternFactor = analyzeBookingPattern(params.checkIn, params.checkOut)
  factors.push(patternFactor)
  totalScore += patternFactor.score * patternFactor.weight
  totalWeight += patternFactor.weight

  // 6. IP/Geolocation (if available)
  if (params.ipAddress || context?.ipAddress) {
    const geoFactor = analyzeGeolocation(params.ipAddress || context?.ipAddress || "", params.billingCountry)
    factors.push(geoFactor)
    totalScore += geoFactor.score * geoFactor.weight
    totalWeight += geoFactor.weight
  }

  // Calculate final score
  const finalScore = Math.round(totalWeight > 0 ? totalScore / totalWeight : 0)

  // Determine risk level
  let level: RiskScore["level"] = "low"
  if (finalScore >= RISK_THRESHOLDS.critical) level = "critical"
  else if (finalScore >= RISK_THRESHOLDS.high) level = "high"
  else if (finalScore >= RISK_THRESHOLDS.medium) level = "medium"

  // Determine recommendation
  let recommendation: RiskScore["recommendation"] = "approve"
  if (level === "critical") recommendation = "block"
  else if (level === "high") recommendation = "review"

  const details = generateRiskSummary(factors, level, finalScore)

  console.log("[Fraud] Risk analysis complete", { 
    bookingId: params.bookingId, 
    score: finalScore, 
    level, 
    recommendation 
  })

  return {
    score: finalScore,
    level,
    factors,
    recommendation,
    details,
  }
}

/**
 * Analyze email for suspicious patterns
 */
function analyzeEmail(email: string): RiskFactor {
  let score = 0
  const issues: string[] = []

  const domain = email.split("@")[1]?.toLowerCase()

  // Check disposable email
  if (SUSPICIOUS_PATTERNS.disposableEmailDomains.includes(domain)) {
    score += 60
    issues.push("Disposable email domain")
  }

  // Check for random-looking email
  const localPart = email.split("@")[0]
  if (/^[a-z0-9]{10,}$/i.test(localPart) && !/[aeiou]{2,}/i.test(localPart)) {
    score += 20
    issues.push("Random-looking email address")
  }

  // Check for numbers at end (often auto-generated)
  if (/\d{4,}@/.test(email)) {
    score += 15
    issues.push("Many numbers in email")
  }

  return {
    name: "Email Analysis",
    nameHe: "ניתוח אימייל",
    score: Math.min(score, 100),
    weight: 0.2,
    description: issues.length > 0 ? issues.join(", ") : "Email looks legitimate",
    descriptionHe: issues.length > 0 ? "נמצאו סימנים חשודים באימייל" : "האימייל נראה תקין",
  }
}

/**
 * Check booking velocity (rate limiting)
 */
async function checkVelocity(email: string, amount: number): Promise<RiskFactor> {
  const now = Date.now()
  const hourAgo = now - 60 * 60 * 1000
  
  // Get or create velocity record
  let record = velocityStore.get(email)
  
  if (!record || record.timestamp < hourAgo) {
    record = { count: 0, total: 0, timestamp: now }
  }
  
  // Update record
  record.count++
  record.total += amount
  record.timestamp = now
  velocityStore.set(email, record)

  let score = 0
  const issues: string[] = []

  // Check bookings per hour
  if (record.count > SUSPICIOUS_PATTERNS.velocityLimits.bookingsPerHour) {
    score += 50
    issues.push(`${record.count} bookings in last hour`)
  }

  // Check total value
  if (record.total > SUSPICIOUS_PATTERNS.velocityLimits.totalValuePerDay) {
    score += 40
    issues.push("High total booking value")
  }

  return {
    name: "Velocity Check",
    nameHe: "בדיקת קצב הזמנות",
    score: Math.min(score, 100),
    weight: 0.25,
    description: issues.length > 0 ? issues.join(", ") : "Normal booking frequency",
    descriptionHe: issues.length > 0 ? "קצב הזמנות חריג" : "קצב הזמנות תקין",
  }
}

/**
 * Analyze booking amount
 */
function analyzeAmount(amount: number): RiskFactor {
  let score = 0
  const issues: string[] = []

  // Very high amount
  if (amount > 500000) { // $5,000+
    score += 30
    issues.push("Very high booking amount")
  } else if (amount > 200000) { // $2,000+
    score += 15
    issues.push("High booking amount")
  }

  // Round number (often test transactions)
  if (amount % 10000 === 0 && amount > 0) {
    score += 10
    issues.push("Suspiciously round amount")
  }

  return {
    name: "Amount Analysis",
    nameHe: "ניתוח סכום",
    score: Math.min(score, 100),
    weight: 0.15,
    description: issues.length > 0 ? issues.join(", ") : "Amount is reasonable",
    descriptionHe: issues.length > 0 ? "סכום חריג" : "סכום סביר",
  }
}

/**
 * Check for name/email mismatch
 */
function checkNameEmailMismatch(name: string, email: string): RiskFactor {
  let score = 0
  const issues: string[] = []

  const nameParts = name.toLowerCase().split(/\s+/)
  const emailLocal = email.split("@")[0].toLowerCase()

  // Check if any part of name appears in email
  const nameInEmail = nameParts.some(part => 
    part.length > 2 && emailLocal.includes(part)
  )

  if (!nameInEmail && nameParts[0]?.length > 3) {
    score += 25
    issues.push("Name doesn't match email")
  }

  return {
    name: "Name/Email Match",
    nameHe: "התאמת שם ואימייל",
    score: Math.min(score, 100),
    weight: 0.1,
    description: issues.length > 0 ? issues.join(", ") : "Name and email appear consistent",
    descriptionHe: issues.length > 0 ? "חוסר התאמה בין שם ואימייל" : "השם והאימייל תואמים",
  }
}

/**
 * Analyze booking pattern
 */
function analyzeBookingPattern(checkIn: string | Date, checkOut: string | Date): RiskFactor {
  let score = 0
  const issues: string[] = []

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const now = new Date()

  // Same day booking for far future
  const daysUntilCheckIn = Math.floor((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilCheckIn > 180) {
    score += 20
    issues.push("Booking very far in advance")
  }

  // Very long stay
  const nights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  if (nights > 30) {
    score += 25
    issues.push(`Very long stay (${nights} nights)`)
  }

  // Booking for past date (error or fraud attempt)
  if (checkInDate < now) {
    score += 50
    issues.push("Check-in date is in the past")
  }

  return {
    name: "Booking Pattern",
    nameHe: "דפוס הזמנה",
    score: Math.min(score, 100),
    weight: 0.15,
    description: issues.length > 0 ? issues.join(", ") : "Normal booking pattern",
    descriptionHe: issues.length > 0 ? "דפוס הזמנה חשוד" : "דפוס הזמנה תקין",
  }
}

/**
 * Analyze geolocation/IP
 */
function analyzeGeolocation(ipAddress: string, billingCountry?: string): RiskFactor {
  let score = 0
  const issues: string[] = []

  // Check for VPN/proxy indicators (simplified - would use IP intelligence API)
  if (ipAddress.startsWith("10.") || ipAddress.startsWith("192.168.")) {
    score += 10
    issues.push("Private/local IP address")
  }

  // In production, would check:
  // - IP country vs billing country mismatch
  // - Known VPN/proxy IPs
  // - Data center IPs
  // - High-risk countries

  return {
    name: "Geolocation Check",
    nameHe: "בדיקת מיקום",
    score: Math.min(score, 100),
    weight: 0.15,
    description: issues.length > 0 ? issues.join(", ") : "Location appears normal",
    descriptionHe: issues.length > 0 ? "נמצאו בעיות מיקום" : "מיקום תקין",
  }
}

/**
 * Generate risk summary
 */
function generateRiskSummary(factors: RiskFactor[], level: string, score: number): string {
  const highRiskFactors = factors.filter(f => f.score > 30)
  
  if (highRiskFactors.length === 0) {
    return `Low risk booking (score: ${score}). All checks passed.`
  }
  
  const factorNames = highRiskFactors.map(f => f.name).join(", ")
  return `${level.charAt(0).toUpperCase() + level.slice(1)} risk (score: ${score}). Concerns: ${factorNames}`
}

/**
 * Flag suspicious activity for review
 */
export async function flagSuspiciousActivity(
  params: {
    type: SuspiciousActivity["type"]
    severity: SuspiciousActivity["severity"]
    description: string
    bookingId?: string
    customerId?: string
    data?: Record<string, any>
  },
  context?: FraudContext
): Promise<SuspiciousActivity> {
  console.log("[Fraud] Flagging suspicious activity", { type: params.type, severity: params.severity })

  const activity: SuspiciousActivity = {
    id: `fraud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: params.type,
    severity: params.severity,
    description: params.description,
    bookingId: params.bookingId,
    customerId: params.customerId,
    data: params.data || {},
    createdAt: new Date(),
  }

  // In production, would:
  // 1. Store in Supabase
  // 2. Send alert to fraud team
  // 3. Potentially auto-block if severity is critical

  console.log("[Fraud] Activity flagged", { id: activity.id })

  return activity
}

/**
 * Get risk score (simplified accessor)
 */
export async function getRiskScore(
  params: { bookingId: string; customerEmail: string; amount: number },
  context?: FraudContext
): Promise<{ score: number; level: string; recommendation: string }> {
  const result = await analyzeBookingRisk({
    bookingId: params.bookingId,
    customerEmail: params.customerEmail,
    customerName: "",
    amount: params.amount,
    currency: "USD",
    hotelId: "",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }, context)

  return {
    score: result.score,
    level: result.level,
    recommendation: result.recommendation,
  }
}

/**
 * Check if customer is blacklisted
 */
export async function checkBlacklist(
  params: { email?: string; phone?: string; ipAddress?: string },
  context?: FraudContext
): Promise<{ blacklisted: boolean; reason?: string }> {
  // In production, would check against:
  // 1. Internal blacklist in Supabase
  // 2. External fraud databases
  // 3. Shared industry blacklists

  console.log("[Fraud] Checking blacklist", { email: params.email })

  // Placeholder - always return not blacklisted
  return { blacklisted: false }
}

/**
 * Run all fraud checks
 */
export async function runFraudChecks(
  params: {
    bookingId: string
    customerEmail: string
    customerName: string
    amount: number
    currency: string
  },
  context?: FraudContext
): Promise<{
  passed: boolean
  riskScore: RiskScore
  checks: FraudCheck[]
}> {
  const checks: FraudCheck[] = []

  // Run risk analysis
  const riskScore = await analyzeBookingRisk({
    bookingId: params.bookingId,
    customerEmail: params.customerEmail,
    customerName: params.customerName,
    amount: params.amount,
    currency: params.currency,
    hotelId: "",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }, context)

  // Add individual checks
  for (const factor of riskScore.factors) {
    checks.push({
      checkType: factor.name,
      passed: factor.score < 50,
      details: factor.description,
      score: factor.score,
    })
  }

  // Check blacklist
  const blacklistResult = await checkBlacklist({ email: params.customerEmail }, context)
  checks.push({
    checkType: "Blacklist",
    passed: !blacklistResult.blacklisted,
    details: blacklistResult.blacklisted ? blacklistResult.reason || "Blacklisted" : "Not blacklisted",
    score: blacklistResult.blacklisted ? 100 : 0,
  })

  const passed = riskScore.recommendation !== "block"

  return {
    passed,
    riskScore,
    checks,
  }
}

// Export handlers map for registry
export const fraudHandlers = {
  analyzeBookingRisk,
  flagSuspiciousActivity,
  getRiskScore,
  checkBlacklist,
  runFraudChecks,
}
