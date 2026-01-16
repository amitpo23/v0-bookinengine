// Alerts API Endpoint
// GET /api/alerts - View alerts
// POST /api/alerts - Create manual alert
// PUT /api/alerts/:id - Resolve alert

import { NextRequest, NextResponse } from "next/server"
import { alertManager, triggerAlert, type AlertSeverity, type AlertType } from "@/lib/logging/alert-system"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const severity = searchParams.get("severity") as AlertSeverity | null
  const type = searchParams.get("type") as AlertType | null
  const resolved = searchParams.get("resolved")
  const limit = parseInt(searchParams.get("limit") || "100")
  const format = searchParams.get("format") || "json"

  const filter: any = { limit }
  if (severity) filter.severity = severity
  if (type) filter.type = type
  if (resolved !== null) filter.resolved = resolved === "true"

  const alerts = alertManager.getAlerts(filter)
  const stats = alertManager.getStats()

  if (format === "html") {
    return new NextResponse(generateHtmlDashboard(alerts, stats), {
      headers: { "Content-Type": "text/html" },
    })
  }

  return NextResponse.json({
    success: true,
    stats,
    count: alerts.length,
    alerts,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, severity, title, description, metadata } = body

    if (!type || !severity || !title) {
      return NextResponse.json(
        { error: "type, severity, and title are required" },
        { status: 400 }
      )
    }

    const alert = await triggerAlert(type, severity, title, description || "", metadata)

    return NextResponse.json({
      success: true,
      alert,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, action, resolvedBy } = body

    if (!alertId || !action) {
      return NextResponse.json(
        { error: "alertId and action are required" },
        { status: 400 }
      )
    }

    if (action === "resolve") {
      const success = alertManager.resolveAlert(alertId, resolvedBy)
      return NextResponse.json({ success })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

function generateHtmlDashboard(alerts: any[], stats: any): string {
  const severityColors: Record<string, string> = {
    critical: "#dc3545",
    high: "#fd7e14",
    medium: "#ffc107",
    low: "#17a2b8",
  }

  const typeIcons: Record<string, string> = {
    api_failure: "🌐",
    booking_failed: "📋",
    payment_failed: "💳",
    cancellation_issue: "❌",
    price_mismatch: "💰",
    availability_change: "🏨",
    rate_limit: "⚠️",
    timeout: "⏱️",
    authentication: "🔐",
    data_integrity: "🔗",
    business_logic: "⚙️",
    system_health: "💻",
  }

  const alertsHtml = alerts.map(alert => {
    const time = new Date(alert.timestamp).toLocaleString("he-IL")
    const icon = typeIcons[alert.type] || "🔔"
    const color = severityColors[alert.severity]
    
    return `
      <div class="alert-card ${alert.resolved ? 'resolved' : ''}" style="border-right-color: ${color}">
        <div class="alert-header">
          <span class="alert-icon">${icon}</span>
          <span class="alert-severity" style="background: ${color}">${alert.severity.toUpperCase()}</span>
          <span class="alert-title">${alert.title}</span>
          ${alert.resolved ? '<span class="alert-resolved">✓ נפתר</span>' : ''}
        </div>
        <div class="alert-body">
          <p class="alert-description">${alert.description}</p>
          <div class="alert-meta">
            <span>סוג: ${alert.type}</span>
            <span>מקור: ${alert.source}</span>
            <span>זמן: ${time}</span>
          </div>
          ${alert.bookingId ? `<div class="alert-link">הזמנה: ${alert.bookingId}</div>` : ''}
        </div>
        ${!alert.resolved ? `
          <button class="resolve-btn" onclick="resolveAlert('${alert.id}')">סמן כנפתר</button>
        ` : ''}
      </div>
    `
  }).join("")

  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 Alerts Dashboard - Booking Engine</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, sans-serif; 
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #eee;
      min-height: 100vh;
      padding: 20px;
    }
    h1 { 
      color: #ff6b6b; 
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 28px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }
    .stat-card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-value { 
      font-size: 36px; 
      font-weight: bold; 
      color: #00d4ff;
    }
    .stat-value.critical { color: #dc3545; }
    .stat-value.high { color: #fd7e14; }
    .stat-value.medium { color: #ffc107; }
    .stat-label { 
      font-size: 12px; 
      color: #aaa;
      margin-top: 5px;
    }
    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filters select, .filters button {
      padding: 10px 15px;
      border-radius: 8px;
      border: 1px solid #333;
      background: rgba(255,255,255,0.1);
      color: #eee;
      cursor: pointer;
    }
    .filters button.primary {
      background: #ff6b6b;
      border: none;
    }
    .alerts-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .alert-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 15px;
      border-right: 4px solid #333;
      transition: all 0.3s ease;
    }
    .alert-card:hover {
      background: rgba(255,255,255,0.1);
      transform: translateX(-5px);
    }
    .alert-card.resolved {
      opacity: 0.6;
    }
    .alert-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .alert-icon { font-size: 24px; }
    .alert-severity {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: bold;
      color: #fff;
    }
    .alert-title {
      font-weight: 600;
      font-size: 16px;
      flex: 1;
    }
    .alert-resolved {
      background: #28a745;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
    }
    .alert-body {
      padding-right: 36px;
    }
    .alert-description {
      color: #ccc;
      margin-bottom: 10px;
    }
    .alert-meta {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #888;
    }
    .alert-link {
      margin-top: 8px;
      font-size: 12px;
      color: #00d4ff;
    }
    .resolve-btn {
      margin-top: 10px;
      padding: 8px 15px;
      background: #28a745;
      border: none;
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .resolve-btn:hover {
      background: #218838;
    }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #888;
    }
    .empty-state .icon { font-size: 60px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>🚨 Alerts Dashboard</h1>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">סה"כ התראות</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: #ff6b6b">${stats.unresolved}</div>
      <div class="stat-label">לא נפתרו</div>
    </div>
    <div class="stat-card">
      <div class="stat-value critical">${stats.bySeverity.critical || 0}</div>
      <div class="stat-label">קריטי</div>
    </div>
    <div class="stat-card">
      <div class="stat-value high">${stats.bySeverity.high || 0}</div>
      <div class="stat-label">גבוה</div>
    </div>
    <div class="stat-card">
      <div class="stat-value medium">${stats.bySeverity.medium || 0}</div>
      <div class="stat-label">בינוני</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.last24h}</div>
      <div class="stat-label">24 שעות אחרונות</div>
    </div>
  </div>

  <div class="filters">
    <select id="severityFilter" onchange="applyFilters()">
      <option value="">כל הרמות</option>
      <option value="critical">קריטי</option>
      <option value="high">גבוה</option>
      <option value="medium">בינוני</option>
      <option value="low">נמוך</option>
    </select>
    <select id="resolvedFilter" onchange="applyFilters()">
      <option value="">הכל</option>
      <option value="false">לא נפתרו</option>
      <option value="true">נפתרו</option>
    </select>
    <button onclick="location.reload()">🔄 רענן</button>
    <button class="primary" onclick="testAlert()">🧪 יצירת התראת בדיקה</button>
  </div>

  <div class="alerts-container">
    ${alertsHtml || '<div class="empty-state"><div class="icon">✅</div><h3>אין התראות</h3><p>המערכת פועלת תקין</p></div>'}
  </div>

  <script>
    function applyFilters() {
      const severity = document.getElementById('severityFilter').value;
      const resolved = document.getElementById('resolvedFilter').value;
      let url = '/api/alerts?format=html';
      if (severity) url += '&severity=' + severity;
      if (resolved) url += '&resolved=' + resolved;
      window.location.href = url;
    }

    async function resolveAlert(alertId) {
      try {
        const response = await fetch('/api/alerts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertId, action: 'resolve', resolvedBy: 'dashboard' })
        });
        if (response.ok) {
          location.reload();
        }
      } catch (error) {
        alert('שגיאה בסגירת ההתראה');
      }
    }

    async function testAlert() {
      try {
        await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'system_health',
            severity: 'low',
            title: 'Test Alert',
            description: 'This is a test alert from the dashboard'
          })
        });
        location.reload();
      } catch (error) {
        alert('שגיאה ביצירת התראה');
      }
    }
  </script>
</body>
</html>
  `
}
