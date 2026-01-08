/**
 * Hotel Booking AI - Core Types
 * Complete type definitions for the Hotel Booking AI system
 */

// ========================================
// ENGINE TYPES
// ========================================

export type BookingEngineType = 
  | 'hotel-search'
  | 'hotel-booking'
  | 'price-monitor'
  | 'customer-support'
  | 'voice-agent'
  | 'concierge'
  | 'group-booking'
  | 'loyalty-manager';

// ========================================
// ENGINE INSTANCE (Runtime)
// ========================================

export interface EngineInstance {
  id: string;
  templateId: string;
  template: BookingEngineTemplate;
  status: 'active' | 'inactive' | 'maintenance' | 'draft';
  createdAt: string;
  lastActiveAt: string;
  userId?: string;
  metadata: Record<string, any>;
  metrics: EngineSessionMetrics;
}

export interface EngineSessionMetrics {
  messagesProcessed: number;
  toolsExecuted: number;
  avgResponseTime: number;
  errorCount: number;
  sessionDuration: number;
}

// ========================================
// TOOL RESULT
// ========================================

export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
  executionTime?: number;
}

export type EngineCapability =
  | 'search'
  | 'prebook'
  | 'booking'
  | 'cancellation'
  | 'modification'
  | 'price-tracking'
  | 'voice-interaction'
  | 'sms-notification'
  | 'email-notification'
  | 'knowledge-base'
  | 'rag-retrieval'
  | 'web-search'
  | 'multi-language'
  | 'real-time-streaming'
  | 'handoff-to-human'
  | 'analytics'
  | 'loyalty-points'
  | 'payment-processing';

export type SkillCategory =
  | 'booking'
  | 'search'
  | 'communication'
  | 'analysis'
  | 'support'
  | 'personalization'
  | 'payment';

// ========================================
// SKILL DEFINITION
// ========================================

export interface BookingSkill {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: SkillCategory;
  capabilities: EngineCapability[];
  tools: BookingTool[];
  isEnabled: boolean;
  priority: number;
  requiredPermissions: string[];
  icon?: string;
}

// ========================================
// TOOL DEFINITION (Function Calling)
// ========================================

export interface BookingTool {
  name: string;
  description: string;
  descriptionHe?: string;
  parameters: ToolParameter[];
  handler: string;
  isAsync: boolean;
  timeout?: number;
  retryConfig?: RetryConfig;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date';
  description: string;
  required: boolean;
  default?: any;
  enum?: string[];
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  format?: 'email' | 'phone' | 'date' | 'url' | 'currency';
}

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  exponentialBackoff: boolean;
}

// ========================================
// ENGINE TEMPLATE
// ========================================

export interface BookingEngineTemplate {
  id: string;
  type: BookingEngineType;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  version: string;
  icon: string;
  color: string;
  skills: BookingSkill[];
  capabilities: EngineCapability[];
  modelConfig: ModelConfig;
  persona: AgentPersona;
  prompts: EnginePrompts;
  config: EngineConfig;
  integrations?: IntegrationsConfig;
}

export interface ModelConfig {
  provider: 'openai' | 'groq' | 'anthropic' | 'azure' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AgentPersona {
  name: string;
  nameHe: string;
  role: string;
  roleHe: string;
  personality: string[];
  communicationStyle: string;
  expertise: string[];
  languages: string[];
  avatar?: string;
  voiceId?: string;
}

export interface EnginePrompts {
  systemPrompt: string;
  systemPromptHe?: string;
  greetingMessage: string;
  greetingMessageHe?: string;
  farewellMessage?: string;
  farewellMessageHe?: string;
  errorMessages: {
    noResults: string;
    bookingFailed: string;
    timeout: string;
    general: string;
  };
}

export interface EngineConfig {
  maxConversationTurns: number;
  contextWindowSize: number;
  enableMemory: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  responseTimeout: number;
  autoSave: boolean;
  enableVoice?: boolean;
  enableRAG?: boolean;
  ragConfig?: RAGConfig;
  voiceConfig?: VoiceConfig;
}

export interface RAGConfig {
  vectorStoreId?: string;
  chunkSize: number;
  topK: number;
  similarityThreshold: number;
  sources: string[];
}

export interface VoiceConfig {
  sttProvider: 'azure' | 'openai' | 'whisper';
  ttsProvider: 'azure' | 'openai' | 'elevenlabs';
  voiceId: string;
  language: string;
  prosodyRate: number;
}

export interface IntegrationsConfig {
  crm?: {
    enabled: boolean;
    provider: string;
    syncCustomers: boolean;
    syncBookings: boolean;
  };
  payment?: {
    enabled: boolean;
    provider: string;
    supportedMethods: string[];
  };
  analytics?: {
    enabled: boolean;
    provider: string;
    trackConversations: boolean;
    trackBookings: boolean;
  };
  hotelApi?: {
    enabled: boolean;
    provider: 'medici' | 'booking-com' | 'expedia' | 'custom';
    apiKey?: string;
    baseUrl?: string;
  };
}

// ========================================
// ENGINE INSTANCE
// ========================================

export interface BookingEngineInstance {
  instanceId: string;
  templateId: string;
  template: BookingEngineTemplate;
  name: string;
  status: 'active' | 'inactive' | 'maintenance' | 'draft';
  tools: BookingTool[];
  activeConversations: number;
  totalConversations: number;
  analytics: EngineAnalytics;
  createdAt: Date;
  updatedAt: Date;
  customConfig?: Partial<EngineConfig>;
}

export interface EngineAnalytics {
  totalConversations: number;
  totalBookings: number;
  conversionRate: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  revenueGenerated?: number;
}

// ========================================
// CONVERSATION TYPES (Simple Version for Engine Manager)
// ========================================

export interface ConversationContext {
  sessionId: string;
  engineType: string;
  history: ConversationMessage[];
  currentState: string;
  language: 'he' | 'en' | 'ar' | 'ru';
  userPreferences: Record<string, any>;
  metadata: Record<string, any>;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    parameters: Record<string, any>;
  }>;
}

