// =====================================
// RBAC Configuration
// =====================================

export type Role = "admin" | "booker"

export type Scope =
  | "audit:read"
  | "audit:write"
  | "tools:list"
  | "llm:invoke"
  | "llm:analysis"
  | "llm:invoke:booking"
  | "mcp:sql:connect"
  | "mcp:sql:read"
  | "mcp:sql:write"
  | "booking:search"
  | "booking:quote"
  | "booking:book"
  | "booking:cancel"
  | "booking:my_orders:read"
  | "endpoints:*"

export type Capability =
  | "CAP_AUDIT_VIEW"
  | "CAP_AUDIT_EXPORT"
  | "CAP_TOOLS_LIST"
  | "CAP_LLM_GENERAL"
  | "CAP_LLM_ANALYSIS_FORECAST"
  | "CAP_LLM_BOOKING_ASSISTANT"
  | "CAP_MCP_SQL_READ"
  | "CAP_MCP_SQL_WRITE"
  | "CAP_ENDPOINTS_ALL"
  | "CAP_BOOKING_SEARCH"
  | "CAP_BOOKING_QUOTE"
  | "CAP_BOOKING_BOOK"
  | "CAP_BOOKING_CANCEL"
  | "CAP_BOOKING_MY_ORDERS_READ"

export interface RoleConfig {
  description: string
  scopes: Scope[]
  capabilities: Capability[]
  constraints: {
    mcp_sql?: {
      enabled?: boolean
      default_mode?: "read_only" | "read_write"
      allow_write_if?: string
      enforce_limit_on_select?: boolean
      default_select_limit?: number
      statement_timeout_ms?: number
      block_multi_statement?: boolean
      allow_schemas?: string[]
      deny_tables?: string[]
      audit_every_query?: boolean
      redact_result_values?: boolean
    }
    llm?: {
      provider: string
      allowed_modes: string[]
      deny_tools?: string[]
      redact_secrets_in_payload?: boolean
      log_requests?: boolean
      log_responses?: boolean
    }
    endpoints?: {
      access: "allow_all" | "allow_list_only"
      allow_list?: string[]
      deny_list?: string[]
    }
  }
}

export interface EndpointCapability {
  description: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  required_scopes_any: Scope[]
  requires_safe_sql?: boolean
  audit: boolean
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  admin: {
    description:
      "Full access: all project endpoints, Groq LLM (analysis + operations), and MCP SQL (read by default, write optionally).",
    scopes: [
      "audit:read",
      "audit:write",
      "tools:list",
      "llm:invoke",
      "llm:analysis",
      "mcp:sql:connect",
      "mcp:sql:read",
      "mcp:sql:write",
      "endpoints:*",
    ],
    capabilities: [
      "CAP_AUDIT_VIEW",
      "CAP_AUDIT_EXPORT",
      "CAP_TOOLS_LIST",
      "CAP_LLM_GENERAL",
      "CAP_LLM_ANALYSIS_FORECAST",
      "CAP_MCP_SQL_READ",
      "CAP_MCP_SQL_WRITE",
      "CAP_ENDPOINTS_ALL",
    ],
    constraints: {
      mcp_sql: {
        default_mode: "read_only",
        allow_write_if: "user.flags.sql_write_enabled == true",
        enforce_limit_on_select: true,
        default_select_limit: 500,
        statement_timeout_ms: 15000,
        block_multi_statement: true,
        allow_schemas: ["public"],
        deny_tables: ["secrets", "api_keys", "tokens", "users_private", "payment_methods"],
        audit_every_query: true,
        redact_result_values: false,
      },
      llm: {
        provider: "groq",
        allowed_modes: ["assistant", "analysis", "forecast"],
        redact_secrets_in_payload: true,
        log_requests: true,
        log_responses: true,
      },
      endpoints: {
        access: "allow_all",
        deny_list: [],
      },
    },
  },
  booker: {
    description: "Low permission: hotel booking only. No SQL/MCP access. Limited LLM only for booking assistance.",
    scopes: [
      "tools:list",
      "llm:invoke:booking",
      "booking:search",
      "booking:quote",
      "booking:book",
      "booking:cancel",
      "booking:my_orders:read",
    ],
    capabilities: [
      "CAP_TOOLS_LIST",
      "CAP_LLM_BOOKING_ASSISTANT",
      "CAP_BOOKING_SEARCH",
      "CAP_BOOKING_QUOTE",
      "CAP_BOOKING_BOOK",
      "CAP_BOOKING_CANCEL",
      "CAP_BOOKING_MY_ORDERS_READ",
    ],
    constraints: {
      mcp_sql: {
        enabled: false,
      },
      llm: {
        provider: "groq",
        allowed_modes: ["booking_assistant"],
        deny_tools: ["SQL_TOOL", "ADMIN_ACTIONS", "BULK_ACTIONS", "FORECASTING"],
        redact_secrets_in_payload: true,
        log_requests: true,
        log_responses: true,
      },
      endpoints: {
        access: "allow_list_only",
        allow_list: ["BOOKING.SEARCH", "BOOKING.QUOTE", "BOOKING.BOOK", "BOOKING.CANCEL", "BOOKING.MY_ORDERS.READ"],
      },
    },
  },
}

