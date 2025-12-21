# Medici API Authentication Guide

## Credentials

You have two sets of credentials:

1. **Aether Access Token** (for search API):
   ```
   $2y$10$QcGPkHG9Rk1VRTClz0HIsO3qQpm3JEU84QqfZadIVIoVHn5M7Tpnu
   ```

2. **Aether Application Key** (for PreBook/Book API):
   ```
   $2y$10$zmUK0OGNeeTtiGcV/cpWsOrZY7VXbt0Bzp16VwPPQ8z46DNV6esum
   ```

3. **Bearer Token** (JWT - expires 2068):
   ```
   eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbWVkaWNpLWJhY2tlbmQuYXp1cmV3ZWJzaXRlcy5uZXRcL2FwaVwvYXV0aFwvT25seU5pZ2h0VXNlcnNUb2tlbkFQSSIsImlhdCI6MTczNDA5NDE3MiwiZXhwIjozMTAzMDk0MTcyLCJuYmYiOjE3MzQwOTQxNzIsImp0aSI6IlVwTldOT0F3MFNDOTFBMjQiLCJzdWIiOjIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.O4_LxCpfb8TFIBz9_sfcHuNGz38YRa3JlC6xEJbN98M
   ```

## Getting a New Bearer Token

If the token expires or you need a fresh one, use one of these methods:

### Method 1: Using the Shell Script
```bash
chmod +x scripts/get-medici-token.sh
./scripts/get-medici-token.sh
```

### Method 2: Manual cURL (JSON)
```bash
curl -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -H "Content-Type: application/json" \
  -d '{
    "client_secret": "$2y$10$QcGPkHG9Rk1VRTClz0HIsO3qQpm3JEU84QqfZadIVIoVHn5M7Tpnu",
    "application_key": "$2y$10$zmUK0OGNeeTtiGcV/cpWsOrZY7VXbt0Bzp16VwPPQ8z46DNV6esum"
  }'
```

### Method 3: Manual cURL (Form Data)
```bash
curl -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_secret=\$2y\$10\$QcGPkHG9Rk1VRTClz0HIsO3qQpm3JEU84QqfZadIVIoVHn5M7Tpnu&application_key=\$2y\$10\$zmUK0OGNeeTtiGcV/cpWsOrZY7VXbt0Bzp16VwPPQ8z46DNV6esum"
```

## How the System Uses Tokens

### Search API (GetInnstantSearchPrice)
- **URL**: `https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```

### PreBook API
- **URL**: `https://book.mishor5.innstant-servers.com/api/preBook`
- **Headers**:
  ```
  aether-access-token: <AETHER_ACCESS_TOKEN>
  aether-application-key: <AETHER_APPLICATION_KEY>
  Content-Type: application/json
  ```

### Book API
- **URL**: `https://book.mishor5.innstant-servers.com/api/book`
- **Headers**:
  ```
  aether-access-token: <AETHER_ACCESS_TOKEN>
  aether-application-key: <AETHER_APPLICATION_KEY>
  Content-Type: application/json
  ```

## Environment Variables

Add these to your `.env.local`:

```env
MEDICI_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
MEDICI_APP_KEY=$2y$10$zmUK0OGNeeTtiGcV/cpWsOrZY7VXbt0Bzp16VwPPQ8z46DNV6esum
MEDICI_CLIENT_SECRET=$2y$10$QcGPkHG9Rk1VRTClz0HIsO3qQpm3JEU84QqfZadIVIoVHn5M7Tpnu
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
BOOK_BASE_URL=https://book.mishor5.innstant-servers.com
```

## Troubleshooting

**401 Error?**
- Token might have expired (check JWT payload)
- Run `./scripts/get-medici-token.sh` to get a fresh token
- Update `MEDICI_TOKEN` in your environment variables

**405 Error?**
- Wrong HTTP method or endpoint
- Check if you're using the correct URL for the operation

**Connection refused?**
- Check if the API is accessible from your network
- Try the curl commands directly to verify
