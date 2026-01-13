"use client"

import { EnhancedAIChat } from "@/components/ai-chat/enhanced-ai-chat"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Database, Target } from "lucide-react"

export default function AIBookingPage() {
  const sessionId = `session_${Date.now()}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🤖 AI Booking Agent
          </h1>
          <p className="text-muted-foreground mt-2">
            מופעל על ידי Skills, Memory, Prediction ו-Medici API
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* Sidebar - Capabilities */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                יכולות ה-AI
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">8 Skills</div>
                    <div className="text-xs text-muted-foreground">
                      חיפוש, PreBook, אימות, הזמנה, חיזוי מחיר, המלצות
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Memory System</div>
                    <div className="text-xs text-muted-foreground">
                      זוכר היסטוריה, העדפות וקונטקסט הזמנה
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Prediction Engine</div>
                    <div className="text-xs text-muted-foreground">
                      חיזוי מחירים, תאריכים והמלצות חכמות
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">🎯 תהליך ההזמנה</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <span>חיפוש מלונות</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span>PreBook (30 דקות)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span>מילוי פרטים</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span>אישור ותשלום</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="font-bold mb-3">💡 טיפים</h3>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li>• ספר לי מתי אתה רוצה לנסוע</li>
                <li>• שאל על המלצות והצעות</li>
                <li>• בקש חיזוי מחירים</li>
                <li>• אני זוכר את ההיסטוריה שלך</li>
              </ul>
            </Card>
          </div>

          {/* Main Chat */}
          <div>
            <EnhancedAIChat
              sessionId={sessionId}
              onBookingUpdate={(booking) => {
                console.log("Booking updated:", booking)
              }}
            />

            {/* Features Grid */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-semibold text-sm">חכם ולומד</div>
                <div className="text-xs text-muted-foreground mt-1">
                  מבין כוונות ולומד מהשיחה
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-sm">תגובה מהירה</div>
                <div className="text-xs text-muted-foreground mt-1">
                  מחובר ישירות ל-Medici API
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-sm">המלצות מדויקות</div>
                <div className="text-xs text-muted-foreground mt-1">
                  מבוסס נתונים וחיזוי ML
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
