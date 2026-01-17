/**
 * Revenue Dashboard Handler
 * Financial reporting, revenue analytics, and KPI tracking
 */

// Types
export interface RevenueContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface RevenueResult {
  success: boolean
  data?: any
  message?: string
  error?: string
}

interface RevenueData {
  date: string
  revenue: number
  bookings: number
  avgOrderValue: number
  cancellations: number
  refunds: number
}

interface RevenueBreakdown {
  category: string
  amount: number
  percentage: number
  trend: "up" | "down" | "stable"
  change: number
}

interface KPI {
  name: string
  value: number | string
  target: number | string
  status: "excellent" | "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  change: number
}

// Revenue Dashboard Handler
export const revenueDashboardHandler = {
  skillId: "revenue-dashboard",
  
  async execute(
    tool: string,
    params: Record<string, unknown>,
    context: RevenueContext
  ): Promise<RevenueResult> {
    switch (tool) {
      case "get_revenue_summary":
        return getRevenueSummary(params, context)
      case "get_revenue_breakdown":
        return getRevenueBreakdown(params, context)
      case "get_kpi_dashboard":
        return getKPIDashboard(params, context)
      case "generate_revenue_report":
        return generateRevenueReport(params, context)
      default:
        return {
          success: false,
          error: `Unknown tool: ${tool}`,
        }
    }
  },
}

