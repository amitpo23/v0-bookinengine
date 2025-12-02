import { generateText } from "ai"

export async function POST(request: Request) {
  const { messages, hotelConfig, language } = await request.json()

  const systemPrompt =
    language === "he"
      ? `אתה עוזר הזמנות וירטואלי למלון ${hotelConfig.name}. 
       אתה עוזר לאורחים לבדוק זמינות, לקבל מידע על חדרים ושירותים, ולבצע הזמנות.
       דבר בעברית בסגנון ${hotelConfig.aiChatSettings.personality === "luxury" ? "יוקרתי ומפנק" : hotelConfig.aiChatSettings.personality === "friendly" ? "ידידותי וחם" : "מקצועי"}.
       המלון נמצא ב${hotelConfig.city} ויש לו ${hotelConfig.stars} כוכבים.`
      : `You are a virtual booking assistant for ${hotelConfig.name}.
       You help guests check availability, get information about rooms and services, and make reservations.
       Speak in a ${hotelConfig.aiChatSettings.personality} tone.
       The hotel is located in ${hotelConfig.city} and has ${hotelConfig.stars} stars.`

  try {
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