// ========================================
// ADVANCED CONVERSATION TYPES
// ========================================

export interface AdvancedConversationContext {
  conversationId: string;
  engineInstanceId: string;
  userId?: string;
  sessionId: string;
  language: 'he' | 'en' | 'ar' | 'ru';
  startedAt: Date;
  lastActivityAt: Date;
  messageCount: number;
  currentState: ConversationStateAdvanced;
  extractedData: ExtractedBookingData;
  toolCalls: ToolCallRecord[];
  metadata: Record<string, any>;
}

export interface ConversationStateAdvanced {
  phase: 'greeting' | 'inquiry' | 'search' | 'selection' | 'prebook' | 'details' | 'payment' | 'confirmation' | 'farewell';
  intent?: BookingIntent;
  subIntent?: string;
  pendingActions: string[];
  waitingForUserInput: boolean;
}

export type BookingIntent =
  | 'new-booking'
  | 'modify-booking'
  | 'cancel-booking'
  | 'check-availability'
  | 'get-price'
  | 'track-price'
  | 'ask-question'
  | 'complaint'
  | 'loyalty-inquiry';

export interface ExtractedBookingData {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number[];
  rooms?: number;
  budget?: {
    min?: number;
    max?: number;
    currency: string;
  };
  preferences?: {
    starRating?: number[];
    amenities?: string[];
    location?: string;
    hotelType?: string;
  };
  selectedHotel?: {
    hotelId: string;
    hotelName: string;
    roomCode: string;
    roomName: string;
    price: number;
    currency: string;
  };
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  bookingConfirmation?: {
    bookingId: string;
    confirmationNumber: string;
    status: string;
    totalPaid: number;
  };
}

export interface AdvancedConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCallRecord[];
  metadata?: Record<string, any>;
}

export interface ToolCallRecord {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  result: any;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

// ========================================
// HANDOFF CONFIGURATION
// ========================================

export interface HandoffConfig {
  enabled: boolean;
  triggers: HandoffTrigger[];
  targetEngines: string[];
  transferMessage: string;
  transferMessageHe?: string;
}

export interface HandoffTrigger {
  type: 'keyword' | 'intent' | 'sentiment' | 'failure-count' | 'explicit-request' | 'timeout';
  value: string | number;
  priority: number;
  targetEngine?: string;
}

// ========================================
// API TYPES
// ========================================

export interface SearchHotelsRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  rooms?: number;
  filters?: {
    stars?: number[];
    maxPrice?: number;
    amenities?: string[];
    hotelType?: string;
  };
}

export interface HotelSearchResult {
  hotelId: string;
  name: string;
  stars: number;
  address: string;
  city: string;
  country: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  rooms: RoomOption[];
  amenities: string[];
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RoomOption {
  roomCode: string;
  roomName: string;
  boardType: string;
  price: number;
  originalPrice?: number;
  currency: string;
  cancellationPolicy: string;
  cancellationDeadline?: string;
  maxOccupancy: number;
  available: number;
  amenities?: string[];
  images?: string[];
}

export interface PrebookRequest {
  hotelId: string;
  roomCode: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children?: { age: number }[];
  };
}

export interface PrebookResponse {
  success: boolean;
  token: string;
  expiresAt: Date;
  pricing: {
    roomRate: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
  };
  cancellationPolicy: {
    freeCancellationUntil?: Date;
    penalties: { from: Date; amount: number }[];
  };
  hotelDetails: {
    hotelId: string;
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
  };
}

export interface BookingRequest {
  token: string;
  roomCode: string;
  customer: CustomerInfo;
  guests: GuestInfo[];
  specialRequests?: string;
  paymentMethod?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  isLeadGuest?: boolean;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'failed';
  hotelConfirmation?: string;
  totalPaid: number;
  currency: string;
  bookingDetails: {
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    guests: string[];
    specialRequests?: string;
  };
  paymentDetails: {
    method: string;
    last4?: string;
    transactionId: string;
  };
  cancellationPolicy: string;
}

// ========================================
// DASHBOARD TYPES
// ========================================

export interface DashboardStats {
  totalEngines: number;
  activeEngines: number;
  totalConversations: number;
  activeConversations: number;
  totalBookings: number;
  todayBookings: number;
  conversionRate: number;
  averageResponseTime: number;
  revenueToday?: number;
  revenueMonth?: number;
}

export interface EngineListItem {
  instanceId: string;
  templateId: string;
  name: string;
  nameHe: string;
  type: BookingEngineType;
  status: 'active' | 'inactive' | 'maintenance' | 'draft';
  activeConversations: number;
  totalConversations: number;
  toolCount: number;
  persona?: {
    name: string;
    nameHe: string;
    role: string;
    roleHe: string;
  };
}

export interface SkillListItem {
  id: string;
  name: string;
  nameHe: string;
  category: SkillCategory;
  capabilities: EngineCapability[];
  isEnabled: boolean;
  toolCount: number;
  tools: string[];
}
