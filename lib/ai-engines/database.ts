/**
 * AI Engines Database Service
 * Integration layer between AI engines and Supabase database
 */

import { supabase, supabaseAdmin } from '@/lib/supabase';

// ========================================
// TYPES
// ========================================

export interface DbAIEngine {
  id: string;
  instance_id: string;
  template_id: string;
  name: string;
  name_he?: string;
  description?: string;
  description_he?: string;
  engine_type: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  persona?: string;
  persona_he?: string;
  llm_provider: string;
  llm_model: string;
  temperature: number;
  max_tokens: number;
  capabilities: string[];
  enabled_skills: string[];
  custom_tools: any[];
  config: Record<string, any>;
  handoff_config: Record<string, any>;
  total_conversations: number;
  total_messages: number;
  avg_response_time_ms: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
  last_active_at?: string;
}

export interface DbConversation {
  id: string;
  conversation_id: string;
  engine_id: string;
  user_id?: string;
  member_id?: string;
  title?: string;
  language: string;
  status: 'active' | 'completed' | 'abandoned' | 'handoff';
  context: Record<string, any>;
  booking_intent?: Record<string, any>;
  search_context?: Record<string, any>;
  outcome?: string;
  booking_id?: string;
  satisfaction_rating?: number;
  message_count: number;
  tool_calls_count: number;
  started_at: string;
  last_message_at: string;
  ended_at?: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_name?: string;
  tool_input?: Record<string, any>;
  tool_output?: Record<string, any>;
  tokens_used: number;
  response_time_ms?: number;
  created_at: string;
}

export interface DbToolCall {
  id: string;
  conversation_id: string;
  message_id: string;
  tool_name: string;
  tool_input: Record<string, any>;
  tool_output?: Record<string, any>;
  status: 'pending' | 'success' | 'error' | 'timeout';
  error_message?: string;
  execution_time_ms?: number;
  retry_count: number;
  called_at: string;
  completed_at?: string;
}

export interface DbTemplate {
  id: string;
  template_id: string;
  name: string;
  name_he?: string;
  description?: string;
  description_he?: string;
  engine_type: string;
  persona: string;
  persona_he?: string;
  system_prompt?: string;
  system_prompt_he?: string;
  default_llm_provider: string;
  default_model: string;
  default_temperature: number;
  capabilities: string[];
  required_skills: string[];
  optional_skills: string[];
  is_public: boolean;
  is_featured: boolean;
  category?: string;
  tags: string[];
  created_by?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbSkill {
  id: string;
  skill_id: string;
  name: string;
  name_he?: string;
  description?: string;
  description_he?: string;
  category: string;
  tools: any[];
  is_enabled: boolean;
  is_public: boolean;
  priority: number;
  required_permissions: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ========================================
// ENGINE OPERATIONS
// ========================================

export class AIEngineDB {
  private client = supabaseAdmin || supabase;

  /**
   * Get all engines
   */
  async getAllEngines(): Promise<DbAIEngine[]> {
    if (!this.client) return [];
    
    const { data, error } = await this.client
      .from('ai_engines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AIEngineDB] Error fetching engines:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get engine by instance ID
   */
  async getEngineByInstanceId(instanceId: string): Promise<DbAIEngine | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engines')
      .select('*')
      .eq('instance_id', instanceId)
      .single();

    if (error) {
      console.error('[AIEngineDB] Error fetching engine:', error);
      return null;
    }

    return data;
  }

  /**
   * Get engines by type
   */
  async getEnginesByType(engineType: string): Promise<DbAIEngine[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engines')
      .select('*')
      .eq('engine_type', engineType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AIEngineDB] Error fetching engines by type:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new engine
   */
  async createEngine(engine: Omit<DbAIEngine, 'id' | 'created_at' | 'updated_at'>): Promise<DbAIEngine | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engines')
      .insert(engine)
      .select()
      .single();

    if (error) {
      console.error('[AIEngineDB] Error creating engine:', error);
      return null;
    }

    return data;
  }

  /**
   * Update engine
   */
  async updateEngine(instanceId: string, updates: Partial<DbAIEngine>): Promise<DbAIEngine | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engines')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('instance_id', instanceId)
      .select()
      .single();

    if (error) {
      console.error('[AIEngineDB] Error updating engine:', error);
      return null;
    }

    return data;
  }

  /**
   * Update engine status
   */
  async updateEngineStatus(instanceId: string, status: DbAIEngine['status']): Promise<boolean> {
    if (!this.client) return false;

    const { error } = await this.client
      .from('ai_engines')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('instance_id', instanceId);

    if (error) {
      console.error('[AIEngineDB] Error updating engine status:', error);
      return false;
    }

    return true;
  }

  /**
   * Delete engine
   */
  async deleteEngine(instanceId: string): Promise<boolean> {
    if (!this.client) return false;

    const { error } = await this.client
      .from('ai_engines')
      .delete()
      .eq('instance_id', instanceId);

    if (error) {
      console.error('[AIEngineDB] Error deleting engine:', error);
      return false;
    }

    return true;
  }

  /**
   * Get active engines count
   */
  async getActiveEnginesCount(): Promise<number> {
    if (!this.client) return 0;

    const { count, error } = await this.client
      .from('ai_engines')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      console.error('[AIEngineDB] Error counting engines:', error);
      return 0;
    }

    return count || 0;
  }
}

// ========================================
// CONVERSATION OPERATIONS
// ========================================

export class ConversationDB {
  private client = supabaseAdmin || supabase;

