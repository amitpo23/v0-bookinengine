/**
 * AI Prediction Engine
 * מנוע חיזוי והמלצות חכם
 */

import { addDays, format, differenceInDays, isWeekend } from "date-fns"
import { he } from "date-fns/locale"
import type { UserPreferences } from "./memory"

export interface PredictionResult {
  type: "date" | "price" | "room" | "destination" | "general"
  confidence: number // 0-1
  suggestion: any
  reasoning: string
}

export interface PricePrediction {
  currentPrice: number
  predictedPrice: number
  trend: "up" | "down" | "stable"
  confidence: number
  recommendation: string
}

export interface DatePrediction {
  suggestedCheckIn: string
  suggestedCheckOut: string
  nights: number
  reasoning: string
  savings?: number
}

/**
 * 🔮 Prediction Engine
 */
export class PredictionEngine {
  /**
   * חיזוי מחיר אופטימלי
   */
  predictOptimalPrice(
    roomPrice: number,
    checkIn: string,
    checkOut: string
  ): PricePrediction {
    const checkInDate = new Date(checkIn)
    const daysUntilCheckIn = differenceInDays(checkInDate, new Date())

    let predictedPrice = roomPrice
    let trend: "up" | "down" | "stable" = "stable"
    let confidence = 0.7

    // חיזוי לפי מרחק זמן
    if (daysUntilCheckIn < 7) {
      // Last minute - מחירים גבוהים
      predictedPrice = roomPrice * 1.15
      trend = "up"
      confidence = 0.85
    } else if (daysUntilCheckIn < 14) {
      predictedPrice = roomPrice * 1.05
      trend = "up"
      confidence = 0.75
    } else if (daysUntilCheckIn > 60) {
      // הזמנה מוקדמת - הנחה
      predictedPrice = roomPrice * 0.9
      trend = "down"
      confidence = 0.8
    }

    // חיזוי לפי יום בשבוע
    if (isWeekend(checkInDate)) {
      predictedPrice *= 1.2
      trend = "up"
    }

    const recommendation =
      trend === "down"
        ? "מומלץ להזמין עכשיו - מחיר טוב!"
        : trend === "up"
          ? "מחיר עולה - שקול להזמין מהר"
          : "מחיר יציב"

    return {
      currentPrice: roomPrice,
      predictedPrice: Math.round(predictedPrice),
      trend,
      confidence,
      recommendation,
    }
  }

  /**
   * המלצת תאריכים אופטימליים
   */
  predictOptimalDates(preferences?: {
    flexibility?: number
    budgetSensitive?: boolean
  }): DatePrediction[] {
    const today = new Date()
    const predictions: DatePrediction[] = []

    // אמצע שבוע - מחירים נמוכים
    const nextTuesday = this.getNextDayOfWeek(today, 2) // Tuesday = 2
    predictions.push({
      suggestedCheckIn: format(nextTuesday, "yyyy-MM-dd"),
      suggestedCheckOut: format(addDays(nextTuesday, 2), "yyyy-MM-dd"),
      nights: 2,
      reasoning: "אמצע שבוע - מחירים נמוכים ב-15-20% בממוצע",
      savings: 15,
    })

    // סוף שבוע הבא (אם לא בעונה)
    const nextFriday = this.getNextDayOfWeek(today, 5)
    predictions.push({
      suggestedCheckIn: format(nextFriday, "yyyy-MM-dd"),
      suggestedCheckOut: format(addDays(nextFriday, 2), "yyyy-MM-dd"),
      nights: 2,
      reasoning: "סוף שבוע פופולרי - הזמן מוקדם לזמינות טובה",
    })

    // חופשה ארוכה (בעוד 3 שבועות)
    const futureDate = addDays(today, 21)
    predictions.push({
      suggestedCheckIn: format(futureDate, "yyyy-MM-dd"),
      suggestedCheckOut: format(addDays(futureDate, 4), "yyyy-MM-dd"),
      nights: 4,
      reasoning: "הזמנה מוקדמת - הנחה של עד 10%",
      savings: 10,
    })

    return predictions
  }

