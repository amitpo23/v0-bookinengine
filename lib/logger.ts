/**
 * Professional Logger
 * Replaces console.log with environment-aware logging
 */

const isDevelopment = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  [key: string]: any
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Always log errors and warnings
    if (level === "error" || level === "warn") return true

    // Only log debug and info in development
    return isDevelopment || isTest
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context, null, 2)}`
    }

    return `${prefix} ${message}`
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog("debug")) return
    console.log(this.formatMessage("debug", message, context))
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog("info")) return
    console.info(this.formatMessage("info", message, context))
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog("warn")) return
    console.warn(this.formatMessage("warn", message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog("error")) return

    const errorContext: LogContext = { ...context }

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      errorContext.error = error
    }

    console.error(this.formatMessage("error", message, errorContext))

    // In production, you would send this to a monitoring service like Sentry
    // Example: Sentry.captureException(error, { extra: context })
  }

  /**
   * API Request Logger
   * Logs API requests with sanitized data (no sensitive info)
   */
  apiRequest(method: string, endpoint: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${endpoint}`, this.sanitize(context))
  }

  /**
   * API Response Logger
   */
  apiResponse(method: string, endpoint: string, status: number, duration?: number): void {
    const level = status >= 400 ? "error" : status >= 300 ? "warn" : "info"
    const message = `API Response: ${method} ${endpoint} - ${status}`

    if (duration) {
      this[level](message, { duration: `${duration}ms` })
    } else {
      this[level](message)
    }
  }

  /**
   * Sanitize sensitive data from logs
   */
  private sanitize(data?: LogContext): LogContext | undefined {
    if (!data) return undefined

    const sanitized = { ...data }

    // Remove sensitive fields
    const sensitiveFields = [
      "password",
      "token",
      "apiKey",
      "secret",
      "creditCard",
      "cvv",
      "ssn",
      "Authorization",
    ]

    const sanitizeObject = (obj: any): any => {
      if (!obj || typeof obj !== "object") return obj

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject)
      }

      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase()
        const isSensitive = sensitiveFields.some((field) => lowerKey.includes(field.toLowerCase()))

        if (isSensitive) {
          result[key] = "***REDACTED***"
        } else if (typeof value === "object" && value !== null) {
          result[key] = sanitizeObject(value)
        } else {
          result[key] = value
        }
      }
      return result
    }

    return sanitizeObject(sanitized)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for backward compatibility (can be removed later)
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
}
