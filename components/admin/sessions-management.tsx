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
import { Activity, AlertCircle, CheckCircle2, Clock, Eye, Monitor, Search, UserX, Users } from "lucide-react"
import { generateMockSessions } from "@/lib/admin/admin-system-data"
import type { UserSession } from "@/types/admin-types"
import { format, formatDistanceToNow } from "date-fns"
import { he } from "date-fns/locale"

export function SessionsManagement() {
  const [sessions, setSessions] = useState<UserSession[]>(generateMockSessions(50))
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.ip.includes(searchQuery)
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "active" && session.active) ||
                         (filterStatus === "inactive" && !session.active)
    return matchesSearch && matchesStatus
  })

  const handleTerminateSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, active: false, logoutTime: new Date(), sessionDuration: Date.now() - s.loginTime.getTime() }
          : s
      )
    )
  }

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.active).length,
    todayLogins: sessions.filter(s => {
      const today = new Date()
      return s.loginTime.toDateString() === today.toDateString()
    }).length,
    uniqueUsers: new Set(sessions.map(s => s.userId)).size,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>סה"כ סשנים</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              סשנים פעילים
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              כניסות היום
            </CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.todayLogins}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              משתמשים ייחודיים
            </CardDescription>
            <CardTitle className="text-3xl text-purple-500">{stats.uniqueUsers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>ניהול כניסות</CardTitle>
          <CardDescription>מעקב אחר סשנים פעילים והיסטוריה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש משתמש או IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סינון לפי סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסשנים</SelectItem>
                <SelectItem value="active">פעיל</SelectItem>
                <SelectItem value="inactive">לא פעיל</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sessions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>משתמש</TableHead>
                  <TableHead>תפקיד</TableHead>
                  <TableHead>כניסה</TableHead>
                  <TableHead>פעילות אחרונה</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>צפיות/פעולות</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{session.userName}</div>
                        <div className="text-xs text-muted-foreground">{session.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {session.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        {format(session.loginTime, "dd/MM HH:mm", { locale: he })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(session.loginTime, { locale: he, addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(session.lastActivity, { locale: he, addSuffix: true })}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {session.ip}
                    </TableCell>
                    <TableCell>
                      {session.active ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <Activity className="h-3 w-3 mr-1" />
                          פעיל
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-500">
                          לא פעיל
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {session.pageViews}
                        <span className="text-muted-foreground">/</span>
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        {session.actionsPerformed}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTerminateSession(session.id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          נתק
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>לא נמצאו סשנים התואמים את החיפוש</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
