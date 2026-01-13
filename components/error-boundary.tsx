/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Log to external service (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      // Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">משהו השתבש</h1>
              <p className="text-muted-foreground">
                אירעה שגיאה בלתי צפויה. אנו עובדים על פתרון הבעיה.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted/50 p-4 rounded-lg text-right" dir="ltr">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium mb-2">
                    פרטי השגיאה (מצב פיתוח)
                  </summary>
                  <pre className="text-xs overflow-auto max-h-48 text-right">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                נסה שוב
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                חזור לדף הבית
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              אם השגיאה ממשיכה, אנא צור קשר עם התמיכה
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
