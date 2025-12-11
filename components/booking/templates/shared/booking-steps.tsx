"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  label: string
}

interface BookingStepsProps {
  steps: Step[]
  currentStep: string
  variant?: "default" | "dark" | "luxury" | "family"
}

export function BookingSteps({ steps, currentStep, variant = "default" }: BookingStepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  const variantStyles = {
    default: {
      active: "bg-primary text-primary-foreground",
      completed: "bg-green-500 text-white",
      pending: "bg-muted text-muted-foreground",
      line: "bg-primary",
      linePending: "bg-muted",
    },
    dark: {
      active: "bg-cyan-500 text-black",
      completed: "bg-green-500 text-white",
      pending: "bg-zinc-700 text-zinc-400",
      line: "bg-cyan-500",
      linePending: "bg-zinc-700",
    },
    luxury: {
      active: "bg-amber-600 text-white",
      completed: "bg-green-600 text-white",
      pending: "bg-stone-300 text-stone-500",
      line: "bg-amber-600",
      linePending: "bg-stone-300",
    },
    family: {
      active: "bg-gradient-to-r from-orange-500 to-pink-500 text-white",
      completed: "bg-green-500 text-white",
      pending: "bg-purple-200 text-purple-400",
      line: "bg-gradient-to-r from-orange-500 to-pink-500",
      linePending: "bg-purple-200",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="flex items-center justify-center gap-2 py-4" dir="rtl">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = step.id === currentStep
        const isPending = index > currentIndex

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && styles.completed,
                  isActive && styles.active,
                  isPending && styles.pending,
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 font-medium",
                  isActive && "text-foreground",
                  isPending && "text-muted-foreground",
                  isCompleted && "text-green-600",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("w-16 h-1 mx-2 rounded-full", index < currentIndex ? styles.line : styles.linePending)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
