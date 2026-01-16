/**
 * AI Skills Library
 * Collection of skills for AI Booking Engines
 * Based on capabilities from: skills, openai-agents-python, ai-travel-agent-platform
 */

import type { AISkill, AITool } from './types';

// ========================================
// BOOKING SKILLS
// ========================================

export const hotelSearchSkill: AISkill = {
  id: 'hotel-search',
  name: 'Hotel Search',
  nameHe: 'חיפוש מלונות',
  description: 'Search for available hotels with real-time pricing and availability',
  descriptionHe: 'חיפוש מלונות זמינים עם תמחור וזמינות בזמן אמת',
  category: 'booking',
  capabilities: ['search'],
  isEnabled: true,
  priority: 1,
  requiredPermissions: ['booking:read'],
  tools: [
    {
      name: 'search_hotels',
      description: 'Search for available hotel rooms with pricing. Use when user asks about hotel availability, prices, or wants to find accommodation.',
      parameters: [
        { name: 'destination', type: 'string', description: 'City or destination name', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date (YYYY-MM-DD)', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date (YYYY-MM-DD)', required: true },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true, default: 2 },
        { name: 'children', type: 'array', description: 'Array of children ages', required: false, default: [] },
        { name: 'stars', type: 'array', description: 'Filter by star rating (1-5)', required: false },
        { name: 'maxPrice', type: 'number', description: 'Maximum price per night', required: false },
        { name: 'amenities', type: 'array', description: 'Required amenities', required: false }
      ],
      handler: 'lib/ai-engines/handlers/booking.searchHotels',
      isAsync: true,
      timeout: 30000,
      retryConfig: { maxRetries: 3, delayMs: 1000, exponentialBackoff: true }
    }
  ]
};

export const hotelPrebookSkill: AISkill = {
  id: 'hotel-prebook',
  name: 'Hotel Pre-booking',
  nameHe: 'הזמנה מוקדמת',
  description: 'Pre-book a room to confirm availability and lock the price',
  descriptionHe: 'הזמנה מוקדמת לחדר לאישור זמינות ונעילת מחיר',
  category: 'booking',
  capabilities: ['prebook'],
  isEnabled: true,
  priority: 2,
  requiredPermissions: ['booking:write'],
  tools: [
    {
      name: 'prebook_room',
      description: 'Pre-book a room to confirm availability before final booking. Use after user selects a specific room.',
      parameters: [
        { name: 'roomCode', type: 'string', description: 'Room code from search results', required: true },
        { name: 'hotelId', type: 'string', description: 'Hotel ID from search results', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'guests', type: 'object', description: 'Guest configuration { adults, children }', required: true }
      ],
      handler: 'lib/ai-engines/handlers/booking.prebookRoom',
      isAsync: true,
      timeout: 30000
    }
  ]
};

export const hotelBookingSkill: AISkill = {
  id: 'hotel-booking',
  name: 'Hotel Booking',
  nameHe: 'הזמנת מלון',
  description: 'Complete hotel booking with customer details and payment',
  descriptionHe: 'השלמת הזמנת מלון עם פרטי לקוח ותשלום',
  category: 'booking',
  capabilities: ['booking'],
  isEnabled: true,
  priority: 3,
  requiredPermissions: ['booking:write', 'payment:process'],
  tools: [
    {
      name: 'book_room',
      description: 'Complete the booking with customer details. Use only after pre-booking and when you have all customer information.',
      parameters: [
        { name: 'token', type: 'string', description: 'Token from pre-book response', required: true },
        { name: 'roomCode', type: 'string', description: 'Room code', required: true },
        { name: 'customer', type: 'object', description: 'Customer details { firstName, lastName, email, phone, address }', required: true },
        { name: 'guests', type: 'array', description: 'Guest list with names', required: true },
        { name: 'specialRequests', type: 'string', description: 'Special requests', required: false }
      ],
      handler: 'lib/ai-engines/handlers/booking.bookRoom',
      isAsync: true,
      timeout: 60000
    }
  ]
};

export const bookingCancellationSkill: AISkill = {
  id: 'booking-cancellation',
  name: 'Booking Cancellation',
  nameHe: 'ביטול הזמנה',
  description: 'Cancel existing bookings with policy information',
  descriptionHe: 'ביטול הזמנות קיימות עם מידע על מדיניות הביטול',
  category: 'booking',
  capabilities: ['cancellation'],
  isEnabled: true,
  priority: 4,
  requiredPermissions: ['booking:cancel'],
  tools: [
    {
      name: 'cancel_booking',
      description: 'Cancel an existing booking. Requires confirmation from customer.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking confirmation number', required: true },
        { name: 'reason', type: 'string', description: 'Cancellation reason', required: false },
        { name: 'force', type: 'boolean', description: 'Force cancellation even with penalties', required: false, default: false }
      ],
      handler: 'lib/ai-engines/handlers/booking.cancelBooking',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'get_cancellation_policy',
      description: 'Get cancellation policy and potential penalties for a booking.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking confirmation number', required: true }
      ],
      handler: 'lib/ai-engines/handlers/booking.getCancellationPolicy',
      isAsync: true
    }
  ]
};

// ========================================
// PRICE MONITORING SKILLS
// ========================================

export const priceMonitoringSkill: AISkill = {
  id: 'price-monitoring',
  name: 'Price Monitoring',
  nameHe: 'מעקב מחירים',
  description: 'Monitor and track hotel prices over time, detect price drops',
  descriptionHe: 'מעקב אחר מחירי מלונות לאורך זמן, זיהוי ירידות מחירים',
  category: 'analysis',
  capabilities: ['price-monitoring', 'analytics'],
  isEnabled: true,
  priority: 5,
  requiredPermissions: ['monitoring:read', 'monitoring:write'],
  tools: [
    {
      name: 'track_hotel_price',
      description: 'Start tracking price for a specific hotel and date range.',
      parameters: [
        { name: 'hotelUrl', type: 'string', description: 'Hotel URL (Booking.com)', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'targetPrice', type: 'number', description: 'Alert when price drops below', required: false },
        { name: 'notifyEmail', type: 'string', description: 'Email for price alerts', required: false }
      ],
      handler: 'lib/ai-engines/handlers/monitoring.trackHotelPrice',
      isAsync: true
    },
    {
      name: 'get_price_history',
      description: 'Get historical price data for a hotel.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'dateFrom', type: 'date', description: 'Start date for history', required: true },
        { name: 'dateTo', type: 'date', description: 'End date for history', required: true }
      ],
      handler: 'lib/ai-engines/handlers/monitoring.getPriceHistory',
      isAsync: true
    },
    {
      name: 'analyze_price_trends',
      description: 'Analyze price trends and predict best booking time.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'travelDates', type: 'object', description: 'Travel date range { from, to }', required: true }
      ],
      handler: 'lib/ai-engines/handlers/monitoring.analyzePriceTrends',
      isAsync: true
    }
  ]
};