// Get Revenue Summary
async function getRevenueSummary(
  params: Record<string, unknown>,
  context: RevenueContext
): Promise<RevenueResult> {
  const period = (params.period as string) || "month" // day, week, month, quarter, year
  const startDate = params.startDate as string
  const endDate = params.endDate as string
  const compareWithPrevious = params.compareWithPrevious !== false

  try {
    // Calculate date range
    const now = new Date()
    let start: Date
    let end: Date = new Date(endDate || now)
    
    if (startDate) {
      start = new Date(startDate)
    } else {
      start = new Date(now)
      switch (period) {
        case "day":
          start.setDate(start.getDate() - 1)
          break
        case "week":
          start.setDate(start.getDate() - 7)
          break
        case "month":
          start.setMonth(start.getMonth() - 1)
          break
        case "quarter":
          start.setMonth(start.getMonth() - 3)
          break
        case "year":
          start.setFullYear(start.getFullYear() - 1)
          break
      }
    }

    // Generate revenue data (in production, fetch from database)
    const currentPeriodData = generateRevenueData(start, end)
    
    // Calculate previous period for comparison
    let previousPeriodData: typeof currentPeriodData | null = null
    if (compareWithPrevious) {
      const periodLength = end.getTime() - start.getTime()
      const prevStart = new Date(start.getTime() - periodLength)
      const prevEnd = new Date(start.getTime() - 1)
      previousPeriodData = generateRevenueData(prevStart, prevEnd)
    }

    // Calculate totals
    const currentTotals = calculateTotals(currentPeriodData)
    const previousTotals = previousPeriodData ? calculateTotals(previousPeriodData) : null

    // Calculate changes
    const changes = previousTotals ? {
      revenue: ((currentTotals.revenue - previousTotals.revenue) / previousTotals.revenue * 100),
      bookings: ((currentTotals.bookings - previousTotals.bookings) / previousTotals.bookings * 100),
      avgOrderValue: ((currentTotals.avgOrderValue - previousTotals.avgOrderValue) / previousTotals.avgOrderValue * 100),
      cancellationRate: currentTotals.cancellationRate - previousTotals.cancellationRate,
    } : null

    return {
      success: true,
      data: {
        period: {
          start: start.toISOString().split("T")[0],
          end: end.toISOString().split("T")[0],
          label: period,
        },
        summary: {
          totalRevenue: currentTotals.revenue,
          totalBookings: currentTotals.bookings,
          avgOrderValue: currentTotals.avgOrderValue,
          cancellationRate: currentTotals.cancellationRate,
          refundRate: currentTotals.refundRate,
          netRevenue: currentTotals.netRevenue,
        },
        comparison: changes ? {
          revenueChange: changes.revenue.toFixed(1) + "%",
          bookingsChange: changes.bookings.toFixed(1) + "%",
          avgOrderValueChange: changes.avgOrderValue.toFixed(1) + "%",
          trend: changes.revenue > 0 ? "up" : changes.revenue < 0 ? "down" : "stable",
        } : null,
        dailyData: currentPeriodData.slice(-7), // Last 7 days
        topMetrics: {
          bestDay: currentPeriodData.reduce((a, b) => a.revenue > b.revenue ? a : b),
          worstDay: currentPeriodData.reduce((a, b) => a.revenue < b.revenue ? a : b),
          avgDailyRevenue: currentTotals.revenue / currentPeriodData.length,
        },
      },
      message: `Revenue summary for ${period}: €${currentTotals.revenue.toLocaleString()} total revenue from ${currentTotals.bookings} bookings`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to get revenue summary: ${error}`,
    }
  }
}

// Get Revenue Breakdown
async function getRevenueBreakdown(
  params: Record<string, unknown>,
  context: RevenueContext
): Promise<RevenueResult> {
  const breakdownBy = (params.breakdownBy as string) || "source" // source, hotel, room_type, channel
  const period = (params.period as string) || "month"

  try {
    // Generate breakdown data based on category
    let breakdown: RevenueBreakdown[] = []

    switch (breakdownBy) {
      case "source":
        breakdown = [
          { category: "Direct Website", amount: 45000, percentage: 35, trend: "up", change: 12 },
          { category: "Booking.com", amount: 32000, percentage: 25, trend: "stable", change: 2 },
          { category: "Expedia", amount: 25000, percentage: 19, trend: "down", change: -5 },
          { category: "AI Chat Widget", amount: 18000, percentage: 14, trend: "up", change: 45 },
          { category: "Phone/Email", amount: 9000, percentage: 7, trend: "down", change: -15 },
        ]
        break
      case "hotel":
        breakdown = [
          { category: "Scarlet Hotel Tel Aviv", amount: 52000, percentage: 40, trend: "up", change: 8 },
          { category: "Grand Palace Jerusalem", amount: 39000, percentage: 30, trend: "up", change: 15 },
          { category: "Beach Resort Eilat", amount: 26000, percentage: 20, trend: "stable", change: 1 },
          { category: "Mountain Lodge Galilee", amount: 13000, percentage: 10, trend: "down", change: -3 },
        ]
        break
      case "room_type":
        breakdown = [
          { category: "Deluxe Suite", amount: 48000, percentage: 37, trend: "up", change: 18 },
          { category: "Standard Room", amount: 35000, percentage: 27, trend: "stable", change: 0 },
          { category: "Family Room", amount: 26000, percentage: 20, trend: "up", change: 22 },
          { category: "Executive Suite", amount: 21000, percentage: 16, trend: "down", change: -8 },
        ]
        break
      case "channel":
        breakdown = [
          { category: "Online", amount: 91000, percentage: 70, trend: "up", change: 15 },
          { category: "Mobile App", amount: 26000, percentage: 20, trend: "up", change: 35 },
          { category: "Offline", amount: 13000, percentage: 10, trend: "down", change: -20 },
        ]
        break
    }

    const totalRevenue = breakdown.reduce((sum, b) => sum + b.amount, 0)

    return {
      success: true,
      data: {
        breakdownBy,
        period,
        totalRevenue,
        breakdown,
        insights: generateBreakdownInsights(breakdown, breakdownBy),
        recommendations: [
          breakdown[0].trend === "up" 
            ? `${breakdown[0].category} is performing well (+${breakdown[0].change}%). Consider increasing investment.`
            : `Focus on improving ${breakdown[0].category} performance.`,
          breakdown.find(b => b.trend === "down")
            ? `Attention needed: ${breakdown.find(b => b.trend === "down")?.category} is declining.`
            : "All categories showing positive or stable trends.",
        ],
      },
      message: `Revenue breakdown by ${breakdownBy}: Top performer is ${breakdown[0].category} with €${breakdown[0].amount.toLocaleString()} (${breakdown[0].percentage}%)`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to get revenue breakdown: ${error}`,
    }
  }
}

