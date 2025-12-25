'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface PromoCodeInputProps {
  onPromoApplied: (code: string, discount: number) => void
  hotelId?: string
  variant?: 'default' | 'dark' | 'luxury' | 'family'
}

export function PromoCodeInput({ onPromoApplied, hotelId, variant = 'default' }: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApply = async () => {
    if (!code.trim()) {
      setError('אנא הזן קוד הנחה')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, hotelId })
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setSuccess(`קוד הופעל! ${data.discount}% הנחה`)
        onPromoApplied(code, data.discount)
      } else {
        setError(data.message || 'קוד לא תקין')
      }
    } catch (err) {
      setError('שגיאה בבדיקת הקוד')
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
      ? 'bg-white/20 hover:bg-white/30 text-white'
      : variant === 'luxury'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : variant === 'family'
      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
      : ''

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <Input
            type="text"
            placeholder="הזן קוד הנחה"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApply()}
            disabled={loading}
            className={`pr-10 ${inputClass}`}
            dir="ltr"
          />
        </div>
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className={buttonClass}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'החל'
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}
    </div>
  )
}
