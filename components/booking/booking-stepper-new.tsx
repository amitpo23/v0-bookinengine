"use client"

import type React from "react"
import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  titleHe: string
  subtitle?: string
  subtitleHe?: string
}

interface BookingStepperProps {
  currentStep: number
  steps: Step[]
  language?: "en" | "he"
  onStepClick?: (stepId: number) => void
}

const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep, steps, language = "he", onStepClick }) => {
  const isHebrew = language === "he"

  return (
    <div className="w-full bg-white shadow-md py-6 px-4 mb-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Progress Bar Background */}
          <div
            className="absolute top-5 left-0 right-0 h-1 bg-gray-200"
            style={{ marginLeft: "2rem", marginRight: "2rem" }}
          />

          {/* Progress Bar Fill */}
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{
              width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${((currentStep - 1) / (steps.length - 1)) * 4}rem)`,
              marginLeft: "2rem",
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep
              const isCurrent = step.id === currentStep
              const isClickable = onStepClick && (isCompleted || isCurrent)

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : ""}`}
                  onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                >
                  {/* Circle */}
                  <div
                    className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110 shadow-lg"
                        : isCurrent
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-125 shadow-xl ring-4 ring-blue-100"
                          : "bg-gray-200 text-gray-400"
                    }
                    ${isClickable ? "hover:scale-110 hover:shadow-lg" : ""}
                  `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-bold">{step.id}</span>}
                  </div>

                  {/* Label */}
                  <div
                    className={`
                    mt-3 text-center transition-all duration-300
                    ${isCurrent ? "transform scale-110" : ""}
                  `}
                  >
                    <div
                      className={`
                      font-bold text-sm whitespace-nowrap
                      ${isCurrent ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"}
                    `}
                    >
                      {isHebrew ? step.titleHe : step.title}
                    </div>
                    {(step.subtitle || step.subtitleHe) && (
                      <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                        {isHebrew ? step.subtitleHe : step.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Step Description */}
        <div className="text-center mt-6 animate-fadeIn">
          <p className="text-gray-600">
            {isHebrew ? `שלב ${currentStep} מתוך ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookingStepper
