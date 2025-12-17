"use client"

import { Component, type ReactNode } from "react"
import { logger } from "@/lib/logger"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console and monitoring service
    logger.error("Error caught by Error Boundary", error, {
      componentStack: errorInfo.componentStack,
    })

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you would send this to a monitoring service like Sentry:
    // Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided by props
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">משהו השתבש</h2>
            <p className="text-gray-600 mb-6">
              {process.env.NODE_ENV === "development" && this.state.error
                ? this.state.error.message
                : "אירעה שגיאה בלתי צפויה. אנא נסה שנית."}
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-40">
                <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
                <pre className="text-xs whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                נסה שנית
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                חזור לדף הבית
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Simple Error Fallback Component
 * Can be used with ErrorBoundary's fallback prop
 */
export function ErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">שגיאה</h2>
      <p className="text-gray-600 mb-4">{error?.message || "אירעה שגיאה"}</p>
      {resetError && (
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          נסה שנית
        </button>
      )}
    </div>
  )
}
