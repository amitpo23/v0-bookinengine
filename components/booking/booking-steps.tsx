"use client"

import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { Hotel, User, CreditCard, CheckCircle2 } from "lucide-react"

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

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  const { locale, dir } = useI18n()

  const steps =
    locale === "he"
      ? [
          { id: 1, name: "בחירת חדרים", icon: Hotel },
          { id: 2, name: "פרטים אישיים", icon: User },
          { id: 3, name: "תשלום ואישור", icon: CreditCard },
        ]
      : [
          { id: 1, name: "Select Rooms", icon: Hotel },
          { id: 2, name: "Personal Details", icon: User },
          { id: 3, name: "Payment", icon: CreditCard },
        ]

  // Map currentStep to display step (1->2 to 1, 3->1 to 1, 4->2 to 2, 5->3 to 3)
  const displayStep = currentStep <= 2 ? 1 : currentStep === 3 ? 1 : currentStep === 4 ? 2 : 3

  return (
    <nav aria-label="Progress" className="mb-8 w-full">
      {/* Progress bar background */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-8 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${((displayStep - 1) / (steps.length - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="flex items-center justify-between gap-0 relative -mt-10">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative flex flex-col items-center flex-1">
            {/* Connector line - before circle */}
            {stepIdx > 0 && (
              <div
                className="absolute top-5 h-0.5 w-full"
                style={{
                  [dir === "rtl" ? "right" : "left"]: "50%",
                  ...(step.id <= displayStep
                    ? { backgroundColor: "rgb(59 130 246)" }
                    : { backgroundColor: "rgb(229 231 235)" }),
                }}
              />
            )}

            <div className="relative flex items-center justify-center w-full">
              {/* Step circle */}
              <div
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                  step.id < displayStep
                    ? "bg-blue-600 text-white shadow-lg scale-110"
                    : step.id === displayStep
                    ? "bg-blue-600 text-white shadow-xl ring-4 ring-blue-200 scale-110 animate-pulse"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step.id < displayStep ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Step name */}
            <span
              className={cn(
                "mt-3 text-sm font-medium text-center transition-colors duration-300",
                step.id <= displayStep ? "text-blue-600" : "text-gray-500"
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
