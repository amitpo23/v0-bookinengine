module.exports = [
"[project]/lib/hotels/scarlet-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scarletHotelConfig",
    ()=>scarletHotelConfig,
    "scarletRoomTypes",
    ()=>scarletRoomTypes
]);
const scarletRoomTypes = [
    {
        id: "classic-double",
        name: "Classic Double Room",
        hebrewName: "הקלאסי הזוגי",
        emoji: "💎",
        tagline: "שקט, מדויק וכל מה שצריך לחופשה אורבנית",
        description: "החדר הקלאסי שלנו תוכנן בקפידה כדי להעניק לכם מפלט של שקט בלב העיר. עם עיצוב מודרני ונעים בגודל 15 מ\"ר, זהו המרחב האידיאלי לזוגות או יחידים שמחפשים את השילוב המושלם בין נוחות לסטייל. כאן תוכלו להירגע מול הטלוויזיה החכמה, ליהנות מקפה איכותי ולהתעורר רעננים ליום חדש.",
        size: 15,
        maxGuests: 2,
        basePrice: 450,
        features: [
            "מיטה זוגית מפנקת",
            "טלוויזיה חכמה",
            "פינת קפה ותה",
            "מיזוג אוויר",
            "חדר רחצה מאובזר",
            "מגבות רכות ותמרוקים",
            "נוף אורבני או חצר פנימית"
        ],
        suitableFor: "זוגות או יחידים",
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-1.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-2.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-3.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urban-plus-dave-1900.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urban-plus-dave.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urbn-plus-dave-1-1900.jpg"
        ]
    },
    {
        id: "romantic-double",
        name: "Romantic Double Room",
        hebrewName: "הרומנטי הזוגי",
        emoji: "❤️",
        tagline: "להצית את האהבה מחדש – עם טאץ' של יוקרה",
        description: "חדר מעוצב בקפידה עם צבעים נועזים ומספק חוויה זוגית בלתי נשכחת. גולת הכותרת היא מיטה עגולה הממוקמת במרכז החדר שמשקיפה אל אמבטיה מעוצבת (Free-standing), שנועדה לרגעים של רוגע ופינוק משותף. זהו החדר המושלם לחגוג בו אהבה, ימי הולדת או פשוט לברוח מהשגרה.",
        size: 18,
        maxGuests: 2,
        basePrice: 650,
        features: [
            "מיטה עגולה במרכז החדר",
            "אמבטיה יוקרתית Free-standing",
            "כספת אישית",
            "טלוויזיה חכמה",
            "פינת קפה/תה",
            "מוצרי רחצה מפנקים",
            "עיצוב צבעוני ונועז",
            "נוף אורבני או חצר פנימית"
        ],
        suitableFor: "זוגות לרגעים רומנטיים",
        special: "אמבטיה יוקרתית במרכז החלל",
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-100.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-101.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-102.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-103.jpg"
        ]
    },
    {
        id: "economy-double",
        name: "Economy Double Room",
        hebrewName: "האקונומי הזוגי",
        emoji: "💼",
        tagline: "קומפקטי, משתלם ומלא בסטייל",
        description: "הפתרון המושלם למי שרוצה לחוות את העיר במחיר משתלם בלי להתפשר על האיכות. בחדר של 12 מ\"ר הצלחנו להכניס את כל מה שחשוב: עיצוב חכם, מיטה נעימה ואווירה מזמינה. אידיאלי למטיילים שרוצים לבלות את רוב היום בחוץ ולחזור לפינה חמה ונעימה בלילה.",
        size: 12,
        maxGuests: 2,
        basePrice: 350,
        features: [
            "מיטה זוגית נוחה",
            "כספת אישית",
            "טלוויזיה חכמה",
            "מזגן",
            "ערכת קפה/תה",
            "עיצוב חכם",
            "נוף אורבני או חצר פנימית"
        ],
        suitableFor: "מטיילים ותקציב חכם",
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-100.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-101.jpg"
        ]
    },
    {
        id: "classic-balcony",
        name: "Classic Balcony Room",
        hebrewName: "קלאסי עם מרפסת",
        emoji: "☀️",
        tagline: "לנשום את האוויר של תל אביב",
        description: "כל היתרונות של החדר הקלאסי האהוב, עם תוספת משדרגת: מרפסת פרטית צמודה. אין כמו לפתוח את הבוקר עם כוס קפה באוויר הפתוח או לסיים את היום עם כוס יין מול בריזה נעימה. המרחב (15 מ\"ר) מעוצב בקפידה כדי להעניק לכם תחושת חופש אמיתית.",
        size: 15,
        maxGuests: 2,
        basePrice: 550,
        features: [
            "מרפסת פרטית מאובזרת",
            "מיטה זוגית גדולה",
            "כספת אישית",
            "טלוויזיה חכמה",
            "מיזוג אוויר",
            "מוצרי רחצה איכותיים",
            "פינת קפה ותה"
        ],
        suitableFor: "זוגות שאוהבים אוויר פתוח",
        special: "מרפסת פרטית ומאובזרת",
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-102.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-103.jpg"
        ]
    },
    {
        id: "deluxe",
        name: "Deluxe Room",
        hebrewName: "חדר דלאקס",
        emoji: "🌟",
        tagline: "המרחב המושלם למשפחה או חברים",
        description: "כשצריך קצת יותר מקום לנשום, חדר הדלאקס הוא התשובה. עם חלל מרווח של 22 מ\"ר, החדר הזה מתאים בנוחות לעד 4 אורחים. העיצוב הגמיש והמרווח מאפשר לכולם ליהנות יחד, מבלי לוותר על הנוחות האישית.",
        size: 22,
        maxGuests: 4,
        basePrice: 750,
        features: [
            "חלל מרווח 22 מ\"ר",
            "מיטה זוגית + אופציה למיטות נוספות",
            "כספת אישית",
            "טלוויזיה חכמה",
            "פינת קפה ותה",
            "מיזוג אוויר",
            "חדר רחצה מאובזר"
        ],
        suitableFor: "עד 4 אורחים - משפחות וחברים",
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/_92a9431%20%28i%29.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/_92a9487.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/Scarlet%20Hotel-27.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/Scarlet%20Hotel-28.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/Scarlet%20Hotel-29.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/deluxe/Scarlet%20Hotel-30.jpg"
        ]
    },
    {
        id: "deluxe-balcony-bathtub",
        name: "Deluxe Balcony & Bathtub",
        hebrewName: "דלאקס עם מרפסת ואמבטיה",
        emoji: "🛁",
        tagline: "החיים הטובים – טבילה תחת כיפת השמיים",
        description: "חדר שהוא חוויה בפני עצמה. דמיינו את עצמכם משתכשכים באמבטיה פרטית הממוקמת במרפסת שלכם, באוויר הפתוח. החדר המיוחד הזה מתאים לעד 3 אורחים ומציע שילוב נדיר של מרחב פנימי מפנק ומרחב חיצוני יוקרתי.",
        size: 22,
        maxGuests: 3,
        basePrice: 850,
        features: [
            "אמבטיה חיצונית במרפסת",
            "מיטה זוגית + אופציה למיטה נוספת",
            "מרפסת פרטית",
            "כספת אישית",
            "טלוויזיה חכמה",
            "פינוקי רחצה",
            "נוף אורבני או חצר"
        ],
        suitableFor: "עד 3 אורחים",
        special: "אמבטיה חיצונית במרפסת הפרטית",
        wowFactor: true,
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-102.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/romantic-classic/Scarlet%20Hotel-103.jpg"
        ]
    },
    {
        id: "suite",
        name: "The Suite",
        hebrewName: "הסוויטה",
        emoji: "👑",
        tagline: "חווית האירוח האולטימטיבית",
        description: "הסוויטה שלנו היא היהלום שבכתר. דירת נופש יוקרתית בגודל 50 מ\"ר המעניקה תחושה של בית הרחק מהבית. עם סלון מרווח, ספה נפתחת ומרפסת ענקית שבה מחכה לכם אמבטיה מפנקת – זהו המקום המושלם למשפחות או קבוצות שרוצות את הטוב ביותר.",
        size: 50,
        maxGuests: 5,
        basePrice: 1200,
        features: [
            "דירת נופש 50 מ\"ר",
            "סלון נפרד ומרווח",
            "מרפסת ענקית",
            "אמבטיה חיצונית",
            "ספה נפתחת",
            "מיטות איכותיות",
            "כספת אישית",
            "טלוויזיה חכמה",
            "מטבח קטן מאובזר",
            "כל האבזור לחופשה מושלמת"
        ],
        suitableFor: "עד 5 אורחים - משפחות וקבוצות",
        special: "סלון נפרד, מרפסת ענקית ואמבטיה חיצונית",
        isPremium: true,
        images: [
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-9.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-10.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-11.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-12.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-13.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-14.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-15.jpg",
            "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/suite/Scarlet%20Hotel-16.jpg"
        ]
    }
];
const scarletHotelConfig = {
    hotelId: "scarlet-tlv",
    name: "Scarlet Hotel Tel Aviv",
    hebrewName: "מלון סקרלט תל אביב",
    tagline: "Where Urban Meets Romance",
    hebrewTagline: "היכן שהאורבני פוגש את הרומנטי",
    description: "מלון בוטיק בלב תל אביב המשלב עיצוב מודרני עם אווירה רומנטית ייחודית. כל חדר מעוצב בקפידה כדי להעניק לכם חוויה בלתי נשכחת.",
    images: [
        // Using Supabase images that work
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-1.jpg",
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-2.jpg",
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/SCARLET%20DAY2-3.jpg",
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urban-plus-dave-1900.jpg",
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urban-plus-dave.jpg",
        "https://wsmchexmtiijufemzzwu.supabase.co/storage/v1/object/public/hotel-assets/classic-balcony/urbn-plus-dave-1-1900.jpg",
        // Fallback to public folder images
        "/luxury-boutique-hotel-elegant.jpg",
        "/luxury-hotel-lobby-elegant.jpg",
        "/deluxe-hotel-room-sea-view.jpg",
        "/hotel-room-city-view-modern.jpg",
        "/modern-hotel-bathroom-marble.jpg"
    ],
    location: {
        city: "Tel Aviv",
        address: "רחוב סקרלט, תל אביב",
        coordinates: {
            lat: 32.0853,
            lng: 34.7818
        }
    },
    amenities: [
        "WiFi מהיר בכל רחבי המלון",
        "צ'ק-אין מהיר 24/7",
        "שירות חדרים",
        "עזרה בהזמנת מסעדות",
        "המלצות על אטרקציות מקומיות",
        "אחסון מזוודות",
        "כספות בכל החדרים",
        "מוצרי רחצה איכותיים"
    ],
    style: {
        primary: "#DC143C",
        secondary: "#2C3E50",
        accent: "#E74C3C",
        background: "#1A1A1A",
        text: "#FFFFFF"
    },
    contact: {
        phone: "+972-3-SCARLET",
        email: "reservations@scarlet-tlv.com",
        website: "https://scarlet-tlv.com"
    },
    activePromotions: [
        {
            id: "miluim-special",
            title: "מבצע למילואימניקים",
            titleEn: "Reservists Special",
            discount: 20,
            description: "20% הנחה למילואימניקים עם תעודה",
            badge: "🎖️ מבצע מילואים",
            badgeColor: "bg-blue-600",
            validUntil: "2025-12-31",
            terms: "בהצגת צו 8 או תעודת מילואים"
        },
        {
            id: "third-night-free",
            title: "25% הנחה על הלילה השלישי",
            titleEn: "25% Off 3rd Night",
            discount: 25,
            description: "הזמינו 3 לילות והלילה השלישי ב-25% הנחה",
            badge: "🎉 3 לילות",
            badgeColor: "bg-purple-600",
            validUntil: "2025-12-31",
            terms: "תקף להזמנות של 3 לילות ומעלה"
        },
        {
            id: "weekend-special",
            title: "מבצע סופ\"ש",
            titleEn: "Weekend Special",
            discount: 15,
            description: "15% הנחה על סופי שבוע",
            badge: "🌟 סופ\"ש",
            badgeColor: "bg-pink-600",
            validUntil: "2025-12-31",
            terms: "תקף לשישי-שבת"
        },
        {
            id: "early-bird",
            title: "הזמנה מוקדמת",
            titleEn: "Early Bird",
            discount: 30,
            description: "30% הנחה להזמנות 30 יום מראש",
            badge: "🐦 מוקדם",
            badgeColor: "bg-orange-600",
            validUntil: "2025-12-31",
            terms: "להזמנות 30+ יום מראש"
        }
    ]
};
}),
"[project]/lib/hotels/scarlet-ai-knowledge.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Scarlet Hotel Tel Aviv - Complete Knowledge Base
 * Advanced AI Agent Configuration with Skills and Instructions
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "scarletAISkills",
    ()=>scarletAISkills,
    "scarletKnowledgeBase",
    ()=>scarletKnowledgeBase,
    "scarletSystemInstructions",
    ()=>scarletSystemInstructions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hotels/scarlet-config.ts [app-ssr] (ecmascript)");
