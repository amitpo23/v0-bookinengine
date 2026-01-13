// Admin System Data Management - Templates, Logs, Sessions, Knowledge Base

import type {
  TemplateConfig,
  ActivityLog,
  SystemLog,
  UserSession,
  KnowledgeArticle,
  SystemGuideline,
  TemplatePermission,
  SystemSettings,
  AdminDashboardStats,
  TemplateAnalytics,
  AuditTrail,
} from "@/types/admin-types"

/**
 * Mock Templates Data - All Available Templates
 */
export const TEMPLATES_DATA: TemplateConfig[] = [
  {
    id: "nara",
    name: "nara",
    displayName: "NARA - מנוע הזמנות קלאסי",
    description: "מנוע הזמנות מודרני ונקי עם UI פשוט וידידותי",
    path: "/templates/nara",
    status: "active",
    category: "booking",
    thumbnail: "/nara-thumb.jpg",
    features: ["Search", "Booking", "Calendar", "Price Display"],
    requiredPermissions: ["templates.view", "booking.create"],
    allowedRoles: ["admin", "manager", "agent"],
    enabled: true,
    version: "1.0.0",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
      rateLimit: 100,
    },
  },
  {
    id: "modern-dark",
    name: "modern-dark",
    displayName: "Modern Dark - עיצוב מודרני כהה",
    description: "מנוע הזמנות עם עיצוב dark mode מתקדם",
    path: "/templates/modern-dark",
    status: "active",
    category: "booking",
    thumbnail: "/modern-dark-thumb.jpg",
    features: ["Dark Mode", "Animations", "Modern UI"],
    requiredPermissions: ["templates.view"],
    allowedRoles: ["admin", "manager", "agent", "viewer"],
    enabled: true,
    version: "1.2.0",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
    },
  },
  {
    id: "luxury",
    name: "luxury",
    displayName: "Luxury - יוקרתי",
    description: "מנוע הזמנות עם עיצוב יוקרתי ואלגנטי",
    path: "/templates/luxury",
    status: "active",
    category: "booking",
    features: ["Premium Design", "Animations", "Gallery"],
    requiredPermissions: ["templates.view"],
    allowedRoles: ["admin", "manager"],
    enabled: true,
    version: "1.1.0",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: false,
    },
  },
  {
    id: "family",
    name: "family",
    displayName: "Family - משפחתי",
    description: "מנוע מותאם למשפחות עם ילדים",
    path: "/templates/family",
    status: "active",
    category: "booking",
    features: ["Child Age Selection", "Family Rooms", "Special Offers"],
    requiredPermissions: ["templates.view"],
    allowedRoles: ["admin", "manager", "agent"],
    enabled: true,
    version: "1.0.0",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
    },
  },
  {
    id: "scarlet",
    name: "scarlet",
    displayName: "Scarlet - אדום אלגנטי",
    description: "מנוע בעיצוב אדום אלגנטי עם תמונות גדולות",
    path: "/templates/scarlet",
    status: "active",
    category: "booking",
    features: ["Large Images", "Elegant Design", "Booking Flow"],
    requiredPermissions: ["templates.view"],
    allowedRoles: ["admin", "manager"],
    enabled: true,
    version: "2.0.0",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
    },
  },
  {
    id: "sunday",
    name: "sunday",
    displayName: "Sunday - רכיבים מקצועיים",
    description: "טמפלט עם 8 רכיבי UI מקצועיים ואינטגרציית Tavily",
    path: "/templates/sunday",
    status: "active",
    category: "showcase",
    features: ["8 UI Components", "Tavily Integration", "Grid/List Views", "Professional Design"],
    requiredPermissions: ["templates.view", "templates.advanced"],
    allowedRoles: ["admin", "manager"],
    enabled: true,
    version: "1.0.0",
    createdAt: new Date("2026-01-12"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
      rateLimit: 50,
    },
  },
  {
    id: "sunday-hotel",
    name: "sunday-hotel",
    displayName: "Sunday Hotels - אתר מלא",
    description: "אתר הזמנת מלונות מלא עם כל התכונות",
    path: "/templates/sunday-hotel",
    status: "active",
    category: "showcase",
    features: ["Full Website", "Multi-page", "Advanced Search"],
    requiredPermissions: ["templates.view", "templates.advanced"],
    allowedRoles: ["admin"],
    enabled: true,
    version: "1.5.0",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: true,
      allowEmbedding: false,
      maxUsers: 100,
    },
  },
  {
    id: "knowaachat",
    name: "knowaachat",
    displayName: "KnowaaChat - צ'אט AI",
    description: "צ'אטבוט AI לשירות לקוחות",
    path: "/templates/knowaachat",
    status: "active",
    category: "chatbot",
    features: ["AI Chat", "NLP", "24/7 Support"],
    requiredPermissions: ["templates.view", "ai.use"],
    allowedRoles: ["admin", "manager"],
    enabled: true,
    version: "3.0.0",
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: true,
      allowEmbedding: true,
      rateLimit: 20,
    },
  },
  {
    id: "chatbot-ui",
    name: "chatbot-ui",
    displayName: "Chatbot UI - ממשק צ'אט",
    description: "ממשק צ'אט מתקדם",
    path: "/templates/chatbot-ui",
    status: "active",
    category: "chatbot",
    features: ["Modern Chat UI", "Typing Indicators", "File Upload"],
    requiredPermissions: ["templates.view"],
    allowedRoles: ["admin", "manager", "agent"],
    enabled: true,
    version: "1.0.0",
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: false,
      allowEmbedding: true,
    },
  },
  {
    id: "ai-travel-agent",
    name: "ai-travel-agent",
    displayName: "AI Travel Agent - סוכן נסיעות AI",
    description: "סוכן נסיעות מבוסס AI",
    path: "/templates/ai-travel-agent",
    status: "active",
    category: "chatbot",
    features: ["AI Recommendations", "Smart Search", "Personalization"],
    requiredPermissions: ["templates.view", "ai.use"],
    allowedRoles: ["admin", "manager"],
    enabled: true,
    version: "2.1.0",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    settings: {
      requiresAuth: true,
      allowEmbedding: false,
      rateLimit: 30,
    },
  },
]

