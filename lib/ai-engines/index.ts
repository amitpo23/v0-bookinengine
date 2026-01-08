/**
 * AI Engines Module
 * Central export for the complete AI booking engines system
 */

// Core types
export * from './types';

// Skills library
export {
  hotelSearchSkill,
  hotelPrebookSkill,
  hotelBookingSkill,
  bookingCancellationSkill,
  priceMonitoringSkill,
  voiceInteractionSkill,
  smsIntegrationSkill,
  emailIntegrationSkill,
  webSearchSkill,
  knowledgeBaseSkill,
  marketAnalysisSkill,
  userPreferencesSkill,
  loyaltyProgramSkill,
  allSkills,
  getSkillById,
  getSkillsByCategory,
  getEnabledSkills
} from './skills';

// Engine templates
export {
  hotelBookingEngineTemplate,
  travelAgentEngineTemplate,
  conciergeEngineTemplate,
  voiceAgentEngineTemplate,
  priceMonitorEngineTemplate,
  supportAgentEngineTemplate,
  groupBookingEngineTemplate,
  orchestratorEngineTemplate,
  allTemplates,
  getTemplateById,
  getTemplateByType,
  getTemplatesByCapability,
  getAllTemplateTypes
} from './templates';

// Engine manager
export {
  AIEngineManager,
  getAIEngineManager,
  resetAIEngineManager
} from './engine-manager';

// Handlers
export * from './handlers';

/**
 * Quick start - get the engine manager singleton
 */
export const engineManager = {
  get instance() {
    const { getAIEngineManager } = require('./engine-manager');
    return getAIEngineManager();
  }
};

/**
 * Engine type shortcuts
 */
export const Engines = {
  HOTEL_BOOKING: 'hotel-booking' as const,
  TRAVEL_AGENT: 'travel-agent' as const,
  CONCIERGE: 'concierge' as const,
  VOICE_AGENT: 'voice-agent' as const,
  PRICE_MONITOR: 'price-monitor' as const,
  SUPPORT_AGENT: 'support-agent' as const,
  GROUP_BOOKING: 'group-booking' as const,
  MULTI_AGENT: 'multi-agent' as const,
  CUSTOM: 'custom' as const
};

/**
 * Capability shortcuts
 */
export const Capabilities = {
  SEARCH: 'search' as const,
  PREBOOK: 'prebook' as const,
  BOOKING: 'booking' as const,
  CANCELLATION: 'cancellation' as const,
  MODIFICATION: 'modification' as const,
  PRICE_MONITORING: 'price-monitoring' as const,
  VOICE_INTERACTION: 'voice-interaction' as const,
  REAL_TIME_STREAMING: 'real-time-streaming' as const,
  SMS_INTEGRATION: 'sms-integration' as const,
  EMAIL_INTEGRATION: 'email-integration' as const,
  WEB_SEARCH: 'web-search' as const,
  RAG_RETRIEVAL: 'rag-retrieval' as const,
  MULTI_AGENT: 'multi-agent' as const,
  KNOWLEDGE_BASE: 'knowledge-base' as const,
  ANALYTICS: 'analytics' as const,
  HANDOFF: 'handoff' as const
};

/**
 * Skill category shortcuts
 */
export const SkillCategories = {
  BOOKING: 'booking' as const,
  COMMUNICATION: 'communication' as const,
  RESEARCH: 'research' as const,
  ANALYSIS: 'analysis' as const,
  PERSONALIZATION: 'personalization' as const,
  AUTOMATION: 'automation' as const,
  INTEGRATION: 'integration' as const
};

/**
 * Version info
 */
export const AI_ENGINES_VERSION = '1.0.0';
export const AI_ENGINES_BUILD_DATE = new Date().toISOString();
