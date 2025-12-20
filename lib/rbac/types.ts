import type { Role, Scope, Capability } from "./config"

export interface User {
  id: string
  email: string
  name: string
  role: Role
  flags: {
    sql_write_enabled?: boolean
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  method: string
  path: string
  status: number
  ip?: string
  userAgent?: string
  requestBody?: any
  responseBody?: any
  error?: string
  timestamp: Date
}

export interface AuthContext {
  user: User
  scopes: Scope[]
  capabilities: Capability[]
}

export interface PermissionCheckResult {
  allowed: boolean
  reason?: string
  missing_scopes?: Scope[]
}
