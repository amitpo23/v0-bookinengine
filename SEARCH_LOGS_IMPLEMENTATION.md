# Search Logs Implementation - תיאור ביישום

## 📋 סיכום הישום

נוספה מערכת מקיפה ללוג כל החיפושים שמבצעים משתמשים בממשק בחר. המערכת עוקבת אחרי כל החיפושים, כל התוצאות, ושגיאות אם יש, והמידע זמין באזור ניהול.

## 🎯 תכונות שנוספו

### 1. **Database Model - SearchLog**
- **ממיקום**: Prisma Schema (`prisma/schema.prisma`)
- **שדות**:
  - `hotelName` - שם המלון שבו חיפשו
  - `city` - העיר שבה חיפשו
  - `dateFrom` - תאריך הגעה
  - `dateTo` - תאריך עזיבה
  - `adults` - מספר מבוגרים
  - `children` - מספר ילדים
  - `resultsCount` - מספר התוצאות שהוחזרו
  - `success` - האם החיפוש הצליח או נכשל
  - `errorMessage` - הודעת שגיאה אם קיימת
  - `source` - מקור החיפוש (chat, widget, template, api)
  - `channel` - ערוץ (web, mobile, embed)
  - `userId` - ID של המשתמש שביצע חיפוש
  - `ipAddress` - כתובת IP של המבקר
  - `metadata` - מידע נוסף בפורמט JSON

### 2. **Search Logger Utility** 
- **ממיקום**: `lib/search-logger.ts`
- **מתודות**:
  - `logSearch(params)` - רישום חיפוש חדש
  - `getSearchLogs(filters)` - קבלת רישום חיפושים עם סינונים
  - `getSearchStats(filters)` - סטטיסטיקה של חיפושים
  - `deleteOldLogs(daysToKeep)` - מחיקת חיפושים ישנים
  - `deleteLog(id)` - מחיקת חיפוש בודד

### 3. **Chat API Logging Integration**
- **ממיקום**: `app/api/ai/booking-chat/route.ts`
- **פעולות**:
  - החיפוש נרשם עם כל הפרטים כאשר משתמש מחפש דרך צ'אט
  - חיפושים מוצלחים נרשמים עם מספר התוצאות
  - חיפושים שנכשלו נרשמים עם הודעת השגיאה
  - כל רישום כולל timestamps, IP, user agent ומטא דטה

### 4. **Admin Component - Search Logs Management**
- **ממיקום**: `components/admin/search-logs-management.tsx`
- **תכונות**:
  - **סטטיסטיקה כללית**:
    - סה"כ חיפושים
    - חיפושים מוצלחים (עם אחוז הצלחה)
    - חיפושים שנכשלו
    - מקורות חיפוש
  - **סינונים מתקדמים**:
    - חיפוש לפי עיר
    - סינון לפי סטטוס (כל / מוצלח / נכשל)
    - סינון לפי מקור (chat, widget, template, api)
    - סינון לפי טווח תאריכים
  - **פעולות**:
    - ✓ צפיה בפרטי חיפוש
    - ✓ מחיקת חיפוש יחיד
    - ✓ ייצוא ל-CSV
    - ✓ רענון הנתונים

### 5. **Admin Panel Integration**
- **ממיקום**: `app/admin/page.tsx`
- **טאב חדש**: "יומן חיפושים" (searchlogs)
- **במסך צד**: הוסף הפניה לטאב החדש עם אייקון

### 6. **Admin Sidebar Updated**
- **ממיקום**: `components/admin/admin-sidebar.tsx`
- **שינוי**: הוסף כפתור "יומן חיפושים" בתפריט הצדדי

### 7. **API Routes**
- **GET** `/api/admin/search-logs` - קבלת חיפושים עם סינונים
- **DELETE** `/api/admin/search-logs/[id]` - מחיקת חיפוש בודד

## 📊 נתונים שנערכים בכל חיפוש

```json
{
  "hotelName": "Dizengoff Inn",
  "city": "Tel Aviv",
  "dateFrom": "2025-12-11",
  "dateTo": "2025-12-12",
  "adults": 2,
  "children": 0,
  "resultsCount": 5,
  "success": true,
  "source": "chat",
  "channel": "web",
  "durationMs": 234,
  "userId": "user123",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "hotelId": "hotel456",
    "userMessage": "I'm looking for hotels in Tel Aviv"
  }
}
```

## 🔌 כיצד זה עובד

### 1. משתמש מחפש בצ'אט
משתמש כותב בצ'אט AI: "אני מחפש מלון בתל אביב מ-11 לדצמבר ל-12 דצמבר עבור 2 מבוגרים"

### 2. AI מעבד את הבקשה
- AI מזהה את כוונת החיפוש
- מחלץ את הפרטים (עיר, תאריכים, אורחים)
- שולח בקשה ל-API של Medici

### 3. חיפוש נרשם
- אם החיפוש הצליח: נרשמים כל הפרטים + מספר התוצאות
- אם החיפוש נכשל: נרשמה הודעת שגיאה

### 4. מנהל יכול לראות את הנתונים
- בלשונית "יומן חיפושים" בלוח הבקרה
- יכול לסנן לפי עיר, תאריכים, מקור וסטטוס
- יכול לראות פרטים מלאים של כל חיפוש
- יכול לייצא ל-CSV

## 🔧 התקנה ודיפלוי

### 1. יצירת הטבלה ב-Supabase
הריצו את ה-SQL הבא ב-Supabase SQL Editor:

```sql
CREATE TABLE search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id TEXT,
  search_query TEXT,
  destination TEXT,
  hotel_name TEXT,
  city TEXT,
  date_from DATE,
  date_to DATE,
  adults INTEGER DEFAULT 2,
  children INTEGER DEFAULT 0,
  results_count INTEGER NOT NULL DEFAULT 0,
  found_hotels INTEGER,
  found_rooms INTEGER,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  user_id TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  source TEXT,
  channel TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_search_logs_hotel_id ON search_logs(hotel_id);
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_success ON search_logs(success);
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX idx_search_logs_source ON search_logs(source);
```

### 2. שדרוג דיפלוי
```bash
npm run build
npm run deploy
```

## 📈 סטטיסטיקות ונתונים

### מה אתה יכול לשלוף מהנתונים

1. **שיעור הצלחה** - כמה חיפושים הצליחו מתוך הסה"כ
2. **יעדים פופולריים** - איזה עיירות/מלונות חיפשו הכי הרבה
3. **שעות פיק** - באילו שעות יש הכי הרבה חיפושים
4. **מקורות תעבורה** - מאיזה ערוץ (chat, widget, etc) מגיעות הרכישות
5. **שגיאות** - איזה סוגי שגיאות קרו ובאילו מקרים

## 🔐 אבטחה וחיסיון

- כל הגישה ל-API דורשת אימות
- ניתן למחוק חיפושים ישנים אוטומטית (אחרי 30 יום כברירת מחדל)
- ניתן להגדיר RLS (Row Level Security) בSupabase

## 🚀 שיפורים אפשריים בעתיד

1. **ניתוח מתקדם**: טיעונים בעזרת Recharts
2. **ייצוא מתקדם**: ייצוא ל-Excel, PDF
3. **אלerts**: התראות על שגיאות תדירות
4. **A/B Testing**: השוואה בין וריאציות חיפוש
5. **ML Integration**: ניבוי מגמות חיפוש

---

**יוצר**: תיעוד מערכת חיפושים
**תאריך**: 18 בינואר 2026
**סטטוס**: ✅ בפיתוח ומוכן לשימוש
