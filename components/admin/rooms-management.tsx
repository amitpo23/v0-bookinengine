"use client"

import { useState } from "react"
import type { Room } from "@/types/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RoomEditDialog } from "./room-edit-dialog"

const BedIcon = ({ className }: { className?: string }) => (
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
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MaximizeIcon = ({ className }: { className?: string }) => (
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
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
)

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

const EditIcon = ({ className }: { className?: string }) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
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

interface RoomsManagementProps {
  rooms: Room[]
}

export function RoomsManagement({ rooms: initialRooms }: RoomsManagementProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null)

  const filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddRoom = () => {
    setEditingRoom(null)
    setIsDialogOpen(true)
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }

  const handleSaveRoom = (room: Room) => {
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)))
    } else {
      setRooms((prev) => [...prev, room])
    }
    setIsDialogOpen(false)
    setEditingRoom(null)
  }

  const handleDeleteRoom = (room: Room) => {
    setDeleteRoom(room)
  }

  const confirmDelete = () => {
    if (deleteRoom) {
      setRooms((prev) => prev.filter((r) => r.id !== deleteRoom.id))
      setDeleteRoom(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Input
          placeholder="חיפוש חדר..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button onClick={handleAddRoom}>
          <PlusIcon className="h-4 w-4 ml-2" />
          הוסף חדר חדש
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            {room.images && room.images.length > 0 && (
              <div className="aspect-video relative">
                <img
                  src={room.images[0] || "/placeholder.svg"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-black/70">
                  <ImageIcon className="h-3 w-3 ml-1" />
                  {room.images.length} תמונות
                </Badge>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRoom(room)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteRoom(room)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>

              {/* Room Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <UsersIcon className="h-4 w-4" />
                  <span>עד {room.maxGuests} אורחים</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MaximizeIcon className="h-4 w-4" />
                  <span>{room.size} מ״ר</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BedIcon className="h-4 w-4" />
                  <span>{room.bedType}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 4).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{room.amenities.length - 4}
                  </Badge>
                )}
              </div>

              {room.ratePlans && room.ratePlans.length > 0 && (
                <div className="text-sm text-muted-foreground">{room.ratePlans.length} תוכניות תעריף</div>
              )}

              {/* Pricing & Availability */}
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">מחיר בסיס</p>
                  <p className="text-lg font-bold">{formatPrice(room.basePrice)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">זמינים</p>
                  <p className="text-lg font-bold">
                    {room.available}/{room.available + 3}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BedIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">לא נמצאו חדרים</p>
          <p className="text-sm">הוסף חדר חדש או שנה את החיפוש</p>
        </div>
      )}

      {/* Edit/Add Dialog */}
      <RoomEditDialog
        room={editingRoom}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingRoom(null)
        }}
        onSave={handleSaveRoom}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteRoom} onOpenChange={() => setDeleteRoom(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת חדר</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק את "{deleteRoom?.name}"? פעולה זו לא ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
