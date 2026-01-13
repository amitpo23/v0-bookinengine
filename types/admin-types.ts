// Admin System Types - Complete Management System

export type TemplateStatus = 'active' | 'inactive' | 'maintenance' | 'development';
export type LogLevel = 'info' | 'warning' | 'error' | 'critical' | 'success';
export type ActivityType = 'login' | 'logout' | 'template_access' | 'settings_change' | 'booking' | 'api_call' | 'error';

/**
 * Template Configuration
 */
export interface TemplateConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  path: string;
  status: TemplateStatus;
  category: 'booking' | 'showcase' | 'chatbot' | 'admin';
  thumbnail?: string;
  features: string[];
  requiredPermissions: string[];
  allowedRoles: string[];
  enabled: boolean;
  maintenanceMessage?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    maxUsers?: number;
    rateLimit?: number;
    requiresAuth?: boolean;
    allowEmbedding?: boolean;
    customCss?: string;
    customJs?: string;
  };
}

/**
 * Activity Log Entry
 */
export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  type: ActivityType;
  action: string;
  description: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  templateId?: string;
  templateName?: string;
  success: boolean;
  errorMessage?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * System Log Entry
 */
export interface SystemLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  details?: Record<string, any>;
  stackTrace?: string;
  userId?: string;
  templateId?: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

/**
 * User Session
 */
export interface UserSession {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: string;
  loginTime: Date;
  lastActivity: Date;
  ip: string;
  userAgent: string;
  active: boolean;
  logoutTime?: Date;
  sessionDuration?: number;
  pageViews: number;
  actionsPerformed: number;
}

/**
 * Knowledge Base Article
 */
export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  summary: string;
  tags: string[];
  relatedArticles: string[];
  relatedTemplates: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
  searchKeywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

/**
 * System Guideline
 */
export interface SystemGuideline {
  id: string;
  title: string;
  category: 'security' | 'operations' | 'development' | 'support' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  enforcedRules: string[];
  applicableRoles: string[];
  applicableTemplates: string[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  mandatory: boolean;
}

/**
 * Template Permission
 */
export interface TemplatePermission {
  templateId: string;
  roleId: string;
  roleName: string;
  canView: boolean;
  canEdit: boolean;
  canConfigure: boolean;
  canDelete: boolean;
  canShare: boolean;
  customPermissions: Record<string, boolean>;
  restrictions: {
    maxDailyAccess?: number;
    allowedHours?: { start: string; end: string };
    ipWhitelist?: string[];
  };
}

/**
 * Global System Settings
 */
export interface SystemSettings {
  id: string;
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    maintenanceMessage?: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    twoFactorEnabled: boolean;
    ipWhitelist: string[];
  };
  logging: {
    retentionDays: number;
    logLevel: LogLevel;
    enableActivityLog: boolean;
    enableSystemLog: boolean;
    enableErrorTracking: boolean;
  };
  notifications: {
    emailOnError: boolean;
    emailOnLogin: boolean;
    emailOnTemplateChange: boolean;
    slackWebhook?: string;
  };
  api: {
    rateLimit: number;
    rateLimitWindow: number;
    enableCors: boolean;
    allowedOrigins: string[];
  };
  templates: {
    defaultStatus: TemplateStatus;
    requireApproval: boolean;
    autoBackup: boolean;
    backupInterval: number;
  };
}

/**
 * Dashboard Statistics
 */
export interface AdminDashboardStats {
  templates: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  };
  users: {
    totalSessions: number;
    activeSessions: number;
    todayLogins: number;
    uniqueUsers: number;
  };
  activity: {
    todayActions: number;
    todayBookings: number;
    todayErrors: number;
    averageResponseTime: number;
  };
  logs: {
    todayLogs: number;
    unresolvedErrors: number;
    criticalIssues: number;
  };
  performance: {
    avgLoadTime: number;
    uptime: number;
    requestsPerSecond: number;
  };
}

/**
 * Template Analytics
 */
export interface TemplateAnalytics {
  templateId: string;
  templateName: string;
  period: { start: Date; end: Date };
  metrics: {
    views: number;
    uniqueVisitors: number;
    bookings: number;
    errors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  topUsers: Array<{
    userId: string;
    userName: string;
    visits: number;
    bookings: number;
  }>;
  errorBreakdown: Record<string, number>;
  popularFeatures: Array<{
    feature: string;
    usage: number;
  }>;
}

/**
 * Audit Trail Entry
 */
export interface AuditTrail {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  ip: string;
  userAgent: string;
  success: boolean;
  reason?: string;
}

/**
 * Alert Configuration
 */
export interface AlertConfig {
  id: string;
  name: string;
  condition: {
    type: 'error_rate' | 'response_time' | 'login_failures' | 'custom';
    threshold: number;
    timeWindow: number;
  };
  actions: {
    email?: string[];
    slack?: boolean;
    webhook?: string;
  };
  enabled: boolean;
  lastTriggered?: Date;
}
