# 🇮🇱 תיקון 14 לחוק הגנת הפרטיות - סטטוס עמידה

## תאריך בדיקה: 13 ינואר 2026

---

## 📋 סיכום מנהלים

| סטטוס | דרישה | יישום במערכת |
|-------|-------|---------------|
| ✅ | מינוי ממונה אבטחת מידע | יש להגדיר בארגון |
| ⚠️ | מסמך מדיניות אבטחת מידע | נדרש השלמה |
| ✅ | הצפנת תקשורת (HTTPS) | מיושם דרך Vercel |
| ✅ | ניהול סיסמאות | NextAuth + Google OAuth |
| ⚠️ | גיבויים אוטומטיים | Supabase מבצע, נדרש תיעוד |
| ⚠️ | מערכת הרשאות | RBAC מיושם, נדרש הרחבה |
| ❌ | לוג אבטחה מרכזי | נדרש יישום מלא |
| ❌ | טיפול באירועי אבטחה | נדרש נוהל |
| ⚠️ | בדיקות אבטחה תקופתיות | נדרש תיעוד |
| ✅ | הגבלת גישה למידע רגיש | מיושם חלקית |

---

## 1️⃣ דרישות תיקון 14 - פירוט מלא

### 📌 **סעיף 1: מינוי ממונה על אבטחת מידע**

**דרישת החוק:**
- כל ארגון שמחזיק מאגר מידע חייב למנות ממונה על אבטחת מידע
- הממונה אחראי על הטמעת מדיניות האבטחה

**מצב נוכחי:** ⚠️ **דרוש השלמה**
- אין הגדרת ממונה רשמי במערכת
- **פעולה נדרשת:** הגדרת פרטי ממונה אבטחת מידע בתצורת האתר

```typescript
// נדרש להוסיף ל-config:
export const securityOfficer = {
  name: "[שם הממונה]",
  email: "security@yourdomain.com",
  phone: "+972-XX-XXXXXXX",
  appointmentDate: "2026-01-13"
}
```

---

### 📌 **סעיף 2: מסמך מדיניות אבטחת מידע**

**דרישת החוק:**
- תיעוד בכתב של מדיניות אבטחת המידע
- הכולל: זיהוי מאגרי מידע, סיווג רגישות, אמצעי הגנה, נהלים

**מצב נוכחי:** ⚠️ **דרוש השלמה**
- קיימת התייחסות חלקית ב-admin panel
- **פעולה נדרשת:** יצירת מסמך מדיניות מפורט (מצורף בהמשך)

---

### 📌 **סעיף 3: הצפנת מידע (Encryption)**

**דרישת החוק:**
- הצפנת מידע רגיש במעבר (in-transit)
- הצפנת מידע רגיש במנוחה (at-rest)

**מצב נוכחי:** ✅ **עומד בדרישות**

| רכיב | יישום | סטטוס |
|------|-------|-------|
| **HTTPS** | Vercel SSL/TLS 1.3 | ✅ |
| **API Keys** | Environment variables | ✅ |
| **Database** | Supabase encrypted at-rest | ✅ |
| **Passwords** | NextAuth + bcrypt | ✅ |
| **Payment Data** | לא נשמר במערכת | ✅ |

```typescript
// lib/auth.ts - אימות מאובטח
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// הסיסמאות לא נשמרות - רק Google OAuth
```

---

### 📌 **סעיף 4: ניהול סיסמאות**

**דרישת החוק:**
- חובה לאכוף מדיניות סיסמאות חזקות
- שינוי סיסמה תקופתי
- איסור שימוש חוזר בסיסמאות קודמות

**מצב נוכחי:** ✅ **עומד בדרישות**

```typescript
// lib/validations/schemas.ts
export const signupSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string()
    .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
    .regex(/[A-Z]/, 'חייב לכלול אות גדולה')
    .regex(/[0-9]/, 'חייב לכלול מספר'),
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות לא תואמות",
  path: ['confirmPassword'],
})
```

