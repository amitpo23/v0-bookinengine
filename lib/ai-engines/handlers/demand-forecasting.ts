/**
 * Demand Forecasting Handler
 * AI-powered demand prediction, pricing recommendations, and capacity planning
 */

// Types
export interface ForecastContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface ForecastResult {
  success: boolean
  data?: any
  message?: string
  error?: string
}

interface ForecastDataPoint {
  date: string
  predictedDemand: number
  confidence: number
  factors: string[]
  recommendedPrice: number
  expectedOccupancy: number
}

interface SeasonalPattern {
  period: string
  demandMultiplier: number
  description: string
}

interface Event {
  name: string
  date: string
  type: "holiday" | "conference" | "festival" | "sport" | "other"
  impactLevel: "high" | "medium" | "low"
  demandIncrease: number
}

// Demand Forecasting Handler
export const demandForecastingHandler = {
  skillId: "demand-forecasting",
  
  async execute(
    tool: string,
    params: Record<string, unknown>,
    context: ForecastContext
  ): Promise<ForecastResult> {
    switch (tool) {
      case "get_demand_forecast":
        return getDemandForecast(params, context)
      case "get_pricing_recommendations":
        return getPricingRecommendations(params, context)
      case "analyze_seasonality":
        return analyzeSeasonality(params, context)
      case "detect_demand_anomalies":
        return detectDemandAnomalies(params, context)
      default:
        return {
          success: false,
          error: `Unknown tool: ${tool}`,
        }
    }
  },
}

