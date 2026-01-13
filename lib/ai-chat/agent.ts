/**
 * AI Agent Orchestrator
 * המוח המרכזי - מתאם בין LLM, Skills, Memory ו-Prediction
 */

import { allSkills, executeSkill, getSkillsPrompt } from "./skills"
import { memoryManager, type ConversationContext } from "./memory"
import { predictionEngine } from "./prediction"
import { format, addDays } from "date-fns"

export interface AgentResponse {
  message: string
  skillsUsed?: string[]
  predictions?: any[]
  suggestions?: string[]
  confidence: number
  needsMoreInfo?: boolean
  nextSteps?: string[]
}

export interface AgentConfig {
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro"
  temperature: number
  maxTokens: number
  systemPrompt?: string
}

/**
 * 🤖 AI Agent Orchestrator
 */
export class AIAgent {
  private config: AgentConfig
  private sessionId: string

  constructor(sessionId: string, config?: Partial<AgentConfig>) {
    this.sessionId = sessionId
    this.config = {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    }
  }

  /**
   * עיבוד הודעה מהמשתמש
   */
  async processMessage(userMessage: string): Promise<AgentResponse> {
    try {
      // 1. שמור הודעת משתמש בזיכרון
      memoryManager.addMessage(this.sessionId, "user", userMessage)

      // 2. בנה קונטקסט מלא
      const contextPrompt =
        memoryManager.buildContextualPrompt(this.sessionId, userMessage)

      // 3. נתח כוונה
      const intent = memoryManager.analyzeIntent(userMessage)
      console.log("Intent detected:", intent)

      // 4. קבל predictions
      const predictions = predictionEngine.predictForConversation({
        userMessage,
        preferences: memoryManager.getUserPreferences(this.sessionId),
        currentBooking: memoryManager.getBookingContext(this.sessionId),
      })

      // 5. שלח ל-LLM עם skills זמינים
      const llmResponse = await this.callLLM(contextPrompt, intent, predictions)

      // 6. זהה אם צריך להשתמש ב-skills
      const skillCalls = this.extractSkillCalls(llmResponse.rawResponse)

      // 7. בצע skills אם נדרש
      const skillResults = await this.executeSkills(skillCalls)

      // 8. בנה תשובה סופית
      const finalResponse = await this.buildFinalResponse(
        llmResponse,
        skillResults,
        predictions
      )

      // 9. שמור תשובה בזיכרון
      memoryManager.addMessage(this.sessionId, "assistant", finalResponse.message, {
        skillsUsed: skillResults.map((r) => r.skillName),
        predictions,
        confidence: finalResponse.confidence,
      })

      // 10. עדכן booking context אם רלוונטי
      this.updateBookingContext(userMessage, skillResults)

      // 11. שמור לזיכרון ארוך טווח
      await memoryManager.saveToLongTermMemory(this.sessionId)

      return finalResponse
    } catch (error: any) {
      console.error("Agent error:", error)
      return {
        message: "מצטער, נתקלתי בבעיה. אפשר לנסות שוב?",
        confidence: 0,
        skillsUsed: [],
      }
    }
  }

  /**
   * קריאה ל-LLM
   */
  private async callLLM(
    contextPrompt: string,
    intent: any,
    predictions: any[]
  ): Promise<{ rawResponse: string; text: string }> {
    const systemPrompt = this.buildSystemPrompt(intent, predictions)

    // TODO: Replace with actual LLM API call (OpenAI/Anthropic/etc)
    // For now, simulate response
    const response = await this.simulateLLM(contextPrompt, systemPrompt, intent)

    return {
      rawResponse: response,
      text: response,
    }
  }