// Get KPI Dashboard
async function getKPIDashboard(
  params: Record<string, unknown>,
  context: RevenueContext
): Promise<RevenueResult> {
  const period = (params.period as string) || "month"

  try {
    const kpis: KPI[] = [
      {
        name: "Total Revenue",
        value: 129000,
        target: 120000,
        status: "excellent",
        trend: "up",
        change: 12.5,
      },
      {
        name: "Bookings",
        value: 847,
        target: 800,
        status: "excellent",
        trend: "up",
        change: 8.2,
      },
      {
        name: "Average Order Value",
        value: 152.30,
        target: 150,
        status: "good",
        trend: "up",
        change: 3.5,
      },
      {
        name: "Occupancy Rate",
        value: "78%",
        target: "75%",
        status: "good",
        trend: "up",
        change: 4.1,
      },
      {
        name: "Cancellation Rate",
        value: "8.2%",
        target: "10%",
        status: "excellent",
        trend: "down",
        change: -15.3,
      },
      {
        name: "Customer Satisfaction",
        value: 4.6,
        target: 4.5,
        status: "good",
        trend: "stable",
        change: 0.5,
      },
      {
        name: "Revenue per Available Room",
        value: 145,
        target: 140,
        status: "good",
        trend: "up",
        change: 5.8,
      },
      {
        name: "Direct Booking Rate",
        value: "49%",
        target: "50%",
        status: "warning",
        trend: "up",
        change: 8.0,
      },
    ]

    const statusSummary = {
      excellent: kpis.filter(k => k.status === "excellent").length,
      good: kpis.filter(k => k.status === "good").length,
      warning: kpis.filter(k => k.status === "warning").length,
      critical: kpis.filter(k => k.status === "critical").length,
    }

    return {
      success: true,
      data: {
        period,
        kpis,
        statusSummary,
        overallHealth: statusSummary.critical === 0 && statusSummary.warning <= 1 ? "healthy" : 
                       statusSummary.critical > 0 ? "critical" : "attention_needed",
        alerts: kpis
          .filter(k => k.status === "warning" || k.status === "critical")
          .map(k => ({
            kpi: k.name,
            message: `${k.name} is ${k.status}: ${k.value} (target: ${k.target})`,
            priority: k.status === "critical" ? "high" : "medium",
          })),
        highlights: kpis
          .filter(k => k.status === "excellent")
          .map(k => `${k.name}: ${k.value} (${k.change > 0 ? "+" : ""}${k.change}%)`),
      },
      message: `KPI Dashboard: ${statusSummary.excellent} excellent, ${statusSummary.good} good, ${statusSummary.warning} need attention`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to get KPI dashboard: ${error}`,
    }
  }
}

// Generate Revenue Report
async function generateRevenueReport(
  params: Record<string, unknown>,
  context: RevenueContext
): Promise<RevenueResult> {
  const reportType = (params.reportType as string) || "summary" // summary, detailed, executive
  const period = (params.period as string) || "month"
  const format = (params.format as string) || "json" // json, html, pdf

  try {
    // Gather all data for the report
    const summaryResult = await getRevenueSummary({ period }, context)
    const breakdownResult = await getRevenueBreakdown({ period, breakdownBy: "source" }, context)
    const kpiResult = await getKPIDashboard({ period }, context)

    if (!summaryResult.success || !breakdownResult.success || !kpiResult.success) {
      throw new Error("Failed to gather report data")
    }

    const reportData = {
      generatedAt: new Date().toISOString(),
      period,
      reportType,
      summary: summaryResult.data,
      breakdown: breakdownResult.data,
      kpis: kpiResult.data,
    }

    let output: string | typeof reportData = reportData

    if (format === "html") {
      output = generateHTMLReport(reportData)
    }

    return {
      success: true,
      data: {
        report: output,
        format,
        downloadUrl: format === "pdf" ? `/api/reports/revenue/${Date.now()}.pdf` : null,
        metadata: {
          generatedAt: reportData.generatedAt,
          period,
          type: reportType,
          dataPoints: Object.keys(reportData).length,
        },
      },
      message: `Revenue report generated successfully (${reportType} format, ${period} period)`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate revenue report: ${error}`,
    }
  }
}

