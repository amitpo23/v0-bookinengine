/**
 * MCP Hotel Booking Tool
 * Model Context Protocol server for hotel booking operations
 * Provides real-time tool updates and progress streaming
 */

import type { 
  ConversationContext, 
  ToolResult, 
  BookingTool 
} from '@/lib/hotel-booking-ai/types';
import { allSkills } from '@/lib/hotel-booking-ai/skills';
import { executeTool, registerToolHandler } from '@/lib/hotel-booking-ai/engine-manager';

// ========================================
// MCP TOOL TYPES
// ========================================

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: string;
}

export interface McpToolInput {
  tool: string;
  parameters: Record<string, any>;
  sessionId?: string;
  userId?: string;
}

export interface McpToolOutput {
  success: boolean;
  data: any;
  error?: string;
  executionTime?: number;
  toolVersion?: string;
}

export interface ProgressEvent {
  type: 'progress' | 'complete' | 'error';
  tool: string;
  step: string;
  progress?: number;
  message?: string;
  data?: any;
  timestamp: string;
}

// ========================================
// MCP HOTEL BOOKING TOOL CLASS
// ========================================

export class McpHotelBookingTool {
  private tools: Map<string, McpToolDefinition> = new Map();
  private version = '1.0.0';
  private lastUpdated = new Date().toISOString();
  private progressListeners: Map<string, ((event: ProgressEvent) => void)[]> = new Map();

  constructor() {
    this.initializeTools();
  }

  /**
   * Initialize tools from skills definitions
   */
  private initializeTools(): void {
    for (const skill of allSkills) {
      for (const tool of skill.tools) {
        const mcpTool: McpToolDefinition = {
          name: tool.name,
          description: tool.description,
          inputSchema: this.convertToJsonSchema(tool.parameters),
          handler: tool.handler
        };
        this.tools.set(tool.name, mcpTool);
      }
    }
    
    console.log(`[MCP] Initialized ${this.tools.size} hotel booking tools`);
  }

  /**
   * Convert tool parameters to JSON Schema format
   */
  private convertToJsonSchema(parameters: BookingTool['parameters']): Record<string, any> {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const param of parameters) {
      properties[param.name] = {
        type: param.type,
        description: param.description
      };
      
      if (param.enum) {
        properties[param.name].enum = param.enum;
      }
      
      if (param.default !== undefined) {
        properties[param.name].default = param.default;
      }

      if (param.required) {
        required.push(param.name);
      }
    }

