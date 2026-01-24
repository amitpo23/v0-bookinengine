"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Search,
  Download,
  Eye,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  FileText,
  Shield,
  DollarSign,
  ShoppingCart,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  Save,
  ArrowRight,
  Hotel,
  BedDouble,
  CreditCard,
  MessagesSquare,
  ExternalLink,
  Copy,
  Palette,
  Globe,
  Lock,
  ChevronLeft,
  Tag,
  Percent,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MousePointerClick,
  Monitor,
  Smartphone,
  Laptop,
  Globe2,
  Activity,
  Bot,
  User,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ArrowDownToLine,
  Star,
  Tablet,
  MessageSquare,
} from "lucide-react"
import { format, differenceInDays, subDays } from "date-fns"
import { he } from "date-fns/locale"
import Link from "next/link"

// ============= TYPES =============
interface ScarletSearchLog {
  id: string
  sessionId: string
  dateFrom: string
  dateTo: string
  guests: number
  resultsCount: number
  selectedRoom?: string
  priceShown?: number
  stage: "search" | "room_selected" | "guest_details" | "payment" | "confirmed"
  completed: boolean
  createdAt: string
  ipAddress?: string
  userAgent?: string
  source?: string
}

interface AbandonedBooking {
  id: string
  sessionId: string
  customerEmail?: string
  customerName?: string
  phone?: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  stage: string
  abandonedAt: string
  recoveryAttempts: number
  recovered: boolean
  source?: string
}

interface ScarletStats {
  totalSearches: number
  totalBookings: number
  conversionRate: number
  abandonedCarts: number
  recoveryRate: number
  revenue: number
  averageBookingValue: number
}

interface ScarletSettings {
  hotelId: string
  hotelName: string
  termsAndConditions: string
  termsAndConditionsHe: string
  privacyPolicy: string
  cancellationPolicy: string
  cancellationPolicyHe: string
  minAdvanceBookingDays: number
  maxAdvanceBookingDays: number
  defaultCurrency: string
  allowChildBooking: boolean
  maxGuests: number
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  enableAiChat: boolean
  aiChatWelcomeMessage: string
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  primaryColor: string
  accentColor: string
  logoUrl: string
  backgroundImageUrl: string
}

interface ScarletPromotion {
  id: string
  code: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minNights?: number
  validFrom: string
  validTo: string
  usageCount: number
  maxUsage?: number
  active: boolean
  mobileOnly: boolean
}

interface ScarletVisit {
  id: string
  sessionId: string
  timestamp: string
  source: string
  medium?: string
  campaign?: string
  device: "desktop" | "mobile" | "tablet"
  browser: string
  country: string
  city?: string
  pageViews: number
  duration: number // seconds
  converted: boolean
  bookingValue?: number
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  skill?: string
}

interface AIChatConversation {
  id: string
  sessionId: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  startedAt: string
  endedAt?: string
  messageCount: number
  messages: ChatMessage[]
  topics: string[]
  sentiment: "positive" | "neutral" | "negative"
  leadToBooking: boolean
  bookingId?: string
  bookingValue?: number
  device: "desktop" | "mobile" | "tablet"
  source: string
  rating?: number
  feedback?: string
}

// ============= DEFAULT SETTINGS =============
const defaultSettings: ScarletSettings = {
  hotelId: "scarlet_hotel",
  hotelName: "מלון סקרלט תל אביב",
  termsAndConditions: `Terms and Conditions for Scarlet Hotel Booking:

1. Check-in time: 3:00 PM | Check-out time: 11:00 AM
2. Valid ID or passport required at check-in
3. Credit card required for security deposit
4. Cancellation must be made 48 hours before arrival
5. No smoking in rooms
6. Pets are not allowed
7. Additional guests require prior approval
8. Hotel is not responsible for valuables left in rooms`,
  termsAndConditionsHe: `תנאי שימוש להזמנה במלון סקרלט:

1. שעת כניסה: 15:00 | שעת יציאה: 11:00
2. נדרשת תעודה מזהה או דרכון בעת הצ'ק-אין
3. נדרש כרטיס אשראי לפיקדון
4. ביטול חייב להתבצע 48 שעות לפני ההגעה
5. אסור לעשן בחדרים
6. חיות מחמד אינן מורשות
7. אורחים נוספים דורשים אישור מראש
8. המלון אינו אחראי לחפצי ערך שנשכחו בחדרים`,
  privacyPolicy: "We respect your privacy and protect your personal data according to GDPR regulations.",
  cancellationPolicy: "Free cancellation up to 48 hours before check-in. After that, first night will be charged.",
  cancellationPolicyHe: "ביטול חינם עד 48 שעות לפני הצ'ק-אין. לאחר מכן, יחויב לילה ראשון.",
  minAdvanceBookingDays: 0,
  maxAdvanceBookingDays: 365,
  defaultCurrency: "ILS",
  allowChildBooking: true,
  maxGuests: 6,
  contactEmail: "reservations@scarlethotel.co.il",
  contactPhone: "03-1234567",
  whatsappNumber: "972501234567",
  enableAiChat: true,
  aiChatWelcomeMessage: "שלום! 👋 אני סקרלט, העוזרת הדיגיטלית של המלון. איך אוכל לעזור לך?",
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  primaryColor: "#dc2626",
  accentColor: "#f97316",
  logoUrl: "/scarlet-logo.png",
  backgroundImageUrl: "/scarlet-hero.jpg",
}

