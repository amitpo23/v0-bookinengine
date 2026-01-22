module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/providers/session-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
'use client';
;
;
function SessionProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers/session-provider.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/types/features.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Feature Flags System
 * מערכת ניהול תכונות - אדמין יכול להפעיל/לכבות תכונות לכל טמפלט או ל-AI
 */ __turbopack_context__.s([
    "AVAILABLE_FEATURES",
    ()=>AVAILABLE_FEATURES,
    "DEFAULT_FEATURE_CONFIG",
    ()=>DEFAULT_FEATURE_CONFIG
]);
const AVAILABLE_FEATURES = [
    // Notifications
    {
        id: 'email-notifications',
        name: 'Email Notifications',
        nameHe: 'התראות אימייל',
        description: 'Send booking confirmations and updates via email',
        descriptionHe: 'שליחת אישורי הזמנה ועדכונים באימייל',
        category: 'notifications',
        icon: '📧',
        enabled: false,
        requiredApis: [
            'Resend',
            'SendGrid'
        ]
    },
    {
        id: 'sms-notifications',
        name: 'SMS Notifications',
        nameHe: 'התראות SMS',
        description: 'Send booking updates via SMS',
        descriptionHe: 'שליחת עדכוני הזמנה ב-SMS',
        category: 'notifications',
        icon: '💬',
        enabled: false,
        premium: true,
        requiredApis: [
            'Twilio',
            'AWS SNS'
        ]
    },
    {
        id: 'push-notifications',
        name: 'Push Notifications',
        nameHe: 'התראות Push',
        description: 'Browser push notifications for updates',
        descriptionHe: 'התראות דפדפן לעדכונים',
        category: 'notifications',
        icon: '🔔',
        enabled: false
    },
    {
        id: 'booking-reminders',
        name: 'Booking Reminders',
        nameHe: 'תזכורות הזמנה',
        description: 'Automatic reminders before check-in',
        descriptionHe: 'תזכורות אוטומטיות לפני check-in',
        category: 'notifications',
        icon: '⏰',
        enabled: false
    },
    // Pricing
    {
        id: 'price-alerts',
        name: 'Price Alerts',
        nameHe: 'התראות מחיר',
        description: 'Alert users when prices drop',
        descriptionHe: 'התראה למשתמשים כשמחירים יורדים',
        category: 'pricing',
        icon: '💰',
        enabled: false
    },
    {
        id: 'price-history',
        name: 'Price History',
        nameHe: 'היסטוריית מחירים',
        description: 'Show price trends over time',
        descriptionHe: 'הצגת מגמות מחיר לאורך זמן',
        category: 'pricing',
        icon: '📈',
        enabled: false,
        premium: true
    },
    {
        id: 'best-time-to-book',
        name: 'Best Time to Book',
        nameHe: 'זמן מומלץ להזמנה',
        description: 'AI recommendations for best booking time',
        descriptionHe: 'המלצות AI לזמן הזמנה מיטבי',
        category: 'pricing',
        icon: '🎯',
        enabled: false,
        premium: true
    },
    // Reviews
    {
        id: 'reviews-system',
        name: 'Reviews System',
        nameHe: 'מערכת ביקורות',
        description: 'User reviews and ratings',
        descriptionHe: 'ביקורות ודירוגי משתמשים',
        category: 'reviews',
        icon: '⭐',
        enabled: false
    },
    {
        id: 'photo-uploads',
        name: 'Photo Uploads',
        nameHe: 'העלאת תמונות',
        description: 'Users can upload photos with reviews',
        descriptionHe: 'משתמשים יכולים להעלות תמונות עם ביקורות',
        category: 'reviews',
        icon: '📸',
        enabled: false
    },
    {
        id: 'rating-aggregation',
        name: 'Rating Aggregation',
        nameHe: 'צבירת דירוגים',
        description: 'Aggregate ratings from multiple sources',
        descriptionHe: 'צבירת דירוגים ממקורות שונים',
        category: 'reviews',
        icon: '📊',
        enabled: false,
        requiredApis: [
            'Google Places',
            'TripAdvisor'
        ]
    },
    // Location
    {
        id: 'google-maps',
        name: 'Google Maps',
        nameHe: 'גוגל מפות',
        description: 'Interactive maps with hotel location',
        descriptionHe: 'מפות אינטראקטיביות עם מיקום המלון',
        category: 'location',
        icon: '🗺️',
        enabled: false,
        requiredApis: [
            'Google Maps API'
        ]
    },
    {
        id: 'nearby-attractions',
        name: 'Nearby Attractions',
        nameHe: 'אטרקציות בקרבת מקום',
        description: 'Show nearby points of interest',
        descriptionHe: 'הצגת נקודות עניין סמוכות',
        category: 'location',
        icon: '🏛️',
        enabled: false,
        requiredApis: [
            'Google Places API'
        ]
    },
    {
        id: 'street-view',
        name: 'Street View',
        nameHe: 'תצוגת רחוב',
        description: 'Google Street View integration',
        descriptionHe: 'אינטגרציה עם Google Street View',
        category: 'location',
        icon: '👁️',
        enabled: false,
        requiredApis: [
            'Google Maps API'
        ]
    },
    // Loyalty
    {
        id: 'loyalty-program',
        name: 'Loyalty Program',
        nameHe: 'תוכנית נאמנות',
        description: 'Points and rewards for bookings',
        descriptionHe: 'נקודות ותגמולים על הזמנות',
        category: 'loyalty',
        icon: '🎁',
        enabled: false
    },
    {
        id: 'cashback',
        name: 'Cashback',
        nameHe: 'החזר כספי',
        description: 'Cashback on bookings',
        descriptionHe: 'החזר כספי על הזמנות',
        category: 'loyalty',
        icon: '💵',
        enabled: false,
        premium: true
    },
    {
        id: 'referral-program',
        name: 'Referral Program',
        nameHe: 'תוכנית המלצות',
        description: 'Earn rewards for referring friends',
        descriptionHe: 'הרוויח תגמולים על המלצת חברים',
        category: 'loyalty',
        icon: '🤝',
        enabled: false
    },
    // Booking
    {
        id: 'group-bookings',
        name: 'Group Bookings',
        nameHe: 'הזמנות קבוצתיות',
        description: 'Book multiple rooms at once',
        descriptionHe: 'הזמנת מספר חדרים בבת אחת',
        category: 'booking',
        icon: '👥',
        enabled: false
    },
    {
        id: 'split-payment',
        name: 'Split Payment',
        nameHe: 'תשלום מפוצל',
        description: 'Split payment between multiple people',
        descriptionHe: 'פיצול תשלום בין מספר אנשים',
        category: 'booking',
        icon: '💳',
        enabled: false,
        premium: true
    },
    {
        id: 'booking-modification',
        name: 'Booking Modification',
        nameHe: 'עריכת הזמנה',
        description: 'Edit dates and room after booking',
        descriptionHe: 'עריכת תאריכים וחדר אחרי הזמנה',
        category: 'booking',
        icon: '✏️',
        enabled: false
    },
    {
        id: 'room-upgrade',
        name: 'Room Upgrade',
        nameHe: 'שדרוג חדר',
        description: 'Upgrade to better room',
        descriptionHe: 'שדרוג לחדר טוב יותר',
        category: 'booking',
        icon: '⬆️',
        enabled: false
    },
    {
        id: 'multi-room-booking',
        name: 'Multi-Room Booking',
        nameHe: 'הזמנת מספר חדרים',
        description: 'Book different rooms in one transaction',
        descriptionHe: 'הזמנת חדרים שונים בעסקה אחת',
        category: 'booking',
        icon: '🏨',
        enabled: false
    },
    // Analytics
    {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        nameHe: 'אנליטיקס מתקדם',
        description: 'Detailed booking analytics',
        descriptionHe: 'אנליטיקה מפורטת של הזמנות',
        category: 'analytics',
        icon: '📊',
        enabled: false,
        premium: true
    },
    {
        id: 'export-pdf',
        name: 'Export to PDF',
        nameHe: 'ייצוא ל-PDF',
        description: 'Export bookings and reports to PDF',
        descriptionHe: 'ייצוא הזמנות ודוחות ל-PDF',
        category: 'analytics',
        icon: '📄',
        enabled: false
    },
    {
        id: 'qr-checkin',
        name: 'QR Check-in',
        nameHe: 'צ\'ק-אין QR',
        description: 'QR code for contactless check-in',
        descriptionHe: 'קוד QR לצ\'ק-אין ללא מגע',
        category: 'booking',
        icon: '📱',
        enabled: false
    },
    // Support & Communication
    {
        id: 'real-time-updates',
        name: 'Real-time Updates',
        nameHe: 'עדכונים בזמן אמת',
        description: 'Live booking status updates',
        descriptionHe: 'עדכוני סטטוס הזמנה בזמן אמת',
        category: 'support',
        icon: '🔄',
        enabled: false,
        requiredApis: [
            'WebSocket',
            'Pusher'
        ]
    },
    {
        id: 'chat-support',
        name: 'Live Chat Support',
        nameHe: 'תמיכת צ\'אט',
        description: '24/7 live chat support',
        descriptionHe: 'תמיכת צ\'אט 24/7',
        category: 'support',
        icon: '💬',
        enabled: false,
        requiredApis: [
            'Intercom',
            'Zendesk'
        ]
    },
    // Localization
    {
        id: 'multilingual-support',
        name: 'Multilingual Support',
        nameHe: 'תמיכה רב-לשונית',
        description: 'Support for multiple languages',
        descriptionHe: 'תמיכה במספר שפות',
        category: 'localization',
        icon: '🌐',
        enabled: false
    },
    {
        id: 'currency-converter',
        name: 'Currency Converter',
        nameHe: 'ממיר מטבעות',
        description: 'Real-time currency conversion',
        descriptionHe: 'המרת מטבעות בזמן אמת',
        category: 'localization',
        icon: '💱',
        enabled: false,
        requiredApis: [
            'Exchange Rates API'
        ]
    },
    // Travel Info
    {
        id: 'weather-info',
        name: 'Weather Information',
        nameHe: 'מידע מזג אוויר',
        description: 'Weather forecast for travel dates',
        descriptionHe: 'תחזית מזג אוויר לתאריכי הנסיעה',
        category: 'travel-info',
        icon: '🌤️',
        enabled: false,
        requiredApis: [
            'OpenWeather API'
        ]
    },
    {
        id: 'local-events',
        name: 'Local Events',
        nameHe: 'אירועים מקומיים',
        description: 'Show local events during stay',
        descriptionHe: 'הצגת אירועים מקומיים במהלך השהייה',
        category: 'travel-info',
        icon: '🎉',
        enabled: false,
        requiredApis: [
            'Eventbrite API'
        ]
    },
    {
        id: 'transportation-info',
        name: 'Transportation Info',
        nameHe: 'מידע תחבורה',
        description: 'Public transport and taxi info',
        descriptionHe: 'מידע תחבורה ציבורית ומוניות',
        category: 'travel-info',
        icon: '🚇',
        enabled: false,
        requiredApis: [
            'Google Maps API'
        ]
    }
];
const DEFAULT_FEATURE_CONFIG = {
    templates: [
        {
            templateId: 'nara',
            templateName: 'NARA Template',
            enabledFeatures: [
                'email-notifications',
                'booking-reminders'
            ]
        },
        {
            templateId: 'modern-dark',
            templateName: 'Modern Dark Template',
            enabledFeatures: [
                'email-notifications',
                'google-maps'
            ]
        },
        {
            templateId: 'luxury',
            templateName: 'Luxury Template',
            enabledFeatures: [
                'email-notifications',
                'reviews-system',
                'google-maps',
                'loyalty-program'
            ]
        },
        {
            templateId: 'family',
            templateName: 'Family Template',
            enabledFeatures: [
                'email-notifications',
                'google-maps',
                'nearby-attractions',
                'weather-info'
            ]
        }
    ],
    aiAgent: {
        agentId: 'ai-booking-assistant',
        agentName: 'AI Booking Assistant',
        enabledFeatures: [
            'email-notifications',
            'price-alerts',
            'reviews-system',
            'google-maps',
            'weather-info'
        ],
        personality: {
            tone: 'friendly',
            language: 'both'
        },
        capabilities: {
            canSuggestPriceAlerts: true,
            canShowMap: true,
            canAccessReviews: true,
            canOfferLoyaltyPoints: false
        }
    },
    globalSettings: {
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
        maintenanceMode: false,
        betaFeatures: false
    }
};
}),
"[project]/lib/features-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeaturesProvider",
    ()=>FeaturesProvider,
    "useFeature",
    ()=>useFeature,
    "useFeatures",
    ()=>useFeatures
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$features$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/features.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const FeaturesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function FeaturesProvider({ children }) {
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$features$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_FEATURE_CONFIG"]);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // טעינת קונפיגורציה מ-localStorage או API
    const loadConfig = async ()=>{
        try {
            // נסה לטעון מ-localStorage
            const savedConfig = localStorage.getItem('features-config');
            if (savedConfig) {
                setConfig(JSON.parse(savedConfig));
            } else {
                // אם אין, נסה לטעון מהשרת
                const response = await fetch('/api/admin/features');
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                }
            }
        } catch (error) {
            console.error('Failed to load features config:', error);
            // אם יש שגיאה, השתמש בדיפולט
            setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$features$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_FEATURE_CONFIG"]);
        } finally{
            setIsLoaded(true);
        }
    };
    // שמירת קונפיגורציה
    const saveConfig = async ()=>{
        try {
            // שמור ב-localStorage
            localStorage.setItem('features-config', JSON.stringify(config));
            // שמור גם בשרת
            await fetch('/api/admin/features', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
        } catch (error) {
            console.error('Failed to save features config:', error);
        }
    };
    // עדכון features לטמפלט
    const updateTemplateFeatures = async (templateId, features)=>{
        setConfig((prev)=>{
            const newTemplates = prev.templates.map((t)=>t.templateId === templateId ? {
                    ...t,
                    enabledFeatures: features
                } : t);
            return {
                ...prev,
                templates: newTemplates
            };
        });
        await saveConfig();
    };
    // עדכון features ל-AI Agent
    const updateAIAgentFeatures = async (features)=>{
        setConfig((prev)=>({
                ...prev,
                aiAgent: {
                    ...prev.aiAgent,
                    enabledFeatures: features
                }
            }));
        await saveConfig();
    };
    // בדיקה האם feature מופעל
    const isFeatureEnabled = (featureId, context, templateId)=>{
        if (context === 'template' && templateId) {
            const template = config.templates.find((t)=>t.templateId === templateId);
            return template?.enabledFeatures.includes(featureId) ?? false;
        }
        if (context === 'ai') {
            return config.aiAgent.enabledFeatures.includes(featureId);
        }
        // אם לא צוין context, בדוק בכל המקומות
        const inTemplates = config.templates.some((t)=>t.enabledFeatures.includes(featureId));
        const inAI = config.aiAgent.enabledFeatures.includes(featureId);
        return inTemplates || inAI;
    };
    // קבלת רשימת features מופעלים
    const getEnabledFeatures = (context, templateId)=>{
        if (context === 'template' && templateId) {
            const template = config.templates.find((t)=>t.templateId === templateId);
            return template?.enabledFeatures ?? [];
        }
        if (context === 'ai') {
            return config.aiAgent.enabledFeatures;
        }
        return [];
    };
    // טען את הקונפיגורציה בעליית הקומפוננטה
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadConfig();
    }, []);
    // שמור אוטומטית כשיש שינויים
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isLoaded) {
            saveConfig();
        }
    }, [
        config,
        isLoaded
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeaturesContext.Provider, {
        value: {
            config,
            updateTemplateFeatures,
            updateAIAgentFeatures,
            isFeatureEnabled,
            getEnabledFeatures,
            saveConfig,
            loadConfig
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/features-context.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
function useFeatures() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(FeaturesContext);
    if (!context) {
        throw new Error('useFeatures must be used within FeaturesProvider');
    }
    return context;
}
function useFeature(featureId, context, templateId) {
    const { isFeatureEnabled } = useFeatures();
    return isFeatureEnabled(featureId, context, templateId);
}
}),
"[project]/lib/saas-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SaaSProvider",
    ()=>SaaSProvider,
    "useSaaS",
    ()=>useSaaS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const SaaSContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Mock tenant data - in production this would come from API/DB