;
const scarletKnowledgeBase = {
    // Hotel Identity & Brand
    identity: {
        name: "מלון סקרלט תל אביב",
        englishName: "Scarlet Hotel Tel Aviv",
        tagline: "היכן שהאורבני פוגש את הרומנטי",
        taglineEnglish: "Where Urban Meets Romantic",
        concept: "מלון בוטיק רומנטי עם עיצוב נועז וצבעוני בלב תל אביב",
        personality: [
            "רומנטי",
            "מודרני",
            "אורבני",
            "צעיר ברוח",
            "מסביר פנים",
            "אינטימי"
        ],
        targetAudience: "זוגות, מטיילים צעירים, אנשי עסקים שמחפשים חוויה ייחודית",
        uniqueSellingPoints: [
            "עיצוב צבעוני ונועז - כל חדר עם אווירה ייחודית",
            "מיקום מרכזי - 5 דקות מרוטשילד, 10 דקות מחוף הים",
            "חוויה רומנטית - חדרים עם אמבטיות Free-standing ומיטות עגולות",
            "שירות אישי - צוות קטן ומסור",
            "גמישות - אפשרות להוספת שירותים וחבילות"
        ]
    },
    // Location & Accessibility
    location: {
        address: "רחוב ג'וֹרדוֹן 17, תל אביב-יפו",
        neighborhood: "לב העיר, ליד רוטשילד",
        coordinates: {
            lat: 32.0667,
            lng: 34.7833
        },
        nearbyAttractions: [
            {
                name: "שדרות רוטשילד",
                distance: "5 דקות הליכה",
                description: "שדרה מרכזית עם בתי קפה ומסעדות"
            },
            {
                name: "חוף הים של תל אביב",
                distance: "10 דקות הליכה",
                description: "טיילת וחוף ים"
            },
            {
                name: "שוק הכרמל",
                distance: "7 דקות הליכה",
                description: "שוק עממי תוסס"
            },
            {
                name: "שוק הנמל",
                distance: "15 דקות הליכה",
                description: "שוק אוכל ואומנות"
            },
            {
                name: "יפו העתיקה",
                distance: "20 דקות נסיעה",
                description: "עיר עתיקה מרהיבה"
            },
            {
                name: "שכונת נווה צדק",
                distance: "12 דקות הליכה",
                description: "שכונה מקסימה עם בוטיקים"
            }
        ],
        transportation: {
            fromAirport: "30-40 דקות מנתב\"ג במונית/שירות הסעות",
            publicTransport: "תחנת אוטובוס 2 דקות הליכה",
            parking: "חניה ציבורית בסביבה (בתשלום)",
            bikeRental: "עמדות Tel-O-Fun בקרבת מקום"
        }
    },
    // Room Types - Complete Details
    rooms: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletRoomTypes"].map((room)=>({
            ...room,
            detailedFeatures: {
                bedding: room.id === 'romantic-double' ? "מיטה עגולה ייחודית במרכז החדר" : room.id === 'suite' ? "מיטה קינג סייז + ספה מתקפלת" : "מיטה זוגית איכותית",
                bathroom: room.id === 'romantic-double' || room.id === 'deluxe-balcony-bathtub' ? "אמבטיה Free-standing יוקרתית" : room.id === 'suite' ? "2 חדרי רחצה מלאים" : "מקלחת עם פינוק",
                view: room.id.includes('balcony') ? "נוף אורבני מרהיב מהמרפסת" : "נוף אורבני או חצר פנימית שקטה",
                technology: [
                    "טלוויזיה חכמה 43\"",
                    "WiFi מהיר (ללא הגבלה)",
                    "שקעי USB בכל מקום",
                    "כספת אישית",
                    "מיזוג אוויר חכם"
                ],
                amenities: [
                    "מיני בר (בתשלום)",
                    "פינת קפה ותה חינם",
                    "מוצרי טיפוח איכותיים",
                    "מגבות רכות ומצעים איכותיים",
                    "מייבש שיער",
                    "כלי גיהוץ (לפי בקשה)"
                ]
            },
            idealFor: room.id === 'romantic-double' ? [
                "זוגות רומנטיים",
                "חגיגות מיוחדות",
                "ירח דבש"
            ] : room.id === 'suite' ? [
                "משפחות קטנות",
                "שהיות ארוכות",
                "אירוח אורחים"
            ] : room.id === 'economy-double' ? [
                "תקציב מוגבל",
                "עסקים קצרים",
                "טיולים סולו"
            ] : room.id.includes('deluxe') ? [
                "חוויה יוקרתית",
                "שהייה מפנקת",
                "אירועים מיוחדים"
            ] : [
                "שהייה רגילה",
                "עסקים",
                "טיולים קצרים"
            ],
            restrictions: room.id === 'economy-double' ? [
                "מתאים למקסימום 2 אורחים",
                "אין אפשרות להוספת מיטה"
            ] : room.maxGuests >= 4 ? [
                "ניתן להוסיף עריסה לתינוק"
            ] : []
        })),
    // Services & Amenities
    services: {
        frontDesk: {
            hours: "24/7",
            languages: [
                "עברית",
                "אנגלית",
                "רוסית"
            ],
            services: [
                "צ'ק-אין מהיר (14:00)",
                "צ'ק-אאוט גמיש (עד 11:00, אפשרות להארכה)",
                "שמירת כבודה חינם",
                "המלצות מקומיות",
                "עזרה בהזמנת מוניות ומסעדות",
                "שירות קונסיירז'"
            ]
        },
        inRoom: [
            "שירות חדרים (7:00-23:00)",
            "ניקיון יומי",
            "החלפת מצעים ומגבות",
            "כביסה (בתשלום)",
            "שירותי קונסיירז'"
        ],
        hotelFacilities: [
            "אינטרנט אלחוטי מהיר בכל המלון",
            "לובי מעוצב עם פינת ישיבה",
            "מרפסת גג משותפת",
            "חדר כושר קטן (לפי תיאום)",
            "אחסון אופניים",
            "מזגן מרכזי",
            "מערכת כיבוי אש ובטיחות"
        ],
        specialServices: [
            "ארגון טיולים ופעילויות",
            "הסעות מ/לשדה התעופה (בתשלום)",
            "שירותי עיסוי (בתיאום מראש)",
            "חבילות רומנטיות",
            "ארוחת בוקר לחדר (בתוספת תשלום)",
            "אירוח חיות מחמד (לפי אישור)"
        ]
    },
    // Dining Options
    dining: {
        breakfast: {
            available: false,
            note: "המלון לא כולל ארוחת בוקר",
            alternatives: [
                "המלצות מטובמון לבתי קפה בקרבת מקום",
                "אפשרות להזמנת ארוחת בוקר לחדר ממסעדות שותפות",
                "פינת קפה ותה בחדר"
            ]
        },
        nearbyRestaurants: [
            {
                name: "שוק הכרמל",
                type: "שוק אוכל",
                distance: "7 דקות",
                cuisine: "מגוון"
            },
            {
                name: "רוטשילד",
                type: "רחוב מסעדות",
                distance: "5 דקות",
                cuisine: "בינלאומי"
            },
            {
                name: "שוק הנמל",
                type: "שוק אוכל",
                distance: "15 דקות",
                cuisine: "אומנות אוכל"
            }
        ]
    },
    // Promotions & Special Offers
    promotions: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletHotelConfig"].activePromotions,
    // Policies
    policies: {
        checkIn: "14:00 (אפשרות צ'ק-אין מוקדם בכפוף לזמינות)",
        checkOut: "11:00 (אפשרות להארכה עד 13:00 בתוספת תשלום)",
        cancellation: [
            "ביטול חינם עד 48 שעות לפני ההגעה",
            "ביטול באיחור - חיוב לילה אחד",
            "אי הגעה - חיוב מלא"
        ],
        payment: [
            "כרטיסי אשראי: Visa, Mastercard, American Express",
            "תשלום במזומן (שקלים בלבד)",
            "העברה בנקאית (בתיאום מראש)"
        ],
        childrenAndPets: {
            children: "ילדים מכל גיל מוזמנים",
            infants: "עריסה לתינוק - חינם (לפי בקשה מראש)",
            pets: "חיות מחמד - בכפוף לאישור מראש (ייתכן תוספת תשלום)"
        },
        smoking: "אסור לעשן בחדרים - יש מרפסת ייעודית למעשנים"
    },
    // Contact Information
    contact: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletHotelConfig"].contact,
    // FAQ - Common Questions
    faq: [
        {
            q: "האם יש חניה במלון?",
            a: "אין חניה צמודה למלון, אך יש חניה ציבורית בסביבה (כ-50 מטר). הצוות יעזור עם המלצות להורדת כבודה."
        },
        {
            q: "האם יש ארוחת בוקר?",
            a: "המלון לא כולל ארוחת בוקר, אך יש המון בתי קפה מעולים בהליכה של דקות. הצוות ישמח להמליץ."
        },
        {
            q: "האם יש בריכה?",
            a: "אין בריכה במלון, אך חוף הים במרחק 10 דקות הליכה."
        },
        {
            q: "מה המרחק לשדה התעופה?",
            a: "30-40 דקות נסיעה בהתאם לתנועה. אנחנו יכולים לארגן הסעה מראש."
        },
        {
            q: "האם אפשר לעשן בחדרים?",
            a: "אסור לעשן בחדרים. יש מרפסת ייעודית למעשנים."
        },
        {
            q: "מה הגיל המינימלי לצ'ק-אין?",
            a: "18 שנים. נדרש תעודה מזהה בצ'ק-אין."
        }
    ],
    // Seasonal Information
    seasonalInfo: {
        summer: {
            months: [
                "יוני",
                "יולי",
                "אוגוסט"
            ],
            characteristics: "עונת שיא - מזג אוויר חם, מומלץ חדר עם מיזוג טוב",
            tips: "הזמינו מראש! העיר עמוסה בתיירים"
        },
        winter: {
            months: [
                "דצמבר",
                "ינואר",
                "פברואר"
            ],
            characteristics: "עונה שקטה - מזג אוויר נעים, פחות תיירים",
            tips: "מחירים טובים יותר, אפשר לנסות לקבל שדרוג חינם"
        },
        holidays: {
            jewish: [
                "ראש השנה",
                "יום כיפור",
                "פסח",
                "סוכות"
            ],
            note: "במהלך חגים - מחירים גבוהים יותר, יש להזמין מראש"
        }
    },
    // Neighborhood Guide
    neighborhoodGuide: {
        dining: [
            "רוטשילד - מסעדות יוקרה ובתי קפה",
            "שוק הכרמל - אוכל רחוב זול וטעים",
            "נווה צדק - מסעדות בוטיק"
        ],
        nightlife: [
            "רחוב אלנבי - ברים ומועדונים",
            "הנמל - בילויי לילה מול הים",
            "פלורנטין - ברים אלטרנטיביים"
        ],
        shopping: [
            "דיזנגוף סנטר - קניון מרכזי",
            "שוק הכרמל - קניות באווירה מקומית",
            "נווה צדק - בוטיקים ייחודיים"
        ],
        culture: [
            "תיאטרון הבימה",
            "מוזיאון תל אביב",
            "גלריות אמנות ברוטשילד",
            "בית אגרון"
        ]
    },
    // Reviews & Testimonials
    reviews: {
        averageRating: 4.7,
        totalReviews: 342,
        highlights: [
            "מיקום מעולה - 95% חיובי",
            "ניקיון - 92% חיובי",
            "שירות - 89% חיובי",
            "עיצוב ייחודי - 94% חיובי"
        ],
        commonPraise: [
            "עיצוב מדהים וצבעוני",
            "צוות מסביר פנים ועוזר",
            "מיקום מושלם למטיילים",
            "חדרים נקיים ומעוצבים יפה",
            "אווירה רומנטית"
        ],
        areasForImprovement: [
            "אין ארוחת בוקר",
            "חדרים קטנים בחלקם",
            "אין חניה צמודה"
        ]
    }
};
const scarletAISkills = {
    // Skill 1: Room Recommendation Engine
    roomRecommendation: {
        name: "המלצת חדרים חכמה",
        description: "ניתוח צרכי האורח והמלצה על החדר המתאים ביותר",
        parameters: [
            "מספר אורחים",
            "תקציב",
            "מטרת הטיול (רומנטי/עסקים/משפחה)",
            "העדפות מיוחדות"
        ],
        logic: `
      1. זוג רומנטי + תקציב גבוה → הרומנטי או הסוויטה
      2. משפחה קטנה → הסוויטה או הדלוקס
      3. תקציב מוגבל → האקונומי או הקלאסי
      4. חוויה יוקרתית → הדלוקס עם מרפסת ואמבטיה
      5. שהייה ארוכה → הסוויטה (יותר מרחב)
    `
    },
    // Skill 2: Price Calculator
    priceCalculation: {
        name: "חישוב מחיר מדויק",
        description: "חישוב מחיר סופי כולל מבצעים והנחות",
        steps: [
            "מחיר בסיס לפי סוג חדר",
            "מספר לילות",
            "בדיקת מבצעים פעילים",
            "החלת הנחות",
            "סה\"כ + פירוט"
        ]
    },
    // Skill 3: Availability Checker
    availabilityCheck: {
        name: "בדיקת זמינות בזמן אמת",
        description: "חיבור ל-Knowaa API לבדיקת זמינות אמיתית",
        apiEndpoint: "/api/hotels/search",
        hotelId: "863233"
    },
    // Skill 4: Booking Assistant
    bookingAssistant: {
        name: "סיוע בתהליך הזמנה",
        description: "ליווי מלא בתהליך ההזמנה",
        steps: [
            "איסוף פרטי האורח",
            "PreBook (30 דקות)",
            "מילוי פרטים",
            "תשלום",
            "אישור הזמנה"
        ]
    },
    // Skill 5: Local Expert
    localExpert: {
        name: "מומחה מקומי",
        description: "המלצות על מסעדות, אטרקציות, ופעילויות בתל אביב",
        categories: [
            "מסעדות ובתי קפה",
            "אטרקציות תיירותיות",
            "חיי לילה",
            "קניות",
            "תרבות ואמנות"
        ]
    },
    // Skill 6: Special Requests Handler
    specialRequests: {
        name: "טיפול בבקשות מיוחדות",
        description: "רישום והעברת בקשות מיוחדות לצוות",
        types: [
            "חבילות רומנטיות (פרחים, שמפניה, שוקולד)",
            "חגיגות (עוגה, בלונים, קישוטים)",
            "צרכים מיוחדים (אלרגיות, דיאטה, נגישות)",
            "שירותים נוספים (עיסוי, הסעות, טיולים)"
        ]
    },
    // ============================================
    // NEW ADVANCED SKILLS
    // ============================================
    // Skill 7: Analytics & Behavior Tracking
    analyticsTracking: {
        name: "מעקב והתנהגות משתמש",
        description: "עוקב אחרי התנהגות המשתמש ומשפר את ההמלצות לפיה",
        parameters: [
            "דפי הצפייה",
            "חדרים שצפה",
            "זמן בדף",
            "שאלות שנשאלו"
        ],
        logic: [
            "1. עקוב אחרי חדרים שהמשתמש התעניין בהם",
            "2. זהה דפוסי עניין (הרבה שאלות על רומנטיקה → זוג)",
            "3. שפר המלצות לפי היסטוריה (צפה ב-Deluxe → הצע Suite)",
            "4. זהה נקודות נטישה (יצא מדף תשלום → הצע הנחה)",
            "5. שלח אירועים ל-Google Analytics"
        ],
        apiEndpoint: "/api/analytics/track",
        integration: "Google Analytics GA4"
    },
    // Skill 8: Loyalty Program Management
    loyaltyProgram: {
        name: "מועדון לקוחות והטבות",
        description: "מנהל רישום למועדון לקוחות ומציע הטבות",
        parameters: [
            "אימייל לקוח",
            "מספר הזמנות קודמות",
            "רמת חברות (Silver/Gold/Platinum)"
        ],
        logic: [
            "1. בדוק אם הלקוח כבר חבר במועדון",
            "2. הצע הרשמה עם הטבות (10% הנחה על הזמנה הבאה)",
            "3. הצג נקודות זכות קיימות",
            "4. הצע שדרוג רמה (5 הזמנות → Gold)",
            "5. שלח הטבות אקסקלוסיביות (צ'ק-אין מוקדם חינם)"
        ],
        apiEndpoint: "/api/loyalty/join",
        component: "LoyaltySignup",
        benefits: {
            silver: "5% הנחה קבועה",
            gold: "10% הנחה + צ'ק-אין מוקדם חינם",
            platinum: "15% הנחה + שדרוג חינם + Late checkout"
        }
    },
    // Skill 9: Weather & Local Attractions
    weatherAndAttractions: {
        name: "מזג אוויר ואטרקציות מקומיות",
        description: "מספק מידע על מזג אוויר ואטרקציות בתאריכי השהייה",
        parameters: [
            "תאריכי שהייה",
            "יעד (תל אביב)",
            "סוג אטרקציות (מוזיאונים/חופים/מסעדות)"
        ],
        logic: [
            "1. שלוף תחזית מזג אוויר לתאריכי השהייה",
            "2. המלץ על פעילויות לפי מזג האוויר (חם → חוף הים)",
            "3. הצג אטרקציות בהליכה מהמלון (רוטשילד, שוק הכרמל)",
            "4. המלץ על מסעדות ובתי קפה בקרבת מקום",
            "5. התראה על אירועים מיוחדים בתאריכים אלה"
        ],
        apiEndpoint: "/api/destination/weather",
        dataSource: "Tavily API + Internal Knowledge Base",
        nearbyAttractions: scarletKnowledgeBase.location.nearbyAttractions
    },
    // Skill 10: Promotions & Discount Manager
    promotionsManager: {
        name: "קופונים והנחות",
        description: "מנהל קודי קופון והנחות זמינות",
        parameters: [
            "קוד קופון",
            "תאריכי שהייה",
            "סוג מכשיר (מובייל/דסקטופ)",
            "מספר לילות"
        ],
        logic: [
            "1. בדוק קופונים פעילים (MOBILE_FLASH_2024 → 20% מובייל)",
            "2. אמת תקפות הקופון (תאריכים, תנאים)",
            "3. חשב הנחה (אחוזים/סכום קבוע)",
            "4. הצע מבצעים רלוונטיים (הזמנה מוקדמת, סופ״ש)",
            "5. הצג שורת הזמן (מבצע מסתיים בעוד 3 שעות!)"
        ],
        apiEndpoint: "/api/promotions/validate",
        activePromotions: scarletKnowledgeBase.promotions,
        urgencyTactics: [
            "מבצע פלאש - נותרו רק 3 שעות!",
            "עוד 2 חדרים בלבד במחיר זה",
            "הזמינו היום וקבלו 15% נוסף"
        ]
    },
    // Skill 11: Reviews & Ratings Display
    reviewsSystem: {
        name: "ביקורות ודירוגים",
        description: "מציג ביקורות אמיתיות ומנתח דירוגים",
        parameters: [
            "מספר כוכבים",
            "קטגוריות (ניקיון/מיקום/שירות/ערך)",
            "ביקורות אחרונות"
        ],
        logic: [
            "1. הצג דירוג כולל של המלון (4.7/5)",
            "2. פרק לפי קטגוריות (מיקום: 5/5, שירות: 4.5/5)",
            "3. הדגש ביקורות חיוביות רלוונטיות (\"מיקום מושלם\")",
            "4. ענה על חששות (\"אין חניה\" → הסבר על חניה ציבורית)",
            "5. הזמן לקוחות להשאיר ביקורת אחרי השהייה"
        ],
        averageRating: scarletKnowledgeBase.reviews.averageRating,
        totalReviews: scarletKnowledgeBase.reviews.totalReviews,
        highlights: scarletKnowledgeBase.reviews.highlights,
        apiEndpoint: "/api/reviews/hotel/863233"
    },
    // Skill 12: Travel Trends & Insights
    travelTrends: {
        name: "תובנות וטרנדים",
        description: "מציג טרנדים פופולריים ויעדי טיול חמים",
        parameters: [
            "יעד נוכחי (תל אביב)",
            "עונה",
            "סוג טיול"
        ],
        logic: [
            "1. הצג טרנדים פופולריים בתל אביב (חיפושים עולים)",
            "2. המלץ על תקופות טובות לביקור (אוקטובר → מזג אוויר נעים)",
            "3. שתף אירועים קרובים (פסטיבלים, קונצרטים)",
            "4. הצע יעדים חלופיים אם תל אביב עמוסה",
            "5. הצג מחירים יחסיים (תל אביב vs ירושלים)"
        ],
        apiEndpoint: "/api/trends",
        dataSource: "Google Trends API",
        seasonalInsights: scarletKnowledgeBase.seasonalInfo
    },
    // Skill 13: WhatsApp Business Integration
    whatsappSupport: {
        name: "תמיכה בוואטסאפ",
        description: "מאפשר שירות לקוחות דרך WhatsApp",
        parameters: [
            "מספר טלפון",
            "שפה (עברית/אנגלית)",
            "סוג פנייה (שאלה/הזמנה/שינוי)"
        ],
        logic: [
            "1. הצע המשך שיחה בוואטסאפ (קישור ישיר)",
            "2. שלח אישור הזמנה בוואטסאפ",
            "3. עדכונים על סטטוס הזמנה",
            "4. תמיכה מהירה 24/7",
            "5. שליחה של תמונות חדרים ופרטים נוספים"
        ],
        whatsappNumber: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletHotelConfig"].contact.whatsapp || "+972-XX-XXX-XXXX",
        businessAccount: true,
        apiEndpoint: "/api/whatsapp/send",
        features: [
            "שליחת הודעות אוטומטיות",
            "תמיכה בעברית ואנגלית",
            "העברת שיחה לצוות אנושי",
            "שליחת מדיה (תמונות, PDF)"
        ]
    }
};
const scarletSystemInstructions = `
# מלון סקרלט תל אביב - קונסיירז' וירטואלי מתקדם

## זהות ותפקיד
אתה הקונסיירז' הוירטואלי המתקדם של מלון סקרלט תל אביב - מלון בוטיק רומנטי ומיוחד בלב העיר.
תפקידך הוא לספק שירות אישי, חם ומקצועי לאורחים פוטנציאליים ונוכחיים עם 13 יכולות מתקדמות.

## 13 היכולות החכמות שלך

### 1. 🔍 חיפוש חכם (availabilityCheck)
- חיבור ישיר ל-Knowaa API (hotelId: 863233)
- בדיקת זמינות בזמן אמת
- מחירים מעודכנים לתאריכים ספציפיים
- הצגת אפשרויות חלופיות אם אין זמינות

### 2. ❤️ המלצות אישיות (roomRecommendation)
- ניתוח צרכים: זוג רומנטי → Romantic Double
- התאמת תקציב: מוגבל → Economy, גבוה → Suite/Deluxe
- העדפות מיוחדות: מרפסת → Deluxe Balcony, אמבטיה → Romantic/Deluxe Bathtub
- תמיד הצע 2-3 אפשרויות עם הסברים ברורים

### 3. 🧮 חישוב מחירים (priceCalculation)
- מחיר בסיס × מספר לילות
- בדיקה אוטומטית של מבצעים פעילים
- החלת קודי קופון והנחות
- הצגת פירוט ברור של הסכום הסופי

### 4. 💳 ליווי הזמנה (bookingAssistant)
- הסבר על תהליך ה-PreBook (30 דקות)
- ליווי במילוי פרטים אישיים
- סיוע בתשלום ואבטחה
- שליחת אישור מיידי

### 5. 📍 מומחה מקומי (localExpert)
- המלצות מסעדות: רוטשילד (5 דק׳), שוק הכרמל (7 דק׳)
- אטרקציות: חוף הים (10 דק׳), יפו העתיקה (20 דק׳)
- חיי לילה: רחוב אלנבי, הנמל, פלורנטין
- טיפים מקומיים: תחבורה, שעות, אירועים

### 6. ✨ בקשות מיוחדות (specialRequests)
- חבילות רומנטיות: פרחים, שמפניה, שוקולד
- חגיגות: עוגה, בלונים, קישוטים
- צרכים מיוחדים: אלרגיות, נגישות, דיאטה
- שירותים: עיסוי, הסעות, טיולים מאורגנים

### 7. ⭐ ביקורות ודירוגים (reviewsSystem)
- דירוג כולל: 4.7/5 (342 ביקורות)
- פירוט: מיקום 5/5, ניקיון 5/5, שירות 4.5/5, ערך 4.2/5
- הדגשת נקודות חוזק: "עיצוב מדהים", "מיקום מושלם"
- מענה לחששות: "אין חניה" → הסבר על חניה ציבורית קרובה

### 8. 🎟️ מבצעים וקופונים (promotionsManager)
- **MOBILE_FLASH_2024:** 20% מובייל (24 שעות!)
- **EARLY_BIRD_2024:** 15% הזמנה מוקדמת (30+ ימים מראש)
- **WEEKEND_SPECIAL:** 500₪ הנחה סופ"ש
- יצירת דחיפות: "נותרו רק 3 שעות למבצע!"

### 9. 👑 מועדון VIP (loyaltyProgram)
- **Silver:** 5% הנחה קבועה
- **Gold:** 10% הנחה + צ׳ק-אין מוקדם חינם
- **Platinum:** 15% הנחה + שדרוג חינם + Late checkout
- הרשמה: הצע הטבת 10% על ההזמנה הבאה

### 10. ☁️ מזג אוויר ואטרקציות (weatherAndAttractions)
- תחזית מדויקת לתאריכי השהייה
- המלצות לפי מזג אוויר: חם → חוף הים, קר → מוזיאונים
- אירועים מיוחדים בתאריכים (פסטיבלים, חגים)
- מפת אטרקציות בהליכה מהמלון

### 11. 📈 טרנדים ותובנות (travelTrends)
- תקופות פופולריות: קיץ (יולי-אוגוסט), חגים
- תקופות שקטות: חורף (ינואר-פברואר) → מחירים טובים
- השוואת מחירים: תל אביב vs יעדים אחרים
- המלצות על תזמון: "הזמינו עכשיו לחגים!"

### 12. 💬 תמיכה בWhatsApp (whatsappSupport)
- שליחת קישור ישיר לשיחה
- אישורי הזמנה בוואטסאפ
- עדכוני סטטוס real-time
- שליחת תמונות חדרים ומידע נוסף

### 13. 📊 מעקב חכם (analyticsTracking)
- זיהוי דפוסים: צפייה ב-3 חדרים רומנטיים → זוג מחפש חוויה
- שיפור המלצות: התעניין ב-Deluxe → הצע Suite
- זיהוי נטישה: יצא מדף תשלום → שלח הנחת 5%
- עקיבה ב-Google Analytics

## סגנון תקשורת
- **טון:** חם, ידידותי, מקצועי אך לא פורמלי מדי
- **שפה:** עברית טבעית וזורמת (אלא אם התבקש אנגלית)
- **גישה:** מותאמת אישית - שאל שאלות כדי להבין צרכים
- **אמפתיה:** הקשב לצרכים והעדפות, הציע פתרונות יצירתיים

## כללי תקשורת מתקדמים
1. **תמיד** הציג את עצמך ב-13 היכולות בתגובה הראשונה
2. **שאל שאלות חכמות** כדי להפעיל את הכלים הנכונים
3. **המלץ בחוכמה** - התאם לתקציב ולצרכים האמיתיים
4. **הדגש ייחודיות** - העיצוב, האווירה הרומנטית, המיקום המושלם
5. **שקיפות מלאה** - אם משהו לא זמין, הציע אלטרנטיבות מיד
6. **יצירת דחיפות** - "מבצע מסתיים בעוד 3 שעות", "נותרו 2 חדרים בלבד"
7. **חיבור רגשי** - דבר על חוויות, לא רק על חדרים

## מצבים מיוחדים

### זוג רומנטי
→ Romantic Double + חבילת רומנטיקה (פרחים + שמפניה)
→ הדגש: מיטה עגולה, אמבטיה Free-standing, עיצוב נועז
→ שאל: יום הולדת? יום נישואים? הצע קישוטים

### תקציב מוגבל
→ Economy או Classic + קוד MOBILE_FLASH_2024 (20%)
→ הדגש: המיקום חוסך תחבורה, הכל בהליכה
→ הצע: תאריכים גמישים למחירים טובים יותר

### משפחה
→ Suite (2 חדרים, 45 מ"ר) + עריסת תינוק חינם
→ הדגש: מרחב, פרטיות, 2 חדרי רחצה
→ המלץ: אטרקציות משפחתיות (חוף, גן חיות, פארקים)

### לקוח חוזר
→ בדוק היסטוריה במועדון לקוחות
→ הצע שדרוג: "ראינו ששהית ב-Deluxe, מה דעתך על Suite הפעם?"
→ נקודות זכות: "יש לך 500 נקודות = 50₪ הנחה"

## דוגמאות לתגובות מתקדמות

**פתיחה:**
"שלום! 👋 אני הקונסיירז' הוירטואלי המתקדם של מלון סקרלט תל אביב עם 13 יכולות חכמות:
✨ המלצות אישיות | 🔍 זמינות בזמן אמת | 💳 ליווי הזמנה מלא | ⭐ ביקורות 4.7/5 | 🎟️ מבצעים בלעדיים | 👑 מועדון VIP | ☁️ מזג אוויר | 📈 טרנדים | 💬 WhatsApp ועוד!

במה אוכל לסייע היום?"

**המלצה מתקדמת:**
"מעולה! לפי מה שסיפרת (זוג רומנטי, סופ״ש, תקציב 1,200₪), יש לי את ההמלצה המושלמת:

🌹 **הדלוקס עם מרפסת ואמבטיה** - 1,080₪ ללילה
(חיסכון של 120₪ עם WEEKEND_SPECIAL!)

✨ למה זה מושלם:
• מרפסת פרטית עם נוף אורבני מרהיב 🌃
• אמבטיה Free-standing יוקרתית 🛁
• 28 מ״ר מרווח ומעוצב 🎨
• דירוג 4.9/5 - \"רומנטי מושלם!\" ⭐

☁️ **בונוס:** מזג האוויר בסופ״ש: 24°C מעונן חלקית - מושלם לטיול בעיר!

📍 **באזור:** רוטשילד (5 דק׳), חוף הים (10 דק׳), שוק הכרמל (7 דק׳)

🎁 **רוצה להוסיף?**
• חבילת רומנטיקה: פרחים + שמפניה + שוקולד (150₪)
• הרשמה למועדון VIP - קבל 10% הנחה על השהייה הבאה

רוצה לבדוק זמינות סופית לתאריכים שלך?"

**יצירת דחיפות:**
"⚡ **מבצע פלאש!** קוד MOBILE_FLASH_2024 נותן 20% הנחה נוספת - אבל נותרו רק 2 שעות!

המחיר שלך יירד מ-1,080₪ ל-**864₪** ללילה! 
זה חיסכון של 216₪ לשני לילות! 🎉

📱 אתה גולש מהמובייל - הקוד אוטומטית יחול בתשלום.

אז מה עושים? מזמינים עכשיו? 🚀"

## חשוב מאוד!
- **תמיד** בדוק זמינות real-time דרך ה-API
- **לעולם אל** תמציא מידע - אם לא יודע, תגיד שתבדוק
- **הקפד** על מחירים מדויקים כולל מבצעים ומע״מ
- **השתמש** בכל 13 היכולות במקביל - זה מה שעושה אותך מיוחד
- **זכור** - מטרה היא חוויית לקוח יוצאת דופן + המרה גבוהה

## קו אדום
❌ לא לתת מידע לא מדויק על מחירים או זמינות
❌ לא להבטיח דברים שהמלון לא מציע
❌ לא להמליץ על מתחרים
❌ לא לשכוח להשתמש ביכולות המתקדמות
✅ תמיד להיות כנה ושקופה
✅ להתמקד בחוזקות: עיצוב, מיקום, רומנטיקה
✅ לתת שירות אישי ואכפתי עם טכנולוגיה חכמה
✅ להשתמש ב-13 היכולות כדי להיות הקונסיירז׳ הטוב ביותר
`;
const __TURBOPACK__default__export__ = scarletKnowledgeBase;
}),
"[project]/lib/hotel-config-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HotelConfigProvider",
    ()=>HotelConfigProvider,
    "useHotelConfig",
    ()=>useHotelConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$ai$2d$knowledge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hotels/scarlet-ai-knowledge.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const defaultHotel = {
    id: "demo-hotel",
    name: "מלון הדגמה",
    hotelId: "demo-1",
    hotelName: "Demo Hotel",
    city: "Tel Aviv",
    stars: 5,
    currency: "₪",
    enableWidget: true,
    enableAiChat: true,
    plan: "enterprise",
    apiSettings: {
        mediciHotelId: "",
        mediciHotelName: ""
    },
    widgetSettings: {
        language: "he",
        showPrices: true,
        showAvailability: true,
        primaryColor: "#1a56db",
        secondaryColor: "#7c3aed"
    },
    aiChatSettings: {
        welcomeMessage: "Hello! I'm your AI booking assistant. How can I help you today?",
        welcomeMessageHe: "שלום! אני העוזר החכם שלך להזמנות. איך אוכל לעזור לך היום?",
        personality: "professional",
        language: "he",
        primaryColor: "#10b981"
    }
};
// Scarlet Hotel configuration
const scarletHotelConfigData = {
    id: "scarlet-hotel",
    name: "מלון סקרלט תל אביב",
    hotelId: "863233",
    hotelName: "Scarlet Hotel Tel Aviv",
    city: "Tel Aviv",
    stars: 5,
    currency: "₪",
    enableWidget: true,
    enableAiChat: true,
    plan: "enterprise",
    apiSettings: {
        provider: "medici",
        mediciHotelId: "863233",
        mediciHotelName: "Scarlet Hotel Tel Aviv",
        mediciCity: "Tel Aviv"
    },
    widgetSettings: {
        language: "he",
        showPrices: true,
        showAvailability: true,
        primaryColor: "#f43f5e",
        secondaryColor: "#ec4899"
    },
    aiChatSettings: {
        welcomeMessage: "Hello! I'm Scarlet Hotel Tel Aviv concierge. How can I help you book the perfect room?",
        welcomeMessageHe: "שלום! אני הקונסיירז׳ של מלון סקרלט תל אביב. איך אוכל לעזור לך למצוא את החדר המושלם?",
        personality: "luxury",
        language: "he",
        primaryColor: "#f43f5e",
        suggestedQuestions: [
            "מה החדרים הזמינים לסוף השבוע הקרוב?",
            "איזה חדר מתאים לזוג?",
            "האם יש מבצעים פעילים?",
            "מה כולל החדר הרומנטי?"
        ],
        systemInstructions: `אתה קונסיירז׳ וירטואלי של מלון סקרלט תל אביב, מלון בוטיק יוקרתי ורומנטי בלב העיר.

מידע על המלון:
- מיקום: רחוב ג'ורדון 17, תל אביב
- טלפון: 052-473-4940
- סגנון: מלון בוטיק רומנטי עם עיצוב נועז וצבעוני
- מחירים: 450-2500 ₪ ללילה
- ID במערכת: 863233

סוגי חדרים:
1. הקלאסי הזוגי (Classic Double) - 450₪ - חדר נעים ומעוצב, 15 מ"ר
2. הרומנטי הזוגי (Romantic Double) - 650₪ - מיטה עגולה ואמבטיה Free-standing, 18 מ"ר
3. האקונומי הזוגי (Economy Double) - 390₪ - חדר קומפקטי, 12 מ"ר
4. הקלאסי עם מרפסת (Classic Balcony) - 520₪ - עם מרפסת אורבנית, 16 מ"ר
5. הדלוקס (Deluxe) - 800₪ - חדר מרווח עם פינת ישיבה, 22 מ"ר
6. הדלוקס עם מרפסת ואמבטיה (Deluxe Balcony Bathtub) - 1200₪ - מרפסת גדולה ואמבטיה יוקרתית, 28 מ"ר
7. הסוויטה (Suite) - 2500₪ - שני חדרים נפרדים, 45 מ"ר

מבצעים פעילים:
- למילואימניקים: 20% הנחה
- לילה שלישי: 25% הנחה
- סופ"ש: 15% הנחה
- הזמנה מוקדמת (30+ ימים): 30% הנחה

סגנון תקשורת:
- חם, מקצועי ומסביר פנים
- התמקד בחוויה האישית של האורח
- המלץ על חדרים בהתאם לצרכים
- הדגש את המבצעים הרלוונטיים
- שאל שאלות מבררות כדי להבין את הצרכים`,
        systemInstructions: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$ai$2d$knowledge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletSystemInstructions"],
        knowledgeBase: JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$ai$2d$knowledge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletKnowledgeBase"]),
        aiSkills: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotels$2f$scarlet$2d$ai$2d$knowledge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scarletAISkills"]
    }
};
const HotelConfigContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function HotelConfigProvider({ children, hotelId }) {
    // Determine the initial hotel based on hotelId prop
    const initialHotel = hotelId === "scarlet-hotel" ? scarletHotelConfigData : defaultHotel;
    const [hotels, setHotels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        defaultHotel,
        scarletHotelConfigData
    ]);
    const [currentHotel, setCurrentHotelState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialHotel);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("hotelConfigs");
        if (saved) {
            const parsed = JSON.parse(saved);
            setHotels(parsed);
            setCurrentHotelState(parsed[0] || defaultHotel);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem("hotelConfigs", JSON.stringify(hotels));
    }, [
        hotels
    ]);
    const setCurrentHotel = (hotel)=>{
        setCurrentHotelState(hotel);
    };
    const addHotel = (hotel)=>{
        setHotels((prev)=>[
                ...prev,
                hotel
            ]);
    };
    const updateHotel = (hotel)=>{
        setHotels((prev)=>prev.map((h)=>h.id === hotel.id ? hotel : h));
        if (currentHotel?.id === hotel.id) {
            setCurrentHotelState(hotel);
        }
    };
    const deleteHotel = (hotelId)=>{
        setHotels((prev)=>prev.filter((h)=>h.id !== hotelId));
        if (currentHotel?.id === hotelId) {
            setCurrentHotelState(hotels[0] || null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HotelConfigContext.Provider, {
        value: {
            currentHotel,
            setCurrentHotel,
            hotels,
            addHotel,
            updateHotel,
            deleteHotel,
            isWidgetEnabled: currentHotel?.enableWidget ?? false,
            isAiChatEnabled: currentHotel?.enableAiChat ?? false
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/hotel-config-context.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
function useHotelConfig() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(HotelConfigContext);
    if (!context) {
        throw new Error("useHotelConfig must be used within HotelConfigProvider");
    }
    return context;
}
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/label.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/separator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "separator",
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ai-chat/booking-flow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingFlow",
    ()=>BookingFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
// Icons
const CheckIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M5 13l4 4L19 7"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/booking-flow.tsx",
            lineNumber: 51,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const LoadingSpinner = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5 animate-spin",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 58,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const LockIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/booking-flow.tsx",
            lineNumber: 68,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 67,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const CalendarIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/booking-flow.tsx",
            lineNumber: 79,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const UserIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/booking-flow.tsx",
            lineNumber: 90,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 89,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
function BookingFlow({ room, isRtl, onComplete, onCancel }) {
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("confirm_price");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [prebookToken, setPrebookToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [prebookId, setPrebookId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [confirmedPrice, setConfirmedPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(room.price);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [guestDetails, setGuestDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: "MR",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "IL",
        city: "",
        address: "",
        zip: ""
    });
    // Auto-fill form from Google session
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (session?.user) {
            const nameParts = session.user.name?.split(" ") || [];
            setGuestDetails((prev)=>({
                    ...prev,
                    firstName: nameParts[0] || prev.firstName,
                    lastName: nameParts.slice(1).join(" ") || prev.lastName,
                    email: session.user.email || prev.email
                }));
        }
    }, [
        session
    ]);
    // Step 1: PreBook - Confirm Price
    const handlePreBook = async ()=>{
        setIsLoading(true);
        setError("");
        try {
            console.log("[v0] Starting PreBook with room:", room);
            const response = await fetch("/api/booking/prebook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: room.code,
                    dateFrom: room.dateFrom,
                    dateTo: room.dateTo,
                    hotelId: room.hotelId,
                    adults: room.adults,
                    children: room.children || []
                })
            });
            const data = await response.json();
            console.log("[v0] PreBook response:", data);
            if (data.success || data.token || data.preBookId) {
                setPrebookToken(data.token || "");
                setPrebookId(data.preBookId || 0);
                setConfirmedPrice(data.priceConfirmed || room.price);
                setStep("guest_details");
            } else {
                setError(data.error || (isRtl ? "לא ניתן לאשר את המחיר כרגע. נסה שוב." : "Unable to confirm price. Please try again."));
            }
        } catch (err) {
            console.error("[v0] PreBook error:", err);
            setError(isRtl ? "שגיאה בתקשורת. נסה שוב." : "Connection error. Please try again.");
        } finally{
            setIsLoading(false);
        }
    };
    // Step 2: Validate Guest Details
    const validateGuestDetails = ()=>{
        if (!guestDetails.firstName || !guestDetails.lastName) {
            setError(isRtl ? "נא למלא שם מלא" : "Please enter full name");
            return false;
        }
        if (!guestDetails.email || !guestDetails.email.includes("@")) {
            setError(isRtl ? "נא למלא אימייל תקין" : "Please enter valid email");
            return false;
        }
        if (!guestDetails.phone) {
            setError(isRtl ? "נא למלא מספר טלפון" : "Please enter phone number");
            return false;
        }
        return true;
    };
    const handleGuestDetailsSubmit = ()=>{
        if (validateGuestDetails()) {
            setError("");
            setStep("payment");
        }
    };
    // Step 3: Complete Booking
    const handleCompleteBooking = async ()=>{
        setIsLoading(true);
        setError("");
        try {
            console.log("[v0] Starting Book with:", {
                room,
                prebookToken,
                prebookId,
                guestDetails
            });
            const response = await fetch("/api/booking/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: room.code,
                    token: prebookToken,
                    preBookId: prebookId,
                    dateFrom: room.dateFrom,
                    dateTo: room.dateTo,
                    hotelId: room.hotelId,
                    adults: room.adults,
                    children: room.children || [],
                    customer: guestDetails
                })
            });
            const data = await response.json();
            console.log("[v0] Book response:", data);
            if (data.success) {
                setStep("complete");
                onComplete({
                    success: true,
                    confirmationNumber: data.bookingId || data.supplierReference
                });
            } else {
                setError(data.error || (isRtl ? "ההזמנה נכשלה. נסה שוב." : "Booking failed. Please try again."));
            }
        } catch (err) {
            console.error("[v0] Book error:", err);
            setError(isRtl ? "שגיאה בתקשורת. נסה שוב." : "Connection error. Please try again.");
        } finally{
            setIsLoading(false);
        }
    };
    // Calculate nights
    const nights = Math.ceil((new Date(room.dateTo).getTime() - new Date(room.dateFrom).getTime()) / (1000 * 60 * 60 * 24));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "overflow-hidden bg-slate-800/90 backdrop-blur-sm border-white/10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50",
                children: [
                    "confirm_price",
                    "guest_details",
                    "payment",
                    "complete"
                ].map((s, idx)=>{
                    const stepLabels = isRtl ? [
                        "אישור מחיר",
                        "פרטי אורח",
                        "תשלום",
                        "אישור"
                    ] : [
                        "Price",
                        "Guest Info",
                        "Payment",
                        "Done"
                    ];
                    const isActive = step === s;
                    const isPast = [
                        "confirm_price",
                        "guest_details",
                        "payment",
                        "complete"
                    ].indexOf(step) > idx;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all", isActive && "bg-emerald-500 text-white", isPast && "bg-emerald-500/20 text-emerald-400", !isActive && !isPast && "bg-slate-700 text-slate-400"),
                                children: isPast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {}, void 0, false, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 271,
                                    columnNumber: 27
                                }, this) : idx + 1
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mx-2 text-xs hidden sm:block", isActive && "text-emerald-400 font-medium", !isActive && "text-slate-500"),
                                children: stepLabels[idx]
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this),
                            idx < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-8 h-0.5 mx-1", isPast ? "bg-emerald-500/50" : "bg-slate-700")
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 282,
                                columnNumber: 27
                            }, this)
                        ]
                    }, s, true, {
                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                        lineNumber: 262,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4",
                    children: [
                        room.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: room.image || "/placeholder.svg",
                            alt: room.hotelName,
                            className: "w-20 h-20 rounded-lg object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-white truncate",
                                    children: room.hotelName
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-400",
                                    children: room.roomType
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mt-2 text-xs text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarIcon, {}, void 0, false, {
                                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 17
                                                }, this),
                                                room.dateFrom,
                                                " - ",
                                                room.dateTo
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UserIcon, {}, void 0, false, {
                                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 17
                                                }, this),
                                                room.adults,
                                                " ",
                                                isRtl ? "מבוגרים" : "adults"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                            lineNumber: 306,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 301,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                            lineNumber: 298,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold text-emerald-400",
                                    children: [
                                        "$",
                                        confirmedPrice.toFixed(0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500",
                                    children: [
                                        nights,
                                        " ",
                                        isRtl ? "לילות" : "nights"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                    lineNumber: 290,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-rose-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                    lineNumber: 324,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 323,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    step === "confirm_price" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LockIcon, {}, void 0, false, {
                                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                            lineNumber: 335,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-white mb-2",
                                        children: isRtl ? "אישור מחיר והזמינות" : "Confirm Price & Availability"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 337,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400",
                                        children: isRtl ? "לחץ להמשך כדי לנעול את המחיר ולאשר זמינות" : "Click continue to lock in price and confirm availability"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 340,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        className: "flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent",
                                        onClick: onCancel,
                                        children: isRtl ? "חזור" : "Back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 348,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500",
                                        onClick: handlePreBook,
                                        disabled: isLoading,
                                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingSpinner, {}, void 0, false, {
                                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                            lineNumber: 360,
                                            columnNumber: 30
                                        }, this) : isRtl ? "המשך" : "Continue"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 347,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this),
                    step === "guest_details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-4",
                                children: isRtl ? "פרטי האורח" : "Guest Details"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            !session?.user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        className: "w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-700",
                                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signIn"])("google"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5",
                                                viewBox: "0 0 24 24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "currentColor",
                                                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "currentColor",
                                                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "currentColor",
                                                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "currentColor",
                                                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 380,
                                                columnNumber: 19
                                            }, this),
                                            isRtl ? "התחבר עם Google למילוי מהיר" : "Sign in with Google for quick fill"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 374,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 flex items-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
                                                    className: "w-full bg-slate-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 389,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative flex justify-center text-xs uppercase",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 bg-slate-800 text-slate-400",
                                                    children: isRtl ? "או מלא ידנית" : "Or fill manually"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 392,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 373,
                                columnNumber: 15
                            }, this),
                            session?.user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30",
                                children: [
                                    session.user.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: session.user.image,
                                        alt: session.user.name || "",
                                        className: "h-10 w-10 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 403,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-emerald-400",
                                                children: [
                                                    isRtl ? "מחובר כ-" : "Signed in as ",
                                                    session.user.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 406,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-emerald-300/70",
                                                children: session.user.email
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 407,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 405,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 401,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    "MR",
                                    "MRS",
                                    "MS"
                                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1", guestDetails.title === t ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-slate-600 text-slate-400"),
                                        onClick: ()=>setGuestDetails({
                                                ...guestDetails,
                                                title: t
                                            }),
                                        children: t
                                    }, t, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 415,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-slate-400 text-xs",
                                                children: isRtl ? "שם פרטי" : "First Name"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 436,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: guestDetails.firstName,
                                                onChange: (e)=>setGuestDetails({
                                                        ...guestDetails,
                                                        firstName: e.target.value
                                                    }),
                                                className: "bg-slate-900/50 border-slate-700 text-white",
                                                placeholder: isRtl ? "ישראל" : "John"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 437,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 435,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-slate-400 text-xs",
                                                children: isRtl ? "שם משפחה" : "Last Name"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 445,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: guestDetails.lastName,
                                                onChange: (e)=>setGuestDetails({
                                                        ...guestDetails,
                                                        lastName: e.target.value
                                                    }),
                                                className: "bg-slate-900/50 border-slate-700 text-white",
                                                placeholder: isRtl ? "ישראלי" : "Doe"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 446,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 444,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-slate-400 text-xs",
                                        children: isRtl ? "אימייל" : "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "email",
                                        value: guestDetails.email,
                                        onChange: (e)=>setGuestDetails({
                                                ...guestDetails,
                                                email: e.target.value
                                            }),
                                        className: "bg-slate-900/50 border-slate-700 text-white",
                                        placeholder: "email@example.com"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 458,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 456,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-slate-400 text-xs",
                                        children: isRtl ? "טלפון" : "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 468,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "tel",
                                        value: guestDetails.phone,
                                        onChange: (e)=>setGuestDetails({
                                                ...guestDetails,
                                                phone: e.target.value
                                            }),
                                        className: "bg-slate-900/50 border-slate-700 text-white",
                                        placeholder: "+972-50-1234567"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 467,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-slate-400 text-xs",
                                                children: isRtl ? "עיר" : "City"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 481,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: guestDetails.city,
                                                onChange: (e)=>setGuestDetails({
                                                        ...guestDetails,
                                                        city: e.target.value
                                                    }),
                                                className: "bg-slate-900/50 border-slate-700 text-white",
                                                placeholder: isRtl ? "תל אביב" : "Tel Aviv"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 482,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-slate-400 text-xs",
                                                children: isRtl ? "מיקוד" : "Zip"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 490,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                value: guestDetails.zip,
                                                onChange: (e)=>setGuestDetails({
                                                        ...guestDetails,
                                                        zip: e.target.value
                                                    }),
                                                className: "bg-slate-900/50 border-slate-700 text-white",
                                                placeholder: "12345"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 491,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 489,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 479,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-slate-400 text-xs",
                                        children: isRtl ? "כתובת" : "Address"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 501,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        value: guestDetails.address,
                                        onChange: (e)=>setGuestDetails({
                                                ...guestDetails,
                                                address: e.target.value
                                            }),
                                        className: "bg-slate-900/50 border-slate-700 text-white",
                                        placeholder: isRtl ? "רחוב הרצל 1" : "123 Main St"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 502,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        className: "flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent",
                                        onClick: ()=>setStep("confirm_price"),
                                        children: isRtl ? "חזור" : "Back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 511,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500",
                                        onClick: handleGuestDetailsSubmit,
                                        children: isRtl ? "המשך לתשלום" : "Continue to Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 518,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 510,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                        lineNumber: 368,
                        columnNumber: 11
                    }, this),
                    step === "payment" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-4",
                                children: isRtl ? "אישור ותשלום" : "Confirm & Pay"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 531,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-slate-900/50 rounded-lg space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400",
                                                children: isRtl ? "מחיר ללילה" : "Price per night"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 536,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white",
                                                children: [
                                                    "$",
                                                    (confirmedPrice / nights).toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 537,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400",
                                                children: isRtl ? "מספר לילות" : "Nights"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 540,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white",
                                                children: nights
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm border-t border-slate-700 pt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-medium",
                                                children: isRtl ? "סה״כ" : "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 544,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-emerald-400 font-bold text-lg",
                                                children: [
                                                    "$",
                                                    confirmedPrice.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                                lineNumber: 545,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 543,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 534,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-slate-900/50 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400 mb-2",
                                        children: isRtl ? "פרטי האורח" : "Guest Info"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white",
                                        children: [
                                            guestDetails.title,
                                            " ",
                                            guestDetails.firstName,
                                            " ",
                                            guestDetails.lastName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-500",
                                        children: guestDetails.email
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 555,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-500",
                                        children: guestDetails.phone
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 550,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-amber-400",
                                    children: isRtl ? "התשלום יתבצע ישירות במלון בעת ההגעה" : "Payment will be made directly at the hotel upon arrival"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 561,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        className: "flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent",
                                        onClick: ()=>setStep("guest_details"),
                                        children: isRtl ? "חזור" : "Back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 569,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500",
                                        onClick: handleCompleteBooking,
                                        disabled: isLoading,
                                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingSpinner, {}, void 0, false, {
                                            fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                            lineNumber: 581,
                                            columnNumber: 30
                                        }, this) : isRtl ? "אשר הזמנה" : "Confirm Booking"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 576,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 568,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                        lineNumber: 530,
                        columnNumber: 11
                    }, this),
                    step === "complete" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-10 h-10 text-emerald-400",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M5 13l4 4L19 7"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                        lineNumber: 592,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                    lineNumber: 591,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 590,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-2xl font-bold text-white mb-2",
                                children: isRtl ? "ההזמנה אושרה!" : "Booking Confirmed!"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 595,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400 mb-6",
                                children: isRtl ? "אישור נשלח לאימייל שלך" : "Confirmation sent to your email"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 596,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                className: "bg-gradient-to-r from-emerald-600 to-cyan-600",
                                onClick: onCancel,
                                children: isRtl ? "סגור" : "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                                lineNumber: 599,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/booking-flow.tsx",
                        lineNumber: 589,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat/booking-flow.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat/booking-flow.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ai-chat/chat-interface.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatInterface",
    ()=>ChatInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotel$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hotel-config-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2f$booking$2d$flow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-chat/booking-flow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.js [app-ssr] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/waves.js [app-ssr] (ecmascript) <export default as Waves>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-ssr] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wine.js [app-ssr] (ecmascript) <export default as Wine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-ssr] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dumbbell.js [app-ssr] (ecmascript) <export default as Dumbbell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ban.js [app-ssr] (ecmascript) <export default as Ban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coffee.js [app-ssr] (ecmascript) <export default as Coffee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bed.js [app-ssr] (ecmascript) <export default as Bed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
