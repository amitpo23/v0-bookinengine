import type { User } from "./types"

/**
 * Simple in-memory session store (for demo)
 * In production, use Redis, database, or JWT
 */
class SessionStore {
  private sessions: Map<string, User> = new Map()

  set(sessionId: string, user: User): void {
    this.sessions.set(sessionId, user)
  }

  get(sessionId: string): User | undefined {
    return this.sessions.get(sessionId)
  }

  delete(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  clear(): void {
    this.sessions.clear()
  }
}

export const sessionStore = new SessionStore()

/**
 * Generate a simple session ID (use crypto.randomUUID() in production)
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

/**
 * Mock user authentication (replace with your auth logic)
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Mock authentication - replace with your database query
  if (email === "admin@example.com" && password === "admin123") {
    return {
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      flags: { sql_write_enabled: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  if (email === "booker@example.com" && password === "booker123") {
    return {
      id: "booker-1",
      email: "booker@example.com",
      name: "Booker User",
      role: "booker",
      flags: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  return null
}