const mockTenant = {
    id: "tenant-1",
    name: "מלונות ישראל בע״מ",
    email: "admin@hotels-israel.com",
    plan: "professional",
    billingStatus: "active",
    createdAt: new Date(),
    hotels: [
        {
            id: "hotel-1",
            name: "מלון דן תל אביב",
            hotelId: "medici-12345",
            hotelName: "Dan Tel Aviv",
            city: "Tel Aviv",
            stars: 5,
            currency: "ILS",
            primaryColor: "#1e3a5f",
            secondaryColor: "#d4af37",
            enableWidget: true,
            enableAiChat: true,
            plan: "professional",
            apiSettings: {
                mediciHotelId: "12345",
                mediciHotelName: "Dan Tel Aviv"
            },
            widgetSettings: {
                language: "both",
                showPrices: true,
                showAvailability: true,
                primaryColor: "#1e3a5f"
            },
            aiChatSettings: {
                welcomeMessage: "Hello! I'm your personal booking assistant for Dan Tel Aviv Hotel. How can I help you today?",
                welcomeMessageHe: "שלום! אני העוזר האישי שלך להזמנות במלון דן תל אביב. איך אוכל לעזור לך היום?",
                personality: "luxury",
                language: "both"
            }
        },
        {
            id: "hotel-2",
            name: "מלון הרודס אילת",
            hotelId: "medici-67890",
            hotelName: "Herods Eilat",
            city: "Eilat",
            stars: 5,
            currency: "ILS",
            primaryColor: "#0066cc",
            secondaryColor: "#ff6600",
            enableWidget: true,
            enableAiChat: false,
            plan: "basic",
            apiSettings: {
                mediciHotelId: "67890",
                mediciHotelName: "Herods Eilat"
            },
            widgetSettings: {
                language: "he",
                showPrices: true,
                showAvailability: true,
                primaryColor: "#0066cc"
            },
            aiChatSettings: {
                welcomeMessage: "Welcome to Herods Eilat!",
                welcomeMessageHe: "ברוכים הבאים למלון הרודס אילת!",
                personality: "friendly",
                language: "he"
            }
        },
        {
            id: "hotel-scarlet",
            name: "מלון סקרלט תל אביב",
            hotelId: "scarlet-tlv",
            hotelName: "Scarlet Hotel Tel Aviv",
            city: "Tel Aviv",
            stars: 5,
            currency: "ILS",
            primaryColor: "#DC143C",
            secondaryColor: "#2C3E50",
            enableWidget: true,
            enableAiChat: true,
            plan: "enterprise",
            apiSettings: {
                mediciHotelId: "scarlet-001",
                mediciHotelName: "Scarlet Hotel Tel Aviv"
            },
            widgetSettings: {
                language: "both",
                showPrices: true,
                showAvailability: true,
                primaryColor: "#DC143C",
                secondaryColor: "#E74C3C"
            },
            aiChatSettings: {
                welcomeMessage: "Welcome to Scarlet Hotel Tel Aviv! Where urban meets romance. How can I create an unforgettable experience for you today?",
                welcomeMessageHe: "ברוכים הבאים למלון סקרלט תל אביב! היכן שהאורבני פוגש את הרומנטי. איך אוכל ליצור לכם חוויה בלתי נשכחת היום?",
                personality: "romantic",
                language: "both",
                primaryColor: "#DC143C"
            }
        }
    ]
};
function SaaSProvider({ children }) {
    const [tenant, setTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentHotel, setCurrentHotel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Simulate loading tenant data
        setTimeout(()=>{
            setTenant(mockTenant);
            setCurrentHotel(mockTenant.hotels[0]);
            setIsLoading(false);
        }, 500);
    }, []);
    const updateHotelConfig = (hotelId, config)=>{
        if (!tenant) return;
        const updatedHotels = tenant.hotels.map((hotel)=>hotel.id === hotelId ? {
                ...hotel,
                ...config
            } : hotel);
        setTenant({
            ...tenant,
            hotels: updatedHotels
        });
        if (currentHotel?.id === hotelId) {
            setCurrentHotel({
                ...currentHotel,
                ...config
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SaaSContext.Provider, {
        value: {
            tenant,
            currentHotel,
            setCurrentHotel,
            hotels: tenant?.hotels || [],
            isLoading,
            updateHotelConfig
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/saas-context.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
function useSaaS() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SaaSContext);
    if (!context) {
        throw new Error("useSaaS must be used within SaaSProvider");
    }
    return context;
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/components/analytics/GoogleAnalytics.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoogleAnalytics",
    ()=>GoogleAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function GoogleAnalyticsInner({ measurementId }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const url = undefined;
    }, [
        pathname,
        searchParams,
        measurementId
    ]);
    return null;
}
function GoogleAnalytics({ measurementId }) {
    if (!measurementId) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                strategy: "afterInteractive",
                src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
            }, void 0, false, {
                fileName: "[project]/components/analytics/GoogleAnalytics.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "google-analytics",
                strategy: "afterInteractive",
                dangerouslySetInnerHTML: {
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `
                }
            }, void 0, false, {
                fileName: "[project]/components/analytics/GoogleAnalytics.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: null,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleAnalyticsInner, {
                    measurementId: measurementId
                }, void 0, false, {
                    fileName: "[project]/components/analytics/GoogleAnalytics.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/analytics/GoogleAnalytics.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/components/analytics/AffiliateTracker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AffiliateTracker",
    ()=>AffiliateTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function AffiliateTrackerInner() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const trackAffiliate = async ()=>{
            // Get UTM parameters
            const utmSource = searchParams?.get("utm_source");
            const utmMedium = searchParams?.get("utm_medium");
            const utmCampaign = searchParams?.get("utm_campaign");
            const utmTerm = searchParams?.get("utm_term");
            const utmContent = searchParams?.get("utm_content");
            const affiliateCode = searchParams?.get("ref") || searchParams?.get("affiliate");
            // Skip if no tracking parameters
            if (!utmSource && !utmMedium && !utmCampaign && !affiliateCode) {
                return;
            }
            // Only run in browser
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            // Generate session ID (or get from localStorage)
            let sessionId;
            // Store tracking data in localStorage for later use
            const trackingData = undefined;
        };
        trackAffiliate();
    }, [
        searchParams
    ]);
    return null;
}
function AffiliateTracker() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AffiliateTrackerInner, {}, void 0, false, {
            fileName: "[project]/components/analytics/AffiliateTracker.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/analytics/AffiliateTracker.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fca29080._.js.map