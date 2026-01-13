# 🇮🇱 מדריך הקמת מערכת Audit Log - תיקון 14

## סקירה כללית

מערכת זו מיישמת את דרישות תיקון 14 לחוק הגנת הפרטיות הישראלי, המחייב תיעוד מלא של כל פעולות המשתמשים במערכת למשך 7 שנים.

---

## 📦 קבצים שנוצרו

### 1. Backend - מערכת הלוגינג
```
lib/security/
├── audit-log.ts          # מחלקת AuditLogger + Types
└── audit-middleware.ts   # Middleware לתפיסת בקשות

scripts/
└── 06-create-audit-logs.sql  # סקריפט יצירת הטבלה

app/api/admin/
└── audit-logs/route.ts   # API לשליפת לוגים

components/admin/
└── audit-logs-viewer.tsx # קומפוננטת UI לצפייה
```

---

## 🚀 התקנה והגדרה

### שלב 1: יצירת טבלת audit_logs ב-Supabase

```bash
# התחבר ל-Supabase SQL Editor והרץ:
psql -h [YOUR_SUPABASE_HOST] -U postgres -d postgres

# או דרך ה-Dashboard:
# Supabase Dashboard > SQL Editor > New Query
```

הדבק את התוכן מקובץ:
```sql
scripts/06-create-audit-logs.sql
```

זה ייצור:
- ✅ טבלת `audit_logs` עם RLS
- ✅ Indexes לביצועים
- ✅ Views: `recent_audit_logs`, `critical_security_events`
- ✅ Functions: `cleanup_old_audit_logs()`, `get_security_stats()`

### שלב 2: בדיקת יצירת הטבלה

```sql
-- ודא שהטבלה נוצרה
SELECT * FROM information_schema.tables 
WHERE table_name = 'audit_logs';

-- בדוק שה-RLS פעיל
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'audit_logs';
```

---

## 📝 שימוש במערכת

### דוגמה 1: רישום כניסת משתמש

```typescript
import { auditLogger } from '@/lib/security/audit-log'

// אחרי כניסה מוצלחת
await auditLogger.logLogin(
  user.id,
  user.email,
  request.ip,
  request.headers['user-agent']
)

// ניסיון כניסה כושל
await auditLogger.logLoginFailed(
  email,
  request.ip,
  request.headers['user-agent'],
  'Invalid password'
)
```

### דוגמה 2: רישום גישה למידע רגיש

```typescript
// צפייה בפרטי הזמנה
await auditLogger.logDataAccess(
  user.id,
  user.email,
  'bookings',
  bookingId,
  request.ip,
  request.headers['user-agent']
)
```

### דוגמה 3: רישום שינוי תפקיד

```typescript
// כשאדמין משנה תפקיד של משתמש
await auditLogger.logRoleChange(
  admin.id,
  admin.email,
  targetUser.id,
  'viewer',    // תפקיד ישן
  'manager',   // תפקיד חדש
  request.ip
)
```

### דוגמה 4: רישום ביטול הזמנה

```typescript
await auditLogger.logBookingCancelled(
  user.id,
  user.email,
  bookingId,
  'Customer request',
  request.ip
)
```

### דוגמה 5: רישום ניסיון גישה לא מורשית

```typescript
// כשמשתמש מנסה לגשת למשאב ללא הרשאה
await auditLogger.logUnauthorizedAccess(
  user.id,
  user.email,
  '/api/admin/users',
  request.ip,
  request.headers['user-agent']
)
```

---

## 🎯 שילוב ב-API Routes

### דוגמה: API Route עם audit logging

```typescript
// app/api/bookings/[id]/route.ts
import { auditLogger, AuditAction, AuditSeverity } from '@/lib/security/audit-log'
import { getServerSession } from 'next-auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    await auditLogger.log({
      userId: 'anonymous',
      userEmail: 'anonymous',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      action: AuditAction.UNAUTHORIZED_ACCESS,
      severity: AuditSeverity.HIGH,
      resource: `/api/bookings/${params.id}`,
      success: false,
      errorMessage: 'Not authenticated',
    })
    
    return new Response('Unauthorized', { status: 401 })
  }
  
  // שלוף את ההזמנה
  const booking = await getBooking(params.id)
  
  // תעד את הגישה
  await auditLogger.logDataAccess(
    session.user.id,
    session.user.email,
    'bookings',
    params.id,
    request.headers.get('x-forwarded-for') || 'unknown',
    request.headers.get('user-agent') || 'unknown'
  )
  
  return Response.json(booking)
}
```

---

## 🖥️ הצגת לוגים ב-Admin Panel

### הוספת עמוד Audit Logs

```typescript
// app/admin/audit-logs/page.tsx
import { AuditLogsViewer } from '@/components/admin/audit-logs-viewer'
import { auditLogger } from '@/lib/security/audit-log'

export default async function AuditLogsPage() {
  // טען לוגים אחרונים
  const logs = await auditLogger.query({
    limit: 100,
    offset: 0,
  })
  
  return (
    <div className="p-6">
      <AuditLogsViewer initialLogs={logs} />
    </div>
  )
}
```

---

## 🔍 שאילתות שימושיות

### SQL: מצא כניסות כושלות ב-24 השעות האחרונות