// ========================================
// COMMUNICATION SKILLS
// ========================================

export const voiceInteractionSkill: AISkill = {
  id: 'voice-interaction',
  name: 'Voice Interaction',
  nameHe: 'אינטראקציה קולית',
  description: 'Handle voice calls with speech-to-text and text-to-speech',
  descriptionHe: 'טיפול בשיחות קוליות עם המרת דיבור לטקסט וטקסט לדיבור',
  category: 'communication',
  capabilities: ['voice-interaction', 'real-time-streaming'],
  isEnabled: true,
  priority: 1,
  requiredPermissions: ['voice:read', 'voice:write'],
  tools: [
    {
      name: 'initiate_call',
      description: 'Initiate an outbound phone call to customer.',
      parameters: [
        { name: 'phoneNumber', type: 'string', description: 'Phone number to call (E.164 format)', required: true },
        { name: 'purpose', type: 'string', description: 'Call purpose/script', required: true },
        { name: 'language', type: 'string', description: 'Call language', required: false, default: 'he-IL' }
      ],
      handler: 'lib/ai-engines/handlers/voice.initiateCall',
      isAsync: true,
      timeout: 120000
    },
    {
      name: 'transfer_to_human',
      description: 'Transfer the call to a human agent.',
      parameters: [
        { name: 'reason', type: 'string', description: 'Transfer reason', required: true },
        { name: 'agentQueue', type: 'string', description: 'Target agent queue', required: false }
      ],
      handler: 'lib/ai-engines/handlers/voice.transferToHuman',
      isAsync: true
    },
    {
      name: 'send_call_summary_sms',
      description: 'Send SMS summary after call ends.',
      parameters: [
        { name: 'phoneNumber', type: 'string', description: 'Phone number', required: true },
        { name: 'summary', type: 'string', description: 'Call summary text', required: true }
      ],
      handler: 'lib/ai-engines/handlers/voice.sendCallSummarySms',
      isAsync: true
    }
  ]
};

export const smsIntegrationSkill: AISkill = {
  id: 'sms-integration',
  name: 'SMS Integration',
  nameHe: 'אינטגרציית SMS',
  description: 'Send and receive SMS messages for booking confirmations and updates',
  descriptionHe: 'שליחה וקבלת הודעות SMS לאישורי הזמנות ועדכונים',
  category: 'communication',
  capabilities: ['sms-integration'],
  isEnabled: true,
  priority: 2,
  requiredPermissions: ['sms:send'],
  tools: [
    {
      name: 'send_sms',
      description: 'Send SMS message to customer.',
      parameters: [
        { name: 'phoneNumber', type: 'string', description: 'Phone number (E.164)', required: true },
        { name: 'message', type: 'string', description: 'Message content', required: true },
        { name: 'template', type: 'string', description: 'Template ID', required: false }
      ],
      handler: 'lib/ai-engines/handlers/sms.sendSms',
      isAsync: true
    },
    {
      name: 'send_booking_confirmation_sms',
      description: 'Send booking confirmation SMS with details.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'phoneNumber', type: 'string', description: 'Phone number', required: true }
      ],
      handler: 'lib/ai-engines/handlers/sms.sendBookingConfirmation',
      isAsync: true
    }
  ]
};

export const emailIntegrationSkill: AISkill = {
  id: 'email-integration',
  name: 'Email Integration',
  nameHe: 'אינטגרציית אימייל',
  description: 'Send booking confirmations and marketing emails',
  descriptionHe: 'שליחת אישורי הזמנות ואימיילים שיווקיים',
  category: 'communication',
  capabilities: ['email-integration'],
  isEnabled: true,
  priority: 3,
  requiredPermissions: ['email:send'],
  tools: [
    {
      name: 'send_booking_email',
      description: 'Send booking confirmation email.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'recipientEmail', type: 'string', description: 'Recipient email', required: true }
      ],
      handler: 'lib/ai-engines/handlers/email.sendBookingEmail',
      isAsync: true
    },
    {
      name: 'send_cancellation_email',
      description: 'Send cancellation confirmation email.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'recipientEmail', type: 'string', description: 'Recipient email', required: true }
      ],
      handler: 'lib/ai-engines/handlers/email.sendCancellationEmail',
      isAsync: true
    }
  ]
};

// ========================================
// RESEARCH & ANALYSIS SKILLS
// ========================================

export const webSearchSkill: AISkill = {
  id: 'web-search',
  name: 'Web Search',
  nameHe: 'חיפוש באינטרנט',
  description: 'Search the web for travel information, reviews, and recommendations',
  descriptionHe: 'חיפוש באינטרנט למידע על נסיעות, ביקורות והמלצות',
  category: 'research',
  capabilities: ['web-search'],
  isEnabled: true,
  priority: 1,
  requiredPermissions: ['search:web'],
  tools: [
    {
      name: 'search_web',
      description: 'Search the web for travel-related information.',
      parameters: [
        { name: 'query', type: 'string', description: 'Search query', required: true },
        { name: 'type', type: 'string', description: 'Search type: general, news, reviews', required: false, default: 'general' },
        { name: 'limit', type: 'number', description: 'Number of results', required: false, default: 5 }
      ],
      handler: 'lib/ai-engines/handlers/research.searchWeb',
      isAsync: true
    },
    {
      name: 'get_destination_info',
      description: 'Get comprehensive information about a travel destination.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination name', required: true },
        { name: 'topics', type: 'array', description: 'Topics: weather, attractions, safety, cuisine', required: false }
      ],
      handler: 'lib/ai-engines/handlers/research.getDestinationInfo',
      isAsync: true
    }
  ]
};

export const knowledgeBaseSkill: AISkill = {
  id: 'knowledge-base',
  name: 'Knowledge Base',
  nameHe: 'בסיס ידע',
  description: 'Retrieve information from internal knowledge base using RAG',
  descriptionHe: 'אחזור מידע מבסיס ידע פנימי באמצעות RAG',
  category: 'research',
  capabilities: ['rag-retrieval', 'knowledge-base'],
  isEnabled: true,
  priority: 2,
  requiredPermissions: ['knowledge:read'],
  tools: [
    {
      name: 'search_knowledge_base',
      description: 'Search internal knowledge base for relevant information.',
      parameters: [
        { name: 'query', type: 'string', description: 'Search query', required: true },
        { name: 'category', type: 'string', description: 'Knowledge category', required: false },
        { name: 'topK', type: 'number', description: 'Number of results', required: false, default: 5 }
      ],
      handler: 'lib/ai-engines/handlers/knowledge.searchKnowledgeBase',
      isAsync: true
    },
    {
      name: 'get_faq_answer',
      description: 'Get answer to frequently asked question.',
      parameters: [
        { name: 'question', type: 'string', description: 'The question', required: true }
      ],
      handler: 'lib/ai-engines/handlers/knowledge.getFaqAnswer',
      isAsync: true
    }
  ]
};

