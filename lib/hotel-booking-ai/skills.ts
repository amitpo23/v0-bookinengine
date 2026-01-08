/**
 * Hotel Booking AI - Skills Library
 * Complete collection of skills for the Hotel Booking AI system
 */

import type { BookingSkill } from './types';

// ========================================
// SEARCH SKILLS
// ========================================

export const hotelSearchSkill: BookingSkill = {
  id: 'hotel-search',
  name: 'Hotel Search',
  nameHe: 'חיפוש מלונות',
  description: 'Search for available hotels with real-time pricing and availability',
  descriptionHe: 'חיפוש מלונות זמינים עם תמחור וזמינות בזמן אמת',
  category: 'search',
  capabilities: ['search'],
  isEnabled: true,
  priority: 1,
  icon: 'search',
  requiredPermissions: ['booking:read'],
  tools: [
    {
      name: 'search_hotels',
      description: 'Search for available hotel rooms with pricing and availability',
      descriptionHe: 'חיפוש חדרי מלון זמינים עם מחירים וזמינות',
      parameters: [
        { name: 'destination', type: 'string', description: 'City or destination name', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date (YYYY-MM-DD)', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date (YYYY-MM-DD)', required: true },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true, default: 2 },
        { name: 'children', type: 'array', description: 'Array of children ages', required: false, default: [] },
        { name: 'rooms', type: 'number', description: 'Number of rooms', required: false, default: 1 },
        { name: 'stars', type: 'array', description: 'Filter by star rating (1-5)', required: false },
        { name: 'maxPrice', type: 'number', description: 'Maximum price per night', required: false },
        { name: 'amenities', type: 'array', description: 'Required amenities', required: false }
      ],
      handler: 'handlers/booking.searchHotels',
      isAsync: true,
      timeout: 30000,
      retryConfig: { maxRetries: 3, delayMs: 1000, exponentialBackoff: true }
    },
    {
      name: 'get_hotel_details',
      description: 'Get detailed information about a specific hotel',
      descriptionHe: 'קבלת מידע מפורט על מלון ספציפי',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true }
      ],
      handler: 'handlers/booking.getHotelDetails',
      isAsync: true,
      timeout: 15000
    }
  ]
};

export const destinationSearchSkill: BookingSkill = {
  id: 'destination-search',
  name: 'Destination Search',
  nameHe: 'חיפוש יעדים',
  description: 'Search and get information about travel destinations',
  descriptionHe: 'חיפוש וקבלת מידע על יעדי נסיעות',
  category: 'search',
  capabilities: ['search', 'knowledge-base'],
  isEnabled: true,
  priority: 2,
  icon: 'map-pin',
  requiredPermissions: ['search:read'],
  tools: [
    {
      name: 'search_destinations',
      description: 'Search for travel destinations by name or criteria',
      parameters: [
        { name: 'query', type: 'string', description: 'Search query', required: true },
        { name: 'type', type: 'string', description: 'Destination type: city, beach, mountain, etc.', required: false }
      ],
      handler: 'handlers/search.searchDestinations',
      isAsync: true,
      timeout: 10000
    },
    {
      name: 'get_destination_info',
      description: 'Get detailed information about a destination',
      parameters: [
        { name: 'destination', type: 'string', description: 'Destination name', required: true },
        { name: 'topics', type: 'array', description: 'Info topics: weather, attractions, safety, cuisine', required: false }
      ],
      handler: 'handlers/search.getDestinationInfo',
      isAsync: true,
      timeout: 15000
    }
  ]
};

// ========================================
// BOOKING SKILLS
// ========================================

export const prebookSkill: BookingSkill = {
  id: 'prebook',
  name: 'Hotel Pre-booking',
  nameHe: 'הזמנה מוקדמת',
  description: 'Pre-book a room to confirm availability and lock the price',
  descriptionHe: 'הזמנה מוקדמת לחדר לאישור זמינות ונעילת מחיר',
  category: 'booking',
  capabilities: ['prebook'],
  isEnabled: true,
  priority: 3,
  icon: 'clock',
  requiredPermissions: ['booking:write'],
  tools: [
    {
      name: 'prebook_room',
      description: 'Pre-book a room to confirm availability and lock price temporarily',
      descriptionHe: 'הזמנה מוקדמת של חדר לאישור זמינות ונעילת מחיר',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'roomCode', type: 'string', description: 'Room code from search results', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'adults', type: 'number', description: 'Number of adults', required: true },
        { name: 'children', type: 'array', description: 'Children ages', required: false }
      ],
      handler: 'handlers/booking.prebookRoom',
      isAsync: true,
      timeout: 30000
    }
  ]
};