// ============= COMPONENTS =============

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendUp 
}: { 
  title: string
  value: string | number
  subtitle?: string
  icon: any
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${trendUp ? "bg-green-500/10" : "bg-red-500/10"}`}>
            <Icon className={`h-6 w-6 ${trendUp !== undefined ? (trendUp ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`} />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-3 text-sm ${trendUp ? "text-green-500" : "text-red-500"}`}>
            {trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SearchLogsTab({ logs }: { logs: ScarletSearchLog[] }) {
  const [searchFilter, setSearchFilter] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.sessionId.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         log.selectedRoom?.toLowerCase().includes(searchFilter.toLowerCase())
    const matchesStage = stageFilter === "all" || log.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      search: "חיפוש",
      room_selected: "בחירת חדר",
      guest_details: "פרטי אורח",
      payment: "תשלום",
      confirmed: "הושלם",
    }
    return labels[stage] || stage
  }

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      search: "bg-gray-500/10 text-gray-500",
      room_selected: "bg-blue-500/10 text-blue-500",
      guest_details: "bg-yellow-500/10 text-yellow-500",
      payment: "bg-orange-500/10 text-orange-500",
      confirmed: "bg-green-500/10 text-green-500",
    }
    return colors[stage] || "bg-gray-500/10 text-gray-500"
  }

  const exportToCSV = () => {
    const csv = [
      ["תאריך", "מזהה סשן", "כניסה", "יציאה", "אורחים", "חדר נבחר", "מחיר", "שלב", "הושלם", "מקור"].join(","),
      ...filteredLogs.map(log => [
        format(new Date(log.createdAt), "dd/MM/yyyy HH:mm"),
        log.sessionId,
        log.dateFrom,
        log.dateTo,
        log.guests,
        log.selectedRoom || "-",
        log.priceShown || "-",
        getStageLabel(log.stage),
        log.completed ? "כן" : "לא",
        log.source || "-",
      ].join(","))
    ].join("\n")

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scarlet-searches-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    toast.success("הקובץ יוצא בהצלחה")
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש לפי מזהה או חדר..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="סינון לפי שלב" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל השלבים</SelectItem>
            <SelectItem value="search">חיפוש</SelectItem>
            <SelectItem value="room_selected">בחירת חדר</SelectItem>
            <SelectItem value="guest_details">פרטי אורח</SelectItem>
            <SelectItem value="payment">תשלום</SelectItem>
            <SelectItem value="confirmed">הושלם</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          יצוא CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>תאריך</TableHead>
              <TableHead>תאריכי הזמנה</TableHead>
              <TableHead>אורחים</TableHead>
              <TableHead>חדר נבחר</TableHead>
              <TableHead>מחיר</TableHead>
              <TableHead>שלב</TableHead>
              <TableHead>מקור</TableHead>
              <TableHead>סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: he })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {log.dateFrom} → {log.dateTo}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {log.guests}
                  </div>
                </TableCell>
                <TableCell>{log.selectedRoom || "-"}</TableCell>
                <TableCell>
                  {log.priceShown ? `₪${log.priceShown.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell>
                  <Badge className={getStageColor(log.stage)}>
                    {getStageLabel(log.stage)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.source || "direct"}</Badge>
                </TableCell>
                <TableCell>
                  {log.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>לא נמצאו חיפושים</p>
        </div>
      )}
    </div>
  )
}

function AbandonedBookingsTab({ bookings }: { bookings: AbandonedBooking[] }) {
  const [selectedBooking, setSelectedBooking] = useState<AbandonedBooking | null>(null)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)

  const handleSendRecoveryEmail = async (booking: AbandonedBooking) => {
    // In production, this would call an API to send a recovery email
    toast.success(`נשלח מייל שחזור ל-${booking.customerEmail || "האורח"}`)
    setShowRecoveryDialog(false)
  }

  const getStageIcon = (stage: string) => {
    const icons: Record<string, any> = {
      search: Search,
      room_selected: BedDouble,
      guest_details: Users,
      payment: CreditCard,
    }
    return icons[stage] || Search
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="הזמנות נטושות"
          value={bookings.length}
          icon={ShoppingCart}
          trend="היום"
        />
        <StatCard
          title="שווי נטוש"
          value={`₪${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`}
          icon={DollarSign}
          trendUp={false}
        />
        <StatCard
          title="ממתינות לשחזור"
          value={bookings.filter(b => !b.recovered).length}
          icon={Mail}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            הזמנות שלא הושלמו
          </CardTitle>
          <CardDescription>
            מעקב אחר לקוחות שהתחילו תהליך הזמנה ולא סיימו
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => {
              const StageIcon = getStageIcon(booking.stage)
              return (
                <Card key={booking.id} className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-red-500/10">
                            <StageIcon className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {booking.customerName || "אורח אנונימי"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.customerEmail || "לא נמסר אימייל"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">סוג חדר</p>
                            <p className="font-medium">{booking.roomType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">תאריכים</p>
                            <p className="font-medium">{booking.checkIn} → {booking.checkOut}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">מחיר</p>
                            <p className="font-medium text-green-600">₪{booking.totalPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">נטוש לפני</p>
                            <p className="font-medium">
                              {format(new Date(booking.abandonedAt), "HH:mm dd/MM", { locale: he })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {booking.customerEmail && !booking.recovered && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowRecoveryDialog(true)
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            שלח מייל שחזור
                          </Button>
                        )}
                        {booking.phone && !booking.recovered && (
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            התקשר
                          </Button>
                        )}
                        {booking.recovered && (
                          <Badge className="bg-green-500/10 text-green-500">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            שוחזר
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Badge variant="outline">
                        שלב: {booking.stage}
                      </Badge>
                      <Badge variant="outline">
                        ניסיונות שחזור: {booking.recoveryAttempts}
                      </Badge>
                      {booking.source && (
                        <Badge variant="outline">
                          מקור: {booking.source}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {bookings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>אין הזמנות נטושות 🎉</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>שליחת מייל שחזור</DialogTitle>
            <DialogDescription>
              שלח מייל לאורח עם קישור להשלמת ההזמנה והצעה מיוחדת
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p><strong>אורח:</strong> {selectedBooking.customerName}</p>
                <p><strong>אימייל:</strong> {selectedBooking.customerEmail}</p>
                <p><strong>חדר:</strong> {selectedBooking.roomType}</p>
                <p><strong>מחיר:</strong> ₪{selectedBooking.totalPrice.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label>הצעת הנחה (אופציונלי)</Label>
                <Select defaultValue="0">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">ללא הנחה</SelectItem>
                    <SelectItem value="5">5% הנחה</SelectItem>
                    <SelectItem value="10">10% הנחה</SelectItem>
                    <SelectItem value="15">15% הנחה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecoveryDialog(false)}>
              ביטול
            </Button>
            <Button onClick={() => selectedBooking && handleSendRecoveryEmail(selectedBooking)}>
              <Mail className="h-4 w-4 mr-2" />
              שלח מייל
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============= PROMOTIONS TAB =============
function PromotionsTab({ promotions: initialPromotions }: { promotions: ScarletPromotion[] }) {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<Partial<ScarletPromotion>>({})

  const handleSave = () => {
    if (currentPromotion.id) {
      setPromotions(promotions.map(p => p.id === currentPromotion.id ? { ...p, ...currentPromotion } as ScarletPromotion : p))
    } else {
      const newPromo: ScarletPromotion = {
        id: `promo_${Date.now()}`,
        code: currentPromotion.code || "",
        title: currentPromotion.title || "",
        description: currentPromotion.description || "",
        discountType: currentPromotion.discountType || "percentage",
        discountValue: currentPromotion.discountValue || 0,
        minNights: currentPromotion.minNights,
        validFrom: currentPromotion.validFrom || new Date().toISOString().split("T")[0],
        validTo: currentPromotion.validTo || new Date().toISOString().split("T")[0],
        usageCount: 0,
        maxUsage: currentPromotion.maxUsage,
        active: true,
        mobileOnly: currentPromotion.mobileOnly || false,
      }
      setPromotions([...promotions, newPromo])
    }
    setIsEditing(false)
    setCurrentPromotion({})
    toast.success("המבצע נשמר בהצלחה")
  }

  const handleDelete = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את המבצע?")) {
      setPromotions(promotions.filter(p => p.id !== id))
      toast.success("המבצע נמחק")
    }
  }

  const toggleActive = (id: string) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const totalDiscount = promotions
    .filter(p => p.active)
    .reduce((sum, p) => sum + (p.discountType === "percentage" ? p.usageCount * 250 : p.usageCount * p.discountValue), 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="מבצעים פעילים"
          value={promotions.filter(p => p.active).length}
          icon={Tag}
          trendUp={true}
        />
        <StatCard
          title="סה״כ שימושים"
          value={promotions.reduce((sum, p) => sum + p.usageCount, 0)}
          icon={MousePointerClick}
          trend="+23% מהשבוע"
          trendUp={true}
        />
        <StatCard
          title="הנחות שניתנו"
          value={`₪${totalDiscount.toLocaleString()}`}
          icon={Percent}
          trend="החודש"
        />
        <StatCard
          title="ממוצע המרה"
          value="18%"
          icon={TrendingUp}
          trend="+2%"
          trendUp={true}
        />
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">רשימת מבצעים</h3>
        <Button onClick={() => { setCurrentPromotion({}); setIsEditing(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          מבצע חדש
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{currentPromotion.id ? "עריכת מבצע" : "מבצע חדש"}</DialogTitle>
            <DialogDescription>הגדר פרטי המבצע וההנחה</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>קוד מבצע</Label>
              <Input
                value={currentPromotion.code || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
              />
            </div>
            <div className="space-y-2">
              <Label>כותרת</Label>
              <Input
                value={currentPromotion.title || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, title: e.target.value })}
                placeholder="הנחת קיץ 20%"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>תיאור</Label>
              <Textarea
                value={currentPromotion.description || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                placeholder="תיאור המבצע..."
              />
            </div>
            <div className="space-y-2">
              <Label>סוג הנחה</Label>
              <Select
                value={currentPromotion.discountType || "percentage"}
                onValueChange={v => setCurrentPromotion({ ...currentPromotion, discountType: v as "percentage" | "fixed" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">אחוזים (%)</SelectItem>
                  <SelectItem value="fixed">סכום קבוע (₪)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ערך הנחה</Label>
              <Input
                type="number"
                value={currentPromotion.discountValue || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, discountValue: Number(e.target.value) })}
                placeholder={currentPromotion.discountType === "fixed" ? "100" : "20"}
              />
            </div>
            <div className="space-y-2">
              <Label>מ-תאריך</Label>
              <Input
                type="date"
                value={currentPromotion.validFrom || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, validFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>עד תאריך</Label>
              <Input
                type="date"
                value={currentPromotion.validTo || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, validTo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>מינימום לילות</Label>
              <Input
                type="number"
                value={currentPromotion.minNights || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, minNights: Number(e.target.value) })}
                placeholder="ללא הגבלה"
              />
            </div>
            <div className="space-y-2">
              <Label>מקסימום שימושים</Label>
              <Input
                type="number"
                value={currentPromotion.maxUsage || ""}
                onChange={e => setCurrentPromotion({ ...currentPromotion, maxUsage: Number(e.target.value) })}
                placeholder="ללא הגבלה"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={currentPromotion.mobileOnly || false}
                onCheckedChange={c => setCurrentPromotion({ ...currentPromotion, mobileOnly: c })}
              />
              <Label>למובייל בלבד</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>ביטול</Button>
            <Button onClick={handleSave}>שמור מבצע</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map(promo => (
          <Card key={promo.id} className={!promo.active ? "opacity-60" : ""}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${promo.active ? "bg-green-500/10" : "bg-gray-500/10"}`}>
                    {promo.discountType === "percentage" ? (
                      <Percent className={`h-6 w-6 ${promo.active ? "text-green-500" : "text-gray-500"}`} />
                    ) : (
                      <DollarSign className={`h-6 w-6 ${promo.active ? "text-green-500" : "text-gray-500"}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{promo.title}</h4>
                      <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                      {promo.mobileOnly && <Badge variant="secondary">📱 מובייל</Badge>}
                      {!promo.active && <Badge variant="destructive">לא פעיל</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="font-medium text-green-600">
                        {promo.discountType === "percentage" ? `${promo.discountValue}%` : `₪${promo.discountValue}`} הנחה
                      </span>
                      {promo.minNights && <span className="text-muted-foreground">מינימום {promo.minNights} לילות</span>}
                      <span className="text-muted-foreground">
                        {promo.validFrom} → {promo.validTo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-left mr-4">
                    <p className="text-2xl font-bold">{promo.usageCount}</p>
                    <p className="text-xs text-muted-foreground">
                      {promo.maxUsage ? `מתוך ${promo.maxUsage}` : "שימושים"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(promo.id)}
                  >
                    {promo.active ? (
                      <ToggleRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setCurrentPromotion(promo); setIsEditing(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============= VISITS TAB =============
function VisitsTab({ visits }: { visits: ScarletVisit[] }) {
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [deviceFilter, setDeviceFilter] = useState<string>("all")

  const filteredVisits = visits.filter(v => {
    const matchesSource = sourceFilter === "all" || v.source === sourceFilter
    const matchesDevice = deviceFilter === "all" || v.device === deviceFilter
    return matchesSource && matchesDevice
  })

  const sources = [...new Set(visits.map(v => v.source))]
  
  const stats = {
    totalVisits: filteredVisits.length,
    uniqueSessions: new Set(filteredVisits.map(v => v.sessionId)).size,
    avgPageViews: Math.round(filteredVisits.reduce((sum, v) => sum + v.pageViews, 0) / filteredVisits.length) || 0,
    avgDuration: Math.round(filteredVisits.reduce((sum, v) => sum + v.duration, 0) / filteredVisits.length) || 0,
    conversionRate: Math.round((filteredVisits.filter(v => v.converted).length / filteredVisits.length) * 100) || 0,
    totalRevenue: filteredVisits.filter(v => v.converted).reduce((sum, v) => sum + (v.bookingValue || 0), 0),
  }

  const deviceCounts = {
    mobile: filteredVisits.filter(v => v.device === "mobile").length,
    desktop: filteredVisits.filter(v => v.device === "desktop").length,
    tablet: filteredVisits.filter(v => v.device === "tablet").length,
  }

  const getDeviceIcon = (device: string) => {
    const icons: Record<string, any> = {
      mobile: Smartphone,
      desktop: Monitor,
      tablet: Laptop,
    }
    return icons[device] || Monitor
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="כניסות היום"
          value={stats.totalVisits}
          icon={Activity}
          trend="+18%"
          trendUp={true}
        />
        <StatCard
          title="מבקרים ייחודיים"
          value={stats.uniqueSessions}
          icon={Users}
        />
        <StatCard
          title="ממוצע דפים"
          value={stats.avgPageViews}
          icon={Eye}
        />
        <StatCard
          title="זמן ממוצע"
          value={formatDuration(stats.avgDuration)}
          icon={Clock}
        />
        <StatCard
          title="אחוז המרה"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          trendUp={stats.conversionRate > 20}
        />
        <StatCard
          title="הכנסות"
          value={`₪${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trendUp={true}
        />
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            התפלגות מכשירים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(deviceCounts).map(([device, count]) => {
              const Icon = getDeviceIcon(device)
              const percentage = Math.round((count / filteredVisits.length) * 100) || 0
              return (
                <div key={device} className="text-center p-4 rounded-lg bg-muted/30">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{percentage}%</p>
                  <p className="text-sm text-muted-foreground capitalize">{device}</p>
                  <p className="text-xs text-muted-foreground">{count} כניסות</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="h-5 w-5" />
              מקורות תנועה
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="כל המקורות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המקורות</SelectItem>
                  {sources.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="כל המכשירים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="mobile">מובייל</SelectItem>
                  <SelectItem value="desktop">דסקטופ</SelectItem>
                  <SelectItem value="tablet">טאבלט</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>זמן</TableHead>
                <TableHead>מקור</TableHead>
                <TableHead>קמפיין</TableHead>
                <TableHead>מכשיר</TableHead>
                <TableHead>מיקום</TableHead>
                <TableHead>דפים</TableHead>
                <TableHead>משך</TableHead>
                <TableHead>המרה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map(visit => {
                const DeviceIcon = getDeviceIcon(visit.device)
                return (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {format(new Date(visit.timestamp), "HH:mm", { locale: he })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{visit.source}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {visit.campaign || visit.medium || "-"}
                    </TableCell>
                    <TableCell>
                      <DeviceIcon className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {visit.city || visit.country}
                      </div>
                    </TableCell>
                    <TableCell>{visit.pageViews}</TableCell>
                    <TableCell>{formatDuration(visit.duration)}</TableCell>
                    <TableCell>
                      {visit.converted ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            ₪{visit.bookingValue?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ============= AI CHAT CONVERSATIONS TAB =============
function ChatConversationsTab({ conversations }: { conversations: AIChatConversation[] }) {
  const [selectedConversation, setSelectedConversation] = useState<AIChatConversation | null>(null)
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Get all unique topics
  const allTopics = [...new Set(conversations.flatMap(c => c.topics))]

  const filteredConversations = conversations.filter(c => {
    const matchesTopic = topicFilter === "all" || c.topics.includes(topicFilter)
    const matchesOutcome = outcomeFilter === "all" || 
      (outcomeFilter === "booking" && c.leadToBooking) ||
      (outcomeFilter === "no-booking" && !c.leadToBooking)
    return matchesTopic && matchesOutcome
  })

  // Calculate stats
  const stats = {
    totalConversations: conversations.length,
    avgMessages: Math.round(conversations.reduce((sum, c) => sum + c.messageCount, 0) / conversations.length) || 0,
    conversionRate: Math.round((conversations.filter(c => c.leadToBooking).length / conversations.length) * 100) || 0,
    avgRating: (conversations.filter(c => c.rating).reduce((sum, c) => sum + (c.rating || 0), 0) / conversations.filter(c => c.rating).length).toFixed(1) || "N/A",
    totalRevenue: conversations.filter(c => c.bookingValue).reduce((sum, c) => sum + (c.bookingValue || 0), 0),
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-700">חיובי</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-700">שלילי</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">ניטרלי</Badge>
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile": return Smartphone
      case "tablet": return Tablet
      default: return Monitor
    }
  }

  const openConversation = (conversation: AIChatConversation) => {
    setSelectedConversation(conversation)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">שיחות</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">ממוצע הודעות</p>
                <p className="text-2xl font-bold">{stats.avgMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">שיעור המרה</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">דירוג ממוצע</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">הכנסות משיחות</p>
                <p className="text-2xl font-bold">₪{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              שיחות AI
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="כל הנושאים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הנושאים</SelectItem>
                  {allTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="כל התוצאות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="booking">הזמנה</SelectItem>
                  <SelectItem value="no-booking">ללא הזמנה</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ArrowDownToLine className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>זמן</TableHead>
                <TableHead>אורח</TableHead>
                <TableHead>הודעות</TableHead>
                <TableHead>נושאים</TableHead>
                <TableHead>סנטימנט</TableHead>
                <TableHead>מכשיר</TableHead>
                <TableHead>תוצאה</TableHead>
                <TableHead>דירוג</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConversations.map(conversation => {
                const DeviceIcon = getDeviceIcon(conversation.device)
                return (
                  <TableRow key={conversation.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openConversation(conversation)}>
                    <TableCell>
                      {format(new Date(conversation.startedAt), "HH:mm dd/MM", { locale: he })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{conversation.guestName || "אנונימי"}</div>
                        {conversation.guestEmail && (
                          <div className="text-xs text-muted-foreground">{conversation.guestEmail}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{conversation.messageCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {conversation.topics.slice(0, 2).map(topic => (
                          <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                        {conversation.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{conversation.topics.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getSentimentBadge(conversation.sentiment)}</TableCell>
                    <TableCell>
                      <DeviceIcon className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      {conversation.leadToBooking ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium text-sm">
                            ₪{conversation.bookingValue?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      {conversation.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{conversation.rating}</span>
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openConversation(conversation); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Conversation Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          {selectedConversation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  שיחה עם {selectedConversation.guestName || "אורח אנונימי"}
                </DialogTitle>
              </DialogHeader>
              
              {/* Conversation Meta */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">התחלה</p>
                  <p>{format(new Date(selectedConversation.startedAt), "HH:mm dd/MM/yyyy", { locale: he })}</p>
                </div>
                {selectedConversation.guestEmail && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">אימייל</p>
                    <p>{selectedConversation.guestEmail}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">מקור</p>
                  <Badge variant="outline">{selectedConversation.source}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">תוצאה</p>
                  {selectedConversation.leadToBooking ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">
                        הזמנה #{selectedConversation.bookingId} - ₪{selectedConversation.bookingValue?.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">ללא הזמנה</span>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 py-4">
                <h4 className="font-medium">הודעות ({selectedConversation.messages.length})</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedConversation.messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "assistant" ? "bg-purple-100" : "bg-blue-100"
                      }`}>
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-purple-600" />
                        ) : (
                          <User className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                        <div className={`p-3 rounded-lg ${
                          message.role === "assistant" 
                            ? "bg-muted" 
                            : "bg-blue-500 text-white"
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{format(new Date(message.timestamp), "HH:mm", { locale: he })}</span>
                          {message.skill && (
                            <Badge variant="outline" className="text-xs">{message.skill}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {(selectedConversation.rating || selectedConversation.feedback) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">משוב</h4>
                  <div className="flex items-center gap-4">
                    {selectedConversation.rating && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= selectedConversation.rating! 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {selectedConversation.feedback && (
                      <p className="text-muted-foreground">"{selectedConversation.feedback}"</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SettingsTab({ 
  settings, 
  onSave 
}: { 
  settings: ScarletSettings
  onSave: (settings: ScarletSettings) => void
}) {
  const [formData, setFormData] = useState(settings)
  const [activeSection, setActiveSection] = useState("general")

  const handleSave = () => {
    onSave(formData)
    toast.success("ההגדרות נשמרו בהצלחה!")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">כללי</TabsTrigger>
          <TabsTrigger value="terms">תקנון</TabsTrigger>
          <TabsTrigger value="booking">הזמנות</TabsTrigger>
          <TabsTrigger value="notifications">התראות</TabsTrigger>
          <TabsTrigger value="design">עיצוב</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                פרטי המלון
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שם המלון</Label>
                  <Input
                    value={formData.hotelName}
                    onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>מזהה מלון</Label>
                  <Input
                    value={formData.hotelId}
                    onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>אימייל יצירת קשר</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>טלפון</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                תקנון המלון (עברית)
              </CardTitle>
              <CardDescription>
                התקנון יוצג ללקוח לפני אישור ההזמנה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.termsAndConditionsHe}
                onChange={(e) => setFormData({ ...formData, termsAndConditionsHe: e.target.value })}
                rows={10}
                className="font-mono text-sm"
                dir="rtl"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms & Conditions (English)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                rows={10}
                className="font-mono text-sm"
                dir="ltr"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                מדיניות ביטולים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>מדיניות ביטולים (עברית)</Label>
                <Textarea
                  value={formData.cancellationPolicyHe}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicyHe: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Cancellation Policy (English)</Label>
                <Textarea
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                  rows={3}
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                הגדרות הזמנה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>מינימום ימים מראש</Label>
                  <Input
                    type="number"
                    value={formData.minAdvanceBookingDays}
                    onChange={(e) => setFormData({ ...formData, minAdvanceBookingDays: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>מקסימום ימים מראש</Label>
                  <Input
                    type="number"
                    value={formData.maxAdvanceBookingDays}
                    onChange={(e) => setFormData({ ...formData, maxAdvanceBookingDays: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>מקסימום אורחים</Label>
                  <Input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>מטבע ברירת מחדל</Label>
                  <Select
                    value={formData.defaultCurrency}
                    onValueChange={(value) => setFormData({ ...formData, defaultCurrency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ILS">₪ שקל (ILS)</SelectItem>
                      <SelectItem value="USD">$ דולר (USD)</SelectItem>
                      <SelectItem value="EUR">€ יורו (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="allowChildren"
                    checked={formData.allowChildBooking}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowChildBooking: checked })}
                  />
                  <Label htmlFor="allowChildren">אפשר הזמנה עם ילדים</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5" />
                הגדרות AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="enableAiChat"
                  checked={formData.enableAiChat}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableAiChat: checked })}
                />
                <Label htmlFor="enableAiChat">הפעל צ'אט AI</Label>
              </div>
              {formData.enableAiChat && (
                <div className="space-y-2">
                  <Label>הודעת פתיחה</Label>
                  <Textarea
                    value={formData.aiChatWelcomeMessage}
                    onChange={(e) => setFormData({ ...formData, aiChatWelcomeMessage: e.target.value })}
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                התראות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="enableEmail"
                  checked={formData.enableEmailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableEmailNotifications: checked })}
                />
                <Label htmlFor="enableEmail">שלח התראות באימייל</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="enableSms"
                  checked={formData.enableSmsNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableSmsNotifications: checked })}
                />
                <Label htmlFor="enableSms">שלח התראות ב-SMS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design */}
        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                עיצוב הטמפלט
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>צבע ראשי</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>צבע משני</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL לוגו</Label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>URL תמונת רקע</Label>
                <Input
                  value={formData.backgroundImageUrl}
                  onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          שמור הגדרות
        </Button>
      </div>
    </div>
  )
}

// ============= MAIN PAGE =============
export default function ScarletAdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [settings, setSettings] = useState<ScarletSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  
  // Data states - loaded from API
  const [searchLogs, setSearchLogs] = useState<ScarletSearchLog[]>([])
  const [abandonedBookings, setAbandonedBookings] = useState<AbandonedBooking[]>([])
  const [promotions, setPromotions] = useState<ScarletPromotion[]>([])
  const [visits, setVisits] = useState<ScarletVisit[]>([])
  const [conversations, setConversations] = useState<AIChatConversation[]>([])

  // Load data from APIs
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Load search logs
        const logsRes = await fetch("/api/admin/template-logs?template=scarlet")
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          setSearchLogs(logsData.logs || [])
        }

        // Load abandoned bookings
        const abandonedRes = await fetch("/api/admin/abandoned-bookings?template=scarlet")
        if (abandonedRes.ok) {
          const abandonedData = await abandonedRes.json()
          setAbandonedBookings(abandonedData.bookings || [])
        }

        // Load settings
        const settingsRes = await fetch("/api/admin/template-settings?template=scarlet")
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          if (settingsData.settings) {
            setSettings(prev => ({ ...prev, ...settingsData.settings }))
          }
        }

        // Load promotions
        const promosRes = await fetch("/api/admin/promotions?template=scarlet")
        if (promosRes.ok) {
          const promosData = await promosRes.json()
          setPromotions(promosData.promotions || [])
        }

        // Load visits/traffic
        const visitsRes = await fetch("/api/admin/visits?template=scarlet")
        if (visitsRes.ok) {
          const visitsData = await visitsRes.json()
          setVisits(visitsData.visits || [])
        }

        // Load AI chat conversations
        const chatsRes = await fetch("/api/admin/chat-conversations?template=scarlet")
        if (chatsRes.ok) {
          const chatsData = await chatsRes.json()
          setConversations(chatsData.conversations || [])
        }
      } catch (error) {
        console.error("Error loading admin data:", error)
        toast.error("שגיאה בטעינת הנתונים")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate stats from loaded data
  const stats: ScarletStats = {
    totalSearches: searchLogs.length,
    totalBookings: searchLogs.filter(l => l.completed).length,
    conversionRate: searchLogs.length > 0 
      ? Math.round((searchLogs.filter(l => l.completed).length / searchLogs.length) * 100) 
      : 0,
    abandonedCarts: abandonedBookings.length,
    recoveryRate: abandonedBookings.length > 0
      ? Math.round((abandonedBookings.filter(b => b.recovered).length / abandonedBookings.length) * 100)
      : 0,
    revenue: searchLogs.filter(l => l.completed).reduce((sum, l) => sum + (l.priceShown || 0), 0),
    averageBookingValue: searchLogs.filter(l => l.completed).length > 0
      ? Math.round(searchLogs.filter(l => l.completed).reduce((sum, l) => sum + (l.priceShown || 0), 0) / searchLogs.filter(l => l.completed).length)
      : 0,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">טוען נתונים...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                חזרה לניהול
              </Link>
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  ניהול טמפלט Scarlet
                </h1>
                <p className="text-sm text-muted-foreground">ניהול מלא של מנוע ההזמנות של מלון סקרלט</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/templates/scarlet" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  צפה בטמפלט
                </Link>
              </Button>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                העתק קוד הטמעה
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              סקירה
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              כניסות
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              חיפושים
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              נטושות
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              שיחות AI
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              מבצעים
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              הגדרות
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="סה״כ חיפושים"
                value={stats.totalSearches}
                subtitle="היום"
                icon={Search}
                trend="+12% מאתמול"
                trendUp={true}
              />
              <StatCard
                title="הזמנות שהושלמו"
                value={stats.totalBookings}
                subtitle="היום"
                icon={CheckCircle}
                trend="+8% מאתמול"
                trendUp={true}
              />
              <StatCard
                title="אחוז המרה"
                value={`${stats.conversionRate}%`}
                icon={TrendingUp}
                trend="+2% מאתמול"
                trendUp={true}
              />
              <StatCard
                title="הכנסות"
                value={`₪${stats.revenue.toLocaleString()}`}
                subtitle="היום"
                icon={DollarSign}
                trend="+15% מאתמול"
                trendUp={true}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="הזמנות נטושות"
                value={stats.abandonedCarts}
                icon={ShoppingCart}
                trend="₪4,300 שווי נטוש"
                trendUp={false}
              />
              <StatCard
                title="אחוז שחזור"
                value={`${stats.recoveryRate}%`}
                icon={RefreshCw}
                trend="+3% מהשבוע"
                trendUp={true}
              />
              <StatCard
                title="ממוצע הזמנה"
                value={`₪${stats.averageBookingValue.toLocaleString()}`}
                icon={CreditCard}
                trend="+5% מהחודש"
                trendUp={true}
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>פעילות אחרונה</CardTitle>
                <CardDescription>חיפושים והזמנות אחרונות בטמפלט</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {log.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {log.selectedRoom || "חיפוש כללי"} - {log.guests} אורחים
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {log.dateFrom} → {log.dateTo}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">
                          {log.priceShown ? `₪${log.priceShown.toLocaleString()}` : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(log.createdAt), "HH:mm", { locale: he })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funnel Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>ניתוח משפך הזמנות</CardTitle>
                <CardDescription>מעקב אחר התקדמות לקוחות בתהליך ההזמנה</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: "חיפוש", count: 100, percentage: 100 },
                    { stage: "בחירת חדר", count: 65, percentage: 65 },
                    { stage: "פרטי אורח", count: 40, percentage: 40 },
                    { stage: "תשלום", count: 30, percentage: 30 },
                    { stage: "הושלם", count: 25, percentage: 25 },
                  ].map((item, index) => (
                    <div key={item.stage} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.stage}</span>
                        <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-pink-600 transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Searches Tab */}
          <TabsContent value="searches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  יומן חיפושים
                </CardTitle>
                <CardDescription>
                  מעקב אחר כל החיפושים שבוצעו בטמפלט
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchLogsTab logs={searchLogs} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abandoned Tab */}
          <TabsContent value="abandoned">
            <AbandonedBookingsTab bookings={abandonedBookings} />
          </TabsContent>

          {/* AI Chat Conversations Tab */}
          <TabsContent value="ai-chat">
            <ChatConversationsTab conversations={conversations} />
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <PromotionsTab promotions={promotions} />
          </TabsContent>

          {/* Visits Tab */}
          <TabsContent value="visits">
            <VisitsTab visits={visits} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab settings={settings} onSave={setSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