export const marketAnalysisSkill: AISkill = {
  id: 'market-analysis',
  name: 'Market Analysis',
  nameHe: 'ניתוח שוק',
  description: 'Analyze hotel market, competition, and pricing trends',
  descriptionHe: 'ניתוח שוק מלונות, תחרות ומגמות תמחור',
  category: 'analysis',
  capabilities: ['analytics'],
  isEnabled: true,
  priority: 3,
  requiredPermissions: ['analytics:read'],
  tools: [
    {
      name: 'analyze_competition',
      description: 'Analyze competitor hotels and their pricing.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Target hotel ID', required: true },
        { name: 'radius', type: 'number', description: 'Radius in km', required: false, default: 5 }
      ],
      handler: 'lib/ai-engines/handlers/analysis.analyzeCompetition',
      isAsync: true
    },
    {
      name: 'get_seasonality_insights',
      description: 'Get seasonality and demand insights for a destination.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination', required: true },
        { name: 'year', type: 'number', description: 'Year', required: false }
      ],
      handler: 'lib/ai-engines/handlers/analysis.getSeasonalityInsights',
      isAsync: true
    },
    {
      name: 'get_upcoming_events',
      description: 'Get upcoming events that may affect hotel demand.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination', required: true },
        { name: 'dateRange', type: 'object', description: 'Date range { from, to }', required: true }
      ],
      handler: 'lib/ai-engines/handlers/analysis.getUpcomingEvents',
      isAsync: true
    }
  ]
};

// ========================================
// PERSONALIZATION SKILLS
// ========================================

export const userPreferencesSkill: AISkill = {
  id: 'user-preferences',
  name: 'User Preferences',
  nameHe: 'העדפות משתמש',
  description: 'Learn and apply user preferences for personalized recommendations',
  descriptionHe: 'לימוד ויישום העדפות משתמש להמלצות מותאמות אישית',
  category: 'personalization',
  capabilities: ['analytics'],
  isEnabled: true,
  priority: 1,
  requiredPermissions: ['user:read', 'user:write'],
  tools: [
    {
      name: 'get_user_preferences',
      description: 'Get stored user preferences.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/personalization.getUserPreferences',
      isAsync: true
    },
    {
      name: 'update_user_preferences',
      description: 'Update user preferences based on interactions.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'preferences', type: 'object', description: 'Preferences to update', required: true }
      ],
      handler: 'lib/ai-engines/handlers/personalization.updateUserPreferences',
      isAsync: true
    },
    {
      name: 'get_personalized_recommendations',
      description: 'Get hotel recommendations based on user preferences and history.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'destination', type: 'string', description: 'Destination', required: true },
        { name: 'dates', type: 'object', description: 'Travel dates', required: true }
      ],
      handler: 'lib/ai-engines/handlers/personalization.getRecommendations',
      isAsync: true
    }
  ]
};

export const loyaltyProgramSkill: AISkill = {
  id: 'loyalty-program',
  name: 'Loyalty Program',
  nameHe: 'תוכנית נאמנות',
  description: 'Manage loyalty points, rewards, and member benefits',
  descriptionHe: 'ניהול נקודות נאמנות, תגמולים והטבות חברים',
  category: 'personalization',
  capabilities: ['analytics'],
  isEnabled: true,
  priority: 2,
  requiredPermissions: ['loyalty:read', 'loyalty:write'],
  tools: [
    {
      name: 'get_loyalty_balance',
      description: 'Get loyalty points balance and tier status.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/loyalty.getLoyaltyBalance',
      isAsync: true
    },
    {
      name: 'redeem_points',
      description: 'Redeem loyalty points for rewards.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'points', type: 'number', description: 'Points to redeem', required: true },
        { name: 'rewardType', type: 'string', description: 'Reward type', required: true }
      ],
      handler: 'lib/ai-engines/handlers/loyalty.redeemPoints',
      isAsync: true
    },
    {
      name: 'apply_member_discount',
      description: 'Apply member discount to booking.',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/loyalty.applyMemberDiscount',
      isAsync: true
    }
  ]
};

// ========================================
// EXPORT ALL SKILLS
// ========================================

// ========================================
// NEW ADVANCED SKILLS (V2)
// ========================================

export const promoCodeSkill: AISkill = {
  id: 'promo-code',
  name: 'Promo Code Manager',
  nameHe: 'ניהול קודי קופון',
  description: 'Validate and apply promotional codes to bookings',
  descriptionHe: 'אימות והחלת קודי קופון על הזמנות',
  category: 'booking',
  capabilities: ['promo', 'discount'],
  isEnabled: true,
  priority: 5,
  requiredPermissions: ['promo:read', 'promo:apply'],
  tools: [
    {
      name: 'validate_promo_code',
      description: 'Check if a promo code is valid and get discount details.',
      parameters: [
        { name: 'code', type: 'string', description: 'Promotional code to validate', required: true },
        { name: 'totalPrice', type: 'number', description: 'Total booking price for percentage calculation', required: false }
      ],
      handler: 'lib/ai-engines/handlers/promo.validatePromoCode',
      isAsync: true,
      timeout: 5000
    },
    {
      name: 'apply_promo_code',
      description: 'Apply a validated promo code to a booking.',
      parameters: [
        { name: 'code', type: 'string', description: 'Promotional code', required: true },
        { name: 'bookingId', type: 'string', description: 'Booking ID to apply discount', required: true }
      ],
      handler: 'lib/ai-engines/handlers/promo.applyPromoCode',
      isAsync: true
    },
    {
      name: 'get_available_promos',
      description: 'Get all currently available promotions for the user.',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID for personalized promos', required: false },
        { name: 'isMobile', type: 'boolean', description: 'Is mobile device', required: false, default: false }
      ],
      handler: 'lib/ai-engines/handlers/promo.getAvailablePromos',
      isAsync: true
    }
  ]
};

