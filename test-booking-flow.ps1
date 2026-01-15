# Booking Engine - Full Flow Test Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BOOKING ENGINE - FULL FLOW TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# STEP 1: SEARCH
Write-Host "`n=== STEP 1: SEARCH ===" -ForegroundColor Yellow
$searchBody = @{
    dateFrom = "2026-02-01"
    dateTo = "2026-02-03"
    city = "Tel Aviv"
    adults = 2
    children = @()
    limit = 2
} | ConvertTo-Json -Compress

try {
    $searchResult = Invoke-RestMethod -Uri "$baseUrl/api/hotels/search" -Method POST -ContentType "application/json" -Body $searchBody -TimeoutSec 120
    Write-Host "SUCCESS! Found $($searchResult.count) hotels" -ForegroundColor Green
    
    if ($searchResult.data -and $searchResult.data.Count -gt 0) {
        foreach ($hotel in $searchResult.data) {
            Write-Host "  Hotel: $($hotel.hotelName)" -ForegroundColor White
            Write-Host "    ID: $($hotel.hotelId), Stars: $($hotel.stars)" -ForegroundColor Gray
            if ($hotel.rooms -and $hotel.rooms.Count -gt 0) {
                Write-Host "    Rooms: $($hotel.rooms.Count) available" -ForegroundColor Gray
                Write-Host "    First room: $($hotel.rooms[0].roomName) - $($hotel.rooms[0].buyPrice) $($hotel.rooms[0].currency)" -ForegroundColor Gray
            }
        }
        
        $global:selectedHotel = $searchResult.data[0]
        $global:selectedRoom = $searchResult.data[0].rooms[0]
        Write-Host "`n  Selected for prebook:" -ForegroundColor Magenta
        Write-Host "    Hotel: $($global:selectedHotel.hotelName)" -ForegroundColor White
        Write-Host "    Room Code: $($global:selectedRoom.code)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# STEP 2: PREBOOK
Write-Host "`n=== STEP 2: PREBOOK ===" -ForegroundColor Yellow
if ($global:selectedRoom.code) {
    $prebookBody = @{
        roomCode = $global:selectedRoom.code
        hotelId = $global:selectedHotel.hotelId
        checkIn = "2026-02-01"
        checkOut = "2026-02-03"
        guests = @{
            adults = 2
            children = @()
        }
    } | ConvertTo-Json -Compress
    
    try {
        $prebookResult = Invoke-RestMethod -Uri "$baseUrl/api/booking/prebook" -Method POST -ContentType "application/json" -Body $prebookBody -TimeoutSec 60
        Write-Host "SUCCESS! PreBook ID: $($prebookResult.preBookId)" -ForegroundColor Green
        Write-Host "  Token: $($prebookResult.token)" -ForegroundColor Gray
        Write-Host "  Price: $($prebookResult.priceConfirmed) $($prebookResult.currency)" -ForegroundColor White
        $global:prebookToken = $prebookResult.token
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIPPED - No room code available" -ForegroundColor Yellow
}

# STEP 3: BOOK (simulated - don't actually book)
Write-Host "`n=== STEP 3: BOOK (Validation Only) ===" -ForegroundColor Yellow
Write-Host "  Book API endpoint: $baseUrl/api/booking/book" -ForegroundColor Gray
Write-Host "  Required fields:" -ForegroundColor Gray
Write-Host "    - token (from prebook)" -ForegroundColor Gray
Write-Host "    - roomCode" -ForegroundColor Gray
Write-Host "    - customer (firstName, lastName, email, phone)" -ForegroundColor Gray
Write-Host "    - guests (array of guest names)" -ForegroundColor Gray
Write-Host "  NOTE: Skipping actual booking to avoid charges" -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
