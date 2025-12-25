/**
 * Feature Flags System
 * מערכת ניהול תכונות - אדמין יכול להפעיל/לכבות תכונות לכל טמפלט או ל-AI
 */

export type FeatureId =
  | 'email-notifications'
  | 'sms-notifications'
  | 'push-notifications'
  | 'booking-reminders'
  | 'price-alerts'
  | 'price-history'
  | 'best-time-to-book'
  | 'reviews-system'
  | 'photo-uploads'
  | 'rating-aggregation'
  | 'google-maps'
  | 'nearby-attractions'
  | 'street-view'
  | 'loyalty-program'
  | 'cashback'
  | 'referral-program'
  | 'group-bookings'
  | 'split-payment'
  | 'booking-modification'
  | 'room-upgrade'
  | 'multi-room-booking'
  | 'advanced-analytics'
  | 'export-pdf'
  | 'qr-checkin'
  | 'real-time-updates'
  | 'chat-support'
  | 'multilingual-support'
  | 'currency-converter'
  | 'weather-info'
  | 'local-events'
  | 'transportation-info';

export interface Feature {
  id: FeatureId;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: FeatureCategory;
  icon: string;
  enabled: boolean;
  premium?: boolean; // רק למנויי premium
  requiredApis?: string[]; // APIs נדרשים (Google Maps, SendGrid, etc.)
}

export type FeatureCategory =
  | 'notifications'
  | 'pricing'
  | 'reviews'
  | 'location'
  | 'loyalty'
  | 'booking'
  | 'analytics'
  | 'support'
  | 'localization'
  | 'travel-info';

export interface TemplateFeatureConfig {
  templateId: 'nara' | 'modern-dark' | 'luxury' | 'family';
  templateName: string;
  enabledFeatures: FeatureId[];
  customization?: {
    primaryColor?: string;
    showLogo?: boolean;
    showReviews?: boolean;
    showMap?: boolean;
    showWeather?: boolean;
  };
}

export interface AIAgentConfig {
  agentId: string;
  agentName: string;
  enabledFeatures: FeatureId[];
  personality?: {
    tone: 'professional' | 'friendly' | 'casual';
    language: 'en' | 'he' | 'both';
  };
  capabilities?: {
    canSuggestPriceAlerts: boolean;
    canShowMap: boolean;
    canAccessReviews: boolean;
    canOfferLoyaltyPoints: boolean;
  };
}

export interface FeatureConfig {
  templates: TemplateFeatureConfig[];
  aiAgent: AIAgentConfig;
  globalSettings: {
    defaultCurrency: string;
    defaultLanguage: string;
    maintenanceMode: boolean;
    betaFeatures: boolean;
  };
}

