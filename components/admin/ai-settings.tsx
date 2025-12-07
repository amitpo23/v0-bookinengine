"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHotelConfig } from "@/lib/hotel-config-context"
import type { HotelConfig } from "@/types/saas"
import { Badge } from "@/components/ui/badge"

// SVG Icons
const BotIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 4v16m8-8H4" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
)

const ChatBubbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
)

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
)

export function AiSettings() {
  const { currentHotel, updateHotel } = useHotelConfig()
  const [hotel, setHotel] = useState<HotelConfig | null>(currentHotel)
  const [newQuestion, setNewQuestion] = useState("")
  const [newKnowledge, setNewKnowledge] = useState({ title: "", content: "" })
  const [adminQuery, setAdminQuery] = useState("")
  const [adminMessages, setAdminMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [isAdminLoading, setIsAdminLoading] = useState(false)
  const [analysisText, setAnalysisText] = useState("")
  const [analysisResult, setAnalysisResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (!hotel) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">אנא בחר מלון תחילה</p>
        </CardContent>
      </Card>
    )
  }

  // Initialize AI settings if not exists
  const aiSettings = hotel.aiChatSettings || {
    welcomeMessage: "",
    welcomeMessageHe: "",
    suggestedQuestions: [],
    personality: "professional" as const,
    language: "he" as const,
    systemInstructions: "",
    knowledgeBase: [],
    useEmojis: false,
    suggestUpsells: true,
    collectContactInfo: true,
    externalInfoSources: [],
  }

  const handleSave = () => {
    if (hotel) {
      updateHotel(hotel)
      alert("ההגדרות נשמרו בהצלחה!")
    }
  }

  const addSuggestedQuestion = () => {
    if (newQuestion.trim()) {
      const questions = [...(aiSettings.suggestedQuestions || []), newQuestion.trim()]
      setHotel({
        ...hotel,
        aiChatSettings: { ...aiSettings, suggestedQuestions: questions },
      })
      setNewQuestion("")
    }
  }

  const removeSuggestedQuestion = (index: number) => {
    const questions = [...(aiSettings.suggestedQuestions || [])]
    questions.splice(index, 1)
    setHotel({
      ...hotel,
      aiChatSettings: { ...aiSettings, suggestedQuestions: questions },
    })
  }

  const addKnowledgeItem = () => {
    if (newKnowledge.title.trim() && newKnowledge.content.trim()) {
      const knowledge = [...(aiSettings.knowledgeBase || []), newKnowledge]
      setHotel({
        ...hotel,
        aiChatSettings: { ...aiSettings, knowledgeBase: knowledge },
      })
      setNewKnowledge({ title: "", content: "" })
    }
  }

  const removeKnowledgeItem = (index: number) => {
    const knowledge = [...(aiSettings.knowledgeBase || [])]
    knowledge.splice(index, 1)
    setHotel({
      ...hotel,
      aiChatSettings: { ...aiSettings, knowledgeBase: knowledge },
    })
  }

  const handleAdminAssistantQuery = async () => {
    if (!adminQuery.trim()) return

    const userMessage = adminQuery.trim()
    setAdminMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setAdminQuery("")
    setIsAdminLoading(true)

    try {
      const response = await fetch("/api/ai/admin-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            hotelName: hotel?.name,
            currentPrompt: aiSettings.systemInstructions,
            knowledgeBase: aiSettings.knowledgeBase,
          },
        }),
      })

      const data = await response.json()
      setAdminMessages((prev) => [...prev, { role: "assistant", content: data.response || data.error }])
    } catch (error) {
      setAdminMessages((prev) => [...prev, { role: "assistant", content: "שגיאה בתקשורת עם העוזר" }])
    } finally {
      setIsAdminLoading(false)
    }
  }

  const handleAnalyzeConversations = async () => {
    if (!analysisText.trim()) return

    setIsAnalyzing(true)
    setAnalysisResult("")

    try {
      const response = await fetch("/api/ai/analyze-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: analysisText,
        }),
      })

      const data = await response.json()

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis)
      } else {
        setAnalysisResult(`שגיאה: ${data.error || "לא ניתן לנתח את השיחה"}`)
      }
    } catch (error) {
      setAnalysisResult("שגיאה בתקשורת עם השרת")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={hotel.enableAiChat ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-700"}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${hotel.enableAiChat ? "bg-emerald-500/20" : "bg-slate-800"}`}>
                <BotIcon className={`w-8 h-8 ${hotel.enableAiChat ? "text-emerald-400" : "text-slate-500"}`} />
              </div>
              <div>
                <CardTitle className="text-xl">צ'אט AI להזמנות</CardTitle>
                <CardDescription>הגדר את העוזר הווירטואלי החכם שלך</CardDescription>
              </div>
            </div>
            <Switch
              checked={hotel.enableAiChat}
              onCheckedChange={(checked) => setHotel({ ...hotel, enableAiChat: checked })}
            />
          </div>
        </CardHeader>
      </Card>

      {hotel.enableAiChat && (
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageIcon className="w-4 h-4" />
              הודעות
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              הנחיות
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookIcon className="w-4 h-4" />
              בסיס ידע
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <BotIcon className="w-4 h-4" />
              סגנון
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              עוזר אדמין
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <DocumentIcon className="w-4 h-4" />
              מקורות מידע
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>הודעות פתיחה</CardTitle>
                <CardDescription>ההודעה הראשונה שהמשתמש יראה בצ'אט</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>הודעה פתיחה (עברית)</Label>
                  <textarea
                    value={aiSettings.welcomeMessageHe}
                    onChange={(e) =>
                      setHotel({
                        ...hotel,
                        aiChatSettings: { ...aiSettings, welcomeMessageHe: e.target.value },
                      })
                    }
                    placeholder="שלום! אני העוזר החכם שלך להזמנות. איך אוכל לעזור לך היום?"
                    className="w-full mt-2 p-3 rounded-lg bg-background border border-input min-h-[100px] resize-none"
                  />
                </div>
                <div>
                  <Label>הודעה פתיחה (אנגלית)</Label>
                  <textarea
                    value={aiSettings.welcomeMessage}
                    onChange={(e) =>
                      setHotel({
                        ...hotel,
                        aiChatSettings: { ...aiSettings, welcomeMessage: e.target.value },
                      })
                    }
                    placeholder="Hello! I'm your AI booking assistant. How can I help you today?"
                    className="w-full mt-2 p-3 rounded-lg bg-background border border-input min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>שאלות מוצעות</CardTitle>
                <CardDescription>כפתורי שאלות מהירות שיוצגו למשתמש</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="הוסף שאלה מוצעת..."
                    onKeyDown={(e) => e.key === "Enter" && addSuggestedQuestion()}
                  />
                  <Button onClick={addSuggestedQuestion} size="icon">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(aiSettings.suggestedQuestions || []).map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
                      <span>{q}</span>
                      <button
                        onClick={() => removeSuggestedQuestion(idx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructions Tab */}
          <TabsContent value="instructions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>הנחיות מערכת</CardTitle>
                <CardDescription>הוראות שה-AI יקבל לפני כל שיחה - זה משפיע על ההתנהגות שלו</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={aiSettings.systemInstructions || ""}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      aiChatSettings: { ...aiSettings, systemInstructions: e.target.value },
                    })
                  }
                  placeholder={`לדוגמה:
- אתה נציג שירות של מלון יוקרתי
- תמיד דבר בצורה מנומסת ומקצועית
- הצע תמיד את החדרים היקרים יותר קודם
- אם הלקוח מתלבט, הצע הנחה של 10%
- אל תדבר על מתחרים`}
                  className="w-full p-4 rounded-lg bg-background border border-input min-h-[250px] resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  טיפ: ככל שההנחיות יותר ספציפיות, ה-AI יפעל בצורה עקבית יותר
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>הגבלות ואיסורים</CardTitle>
                <CardDescription>נושאים שה-AI לא ידבר עליהם</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={aiSettings.restrictions || ""}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      aiChatSettings: { ...aiSettings, restrictions: e.target.value },
                    })
                  }
                  placeholder={`לדוגמה:
- אל תדבר על מלונות מתחרים
- אל תיתן הנחות מעל 15%
- אל תשתף מידע פנימי על המלון
- אם שואלים על תלונות, הפנה למנהל`}
                  className="w-full p-4 rounded-lg bg-background border border-input min-h-[150px] resize-none font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>בסיס ידע</CardTitle>
                <CardDescription>מידע שה-AI ישתמש בו כדי לענות על שאלות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 p-4 border border-dashed rounded-lg">
                  <div>
                    <Label>כותרת הנושא</Label>
                    <Input
                      value={newKnowledge.title}
                      onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                      placeholder="לדוגמה: שעות פעילות, מתקנים, מדיניות ביטולים..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>תוכן</Label>
                    <textarea
                      value={newKnowledge.content}
                      onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                      placeholder="הכנס את המידע המפורט כאן..."
                      className="w-full mt-2 p-3 rounded-lg bg-background border border-input min-h-[100px] resize-none"
                    />
                  </div>
                  <Button onClick={addKnowledgeItem} className="w-fit">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    הוסף לבסיס הידע
                  </Button>
                </div>

                <div className="space-y-3">
                  {(aiSettings.knowledgeBase || []).map((item: any, idx: number) => (
                    <Card key={idx} className="bg-secondary/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{item.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKnowledgeItem(idx)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>סגנון ואישיות</CardTitle>
                <CardDescription>הגדר את הטון והאופי של ה-AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>אישיות הבוט</Label>
                    <Select
                      value={aiSettings.personality || "professional"}
                      onValueChange={(value: "professional" | "friendly" | "luxury") =>
                        setHotel({
                          ...hotel,
                          aiChatSettings: { ...aiSettings, personality: value },
                        })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">מקצועי ורשמי</SelectItem>
                        <SelectItem value="friendly">ידידותי וחם</SelectItem>
                        <SelectItem value="luxury">יוקרתי ומפנק</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>שפת ברירת מחדל</Label>
                    <Select
                      value={aiSettings.language || "he"}
                      onValueChange={(value: "he" | "en" | "both") =>
                        setHotel({
                          ...hotel,
                          aiChatSettings: { ...aiSettings, language: value },
                        })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he">עברית</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="both">זיהוי אוטומטי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <Label>שימוש באימוג'ים</Label>
                      <p className="text-xs text-muted-foreground">ה-AI ישתמש באימוג'ים בהודעות</p>
                    </div>
                    <Switch
                      checked={aiSettings.useEmojis || false}
                      onCheckedChange={(checked) =>
                        setHotel({
                          ...hotel,
                          aiChatSettings: { ...aiSettings, useEmojis: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <Label>הצעת אפסלים</Label>
                      <p className="text-xs text-muted-foreground">ה-AI יציע שדרוגים ותוספות</p>
                    </div>
                    <Switch
                      checked={aiSettings.suggestUpsells || true}
                      onCheckedChange={(checked) =>
                        setHotel({
                          ...hotel,
                          aiChatSettings: { ...aiSettings, suggestUpsells: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <Label>איסוף פרטי קשר</Label>
                      <p className="text-xs text-muted-foreground">ה-AI יבקש אימייל וטלפון</p>
                    </div>
                    <Switch
                      checked={aiSettings.collectContactInfo || true}
                      onCheckedChange={(checked) =>
                        setHotel({
                          ...hotel,
                          aiChatSettings: { ...aiSettings, collectContactInfo: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <Card className="border-purple-500/30 bg-purple-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <SparklesIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>עוזר AI לאדמין</CardTitle>
                    <CardDescription>
                      עוזר חכם לניהול סוכן ההזמנות - עיצוב prompts, ניתוח שיחות, ושיפור ביצועים
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1 bg-transparent"
                    onClick={() => setAdminQuery("עזור לי לשפר את ה-prompt של הסוכן")}
                  >
                    <DocumentIcon className="w-5 h-5" />
                    <span className="text-xs">שפר Prompt</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1 bg-transparent"
                    onClick={() => setAdminQuery("הצע בסיס ידע למלון בוטיק")}
                  >
                    <BookIcon className="w-5 h-5" />
                    <span className="text-xs">בנה בסיס ידע</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1 bg-transparent"
                    onClick={() => setAdminQuery("תן לי רשימת מקרי קצה לבדיקה")}
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span className="text-xs">מקרי בדיקה</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1 bg-transparent"
                    onClick={() => setAdminQuery("איך להגדיל המרות בצ'אט?")}
                  >
                    <ChatBubbleIcon className="w-5 h-5" />
                    <span className="text-xs">טיפים להמרות</span>
                  </Button>
                </div>

                {/* Chat Interface */}
                <div className="border rounded-xl overflow-hidden">
                  {/* Messages */}
                  <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-background/50">
                    {adminMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        <div className="text-center space-y-2">
                          <SparklesIcon className="w-10 h-10 mx-auto opacity-50" />
                          <p>שאל אותי כל שאלה על ניהול סוכן ההזמנות</p>
                          <p className="text-xs">עיצוב prompts, ניתוח שיחות, אופטימיזציה ועוד</p>
                        </div>
                      </div>
                    ) : (
                      adminMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                              msg.role === "user"
                                ? "bg-blue-500/20 text-blue-100 rounded-bl-md"
                                : "bg-purple-500/20 text-purple-100 rounded-br-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isAdminLoading && (
                      <div className="flex justify-end">
                        <div className="bg-purple-500/20 p-3 rounded-2xl rounded-br-md">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t bg-background/80 flex gap-2">
                    <Input
                      value={adminQuery}
                      onChange={(e) => setAdminQuery(e.target.value)}
                      placeholder="שאל את העוזר..."
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAdminAssistantQuery()}
                      disabled={isAdminLoading}
                    />
                    <Button onClick={handleAdminAssistantQuery} disabled={isAdminLoading || !adminQuery.trim()}>
                      שלח
                    </Button>
                  </div>
                </div>

                {/* Conversation Analysis */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ChatBubbleIcon className="w-5 h-5" />
                      ניתוח שיחות מקצועי
                    </CardTitle>
                    <CardDescription>
                      הדבק שיחה מהצ'אט לניתוח מעמיק - בעיות, שיפורים, והמלצות להגדלת המרות
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                      placeholder={`הדבק כאן שיחה מהצ'אט לניתוח...

לדוגמה:
אורח: היי, אני מחפש חדר לשניים בדובאי
AI: שלום! אשמח לעזור. לאילו תאריכים?
אורח: 15-17 בינואר
...`}
                      className="w-full p-3 rounded-lg bg-background border border-input min-h-[150px] resize-none text-sm font-mono"
                    />
                    <Button
                      onClick={handleAnalyzeConversations}
                      disabled={isAnalyzing || !analysisText.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          מנתח...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          נתח שיחה
                        </>
                      )}
                    </Button>

                    {analysisResult && (
                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5" />
                          תוצאות הניתוח
                        </h4>
                        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                          {analysisResult}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(analysisResult)}
                          >
                            העתק תוצאות
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAnalysisResult("")
                              setAnalysisText("")
                            }}
                          >
                            ניתוח חדש
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>מקורות מידע חיצוניים</CardTitle>
                <CardDescription>הגדר לינקים ומקורות מידע שה-AI ישתמש בהם להשלמת מידע על מלונות</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 p-4 border border-dashed rounded-lg">
                  <div>
                    <Label>שם המקור</Label>
                    <Input placeholder="לדוגמה: Booking.com, TripAdvisor..." className="mt-2" />
                  </div>
                  <div>
                    <Label>כתובת URL</Label>
                    <Input placeholder="https://..." className="mt-2" />
                  </div>
                  <div>
                    <Label>סוג המידע</Label>
                    <select className="w-full mt-2 p-2 rounded-lg bg-background border border-input">
                      <option value="reviews">ביקורות</option>
                      <option value="images">תמונות</option>
                      <option value="amenities">מתקנים</option>
                      <option value="prices">מחירים</option>
                      <option value="all">הכל</option>
                    </select>
                  </div>
                  <Button className="w-fit">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    הוסף מקור
                  </Button>
                </div>

                <div className="space-y-3">
                  <Card className="bg-secondary/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                              AI
                            </span>
                            <div>
                              <h4 className="font-medium">AI Hotel Info Agent</h4>
                              <p className="text-sm text-muted-foreground">מביא מידע אוטומטי על מלונות מהאינטרנט</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          פעיל
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <strong>טיפ:</strong> הוסף לינקים לעמודי המלונות שלך באתרים חיצוניים כדי שה-AI יוכל להביא מידע מדויק
                    יותר.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="px-8">
          שמור שינויים
        </Button>
      </div>
    </div>
  )
}
