// Agents Management API
// GET /api/agents - List agents and their status
// POST /api/agents/run - Run agents with booking data

import { NextRequest, NextResponse } from "next/server"
import { bookingAgentManager, type BookingRecord } from "@/lib/logging/booking-agents"
import { requestTracker } from "@/lib/logging/request-tracker"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get("format") || "json"

  const agents = bookingAgentManager.getAgents()
  const requestStats = requestTracker.getStats()

  if (format === "html") {
    return new NextResponse(generateAgentsDashboard(agents, requestStats), {
      headers: { "Content-Type": "text/html" },
    })
  }

  return NextResponse.json({
    success: true,
    agents,
    requestStats,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, agentId, bookings } = body

    if (action === "run") {
      // Run specific agent or all agents
      if (agentId) {
        const result = await bookingAgentManager.runAgent(agentId, bookings || [])
        return NextResponse.json({ success: true, result })
      } else {
        const results = await bookingAgentManager.runAllAgents(bookings || [])
        return NextResponse.json({ success: true, results })
      }
    }

    if (action === "enable" || action === "disable") {
      if (!agentId) {
        return NextResponse.json({ error: "agentId required" }, { status: 400 })
      }
      bookingAgentManager.setAgentEnabled(agentId, action === "enable")
      return NextResponse.json({ success: true })
    }

    if (action === "test") {
      // Run with mock bookings for testing
      const mockBookings: BookingRecord[] = [
        {
          id: "test-booking-1",
          status: "pending",
          hotelId: 697024,
          hotelName: "Dizengoff Inn",
          checkIn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          checkOut: "2026-03-15",
          guestName: "Test Guest",
          guestEmail: "test@example.com",
          totalPrice: 250,
          currency: "USD",
          paymentStatus: "pending",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "test-booking-2",
          status: "confirmed",
          hotelId: 697025,
          hotelName: "Test Hotel",
          checkIn: "2026-03-20",
          checkOut: "2026-03-22",
          guestName: "Another Guest",
          guestEmail: "",
          totalPrice: 0,
          currency: "USD",
          paymentStatus: "paid",
          paymentAmount: 350,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "test-booking-3",
          status: "cancelled",
          hotelId: 697026,
          hotelName: "Cancelled Hotel",
          checkIn: "2026-03-10",
          checkOut: "2026-03-12",
          guestName: "Cancelled Guest",
          guestEmail: "cancelled@example.com",
          totalPrice: 180,
          currency: "USD",
          paymentStatus: "paid",
          paymentAmount: 180,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          cancelledAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
      ]

      const results = await bookingAgentManager.runAllAgents(mockBookings)
      return NextResponse.json({ 
        success: true, 
        results,
        mockBookingsUsed: mockBookings.length,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function generateAgentsDashboard(agents: any[], requestStats: any): string {
  const agentsHtml = agents.map(agent => {
    const lastRun = agent.lastRun ? new Date(agent.lastRun).toLocaleString("he-IL") : "טרם הורץ"
    const issues = agent.lastResult?.issuesFound || 0
    const statusColor = agent.enabled ? "#28a745" : "#6c757d"
    const issueColor = issues > 0 ? "#dc3545" : "#28a745"

    return `
      <div class="agent-card">
        <div class="agent-header">
          <div class="agent-status" style="background: ${statusColor}"></div>
          <h3>${agent.name}</h3>
          <span class="agent-type">${agent.type}</span>
        </div>
        <p class="agent-description">${agent.description}</p>
        <div class="agent-stats">
          <div class="agent-stat">
            <span class="value">${lastRun}</span>
            <span class="label">הרצה אחרונה</span>
          </div>
          <div class="agent-stat">
            <span class="value" style="color: ${issueColor}">${issues}</span>
            <span class="label">בעיות שנמצאו</span>
          </div>
          <div class="agent-stat">
            <span class="value">${agent.lastResult?.duration || 0}ms</span>
            <span class="label">זמן ריצה</span>
          </div>
        </div>
        <div class="agent-actions">
          <button onclick="toggleAgent('${agent.id}', ${!agent.enabled})">${agent.enabled ? 'השבת' : 'הפעל'}</button>
          <button class="primary" onclick="runAgent('${agent.id}')">הרץ עכשיו</button>
        </div>
      </div>
    `
  }).join("")

  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🤖 Booking Agents - Monitoring Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, sans-serif; 
      background: linear-gradient(135deg, #0f0f1e 0%, #1a1a35 100%);
      color: #eee;
      min-height: 100vh;
      padding: 20px;
    }
    h1 { 
      color: #00d4ff; 
      margin-bottom: 25px;
      font-size: 28px;
    }
    h2 {
      color: #aaa;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
    }
    @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    .request-stats {
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 20px;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-box {
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-box .value {
      font-size: 28px;
      font-weight: bold;
      color: #00d4ff;
    }
    .stat-box .label {
      font-size: 11px;
      color: #888;
    }
    .agents-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .agent-card {
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .agent-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .agent-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .agent-header h3 {
      flex: 1;
      font-size: 16px;
    }
    .agent-type {
      font-size: 11px;
      background: rgba(0,212,255,0.2);
      color: #00d4ff;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .agent-description {
      color: #888;
      font-size: 13px;
      margin-bottom: 15px;
    }
    .agent-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    .agent-stat {
      text-align: center;
    }
    .agent-stat .value {
      font-size: 14px;
      font-weight: 600;
      color: #eee;
    }
    .agent-stat .label {
      font-size: 10px;
      color: #666;
    }
    .agent-actions {
      display: flex;
      gap: 10px;
    }
    .agent-actions button {
      flex: 1;
      padding: 10px;
      border: 1px solid #333;
      border-radius: 6px;
      background: transparent;
      color: #eee;
      cursor: pointer;
      font-size: 13px;
    }
    .agent-actions button:hover {
      background: rgba(255,255,255,0.1);
    }
    .agent-actions button.primary {
      background: #00d4ff;
      color: #000;
      border: none;
    }
    .global-actions {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }
    .global-actions button {
      padding: 12px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }
    .global-actions .run-all {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: #000;
      font-weight: bold;
    }
    .global-actions .test {
      background: #ffc107;
      color: #000;
    }
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .loading.active { display: flex; }
    .loader {
      width: 50px;
      height: 50px;
      border: 3px solid #333;
      border-top-color: #00d4ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <h1>🤖 Booking Verification Agents</h1>
  
  <div class="global-actions">
    <button class="run-all" onclick="runAllAgents()">▶️ הרץ את כל הסוכנים</button>
    <button class="test" onclick="runTestAgents()">🧪 הרץ עם נתוני בדיקה</button>
    <button onclick="location.reload()">🔄 רענן</button>
    <button onclick="location.href='/api/alerts?format=html'">🚨 התראות</button>
  </div>

  <div class="dashboard-grid">
    <div>
      <h2>סוכנים פעילים</h2>
      <div class="agents-container">
        ${agentsHtml}
      </div>
    </div>
    
    <div class="request-stats">
      <h2>סטטיסטיקת בקשות</h2>
      <div class="stats-row">
        <div class="stat-box">
          <div class="value">${requestStats.total}</div>
          <div class="label">סה"כ בקשות</div>
        </div>
        <div class="stat-box">
          <div class="value" style="color: ${requestStats.active > 0 ? '#ffc107' : '#28a745'}">${requestStats.active}</div>
          <div class="label">בקשות פעילות</div>
        </div>
        <div class="stat-box">
          <div class="value" style="color: #28a745">${requestStats.completed}</div>
          <div class="label">הושלמו</div>
        </div>
        <div class="stat-box">
          <div class="value" style="color: #dc3545">${requestStats.failed}</div>
          <div class="label">נכשלו</div>
        </div>
      </div>
      
      <h2>לפי סוג</h2>
      ${Object.entries(requestStats.byType || {}).map(([type, count]) => `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;">
          <span>${type}</span>
          <span style="color: #00d4ff">${count}</span>
        </div>
      `).join("")}
      
      <h2 style="margin-top: 20px;">זמן ממוצע (ms)</h2>
      ${Object.entries(requestStats.avgDuration || {}).map(([type, avg]) => `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;">
          <span>${type}</span>
          <span style="color: #ffc107">${avg}ms</span>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="loading" id="loadingOverlay">
    <div class="loader"></div>
  </div>

  <script>
    function showLoading() {
      document.getElementById('loadingOverlay').classList.add('active');
    }
    function hideLoading() {
      document.getElementById('loadingOverlay').classList.remove('active');
    }

    async function runAgent(agentId) {
      showLoading();
      try {
        const response = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'run', agentId })
        });
        const data = await response.json();
        if (data.success) {
          alert('הסוכן הסתיים. בעיות שנמצאו: ' + (data.result?.issuesFound || 0));
        }
        location.reload();
      } catch (error) {
        alert('שגיאה בהרצת הסוכן');
        hideLoading();
      }
    }

    async function runAllAgents() {
      showLoading();
      try {
        const response = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'run' })
        });
        const data = await response.json();
        if (data.success) {
          const totalIssues = data.results.reduce((sum, r) => sum + r.issuesFound, 0);
          alert('כל הסוכנים הסתיימו. סה"כ בעיות: ' + totalIssues);
        }
        location.reload();
      } catch (error) {
        alert('שגיאה בהרצת הסוכנים');
        hideLoading();
      }
    }

    async function runTestAgents() {
      showLoading();
      try {
        const response = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'test' })
        });
        const data = await response.json();
        if (data.success) {
          const totalIssues = data.results.reduce((sum, r) => sum + r.issuesFound, 0);
          alert('בדיקה הסתיימה עם ' + data.mockBookingsUsed + ' הזמנות מדומות.\\nבעיות שנמצאו: ' + totalIssues);
        }
        location.reload();
      } catch (error) {
        alert('שגיאה בהרצת הבדיקה');
        hideLoading();
      }
    }

    async function toggleAgent(agentId, enable) {
      try {
        await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: enable ? 'enable' : 'disable', agentId })
        });
        location.reload();
      } catch (error) {
        alert('שגיאה בעדכון הסוכן');
      }
    }
  </script>
</body>
</html>
  `
}
