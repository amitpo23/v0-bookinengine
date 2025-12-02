export type Locale = "he" | "en"

export const translations = {
  he: {
    // Search Form
    checkIn: "צ'ק-אין",
    checkOut: "צ'ק-אאוט",
    selectDate: "בחר תאריך",
    guests: "אורחים",
    adults: "מבוגרים",
    children: "ילדים",
    childrenAges: "גיל 0-17",
    adultsAge: "גיל 18+",
    rooms: "חדרים",
    confirm: "אישור",
    searchAvailability: "חפש זמינות",

    // Room Card
    upToGuests: "עד {count} אורחים",
    sqm: "מ״ר",
    roomsLeft: "נותרו {count} חדרים!",
    select: "בחר",
    nights: "לילות",
    night: "לילה",
    forNights: "ל-{count} {nightsText}",

    // Meal Plans
    roomOnly: "לינה בלבד",
    breakfast: "כולל ארוחת בוקר",
    halfBoard: "חצי פנסיון",
    fullBoard: "פנסיון מלא",
    allInclusive: "הכל כלול",

    // Cancellation
    freeCancellation: "ביטול חינם",
    nonRefundable: "ללא החזר",
    partialRefund: "ביטול חלקי",

    // Booking Summary
    bookingSummary: "סיכום הזמנה",
    noRoomsSelected: "טרם נבחרו חדרים",
    totalRooms: "סה״כ חדרים",
    vat: "מע״מ (17%)",
    totalToPay: "סה״כ לתשלום",
    continueToBooking: "המשך להזמנה",

    // Guest Form
    guestDetails: "פרטי האורח",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    email: "אימייל",
    phone: "טלפון",
    country: "מדינה",
    estimatedArrival: "שעת הגעה משוערת",
    selectTime: "בחר שעה",
    specialRequests: "בקשות מיוחדות",
    specialRequestsPlaceholder: "קומה גבוהה, מיטת תינוק, אלרגיות...",
    specialRequestsNote: "בקשות מיוחדות כפופות לזמינות ואינן מובטחות",
    checkInPolicy: "מדיניות הצ'ק-אין של {hotelName}",
    continueToPayment: "המשך לתשלום",
    requiredField: "שדה חובה",
    invalidEmail: "כתובת אימייל לא תקינה",
    invalidPhone: "מספר טלפון לא תקין",
    later: "מאוחר יותר",

    // Payment Form
    securePayment: "פרטי תשלום מאובטח",
    securePaymentStripe: "תשלום מאובטח באמצעות Stripe",
    encryptedSecure: "הפרטים שלך מוצפנים ומאובטחים בתקן PCI-DSS",
    termsAgree: "קראתי ואני מסכים/ה ל",
    bookingTerms: "תנאי ההזמנה",
    and: "ול",
    cancellationPolicy: "מדיניות הביטולים",
    mustAgreeTerms: "יש לאשר את תנאי ההזמנה",
    subtotal: "סכום ביניים",
    pay: "שלם",
    processingPayment: "מעבד תשלום...",
    loadingPaymentForm: "טוען טופס תשלום מאובטח...",
    paymentError: "שגיאה בעיבוד התשלום",
    paymentFormError: "שגיאה בטעינת טופס התשלום",

    // Confirmation
    bookingConfirmed: "ההזמנה אושרה!",
    confirmationSent: "אישור נשלח לכתובת:",
    paidViaStripe: "שולם באמצעות Stripe",
    confirmationNumber: "מספר אישור",
    paymentId: "מזהה תשלום:",
    bookedRooms: "חדרים שהוזמנו",
    stayDuration: "משך השהייה",
    guestName: "שם",
    printConfirmation: "הדפס אישור",
    downloadPdf: "הורד PDF",
    contactHelp: "לשאלות או שינויים בהזמנה, אנא צרו קשר:",
    totalPaid: "סה״כ שולם",
    from: "מ-",
    until: "עד",

    // Steps
    step1: "בחירת תאריכים",
    step2: "בחירת חדרים",
    step3: "פרטי אורח",
    step4: "תשלום",

    // Countries
    israel: "ישראל",
    usa: "ארצות הברית",
    uk: "בריטניה",
    germany: "גרמניה",
    france: "צרפת",
    italy: "איטליה",
    spain: "ספרד",
    russia: "רוסיה",

    // Language
    language: "שפה",
    hebrew: "עברית",
    english: "English",
  },
  en: {
    // Search Form
    checkIn: "Check-in",
    checkOut: "Check-out",
    selectDate: "Select date",
    guests: "Guests",
    adults: "Adults",
    children: "Children",
    childrenAges: "Ages 0-17",
    adultsAge: "Ages 18+",
    rooms: "Rooms",
    confirm: "Confirm",
    searchAvailability: "Search Availability",

    // Room Card
    upToGuests: "Up to {count} guests",
    sqm: "sqm",
    roomsLeft: "Only {count} rooms left!",
    select: "Select",
    nights: "nights",
    night: "night",
    forNights: "for {count} {nightsText}",

    // Meal Plans
    roomOnly: "Room only",
    breakfast: "Breakfast included",
    halfBoard: "Half board",
    fullBoard: "Full board",
    allInclusive: "All inclusive",

    // Cancellation
    freeCancellation: "Free cancellation",
    nonRefundable: "Non-refundable",
    partialRefund: "Partial refund",

    // Booking Summary
    bookingSummary: "Booking Summary",
    noRoomsSelected: "No rooms selected",
    totalRooms: "Total rooms",
    vat: "VAT (17%)",
    totalToPay: "Total to pay",
    continueToBooking: "Continue to booking",

    // Guest Form
    guestDetails: "Guest Details",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    country: "Country",
    estimatedArrival: "Estimated arrival time",
    selectTime: "Select time",
    specialRequests: "Special requests",
    specialRequestsPlaceholder: "High floor, baby crib, allergies...",
    specialRequestsNote: "Special requests are subject to availability",
    checkInPolicy: "{hotelName} check-in policy",
    continueToPayment: "Continue to payment",
    requiredField: "Required field",
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number",
    later: "Later",

    // Payment Form
    securePayment: "Secure Payment Details",
    securePaymentStripe: "Secure payment via Stripe",
    encryptedSecure: "Your details are encrypted and PCI-DSS compliant",
    termsAgree: "I have read and agree to the",
    bookingTerms: "booking terms",
    and: "and",
    cancellationPolicy: "cancellation policy",
    mustAgreeTerms: "You must agree to the terms",
    subtotal: "Subtotal",
    pay: "Pay",
    processingPayment: "Processing payment...",
    loadingPaymentForm: "Loading secure payment form...",
    paymentError: "Payment processing error",
    paymentFormError: "Error loading payment form",

    // Confirmation
    bookingConfirmed: "Booking Confirmed!",
    confirmationSent: "Confirmation sent to:",
    paidViaStripe: "Paid via Stripe",
    confirmationNumber: "Confirmation number",
    paymentId: "Payment ID:",
    bookedRooms: "Booked rooms",
    stayDuration: "Stay duration",
    guestName: "Name",
    printConfirmation: "Print confirmation",
    downloadPdf: "Download PDF",
    contactHelp: "For questions or changes, please contact:",
    totalPaid: "Total paid",
    from: "From",
    until: "Until",

    // Steps
    step1: "Select dates",
    step2: "Select rooms",
    step3: "Guest details",
    step4: "Payment",

    // Countries
    israel: "Israel",
    usa: "United States",
    uk: "United Kingdom",
    germany: "Germany",
    france: "France",
    italy: "Italy",
    spain: "Spain",
    russia: "Russia",

    // Language
    language: "Language",
    hebrew: "עברית",
    english: "English",
  },
} as const

export type TranslationKey = keyof typeof translations.he