  /**
   * המלצת חדרים לפי העדפות
   */
  predictBestRoom(
    rooms: any[],
    preferences?: UserPreferences
  ): Array<{
    room: any
    score: number
    reasoning: string[]
  }> {
    return rooms
      .map((room) => {
        let score = 0.5 // baseline
        const reasoning: string[] = []

        // התאמה לתקציב
        if (preferences?.budgetRange) {
          const { min, max } = preferences.budgetRange
          if (room.price >= min && room.price <= max) {
            score += 0.2
            reasoning.push("מתאים לתקציב שלך")
          } else if (room.price > max) {
            score -= 0.1
          }
        }

        // שירותים מבוקשים
        if (preferences?.amenities && room.amenities) {
          const matchingAmenities = preferences.amenities.filter((a) =>
            room.amenities.includes(a)
          )
          if (matchingAmenities.length > 0) {
            score += 0.15 * matchingAmenities.length
            reasoning.push(
              `כולל: ${matchingAmenities.slice(0, 2).join(", ")}`
            )
          }
        }

        // דירוג גבוה
        if (room.rating && room.rating >= 4.5) {
          score += 0.1
          reasoning.push("דירוג גבוה")
        }

        // הנחה
        if (room.discount) {
          score += 0.15
          reasoning.push(`הנחה של ${room.discount}%`)
        }

        return { room, score: Math.min(score, 1), reasoning }
      })
      .sort((a, b) => b.score - a.score)
  }

  /**
   * חיזוי ביקוש (occupancy)
   */
  predictDemand(date: string): {
    demand: "low" | "medium" | "high"
    confidence: number
    advice: string
  } {
    const targetDate = new Date(date)
    const daysUntil = differenceInDays(targetDate, new Date())

    let demand: "low" | "medium" | "high" = "medium"
    let confidence = 0.7

    // חגים וסופי שבוע
    if (isWeekend(targetDate)) {
      demand = "high"
      confidence = 0.85
    }

    // עונתיות
    const month = targetDate.getMonth()
    if ([6, 7, 8].includes(month)) {
      // קיץ
      demand = "high"
      confidence = 0.8
    } else if ([11, 0, 1].includes(month)) {
      // חורף
      demand = "medium"
    }

    const advice =
      demand === "high"
        ? "ביקוש גבוה - מומלץ להזמין מיידית"
        : demand === "medium"
          ? "ביקוש בינוני - עדיין יש זמן"
          : "ביקוש נמוך - מחכה למחירים טובים יותר"

    return { demand, confidence, advice }
  }

  /**
   * חיזוי זמן אופטימלי להזמנה
   */
  predictBestTimeToBook(checkIn: string): {
    bestTimeDays: number
    currentDaysUntil: number
    advice: string
    urgency: "low" | "medium" | "high"
  } {
    const checkInDate = new Date(checkIn)
    const daysUntil = differenceInDays(checkInDate, new Date())

    // Sweet spot: 2-4 שבועות לפני
    const bestTimeDays = isWeekend(checkInDate) ? 21 : 14

    let urgency: "low" | "medium" | "high" = "low"
    let advice = ""

    if (daysUntil < 7) {
      urgency = "high"
      advice = "זמן להזמין עכשיו! מחירים עולים"
    } else if (daysUntil < 14) {
      urgency = "medium"
      advice = "זמן טוב להזמין - מחירים סבירים"
    } else if (daysUntil < 30) {
      urgency = "low"
      advice = "זמן מצוין להזמין - מחירים אופטימליים"
    } else {
      urgency = "low"
      advice = "מוקדם מדי - המתן למבצעים"
    }

    return {
      bestTimeDays,
      currentDaysUntil: daysUntil,
      advice,
      urgency,
    }
  }

