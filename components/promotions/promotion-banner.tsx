"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Smartphone } from "lucide-react"
import type { Promotion } from "@/lib/promotions/types"
import { Button } from "@/components/ui/button"

function isMobileDevice() {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function PromotionBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  useEffect(() => {
    async function loadPromotions() {
      const response = await fetch(`/api/promotions?mobile=${isMobile}`)
      const data = await response.json()
      if (data.success) {
        setPromotions(data.data)
      }
    }
    loadPromotions()
  }, [isMobile])

  useEffect(() => {
    if (promotions.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [promotions.length])

  if (!isVisible || promotions.length === 0) return null

  const currentPromotion = promotions[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-3 px-4 md:py-4 md:px-6 overflow-hidden"
      >
        {/* Background animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] animate-pulse" />
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {currentPromotion.mobileOnly && (
                <Smartphone className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 animate-bounce" />
              )}
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 animate-spin-slow" />

              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-bold truncate">{currentPromotion.title}</h3>
                <p className="text-xs md:text-sm opacity-90 truncate">{currentPromotion.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {promotions.length > 1 && (
                <div className="hidden md:flex items-center gap-1">
                  {promotions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                      aria-label={`Go to promotion ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 flex-shrink-0"
                onClick={() => setIsVisible(false)}
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
