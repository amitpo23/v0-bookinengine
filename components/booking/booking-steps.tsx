"use client"

import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface BookingStepsProps {
  currentStep: number
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const { locale, dir } = useI18n()

  const steps =
    locale === "he"
      ? [
          { id: 1, name: "פרטים אישיים" },
          { id: 2, name: "פרטי אשראי" },
          { id: 3, name: "חופשה נעימה" },
        ]
      : [
          { id: 1, name: "Personal Details" },
          { id: 2, name: "Payment" },
          { id: 3, name: "Confirmation" },
        ]

  // Map currentStep to display step (1-2 -> 1, 3 -> 1, 4 -> 2, 5 -> 3)
  const displayStep = currentStep <= 2 ? 1 : currentStep === 3 ? 1 : currentStep === 4 ? 2 : 3

  return (
    <nav aria-label="Progress" className="mb-8" dir={dir}>
      <ol className="flex items-center justify-center gap-0">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative flex flex-col items-center">
            {/* Connector line - before circle */}
            {stepIdx > 0 && (
              <div
                className={cn(
                  "absolute top-5 h-0.5 w-16 sm:w-24 md:w-32",
                  dir === "rtl" ? "right-1/2 translate-x-1/2 mr-8" : "left-1/2 -translate-x-full -ml-8",
                  step.id <= displayStep ? "bg-blue-600" : "bg-gray-300",
                )}
              />
            )}

            {/* Circle */}
            <div className="relative z-10">
              {step.id < displayStep ? (
                // Completed step
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  <CheckIcon className="h-5 w-5" />
                </span>
              ) : step.id === displayStep ? (
                // Current step
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white font-bold text-lg">
                  {step.id}
                </span>
              ) : (
                // Future step
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 font-bold text-lg">
                  {step.id}
                </span>
              )}
            </div>

            {/* Step name below circle */}
            <span
              className={cn(
                "mt-2 text-sm font-medium text-center whitespace-nowrap",
                step.id === displayStep ? "text-blue-900" : step.id < displayStep ? "text-blue-600" : "text-gray-400",
              )}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