export const smartDateSuggestionSkill: AISkill = {
  id: 'smart-date-suggestion',
  name: 'Smart Date Suggestion',
  nameHe: 'הצעת תאריכים חכמה',
  description: 'Suggest optimal dates based on price, availability, and demand patterns',
  descriptionHe: 'הצעת תאריכים אופטימליים על בסיס מחיר, זמינות ודפוסי ביקוש',
  category: 'analysis',
  capabilities: ['recommendation', 'optimization'],
  isEnabled: true,
  priority: 6,
  requiredPermissions: ['booking:read', 'analytics:read'],
  tools: [
    {
      name: 'suggest_cheaper_dates',
      description: 'Find cheaper dates near the requested dates for the same hotel.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'requestedCheckIn', type: 'date', description: 'Originally requested check-in', required: true },
        { name: 'requestedCheckOut', type: 'date', description: 'Originally requested check-out', required: true },
        { name: 'flexibility', type: 'number', description: 'Days of flexibility (e.g., 3 = ±3 days)', required: false, default: 3 },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true }
      ],
      handler: 'lib/ai-engines/handlers/dates.suggestCheaperDates',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'get_price_calendar',
      description: 'Get a calendar view of prices for a hotel over a date range.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'startDate', type: 'date', description: 'Calendar start date', required: true },
        { name: 'endDate', type: 'date', description: 'Calendar end date', required: true },
        { name: 'nights', type: 'number', description: 'Number of nights per stay', required: false, default: 1 }
      ],
      handler: 'lib/ai-engines/handlers/dates.getPriceCalendar',
      isAsync: true
    }
  ]
};

export const roomComparisonSkill: AISkill = {
  id: 'room-comparison',
  name: 'Room Comparison',
  nameHe: 'השוואת חדרים',
  description: 'Compare multiple rooms side-by-side with detailed analysis',
  descriptionHe: 'השוואת מספר חדרים זה מול זה עם ניתוח מפורט',
  category: 'analysis',
  capabilities: ['comparison', 'recommendation'],
  isEnabled: true,
  priority: 7,
  requiredPermissions: ['booking:read'],
  tools: [
    {
      name: 'compare_rooms',
      description: 'Compare selected rooms with detailed feature comparison.',
      parameters: [
        { name: 'roomCodes', type: 'array', description: 'Array of room codes to compare (2-5 rooms)', required: true },
        { name: 'priorityFactors', type: 'array', description: 'What to prioritize: price, size, view, amenities', required: false }
      ],
      handler: 'lib/ai-engines/handlers/rooms.compareRooms',
      isAsync: true
    },
    {
      name: 'recommend_best_room',
      description: 'Recommend the best room based on user preferences.',
      parameters: [
        { name: 'searchResults', type: 'object', description: 'Search results with rooms', required: true },
        { name: 'preferences', type: 'object', description: 'User preferences { budget, roomSize, view, amenities }', required: true }
      ],
      handler: 'lib/ai-engines/handlers/rooms.recommendBestRoom',
      isAsync: true
    }
  ]
};

export const bundleDealsSkill: AISkill = {
  id: 'bundle-deals',
  name: 'Bundle Deals',
  nameHe: 'חבילות משולבות',
  description: 'Create and suggest hotel + flight bundles, packages, and combo deals',
  descriptionHe: 'יצירה והצעת חבילות מלון + טיסה, פקג\'ים ומבצעים משולבים',
  category: 'booking',
  capabilities: ['bundling', 'upsell'],
  isEnabled: true,
  priority: 8,
  requiredPermissions: ['booking:read', 'flights:read'],
  tools: [
    {
      name: 'search_flight_hotel_bundle',
      description: 'Search for combined flight + hotel packages.',
      parameters: [
        { name: 'origin', type: 'string', description: 'Origin city/airport code', required: true },
        { name: 'destination', type: 'string', description: 'Destination city', required: true },
        { name: 'departureDate', type: 'date', description: 'Outbound flight date', required: true },
        { name: 'returnDate', type: 'date', description: 'Return flight date', required: true },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true },
        { name: 'children', type: 'array', description: 'Children ages', required: false }
      ],
      handler: 'lib/ai-engines/handlers/bundles.searchFlightHotelBundle',
      isAsync: true,
      timeout: 60000
    },
    {
      name: 'suggest_add_ons',
      description: 'Suggest add-ons for a booking (transfers, tours, insurance).',
      parameters: [
        { name: 'bookingDetails', type: 'object', description: 'Current booking details', required: true },
        { name: 'destination', type: 'string', description: 'Destination city', required: true }
      ],
      handler: 'lib/ai-engines/handlers/bundles.suggestAddOns',
      isAsync: true
    }
  ]
};

export const waitlistSkill: AISkill = {
  id: 'waitlist',
  name: 'Waitlist Manager',
  nameHe: 'ניהול רשימת המתנה',
  description: 'Manage waitlists for sold-out dates, notify when available',
  descriptionHe: 'ניהול רשימות המתנה לתאריכים אזלו, הודעה בזמינות',
  category: 'booking',
  capabilities: ['waitlist', 'notification'],
  isEnabled: true,
  priority: 9,
  requiredPermissions: ['booking:read', 'notification:send'],
  tools: [
    {
      name: 'join_waitlist',
      description: 'Add user to waitlist for sold-out dates.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'roomCategory', type: 'string', description: 'Room category', required: true },
        { name: 'checkIn', type: 'date', description: 'Requested check-in', required: true },
        { name: 'checkOut', type: 'date', description: 'Requested check-out', required: true },
        { name: 'email', type: 'string', description: 'Email for notification', required: true },
        { name: 'phone', type: 'string', description: 'Phone for SMS notification', required: false },
        { name: 'maxPrice', type: 'number', description: 'Maximum price willing to pay', required: false }
      ],
      handler: 'lib/ai-engines/handlers/waitlist.joinWaitlist',
      isAsync: true
    },
    {
      name: 'check_waitlist_status',
      description: 'Check current position in waitlist.',
      parameters: [
        { name: 'waitlistId', type: 'string', description: 'Waitlist entry ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/waitlist.checkStatus',
      isAsync: true
    }
  ]
};

export const groupBookingSkill: AISkill = {
  id: 'group-booking',
  name: 'Group Booking',
  nameHe: 'הזמנות קבוצתיות',
  description: 'Handle group bookings with multiple rooms and special pricing',
  descriptionHe: 'טיפול בהזמנות קבוצתיות עם מספר חדרים ותמחור מיוחד',
  category: 'booking',
  capabilities: ['group', 'bulk'],
  isEnabled: true,
  priority: 10,
  requiredPermissions: ['booking:write', 'group:manage'],
  tools: [
    {
      name: 'create_group_booking',
      description: 'Create a group booking with multiple rooms.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'rooms', type: 'array', description: 'Array of room requirements [{ type, count, guests }]', required: true },
        { name: 'groupName', type: 'string', description: 'Group/event name', required: true },
        { name: 'contactPerson', type: 'object', description: 'Main contact details', required: true }
      ],
      handler: 'lib/ai-engines/handlers/groups.createGroupBooking',
      isAsync: true,
      timeout: 60000
    },
    {
      name: 'get_group_pricing',
      description: 'Get special pricing for group bookings.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'roomCount', type: 'number', description: 'Number of rooms needed', required: true },
        { name: 'nights', type: 'number', description: 'Number of nights', required: true }
      ],
      handler: 'lib/ai-engines/handlers/groups.getGroupPricing',
      isAsync: true
    }
  ]
};

