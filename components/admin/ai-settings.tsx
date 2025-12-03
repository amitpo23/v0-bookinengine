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

export function AiSettings() {
  const { currentHotel, updateHotel } = useHotelConfig()
  const [hotel, setHotel] = useState<HotelConfig | null>(currentHotel)
  const [newQuestion, setNewQuestion] = useState("")
  const [newKnowledge, setNewKnowledge] = useState({ title: "", content: "" })

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
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
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
                  <Label>הודעת פתיחה (עברית)</Label>
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
                  <Label>הודעת פתיחה (אנגלית)</Label>
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