export const bookingSkill: BookingSkill = {
  id: 'booking',
  name: 'Hotel Booking',
  nameHe: 'הזמנת מלון',
  description: 'Complete hotel booking with customer details and payment',
  descriptionHe: 'השלמת הזמנת מלון עם פרטי לקוח ותשלום',
  category: 'booking',
  capabilities: ['booking', 'payment-processing'],
  isEnabled: true,
  priority: 4,
  icon: 'check-circle',
  requiredPermissions: ['booking:write', 'payment:process'],
  tools: [
    {
      name: 'complete_booking',
      description: 'Complete the booking with customer details and payment',
      descriptionHe: 'השלמת ההזמנה עם פרטי לקוח ותשלום',
      parameters: [
        { name: 'prebookToken', type: 'string', description: 'Token from prebook', required: true },
        { name: 'customer', type: 'object', description: 'Customer details', required: true },
        { name: 'guests', type: 'array', description: 'Guest list', required: true },
        { name: 'specialRequests', type: 'string', description: 'Special requests', required: false },
        { name: 'paymentMethod', type: 'string', description: 'Payment method', required: false }
      ],
      handler: 'handlers/booking.completeBooking',
      isAsync: true,
      timeout: 60000
    },
    {
      name: 'get_booking_status',
      description: 'Get the status of an existing booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID or confirmation number', required: true }
      ],
      handler: 'handlers/booking.getBookingStatus',
      isAsync: true,
      timeout: 15000
    }
  ]
};

export const cancellationSkill: BookingSkill = {
  id: 'cancellation',
  name: 'Booking Cancellation',
  nameHe: 'ביטול הזמנה',
  description: 'Cancel or modify existing bookings',
  descriptionHe: 'ביטול או שינוי הזמנות קיימות',
  category: 'booking',
  capabilities: ['cancellation', 'modification'],
  isEnabled: true,
  priority: 5,
  icon: 'x-circle',
  requiredPermissions: ['booking:cancel'],
  tools: [
    {
      name: 'cancel_booking',
      description: 'Cancel an existing booking',
      descriptionHe: 'ביטול הזמנה קיימת',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'reason', type: 'string', description: 'Cancellation reason', required: false }
      ],
      handler: 'handlers/booking.cancelBooking',
      isAsync: true,
      timeout: 30000
    },
    {
      name: 'get_cancellation_policy',
      description: 'Get cancellation policy and potential penalties',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true }
      ],
      handler: 'handlers/booking.getCancellationPolicy',
      isAsync: true,
      timeout: 10000
    },
    {
      name: 'modify_booking',
      description: 'Modify an existing booking (dates, guests, room)',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'modifications', type: 'object', description: 'Changes to apply', required: true }
      ],
      handler: 'handlers/booking.modifyBooking',
      isAsync: true,
      timeout: 45000
    }
  ]
};

// ========================================
// ANALYSIS SKILLS
// ========================================

export const priceMonitoringSkill: BookingSkill = {
  id: 'price-monitoring',
  name: 'Price Monitoring',
  nameHe: 'מעקב מחירים',
  description: 'Track and analyze hotel prices over time',
  descriptionHe: 'מעקב וניתוח מחירי מלונות לאורך זמן',
  category: 'analysis',
  capabilities: ['price-tracking', 'analytics'],
  isEnabled: true,
  priority: 6,
  icon: 'trending-down',
  requiredPermissions: ['monitoring:read', 'monitoring:write'],
  tools: [
    {
      name: 'track_price',
      description: 'Start tracking price for a hotel',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'checkIn', type: 'date', description: 'Check-in date', required: true },
        { name: 'checkOut', type: 'date', description: 'Check-out date', required: true },
        { name: 'targetPrice', type: 'number', description: 'Alert when price drops below', required: false },
        { name: 'notifyEmail', type: 'string', description: 'Email for alerts', required: false }
      ],
      handler: 'handlers/monitoring.trackPrice',
      isAsync: true,
      timeout: 15000
    },
    {
      name: 'get_price_history',
      description: 'Get historical price data',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'days', type: 'number', description: 'Number of days of history', required: false, default: 30 }
      ],
      handler: 'handlers/monitoring.getPriceHistory',
      isAsync: true,
      timeout: 10000
    },
    {
      name: 'analyze_price_trends',
      description: 'Analyze price trends and predict best booking time',
      parameters: [
        { name: 'hotelId', type: 'string', description: 'Hotel ID', required: true },
        { name: 'travelDates', type: 'object', description: 'Travel date range', required: true }
      ],
      handler: 'handlers/monitoring.analyzeTrends',
      isAsync: true,
      timeout: 20000
    }
  ]
};

