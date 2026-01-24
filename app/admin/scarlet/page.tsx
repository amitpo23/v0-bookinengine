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

// ============= MOCK DATA =============
const mockSearchLogs: ScarletSearchLog[] = [
  {
    id: "1",
    sessionId: "sess_abc123",
    dateFrom: "2026-02-01",
    dateTo: "2026-02-03",
    guests: 2,
    resultsCount: 5,
    selectedRoom: "Deluxe Suite",
    priceShown: 2500,
    stage: "payment",
    completed: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "direct",
  },
  {
    id: "2",
    sessionId: "sess_def456",
    dateFrom: "2026-02-05",
    dateTo: "2026-02-07",
    guests: 4,
    resultsCount: 3,
    selectedRoom: "Family Room",
    priceShown: 3200,
    stage: "confirmed",
    completed: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: "google",
  },
  {
    id: "3",
    sessionId: "sess_ghi789",
    dateFrom: "2026-02-10",
    dateTo: "2026-02-12",
    guests: 2,
    resultsCount: 5,
    stage: "search",
    completed: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: "facebook",
  },
  {
    id: "4",
    sessionId: "sess_jkl012",
    dateFrom: "2026-02-15",
    dateTo: "2026-02-18",
    guests: 2,
    resultsCount: 5,
    selectedRoom: "Standard Room",
    priceShown: 1800,
    stage: "guest_details",
    completed: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: "instagram",
  },
]

const mockAbandonedBookings: AbandonedBooking[] = [
  {
    id: "ab_1",
    sessionId: "sess_abc123",
    customerEmail: "david@example.com",
    customerName: "דוד כהן",
    phone: "050-1234567",
    roomType: "Deluxe Suite",
    checkIn: "2026-02-01",
    checkOut: "2026-02-03",
    guests: 2,
    totalPrice: 2500,
    stage: "payment",
    abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    recoveryAttempts: 0,
    recovered: false,
    source: "direct",
  },
  {
    id: "ab_2",
    sessionId: "sess_jkl012",
    customerName: "שרה לוי",
    roomType: "Standard Room",
    checkIn: "2026-02-15",
    checkOut: "2026-02-18",
    guests: 2,
    totalPrice: 1800,
    stage: "guest_details",
    abandonedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    recoveryAttempts: 1,
    recovered: false,
    source: "instagram",
  },
]

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
  const [isLoading, setIsLoading] = useState(false)

  // Calculate stats
  const stats: ScarletStats = {
    totalSearches: mockSearchLogs.length,
    totalBookings: mockSearchLogs.filter(l => l.completed).length,
    conversionRate: Math.round((mockSearchLogs.filter(l => l.completed).length / mockSearchLogs.length) * 100),
    abandonedCarts: mockAbandonedBookings.length,
    recoveryRate: 15,
    revenue: mockSearchLogs.filter(l => l.completed).reduce((sum, l) => sum + (l.priceShown || 0), 0),
    averageBookingValue: 2850,
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              סקירה כללית
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              חיפושים
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              נטושות
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
                  {mockSearchLogs.slice(0, 5).map((log) => (
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
                <SearchLogsTab logs={mockSearchLogs} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abandoned Tab */}
          <TabsContent value="abandoned">
            <AbandonedBookingsTab bookings={mockAbandonedBookings} />
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
