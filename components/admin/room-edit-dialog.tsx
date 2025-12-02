"use client"

import { useState } from "react"
import type { Room, RatePlan } from "@/types/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const SaveIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
)

const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const Settings2Icon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
)

interface RoomEditDialogProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onSave: (room: Room) => void
}

export function RoomEditDialog({ room, isOpen, onClose, onSave }: RoomEditDialogProps) {
  const isNewRoom = !room?.id

  const [formData, setFormData] = useState<Partial<Room>>(
    room || {
      name: "",
      description: "",
      size: 30,
      maxGuests: 2,
      bedType: "מיטה זוגית",
      basePrice: 500,
      available: 5,
      amenities: [],
      images: [],
      ratePlans: [],
    },
  )

  const [newAmenity, setNewAmenity] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (field: keyof Room, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      updateField("amenities", [...(formData.amenities || []), newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (index: number) => {
    updateField(
      "amenities",
      (formData.amenities || []).filter((_, i) => i !== index),
    )
  }

  const addRatePlan = () => {
    const newPlan: RatePlan = {
      id: `plan-${Date.now()}`,
      name: "תוכנית חדשה",
      description: "",
      price: formData.basePrice || 500,
      originalPrice: (formData.basePrice || 500) * 1.2,
      includes: [],
      cancellationPolicy: "ללא ביטול",
      prepayment: "תשלום מלא",
    }
    updateField("ratePlans", [...(formData.ratePlans || []), newPlan])
  }

  const updateRatePlan = (index: number, updates: Partial<RatePlan>) => {
    const plans = [...(formData.ratePlans || [])]
    plans[index] = { ...plans[index], ...updates }
    updateField("ratePlans", plans)
  }

  const removeRatePlan = (index: number) => {
    updateField(
      "ratePlans",
      (formData.ratePlans || []).filter((_, i) => i !== index),
    )
  }

  const addImage = () => {
    const imageUrl = `/placeholder.svg?height=400&width=600&query=hotel room interior luxury`
    updateField("images", [...(formData.images || []), imageUrl])
  }

  const removeImage = (index: number) => {
    updateField(
      "images",
      (formData.images || []).filter((_, i) => i !== index),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const savedRoom: Room = {
      id: room?.id || `room-${Date.now()}`,
      name: formData.name || "",
      description: formData.description || "",
      size: formData.size || 30,
      maxGuests: formData.maxGuests || 2,
      bedType: formData.bedType || "",
      basePrice: formData.basePrice || 500,
      available: formData.available || 1,
      amenities: formData.amenities || [],
      images: formData.images || [],
      ratePlans: formData.ratePlans || [],
    }

    onSave(savedRoom)
    setIsSaving(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">{isNewRoom ? "הוספת חדר חדש" : `עריכת ${room?.name}`}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings2Icon className="h-4 w-4" />
              פרטים בסיסיים
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              תעריפים
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              תמונות
            </TabsTrigger>
            <TabsTrigger value="amenities">שירותים</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם החדר</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="סוויטה דלוקס"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedType">סוג מיטה</Label>
                <Input
                  id="bedType"
                  value={formData.bedType}
                  onChange={(e) => updateField("bedType", e.target.value)}
                  placeholder="מיטה זוגית קינג"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="תיאור מפורט של החדר..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">גודל (מ״ר)</Label>
                <Input
                  id="size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => updateField("size", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">מקסימום אורחים</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => updateField("maxGuests", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">מחיר בסיס (₪)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => updateField("basePrice", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available">חדרים זמינים</Label>
                <Input
                  id="available"
                  type="number"
                  value={formData.available}
                  onChange={(e) => updateField("available", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Rate Plans Tab */}
          <TabsContent value="rates" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">הגדר תוכניות תעריפים שונות עבור חדר זה</p>
              <Button onClick={addRatePlan} size="sm">
                <PlusIcon className="h-4 w-4 ml-2" />
                הוסף תוכנית
              </Button>
            </div>

            <div className="space-y-4">
              {(formData.ratePlans || []).map((plan, index) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Input
                        value={plan.name}
                        onChange={(e) => updateRatePlan(index, { name: e.target.value })}
                        className="font-semibold text-lg border-none p-0 h-auto focus-visible:ring-0"
                        placeholder="שם התוכנית"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRatePlan(index)}
                        className="text-destructive h-8 w-8"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>תיאור</Label>
                      <Textarea
                        value={plan.description}
                        onChange={(e) => updateRatePlan(index, { description: e.target.value })}
                        placeholder="תיאור התוכנית..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>מחיר (₪)</Label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => updateRatePlan(index, { price: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>מחיר מקורי (₪)</Label>
                        <Input
                          type="number"
                          value={plan.originalPrice}
                          onChange={(e) => updateRatePlan(index, { originalPrice: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>מדיניות ביטולים</Label>
                        <Input
                          value={plan.cancellationPolicy}
                          onChange={(e) => updateRatePlan(index, { cancellationPolicy: e.target.value })}
                          placeholder="ביטול חינם עד 24 שעות..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>תשלום מראש</Label>
                        <Input
                          value={plan.prepayment}
                          onChange={(e) => updateRatePlan(index, { prepayment: e.target.value })}
                          placeholder="ללא תשלום מראש"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>כולל (מופרד בפסיקים)</Label>
                      <Input
                        value={(plan.includes || []).join(", ")}
                        onChange={(e) =>
                          updateRatePlan(index, {
                            includes: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="ארוחת בוקר, WiFi חינם, חניה..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(formData.ratePlans || []).length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <DollarSignIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>אין תוכניות תעריפים</p>
                  <p className="text-sm">הוסף תוכנית כדי להציע מחירים שונים</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">הוסף תמונות של החדר (התמונה הראשונה תהיה הראשית)</p>
              <Button onClick={addImage} size="sm">
                <UploadIcon className="h-4 w-4 ml-2" />
                הוסף תמונה
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(formData.images || []).map((image, index) => (
                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`תמונה ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && <Badge className="absolute top-2 right-2">ראשית</Badge>}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {(formData.images || []).length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>אין תמונות</p>
                  <p className="text-sm">הוסף תמונות כדי להציג את החדר</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="הוסף שירות חדש..."
                onKeyDown={(e) => e.key === "Enter" && addAmenity()}
              />
              <Button onClick={addAmenity}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(formData.amenities || []).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                  {amenity}
                  <button onClick={() => removeAmenity(index)} className="mr-2 hover:text-destructive">
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-muted-foreground mb-3">שירותים נפוצים:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "WiFi חינם",
                  "מיזוג אוויר",
                  "מיני בר",
                  "כספת",
                  "טלוויזיה",
                  "מקלחון",
                  "אמבטיה",
                  "מרפסת",
                  "נוף לים",
                  "שירות חדרים",
                ].map((amenity) => (
                  <Button
                    key={amenity}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!(formData.amenities || []).includes(amenity)) {
                        updateField("amenities", [...(formData.amenities || []), amenity])
                      }
                    }}
                    disabled={(formData.amenities || []).includes(amenity)}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin ml-2">◌</span>
                שומר...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 ml-2" />
                {isNewRoom ? "צור חדר" : "שמור שינויים"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
