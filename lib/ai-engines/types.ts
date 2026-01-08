/**
 * AI Booking Engines - Core Types
 * Based on capabilities from GitHub repositories:
 * - ai-travel-agent-platform
 * - hotel-price-monitor
 * - call-center-ai
 * - openai-agents-python
 * - skills
 */

// Engine Types
export type AIEngineType = 
  | 'hotel-booking'
  | 'flight-booking'
  | 'travel-agent'
  | 'concierge'
  | 'price-monitor'
  | 'voice-agent'
  | 'multi-modal'
  | 'research-agent'
  | 'custom';

export type EngineCapability =
  | 'search'
  | 'booking'
  | 'prebook'
  | 'cancellation'
  | 'price-monitoring'
  | 'voice-interaction'
  | 'sms-integration'
  | 'email-integration'
  | 'knowledge-base'
  | 'rag-retrieval'
  | 'web-search'
  | 'image-generation'
  | 'multi-language'
  | 'real-time-streaming'
  | 'handoff-to-human'
  | 'analytics';

export type SkillCategory =
  | 'booking'
  | 'communication'
  | 'research'
  | 'analysis'
  | 'automation'
  | 'integration'
  | 'personalization';

// Skill Definition
export interface AISkill {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: SkillCategory;
  capabilities: EngineCapability[];
  tools: AITool[];
  isEnabled: boolean;
  priority: number;
  requiredPermissions: string[];
}

// Tool Definition (Function Calling)
export interface AITool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: string; // Function path
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
  format?: 'email' | 'phone' | 'date' | 'url';
}

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  exponentialBackoff: boolean;
}

// Engine Template
export interface AIEngineTemplate {
  id: string;
  type: AIEngineType;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  color: string;
  defaultSkills: string[];
  defaultModel: ModelConfig;
  persona: AgentPersona;
  prompts: EnginePrompts;
  config: EngineConfig;
}

export interface ModelConfig {
  provider: 'openai' | 'groq' | 'anthropic' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AgentPersona {
  name: string;
  role: string;
  personality: string;
  tone: 'professional' | 'friendly' | 'casual' | 'formal';
  languages: string[];
  avatar?: string;
  voiceId?: string;
}

export interface EnginePrompts {
  system: string;
  greeting: string;
  farewell: string;
  error: string;
  waiting: string;
  transferToHuman: string;
  customPrompts?: Record<string, string>;
}

export interface EngineConfig {
  maxTurns: number;
  timeoutMs: number;
  enableStreaming: boolean;
  enableVoice: boolean;
  enableRAG: boolean;
  ragConfig?: RAGConfig;
  voiceConfig?: VoiceConfig;
  integrations: IntegrationConfig[];
}

export interface RAGConfig {
  vectorStoreId?: string;
  chunkSize: number;
  topK: number;
  similarityThreshold: number;
}

export interface VoiceConfig {
  sttProvider: 'azure' | 'openai' | 'whisper';
  ttsProvider: 'azure' | 'openai' | 'elevenlabs';
  voiceId: string;
  language: string;
  prosodyRate: number;
}

export interface IntegrationConfig {
  type: 'medici' | 'booking-com' | 'stripe' | 'twilio' | 'sendgrid' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
}

// Engine Instance
export interface AIEngineInstance {
  id: string;
  templateId: string;
  name: string;
  status: 'active' | 'inactive' | 'draft';
  skills: AISkill[];
  customConfig: Partial<EngineConfig>;
  analytics: EngineAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngineAnalytics {
  totalConversations: number;
  totalBookings: number;
  conversionRate: number;
  averageResponseTime: number;
  customerSatisfaction: number;
}

// Conversation Context
export interface ConversationContext {
  engineId: string;
  sessionId: string;
  userId?: string;
  language: string;
  messages: ConversationMessage[];
  currentState: ConversationState;
  extractedData: Record<string, any>;
  toolCalls: ToolCallRecord[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ConversationState {
  phase: 'greeting' | 'inquiry' | 'search' | 'selection' | 'booking' | 'confirmation' | 'farewell';
  intent?: string;
  entities: Record<string, any>;
  pendingActions: string[];
}

export interface ToolCallRecord {
  toolName: string;
  arguments: Record<string, any>;
  result: any;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

// Handoff Configuration
export interface HandoffConfig {
  enabled: boolean;
  triggers: HandoffTrigger[];
  targetAgent: string;
  transferMessage: string;
}

export interface HandoffTrigger {
  type: 'keyword' | 'intent' | 'sentiment' | 'failure-count' | 'explicit-request';
  value: string | number;
  priority: number;
}
