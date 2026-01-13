// Audit Log System - תיקון 14 לחוק הגנת הפרטיות
// מערכת רישום מלאה של כל פעולות המשתמשים במערכת

import { supabaseAdmin } from '@/lib/supabase'

/**
 * סוגי אירועי אבטחה שיש לתעד
 */
export enum AuditAction {
  // Authentication - אימות
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  
  // User Management - ניהול משתמשים
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ANONYMIZED = 'USER_ANONYMIZED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  
  // Data Access - גישה למידע
  DATA_VIEWED = 'DATA_VIEWED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  SENSITIVE_DATA_ACCESSED = 'SENSITIVE_DATA_ACCESSED',
  PII_ACCESSED = 'PII_ACCESSED', // Personal Identifiable Information
  
  // Bookings - הזמנות
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_VIEWED = 'BOOKING_VIEWED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_REFUNDED = 'BOOKING_REFUNDED',
  
  // Configuration - תצורה
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  TEMPLATE_MODIFIED = 'TEMPLATE_MODIFIED',
  TEMPLATE_CREATED = 'TEMPLATE_CREATED',
  TEMPLATE_DELETED = 'TEMPLATE_DELETED',
  API_KEY_ACCESSED = 'API_KEY_ACCESSED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  
  // Security Events - אירועי אבטחה
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  SESSION_HIJACK_ATTEMPT = 'SESSION_HIJACK_ATTEMPT',
  
  // Privacy - פרטיות
  DATA_EXPORT_REQUESTED = 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED = 'DATA_DELETION_REQUESTED',
  CONSENT_GIVEN = 'CONSENT_GIVEN',
  CONSENT_WITHDRAWN = 'CONSENT_WITHDRAWN',
  PRIVACY_POLICY_VIEWED = 'PRIVACY_POLICY_VIEWED',
  
  // System - מערכת
  BACKUP_CREATED = 'BACKUP_CREATED',
  BACKUP_RESTORED = 'BACKUP_RESTORED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  DATABASE_QUERY = 'DATABASE_QUERY',
}

/**
 * רמות חומרה של אירועי אבטחה
 */
export enum AuditSeverity {
  INFO = 'INFO',       // מידע רגיל
  LOW = 'LOW',         // חשיבות נמוכה
  MEDIUM = 'MEDIUM',   // חשיבות בינונית
  HIGH = 'HIGH',       // חשיבות גבוהה
  CRITICAL = 'CRITICAL', // קריטי - דורש תגובה מיידית
}

/**
 * ממשק לרשומת audit log
 */
export interface AuditLogEntry {
  id?: string
  timestamp: Date
  userId: string
  userEmail: string
  ipAddress: string
  userAgent: string
  action: AuditAction
  severity: AuditSeverity
  resource: string
  resourceId?: string
  oldValue?: any
  newValue?: any
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
  sessionId?: string
  requestId?: string
}

/**
 * מחלקת Audit Logger
 * אחראית על תיעוד כל פעולות המשתמשים
 */
class AuditLogger {
  private isEnabled: boolean = true

  /**
   * רושם אירוע אבטחה
   */
  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    if (!this.isEnabled) return

    try {
      const logEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date(),
      }

      // שמירה ב-Supabase
      if (!supabaseAdmin) return;
      const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert({
          timestamp: logEntry.timestamp.toISOString(),
          user_id: logEntry.userId,
          user_email: logEntry.userEmail,
          ip_address: logEntry.ipAddress,
          user_agent: logEntry.userAgent,
          action: logEntry.action,
          severity: logEntry.severity,
          resource: logEntry.resource,
          resource_id: logEntry.resourceId,
          old_value: logEntry.oldValue,
          new_value: logEntry.newValue,
          success: logEntry.success,
          error_message: logEntry.errorMessage,
          metadata: logEntry.metadata,
          session_id: logEntry.sessionId,
          request_id: logEntry.requestId,
        })

      if (error) {
        console.error('❌ Failed to write audit log:', error)
        // Fallback: שמירה מקומית/external service
        await this.fallbackLog(logEntry)
      }

      // אם זה אירוע קריטי - שלח התראה מיידית
      if (this.isCritical(entry.severity)) {
        await this.sendSecurityAlert(logEntry)
      }