  /**
   * Create a new conversation
   */
  async createConversation(
    engineId: string,
    userId?: string,
    context?: Record<string, any>
  ): Promise<DbConversation | null> {
    if (!this.client) return null;

    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await this.client
      .from('ai_engine_conversations')
      .insert({
        conversation_id: conversationId,
        engine_id: engineId,
        user_id: userId,
        context: context || {},
        status: 'active',
        message_count: 0,
        tool_calls_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('[ConversationDB] Error creating conversation:', error);
      return null;
    }

    return data;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<DbConversation | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engine_conversations')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();

    if (error) {
      console.error('[ConversationDB] Error fetching conversation:', error);
      return null;
    }

    return data;
  }

  /**
   * Get conversations for engine
   */
  async getEngineConversations(engineId: string, limit = 50): Promise<DbConversation[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engine_conversations')
      .select('*')
      .eq('engine_id', engineId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[ConversationDB] Error fetching conversations:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId: string, limit = 50): Promise<DbConversation[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engine_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[ConversationDB] Error fetching user conversations:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update conversation
   */
  async updateConversation(
    conversationId: string,
    updates: Partial<DbConversation>
  ): Promise<DbConversation | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engine_conversations')
      .update(updates)
      .eq('conversation_id', conversationId)
      .select()
      .single();

    if (error) {
      console.error('[ConversationDB] Error updating conversation:', error);
      return null;
    }

    return data;
  }

  /**
   * End conversation
   */
  async endConversation(
    conversationId: string,
    outcome?: string,
    satisfactionRating?: number
  ): Promise<boolean> {
    if (!this.client) return false;

    const { error } = await this.client
      .from('ai_engine_conversations')
      .update({
        status: 'completed',
        outcome,
        satisfaction_rating: satisfactionRating,
        ended_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId);

    if (error) {
      console.error('[ConversationDB] Error ending conversation:', error);
      return false;
    }

    return true;
  }

  /**
   * Get active conversations count
   */
  async getActiveConversationsCount(engineId?: string): Promise<number> {
    if (!this.client) return 0;

    let query = this.client
      .from('ai_engine_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (engineId) {
      query = query.eq('engine_id', engineId);
    }

    const { count, error } = await query;

    if (error) {
      console.error('[ConversationDB] Error counting conversations:', error);
      return 0;
    }

    return count || 0;
  }
}

// ========================================
// MESSAGE OPERATIONS
// ========================================

export class MessageDB {
  private client = supabaseAdmin || supabase;

  /**
   * Add message to conversation
   */
  async addMessage(
    conversationId: string,
    role: DbMessage['role'],
    content: string,
    metadata?: {
      toolName?: string;
      toolInput?: Record<string, any>;
      toolOutput?: Record<string, any>;
      tokensUsed?: number;
      responseTimeMs?: number;
    }
  ): Promise<DbMessage | null> {
    if (!this.client) return null;

    // First get the conversation UUID from conversation_id
    const { data: conv } = await this.client
      .from('ai_engine_conversations')
      .select('id')
      .eq('conversation_id', conversationId)
      .single();

    if (!conv) {
      console.error('[MessageDB] Conversation not found:', conversationId);
      return null;
    }

    const { data, error } = await this.client
      .from('ai_engine_messages')
      .insert({
        conversation_id: conv.id,
        role,
        content,
        tool_name: metadata?.toolName,
        tool_input: metadata?.toolInput,
        tool_output: metadata?.toolOutput,
        tokens_used: metadata?.tokensUsed || 0,
        response_time_ms: metadata?.responseTimeMs
      })
      .select()
      .single();

    if (error) {
      console.error('[MessageDB] Error adding message:', error);
      return null;
    }

    return data;
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(conversationId: string): Promise<DbMessage[]> {
    if (!this.client) return [];

    // First get the conversation UUID
    const { data: conv } = await this.client
      .from('ai_engine_conversations')
      .select('id')
      .eq('conversation_id', conversationId)
      .single();

    if (!conv) {
      return [];
    }

    const { data, error } = await this.client
      .from('ai_engine_messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[MessageDB] Error fetching messages:', error);
      return [];
    }

    return data || [];
  }
}

// ========================================
// ANALYTICS OPERATIONS
// ========================================

export class AnalyticsDB {
  private client = supabaseAdmin || supabase;

  /**
   * Get engine stats summary
   */
  async getEngineStats(engineId?: string): Promise<{
    totalEngines: number;
    activeEngines: number;
    totalConversations: number;
    activeConversations: number;
    totalMessages: number;
    avgSatisfaction: number;
  }> {
    if (!this.client) {
      return {
        totalEngines: 0,
        activeEngines: 0,
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        avgSatisfaction: 0
      };
    }

    // Get engine counts
    const { count: totalEngines } = await this.client
      .from('ai_engines')
      .select('*', { count: 'exact', head: true });

    const { count: activeEngines } = await this.client
      .from('ai_engines')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get conversation counts
    let convQuery = this.client
      .from('ai_engine_conversations')
      .select('*', { count: 'exact', head: true });
    
    if (engineId) {
      convQuery = convQuery.eq('engine_id', engineId);
    }
    
    const { count: totalConversations } = await convQuery;

    let activeConvQuery = this.client
      .from('ai_engine_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (engineId) {
      activeConvQuery = activeConvQuery.eq('engine_id', engineId);
    }
    
    const { count: activeConversations } = await activeConvQuery;

    // Get message count from engines
    const { data: engines } = await this.client
      .from('ai_engines')
      .select('total_messages');
    
    const totalMessages = engines?.reduce((sum, e) => sum + (e.total_messages || 0), 0) || 0;

    // Get average satisfaction
    const { data: ratings } = await this.client
      .from('ai_engine_conversations')
      .select('satisfaction_rating')
      .not('satisfaction_rating', 'is', null);

    const avgSatisfaction = ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.satisfaction_rating, 0) / ratings.length
      : 0;

    return {
      totalEngines: totalEngines || 0,
      activeEngines: activeEngines || 0,
      totalConversations: totalConversations || 0,
      activeConversations: activeConversations || 0,
      totalMessages,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10
    };
  }

  /**
   * Get daily stats for an engine
   */
  async getDailyStats(engineId: string, days = 7): Promise<Array<{
    date: string;
    conversations: number;
    messages: number;
    bookings: number;
  }>> {
    if (!this.client) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await this.client
      .from('ai_engine_analytics')
      .select('*')
      .eq('engine_id', engineId)
      .eq('period_type', 'daily')
      .gte('period_start', startDate.toISOString())
      .order('period_start', { ascending: true });

    if (error) {
      console.error('[AnalyticsDB] Error fetching daily stats:', error);
      return [];
    }

    return (data || []).map(d => ({
      date: d.period_start.split('T')[0],
      conversations: d.total_conversations,
      messages: d.total_messages,
      bookings: d.total_bookings
    }));
  }
}

// ========================================
// TEMPLATE & SKILL OPERATIONS
// ========================================

export class TemplateDB {
  private client = supabaseAdmin || supabase;

  /**
   * Get all public templates
   */
  async getPublicTemplates(): Promise<DbTemplate[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engine_templates')
      .select('*')
      .eq('is_public', true)
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('[TemplateDB] Error fetching templates:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<DbTemplate | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('ai_engine_templates')
      .select('*')
      .eq('template_id', templateId)
      .single();

    if (error) {
      console.error('[TemplateDB] Error fetching template:', error);
      return null;
    }

    return data;
  }
}

export class SkillDB {
  private client = supabaseAdmin || supabase;

  /**
   * Get all enabled skills
   */
  async getEnabledSkills(): Promise<DbSkill[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engine_skills')
      .select('*')
      .eq('is_enabled', true)
      .order('priority', { ascending: true });

    if (error) {
      console.error('[SkillDB] Error fetching skills:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get skills by category
   */
  async getSkillsByCategory(category: string): Promise<DbSkill[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('ai_engine_skills')
      .select('*')
      .eq('category', category)
      .eq('is_enabled', true)
      .order('priority', { ascending: true });

    if (error) {
      console.error('[SkillDB] Error fetching skills by category:', error);
      return [];
    }

    return data || [];
  }
}

// ========================================
// SINGLETON INSTANCES
// ========================================

let engineDB: AIEngineDB | null = null;
let conversationDB: ConversationDB | null = null;
let messageDB: MessageDB | null = null;
let analyticsDB: AnalyticsDB | null = null;
let templateDB: TemplateDB | null = null;
let skillDB: SkillDB | null = null;

export function getEngineDB(): AIEngineDB {
  if (!engineDB) {
    engineDB = new AIEngineDB();
  }
  return engineDB;
}

export function getConversationDB(): ConversationDB {
  if (!conversationDB) {
    conversationDB = new ConversationDB();
  }
  return conversationDB;
}

export function getMessageDB(): MessageDB {
  if (!messageDB) {
    messageDB = new MessageDB();
  }
  return messageDB;
}

export function getAnalyticsDB(): AnalyticsDB {
  if (!analyticsDB) {
    analyticsDB = new AnalyticsDB();
  }
  return analyticsDB;
}

export function getTemplateDB(): TemplateDB {
  if (!templateDB) {
    templateDB = new TemplateDB();
  }
  return templateDB;
}

export function getSkillDB(): SkillDB {
  if (!skillDB) {
    skillDB = new SkillDB();
  }
  return skillDB;
}

// Export all DB instances
export const db = {
  get engines() { return getEngineDB(); },
  get conversations() { return getConversationDB(); },
  get messages() { return getMessageDB(); },
  get analytics() { return getAnalyticsDB(); },
  get templates() { return getTemplateDB(); },
  get skills() { return getSkillDB(); }
};
