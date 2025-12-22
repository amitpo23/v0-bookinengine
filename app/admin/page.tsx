"use client"

import { useState, useEffect } from "react"
import { HotelConfigProvider, useHotelConfig } from "@/lib/hotel-config-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { BookingsTable } from "@/components/admin/bookings-table"
import { RoomsManagement } from "@/components/admin/rooms-management"
import { SettingsForm } from "@/components/admin/settings-form"
import { EmbedCodes } from "@/components/admin/embed-codes"
import { EngineSettings } from "@/components/admin/engine-settings"
import { PricingCalendar } from "@/components/admin/pricing-calendar"
import { HotelSelector } from "@/components/admin/hotel-selector"
import { RevenueChart, OccupancyChart, RoomTypeChart, QuickStats } from "@/components/admin/dashboard-charts"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { TodayActivity } from "@/components/admin/today-activity"
import { ChatInterface } from "@/components/ai-chat/chat-interface"
import { AiSettings } from "@/components/admin/ai-settings"
import { AgentsManagement } from "@/components/admin/agents-management"
import { RoomTypesManagement } from "@/components/admin/room-types-management"
import dynamic from "next/dynamic"
import { getBookings, getDashboardStats } from "@/lib/admin-data"
import { mockHotel, mockRooms } from "@/lib/mock-data"
import type { Hotel } from "@/types/booking"
import { cn } from "@/lib/utils"

// SVG Icons
const DoorOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
    <path d="M2 20h3" />
    <path d="M13 20h9" />
    <path d="M10 12v.01" />
    <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
  </svg>
)

const DoorClosedIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
    <path d="M2 20h20" />
    <path d="M14 12v.01" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const PromotionsManagement = dynamic(() => import("@/app/admin/promotions/page"), { ssr: false })

function AdminDashboardContent() {
  const { currentHotel } = useHotelConfig()
  const [hotel, setHotel] = useState<Hotel>(mockHotel)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const bookings = getBookings()
  const stats = getDashboardStats()

  useEffect(() => {
    document.documentElement.classList.add("dark")
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: hotel.currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSaveHotel = (updatedHotel: Hotel) => {
    setHotel(updatedHotel)
    alert("הגדרות נשמרו בהצלחה!")
  }

  const tabConfig: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: "לוח בקרה", subtitle: "סקירה כללית של פעילות המלון" },
    bookings: { title: "ניהול הזמנות", subtitle: "צפה ונהל את כל ההזמנות במלון" },
    rooms: { title: "ניהול חדרים", subtitle: "נהל את סוגי החדרים והזמינות" },
    roomtypes: { title: "סוגי חדרים", subtitle: "הגדר תמונות, תיאורים ומתקנים לכל סוג חדר" },
    pricing: { title: "ניהול תמחור", subtitle: "הגדר מחירים דינמיים לפי תאריכים" },
    promotions: { title: "ניהול מבצעים", subtitle: "צור ונהל מבצעים ומבצעים מיוחדים למובייל" },
    engines: { title: "הגדרות מנועים", subtitle: "הפעל וכבה מנועי הזמנות והגדר את ה-API" },
    agents: { title: "ניהול סוכנים", subtitle: "צור ונהל סוכני AI בעלי התמחויות שונות" },
    aiconfig: { title: "הגדרות AI", subtitle: "הנחיות, ידע וסגנון לצ'אט AI" },
    embed: { title: "הטמעה באתר", subtitle: "קבל קוד להטמעת מנועי ההזמנות" },
    aichat: { title: "צ'אט AI - תצוגה מקדימה", subtitle: "בדוק את העוזר הווירטואלי להזמנות" },
    settings: { title: "הגדרות מלון", subtitle: "נהל את פרטי המלון והעדפות" },
  }

  return (
    <div className="min-h-screen bg-background dark" dir="rtl">
      {!isMobile && (
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hotelName={currentHotel?.name || hotel.name}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      )}

      <main className={cn("transition-all duration-300", !isMobile && (sidebarCollapsed ? "mr-[72px]" : "mr-64"))}>
        <AdminHeader
          title={tabConfig[activeTab]?.title || "לוח בקרה"}
          subtitle={tabConfig[activeTab]?.subtitle}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          searchPlaceholder="חפש הזמנות, אורחים..."
        >
          <HotelSelector />
        </AdminHeader>

        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="צ'ק-אין היום"
                  value={stats.todayCheckIns}
                  icon={DoorOpenIcon}
                  subtitle="הגעות צפויות"
                  iconClassName="bg-green-500/10"
                />
                <StatsCard
                  title="צ'ק-אאוט היום"
                  value={stats.todayCheckOuts}
                  icon={DoorClosedIcon}
                  subtitle="עזיבות צפויות"
                  iconClassName="bg-blue-500/10"
                />
                <StatsCard
                  title="תפוסה"
                  value={`${stats.occupancyRate}%`}
                  icon={TrendingUpIcon}
                  subtitle={`${stats.totalRooms - stats.availableRooms}/${stats.totalRooms} חדרים`}
                  trend={{ value: 12, isPositive: true }}
                  iconClassName="bg-purple-500/10"
                />
                <StatsCard
                  title="הכנסות חודשיות"
                  value={formatPrice(stats.monthlyRevenue)}
                  icon={DollarSignIcon}
                  subtitle={`${stats.monthlyBookings} הזמנות`}
                  trend={{ value: 8, isPositive: true }}
                  iconClassName="bg-yellow-500/10"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart />
                <OccupancyChart />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentBookings bookings={bookings} />
                <TodayActivity />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RoomTypeChart />
                <QuickStats />
                <div className="hidden lg:block" />
              </div>
            </div>
          )}

          {activeTab === "bookings" && <BookingsTable bookings={bookings} />}
          {activeTab === "rooms" && <RoomsManagement rooms={mockRooms} />}
          {activeTab === "roomtypes" && <RoomTypesManagement />}
          {activeTab === "pricing" && <PricingCalendar rooms={mockRooms} />}
          {activeTab === "promotions" && <PromotionsManagement />}
          {activeTab === "engines" && <EngineSettings />}
          {activeTab === "agents" && <AgentsManagement />}
          {activeTab === "aiconfig" && <AiSettings />}
          {activeTab === "embed" && <EmbedCodes />}

          {activeTab === "aichat" && currentHotel?.enableAiChat && (
            <div className="max-w-lg mx-auto h-[700px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <ChatInterface language="he" embedded />
            </div>
          )}

          {activeTab === "aichat" && !currentHotel?.enableAiChat && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">צ'אט AI לא מופעל</h3>
              <p className="text-muted-foreground mb-4">הפעל את צ'אט AI בהגדרות המנועים כדי לראות תצוגה מקדימה</p>
              <button onClick={() => setActiveTab("engines")} className="text-primary hover:underline">
                עבור להגדרות מנועים
              </button>
            </div>
          )}

          {activeTab === "settings" && <SettingsForm hotel={hotel} onSave={handleSaveHotel} />}
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <HotelConfigProvider>
      <AdminDashboardContent />
    </HotelConfigProvider>
  )
}
