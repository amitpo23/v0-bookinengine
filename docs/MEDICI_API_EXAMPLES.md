# Medici API - דוגמאות אמיתיות ותיעוד מלא

## 📋 תוכן עניינים
1. [Search API - חיפוש מלונות](#1-search-api---חיפוש-מלונות)
2. [PreBook API - טרום-הזמנה](#2-prebook-api---טרום-הזמנה)
3. [Book API - הזמנה סופית](#3-book-api---הזמנה-סופית)
4. [Flow מלא - דוגמה](#4-flow-מלא---דוגמה)

---

## 1. Search API - חיפוש מלונות

### Endpoint
```
POST https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice
```

### Headers
```json
{
  "Authorization": "Bearer {MEDICI_TOKEN}",
  "Content-Type": "application/json"
}
```

### Request Body - דוגמה
```json
{
  "hotelName": "Dizengoff Inn",
  "dateFrom": "2025-12-11",
  "dateTo": "2025-12-12",
  "pax": [
    {
      "adults": 2,
      "children": []
    }
  ]
}
```

### Response - מבנה פריט בודד
```json
{
  "hotelName": "Dizengoff Inn",
  "images": null,
  "name": "Standard Double",
  "category": "standard",
  "bedding": "double",
  "board": "RO",
  "hotelId": "697024",
  "pax": {
    "adults": 2,
    "children": []
  },
  "quantity": {
    "min": 1,
    "max": 1
  },
  "detailsAvailable": false,
  "price": {
    "amount": 109.61,
    "currency": "USD"
  },
  "netPrice": {
    "amount": 109.61,
    "currency": "USD"
  },
  "barRate": null,
  "confirmation": "immediate",
  "paymentType": "pre",
  "packageRate": true,
  "commissionable": true,
  "providers": [
    {
      "id": 52166,
      "name": "TBO"
    }
  ],
  "specialOffers": [],
  "cancellation": {
    "type": "fully-refundable",
    "frames": [
      {
        "from": "2025-07-24 00:00:00",
        "to": "2025-12-01 23:59:59",
        "penalty": {
          "amount": 0,
          "currency": "USD"
        }
      },
      {
        "from": "2025-12-02 00:00:00",
        "to": "2025-12-11 23:59:59",
        "penalty": {
          "amount": 109.61,
          "currency": "USD"
        }
      }
    ]
  },
  "code": "697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t",
  "dates": null,
  "source": 1,
  "offer": null
}
```

### שדות חשובים לשמירה
- **`code`**: `"697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t"`  
  ⭐ זהו המפתח הייחודי לחדר - **חייב** להישמר!
  
- **`netPrice.amount`**: `109.61`  
  המחיר הנקי (נטו)
  
- **`hotelId`**: `"697024"`  
  מזהה המלון
  
- **`cancellation`**: מדיניות ביטול מפורטת

---

## 2. PreBook API - טרום-הזמנה

### Endpoint
```
POST https://book.mishor5.innstant-servers.com/pre-book
```

### Headers
```json
{
  "aether-access-token": "{MEDICI_TOKEN}",
  "aether-application-key": "{MEDICI_APP_KEY}",
  "Content-Type": "application/json",
  "cache-control": "no-cache"
}
```

### Request Body
```json
{
  "jsonRequest": "{\"services\":[{\"searchCodes\":[{\"code\":\"697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t\",\"pax\":[{\"adults\":2,\"children\":[]}]}],\"searchRequest\":{\"currencies\":[\"USD\"],\"customerCountry\":\"IL\",\"dates\":{\"from\":\"2025-12-11\",\"to\":\"2025-12-12\"},\"destinations\":[{\"id\":697024,\"type\":\"hotel\"}],\"filters\":[{\"name\":\"payAtTheHotel\",\"value\":true},{\"name\":\"onRequest\",\"value\":false},{\"name\":\"showSpecialDeals\",\"value\":true}],\"pax\":[{\"adults\":2,\"children\":[]}],\"service\":\"hotels\"}}]}"
}
```

**חשוב:** ה-`jsonRequest` הוא מחרוזת JSON ממוחזרת מתשובת ה-Search API!

### Response - הצלחה
```json
{
  "content": {
    "services": {
      "hotels": [
        {
          "price": {
            "amount": 109.61,
            "currency": "USD"
          },
          "priceWithoutTax": {
            "amount": 109.61,
            "currency": "USD"
          },
          "netPrice": {
            "amount": 109.61,
            "currency": "USD"
          },
          "taxAmount": {
            "amount": [],
            "currency": []
          },
          "transactionFee": {
            "amount": 0,
            "currency": "USD"
          },
          "netPriceInClientCurrency": {
            "amount": 109.61,
            "currency": "USD"
          },
          "barRate": {
            "amount": 0,
            "currency": "USD"
          },
          "confirmation": "immediate",
          "paymentMethod": "direct",
          "packageRate": true,
          "commissionable": true,
          "code": "697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t",
          "cancellation": {
            "type": "fully-refundable",
            "frames": [
              {
                "from": "2025-07-24 00:00:00",
                "to": "2025-12-01 23:59:59",
                "penalty": {
                  "amount": 0,
                  "currency": "USD"
                }
              },
              {
                "from": "2025-12-02 00:00:00",
                "to": "2025-12-11 23:59:59",
                "penalty": {
                  "amount": 109.61,
                  "currency": "USD"
                }
              }
            ]
          },
          "token": "5C0A00D2",
          "items": [
            {
              "name": "Studio, City View,1 Double Bed,NonSmoking",
              "category": "standard",
              "bedding": "double",
              "board": "RO",
              "hotelId": "697024",
              "pax": {
                "adults": 2,
                "children": []
              },
              "quantity": {
                "min": 1,
                "max": 1
              },
              "detailsAvailable": false
            }
          ],
          "surcharges": [],
          "requestCode": "697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t"
        }
      ]
    },
    "paymentMethods": [
      {
        "methodName": "account_credit",
        "methodDescription": "",
        "paymentSettings": {
          "creditCardForm": false,
          "requiredFields": []
        },
        "status": "enabled"
      },
      {
        "methodName": "credit_card",
        "methodDescription": "",
        "paymentSettings": {
          "creditCardForm": true,
          "requiredFields": []
        },
        "status": "disabled"
      }
    ],
    "immediateCharge": true,
    "autoCancellation": false,
    "paymentDueDate": "2025-11-29",
    "loyaltyPoints": [],
    "availablePoints": [],
    "profileVersion": "db4da6437c63056f466491ce410eeadf492c0b44"
  },
  "status": "done",
  "errorCode": null,
  "errorMessage": null,
  "requestJson": "{\"services\":[{\"searchCodes\":[{\"code\":\"697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t\",\"pax\":[{\"adults\":2,\"children\":[]}]}],\"searchRequest\":{\"currencies\":[\"USD\"],\"customerCountry\":\"IL\",\"dates\":{\"from\":\"2025-12-11\",\"to\":\"2025-12-12\"},\"destinations\":[{\"id\":697024,\"type\":\"hotel\"}],\"filters\":[{\"name\":\"payAtTheHotel\",\"value\":true},{\"name\":\"onRequest\",\"value\":false},{\"name\":\"showSpecialDeals\",\"value\":true}],\"pax\":[{\"adults\":2,\"children\":[]}],\"service\":\"hotels\"}}]}",
  "responseJson": "{...}",
  "opportunityId": 0
}
```

### שדות חשובים לשמירה
- **`content.services.hotels[0].token`**: `"5C0A00D2"`  
  ⭐ הטוקן להזמנה הסופית - **חייב** להישמר!
  
- **`content.services.hotels[0].netPrice.amount`**: `109.61`  
  המחיר המאושר
  
- **`status`**: `"done"`  
  סטטוס ההצלחה
  
- **`requestJson`**: מחרוזת JSON לשלב הבא  
  ⭐ נדרש ל-Book API!

### ⏱️ חשוב לדעת
- PreBook תקף ל-**30 דקות** בלבד!
- לאחר 30 דקות חייבים לעשות PreBook חדש
- ה-`token` משמש רק פעם אחת

---

## 3. Book API - הזמנה סופית

### Endpoint
```
POST https://book.mishor5.innstant-servers.com/book
```

### Headers
```json
{
  "aether-access-token": "{MEDICI_TOKEN}",
  "aether-application-key": "{MEDICI_APP_KEY}",
  "Content-Type": "application/json",
  "cache-control": "no-cache"
}
```

### Request Body
```json
{
  "jsonRequest": "{\"customer\":{\"title\":\"MR\",\"name\":{\"first\":\"Landry\",\"last\":\"WALKER\"},\"birthDate\":\"1982-08-11\",\"contact\":{\"address\":\"dizengof 89\",\"city\":\"tel aviv\",\"country\":\"IL\",\"email\":\"order@medicihotels.com\",\"phone\":\"050-9013028\",\"state\":\"IL\",\"zip\":\"6439602\"}},\"paymentMethod\":{\"methodName\":\"account_credit\"},\"reference\":{\"agency\":\"my agency reference\",\"voucherEmail\":\"test@example.com\"},\"services\":[{\"bookingRequest\":[{\"code\":\"697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t\",\"pax\":[{\"adults\":[{\"lead\":true,\"title\":\"MR\",\"name\":{\"first\":\"Andrew\",\"last\":\"WALKER\"},\"contact\":{\"address\":\"dizengof 89\",\"city\":\"tel aviv\",\"country\":\"IL\",\"email\":\"order@medicihotels.com\",\"phone\":\"050-9013028\",\"state\":\"IL\",\"zip\":\"6439602\"}},{\"lead\":false,\"title\":\"MR\",\"name\":{\"first\":\"Brecken\",\"last\":\"WALKER\"},\"contact\":{\"address\":\"dizengof 89\",\"city\":\"tel aviv\",\"country\":\"IL\",\"email\":\"order@medicihotels.com\",\"phone\":\"050-9013028\",\"state\":\"IL\",\"zip\":\"6439602\"}}],\"children\":[]}],\"token\":\"5C0A00D2\"}],\"searchRequest\":{\"currencies\":[\"USD\"],\"customerCountry\":\"IL\",\"dates\":{\"from\":\"2025-12-11\",\"to\":\"2025-12-12\"},\"destinations\":[{\"id\":697024,\"type\":\"hotel\"}],\"filters\":[{\"name\":\"payAtTheHotel\",\"value\":true},{\"name\":\"onRequest\",\"value\":false},{\"name\":\"showSpecialDeals\",\"value\":true}],\"pax\":[{\"adults\":2,\"children\":[]}],\"service\":\"hotels\"}}]}"
}
```

**חשוב:** ה-`jsonRequest` כולל:
1. פרטי הלקוח (`customer`)
2. אמצעי תשלום (`paymentMethod`)
3. הטוקן מה-PreBook (`token`)
4. כל המידע מהחיפוש המקורי

### Response - הצלחה
```json
{
  "insertPreBook": null,
  "rootBuyRoom": null,
  "bookRes": {
    "content": {
      "bookingID": "3632487",
      "bookingDate": "2025-07-24",
      "status": "confirmed",
      "customer": {
        "title": "MR",
        "name": {
          "first": "Landry",
          "last": "WALKER"
        },
        "birthDate": "1982-08-11",
        "contact": {
          "address": "dizengof 89",
          "city": "tel aviv",
          "country": "IL",
          "email": "order@medicihotels.com",
          "phone": "050-9013028",
          "state": "IL",
          "zip": "6439602"
        }
      },
      "price": {
        "amount": 109.61,
        "currency": "USD"
      },
      "netPrice": {
        "amount": 109.61,
        "currency": "USD"
      },
      "taxAmount": null,
      "services": [
        {
          "hotel": {
            "id": "697024",
            "name": "Dizengoff Inn",
            "city": "Israel",
            "address": "Dizengoff 190 Tel Aviv ",
            "zip": "",
            "phone": "",
            "fax": "972-54-6545241",
            "rating": "3",
            "latitude": "32.08576",
            "longitude": "34.77464",
            "room": {
              "name": "Studio, City View,1 Double Bed,NonSmoking",
              "category": "standard",
              "bedding": "double",
              "board": "RO",
              "boardName": "Room Only",
              "token": "5C0A00D2"
            }
          },
          "itemId": 1,
          "service": "hotels",
          "startDate": "2025-12-11",
          "endDate": "2025-12-12",
          "paymentType": "pre",
          "quantity": 1,
          "code": "697024:standard:double:RO:6881fef5b56c66.97441355$1003X1095n1095t",
          "status": "confirmed",
          "supplier": {
            "reference": "ME5PPX"
          },
          "price": {
            "amount": 109.61,
            "currency": "USD"
          },
          "taxAmount": null,
          "netPrice": {
            "amount": 109.61,
            "currency": "USD"
          },
          "cancellation": {
            "type": "fully-refundable",
            "frames": [
              {
                "from": "2025-07-24 00:00:00",
                "to": "2025-12-01 23:59:59",
                "penalty": {
                  "amount": 0,
                  "currency": "USD"
                }
              },
              {
                "from": "2025-12-02 00:00:00",
                "to": "2025-12-11 23:59:59",
                "penalty": {
                  "amount": 109.61,
                  "currency": "USD"
                }
              }
            ]
          },
          "pax": [
            {
              "adults": [
                {
                  "lead": true,
                  "title": "M",
                  "name": {
                    "first": "Andrew",
                    "last": "WALKER"
                  },
                  "contact": {
                    "address": "dizengof 89",
                    "city": "tel aviv",
                    "country": "IL",
                    "email": "order@medicihotels.com",
                    "phone": "050-9013028",
                    "state": "IL",
                    "zip": "6439602"
                  }
                },
                {
                  "lead": false,
                  "title": "M",
                  "name": {
                    "first": "Brecken",
                    "last": "WALKER"
                  },
                  "contact": {
                    "address": "dizengof 89",
                    "city": "tel aviv",
                    "country": "IL",
                    "email": "order@medicihotels.com",
                    "phone": "050-9013028",
                    "state": "IL",
                    "zip": "6439602"
                  }
                }
              ],
              "children": []
            }
          ],
          "remarks": {
            "general": "CheckIn Time-Begin: 3:00 PM..."
          }
        }
      ],
      "payment": {
        "method": "account_credit",
        "clearingState": null,
        "paymentStatus": "unpaid"
      },
      "options": {
        "emails": []
      },
      "reference": {
        "agency": "my agency reference",
        "voucherEmail": "test@example.com"
      },
      "profileVersion": "db4da6437c63056f466491ce410eeadf492c0b44"
    },
    "status": "done",
    "errorCode": null,
    "errorMessage": null,
    "requestJson": "{...}",
    "responseJson": "{...}",
    "preBookId": 0,
    "book": {...},
    "dateInsert": "0001-01-01T00:00:00",
    "opportunityId": 0,
    "source": 0
  }
}
```

### שדות חשובים
- **`bookRes.content.bookingID`**: `"3632487"`  
  ⭐ מזהה ההזמנה - לשמירה במערכת!
  
- **`bookRes.content.status`**: `"confirmed"`  
  ⭐ חייב להיות "confirmed" להצלחה!
  
- **`bookRes.content.services[0].supplier.reference`**: `"ME5PPX"`  
  ⭐ מספר הזמנה של הספק (למלון)
  
- **`bookRes.content.bookingDate`**: `"2025-07-24"`  
  תאריך ההזמנה

---

## 4. Flow מלא - דוגמה

### שלב 1: חיפוש
```typescript
const searchResponse = await mediciApi.searchHotels({
  dateFrom: "2025-12-11",
  dateTo: "2025-12-12",
  hotelName: "Dizengoff Inn",
  adults: 2,
  children: []
})

// שמירת החדר שנבחר
const selectedRoom = searchResponse[0].rooms[0]
// code: "697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t"
```

### שלב 2: טרום-הזמנה
```typescript
const prebookResponse = await mediciApi.preBook({
  jsonRequest: selectedRoom.requestJson // מהתשובה של Search
})

// שמירת המידע
const token = prebookResponse.token // "5C0A00D2"
const priceConfirmed = prebookResponse.priceConfirmed // 109.61
const prebookRequestJson = prebookResponse.requestJson // לשלב הבא
```

### שלב 3: הזמנה סופית
```typescript
const bookResponse = await mediciApi.book({
  jsonRequest: buildBookJson({
    prebookRequestJson,
    token,
    customer: {
      title: "MR",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+972501234567",
      address: "Main St 123",
      city: "Tel Aviv",
      country: "IL",
      zip: "6439602"
    },
    voucherEmail: "john@example.com"
  })
})

// בדיקת הצלחה
if (bookResponse.status === "confirmed") {
  console.log("Booking ID:", bookResponse.bookingId) // "3632487"
  console.log("Supplier Ref:", bookResponse.supplierReference) // "ME5PPX"
  // שליחת אישור למייל
  // שמירה ב-DB
}
```

---

## 🔑 נקודות קריטיות

### 1. ה-`code` - המפתח לכל
```
"697024:standard:double:RO:6881f6a596dd21.40624605$1003X1095n1095t"
```
- ייחודי לכל חדר בחיפוש
- **חייב** להישמר בדיוק כפי שמתקבל
- משמש בכל שלבי ההזמנה

### 2. ה-`requestJson` ו-`responseJson`
- כל תשובת API מכילה שניהם
- נשמרים ומועברים בין השלבים
- **אל תשנה אותם!** - העבר כמו שהם

### 3. ה-`token` - פעם אחת בלבד
- מתקבל ב-PreBook
- תקף ל-30 דקות
- משמש **פעם אחת** ב-Book
- אחרי שימוש - לא ניתן לשימוש חוזר

### 4. Status Codes
```
PreBook:
  "status": "done" → הצלחה
  
Book:
  "status": "confirmed" → הזמנה אושרה ✅
  "status": "pending" → ממתין
  "status": "failed" → נכשל ❌
```

### 5. תזמון חשוב
```
Search → מיידי (כ-2-5 שניות)
PreBook → מיידי (כ-1-3 שניות)
  ↓ תקף ל-30 דקות בלבד!
Book → מיידי (כ-3-10 שניות)
  ↓
Confirmation → מיידי
```

---

## 📧 Voucher & Email

בתשובת Book, שים לב ל:
```json
"reference": {
  "agency": "my agency reference",
  "voucherEmail": "test@example.com"
}
```

- `voucherEmail` - לאן לשלוח את אישור ההזמנה
- `agency` - מספר ייחוס שלך (אופציונלי)

---

## ⚠️ Error Handling

### PreBook Failed
```json
{
  "status": "failed",
  "errorCode": "ROOM_NOT_AVAILABLE",
  "errorMessage": "Room is no longer available"
}
```
**פתרון:** חזור לחיפוש, החדר כבר לא זמין.

### Book Failed
```json
{
  "status": "failed",
  "errorCode": "PREBOOK_EXPIRED",
  "errorMessage": "PreBook token has expired"
}
```
**פתרון:** עשה PreBook חדש (עברו 30 דקות).

---

## 🧪 Testing

### Test Credentials
```env
MEDICI_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGci...
MEDICI_APP_KEY=your-app-key-here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
```

### Test Hotel
```
Hotel ID: 697024
Name: Dizengoff Inn
City: Tel Aviv
```

### Test Dates
```
Check-in: 2025-12-11
Check-out: 2025-12-12
Pax: 2 adults, 0 children
```

---

## 📞 Support

לבעיות או שאלות:
- Email: support@medicihotels.com
- Documentation: https://medici-backend.azurewebsites.net/docs

---

**עודכן:** 25 דצמבר 2025  
**גרסה:** 2.0  
**מפתח:** v0.app
