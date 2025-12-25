# 📚 Documentation Index

ברוך הבא למרכז התיעוד של מערכת הזמנות המלונות!

## 🎯 למתחילים - התחל כאן!

### 1. **[SEARCH_PREBOOK_GUIDE.md](./SEARCH_PREBOOK_GUIDE.md)** - המדריך המלא ⭐
- מה זה Search & PreBook?
- ארכיטקטורה מלאה
- דוגמאות קוד
- שאלות נפוצות (FAQ)
- **התחל כאן אם אתה חדש במערכת!**

### 2. **[CHECKLIST.md](./CHECKLIST.md)** - רשימת בדיקה ✅
- רשימת משימות לפני Production
- בדיקות שצריך להריץ
- שגיאות נפוצות ופתרונות
- מדדי הצלחה

---

## 📖 תיעוד API

### 3. **[MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md)** - דוגמאות אמיתיות 🔍
- תשובות אמיתיות מה-API של Medici
- Request/Response מפורטים לכל endpoint
- שדות חשובים ומשמעותם
- Error handling מפורט
- **השתמש בזה כ-Reference!**

### 4. **[../API_MIGRATION_NOTES.md](../API_MIGRATION_NOTES.md)** - הערות מעבר
- שינויים ב-Authentication (Aether)
- מעבר בין גרסאות API
- Breaking changes

---

## 📋 סיכומי פרויקט

### 5. **[../PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md)** - סיכום מקיף
- כל התכונות של המערכת
- מבנה הקבצים
- טכנולוגיות בשימוש
- היסטוריית פיתוח

### 6. **[../DEVELOPMENT_SUMMARY.md](../DEVELOPMENT_SUMMARY.md)** - סיכום פיתוח
- תיקונים שבוצעו
- שיפורים שנעשו
- בעיות שנפתרו

### 7. **[../RBAC_README.md](../RBAC_README.md)** - מערכת הרשאות
- Role-Based Access Control
- הגדרת תפקידים
- ניהול הרשאות

---

## 🔐 Authentication & Setup

### 8. **[../AUTHENTICATION.md](../AUTHENTICATION.md)** - אימות
- מערכת ה-Authentication
- OAuth providers
- Session management

### 9. **[../AUTH_SETUP_GUIDE.md](../AUTH_SETUP_GUIDE.md)** - הגדרת אימות
- צעדי התקנה
- הגדרת Supabase
- Environment variables

### 10. **[../VERCEL_ENV_SETUP.md](../VERCEL_ENV_SETUP.md)** - Vercel Setup
- הגדרת Environment Variables ב-Vercel
- Deployment tips

### 11. **[EMAIL-SETUP.md](./EMAIL-SETUP.md)** - הגדרת Email
- שליחת אימיילים
- Email templates
- SMTP configuration

---

## 🧪 בדיקות

### 12. **[../TEST_INSTRUCTIONS.md](../TEST_INSTRUCTIONS.md)** - הוראות בדיקה
- איך להריץ בדיקות
- מה לבדוק
- Expected results

### 13. **[../TEST_RESULTS.md](../TEST_RESULTS.md)** - תוצאות בדיקות
- בדיקות שרצו
- תוצאות
- Bugs שנמצאו

---

## 🔀 Branch Analysis

### 14. **[GENSPARK_BRANCH_ANALYSIS.md](./GENSPARK_BRANCH_ANALYSIS.md)**
- ניתוח של branch ספציפי
- שינויים ותכונות

---

## 🗂️ מבנה התיעוד

```
docs/
├── 📘 SEARCH_PREBOOK_GUIDE.md    ← מדריך מלא (התחל כאן!)
├── ✅ CHECKLIST.md                ← רשימת בדיקה
├── 🔍 MEDICI_API_EXAMPLES.md     ← דוגמאות אמיתיות
├── 📧 EMAIL-SETUP.md              ← הגדרת אימיילים
├── 🔀 GENSPARK_BRANCH_ANALYSIS.md
└── 📋 INDEX.md                    ← הקובץ הזה

Root level:
├── 📖 README.md                   ← סקירה כללית
├── 📊 PROJECT_SUMMARY.md          ← סיכום מקיף
├── 🔧 DEVELOPMENT_SUMMARY.md     ← סיכום פיתוח
├── 🔐 AUTHENTICATION.md           ← אימות
├── 🛡️ RBAC_README.md             ← הרשאות
├── 📝 API_MIGRATION_NOTES.md     ← הערות API
├── ⚙️ AUTH_SETUP_GUIDE.md        ← הגדרת אימות
├── 🚀 VERCEL_ENV_SETUP.md        ← Vercel setup
├── 🧪 TEST_INSTRUCTIONS.md       ← הוראות בדיקה
└── ✅ TEST_RESULTS.md             ← תוצאות בדיקות
```

