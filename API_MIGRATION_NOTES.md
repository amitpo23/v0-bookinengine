# Medici API Migration to Aether Authentication

## What Changed

The Medici API now uses Aether authentication instead of Bearer token authentication for PreBook and Book operations.

## Authentication Methods

### 1. Search API (GetInnstantSearchPrice)
- **URL**: `https://medici-backend.azurewebsites.net/api/hotels/GetInnstantSearchPrice`
- **Headers**:
  - `Authorization: Bearer {MEDICI_TOKEN}`
  - `Content-Type: application/json`

### 2. PreBook API
- **URL**: `https://book.mishor5.innstant-servers.com/pre-book`
- **Headers**:
  - `aether-access-token: {MEDICI_TOKEN}`
  - `aether-application-key: {MEDICI_APP_KEY}`
  - `Content-Type: application/json`
  - `cache-control: no-cache`

### 3. Book API
- **URL**: `https://book.mishor5.innstant-servers.com/book`
- **Headers**:
  - `aether-access-token: {MEDICI_TOKEN}`
  - `aether-application-key: {MEDICI_APP_KEY}`
  - `Content-Type: application/json`
  - `cache-control: no-cache`

## Environment Variables

Add the following to your `.env` file:

```env
MEDICI_TOKEN=your-aether-access-token-here
MEDICI_APP_KEY=your-aether-application-key-here
MEDICI_BASE_URL=https://medici-backend.azurewebsites.net
```

## Code Changes

The `MediciApiClient` class now:
1. Stores both `accessToken` and `appKey`
2. Uses different base URLs for search vs book operations
3. Applies correct headers based on operation type
4. PreBook and Book now use `useBookUrl=true` flag to target `book.mishor5.innstant-servers.com`

## Testing

Run the test script to verify all endpoints work:

```bash
npm run test:api
```

This will test:
- Search with dates 14 days ahead
- PreBook with returned room code
- Book with customer details

## Troubleshooting

If you get 401 Unauthorized:
1. Verify `MEDICI_TOKEN` is set correctly in environment variables
2. Verify `MEDICI_APP_KEY` is set (required for PreBook/Book)
3. Check that tokens haven't expired
4. Ensure you're using the correct base URLs

If PreBook/Book fail but Search works:
- Make sure you're targeting `book.mishor5.innstant-servers.com` for PreBook/Book
- Verify Aether headers are being sent instead of Bearer token
