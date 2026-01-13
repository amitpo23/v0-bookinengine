"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface SaveDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  guestDetails: {
    firstName: string
    lastName: string
    email: string
  }
  onSave: (rememberChoice: boolean) => void
  onSkip: () => void
}

export function SaveDetailsDialog({
  isOpen,
  onOpenChange,
  guestDetails,
  onSave,
  onSkip
}: SaveDetailsDialogProps) {
  const [rememberChoice, setRememberChoice] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          {/* תמונה */}
          <div className="hidden md:block">
            <Image
              src="/hotel-lobby.jpg"
              alt="Hotel Lobby"
              width={200}
              height={300}
              className="rounded-lg object-cover h-full"
            />
          </div>

          {/* תוכן */}
          <div>
            <DialogHeader>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <DialogTitle className="text-right text-xl">
                רוצה לשמור את פרטי הטיפוס שלך?
              </DialogTitle>
              <DialogDescription className="text-right">
                <p className="mb-4">
                  אם ברצונך להמשיך את ההזמנה מאוחר יותר, באפשרותך למלא את הפרטים
                  מטה ונשלח לך מייל עם תוכני הטיפוס שלך, כך שתוכל להזן בקלות
                  ולהזמין מאוחר יותר!
                </p>

                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                  <div>
                    <span className="font-semibold">שם משפחה ושם פרטי:</span>{" "}
                    {guestDetails.firstName} {guestDetails.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">דואר אלקטרוני:</span>{" "}
                    {guestDetails.email}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="my-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={rememberChoice}
                  onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  קראתי את המידע אודות השימוש בפרטים האישיים של ואני מאשר/ת את
                  השימוש מדיניות פרטיות
                </Label>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={onSkip}
                className="w-full sm:w-auto"
              >
                אחרת אני ממלא את פרטיי בעצמי
              </Button>
              <Button
                onClick={() => onSave(rememberChoice)}
                disabled={!rememberChoice}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                המשך
              </Button>
            </DialogFooter>

            <p className="text-xs text-center text-muted-foreground mt-4">
              הצטרפו למועדון
            </p>
            <p className="text-xs text-center mt-1">
              הצעות מיוחדות ומידע מגוון הטבות ומבצעים בלעדיים לחברי המועדון
            </p>
            <Button
              variant="link"
              className="w-full mt-2 text-blue-600"
              onClick={() => {/* TODO: Navigate to club signup */}}
            >
              צפייה בהטבות בלעדיות
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