  /**
   * המלצות פרסונליות
   */
  generatePersonalizedSuggestions(
    userHistory?: any[],
    preferences?: UserPreferences
  ): PredictionResult[] {
    const suggestions: PredictionResult[] = []

    // המלצה לפי היסטוריה
    if (userHistory && userHistory.length > 0) {
      const lastBooking = userHistory[0]
      suggestions.push({
        type: "destination",
        confidence: 0.8,
        suggestion: {
          location: lastBooking.location,
          reason: "הזמנת שם בעבר",
        },
        reasoning: "לפי ההיסטוריה שלך, אהבת מלונות באזור זה",
      })
    }

    // המלצה לפי תקציב
    if (preferences?.budgetRange) {
      suggestions.push({
        type: "price",
        confidence: 0.7,
        suggestion: {
          maxPrice: preferences.budgetRange.max,
          recommendations: ["חפש מבצעים", "הזמן באמצע שבוע"],
        },
        reasoning: `מתאים לתקציב של עד ₪${preferences.budgetRange.max}`,
      })
    }

    // המלצה כללית
    suggestions.push({
      type: "general",
      confidence: 0.9,
      suggestion: {
        tip: "הזמן 2-3 שבועות מראש למחירים הטובים ביותר",
      },
      reasoning: "סטטיסטיקה מראה שזה הזמן האופטימלי",
    })

    return suggestions
  }

  /**
   * ניתוח טרנד מחירים
   */
  analyzePriceTrend(priceHistory: { date: string; price: number }[]): {
    trend: "increasing" | "decreasing" | "stable"
    changePercent: number
    forecast: number
  } {
    if (priceHistory.length < 2) {
      return { trend: "stable", changePercent: 0, forecast: 0 }
    }

    const latest = priceHistory[priceHistory.length - 1]
    const previous = priceHistory[priceHistory.length - 2]

    const changePercent =
      ((latest.price - previous.price) / previous.price) * 100

    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (changePercent > 2) trend = "increasing"
    if (changePercent < -2) trend = "decreasing"

    // חיזוי פשוט - linear projection
    const forecast = Math.round(latest.price * (1 + changePercent / 100))

    return { trend, changePercent, forecast }
  }

  /**
   * Helper: קבל יום הבא בשבוע
   */
  private getNextDayOfWeek(date: Date, targetDay: number): Date {
    const result = new Date(date)
    const currentDay = result.getDay()
    const daysUntil = (targetDay - currentDay + 7) % 7 || 7
    result.setDate(result.getDate() + daysUntil)
    return result
  }

  /**
   * חיזוי מקיף לשיחה
   */
  predictForConversation(context: {
    userMessage: string
    preferences?: UserPreferences
    currentBooking?: any
  }): PredictionResult[] {
    const predictions: PredictionResult[] = []

    // אם משתמש שואל על מחיר
    if (context.userMessage.toLowerCase().includes("מחיר")) {
      if (context.currentBooking?.checkIn) {
        const pricePrediction = this.predictOptimalPrice(
          context.currentBooking.price || 1000,
          context.currentBooking.checkIn,
          context.currentBooking.checkOut
        )

        predictions.push({
          type: "price",
          confidence: pricePrediction.confidence,
          suggestion: pricePrediction,
          reasoning: pricePrediction.recommendation,
        })
      }
    }

    // אם משתמש שואל על תאריכים
    if (
      context.userMessage.toLowerCase().includes("תאריך") ||
      context.userMessage.toLowerCase().includes("מתי")
    ) {
      const datePredictions = this.predictOptimalDates({
        budgetSensitive: context.preferences?.budgetRange !== undefined,
      })

      datePredictions.forEach((dp) => {
        predictions.push({
          type: "date",
          confidence: 0.8,
          suggestion: dp,
          reasoning: dp.reasoning,
        })
      })
    }

    return predictions
  }
}

// Singleton instance
export const predictionEngine = new PredictionEngine()
