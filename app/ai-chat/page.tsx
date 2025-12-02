"use client"

import { ChatInterface } from "@/components/ai-chat/chat-interface"
import { HotelConfigProvider } from "@/lib/hotel-config-context"

export default function AiChatPage() {
  return (
    <HotelConfigProvider>
      <div className="h-screen">
        <ChatInterface language="he" />
      </div>
    </HotelConfigProvider>
  )
}
