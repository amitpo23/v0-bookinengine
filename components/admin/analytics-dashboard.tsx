"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AnalyticsData {
  stats: {
    totalBookings: number
    totalRevenue: number
    avgBookingValue: number
    conversionRate: number
    cancelledBookings: number
    cancellationRate: number
  }
  revenue: Array<{
    date: string
    revenue: number
    bookings: number
  }>
  conversion: Array<{
    date: string
    searches: number
    bookings: number
    rate: number
  }>
  sources: Array<{
    source: string
    count: number
    revenue: number
    percentage: number
  }>
  topHotels: Array<{
    hotelName: string
    hotelId: number
    bookings: number
    revenue: number
  }>
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/dashboard?days=${period}`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const result = await response.json()
      setData(result.data)
    } catch (err: any) {
      setError(err.message || "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">טוען נתוני אנליטיקה...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("he-IL", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">אנליטיקה ודוחות</h2>
          <p className="text-muted-foreground mt-1">מעקב אחר ביצועים והכנסות</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 ימים אחרונים</SelectItem>
            <SelectItem value="30">30 ימים אחרונים</SelectItem>
            <SelectItem value="60">60 ימים אחרונים</SelectItem>
            <SelectItem value="90">90 ימים אחרונים</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>סה"כ הזמנות</CardDescription>
            <CardTitle className="text-3xl">{data.stats.totalBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{data.stats.cancelledBookings} בוטלו ({formatPercent(data.stats.cancellationRate)})</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>סה"כ הכנסות</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.stats.totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">ממוצע: {formatCurrency(data.stats.avgBookingValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>שיעור המרה</CardDescription>
            <CardTitle className="text-3xl">{formatPercent(data.stats.conversionRate)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">חיפושים → הזמנות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ערך הזמנה ממוצע</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.stats.avgBookingValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">לכל הזמנה</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>הכנסות לאורך זמן</CardTitle>
          <CardDescription>הכנסות יומיות ומספר הזמנות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis yAxisId="left" tickFormatter={formatCurrency} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === "revenue") return [formatCurrency(value), "הכנסות"]
                    return [value, "הזמנות"]
                  }}
                  labelFormatter={formatDate}
                />
                <Legend
                  formatter={(value: string) => {
                    if (value === "revenue") return "הכנסות"
                    if (value === "bookings") return "הזמנות"
                    return value
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} name="revenue" />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2} name="bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>שיעור המרה לאורך זמן</CardTitle>
          <CardDescription>אחוז המרה מחיפושים להזמנות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.conversion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis tickFormatter={formatPercent} />
                <Tooltip
                  formatter={(value: any) => formatPercent(Number(value))}
                  labelFormatter={formatDate}
                />
                <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} name="שיעור המרה" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Source Breakdown & Top Hotels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>התפלגות לפי API</CardTitle>
            <CardDescription>Medici Direct vs MANUS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percentage }) => `${source}: ${formatPercent(percentage)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => {
                      return [
                        `${value} הזמנות (${formatCurrency(props.payload.revenue)})`,
                        props.payload.source,
                      ]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Hotels */}
        <Card>
          <CardHeader>
            <CardTitle>מלונות מובילים</CardTitle>
            <CardDescription>לפי מספר הזמנות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topHotels} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="hotelName" type="category" width={120} />
                  <Tooltip
                    formatter={(value: any) => [`${value} הזמנות`, "מספר הזמנות"]}
                  />
                  <Bar dataKey="bookings" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>מלונות מפורט</CardTitle>
          <CardDescription>סיכום הכנסות לפי מלון</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">מלון</th>
                  <th className="text-right py-3 px-4">הזמנות</th>
                  <th className="text-right py-3 px-4">הכנסות</th>
                  <th className="text-right py-3 px-4">ממוצע</th>
                </tr>
              </thead>
              <tbody>
                {data.topHotels.map((hotel) => (
                  <tr key={hotel.hotelId} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{hotel.hotelName}</td>
                    <td className="py-3 px-4">{hotel.bookings}</td>
                    <td className="py-3 px-4">{formatCurrency(hotel.revenue)}</td>
                    <td className="py-3 px-4">{formatCurrency(hotel.revenue / hotel.bookings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