// ========================================
// COMMUNICATION SKILLS
// ========================================

export const notificationSkill: BookingSkill = {
  id: 'notifications',
  name: 'Notifications',
  nameHe: 'התראות',
  description: 'Send booking confirmations and notifications',
  descriptionHe: 'שליחת אישורי הזמנה והתראות',
  category: 'communication',
  capabilities: ['email-notification', 'sms-notification'],
  isEnabled: true,
  priority: 7,
  icon: 'bell',
  requiredPermissions: ['notifications:send'],
  tools: [
    {
      name: 'send_confirmation_email',
      description: 'Send booking confirmation email',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'recipientEmail', type: 'string', description: 'Recipient email', required: true }
      ],
      handler: 'handlers/notifications.sendConfirmationEmail',
      isAsync: true,
      timeout: 15000
    },
    {
      name: 'send_sms',
      description: 'Send SMS notification',
      parameters: [
        { name: 'phoneNumber', type: 'string', description: 'Phone number (E.164)', required: true },
        { name: 'message', type: 'string', description: 'Message content', required: true }
      ],
      handler: 'handlers/notifications.sendSms',
      isAsync: true,
      timeout: 10000
    }
  ]
};

export const voiceSkill: BookingSkill = {
  id: 'voice',
  name: 'Voice Interaction',
  nameHe: 'אינטראקציה קולית',
  description: 'Handle voice calls with speech-to-text and text-to-speech',
  descriptionHe: 'טיפול בשיחות קוליות עם המרת דיבור לטקסט וטקסט לדיבור',
  category: 'communication',
  capabilities: ['voice-interaction', 'real-time-streaming'],
  isEnabled: true,
  priority: 8,
  icon: 'phone',
  requiredPermissions: ['voice:read', 'voice:write'],
  tools: [
    {
      name: 'initiate_call',
      description: 'Initiate outbound phone call',
      parameters: [
        { name: 'phoneNumber', type: 'string', description: 'Phone number (E.164)', required: true },
        { name: 'purpose', type: 'string', description: 'Call purpose', required: true },
        { name: 'language', type: 'string', description: 'Call language', required: false, default: 'he-IL' }
      ],
      handler: 'handlers/voice.initiateCall',
      isAsync: true,
      timeout: 120000
    },
    {
      name: 'transfer_to_agent',
      description: 'Transfer call to human agent',
      parameters: [
        { name: 'reason', type: 'string', description: 'Transfer reason', required: true },
        { name: 'queue', type: 'string', description: 'Target queue', required: false }
      ],
      handler: 'handlers/voice.transferToAgent',
      isAsync: true,
      timeout: 30000
    }
  ]
};

// ========================================
// SUPPORT SKILLS
// ========================================

export const customerSupportSkill: BookingSkill = {
  id: 'customer-support',
  name: 'Customer Support',
  nameHe: 'תמיכת לקוחות',
  description: 'Handle customer inquiries and complaints',
  descriptionHe: 'טיפול בפניות ותלונות לקוחות',
  category: 'support',
  capabilities: ['knowledge-base', 'handoff-to-human'],
  isEnabled: true,
  priority: 9,
  icon: 'headphones',
  requiredPermissions: ['support:read', 'support:write'],
  tools: [
    {
      name: 'search_faq',
      description: 'Search FAQ for answers',
      parameters: [
        { name: 'question', type: 'string', description: 'Customer question', required: true }
      ],
      handler: 'handlers/support.searchFaq',
      isAsync: true,
      timeout: 5000
    },
    {
      name: 'create_ticket',
      description: 'Create support ticket',
      parameters: [
        { name: 'subject', type: 'string', description: 'Ticket subject', required: true },
        { name: 'description', type: 'string', description: 'Issue description', required: true },
        { name: 'priority', type: 'string', description: 'Priority: low, medium, high', required: false, default: 'medium' }
      ],
      handler: 'handlers/support.createTicket',
      isAsync: true,
      timeout: 10000
    },
    {
      name: 'escalate_to_human',
      description: 'Escalate conversation to human agent',
      parameters: [
        { name: 'reason', type: 'string', description: 'Escalation reason', required: true },
        { name: 'urgency', type: 'string', description: 'Urgency level', required: false }
      ],
      handler: 'handlers/support.escalateToHuman',
      isAsync: true,
      timeout: 15000
    }
  ]
};