---

## 🎓 מסלולי למידה

### למפתחים חדשים:
1. קרא את [README.md](../README.md) - Overview
2. קרא את [SEARCH_PREBOOK_GUIDE.md](./SEARCH_PREBOOK_GUIDE.md) - מדריך מלא
3. הרץ את `pnpm tsx scripts/test-search-only.ts` - בדיקה ראשונה
4. עיין ב-[MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md) - דוגמאות
5. השתמש ב-[CHECKLIST.md](./CHECKLIST.md) - בדיקות

### למפתחי Frontend:
1. [SEARCH_PREBOOK_GUIDE.md](./SEARCH_PREBOOK_GUIDE.md) - דוגמאות React
2. [../hooks/use-booking-engine.ts](../hooks/use-booking-engine.ts) - ה-Hook המרכזי
3. [../app/templates/](../app/templates/) - טמפלטים לדוגמה

### למפתחי Backend:
1. [MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md) - API מפורט
2. [../lib/api/medici-client.ts](../lib/api/medici-client.ts) - הקלאס המרכזי
3. [../app/api/](../app/api/) - API Routes

### למנהלי מערכת:
1. [AUTHENTICATION.md](../AUTHENTICATION.md) - אימות
2. [RBAC_README.md](../RBAC_README.md) - הרשאות
3. [VERCEL_ENV_SETUP.md](../VERCEL_ENV_SETUP.md) - Deployment

---

## 🔍 חיפוש מהיר

### אני רוצה לדעת איך...

**...לעשות חיפוש מלונות?**
→ [SEARCH_PREBOOK_GUIDE.md - שלב 1](./SEARCH_PREBOOK_GUIDE.md#שלב-1-חיפוש-search)

**...לעשות PreBook?**
→ [SEARCH_PREBOOK_GUIDE.md - שלב 2](./SEARCH_PREBOOK_GUIDE.md#שלב-2-טרום-הזמנה-prebook)

**...לעשות הזמנה סופית?**
→ [SEARCH_PREBOOK_GUIDE.md - שלב 3](./SEARCH_PREBOOK_GUIDE.md#שלב-3-הזמנה-סופית-book)

**...להשתמש ב-useBookingEngine?**
→ [SEARCH_PREBOOK_GUIDE.md - דוגמה 1](./SEARCH_PREBOOK_GUIDE.md#דוגמה-1-שימוש-ב-usebookingengine-hook)

**...לראות דוגמאות אמיתיות?**
→ [MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md)

**...לבדוק אם הכל עובד?**
→ [CHECKLIST.md](./CHECKLIST.md)

**...להגדיר Authentication?**
→ [AUTH_SETUP_GUIDE.md](../AUTH_SETUP_GUIDE.md)

**...לפתור שגיאה?**
→ [SEARCH_PREBOOK_GUIDE.md - שאלות נפוצות](./SEARCH_PREBOOK_GUIDE.md#שאלות-נפוצות)

---

## 📞 קבלת עזרה

אם משהו לא ברור:

1. **חפש בתיעוד** - רוב התשובות כאן
2. **הרץ בדיקות** - `pnpm tsx scripts/test-search-only.ts`
3. **בדוק את הקונסולה** - Errors & Logs
4. **צור Issue** - [GitHub Issues](https://github.com/amitpo23/v0-bookinengine/issues)

---

## 🔄 עדכונים אחרונים

**25 דצמבר 2025:**
- ✅ נוסף SEARCH_PREBOOK_GUIDE.md - מדריך מלא
- ✅ נוסף MEDICI_API_EXAMPLES.md - דוגמאות אמיתיות
- ✅ נוסף CHECKLIST.md - רשימת בדיקה
- ✅ עודכן README.md - סקירה כללית
- ✅ נוסף INDEX.md - הקובץ הזה

---

**עודכן:** 25 דצמבר 2025  
**גרסה:** 2.0  
**מפתח:** v0.app
