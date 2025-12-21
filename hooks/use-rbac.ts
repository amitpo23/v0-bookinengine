"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "booker"
}

interface Tool {
  key: string
  description: string
  method: string
  path: string
}

export function useRBAC() {
  const [token, setToken] = useState<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem("rbac_token")
    if (savedToken) {
      setToken(savedToken)
      fetchUserTools(savedToken)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("rbac_token", data.token)
        await fetchUserTools(data.token)
        return { success: true, user: data.user }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    setToken("")
    setUser(null)
    setTools([])
    localStorage.removeItem("rbac_token")
  }

  const fetchUserTools = async (authToken: string) => {
    try {
      const response = await fetch("/api/tools", {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setTools(data.tools)
      }
    } catch (error) {
      console.error("Error fetching tools:", error)
    }
  }

  const hasAccess = (endpointKey: string) => {
    return tools.some((tool) => tool.key === endpointKey)
  }

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }

    return fetch(url, { ...options, headers })
  }

  return {
    token,
    user,
    tools,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    hasAccess,
    apiCall,
  }
}
