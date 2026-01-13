# Medici Hotels Swagger API Documentation

**ChatGPT API v1 (OpenAPI 3.0)**

- **17 Endpoints** | **11 Schemas**
- **Base URL:** `https://medici-backend.azurewebsites.net`
- **Swagger UI:** `/swagger`
- **Generated:** 12/4/2025

---

## 1. API Overview

| Property | Value |
|----------|-------|
| API Title | ChatGPT API |
| Version | v1 |
| OpenAPI Version | 3.0.4 |
| Base URL | https://medici-backend.azurewebsites.net |
| Swagger UI | /swagger/index.html |
| Swagger JSON | /swagger/v1/swagger.json |
| Authentication | Basic Authentication |

### 1.1 All Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/OnlyNightUsersTokenAPI` | Get authentication token |
| POST | `/api/hotels/GetInnstantSearchPrice` | Search Innstant prices |
| POST | `/api/hotels/GetRoomsActive` | Get active rooms |
| POST | `/api/hotels/GetRoomsSales` | Get room sales |
| POST | `/api/hotels/GetRoomsCancel` | Get cancelled rooms |
| POST | `/api/hotels/GetDashboardInfo` | Get dashboard info |
| POST | `/api/hotels/GetOpportunities` | Get opportunities |
| POST | `/api/hotels/InsertOpportunity` | Create opportunity |
| POST | `/api/hotels/UpdateRoomsActivePushPrice` | Update push price |
| DELETE | `/api/hotels/CancelRoomActive` | Cancel active room |
| POST | `/api/hotels/GetRoomArchiveData` | Get archive data |
| POST | `/api/hotels/GetOpportiunitiesByBackOfficeId` | Get by BackOffice ID |
| POST | `/api/hotels/GetOpportiunitiesHotelSearch` | Search opportunities |
| POST | `/api/hotels/ManualBook` | Manual booking |
| POST | `/api/hotels/PreBook` | Pre-booking |
| POST | `/api/hotels/Book` | Confirm booking |
| DELETE | `/api/hotels/CancelRoomDirectJson` | Cancel room (JSON) |

---

## 2. Authentication

### 2.1 POST /api/auth/OnlyNightUsersTokenAPI

Get authentication token for API access.

