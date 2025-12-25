# ✅ רשימת בדיקה - Search & PreBook Implementation

## 📋 checklist לוודא שהכל עובד נכון

### ✅ שלב 1: Search API

- [ ] **Endpoint נכון**: `https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice`
- [ ] **Headers נכונים**:
  - `Authorization: Bearer {TOKEN}`
  - `Content-Type: application/json`
- [ ] **Request Body מכיל**:
  - `dateFrom` (YYYY-MM-DD)
  - `dateTo` (YYYY-MM-DD)
  - `pax` (array של חדרים)
  - `hotelName` או `city`
- [ ] **Response מכיל**:
  - `code` - הקוד הייחודי של החדר ✅ **חשוב ביותר!**
  - `netPrice.amount` - המחיר
  - `hotelId` - מזהה המלון
  - `cancellation` - מדיניות ביטול

### 📝 דוגמה מהצלחה:
```json
{
  "code": "697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t",
  "netPrice": {
    "amount": 109.61,
    "currency": "USD"
  },
  "hotelId": "697024"
}
```

---

### ✅ שלב 2: PreBook API

- [ ] **Endpoint נכון**: `https://book.mishor5.innstant-servers.com/pre-book`
- [ ] **Headers נכונים**:
  - `aether-access-token: {TOKEN}`
  - `aether-application-key: {APP_KEY}`
  - `Content-Type: application/json`
  - `cache-control: no-cache`
- [ ] **Request Body מכיל**:
  - `jsonRequest` - מחרוזת JSON בלבד! (לא object)
- [ ] **jsonRequest מכיל**:
  - `services[0].searchCodes[0].code` - הקוד מה-Search
  - `services[0].searchCodes[0].pax` - פרטי האורחים
  - `services[0].searchRequest` - כל פרמטרי החיפוש
- [ ] **Response מכיל**:
  - `content.services.hotels[0].token` ✅ **חשוב ביותר!**
  - `content.services.hotels[0].netPrice.amount` - מחיר מאושר
  - `status: "done"` - הצלחה
  - `requestJson` - לשמירה לשלב הבא
  - `responseJson` - לשמירה לשלב הבא

### 📝 דוגמה מהצלחה:
```json
{
  "content": {
    "services": {
      "hotels": [{
        "token": "5C0A00D2",
        "netPrice": {
          "amount": 109.61,
          "currency": "USD"
        }
      }]
    }
  },
  "status": "done",
  "requestJson": "...",
  "responseJson": "..."
}
```

### ⏱️ טיימר PreBook:
- [ ] PreBook תקף ל-**30 דקות בלבד**
- [ ] יש timer בממשק המשתמש
- [ ] יש התראה כאשר עוברים 25 דקות
- [ ] יש התראה כאשר פג התוקף

---

### ✅ שלב 3: Book API

- [ ] **Endpoint נכון**: `https://book.mishor5.innstant-servers.com/book`
- [ ] **Headers נכונים** (כמו PreBook):
  - `aether-access-token: {TOKEN}`
  - `aether-application-key: {APP_KEY}`
- [ ] **Request Body מכיל**:
  - `jsonRequest` - מחרוזת JSON (לא object!)
- [ ] **jsonRequest מכיל**:
  - `customer` - פרטי הלקוח המלאים
  - `paymentMethod` - אמצעי תשלום
  - `reference.agency` - מספר ייחוס שלך
  - `reference.voucherEmail` - אימייל לאישור
  - `services[0].bookingRequest[0].token` - הטוקן מה-PreBook ✅
  - `services[0].bookingRequest[0].code` - הקוד המקורי
  - `services[0].searchRequest` - פרמטרי החיפוש המקוריים
- [ ] **Response מכיל**:
  - `bookRes.content.bookingID` ✅ **מספר הזמנה**
  - `bookRes.content.status: "confirmed"` ✅ **חובה!**
  - `bookRes.content.services[0].supplier.reference` - מספר מהמלון

### 📝 דוגמה מהצלחה:
```json
{
  "bookRes": {
    "content": {
      "bookingID": "3632487",
      "status": "confirmed",
      "services": [{
        "supplier": {
          "reference": "ME5PPX"
        }
      }]
    },
    "status": "done"
  }
}
```

---

## 🔍 נקודות בדיקה חשובות

### ✅ ה-`code` של החדר
```typescript
// ❌ שגוי - לא לשנות!
const code = room.code.trim()
const code = room.code.replace(':', '-')

// ✅ נכון - בדיוק כמו שהתקבל
const code = room.code
```

