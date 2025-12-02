"use client"

import { useState } from "react"
import { useSaaS } from "@/lib/saas-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HotelApiSettings() {
  const { currentHotel, updateHotelConfig } = useSaaS()
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  if (!currentHotel) return null

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const testConnection = async () => {
    setTestResult(null)
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTestResult({
      success: true,
      message: "החיבור ל-API הצליח! נמצאו 45 חדרים זמינים.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api">חיבור API</TabsTrigger>
          <TabsTrigger value="widget">הגדרות וידג׳ט</TabsTrigger>
          <TabsTrigger value="ai">הגדרות צ׳אט AI</TabsTrigger>
        </TabsList>

        {/* API Connection Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>חיבור ל-Medici API</span>
                <Badge variant={currentHotel.apiSettings.mediciHotelId ? "default" : "secondary"}>
                  {currentHotel.apiSettings.mediciHotelId ? "מחובר" : "לא מחובר"}
                </Badge>
              </CardTitle>
              <CardDescription>הגדר את פרטי ה-API של המלון לקבלת זמינות ומחירים בזמן אמת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelId">מזהה מלון (Hotel ID)</Label>
                  <Input
                    id="hotelId"
                    value={currentHotel.apiSettings.mediciHotelId || ""}
                    onChange={(e) =>
                      updateHotelConfig(currentHotel.id, {
                        apiSettings: { ...currentHotel.apiSettings, mediciHotelId: e.target.value },
                      })
                    }
                    placeholder="12345"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelName">שם מלון ב-API</Label>
                  <Input
                    id="hotelName"
                    value={currentHotel.apiSettings.mediciHotelName || ""}
                    onChange={(e) =>
                      updateHotelConfig(currentHotel.id, {
                        apiSettings: { ...currentHotel.apiSettings, mediciHotelName: e.target.value },
                      })
                    }
                    placeholder="Dan Tel Aviv"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testConnection} variant="outline">
                  בדוק חיבור
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "שומר..." : "שמור"}
                </Button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg ${testResult.success ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                >
                  {testResult.message}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widget Settings Tab */}
        <TabsContent value="widget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>הגדרות מנוע הזמנות</span>
                <Switch
                  checked={currentHotel.enableWidget}
                  onCheckedChange={(checked) => updateHotelConfig(currentHotel.id, { enableWidget: checked })}
                />
              </CardTitle>
              <CardDescription>התאם את מראה ופונקציונליות הווידג׳ט</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שפת ממשק</Label>
                  <Select
                    value={currentHotel.widgetSettings.language}
                    onValueChange={(value: "he" | "en" | "both") =>
                      updateHotelConfig(currentHotel.id, {
                        widgetSettings: { ...currentHotel.widgetSettings, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית בלבד</SelectItem>
                      <SelectItem value="en">English Only</SelectItem>
                      <SelectItem value="both">עברית + English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>צבע עיקרי</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentHotel.widgetSettings.primaryColor}
                      onChange={(e) =>
                        updateHotelConfig(currentHotel.id, {
                          widgetSettings: { ...currentHotel.widgetSettings, primaryColor: e.target.value },
                        })
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={currentHotel.widgetSettings.primaryColor}
                      onChange={(e) =>
                        updateHotelConfig(currentHotel.id, {
                          widgetSettings: { ...currentHotel.widgetSettings, primaryColor: e.target.value },
                        })
                      }
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">הצג מחירים</p>
                  <p className="text-sm text-muted-foreground">הצג מחירי חדרים בתוצאות החיפוש</p>
                </div>
                <Switch
                  checked={currentHotel.widgetSettings.showPrices}
                  onCheckedChange={(checked) =>
                    updateHotelConfig(currentHotel.id, {
                      widgetSettings: { ...currentHotel.widgetSettings, showPrices: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">הצג זמינות</p>
                  <p className="text-sm text-muted-foreground">הצג מספר חדרים זמינים</p>
                </div>
                <Switch
                  checked={currentHotel.widgetSettings.showAvailability}
                  onCheckedChange={(checked) =>
                    updateHotelConfig(currentHotel.id, {
                      widgetSettings: { ...currentHotel.widgetSettings, showAvailability: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat Settings Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>הגדרות צ׳אט AI</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Pro Feature</Badge>
                  <Switch
                    checked={currentHotel.enableAiChat}
                    onCheckedChange={(checked) => updateHotelConfig(currentHotel.id, { enableAiChat: checked })}
                  />
                </div>
              </CardTitle>
              <CardDescription>התאם את העוזר הווירטואלי שלך להזמנות</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>אישיות הבוט</Label>
                <Select
                  value={currentHotel.aiChatSettings.personality}
                  onValueChange={(value: "professional" | "friendly" | "luxury") =>
                    updateHotelConfig(currentHotel.id, {
                      aiChatSettings: { ...currentHotel.aiChatSettings, personality: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">מקצועי ורשמי</SelectItem>
                    <SelectItem value="friendly">ידידותי וחם</SelectItem>
                    <SelectItem value="luxury">יוקרתי ומפנק</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>הודעת פתיחה (עברית)</Label>
                <Textarea
                  value={currentHotel.aiChatSettings.welcomeMessageHe}
                  onChange={(e) =>
                    updateHotelConfig(currentHotel.id, {
                      aiChatSettings: { ...currentHotel.aiChatSettings, welcomeMessageHe: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Welcome Message (English)</Label>
                <Textarea
                  value={currentHotel.aiChatSettings.welcomeMessage}
                  onChange={(e) =>
                    updateHotelConfig(currentHotel.id, {
                      aiChatSettings: { ...currentHotel.aiChatSettings, welcomeMessage: e.target.value },
                    })
                  }
                  rows={2}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>שפת שיחה</Label>
                <Select
                  value={currentHotel.aiChatSettings.language}
                  onValueChange={(value: "he" | "en" | "both") =>
                    updateHotelConfig(currentHotel.id, {
                      aiChatSettings: { ...currentHotel.aiChatSettings, language: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="he">עברית בלבד</SelectItem>
                    <SelectItem value="en">English Only</SelectItem>
                    <SelectItem value="both">זיהוי אוטומטי</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="w-full" disabled={isSaving}>
        {isSaving ? "שומר הגדרות..." : "שמור כל ההגדרות"}
      </Button>
    </div>
  )
}