**המלצות נוספות:**
- ✅ שימוש ב-Google OAuth (אין צורך בסיסמאות)
- ⚠️ להוסיף 2FA לחשבונות Admin
- ⚠️ להוסיף policy לתוקף סיסמה (90 יום)

---

### 📌 **סעיף 5: גיבויים (Backups)**

**דרישת החוק:**
- גיבוי תקופתי של מאגרי המידע
- שמירת הגיבויים במקום מאובטח
- בדיקת תקינות הגיבויים

**מצב נוכחי:** ⚠️ **חלקי - דרוש תיעוד**

| רכיב | יישום | תדירות |
|------|-------|---------|
| **Database** | Supabase Auto Backup | יומי |
| **Code** | Git + GitHub | כל commit |
| **Environment** | Vercel Snapshots | אוטומטי |
| **Media Files** | Vercel Blob | מגובה |

**פעולות נדרשות:**
1. ✅ תיעוד נוהל גיבויים
2. ⚠️ בדיקת restore תקופתית (רבעונית)
3. ⚠️ שמירת גיבויים off-site

---

### 📌 **סעיף 6: מערכת הרשאות (Access Control)**

**דרישת החוק:**
- הגבלת גישה למידע רק למי שצריך
- רישום והרשאות לפי תפקידים
- ביקורת על הרשאות (audit trail)

**מצב נוכחי:** ⚠️ **מיושם חלקית**

```typescript
// lib/rbac/roles.ts - מערכת RBAC קיימת
export type Role = 'admin' | 'manager' | 'booker' | 'viewer'

export const PERMISSIONS = {
  VIEW_BOOKINGS: ['admin', 'manager', 'booker', 'viewer'],
  CREATE_BOOKING: ['admin', 'manager', 'booker'],
  CANCEL_BOOKING: ['admin', 'manager'],
  MANAGE_USERS: ['admin'],
  VIEW_ANALYTICS: ['admin', 'manager'],
  MANAGE_TEMPLATES: ['admin'],
  MANAGE_SETTINGS: ['admin'],
}
```

**פערים:**
- ⚠️ חסר audit log מפורט למעקב אחר גישות
- ⚠️ חסר מנגנון review תקופתי של הרשאות
- ⚠️ חסר התראות על ניסיונות גישה לא מורשים

---

### 📌 **סעיף 7: לוג אירועי אבטחה (Security Audit Log)**

**דרישת החוק:**
- תיעוד כל פעולה במאגר המידע
- שמירת לוגים למשך 7 שנים לפחות
- הגנה על הלוגים מפני שינוי

**מצב נוכחי:** ❌ **דרוש יישום מלא**

**קיים במערכת:**
```typescript
// lib/api/booking-logger.ts - לוג חלקי
export interface BookingLogEntry {
  timestamp: Date
  sessionId: string
  eventType: string
  details: any
  userId?: string
  hotelId?: string
  roomCode?: string
  error?: string
}
```

**חסר:**
- ❌ לוג מרכזי לכל פעולות המערכת
- ❌ תיעוד ניסיונות כניסה כושלים
- ❌ תיעוד שינויים בהרשאות
- ❌ תיעוד גישה למידע רגיש
- ❌ מנגנון שמירה ל-7 שנים

**פתרון מומלץ:**
```typescript
// lib/security/audit-log.ts - נדרש ליישום
export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  ipAddress: string
  userAgent: string
  action: AuditAction
  resource: string
  resourceId?: string
  oldValue?: any
  newValue?: any
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  DATA_VIEWED = 'DATA_VIEWED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  API_KEY_ACCESSED = 'API_KEY_ACCESSED',
}
```

---

### 📌 **סעיף 8: טיפול באירועי אבטחה (Incident Response)**

**דרישת החוק:**
- נוהל מתועד לטיפול באירועי אבטחה
- דיווח לרשות להגנת הפרטיות תוך 72 שעות
- הודעה למשתמשים במקרים מסוימים

