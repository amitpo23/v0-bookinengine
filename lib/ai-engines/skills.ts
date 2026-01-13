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

export const allSkills: AISkill[] = [
  // Booking
  hotelSearchSkill,
  hotelPrebookSkill,
  hotelBookingSkill,
  bookingCancellationSkill,
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
  affiliateSkill
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
