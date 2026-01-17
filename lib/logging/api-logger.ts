// Comprehensive API Logging System
// Tracks all API calls, responses, and errors

import { createClient } from "@supabase/supabase-js"

// Log levels
export type LogLevel = "debug" | "info" | "warn" | "error"

// Log entry structure
export interface ApiLogEntry {
  id?: string
  timestamp: string
  level: LogLevel
  category: "api" | "medici" | "booking" | "auth" | "system"
  action: string
  method?: string
  endpoint?: string
  requestBody?: any
  responseBody?: any
  statusCode?: number
  duration?: number
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  error?: string
  metadata?: Record<string, any>
}

// In-memory buffer for logs (also saved to Supabase if configured)
const logBuffer: ApiLogEntry[] = []
const MAX_BUFFER_SIZE = 1000

// Supabase client for persistent logging
let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
}

function getLevelColor(level: LogLevel): string {
  switch (level) {
    case "debug": return colors.dim
    case "info": return colors.cyan
    case "warn": return colors.yellow
    case "error": return colors.red
    default: return colors.white
  }
}

function getCategoryIcon(category: ApiLogEntry["category"]): string {
  switch (category) {
    case "api": return "🌐"
    case "medici": return "🏨"
    case "booking": return "📋"
    case "auth": return "🔐"
    case "system": return "⚙️"
    default: return "📝"
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function truncate(str: string, maxLen: number = 200): string {
  if (!str) return ""
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen) + "..."
}

// Main logger class
class ApiLogger {
  private static instance: ApiLogger
  private enabled: boolean = true

  private constructor() {}

  static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger()
    }
    return ApiLogger.instance
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  private formatLogForConsole(entry: ApiLogEntry): string {
    const time = new Date(entry.timestamp).toLocaleTimeString("he-IL")
    const icon = getCategoryIcon(entry.category)
    const levelColor = getLevelColor(entry.level)
    
    let output = `${colors.dim}[${time}]${colors.reset} ${icon} ${levelColor}[${entry.level.toUpperCase()}]${colors.reset} `
    output += `${colors.bright}${entry.action}${colors.reset}`
    
    if (entry.method && entry.endpoint) {
      const methodColor = entry.method === "GET" ? colors.green : 
                         entry.method === "POST" ? colors.blue : 
                         entry.method === "PUT" ? colors.yellow : colors.red
      output += ` ${methodColor}${entry.method}${colors.reset} ${entry.endpoint}`
    }
    
    if (entry.statusCode) {
      const statusColor = entry.statusCode < 300 ? colors.green : 
                         entry.statusCode < 400 ? colors.yellow : colors.red
      output += ` ${statusColor}[${entry.statusCode}]${colors.reset}`
    }
    
    if (entry.duration) {
      output += ` ${colors.magenta}(${formatDuration(entry.duration)})${colors.reset}`
    }
    
    return output
  }

  async log(entry: Omit<ApiLogEntry, "id" | "timestamp">): Promise<void> {
    if (!this.enabled) return

    const fullEntry: ApiLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    }

    // Console output
    console.log(this.formatLogForConsole(fullEntry))
    
    // Additional details for errors or debug
    if (entry.level === "error" && entry.error) {
      console.error(`${colors.red}  Error: ${entry.error}${colors.reset}`)
    }
    
    if (entry.requestBody && (entry.level === "debug" || entry.level === "error")) {
      console.log(`${colors.dim}  Request: ${truncate(JSON.stringify(entry.requestBody))}${colors.reset}`)
    }
    
    if (entry.responseBody && entry.level === "error") {
      console.log(`${colors.dim}  Response: ${truncate(JSON.stringify(entry.responseBody))}${colors.reset}`)
    }

    // Add to buffer
    logBuffer.push(fullEntry)
    if (logBuffer.length > MAX_BUFFER_SIZE) {
      logBuffer.shift()
    }

    // Save to Supabase (async, non-blocking)
    this.saveToSupabase(fullEntry).catch(() => {})
  }

  private async saveToSupabase(entry: ApiLogEntry): Promise<void> {
    const db = getSupabase()
    if (!db) return

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db.from("api_logs") as any).insert({
        timestamp: entry.timestamp,
        level: entry.level,
        category: entry.category,
        action: entry.action,
        method: entry.method,
        endpoint: entry.endpoint,
        request_body: entry.requestBody,
        response_body: entry.responseBody,
        status_code: entry.statusCode,
        duration_ms: entry.duration,
        user_id: entry.userId,
        session_id: entry.sessionId,
        ip_address: entry.ip,
        user_agent: entry.userAgent,
        error_message: entry.error,
        metadata: entry.metadata,
      })
    } catch (error) {
      // Silent fail - don't let logging break the app
    }
  }

  // Convenience methods
  debug(category: ApiLogEntry["category"], action: string, metadata?: Record<string, any>) {
    this.log({ level: "debug", category, action, metadata })
  }

  info(category: ApiLogEntry["category"], action: string, metadata?: Record<string, any>) {
    this.log({ level: "info", category, action, metadata })
  }

  warn(category: ApiLogEntry["category"], action: string, metadata?: Record<string, any>) {
    this.log({ level: "warn", category, action, metadata })
  }

  error(category: ApiLogEntry["category"], action: string, error?: string, metadata?: Record<string, any>) {
    this.log({ level: "error", category, action, error, metadata })
  }

  // API request logging
  async logApiRequest(params: {
    method: string
    endpoint: string
    requestBody?: any
    responseBody?: any
    statusCode: number
    duration: number
    userId?: string
    ip?: string
    userAgent?: string
    error?: string
  }) {
    const level: LogLevel = params.statusCode >= 500 ? "error" : 
                           params.statusCode >= 400 ? "warn" : "info"
    
    await this.log({
      level,
      category: "api",
      action: `API Request`,
      ...params,
    })
  }

  // Medici API logging
  async logMediciCall(params: {
    action: string
    endpoint: string
    requestBody?: any
    responseBody?: any
    statusCode: number
    duration: number
    error?: string
  }) {
    const level: LogLevel = params.statusCode >= 500 ? "error" : 
                           params.statusCode >= 400 ? "warn" : "info"
    
    await this.log({
      level,
      category: "medici",
      method: "POST",
      ...params,
    })
  }

  // Get recent logs
  getRecentLogs(count: number = 100, filter?: Partial<ApiLogEntry>): ApiLogEntry[] {
    let logs = [...logBuffer].reverse()
    
    if (filter) {
      logs = logs.filter(log => {
        if (filter.level && log.level !== filter.level) return false
        if (filter.category && log.category !== filter.category) return false
        if (filter.action && !log.action.includes(filter.action)) return false
        return true
      })
    }
    
    return logs.slice(0, count)
  }

  // Clear buffer
  clearBuffer() {
    logBuffer.length = 0
  }
}

// Export singleton instance
export const apiLogger = ApiLogger.getInstance()

// Export helper for timing operations
export function withTiming<T>(operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = Date.now()
  return operation().then(result => ({
    result,
    duration: Date.now() - start
  }))
}