  /**
   * בניית System Prompt
   */
  private buildSystemPrompt(intent: any, predictions: any[]): string {
    let prompt = `
אתה עוזר AI חכם ומקצועי למנוע הזמנות מלונות.

## תפקידך:
- עזור למשתמשים למצוא ולהזמין מלונות
- תן המלצות מבוססות נתונים
- השתמש ב-skills הזמינים כשצריך
- היה ידידותי, מקצועי ויעיל

## Skills זמינים:
${getSkillsPrompt()}

## ההקשר הנוכחי:
כוונת המשתמש: ${intent.intent}

${
  predictions.length > 0
    ? `
## חיזויים והמלצות:
${predictions.map((p) => `- ${p.reasoning}`).join("\n")}
`
    : ""
}

## הנחיות:
1. אם המשתמש מחפש מלון - השתמש ב-search_hotels skill
2. אם המשתמש רוצה להזמין - עבור דרך: search → prebook → validate → book
3. תן המלצות מבוססות על predictions
4. היה ספציפי עם מחירים, תאריכים ופרטים
5. אם חסר מידע - שאל שאלות ברורות

## פורמט תשובה:
אם צריך skill, החזר JSON:
{
  "action": "use_skill",
  "skill": "skill_name",
  "parameters": { ... },
  "message": "הסבר למשתמש מה אתה עושה"
}

אם לא צריך skill, החזר רק טקסט.
`

    return prompt
  }

  /**
   * חילוץ skill calls מתשובת LLM
   */
  private extractSkillCalls(response: string): Array<{
    skill: string
    parameters: any
  }> {
    const skillCalls: Array<{ skill: string; parameters: any }> = []

    try {
      // חפש JSON blocks
      const jsonMatches = response.match(/\{[\s\S]*?\}/g)

      if (jsonMatches) {
        jsonMatches.forEach((match) => {
          try {
            const parsed = JSON.parse(match)
            if (parsed.action === "use_skill" && parsed.skill) {
              skillCalls.push({
                skill: parsed.skill,
                parameters: parsed.parameters || {},
              })
            }
          } catch (e) {
            // Not valid JSON, skip
          }
        })
      }
    } catch (error) {
      console.error("Error extracting skill calls:", error)
    }

    return skillCalls
  }

  /**
   * ביצוע skills
   */
  private async executeSkills(
    skillCalls: Array<{ skill: string; parameters: any }>
  ): Promise<Array<{ skillName: string; result: any }>> {
    const results: Array<{ skillName: string; result: any }> = []

    for (const call of skillCalls) {
      try {
        const result = await executeSkill(call.skill, call.parameters)
        results.push({
          skillName: call.skill,
          result,
        })
      } catch (error: any) {
        results.push({
          skillName: call.skill,
          result: { success: false, error: error.message },
        })
      }
    }

    return results
  }

  /**
   * בניית תשובה סופית
   */
  private async buildFinalResponse(
    llmResponse: { text: string },
    skillResults: Array<{ skillName: string; result: any }>,
    predictions: any[]
  ): Promise<AgentResponse> {
    let message = llmResponse.text

    // הסר JSON blocks מהתשובה
    message = message.replace(/\{[\s\S]*?\}/g, "").trim()

    // הוסף תוצאות skills
    if (skillResults.length > 0) {
      skillResults.forEach((sr) => {
        if (sr.result.success && sr.result.message) {
          message += `\n\n${sr.result.message}`
        }
      })
    }

    // חשב confidence
    let confidence = 0.7
    if (skillResults.length > 0) {
      const successRate =
        skillResults.filter((r) => r.result.success).length / skillResults.length
      confidence = successRate * 0.9
    }

    // בנה suggestions
    const suggestions: string[] = []
    predictions.forEach((p) => {
      if (p.confidence > 0.7 && p.reasoning) {
        suggestions.push(p.reasoning)
      }
    })

    // קבע next steps
    const bookingContext = memoryManager.getBookingContext(this.sessionId)
    const nextSteps = this.determineNextSteps(bookingContext, skillResults)

    return {
      message,
      skillsUsed: skillResults.map((r) => r.skillName),
      predictions,
      suggestions: suggestions.slice(0, 3),
      confidence,
      nextSteps,
    }
  }

