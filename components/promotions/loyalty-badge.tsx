'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Crown, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface LoyaltyBadgeProps {
  hotelId?: string
  variant?: 'default' | 'dark' | 'luxury' | 'family'
}

interface LoyaltyMember {
  tier: string
  points: number
  discount: number
}

export function LoyaltyBadge({ hotelId, variant = 'default' }: LoyaltyBadgeProps) {
  const { data: session } = useSession()
  const [member, setMember] = useState<LoyaltyMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkMembership = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/loyalty/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            hotelId
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.isMember) {
            setMember(data.member)
          }
        }
      } catch (err) {
        console.error('Error checking loyalty membership:', err)
      } finally {
        setLoading(false)
      }
    }

    checkMembership()
  }, [session, hotelId])

  if (loading || !member) {
    return null
  }

  const tierColors = {
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-purple-600'
  }

  const tierLabels = {
    silver: 'כסף',
    gold: 'זהב',
    platinum: 'פלטינום'
  }

  const badgeClass =
    variant === 'dark'
      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
      : variant === 'luxury'
      ? 'bg-amber-600 text-white'
      : variant === 'family'
      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'

  return (
    <div className={`p-4 rounded-lg border ${variant === 'dark' ? 'bg-gradient-to-br from-yellow-900/20 to-purple-900/20 border-yellow-500/30' : 'bg-gradient-to-br from-yellow-50 to-purple-50 border-yellow-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <div>
            <p className={`font-semibold ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              חבר VIP
            </p>
            <p className={`text-sm ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              דרגה: {tierLabels[member.tier as keyof typeof tierLabels] || member.tier}
            </p>
          </div>
        </div>
        <Badge className={badgeClass}>
          <Sparkles className="h-3 w-3 ml-1" />
          {member.discount}% הנחה
        </Badge>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className={variant === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            נקודות:
          </span>
          <span className={`font-bold ${variant === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {member.points.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
