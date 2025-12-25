"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Copy, Search, Tag, Calendar, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

interface PromoCode {
  id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_purchase_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  applicable_templates: string[] | null
}

export function PromoCodesManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 10,
    min_purchase_amount: "",
    max_discount_amount: "",
    usage_limit: "",
    valid_from: format(new Date(), "yyyy-MM-dd"),
    valid_until: "",
    is_active: true,
    applicable_templates: [] as string[],
  })

  useEffect(() => {
    loadPromoCodes()
  }, [])

  const loadPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPromoCodes(data || [])
    } catch (error) {
      console.error("Error loading promo codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_purchase_amount: formData.min_purchase_amount
          ? parseFloat(formData.min_purchase_amount)
          : null,
        max_discount_amount: formData.max_discount_amount
          ? parseFloat(formData.max_discount_amount)
          : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: formData.valid_until
          ? new Date(formData.valid_until).toISOString()
          : null,
        is_active: formData.is_active,
        applicable_templates:
          formData.applicable_templates.length > 0
            ? formData.applicable_templates
            : null,
      }

      if (editingCode) {
        const { error } = await supabase
          .from("promo_codes")
          .update(payload)
          .eq("id", editingCode.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("promo_codes").insert(payload)
        if (error) throw error
      }

      await loadPromoCodes()
      setShowDialog(false)
      resetForm()
    } catch (error: any) {
      console.error("Error saving promo code:", error)
      alert("שגיאה בשמירת קוד פרומו: " + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק קוד פרומו זה?")) return

    try {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id)
      if (error) throw error
      await loadPromoCodes()
    } catch (error: any) {
      console.error("Error deleting promo code:", error)
      alert("שגיאה במחיקת קוד פרומו")
    }
  }

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      description: code.description,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_purchase_amount: code.min_purchase_amount?.toString() || "",
      max_discount_amount: code.max_discount_amount?.toString() || "",
      usage_limit: code.usage_limit?.toString() || "",
      valid_from: format(new Date(code.valid_from), "yyyy-MM-dd"),
      valid_until: code.valid_until
        ? format(new Date(code.valid_until), "yyyy-MM-dd")
        : "",
      is_active: code.is_active,
      applicable_templates: code.applicable_templates || [],
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setEditingCode(null)
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_purchase_amount: "",
      max_discount_amount: "",
      usage_limit: "",
      valid_from: format(new Date(), "yyyy-MM-dd"),
      valid_until: "",
      is_active: true,
      applicable_templates: [],
    })
  }

  const filteredCodes = promoCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`קוד ${code} הועתק ללוח`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            קודי פרומו
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            ניהול קודי הנחה ומבצעים
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowDialog(true)
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          קוד פרומו חדש
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לפי קוד או תיאור..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">סה"כ קודים</div>
          <div className="text-2xl font-bold mt-1">{promoCodes.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">קודים פעילים</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {promoCodes.filter((c) => c.is_active).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">סה"כ שימושים</div>
          <div className="text-2xl font-bold mt-1">
            {promoCodes.reduce((sum, c) => sum + c.usage_count, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">פגי תוקף</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {
              promoCodes.filter(
                (c) => c.valid_until && new Date(c.valid_until) < new Date()
              ).length
            }
          </div>
        </Card>
      </div>

      {/* Promo Codes List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">טוען...</div>
        ) : filteredCodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "לא נמצאו תוצאות" : "אין קודי פרומו עדיין"}
          </div>
        ) : (
          filteredCodes.map((code) => {
            const isExpired = code.valid_until && new Date(code.valid_until) < new Date()
            const usageLimitReached = code.usage_limit && code.usage_count >= code.usage_limit

            return (
              <Card key={code.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-lg font-bold bg-muted px-3 py-1 rounded">
                        {code.code}
                      </code>
                      <Badge variant={code.is_active && !isExpired ? "default" : "secondary"}>
                        {!code.is_active ? "לא פעיל" : isExpired ? "פג תוקף" : "פעיל"}
                      </Badge>
                      {code.discount_type === "percentage" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {code.discount_value}% הנחה
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {code.discount_value}₪ הנחה
                        </Badge>
                      )}
                      {usageLimitReached && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          מגבלה הושגה
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">{code.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(code.valid_from), "dd/MM/yyyy")}
                        {code.valid_until && ` - ${format(new Date(code.valid_until), "dd/MM/yyyy")}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        שימושים: {code.usage_count}
                        {code.usage_limit && ` / ${code.usage_limit}`}
                      </span>
                      {code.min_purchase_amount && (
                        <span>מינימום: {code.min_purchase_amount}₪</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(code.code)}
                      title="העתק קוד"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(code)}
                      title="ערוך"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                      title="מחק"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? "עריכת קוד פרומו" : "קוד פרומו חדש"}
            </DialogTitle>
            <DialogDescription>
              הזן את פרטי קוד הפרומו ותנאי השימוש
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>קוד *</Label>
                <Input
                  placeholder="SUMMER20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label>סוג הנחה *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">אחוז (%)</SelectItem>
                    <SelectItem value="fixed">סכום קבוע (₪)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>תיאור *</Label>
              <Textarea
                placeholder="הנחת קיץ 20%"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  ערך הנחה * ({formData.discount_type === "percentage" ? "%" : "₪"})
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>מגבלת שימושים (אופציונלי)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ללא הגבלה"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>סכום קנייה מינימלי (₪)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.min_purchase_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, min_purchase_amount: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>הנחה מקסימלית (₪)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ללא הגבלה"
                  value={formData.max_discount_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, max_discount_amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>תוקף מ- *</Label>
                <Input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>תוקף עד (אופציונלי)</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label>קוד פעיל</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                {editingCode ? "עדכן" : "צור קוד פרומו"}
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