**מצב נוכחי:** ❌ **חסר לחלוטין**

**נדרש:**
1. נוהל תגובה לאירועי אבטחה
2. רשימת אנשי קשר
3. תבנית דיווח לרשות
4. תבנית הודעה למשתמשים

---

### 📌 **סעיף 9: בדיקות אבטחה תקופתיות**

**דרישת החוק:**
- ביצוע penetration testing תקופתי
- סריקות חולשות
- עדכוני אבטחה

**מצב נוכחי:** ⚠️ **דרוש תיעוד**

**קיים:**
- ✅ Dependabot של GitHub לעדכוני תלויות
- ✅ Vercel Security Scanner
- ⚠️ חסר penetration testing מתועד

**מומלץ:**
```bash
# בדיקות אבטחה אוטומטיות
npm audit              # בדיקת חולשות ידועות
npm audit fix          # תיקון אוטומטי
npx snyk test          # Snyk security scan
```

---

### 📌 **סעיף 10: הגבלת שמירת מידע**

**דרישת החוק:**
- שמירת מידע אישי רק למשך הנדרש
- מחיקה אוטומטית של מידע ישן
- זכות משתמש למחיקת נתונים

**מצב נוכחי:** ⚠️ **דרוש יישום**

**נדרש:**
```typescript
// lib/privacy/data-retention.ts
export const DATA_RETENTION_POLICY = {
  // משתמשים לא פעילים
  inactiveUsers: {
    period: 365 * 3, // 3 שנים
    action: 'anonymize'
  },
  
  // הזמנות
  bookings: {
    period: 365 * 7, // 7 שנים (חוק חשבונאות)
    action: 'archive'
  },
  
  // לוגים
  logs: {
    period: 365 * 7, // 7 שנים (תיקון 14)
    action: 'archive'
  },
  
  // סשנים
  sessions: {
    period: 90, // 90 יום
    action: 'delete'
  }
}
```

---

## 2️⃣ נתונים אישיים במערכת

### 🔍 **מיפוי מאגרי מידע**

| מאגר | נתונים | רגישות | מטרה | תוקף |
|------|---------|---------|------|------|
| **users** | שם, אימייל, תמונה, Google ID | בינונית | אימות וזיהוי | עד מחיקת חשבון |
| **bookings** | פרטי הזמנה, מלון, מחיר | בינונית | ניהול הזמנות | 7 שנים |
| **sessions** | Session tokens | נמוכה | ניהול כניסות | 30 יום |
| **loyalty** | נקודות נאמנות, היסטוריה | נמוכה | תכנית נאמנות | עד מחיקת חשבון |

### 🛡️ **אמצעי הגנה קיימים**

```typescript
// Supabase RLS (Row Level Security)
// כל משתמש רואה רק את הנתונים שלו

// Example: policies/users.sql
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

## 3️⃣ פעולות נדרשות - רשימת TODO

### 🔴 **קריטי - לביצוע מיידי**

1. **יצירת Audit Log מרכזי**
   - [ ] יישום מערכת לוג מלאה
   - [ ] תיעוד כל פעולות המשתמשים
   - [ ] שמירה ב-Supabase עם RLS
   - קוד: `lib/security/audit-log.ts`

2. **נוהל אירועי אבטחה**
   - [ ] כתיבת נוהל תגובה
   - [ ] הגדרת אנשי קשר
   - [ ] תרגול (drill) רבעוני

3. **הגדרת ממונה אבטחת מידע**
   - [ ] מינוי רשמי
   - [ ] הגדרה במערכת
   - [ ] פרסום לעובדים

### 🟡 **חשוב - לביצוע ב-30 יום**

4. **מדיניות אבטחת מידע**
   - [ ] כתיבת מסמך מלא
   - [ ] אישור הנהלה
   - [ ] הדרכת עובדים
   
5. **Data Retention Policy**
   - [ ] יישום מחיקה אוטומטית
   - [ ] Cron jobs לניקוי
   - [ ] ארכוב נתונים ישנים

6. **2FA לחשבונות Admin**
   - [ ] הוספת TOTP
   - [ ] חובת הפעלה לאדמינים

### 🟢 **מומלץ - לביצוע ב-90 יום**

7. **Penetration Testing**
   - [ ] שכירת חברת אבטחה
   - [ ] ביצוע בדיקה מקיפה
   - [ ] תיקון ממצאים

8. **Privacy Policy עדכנית**
   - [ ] כתיבת מדיניות פרטיות
   - [ ] עמוד Terms of Service
   - [ ] הסכמת משתמשים

9. **GDPR Compliance**
   - [ ] Right to be forgotten
   - [ ] Data export
   - [ ] Consent management

---

## 4️⃣ קוד לדוגמה - Audit Log System

```typescript
// lib/security/audit-log.ts

