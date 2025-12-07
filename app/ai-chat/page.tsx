"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/ai-chat/chat-interface"
import { HotelConfigProvider } from "@/lib/hotel-config-context"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  specialty: string
  online: boolean
  rating: number
  reviewCount: number
  languages: string[]
}

interface ChatHistory {
  id: string
  agentId: string
  agentName: string
  lastMessage: string
  timestamp: Date
  unread: number
}

const agents: Agent[] = [
  {
    id: "booking-agent",
    name: "סוכן הזמנות",
    description: "מומחה להזמנות מלונות ברחבי העולם",
    avatar: "/professional-booking-agent.jpg",
    specialty: "הזמנות מלונות",
    online: true,
    rating: 4.9,
    reviewCount: 1250,
    languages: ["עברית", "English", "العربية"],
  },
  {
    id: "dubai-expert",
    name: "מיסטר עזיז",
    description: "מומחה למלונות יוקרה בדובאי ואיחוד האמירויות",
    avatar: "/dubai-hotel-expert-man.jpg",
    specialty: "דובאי",
    online: true,
    rating: 4.8,
    reviewCount: 890,
    languages: ["العربية", "English", "עברית"],
  },
  {
    id: "europe-expert",
    name: "סופיה",
    description: "מומחית לחופשות רומנטיות באירופה",
    avatar: "/european-travel-expert-woman.jpg",
    specialty: "אירופה",
    online: false,
    rating: 4.7,
    reviewCount: 620,
    languages: ["English", "Français", "עברית"],
  },
]

const mockChatHistory: ChatHistory[] = [
  {
    id: "chat-1",
    agentId: "dubai-expert",
    agentName: "מיסטר עזיז",
    lastMessage: "מצוין! ההזמנה אושרה. מספר אישור: MED-2024-1234",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 0,
  },
  {
    id: "chat-2",
    agentId: "booking-agent",
    agentName: "סוכן הזמנות",
    lastMessage: "מחפש לך את המלונות הטובים ביותר בפריז...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 2,
  },
]

