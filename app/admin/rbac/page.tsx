"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Activity, Download, RefreshCw } from "lucide-react"

interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  method: string
  path: string
  status: number
  timestamp: string
  error?: string
}

interface Tool {
  key: string
  description: string
  method: string
  path: string
  audit: boolean
}

export default function RBACAdminPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string>("")

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("rbac_token")
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const fetchAuditLogs = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/audit?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.logs || [])
      } else {
        alert("Failed to fetch audit logs: " + response.statusText)
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      alert("Error fetching audit logs")
    } finally {
      setLoading(false)
    }
  }

  const fetchTools = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/tools", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTools(data.tools || [])
      } else {
        alert("Failed to fetch tools: " + response.statusText)
      }
    } catch (error) {
      console.error("Error fetching tools:", error)
      alert("Error fetching tools")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/audit/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        alert("Failed to fetch stats: " + response.statusText)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      alert("Error fetching stats")
    } finally {
      setLoading(false)
    }
  }

  const exportLogs = async (format: "json" | "csv") => {
    if (!token) return

    try {
      const response = await fetch(`/api/admin/audit/export?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs.${format}`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        alert("Failed to export logs: " + response.statusText)
      }
    } catch (error) {
      console.error("Error exporting logs:", error)
      alert("Error exporting logs")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        localStorage.setItem("rbac_token", data.token)
        alert(`Logged in as ${data.user.name} (${data.user.role})`)
      } else {
        const error = await response.json()
        alert("Login failed: " + error.error)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login error")
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
    localStorage.removeItem("rbac_token")
    setAuditLogs([])
    setTools([])
    setStats(null)
  }

  if (!token) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6" />
            <h1 className="text-2xl font-bold">RBAC Login</h1>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">Test Credentials:</p>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <strong>Admin:</strong> admin@example.com / admin123
                </div>
                <div className="p-2 bg-muted rounded">
                  <strong>Booker:</strong> booker@example.com / booker123
                </div>
              </div>
            </div>

            <Button onClick={() => login("admin@example.com", "admin123")} className="w-full">
              Login as Admin
            </Button>

            <Button onClick={() => login("booker@example.com", "booker123")} variant="outline" className="w-full">
              Login as Booker
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-3xl font-bold">RBAC Administration</h1>
        </div>

        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">
            <Activity className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Users className="h-4 w-4 mr-2" />
            Tools & Permissions
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Activity className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Audit Logs</h2>
              <div className="flex gap-2">
                <Button onClick={fetchAuditLogs} disabled={loading} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={() => exportLogs("json")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button onClick={() => exportLogs("csv")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {auditLogs.length === 0 && <p className="text-muted-foreground">No logs found. Click Refresh to load.</p>}

              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.status >= 400 ? "destructive" : "default"}>{log.status}</Badge>
                      <Badge variant="outline">{log.method}</Badge>
                      <span className="font-mono text-sm">{log.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium">{log.resource}</span> · User: {log.userId} · {log.path}
                  </div>
                  {log.error && <div className="mt-1 text-sm text-destructive">{log.error}</div>}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Tools & Permissions</h2>
              <Button onClick={fetchTools} disabled={loading} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="space-y-2">
              {tools.length === 0 && <p className="text-muted-foreground">No tools found. Click Refresh to load.</p>}

              {tools.map((tool) => (
                <div key={tool.key} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>{tool.method}</Badge>
                      <span className="font-mono text-sm">{tool.key}</span>
                      {tool.audit && <Badge variant="outline">Audited</Badge>}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                  <p className="mt-1 text-xs font-mono text-muted-foreground">{tool.path}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Statistics</h2>
              <Button onClick={fetchStats} disabled={loading} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {!stats && <p className="text-muted-foreground">No stats loaded. Click Refresh to load.</p>}

            {stats && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Total Logs</h3>
                  <p className="text-3xl font-bold">{stats.totalLogs}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">By Action</h3>
                  <div className="space-y-1">
                    {Object.entries(stats.byAction).map(([action, count]) => (
                      <div key={action} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{action}</span>
                        <Badge>{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">By User</h3>
                  <div className="space-y-1">
                    {Object.entries(stats.byUser).map(([userId, count]) => (
                      <div key={userId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{userId}</span>
                        <Badge>{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">By Status Code</h3>
                  <div className="space-y-1">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>HTTP {status}</span>
                        <Badge variant={Number.parseInt(status) >= 400 ? "destructive" : "default"}>
                          {count as number}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
