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
  loyaltyProgramSkill
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