export const affiliateSkill: AISkill = {
  id: 'affiliate',
  name: 'Affiliate Management',
  nameHe: 'ניהול שותפים',
  description: 'Track and manage affiliate referrals and commissions',
  descriptionHe: 'מעקב וניהול הפניות שותפים ועמלות',
  category: 'marketing',
  capabilities: ['affiliate', 'tracking'],
  isEnabled: true,
  priority: 11,
  requiredPermissions: ['affiliate:read', 'affiliate:write'],
  tools: [
    {
      name: 'track_affiliate_click',
      description: 'Track an affiliate referral click.',
      parameters: [
        { name: 'affiliateCode', type: 'string', description: 'Affiliate code', required: true },
        { name: 'hotelId', type: 'string', description: 'Hotel viewed', required: false },
        { name: 'source', type: 'string', description: 'Traffic source', required: false }
      ],
      handler: 'lib/ai-engines/handlers/affiliate.trackClick',
      isAsync: true
    },
    {
      name: 'convert_affiliate',
      description: 'Record an affiliate conversion (booking completed).',
      parameters: [
        { name: 'affiliateCode', type: 'string', description: 'Affiliate code', required: true },
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'amount', type: 'number', description: 'Booking amount', required: true }
      ],
      handler: 'lib/ai-engines/handlers/affiliate.convertAffiliate',
      isAsync: true
    }
  ]
};

// ========================================
// ADVANCED RESEARCH & INTELLIGENCE SKILLS (V3)
// ========================================

export const destinationInfoSkill: AISkill = {
  id: 'destination-info',
  name: 'Destination Intelligence',
  nameHe: 'מודיעין יעדים',
  description: 'Real-time destination information including weather, events, attractions, safety and local tips using Tavily AI search',
  descriptionHe: 'מידע יעדים בזמן אמת כולל מזג אוויר, אירועים, אטרקציות, בטיחות וטיפים מקומיים',
  category: 'research',
  capabilities: ['web-search', 'destination-info', 'real-time'],
  isEnabled: true,
  priority: 12,
  requiredPermissions: ['search:web', 'destination:read'],
  tools: [
    {
      name: 'get_destination_info',
      description: 'Get comprehensive destination information including weather, events, attractions, safety and local tips.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination city or area name', required: true },
        { name: 'travelDates', type: 'object', description: 'Travel dates { checkIn, checkOut }', required: false },
        { name: 'interests', type: 'array', description: 'User interests: culture, food, nightlife, nature, family, etc.', required: false }
      ],
      handler: 'lib/services/destination-info-service.getDestinationInfo',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'get_destination_weather',
      description: 'Get weather forecast and climate info for a destination.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination name', required: true },
        { name: 'dates', type: 'object', description: 'Date range { from, to }', required: false }
      ],
      handler: 'lib/services/destination-info-service.getDestinationWeather',
      isAsync: true
    },
    {
      name: 'get_destination_events',
      description: 'Get upcoming events, festivals, and happenings at destination.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination name', required: true },
        { name: 'dateRange', type: 'object', description: 'Date range { from, to }', required: true },
        { name: 'eventTypes', type: 'array', description: 'Event types: music, sports, culture, food, etc.', required: false }
      ],
      handler: 'lib/services/destination-info-service.getDestinationEvents',
      isAsync: true
    },
    {
      name: 'get_destination_attractions',
      description: 'Get top attractions and things to do at destination.',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination name', required: true },
        { name: 'limit', type: 'number', description: 'Number of attractions', required: false, default: 10 },
        { name: 'categories', type: 'array', description: 'Attraction categories: museums, nature, landmarks, etc.', required: false }
      ],
      handler: 'lib/services/destination-info-service.getDestinationAttractions',
      isAsync: true
    }
  ]
};

export const customerMemorySkill: AISkill = {
  id: 'customer-memory',
  name: 'Customer Memory',
  nameHe: 'זיכרון לקוח',
  description: 'Long-term customer memory for preferences, history, and personalized recommendations using intelligent profile learning',
  descriptionHe: 'זיכרון לקוח ארוך טווח להעדפות, היסטוריה והמלצות מותאמות אישית',
  category: 'personalization',
  capabilities: ['memory', 'personalization', 'learning'],
  isEnabled: true,
  priority: 13,
  requiredPermissions: ['user:read', 'user:write', 'memory:read', 'memory:write'],
  tools: [
    {
      name: 'get_customer_profile',
      description: 'Get complete customer profile including preferences, history, and inferred insights.',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true }
      ],
      handler: 'lib/services/customer-memory-service.getCustomerProfile',
      isAsync: true
    },
    {
      name: 'save_preference',
      description: 'Save a customer preference learned from interaction.',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true },
        { name: 'category', type: 'string', description: 'Preference category: accommodation, dining, activities, travel_style, budget', required: true },
        { name: 'key', type: 'string', description: 'Preference key (e.g., "preferred_room_type")', required: true },
        { name: 'value', type: 'string', description: 'Preference value', required: true },
        { name: 'confidence', type: 'number', description: 'Confidence score 0-1', required: false, default: 0.8 }
      ],
      handler: 'lib/services/customer-memory-service.savePreference',
      isAsync: true
    },
    {
      name: 'record_customer_event',
      description: 'Record a customer event (booking, search, cancellation) for history.',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true },
        { name: 'eventType', type: 'string', description: 'Event type: booking, search, cancellation, inquiry, review', required: true },
        { name: 'eventData', type: 'object', description: 'Event details', required: true }
      ],
      handler: 'lib/services/customer-memory-service.recordCustomerEvent',
      isAsync: true
    },
    {
      name: 'get_personalized_recommendations',
      description: 'Get personalized recommendations based on customer profile and history.',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true },
        { name: 'context', type: 'object', description: 'Current search context { destination, dates, budget }', required: true },
        { name: 'limit', type: 'number', description: 'Number of recommendations', required: false, default: 5 }
      ],
      handler: 'lib/services/customer-memory-service.getPersonalizedRecommendations',
      isAsync: true
    },
    {
      name: 'delete_customer_data',
      description: 'Delete all customer data (GDPR compliance).',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true },
        { name: 'confirmation', type: 'boolean', description: 'Confirm deletion', required: true }
      ],
      handler: 'lib/services/customer-memory-service.deleteCustomerData',
      isAsync: true
    }
  ]
};

