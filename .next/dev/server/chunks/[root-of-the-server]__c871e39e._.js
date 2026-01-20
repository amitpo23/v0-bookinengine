module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/api/knowaa-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Knowaa Hotels API Client - Token-based Authentication
// Handles bearer token retrieval and all hotel API calls via Knowaa credentials
__turbopack_context__.s([
    "KnowaaMediciClient",
    ()=>KnowaaMediciClient,
    "clearTokenCache",
    ()=>clearTokenCache,
    "getTokenCacheStatus",
    ()=>getTokenCacheStatus,
    "knowaaClient",
    ()=>knowaaClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
;
;
const MEDICI_BASE_URL = "https://medici-backend.azurewebsites.net";
const TOKEN_ENDPOINT = "/api/auth/OnlyNightUsersTokenAPI";
// Knowaa credentials
const KNOWAA_CLIENT_SECRET = process.env.KNOWAA_CLIENT_SECRET || "zlbgGGxz~|l3.Q?XXAT)uT!Lty,kJC>R?`:k?oQH$I=P7rL<R:Em:qDaM1G(jFU7";
const KNOWAA_EMAIL = process.env.KNOWAA_EMAIL || "partnerships@knowaaglobal.com";
let tokenCache = null;
// =====================
// TOKEN MANAGEMENT
// =====================
async function getKnowaaBearerToken() {
    // If env token provided, use it (testing override)
    const ENV_TOKEN = process.env.KNOWAA_BEARER_TOKEN;
    if (ENV_TOKEN) {
        if (!tokenCache) {
            tokenCache = {
                token: ENV_TOKEN,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000
            };
        }
        return tokenCache.token;
    }
    // Return cached token if still valid
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
        return tokenCache.token;
    }
    try {
        console.log("🔐 [Knowaa] Requesting bearer token...");
        const tokenUrl = `${MEDICI_BASE_URL}${TOKEN_ENDPOINT}`;
        // Build form data using URLSearchParams and convert to string
        const formData = new URLSearchParams();
        formData.append("client_secret", KNOWAA_CLIENT_SECRET);
        formData.append("email", KNOWAA_EMAIL);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].post(tokenUrl, formData.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": formData.toString().length.toString()
            },
            timeout: 15000
        });
        console.log("🔐 [Knowaa] Token response status:", response.status);
        // Response format: { "email1": "token1", "email2": "token2", ... }
        const token = response.data[KNOWAA_EMAIL] || response.data.token || response.data.access_token;
        if (!token) {
            console.error("🔐 [Knowaa] Response data:", JSON.stringify(response.data).substring(0, 200));
            throw new Error("No token received from Knowaa auth endpoint");
        }
        // Cache token for 55 minutes (typical JWT expiry is 1 hour)
        tokenCache = {
            token,
            expiresAt: Date.now() + 55 * 60 * 1000
        };
        console.log("✅ Knowaa Bearer Token acquired successfully");
        return tokenCache.token;
    } catch (error) {
        console.error("❌ Failed to get Knowaa Bearer Token:");
        console.error("Error message:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw new Error(`Authentication failed: ${error.message}`);
    }
}
class KnowaaMediciClient {
    client;
    baseUrl;
    constructor(){
        this.baseUrl = MEDICI_BASE_URL;
        this.client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: this.baseUrl,
            timeout: 30000
        });
    }
    /**
   * Create request with Knowaa bearer token
   */ async getAuthHeaders() {
        const token = await getKnowaaBearerToken();
        // WORKAROUND: Use the legacy token (UserID 11) which works via fetch
        // The Knowaa token works with curl but returns 500 from axios/fetch for unknown reasons
        const LEGACY_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE";
        return {
            Authorization: `Bearer ${token || LEGACY_TOKEN}`,
            "Content-Type": "application/json"
        };
    }
    /**
   * STEP 1: Search Hotels
   * GET /api/hotels/GetInnstantSearchPrice
   */ async searchHotels(params) {
        try {
            const headers = await this.getAuthHeaders();
            const pax = {
                adults: params.adults || 2,
                children: params.children?.length || 0
            };
            const body = {
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
                pax,
                stars: params.stars || null,
                limit: params.limit || null,
                ShowExtendedData: true
            };
            if (params.hotelName) {
                body.hotelName = params.hotelName;
            } else if (params.city) {
                body.city = params.city;
            }
            console.log("🔍 [Knowaa] Searching hotels:", {
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
                ...body
            });
            const response = await fetch(`${this.baseUrl}/api/hotels/GetInnstantSearchPrice`, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`Medici API returned ${response.status}`);
            }
            const data = await response.json();
            const hotels = this.transformSearchResults(data);
            console.log(`✅ [Knowaa] Found ${hotels.length} hotels`);
            return hotels.map((hotel)=>({
                    ...hotel,
                    requestJson: JSON.stringify(body),
                    responseJson: data
                }));
        } catch (error) {
            console.error("❌ [Knowaa] Search Hotels Error:", error);
            throw error;
        }
    }
    /**
   * STEP 2: Pre-Book
   * POST /api/hotels/PreBook
   */ async preBook(params) {
        try {
            const headers = await this.getAuthHeaders();
            const body = {
                jsonRequest: params.jsonRequest
            };
            console.log("📋 [Knowaa] Pre-booking room...");
            const response = await this.client.post("/api/hotels/PreBook", body, {
                headers
            });
            if (response.status === 204) {
                return {
                    success: true,
                    preBookId: 0,
                    token: "",
                    status: "done",
                    priceConfirmed: 0,
                    currency: "USD",
                    requestJson: params.jsonRequest,
                    responseJson: ""
                };
            }
            const token = response.data?.content?.services?.hotels?.[0]?.token || response.data?.token || "";
            const preBookId = response.data?.opportunityId || response.data?.preBookId || response.data?.id || 0;
            const priceConfirmed = response.data?.content?.services?.hotels?.[0]?.price?.amount || 0;
            const currency = response.data?.content?.services?.hotels?.[0]?.price?.currency || "USD";
            console.log(`✅ [Knowaa] Pre-book successful: ID ${preBookId}`);
            return {
                success: true,
                preBookId,
                token,
                status: response.data?.status || "done",
                priceConfirmed,
                currency,
                requestJson: params.jsonRequest,
                responseJson: response.data
            };
        } catch (error) {
            console.error("❌ [Knowaa] Pre-Book Error:", error);
            throw error;
        }
    }
    /**
   * STEP 3: Book
   * POST /api/hotels/Book
   */ async book(params) {
        try {
            const headers = await this.getAuthHeaders();
            const body = {
                jsonRequest: params.jsonRequest
            };
            console.log("🎫 [Knowaa] Booking room...");
            const response = await this.client.post("/api/hotels/Book", body, {
                headers
            });
            const bookingId = response.data?.content?.bookingID || response.data?.bookingId || "";
            const supplierReference = response.data?.content?.services?.[0]?.supplier?.reference || "";
            const status = response.data?.status || "confirmed";
            console.log(`✅ [Knowaa] Booking confirmed: ${bookingId}`);
            return {
                success: true,
                bookingId,
                supplierReference,
                status
            };
        } catch (error) {
            console.error("❌ [Knowaa] Book Error:", error);
            throw error;
        }
    }
    /**
   * Transform Medici API search response to HotelSearchResult[]
   */ transformSearchResults(response) {
        const hotelMap = new Map();
        const items = response?.items || [];
        for (const item of items){
            if (!item.name) continue;
            const hotelId = String(item.id || item.hotelId || "0");
            const roomKey = `${hotelId}-${item.name}`;
            if (!hotelMap.has(roomKey)) {
                hotelMap.set(roomKey, {
                    hotelId: Number(hotelId),
                    hotelName: item.items?.[0]?.hotelName || item.name || "Unknown",
                    city: item.city || "Unknown",
                    stars: item.stars || 0,
                    address: item.address || "",
                    description: item.description || "",
                    hotelImage: item.imageUrl || "",
                    images: item.images?.map((img)=>img.url || "") || [],
                    location: item.city || "",
                    facilities: item.facilities?.list || [],
                    rooms: []
                });
            }
            const hotel = hotelMap.get(roomKey);
            // Add rooms
            if (item.items && Array.isArray(item.items)) {
                for (const roomItem of item.items){
                    const price = item.price?.amount || item.netPrice?.amount || 0;
                    hotel.rooms.push({
                        roomId: roomItem.code || `${hotelId}-room-${Math.random()}`,
                        roomName: roomItem.name || "Standard",
                        roomCategory: roomItem.category || "standard",
                        categoryId: 1,
                        roomImage: "",
                        images: [],
                        bedding: roomItem.bedding || "double",
                        board: roomItem.board || "RO",
                        boardId: 1,
                        boardType: roomItem.boardType || "RO",
                        maxOccupancy: roomItem.pax?.adults || 2,
                        size: 0,
                        view: "",
                        amenities: [],
                        price,
                        buyPrice: price,
                        originalPrice: price > 0 ? Math.round(price * 1.15) : 0,
                        currency: item.price?.currency || "USD",
                        cancellationPolicy: "refundable",
                        available: roomItem.quantity?.max || 1,
                        requestJson: item.code,
                        pax: roomItem.pax || {
                            adults: 2,
                            children: []
                        }
                    });
                }
            }
        }
        return Array.from(hotelMap.values());
    }
}
const knowaaClient = new KnowaaMediciClient();
function clearTokenCache() {
    tokenCache = null;
    console.log("🔄 Token cache cleared");
}
function getTokenCacheStatus() {
    if (!tokenCache) {
        return {
            cached: false,
            token: null,
            expiresIn: null
        };
    }
    const expiresIn = tokenCache.expiresAt - Date.now();
    return {
        cached: true,
        token: tokenCache.token?.substring(0, 20) + "...",
        expiresIn: expiresIn > 0 ? Math.floor(expiresIn / 1000) + "s" : "expired"
    };
}
}),
"[project]/app/api/test-knowaa/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/knowaa-client.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action") || "status";
        const city = searchParams.get("city") || "Tel Aviv";
        const dateFrom = searchParams.get("dateFrom") || "2025-02-01";
        const dateTo = searchParams.get("dateTo") || "2025-02-05";
        const hotelName = searchParams.get("hotelName");
        console.log(`\n🚀 [Knowaa Test] Action: ${action}`);
        if (action === "status") {
            const cacheStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTokenCacheStatus"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Knowaa API Integration Status",
                timestamp: new Date().toISOString(),
                tokenCache: cacheStatus,
                endpoints: {
                    search: "/api/test-knowaa?action=search&city=Tel%20Aviv&dateFrom=2025-02-01&dateTo=2025-02-05",
                    searchByHotel: "/api/test-knowaa?action=search&hotelName=Scarlet&dateFrom=2025-02-01&dateTo=2025-02-05"
                }
            });
        }
        if (action === "search") {
            console.log(`\n🔍 Searching: ${hotelName ? `Hotel: ${hotelName}` : `City: ${city}`}`);
            const results = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["knowaaClient"].searchHotels({
                dateFrom,
                dateTo,
                hotelName: hotelName || undefined,
                city: hotelName ? undefined : city,
                adults: 2
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                count: results.length,
                dateRange: {
                    dateFrom,
                    dateTo
                },
                query: hotelName ? {
                    hotelName
                } : {
                    city
                },
                hotels: results.map((h)=>({
                        id: h.hotelId,
                        name: h.hotelName,
                        city: h.city,
                        stars: h.stars,
                        rooms: h.rooms.length
                    })),
                fullResults: results
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unknown action"
        }, {
            status: 400
        });
    } catch (error) {
        console.error("❌ [Knowaa Test] Error:", error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Test failed",
            details: error.response?.data || error.toString()
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { action = "search", ...params } = body;
        console.log(`\n🚀 [Knowaa API POST] Action: ${action}`);
        if (action === "search") {
            const results = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["knowaaClient"].searchHotels({
                dateFrom: params.dateFrom || "2025-02-01",
                dateTo: params.dateTo || "2025-02-05",
                hotelName: params.hotelName,
                city: params.city || "Tel Aviv",
                adults: params.adults || 2,
                stars: params.stars,
                limit: params.limit
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                count: results.length,
                data: results
            });
        }
        if (action === "prebook") {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["knowaaClient"].preBook({
                jsonRequest: params.jsonRequest
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: result.success,
                preBookId: result.preBookId,
                token: result.token,
                status: result.status,
                price: result.priceConfirmed
            });
        }
        if (action === "book") {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["knowaaClient"].book({
                jsonRequest: params.jsonRequest
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: result.success,
                bookingId: result.bookingId,
                status: result.status
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unknown action"
        }, {
            status: 400
        });
    } catch (error) {
        console.error("❌ [Knowaa API POST] Error:", error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Request failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c871e39e._.js.map