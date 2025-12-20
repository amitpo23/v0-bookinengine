import { ROLE_CONFIG, ENDPOINT_CAPABILITIES, type Scope, type Role, type Capability } from "./config"
import type { User, PermissionCheckResult } from "./types"

export class PermissionChecker {
  /**
   * Check if user has any of the required scopes
   */
  static hasAnyScope(userScopes: Scope[], requiredScopes: Scope[]): boolean {
    return requiredScopes.some((scope) => userScopes.includes(scope))
  }

  /**
   * Check if user has all required scopes
   */
  static hasAllScopes(userScopes: Scope[], requiredScopes: Scope[]): boolean {
    return requiredScopes.every((scope) => userScopes.includes(scope))
  }

  /**
   * Get scopes for a role
   */
  static getScopesForRole(role: Role): Scope[] {
    return ROLE_CONFIG[role]?.scopes || []
  }

  /**
   * Get capabilities for a role
   */
  static getCapabilitiesForRole(role: Role): Capability[] {
    return ROLE_CONFIG[role]?.capabilities || []
  }

  /**
   * Check if user can access an endpoint
   */
  static canAccessEndpoint(user: User, endpointKey: string): PermissionCheckResult {
    const endpoint = ENDPOINT_CAPABILITIES[endpointKey]

    if (!endpoint) {
      return {
        allowed: false,
        reason: `Endpoint ${endpointKey} not found in capabilities`,
      }
    }

    const roleConfig = ROLE_CONFIG[user.role]
    if (!roleConfig) {
      return {
        allowed: false,
        reason: `Invalid role: ${user.role}`,
      }
    }

    const userScopes = roleConfig.scopes

    // Check if user has any of the required scopes
    const hasAccess = this.hasAnyScope(userScopes, endpoint.required_scopes_any)

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Missing required scopes`,
        missing_scopes: endpoint.required_scopes_any.filter((scope) => !userScopes.includes(scope)),
      }
    }

    // Check endpoint constraints for the role
    const constraints = roleConfig.constraints.endpoints

    if (constraints?.access === "allow_list_only") {
      if (!constraints.allow_list?.includes(endpointKey)) {
        return {
          allowed: false,
          reason: `Endpoint ${endpointKey} not in allow list for role ${user.role}`,
        }
      }
    }

    if (constraints?.deny_list?.includes(endpointKey)) {
      return {
        allowed: false,
        reason: `Endpoint ${endpointKey} is in deny list for role ${user.role}`,
      }
    }

    return { allowed: true }
  }

  /**
   * Check if user has a specific capability
   */
  static hasCapability(user: User, capability: Capability): boolean {
    const roleConfig = ROLE_CONFIG[user.role]
    return roleConfig?.capabilities.includes(capability) || false
  }

  /**
   * Get all endpoint keys user can access
   */
  static getAccessibleEndpoints(user: User): string[] {
    return Object.keys(ENDPOINT_CAPABILITIES).filter((key) => this.canAccessEndpoint(user, key).allowed)
  }
}
