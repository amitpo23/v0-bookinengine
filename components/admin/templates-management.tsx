"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Settings, Eye, Edit, Trash2, MoreVertical, Plus, Search, Filter, CheckCircle2, XCircle, AlertTriangle, Code } from "lucide-react"
import type { TemplateConfig } from "@/types/admin-types"
import { TEMPLATES_DATA } from "@/lib/admin/admin-system-data"

interface TemplatesManagementProps {
  onTemplateSelect?: (template: TemplateConfig) => void
}

export function TemplatesManagement({ onTemplateSelect }: TemplatesManagementProps) {
  const [templates, setTemplates] = useState<TemplateConfig[]>(TEMPLATES_DATA)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "maintenance">("all")
  const [filterCategory, setFilterCategory] = useState<"all" | "booking" | "showcase" | "chatbot">("all")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || template.status === filterStatus
    const matchesCategory = filterCategory === "all" || template.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleToggleEnabled = (templateId: string) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, enabled: !t.enabled } : t
      )
    )
  }

  const handleStatusChange = (templateId: string, status: TemplateConfig["status"]) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, status } : t
      )
    )
  }

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id))
      setIsDeleteDialogOpen(false)
      setSelectedTemplate(null)
    }
  }

  const getStatusIcon = (status: TemplateConfig["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "development":
        return <Code className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: TemplateConfig["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "inactive":
        return "bg-gray-500/10 text-gray-500"
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500"
      case "development":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  const getCategoryColor = (category: TemplateConfig["category"]) => {
    switch (category) {
      case "booking":
        return "bg-blue-500/10 text-blue-500"
      case "showcase":
        return "bg-purple-500/10 text-purple-500"
      case "chatbot":
        return "bg-pink-500/10 text-pink-500"
      case "admin":
        return "bg-orange-500/10 text-orange-500"
    }
  }

  const stats = {
    total: templates.length,
    active: templates.filter(t => t.status === "active").length,
    inactive: templates.filter(t => t.status === "inactive").length,
    maintenance: templates.filter(t => t.status === "maintenance").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>סה"כ טמפלטים</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              פעילים
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              לא פעילים
            </CardDescription>
            <CardTitle className="text-3xl text-gray-500">{stats.inactive}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              תחזוקה
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-500">{stats.maintenance}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ניהול טמפלטים</CardTitle>
              <CardDescription>צפה ונהל את כל הטמפלטים במערכת</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              טמפלט חדש
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש טמפלטים..."
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
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="active">פעיל</SelectItem>
                <SelectItem value="inactive">לא פעיל</SelectItem>
                <SelectItem value="maintenance">תחזוקה</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סינון לפי קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="booking">הזמנות</SelectItem>
                <SelectItem value="showcase">תצוגה</SelectItem>
                <SelectItem value="chatbot">צ'אטבוט</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>טמפלט</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>גרסה</TableHead>
                  <TableHead>פעיל</TableHead>
                  <TableHead>הרשאות</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.displayName}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category === "booking" && "הזמנות"}
                        {template.category === "showcase" && "תצוגה"}
                        {template.category === "chatbot" && "צ'אטבוט"}
                        {template.category === "admin" && "ניהול"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(template.status)} variant="outline">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(template.status)}
                          {template.status === "active" && "פעיל"}
                          {template.status === "inactive" && "לא פעיל"}
                          {template.status === "maintenance" && "תחזוקה"}
                          {template.status === "development" && "פיתוח"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{template.version}</code>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={template.enabled}
                        onCheckedChange={() => handleToggleEnabled(template.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.allowedRoles.slice(0, 2).map(role => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {template.allowedRoles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.allowedRoles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(template.path, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            צפה
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedTemplate(template)
                            setIsEditDialogOpen(true)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (onTemplateSelect) onTemplateSelect(template)
                          }}>
                            <Settings className="h-4 w-4 mr-2" />
                            הגדרות
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(template.id, "maintenance")}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            העבר לתחזוקה
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>לא נמצאו טמפלטים התואמים את החיפוש</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת טמפלט</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך למחוק את הטמפלט "{selectedTemplate?.displayName}"?
              פעולה זו לא ניתנת לביטול.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              מחק
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