    return {
      type: 'object',
      properties,
      required
    };
  }

  /**
   * Get all available tools (for MCP discovery)
   */
  getTools(): McpToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get a specific tool by name
   */
  getTool(name: string): McpToolDefinition | undefined {
    return this.tools.get(name);
  }

  /**
   * Register a progress listener for real-time updates
   */
  onProgress(sessionId: string, listener: (event: ProgressEvent) => void): () => void {
    if (!this.progressListeners.has(sessionId)) {
      this.progressListeners.set(sessionId, []);
    }
    this.progressListeners.get(sessionId)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.progressListeners.get(sessionId);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  /**
   * Emit progress event to listeners
   */
  private emitProgress(sessionId: string, event: Omit<ProgressEvent, 'timestamp'>): void {
    const fullEvent: ProgressEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    const listeners = this.progressListeners.get(sessionId) || [];
    for (const listener of listeners) {
      try {
        listener(fullEvent);
      } catch (err) {
        console.error('[MCP] Progress listener error:', err);
      }
    }
  }

  /**
   * Execute a tool with progress tracking
   */
  async execute(input: McpToolInput): Promise<McpToolOutput> {
    const startTime = Date.now();
    const { tool, parameters, sessionId = 'default', userId } = input;

    // Validate tool exists
    const toolDef = this.tools.get(tool);
    if (!toolDef) {
      return {
        success: false,
        data: null,
        error: `Tool not found: ${tool}`,
        toolVersion: this.version
      };
    }

    // Create context for tool execution
    const context: ConversationContext = {
      sessionId,
      engineType: 'mcp',
      history: [],
      currentState: 'executing',
      language: 'en',
      userPreferences: {},
      metadata: { userId, source: 'mcp' }
    };

    try {
      // Emit progress: starting
      this.emitProgress(sessionId, {
        type: 'progress',
        tool,
        step: 'starting',
        progress: 0,
        message: `Starting ${tool}...`
      });

      // Execute the tool
      const result = await executeTool(tool, parameters, context);

      // Emit progress: complete
      this.emitProgress(sessionId, {
        type: 'complete',
        tool,
        step: 'done',
        progress: 100,
        message: `Completed ${tool}`,
        data: result.success ? result.data : null
      });

      return {
        success: result.success,
        data: result.data,
        error: result.error,
        executionTime: Date.now() - startTime,
        toolVersion: this.version
      };
    } catch (error: any) {
      // Emit progress: error
      this.emitProgress(sessionId, {
        type: 'error',
        tool,
        step: 'failed',
        message: error.message || 'Tool execution failed'
      });

      return {
        success: false,
        data: null,
        error: error.message || 'Tool execution failed',
        executionTime: Date.now() - startTime,
        toolVersion: this.version
      };
    }
  }

  /**
   * Execute multiple tools in parallel with progress tracking
   */
  async executeParallel(inputs: McpToolInput[]): Promise<McpToolOutput[]> {
    const sessionId = inputs[0]?.sessionId || 'default';
    
    this.emitProgress(sessionId, {
      type: 'progress',
      tool: 'batch',
      step: 'starting',
      progress: 0,
      message: `Executing ${inputs.length} tools in parallel...`
    });

    const results = await Promise.all(
      inputs.map((input, index) => 
        this.execute(input).then(result => {
          this.emitProgress(sessionId, {
            type: 'progress',
            tool: 'batch',
            step: `completed-${index + 1}`,
            progress: Math.round(((index + 1) / inputs.length) * 100),
            message: `Completed ${input.tool} (${index + 1}/${inputs.length})`
          });
          return result;
        })
      )
    );

    this.emitProgress(sessionId, {
      type: 'complete',
      tool: 'batch',
      step: 'done',
      progress: 100,
      message: `All ${inputs.length} tools completed`
    });

    return results;
  }

  /**
   * Hot-reload tools (for MCP server updates)
   */
  reloadTools(): void {
    this.tools.clear();
    this.initializeTools();
    this.lastUpdated = new Date().toISOString();
    console.log(`[MCP] Tools reloaded at ${this.lastUpdated}`);
  }

  /**
   * Get server info
   */
  getServerInfo() {
    return {
      name: 'hotel-booking-ai',
      version: this.version,
      toolCount: this.tools.size,
      lastUpdated: this.lastUpdated,
      capabilities: [
        'tool-execution',
        'parallel-execution',
        'progress-streaming',
        'hot-reload'
      ]
    };
  }
}

// ========================================
// SINGLETON EXPORT
// ========================================

export const mcpHotelBookingTool = new McpHotelBookingTool();

// ========================================
// RBAC SCOPES
// ========================================

export const MCP_BOOKING_SCOPES = {
  SEARCH: 'mcp:booking:search',
  PREBOOK: 'mcp:booking:prebook',
  BOOK: 'mcp:booking:book',
  CANCEL: 'mcp:booking:cancel',
  PRICE_MONITOR: 'mcp:booking:price_monitor',
  LOYALTY: 'mcp:booking:loyalty',
  NOTIFICATIONS: 'mcp:booking:notifications',
  VOICE: 'mcp:booking:voice'
} as const;

// ========================================
// RBAC CONSTRAINTS
// ========================================

export const MCP_BOOKING_CONSTRAINTS = {
  mcp_booking: {
    enabled: true,
    default_mode: 'search_only' as const,
    allowed_operations: ['search', 'prebook', 'book', 'cancel', 'lookup'],
    require_customer_verification: true,
    max_parallel_tools: 5,
    timeout_ms: 30000,
    audit_every_operation: true
  }
};
