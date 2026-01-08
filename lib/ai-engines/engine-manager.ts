/**
 * AI Engine Manager
 * Core orchestration layer for AI booking engines
 */

import type {
  AIEngineType,
  AIEngineTemplate,
  AIEngineInstance,
  ConversationContext,
  AISkill,
  AITool,
  HandoffConfig
} from './types';
import { allTemplates, getTemplateById, getTemplateByType } from './templates';
import { allSkills, getSkillById } from './skills';

// ========================================
// ENGINE INSTANCE MANAGEMENT
// ========================================

export class AIEngineManager {
  private engines: Map<string, AIEngineInstance> = new Map();
  private activeConversations: Map<string, ConversationContext> = new Map();
  private toolHandlers: Map<string, Function> = new Map();

  constructor() {
    this.initializeDefaultEngines();
  }

  /**
   * Initialize default engine instances from templates
   */
  private initializeDefaultEngines(): void {
    allTemplates.forEach(template => {
      const instance = this.createEngineInstance(template);
      this.engines.set(instance.instanceId, instance);
    });
    console.log(`[AIEngineManager] Initialized ${this.engines.size} engine instances`);
  }

  /**
   * Create an engine instance from a template
   */
  createEngineInstance(template: AIEngineTemplate, customConfig?: Partial<AIEngineTemplate>): AIEngineInstance {
    const mergedTemplate = { ...template, ...customConfig };
    
    // Collect all tools from skills
    const tools: AITool[] = [];
    mergedTemplate.skills.forEach(skill => {
      if (skill.isEnabled) {
        tools.push(...skill.tools);
      }
    });

    const instance: AIEngineInstance = {
      instanceId: `${mergedTemplate.id}-${Date.now()}`,
      template: mergedTemplate,
      status: 'active',
      createdAt: new Date(),
      activeConversations: 0,
      totalConversations: 0,
      tools,
      metadata: {
        version: mergedTemplate.version,
        templateId: mergedTemplate.id
      }
    };

    return instance;
  }

  /**
   * Get an engine instance by ID
   */
  getEngine(instanceId: string): AIEngineInstance | undefined {
    return this.engines.get(instanceId);
  }

  /**
   * Get all engine instances
   */
  getAllEngines(): AIEngineInstance[] {
    return Array.from(this.engines.values());
  }

  /**
   * Get engines by type
   */
  getEnginesByType(type: AIEngineType): AIEngineInstance[] {
    return Array.from(this.engines.values()).filter(
      engine => engine.template.type === type
    );
  }

  /**
   * Get active engines
   */
  getActiveEngines(): AIEngineInstance[] {
    return Array.from(this.engines.values()).filter(
      engine => engine.status === 'active'
    );
  }

  // ========================================
  // CONVERSATION MANAGEMENT
  // ========================================

  /**
   * Start a new conversation with an engine
   */
  startConversation(
    engineInstanceId: string,
    userId?: string,
    sessionId?: string,
    initialContext?: Record<string, any>
  ): ConversationContext | null {
    const engine = this.engines.get(engineInstanceId);
    if (!engine) {
      console.error(`[AIEngineManager] Engine not found: ${engineInstanceId}`);
      return null;
    }

    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const context: ConversationContext = {
      conversationId,
      engineInstanceId,
      userId,
      sessionId: sessionId || conversationId,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messageCount: 0,
      currentIntent: undefined,
      extractedEntities: {},
      bookingData: {},
      preferences: {},
      metadata: initialContext || {}
    };

    this.activeConversations.set(conversationId, context);
    engine.activeConversations++;
    engine.totalConversations++;

    console.log(`[AIEngineManager] Started conversation ${conversationId} with engine ${engine.template.name}`);
    return context;
  }

  /**
   * Get conversation context
   */
  getConversation(conversationId: string): ConversationContext | undefined {
    return this.activeConversations.get(conversationId);
  }

  /**
   * Update conversation context
   */
  updateConversation(
    conversationId: string,
    updates: Partial<ConversationContext>
  ): ConversationContext | null {
    const context = this.activeConversations.get(conversationId);
    if (!context) return null;

    const updated: ConversationContext = {
      ...context,
      ...updates,
      lastActivityAt: new Date()
    };

    this.activeConversations.set(conversationId, updated);
    return updated;
  }

  /**
   * End a conversation
   */
  endConversation(conversationId: string): void {
    const context = this.activeConversations.get(conversationId);
    if (!context) return;

    const engine = this.engines.get(context.engineInstanceId);
    if (engine) {
      engine.activeConversations = Math.max(0, engine.activeConversations - 1);
    }

    this.activeConversations.delete(conversationId);
    console.log(`[AIEngineManager] Ended conversation ${conversationId}`);
  }

  // ========================================
  // TOOL EXECUTION
  // ========================================

  /**
   * Register a tool handler
   */
  registerToolHandler(handlerPath: string, handler: Function): void {
    this.toolHandlers.set(handlerPath, handler);
  }

