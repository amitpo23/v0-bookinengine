module.exports=[373424,e=>{"use strict";let t=`אתה סוכן הזמנות AI מקצועי עבור פלטפורמת SaaS להזמנות מלונות הרצה בתוך אפליקציית Vercel.

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
- תוך כיבוד קפדני של תגובות ה-API וכללי המלון.`,o=`You are the AI Hotel Booking Agent for the hotel booking SaaS platform running inside a Vercel-based application.

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
- While strictly respecting the API responses and hotel rules.`;function r(e,r,a,n){let s="he"===e?`

--------------------------------------------------
מידע על המלון והקונטקסט
--------------------------------------------------
- שם מלון ברירת מחדל: ${r}
- עיר ברירת מחדל: ${a}
- התאריך היום: ${n}

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
- Default Hotel Name: ${r}
- Default City: ${a}
- Today's Date: ${n}

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

Remember: Use city OR hotelName, never both together!`;return("he"===e?t:o)+s}e.s(["getBookingAgentPrompt",()=>r])},765607,e=>{"use strict";var t=e.i(224389);let o=process.env.NEXT_PUBLIC_SUPABASE_URL||"",r=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"",a=null;o&&r&&(a=(0,t.createClient)(o,r));class n{static async logSearch(e){if(!a)return void console.log("[SearchLogger] Skipping log - Supabase not configured");try{let t=e.dateFrom instanceof Date?e.dateFrom.toISOString().split("T")[0]:e.dateFrom,o=e.dateTo instanceof Date?e.dateTo.toISOString().split("T")[0]:e.dateTo,{error:r}=await a.from("search_logs").insert([{hotel_id:e.hotelId,search_query:e.searchQuery,destination:e.destination,hotel_name:e.hotelName,city:e.city,date_from:t,date_to:o,adults:e.adults,children:e.children,results_count:e.resultsCount??0,found_hotels:e.foundHotels,found_rooms:e.foundRooms,duration_ms:e.durationMs,success:e.success??!0,error_message:e.errorMessage,user_id:e.userId,session_id:e.sessionId,ip_address:e.ipAddress,user_agent:e.userAgent,source:e.source,channel:e.channel,metadata:e.metadata}]);r&&console.error("[SearchLogger] Supabase insert error:",r)}catch(e){console.error("[SearchLogger] Error logging search:",e)}}static async getSearchLogs(e){if(!a)return console.log("[SearchLogger] Skipping getLogs - Supabase not configured"),{logs:[],total:0,limit:e?.limit??50,offset:e?.offset??0};let t=e?.limit??50,o=e?.offset??0,r=a.from("search_logs").select("*",{count:"exact"}).order("created_at",{ascending:!1}).range(o,o+t-1);e?.hotelId&&(r=r.eq("hotel_id",e.hotelId)),e?.userId&&(r=r.eq("user_id",e.userId)),e?.success!==void 0&&(r=r.eq("success",e.success)),e?.source&&(r=r.eq("source",e.source)),e?.dateFrom&&(r=r.gte("created_at",e.dateFrom.toISOString())),e?.dateTo&&(r=r.lte("created_at",e.dateTo.toISOString()));let{data:n,count:s,error:i}=await r;return i?(console.error("[SearchLogger] Error fetching logs:",i),{logs:[],total:0,limit:t,offset:o}):{logs:n||[],total:s||0,limit:t,offset:o}}static async getSearchStats(e){if(!a)return console.log("[SearchLogger] Skipping getSearchStats - Supabase not configured"),{totalSearches:0,successfulSearches:0,failedSearches:0,avgDurationMs:0};let t=a.from("search_logs").select("*",{count:"exact",head:!0}),o=a.from("search_logs").select("*",{count:"exact",head:!0}).eq("success",!0);if(e?.hotelId&&(t=t.eq("hotel_id",e.hotelId),o=o.eq("hotel_id",e.hotelId)),e?.dateFrom){let r=e.dateFrom.toISOString();t=t.gte("created_at",r),o=o.gte("created_at",r)}if(e?.dateTo){let r=e.dateTo.toISOString();t=t.lte("created_at",r),o=o.lte("created_at",r)}let{count:r}=await t,{count:n}=await o;return{total:r||0,successful:n||0,failed:(r||0)-(n||0),successRate:(r||0)>0?((n||0)/r*100).toFixed(2)+"%":"0%",bySource:{},byDestination:{}}}static async deleteOldLogs(e=30){let t=new Date;t.setDate(t.getDate()-e);let{data:o,error:r}=await a.from("search_logs").delete().lt("created_at",t.toISOString());return r?(console.error("[SearchLogger] Error deleting old logs:",r),0):o?.length||0}static async deleteLog(e){try{let{error:t}=await a.from("search_logs").delete().eq("id",e);if(t)return console.error("[SearchLogger] Error deleting log:",t),!1;return!0}catch(e){return console.error("[SearchLogger] Error deleting log:",e),!1}}}e.s(["SearchLogger",()=>n])},326259,e=>e.a(async(t,o)=>{try{var r=e.i(712075),a=e.i(373424),n=e.i(170478),s=e.i(765607),i=e.i(343747),l=t([n]);[n]=l.then?(await l)():l;let m="https://medici-backend.azurewebsites.net",g="eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE";function c(e){if(!e)return"";let t="object"==typeof e?e.url:e;return t?t.startsWith("http")?t:`https://cdn.medicihotels.com/images/${t}`:""}async function d(e){console.log("[v0] Searching Medici API with params:",e);let t=`${m}/api/hotels/GetInnstantSearchPrice`,o={dateFrom:e.dateFrom,dateTo:e.dateTo,pax:[{adults:e.adults||2,children:e.children||[]}],ShowExtendedData:!0,limit:10};e.city?o.city=e.city:e.hotelName?o.hotelName=e.hotelName:o.city="Dubai",console.log("[v0] Request body:",JSON.stringify(o,null,2));try{let e=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify(o)});if(console.log("[v0] Response status:",e.status),!e.ok){let t=await e.text();throw console.log("[v0] Error response:",t),Error(`API error: ${e.status}`)}let r=await e.json();return console.log("[v0] Response items count:",r?.items?.length||0),{results:r,jsonRequest:JSON.stringify(o)}}catch(e){throw console.error("[v0] Search error:",e),e}}async function u(e){let t;console.log("[v0] PreBook with params:",e);let o=`${m}/api/hotels/PreBook`;try{t=JSON.parse(e.searchRequestJson)}catch(e){throw console.error("[v0] Failed to parse search request:",e),Error("Invalid search request JSON")}let r={services:[{searchCodes:[{code:e.code,pax:[{adults:e.adults,children:e.children}]}],searchRequest:t}]},a={jsonRequest:JSON.stringify(r)};try{let e=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify(a)});if(!e.ok){let t=await e.text();throw console.log("[v0] PreBook error:",t),Error(`PreBook error: ${e.status}`)}let t=await e.json();return console.log("[v0] PreBook success:",t),t}catch(e){throw console.error("[v0] PreBook error:",e),e}}async function h(e){let t;console.log("[v0] Book with params:",e);let o=`${m}/api/hotels/Book`;try{t=JSON.parse(e.searchRequestJson)}catch(e){throw console.error("[v0] Failed to parse search request:",e),Error("Invalid search request JSON")}let r=[];for(let t=0;t<e.adults;t++)r.push({title:"MR",name:{first:0===t?e.customer.firstName:`Guest${t+1}`,last:e.customer.lastName},birthDate:"1990-01-01"});let a={customer:{title:"MR",name:{first:e.customer.firstName,last:e.customer.lastName},birthDate:"1990-01-01",contact:{email:e.customer.email,phone:e.customer.phone}},paymentMethod:{methodName:"account_credit"},reference:{agency:"v0-bookinengine-ai-chat",voucherEmail:e.customer.email},services:[{bookingRequest:[{code:e.roomCode,pax:[{adults:r,children:[]}],token:e.token}],searchRequest:t}]},n={jsonRequest:JSON.stringify(a)};try{let e=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify(n)});if(!e.ok){let t=await e.text();throw console.log("[v0] Book error:",t),Error(`Book error: ${e.status}`)}let t=await e.json();return console.log("[v0] Book success:",t),t}catch(e){throw console.error("[v0] Book error:",e),e}}async function p(e){try{let{messages:t,hotelConfig:o,language:l,bookingState:p}=await e.json(),m="he"===l,g=o?.name||"Dizengoff Inn",f=o?.apiSettings?.mediciHotelName||"Dizengoff Inn",y=o?.apiSettings?.mediciCity||o?.city||"Tel Aviv";console.log("[v0] Chat request - Hotel:",g,"API Name:",f),console.log("[v0] Booking state:",p);let R=new Date().toISOString().split("T")[0],k=(0,a.getBookingAgentPrompt)(l,g,y,R);console.log("[v0] Calling AI model...");let{text:I}=await (0,r.generateText)({model:"anthropic/claude-sonnet-4-20250514",system:k,messages:t.map(e=>({role:e.role,content:e.content}))});console.log("[v0] AI response:",I.slice(0,500));let S=I.match(/\[SEARCH\](.*?)\[\/SEARCH\]/s);if(S){console.log("[v0] Found search request:",S[1]);try{let e=JSON.parse(S[1]);console.log("[v0] Parsed search params:",e);let{results:r,jsonRequest:a}=await d({hotelName:f,city:e.city||y,dateFrom:e.dateFrom,dateTo:e.dateTo,adults:e.adults||2,children:e.children||[]}),n=[];if(r?.items&&Array.isArray(r.items)?n=r.items:Array.isArray(r)?n=r:r?.hotels&&(n=r.hotels),n.length>0){let r=n.slice(0,6).map((t,o)=>{let r=t.price?.amount||t.netPrice?.amount||t.price||0,a=t.price?.currency||t.netPrice?.currency||"USD",n=t.images||[],s=function(e){if(!e||0===e.length)return"";let t=e.find(e=>"mainimage"===e.title);return t?c(t):c(e[0])}(n),i=n&&0!==n.length?n.slice(0,10).map(e=>c(e)).filter(Boolean):[],l=t.facilities?.tags||t.facilities?.list||[];return{code:t.code||`${t.hotelId||g}:${o}:${Date.now()}`,hotelId:t.hotelId||0,name:t.hotelName||t.name||"Hotel",hotelName:t.hotelName||g,roomType:t.name||t.category||"Standard Room",board:t.board||"RO",price:r,currency:a,cancellation:t.cancellation?.type||"non-refundable",confirmation:t.confirmation||"immediate",image:s,images:i,description:t.description||"",facilities:l,location:t.city||e.city||y,address:t.address||"",rating:t.stars||4}}),i=I.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").trim(),l=r.map((e,t)=>{let o=0===t?m?" (הכי משתלם)":" (Best Value)":t===r.length-1?m?" (הכי גמיש)":" (Most Flexible)":"";return m?`${t+1}. ${e.hotelName} - ${e.roomType}${o}
   מחיר: $${e.price} ${e.currency}
   קוד חדר: ${e.code}
   ביטול: ${"fully-refundable"===e.cancellation?"ניתן לביטול חינם":"לא ניתן לביטול"}`:`${t+1}. ${e.hotelName} - ${e.roomType}${o}
   Price: $${e.price} ${e.currency}
   Room code: ${e.code}
   Cancellation: ${"fully-refundable"===e.cancellation?"Free cancellation":"Non-refundable"}`}).join("\n\n");return s.SearchLogger.logSearch({hotelName:f,city:e.city||y,dateFrom:e.dateFrom,dateTo:e.dateTo,adults:e.adults||2,children:e.children||0,resultsCount:r.length,foundHotels:n.length,foundRooms:r.length,success:!0,source:"chat",channel:"web",metadata:{hotelId:o?.id,userMessage:t[t.length-1]?.content.substring(0,100)}}).catch(e=>console.error("Failed to log search:",e)),Response.json({message:i+"\n\n"+(m?`מצאתי ${r.length} אפשרויות זמינות:

${l}

איזה חדר מעניין אותך? כתוב את המספר או "אני רוצה את חדר מספר X"`:`I found ${r.length} available options:

${l}

Which room interests you? Write the number or "I want room number X"`),bookingData:{type:"search_results",data:{rooms:r,searchContext:{dateFrom:e.dateFrom,dateTo:e.dateTo,adults:e.adults||2,children:e.children||[],city:e.city||y},jsonRequest:a}}})}}catch(t){console.error("[v0] Search error:",t),s.SearchLogger.logSearch({hotelName:f,city:searchParams?.city||y,dateFrom:searchParams?.dateFrom,dateTo:searchParams?.dateTo,adults:searchParams?.adults||2,children:searchParams?.children||0,resultsCount:0,success:!1,errorMessage:t instanceof Error?t.message:"Unknown search error",source:"chat",channel:"web",metadata:{hotelId:o?.id,error:t instanceof Error?t.toString():String(t)}}).catch(e=>console.error("Failed to log search error:",e));let e=I.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").trim();return Response.json({message:e+"\n\n"+(m?"הייתה בעיה ביצירת קשר עם מערכת ההזמנות. אנא נסה שוב.":"There was an issue contacting the booking system. Please try again.")})}}let b=I.match(/\[SELECT_ROOM\](.*?)\[\/SELECT_ROOM\]/s);if(b&&p?.jsonRequest){console.log("[v0] Room selected, calling PreBook...");try{let e=JSON.parse(b[1]),t=await u({code:e.code,hotelId:e.hotelId,dateFrom:p.searchContext.dateFrom,dateTo:p.searchContext.dateTo,adults:p.searchContext.adults,children:p.searchContext.children,searchRequestJson:p.jsonRequest}),o=I.replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s,"").trim();return Response.json({message:o+"\n\n"+(m?`מעולה! שמרתי את החדר עבורך.
עכשיו אני צריך כמה פרטים:
- שם מלא
- דוא"ל
- מספר טלפון`:`Great! I've reserved the room for you.
Now I need some details:
- Full name
- Email
- Phone number`),bookingData:{type:"prebook_complete",data:{preBookData:t,selectedRoom:e}}})}catch(e){return console.error("[v0] PreBook error:",e),Response.json({message:m?"הייתה בעיה בשמירת החדר. אנא נסה שוב או בחר חדר אחר.":"There was an issue reserving the room. Please try again or select another room."})}}let v=I.match(/\[BOOK\](.*?)\[\/BOOK\]/s);if(v&&p?.preBookData&&p?.selectedRoom&&p?.jsonRequest){console.log("[v0] Completing booking...");try{let e=JSON.parse(v[1]),t=await h({token:p.preBookData.token,preBookId:p.preBookData.preBookId,customer:e,searchRequestJson:p.jsonRequest,roomCode:p.selectedRoom.code,adults:p.searchContext?.adults||2,children:p.searchContext?.children||[]});if(t.bookingId&&t.supplierReference&&n.emailService.isEnabled())try{let o=JSON.parse(p.jsonRequest),r=o.dates?.from||new Date().toISOString(),a=o.dates?.to||new Date().toISOString(),s=Math.ceil((new Date(a).getTime()-new Date(r).getTime())/864e5);n.emailService.sendBookingConfirmation({to:e.email,customerName:`${e.firstName} ${e.lastName}`,bookingId:t.bookingId,supplierReference:t.supplierReference,hotelName:p.selectedRoom?.hotelName||g,roomType:p.selectedRoom?.roomName||"Room",checkIn:(0,i.format)(new Date(r),"MMM dd, yyyy"),checkOut:(0,i.format)(new Date(a),"MMM dd, yyyy"),nights:s,adults:p.searchContext?.adults||2,children:p.searchContext?.children?.length||0,totalPrice:p.preBookData?.netPrice||0,currency:o.currencies?.[0]||"USD",language:l}).then(e=>{e.success?console.log("[AI Chat] ✅ Confirmation email sent",{bookingId:t.bookingId,emailId:e.emailId}):console.warn("[AI Chat] ⚠️ Email failed (non-critical)",e.error)}).catch(e=>{console.error("[AI Chat] Email error (non-critical):",e)})}catch(e){console.error("[AI Chat] Failed to parse search request for email:",e)}let o=I.replace(/\[BOOK\].*?\[\/BOOK\]/s,"").trim();return Response.json({message:o+"\n\n"+(m?`🎉 ההזמנה הושלמה בהצלחה!

מספר הזמנה: ${t.bookingId}
אסמכתא: ${t.supplierReference}

קיבלת אישור במייל ${e.email}`:`🎉 Booking completed successfully!

Booking ID: ${t.bookingId}
Reference: ${t.supplierReference}

You've received confirmation at ${e.email}`),bookingData:{type:"booking_complete",data:{bookingId:t.bookingId,supplierReference:t.supplierReference}}})}catch(e){return console.error("[v0] Book error:",e),Response.json({message:m?"הייתה בעיה בסיום ההזמנה. אנא נסה שוב או צור קשר עם התמיכה.":"There was an issue completing the booking. Please try again or contact support."})}}let O=I.replace(/\[SEARCH\].*?\[\/SEARCH\]/s,"").replace(/\[SELECT_ROOM\].*?\[\/SELECT_ROOM\]/s,"").replace(/\[BOOK\].*?\[\/BOOK\]/s,"").trim();return Response.json({message:O})}catch(e){return console.error("[v0] AI Chat error:",e),Response.json({message:"Sorry, an error occurred. Please try again."},{status:500})}}e.s(["POST",()=>p]),o()}catch(e){o(e)}},!1),991683,e=>e.a(async(t,o)=>{try{var r=e.i(747909),a=e.i(174017),n=e.i(996250),s=e.i(759756),i=e.i(561916),l=e.i(114444),c=e.i(837092),d=e.i(869741),u=e.i(316795),h=e.i(487718),p=e.i(995169),m=e.i(47587),g=e.i(666012),f=e.i(570101),y=e.i(626937),R=e.i(10372),k=e.i(193695);e.i(52474);var I=e.i(257297),S=e.i(326259),b=t([S]);[S]=b.then?(await b)():b;let E=new r.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/booking-chat/route",pathname:"/api/ai/booking-chat",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/ai/booking-chat/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:w,workUnitAsyncStorage:C,serverHooks:A}=E;function v(){return(0,n.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:C})}async function O(e,t,o){E.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/ai/booking-chat/route";r=r.replace(/\/index$/,"")||"/";let n=await E.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:S,params:b,nextConfig:v,parsedUrl:O,isDraftMode:w,prerenderManifest:C,routerServerContext:A,isOnDemandRevalidate:T,revalidateOnlyGenerated:N,resolvedPathname:D,clientReferenceManifest:B,serverActionsManifest:P}=n,_=(0,d.normalizeAppPath)(r),M=!!(C.dynamicRoutes[_]||C.routes[D]),x=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,O,!1):t.end("This page could not be found"),null);if(M&&!w){let e=!!C.routes[D],t=C.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await x();throw new k.NoFallbackError}}let Y=null;!M||E.isDev||w||(Y=D,Y="/index"===Y?"/":Y);let H=!0===E.isDev||!M,F=M&&!H;P&&B&&(0,l.setReferenceManifestsSingleton)({page:r,clientReferenceManifest:B,serverActionsManifest:P,serverModuleMap:(0,c.createServerModuleMap)({serverActionsManifest:P})});let L=e.method||"GET",q=(0,i.getTracer)(),$=q.getActiveScopeSpan(),U={params:b,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r)=>E.onRequestError(e,t,r,A)},sharedContext:{buildId:S}},j=new u.NodeNextRequest(e),J=new u.NodeNextResponse(t),K=h.NextRequestAdapter.fromNodeNextRequest(j,(0,h.signalFromNodeResponse)(t));try{let n=async e=>E.handle(K,U).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=q.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=o.get("next.route");if(a){let t=`${L} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${r}`)}),l=!!(0,s.getRequestMeta)(e,"minimalMode"),c=async s=>{var i,c;let d=async({previousCacheEntry:a})=>{try{if(!l&&T&&N&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(s);e.fetchMetrics=U.renderOpts.fetchMetrics;let i=U.renderOpts.pendingWaitUntil;i&&o.waitUntil&&(o.waitUntil(i),i=void 0);let c=U.renderOpts.collectedTags;if(!M)return await (0,g.sendResponse)(j,J,r,U.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[R.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,a=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:U.renderOpts.collectedExpire;return{value:{kind:I.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:T})},A),t}},u=await E.handleResponse({req:e,nextConfig:v,cacheKey:Y,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:N,responseGenerator:d,waitUntil:o.waitUntil,isMinimalMode:l});if(!M)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==I.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(c=u.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",T?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let h=(0,f.fromNodeOutgoingHttpHeaders)(u.value.headers);return l&&M||h.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||h.get("Cache-Control")||h.set("Cache-Control",(0,y.getCacheControlHeader)(u.cacheControl)),await (0,g.sendResponse)(j,J,new Response(u.value.body,{headers:h,status:u.value.status||200})),null};$?await c($):await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${L} ${r}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},c))}catch(t){if(t instanceof k.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:T})}),M)throw t;return await (0,g.sendResponse)(j,J,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>v,"routeModule",()=>E,"serverHooks",()=>A,"workAsyncStorage",()=>w,"workUnitAsyncStorage",()=>C]),o()}catch(e){o(e)}},!1)];

//# sourceMappingURL=_58246516._.js.map