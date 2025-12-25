"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, Crown, TrendingUp, Users, DollarSign, Mail, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

interface LoyaltyMember {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  membership_tier: "bronze" | "silver" | "gold" | "platinum"
  discount_percentage: number
  points: number
  total_bookings: number
  total_spent: number
  last_booking_at: string | null
  is_active: boolean
  created_at: string
}

const TIER_CONFIG = {
  bronze: {
    label: "Bronze",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    gradient: "from-orange-400 to-orange-600",
    nextTier: "Silver",
    nextAmount: 2000,
  },
  silver: {
    label: "Silver",
    color: "bg-gray-200 text-gray-700 border-gray-400",
    gradient: "from-gray-400 to-gray-600",
    nextTier: "Gold",
    nextAmount: 5000,
  },
  gold: {
    label: "Gold",
    color: "bg-yellow-100 text-yellow-700 border-yellow-400",
    gradient: "from-yellow-400 to-yellow-600",
    nextTier: "Platinum",
    nextAmount: 10000,
  },
  platinum: {
    label: "Platinum",
    color: "bg-purple-100 text-purple-700 border-purple-400",
    gradient: "from-purple-400 to-purple-600",
    nextTier: null,
    nextAmount: null,
  },
}

export function LoyaltyMembersManagement() {
  const [members, setMembers] = useState<LoyaltyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("loyalty_members")
        .select("*")
        .order("total_spent", { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error loading loyalty members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeTier = async (memberId: string, newTier: string) => {
    if (!confirm("האם אתה בטוח שברצונך לשדרג חבר זה באופן ידני?")) return

    try {
      const discountMap: Record<string, number> = {
        bronze: 5,
        silver: 10,
        gold: 15,
        platinum: 20,
      }

      const { error } = await supabase
        .from("loyalty_members")
        .update({
          membership_tier: newTier,
          discount_percentage: discountMap[newTier],
        })
        .eq("id", memberId)

      if (error) throw error
      await loadMembers()
      alert("דרגת החבר עודכנה בהצלחה!")
    } catch (error: any) {
      console.error("Error upgrading tier:", error)
      alert("שגיאה בשדרוג דרגה")
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTier = tierFilter === "all" || member.membership_tier === tierFilter

    return matchesSearch && matchesTier
  })

  const stats = {
    total: members.length,
    active: members.filter((m) => m.is_active).length,
    totalBookings: members.reduce((sum, m) => sum + m.total_bookings, 0),
    totalRevenue: members.reduce((sum, m) => sum + m.total_spent, 0),
    bronze: members.filter((m) => m.membership_tier === "bronze").length,
    silver: members.filter((m) => m.membership_tier === "silver").length,
    gold: members.filter((m) => m.membership_tier === "gold").length,
    platinum: members.filter((m) => m.membership_tier === "platinum").length,
  }

  const viewMemberDetails = (member: LoyaltyMember) => {
    setSelectedMember(member)
    setShowDetailsDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          מועדון לקוחות
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          ניהול חברי מועדון ומעקב אחר הטבות
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">סה"כ חברים</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </div>
            <Users className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">הזמנות</div>
              <div className="text-2xl font-bold mt-1">{stats.totalBookings}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">הכנסות</div>
              <div className="text-2xl font-bold mt-1">
                {stats.totalRevenue.toLocaleString()}₪
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2">התפלגות דרגות</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>🥉 Bronze</span>
              <span className="font-semibold">{stats.bronze}</span>
            </div>
            <div className="flex justify-between">
              <span>🥈 Silver</span>
              <span className="font-semibold">{stats.silver}</span>
            </div>
            <div className="flex justify-between">
              <span>🥇 Gold</span>
              <span className="font-semibold">{stats.gold}</span>
            </div>
            <div className="flex justify-between">
              <span>💎 Platinum</span>
              <span className="font-semibold">{stats.platinum}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם או אימייל..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל הדרגות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הדרגות</SelectItem>
            <SelectItem value="bronze">🥉 Bronze</SelectItem>
            <SelectItem value="silver">🥈 Silver</SelectItem>
            <SelectItem value="gold">🥇 Gold</SelectItem>
            <SelectItem value="platinum">💎 Platinum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">טוען...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || tierFilter !== "all" ? "לא נמצאו תוצאות" : "אין חברי מועדון עדיין"}
          </div>
        ) : (
          filteredMembers.map((member) => {
            const tierConfig = TIER_CONFIG[member.membership_tier]
            const progressToNext = tierConfig.nextAmount
              ? (member.total_spent / tierConfig.nextAmount) * 100
              : 100

            return (
              <Card
                key={member.id}
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => viewMemberDetails(member)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Member Info */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">
                          {member.first_name && member.last_name
                            ? `${member.first_name} ${member.last_name}`
                            : member.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>

                      <Badge variant="outline" className={tierConfig.color}>
                        <Crown className="h-3 w-3 mr-1" />
                        {tierConfig.label}
                      </Badge>

                      <Badge variant="secondary">{member.discount_percentage}% הנחה</Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">הזמנות</div>
                        <div className="font-semibold">{member.total_bookings}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">הוצאות</div>
                        <div className="font-semibold">
                          {member.total_spent.toLocaleString()}₪
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">נקודות</div>
                        <div className="font-semibold">{member.points.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">הזמנה אחרונה</div>
                        <div className="font-semibold text-xs">
                          {member.last_booking_at
                            ? format(new Date(member.last_booking_at), "dd/MM/yy")
                            : "-"}
                        </div>
                      </div>
                    </div>

                    {/* Progress to next tier */}
                    {tierConfig.nextTier && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>התקדמות ל-{tierConfig.nextTier}</span>
                          <span>
                            {member.total_spent.toLocaleString()} /{" "}
                            {tierConfig.nextAmount?.toLocaleString()}₪
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${tierConfig.gradient}`}
                            style={{ width: `${Math.min(progressToNext, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Member Details Dialog */}
      {selectedMember && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>פרטי חבר מועדון</DialogTitle>
              <DialogDescription>
                {selectedMember.first_name} {selectedMember.last_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">מידע אישי</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">אימייל:</span>
                    <span>{selectedMember.email}</span>
                  </div>
                  {selectedMember.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">טלפון:</span>
                      <span>{selectedMember.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">חבר מאז:</span>
                    <span>{format(new Date(selectedMember.created_at), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">דרגת חברות</div>
                <div className="flex items-center gap-2">
                  <Badge className={TIER_CONFIG[selectedMember.membership_tier].color}>
                    {TIER_CONFIG[selectedMember.membership_tier].label}
                  </Badge>
                  <span className="text-sm">{selectedMember.discount_percentage}% הנחה</span>
                </div>

                <Select
                  value={selectedMember.membership_tier}
                  onValueChange={(tier) => handleUpgradeTier(selectedMember.id, tier)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">🥉 Bronze (5%)</SelectItem>
                    <SelectItem value="silver">🥈 Silver (10%)</SelectItem>
                    <SelectItem value="gold">🥇 Gold (15%)</SelectItem>
                    <SelectItem value="platinum">💎 Platinum (20%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">סטטיסטיקות</div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="text-xs text-muted-foreground">הזמנות</div>
                    <div className="text-xl font-bold">{selectedMember.total_bookings}</div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-xs text-muted-foreground">נקודות</div>
                    <div className="text-xl font-bold">{selectedMember.points}</div>
                  </Card>
                  <Card className="p-3 col-span-2">
                    <div className="text-xs text-muted-foreground">סה"כ הוצאות</div>
                    <div className="text-xl font-bold">
                      {selectedMember.total_spent.toLocaleString()}₪
                    </div>
                  </Card>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowDetailsDialog(false)}
              >
                סגור
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