/**
 * Generate Mock Activity Logs
 */
export function generateMockActivityLogs(count: number = 50): ActivityLog[] {
  const actions = [
    { type: "login", action: "User Login", description: "משתמש התחבר למערכת" },
    { type: "template_access", action: "Template Access", description: "גישה לטמפלט" },
    { type: "booking", action: "Booking Created", description: "הזמנה חדשה נוצרה" },
    { type: "settings_change", action: "Settings Updated", description: "הגדרות עודכנו" },
    { type: "api_call", action: "API Request", description: "קריאת API" },
    { type: "error", action: "Error Occurred", description: "שגיאה התרחשה" },
    { type: "logout", action: "User Logout", description: "משתמש התנתק" },
  ]

  const users = [
    { id: "1", email: "admin@hotel.com", name: "Admin User", role: "admin" },
    { id: "2", email: "manager@hotel.com", name: "Manager User", role: "manager" },
    { id: "3", email: "agent@hotel.com", name: "Agent User", role: "agent" },
  ]

  const logs: ActivityLog[] = []
  
  for (let i = 0; i < count; i++) {
    const actionData = actions[Math.floor(Math.random() * actions.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const template = TEMPLATES_DATA[Math.floor(Math.random() * TEMPLATES_DATA.length)]
    
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      type: actionData.type as any,
      action: actionData.action,
      description: actionData.description,
      templateId: actionData.type === "template_access" ? template.id : undefined,
      templateName: actionData.type === "template_access" ? template.displayName : undefined,
      success: Math.random() > 0.1,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0...",
      duration: Math.floor(Math.random() * 3000),
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

/**
 * Generate Mock System Logs
 */
export function generateMockSystemLogs(count: number = 30): SystemLog[] {
  const categories = ["api", "database", "auth", "template", "payment", "email"]
  const messages = [
    "API request completed successfully",
    "Database connection established",
    "User authentication failed",
    "Template loaded",
    "Payment processed",
    "Email sent successfully",
    "Rate limit exceeded",
    "Invalid token",
    "Server error",
  ]

  const logs: SystemLog[] = []
  
  for (let i = 0; i < count; i++) {
    const level = Math.random() > 0.8 ? "error" : Math.random() > 0.5 ? "warning" : "info"
    logs.push({
      id: `syslog-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      level: level as any,
      category: categories[Math.floor(Math.random() * categories.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      resolved: Math.random() > 0.3,
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

/**
 * Generate Mock User Sessions
 */
export function generateMockSessions(count: number = 20): UserSession[] {
  const users = [
    { id: "1", email: "admin@hotel.com", name: "Admin User", role: "admin" },
    { id: "2", email: "manager@hotel.com", name: "Manager User", role: "manager" },
    { id: "3", email: "agent@hotel.com", name: "Agent User", role: "agent" },
  ]

  const sessions: UserSession[] = []
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const loginTime = new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000)
    const active = Math.random() > 0.5
    
    sessions.push({
      id: `session-${i}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      loginTime,
      lastActivity: new Date(loginTime.getTime() + Math.random() * 2 * 60 * 60 * 1000),
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0...",
      active,
      pageViews: Math.floor(Math.random() * 50),
      actionsPerformed: Math.floor(Math.random() * 20),
    })
  }

  return sessions.sort((a, b) => b.loginTime.getTime() - a.loginTime.getTime())
}

/**
 * Mock Knowledge Base Articles
 */
export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: "kb-1",
    title: "איך להתחיל עם מנוע ההזמנות",
    category: "getting-started",
    content: "מדריך מפורט להתחלת עבודה עם מנוע ההזמנות...",
    summary: "למד את היסודות של מנוע ההזמנות",
    tags: ["tutorial", "beginner", "setup"],
    relatedArticles: ["kb-2", "kb-3"],
    relatedTemplates: ["nara", "modern-dark"],
    author: "System Admin",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    published: true,
    views: 150,
    helpful: 45,
    notHelpful: 3,
    searchKeywords: ["התחלה", "מדריך", "יסודות"],
    difficulty: "beginner",
    estimatedReadTime: 5,
  },
  {
    id: "kb-2",
    title: "ניהול הרשאות וטמפלטים",
    category: "administration",
    content: "הסבר מפורט על מערכת ההרשאות...",
    summary: "ניהול משתמשים והרשאות",
    tags: ["permissions", "admin", "security"],
    relatedArticles: ["kb-1"],
    relatedTemplates: [],
    author: "System Admin",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date(),
    published: true,
    views: 89,
    helpful: 32,
    notHelpful: 1,
    searchKeywords: ["הרשאות", "משתמשים", "אבטחה"],
    difficulty: "intermediate",
    estimatedReadTime: 8,
  },
  {
    id: "kb-3",
    title: "שילוב טמפלטים באתר שלך",
    category: "integration",
    content: "הוראות להטמעת הטמפלטים באתר...",
    summary: "הטמעה ושילוב טמפלטים",
    tags: ["embed", "integration", "iframe"],
    relatedArticles: ["kb-1"],
    relatedTemplates: ["nara", "modern-dark", "sunday"],
    author: "Developer",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date(),
    published: true,
    views: 123,
    helpful: 67,
    notHelpful: 2,
    searchKeywords: ["הטמעה", "iframe", "שילוב"],
    difficulty: "advanced",
    estimatedReadTime: 12,
  },
]

/**
 * Mock System Guidelines
 */
export const SYSTEM_GUIDELINES: SystemGuideline[] = [
  {
    id: "guide-1",
    title: "מדיניות אבטחת מידע",
    category: "security",
    priority: "critical",
    content: "כל המשתמשים חייבים לשמור על סודיות הנתונים...",
    enforcedRules: ["strong-password", "2fa-required", "no-sharing"],
    applicableRoles: ["admin", "manager", "agent"],
    applicableTemplates: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date(),
    active: true,
    mandatory: true,
  },
  {
    id: "guide-2",
    title: "הנחיות לשימוש ב-AI",
    category: "operations",
    priority: "high",
    content: "בעת שימוש בכלי AI, יש לוודא...",
    enforcedRules: ["verify-responses", "human-oversight"],
    applicableRoles: ["admin", "manager"],
    applicableTemplates: ["knowaachat", "ai-travel-agent"],
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date(),
    active: true,
    mandatory: false,
  },
]

/**
 * Get Dashboard Statistics
 */
export function getAdminDashboardStats(): AdminDashboardStats {
  return {
    templates: {
      total: TEMPLATES_DATA.length,
      active: TEMPLATES_DATA.filter(t => t.status === "active").length,
      inactive: TEMPLATES_DATA.filter(t => t.status === "inactive").length,
      maintenance: TEMPLATES_DATA.filter(t => t.status === "maintenance").length,
    },
    users: {
      totalSessions: 45,
      activeSessions: 12,
      todayLogins: 28,
      uniqueUsers: 15,
    },
    activity: {
      todayActions: 234,
      todayBookings: 18,
      todayErrors: 3,
      averageResponseTime: 245,
    },
    logs: {
      todayLogs: 156,
      unresolvedErrors: 5,
      criticalIssues: 1,
    },
    performance: {
      avgLoadTime: 1.2,
      uptime: 99.8,
      requestsPerSecond: 45,
    },
  }
}

/**
 * Default System Settings
 */
export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  id: "settings-1",
  general: {
    siteName: "Hotel Booking Engine",
    siteUrl: "https://booking.hotel.com",
    adminEmail: "admin@hotel.com",
    timezone: "Asia/Jerusalem",
    language: "he",
    maintenanceMode: false,
  },
  security: {
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorEnabled: false,
    ipWhitelist: [],
  },
  logging: {
    retentionDays: 90,
    logLevel: "info",
    enableActivityLog: true,
    enableSystemLog: true,
    enableErrorTracking: true,
  },
  notifications: {
    emailOnError: true,
    emailOnLogin: false,
    emailOnTemplateChange: true,
  },
  api: {
    rateLimit: 100,
    rateLimitWindow: 60,
    enableCors: true,
    allowedOrigins: ["*"],
  },
  templates: {
    defaultStatus: "active",
    requireApproval: false,
    autoBackup: true,
    backupInterval: 24,
  },
}