export const ENDPOINT_CAPABILITIES: Record<string, EndpointCapability> = {
  "BOOKING.SEARCH": {
    description: "Search hotels/rooms availability and pricing",
    method: "POST",
    path: "/api/booking/search",
    required_scopes_any: ["booking:search", "endpoints:*"],
    audit: true,
  },
  "BOOKING.QUOTE": {
    description: "Get quote details before booking (final price, taxes, cancellation)",
    method: "POST",
    path: "/api/booking/quote",
    required_scopes_any: ["booking:quote", "endpoints:*"],
    audit: true,
  },
  "BOOKING.BOOK": {
    description: "Create booking",
    method: "POST",
    path: "/api/booking/book",
    required_scopes_any: ["booking:book", "endpoints:*"],
    audit: true,
  },
  "BOOKING.CANCEL": {
    description: "Cancel booking",
    method: "POST",
    path: "/api/booking/cancel",
    required_scopes_any: ["booking:cancel", "endpoints:*"],
    audit: true,
  },
  "BOOKING.MY_ORDERS.READ": {
    description: "List my bookings/orders",
    method: "GET",
    path: "/api/booking/my-orders",
    required_scopes_any: ["booking:my_orders:read", "endpoints:*"],
    audit: true,
  },
  "ADMIN.SQL.MCP.QUERY": {
    description: "Execute MCP SQL query (admin only, via safe SQL layer)",
    method: "POST",
    path: "/api/admin/sql/query",
    required_scopes_any: ["mcp:sql:read", "mcp:sql:write", "endpoints:*"],
    requires_safe_sql: true,
    audit: true,
  },
  "ADMIN.AUDIT.READ": {
    description: "Read audit logs",
    method: "GET",
    path: "/api/admin/audit",
    required_scopes_any: ["audit:read", "endpoints:*"],
    audit: true,
  },
  "ADMIN.TOOLS.LIST": {
    description: "List tools available for current user",
    method: "GET",
    path: "/api/tools",
    required_scopes_any: ["tools:list", "endpoints:*"],
    audit: false,
  },
  "ADMIN.LLM.INVOKE": {
    description: "Invoke LLM (admin general/analysis)",
    method: "POST",
    path: "/api/admin/llm/invoke",
    required_scopes_any: ["llm:invoke", "endpoints:*"],
    audit: true,
  },
  "BOOKER.LLM.INVOKE": {
    description: "Invoke LLM (booker booking-only assistant)",
    method: "POST",
    path: "/api/llm/booking-assistant",
    required_scopes_any: ["llm:invoke:booking", "endpoints:*"],
    audit: true,
  },
}

export const SCOPES_CATALOG: Record<Scope, string> = {
  "audit:read": "Read audit logs (admin only by default).",
  "audit:write": "Write audit logs (system/admin).",
  "tools:list": "List available tools for the current user/role.",
  "llm:invoke": "Invoke LLM for any supported mode (admin).",
  "llm:analysis": "Allow analysis/forecast prompts (admin).",
  "llm:invoke:booking": "Invoke LLM only for booking assistant flows (booker).",
  "mcp:sql:connect": "Connect to MCP SQL server (admin).",
  "mcp:sql:read": "Execute SQL read queries via MCP (admin).",
  "mcp:sql:write": "Execute SQL write queries via MCP (admin; gated).",
  "booking:search": "Search hotel availability/prices.",
  "booking:quote": "Fetch quote / final price / cancellation policy.",
  "booking:book": "Create booking order.",
  "booking:cancel": "Cancel an existing booking order (subject to policy).",
  "booking:my_orders:read": "Read own orders/booking history.",
  "endpoints:*": "Full access to all endpoints (admin).",
}
