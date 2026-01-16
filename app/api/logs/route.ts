// API Logs Viewer Endpoint
// GET /api/logs - View recent API logs
// POST /api/logs - Filter logs

import { NextRequest, NextResponse } from "next/server"
import { apiLogger, type ApiLogEntry, type LogLevel } from "@/lib/logging/api-logger"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const count = parseInt(searchParams.get("count") || "100")
  const level = searchParams.get("level") as LogLevel | null
  const category = searchParams.get("category") as ApiLogEntry["category"] | null
  const format = searchParams.get("format") || "json" // json or html
  
  const filter: Partial<ApiLogEntry> = {}
  if (level) filter.level = level
  if (category) filter.category = category
  
  const logs = apiLogger.getRecentLogs(count, Object.keys(filter).length > 0 ? filter : undefined)
  
  if (format === "html") {
    return new NextResponse(generateHtmlView(logs), {
      headers: { "Content-Type": "text/html" },
    })
  }
  
  return NextResponse.json({
    success: true,
    count: logs.length,
    logs,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { count = 100, level, category, action, from, to } = body
  
  let logs = apiLogger.getRecentLogs(count * 2) // Get more, then filter
  
  // Apply filters
  if (level) {
    logs = logs.filter(log => log.level === level)
  }
  if (category) {
    logs = logs.filter(log => log.category === category)
  }
  if (action) {
    logs = logs.filter(log => log.action.toLowerCase().includes(action.toLowerCase()))
  }
  if (from) {
    const fromDate = new Date(from)
    logs = logs.filter(log => new Date(log.timestamp) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to)
    logs = logs.filter(log => new Date(log.timestamp) <= toDate)
  }
  
  return NextResponse.json({
    success: true,
    count: Math.min(logs.length, count),
    logs: logs.slice(0, count),
  })
}

function generateHtmlView(logs: ApiLogEntry[]): string {
  const levelColors: Record<LogLevel, string> = {
    debug: "#888",
    info: "#17a2b8",
    warn: "#ffc107",
    error: "#dc3545",
  }
  
  const categoryIcons: Record<string, string> = {
    api: "🌐",
    medici: "🏨",
    booking: "📋",
    auth: "🔐",
    system: "⚙️",
  }
  
  const logsHtml = logs.map(log => {
    const time = new Date(log.timestamp).toLocaleString("he-IL")
    const icon = categoryIcons[log.category] || "📝"
    const levelColor = levelColors[log.level]
    
    return `
      <div class="log-entry log-${log.level}">
        <div class="log-header">
          <span class="log-time">${time}</span>
          <span class="log-icon">${icon}</span>
          <span class="log-level" style="background: ${levelColor}">${log.level.toUpperCase()}</span>
          <span class="log-action">${log.action}</span>
          ${log.method ? `<span class="log-method method-${log.method.toLowerCase()}">${log.method}</span>` : ""}
          ${log.endpoint ? `<span class="log-endpoint">${log.endpoint}</span>` : ""}
          ${log.statusCode ? `<span class="log-status status-${Math.floor(log.statusCode / 100)}xx">${log.statusCode}</span>` : ""}
          ${log.duration ? `<span class="log-duration">${log.duration}ms</span>` : ""}
        </div>
        ${log.error ? `<div class="log-error">❌ ${log.error}</div>` : ""}
        ${log.requestBody ? `<details class="log-details"><summary>Request Body</summary><pre>${JSON.stringify(log.requestBody, null, 2)}</pre></details>` : ""}
        ${log.responseBody ? `<details class="log-details"><summary>Response Body</summary><pre>${JSON.stringify(log.responseBody, null, 2)}</pre></details>` : ""}
      </div>
    `
  }).join("")
  
  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Logs - Booking Engine</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, sans-serif; 
      background: #1a1a2e; 
      color: #eee;
      padding: 20px;
    }
    h1 { 
      color: #00d4ff; 
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filters select, .filters input, .filters button {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #333;
      background: #2a2a4a;
      color: #eee;
    }
    .filters button {
      background: #00d4ff;
      color: #000;
      cursor: pointer;
      font-weight: bold;
    }
    .filters button:hover { background: #00b8e6; }
    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat {
      background: #2a2a4a;
      padding: 15px 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value { font-size: 24px; font-weight: bold; color: #00d4ff; }
    .stat-label { font-size: 12px; color: #888; }
    .logs-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .log-entry {
      background: #2a2a4a;
      border-radius: 8px;
      padding: 12px;
      border-right: 4px solid #333;
    }
    .log-entry.log-error { border-right-color: #dc3545; }
    .log-entry.log-warn { border-right-color: #ffc107; }
    .log-entry.log-info { border-right-color: #17a2b8; }
    .log-entry.log-debug { border-right-color: #888; }
    .log-header {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .log-time { color: #888; font-size: 12px; }
    .log-icon { font-size: 16px; }
    .log-level {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      color: #fff;
    }
    .log-action { font-weight: 500; }
    .log-method {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .method-get { background: #28a745; color: #fff; }
    .method-post { background: #007bff; color: #fff; }
    .method-put { background: #ffc107; color: #000; }
    .method-delete { background: #dc3545; color: #fff; }
    .log-endpoint { color: #aaa; font-family: monospace; font-size: 13px; }
    .log-status {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .status-2xx { background: #28a745; color: #fff; }
    .status-3xx { background: #17a2b8; color: #fff; }
    .status-4xx { background: #ffc107; color: #000; }
    .status-5xx { background: #dc3545; color: #fff; }
    .log-duration { color: #ff9f43; font-size: 12px; }
    .log-error {
      margin-top: 8px;
      padding: 8px;
      background: rgba(220, 53, 69, 0.2);
      border-radius: 4px;
      color: #ff6b6b;
    }
    .log-details {
      margin-top: 8px;
    }
    .log-details summary {
      cursor: pointer;
      color: #888;
      font-size: 12px;
    }
    .log-details pre {
      margin-top: 8px;
      padding: 10px;
      background: #1a1a2e;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 11px;
      max-height: 200px;
      overflow-y: auto;
    }
    .refresh-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #00d4ff;
      color: #000;
      border: none;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0,212,255,0.4);
    }
    .auto-refresh {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .auto-refresh input { width: 16px; height: 16px; }
  </style>
</head>
<body>
  <h1>📊 API Logs Dashboard</h1>
  
  <div class="filters">
    <select id="levelFilter">
      <option value="">כל הרמות</option>
      <option value="debug">Debug</option>
      <option value="info">Info</option>
      <option value="warn">Warning</option>
      <option value="error">Error</option>
    </select>
    <select id="categoryFilter">
      <option value="">כל הקטגוריות</option>
      <option value="api">API</option>
      <option value="medici">Medici</option>
      <option value="booking">Booking</option>
      <option value="auth">Auth</option>
      <option value="system">System</option>
    </select>
    <input type="number" id="countFilter" value="100" min="10" max="500" style="width: 80px;">
    <button onclick="applyFilters()">סנן</button>
    <button onclick="location.reload()">🔄 רענן</button>
    <div class="auto-refresh">
      <input type="checkbox" id="autoRefresh">
      <label for="autoRefresh">רענון אוטומטי</label>
    </div>
  </div>
  
  <div class="stats">
    <div class="stat">
      <div class="stat-value">${logs.length}</div>
      <div class="stat-label">סה"כ לוגים</div>
    </div>
    <div class="stat">
      <div class="stat-value">${logs.filter(l => l.level === "error").length}</div>
      <div class="stat-label">שגיאות</div>
    </div>
    <div class="stat">
      <div class="stat-value">${logs.filter(l => l.category === "medici").length}</div>
      <div class="stat-label">קריאות Medici</div>
    </div>
    <div class="stat">
      <div class="stat-value">${logs.filter(l => l.duration).reduce((sum, l) => sum + (l.duration || 0), 0) / Math.max(logs.filter(l => l.duration).length, 1) | 0}ms</div>
      <div class="stat-label">זמן ממוצע</div>
    </div>
  </div>
  
  <div class="logs-container">
    ${logsHtml || '<div style="text-align: center; padding: 40px; color: #888;">אין לוגים להצגה</div>'}
  </div>
  
  <script>
    function applyFilters() {
      const level = document.getElementById('levelFilter').value;
      const category = document.getElementById('categoryFilter').value;
      const count = document.getElementById('countFilter').value;
      
      let url = '/api/logs?format=html';
      if (level) url += '&level=' + level;
      if (category) url += '&category=' + category;
      if (count) url += '&count=' + count;
      
      window.location.href = url;
    }
    
    // Auto-refresh
    document.getElementById('autoRefresh').addEventListener('change', function() {
      if (this.checked) {
        window.refreshInterval = setInterval(() => location.reload(), 5000);
      } else {
        clearInterval(window.refreshInterval);
      }
    });
  </script>
</body>
</html>
  `
}
