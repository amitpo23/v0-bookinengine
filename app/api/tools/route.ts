import { type NextRequest, NextResponse } from "next/server"
import { withRBAC } from "@/lib/rbac/middleware"
import { ENDPOINT_CAPABILITIES } from "@/lib/rbac/config"
import { PermissionChecker } from "@/lib/rbac/permissions"

export const GET = withRBAC(
  async (req: NextRequest, user) => {
    try {
      // Get all accessible endpoints for user
      const accessibleEndpoints = PermissionChecker.getAccessibleEndpoints(user)

      // Map to endpoint details
      const tools = accessibleEndpoints.map((key) => ({
        key,
        ...ENDPOINT_CAPABILITIES[key],
      }))

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          role: user.role,
          scopes: PermissionChecker.getScopesForRole(user.role),
          capabilities: PermissionChecker.getCapabilitiesForRole(user.role),
        },
        tools,
        count: tools.length,
      })
    } catch (error: any) {
      console.error("[Tools] Error:", error)
      return NextResponse.json({ error: "Failed to fetch tools", details: error.message }, { status: 500 })
    }
  },
  { endpointKey: "ADMIN.TOOLS.LIST" },
)