// רשימת כל התכונות האפשריות
export const AVAILABLE_FEATURES: Feature[] = [
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
    requiredApis: ['Resend', 'SendGrid'],
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
    requiredApis: ['Twilio', 'AWS SNS'],
  },
  {
    id: 'push-notifications',
    name: 'Push Notifications',
    nameHe: 'התראות Push',
    description: 'Browser push notifications for updates',
    descriptionHe: 'התראות דפדפן לעדכונים',
    category: 'notifications',
    icon: '🔔',
    enabled: false,
  },
  {
    id: 'booking-reminders',
    name: 'Booking Reminders',
    nameHe: 'תזכורות הזמנה',
    description: 'Automatic reminders before check-in',
    descriptionHe: 'תזכורות אוטומטיות לפני check-in',
    category: 'notifications',
    icon: '⏰',
    enabled: false,
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
    enabled: false,
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
    premium: true,
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
    premium: true,
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
    enabled: false,
  },
  {
    id: 'photo-uploads',
    name: 'Photo Uploads',
    nameHe: 'העלאת תמונות',
    description: 'Users can upload photos with reviews',
    descriptionHe: 'משתמשים יכולים להעלות תמונות עם ביקורות',
    category: 'reviews',
    icon: '📸',
    enabled: false,
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
    requiredApis: ['Google Places', 'TripAdvisor'],
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
    requiredApis: ['Google Maps API'],
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
    requiredApis: ['Google Places API'],
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
    requiredApis: ['Google Maps API'],
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
    enabled: false,
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
    premium: true,
  },
  {
    id: 'referral-program',
    name: 'Referral Program',
    nameHe: 'תוכנית המלצות',
    description: 'Earn rewards for referring friends',
    descriptionHe: 'הרוויח תגמולים על המלצת חברים',
    category: 'loyalty',
    icon: '🤝',
    enabled: false,
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
    enabled: false,
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
    premium: true,
  },
  {
    id: 'booking-modification',
    name: 'Booking Modification',
    nameHe: 'עריכת הזמנה',
    description: 'Edit dates and room after booking',
    descriptionHe: 'עריכת תאריכים וחדר אחרי הזמנה',
    category: 'booking',
    icon: '✏️',
    enabled: false,
  },
  {
    id: 'room-upgrade',
    name: 'Room Upgrade',
    nameHe: 'שדרוג חדר',
    description: 'Upgrade to better room',
    descriptionHe: 'שדרוג לחדר טוב יותר',
    category: 'booking',
    icon: '⬆️',
    enabled: false,
  },
  {
    id: 'multi-room-booking',
    name: 'Multi-Room Booking',
    nameHe: 'הזמנת מספר חדרים',
    description: 'Book different rooms in one transaction',
    descriptionHe: 'הזמנת חדרים שונים בעסקה אחת',
    category: 'booking',
    icon: '🏨',
    enabled: false,
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
    premium: true,
  },
  {
    id: 'export-pdf',
    name: 'Export to PDF',
    nameHe: 'ייצוא ל-PDF',
    description: 'Export bookings and reports to PDF',
    descriptionHe: 'ייצוא הזמנות ודוחות ל-PDF',
    category: 'analytics',
    icon: '📄',
    enabled: false,
  },
  {
    id: 'qr-checkin',
    name: 'QR Check-in',
    nameHe: 'צ\'ק-אין QR',
    description: 'QR code for contactless check-in',
    descriptionHe: 'קוד QR לצ\'ק-אין ללא מגע',
    category: 'booking',
    icon: '📱',
    enabled: false,
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
    requiredApis: ['WebSocket', 'Pusher'],
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
    requiredApis: ['Intercom', 'Zendesk'],
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
    enabled: false,
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
    requiredApis: ['Exchange Rates API'],
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
    requiredApis: ['OpenWeather API'],
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
    requiredApis: ['Eventbrite API'],
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
    requiredApis: ['Google Maps API'],
  },
];

// קונפיגורציה דיפולטית
export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  templates: [
    {
      templateId: 'nara',
      templateName: 'NARA Template',
      enabledFeatures: ['email-notifications', 'booking-reminders'],
    },
    {
      templateId: 'modern-dark',
      templateName: 'Modern Dark Template',
      enabledFeatures: ['email-notifications', 'google-maps'],
    },
    {
      templateId: 'luxury',
      templateName: 'Luxury Template',
      enabledFeatures: ['email-notifications', 'reviews-system', 'google-maps', 'loyalty-program'],
    },
    {
      templateId: 'family',
      templateName: 'Family Template',
      enabledFeatures: ['email-notifications', 'google-maps', 'nearby-attractions', 'weather-info'],
    },
  ],
  aiAgent: {
    agentId: 'ai-booking-assistant',
    agentName: 'AI Booking Assistant',
    enabledFeatures: [
      'email-notifications',
      'price-alerts',
      'reviews-system',
      'google-maps',
      'weather-info',
    ],
    personality: {
      tone: 'friendly',
      language: 'both',
    },
    capabilities: {
      canSuggestPriceAlerts: true,
      canShowMap: true,
      canAccessReviews: true,
      canOfferLoyaltyPoints: false,
    },
  },
  globalSettings: {
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    maintenanceMode: false,
    betaFeatures: false,
  },
};