**Request (multipart/form-data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| client_secret | string | Yes | API client secret |

---

## 3. Data Schemas

### 3.1 InsertOpp (Create Opportunity)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| hotelId | integer | No | Hotel ID |
| startDateStr | string | Yes | Min: 1, Max: 50 chars |
| endDateStr | string | Yes | Min: 1, Max: 50 chars |
| boardId | integer | Yes | Min: 1 |
| categoryId | integer | Yes | Min: 1 |
| buyPrice | double | Yes | Min: 1, Max: 10000 |
| pushPrice | double | Yes | Min: 1, Max: 10000 |
| maxRooms | integer | Yes | Min: 1, Max: 30 |
| ratePlanCode | string | No | Rate plan code |
| invTypeCode | string | No | Inventory type code |
| reservationFullName | string | No | Max: 500 chars |
| stars | integer | No | Hotel stars |
| destinationId | integer | No | Destination ID |
| locationRange | integer | No | Location range |
| providerId | integer | No | Provider ID |
| userId | integer | No | User ID |
| paxAdults | integer | No | Number of adults |
| paxChildren | int[] | No | Children ages array |

### 3.2 ApiInnstantSearchPrice (Search Request)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| dateFrom | string | Yes | Check-in date |
| dateTo | string | Yes | Check-out date |
| hotelName | string | No | Hotel name filter |
| city | string | No | City filter |
| pax | Pax[] | No | Passengers array |
| stars | integer | No | Hotel stars filter |
| limit | integer | No | Results limit |
| showExtendedData | boolean | No | Show extended data |

### 3.3 Pax (Passenger Info)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| adults | integer | No | Number of adults |
| children | int[] | No | Array of children ages |

### 3.4 RoomsActiveApiParams (Room Filters)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| startDate | datetime | No | Filter start date |
| endDate | datetime | No | Filter end date |
| hotelName | string | No | Hotel name filter |
| hotelStars | integer | No | Stars filter |
| city | string | No | City filter |
| roomBoard | string | No | Board type filter |
| roomCategory | string | No | Category filter |
| provider | string | No | Provider filter |

### 3.5 DashboardApiParams

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| hotelStars | integer | No | Hotel stars filter |
| city | string | No | City filter |
| hotelName | string | No | Hotel name filter |
| reservationMonthDate | datetime | No | Reservation month |
| checkInMonthDate | datetime | No | Check-in month |
| provider | string | No | Provider filter |

### 3.6 RoomArchiveFilterDto (Archive Filters)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| stayFrom | datetime | No | Stay from date |
| stayTo | datetime | No | Stay to date |
| hotelName | string | No | Hotel name |
| minPrice | integer | No | Minimum price |
| maxPrice | integer | No | Maximum price |
| city | string | No | City |
| roomBoard | string | No | Board type |
| roomCategory | string | No | Room category |
| minUpdatedAt | datetime | No | Min update date |
| maxUpdatedAt | datetime | No | Max update date |
| pageNumber | integer | No | Page number |
| pageSize | integer | No | Page size |

### 3.7 ApiBooking (Price Update)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| preBookId | integer | No | PreBook ID |
| pushPrice | double | No | New push price |

### 3.8 BookParams (Booking Request)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| jsonRequest | string | No | JSON request payload |

### 3.9 ManualBookParams

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| opportiunityId | integer | No | Opportunity ID |
| code | string | No | Booking code |

### 3.10 Other Schemas

| Schema | Fields |
|--------|--------|
| GetOpportiunitiesHotelSearchParams | opportiunityId (integer) |
| OpportiunitiesByBackOfficeParams | id (integer) |

---

## 4. Endpoint Details

### 4.1 Room Management

- `POST /api/hotels/GetRoomsActive` - Get all active (purchased) rooms
- `POST /api/hotels/GetRoomsSales` - Get sold rooms
- `POST /api/hotels/GetRoomsCancel` - Get cancelled rooms
- `DELETE /api/hotels/CancelRoomActive` - Cancel a room by prebookId
- `POST /api/hotels/GetRoomArchiveData` - Get historical room data

### 4.2 Opportunity Management

- `POST /api/hotels/GetOpportunities` - List all opportunities
- `POST /api/hotels/InsertOpportunity` - Create new opportunity
- `POST /api/hotels/GetOpportiunitiesByBackOfficeId` - Get by BackOffice ID
- `POST /api/hotels/GetOpportiunitiesHotelSearch` - Search opportunities

### 4.3 Booking Operations

- `POST /api/hotels/PreBook` - Create pre-booking
- `POST /api/hotels/Book` - Confirm booking
- `POST /api/hotels/ManualBook` - Manual booking by code
- `DELETE /api/hotels/CancelRoomDirectJson` - Cancel with JSON

### 4.4 Price & Search

- `POST /api/hotels/GetInnstantSearchPrice` - Search Innstant API
- `POST /api/hotels/UpdateRoomsActivePushPrice` - Update push price
- `POST /api/hotels/GetDashboardInfo` - Dashboard statistics

---

## 5. Example Requests

### 5.1 Create Opportunity

```http
POST /api/hotels/InsertOpportunity
Content-Type: application/json

{
  "hotelId": 12345,
  "startDateStr": "2024-03-01",
  "endDateStr": "2024-03-05",
  "boardId": 2,
  "categoryId": 1,
  "buyPrice": 100.00,
  "pushPrice": 150.00,
  "maxRooms": 5,
  "paxAdults": 2
}
```

### 5.2 Search Innstant Prices

```http
POST /api/hotels/GetInnstantSearchPrice
Content-Type: application/json

{
  "dateFrom": "2024-03-01",
  "dateTo": "2024-03-05",
  "city": "Barcelona",
  "stars": 4,
  "pax": [{ "adults": 2, "children": [] }],
  "limit": 10,
  "showExtendedData": true
}
```

### 5.3 Cancel Room

```http
DELETE /api/hotels/CancelRoomActive?prebookId=12345
```

### 5.4 Update Push Price

```http
POST /api/hotels/UpdateRoomsActivePushPrice
Content-Type: application/json

{
  "preBookId": 12345,
  "pushPrice": 175.00
}
```

### 5.5 Pre-Book

```http
POST /api/hotels/PreBook
Content-Type: application/json

{
  "jsonRequest": "{...booking details as JSON string...}"
}
```

### 5.6 Confirm Booking

```http
POST /api/hotels/Book
Content-Type: application/json

{
  "jsonRequest": "{...booking details as JSON string...}"
}
```

---

## Notes

- **Authentication:** Use `POST /api/auth/OnlyNightUsersTokenAPI` with `client_secret` to get a Bearer token
- **Extended Data:** Set `showExtendedData: true` in search requests to get images, facilities, and descriptions
- **Image Base URL:** `https://medici-images.azurewebsites.net/images/`

---

**End of Swagger API Documentation**

ChatGPT API v1 | 17 Endpoints | 11 Schemas

https://medici-backend.azurewebsites.net/swagger