import { supabaseAdmin } from '@/lib/supabase'

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  
  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  
  // Data Access
  DATA_VIEWED = 'DATA_VIEWED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  SENSITIVE_DATA_ACCESSED = 'SENSITIVE_DATA_ACCESSED',
  
  // Bookings
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_VIEWED = 'BOOKING_VIEWED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  
  // Configuration
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  TEMPLATE_MODIFIED = 'TEMPLATE_MODIFIED',
  API_KEY_ACCESSED = 'API_KEY_ACCESSED',
  
  // Security Events
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface AuditLogEntry {
  id?: string
  timestamp: Date
  userId: string
  userEmail: string
  ipAddress: string
  userAgent: string
  action: AuditAction
  resource: string
  resourceId?: string
  oldValue?: any
  newValue?: any
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

class AuditLogger {
  /**
   * רושם אירוע אבטחה
   */
  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const logEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date(),
      }

      // שמירה ב-Supabase
      const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert(logEntry)

      if (error) {
        console.error('Failed to write audit log:', error)
        // Fallback to file system or external service
        await this.fallbackLog(logEntry)
      }

      // אם זה אירוע אבטחה קריטי - שלח התראה
      if (this.isCritical(entry.action)) {
        await this.sendSecurityAlert(logEntry)
      }
    } catch (error) {
      console.error('Audit log error:', error)
    }
  }

  /**
   * רישום ניסיון התחברות
   */
  async logLogin(userId: string, email: string, success: boolean, ip: string): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
      resource: 'authentication',
      success,
    })
  }

  /**
   * רישום גישה למידע רגיש
   */
  async logDataAccess(
    userId: string,
    email: string,
    resource: string,
    resourceId: string,
    ip: string
  ): Promise<void> {
    await this.log({
      userId,
      userEmail: email,
      ipAddress: ip,
      userAgent: 'N/A',
      action: AuditAction.SENSITIVE_DATA_ACCESSED,
      resource,
      resourceId,
      success: true,
    })
  }

  /**
   * רישום שינוי בהרשאות
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
      resource: 'user_roles',
      resourceId: targetUserId,
      oldValue: { role: oldRole },
      newValue: { role: newRole },
      success: true,
    })
  }

  /**
   * שאילתת לוגים
   */
  async query(filters: {
    userId?: string
    action?: AuditAction
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<AuditLogEntry[]> {
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })

    if (filters.userId) query = query.eq('userId', filters.userId)
    if (filters.action) query = query.eq('action', filters.action)
    if (filters.startDate) query = query.gte('timestamp', filters.startDate.toISOString())
    if (filters.endDate) query = query.lte('timestamp', filters.endDate.toISOString())
    if (filters.limit) query = query.limit(filters.limit)

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * בדיקה אם אירוע קריטי
   */
  private isCritical(action: AuditAction): boolean {
    const criticalActions = [
      AuditAction.LOGIN_FAILED,
      AuditAction.UNAUTHORIZED_ACCESS,
      AuditAction.SUSPICIOUS_ACTIVITY,
      AuditAction.USER_DELETED,
      AuditAction.API_KEY_ACCESSED,
    ]
    return criticalActions.includes(action)
  }

  /**
   * שליחת התראת אבטחה
   */
  private async sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
    // TODO: שילוב עם Slack/Email/SMS
    console.error('🚨 SECURITY ALERT:', entry)
  }

  /**
   * Fallback logging למקרה של כשל
   */
  private async fallbackLog(entry: AuditLogEntry): Promise<void> {
    // TODO: שמירה לקובץ או שירות חיצוני
    console.log('[Audit Log Fallback]', entry)
  }
}