// Get Demand Forecast
async function getDemandForecast(
  params: Record<string, unknown>,
  context: ForecastContext
): Promise<ForecastResult> {
  const hotelId = params.hotelId as string
  const startDate = params.startDate as string || new Date().toISOString().split("T")[0]
  const days = (params.days as number) || 30
  const roomType = params.roomType as string

  try {
    const forecast: ForecastDataPoint[] = []
    const start = new Date(startDate)
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      
      const dayOfWeek = date.getDay()
      const month = date.getMonth()
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 // Friday/Saturday in Israel
      const isHoliday = checkHoliday(date)
      
      // Calculate demand factors
      const factors: string[] = []
      let baseDemand = 65 // Base occupancy %
      
      // Weekend factor
      if (isWeekend) {
        baseDemand += 15
        factors.push("weekend")
      }
      
      // Seasonal factor
      const seasonalMultiplier = getSeasonalMultiplier(month)
      baseDemand *= seasonalMultiplier
      if (seasonalMultiplier > 1.1) factors.push("high_season")
      if (seasonalMultiplier < 0.9) factors.push("low_season")
      
      // Holiday factor
      if (isHoliday) {
        baseDemand *= 1.3
        factors.push("holiday")
      }
      
      // Event factor
      const event = checkEvents(date)
      if (event) {
        baseDemand *= (1 + event.demandIncrease / 100)
        factors.push(`event:${event.name}`)
      }
      
      // Add some variance
      const variance = (Math.random() - 0.5) * 10
      const predictedDemand = Math.min(100, Math.max(20, baseDemand + variance))
      
      // Calculate confidence based on how far in the future
      const daysAhead = i
      const confidence = Math.max(0.5, 0.95 - (daysAhead * 0.015))
      
      // Calculate recommended price based on demand
      const basePrice = 180 // Base room price
      const demandPriceMultiplier = 0.5 + (predictedDemand / 100)
      const recommendedPrice = Math.round(basePrice * demandPriceMultiplier)
      
      forecast.push({
        date: date.toISOString().split("T")[0],
        predictedDemand: Math.round(predictedDemand),
        confidence: Math.round(confidence * 100) / 100,
        factors,
        recommendedPrice,
        expectedOccupancy: Math.round(predictedDemand),
      })
    }
    
    // Calculate summary statistics
    const avgDemand = forecast.reduce((sum, f) => sum + f.predictedDemand, 0) / forecast.length
    const peakDays = forecast.filter(f => f.predictedDemand > 80)
    const lowDays = forecast.filter(f => f.predictedDemand < 50)
    
    return {
      success: true,
      data: {
        hotelId: hotelId || "default",
        roomType: roomType || "all",
        forecastPeriod: {
          start: startDate,
          end: forecast[forecast.length - 1].date,
          days,
        },
        forecast,
        summary: {
          averageDemand: Math.round(avgDemand),
          peakDays: peakDays.length,
          lowDays: lowDays.length,
          peakDates: peakDays.slice(0, 5).map(f => f.date),
          lowDates: lowDays.slice(0, 5).map(f => f.date),
          averageRecommendedPrice: Math.round(forecast.reduce((sum, f) => sum + f.recommendedPrice, 0) / forecast.length),
        },
        alerts: [
          ...peakDays.length > 7 ? [{
            type: "high_demand",
            message: `${peakDays.length} days with high demand (>80%) in forecast period`,
            recommendation: "Consider increasing prices or staff",
          }] : [],
          ...lowDays.length > 7 ? [{
            type: "low_demand",
            message: `${lowDays.length} days with low demand (<50%) in forecast period`,
            recommendation: "Consider promotions or discounts",
          }] : [],
        ],
      },
      message: `Demand forecast generated for ${days} days. Average expected occupancy: ${Math.round(avgDemand)}%`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate demand forecast: ${error}`,
    }
  }
}

// Get Pricing Recommendations
async function getPricingRecommendations(
  params: Record<string, unknown>,
  context: ForecastContext
): Promise<ForecastResult> {
  const hotelId = params.hotelId as string
  const date = params.date as string || new Date().toISOString().split("T")[0]
  const roomTypes = (params.roomTypes as string[]) || ["standard", "deluxe", "suite", "family"]
  const competitorPrices = params.competitorPrices as Record<string, number>

  try {
    const targetDate = new Date(date)
    const dayOfWeek = targetDate.getDay()
    const month = targetDate.getMonth()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
    const isHoliday = checkHoliday(targetDate)
    const event = checkEvents(targetDate)
    
    // Base prices per room type
    const basePrices: Record<string, number> = {
      standard: 150,
      deluxe: 220,
      suite: 380,
      family: 280,
    }
    
    // Calculate demand factor
    let demandFactor = 1.0
    if (isWeekend) demandFactor *= 1.15
    if (isHoliday) demandFactor *= 1.3
    if (event) demandFactor *= (1 + event.demandIncrease / 100)
    demandFactor *= getSeasonalMultiplier(month)
    
    // Generate recommendations
    const recommendations = roomTypes.map(roomType => {
      const basePrice = basePrices[roomType] || 180
      const optimalPrice = Math.round(basePrice * demandFactor)
      const minPrice = Math.round(basePrice * 0.8)
      const maxPrice = Math.round(basePrice * 1.5 * demandFactor)
      
      const competitorPrice = competitorPrices?.[roomType]
      const pricePosition = competitorPrice 
        ? optimalPrice < competitorPrice ? "below_market" : optimalPrice > competitorPrice ? "above_market" : "at_market"
        : "unknown"
      
      return {
        roomType,
        currentBasePrice: basePrice,
        recommendedPrice: optimalPrice,
        priceRange: { min: minPrice, max: maxPrice },
        demandFactor: Math.round(demandFactor * 100) / 100,
        competitorPrice: competitorPrice || null,
        pricePosition,
        reasoning: generatePricingReasoning(roomType, demandFactor, isWeekend, isHoliday, event),
        potentialRevenue: {
          atMinPrice: Math.round(minPrice * 0.95), // High occupancy at low price
          atOptimalPrice: Math.round(optimalPrice * 0.75), // Good balance
          atMaxPrice: Math.round(maxPrice * 0.50), // Lower occupancy at high price
        },
      }
    })
    
    return {
      success: true,
      data: {
        date,
        hotelId: hotelId || "default",
        factors: {
          isWeekend,
          isHoliday,
          event: event?.name || null,
          seasonalMultiplier: getSeasonalMultiplier(month),
          overallDemandFactor: demandFactor,
        },
        recommendations,
        strategy: demandFactor > 1.2 
          ? "aggressive" 
          : demandFactor < 0.9 
            ? "promotional"
            : "balanced",
        insights: [
          demandFactor > 1.2 
            ? "High demand expected - maximize revenue with premium pricing"
            : demandFactor < 0.9
              ? "Low demand expected - consider promotions to boost occupancy"
              : "Normal demand - maintain competitive pricing",
          isWeekend ? "Weekend premium applies" : "Weekday rates recommended",
          event ? `Event "${event.name}" increases demand by ${event.demandIncrease}%` : null,
        ].filter(Boolean),
      },
      message: `Pricing recommendations for ${date}: Strategy "${demandFactor > 1.2 ? "aggressive" : demandFactor < 0.9 ? "promotional" : "balanced"}" with demand factor ${demandFactor.toFixed(2)}`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate pricing recommendations: ${error}`,
    }
  }
}

