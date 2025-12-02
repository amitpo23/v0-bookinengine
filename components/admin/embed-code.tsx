"use client"

import { useState } from "react"
import type { Hotel } from "@/types/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const CodeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

const SmartphoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
)

const MonitorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

interface EmbedCodeProps {
  hotel: Hotel
  baseUrl: string
}

export function EmbedCode({ hotel, baseUrl }: EmbedCodeProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState(hotel.primaryColor)
  const [buttonText, setButtonText] = useState("הזמן עכשיו")

  const embedUrl = `${baseUrl}/embed/${hotel.id}`

  const iframeCode = `<!-- BookingEngine Widget -->
<iframe 
  src="${embedUrl}?primaryColor=${encodeURIComponent(customColor)}"
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none; min-height: 800px;"
  title="הזמנת חדרים - ${hotel.name}"
></iframe>`

  const popupCode = `<!-- BookingEngine Popup Button -->
<script src="${baseUrl}/embed/widget.js"></script>
<button 
  onclick="BookingEngine.open('${hotel.id}', { primaryColor: '${customColor}' })"
  style="background: ${customColor}; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;"
>
  ${buttonText}
</button>`

  const floatingButtonCode = `<!-- BookingEngine Floating Button -->
<script src="${baseUrl}/embed/widget.js"></script>
<script>
  BookingEngine.floatingButton('${hotel.id}', {
    primaryColor: '${customColor}',
    text: '${buttonText}',
    position: 'bottom-right'
  });
</script>`

  const reactCode = `// React/Next.js Component
import { BookingWidget } from '@bookingengine/react';

function MyHotelBooking() {
  return (
    <BookingWidget 
      hotelId="${hotel.id}"
      primaryColor="${customColor}"
      locale="he"
    />
  );
}`

  const copyToClipboard = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="h-5 w-5" />
            קוד הטמעה
          </CardTitle>
          <CardDescription>הטמע את מנוע ההזמנות באתר שלך בקלות</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iframe" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="iframe" className="flex items-center gap-2">
                <MonitorIcon className="h-4 w-4" />
                <span className="hidden sm:inline">iFrame</span>
              </TabsTrigger>
              <TabsTrigger value="popup" className="flex items-center gap-2">
                <ExternalLinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Popup</span>
              </TabsTrigger>
              <TabsTrigger value="floating" className="flex items-center gap-2">
                <SmartphoneIcon className="h-4 w-4" />
                <span className="hidden sm:inline">כפתור צף</span>
              </TabsTrigger>
              <TabsTrigger value="react" className="flex items-center gap-2">
                <CodeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">React</span>
              </TabsTrigger>
            </TabsList>

            {/* Customization Options */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                התאמה אישית
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>צבע עיקרי</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-14 h-10"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>טקסט כפתור</Label>
                  <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                </div>
              </div>
            </div>

            {/* iFrame Tab */}
            <TabsContent value="iframe" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">הטמעה באמצעות iFrame</h4>
                    <Badge variant="secondary">מומלץ</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(iframeCode, "iframe")}>
                    {copied === "iframe" ? (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 ml-2" />
                        העתק קוד
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  הוסף את הקוד הזה לעמוד ההזמנות באתר שלך. הווידג'ט יתפוס את כל רוחב האלמנט.
                </p>
                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                  <code>{iframeCode}</code>
                </pre>
              </div>
            </TabsContent>

            {/* Popup Tab */}
            <TabsContent value="popup" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">כפתור עם חלון קופץ</h4>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(popupCode, "popup")}>
                    {copied === "popup" ? (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 ml-2" />
                        העתק קוד
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  הוסף כפתור שפותח את מנוע ההזמנות בחלון קופץ. מתאים לדפי נחיתה.
                </p>
                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                  <code>{popupCode}</code>
                </pre>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">תצוגה מקדימה:</p>
                  <button
                    style={{
                      background: customColor,
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Floating Button Tab */}
            <TabsContent value="floating" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">כפתור צף</h4>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(floatingButtonCode, "floating")}>
                    {copied === "floating" ? (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 ml-2" />
                        העתק קוד
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  כפתור צף שמופיע בפינת המסך בכל עמודי האתר. מאפשר הזמנה מכל מקום.
                </p>
                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                  <code>{floatingButtonCode}</code>
                </pre>
              </div>
            </TabsContent>

            {/* React Tab */}
            <TabsContent value="react" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">React / Next.js</h4>
                    <Badge variant="outline">בקרוב</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(reactCode, "react")}>
                    {copied === "react" ? (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 ml-2" />
                        העתק קוד
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  התקן את חבילת ה-React שלנו להטמעה מלאה עם TypeScript support.
                </p>
                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm mb-2" dir="ltr">
                  <code>npm install @bookingengine/react</code>
                </pre>
                <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                  <code>{reactCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Direct Link */}
      <Card>
        <CardHeader>
          <CardTitle>קישור ישיר</CardTitle>
          <CardDescription>שלח ללקוחות קישור ישיר לעמוד ההזמנות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={embedUrl} readOnly dir="ltr" className="font-mono text-sm" />
            <Button variant="outline" onClick={() => copyToClipboard(embedUrl, "link")}>
              {copied === "link" ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" asChild>
              <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