// Icons
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
)

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function AiChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"agents" | "history">("agents")
  const [chatHistory] = useState<ChatHistory[]>(mockChatHistory)

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.includes(searchQuery) ||
      agent.description.includes(searchQuery) ||
      agent.specialty.includes(searchQuery),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 60) return `לפני ${minutes} דקות`
    if (hours < 24) return `לפני ${hours} שעות`
    return date.toLocaleDateString("he-IL")
  }

  return (
    <HotelConfigProvider>
      <div className={cn("h-screen flex", darkMode ? "bg-black" : "bg-slate-100")} dir="rtl">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "fixed top-4 right-4 z-50 p-2 rounded-lg md:hidden",
            darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900 shadow-lg",
          )}
        >
          <MenuIcon />
        </button>

        {/* Sidebar */}
        <aside
          className={cn(
            "w-80 flex-shrink-0 flex flex-col border-l transition-all duration-300",
            darkMode ? "bg-slate-900/50 border-white/10" : "bg-white border-slate-200",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
            "fixed md:relative inset-y-0 right-0 z-40 md:z-auto",
          )}
        >
          {/* Header */}
          <div className={cn("p-4 border-b", darkMode ? "border-white/10" : "border-slate-200")}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-bold", darkMode ? "text-white" : "text-slate-900")}>
                AI Travel Assistant
              </h2>
              <button
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500",
                )}
              >
                <SettingsIcon />
              </button>
            </div>

            {/* Search */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl",
                darkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-100 text-slate-500",
              )}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="חיפוש סוכנים או שיחות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "flex-1 bg-transparent border-none outline-none text-sm",
                  darkMode ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400",
                )}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className={cn("flex border-b", darkMode ? "border-white/10" : "border-slate-200")}>
            <button
              onClick={() => setActiveTab("agents")}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors relative",
                activeTab === "agents"
                  ? darkMode
                    ? "text-emerald-400"
                    : "text-emerald-600"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-500 hover:text-slate-700",
              )}
            >
              סוכנים
              {activeTab === "agents" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors relative",
                activeTab === "history"
                  ? darkMode
                    ? "text-emerald-400"
                    : "text-emerald-600"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-500 hover:text-slate-700",
              )}
            >
              היסטוריה
              {chatHistory.some((c) => c.unread > 0) && (
                <span className="absolute top-2 right-4 w-2 h-2 bg-rose-500 rounded-full" />
              )}
              {activeTab === "history" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-2 py-3">
            {activeTab === "agents" ? (
              <div className="space-y-2">
                {filteredAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent)
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-right group",
                      selectedAgent?.id === agent.id
                        ? darkMode
                          ? "bg-emerald-600/20 border border-emerald-500/30"
                          : "bg-emerald-50 border border-emerald-200"
                        : darkMode
                          ? "hover:bg-slate-800/50"
                          : "hover:bg-slate-100",
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 transition-all group-hover:ring-emerald-500"
                        style={{
                          ringColor: agent.online ? "#10b981" : "#64748b",
                          ringOffsetColor: darkMode ? "#0f172a" : "#f1f5f9",
                        }}
                      />
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          darkMode ? "border-slate-900" : "border-white",
                          agent.online ? "bg-emerald-500" : "bg-slate-400",
                        )}
                      >
                        {agent.online && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn("font-semibold text-sm", darkMode ? "text-white" : "text-slate-900")}>
                          {agent.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <StarIcon />
                          <span className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
                            {agent.rating}
                          </span>
                        </div>
                      </div>
                      <p className={cn("text-xs mt-0.5", darkMode ? "text-slate-400" : "text-slate-500")}>
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded-full",
                            darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {agent.specialty}
                        </span>
                        <span className={cn("text-[10px]", darkMode ? "text-slate-500" : "text-slate-400")}>
                          {agent.reviewCount} ביקורות
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* New Chat Button */}
                <button
                  onClick={() => setActiveTab("agents")}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-colors",
                    darkMode
                      ? "border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400"
                      : "border-slate-300 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-600",
                  )}
                >
                  <PlusIcon />
                  <span className="text-sm font-medium">שיחה חדשה</span>
                </button>

                {chatHistory.map((chat) => {
                  const agent = agents.find((a) => a.id === chat.agentId)
                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        if (agent) {
                          setSelectedAgent(agent)
                          setSidebarOpen(false)
                        }
                      }}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-right",
                        darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-100",
                      )}
                    >
                      <img
                        src={agent?.avatar || "/placeholder.svg"}
                        alt={chat.agentName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn("font-semibold text-sm", darkMode ? "text-white" : "text-slate-900")}>
                            {chat.agentName}
                          </p>
                          <div className="flex items-center gap-1">
                            <ClockIcon />
                            <span className={cn("text-[10px]", darkMode ? "text-slate-500" : "text-slate-400")}>
                              {formatTime(chat.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className={cn("text-xs mt-0.5 truncate", darkMode ? "text-slate-400" : "text-slate-500")}>
                          {chat.lastMessage}
                        </p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom Section - User & Dark Mode */}
          <div className={cn("p-4 border-t", darkMode ? "border-white/10" : "border-slate-200")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                    darkMode
                      ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
                      : "bg-slate-200 text-slate-700",
                  )}
                >
                  א
                </div>
                <div>
                  <p className={cn("text-sm font-medium", darkMode ? "text-white" : "text-slate-900")}>אורח</p>
                  <p className={cn("text-xs", darkMode ? "text-slate-500" : "text-slate-400")}>התחבר לחשבון</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  darkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300",
                )}
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {selectedAgent ? (
            <ChatInterface
              language="he"
              embedded={false}
              agentName={selectedAgent.name}
              agentAvatar={selectedAgent.avatar}
              darkMode={darkMode}
            />
          ) : (
            // Welcome Screen
            <div
              className={cn(
                "flex-1 flex flex-col items-center justify-center p-8",
                darkMode ? "text-white" : "text-slate-900",
              )}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-emerald-500 text-white rounded-full">
                  AI Powered
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                שלום!
              </h1>
              <p className={cn("text-lg mb-8", darkMode ? "text-slate-400" : "text-slate-600")}>
                בחר סוכן כדי להתחיל לתכנן את החופשה שלך
              </p>

              {/* Quick Agent Selection */}
              <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                {agents
                  .filter((a) => a.online)
                  .map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all",
                        darkMode
                          ? "bg-slate-800/50 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/50"
                          : "bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500/50 shadow-sm",
                      )}
                    >
                      <img
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="text-right">
                        <p className={cn("font-semibold text-sm", darkMode ? "text-white" : "text-slate-900")}>
                          {agent.name}
                        </p>
                        <p className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
                          {agent.specialty}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </main>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </HotelConfigProvider>
  )
}