  /**
   * עדכון booking context
   */
  private updateBookingContext(
    userMessage: string,
    skillResults: Array<{ skillName: string; result: any }>
  ): void {
    skillResults.forEach((sr) => {
      if (!sr.result.success) return

      switch (sr.skillName) {
        case "search_hotels":
          // שמור תוצאות חיפוש
          memoryManager.updateBookingContext(this.sessionId, {
            stage: "search",
          })
          break

        case "prebook_room":
          // שמור PreBook token
          memoryManager.updateBookingContext(this.sessionId, {
            preBookToken: sr.result.data?.token,
            stage: "prebook",
          })
          break

        case "validate_booking":
          // עבור לשלב פרטים
          memoryManager.updateBookingContext(this.sessionId, {
            stage: "details",
          })
          break

        case "book_room":
          // הזמנה הושלמה!
          memoryManager.updateBookingContext(this.sessionId, {
            stage: "confirmed",
          })
          break
      }
    })
  }

  /**
   * קביעת צעדים הבאים
   */
  private determineNextSteps(
    bookingContext: any,
    skillResults: Array<{ skillName: string; result: any }>
  ): string[] {
    const steps: string[] = []

    if (!bookingContext) {
      steps.push("בוא נתחיל - תגיד לי מתי אתה רוצה לנסוע?")
      return steps
    }

    switch (bookingContext.stage) {
      case "search":
        steps.push("בחר חדר מהתוצאות")
        steps.push("או שנה את פרמטרי החיפוש")
        break

      case "prebook":
        steps.push("מלא את פרטיך האישיים")
        steps.push(`יש לך ${30} דקות לסיים את ההזמנה`)
        break

      case "details":
        steps.push("אשר את הפרטים ועבור לתשלום")
        break

      case "payment":
        steps.push("מלא פרטי כרטיס אשראי")
        break

      case "confirmed":
        steps.push("ההזמנה אושרה! תקבל אישור במייל")
        break
    }

    return steps
  }

  /**
   * סימולציה של LLM (להחלפה עם API אמיתי)
   */
  private async simulateLLM(
    contextPrompt: string,
    systemPrompt: string,
    intent: any
  ): Promise<string> {
    // TODO: Replace with actual API call
    // For now, generate smart responses based on intent

    switch (intent.intent) {
      case "search":
        return `{
  "action": "use_skill",
  "skill": "search_hotels",
  "parameters": {
    "checkIn": "${format(addDays(new Date(), 7), "yyyy-MM-dd")}",
    "checkOut": "${format(addDays(new Date(), 9), "yyyy-MM-dd")}",
    "adults": 2
  },
  "message": "אני מחפש עבורך מלונות זמינים..."
}

בטח! אני מחפש עבורך מלונות. רגע אחד...`

      case "info":
        if (contextPrompt.includes("מחיר")) {
          return "המחירים משתנים לפי תאריכים, סוג חדר ומספר אורחים. אם תספר לי מתי אתה מתכנן לנסוע, אוכל לתת לך מידע מדויק יותר."
        }
        return "אשמח לעזור! על מה בדיוק אתה רוצה לדעת?"

      case "help":
        return `אני כאן כדי לעזור לך להזמין מלון! אני יכול:

🔍 לחפש מלונות זמינים
💡 לתת המלצות מבוססות נתונים
📅 להמליץ על תאריכים אופטימליים
💰 לחשב מחירים ולעקוב אחרי מבצעים
✅ לבצע הזמנה מלאה

פשוט תגיד לי מה אתה צריך!`

      default:
        return "מעניין! ספר לי יותר - מה אתה מחפש?"
    }
  }

  /**
   * קבל סטטוס השיחה
   */
  getConversationStatus(): {
    messageCount: number
    bookingStage?: string
    hasPreBook: boolean
  } {
    const messages = memoryManager.getMessages(this.sessionId)
    const booking = memoryManager.getBookingContext(this.sessionId)

    return {
      messageCount: messages.length,
      bookingStage: booking?.stage,
      hasPreBook: !!booking?.preBookToken,
    }
  }

  /**
   * איפוס שיחה
   */
  reset(): void {
    memoryManager.clearBookingContext(this.sessionId)
  }
}

/**
 * Helper: צור agent חדש
 */
export function createAgent(
  sessionId: string,
  config?: Partial<AgentConfig>
): AIAgent {
  return new AIAgent(sessionId, config)
}
