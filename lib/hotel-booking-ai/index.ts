/**
 * Hotel Booking AI - Main Index
 * Central export for all Hotel Booking AI functionality
 */

// Types (explicitly export to avoid conflicts)
export type {
  BookingEngineType,
  EngineInstance,
  EngineSessionMetrics,
  ToolResult,
  EngineCapability,
  SkillCategory,
  BookingSkill,
  BookingTool,
  ToolParameter,
  BookingEngineTemplate,
  ModelConfig,
  AgentPersona,
  EnginePrompts,
  EngineConfig,
  ConversationContext,
  ConversationMessage,
  BookingIntent,
  ExtractedBookingData
} from './types';

// Skills
export * from './skills';

// Templates
export * from './templates';

// Handlers (importing registers them)
import './handlers';

// Re-export convenience functions
export {
  createEngine,
  getEngine,
  destroyEngine,
  listEngines,
  chat,
  getGreeting,
  clearHistory,
  getAvailableTemplates,
  getTemplate,
  getDashboardStats,
  registerToolHandler,
  executeTool,
  getToolsForEngine,
  getConversationContext
} from './engine-manager';

// Export types from engine-manager
export type { CreateEngineOptions, ChatOptions, ChatResponse } from './engine-manager';

export {
  allTemplates,
  getTemplateById,
  getTemplateByType,
  getTemplatesByCapability,
  hotelBookingAgentTemplate,
  priceMonitorAgentTemplate,
  customerSupportAgentTemplate,
  voiceBookingAgentTemplate,
  conciergeAgentTemplate,
  groupBookingAgentTemplate,
  loyaltyManagerAgentTemplate
} from './templates';

export {
  allSkills,
  getSkillById,
  getSkillsByCategory,
  hotelSearchSkill,
  destinationSearchSkill,
  prebookSkill,
  bookingSkill,
  cancellationSkill,
  priceMonitoringSkill,
  notificationSkill,
  voiceSkill,
  customerSupportSkill,
  loyaltySkill,
  preferencesSkill
} from './skills';