  /**
   * Execute a tool
   */
  async executeTool(
    toolName: string,
    parameters: Record<string, any>,
    context: ConversationContext
  ): Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }> {
    // Find the tool across all skills
    let tool: AITool | undefined;
    for (const skill of allSkills) {
      tool = skill.tools.find(t => t.name === toolName);
      if (tool) break;
    }

    if (!tool) {
      return { success: false, error: `Tool not found: ${toolName}` };
    }

    // Get handler
    const handler = this.toolHandlers.get(tool.handler);
    if (!handler) {
      console.warn(`[AIEngineManager] Handler not registered: ${tool.handler}`);
      // Return mock for now
      return {
        success: true,
        result: { message: `[Mock] Tool ${toolName} executed with params`, parameters }
      };
    }

    try {
      const result = await handler(parameters, context);
      return { success: true, result };
    } catch (error: any) {
      console.error(`[AIEngineManager] Tool execution error:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all available tools for an engine
   */
  getEngineTools(engineInstanceId: string): AITool[] {
    const engine = this.engines.get(engineInstanceId);
    if (!engine) return [];

    const tools: AITool[] = [];
    engine.template.skills.forEach(skill => {
      if (skill.isEnabled) {
        tools.push(...skill.tools);
      }
    });

    return tools;
  }

  /**
   * Format tools for LLM consumption (OpenAI function format)
   */
  formatToolsForLLM(engineInstanceId: string): any[] {
    const tools = this.getEngineTools(engineInstanceId);
    
    return tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: tool.parameters.reduce((acc, param) => {
            acc[param.name] = {
              type: param.type === 'date' ? 'string' : param.type,
              description: param.description
            };
            if (param.enum) {
              acc[param.name].enum = param.enum;
            }
            return acc;
          }, {} as Record<string, any>),
          required: tool.parameters
            .filter(p => p.required)
            .map(p => p.name)
        }
      }
    }));
  }

  // ========================================
  // HANDOFF MANAGEMENT
  // ========================================

  /**
   * Check if handoff should be triggered
   */
  shouldTriggerHandoff(
    message: string,
    context: ConversationContext
  ): { shouldHandoff: boolean; targetEngine?: string; reason?: string } {
    const engine = this.engines.get(context.engineInstanceId);
    if (!engine?.template.handoff?.enableHandoff) {
      return { shouldHandoff: false };
    }

    const handoff = engine.template.handoff;
    const lowerMessage = message.toLowerCase();

    // Check trigger phrases
    for (const trigger of handoff.handoffTriggers || []) {
      if (lowerMessage.includes(trigger.toLowerCase())) {
        // Determine target engine based on trigger
        const targetEngine = this.determineHandoffTarget(trigger, handoff);
        return {
          shouldHandoff: true,
          targetEngine,
          reason: `Triggered by phrase: "${trigger}"`
        };
      }
    }

    return { shouldHandoff: false };
  }

  /**
   * Determine which engine to hand off to
   */
  private determineHandoffTarget(trigger: string, handoff: HandoffConfig): string | undefined {
    const targetEngines = handoff.targetEngines || [];
    if (targetEngines.length === 0) return undefined;

    // Simple keyword matching for now
    const triggerLower = trigger.toLowerCase();
    
    if (triggerLower.includes('book') || triggerLower.includes('הזמנ')) {
      return targetEngines.find(e => e.includes('booking'));
    }
    if (triggerLower.includes('support') || triggerLower.includes('issue') || triggerLower.includes('problem')) {
      return targetEngines.find(e => e.includes('support'));
    }
    if (triggerLower.includes('group') || triggerLower.includes('corporate') || triggerLower.includes('קבוצ')) {
      return targetEngines.find(e => e.includes('group'));
    }
    if (triggerLower.includes('price') || triggerLower.includes('מחיר')) {
      return targetEngines.find(e => e.includes('price'));
    }

    return targetEngines[0];
  }

  /**
   * Execute handoff to another engine
   */
  async executeHandoff(
    conversationId: string,
    targetEngineId: string
  ): Promise<{
    success: boolean;
    newContext?: ConversationContext;
    handoffMessage?: string;
    error?: string;
  }> {
    const currentContext = this.activeConversations.get(conversationId);
    if (!currentContext) {
      return { success: false, error: 'Conversation not found' };
    }

    // Find target engine
    let targetEngine: AIEngineInstance | undefined;
    for (const engine of this.engines.values()) {
      if (engine.template.id === targetEngineId || engine.instanceId === targetEngineId) {
        targetEngine = engine;
        break;
      }
    }

    if (!targetEngine) {
      return { success: false, error: `Target engine not found: ${targetEngineId}` };
    }

    // Create new conversation with target engine, preserving context
    const newContext = this.startConversation(
      targetEngine.instanceId,
      currentContext.userId,
      currentContext.sessionId,
      {
        ...currentContext.metadata,
        handoffFrom: currentContext.engineInstanceId,
        previousContext: {
          extractedEntities: currentContext.extractedEntities,
          bookingData: currentContext.bookingData,
          preferences: currentContext.preferences
        }
      }
    );

    if (!newContext) {
      return { success: false, error: 'Failed to create new conversation' };
    }

    // Preserve extracted data
    newContext.extractedEntities = { ...currentContext.extractedEntities };
    newContext.bookingData = { ...currentContext.bookingData };
    newContext.preferences = { ...currentContext.preferences };

    // End old conversation
    this.endConversation(conversationId);

    const handoffMessage = targetEngine.template.handoff?.handoffMessage || 
      `I'm connecting you with our ${targetEngine.template.persona?.role || 'specialist'} who can better assist you.`;

    console.log(`[AIEngineManager] Handoff executed: ${currentContext.engineInstanceId} -> ${targetEngine.instanceId}`);

    return {
      success: true,
      newContext,
      handoffMessage
    };
  }

  // ========================================
  // ENGINE CONFIGURATION
  // ========================================

  /**
   * Update engine configuration
   */
  updateEngineConfig(
    instanceId: string,
    config: Partial<AIEngineTemplate>
  ): AIEngineInstance | null {
    const engine = this.engines.get(instanceId);
    if (!engine) return null;

    engine.template = { ...engine.template, ...config };
    engine.lastModified = new Date();

    return engine;
  }

  /**
   * Enable/disable a skill for an engine
   */
  toggleEngineSkill(instanceId: string, skillId: string, enabled: boolean): boolean {
    const engine = this.engines.get(instanceId);
    if (!engine) return false;

    const skill = engine.template.skills.find(s => s.id === skillId);
    if (!skill) return false;

    skill.isEnabled = enabled;
    engine.lastModified = new Date();

    return true;
  }

  /**
   * Add a skill to an engine
   */
  addSkillToEngine(instanceId: string, skillId: string): boolean {
    const engine = this.engines.get(instanceId);
    if (!engine) return false;

    const skill = getSkillById(skillId);
    if (!skill) return false;

    // Check if skill already exists
    if (engine.template.skills.some(s => s.id === skillId)) {
      return false;
    }

    engine.template.skills.push({ ...skill });
    engine.lastModified = new Date();

    return true;
  }

  /**
   * Set engine status
   */
  setEngineStatus(instanceId: string, status: 'active' | 'paused' | 'maintenance'): boolean {
    const engine = this.engines.get(instanceId);
    if (!engine) return false;

    engine.status = status;
    engine.lastModified = new Date();

    return true;
  }

  // ========================================
  // ANALYTICS & REPORTING
  // ========================================

  /**
   * Get engine statistics
   */
  getEngineStats(instanceId?: string): Record<string, any> {
    if (instanceId) {
      const engine = this.engines.get(instanceId);
      if (!engine) return {};

      return {
        instanceId: engine.instanceId,
        name: engine.template.name,
        type: engine.template.type,
        status: engine.status,
        activeConversations: engine.activeConversations,
        totalConversations: engine.totalConversations,
        skillCount: engine.template.skills.length,
        toolCount: engine.tools.length,
        createdAt: engine.createdAt,
        lastModified: engine.lastModified
      };
    }

    // Aggregate stats for all engines
    const engines = Array.from(this.engines.values());
    return {
      totalEngines: engines.length,
      activeEngines: engines.filter(e => e.status === 'active').length,
      totalActiveConversations: engines.reduce((sum, e) => sum + e.activeConversations, 0),
      totalConversations: engines.reduce((sum, e) => sum + e.totalConversations, 0),
      enginesByType: engines.reduce((acc, e) => {
        acc[e.template.type] = (acc[e.template.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * Get conversation analytics
   */
  getConversationAnalytics(timeRange?: { from: Date; to: Date }): Record<string, any> {
    const conversations = Array.from(this.activeConversations.values());

    // Filter by time range if provided
    let filtered = conversations;
    if (timeRange) {
      filtered = conversations.filter(c => 
        c.startedAt >= timeRange.from && c.startedAt <= timeRange.to
      );
    }

    return {
      activeConversations: filtered.length,
      averageMessageCount: filtered.reduce((sum, c) => sum + c.messageCount, 0) / filtered.length || 0,
      conversationsByEngine: filtered.reduce((acc, c) => {
        acc[c.engineInstanceId] = (acc[c.engineInstanceId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      intents: filtered.reduce((acc, c) => {
        if (c.currentIntent) {
          acc[c.currentIntent] = (acc[c.currentIntent] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// ========================================
// SINGLETON EXPORT
// ========================================

let managerInstance: AIEngineManager | null = null;

export function getAIEngineManager(): AIEngineManager {
  if (!managerInstance) {
    managerInstance = new AIEngineManager();
  }
  return managerInstance;
}

export function resetAIEngineManager(): void {
  managerInstance = null;
}
