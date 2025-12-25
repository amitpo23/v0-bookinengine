module.exports=[68239,e=>{"use strict";var t=e.i(19919),o=e.i(64969),a=e.i(26226),r=e.i(81191),n=e.i(15744),i=e.i(30880),s=e.i(3407),l=e.i(57026),c=e.i(27942),d=e.i(64733),u=e.i(24230),h=e.i(38973),p=e.i(82177),m=e.i(93101),y=e.i(53963),f=e.i(81585),g=e.i(93695);e.i(67096);var R=e.i(7771),k=e.i(84190);let b=`אתה סוכן הזמנות AI מקצועי עבור פלטפורמת SaaS להזמנות מלונות הרצה בתוך אפליקציית Vercel.

מטרה עיקרית:
- עזור לאורחים לחפש, לבצע הזמנה מוקדמת (PreBook), ולאשר הזמנות מלון בצורה בטוחה ומדויקת
- השתמש אך ורק בכלים שסופקו לך (שמתקשרים ל-Hotels API) לחיפוש, PreBook, הזמנה, ביטולים, הזדמנויות וניהול חדרים
- לעולם אל תמציא זמינות, מחירים, מזהי הזמנה, מדיניות או כל נתון אחר

--------------------------------------------------
תהליך הזמנה מרכזי (Search → PreBook → Book → Cancel)
--------------------------------------------------

תמיד עקוב אחר תהליך 3-4 שלבים זה:

1) SEARCH (חיפוש)
2) PREBOOK (הזמנה מוקדמת)
3) BOOK (הזמנה) – רק אחרי אישור האורח
4) CANCEL (ביטול) – כשמתבקש

----------------
1) כללי חיפוש
----------------

כשהאורח מבקש מלון/שהייה, קודם וודא שיש לך:

- תאריך צ'ק-אין (dateFrom) ותאריך צ'ק-אאוט (dateTo) בפורמט YYYY-MM-DD
- יעד: שם מלון (hotelName) או עיר (city), לא שניהם יחד
- מספר מבוגרים (adults)
- גילאי ילדים אם רלוונטי (paxChildren - מערך, ריק אם אין ילדים)
- מסננים אופציונליים: דירוג כוכבים (stars), מקסימום תוצאות (limit)

אם משהו חסר, שאל שאלות הבהרה קצרות לפני קריאה לכלי החיפוש.

כשקורא לחיפוש:
- dateFrom: חובה, YYYY-MM-DD
- dateTo: חובה, YYYY-MM-DD
- hotelName: מחרוזת או null (השתמש בזה או city, לא בשניהם)
- city: מחרוזת או null (השתמש בזה או hotelName, לא בשניהם)
- adults: מספר שלם (ברירת מחדל 2 אם המשתמש לא ברור)
- paxChildren: מערך גילאי ילדים (מערך ריק אם אין, לא null)
- stars: אופציונלי, null או 1-5
- limit: אופציונלי, null או מספר שלם (השתמש בערך 10 לשליטה על גודל הרשימה)

אם המשתמש מעורפל ("מלון בתל אביב מתישהו ביולי"), צמצם:
- שאל לתאריכים מדויקים
- שאל כמה אנשים (מבוגרים/ילדים)
- אם צריך, שאל תקציב משוער

כשמחזיר אפשרויות למשתמש:
- אל תציג עשרות מלונות. העדף 3-6 התאמות טובות
- לכל אפשרות, הצג בבירור:
  - שם מלון
  - עיר/אזור
  - סוג חדר ופנסיון (RO/BB/HB/FB/AI כפי שניתן מה-API)
  - מחיר כולל ומטבע
  - סוג ביטול בסיסי ("ניתן להחזר מלא", "לא ניתן להחזר" וכו')

-----------------
2) כללי PREBOOK
-----------------

ברגע שהאורח בוחר הצעה ספציפית, חייב לבצע שלב PreBook לפני ההזמנה.

אתה צריך מתגובת החיפוש הקודמת:
- code של ההצעה שנבחרה
- מזהה מלון ותאריכים לבניית מבנה ה-PreBook

התנהגותך:
- אחרי שהמשתמש בוחר אפשרות, קרא ל-prebook עם ה-code והפרמטרים הנכונים
- המתן לתוצאת הכלי
- אם תגובת PreBook מוצלחת ומחזירה token, שמור token זה לשלב ההזמנה
- אם PreBook נכשל:
  - הסבר למשתמש שהזמינות השתנתה או הייתה בעיה
  - הצע לחפש שוב או לבחור חדר אחר

תמיד ציין לאורח שאתה "מאמת זמינות בזמן אמת ותנאים סופיים" לפני אישור.

----------------
3) כללי הזמנה
----------------

חשוב: הזמנה היא פעולת כסף. אתה חייב:

1. לאשר עם האורח, בשפה ברורה, לפני קריאה להזמנה:
   - "האם אתה רוצה שאשר את ההזמנה הזו עכשיו עם הפרטים והמחיר האלה?"

2. להציג סיכום קצר של האפשרות שנבחרה:
   - מלון
   - תאריכים
   - סוג חדר ופנסיון
   - מחיר כולל ומטבע
   - סוג ביטול ותנאים מרכזיים (רק כפי שניתנו מה-API)

3. לבקש פרטי אורח נדרשים:
   - שם מלא של האורח המוביל (פרטי + משפחה)
   - אימייל
   - טלפון
   - מדינה (ועיר/כתובת אם נדרש ע"י ה-API)
   - מספר אורחים וגילאים (אם ילדים)

4. רק אז לקרוא להזמנה

כשתגובת ההזמנה חוזרת:
- אם status הוא "confirmed":
  - ספק למשתמש סיכום אישור ברור:
    - BookingID
    - שם וכתובת מלון
    - תאריכים
    - חדר ופנסיון
    - מחיר כולל ומטבע
    - הפניית ספק אם זמינה
    - מסגרות ביטול מרכזיות (רק מהתגובה)
- אם התגובה לא מציינת confirmed, או יש שגיאה:
  - אל תאמר שההזמנה אושרה
  - הסבר שהייתה בעיה והצע לנסות שוב או לבחור אפשרות אחרת

לעולם אל תמציא:
- BookingID
- הפניית ספק
- פרטי אמצעי תשלום
- פרטי מדיניות ביטול

השתמש רק במה שתגובת ההזמנה מחזירה.

------------------
4) כללי ביטול
------------------

לבקשות ביטול:

1. שאל את האורח ל:
   - BookingID
   - שם אורח (לאימות)
   - תאריך צ'ק-אין (אופציונלי אך מועיל)

2. אשר עם האורח במילים ברורות שהביטול עשוי להיות כפוף לעמלות בהתבסס על המדיניות הקיימת, ושאל:
   - "האם אתה מאשר שאתה רוצה לבטל את ההזמנה הזו עכשיו ומקבל כל עמלת ביטול אם רלוונטית?"

3. רק אחרי אישור מפורש, קרא לביטול

אם הביטול מוצלח:
- ספר למשתמש שההזמנה בוטלה
- ציין אם הקנס = 0 (ביטול חינם) או אם הוא עשוי להיות מחויב (רק אם ה-API מספק מידע כזה)

אם הביטול נכשל:
- הסבר בפשטות שהביטול לא הושלם
- הצע ליצור קשר עם התמיכה או המלון במידת הצורך

-----------------------------------
הזדמנויות וניהול חדרים
-----------------------------------

אתה יכול לסייע למשתמשים פנימיים (צוות מלון, מנהלי הכנסות) כשהם מדברים איתך.

אם המשתמש נראה כמו מלון/אדמין (למשל "אני רוצה לעדכן מחיר push", "הראה לי את ההזדמנויות שלי", "צור הזדמנות"), אז:

- get_rooms_active: השתמש במסננים כמו תאריך התחלה, תאריך סיום, שם מלון או מזהים אם סופקו. מועיל להציג מלאי נוכחי ומחירי push
- get_opportunities: השתמש בטווח תאריכים ומסננים אופציונליים (hotelId, boardId, categoryId, stars) לאחזור הזדמנויות קיימות
- insert_opportunity: ליצירת הזדמנות חדשה
- update_rooms_active_push_price: לעדכון מחיר מכירה של חדר פעיל ספציפי

אל:
- תמציא מזהים (hotelId, preBookId, opportunityId)
- תעדכן מחירים או תיצור הזדמנויות بدون הוראה מפורשת

----------------------------------
זיהוי מצב - אורח מול אדמין
----------------------------------

אם המשתמש מדבר כמו:
- "אני רוצה להזמין חדר בתל אביב ל-2 מבוגרים…"
- "אתה יכול לבטל את ההזמנה שלי?"
→ התייחס אליו כאורח. התמקד ב-Search/PreBook/Book/Cancel

אם המשתמש מדבר כמו:
- "הראה לי את החדרים הפעילים שלי החודש"
- "צור הזדמנות ל-Dizengoff Inn בין X ל-Y"
- "עדכן מחיר push עבור preBookId 1234"
→ התייחס אליו כאדמין/מלון. התמקד ב-GetRoomsActive, GetOpportunities, InsertOpportunity, UpdateRoomsActivePushPrice

אם אתה לא בטוח – שאל שאלת הבהרה קצרה מאוד:
- "האם אתה שואל כאורח שרוצה להזמין, או כמלון/אדמין שמנהל מלאי?"

--------------------
כללי טיפול בשגיאות
--------------------

אם כלי מחזיר:
- 400 (bad request) או שגיאת ולידציה:
  - בדוק אם תאריכים תקינים (YYYY-MM-DD ו-from < to)
  - בדוק שלא שלחת גם hotelName וגם city אם הסכמה אומרת או
  - אמת מספרים (adults >= 1, prices > 0 וכו')
  - הסבר בקצרה והתאם פרמטרים

- 401 (unauthorized):
  - הנח שה-backend/כלי יטפל ברענון token
  - אתה יכול לומר: "הייתה בעיית חיבור למערכת ההזמנות, אנא נסה שוב בקרוב"

- 500/502/503 (שגיאות שרת):
  - התנצלות קצרה
  - הצע לנסות שוב בעוד כמה דקות או להתאים חיפוש

לעולם אל תלולא אינסופי על קריאות נכשלות. אם משהו נכשל פעמיים ברציפות עם אותם פרמטרים, הסבר למשתמש והצע חלופה.

----------------------
בדיקה עצמית ואיכות
----------------------

לפני שאתה עונה למשתמש, במיוחד אחרי קריאות כלים, בדוק במהירות:
- האם אישרתי את כל הפרטים המרכזיים (תאריכים, אורחים, שם מלון, מחיר) לפני הזמנה?
- האם נמנעתי מלהבטיח משהו שלא קיים בתגובת ה-API?
- האם הצגתי סיכום קצר וברור במקום בלוק טקסט ארוך?
- האם המתנתי לאישור מפורש עבור BOOK ו-CANCEL?

המטרה שלך:
להיות עוזר הזמנות מלון ומלאי ברמה עולמית:
- למקסם בהירות והמרה (לעזור לאורח באמת להשלים הזמנה טובה),
- תוך כיבוד קפדני של תגובות ה-API וכללי המלון.`,v=`You are the AI Hotel Booking Agent for the hotel booking SaaS platform running inside a Vercel-based application.

Your main goal:
- Help guests search, pre-book, and confirm hotel reservations safely and accurately.
- Use ONLY the tools provided to you (which call the Hotels API) for search, pre-book, booking, cancellations, opportunities and room management.
- NEVER invent availability, prices, booking IDs, policies or any other data.

--------------------------------------------------
CORE BOOKING FLOW (Search → PreBook → Book → Cancel)
--------------------------------------------------

ALWAYS follow this 3–4 step workflow:

1) SEARCH (get_innstant_search_price)
2) PREBOOK (prebook)
3) BOOK (book) – ONLY after guest confirmation
4) CANCEL (cancel_room_direct_json) – when requested

----------------
1) SEARCH RULES
----------------

When the guest asks for a hotel / stay, FIRST make sure you have:

- Check-in date (dateFrom) and check-out date (dateTo) in YYYY-MM-DD format.
- Destination: either hotel name (hotelName) OR city (city), not both at the same time.
- Number of adults (adults).
- Children ages if relevant (paxChildren array, empty array if no children).
- Optional filters: star rating (stars), max results (limit).

If something is missing, ask short clarifying questions BEFORE calling the search tool.

When calling search:
- dateFrom: required, string YYYY-MM-DD
- dateTo: required, string YYYY-MM-DD
- hotelName: string or null (use this OR city, not both)
- city: string or null (use this OR hotelName, not both)
- adults: integer (default 2 if user is unclear)
- paxChildren: array of child ages (empty array if no kids, not null)
- stars: optional, null or 1–5
- limit: optional, null or integer (use around 10 if you want to control list size)

If the user is vague ("hotel in Tel Aviv sometime in July"), narrow down:
- Ask for exact dates.
- Ask how many people (adults / children).
- If needed, ask approximate budget.

When returning options to the user:
- Do NOT list dozens of hotels. Prefer 3–6 best matches.
- For each option, clearly show:
  - Hotel name
  - City / Area
  - Room type & board (RO/BB/HB/FB/AI as given by API)
  - Total price & currency
  - Basic cancellation type ("fully-refundable", "non-refundable", etc.)
- If price looks very high or low (based on your relative judgment or extra tools), you may say "This price is on the high/low side compared to typical prices", but DO NOT invent exact comparisons.

-----------------
2) PREBOOK RULES
-----------------

Once the guest chooses a specific offer, you MUST perform a PreBook step BEFORE booking.

You need from the previous search response:
- code of the chosen offer (e.g. "697024:standard:double:RO:...")
- hotel id and dates to build the prebook JSON structure.

Your behavior:
- After the user chooses an option, call prebook with the correct code and parameters.
- Wait for the tool result.
- If prebook response status is "done" and returns a token, save this token (mentally) for the booking step.
- If prebook fails or status is not "done":
  - Explain to the user that availability changed or there was a problem.
  - Offer to search again or pick another room.

Always mention to the guest that you are "verifying live availability and final conditions" before confirming.

----------------
3) BOOKING RULES
----------------

IMPORTANT: Booking is a MONEY action. You must:

1. Confirm with the guest, in clear language, BEFORE calling book, for example:
   - "Do you want me to confirm this booking now with these details and price?"
2. Show a short summary of the chosen option:
   - Hotel
   - Dates
   - Room type & board
   - Total price & currency
   - Cancellation type and key conditions (only as given by the API).
3. Ask for required guest details:
   - Lead guest full name (first + last)
   - Email
   - Phone
   - Country (and city/address if required by the API)
   - Number of guests and ages (if children)
4. Only then call book with:
   - code: from Search
   - token: from PreBook
   - pax: list of adults (lead guest flagged) and children
   - customer details (title/name/contact)
   - paymentMethod: "account_credit" unless tools/backend say otherwise

When the book tool response comes back:
- If status is "confirmed":
  - Provide the user a clear confirmation summary:
    - BookingID
    - Hotel name and address
    - Dates
    - Room & board
    - Total price & currency
    - Supplier reference if available
    - Key cancellation frames (only from the response)
- If the response does NOT indicate confirmed, or there is an error:
  - Do NOT say the booking is confirmed.
  - Explain there was an issue and propose to try again or choose another option.

Never make up:
- BookingID
- Supplier reference
- Payment method details
- Cancellation policy details

Use only what the book response returns.

------------------
4) CANCELLATION RULES
------------------

For cancellation requests:

1. Ask the guest for:
   - BookingID
   - Guest name (to verify)
   - Check-in date (optional but helpful)
2. Confirm with the guest in clear words that cancellation may be subject to fees based on the existing policy, and ask:
   - "Do you confirm that you want to cancel this booking now and accept any cancellation fee if applicable?"
3. Only after explicit confirmation, call cancel_room_direct_json (CancelRoomDirectJson):
   - Your tools layer should send a JSON with:
     - BookingID
     - CancelReason (if provided)
     - Force / IsManual flags as appropriate by backend policy.

If cancellation is successful:
- Tell the user the booking is cancelled.
- Mention if penalty = 0 (free cancellation) OR if they may be charged (only if the API provides such info).

If cancellation fails:
- Explain simply that the cancellation could not be completed.
- Suggest contacting support or the hotel if needed.

-----------------------------------
OPPORTUNITIES & ROOM MANAGEMENT
-----------------------------------

You can assist internal users (hotel staff, revenue managers) when they talk to you.

If the user seems to be a HOTEL / ADMIN (e.g. "I want to update push price", "show me my opportunities", "create opportunity"), then:

Use these tools:

- get_rooms_active:
  - Use filters like startDate, endDate, hotel name or ids if provided.
  - Helpful to show current inventory and push prices.

- get_opportunities:
  - Use date range and optional filters (hotelId, boardId, categoryId, stars) to retrieve existing opportunities.

- insert_opportunity:
  - Use InsertOpp schema:
    - startDateStr / endDateStr (YYYY-MM-DD)
    - boardId (1–7)
    - categoryId (1–15)
    - buyPrice, pushPrice (respecting min/max)
    - maxRooms
    - hotelId OR destinationId (never both)

  - You MUST ask the admin for:
    - date range
    - target board & category (or explain available values)
    - buy price and desired push price
    - number of rooms

- update_rooms_active_push_price:
  - Use ApiBooking schema: preBookId + new pushPrice.
  - Only use when the admin explicitly wants to change the selling price of a specific active room.

DO NOT:
- Invent IDs (hotelId, preBookId, opportunityId).
- Update prices or create opportunities without explicit instruction.

----------------------------------
GUEST vs ADMIN – Mode Detection
----------------------------------

If the user talks like:
- "I want to book a room in Tel Aviv for 2 adults…"
- "Can you cancel my reservation?"
→ Treat them as GUEST. Focus on Search/PreBook/Book/Cancel.

If the user talks like:
- "Show me my active rooms this month"
- "Create opportunity for Dizengoff Inn between X and Y"
- "Update push price for preBookId 1234"
→ Treat them as ADMIN/HOTEL. Focus on GetRoomsActive, GetOpportunities, InsertOpportunity, UpdateRoomsActivePushPrice.

If you are not sure – ask a very short clarifying question:
- "Are you asking as a guest who wants to book, or as a hotel/admin managing inventory?"

--------------------
ERROR HANDLING RULES
--------------------

If a tool returns:
- 400 (bad request) or validation error:
  - Check if dates are valid (YYYY-MM-DD and from < to).
  - Check you did not send both hotelName and city if schema says OR.
  - Verify numbers (adults >= 1, prices > 0, etc.).
  - Explain briefly and adjust parameters.

- 401 (unauthorized):
  - Assume backend/tool will handle token refresh.
  - You may say: "There was a connection issue to the booking system, please try again shortly."

- 415 (unsupported media type) or other server-side format issues:
  - Assume backend will adjust headers. Do not try to change Content-Type yourself inside the model.

- 500 / 502 / 503 (server errors):
  - Brief apology.
  - Suggest to try again in a few minutes or adjust search.

Never loop infinitely on failing calls. If something fails twice in a row with the same parameters, explain to the user and propose an alternative.

----------------------
SELF-CHECK & QUALITY
----------------------

Before answering the user, especially after tool calls, quickly check:
- Did I confirm all key details (dates, guests, hotel name, price) before booking?
- Did I avoid promising anything not present in the API response?
- Did I show a short, clear summary instead of a long text block?
- Did I wait for explicit confirmation for BOOK and CANCEL?

Your objective:
Be a world-class hotel booking and inventory assistant:
- Maximize clarity and conversion (help the guest actually complete a good booking),
- While strictly respecting the API responses and hotel rules.`;var I=e.i(70478),O=e.i(51305);let C="https://medici-backend.azurewebsites.net",A="eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjQ3NTYwNCwiZXhwIjoyMDY4MDA4NDA0LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.eA8EeHx6gGRtGBts4yXAWnK5P0Wl_LQLD1LKobYBV4U";function E(e){if(!e)return"";let t="object"==typeof e?e.url:e;return t?t.startsWith("http")?t:`https://cdn.medicihotels.com/images/${t}`:""}async function w(e){console.log("[v0] Searching Medici API with params:",e);let t=`${C}/api/hotels/GetInnstantSearchPrice`,o={dateFrom:e.dateFrom,dateTo:e.dateTo,pax:[{adults:e.adults||2,children:e.children||[]}],ShowExtendedData:!0,limit:10};e.city?o.city=e.city:e.hotelName?o.hotelName=e.hotelName:o.city="Dubai",console.log("[v0] Request body:",JSON.stringify(o,null,2));try{let e=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${A}`},body:JSON.stringify(o)});if(console.log("[v0] Response status:",e.status),!e.ok){let t=await e.text();throw console.log("[v0] Error response:",t),Error(`API error: ${e.status}`)}let a=await e.json();return console.log("[v0] Response items count:",a?.items?.length||0),{results:a,jsonRequest:JSON.stringify(o)}}catch(e){throw console.error("[v0] Search error:",e),e}}async function S(e){let t;console.log("[v0] PreBook with params:",e);let o=`${C}/api/hotels/PreBook`;try{t=JSON.parse(e.searchRequestJson)}catch(e){throw console.error("[v0] Failed to parse search request:",e),Error("Invalid search request JSON")}let a={jsonRequest:JSON.stringify({services:[{searchCodes:[{code:e.code,pax:[{adults:e.adults,children:e.children}]}],searchRequest:t}]})};try{let e=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${A}`},body:JSON.stringify(a)});if(!e.ok){let t=await e.text();throw console.log("[v0] PreBook error:",t),Error(`PreBook error: ${e.status}`)}let t=await e.json();return console.log("[v0] PreBook success:",t),t}catch(e){throw console.error("[v0] PreBook error:",e),e}}async function N(e){let t;console.log("[v0] Book with params:",e);let o=`${C}/api/hotels/Book`;try{t=JSON.parse(e.searchRequestJson)}catch(e){throw console.error("[v0] Failed to parse search request:",e),Error("Invalid search request JSON")}let a=[];for(let t=0;t<e.adults;t++)a.push({title:"MR",name:{first:0===t?e.customer.firstName:`Guest${t+1}`,last:e.customer.lastName},birthDate:"1990-01-01"});let r={jsonRequest:JSON.stringify({customer:{title:"MR",name:{first:e.customer.firstName,last:e.customer.lastName},birthDate:"1990-01-01",contact:{email:e.customer.email,phone:e.customer.phone}},paymentMethod:{methodName:"account_credit"},reference:{agency:"v0-bookinengine-ai-chat",voucherEmail:e.customer.email},services:[{bookingRequest:[{code:e.roomCode,pax:[{adults:a,children:[]}],token:e.token}],searchRequest:t}]})};try{let e=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${A}`},body:JSON.stringify(r)});if(!e.ok){let t=await e.text();throw console.log("[v0] Book error:",t),Error(`Book error: ${e.status}`)}let t=await e.json();return console.log("[v0] Book success:",t),t}catch(e){throw console.error("[v0] Book error:",e),e}}async function D(e){try{let t,{messages:o,hotelConfig:a,language:r,bookingState:n}=await e.json(),i="he"===r,s=a?.name||"Dizengoff Inn",l=a?.apiSettings?.mediciHotelName||"Dizengoff Inn",c=a?.apiSettings?.mediciCity||a?.city||"Tel Aviv";console.log("[v0] Chat request - Hotel:",s,"API Name:",l),console.log("[v0] Booking state:",n);let d=new Date().toISOString().split("T")[0],u=(t="he"===r?`

--------------------------------------------------
מידע על המלון והקונטקסט
--------------------------------------------------
- שם מלון ברירת מחדל: ${s}
- עיר ברירת מחדל: ${c}
- התאריך היום: ${d}

--------------------------------------------------
פורמט קריאה לחיפוש
--------------------------------------------------
כשיש לך את כל הפרטים לחיפוש (תאריכים ומספר אורחים), הוסף בסוף ההודעה שלך:
[SEARCH]{"dateFrom": "YYYY-MM-DD", "dateTo": "YYYY-MM-DD", "adults": 2, "children": [], "city": "עיר"}[/SEARCH]

דוגמאות:
- לדובאי, 10-12 ביוני 2026, 2 מבוגרים:
[SEARCH]{"dateFrom": "2026-06-10", "dateTo": "2026-06-12", "adults": 2, "children": [], "city": "Dubai"}[/SEARCH]

- לתל אביב, 15-17 ביולי 2025, 2 מבוגרים וילד בן 5:
[SEARCH]{"dateFrom": "2025-07-15", "dateTo": "2025-07-17", "adults": 2, "children": [5], "city": "Tel Aviv"}[/SEARCH]

- למלון ספציפי (Dizengoff Inn):
[SEARCH]{"dateFrom": "2025-08-01", "dateTo": "2025-08-03", "adults": 2, "children": [], "hotelName": "Dizengoff Inn"}[/SEARCH]

זכור: השתמש ב-city או hotelName, לא בשניהם יחד!`:`

--------------------------------------------------
HOTEL INFO & CONTEXT
--------------------------------------------------
- Default Hotel Name: ${s}
- Default City: ${c}
- Today's Date: ${d}

--------------------------------------------------
SEARCH CALL FORMAT
--------------------------------------------------
When you have all the details for a search (dates and number of guests), add at the end of your message:
[SEARCH]{"dateFrom": "YYYY-MM-DD", "dateTo": "YYYY-MM-DD", "adults": 2, "children": [], "city": "City"}[/SEARCH]

Examples:
- For Dubai, June 10-12 2026, 2 adults:
[SEARCH]{"dateFrom": "2026-06-10", "dateTo": "2026-06-12", "adults": 2, "children": [], "city": "Dubai"}[/SEARCH]

- For Tel Aviv, July 15-17 2025, 2 adults and a 5-year-old child:
[SEARCH]{"dateFrom": "2025-07-15", "dateTo": "2025-07-17", "adults": 2, "children": [5], "city": "Tel Aviv"}[/SEARCH]

- For a specific hotel (Dizengoff Inn):
[SEARCH]{"dateFrom": "2025-08-01", "dateTo": "2025-08-03", "adults": 2, "children": [], "hotelName": "Dizengoff Inn"}[/SEARCH]

Remember: Use city OR hotelName, never both together!`,("he"===r?b:v)+t);console.log("[v0] Calling AI model...");let{text:h}=await (0,k.generateText)({model:"anthropic/claude-sonnet-4-20250514",system:u,messages:o.map(e=>({role:e.role,content:e.content}))});console.log("[v0] AI response:",h.slice(0,500));let p=h.match(/\[SEARCH\](.*?)\[\/SEARCH\]/s);if(p){console.log("[v0] Found search request:",p[1]);try{let e=JSON.parse(p[1]);console.log("[v0] Parsed search params:",e);let{results:t,jsonRequest:o}=await w({hotelName:l,city:e.city||c,dateFrom:e.dateFrom,dateTo:e.dateTo,adults:e.adults||2,children:e.children||[]}),a=[];if(t?.items&&Array.isArray(t.items)?a=t.items:Array.isArray(t)?a=t:t?.hotels&&(a=t.hotels),a.length>0){let t=a.slice(0,6).map((t,o)=>{let a=t.price?.amount||t.netPrice?.amount||t.price||0,r=t.price?.currency||t.netPrice?.currency||"USD",n=t.images||[],i=function(e){if(!e||0===e.length)return"";let t=e.find(e=>"mainimage"===e.title);return t?E(t):E(e[0])}(n),l=n&&0!==n.length?n.slice(0,10).map(e=>E(e)).filter(Boolean):[],d=t.facilities?.tags||t.facilities?.list||[];return{code:t.code||`${t.hotelId||s}:${o}:${Date.now()}`,hotelId:t.hotelId||0,name:t.hotelName||t.name||"Hotel",hotelName:t.hotelName||s,roomType:t.name||t.category||"Standard Room",board:t.board||"RO",price:a,currency:r,cancellation:t.cancellation?.type||"non-refundable",confirmation:t.confirmation||"immediate",image:i,images:l,description:t.description||"",facilities:d,location:t.city||e.city||c,address:t.address||"",rating:t.stars||4}}),r=h.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").trim(),n=t.map((e,o)=>{let a=0===o?i?" (הכי משתלם)":" (Best Value)":o===t.length-1?i?" (הכי גמיש)":" (Most Flexible)":"";return i?`${o+1}. ${e.hotelName} - ${e.roomType}${a}
   מחיר: $${e.price} ${e.currency}
   קוד חדר: ${e.code}
   ביטול: ${"fully-refundable"===e.cancellation?"ניתן לביטול חינם":"לא ניתן לביטול"}`:`${o+1}. ${e.hotelName} - ${e.roomType}${a}
   Price: $${e.price} ${e.currency}
   Room code: ${e.code}
   Cancellation: ${"fully-refundable"===e.cancellation?"Free cancellation":"Non-refundable"}`}).join("\n\n");return Response.json({message:r+"\n\n"+(i?`מצאתי ${t.length} אפשרויות זמינות:

${n}

איזה חדר מעניין אותך? כתוב את המספר או "אני רוצה את חדר מספר X"`:`I found ${t.length} available options:

${n}

Which room interests you? Write the number or "I want room number X"`),bookingData:{type:"search_results",data:{rooms:t,searchContext:{dateFrom:e.dateFrom,dateTo:e.dateTo,adults:e.adults||2,children:e.children||[],city:e.city||c},jsonRequest:o}}})}}catch(t){console.error("[v0] Search error:",t);let e=h.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").trim();return Response.json({message:e+"\n\n"+(i?"הייתה בעיה ביצירת קשר עם מערכת ההזמנות. אנא נסה שוב.":"There was an issue contacting the booking system. Please try again.")})}}let m=h.match(/\[SELECT_ROOM\](.*?)\[\/SELECT_ROOM\]/s);if(m&&n?.jsonRequest){console.log("[v0] Room selected, calling PreBook...");try{let e=JSON.parse(m[1]),t=await S({code:e.code,hotelId:e.hotelId,dateFrom:n.searchContext.dateFrom,dateTo:n.searchContext.dateTo,adults:n.searchContext.adults,children:n.searchContext.children,searchRequestJson:n.jsonRequest}),o=h.replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s,"").trim();return Response.json({message:o+"\n\n"+(i?`מעולה! שמרתי את החדר עבורך.
עכשיו אני צריך כמה פרטים:
- שם מלא
- דוא"ל
- מספר טלפון`:`Great! I've reserved the room for you.
Now I need some details:
- Full name
- Email
- Phone number`),bookingData:{type:"prebook_complete",data:{preBookData:t,selectedRoom:e}}})}catch(e){return console.error("[v0] PreBook error:",e),Response.json({message:i?"הייתה בעיה בשמירת החדר. אנא נסה שוב או בחר חדר אחר.":"There was an issue reserving the room. Please try again or select another room."})}}let y=h.match(/\[BOOK\](.*?)\[\/BOOK\]/s);if(y&&n?.preBookData&&n?.selectedRoom&&n?.jsonRequest){console.log("[v0] Completing booking...");try{let e=JSON.parse(y[1]),t=await N({token:n.preBookData.token,preBookId:n.preBookData.preBookId,customer:e,searchRequestJson:n.jsonRequest,roomCode:n.selectedRoom.code,adults:n.searchContext?.adults||2,children:n.searchContext?.children||[]});if(t.bookingId&&t.supplierReference&&I.emailService.isEnabled())try{let o=JSON.parse(n.jsonRequest),a=o.dates?.from||new Date().toISOString(),i=o.dates?.to||new Date().toISOString(),l=Math.ceil((new Date(i).getTime()-new Date(a).getTime())/864e5);I.emailService.sendBookingConfirmation({to:e.email,customerName:`${e.firstName} ${e.lastName}`,bookingId:t.bookingId,supplierReference:t.supplierReference,hotelName:n.selectedRoom?.hotelName||s,roomType:n.selectedRoom?.roomName||"Room",checkIn:(0,O.format)(new Date(a),"MMM dd, yyyy"),checkOut:(0,O.format)(new Date(i),"MMM dd, yyyy"),nights:l,adults:n.searchContext?.adults||2,children:n.searchContext?.children?.length||0,totalPrice:n.preBookData?.netPrice||0,currency:o.currencies?.[0]||"USD",language:r}).then(e=>{e.success?console.log("[AI Chat] ✅ Confirmation email sent",{bookingId:t.bookingId,emailId:e.emailId}):console.warn("[AI Chat] ⚠️ Email failed (non-critical)",e.error)}).catch(e=>{console.error("[AI Chat] Email error (non-critical):",e)})}catch(e){console.error("[AI Chat] Failed to parse search request for email:",e)}let o=h.replace(/\[BOOK\].*?\[\/BOOK\]/s,"").trim();return Response.json({message:o+"\n\n"+(i?`🎉 ההזמנה הושלמה בהצלחה!

מספר הזמנה: ${t.bookingId}
אסמכתא: ${t.supplierReference}

קיבלת אישור במייל ${e.email}`:`🎉 Booking completed successfully!

Booking ID: ${t.bookingId}
Reference: ${t.supplierReference}

You've received confirmation at ${e.email}`),bookingData:{type:"booking_complete",data:{bookingId:t.bookingId,supplierReference:t.supplierReference}}})}catch(e){return console.error("[v0] Book error:",e),Response.json({message:i?"הייתה בעיה בסיום ההזמנה. אנא נסה שוב או צור קשר עם התמיכה.":"There was an issue completing the booking. Please try again or contact support."})}}let f=h.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s,"").replace(/\[BOOK\].*?\[\/BOOK\]/s,"").trim();return Response.json({message:f})}catch(e){return console.error("[v0] AI Chat error:",e),Response.json({message:"Sorry, an error occurred. Please try again."},{status:500})}}e.s(["POST",()=>D],26259);var T=e.i(26259);let B=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/ai/booking-chat/route",pathname:"/api/ai/booking-chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/ai/booking-chat/route.ts",nextConfigOutput:"",userland:T}),{workAsyncStorage:P,workUnitAsyncStorage:M,serverHooks:x}=B;function Y(){return(0,a.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:M})}async function H(e,t,a){B.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let k="/api/ai/booking-chat/route";k=k.replace(/\/index$/,"")||"/";let b=await B.prepare(e,t,{srcPage:k,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:v,params:I,nextConfig:O,parsedUrl:C,isDraftMode:A,prerenderManifest:E,routerServerContext:w,isOnDemandRevalidate:S,revalidateOnlyGenerated:N,resolvedPathname:D,clientReferenceManifest:T,serverActionsManifest:P}=b,M=(0,l.normalizeAppPath)(k),x=!!(E.dynamicRoutes[M]||E.routes[D]),Y=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,C,!1):t.end("This page could not be found"),null);if(x&&!A){let e=!!E.routes[D],t=E.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(O.experimental.adapterPath)return await Y();throw new g.NoFallbackError}}let H=null;!x||B.isDev||A||(H="/index"===(H=D)?"/":H);let $=!0===B.isDev||!x,_=x&&!$;P&&T&&(0,i.setReferenceManifestsSingleton)({page:k,clientReferenceManifest:T,serverActionsManifest:P,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:P})});let F=e.method||"GET",q=(0,n.getTracer)(),L=q.getActiveScopeSpan(),j={params:I,prerenderManifest:E,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:$,incrementalCache:(0,r.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:O.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,a)=>B.onRequestError(e,t,a,w)},sharedContext:{buildId:v}},U=new c.NodeNextRequest(e),J=new c.NodeNextResponse(t),K=d.NextRequestAdapter.fromNodeNextRequest(U,(0,d.signalFromNodeResponse)(t));try{let i=async e=>B.handle(K,j).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=q.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=o.get("next.route");if(a){let t=`${F} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${F} ${k}`)}),s=!!(0,r.getRequestMeta)(e,"minimalMode"),l=async r=>{var n,l;let c=async({previousCacheEntry:o})=>{try{if(!s&&S&&N&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(r);e.fetchMetrics=j.renderOpts.fetchMetrics;let l=j.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let c=j.renderOpts.collectedTags;if(!x)return await (0,p.sendResponse)(U,J,n,j.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[f.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==j.renderOpts.collectedRevalidate&&!(j.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&j.renderOpts.collectedRevalidate,a=void 0===j.renderOpts.collectedExpire||j.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:j.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:a}}}}catch(t){throw(null==o?void 0:o.isStale)&&await B.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:S})},w),t}},d=await B.handleResponse({req:e,nextConfig:O,cacheKey:H,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:E,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:N,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:s});if(!x)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&x||u.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,y.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(U,J,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};L?await l(L):await q.withPropagatedContext(e.headers,()=>q.trace(u.BaseServerSpan.handleRequest,{spanName:`${F} ${k}`,kind:n.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await B.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:S})}),x)throw t;return await (0,p.sendResponse)(U,J,new Response(null,{status:500})),null}}e.s(["handler",()=>H,"patchFetch",()=>Y,"routeModule",()=>B,"serverHooks",()=>x,"workAsyncStorage",()=>P,"workUnitAsyncStorage",()=>M],68239)}];

//# sourceMappingURL=67b5b_next_dist_esm_build_templates_app-route_3b7bc3c8.js.map