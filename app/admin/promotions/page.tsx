"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Promotion } from "@/lib/promotions/types"

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion>>({})

  useEffect(() => {
    loadPromotions()
  }, [])

  async function loadPromotions() {
    const response = await fetch("/api/admin/promotions")
    const data = await response.json()
    if (data.success) {
      setPromotions(data.data)
    }
  }

  async function savePromotion() {
    const method = currentPromotion.id ? "PUT" : "POST"
    const response = await fetch("/api/admin/promotions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPromotion),
    })

    if (response.ok) {
      await loadPromotions()
      setIsEditing(false)
      setCurrentPromotion({})
    }
  }

  async function deletePromotion(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המבצע?")) return

    const response = await fetch("/api/admin/promotions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      await loadPromotions()
    }
  }

  async function toggleActive(promotion: Promotion) {
    await fetch("/api/admin/promotions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: promotion.id, active: !promotion.active }),
    })
    await loadPromotions()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">ניהול מבצעים</h1>
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">מבצע חדש</span>
          </Button>
        </div>

        {isEditing && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{currentPromotion.id ? "עריכת מבצע" : "מבצע חדש"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">כותרת</Label>
                <Input
                  id="title"
                  value={currentPromotion.title || ""}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="id">קוד מבצע</Label>
                <Input
                  id="id"
                  value={currentPromotion.id || ""}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, id: e.target.value })}
                  disabled={!!currentPromotion.id}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  value={currentPromotion.description || ""}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="discountType">סוג הנחה</Label>
                <Select
                  value={currentPromotion.discountType || "percentage"}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setCurrentPromotion({ ...currentPromotion, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">אחוזים</SelectItem>
                    <SelectItem value="fixed">סכום קבוע</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  ערך הנחה ({currentPromotion.discountType === "percentage" ? "%" : "₪"})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={currentPromotion.discountValue || ""}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, discountValue: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="minNights">מינימום לילות</Label>
                <Input
                  id="minNights"
                  type="number"
                  value={currentPromotion.minNights || ""}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, minNights: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="validFrom">תקף מתאריך</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={currentPromotion.validFrom?.split("T")[0] || ""}
                  onChange={(e) =>
                    setCurrentPromotion({ ...currentPromotion, validFrom: new Date(e.target.value).toISOString() })
                  }
                />
              </div>

              <div>
                <Label htmlFor="validTo">תקף עד תאריך</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={currentPromotion.validTo?.split("T")[0] || ""}
                  onChange={(e) =>
                    setCurrentPromotion({ ...currentPromotion, validTo: new Date(e.target.value).toISOString() })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mobileOnly"
                  checked={currentPromotion.mobileOnly || false}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, mobileOnly: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="mobileOnly">מובייל בלבד</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={currentPromotion.active !== false}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="active">פעיל</Label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={savePromotion}>שמור</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setCurrentPromotion({})
                }}
              >
                ביטול
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{promotion.title}</h3>
                <button onClick={() => toggleActive(promotion)}>
                  {promotion.active ? (
                    <ToggleRight className="w-6 h-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{promotion.description}</p>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-bold text-orange-600">
                  {promotion.discountType === "percentage"
                    ? `${promotion.discountValue}% הנחה`
                    : `${promotion.discountValue}₪ הנחה`}
                </span>
                {promotion.mobileOnly && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">מובייל בלבד</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentPromotion(promotion)
                    setIsEditing(true)
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deletePromotion(promotion.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
