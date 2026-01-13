"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Download,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import type { AuditLogEntry } from '@/lib/security/audit-log'

interface AuditLogsViewerProps {
  initialLogs?: AuditLogEntry[]
}

export function AuditLogsViewer({ initialLogs = [] }: AuditLogsViewerProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs)
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(initialLogs)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [successFilter, setSuccessFilter] = useState<string>('all')

  // טען לוגים מהשרת
  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/audit-logs')
      const data = await res.json()
      setLogs(data.logs || [])
      setFilteredLogs(data.logs || [])
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // פילטור לוגים
  useEffect(() => {
    let filtered = [...logs]

    // חיפוש טקסט
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      )
    }

    // פילטר חומרה
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter)
    }

    // פילטר action
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    // פילטר הצלחה/כישלון
    if (successFilter === 'success') {
      filtered = filtered.filter(log => log.success === true)
    } else if (successFilter === 'failed') {
      filtered = filtered.filter(log => log.success === false)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, severityFilter, actionFilter, successFilter])

  // ייצוא ל-CSV
  const exportToCSV = () => {
    const headers = ['תאריך', 'משתמש', 'פעולה', 'חומרה', 'משאב', 'IP', 'הצלחה', 'הודעת שגיאה']
    const rows = filteredLogs.map(log => [
      format(log.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: he }),
      log.userEmail,
      log.action,
      log.severity,
      log.resource,
      log.ipAddress,
      log.success ? 'כן' : 'לא',
      log.errorMessage || '-'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  // קבלת צבע לפי חומרה
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive'
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'default'
      case 'LOW': return 'secondary'
      case 'INFO': return 'outline'
      default: return 'outline'
    }
  }

  // קבלת אייקון לפי חומרה
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />
      case 'MEDIUM': return <Shield className="w-4 h-4" />
      case 'LOW': return <Info className="w-4 h-4" />
      case 'INFO': return <Info className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">לוג אירועי אבטחה</CardTitle>
              <CardDescription>תיעוד מלא לפי תיקון 14 לחוק הגנת הפרטיות</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadLogs} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                רענן
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 ml-2" />
                ייצא ל-CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* חיפוש */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="חיפוש משתמש, IP, פעולה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* פילטר חומרה */}
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="חומרה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל החומרות</SelectItem>
                <SelectItem value="CRITICAL">קריטי</SelectItem>
                <SelectItem value="HIGH">גבוה</SelectItem>
                <SelectItem value="MEDIUM">בינוני</SelectItem>
                <SelectItem value="LOW">נמוך</SelectItem>
                <SelectItem value="INFO">מידע</SelectItem>
              </SelectContent>
            </Select>

            {/* פילטר פעולה */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סוג פעולה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הפעולות</SelectItem>
                <SelectItem value="LOGIN">כניסה</SelectItem>
                <SelectItem value="LOGIN_FAILED">כניסה נכשלה</SelectItem>
                <SelectItem value="LOGOUT">יציאה</SelectItem>
                <SelectItem value="DATA_EXPORTED">ייצוא מידע</SelectItem>
                <SelectItem value="USER_DELETED">מחיקת משתמש</SelectItem>
                <SelectItem value="UNAUTHORIZED_ACCESS">גישה לא מורשית</SelectItem>
              </SelectContent>
            </Select>

            {/* פילטר הצלחה */}
            <Select value={successFilter} onValueChange={setSuccessFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="success">הצליח</SelectItem>
                <SelectItem value="failed">נכשל</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-sm text-gray-500">סך אירועים</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.severity === 'CRITICAL').length}
            </div>
            <p className="text-sm text-gray-500">קריטיים</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {filteredLogs.filter(l => !l.success).length}
            </div>
            <p className="text-sm text-gray-500">כישלונות</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(l => l.success).length}
            </div>
            <p className="text-sm text-gray-500">הצלחות</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>לא נמצאו אירועים</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(log.severity)} className="flex items-center gap-1">
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </Badge>
                      <span className="font-mono text-sm">{log.action}</span>
                      {log.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: he })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">משתמש:</span>
                      <p className="font-medium">{log.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">משאב:</span>
                      <p className="font-mono">{log.resource}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">IP:</span>
                      <p className="font-mono">{log.ipAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">User Agent:</span>
                      <p className="font-mono text-xs truncate">{log.userAgent}</p>
                    </div>
                  </div>

                  {log.errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <strong>שגיאה:</strong> {log.errorMessage}
                    </div>
                  )}

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                        פרטים נוספים
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