// ========================================
// PERSONALIZATION SKILLS
// ========================================

export const loyaltySkill: BookingSkill = {
  id: 'loyalty',
  name: 'Loyalty Program',
  nameHe: 'תוכנית נאמנות',
  description: 'Manage loyalty points and rewards',
  descriptionHe: 'ניהול נקודות נאמנות ותגמולים',
  category: 'personalization',
  capabilities: ['loyalty-points', 'analytics'],
  isEnabled: true,
  priority: 10,
  icon: 'star',
  requiredPermissions: ['loyalty:read', 'loyalty:write'],
  tools: [
    {
      name: 'get_loyalty_balance',
      description: 'Get loyalty points balance',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'handlers/loyalty.getBalance',
      isAsync: true,
      timeout: 5000
    },
    {
      name: 'redeem_points',
      description: 'Redeem loyalty points for rewards',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'points', type: 'number', description: 'Points to redeem', required: true },
        { name: 'rewardType', type: 'string', description: 'Reward type', required: true }
      ],
      handler: 'handlers/loyalty.redeemPoints',
      isAsync: true,
      timeout: 15000
    },
    {
      name: 'apply_discount',
      description: 'Apply member discount to booking',
      parameters: [
        { name: 'bookingId', type: 'string', description: 'Booking ID', required: true },
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'handlers/loyalty.applyDiscount',
      isAsync: true,
      timeout: 10000
    }
  ]
};

export const preferencesSkill: BookingSkill = {
  id: 'preferences',
  name: 'User Preferences',
  nameHe: 'העדפות משתמש',
  description: 'Learn and apply user preferences',
  descriptionHe: 'לימוד ויישום העדפות משתמש',
  category: 'personalization',
  capabilities: ['analytics'],
  isEnabled: true,
  priority: 11,
  icon: 'settings',
  requiredPermissions: ['user:read', 'user:write'],
  tools: [
    {
      name: 'get_preferences',
      description: 'Get user preferences',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true }
      ],
      handler: 'handlers/preferences.getPreferences',
      isAsync: true,
      timeout: 5000
    },
    {
      name: 'update_preferences',
      description: 'Update user preferences',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'preferences', type: 'object', description: 'Preferences to update', required: true }
      ],
      handler: 'handlers/preferences.updatePreferences',
      isAsync: true,
      timeout: 10000
    },
    {
      name: 'get_recommendations',
      description: 'Get personalized hotel recommendations',
      parameters: [
        { name: 'userId', type: 'string', description: 'User ID', required: true },
        { name: 'destination', type: 'string', description: 'Destination', required: true },
        { name: 'dates', type: 'object', description: 'Travel dates', required: true }
      ],
      handler: 'handlers/preferences.getRecommendations',
      isAsync: true,
      timeout: 15000
    }
  ]
};

// ========================================
// EXPORT ALL SKILLS
// ========================================

export const allSkills: BookingSkill[] = [
  // Search
  hotelSearchSkill,
  destinationSearchSkill,
  // Booking
  prebookSkill,
  bookingSkill,
  cancellationSkill,
  // Analysis
  priceMonitoringSkill,
  // Communication
  notificationSkill,
  voiceSkill,
  // Support
  customerSupportSkill,
  // Personalization
  loyaltySkill,
  preferencesSkill
];

export const getSkillById = (id: string): BookingSkill | undefined => {
  return allSkills.find(skill => skill.id === id);
};

export const getSkillsByCategory = (category: string): BookingSkill[] => {
  return allSkills.filter(skill => skill.category === category);
};

export const getEnabledSkills = (): BookingSkill[] => {
  return allSkills.filter(skill => skill.isEnabled);
};

export const getSkillsByCapability = (capability: string): BookingSkill[] => {
  return allSkills.filter(skill => 
    skill.capabilities.includes(capability as any)
  );
};
