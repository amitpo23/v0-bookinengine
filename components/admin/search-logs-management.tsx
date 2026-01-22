"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Search,
  Download,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"
import { he } from "date-fns/locale"

interface SearchLog {
  id: string
  hotelName?: string
  city?: string
  dateFrom?: string
  dateTo?: string
  adults?: number
  children?: number
  resultsCount: number
  durationMs?: number
  success: boolean
  errorMessage?: string
  source?: string
  createdAt: string
  userId?: string
  ipAddress?: string
  metadata?: any
}

interface SearchStats {
  total: number
  successful: number
  failed: number
  successRate: string
  bySource?: Record<string, number>
  byDestination?: Record<string, number>
}

export function SearchLogsManagement() {
  const [logs, setLogs] = useState<SearchLog[]>([])
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<SearchLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [searchFilter, setSearchFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchFilter) params.append("search", searchFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (sourceFilter !== "all") params.append("source", sourceFilter)
      if (dateFrom) params.append("dateFrom", dateFrom)
      if (dateTo) params.append("dateTo", dateTo)

      const response = await fetch(`/api/admin/search-logs?${params}`)
      if (!response.ok) throw new Error("Failed to load logs")
      const data = await response.json()
      setLogs(data.logs || [])
      setStats(data.stats)
    } catch (error) {
      console.error("Error loading logs:", error)
      toast.error("Failed to load search logs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const csv = [
        ["Date", "Destination", "Hotel", "Check-in", "Check-out", "Guests", "Results", "Success", "Source", "Duration (ms)"].join(","),
        ...logs.map(log =>
          [
            format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: he }),
            log.city || "-",
            log.hotelName || "-",
            log.dateFrom || "-",
            log.dateTo || "-",
            `${log.adults || 2}A ${log.children || 0}C`,
            log.resultsCount,
            log.success ? "✓" : "✗",
            log.source || "-",
            log.durationMs || "-",
          ].join(",")
        ),
      ].join("\n")

      const element = document.createElement("a")
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv))
      element.setAttribute("download", `search-logs-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success("Logs exported successfully")
    } catch (error) {
      console.error("Error exporting logs:", error)
      toast.error("Failed to export logs")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return
    try {
      const response = await fetch(`/api/admin/search-logs/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete log")
      setLogs(logs.filter(log => log.id !== id))
      toast.success("Log deleted successfully")
    } catch (error) {
      console.error("Error deleting log:", error)
      toast.error("Failed to delete log")
    }
  }

  useEffect(() => {
    loadLogs()
  }, [searchFilter, statusFilter, sourceFilter, dateFrom, dateTo])

  const filteredLogs = logs.filter(log => {
    if (searchFilter && !log.city?.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && (statusFilter === "success") !== log.success) {
      return false
    }
    if (sourceFilter !== "all" && log.source !== sourceFilter) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                סה"כ חיפושים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                מ-{dateFrom || "התחלה"} עד {dateTo || "היום"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                חיפושים מוצלחים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.successful}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stats.successRate}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                חיפושים נכשלו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.failed}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {((stats.failed / stats.total) * 100 || 0).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                מקורות חיפוש
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.bySource && Object.entries(stats.bySource).map(([source, count]) => (
                  <div key={source} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{source}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>סינון חיפושים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="חיפוש לפי עיר..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="success">מוצלח</SelectItem>
                <SelectItem value="failed">נכשל</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="מקור" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="chat">צ'אט</SelectItem>
                <SelectItem value="widget">וידג'ט</SelectItem>
                <SelectItem value="template">תבנית</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="מתאריך"
            />

            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="עד תאריך"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={loadLogs} disabled={isLoading}>
              {isLoading ? "טוען..." : "רענן"}
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              ייצוא ל-CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>יומן חיפושים</CardTitle>
          <CardDescription>
            {filteredLogs.length} מתוך {logs.length} חיפושים
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">טוען...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              לא נמצאו חיפושים
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium">תאריך</th>
                    <th className="text-right py-3 px-4 font-medium">יעד</th>
                    <th className="text-right py-3 px-4 font-medium">תאריכים</th>
                    <th className="text-right py-3 px-4 font-medium">אורחים</th>
                    <th className="text-right py-3 px-4 font-medium">תוצאות</th>
                    <th className="text-right py-3 px-4 font-medium">סטטוס</th>
                    <th className="text-right py-3 px-4 font-medium">מקור</th>
                    <th className="text-right py-3 px-4 font-medium">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {format(new Date(log.createdAt), "dd/MM HH:mm", { locale: he })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{log.city || log.hotelName || "-"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {log.dateFrom && log.dateTo
                          ? `${format(new Date(log.dateFrom), "dd/MM")} - ${format(new Date(log.dateTo), "dd/MM")}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {log.adults || 2}A {log.children || 0}C
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={log.resultsCount > 0 ? "default" : "secondary"}>
                          {log.resultsCount} תוצאות
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={log.success ? "default" : "destructive"}
                          className={log.success ? "bg-green-600" : ""}
                        >
                          {log.success ? "✓ מוצלח" : "✗ נכשל"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <Badge variant="outline" className="capitalize">
                          {log.source || "unknown"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log)
                              setShowDetails(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>פרטי חיפוש</DialogTitle>
            <DialogDescription>
              {selectedLog && format(new Date(selectedLog.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: he })}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">עיר</label>
                  <p className="mt-1">{selectedLog.city || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">מלון</label>
                  <p className="mt-1">{selectedLog.hotelName || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Check-in</label>
                  <p className="mt-1">{selectedLog.dateFrom || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Check-out</label>
                  <p className="mt-1">{selectedLog.dateTo || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">אורחים</label>
                  <p className="mt-1">{selectedLog.adults || 2} מבוגרים, {selectedLog.children || 0} ילדים</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">תוצאות</label>
                  <p className="mt-1">{selectedLog.resultsCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">מקור</label>
                  <p className="mt-1 capitalize">{selectedLog.source || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">משך (ms)</label>
                  <p className="mt-1">{selectedLog.durationMs || "-"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">סטטוס</label>
                <div className="mt-1">
                  <Badge
                    variant={selectedLog.success ? "default" : "destructive"}
                    className={selectedLog.success ? "bg-green-600" : ""}
                  >
                    {selectedLog.success ? "✓ מוצלח" : "✗ נכשל"}
                  </Badge>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                  <label className="text-sm font-medium text-red-700 dark:text-red-400">
                    הודעת שגיאה
                  </label>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {selectedLog.errorMessage}
                  </p>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">מטא דטה נוספת</label>
                  <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                {selectedLog.userId && (
                  <div>
                    <label className="font-medium">User ID</label>
                    <p>{selectedLog.userId}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <label className="font-medium">IP Address</label>
                    <p>{selectedLog.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