      // Log ל-console בסביבת development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Audit Log] ${entry.action}:`, {
          user: entry.userEmail,
          resource: entry.resource,
          success: entry.success,
        })
      }
    } catch (error) {
      console.error('❌ Audit log error:', error)
      // לא לזרוק שגיאה - Audit log לא צריך לשבור את המערכת
    }
  }

  // ==================== Authentication Events ====================

  /**
   * רישום כניסת משתמש מוצלחת
   */
  async logLogin(
    userId: string,
    email: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent,
      action: AuditAction.LOGIN,
      severity: AuditSeverity.INFO,
      resource: 'authentication',
      success: true,
    })
  }

  /**
   * רישום ניסיון כניסה כושל
   */
  async logLoginFailed(
    email: string,
    ip: string,
    userAgent: string,
    reason: string
  ): Promise<void> {
    await this.log({
      userId: 'anonymous',
      userEmail: email,
      ipAddress: ip,
      userAgent,
      action: AuditAction.LOGIN_FAILED,
      severity: AuditSeverity.MEDIUM,
      resource: 'authentication',
      success: false,
      errorMessage: reason,
    })
  }

  /**
   * רישום יציאה
   */
  async logLogout(userId: string, email: string, ip: string): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.LOGOUT,
      severity: AuditSeverity.INFO,
      resource: 'authentication',
      success: true,
    })
  }

  // ==================== Data Access Events ====================

  /**
   * רישום גישה למידע רגיש
   */
  async logDataAccess(
    userId: string,
    email: string,
    resource: string,
    resourceId: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent,
      action: AuditAction.SENSITIVE_DATA_ACCESSED,
      severity: AuditSeverity.MEDIUM,
      resource,
      resourceId,
      success: true,
    })
  }

  /**
   * רישום יצוא מידע
   */
  async logDataExport(
    userId: string,
    email: string,
    dataType: string,
    recordCount: number,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.DATA_EXPORTED,
      severity: AuditSeverity.HIGH,
      resource: dataType,
      success: true,
      metadata: { recordCount },
    })
  }

  // ==================== User Management Events ====================

  /**
   * רישום שינוי תפקיד משתמש
   */
  async logRoleChange(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    oldRole: string,
    newRole: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId: adminId,
      userEmail: adminEmail,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.ROLE_CHANGED,
      severity: AuditSeverity.HIGH,
      resource: 'user_roles',
      resourceId: targetUserId,
      oldValue: { role: oldRole },
      newValue: { role: newRole },
      success: true,
    })
  }

  /**
   * רישום מחיקת משתמש
   */
  async logUserDeleted(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    targetEmail: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId: adminId,
      userEmail: adminEmail,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.USER_DELETED,
      severity: AuditSeverity.CRITICAL,
      resource: 'users',
      resourceId: targetUserId,
      metadata: { deletedEmail: targetEmail },
      success: true,
    })
  }

  // ==================== Booking Events ====================

  /**
   * רישום יצירת הזמנה
   */
  async logBookingCreated(
    userId: string,
    email: string,
    bookingId: string,
    hotelName: string,
    totalPrice: number,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.BOOKING_CREATED,
      severity: AuditSeverity.INFO,
      resource: 'bookings',
      resourceId: bookingId,
      metadata: { hotelName, totalPrice },
      success: true,
    })
  }

  /**
   * רישום ביטול הזמנה
   */
  async logBookingCancelled(
    userId: string,
    email: string,
    bookingId: string,
    reason: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.BOOKING_CANCELLED,
      severity: AuditSeverity.MEDIUM,
      resource: 'bookings',
      resourceId: bookingId,
      metadata: { reason },
      success: true,
    })
  }

  // ==================== Security Events ====================

  /**
   * רישום ניסיון גישה לא מורשית
   */
  async logUnauthorizedAccess(
    userId: string,
    email: string,
    resource: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent,
      action: AuditAction.UNAUTHORIZED_ACCESS,
      severity: AuditSeverity.CRITICAL,
      resource,
      success: false,
      errorMessage: 'Unauthorized access attempt',
    })
  }

  /**
   * רישום חריגה בקצב בקשות (Rate Limit)
   */
  async logRateLimitExceeded(
    userId: string,
    email: string,
    endpoint: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.RATE_LIMIT_EXCEEDED,
      severity: AuditSeverity.HIGH,
      resource: endpoint,
      success: false,
      errorMessage: 'Too many requests',
    })
  }

  /**
   * רישום פעילות חשודה
   */
  async logSuspiciousActivity(
    userId: string,
    email: string,
    description: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent,
      action: AuditAction.SUSPICIOUS_ACTIVITY,
      severity: AuditSeverity.CRITICAL,
      resource: 'security',
      success: false,
      errorMessage: description,
    })
  }

  // ==================== Configuration Events ====================

  /**
   * רישום שינוי הגדרות
   */
  async logSettingsChanged(
    userId: string,
    email: string,
    settingName: string,
    oldValue: any,
    newValue: any,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.SETTINGS_CHANGED,
      severity: AuditSeverity.MEDIUM,
      resource: 'settings',
      resourceId: settingName,
      oldValue,
      newValue,
      success: true,
    })
  }

  /**
   * רישום גישה ל-API key
   */
  async logApiKeyAccessed(
    userId: string,
    email: string,
    keyName: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.API_KEY_ACCESSED,
      severity: AuditSeverity.HIGH,
      resource: 'api_keys',
      resourceId: keyName,
      success: true,
    })
  }

  // ==================== Query & Analytics ====================

  /**
   * שאילתת לוגים לפי פילטרים
   */
  async query(filters: {
    userId?: string
    action?: AuditAction
    severity?: AuditSeverity
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<AuditLogEntry[]> {
    try {
      if (!supabaseAdmin) {
        console.warn('[Audit Log] Supabase admin client not available');
        return [];
      }

      let query = supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })

      if (filters.userId) query = query.eq('user_id', filters.userId)
      if (filters.action) query = query.eq('action', filters.action)
      if (filters.severity) query = query.eq('severity', filters.severity)
      if (filters.startDate) query = query.gte('timestamp', filters.startDate.toISOString())
      if (filters.endDate) query = query.lte('timestamp', filters.endDate.toISOString())
      
      if (filters.limit) query = query.limit(filters.limit)
      if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 100))

      const { data, error } = await query

      if (error) throw error

      return (data || []).map(row => ({
        id: row.id,
        timestamp: new Date(row.timestamp),
        userId: row.user_id,
        userEmail: row.user_email,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        action: row.action as AuditAction,
        severity: row.severity as AuditSeverity,
        resource: row.resource,
        resourceId: row.resource_id,
        oldValue: row.old_value,
        newValue: row.new_value,
        success: row.success,
        errorMessage: row.error_message,
        metadata: row.metadata,
        sessionId: row.session_id,
        requestId: row.request_id,
      }))
    } catch (error) {
      console.error('Failed to query audit logs:', error)
      return []
    }
  }

  /**
   * סטטיסטיקות לוגים
   */
  async getStats(userId?: string): Promise<{
    totalEvents: number
    failedLogins: number
    suspiciousActivities: number
    criticalEvents: number
  }> {
    try {
      if (!supabaseAdmin) {
        console.warn('[Audit Log] Supabase admin client not available');
        return {
          totalEvents: 0,
          failedLogins: 0,
          suspiciousActivities: 0,
          criticalEvents: 0
        };
      }

      let query = supabaseAdmin.from('audit_logs').select('action, severity, success', { count: 'exact' })
      
      if (userId) query = query.eq('user_id', userId)

      const { data, count } = await query

      return {
        totalEvents: count || 0,
        failedLogins: data?.filter(e => e.action === AuditAction.LOGIN_FAILED).length || 0,
        suspiciousActivities: data?.filter(e => e.action === AuditAction.SUSPICIOUS_ACTIVITY).length || 0,
        criticalEvents: data?.filter(e => e.severity === AuditSeverity.CRITICAL).length || 0,
      }
    } catch (error) {
      console.error('Failed to get audit stats:', error)
      return { totalEvents: 0, failedLogins: 0, suspiciousActivities: 0, criticalEvents: 0 }
    }
  }

  // ==================== Utilities ====================

  /**
   * בדיקה אם אירוע קריטי
   */
  private isCritical(severity: AuditSeverity): boolean {
    return severity === AuditSeverity.CRITICAL
  }

  /**
   * שליחת התראת אבטחה (לעתיד - Slack/Email/SMS)
   */
  private async sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
    console.error('🚨 SECURITY ALERT 🚨', {
      action: entry.action,
      user: entry.userEmail,
      resource: entry.resource,
      timestamp: entry.timestamp,
      ip: entry.ipAddress,
    })

    // TODO: שילוב עם Slack/Email/SMS
    // await sendSlackAlert(entry)
    // await sendEmailAlert(entry)
  }

  /**
   * Fallback logging במקרה של כשל
   */
  private async fallbackLog(entry: AuditLogEntry): Promise<void> {
    // Log to console as fallback
    console.log('[Audit Log Fallback]', JSON.stringify(entry, null, 2))
    
    // TODO: שמירה לקובץ מקומי או external logging service
    // await fs.appendFile('./logs/audit.log', JSON.stringify(entry) + '\n')
  }

  /**
   * החל/בטל audit logging
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger()

// Export types
// export type { AuditLogEntry } // Already exported above
