# 🚀 Search Logs - Quick Start Guide

## 📋 מה בנוי?

מערכת מלאה ללוג כל החיפושים שמבצעים משתמשים בממשק הצ'אט, עם אפשרות צפיה בלוח הבקרה (אדמין).

---

## ⚡ תחת דקה - כיצד להפעיל:

### 1️⃣ **יצרו את הטבלה ב-Supabase**
עברו לתוך **Supabase → SQL Editor** והריצו:

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

-- Indexes
CREATE INDEX idx_search_logs_hotel_id ON search_logs(hotel_id);
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_success ON search_logs(success);
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
```

### 2️⃣ **דפלוי הקוד**
```bash
cd /workspaces/v0-bookinengine
npm run build
npm run deploy
```

### 3️⃣ **בדקו שעובד**
1. עברו לאדמין: `https://yourapp.com/admin`
2. לחצו על **"יומן חיפושים"** בתפריט הצדדי
3. בצעו חיפוש בצ'אט
4. רדעו את הדף - החיפוש צריך להופיע בטבלה ✅

---

## 🎯 מה קרה בפועל:

### קובצים שנוצרו:
- ✅ `lib/search-logger.ts` - Service לרישום חיפושים
- ✅ `components/admin/search-logs-management.tsx` - ממשק אדמין
- ✅ `app/api/admin/search-logs/route.ts` - API לקבלת חיפושים
- ✅ `app/api/admin/search-logs/[id]/route.ts` - API למחיקה

### קובצים ששונו:
- ✅ `app/api/ai/booking-chat/route.ts` - הוסיף רישום חיפוש
- ✅ `app/admin/page.tsx` - הוסיף טאב חדש
- ✅ `components/admin/admin-sidebar.tsx` - הוסיף כפתור בתפריט
- ✅ `prisma/schema.prisma` - הוסיף מודל SearchLog

---

## 🔍 מה אתה רואה באדמין:

### **טאב: יומן חיפושים**

```
📊 סטטיסטיקה:
┌──────────────────────────────────────┐
│ סה"כ חיפושים: 45                     │
│ מוצלח: 37 (82%)                      │
│ נכשל: 8 (18%)                        │
└──────────────────────────────────────┘

🔎 סינונים:
┌──────────────────────────────────────┐
│ חפש לפי עיר: ________________        │
│ סטטוס: [כל / מוצלח / נכשל]           │
│ מקור: [כל / chat / widget / api]     │
│ תאריך: מ-___ עד ___                  │
└──────────────────────────────────────┘

📋 טבלה:
┌────────┬────────────┬──────────┬─────────┐
│ זמן    │ יעד        │ תוצאות   │ סטטוס   │
├────────┼────────────┼──────────┼─────────┤
│18:45   │ תל אביב    │ 5        │ ✅      │
│18:30   │ ירושלים    │ 3        │ ✅      │
│18:15   │ רמת גן     │ 0        │ ❌      │
└────────┴────────────┴──────────┴─────────┘
```

---

## 🎨 תכונות:

| תכונה | פרטים |
|-------|--------|
| 📊 **סטטיסטיקה** | סה"כ חיפושים, אחוז הצלחה, מקורות |
| 🔎 **סינונים** | עיר, סטטוס, מקור, טווח תאריכים |
| 📋 **טבלה** | כל החיפושים עם פרטים (תאריך, יעד, תוצאות) |
| 👁️ **צפיה בפרטים** | לחץ על עיר כדי לראות את כל המידע |
| 🗑️ **מחיקה** | מחקו חיפוש מסוים |
| 📥 **ייצוא** | הורידו את כל הנתונים בexcel (CSV) |

---

## 💾 מה נרשם בכל חיפוש:

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
  "userId": "user123",
  "ipAddress": "192.168.1.100",
  "createdAt": "2026-01-18T18:45:30Z"
}
```

---

## 📊 דוגמה - צפייה בנתונים:

### בפורטל אדמין:
```
Admin Panel → יומן חיפושים
                    ↓
סטטיסטיקה מוצגת בכרטות
                    ↓
סינון לפי עיר "תל אביב"
                    ↓
טבלה מציגה 23 חיפושים מתל אביב
                    ↓
לחץ על חיפוש כדי לראות פרטים מלאים
                    ↓
הורד ל-CSV לניתוח נוסף
```

---

## ❓ שאלות נפוצות:

**Q: מה קורה אם המנהל רוצה לראות רק חיפושים שנכשלו?**
A: בסינונים בחרו "סטטוס: נכשל"

**Q: איך משיגים את נתוני הניתוח?**
A: הורידו ל-CSV והעלו לExcel או Google Sheets

**Q: אפשר למחוק חיפושים?**
A: כן, לחצו על סמל הסל ליד כל חיפוש

**Q: כמה זמן נשמרים החיפושים?**
A: באופן ברירת מחדל נשמרים למשך 30 יום

---

## 🎓 API Examples:

### Get all logs:
```bash
curl -X GET "https://yourapp.com/api/admin/search-logs"
```

### Filter by city:
```bash
curl -X GET "https://yourapp.com/api/admin/search-logs?search=telAviv"
```

### Filter by status:
```bash
curl -X GET "https://yourapp.com/api/admin/search-logs?status=success"
```

### Delete a log:
```bash
curl -X DELETE "https://yourapp.com/api/admin/search-logs/logId123"
```

---

## 🚨 טרובלשוטינג:

**בעיה**: חיפוש לא מופיע בטבלה
- בדקו שהטבלה נוצרה בSupabase
- רדעו את הדף
- בדקו את ה-Console לשגיאות

**בעיה**: סטטיסטיקה לא מחודכנת
- לחצו על כפתור "רענן"
- בדקו שיש נתונים בטבלה

**בעיה**: ייצוא ל-CSV לא עובד
- בדקו שגוגל Chrome מורשה להוריד קבצים
- נסו דפדפן אחר

---

## 📝 Documentation Files:

- 📄 `SEARCH_LOGS_IMPLEMENTATION.md` - מלא תיאור של המערכת
- 📄 `SEARCH_LOGS_CHECKLIST.md` - בדיקה ופעולות
- 📄 `SEARCH_LOGS_CHANGES.md` - רשימת שינויים בקוד

---

## ✨ עתיד:

אפשר להוסיף:
- 📈 גרפים ותרשימים
- 🔔 התראות בדוא"ל על שגיאות
- 🤖 ניתוח ML של מגמות
- 📲 דוחות שבועיים

---

**סטטוס**: ✅ **מוכן לשימוש**

כל מה שצריך בנוי, מוכן לדיפלוי ולהתחלת רישום חיפושים!
