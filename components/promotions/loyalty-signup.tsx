'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Crown, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface LoyaltySignupProps {
  hotelId?: string
  variant?: 'default' | 'dark' | 'luxury' | 'family'
}

export function LoyaltySignup({ hotelId, variant = 'default' }: LoyaltySignupProps) {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async () => {
    const userEmail = session?.user?.email || email

    if (!userEmail) {
      setError('אנא הזן אימייל')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/loyalty/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: session?.user?.name || undefined,
          hotelId
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(data.message || 'שגיאה בהרשמה')
      }
    } catch (err) {
      setError('שגיאה בהרשמה למועדון')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 
    variant === 'dark'
      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
      : variant === 'luxury'
      ? 'border-amber-300 focus:border-amber-500'
      : variant === 'family'
      ? 'border-purple-300 focus:border-orange-400'
      : ''

  const buttonClass =
    variant === 'dark'
      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
      : variant === 'luxury'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : variant === 'family'
      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
      : ''

  if (success) {
    return (
      <div className={`p-4 rounded-lg border ${variant === 'dark' ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className={`font-semibold ${variant === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
              הצטרפת בהצלחה למועדון VIP!
            </p>
            <p className={`text-sm ${variant === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
              פרטי החברות נשלחו לאימייל שלך
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!session?.user && (
        <Input
          type="email"
          placeholder="הזן את האימייל שלך"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={inputClass}
          dir="rtl"
        />
      )}

      <Button
        onClick={handleSignup}
        disabled={loading || (!session?.user && !email)}
        className={`w-full ${buttonClass}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            מצטרף...
          </>
        ) : (
          <>
            <Crown className="h-4 w-4 ml-2" />
            הצטרף למועדון VIP
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <p className={`text-xs text-center ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        חינם לחלוטין • ללא התחייבות
      </p>
    </div>
  )
}
