"use client"

import { Crown, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LoyaltyBadgeProps {
  tier: "bronze" | "silver" | "gold" | "platinum"
  discount: number
  points?: number
  className?: string
}

const TIER_CONFIG = {
  bronze: {
    label: "Bronze",
    color: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
    icon: Crown,
    gradient: "from-orange-400 to-orange-600",
  },
  silver: {
    label: "Silver",
    color: "bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600",
    icon: Crown,
    gradient: "from-gray-400 to-gray-600",
  },
  gold: {
    label: "Gold",
    color: "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-700",
    icon: Crown,
    gradient: "from-yellow-400 to-yellow-600",
  },
  platinum: {
    label: "Platinum",
    color: "bg-purple-100 text-purple-700 border-purple-400 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-700",
    icon: Sparkles,
    gradient: "from-purple-400 to-purple-600",
  },
}

export function LoyaltyBadge({ tier, discount, points, className }: LoyaltyBadgeProps) {
  const config = TIER_CONFIG[tier]
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className={`${config.color} font-semibold`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label} Member
      </Badge>
      <span className="text-sm font-medium">
        {discount}% הנחה
      </span>
      {points !== undefined && (
        <span className="text-xs text-muted-foreground">
          {points.toLocaleString()} נקודות
        </span>
      )}
    </div>
  )
}
