"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const BedIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const ApiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const BotIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09z" />
    <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
)

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  hotelName: string
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

const menuItems = [
  { id: "dashboard", label: "לוח בקרה", icon: LayoutDashboardIcon },
  { id: "bookings", label: "הזמנות", icon: CalendarIcon, badge: 3 },
  { id: "rooms", label: "חדרים", icon: BedIcon },
  { id: "pricing", label: "תמחור", icon: DollarSignIcon },
  { id: "engines", label: "מנועי הזמנות", icon: ApiIcon },
  { id: "agents", label: "ניהול סוכנים", icon: UsersIcon, isNew: true },
  { id: "aiconfig", label: "הגדרות AI", icon: SparklesIcon },
  { id: "aichat", label: "צ׳אט AI", icon: BotIcon, isPro: true },
  { id: "embed", label: "הטמעה", icon: CodeIcon },
  { id: "settings", label: "הגדרות", icon: SettingsIcon },
]

export function AdminSidebar({
  activeTab,
  onTabChange,
  hotelName,
  collapsed = false,
  onCollapsedChange,
}: AdminSidebarProps) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-screen bg-sidebar border-l border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-[72px]" : "w-64",
        )}
        dir="rtl"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">BookingEngine</span>
                <span className="text-xs text-sidebar-muted">פאנל ניהול</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">B</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange?.(!collapsed)}
            className={cn(
              "h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "hidden",
            )}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Hotel Selector */}
        {!collapsed && (
          <div className="px-3 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/grand-hotel-exterior.png" />
                <AvatarFallback className="bg-primary/20 text-primary">{hotelName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{hotelName}</p>
                <p className="text-xs text-sidebar-muted">פעיל</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            const button = (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className={cn(
                          "h-5 min-w-[20px] flex items-center justify-center text-xs",
                          isActive ? "bg-white/20 text-white" : "bg-emerald-500 text-white",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.isPro && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30"
                      >
                        Pro
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      >
                        חדש
                      </Badge>
                    )}
                  </>
                )}
              </button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="left" className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <Badge variant="default" className="h-5 min-w-[20px]">
                        {item.badge}
                      </Badge>
                    )}
                    {item.isPro && <Badge variant="outline">Pro</Badge>}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return button
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                onClick={toggleTheme}
                className={cn(
                  "w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  collapsed ? "h-10 w-10 mx-auto" : "justify-start gap-3",
                )}
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                {!collapsed && <span>{isDark ? "מצב בהיר" : "מצב כהה"}</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="left">{isDark ? "מצב בהיר" : "מצב כהה"}</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  collapsed ? "h-10 w-10 mx-auto" : "justify-start gap-3",
                )}
              >
                <HelpCircleIcon className="h-5 w-5" />
                {!collapsed && <span>עזרה ותמיכה</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="left">עזרה ותמיכה</TooltipContent>}
          </Tooltip>

          {!collapsed && (
            <div className="flex items-center gap-3 p-2 mt-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/admin-user-interface.png" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">מנ</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">מנהל המלון</p>
                <p className="text-xs text-sidebar-muted truncate">admin@hotel.com</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground">
                <LogOutIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