// Analyze Seasonality
async function analyzeSeasonality(
  params: Record<string, unknown>,
  context: ForecastContext
): Promise<ForecastResult> {
  const hotelId = params.hotelId as string
  const year = (params.year as number) || new Date().getFullYear()

  try {
    const monthlyPatterns: SeasonalPattern[] = [
      { period: "January", demandMultiplier: 0.75, description: "Low season - post-holiday slump" },
      { period: "February", demandMultiplier: 0.80, description: "Low season - winter" },
      { period: "March", demandMultiplier: 0.95, description: "Spring begins - Purim/Passover prep" },
      { period: "April", demandMultiplier: 1.25, description: "High season - Passover holidays" },
      { period: "May", demandMultiplier: 1.10, description: "Pleasant weather - Independence Day" },
      { period: "June", demandMultiplier: 1.15, description: "Early summer - school holidays begin" },
      { period: "July", demandMultiplier: 1.35, description: "Peak season - summer vacation" },
      { period: "August", demandMultiplier: 1.40, description: "Peak season - summer vacation" },
      { period: "September", demandMultiplier: 1.30, description: "High holidays - Rosh Hashana/Yom Kippur" },
      { period: "October", demandMultiplier: 1.20, description: "Sukkot holidays - pleasant weather" },
      { period: "November", demandMultiplier: 0.85, description: "Shoulder season - fall" },
      { period: "December", demandMultiplier: 0.90, description: "Hanukkah - moderate demand" },
    ]
    
    const weeklyPatterns = [
      { day: "Sunday", demandMultiplier: 0.70, description: "Week start - business travel begins" },
      { day: "Monday", demandMultiplier: 0.75, description: "Business travel" },
      { day: "Tuesday", demandMultiplier: 0.80, description: "Business travel" },
      { day: "Wednesday", demandMultiplier: 0.85, description: "Mid-week peak" },
      { day: "Thursday", demandMultiplier: 0.95, description: "Pre-weekend arrivals" },
      { day: "Friday", demandMultiplier: 1.30, description: "Weekend - Shabbat" },
      { day: "Saturday", demandMultiplier: 1.35, description: "Weekend peak - Shabbat" },
    ]
    
    // Calculate annual statistics
    const avgMultiplier = monthlyPatterns.reduce((sum, p) => sum + p.demandMultiplier, 0) / 12
    const peakMonths = monthlyPatterns.filter(p => p.demandMultiplier > 1.2).map(p => p.period)
    const lowMonths = monthlyPatterns.filter(p => p.demandMultiplier < 0.85).map(p => p.period)
    
    // Upcoming events for the year
    const upcomingEvents: Event[] = [
      { name: "Purim", date: `${year}-03-14`, type: "holiday", impactLevel: "medium", demandIncrease: 20 },
      { name: "Passover", date: `${year}-04-13`, type: "holiday", impactLevel: "high", demandIncrease: 40 },
      { name: "Independence Day", date: `${year}-05-14`, type: "holiday", impactLevel: "high", demandIncrease: 35 },
      { name: "Shavuot", date: `${year}-06-02`, type: "holiday", impactLevel: "medium", demandIncrease: 25 },
      { name: "Rosh Hashana", date: `${year}-09-16`, type: "holiday", impactLevel: "high", demandIncrease: 45 },
      { name: "Yom Kippur", date: `${year}-09-25`, type: "holiday", impactLevel: "medium", demandIncrease: 15 },
      { name: "Sukkot", date: `${year}-09-30`, type: "holiday", impactLevel: "high", demandIncrease: 40 },
      { name: "Hanukkah", date: `${year}-12-26`, type: "holiday", impactLevel: "medium", demandIncrease: 20 },
      { name: "Tel Aviv Marathon", date: `${year}-02-28`, type: "sport", impactLevel: "medium", demandIncrease: 25 },
      { name: "DLD Conference", date: `${year}-09-04`, type: "conference", impactLevel: "high", demandIncrease: 30 },
    ]
    
    return {
      success: true,
      data: {
        year,
        hotelId: hotelId || "default",
        monthlyPatterns,
        weeklyPatterns,
        statistics: {
          averageMultiplier: Math.round(avgMultiplier * 100) / 100,
          peakMonths,
          lowMonths,
          peakDays: ["Friday", "Saturday"],
          lowDays: ["Sunday", "Monday"],
          seasonalVariation: Math.round((Math.max(...monthlyPatterns.map(p => p.demandMultiplier)) - 
                                         Math.min(...monthlyPatterns.map(p => p.demandMultiplier))) * 100) + "%",
        },
        upcomingEvents: upcomingEvents.filter(e => new Date(e.date) > new Date()),
        recommendations: [
          `Peak season (${peakMonths.join(", ")}): Maximize rates, minimum 3-night stays`,
          `Low season (${lowMonths.join(", ")}): Run promotions, partner with tour operators`,
          "Friday/Saturday: Premium weekend packages",
          "Sunday-Thursday: Business traveler rates, corporate deals",
        ],
      },
      message: `Seasonality analysis for ${year}: Peak months are ${peakMonths.join(", ")}, low months are ${lowMonths.join(", ")}`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to analyze seasonality: ${error}`,
    }
  }
}

// Detect Demand Anomalies
async function detectDemandAnomalies(
  params: Record<string, unknown>,
  context: ForecastContext
): Promise<ForecastResult> {
  const hotelId = params.hotelId as string
  const period = (params.period as string) || "month"
  const threshold = (params.threshold as number) || 20 // % deviation from expected

  try {
    // Generate historical data with some anomalies
    const anomalies: Array<{
      date: string
      actualDemand: number
      expectedDemand: number
      deviation: number
      type: "surge" | "drop"
      possibleCauses: string[]
      recommendation: string
    }> = [
      {
        date: "2026-01-10",
        actualDemand: 92,
        expectedDemand: 65,
        deviation: 41.5,
        type: "surge",
        possibleCauses: ["Unplanned event", "Competitor outage", "Viral social media"],
        recommendation: "Investigate cause for future planning; consider dynamic pricing",
      },
      {
        date: "2026-01-15",
        actualDemand: 35,
        expectedDemand: 60,
        deviation: -41.7,
        type: "drop",
        possibleCauses: ["Bad weather", "Negative review impact", "Local emergency"],
        recommendation: "Review recent feedback; check for external factors",
      },
      {
        date: "2026-01-22",
        actualDemand: 88,
        expectedDemand: 70,
        deviation: 25.7,
        type: "surge",
        possibleCauses: ["Local conference", "Sports event nearby"],
        recommendation: "Add to event calendar for next year",
      },
    ]
    
    // Pattern analysis
    const patterns = {
      frequentSurges: {
        count: 8,
        commonDays: ["Friday", "Saturday"],
        commonMonths: ["July", "August", "September"],
      },
      frequentDrops: {
        count: 5,
        commonDays: ["Sunday", "Monday"],
        commonMonths: ["January", "February"],
      },
    }
    
    return {
      success: true,
      data: {
        hotelId: hotelId || "default",
        period,
        threshold: threshold + "%",
        anomaliesDetected: anomalies.length,
        anomalies,
        patterns,
        summary: {
          totalAnomalies: anomalies.length,
          surges: anomalies.filter(a => a.type === "surge").length,
          drops: anomalies.filter(a => a.type === "drop").length,
          averageDeviation: Math.round(anomalies.reduce((sum, a) => sum + Math.abs(a.deviation), 0) / anomalies.length) + "%",
        },
        alerts: anomalies.filter(a => Math.abs(a.deviation) > 30).map(a => ({
          severity: "high",
          date: a.date,
          message: `${a.type === "surge" ? "Unexpected surge" : "Unexpected drop"}: ${a.deviation.toFixed(1)}% deviation`,
        })),
        recommendations: [
          anomalies.some(a => a.type === "surge") 
            ? "Monitor for recurring surge patterns - opportunity for dynamic pricing"
            : null,
          anomalies.some(a => a.type === "drop")
            ? "Investigate drop causes - may indicate operational or marketing issues"
            : null,
          "Set up automated alerts for deviations > 25%",
          "Review anomaly causes quarterly for forecasting improvement",
        ].filter(Boolean),
      },
      message: `Detected ${anomalies.length} demand anomalies in ${period}: ${anomalies.filter(a => a.type === "surge").length} surges, ${anomalies.filter(a => a.type === "drop").length} drops`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to detect demand anomalies: ${error}`,
    }
  }
}

