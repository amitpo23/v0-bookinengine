/**
 * Enhanced Template Components
 * קומפוננטות משותפות משופרות לכל הטמפלטים
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { HotelCardSkeleton, BookingCardSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Loading Overlay עם אנימציה
export function EnhancedLoadingOverlay({
  isLoading,
  variant = 'light',
}: {
  isLoading: boolean
  variant?: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 ${
            isDark ? 'bg-black/80' : 'bg-white/90'
          } flex items-center justify-center z-50`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 15 }}
            className={`${
              isDark
                ? 'bg-zinc-900 border-zinc-700'
                : 'bg-white border-gray-200'
            } border rounded-2xl p-8 flex flex-col items-center gap-6 max-w-md mx-4 shadow-2xl`}
          >
            <div className="relative">
              <Loader2
                className={`w-16 h-16 animate-spin ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  isDark ? 'bg-blue-400/20' : 'bg-blue-600/20'
                } blur-xl rounded-full animate-pulse`}
              ></div>
            </div>

            <div className="text-center space-y-2">
              <p
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                מחפש חדרים זמינים...
              </p>
              <p
                className={`text-sm ${
                  isDark ? 'text-zinc-400' : 'text-gray-600'
                }`}
              >
                מאתר את האפשרויות הטובות ביותר עבורך
              </p>
            </div>

            {/* Skeleton Preview */}
            <div className="w-full space-y-3 mt-4">
              <div
                className={`${
                  isDark ? 'bg-zinc-800/50' : 'bg-gray-50'
                } rounded-xl p-4`}
              >
                <HotelCardSkeleton />
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-2 h-2 rounded-full ${
                    isDark ? 'bg-blue-400' : 'bg-blue-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Notifications משופרות
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      duration: 4000,
    })
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      duration: 5000,
    })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      duration: 4000,
    })
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  },
}

// Animated Card Wrapper
export function AnimatedCard({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay, duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Search Results Grid עם אנימציה
export function AnimatedSearchResults({
  children,
  isLoading,
}: {
  children: React.ReactNode
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AnimatedCard key={i} delay={i * 0.1}>
            <HotelCardSkeleton />
          </AnimatedCard>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {children}
    </motion.div>
  )
}

// Booking Steps עם אנימציה
export function AnimatedBookingSteps({
  steps,
  currentStep,
}: {
  steps: { id: string; label: string }[]
  currentStep: string
}) {
  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isPast = steps.findIndex((s) => s.id === currentStep) > index
        const isFuture = steps.findIndex((s) => s.id === currentStep) < index

        return (
          <motion.div
            key={step.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isPast
                    ? '#10b981'
                    : isActive
                      ? '#3b82f6'
                      : '#e5e7eb',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  isPast || isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <motion.span
                animate={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#3b82f6' : '#6b7280',
                }}
                className="text-xs mt-2"
              >
                {step.label}
              </motion.span>
            </div>

            {index < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: isPast ? '#10b981' : '#e5e7eb',
                }}
                className="w-12 h-1 mx-2 rounded-full"
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// Empty State
export function EmptyState({
  title,
  description,
  action,
  variant = 'light',
}: {
  title: string
  description: string
  action?: React.ReactNode
  variant?: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 px-6 ${
        isDark
          ? 'bg-zinc-900 border-zinc-700'
          : 'bg-gray-50 border-gray-200'
      } border rounded-2xl`}
    >
      <div className="max-w-md mx-auto space-y-4">
        <h3
          className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
          {description}
        </p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </motion.div>
  )
}

// Error State
export function ErrorState({
  title = 'משהו השתבש',
  description,
  onRetry,
  variant = 'light',
}: {
  title?: string
  description: string
  onRetry?: () => void
  variant?: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-16 px-6 ${
        isDark ? 'bg-red-900/10 border-red-900/50' : 'bg-red-50 border-red-200'
      } border rounded-2xl`}
    >
      <div className="max-w-md mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3
          className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
          {description}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            נסה שוב
          </button>
        )}
      </div>
    </motion.div>
  )
}