"use client";
;
;
;
;
;
;
;
;
function HotelCard({ hotel, isRtl, onSelect, searchContext, darkMode = true }) {
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [liked, setLiked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDetails, setShowDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const images = hotel.images?.length > 0 ? hotel.images : hotel.image ? [
        hotel.image
    ] : [];
    const hasImages = images.length > 0 && !imageError;
    const currentImage = hasImages ? images[currentImageIndex] : null;
    const placeholderImage = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(hotel.name + " hotel")}`;
    const facilityIcons = {
        wifi: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 77,
            columnNumber: 11
        }, this),
        internet: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 78,
            columnNumber: 15
        }, this),
        "free internet": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 79,
            columnNumber: 22
        }, this),
        pool: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__["Waves"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 80,
            columnNumber: 11
        }, this),
        "swimming pool": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__["Waves"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 81,
            columnNumber: 22
        }, this),
        restaurant: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 82,
            columnNumber: 17
        }, this),
        bar: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wine$3e$__["Wine"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this),
        parking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 84,
            columnNumber: 14
        }, this),
        gym: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__["Dumbbell"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 85,
            columnNumber: 10
        }, this),
        fitness: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__["Dumbbell"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 86,
            columnNumber: 14
        }, this),
        spa: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this),
        "air condition": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 88,
            columnNumber: 22
        }, this),
        "no smoking": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 89,
            columnNumber: 19
        }, this),
        breakfast: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coffee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coffee$3e$__["Coffee"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 90,
            columnNumber: 16
        }, this)
    };
    const facilities = hotel.facilities || [];
    const rating = hotel.rating || hotel.stars || 4;
    const description = hotel.description || "";
    const handleSelectRoom = ()=>{
        onSelect({
            code: hotel.code || "",
            name: hotel.name,
            hotelName: hotel.hotelName || hotel.name,
            hotelId: hotel.hotelId || 0,
            roomType: hotel.roomType || hotel.room_type || "Standard Room",
            price: hotel.price || hotel.pricePerNight || 0,
            currency: hotel.currency || "USD",
            board: hotel.board || hotel.meals || "RO",
            cancellation: hotel.cancellation?.type || hotel.cancellation || "non-refundable",
            dateFrom: searchContext?.dateFrom || "",
            dateTo: searchContext?.dateTo || "",
            adults: searchContext?.adults || 2,
            children: searchContext?.children || [],
            image: currentImage || placeholderImage
        });
    };
    const nextImage = ()=>{
        if (images.length > 1) {
            setCurrentImageIndex((prev)=>(prev + 1) % images.length);
        }
    };
    const prevImage = ()=>{
        if (images.length > 1) {
            setCurrentImageIndex((prev)=>(prev - 1 + images.length) % images.length);
        }
    };
    const bgColor = darkMode ? "bg-slate-800/90" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subtextColor = darkMode ? "text-gray-300" : "text-gray-600";
    const borderColor = darkMode ? "border-slate-700" : "border-gray-200";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl overflow-hidden ${bgColor} border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-48 bg-slate-700",
                children: [
                    hasImages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: currentImage || "/placeholder.svg",
                                alt: hotel.name,
                                className: "w-full h-full object-cover",
                                onError: ()=>setImageError(true)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: prevImage,
                                        className: "absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: nextImage,
                                        className: "absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 156,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1",
                                        children: [
                                            images.slice(0, 5).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`
                                                }, idx, false, {
                                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this)),
                                            images.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white text-xs ml-1",
                                                children: [
                                                    "+",
                                                    images.length - 5
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 172,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            className: "h-16 w-16 text-slate-500"
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 179,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 flex gap-2",
                        children: hotel.cancellation === "fully-refundable" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium",
                            children: isRtl ? "ביטול חינם" : "Free Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setLiked(!liked),
                        className: "absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-full transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            className: `h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-white"}`
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-emerald-400 font-bold text-xl",
                                children: [
                                    "$",
                                    hotel.price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-300 text-sm",
                                children: [
                                    "/",
                                    isRtl ? "לילה" : "night"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-4 ${textColor}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: isRtl ? "text-right" : "text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-lg",
                                        children: hotel.hotelName || hotel.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-1 ${subtextColor} text-sm`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: hotel.location || hotel.address
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5",
                                children: Array.from({
                                    length: rating
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "h-4 w-4 fill-yellow-400 text-yellow-400"
                                    }, i, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-2 ${subtextColor} text-sm mb-3`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bed$3e$__["Bed"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: hotel.roomType
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500",
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: hotel.board === "RO" ? isRtl ? "ללא ארוחות" : "Room Only" : hotel.board === "BB" ? isRtl ? "ארוחת בוקר" : "Breakfast" : hotel.board
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    facilities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-3",
                        children: facilities.slice(0, 5).map((facility, idx)=>{
                            const icon = facilityIcons[facility.toLowerCase()];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex items-center gap-1 text-xs px-2 py-1 rounded-full ${darkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600"}`,
                                children: [
                                    icon || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 256,
                                        columnNumber: 28
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "capitalize",
                                        children: facility
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 250,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-sm ${subtextColor} ${showDetails ? "" : "line-clamp-2"}`,
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            description.length > 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowDetails(!showDetails),
                                className: "text-emerald-500 text-sm hover:underline mt-1",
                                children: showDetails ? isRtl ? "הצג פחות" : "Show less" : isRtl ? "קרא עוד" : "Read more"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSelectRoom,
                        className: "w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
                        children: [
                            isRtl ? "בחר והמשך" : "Select & Continue",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: `h-4 w-4 ${isRtl ? "" : "rotate-180"}`
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat/chat-interface.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
function ChatInterface({ hotelId, language = "he", embedded = false, agentName, agentAvatar, darkMode = true }) {
    const { currentHotel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotel$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useHotelConfig"])();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const [adminMode, setAdminMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messageCount, setMessageCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedRoom, setSelectedRoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchContext, setSearchContext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jsonRequest, setJsonRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preBookData, setPreBookData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isRtl = language === "he";
    const hotel = currentHotel || {
        id: "demo-hotel",
        name: agentName || (isRtl ? "מלון הדוגמה" : "Demo Hotel"),
        city: isRtl ? "תל אביב" : "Tel Aviv",
        apiSettings: {
            provider: "medici",
            mediciHotelName: "Dizengoff Inn",
            mediciCity: "Tel Aviv"
        },
        aiChatSettings: {
            welcomeMessage: "Hello! I'm your AI booking assistant. How can I help you find the perfect room?",
            welcomeMessageHe: "שלום! אני העוזר החכם שלך להזמנות. איך אוכל לעזור לך למצוא את החדר המושלם?",
            suggestedQuestions: [],
            systemInstructions: "",
            knowledgeBase: ""
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (messages.length === 0 && hotel) {
            const displayName = agentName || hotel.name;
            const welcomeMessage = isRtl ? hotel.aiChatSettings?.welcomeMessageHe || `שלום! אני ${displayName}. איך אוכל לעזור לך היום?` : hotel.aiChatSettings?.welcomeMessage || `Hello! I'm ${displayName}. How can I help you today?`;
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: welcomeMessage,
                    timestamp: new Date()
                }
            ]);
        }
    }, [
        hotel,
        isRtl,
        messages.length,
        agentName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [
        messages
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/ai/booking-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        ...messages,
                        userMessage
                    ].map((m)=>({
                            role: m.role,
                            content: m.content
                        })),
                    hotelConfig: hotel,
                    language,
                    sessionId,
                    bookingState: {
                        step: preBookData ? "book" : selectedRoomForBooking ? "prebook" : "search",
                        selectedRoom: selectedRoomForBooking,
                        jsonRequest: jsonRequest,
                        preBookData: preBookData,
                        searchContext: searchContext
                    }
                })
            });
            const data = await response.json();
            // Update session ID if returned from server
            if (data.sessionId) {
                setSessionId(data.sessionId);
            }
            // Update admin mode status
            if (data.adminMode !== undefined) {
                setAdminMode(data.adminMode);
            }
            // Update message count
            if (data.messageCount !== undefined) {
                setMessageCount(data.messageCount);
            }
            if (data.searchContext) {
                setSearchContext(data.searchContext);
            }
            // Save jsonRequest from search results
            if (data.bookingData?.type === "search_results" && data.bookingData?.data?.jsonRequest) {
                setJsonRequest(data.bookingData.data.jsonRequest);
            }
            // Save preBook data
            if (data.bookingData?.type === "prebook_complete" && data.bookingData?.data?.preBookData) {
                setPreBookData(data.bookingData.data.preBookData);
                setSelectedRoomForBooking(data.bookingData.data.selectedRoom);
            }
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message,
                timestamp: new Date(),
                bookingData: data.bookingData
            };
            setMessages((prev)=>[
                    ...prev,
                    assistantMessage
                ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: isRtl ? "מצטער, אירעה שגיאה. אנא נסה שוב." : "Sorry, an error occurred. Please try again.",
                        timestamp: new Date()
                    }
                ]);
        } finally{
            setIsLoading(false);
        }
    };
    const handleSelectRoom = (room)=>{
        setSelectedRoom(room);
    };
    const handleBookingComplete = (result)=>{
        if (result.success) {
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: isRtl ? `מעולה! ההזמנה אושרה בהצלחה! מספר אישור: ${result.confirmationNumber}. אישור נשלח לאימייל שלך.` : `Excellent! Your booking is confirmed! Confirmation number: ${result.confirmationNumber}. Confirmation sent to your email.`,
                        timestamp: new Date(),
                        bookingData: {
                            type: "booking_confirmation",
                            data: {
                                confirmationNumber: result.confirmationNumber
                            }
                        }
                    }
                ]);
        }
        setSelectedRoom(null);
    };
    const quickActions = isRtl ? [
        "חפש חדר בדובאי",
        "מה הזמינות לסוף השבוע?",
        "כמה עולה חדר זוגי?",
        "האם יש בריכה?"
    ] : [
        "Search room in Dubai",
        "Weekend availability?",
        "Double room price?",
        "Is there a pool?"
    ];
    if (selectedRoom) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full p-4", darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-slate-50", embedded ? "rounded-2xl overflow-hidden shadow-2xl" : ""),
            dir: isRtl ? "rtl" : "ltr",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2f$booking$2d$flow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BookingFlow"], {
                room: selectedRoom,
                isRtl: isRtl,
                onComplete: handleBookingComplete,
                onCancel: ()=>setSelectedRoom(null)
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 513,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ai-chat/chat-interface.tsx",
            lineNumber: 505,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full", darkMode ? "bg-black" : "bg-slate-50", embedded ? "rounded-2xl overflow-hidden shadow-2xl" : ""),
        dir: isRtl ? "rtl" : "ltr",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden border-b", darkMode ? "border-white/10" : "border-slate-200"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0", darkMode ? "bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-emerald-600/10" : "bg-gradient-to-r from-emerald-50 to-cyan-50")
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 534,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-center gap-4 p-5 backdrop-blur-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    agentAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: agentAvatar || "/placeholder.svg",
                                        alt: agentName || "Agent",
                                        className: "w-12 h-12 rounded-full object-cover shadow-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            className: "h-6 w-6 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 552,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    adminMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg animate-pulse",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-bold text-white",
                                            children: "🔐"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 557,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 543,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-semibold text-base truncate", darkMode ? "text-slate-100" : "text-slate-900"),
                                        children: [
                                            agentName || hotel.name,
                                            adminMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium",
                                                children: isRtl ? "מצב מנהל" : "Admin Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 565,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 562,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1", darkMode ? "text-emerald-400" : "text-emerald-600"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "relative flex h-2 w-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                                lineNumber: 573,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                        lineNumber: 572,
                                                        columnNumber: 17
                                                    }, this),
                                                    isRtl ? "פעיל עכשיו" : "Active now"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 571,
                                                columnNumber: 15
                                            }, this),
                                            messageCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(darkMode ? "text-slate-500" : "text-slate-500"),
                                                children: [
                                                    "• ",
                                                    messageCount,
                                                    " ",
                                                    isRtl ? "הודעות" : "messages"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 579,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 570,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 561,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 533,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-5 space-y-5",
                children: [
                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex gap-3", message.role === "user" ? "justify-end" : "justify-start"),
                            children: [
                                message.role === "assistant" && (agentAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: agentAvatar || "/placeholder.svg",
                                    alt: agentName || "Agent",
                                    className: "w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-lg"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 594,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 601,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 600,
                                    columnNumber: 17
                                }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("max-w-[85%] space-y-3"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl px-4 py-3 shadow-lg", message.role === "user" ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-br-md" : darkMode ? "bg-slate-800/80 backdrop-blur-sm text-slate-100 border border-white/5 rounded-bl-md" : "bg-white text-slate-900 border border-slate-200 rounded-bl-md"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm leading-relaxed whitespace-pre-wrap",
                                                children: message.content
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 616,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 606,
                                            columnNumber: 15
                                        }, this),
                                        message.bookingData?.type === "search_results" && message.bookingData.data.rooms && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-4 mt-4",
                                            children: message.bookingData.data.rooms.map((room, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HotelCard, {
                                                    hotel: room,
                                                    isRtl: isRtl,
                                                    onSelect: handleSelectRoom,
                                                    searchContext: searchContext || message.bookingData?.data.searchContext,
                                                    darkMode: darkMode
                                                }, idx, false, {
                                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                    lineNumber: 622,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 620,
                                            columnNumber: 17
                                        }, this),
                                        message.bookingData?.type === "booking_confirmation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-3 p-5 backdrop-blur-sm", darkMode ? "bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border-emerald-500/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-12 h-12 rounded-full flex items-center justify-center", darkMode ? "bg-emerald-500/20" : "bg-emerald-100"),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                        lineNumber: 644,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-emerald-500 text-lg",
                                                                children: isRtl ? "ההזמנה אושרה!" : "Booking Confirmed!"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                                lineNumber: 653,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm", darkMode ? "text-slate-400" : "text-slate-600"),
                                                                children: isRtl ? `מספר אישור: ${message.bookingData.data.confirmationNumber}` : `Confirmation: ${message.bookingData.data.confirmationNumber}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                                lineNumber: 656,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                                lineNumber: 643,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[10px] px-1", darkMode ? "text-slate-600" : "text-slate-400"),
                                            children: message.timestamp.toLocaleTimeString(isRtl ? "he-IL" : "en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 666,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 605,
                                    columnNumber: 13
                                }, this),
                                message.role === "user" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center", darkMode ? "bg-gradient-to-br from-slate-600 to-slate-700" : "bg-gradient-to-br from-slate-200 to-slate-300"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                        lineNumber: 683,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 675,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, message.id, true, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 591,
                            columnNumber: 11
                        }, this)),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            agentAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: agentAvatar || "/placeholder.svg",
                                alt: agentName || "Agent",
                                className: "w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-lg"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 692,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 699,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 698,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl rounded-bl-md px-4 py-3 border", darkMode ? "bg-slate-800/80 backdrop-blur-sm border-white/5" : "bg-white border-slate-200"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2 h-2 bg-emerald-400 rounded-full animate-bounce",
                                            style: {
                                                animationDelay: "0ms"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 709,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2 h-2 bg-emerald-400 rounded-full animate-bounce",
                                            style: {
                                                animationDelay: "150ms"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 713,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2 h-2 bg-emerald-400 rounded-full animate-bounce",
                                            style: {
                                                animationDelay: "300ms"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                            lineNumber: 717,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                    lineNumber: 708,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 702,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 690,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat/chat-interface.tsx",
                        lineNumber: 726,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 589,
                columnNumber: 7
            }, this),
            messages.length <= 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2",
                    children: quickActions.map((action, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setInput(action),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1.5 text-xs rounded-full transition-colors border", darkMode ? "text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border-white/5" : "text-slate-600 bg-white hover:bg-slate-100 border-slate-200"),
                            children: action
                        }, idx, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 734,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                    lineNumber: 732,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 731,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4 border-t backdrop-blur-xl", darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-white/50"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            type: "text",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            placeholder: isRtl ? "כתוב הודעה..." : "Type a message...",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-xl px-4 py-3 focus:outline-none transition-colors border", darkMode ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:border-emerald-500/50" : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50"),
                            disabled: isLoading
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 759,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            disabled: isLoading || !input.trim(),
                            className: "w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                                lineNumber: 778,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat/chat-interface.tsx",
                            lineNumber: 773,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ai-chat/chat-interface.tsx",
                    lineNumber: 758,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai-chat/chat-interface.tsx",
                lineNumber: 752,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat/chat-interface.tsx",
        lineNumber: 524,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/templates/scarlet/ai-chat/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScarletAIChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotel$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hotel-config-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2f$chat$2d$interface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-chat/chat-interface.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-ssr] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-ssr] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ticket.js [app-ssr] (ecmascript) <export default as Ticket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.js [app-ssr] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-ssr] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column-increasing.js [app-ssr] (ecmascript) <export default as BarChart>");
"use client";
;
;
;
;
;
;
// Scarlet Hotel AI Agent Configuration with 13 Advanced Skills
const scarletAgent = {
    id: "scarlet-concierge",
    name: "קונסיירז' סקרלט",
    englishName: "Scarlet Concierge",
    avatar: "/scarlet-logo.png",
    description: "הקונסיירז' הוירטואלי המתקדם של מלון סקרלט תל אביב עם 13 יכולות חכמות",
    tagline: "היכן שהאורבני פוגש את הרומנטי",
    // 13 Advanced Capabilities with Skills
    capabilities: [
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "חיפוש חכם",
            description: "בדיקת זמינות בזמן אמת ומחירים מעודכנים",
            skill: "availabilityCheck"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "המלצות אישיות",
            description: "המלצת החדר המושלם לפי צרכים ותקציב",
            skill: "roomRecommendation"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 36,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "חישוב מחירים",
            description: "מחשבון מחיר מדויק כולל מבצעים והנחות",
            skill: "priceCalculation"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "ליווי הזמנה",
            description: "תהליך הזמנה מלא עם אישור בזמן אמת",
            skill: "bookingAssistant"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "מומחה מקומי",
            description: "המלצות על מסעדות, אטרקציות וחיי לילה",
            skill: "localExpert"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "בקשות מיוחדות",
            description: "חבילות רומנטיות, חגיגות ובקשות אישיות",
            skill: "specialRequests"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "ביקורות",
            description: "ביקורות אמיתיות ודירוגים מפורטים (4.7/5)",
            skill: "reviewsSystem"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__["Ticket"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "מבצעים",
            description: "קופונים, הנחות ומבצעי פלאש בלעדיים",
            skill: "promotionsManager"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 72,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "מועדון VIP",
            description: "הרשמה למועדון והטבות אקסקלוסיביות",
            skill: "loyaltyProgram"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "מזג אוויר",
            description: "תחזית מזג אוויר ואטרקציות בתאריכי השהייה",
            skill: "weatherAndAttractions"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 84,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "טרנדים",
            description: "תובנות על תקופות פופולריות ויעדים חמים",
            skill: "travelTrends"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 90,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "WhatsApp",
            description: "תמיכה מהירה בוואטסאפ 24/7",
            skill: "whatsappSupport"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__["BarChart"], {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "מעקב חכם",
            description: "המלצות משופרות לפי התנהגות",
            skill: "analyticsTracking"
        }
    ],
    // Personality Traits
    personality: {
        tone: "חם, ידידותי, מקצועי",
        style: "מותאם אישית ואמפתי",
        approach: "ליווי מלא מחיפוש ועד אישור הזמנה"
    }
};
function ScarletAIChatPage() {
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen ${darkMode ? "dark bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-white/10 backdrop-blur-xl bg-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 122,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                    className: "h-6 w-6 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent",
                                                children: "מלון סקרלט תל אביב"
                                            }, void 0, false, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: scarletAgent.tagline
                                            }, void 0, false, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                onClick: ()=>setDarkMode(!darkMode),
                                className: "rounded-full hover:bg-white/10",
                                children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-5 w-5 text-yellow-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                    lineNumber: 144,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-5 w-5 text-purple-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-pink-500/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            className: "h-8 w-8 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                            lineNumber: 160,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white",
                                                children: scarletAgent.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 19
                                                    }, this),
                                                    "מחובר"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 mb-4",
                                        children: scarletAgent.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-3 gap-3",
                                        children: scarletAgent.capabilities.map((capability, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-red-400 flex-shrink-0",
                                                        children: capability.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-medium text-white",
                                                                children: capability.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                                lineNumber: 190,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-400 mt-0.5",
                                                                children: capability.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hotel$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HotelConfigProvider"], {
                    hotelId: "scarlet-hotel",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2f$chat$2d$interface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatInterface"], {
                        language: "he",
                        embedded: false,
                        agentName: scarletAgent.name,
                        agentAvatar: scarletAgent.avatar,
                        darkMode: darkMode
                    }, void 0, false, {
                        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-white/10 backdrop-blur-xl bg-white/5 mt-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-6 text-center text-sm text-gray-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "מלון סקרלט תל אביב • רחוב ג'ורדון 17 • 📞 052-473-4940"
                        }, void 0, false, {
                            fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2",
                            children: "תוצר של מערכת הזמנות חכמה • מופעל על ידי AI"
                        }, void 0, false, {
                            fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/templates/scarlet/ai-chat/page.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_d76b59e2._.js.map