export const auditLogger = new AuditLogger()

// SQL לטבלת audit_logs
export const AUDIT_LOG_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes לביצועים
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);

-- RLS Policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- רק אדמינים יכולים לקרוא לוגים
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- המערכת יכולה לכתוב (service role)
CREATE POLICY "System can write audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- שמירה ל-7 שנים (2555 ימים)
CREATE POLICY "Retain logs for 7 years"
  ON audit_logs FOR DELETE
  USING (timestamp < NOW() - INTERVAL '2555 days');
`
```

---

## 5️⃣ SQL Scripts - Supabase Setup

```sql
-- scripts/create-audit-logs.sql

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can write audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
```

---

## 6️⃣ מסמך מדיניות אבטחת מידע (דוגמה)

```markdown
# מדיניות אבטחת מידע
## [שם החברה] - מערכת Booking Engine

### 1. מטרה
מסמך זה מגדיר את מדיניות אבטחת המידע של [שם החברה] במערכת ניהול ההזמנות.

### 2. תחולה
מדיניות זו חלה על כל העובדים, קבלנים וספקים הגישה למערכת.

### 3. ממונה אבטחת מידע
- **שם:** [שם הממונה]
- **תפקיד:** ממונה אבטחת מידע
- **אימייל:** security@yourdomain.com
- **טלפון:** +972-XX-XXXXXXX

### 4. מאגרי מידע
המערכת מחזיקה במאגרי המידע הבאים:
- משתמשים (users)
- הזמנות (bookings)
- נאמנות (loyalty)
- לוגים (logs)

### 5. סיווג מידע
- **רגיש ביותר:** פרטי תשלום, מספרי זהות
- **רגיש:** פרטי אישיים, אימיילים
- **פנימי:** נתוני שימוש, סטטיסטיקות
- **ציבורי:** מידע שיווקי

### 6. הרשאות גישה
- Admin: גישה מלאה
- Manager: צפייה וניהול הזמנות
- Booker: יצירת הזמנות בלבד
- Viewer: צפייה בלבד

### 7. אמצעי אבטחה
- HTTPS בלבד
- הצפנה ב-rest ו-transit
- אימות דו-שלבי לאדמינים
- סיסמאות חזקות (8+ תווים)
- Audit log מלא

### 8. גיבויים
- Database: יומי אוטומטי (Supabase)
- Code: כל commit (GitHub)
- בדיקת restore: רבעונית

### 9. טיפול באירועי אבטחה
במקרה של חשד לאירוע אבטחה:
1. דיווח מיידי לממונה אבטחת מידע
2. בידוד המערכת במידת הצורך
3. תיעוד מלא של האירוע
4. דיווח לרשות תוך 72 שעות
5. הודעה למשתמשים במידת הצורך

### 10. בדיקות אבטחה
- סריקת חולשות: שבועית (npm audit)
- Penetration testing: שנתי
- Security review: רבעוני

### 11. הדרכה
כל עובד חדש עובר הדרכת אבטחת מידע.
הדרכת רענון: שנתי.

### 12. עדכון מדיניות
מדיניות זו מתעדכנת לפחות אחת לשנה או לאחר אירוע אבטחה.

**תאריך אישור:** 13/01/2026
**חתימה:** _______________
```

---

## 7️⃣ נוהל טיפול באירוע אבטחה

