"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useHotelConfig } from "@/lib/hotel-config-context"

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function EmbedCodes() {
  const { currentHotel } = useHotelConfig()
  const [copiedWidget, setCopiedWidget] = useState(false)
  const [copiedAiChat, setCopiedAiChat] = useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"
  const hotelId = currentHotel?.id || "demo"

  const widgetEmbedCode = `<!-- מנוע הזמנות סטנדרטי - ${currentHotel?.name || "Hotel"} -->
<iframe 
  src="${baseUrl}/embed/widget/${hotelId}"
  width="100%"
  height="700"
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
></iframe>`

  const aiChatEmbedCode = `<!-- צ'אט AI להזמנות - ${currentHotel?.name || "Hotel"} -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/embed/ai-chat.js';
    script.setAttribute('data-hotel-id', '${hotelId}');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-language', 'he');
    document.body.appendChild(script);
  })();
</script>`

  const aiChatIframeCode = `<!-- צ'אט AI להזמנות (iFrame) - ${currentHotel?.name || "Hotel"} -->
<iframe 
  src="${baseUrl}/embed/ai-chat/${hotelId}"
  width="400"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
></iframe>`

  const copyToClipboard = (text: string, type: "widget" | "ai-chat") => {
    navigator.clipboard.writeText(text)
    if (type === "widget") {
      setCopiedWidget(true)
      setTimeout(() => setCopiedWidget(false), 2000)
    } else {
      setCopiedAiChat(true)
      setTimeout(() => setCopiedAiChat(false), 2000)
    }
  }

  if (!currentHotel) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">אנא בחר מלון תחילה</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="widget" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="widget" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
              />
            </svg>
            מנוע הזמנות סטנדרטי
            {currentHotel.enableWidget ? (
              <Badge variant="default" className="bg-green-500">
                פעיל
              </Badge>
            ) : (
              <Badge variant="secondary">כבוי</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            צ'אט AI
            {currentHotel.enableAiChat ? (
              <Badge variant="default" className="bg-emerald-500">
                פעיל
              </Badge>
            ) : (
              <Badge variant="secondary">כבוי</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Widget Embed */}
        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle>הטמעת מנוע הזמנות סטנדרטי</CardTitle>
              <CardDescription>
                העתק את הקוד הבא והדבק אותו באתר שלך במקום שבו תרצה להציג את מנוע ההזמנות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!currentHotel.enableWidget && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400 text-sm">
                  מנוע ההזמנות הסטנדרטי כבוי. הפעל אותו בהגדרות המנועים כדי להשתמש בו.
                </div>
              )}

              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{widgetEmbedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 left-2"
                  onClick={() => copyToClipboard(widgetEmbedCode, "widget")}
                >
                  {copiedWidget ? <CheckIcon /> : <CopyIcon />}
                  <span className="mr-1">{copiedWidget ? "הועתק!" : "העתק"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">תצוגה מקדימה</h4>
                  <a
                    href={`${baseUrl}/embed/widget/${hotelId}`}
                    target="_blank"
                    className="text-primary hover:underline text-sm"
                    rel="noreferrer"
                  >
                    פתח בחלון חדש →
                  </a>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">כתובת ישירה</h4>
                  <code className="text-xs text-muted-foreground break-all">
                    {baseUrl}/embed/widget/{hotelId}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat Embed */}
        <TabsContent value="ai-chat">
          <Card>
            <CardHeader>
              <CardTitle>הטמעת צ'אט AI</CardTitle>
              <CardDescription>בחר את שיטת ההטמעה המתאימה לך - סקריפט צף או iFrame</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!currentHotel.enableAiChat && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400 text-sm">
                  צ'אט AI כבוי. הפעל אותו בהגדרות המנועים כדי להשתמש בו.
                </div>
              )}

              {/* Floating Button Script */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    1
                  </span>
                  כפתור צף (מומלץ)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  הוסף כפתור צ'אט צף בפינת המסך. מושלם לאתרים קיימים.
                </p>
                <div className="relative">
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{aiChatEmbedCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 left-2"
                    onClick={() => copyToClipboard(aiChatEmbedCode, "ai-chat")}
                  >
                    {copiedAiChat ? <CheckIcon /> : <CopyIcon />}
                    <span className="mr-1">{copiedAiChat ? "הועתק!" : "העתק"}</span>
                  </Button>
                </div>
              </div>

              {/* iFrame */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                    2
                  </span>
                  iFrame (מוטמע בדף)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">הטמע את הצ'אט כחלק מהדף שלך במיקום ספציפי.</p>
                <div className="relative">
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{aiChatIframeCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 left-2"
                    onClick={() => copyToClipboard(aiChatIframeCode, "ai-chat")}
                  >
                    {copiedAiChat ? <CheckIcon /> : <CopyIcon />}
                    <span className="mr-1">{copiedAiChat ? "הועתק!" : "העתק"}</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">תצוגה מקדימה</h4>
                  <a
                    href={`${baseUrl}/embed/ai-chat/${hotelId}`}
                    target="_blank"
                    className="text-primary hover:underline text-sm"
                    rel="noreferrer"
                  >
                    פתח בחלון חדש →
                  </a>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">כתובת ישירה</h4>
                  <code className="text-xs text-muted-foreground break-all">
                    {baseUrl}/embed/ai-chat/{hotelId}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
