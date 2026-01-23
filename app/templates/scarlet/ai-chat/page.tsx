"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChatInterface } from "@/components/ai-chat/chat-interface"
import { HotelConfigProvider } from "@/lib/hotel-config-context"

// Scarlet Hotel Agent
const scarletAgent = {
  id: "scarlet-concierge",
  name: "מלון סקרלט - קונסיירז׳",
  description: "מומחה הזמנות למלון סקרלט תל אביב",
  avatar: "/scarlet-logo.jpg",
  specialty: "מלון בוטיק רומנטי בלב תל אביב",
  rating: 4.9,
  reviews: 127,
  responseTime: "מיידי",
  capabilities: [
    "בדיקת זמינות חדרים",
    "הזמנות בזמן אמת",
    "המלצות חדרים",
    "מידע על שירותי המלון",
    "הצעות מבצעים",
    "תכנון חוויית אירוח",
  ],
}

// Icons
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

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

export default function ScarletAiChatPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <HotelConfigProvider hotelId="scarlet-hotel">
      <div className={cn("min-h-screen", darkMode ? "bg-black" : "bg-slate-50")} dir="rtl">
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-50 border-b backdrop-blur-sm",
            darkMode
              ? "bg-black/80 border-rose-500/20"
              : "bg-white/80 border-rose-200",
          )}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <a
                  href="/templates/scarlet"
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    darkMode ? "hover:bg-slate-800 text-white" : "hover:bg-slate-100 text-slate-900",
                  )}
                  title="חזרה למלון סקרלט"
                >
                  <BackIcon />
                </a>
                <div>
                  <h1
                    className={cn(
                      "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      darkMode
                        ? "from-rose-400 via-pink-500 to-red-500"
                        : "from-rose-600 via-pink-600 to-red-600",
                    )}
                  >
                    מלון סקרלט
                  </h1>
                  <p
                    className={cn(
                      "text-sm flex items-center gap-2",
                      darkMode ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    <SparklesIcon />
                    <span>שיחה חכמה עם הקונסיירז׳</span>
                  </p>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode
                    ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                )}
                aria-label="החלף מצב תצוגה"
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </header>

        {/* Agent Info Banner */}
        <div
          className={cn(
            "border-b",
            darkMode ? "bg-gradient-to-r from-rose-950/50 to-pink-950/50 border-rose-500/20" : "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200",
          )}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2",
                  darkMode ? "border-rose-500/50" : "border-rose-300",
                )}
              >
                <div className="w-full h-full bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 flex items-center justify-center">
                  <SparklesIcon />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={cn("text-lg font-bold", darkMode ? "text-white" : "text-slate-900")}>
                    {scarletAgent.name}
                  </h2>
                  <div className="flex items-center gap-1">
                    <StarIcon />
                    <span className={cn("text-sm font-medium", darkMode ? "text-white" : "text-slate-900")}>
                      {scarletAgent.rating}
                    </span>
                    <span className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
                      ({scarletAgent.reviews})
                    </span>
                  </div>
                </div>

                <p className={cn("text-sm mb-2", darkMode ? "text-slate-300" : "text-slate-600")}>
                  {scarletAgent.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className={cn("flex items-center gap-1", darkMode ? "text-emerald-400" : "text-emerald-600")}>
                    <ClockIcon />
                    <span>{scarletAgent.responseTime}</span>
                  </div>
                  <div className={cn(darkMode ? "text-slate-400" : "text-slate-600")}>
                    {scarletAgent.specialty}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {scarletAgent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        darkMode
                          ? "bg-rose-950/50 text-rose-300 border-rose-500/30"
                          : "bg-rose-50 text-rose-700 border-rose-200",
                      )}
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="container mx-auto px-4 py-6">
          <div
            className={cn(
              "rounded-2xl border shadow-2xl overflow-hidden",
              darkMode ? "bg-slate-900/50 border-rose-500/20" : "bg-white border-rose-200",
            )}
            style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}
          >
            <ChatInterface
              hotelId="scarlet-hotel"
              language="he"
              embedded={false}
              agentName={scarletAgent.name}
              agentAvatar={scarletAgent.avatar}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="container mx-auto px-4 py-6 text-center">
          <p className={cn("text-sm", darkMode ? "text-slate-500" : "text-slate-600")}>
            💬 שאל אותי על חדרים זמינים, מחירים, מבצעים ושירותי המלון • הזמן ישירות דרך השיחה
          </p>
        </div>
      </div>
    </HotelConfigProvider>
  )
}
