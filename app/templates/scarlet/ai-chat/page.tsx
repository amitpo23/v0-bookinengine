"use client"

import { useState } from "react"
import { HotelConfigProvider } from "@/lib/hotel-config-context"
import { ChatInterface } from "@/components/ai-chat/chat-interface"
import { Button } from "@/components/ui/button"
import { 
  Moon, Sun, Sparkles, Calendar, MessageCircle, MapPin, Heart, Search, 
  Calculator, CreditCard, Star, Ticket, Crown, Cloud, TrendingUp, BarChart 
} from "lucide-react"

// Scarlet Hotel AI Agent Configuration with 13 Advanced Skills
const scarletAgent = {
  id: "scarlet-concierge",
  name: "קונסיירז' סקרלט",
  englishName: "Scarlet Concierge",
  avatar: "/scarlet-logo.png",
  description: "הקונסיירז' הוירטואלי המתקדם של מלון סקרלט תל אביב עם 13 יכולות חכמות",
  tagline: "היכן שהאורבני פוגש את הרומנטי",
  
  // 13 Advanced Capabilities with Skills
  capabilities: [
    {
      icon: <Search className="h-5 w-5" />,
      title: "חיפוש חכם",
      description: "בדיקת זמינות בזמן אמת ומחירים מעודכנים",
      skill: "availabilityCheck"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "המלצות אישיות",
      description: "המלצת החדר המושלם לפי צרכים ותקציב",
      skill: "roomRecommendation"
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "חישוב מחירים",
      description: "מחשבון מחיר מדויק כולל מבצעים והנחות",
      skill: "priceCalculation"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "ליווי הזמנה",
      description: "תהליך הזמנה מלא עם אישור בזמן אמת",
      skill: "bookingAssistant"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "מומחה מקומי",
      description: "המלצות על מסעדות, אטרקציות וחיי לילה",
      skill: "localExpert"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "בקשות מיוחדות",
      description: "חבילות רומנטיות, חגיגות ובקשות אישיות",
      skill: "specialRequests"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "ביקורות",
      description: "ביקורות אמיתיות ודירוגים מפורטים (4.7/5)",
      skill: "reviewsSystem"
    },
    {
      icon: <Ticket className="h-5 w-5" />,
      title: "מבצעים",
      description: "קופונים, הנחות ומבצעי פלאש בלעדיים",
      skill: "promotionsManager"
    },
    {
      icon: <Crown className="h-5 w-5" />,
      title: "מועדון VIP",
      description: "הרשמה למועדון והטבות אקסקלוסיביות",
      skill: "loyaltyProgram"
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: "מזג אוויר",
      description: "תחזית מזג אוויר ואטרקציות בתאריכי השהייה",
      skill: "weatherAndAttractions"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "טרנדים",
      description: "תובנות על תקופות פופולריות ויעדים חמים",
      skill: "travelTrends"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "WhatsApp",
      description: "תמיכה מהירה בוואטסאפ 24/7",
      skill: "whatsappSupport"
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "מעקב חכם",
      description: "המלצות משופרות לפי התנהגות",
      skill: "analyticsTracking"
    }
  ],

  // Personality Traits
  personality: {
    tone: "חם, ידידותי, מקצועי",
    style: "מותאם אישית ואמפתי",
    approach: "ליווי מלא מחיפוש ועד אישור הזמנה"
  }
}

export default function ScarletAIChatPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"}`}>
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  מלון סקרלט תל אביב
                </h1>
                <p className="text-sm text-gray-400">
                  {scarletAgent.tagline}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full hover:bg-white/10"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Agent Info Banner */}
      <div className="border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-white">
                  {scarletAgent.name}
                </h2>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  מחובר
                </span>
              </div>
              
              <p className="text-gray-300 mb-4">
                {scarletAgent.description}
              </p>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {scarletAgent.capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <div className="text-red-400 flex-shrink-0">
                      {capability.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {capability.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {capability.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-6">
        <HotelConfigProvider hotelId="scarlet-hotel">
          <ChatInterface
            language="he"
            embedded={false}
            agentName={scarletAgent.name}
            agentAvatar={scarletAgent.avatar}
            darkMode={darkMode}
          />
        </HotelConfigProvider>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-white/5 mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>מלון סקרלט תל אביב • רחוב ג'ורדון 17 • 📞 052-473-4940</p>
          <p className="mt-2">תוצר של מערכת הזמנות חכמה • מופעל על ידי AI</p>
        </div>
      </footer>
    </div>
  )
}
