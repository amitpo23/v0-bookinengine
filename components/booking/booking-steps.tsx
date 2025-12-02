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
  const { t, dir } = useI18n()

  const steps = [
    { id: 1, name: t("step1") },
    { id: 2, name: t("step2") },
    { id: 3, name: t("step3") },
    { id: 4, name: t("step4") },
  ]

  return (
    <nav aria-label="Progress" className="mb-8" dir={dir}>
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn("relative flex-1", stepIdx !== steps.length - 1 && (dir === "rtl" ? "pl-8" : "pr-8"))}
          >
            {step.id < currentStep ? (
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <CheckIcon className="h-5 w-5 text-primary-foreground" />
                </span>
                <span
                  className={cn("text-sm font-medium text-foreground hidden sm:block", dir === "rtl" ? "mr-3" : "ml-3")}
                >
                  {step.name}
                </span>
              </div>
            ) : step.id === currentStep ? (
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{step.id}</span>
                </span>
                <span
                  className={cn("text-sm font-medium text-primary hidden sm:block", dir === "rtl" ? "mr-3" : "ml-3")}
                >
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                  <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
                </span>
                <span
                  className={cn(
                    "text-sm font-medium text-muted-foreground hidden sm:block",
                    dir === "rtl" ? "mr-3" : "ml-3",
                  )}
                >
                  {step.name}
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 && (
              <div
                className={cn("absolute top-5 hidden sm:block", dir === "rtl" ? "left-0 -right-8" : "right-0 -left-8")}
              >
                <div className={cn("h-0.5 w-full", step.id < currentStep ? "bg-primary" : "bg-muted-foreground/30")} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
