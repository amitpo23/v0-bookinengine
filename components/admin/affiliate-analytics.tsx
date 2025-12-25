"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LinkIcon,
  TrendingUp,
  DollarSign,
  Users,
  MousePointer,
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

interface AffiliateTracking {
  id: string
  session_id: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  referrer_url: string | null
  landing_page: string | null
  affiliate_code: string | null
  booking_id: string | null
  converted: boolean
  conversion_value: number | null
  commission_amount: number | null
  commission_rate: number | null
  device_type: string | null
  browser: string | null
  created_at: string
  converted_at: string | null
}

interface Stats {
  totalVisits: number
  conversions: number
  conversionRate: number
  totalRevenue: number
  totalCommission: number
  avgOrderValue: number
}

export function AffiliateAnalytics() {
  const [tracking, setTracking] = useState<AffiliateTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("7")
  const [sourceFilter, setSourceFilter] = useState("all")

  useEffect(() => {
    loadTracking()
  }, [timeFilter])

  const loadTracking = async () => {
    try {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeFilter))

      let query = supabase
        .from("affiliate_tracking")
        .select("*")
        .gte("created_at", daysAgo.toISOString())
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setTracking(data || [])
    } catch (error) {
      console.error("Error loading affiliate tracking:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const filteredTracking =
    sourceFilter === "all"
      ? tracking
      : tracking.filter((t) => t.utm_source === sourceFilter)

  const stats: Stats = {
    totalVisits: filteredTracking.length,
    conversions: filteredTracking.filter((t) => t.converted).length,
    conversionRate:
      filteredTracking.length > 0
        ? (filteredTracking.filter((t) => t.converted).length / filteredTracking.length) * 100
        : 0,
    totalRevenue: filteredTracking.reduce((sum, t) => sum + (t.conversion_value || 0), 0),
    totalCommission: filteredTracking.reduce((sum, t) => sum + (t.commission_amount || 0), 0),
    avgOrderValue:
      filteredTracking.filter((t) => t.converted).length > 0
        ? filteredTracking.reduce((sum, t) => sum + (t.conversion_value || 0), 0) /
          filteredTracking.filter((t) => t.converted).length
        : 0,
  }

  // Group by source
  const sourceGroups = filteredTracking.reduce(
    (acc, t) => {
      const source = t.utm_source || "direct"
      if (!acc[source]) {
        acc[source] = { visits: 0, conversions: 0, revenue: 0 }
      }
      acc[source].visits++
      if (t.converted) {
        acc[source].conversions++
        acc[source].revenue += t.conversion_value || 0
      }
      return acc
    },
    {} as Record<string, { visits: number; conversions: number; revenue: number }>
  )

  // Group by campaign
  const campaignGroups = filteredTracking.reduce(
    (acc, t) => {
      const campaign = t.utm_campaign || "no-campaign"
      if (!acc[campaign]) {
        acc[campaign] = { visits: 0, conversions: 0, revenue: 0 }
      }
      acc[campaign].visits++
      if (t.converted) {
        acc[campaign].conversions++
        acc[campaign].revenue += t.conversion_value || 0
      }
      return acc
    },
    {} as Record<string, { visits: number; conversions: number; revenue: number }>
  )

  // Device breakdown
  const deviceBreakdown = filteredTracking.reduce(
    (acc, t) => {
      const device = t.device_type || "unknown"
      acc[device] = (acc[device] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Get unique sources for filter
  const uniqueSources = Array.from(
    new Set(tracking.map((t) => t.utm_source).filter(Boolean))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            Affiliate Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            מעקב אחר מקורות הפניה והמרות
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="כל המקורות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המקורות</SelectItem>
              {uniqueSources.map((source) => (
                <SelectItem key={source} value={source!}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24 שעות</SelectItem>
              <SelectItem value="7">7 ימים</SelectItem>
              <SelectItem value="30">30 ימים</SelectItem>
              <SelectItem value="90">90 ימים</SelectItem>
              <SelectItem value="365">שנה</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">ביקורים</div>
              <div className="text-2xl font-bold mt-1">{stats.totalVisits}</div>
            </div>
            <MousePointer className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">המרות</div>
              <div className="text-2xl font-bold mt-1 text-green-600">
                {stats.conversions}
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">שיעור המרה</div>
              <div className="text-2xl font-bold mt-1">
                {stats.conversionRate.toFixed(1)}%
              </div>
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
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">עמלות</div>
              <div className="text-2xl font-bold mt-1 text-blue-600">
                {stats.totalCommission.toLocaleString()}₪
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600/30" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">ממוצע הזמנה</div>
              <div className="text-2xl font-bold mt-1">
                {stats.avgOrderValue.toLocaleString()}₪
              </div>
            </div>
            <Users className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            מקורות תנועה מובילים
          </h3>
          <div className="space-y-3">
            {Object.entries(sourceGroups)
              .sort((a, b) => b[1].visits - a[1].visits)
              .slice(0, 5)
              .map(([source, data]) => (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{source}</span>
                      <Badge variant="secondary" className="text-xs">
                        {data.visits} ביקורים
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {data.conversions} המרות ({((data.conversions / data.visits) * 100).toFixed(1)}
                      %)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{data.revenue.toLocaleString()}₪</div>
                    <div className="text-xs text-muted-foreground">הכנסות</div>
                  </div>
                </div>
              ))}
            {Object.keys(sourceGroups).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                אין נתונים להצגה
              </div>
            )}
          </div>
        </Card>

        {/* Top Campaigns */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            קמפיינים מובילים
          </h3>
          <div className="space-y-3">
            {Object.entries(campaignGroups)
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .slice(0, 5)
              .map(([campaign, data]) => (
                <div key={campaign} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {campaign === "no-campaign" ? "ללא קמפיין" : campaign}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {data.visits}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {data.conversions} המרות
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{data.revenue.toLocaleString()}₪</div>
                  </div>
                </div>
              ))}
            {Object.keys(campaignGroups).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                אין נתונים להצגה
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">פילוח לפי מכשיר</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(deviceBreakdown).map(([device, count]) => {
            const percentage = (count / stats.totalVisits) * 100
            return (
              <div key={device} className="text-center">
                {device === "mobile" ? (
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                ) : (
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                )}
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {device} ({percentage.toFixed(1)}%)
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">פעילות אחרונה</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">טוען...</div>
          ) : filteredTracking.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">אין נתונים להצגה</div>
          ) : (
            filteredTracking.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="capitalize">
                      {item.utm_source || "direct"}
                    </Badge>
                    {item.utm_medium && (
                      <Badge variant="secondary">{item.utm_medium}</Badge>
                    )}
                    {item.utm_campaign && (
                      <Badge variant="secondary">{item.utm_campaign}</Badge>
                    )}
                    {item.converted && (
                      <Badge className="bg-green-600">המיר ✓</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(item.created_at), "dd/MM/yyyy HH:mm")} •{" "}
                    {item.device_type || "unknown"} • {item.browser || "unknown"}
                  </div>
                </div>
                {item.converted && item.conversion_value && (
                  <div className="text-right">
                    <div className="font-semibold">
                      {item.conversion_value.toLocaleString()}₪
                    </div>
                    {item.commission_amount && (
                      <div className="text-xs text-muted-foreground">
                        עמלה: {item.commission_amount.toLocaleString()}₪
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
