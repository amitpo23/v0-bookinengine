// Debug route to check what token is being used
export async function GET() {
  const envToken = process.env.MEDICI_TOKEN
  
  const fallbackToken = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE"
  
  const usedToken = envToken || fallbackToken
  
  // Decode JWT to get user info (base64 decode the payload)
  let tokenInfo = null
  try {
    const parts = usedToken.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      tokenInfo = {
        userId: payload.UserId,
        exp: payload.exp,
        expiresDate: new Date(payload.exp * 1000).toISOString(),
        isExpired: Date.now() > payload.exp * 1000
      }
    }
  } catch (e) {
    tokenInfo = { error: 'Could not decode token' }
  }
  
  return Response.json({
    hasEnvToken: !!envToken,
    envTokenFirst20: envToken ? envToken.substring(0, 50) + '...' : null,
    fallbackTokenFirst20: fallbackToken.substring(0, 50) + '...',
    usedTokenFirst20: usedToken.substring(0, 50) + '...',
    tokenInfo,
    timestamp: new Date().toISOString()
  })
}
