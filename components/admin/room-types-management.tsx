"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, ImageIcon, Bed, Users, Maximize, Eye, GripVertical, Upload, X } from "lucide-react"

interface RoomTypeConfig {
  id: string
  name: string
  nameHe: string
  category: string
  description: string
  descriptionHe: string
  images: string[]
  size: number
  maxOccupancy: number
  bedType: string
  view: string
  amenities: string[]
  isActive: boolean
  sortOrder: number
}

const defaultRoomTypes: RoomTypeConfig[] = [
  {
    id: "standard",
    name: "Standard Room",
    nameHe: "חדר סטנדרט",
    category: "standard",
    description: "Comfortable room with all essential amenities",
    descriptionHe: "חדר נוח עם כל המתקנים הבסיסיים",
    images: ["/standard-hotel-room.png"],
    size: 25,
    maxOccupancy: 2,
    bedType: "double",
    view: "city",
    amenities: ["wifi", "ac", "tv", "safe"],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "superior",
    name: "Superior Room",
    nameHe: "חדר סופיריור",
    category: "superior",
    description: "Spacious room with premium amenities and views",
    descriptionHe: "חדר מרווח עם מתקנים יוקרתיים ונוף",
    images: ["/superior-hotel-room-sea-view.jpg"],
    size: 32,
    maxOccupancy: 2,
    bedType: "king",
    view: "sea",
    amenities: ["wifi", "ac", "tv", "safe", "minibar", "balcony"],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    nameHe: "חדר דה-לוקס",
    category: "deluxe",
    description: "Luxurious room with premium furnishings",
    descriptionHe: "חדר יוקרתי עם ריהוט פרימיום",
    images: ["/deluxe-luxury-hotel-room.jpg"],
    size: 40,
    maxOccupancy: 3,
    bedType: "king",
    view: "sea",
    amenities: ["wifi", "ac", "tv", "safe", "minibar", "balcony", "bathtub", "espresso"],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "suite",
    name: "Suite",
    nameHe: "סוויטה",
    category: "suite",
    description: "Elegant suite with separate living area",
    descriptionHe: "סוויטה אלגנטית עם סלון נפרד",
    images: ["/luxury-hotel-suite-living-room.jpg"],
    size: 55,
    maxOccupancy: 4,
    bedType: "king",
    view: "panoramic",
    amenities: ["wifi", "ac", "tv", "safe", "minibar", "balcony", "bathtub", "espresso", "living-room", "dining"],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "family",
    name: "Family Room",
    nameHe: "חדר משפחה",
    category: "family",
    description: "Spacious room perfect for families",
    descriptionHe: "חדר מרווח מושלם למשפחות",
    images: ["/family-hotel-room-two-beds.jpg"],
    size: 45,
    maxOccupancy: 5,
    bedType: "twin+sofa",
    view: "garden",
    amenities: ["wifi", "ac", "tv", "safe", "minibar", "connecting-rooms"],
    isActive: true,
    sortOrder: 5,
  },
]

const amenityOptions = [
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "ac", label: "מיזוג אוויר", icon: "❄️" },
  { id: "tv", label: "טלוויזיה", icon: "📺" },
  { id: "safe", label: "כספת", icon: "🔐" },
  { id: "minibar", label: "מיני בר", icon: "🍷" },
  { id: "balcony", label: "מרפסת", icon: "🌅" },
  { id: "bathtub", label: "אמבטיה", icon: "🛁" },
  { id: "espresso", label: "מכונת קפה", icon: "☕" },
  { id: "living-room", label: "סלון", icon: "🛋️" },
  { id: "dining", label: "פינת אוכל", icon: "🍽️" },
  { id: "connecting-rooms", label: "חדרים מחוברים", icon: "🚪" },
  { id: "kitchen", label: "מטבחון", icon: "🍳" },
]

const bedTypeOptions = [
  { id: "single", label: "מיטה יחיד" },
  { id: "double", label: "מיטה זוגית" },
  { id: "twin", label: "שתי מיטות" },
  { id: "king", label: "מיטת קינג" },
  { id: "queen", label: "מיטת קווין" },
  { id: "twin+sofa", label: "שתי מיטות + ספה" },
]

const viewOptions = [
  { id: "city", label: "נוף לעיר" },
  { id: "sea", label: "נוף לים" },
  { id: "garden", label: "נוף לגן" },
  { id: "pool", label: "נוף לבריכה" },
  { id: "mountain", label: "נוף להרים" },
  { id: "panoramic", label: "נוף פנורמי" },
]

