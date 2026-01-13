"use client"

import { useEffect, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface PreBookTimerProps {
  expiresAt: Date
  onExpired?: () => void
  warningMinutes?: number
}

export function PreBookTimer({ 
  expiresAt, 
  onExpired, 
  warningMinutes = 5 
}: PreBookTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = expiresAt.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeRemaining(0)
        setIsExpired(true)
        onExpired?.()
      } else {
        setTimeRemaining(Math.floor(diff / 1000))
      }
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const totalMinutes = 30 // PreBook is valid for 30 minutes
  const progressPercentage = (timeRemaining / (totalMinutes * 60)) * 100

  const isWarning = minutes < warningMinutes && !isExpired

  if (isExpired) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          זמן ההזמנה פג. אנא חפש שוב את החדר.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Clock className={`h-4 w-4 ${isWarning ? 'text-orange-500' : 'text-blue-500'}`} />
        <span className={isWarning ? 'text-orange-500 font-medium' : 'text-muted-foreground'}>
          זמן להשלמת ההזמנה: {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={`h-2 ${isWarning ? 'bg-orange-100' : ''}`}
      />

      {isWarning && (
        <Alert variant="default" className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            מהר! נשארו פחות מ-{warningMinutes} דקות להשלמת ההזמנה
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Hook לשימוש ב-PreBook Timer
export function usePreBookTimer(expiresAt: Date | null) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (!expiresAt) return

    const updateTimer = () => {
      const now = new Date()
      const diff = expiresAt.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeRemaining(0)
        setIsExpired(true)
        setIsWarning(false)
      } else {
        const seconds = Math.floor(diff / 1000)
        setTimeRemaining(seconds)
        setIsWarning(seconds < 5 * 60) // Warning at 5 minutes
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return {
    timeRemaining,
    minutes,
    seconds,
    isExpired,
    isWarning,
    progressPercentage: (timeRemaining / (30 * 60)) * 100
  }
}
