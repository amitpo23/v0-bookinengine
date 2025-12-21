# API Testing Results

## Test Configuration
- **Check-in Date**: 14 days from today
- **Check-out Date**: 16 days from today (2 night stay)
- **Hotel**: Dizengoff Inn
- **Guests**: 2 adults, 0 children

## How to Run Tests

```bash
# Run the full API flow test
npm run test:api

# Or run directly with tsx
npx tsx scripts/test-api-flow.ts
```

## Expected Flow

### Step 1: Search
- **Endpoint**: POST /api/hotels/GetInnstantSearchPrice
- **Expected**: Returns list of hotels with available rooms
- **Validation**: 
  - ✅ Results array is not empty
  - ✅ Each hotel has `hotelId`, `hotelName`, `rooms[]`
  - ✅ Each room has `code` (at least 10 chars), `buyPrice`, `roomName`

### Step 2: PreBook
- **Endpoint**: POST /api/hotels/PreBook
- **Expected**: Returns token and preBookId for holding the room
- **Validation**:
  - ✅ `status === "done"`
  - ✅ `token` is present and valid
  - ✅ `preBookId` is numeric
  - ✅ `priceConfirmed` matches search price

### Step 3: Book
- **Endpoint**: POST /api/hotels/Book
- **Expected**: Confirms and creates the booking
- **Validation**:
  - ✅ `success === true`
  - ✅ `bookingId` is present
  - ✅ `status === "confirmed"`
  - ✅ `supplierReference` is present

## Common Issues

### 401 Unauthorized
**Problem**: API token is invalid or expired  
**Solution**: Update `MEDICI_TOKEN` in environment variables

### Room code missing
**Problem**: API doesn't return valid room code  
**Solution**: Check API response format in `medici-client.ts` transform function

### PreBook returns 204
**Problem**: API doesn't support PreBook for this booking  
**Solution**: Client generates fallback preBookId from code hash

### Booking fails
**Problem**: Token expired or invalid customer data  
**Solution**: 
- Ensure PreBook token is passed correctly
- Validate customer email format
- Check phone number format (+972...)

## Last Test Results

Run `npm run test:api` to see latest results here.