// Helper Functions
function getSeasonalMultiplier(month: number): number {
  const multipliers = [0.75, 0.80, 0.95, 1.25, 1.10, 1.15, 1.35, 1.40, 1.30, 1.20, 0.85, 0.90]
  return multipliers[month]
}

function checkHoliday(date: Date): boolean {
  // Simplified holiday check (in production, use a proper calendar API)
  const holidays = [
    "2026-03-14", // Purim
    "2026-04-13", "2026-04-14", "2026-04-19", "2026-04-20", // Passover
    "2026-05-14", // Independence Day
    "2026-06-02", // Shavuot
    "2026-09-16", "2026-09-17", // Rosh Hashana
    "2026-09-25", // Yom Kippur
    "2026-09-30", "2026-10-01", "2026-10-07", // Sukkot
  ]
  return holidays.includes(date.toISOString().split("T")[0])
}

function checkEvents(date: Date): Event | null {
  const events: Event[] = [
    { name: "DLD Tel Aviv", date: "2026-09-04", type: "conference", impactLevel: "high", demandIncrease: 30 },
    { name: "Tel Aviv Marathon", date: "2026-02-28", type: "sport", impactLevel: "medium", demandIncrease: 25 },
    { name: "Pride Parade", date: "2026-06-12", type: "festival", impactLevel: "high", demandIncrease: 40 },
  ]
  
  const dateStr = date.toISOString().split("T")[0]
  return events.find(e => {
    const eventDate = new Date(e.date)
    const daysBefore = 2
    const daysAfter = 1
    const rangeStart = new Date(eventDate)
    rangeStart.setDate(rangeStart.getDate() - daysBefore)
    const rangeEnd = new Date(eventDate)
    rangeEnd.setDate(rangeEnd.getDate() + daysAfter)
    return date >= rangeStart && date <= rangeEnd
  }) || null
}

function generatePricingReasoning(
  roomType: string,
  demandFactor: number,
  isWeekend: boolean,
  isHoliday: boolean,
  event: Event | null
): string[] {
  const reasons: string[] = []
  
  if (demandFactor > 1.2) {
    reasons.push("High demand conditions justify premium pricing")
  } else if (demandFactor < 0.9) {
    reasons.push("Low demand suggests competitive pricing needed")
  }
  
  if (isWeekend) {
    reasons.push("Weekend premium applies (+15%)")
  }
  
  if (isHoliday) {
    reasons.push("Holiday period increases willingness to pay (+30%)")
  }
  
  if (event) {
    reasons.push(`${event.name} event drives additional demand (+${event.demandIncrease}%)`)
  }
  
  if (roomType === "suite") {
    reasons.push("Premium room type commands higher rates")
  }
  
  return reasons
}

export default demandForecastingHandler
