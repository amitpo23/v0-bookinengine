"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Activity, AlertCircle, CheckCircle, Clock, Eye, Filter, Search, UserCircle, XCircle } from "lucide-react"
import { generateMockActivityLogs } from "@/lib/admin/admin-system-data"
import type { ActivityLog } from "@/types/admin-types"
import { format } from "date-fns"
import { he } from "date-fns/locale"

export function ActivityLogsManagement() {
  const [logs, setLogs] = useState<ActivityLog[]>(generateMockActivityLogs(100))
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | ActivityLog["type"]>("all")
  const [filterUser, setFilterUser] = useState<"all" | string>("all")
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  // Get unique users
  const uniqueUsers = Array.from(new Set(logs.map(log => log.userEmail).filter(Boolean))) as string[]

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || log.type === filterType
    const matchesUser = filterUser === "all" || log.userEmail === filterUser
    return matchesSearch && matchesType && matchesUser
  })

  const getTypeIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "login":
        return <UserCircle className="h-4 w-4 text-green-500" />
      case "logout":
        return <UserCircle className="h-4 w-4 text-gray-500" />
      case "template_access":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "settings_change":
        return <Activity className="h-4 w-4 text-yellow-500" />
      case "booking":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "api_call":
        return <Activity className="h-4 w-4 text-purple-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: ActivityLog["type"]) => {
    switch (type) {
      case "login":
        return "bg-green-500/10 text-green-500"
      case "logout":
        return "bg-gray-500/10 text-gray-500"
      case "template_access":
        return "bg-blue-500/10 text-blue-500"
      case "settings_change":
        return "bg-yellow-500/10 text-yellow-500"
      case "booking":
        return "bg-green-500/10 text-green-500"
      case "api_call":
        return "bg-purple-500/10 text-purple-500"
      case "error":
        return "bg-red-500/10 text-red-500"
    }
  }

  const stats = {
    total: logs.length,
    today: logs.filter(log => {
      const today = new Date()
      return log.timestamp.toDateString() === today.toDateString()
    }).length,
    errors: logs.filter(log => log.type === "error" || !log.success).length,
    logins: logs.filter(log => log.type === "login").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>סה"כ פעולות</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              פעולות היום
            </CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.today}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              שגיאות
            </CardDescription>
            <CardTitle className="text-3xl text-red-500">{stats.errors}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-green-500" />
              כניסות
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.logins}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>יומן פעילות</CardTitle>
          <CardDescription>מעקב אחר כל הפעילות במערכת</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש פעולות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סינון לפי סוג" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסוגים</SelectItem>
                <SelectItem value="login">כניסה</SelectItem>
                <SelectItem value="logout">יציאה</SelectItem>
                <SelectItem value="template_access">גישה לטמפלט</SelectItem>
                <SelectItem value="booking">הזמנה</SelectItem>
                <SelectItem value="settings_change">שינוי הגדרות</SelectItem>
                <SelectItem value="api_call">קריאת API</SelectItem>
                <SelectItem value="error">שגיאה</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="סינון לפי משתמש" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המשתמשים</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>זמן</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>משתמש</TableHead>
                  <TableHead>פעולה</TableHead>
                  <TableHead>טמפלט</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>משך (ms)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <TableRow
                    key={log.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="font-mono text-sm">
                      {format(log.timestamp, "dd/MM HH:mm:ss", { locale: he })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(log.type)} variant="outline">
                        <span className="flex items-center gap-1">
                          {getTypeIcon(log.type)}
                          {log.type}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-xs text-muted-foreground">{log.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.templateName && (
                        <Badge variant="outline" className="text-xs">
                          {log.templateName}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.duration || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>לא נמצאו פעולות התואמות את החיפוש</p>
            </div>
          )}

          {filteredLogs.length > 50 && (
            <div className="text-center text-sm text-muted-foreground">
              מציג 50 תוצאות מתוך {filteredLogs.length}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      {selectedLog && (
        <Card className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>פרטי פעולה</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">זמן:</span>
                <p className="text-muted-foreground">
                  {format(selectedLog.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: he })}
                </p>
              </div>
              <div>
                <span className="font-medium">משתמש:</span>
                <p className="text-muted-foreground">{selectedLog.userEmail}</p>
              </div>
              <div>
                <span className="font-medium">IP:</span>
                <p className="text-muted-foreground font-mono">{selectedLog.ip}</p>
              </div>
              <div>
                <span className="font-medium">סטטוס:</span>
                <p className={selectedLog.success ? "text-green-500" : "text-red-500"}>
                  {selectedLog.success ? "הצלחה" : "כשלון"}
                </p>
              </div>
            </div>
            {selectedLog.errorMessage && (
              <div>
                <span className="font-medium text-red-500">שגיאה:</span>
                <p className="text-red-500 font-mono text-xs">{selectedLog.errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