export const priceComparisonSkill: AISkill = {
  id: 'price-comparison',
  name: 'Price Comparison Engine',
  nameHe: 'מנוע השוואת מחירים',
  description: 'Compare hotel prices across multiple booking platforms, find best deals, and track price changes',
  descriptionHe: 'השוואת מחירי מלונות בפלטפורמות הזמנה מרובות, איתור עסקאות הטובות ומעקב שינויי מחיר',
  category: 'analysis',
  capabilities: ['price-comparison', 'analytics', 'monitoring'],
  isEnabled: true,
  priority: 14,
  requiredPermissions: ['booking:read', 'monitoring:read', 'monitoring:write'],
  tools: [
    {
      name: 'compare_prices',
      description: 'Compare hotel prices across multiple booking platforms.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'guests', type: 'object', description: 'Guests { adults, children }', required: true },
        { name: 'roomType', type: 'string', description: 'Room type filter', required: false }
      ],
      handler: 'lib/services/price-comparison-service.comparePrices',
      isAsync: true,
      timeout: 45000
    },
    {
      name: 'get_price_history',
      description: 'Get historical price data for a hotel across sources.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'dateRange', type: 'object', description: 'Date range { from, to }', required: true }
      ],
      handler: 'lib/services/price-comparison-service.getPriceHistory',
      isAsync: true
    },
    {
      name: 'predict_best_price',
      description: 'Predict best time to book based on price patterns.',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'travelDates', type: 'object', description: 'Travel dates { checkIn, checkOut }', required: true }
      ],
      handler: 'lib/services/price-comparison-service.getPricePrediction',
      isAsync: true
    },
    {
      name: 'create_price_alert',
      description: 'Create alert when price drops below target.',
      parameters: [
        { name: 'customerId', type: 'string', description: 'Customer ID', required: true },
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'targetPrice', type: 'number', description: 'Target price', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'notifyEmail', type: 'string', description: 'Email for notifications', required: true }
      ],
      handler: 'lib/services/price-comparison-service.createPriceAlert',
      isAsync: true
    }
  ]
};

export const travelBundleSkill: AISkill = {
  id: 'travel-bundle',
  name: 'Travel Bundle Search',
  nameHe: 'חיפוש חבילות נסיעה',
  description: 'Search and compare flight+hotel packages with savings analysis',
  descriptionHe: 'חיפוש והשוואת חבילות טיסה+מלון עם ניתוח חיסכון',
  category: 'booking',
  capabilities: ['bundling', 'comparison', 'savings'],
  isEnabled: true,
  priority: 15,
  requiredPermissions: ['booking:read', 'flights:read'],
  tools: [
    {
      name: 'search_bundles',
      description: 'Search for flight+hotel bundle packages.',
      parameters: [
        { name: 'origin', type: 'string', description: 'Origin city or airport code', required: true },
        { name: 'destination', type: 'string', description: 'Destination city', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in/departure date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out/return date', required: true },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true },
        { name: 'children', type: 'array', description: 'Children ages', required: false },
        { name: 'class', type: 'string', description: 'Flight class: economy, business, first', required: false },
        { name: 'hotelStars', type: 'array', description: 'Hotel star ratings filter', required: false },
        { name: 'maxBudget', type: 'number', description: 'Maximum total budget', required: false }
      ],
      handler: 'lib/services/travel-bundle-service.searchBundles',
      isAsync: true,
      timeout: 60000
    },
    {
      name: 'get_bundle_details',
      description: 'Get detailed information about a specific bundle.',
      parameters: [
        { name: 'bundleId', type: 'string', description: 'Bundle ID', required: true }
      ],
      handler: 'lib/services/travel-bundle-service.getBundleDetails',
      isAsync: true
    },
    {
      name: 'check_bundle_availability',
      description: 'Check real-time availability of a bundle before booking.',
      parameters: [
        { name: 'bundleId', type: 'string', description: 'Bundle ID', required: true }
      ],
      handler: 'lib/services/travel-bundle-service.checkBundleAvailability',
      isAsync: true
    },
    {
      name: 'create_custom_bundle',
      description: 'Create a custom bundle from individual flight and hotel selections.',
      parameters: [
        { name: 'flightIds', type: 'array', description: 'Selected flight IDs', required: false },
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'roomCode', type: 'string', description: 'Room code', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'extras', type: 'array', description: 'Extra services: transfer, insurance, tours', required: false }
      ],
      handler: 'lib/services/travel-bundle-service.createCustomBundle',
      isAsync: true
    },
    {
      name: 'get_bundle_breakdown',
      description: 'Get price breakdown for a bundle showing savings.',
      parameters: [
        { name: 'bundleId', type: 'string', description: 'Bundle ID', required: true }
      ],
      handler: 'lib/services/travel-bundle-service.getBundlePriceBreakdown',
      isAsync: true
    }
  ]
};

// ========================================
// PHASE 1 CRITICAL SKILLS
// ========================================

export const paymentProcessingSkill: AISkill = {
  id: 'payment-processing',
  name: 'Payment Processing',
  nameHe: 'עיבוד תשלומים',
  description: 'Process payments securely using Stripe. Supports credit cards, Apple Pay, Google Pay, and 3D Secure.',
  descriptionHe: 'עיבוד תשלומים מאובטח באמצעות Stripe. תומך בכרטיסי אשראי, Apple Pay, Google Pay ו-3D Secure.',
  category: 'booking',
  capabilities: ['payment-processing'],
  isEnabled: true,
  priority: 4,
  requiredPermissions: ['payment:process', 'booking:write'],
  tools: [
    {
      name: 'create_payment_intent',
      description: 'Create a Stripe payment intent for a booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'amount', type: 'number', description: 'Amount in cents', required: true },
        { name: 'currency', type: 'string', description: 'Currency code (USD, EUR, ILS)', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: false },
        { name: 'description', type: 'string', description: 'Payment description', required: false }
      ],
      handler: 'lib/ai-engines/handlers/payment.createPaymentIntent',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'process_payment',
      description: 'Process a payment using an existing payment intent',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Stripe Payment Intent ID', required: true },
        { name: 'paymentMethodId', type: 'string', description: 'Stripe Payment Method ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/payment.processPayment',
      isAsync: true,
      timeout: 60000
    },
    {
      name: 'verify_payment',
      description: 'Verify a payment was successful',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Stripe Payment Intent ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/payment.verifyPayment',
      isAsync: true
    },
    {
      name: 'get_payment_status',
      description: 'Get current status of a payment',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Stripe Payment Intent ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/payment.getPaymentStatus',
      isAsync: true
    },
    {
      name: 'cancel_payment',
      description: 'Cancel a pending payment intent',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Stripe Payment Intent ID', required: true },
        { name: 'reason', type: 'string', description: 'Cancellation reason', required: false }
      ],
      handler: 'lib/ai-engines/handlers/payment.cancelPayment',
      isAsync: true
    }
  ]
};