// Helper Functions
function generateRevenueData(start: Date, end: Date): RevenueData[] {
  const data: RevenueData[] = []
  const current = new Date(start)
  
  while (current <= end) {
    const dayOfWeek = current.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseRevenue = isWeekend ? 5500 : 3800
    const variance = (Math.random() - 0.5) * 1500
    
    data.push({
      date: current.toISOString().split("T")[0],
      revenue: Math.round(baseRevenue + variance),
      bookings: Math.round(25 + Math.random() * 15),
      avgOrderValue: Math.round(140 + Math.random() * 30),
      cancellations: Math.round(Math.random() * 5),
      refunds: Math.round(Math.random() * 500),
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return data
}

function calculateTotals(data: RevenueData[]) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalBookings = data.reduce((sum, d) => sum + d.bookings, 0)
  const totalCancellations = data.reduce((sum, d) => sum + d.cancellations, 0)
  const totalRefunds = data.reduce((sum, d) => sum + d.refunds, 0)
  
  return {
    revenue: totalRevenue,
    bookings: totalBookings,
    avgOrderValue: Math.round(totalRevenue / totalBookings),
    cancellationRate: (totalCancellations / totalBookings * 100),
    refundRate: (totalRefunds / totalRevenue * 100),
    netRevenue: totalRevenue - totalRefunds,
  }
}

function generateBreakdownInsights(breakdown: RevenueBreakdown[], breakdownBy: string): string[] {
  const insights: string[] = []
  
  const topPerformer = breakdown[0]
  insights.push(`${topPerformer.category} leads ${breakdownBy} revenue with ${topPerformer.percentage}% share`)
  
  const growing = breakdown.filter(b => b.trend === "up" && b.change > 10)
  if (growing.length > 0) {
    insights.push(`Fast growing: ${growing.map(g => g.category).join(", ")}`)
  }
  
  const declining = breakdown.filter(b => b.trend === "down")
  if (declining.length > 0) {
    insights.push(`Declining: ${declining.map(d => d.category).join(", ")} - requires attention`)
  }
  
  return insights
}

function generateHTMLReport(data: any): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>דוח הכנסות - ${data.period}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #1a1a2e; border-bottom: 3px solid #4a90a4; padding-bottom: 15px; }
    h2 { color: #4a90a4; margin-top: 30px; }
    .metric { display: inline-block; background: #f8f9fa; padding: 20px; margin: 10px; border-radius: 8px; min-width: 150px; text-align: center; }
    .metric-value { font-size: 28px; font-weight: bold; color: #1a1a2e; }
    .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
    .metric-change { font-size: 12px; margin-top: 5px; }
    .up { color: #28a745; }
    .down { color: #dc3545; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #ddd; }
    th { background: #4a90a4; color: white; }
    .kpi-excellent { background: #d4edda; }
    .kpi-good { background: #fff3cd; }
    .kpi-warning { background: #f8d7da; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 דוח הכנסות - ${data.period}</h1>
    <p>נוצר: ${new Date(data.generatedAt).toLocaleString("he-IL")}</p>
    
    <h2>סיכום כללי</h2>
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">€${data.summary?.summary?.totalRevenue?.toLocaleString() || "N/A"}</div>
        <div class="metric-label">הכנסות כוללות</div>
        <div class="metric-change up">${data.summary?.comparison?.revenueChange || ""}</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.summary?.summary?.totalBookings || "N/A"}</div>
        <div class="metric-label">הזמנות</div>
        <div class="metric-change up">${data.summary?.comparison?.bookingsChange || ""}</div>
      </div>
      <div class="metric">
        <div class="metric-value">€${data.summary?.summary?.avgOrderValue || "N/A"}</div>
        <div class="metric-label">ממוצע להזמנה</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.summary?.summary?.cancellationRate?.toFixed(1) || "N/A"}%</div>
        <div class="metric-label">שיעור ביטולים</div>
      </div>
    </div>
    
    <h2>פילוח הכנסות</h2>
    <table>
      <tr><th>קטגוריה</th><th>סכום</th><th>אחוז</th><th>מגמה</th></tr>
      ${data.breakdown?.breakdown?.map((b: any) => `
        <tr>
          <td>${b.category}</td>
          <td>€${b.amount.toLocaleString()}</td>
          <td>${b.percentage}%</td>
          <td class="${b.trend === 'up' ? 'up' : b.trend === 'down' ? 'down' : ''}">${b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '→'} ${b.change}%</td>
        </tr>
      `).join("") || ""}
    </table>
    
    <h2>מדדי ביצוע (KPIs)</h2>
    <table>
      <tr><th>מדד</th><th>ערך</th><th>יעד</th><th>סטטוס</th></tr>
      ${data.kpis?.kpis?.slice(0, 5).map((k: any) => `
        <tr class="kpi-${k.status}">
          <td>${k.name}</td>
          <td>${k.value}</td>
          <td>${k.target}</td>
          <td>${k.status === 'excellent' ? '✅' : k.status === 'good' ? '👍' : '⚠️'}</td>
        </tr>
      `).join("") || ""}
    </table>
    
    <div class="footer">
      <p>דוח זה נוצר אוטומטית על ידי מערכת Revenue Dashboard</p>
    </div>
  </div>
</body>
</html>
  `
}

export default revenueDashboardHandler