export function RoomTypesManagement() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeConfig[]>(defaultRoomTypes)
  const [editingRoom, setEditingRoom] = useState<RoomTypeConfig | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveRoom = (room: RoomTypeConfig) => {
    if (editingRoom) {
      setRoomTypes(roomTypes.map((r) => (r.id === room.id ? room : r)))
    } else {
      setRoomTypes([...roomTypes, { ...room, id: `room-${Date.now()}`, sortOrder: roomTypes.length + 1 }])
    }
    setEditingRoom(null)
    setIsDialogOpen(false)
  }

  const handleDeleteRoom = (id: string) => {
    setRoomTypes(roomTypes.filter((r) => r.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setRoomTypes(roomTypes.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ניהול סוגי חדרים</h2>
          <p className="text-muted-foreground">הגדר תמונות, תיאורים ומתקנים לכל סוג חדר</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingRoom(null)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Plus className="h-4 w-4 ml-2" />
              הוסף סוג חדר
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoom ? "עריכת סוג חדר" : "הוספת סוג חדר חדש"}</DialogTitle>
            </DialogHeader>
            <RoomTypeEditor room={editingRoom} onSave={handleSaveRoom} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Room Types Grid */}
      <div className="grid gap-4">
        {roomTypes.map((room, index) => (
          <Card key={room.id} className={`overflow-hidden transition-all ${!room.isActive ? "opacity-50" : ""}`}>
            <div className="flex">
              {/* Image Section */}
              <div className="w-64 h-48 relative bg-muted flex-shrink-0">
                {room.images[0] ? (
                  <img
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.nameHe}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {room.images.length} תמונות
                </div>
                <div className="absolute top-2 left-2 cursor-grab">
                  <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{room.nameHe}</h3>
                    <p className="text-sm text-muted-foreground">{room.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={room.isActive} onCheckedChange={() => handleToggleActive(room.id)} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingRoom(room)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{room.descriptionHe}</p>

                {/* Room Details */}
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <span>{room.size} מ"ר</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>עד {room.maxOccupancy} אורחים</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{bedTypeOptions.find((b) => b.id === room.bedType)?.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{viewOptions.find((v) => v.id === room.view)?.label}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {room.amenities.slice(0, 6).map((amenityId) => {
                    const amenity = amenityOptions.find((a) => a.id === amenityId)
                    return amenity ? (
                      <span key={amenityId} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {amenity.icon} {amenity.label}
                      </span>
                    ) : null
                  })}
                  {room.amenities.length > 6 && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">+{room.amenities.length - 6}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RoomTypeEditor({
  room,
  onSave,
  onCancel,
}: {
  room: RoomTypeConfig | null
  onSave: (room: RoomTypeConfig) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<RoomTypeConfig>(
    room || {
      id: "",
      name: "",
      nameHe: "",
      category: "standard",
      description: "",
      descriptionHe: "",
      images: [],
      size: 25,
      maxOccupancy: 2,
      bedType: "double",
      view: "city",
      amenities: [],
      isActive: true,
      sortOrder: 0,
    },
  )

  const handleImageUpload = () => {
    // Simulate image upload - in production this would upload to storage
    const newImage = `/placeholder.svg?height=400&width=600&query=${formData.nameHe || "hotel room"}`
    setFormData({ ...formData, images: [...formData.images, newImage] })
  }

  const handleRemoveImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  const toggleAmenity = (amenityId: string) => {
    if (formData.amenities.includes(amenityId)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== amenityId) })
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityId] })
    }
  }

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">פרטים בסיסיים</TabsTrigger>
        <TabsTrigger value="images">תמונות</TabsTrigger>
        <TabsTrigger value="amenities">מתקנים</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>שם בעברית</Label>
            <Input
              value={formData.nameHe}
              onChange={(e) => setFormData({ ...formData, nameHe: e.target.value })}
              placeholder="חדר משפחה"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>שם באנגלית</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Family Room"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>תיאור בעברית</Label>
          <Textarea
            value={formData.descriptionHe}
            onChange={(e) => setFormData({ ...formData, descriptionHe: e.target.value })}
            placeholder="חדר מרווח מושלם למשפחות..."
            dir="rtl"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>תיאור באנגלית</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Spacious room perfect for families..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>גודל (מ"ר)</Label>
            <Input
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>תפוסה מקסימלית</Label>
            <Input
              type="number"
              value={formData.maxOccupancy}
              onChange={(e) => setFormData({ ...formData, maxOccupancy: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>סוג מיטה</Label>
            <Select value={formData.bedType} onValueChange={(v) => setFormData({ ...formData, bedType: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bedTypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>נוף</Label>
            <Select value={formData.view} onValueChange={(v) => setFormData({ ...formData, view: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="images" className="space-y-4 mt-4">
        <div className="grid grid-cols-3 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              <img
                src={image || "/placeholder.svg"}
                alt={`תמונה ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                  תמונה ראשית
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleImageUpload}
            className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">העלה תמונה</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          העלה תמונות באיכות גבוהה (מומלץ 1200x800 פיקסלים). התמונה הראשונה תהיה התמונה הראשית.
        </p>
      </TabsContent>

      <TabsContent value="amenities" className="space-y-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          {amenityOptions.map((amenity) => (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                formData.amenities.includes(amenity.id)
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700"
                  : "bg-muted/50 border-transparent hover:border-muted-foreground/25"
              }`}
            >
              <span className="text-xl">{amenity.icon}</span>
              <span className="text-sm">{amenity.label}</span>
            </button>
          ))}
        </div>
      </TabsContent>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          ביטול
        </Button>
        <Button
          onClick={() => onSave(formData)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {room ? "עדכן" : "הוסף"} סוג חדר
        </Button>
      </div>
    </Tabs>
  )
}

// Export the default room types for use in other components
export { defaultRoomTypes, amenityOptions, bedTypeOptions, viewOptions }
export type { RoomTypeConfig }