export const refundProcessingSkill: AISkill = {
  id: 'refund-processing',
  name: 'Refund Processing',
  nameHe: 'עיבוד החזרים',
  description: 'Process refunds automatically based on cancellation policy. Supports full and partial refunds.',
  descriptionHe: 'עיבוד החזרים אוטומטי על פי מדיניות הביטול. תומך בהחזרים מלאים וחלקיים.',
  category: 'booking',
  capabilities: ['refund-processing', 'cancellation'],
  isEnabled: true,
  priority: 5,
  requiredPermissions: ['payment:refund', 'booking:cancel'],
  tools: [
    {
      name: 'calculate_refund_amount',
      description: 'Calculate refund amount based on cancellation policy',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'paymentIntentId', type: 'string', description: 'Original payment intent ID', required: true },
        { name: 'cancellationDate', type: 'date', description: 'Cancellation date', required: false }
      ],
      handler: 'lib/ai-engines/handlers/refund.calculateRefundAmount',
      isAsync: true
    },
    {
      name: 'process_refund',
      description: 'Process a full refund for a booking',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Original payment intent ID', required: true },
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'reason', type: 'string', description: 'Refund reason', required: false }
      ],
      handler: 'lib/ai-engines/handlers/refund.processRefund',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'process_partial_refund',
      description: 'Process a partial refund for a booking',
      parameters: [
        { name: 'paymentIntentId', type: 'string', description: 'Original payment intent ID', required: true },
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'amount', type: 'number', description: 'Refund amount in cents', required: true },
        { name: 'reason', type: 'string', description: 'Refund reason', required: false }
      ],
      handler: 'lib/ai-engines/handlers/refund.processPartialRefund',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'get_refund_status',
      description: 'Get status of a refund',
      parameters: [
        { name: 'refundId', type: 'string', description: 'Stripe Refund ID', required: true }
      ],
      handler: 'lib/ai-engines/handlers/refund.getRefundStatus',
      isAsync: true
    },
    {
      name: 'auto_refund_with_policy',
      description: 'Automatically refund based on cancellation policy',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'paymentIntentId', type: 'string', description: 'Original payment intent ID', required: true },
        { name: 'reason', type: 'string', description: 'Cancellation reason', required: false }
      ],
      handler: 'lib/ai-engines/handlers/refund.autoRefundWithPolicy',
      isAsync: true,
      timeout: 60000
    }
  ]
};

export const invoiceGenerationSkill: AISkill = {
  id: 'invoice-generation',
  name: 'Invoice Generation',
  nameHe: 'הפקת חשבוניות',
  description: 'Generate professional invoices and receipts in multiple languages with PDF export.',
  descriptionHe: 'הפקת חשבוניות מקצועיות וקבלות במספר שפות עם ייצוא PDF.',
  category: 'communication',
  capabilities: ['invoice', 'pdf-generation', 'email'],
  isEnabled: true,
  priority: 6,
  requiredPermissions: ['booking:read', 'invoice:generate'],
  tools: [
    {
      name: 'generate_invoice',
      description: 'Generate an invoice for a booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'hotelName', type: 'string', description: 'Hotel name', required: true },
        { name: 'roomType', type: 'string', description: 'Room type', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'totalPrice', type: 'number', description: 'Total price in cents', required: true },
        { name: 'currency', type: 'string', description: 'Currency code', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'confirmationNumber', type: 'string', description: 'Confirmation number', required: true },
        { name: 'guests', type: 'number', description: 'Number of guests', required: true }
      ],
      handler: 'lib/ai-engines/handlers/invoice.generateInvoice',
      isAsync: true
    },
    {
      name: 'send_invoice_email',
      description: 'Send invoice via email',
      parameters: [
        { name: 'to', type: 'string', description: 'Recipient email', required: true },
        { name: 'invoiceNumber', type: 'string', description: 'Invoice number', required: true },
        { name: 'invoiceHtml', type: 'string', description: 'Invoice HTML content', required: true },
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: true }
      ],
      handler: 'lib/ai-engines/handlers/invoice.sendInvoiceEmail',
      isAsync: true
    },
    {
      name: 'generate_receipt',
      description: 'Generate a receipt for a completed payment',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'paymentId', type: 'string', description: 'Payment ID', required: true },
        { name: 'amount', type: 'number', description: 'Payment amount in cents', required: true },
        { name: 'currency', type: 'string', description: 'Currency code', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'hotelName', type: 'string', description: 'Hotel name', required: true },
        { name: 'confirmationNumber', type: 'string', description: 'Confirmation number', required: true }
      ],
      handler: 'lib/ai-engines/handlers/invoice.generateReceipt',
      isAsync: true
    }
  ]
};

