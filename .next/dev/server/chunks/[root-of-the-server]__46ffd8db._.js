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
"[project]/lib/api/medici-types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Types and constants for Medici API - safe for client-side use
// No environment variables accessed here
__turbopack_context__.s([
    "BOARD_TYPES",
    ()=>BOARD_TYPES,
    "ROOM_CATEGORIES",
    ()=>ROOM_CATEGORIES
]);
const BOARD_TYPES = {
    1: "Room Only",
    2: "Bed & Breakfast",
    3: "Half Board",
    4: "Full Board",
    5: "All Inclusive"
};
const ROOM_CATEGORIES = {
    1: "Standard",
    2: "Superior",
    3: "Deluxe",
    4: "Suite",
    5: "Executive"
};
}),
"[project]/lib/logging/api-logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Comprehensive API Logging System
// Tracks all API calls, responses, and errors
__turbopack_context__.s([
    "apiLogger",
    ()=>apiLogger,
    "withTiming",
    ()=>withTiming
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
// In-memory buffer for logs (also saved to Supabase if configured)
const logBuffer = [];
const MAX_BUFFER_SIZE = 1000;
// Supabase client for persistent logging
let supabase = null;
function getSupabase() {
    if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    }
    return supabase;
}
// Color codes for console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m"
};
function getLevelColor(level) {
    switch(level){
        case "debug":
            return colors.dim;
        case "info":
            return colors.cyan;
        case "warn":
            return colors.yellow;
        case "error":
            return colors.red;
        default:
            return colors.white;
    }
}
function getCategoryIcon(category) {
    switch(category){
        case "api":
            return "🌐";
        case "medici":
            return "🏨";
        case "booking":
            return "📋";
        case "auth":
            return "🔐";
        case "system":
            return "⚙️";
        default:
            return "📝";
    }
}
function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
function truncate(str, maxLen = 200) {
    if (!str) return "";
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen) + "...";
}
// Main logger class
class ApiLogger {
    static instance;
    enabled = true;
    constructor(){}
    static getInstance() {
        if (!ApiLogger.instance) {
            ApiLogger.instance = new ApiLogger();
        }
        return ApiLogger.instance;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    formatLogForConsole(entry) {
        const time = new Date(entry.timestamp).toLocaleTimeString("he-IL");
        const icon = getCategoryIcon(entry.category);
        const levelColor = getLevelColor(entry.level);
        let output = `${colors.dim}[${time}]${colors.reset} ${icon} ${levelColor}[${entry.level.toUpperCase()}]${colors.reset} `;
        output += `${colors.bright}${entry.action}${colors.reset}`;
        if (entry.method && entry.endpoint) {
            const methodColor = entry.method === "GET" ? colors.green : entry.method === "POST" ? colors.blue : entry.method === "PUT" ? colors.yellow : colors.red;
            output += ` ${methodColor}${entry.method}${colors.reset} ${entry.endpoint}`;
        }
        if (entry.statusCode) {
            const statusColor = entry.statusCode < 300 ? colors.green : entry.statusCode < 400 ? colors.yellow : colors.red;
            output += ` ${statusColor}[${entry.statusCode}]${colors.reset}`;
        }
        if (entry.duration) {
            output += ` ${colors.magenta}(${formatDuration(entry.duration)})${colors.reset}`;
        }
        return output;
    }
    async log(entry) {
        if (!this.enabled) return;
        const fullEntry = {
            ...entry,
            timestamp: new Date().toISOString()
        };
        // Console output
        console.log(this.formatLogForConsole(fullEntry));
        // Additional details for errors or debug
        if (entry.level === "error" && entry.error) {
            console.error(`${colors.red}  Error: ${entry.error}${colors.reset}`);
        }
        if (entry.requestBody && (entry.level === "debug" || entry.level === "error")) {
            console.log(`${colors.dim}  Request: ${truncate(JSON.stringify(entry.requestBody))}${colors.reset}`);
        }
        if (entry.responseBody && entry.level === "error") {
            console.log(`${colors.dim}  Response: ${truncate(JSON.stringify(entry.responseBody))}${colors.reset}`);
        }
        // Add to buffer
        logBuffer.push(fullEntry);
        if (logBuffer.length > MAX_BUFFER_SIZE) {
            logBuffer.shift();
        }
        // Save to Supabase (async, non-blocking)
        this.saveToSupabase(fullEntry).catch(()=>{});
    }
    async saveToSupabase(entry) {
        const db = getSupabase();
        if (!db) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await db.from("api_logs").insert({
                timestamp: entry.timestamp,
                level: entry.level,
                category: entry.category,
                action: entry.action,
                method: entry.method,
                endpoint: entry.endpoint,
                request_body: entry.requestBody,
                response_body: entry.responseBody,
                status_code: entry.statusCode,
                duration_ms: entry.duration,
                user_id: entry.userId,
                session_id: entry.sessionId,
                ip_address: entry.ip,
                user_agent: entry.userAgent,
                error_message: entry.error,
                metadata: entry.metadata
            });
        } catch (error) {
        // Silent fail - don't let logging break the app
        }
    }
    // Convenience methods
    debug(category, action, metadata) {
        this.log({
            level: "debug",
            category,
            action,
            metadata
        });
    }
    info(category, action, metadata) {
        this.log({
            level: "info",
            category,
            action,
            metadata
        });
    }
    warn(category, action, metadata) {
        this.log({
            level: "warn",
            category,
            action,
            metadata
        });
    }
    error(category, action, error, metadata) {
        this.log({
            level: "error",
            category,
            action,
            error,
            metadata
        });
    }
    // API request logging
    async logApiRequest(params) {
        const level = params.statusCode >= 500 ? "error" : params.statusCode >= 400 ? "warn" : "info";
        await this.log({
            level,
            category: "api",
            action: `API Request`,
            ...params
        });
    }
    // Medici API logging
    async logMediciCall(params) {
        const level = params.statusCode >= 500 ? "error" : params.statusCode >= 400 ? "warn" : "info";
        await this.log({
            level,
            category: "medici",
            method: "POST",
            ...params
        });
    }
    // Get recent logs
    getRecentLogs(count = 100, filter) {
        let logs = [
            ...logBuffer
        ].reverse();
        if (filter) {
            logs = logs.filter((log)=>{
                if (filter.level && log.level !== filter.level) return false;
                if (filter.category && log.category !== filter.category) return false;
                if (filter.action && !log.action.includes(filter.action)) return false;
                return true;
            });
        }
        return logs.slice(0, count);
    }
    // Clear buffer
    clearBuffer() {
        logBuffer.length = 0;
    }
}
const apiLogger = ApiLogger.getInstance();
function withTiming(operation) {
    const start = Date.now();
    return operation().then((result)=>({
            result,
            duration: Date.now() - start
        }));
}
}),
"[project]/lib/api/medici-client.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Medici Hotels API Client
// Complete AI-Executable Integration
// Base URL: https://medici-backend.azurewebsites.net
__turbopack_context__.s([
    "BOARD_TYPES",
    ()=>BOARD_TYPES,
    "MediciApiClient",
    ()=>MediciApiClient,
    "ROOM_CATEGORIES",
    ()=>ROOM_CATEGORIES,
    "mediciApi",
    ()=>mediciApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/medici-types.ts [app-route] (ecmascript)");
// Import logger
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logging/api-logger.ts [app-route] (ecmascript)");
;
;
;
const MEDICI_BASE_URL = process.env.MEDICI_BASE_URL || "https://medici-backend.azurewebsites.net";
const MEDICI_IMAGES_BASE = "https://medici-images.azurewebsites.net/images/";
// KNOWAA TOKEN (partnerships@knowaaglobal.com, UserId:24, expires 2067) 
// PRIMARY TOKEN - B2B Medici has issues, use Knowaa
const KNOWAA_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIyNCIsIm5iZiI6MTc1MjEzMjc3NywiZXhwIjoyMDY3NjY1NTc3LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.1cKlbn5cAHTc6n2MALkaHtBCs-gmQ5HWssF4UPyZII0";
// B2B MEDICI TOKEN (UserId:11, expires 2083) - BACKUP ONLY (has issues)
const MEDICI_TOKEN_LEGACY = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE";
// Use KNOWAA token as primary
const MEDICI_TOKEN = process.env.KNOWAA_BEARER_TOKEN || KNOWAA_TOKEN;
const BOARD_TYPES = {
    1: {
        code: "RO",
        name: "Room Only",
        nameHe: "לינה בלבד"
    },
    2: {
        code: "BB",
        name: "Bed & Breakfast",
        nameHe: "ארוחת בוקר"
    },
    3: {
        code: "HB",
        name: "Half Board",
        nameHe: "חצי פנסיון"
    },
    4: {
        code: "FB",
        name: "Full Board",
        nameHe: "פנסיון מלא"
    },
    5: {
        code: "AI",
        name: "All Inclusive",
        nameHe: "הכל כלול"
    }
};
const ROOM_CATEGORIES = {
    1: {
        name: "Standard",
        nameHe: "סטנדרט"
    },
    2: {
        name: "Superior",
        nameHe: "סופריור"
    },
    3: {
        name: "Deluxe",
        nameHe: "דלוקס"
    },
    4: {
        name: "Suite",
        nameHe: "סוויטה"
    },
    5: {
        name: "Junior Suite",
        nameHe: "סוויטת ג'וניור"
    },
    6: {
        name: "Family",
        nameHe: "משפחתי"
    }
};
class MediciApiClient {
    baseUrl;
    token;
    retries;
    maxRetries;
    constructor(token){
        this.token = token || MEDICI_TOKEN;
        this.baseUrl = MEDICI_BASE_URL;
        this.retries = 0;
        this.maxRetries = 2;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const startTime = Date.now();
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
            ...options.headers
        };
        // Log request start
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].debug("medici", `Medici API Request: ${endpoint}`, {
            url,
            method: options.method || "GET"
        });
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            const duration = Date.now() - startTime;
            if (response.status === 204) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].info("medici", `Medici API Success (204 No Content)`, {
                    endpoint,
                    duration
                });
                return {
                    _status: 204
                };
            }
            if (!response.ok) {
                const errorBody = await response.text();
                // Log error
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].logMediciCall({
                    action: "Medici API Error",
                    endpoint,
                    requestBody: options.body ? JSON.parse(options.body) : undefined,
                    statusCode: response.status,
                    duration,
                    error: errorBody
                });
                if (response.status === 401 && this.retries < this.maxRetries) {
                    this.retries++;
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].warn("medici", `Token expired, refreshing (attempt ${this.retries})`);
                    await this.refreshToken();
                    return this.request(endpoint, options);
                }
                throw new Error(`API Error ${response.status}: ${errorBody}`);
            }
            const data = await response.json();
            this.retries = 0;
            // Log successful response
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].logMediciCall({
                action: "Medici API Success",
                endpoint,
                requestBody: options.body ? JSON.parse(options.body) : undefined,
                responseBody: {
                    itemCount: Array.isArray(data) ? data.length : data?.items?.length || 1
                },
                statusCode: response.status,
                duration
            });
            return data;
        } catch (error) {
            const duration = Date.now() - startTime;
            if (error instanceof Error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$api$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLogger"].error("medici", `Medici API Exception: ${endpoint}`, error.message, {
                    duration
                });
                throw error;
            }
            throw new Error("Unknown error occurred");
        }
    }
    // =====================
    // STEP 1: SEARCH HOTELS
    // =====================
    async searchHotels(params) {
        console.log("🔍 MediciApi.searchHotels called with params:", params);
        const pax = params.rooms || [
            {
                adults: params.adults || 2,
                children: params.children || []
            }
        ];
        const searchBody = {
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            pax,
            stars: params.stars || null,
            limit: params.limit || null,
            ShowExtendedData: true
        };
        if (params.hotelName) {
            searchBody.hotelName = params.hotelName;
        } else if (params.city) {
            searchBody.city = params.city;
        }
        console.log("🌐 Making request to Medici API:");
        console.log("URL:", `${this.baseUrl}/api/hotels/GetInnstantSearchPrice`);
        console.log("Body:", JSON.stringify(searchBody, null, 2));
        console.log("Token (first 20 chars):", this.token.substring(0, 20) + "...");
        try {
            const response = await this.request("/api/hotels/GetInnstantSearchPrice", {
                method: "POST",
                body: JSON.stringify(searchBody)
            });
            console.log("✅ Medici API response received, length:", JSON.stringify(response).length);
            const hotels = this.transformSearchResults(response);
            console.log("🏨 Transformed to", hotels.length, "hotels");
            return hotels.map((hotel)=>({
                    ...hotel,
                    requestJson: JSON.stringify(params),
                    responseJson: JSON.stringify(response)
                }));
        } catch (error) {
            console.error("❌ Medici API search failed:", error);
            // Return empty array instead of throwing - let the caller handle it
            return [];
        }
    }
    // =====================
    // STEP 2: PRE-BOOK
    // =====================
    async preBook(params) {
        const preBookBody = {
            jsonRequest: params.jsonRequest
        };
        const response = await this.request("/api/hotels/PreBook", {
            method: "POST",
            body: JSON.stringify(preBookBody)
        });
        if (response._status === 204) {
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
        const token = response?.content?.services?.hotels?.[0]?.token || response?.token || response?.preBookToken || "";
        const preBookId = response?.opportunityId || response?.preBookId || response?.id || 0;
        const priceConfirmed = response?.content?.services?.hotels?.[0]?.netPrice?.amount || response?.content?.services?.hotels?.[0]?.price?.amount || response?.price?.amount || 0;
        const currency = response?.content?.services?.hotels?.[0]?.netPrice?.currency || response?.content?.services?.hotels?.[0]?.price?.currency || "USD";
        const isSuccess = token || response?.status === "done";
        return {
            success: isSuccess,
            preBookId,
            token,
            status: response?.status || (isSuccess ? "done" : "failed"),
            priceConfirmed,
            currency,
            requestJson: params.jsonRequest,
            responseJson: response
        };
    }
    // =====================
    // STEP 3: BOOK
    // =====================
    async book(params) {
        const bookBody = {
            jsonRequest: params.jsonRequest
        };
        try {
            const response = await this.request("/api/hotels/Book", {
                method: "POST",
                body: JSON.stringify(bookBody)
            });
            console.log('[DEBUG] Book API Response:', JSON.stringify(response, null, 2));
            const bookingID = response?.bookRes?.content?.bookingID || response?.content?.bookingID || response?.bookingId || response?.bookingID || "";
            const supplierReference = response?.bookRes?.content?.services?.[0]?.supplier?.reference || response?.content?.services?.[0]?.supplier?.reference || response?.supplierReference || "";
            const status = response?.bookRes?.content?.status || response?.content?.status || response?.status || "";
            console.log('[DEBUG] Parsed:', {
                bookingID,
                supplierReference,
                status
            });
            const isSuccess = status === "confirmed";
            return {
                success: isSuccess,
                bookingId: String(bookingID),
                supplierReference,
                status
            };
        } catch (error) {
            return {
                success: false,
                bookingId: "",
                supplierReference: "",
                status: "failed",
                error: error.message
            };
        }
    }
    // =====================
    // MANUAL BOOK (by code)
    // =====================
    async manualBook(params) {
        try {
            const response = await this.request("/api/hotels/ManualBook", {
                method: "POST",
                body: JSON.stringify({
                    opportunityId: params.opportunityId,
                    code: params.code
                })
            });
            return {
                success: response?.success || response?.bookingId,
                bookingId: String(response?.bookingId || ""),
                status: "confirmed"
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // =====================
    // CANCEL BOOKING
    // =====================
    async cancelBooking(preBookId) {
        try {
            await this.request(`/api/hotels/CancelRoomActive?prebookId=${preBookId}`, {
                method: "DELETE"
            });
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // =====================
    // ROOM MANAGEMENT
    // =====================
    async getActiveRooms(params) {
        const response = await this.request("/api/hotels/GetRoomsActive", {
            method: "POST",
            body: JSON.stringify(params || {})
        });
        return Array.isArray(response) ? response : [];
    }
    async getSoldRooms(params) {
        const response = await this.request("/api/hotels/GetRoomsSales", {
            method: "POST",
            body: JSON.stringify(params || {})
        });
        return Array.isArray(response) ? response : [];
    }
    async getCancelledRooms(params) {
        const response = await this.request("/api/hotels/GetRoomsCancel", {
            method: "POST",
            body: JSON.stringify(params || {})
        });
        return Array.isArray(response) ? response : [];
    }
    // =====================
    // DASHBOARD
    // =====================
    async getDashboardInfo(params) {
        const response = await this.request("/api/hotels/GetDashboardInfo", {
            method: "POST",
            body: JSON.stringify(params || {})
        });
        return response || {};
    }
    // =====================
    // OPPORTUNITIES
    // =====================
    async getOpportunities(params) {
        const response = await this.request("/api/hotels/GetOpportunities", {
            method: "POST",
            body: JSON.stringify(params || {})
        });
        return Array.isArray(response) ? response : [];
    }
    async insertOpportunity(params) {
        try {
            const response = await this.request("/api/hotels/InsertOpportunity", {
                method: "POST",
                body: JSON.stringify(params)
            });
            return {
                success: true,
                opportunityId: response?.opportunityId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // =====================
    // PRICE UPDATE
    // =====================
    async updatePushPrice(preBookId, pushPrice) {
        try {
            await this.request("/api/hotels/UpdateRoomsActivePushPrice", {
                method: "POST",
                body: JSON.stringify({
                    preBookId,
                    pushPrice
                })
            });
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // =====================
    // ARCHIVE
    // =====================
    async getRoomArchive(params) {
        const response = await this.request("/api/hotels/GetRoomArchiveData", {
            method: "POST",
            body: JSON.stringify({
                ...params,
                pageNumber: params.pageNumber || 1,
                pageSize: params.pageSize || 50
            })
        });
        return {
            data: response?.data || [],
            totalCount: response?.totalCount || 0
        };
    }
    async refreshToken() {
        try {
            const formData = new URLSearchParams();
            formData.append("client_secret", process.env.MEDICI_CLIENT_SECRET || "zlbgGGxz~|l3.Q?XXAT)uT!Lty,kJC>R?`:k?oQH$I=P7rL<R:Em:qDaM1G(jFU7");
            const response = await fetch(`${this.baseUrl}/api/auth/OnlyNightUsersTokenAPI`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            this.token = data.token || data.access_token || data.aether_access_token;
            return this.token;
        } catch (error) {
            console.error("Failed to refresh token:", error.message);
            throw error;
        }
    }
    transformSearchResults(response) {
        if (!response) {
            return [];
        }
        let items = [];
        if (Array.isArray(response)) {
            items = response;
        } else if (response.items && Array.isArray(response.items)) {
            items = response.items;
        } else if (response.data && Array.isArray(response.data)) {
            items = response.data;
        }
        const hotelMap = new Map();
        for (const item of items){
            // Support new Medici format with ShowExtendedData
            const hotelIdRaw = item.id || item.hotelId || item.hotelCode || item.HotelId || item.hotel_id || item.items?.[0]?.hotelId || 0;
            const hotelId = typeof hotelIdRaw === "number" ? hotelIdRaw : Number.parseInt(String(hotelIdRaw), 10) || 0;
            const hotelName = item.name || item.hotelName || item.HotelName || item.items?.[0]?.hotelName || "Unknown Hotel";
            // Extract facilities from new format (facilities.list or facilities.tags)
            let facilitiesList = [];
            if (item.facilities) {
                if (Array.isArray(item.facilities)) {
                    facilitiesList = item.facilities;
                } else if (item.facilities.list && Array.isArray(item.facilities.list)) {
                    facilitiesList = item.facilities.list;
                } else if (item.facilities.tags && Array.isArray(item.facilities.tags)) {
                    facilitiesList = item.facilities.tags;
                }
            }
            if (!hotelMap.has(hotelId)) {
                hotelMap.set(hotelId, {
                    hotelId,
                    hotelName,
                    hotelImage: getHotelMainImage(item),
                    images: buildImagesArray(item),
                    location: item.address || item.location || "",
                    city: item.city || extractCityFromDestinations(item) || "",
                    stars: item.stars || item.rating || 0,
                    address: item.address || "",
                    description: item.description || "",
                    facilities: facilitiesList,
                    phone: item.phone || "",
                    fax: item.fax || "",
                    lat: item.lat || 0,
                    lon: item.lon || 0,
                    seoname: item.seoname || "",
                    rooms: []
                });
            }
            const hotel = hotelMap.get(hotelId);
            const roomItems = item.items || [
                item
            ];
            for(let roomIdx = 0; roomIdx < roomItems.length; roomIdx++){
                const roomItem = roomItems[roomIdx];
                const possibleCodeFields = [
                    roomItem.code,
                    roomItem.Code,
                    roomItem.roomCode,
                    roomItem.RoomCode,
                    roomItem.rateKey,
                    roomItem.RateKey,
                    roomItem.bookingCode,
                    roomItem.BookingCode,
                    roomItem.optionCode,
                    roomItem.OptionCode,
                    roomItem.key,
                    roomItem.Key,
                    roomItem.id?.toString(),
                    roomItem.rate?.code,
                    roomItem.rate?.key,
                    roomItem.option?.code,
                    roomItem.booking?.code
                ];
                let roomCode = "";
                for (const codeField of possibleCodeFields){
                    if (codeField && typeof codeField === "string" && codeField.length > 0) {
                        roomCode = codeField;
                        break;
                    }
                }
                if (!roomCode) {
                    const tempCode = `TEMP-${hotelId}-${roomItem.id || Date.now()}-${roomIdx}`;
                    roomCode = tempCode;
                }
                // Extract price from room item first, then fallback to parent item (hotel level)
                let price = extractPriceFromRoom(roomItem);
                if (price === 0) {
                    price = extractPriceFromRoom(item); // Fallback to hotel-level price
                }
                hotel.rooms.push({
                    code: roomCode,
                    roomId: String(roomItem.id || roomItem.roomId || `${hotel.hotelId}-${hotel.rooms.length + 1}`),
                    roomName: roomItem.name || roomItem.roomName || "Standard Room",
                    roomCategory: roomItem.category || roomItem.roomType || "standard",
                    categoryId: roomItem.categoryId || roomItem.category_id || 1,
                    roomImage: getRoomMainImage(roomItem) || hotel.hotelImage,
                    images: buildRoomImagesArray(roomItem),
                    bedding: roomItem.bedding || "",
                    board: roomItem.board || "RO",
                    boardId: roomItem.boardId || getBoardIdFromCode(roomItem.board || "RO"),
                    boardType: roomItem.board || "RO",
                    maxOccupancy: roomItem.pax?.adults || roomItem.maxOccupancy || 2,
                    size: roomItem.size || roomItem.roomSize || 0,
                    view: roomItem.view || "",
                    amenities: roomItem.amenities || roomItem.facilities || [],
                    price: price,
                    buyPrice: price,
                    originalPrice: price > 0 ? Math.round(price * 1.15) : 0,
                    currency: roomItem.currency || item.price?.currency || item.netPrice?.currency || "USD",
                    cancellationPolicy: formatCancellationPolicy(item.cancellation) || roomItem.cancellationPolicy || "free",
                    cancellation: item.cancellation || null,
                    available: roomItem.quantity?.max || roomItem.available || 1,
                    requestJson: item.code || roomItem.code || roomCode,
                    pax: roomItem.pax || {
                        adults: 2,
                        children: []
                    },
                    confirmation: item.confirmation || "on_request",
                    paymentType: item.paymentType || "pre",
                    providers: item.providers || [],
                    specialOffers: item.specialOffers || []
                });
            }
        }
        const results = Array.from(hotelMap.values());
        return results;
    }
}
const mediciApi = new MediciApiClient();
// =====================
// HELPER FUNCTIONS
// =====================
function buildFullImageUrl(imagePath) {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${MEDICI_IMAGES_BASE}${imagePath}`;
}
function getHotelMainImage(item) {
    if (item.imageUrl) return buildFullImageUrl(item.imageUrl);
    if (item.image) return buildFullImageUrl(item.image);
    if (item.mainImage) return buildFullImageUrl(item.mainImage);
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        const firstImage = item.images[0];
        if (typeof firstImage === "string") return buildFullImageUrl(firstImage);
        if (firstImage?.url) return buildFullImageUrl(firstImage.url);
        if (firstImage?.path) return buildFullImageUrl(firstImage.path);
    }
    if (item.items && item.items[0]?.images && item.items[0].images.length > 0) {
        return buildFullImageUrl(item.items[0].images[0]);
    }
    return "";
}
function buildImagesArray(item) {
    const images = [];
    if (item.images && Array.isArray(item.images)) {
        for (const img of item.images){
            if (typeof img === "string") {
                images.push(buildFullImageUrl(img));
            } else if (img?.url) {
                images.push(buildFullImageUrl(img.url));
            } else if (img?.path) {
                images.push(buildFullImageUrl(img.path));
            }
        }
    }
    if (item.items && item.items[0]?.images) {
        for (const img of item.items[0].images){
            if (typeof img === "string") {
                images.push(buildFullImageUrl(img));
            }
        }
    }
    return images.filter(Boolean);
}
function extractPriceFromRoom(room) {
    const priceLocations = [
        // Medici API uses netPrice as primary price field
        {
            name: "netPrice.amount",
            value: room.netPrice?.amount
        },
        {
            name: "price.amount",
            value: room.price?.amount
        },
        {
            name: "price.value",
            value: room.price?.value
        },
        {
            name: "price (direct)",
            value: room.price
        },
        {
            name: "buyPrice",
            value: room.buyPrice
        },
        {
            name: "sellPrice",
            value: room.sellPrice
        },
        {
            name: "totalPrice",
            value: room.totalPrice
        },
        {
            name: "amount",
            value: room.amount
        },
        {
            name: "rate.amount",
            value: room.rate?.amount
        },
        {
            name: "rate.value",
            value: room.rate?.value
        },
        {
            name: "rate (direct)",
            value: room.rate
        },
        {
            name: "cost",
            value: room.cost
        },
        {
            name: "netPrice",
            value: room.netPrice
        },
        {
            name: "grossPrice",
            value: room.grossPrice
        },
        {
            name: "Price",
            value: room.Price
        },
        {
            name: "BuyPrice",
            value: room.BuyPrice
        },
        {
            name: "SellPrice",
            value: room.SellPrice
        },
        {
            name: "TotalPrice",
            value: room.TotalPrice
        }
    ];
    for (const { name, value } of priceLocations){
        if (typeof value === "number" && value > 0) {
            return value;
        }
        if (typeof value === "string") {
            const parsed = Number.parseFloat(value);
            if (!isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
    }
    return 0;
}
function getRoomMainImage(room) {
    if (room.imageUrl) return buildFullImageUrl(room.imageUrl);
    if (room.image) return buildFullImageUrl(room.image);
    if (room.mainImage) return buildFullImageUrl(room.mainImage);
    if (room.images && Array.isArray(room.images) && room.images.length > 0) {
        const firstImage = room.images[0];
        if (typeof firstImage === "string") return buildFullImageUrl(firstImage);
        if (firstImage?.url) return buildFullImageUrl(firstImage.url);
        if (firstImage?.path) return buildFullImageUrl(firstImage.path);
    }
    return "";
}
function buildRoomImagesArray(room) {
    const images = [];
    if (room.images && Array.isArray(room.images)) {
        for (const img of room.images){
            if (typeof img === "string") {
                images.push(buildFullImageUrl(img));
            } else if (img?.url) {
                images.push(buildFullImageUrl(img.url));
            } else if (img?.path) {
                images.push(buildFullImageUrl(img.path));
            }
        }
    }
    return images.filter(Boolean);
}
function getBoardIdFromCode(boardCode) {
    for (const [id, board] of Object.entries(BOARD_TYPES)){
        if (board.code === boardCode) {
            return Number.parseInt(id, 10);
        }
    }
    return 0;
}
// Extract city from destinations array (new Medici format)
function extractCityFromDestinations(item) {
    if (item.destinations && Array.isArray(item.destinations)) {
        const cityDest = item.destinations.find((d)=>d.type === "city");
        if (cityDest?.destinationId) {
            return `City-${cityDest.destinationId}` // Will be resolved by enrichment
            ;
        }
    }
    if (item.surroundings && Array.isArray(item.surroundings)) {
        const citySurr = item.surroundings.find((s)=>s.type === "city");
        if (citySurr?.destinationId) {
            return `City-${citySurr.destinationId}`;
        }
    }
    return "";
}
// Format cancellation policy from new Medici format
function formatCancellationPolicy(cancellation) {
    if (!cancellation) return "free";
    if (cancellation.type === "fully-refundable") {
        return "free";
    } else if (cancellation.type === "non-refundable") {
        return "non-refundable";
    } else if (cancellation.type === "partially-refundable") {
        return "partial";
    }
    // Check frames for deadline
    if (cancellation.frames && Array.isArray(cancellation.frames)) {
        const freeFrame = cancellation.frames.find((f)=>f.penalty?.amount === 0);
        if (freeFrame) {
            const deadline = new Date(freeFrame.to);
            return `Free cancellation until ${deadline.toLocaleDateString()}`;
        }
    }
    return cancellation.type || "free";
}
}),
"[project]/lib/api/hotel-enrichment.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Hotel Data Enrichment Service
// Fetches additional hotel information from external sources when data is missing
__turbopack_context__.s([
    "enrichHotelData",
    ()=>enrichHotelData,
    "enrichHotels",
    ()=>enrichHotels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
;
async function enrichHotelData(hotelName, city, existingData) {
    const enrichment = {};
    // Check if we need to fetch anything
    const needsDescription = !existingData?.description || existingData.description.length < 50;
    const needsImages = !existingData?.images || existingData.images.length === 0;
    const needsFacilities = !existingData?.facilities || existingData.facilities.length === 0;
    if (!needsDescription && !needsImages && !needsFacilities) {
        // Data is complete, no enrichment needed
        return enrichment;
    }
    try {
        // Strategy 1: Try Google Places API (if API key is available)
        const googleData = await fetchFromGooglePlaces(hotelName, city);
        if (googleData) {
            if (needsDescription && googleData.description) {
                enrichment.description = googleData.description;
            }
            if (needsImages && googleData.images) {
                enrichment.images = googleData.images;
            }
            if (needsFacilities && googleData.facilities) {
                enrichment.facilities = googleData.facilities;
            }
            enrichment.rating = googleData.rating;
            enrichment.reviews = googleData.reviews;
        }
        // Strategy 2: Try Bing/DuckDuckGo Search API for basic info
        if (needsDescription && !enrichment.description) {
            const searchData = await fetchFromSearchEngine(hotelName, city);
            if (searchData?.description) {
                enrichment.description = searchData.description;
            }
        }
        // Strategy 3: Use AI to generate description if still missing
        if (needsDescription && !enrichment.description && existingData?.facilities && existingData.facilities.length > 0) {
            enrichment.description = generateDescriptionFromFacilities(hotelName, existingData.facilities, city);
        }
        return enrichment;
    } catch (error) {
        console.error("Hotel enrichment error:", error);
        return enrichment;
    }
}
/**
 * Fetch hotel data from Google Places API
 */ async function fetchFromGooglePlaces(hotelName, city) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return null;
    }
    try {
        // Step 1: Find Place
        const searchQuery = city ? `${hotelName} ${city}` : hotelName;
        const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
        const findResponse = await fetch(findPlaceUrl);
        const findData = await findResponse.json();
        if (!findData.candidates || findData.candidates.length === 0) {
            return null;
        }
        const placeId = findData.candidates[0].place_id;
        // Step 2: Get Place Details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,photos,editorial_summary,types,business_status&key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        if (!detailsData.result) {
            return null;
        }
        const result = detailsData.result;
        // Extract photos
        const images = [];
        if (result.photos) {
            for (const photo of result.photos.slice(0, 10)){
                const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photo.photo_reference}&key=${apiKey}`;
                images.push(photoUrl);
            }
        }
        return {
            description: result.editorial_summary?.overview || result.name,
            images,
            rating: result.rating,
            address: result.formatted_address,
            phone: result.formatted_phone_number,
            website: result.website,
            reviews: [
                {
                    rating: result.rating || 0,
                    count: result.user_ratings_total || 0,
                    source: "Google"
                }
            ]
        };
    } catch (error) {
        console.error("Google Places API error:", error);
        return null;
    }
}
/**
 * Fetch hotel data from search engines (Bing/DuckDuckGo)
 */ async function fetchFromSearchEngine(hotelName, city) {
    // Use Bing Search API if available
    const bingApiKey = process.env.BING_SEARCH_API_KEY;
    if (!bingApiKey) {
        return null;
    }
    try {
        const searchQuery = city ? `${hotelName} hotel ${city}` : `${hotelName} hotel`;
        const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(searchQuery)}&count=3`;
        const response = await fetch(url, {
            headers: {
                "Ocp-Apim-Subscription-Key": bingApiKey
            }
        });
        const data = await response.json();
        if (data.webPages?.value && data.webPages.value.length > 0) {
            // Extract description from first result
            const firstResult = data.webPages.value[0];
            return {
                description: firstResult.snippet || ""
            };
        }
        return null;
    } catch (error) {
        console.error("Bing Search API error:", error);
        return null;
    }
}
/**
 * Generate a description from facilities list when no other data is available
 */ function generateDescriptionFromFacilities(hotelName, facilities, city) {
    const location = city ? ` in ${city}` : "";
    const facilitiesText = facilities.slice(0, 5).join(", ");
    return `${hotelName}${location} offers modern accommodations with excellent facilities including ${facilitiesText}. The hotel provides comfortable rooms and quality services for both leisure and business travelers.`;
}
async function enrichHotels(hotels) {
    // Enrich in parallel with rate limiting
    const enrichmentPromises = hotels.map((hotel, index)=>// Add delay to avoid rate limiting
        new Promise((resolve)=>{
            setTimeout(async ()=>{
                const enrichment = await enrichHotelData(hotel.hotelName, hotel.city, {
                    description: hotel.description,
                    images: hotel.images,
                    facilities: hotel.facilities,
                    address: hotel.address
                });
                resolve(enrichment);
            }, index * 200); // 200ms delay between requests
        }));
    return Promise.all(enrichmentPromises);
}
/**
 * Simple fallback: Use Wikipedia/DBpedia for hotel info
 */ async function fetchFromWikipedia(hotelName) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(hotelName)}&limit=1&format=json`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data && data[2] && data[2][0]) {
            return {
                description: data[2][0]
            };
        }
        return null;
    } catch (error) {
        console.error("Wikipedia API error:", error);
        return null;
    }
}
}),
"[project]/app/api/hotels/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/api/medici-client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$hotel$2d$enrichment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/hotel-enrichment.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        console.log("🔥 REAL API - Body received:", JSON.stringify(body, null, 2));
        const { hotelName, city, adults, children, stars, limit } = body;
        const dateFrom = body.dateFrom || body.checkIn;
        const dateTo = body.dateTo || body.checkOut;
        const cityParam = body.city || body.destination;
        console.log("🔍 Searching Medici API for:", {
            hotelName,
            city: cityParam,
            dateFrom,
            dateTo
        });
        if (!dateFrom || !dateTo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "dateFrom and dateTo are required"
            }, {
                status: 400
            });
        }
        if (!hotelName && !cityParam) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Either hotelName or city is required"
            }, {
                status: 400
            });
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["mediciApi"].searchHotels({
            dateFrom,
            dateTo,
            hotelName: hotelName || undefined,
            city: cityParam || undefined,
            adults: adults || 2,
            children: children || [],
            stars: stars ? Number(stars) : undefined,
            limit: limit ? Number(limit) : 20
        });
        console.log("🎯 Medici API returned:", results.length, "results");
        const groupedResults = await Promise.all(results.map(async (hotel)=>{
            let hotelId = 0;
            if (typeof hotel.hotelId === "number" && hotel.hotelId > 0) {
                hotelId = hotel.hotelId;
            } else if (typeof hotel.hotelId === "string" && hotel.hotelId) {
                hotelId = Number.parseInt(hotel.hotelId, 10) || 0;
            }
            const mappedRooms = (hotel.rooms || []).map((room, index)=>{
                const roomCode = room.code || room.rateKey || room.roomCode || "";
                return {
                    code: roomCode,
                    roomId: String(room.roomId || room.id || index + 1),
                    roomName: room.roomName || room.name || "Standard Room",
                    roomCategory: room.roomCategory || room.roomType || room.category || "standard",
                    categoryId: room.categoryId || getCategoryIdFromName(room.roomCategory || room.roomType),
                    boardId: room.boardId || getBoardIdFromCode(room.board || room.boardType),
                    boardType: room.boardType || room.board || "RO",
                    buyPrice: typeof room.buyPrice === "number" ? room.buyPrice : typeof room.price === "object" && room.price?.amount ? Number(room.price.amount) : Number(room.price) || 0,
                    originalPrice: Number(room.originalPrice) || 0,
                    currency: room.currency || (typeof room.price === "object" ? room.price?.currency : undefined) || "ILS",
                    maxOccupancy: room.maxOccupancy || room.pax?.adults || 2,
                    size: room.size || room.roomSize || 0,
                    view: room.view || "",
                    bedding: room.bedding || "",
                    amenities: room.amenities || room.facilities || [],
                    images: room.images || [],
                    cancellationPolicy: room.cancellationPolicy || "free",
                    available: room.available || room.quantity?.max || 1,
                    requestJson: room.requestJson || roomCode
                };
            });
            let enrichedDescription = hotel.description || "";
            let enrichedImages = hotel.images || [];
            let enrichedFacilities = hotel.facilities || hotel.amenities || [];
            const needsEnrichment = !enrichedDescription || enrichedDescription.length < 50 || enrichedImages.length === 0 || enrichedFacilities.length === 0;
            if (needsEnrichment) {
                try {
                    const enrichment = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$hotel$2d$enrichment$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enrichHotelData"])(hotel.hotelName || hotel.name || "Unknown Hotel", hotel.city, {
                        description: enrichedDescription,
                        images: enrichedImages,
                        facilities: enrichedFacilities,
                        address: hotel.address
                    });
                    if (enrichment.description && !enrichedDescription) {
                        enrichedDescription = enrichment.description;
                    }
                    if (enrichment.images && enrichedImages.length === 0) {
                        enrichedImages = enrichment.images;
                    }
                    if (enrichment.facilities && enrichedFacilities.length === 0) {
                        enrichedFacilities = enrichment.facilities;
                    }
                } catch (error) {
                    console.error("Enrichment failed for hotel:", hotel.hotelName, error);
                }
            }
            return {
                hotelId,
                hotelName: hotel.hotelName || hotel.name || "Unknown Hotel",
                city: hotel.city || "",
                stars: hotel.stars || hotel.rating || 0,
                address: hotel.address || hotel.location || "",
                imageUrl: hotel.hotelImage || hotel.imageUrl || enrichedImages[0] || "",
                images: enrichedImages,
                description: enrichedDescription,
                facilities: enrichedFacilities,
                rooms: mappedRooms,
                requestJson: hotel.requestJson,
                responseJson: hotel.responseJson
            };
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: groupedResults,
            count: groupedResults.length
        });
    } catch (error) {
        console.error("Search API Error:", error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Failed to search hotels"
        }, {
            status: 500
        });
    }
}
function getCategoryIdFromName(category) {
    const categories = {
        standard: 1,
        superior: 2,
        deluxe: 3,
        suite: 4,
        "junior suite": 5,
        family: 6
    };
    return categories[category?.toLowerCase()] || 1;
}
function getBoardIdFromCode(boardCode) {
    const boards = {
        ro: 1,
        bb: 2,
        hb: 3,
        fb: 4,
        ai: 5
    };
    return boards[boardCode?.toLowerCase()] || 1;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__46ffd8db._.js.map