```sql
SELECT 
  timestamp,
  user_email,
  ip_address,
  error_message
FROM audit_logs
WHERE action = 'LOGIN_FAILED'
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### SQL: מצא פעילות חשודה

```sql
SELECT * FROM detect_suspicious_activity();
```

### SQL: סטטיסטיקות אבטחה של משתמש

```sql
SELECT * FROM get_security_stats('user-id-here');
```

### SQL: אירועים קריטיים

```sql
SELECT * FROM critical_security_events
LIMIT 50;
```

---

## 🧹 תחזוקה

### ניקוי לוגים ישנים (מעל 7 שנים)

```sql
-- הרץ אוטומטית ב-cron job
SELECT cleanup_old_audit_logs();
```

### Cron Job (Supabase)

```sql
-- צור cron job שירוץ פעם בשבוע
SELECT cron.schedule(
  'cleanup-old-audit-logs',
  '0 3 * * 0',  -- כל יום ראשון בשעה 3 בבוקר
  $$SELECT cleanup_old_audit_logs()$$
);
```

---

## 📊 דשבורד מומלץ

### סטטיסטיקות מרכזיות להצגה:

1. **סה"כ אירועים היום**
2. **אירועים קריטיים בשבוע האחרון**
3. **ניסיונות כניסה כושלים**
4. **יוזרים הכי פעילים**
5. **גרף אירועים לפי שעה**

```typescript
// דוגמה לקומפוננטת סטטיסטיקות
const stats = await auditLogger.getStats()

<div className="grid grid-cols-4 gap-4">
  <StatCard
    title="סה\"כ אירועים"
    value={stats.totalEvents}
    icon={<Shield />}
  />
  <StatCard
    title="כניסות כושלות"
    value={stats.failedLogins}
    icon={<XCircle />}
    variant="danger"
  />
  <StatCard
    title="פעילות חשודה"
    value={stats.suspiciousActivities}
    icon={<AlertTriangle />}
    variant="warning"
  />
  <StatCard
    title="אירועים קריטיים"
    value={stats.criticalEvents}
    icon={<AlertTriangle />}
    variant="danger"
  />
</div>
```

---

## 🚨 התראות אבטחה

### שילוב עם Slack

```typescript
// lib/security/slack-alerts.ts
import { AuditLogEntry } from './audit-log'

export async function sendSlackAlert(entry: AuditLogEntry) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  
  if (!webhookUrl) return
  
  const message = {
    text: `🚨 אירוע אבטחה קריטי`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*פעולה:* ${entry.action}\n*משתמש:* ${entry.userEmail}\n*IP:* ${entry.ipAddress}`,
        },
      },
    ],
  }
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
}
```

### שילוב עם Email

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailAlert(entry: AuditLogEntry) {
  await resend.emails.send({
    from: 'security@yourdomain.com',
    to: 'security-team@yourdomain.com',
    subject: `🚨 אירוע אבטחה קריטי - ${entry.action}`,
    html: `
      <h2>אירוע אבטחה קריטי</h2>
      <ul>
        <li><strong>פעולה:</strong> ${entry.action}</li>
        <li><strong>משתמש:</strong> ${entry.userEmail}</li>
        <li><strong>IP:</strong> ${entry.ipAddress}</li>
        <li><strong>זמן:</strong> ${entry.timestamp}</li>
        <li><strong>הודעת שגיאה:</strong> ${entry.errorMessage}</li>
      </ul>
    `,
  })
}
```

---

## ✅ Checklist - עמידה בתיקון 14

- [x] **טבלת audit_logs נוצרה** ✅
- [x] **RLS מופעל** ✅
- [x] **Indexes לביצועים** ✅
- [x] **Functions לשאילתות** ✅
- [x] **API Routes להצגת לוגים** ✅
- [x] **UI לצפייה בלוגים** ✅
- [x] **תיעוד כניסות וניסיונות כושלים** ✅
- [x] **תיעוד גישה למידע רגיש** ✅
- [x] **תיעוד שינויים בהרשאות** ✅
- [x] **שמירה ל-7 שנים** ✅
- [ ] **התראות אוטומטיות** ⚠️ (צריך הגדרה)
- [ ] **גיבוי לוגים external** ⚠️ (מומלץ)
- [ ] **דשבורד ניטור** ⚠️ (בפיתוח)

---

## 🔐 אבטחה

### הגנה על הלוגים:
- ✅ RLS מונע צפייה למשתמשים רגילים
- ✅ רק אדמינים יכולים לקרוא
- ✅ לוגים immutable - אי אפשר למחוק/לשנות
- ✅ Service role בלבד יכול לכתוב

### גיבוי:
```bash
# גבה את טבלת audit_logs
pg_dump -h [host] -U postgres -t audit_logs > audit_logs_backup.sql

# או דרך Supabase dashboard:
# Database > Backups > Point in Time Recovery
```

---

## 📚 מסמכים נוספים

- [PRIVACY_LAW_COMPLIANCE.md](./PRIVACY_LAW_COMPLIANCE.md) - מסמך עמידה מלא
- [תיקון 14 לחוק הגנת הפרטיות](https://www.gov.il/he/departments/legalInfo/privacy_protection)

---

## 💡 טיפים

1. **בדוק לוגים תקופתית** - לפחות פעם בשבוע
2. **הגדר התראות** - לאירועים קריטיים
3. **ארכב לוגים ישנים** - לאחר שנה העבר לאחסון קר
4. **תעד הכל** - כל גישה למידע רגיש
5. **שמור IP addresses** - לצורכי חקירה

---

## 🆘 תמיכה

לשאלות או בעיות:
1. בדוק את ה-logs: `SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10`
2. בדוק שה-RLS פעיל: `SELECT * FROM pg_policies WHERE tablename = 'audit_logs'`
3. וודא שיש הרשאות: בדוק את role של המשתמש

---

**הערה חשובה:** מערכת זו היא בסיס לעמידה בתיקון 14. יש להתאים אותה לצרכים הספציפיים של הארגון ולהוסיף תיעוד נוסף לפי הצורך.

**זכור:** לא למחוק לוגים! שמירה ל-7 שנים היא דרישת חוק.
