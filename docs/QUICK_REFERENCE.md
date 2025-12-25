# 🎯 סיכום מהיר - Search, PreBook & Book

## התהליך בקצרה

```
Search → PreBook → Book
  2s       1-3s      3-10s
         [30min]
```

---

## 1️⃣ Search - חיפוש מלונות

### מה שולחים:
```json
{
  "hotelName": "Dizengoff Inn",
  "dateFrom": "2025-12-11",
  "dateTo": "2025-12-12",
  "pax": [{"adults": 2, "children": []}]
}
```

### מה מקבלים:
```json
{
  "code": "697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t",
  "netPrice": {"amount": 109.61, "currency": "USD"},
  "hotelId": "697024",
  "name": "Standard Double",
  "board": "RO"
}
```

### ⭐ חשוב לשמור:
- `code` - הקוד הייחודי
- `netPrice.amount` - המחיר
- `hotelId` - מזהה המלון

---

## 2️⃣ PreBook - שמירת חדר (30 דקות)

### מה שולחים:
```json
{
  "jsonRequest": "{ /* JSON string */ }"
}
```

### מה מקבלים:
```json
{
  "content": {
    "services": {
      "hotels": [{
        "token": "5C0A00D2",
        "netPrice": {"amount": 109.61, "currency": "USD"}
      }]
    }
  },
  "status": "done",
  "requestJson": "...",
  "responseJson": "..."
}
```

### ⭐ חשוב לשמור:
- `content.services.hotels[0].token` - **הטוקן**
- `requestJson` - לשלב הבא
- `status` - צריך להיות "done"

### ⏱️ זמן תוקף: **30 דקות בלבד!**

---

## 3️⃣ Book - הזמנה סופית

### מה שולחים:
```json
{
  "jsonRequest": "{ /* includes token + customer */ }"
}
```

### מה מקבלים:
```json
{
  "bookRes": {
    "content": {
      "bookingID": "3632487",
      "status": "confirmed",
      "services": [{
        "supplier": {"reference": "ME5PPX"}
      }]
    },
    "status": "done"
  }
}
```

### ⭐ חשוב לשמור:
- `bookingID` - מספר הזמנה
- `status` - צריך להיות "confirmed"
- `supplier.reference` - מספר מהמלון

---

## 🔑 כללי הזהב

### 1. ה-`code` - אל תשנה!
```typescript
✅ const code = room.code
❌ const code = room.code.trim()
❌ const code = room.code.replace(':', '-')
```

### 2. `jsonRequest` - תמיד מחרוזת
```typescript
✅ { jsonRequest: JSON.stringify(data) }
❌ { jsonRequest: data }
```

### 3. `token` - בדיוק מהמקום הנכון
```typescript
✅ response.content.services.hotels[0].token
❌ response.token
❌ response.preBookToken
```

### 4. PreBook - 30 דקות!
```typescript
✅ הצג טיימר למשתמש
✅ הזהר לפני 25 דקות
✅ אל תתן לעבור את הזמן
```

---

## 🚨 שגיאות נפוצות

| שגיאה | פתרון |
|-------|--------|
| "Room not available" | חדר כבר לא זמין → חזור לחיפוש |
| "PreBook expired" | עברו 30 דקות → PreBook חדש |
| "Invalid token" | Token לא תקין → PreBook חדש |
| "401 Unauthorized" | Token של Medici פג → רענן token |

---

## 📝 Quick Code

### React Hook
```typescript
const booking = useBookingEngine()

// Search
await booking.searchHotels({checkIn, checkOut, adults: 2})

// Select (+ PreBook)
await booking.selectRoom(hotel, room)

// Guest Info
booking.setGuestInfo({firstName, lastName, email, phone})

// Book
await booking.completeBooking()

// Done!
console.log(booking.bookingConfirmation.bookingId)
```

### API Direct
```typescript
const hotels = await mediciApi.searchHotels(params)
const prebook = await mediciApi.preBook({jsonRequest})
const booking = await mediciApi.book({jsonRequest})
```

---

## ✅ בדיקות מהירות

```bash
# חיפוש בלבד
pnpm tsx scripts/test-search-only.ts

# Flow מלא
pnpm tsx scripts/test-real-flow.ts
```

---

## 🔗 קישורים מהירים

- [מדריך מלא](./SEARCH_PREBOOK_GUIDE.md)
- [דוגמאות API](./MEDICI_API_EXAMPLES.md)
- [רשימת בדיקה](./CHECKLIST.md)

---

**זמן קריאה:** 2 דקות  
**עודכן:** 25 דצמבר 2025
