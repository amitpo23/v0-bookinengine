#!/bin/bash

# Get Bearer token from Medici API
# Usage: ./scripts/get-medici-token.sh

CLIENT_SECRET='$2y$10$QcGPkHG9Rk1VRTClz0HIsO3qQpm3JEU84QqfZadIVIoVHn5M7Tpnu'
APPLICATION_KEY='$2y$10$zmUK0OGNeeTtiGcV/cpWsOrZY7VXbt0Bzp16VwPPQ8z46DNV6esum'

echo "🔐 Getting Bearer token from Medici API..."
echo ""

# Try method 1: POST with JSON body
echo "Method 1: JSON body"
RESPONSE=$(curl -s -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -H "Content-Type: application/json" \
  -d "{\"client_secret\":\"$CLIENT_SECRET\",\"application_key\":\"$APPLICATION_KEY\"}")

echo "Response: $RESPONSE"
echo ""

# Try method 2: POST with form data
echo "Method 2: Form data (application/x-www-form-urlencoded)"
RESPONSE=$(curl -s -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_secret=$CLIENT_SECRET&application_key=$APPLICATION_KEY")

echo "Response: $RESPONSE"
echo ""

# Try method 3: POST with multipart form
echo "Method 3: Multipart form"
RESPONSE=$(curl -s -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -F "client_secret=$CLIENT_SECRET" \
  -F "application_key=$APPLICATION_KEY")

echo "Response: $RESPONSE"
echo ""

# Try method 4: Headers instead of body
echo "Method 4: Headers"
RESPONSE=$(curl -s -X POST https://medici-backend.azurewebsites.net/api/auth/OnlyNightUsersTokenAPI \
  -H "aether-access-token: $CLIENT_SECRET" \
  -H "aether-application-key: $APPLICATION_KEY")

echo "Response: $RESPONSE"
