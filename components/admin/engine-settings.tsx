"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHotelConfig } from "@/lib/hotel-config-context"
import type { HotelConfig } from "@/types/saas"

export function EngineSettings() {
  const { currentHotel, updateHotel } = useHotelConfig()
  const [hotel, setHotel] = useState<HotelConfig | null>(currentHotel)

  if (!hotel) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">אנא בחר מלון תחילה</p>
        </CardContent>
      </Card>
    )
  }

  const handleSave = () => {
    if (hotel) {
      updateHotel(hotel)
    }
  }

  return (
    <div className="space-y-6">
      {/* Engine Toggle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget Engine */}
        <Card className={hotel.enableWidget ? "border-blue-500 bg-blue-500/5" : ""}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg">מנוע הזמנות סטנדרטי</CardTitle>
                  <CardDescription>וידג'ט מסורתי להזמנות</CardDescription>
                </div>
              </div>
              <Switch
                checked={hotel.enableWidget}
                onCheckedChange={(checked) => setHotel({ ...hotel, enableWidget: checked })}
              />
            </div>
          </CardHeader>
          {hotel.enableWidget && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>צבע ראשי</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={hotel.widgetSettings.primaryColor}
                      onChange={(e) =>
                        setHotel({
                          ...hotel,
                          widgetSettings: { ...hotel.widgetSettings, primaryColor: e.target.value },
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={hotel.widgetSettings.primaryColor}
                      onChange={(e) =>
                        setHotel({
                          ...hotel,
                          widgetSettings: { ...hotel.widgetSettings, primaryColor: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>שפה</Label>
                  <Select
                    value={hotel.widgetSettings.language}
                    onValueChange={(value: "he" | "en" | "both") =>
                      setHotel({
                        ...hotel,
                        widgetSettings: { ...hotel.widgetSettings, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="both">שתי השפות</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>הצג מחירים</Label>
                <Switch
                  checked={hotel.widgetSettings.showPrices}
                  onCheckedChange={(checked) =>
                    setHotel({
                      ...hotel,
                      widgetSettings: { ...hotel.widgetSettings, showPrices: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* AI Chat Engine */}
        <Card className={hotel.enableAiChat ? "border-emerald-500 bg-emerald-500/5" : ""}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg">צ'אט AI להזמנות</CardTitle>
                  <CardDescription>הזמנות בשיחה טבעית</CardDescription>
                </div>
              </div>
              <Switch
                checked={hotel.enableAiChat}
                onCheckedChange={(checked) => setHotel({ ...hotel, enableAiChat: checked })}
              />
            </div>
          </CardHeader>
          {hotel.enableAiChat && (
            <CardContent className="space-y-4 border-t pt-4">
              <div>
                <Label>הודעת פתיחה (עברית)</Label>
                <Input
                  value={hotel.aiChatSettings.welcomeMessageHe}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      aiChatSettings: { ...hotel.aiChatSettings, welcomeMessageHe: e.target.value },
                    })
                  }
                  placeholder="שלום! איך אוכל לעזור לך?"
                />
              </div>
              <div>
                <Label>הודעת פתיחה (אנגלית)</Label>
                <Input
                  value={hotel.aiChatSettings.welcomeMessage}
                  onChange={(e) =>
                    setHotel({
                      ...hotel,
                      aiChatSettings: { ...hotel.aiChatSettings, welcomeMessage: e.target.value },
                    })
                  }
                  placeholder="Hello! How can I help you?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>אופי הבוט</Label>
                  <Select
                    value={hotel.aiChatSettings.personality}
                    onValueChange={(value: "professional" | "friendly" | "luxury") =>
                      setHotel({
                        ...hotel,
                        aiChatSettings: { ...hotel.aiChatSettings, personality: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">מקצועי</SelectItem>
                      <SelectItem value="friendly">ידידותי</SelectItem>
                      <SelectItem value="luxury">יוקרתי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>שפה</Label>
                  <Select
                    value={hotel.aiChatSettings.language}
                    onValueChange={(value: "he" | "en" | "both") =>
                      setHotel({
                        ...hotel,
                        aiChatSettings: { ...hotel.aiChatSettings, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="both">שתי השפות</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>הגדרות API</CardTitle>
          <CardDescription>חיבור למערכת ההזמנות של המלון</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>מזהה מלון (Medici)</Label>
              <Input
                value={hotel.apiSettings.mediciHotelId}
                onChange={(e) =>
                  setHotel({
                    ...hotel,
                    apiSettings: { ...hotel.apiSettings, mediciHotelId: e.target.value },
                  })
                }
                placeholder="hotel-123"
              />
            </div>
            <div>
              <Label>שם מלון (לחיפוש)</Label>
              <Input
                value={hotel.apiSettings.mediciHotelName}
                onChange={(e) =>
                  setHotel({
                    ...hotel,
                    apiSettings: { ...hotel.apiSettings, mediciHotelName: e.target.value },
                  })
                }
                placeholder="Grand Hotel Tel Aviv"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          שמור שינויים
        </Button>
      </div>
    </div>
  )
}