export const fraudDetectionSkill: AISkill = {
  id: 'fraud-detection',
  name: 'Fraud Detection',
  nameHe: 'זיהוי הונאות',
  description: 'Analyze bookings for fraud risk using multiple signals: velocity, email patterns, geolocation, and behavior analysis.',
  descriptionHe: 'ניתוח הזמנות לזיהוי סיכוני הונאה באמצעות אותות מרובים: קצב, דפוסי אימייל, מיקום גיאוגרפי וניתוח התנהגות.',
  category: 'analysis',
  capabilities: ['fraud-detection', 'risk-scoring', 'security'],
  isEnabled: true,
  priority: 3,
  requiredPermissions: ['booking:read', 'security:analyze'],
  tools: [
    {
      name: 'analyze_booking_risk',
      description: 'Analyze a booking for fraud risk and get a risk score',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: true },
        { name: 'amount', type: 'number', description: 'Booking amount in cents', required: true },
        { name: 'currency', type: 'string', description: 'Currency code', required: true },
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'ipAddress', type: 'string', description: 'Customer IP address', required: false },
        { name: 'billingCountry', type: 'string', description: 'Billing country code', required: false }
      ],
      handler: 'lib/ai-engines/handlers/fraud.analyzeBookingRisk',
      isAsync: true
    },
    {
      name: 'flag_suspicious_activity',
      description: 'Flag suspicious activity for review',
      parameters: [
        { name: 'type', type: 'string', description: 'Type: velocity, mismatch, pattern, blacklist, geolocation, device', required: true },
        { name: 'severity', type: 'string', description: 'Severity: low, medium, high, critical', required: true },
        { name: 'description', type: 'string', description: 'Activity description', required: true },
        { name: 'bookingId', type: 'string', description: 'Related booking ID', required: false },
        { name: 'customerId', type: 'string', description: 'Related customer ID', required: false }
      ],
      handler: 'lib/ai-engines/handlers/fraud.flagSuspiciousActivity',
      isAsync: true
    },
    {
      name: 'get_risk_score',
      description: 'Get a quick risk score for a booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'amount', type: 'number', description: 'Booking amount in cents', required: true }
      ],
      handler: 'lib/ai-engines/handlers/fraud.getRiskScore',
      isAsync: true
    },
    {
      name: 'check_blacklist',
      description: 'Check if customer is on blacklist',
      parameters: [
        { name: 'email', type: 'string', description: 'Customer email', required: false },
        { name: 'phone', type: 'string', description: 'Customer phone', required: false },
        { name: 'ipAddress', type: 'string', description: 'Customer IP address', required: false }
      ],
      handler: 'lib/ai-engines/handlers/fraud.checkBlacklist',
      isAsync: true
    },
    {
      name: 'run_fraud_checks',
      description: 'Run all fraud checks on a booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'customerEmail', type: 'string', description: 'Customer email', required: true },
        { name: 'customerName', type: 'string', description: 'Customer name', required: true },
        { name: 'amount', type: 'number', description: 'Booking amount in cents', required: true },
        { name: 'currency', type: 'string', description: 'Currency code', required: true }
      ],
      handler: 'lib/ai-engines/handlers/fraud.runFraudChecks',
      isAsync: true
    }
  ]
};

export const calendarSyncSkill: AISkill = {
  id: 'calendar-sync',
  name: 'Calendar Integration',
  nameHe: 'אינטגרציית לוח שנה',
  description: 'Add bookings to Google Calendar, Outlook, Apple Calendar with automatic reminders',
  descriptionHe: 'הוספת הזמנות ללוח שנה של גוגל, אאוטלוק, אפל עם תזכורות אוטומטיות',
  category: 'communication',
  capabilities: ['calendar', 'sync', 'reminders'],
  isEnabled: true,
  priority: 16,
  requiredPermissions: ['booking:read', 'calendar:write'],
  tools: [
    {
      name: 'add_to_calendar',
      description: 'Generate calendar links for a booking (Google, Outlook, Apple, Yahoo).',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'hotelName', type: 'string', description: 'Hotel name', required: true },
        { name: 'hotelAddress', type: 'string', description: 'Hotel address', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'roomType', type: 'string', description: 'Room type', required: true },
        { name: 'confirmationNumber', type: 'string', description: 'Confirmation number', required: true },
        { name: 'guests', type: 'array', description: 'Guest names', required: true }
      ],
      handler: 'lib/services/calendar-sync-service.getAllCalendarLinks',
      isAsync: false
    },
    {
      name: 'download_ics_file',
      description: 'Download ICS calendar file for the booking.',
      parameters: [
        { name: 'booking', type: 'object', description: 'Booking details', required: true }
      ],
      handler: 'lib/services/calendar-sync-service.downloadICSFile',
      isAsync: false
    },
    {
      name: 'sync_to_google_calendar',
      description: 'Sync booking directly to connected Google Calendar (requires OAuth).',
      parameters: [
        { name: 'booking', type: 'object', description: 'Booking details', required: true },
        { name: 'accessToken', type: 'string', description: 'Google OAuth access token', required: true }
      ],
      handler: 'lib/services/calendar-sync-service.syncToConnectedCalendar',
      isAsync: true
    },
    {
      name: 'update_calendar_event',
      description: 'Update an existing calendar event (for booking modifications).',
      parameters: [
        { name: 'provider', type: 'string', description: 'Calendar provider: google, outlook', required: true },
        { name: 'eventId', type: 'string', description: 'Calendar event ID', required: true },
        { name: 'booking', type: 'object', description: 'Updated booking details', required: true },
        { name: 'accessToken', type: 'string', description: 'OAuth access token', required: true }
      ],
      handler: 'lib/services/calendar-sync-service.updateCalendarEvent',
      isAsync: true
    },
    {
      name: 'delete_calendar_event',
      description: 'Delete calendar event (for cancellations).',
      parameters: [
        { name: 'provider', type: 'string', description: 'Calendar provider', required: true },
        { name: 'eventId', type: 'string', description: 'Calendar event ID', required: true },
        { name: 'accessToken', type: 'string', description: 'OAuth access token', required: true }
      ],
      handler: 'lib/services/calendar-sync-service.deleteCalendarEvent',
      isAsync: true
    }
  ]
};

export const allSkills: AISkill[] = [
  // Booking
  hotelSearchSkill,
  hotelPrebookSkill,
  hotelBookingSkill,
  bookingCancellationSkill,
  // Phase 1 Critical Skills
  paymentProcessingSkill,
  refundProcessingSkill,
  invoiceGenerationSkill,
  fraudDetectionSkill,
  // Price Monitoring
  priceMonitoringSkill,
  // Communication
  voiceInteractionSkill,
  smsIntegrationSkill,
  emailIntegrationSkill,
  // Research & Analysis
  webSearchSkill,
  knowledgeBaseSkill,
  marketAnalysisSkill,
  // Personalization
  userPreferencesSkill,
  loyaltyProgramSkill,
  // NEW V2 Skills
  promoCodeSkill,
  smartDateSuggestionSkill,
  roomComparisonSkill,
  bundleDealsSkill,
  waitlistSkill,
  groupBookingSkill,
  affiliateSkill,
  // NEW V3 Skills - Advanced Intelligence
  destinationInfoSkill,
  customerMemorySkill,
  priceComparisonSkill,
  travelBundleSkill,
  calendarSyncSkill
];

export const getSkillById = (id: string): AISkill | undefined => {
  return allSkills.find(skill => skill.id === id);
};

export const getSkillsByCategory = (category: string): AISkill[] => {
  return allSkills.filter(skill => skill.category === category);
};

export const getEnabledSkills = (): AISkill[] => {
  return allSkills.filter(skill => skill.isEnabled);
};