### ✅ ה-`jsonRequest`
```typescript
// ❌ שגוי - object
{
  jsonRequest: { services: [...] }
}

// ✅ נכון - מחרוזת
{
  jsonRequest: JSON.stringify({ services: [...] })
}
```

### ✅ ה-`token` מ-PreBook
```typescript
// ❌ שגוי - שדה לא נכון
const token = prebookResponse.token
const token = prebookResponse.preBookToken

// ✅ נכון - שדה נכון
const token = prebookResponse.content.services.hotels[0].token
```

### ✅ בדיקת הצלחה
```typescript
// PreBook
if (response.status === 'done' && response.content?.services?.hotels?.[0]?.token) {
  // ✅ הצליח
}

// Book
if (response.bookRes?.content?.status === 'confirmed') {
  // ✅ הצליח
}
```

---

## 🚨 שגיאות נפוצות וטיפול

### שגיאה 1: "Room not available"
```typescript
// PreBook נכשל - החדר כבר לא זמין
→ חזור לחיפוש
→ בחר חדר אחר
```

### שגיאה 2: "PreBook expired"
```typescript
// עברו יותר מ-30 דקות
→ עשה PreBook חדש
→ המחיר עלול להשתנות!
```

### שגיאה 3: "Invalid token"
```typescript
// הטוכן לא תקין או כבר נעשה בו שימוש
→ עשה PreBook חדש
→ כל token תקף רק לשימוש אחד
```

### שגיאה 4: "401 Unauthorized"
```typescript
// הטוקן של Medici פג תוקף
→ רענן את הטוקן דרך /api/auth/OnlyNightUsersTokenAPI
→ עדכן את MEDICI_TOKEN ב-env
```

---

## 🧪 בדיקות שצריך להריץ

### בדיקה 1: Search מחזיר תוצאות
```bash
pnpm tsx scripts/test-search-only.ts
```
**ציפייה**: רשימת מלונות וחדרים עם code לכל חדר

### בדיקה 2: PreBook מצליח
```bash
pnpm tsx scripts/test-real-flow.ts
```
**ציפייה**: `token` בתשובה + `status: "done"`

### בדיקה 3: Book מצליח
```bash
pnpm tsx scripts/test-real-flow.ts
```
**ציפייה**: `bookingID` + `status: "confirmed"`

### בדיקה 4: Timer עובד
- [ ] טיימר מתחיל אחרי PreBook
- [ ] טיימר מציג זמן נכון
- [ ] התראה ב-25 דקות
- [ ] התראה כשפג תוקף

### בדיקה 5: Error Handling
- [ ] חיפוש ללא תוצאות
- [ ] PreBook נכשל
- [ ] Book נכשל
- [ ] רשת נפלה

---

## 📊 מדדי הצלחה

### Performance
- [ ] חיפוש מסתיים תוך 2-5 שניות
- [ ] PreBook מסתיים תוך 1-3 שניות
- [ ] Book מסתיים תוך 3-10 שניות

### UX
- [ ] יש Loading states בכל שלב
- [ ] יש Error messages ברורים
- [ ] יש אינדיקציה על שלב נוכחי
- [ ] יש טיימר PreBook
- [ ] יש אישור לפני תשלום

### Data Integrity
- [ ] כל השדות הנדרשים נשמרים
- [ ] `code` לא משתנה בין השלבים
- [ ] `token` נשמר נכון
- [ ] `requestJson` נשמר נכון

---

## 🎯 Next Steps

לאחר שכל הבדיקות עוברות:

1. [ ] הוסף Logging לכל שלב
2. [ ] הוסף Analytics tracking
3. [ ] הוסף Email confirmations
4. [ ] הוסף PDF voucher generation
5. [ ] הוסף Cancellation flow
6. [ ] הוסף Booking history
7. [ ] הוסף Payment gateway (Stripe)
8. [ ] הוסף Admin dashboard

---

## 📞 קבלת עזרה

אם משהו לא עובד:

1. בדוק את [docs/MEDICI_API_EXAMPLES.md](./MEDICI_API_EXAMPLES.md)
2. הרץ את הבדיקות: `pnpm tsx scripts/test-search-only.ts`
3. בדוק את ה-Console logs
4. בדוק את ה-Network tab ב-DevTools
5. ודא שה-Environment Variables נכונים
6. בדוק שה-Token לא פג תוקף

---

**עודכן:** 25 דצמבר 2025  
**גרסה:** 2.0  
**סטטוס:** ✅ Production Ready
