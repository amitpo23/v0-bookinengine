# 🏨 Scarlet Hotel - Room Mapping for Vercel Production

## ✅ השינויים שנדחפו לפרודקשן

### תאריך: 23 ינואר 2026
### Commit: 66cf7bb - "Add Scarlet Hotel room mapping: API to template conversion with Knowaa Live support"

---

## 📋 מה שונה?

### 1. פונקציית `normalizeApiRoom` - מיפוי חכם
עודכנה הפונקציה שממירה תוצאות API לחדרי הטמפלט:

```typescript
// קודם: לוגיקה פשוטה לפי שם החדר
// עכשיו: מיפוי מדויק עם טבלת המרה

// API → Template Mapping:
standard + triple  → deluxe-balcony-bathtub (🛁 דלאקס עם מרפסת ואמבטיה)
suite + double     → suite (👑 הסוויטה)
standard + double  → classic-double (💎 הקלאסי הזוגי)
deluxe            → deluxe (🌟 חדר דלאקס)
```

### 2. Console Logging מפורט
הוספנו לוגים לדיבאג:
- `🔄 Normalizing API room:` - מראה את הנתונים מה-API
- `✅ Matched:` - מראה איזה חדר נבחר מהטמפלט

---

## 🔧 מה צריך לבדוק ב-Vercel?

### 1. בדיקת Environment Variables
וודא שהמשתנים הבאים מוגדרים ב-Vercel:

```bash
MEDICI_TOKEN=eyJhbGc... (Knowaa Live JWT - expires 2084)
KNOWAA_BEARER_TOKEN=eyJhbGc... (partnerships@knowaaglobal.com)
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
BOOK_BASE_URL=https://book.mishor5.innstant-servers.com
NEXT_PUBLIC_DEMO_MODE=false
```

**איך לבדוק:**
1. לך ל-[Vercel Dashboard](https://vercel.com/dashboard)
2. בחר את הפרוייקט
3. Settings → Environment Variables
4. וודא שכל המשתנים מופיעים ב-Production

### 2. בדיקת Deployment Status
```bash
# URL הבדיקה (עדכן לפי ה-URL שלך):
https://your-project.vercel.app/templates/scarlet
```

**מה לבדוק:**
- ✅ העמוד נטען בלי שגיאות
- ✅ טופס החיפוש עובד (תאריכים + אורחים)
- ✅ כפתור "חפש חדרים" לא נותן 500 error
- ✅ Console מראה לוגים כמו `handleSearch called!`

### 3. בדיקת API Integration
פתח DevTools (F12) ובדוק:

**בעת טעינת העמוד:**
```
=== SCARLET DEBUG ===
showApiResults: true
scarletSearchResults.length: 0  # תקין - עדיין לא חיפשו
```

**אחרי לחיצה על "חפש חדרים":**
```
handleSearch called! checkIn: 2026-01-24 checkOut: 2026-01-25
🔍 Searching Tel Aviv with limit 100...
🎯 Found X Scarlet Hotel Tel Aviv results
```

**אם מגיע חדר מה-API:**
```
🔄 Normalizing API room: {category: "standard", bedding: "triple", price: 110.11}
✅ Matched: standard+triple→deluxe-balcony-bathtub
```

---

## 🚨 בעיות אפשריות ופתרונות

### בעיה 1: 401 Unauthorized
**תסמינים:** `🔐 Token authentication failed`

**פתרון:**
1. וודא ש-`MEDICI_TOKEN` ב-Vercel זהה לזה ב-.env.local
2. בדוק שהטוקן לא פג (expires 2084, אז זה לא אמור)
3. נסה לעשות redeploy: `Settings → Deployments → Redeploy`

### בעיה 2: מלון סקרלט לא מופיע בתוצאות
**תסמינים:** `Found 0 Scarlet Hotel Tel Aviv results`

**סיבות אפשריות:**
- התאריכים שנבדקו לא זמינים (רק 2 חדרים זמינים מ-Knowaa)
- ה-`aetherAccessToken` לא עובר נכון (צריך לבדוק ב-`lib/api/medici-client.ts`)

**פתרון זמני:**
- נסה תאריכים שונים (יום-יומיים קדימה)
- נסה 2 או 4 אורחים (לא 1, 3, 5, 6)

### בעיה 3: שגיאת Build ב-Vercel
**תסמינים:** Deployment failed

**פתרון:**
```bash
# בדוק את הלוגים ב-Vercel Dashboard
# אם יש Type Errors:
# 1. עדכן את tsconfig.json
# 2. או שנה ב-next.config.mjs:
typescript: {
  ignoreBuildErrors: true
}
```

---

## 🎯 טבלת ההמרה הסופית

| תוצאת API | מחיר אמיתי | → | חדר בטמפלט | אימוג'י |
|-----------|------------|---|-------------|---------|
| Standard Triple | $110.11 | → | **דלאקס עם מרפסת ואמבטיה** | 🛁 |
| Suite Double | $275.46 | → | **הסוויטה** | 👑 |
| Standard Double | - | → | הקלאסי הזוגי | 💎 |
| Deluxe | - | → | חדר דלאקס | 🌟 |

*רק 2 סוגי החדרים הראשונים זמינים דרך Knowaa Live כרגע*

---

## 📞 תמיכה

אם יש בעיה:
1. בדוק את Console בדפדפן (F12)
2. בדוק את Vercel Deployment Logs
3. וודא שמשתני הסביבה נכונים
4. נסה תאריכים אחרים בחיפוש

---

## ✨ סטטוס נוכחי

- ✅ **Local Dev:** עובד מעולה
- ⏳ **Vercel Production:** ממתין ל-deployment
- 🔄 **Auto Deploy:** מופעל (push to main)

**Deployment URL:** https://vercel.com/[your-username]/[project-name]/deployments

כשה-deployment יסתיים, תקבל URL לבדיקה!
