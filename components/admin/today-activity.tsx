"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CheckIcon = ({ className }: { className?: string }) => (
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
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const DoorOpenIcon = ({ className }: { className?: string }) => (
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
    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
    <path d="M2 20h3" />
    <path d="M13 20h9" />
    <path d="M10 12v.01" />
    <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
  </svg>
)

const DoorClosedIcon = ({ className }: { className?: string }) => (
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
    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
    <path d="M2 20h20" />
    <path d="M14 12v.01" />
  </svg>
)

const AlertCircleIcon = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

interface Activity {
  id: string
  type: "check-in" | "check-out" | "booking" | "cancellation"
  guest: string
  room: string
  time: string
  status: "pending" | "completed" | "urgent"
}

const activities: Activity[] = [
  { id: "1", type: "check-in", guest: "יוסי כהן", room: "חדר 204", time: "14:00", status: "pending" },
  { id: "2", type: "check-in", guest: "שרה לוי", room: "סוויטה 501", time: "15:00", status: "pending" },
  { id: "3", type: "check-out", guest: "דוד ישראלי", room: "חדר 302", time: "11:00", status: "completed" },
  { id: "4", type: "check-in", guest: "מרים אברהם", room: "חדר 105", time: "16:00", status: "urgent" },
  { id: "5", type: "check-out", guest: "אלי רוזן", room: "חדר 408", time: "12:00", status: "pending" },
]

const typeConfig = {
  "check-in": { icon: DoorOpenIcon, label: "צ'ק-אין", color: "text-green-600" },
  "check-out": { icon: DoorClosedIcon, label: "צ'ק-אאוט", color: "text-blue-600" },
  booking: { icon: ClockIcon, label: "הזמנה", color: "text-primary" },
  cancellation: { icon: AlertCircleIcon, label: "ביטול", color: "text-red-600" },
}

const statusConfig = {
  pending: { label: "ממתין", className: "bg-yellow-500/10 text-yellow-600" },
  completed: { label: "הושלם", className: "bg-green-500/10 text-green-600" },
  urgent: { label: "דחוף", className: "bg-red-500/10 text-red-600" },
}

export function TodayActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">פעילות היום</CardTitle>
          <p className="text-sm text-muted-foreground">צ'ק-אינים וצ'ק-אאוטים</p>
        </div>
        <Badge variant="secondary">{activities.length} פעולות</Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = typeConfig[activity.type]
            const status = statusConfig[activity.status]
            const Icon = config.icon

            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn("p-2 rounded-lg bg-muted", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.guest}</span>
                    <Badge variant="secondary" className={cn("text-xs", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.label} • {activity.room} • {activity.time}
                  </div>
                </div>

                {activity.status !== "completed" && (
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
