# RBAC (Role-Based Access Control) Implementation

This project includes a complete RBAC system with role-based permissions, audit logging, and admin UI.

## Features

- 2 Roles: `admin` and `booker`
- Scope-based permissions
- Capability checks
- Audit logging for all protected endpoints
- Admin UI for monitoring
- Session management
- API protection middleware

## Quick Start

### 1. Test Login Credentials

```
Admin:
- Email: admin@example.com
- Password: admin123

Booker:
- Email: booker@example.com
- Password: booker123
```

### 2. Access Admin Panel

Navigate to: `http://localhost:3000/admin/rbac`

### 3. Login via API

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "admin123",
  }),
})

const { token, user } = await response.json()
```

### 4. Make Protected API Calls

```typescript
const response = await fetch("/api/booking/search-protected", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    destination: "tel aviv",
    checkIn: "2025-12-23",
    checkOut: "2025-12-24",
    adults: 2,
  }),
})
```

## Roles & Permissions

### Admin Role

**Full access to:**

- All booking endpoints
- Audit logs (read/write)
- SQL queries (read-only by default, write with flag)
- LLM invoke (all modes: assistant, analysis, forecast)
- All tools

**Constraints:**

- SQL: read-only by default, write requires `user.flags.sql_write_enabled = true`
- SQL: max 500 rows per SELECT
- SQL: 15s timeout
- SQL: blocked tables: `secrets`, `api_keys`, `tokens`, `users_private`, `payment_methods`

### Booker Role

**Limited access to:**

- Booking search
- Booking quote
- Booking create
- Booking cancel
- My orders (read own bookings)
- LLM booking assistant only

**Constraints:**

- No SQL access
- No admin tools
- LLM limited to booking assistance only
- Cannot access other users' data

## Endpoints

### Authentication

- `POST /api/auth/login` - Login (returns token)
- `POST /api/auth/logout` - Logout

### Booking (Protected)

- `POST /api/booking/search-protected` - Search hotels (requires `booking:search`)
- `POST /api/booking/quote` - Get quote (requires `booking:quote`)
- `POST /api/booking/book` - Create booking (requires `booking:book`)
- `POST /api/booking/cancel` - Cancel booking (requires `booking:cancel`)
- `GET /api/booking/my-orders` - List my bookings (requires `booking:my_orders:read`)

### Admin

- `GET /api/admin/audit` - Get audit logs (requires `audit:read`)
- `GET /api/admin/audit/stats` - Get audit statistics (requires `audit:read`)
- `GET /api/admin/audit/export?format=json|csv` - Export logs (requires `audit:read`)
- `GET /api/tools` - List available tools/endpoints (requires `tools:list`)

## Using RBAC in Components

```typescript
"use client"

import { useRBAC } from "@/hooks/use-rbac"

export function BookingComponent() {
  const { isAuthenticated, user, hasAccess, apiCall, login, logout } = useRBAC()

  const handleSearch = async () => {
    if (!hasAccess("BOOKING.SEARCH")) {
      alert("No permission to search")
      return
    }

    const response = await apiCall("/api/booking/search-protected", {
      method: "POST",
      body: JSON.stringify({
        destination: "tel aviv",
        checkIn: "2025-12-23",
        checkOut: "2025-12-24",
      }),
    })

    const data = await response.json()
    console.log(data)
  }

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => login("booker@example.com", "booker123")}>Login</button>
      ) : (
        <div>
          <p>Welcome {user?.name}</p>
          <button onClick={handleSearch}>Search Hotels</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  )
}
```

## Protecting New Endpoints

```typescript
import { withRBAC } from "@/lib/rbac/middleware"

// 1. Add endpoint to config.ts
export const ENDPOINT_CAPABILITIES = {
  "MY.NEW.ENDPOINT": {
    description: "My new protected endpoint",
    method: "POST",
    path: "/api/my/endpoint",
    required_scopes_any: ["booking:search", "endpoints:*"],
    audit: true,
  },
  // ... existing endpoints
}

// 2. Protect your route handler
export const POST = withRBAC(
  async (req: NextRequest, user) => {
    // Your logic here
    // user object is automatically available
    return NextResponse.json({ success: true, userId: user.id })
  },
  { endpointKey: "MY.NEW.ENDPOINT" },
)
```

## Audit Logs

All protected endpoints automatically log:

- User ID
- Action (ACCESS_GRANTED / ACCESS_DENIED)
- Resource (endpoint key)
- HTTP method
- Path
- Status code
- IP address
- User agent
- Timestamp

Access logs via:

- Admin UI: `/admin/rbac`
- API: `GET /api/admin/audit`
- Export: `GET /api/admin/audit/export?format=json`

## Production Considerations

### Replace Mock Authentication

Current implementation uses mock users. Replace with your auth:

```typescript
// lib/rbac/middleware.ts
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  // TODO: Replace with your auth (JWT, session, etc.)
  const authHeader = req.headers.get("authorization")
  // ... your authentication logic
}
```

### Use Database for Audit Logs

Current implementation uses in-memory store. Add database:

```typescript
// lib/rbac/audit.ts
export class AuditLogger {
  static async log(params: any) {
    // Save to database instead of memory
    await db.auditLogs.create({ data: params })
  }
}
```

### Secure Sessions

Replace simple session store with:

- Redis for distributed systems
- JWT tokens with signing
- Secure HTTP-only cookies

## Security Best Practices

1. Always use HTTPS in production
2. Store tokens securely (HTTP-only cookies preferred over localStorage)
3. Implement token expiration and refresh
4. Add rate limiting to prevent abuse
5. Log all security events
6. Regularly review audit logs
7. Use environment variables for secrets
8. Implement CSRF protection
9. Add input validation
10. Use prepared statements for SQL queries

## Testing

### Test Admin Access

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use returned token
curl -X GET http://localhost:3000/api/admin/audit \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Booker Access

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"booker@example.com","password":"booker123"}'

# Try to access admin endpoint (should fail)
curl -X GET http://localhost:3000/api/admin/audit \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support

For issues or questions, check:

1. Audit logs: `/admin/rbac`
2. Console logs: `[RBAC Middleware]`, `[Audit]`
3. Check role permissions in `/lib/rbac/config.ts`