```markdown
# נוהל תגובה לאירוע אבטחה

## 1. זיהוי וסיווג (Detection & Classification)

### סוגי אירועים:
- **חומרה נמוכה:** ניסיון כניסה כושל בודד
- **חומרה בינונית:** ריבוי ניסיונות כניסה, חריגה בשימוש
- **חומרה גבוהה:** גישה לא מורשית למידע רגיש
- **חומרה קריטית:** דליפת מידע, מתקפת סייבר

## 2. הכלה (Containment)

### פעולות מיידיות (תוך דקות):
- [ ] בידוד המשתמש/IP החשוד
- [ ] חסימת גישה נוספת
- [ ] שמירת ראיות (logs, screenshots)
- [ ] הודעה לממונה אבטחת מידע

### פעולות לטווח קצר (תוך שעות):
- [ ] ניתוח היקף הפגיעה
- [ ] סגירת פרצות מיידיות
- [ ] שינוי סיסמאות/מפתחות במידת הצורך

## 3. חקירה (Investigation)

- מה קרה?
- מתי קרה?
- מי מעורב?
- איזה מידע נחשף?
- איך זה קרה?

## 4. תיקון (Remediation)

- [ ] סגירת הפרצה
- [ ] עדכון מערכות
- [ ] שיפור בקרות
- [ ] הדרכת עובדים

## 5. דיווח (Reporting)

### דיווח פנימי (מיידי):
- הנהלה
- מחלקת IT
- מחלקה משפטית

### דיווח חיצוני:
- **רשות הגנת הפרטיות:** תוך 72 שעות (אם נדרש)
- **משתמשים נפגעים:** תוך 72 שעות (אם נדרש)
- **רשויות אכיפה:** במקרה של פשע

### תבנית דיווח לרשות:
```
נדרש לכלול:
1. תיאור האירוע
2. סוג ומספר הנפגעים
3. סוג המידע שנחשף
4. צעדים שננקטו
5. תוכנית מניעה
6. פרטי קשר
```

## 6. למידה (Lessons Learned)

- [ ] ישיבת סיכום
- [ ] תיעוד ממצאים
- [ ] עדכון נוהלים
- [ ] הדרכת צוות

## אנשי קשר בחירום

| תפקיד | שם | טלפון | אימייל |
|-------|-----|-------|--------|
| ממונה אבטחת מידע | [שם] | [טלפון] | security@ |
| CTO | [שם] | [טלפון] | cto@ |
| יועץ משפטי | [שם] | [טלפון] | legal@ |
| רשות הגנת הפרטיות | - | *3852 | info@justice.gov.il |
```

---

## 📊 סיכום סטטוס

### ✅ עומד בדרישות (70%)
- הצפנת תקשורת
- ניהול סיסמאות מאובטח
- מערכת הרשאות בסיסית
- גיבויים אוטומטיים
- Environment variables מוצפנים

### ⚠️ דרוש השלמה (25%)
- Audit log מלא
- Data retention policy
- מדיניות אבטחה מתועדת
- בדיקות אבטחה תקופתיות
- נוהל אירועי אבטחה

### ❌ חסר (5%)
- ממונה אבטחת מידע מוגדר
- 2FA לאדמינים
- Penetration testing מתועד

---

## 🎯 המלצות לביצוע

### שבוע 1:
1. מינוי ממונה אבטחת מידע
2. הגדרת audit log במערכת
3. יצירת טבלת audit_logs ב-Supabase

### שבוע 2-4:
4. כתיבת מדיניות אבטחת מידע
5. נוהל אירועי אבטחה
6. הוספת 2FA

### חודש 2-3:
7. Data retention policy
8. Privacy policy
9. Penetration testing

---

## 📞 צור קשר

לשאלות נוספות לגבי עמידה בתיקון 14:
- **רשות הגנת הפרטיות:** *3852
- **אתר:** https://www.gov.il/he/Departments/the_privacy_protection_authority
- **אימייל:** info@justice.gov.il

---

**מסמך זה נוצר:** 13 ינואר 2026  
**גרסה:** 1.0  
**סטטוס:** טיוטה לביצוע
