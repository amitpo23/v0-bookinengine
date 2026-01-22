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
// IMPORTANT: Use hardcoded token (UserId:11, expires 2066) - DO NOT use env variable as it may have old token
const MEDICI_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJQZXJtaXNzaW9ucyI6IjEiLCJVc2VySWQiOiIxMSIsIm5iZiI6MTc2ODQ1NzU5NSwiZXhwIjoyMDgzOTkwMzk1LCJpc3MiOiJodHRwczovL2FkbWluLm1lZGljaWhvdGVscy5jb20vIiwiYXVkIjoiaHR0cHM6Ly9hZG1pbi5tZWRpY2lob3RlbHMuY29tLyJ9.g-CO7I75BlowE-F3J3GqlXsbIgNtG8_w2v1WMwG6djE";
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
        const response = await this.request("/api/hotels/GetInnstantSearchPrice", {
            method: "POST",
            body: JSON.stringify(searchBody)
        });
        const hotels = this.transformSearchResults(response);
        return hotels.map((hotel)=>({
                ...hotel,
                requestJson: params,
                responseJson: response
            }));
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
"[project]/lib/demo/demo-mode.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_MODE",
    ()=>DEMO_MODE,
    "mockBook",
    ()=>mockBook,
    "mockPreBook",
    ()=>mockPreBook
]);
const DEMO_MODE = ("TURBOPACK compile-time value", "false") === "true";
async function mockPreBook() {
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    return {
        success: true,
        preBookId: Math.floor(Math.random() * 100000),
        token: `DEMO_TOKEN_${Date.now()}`,
        status: "done",
        priceConfirmed: 1200,
        currency: "ILS",
        requestJson: '{"demo":"prebook"}',
        responseJson: '{"status":"success"}'
    };
}
async function mockBook() {
    await new Promise((resolve)=>setTimeout(resolve, 1500));
    return {
        success: true,
        bookingId: `DEMO${Date.now()}`,
        supplierReference: `REF${Math.floor(Math.random() * 1000000)}`,
        status: "confirmed"
    };
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/prettier/plugins/html [external] (prettier/plugins/html, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("prettier/plugins/html");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/prettier/standalone [external] (prettier/standalone, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("prettier/standalone");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/emails/booking-confirmation.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingConfirmationEmail",
    ()=>BookingConfirmationEmail,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/body/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$button$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/button/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/container/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/head/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/heading/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/hr/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/html/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/link/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/preview/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/section/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/text/dist/index.mjs [app-route] (ecmascript)");
;
;
const BookingConfirmationEmail = ({ customerName = "John Doe", bookingId = "BK123456", supplierReference = "HTL789", hotelName = "Grand Hotel", roomType = "Deluxe Room", checkIn = "2024-12-25", checkOut = "2024-12-28", nights = 3, adults = 2, children = 0, totalPrice = 450, currency = "USD", hotelAddress = "123 Main St, City", hotelPhone = "+1-555-0123", cancellationPolicy = "Free cancellation until 24 hours before check-in", language = "en" })=>{
    const isHebrew = language === "he";
    const content = {
        en: {
            subject: "Booking Confirmation",
            greeting: `Dear ${customerName},`,
            confirmed: "Your booking has been confirmed! 🎉",
            details: "Booking Details",
            bookingNumber: "Booking Number",
            confirmationNumber: "Confirmation Number",
            hotel: "Hotel",
            room: "Room Type",
            dates: "Check-in / Check-out",
            duration: "Duration",
            guests: "Guests",
            total: "Total Price",
            policy: "Cancellation Policy",
            contact: "Hotel Contact",
            address: "Address",
            phone: "Phone",
            viewBooking: "View Booking",
            questions: "Questions?",
            support: "Contact our support team",
            footer: "Thank you for choosing our booking service!",
            night: "night",
            nights: "nights",
            adult: "adult",
            adults: "adults",
            child: "child",
            children: "children"
        },
        he: {
            subject: "אישור הזמנה",
            greeting: `${customerName} שלום,`,
            confirmed: "!ההזמנה שלך אושרה 🎉",
            details: "פרטי ההזמנה",
            bookingNumber: "מספר הזמנה",
            confirmationNumber: "מספר אישור",
            hotel: "מלון",
            room: "סוג חדר",
            dates: "צ'ק-אין / צ'ק-אאוט",
            duration: "משך השהייה",
            guests: "אורחים",
            total: "מחיר כולל",
            policy: "מדיניות ביטול",
            contact: "פרטי התקשרות למלון",
            address: "כתובת",
            phone: "טלפון",
            viewBooking: "צפה בהזמנה",
            questions: "יש שאלות?",
            support: "צור קשר עם תמיכה",
            footer: "תודה שבחרת בשירות ההזמנות שלנו!",
            night: "לילה",
            nights: "לילות",
            adult: "מבוגר",
            adults: "מבוגרים",
            child: "ילד",
            children: "ילדים"
        }
    };
    const t = content[language];
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr);
        return isHebrew ? date.toLocaleDateString("he-IL", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }) : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    const guestsText = `${adults} ${adults === 1 ? t.adult : t.adults}${children > 0 ? `, ${children} ${children === 1 ? t.child : t.children}` : ""}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Html"], {
        dir: isHebrew ? "rtl" : "ltr",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Head"], {}, void 0, false, {
                fileName: "[project]/emails/booking-confirmation.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Preview"], {
                children: [
                    t.confirmed,
                    " ",
                    bookingId
                ]
            }, void 0, true, {
                fileName: "[project]/emails/booking-confirmation.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Body"], {
                style: main,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Container"], {
                    style: container,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: header,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                style: h1,
                                children: t.confirmed
                            }, void 0, false, {
                                fileName: "[project]/emails/booking-confirmation.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                            style: text,
                            children: t.greeting
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                            style: text,
                            children: isHebrew ? "ההזמנה שלך בוצעה בהצלחה. להלן פרטי ההזמנה:" : "Your booking has been successfully completed. Here are your booking details:"
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: detailsBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                    as: "h2",
                                    style: h2,
                                    children: t.details
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: table,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.bookingNumber,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: bookingId
                                                        }, void 0, false, {
                                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.confirmationNumber,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: supplierReference
                                                        }, void 0, false, {
                                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 162,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.hotel,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: hotelName
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.room,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: roomType
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.dates,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: [
                                                            formatDate(checkIn),
                                                            " - ",
                                                            formatDate(checkOut)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 176,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.duration,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: [
                                                            nights,
                                                            " ",
                                                            nights === 1 ? t.night : t.nights
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 182,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.guests,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: guestsText
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 188,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.total,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            style: price,
                                                            children: [
                                                                currency,
                                                                " ",
                                                                totalPrice.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/booking-confirmation.tsx",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                    as: "h3",
                                    style: h3,
                                    children: t.contact
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: contactText,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: hotelName
                                    }, void 0, false, {
                                        fileName: "[project]/emails/booking-confirmation.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                hotelAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: contactText,
                                    children: [
                                        t.address,
                                        ": ",
                                        hotelAddress
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                hotelPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: contactText,
                                    children: [
                                        t.phone,
                                        ": ",
                                        hotelPhone
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        cancellationPolicy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                                    style: hr
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                            as: "h3",
                                            style: h3,
                                            children: t.policy
                                        }, void 0, false, {
                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                            style: policyText,
                                            children: cancellationPolicy
                                        }, void 0, false, {
                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: buttonContainer,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$button$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Button"], {
                                style: button,
                                href: `${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`,
                                children: t.viewBooking
                            }, void 0, false, {
                                fileName: "[project]/emails/booking-confirmation.tsx",
                                lineNumber: 241,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 240,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footer,
                                    children: [
                                        t.questions,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "mailto:support@example.com",
                                            children: t.support
                                        }, void 0, false, {
                                            fileName: "[project]/emails/booking-confirmation.tsx",
                                            lineNumber: 251,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footer,
                                    children: t.footer
                                }, void 0, false, {
                                    fileName: "[project]/emails/booking-confirmation.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/booking-confirmation.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/emails/booking-confirmation.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/emails/booking-confirmation.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/emails/booking-confirmation.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = BookingConfirmationEmail;
// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};
const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
    borderRadius: "8px"
};
const header = {
    padding: "32px 20px",
    backgroundColor: "#4F46E5",
    borderRadius: "8px 8px 0 0"
};
const h1 = {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0",
    padding: "0",
    textAlign: "center"
};
const h2 = {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 20px"
};
const h3 = {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 12px"
};
const text = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 20px"
};
const detailsBox = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
    margin: "20px"
};
const table = {
    width: "100%",
    borderCollapse: "collapse"
};
const labelCell = {
    color: "#6b7280",
    fontSize: "14px",
    paddingBottom: "12px",
    paddingRight: "16px",
    verticalAlign: "top",
    width: "40%"
};
const valueCell = {
    color: "#1f2937",
    fontSize: "14px",
    paddingBottom: "12px",
    fontWeight: "500"
};
const price = {
    color: "#4F46E5",
    fontSize: "18px",
    fontWeight: "700"
};
const contactText = {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "4px 20px"
};
const policyText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0 20px",
    fontStyle: "italic"
};
const hr = {
    borderColor: "#e5e7eb",
    margin: "20px 0"
};
const buttonContainer = {
    textAlign: "center",
    margin: "32px 0"
};
const button = {
    backgroundColor: "#4F46E5",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    padding: "12px 32px"
};
const footer = {
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center",
    margin: "8px 20px"
};
}),
"[project]/emails/cancellation-confirmation.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CancellationConfirmationEmail",
    ()=>CancellationConfirmationEmail,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/body/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/container/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/head/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/heading/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/hr/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/html/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/preview/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/section/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/text/dist/index.mjs [app-route] (ecmascript)");
;
;
const CancellationConfirmationEmail = ({ customerName = "John Doe", bookingId = "BK123456", hotelName = "Grand Hotel", checkIn = "2024-12-25", checkOut = "2024-12-28", totalPrice = 450, currency = "USD", refundAmount, refundDate, cancellationReason, language = "en" })=>{
    const isHebrew = language === "he";
    const content = {
        en: {
            subject: "Booking Cancellation Confirmed",
            greeting: `Dear ${customerName},`,
            cancelled: "Your booking has been cancelled",
            message: "We confirm that your booking has been successfully cancelled.",
            details: "Cancelled Booking Details",
            bookingNumber: "Booking Number",
            hotel: "Hotel",
            dates: "Original Dates",
            originalPrice: "Original Price",
            refund: "Refund Information",
            refundAmount: "Refund Amount",
            refundDate: "Expected Refund Date",
            noRefund: "This booking was non-refundable. No refund will be issued.",
            reason: "Cancellation Reason",
            sorry: "We're sorry to see you go!",
            future: "We hope to serve you again in the future.",
            questions: "Questions about your cancellation?",
            support: "Contact our support team at support@example.com"
        },
        he: {
            subject: "אישור ביטול הזמנה",
            greeting: `${customerName} שלום,`,
            cancelled: "ההזמנה שלך בוטלה",
            message: "אנו מאשרים שההזמנה שלך בוטלה בהצלחה.",
            details: "פרטי ההזמנה המבוטלת",
            bookingNumber: "מספר הזמנה",
            hotel: "מלון",
            dates: "תאריכים מקוריים",
            originalPrice: "מחיר מקורי",
            refund: "מידע על החזר כספי",
            refundAmount: "סכום החזר",
            refundDate: "תאריך החזר משוער",
            noRefund: "הזמנה זו הייתה ללא אפשרות החזר. לא יינתן החזר כספי.",
            reason: "סיבת הביטול",
            sorry: "!אנו מצטערים לראותך עוזב",
            future: "נשמח לארח אותך שוב בעתיד.",
            questions: "יש שאלות לגבי הביטול?",
            support: "support@example.com צור קשר עם תמיכה בכתובת"
        }
    };
    const t = content[language];
    const formatDate = (dateStr)=>{
        const date = new Date(dateStr);
        return isHebrew ? date.toLocaleDateString("he-IL", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }) : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Html"], {
        dir: isHebrew ? "rtl" : "ltr",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Head"], {}, void 0, false, {
                fileName: "[project]/emails/cancellation-confirmation.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Preview"], {
                children: [
                    t.cancelled,
                    " - ",
                    bookingId
                ]
            }, void 0, true, {
                fileName: "[project]/emails/cancellation-confirmation.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Body"], {
                style: main,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Container"], {
                    style: container,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: header,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                style: h1,
                                children: t.cancelled
                            }, void 0, false, {
                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                            style: text,
                            children: t.greeting
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                            style: text,
                            children: t.message
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: detailsBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                    as: "h2",
                                    style: h2,
                                    children: t.details
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: table,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.bookingNumber,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: bookingId
                                                        }, void 0, false, {
                                                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 121,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.hotel,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: hotelName
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.dates,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: [
                                                            formatDate(checkIn),
                                                            " - ",
                                                            formatDate(checkOut)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.originalPrice,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: [
                                                            currency,
                                                            " ",
                                                            totalPrice.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        cancellationReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: reasonBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                    as: "h3",
                                    style: h3,
                                    children: t.reason
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 150,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: reasonText,
                                    children: cancellationReason
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            style: refundBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Heading"], {
                                    as: "h2",
                                    style: h2,
                                    children: t.refund
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                refundAmount && refundAmount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: table,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.refundAmount,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            style: refundPrice,
                                                            children: [
                                                                currency,
                                                                " ",
                                                                refundAmount.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 167,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            refundDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: labelCell,
                                                        children: [
                                                            t.refundDate,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: valueCell,
                                                        children: formatDate(refundDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/emails/cancellation-confirmation.tsx",
                                                lineNumber: 176,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/emails/cancellation-confirmation.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: noRefundText,
                                    children: t.noRefund
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Hr"], {
                            style: hr
                        }, void 0, false, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Section"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: sorryText,
                                    children: t.sorry
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: text,
                                    children: t.future
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footer,
                                    children: t.questions
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footer,
                                    children: t.support
                                }, void 0, false, {
                                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/emails/cancellation-confirmation.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/emails/cancellation-confirmation.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/emails/cancellation-confirmation.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/emails/cancellation-confirmation.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CancellationConfirmationEmail;
// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};
const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
    borderRadius: "8px"
};
const header = {
    padding: "32px 20px",
    backgroundColor: "#DC2626",
    borderRadius: "8px 8px 0 0"
};
const h1 = {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0",
    padding: "0",
    textAlign: "center"
};
const h2 = {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 20px"
};
const h3 = {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 12px"
};
const text = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 20px"
};
const detailsBox = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
    margin: "20px"
};
const reasonBox = {
    margin: "20px"
};
const reasonText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
    fontStyle: "italic"
};
const refundBox = {
    backgroundColor: "#fef3c7",
    border: "1px solid #fbbf24",
    borderRadius: "8px",
    padding: "24px",
    margin: "20px"
};
const table = {
    width: "100%",
    borderCollapse: "collapse"
};
const labelCell = {
    color: "#6b7280",
    fontSize: "14px",
    paddingBottom: "12px",
    paddingRight: "16px",
    verticalAlign: "top",
    width: "40%"
};
const valueCell = {
    color: "#1f2937",
    fontSize: "14px",
    paddingBottom: "12px",
    fontWeight: "500"
};
const refundPrice = {
    color: "#059669",
    fontSize: "18px",
    fontWeight: "700"
};
const noRefundText = {
    color: "#DC2626",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
    fontWeight: "500"
};
const hr = {
    borderColor: "#e5e7eb",
    margin: "20px 0"
};
const sorryText = {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
    margin: "20px"
};
const footer = {
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center",
    margin: "8px 20px"
};
}),
"[project]/lib/email/email-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Email Service - Simplified version for sending emails via Resend
 * Renders React Email templates and sends them directly
 * No database queue - simple and safe
 */ __turbopack_context__.s([
    "EmailService",
    ()=>EmailService,
    "emailService",
    ()=>emailService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-email/render/dist/node/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$emails$2f$booking$2d$confirmation$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/emails/booking-confirmation.tsx [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$emails$2f$cancellation$2d$confirmation$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/emails/cancellation-confirmation.tsx [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'bookings@youraitravelagent.com';
const FROM_NAME = process.env.FROM_NAME || 'Booking Engine';
class EmailService {
    resend = null;
    enabled = false;
    constructor(){
        if (RESEND_API_KEY) {
            this.resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](RESEND_API_KEY);
            this.enabled = true;
            console.log('[Email] Service initialized with Resend');
        } else {
            console.warn('[Email] RESEND_API_KEY not configured - emails disabled');
        }
    }
    isEnabled() {
        return this.enabled;
    }
    /**
   * Send booking confirmation email
   */ async sendBookingConfirmation(params) {
        if (!this.enabled || !this.resend) {
            console.warn('[Email] Cannot send email - service not configured');
            return {
                success: false,
                error: 'Email service not configured'
            };
        }
        try {
            const isHebrew = params.language === 'he';
            const subject = isHebrew ? `אישור הזמנה ${params.bookingId}` : `Booking Confirmation ${params.bookingId}`;
            const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["render"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$emails$2f$booking$2d$confirmation$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(params));
            console.log('[Email] Sending booking confirmation', {
                to: params.to,
                bookingId: params.bookingId
            });
            const result = await this.resend.emails.send({
                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                to: params.to,
                subject,
                html
            });
            console.log('[Email] ✅ Booking confirmation sent', {
                to: params.to,
                emailId: result.data?.id
            });
            return {
                success: true,
                emailId: result.data?.id
            };
        } catch (error) {
            console.error('[Email] ❌ Failed to send booking confirmation', {
                to: params.to,
                error: error.message
            });
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
   * Send cancellation confirmation email
   */ async sendCancellationConfirmation(params) {
        if (!this.enabled || !this.resend) {
            console.warn('[Email] Cannot send email - service not configured');
            return {
                success: false,
                error: 'Email service not configured'
            };
        }
        try {
            const isHebrew = params.language === 'he';
            const subject = isHebrew ? `אישור ביטול הזמנה ${params.bookingId}` : `Booking Cancellation ${params.bookingId}`;
            const html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["render"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$emails$2f$cancellation$2d$confirmation$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(params));
            console.log('[Email] Sending cancellation confirmation', {
                to: params.to,
                bookingId: params.bookingId
            });
            const result = await this.resend.emails.send({
                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                to: params.to,
                subject,
                html
            });
            console.log('[Email] ✅ Cancellation confirmation sent', {
                to: params.to,
                emailId: result.data?.id
            });
            return {
                success: true,
                emailId: result.data?.id
            };
        } catch (error) {
            console.error('[Email] ❌ Failed to send cancellation confirmation', {
                to: params.to,
                error: error.message
            });
            return {
                success: false,
                error: error.message
            };
        }
    }
}
const emailService = new EmailService();
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/booking/book/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/api/medici-client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2f$demo$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demo/demo-mode.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email/email-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-route] (ecmascript) <locals>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function POST(request) {
    try {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2f$demo$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_MODE"]) {
            const mockResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2f$demo$2d$mode$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockBook"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockResult);
        }
        const body = await request.json();
        const { jsonRequest } = body;
        if (!jsonRequest || typeof jsonRequest !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "jsonRequest is required - must be from PreBook response",
                received: {
                    jsonRequest: typeof jsonRequest
                }
            }, {
                status: 400
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["mediciApi"].book({
            jsonRequest
        });
        if (!result.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: result.error || "Booking failed"
            }, {
                status: 400
            });
        }
        // Parse the jsonRequest to extract booking details for email
        let bookingDetails = {};
        try {
            bookingDetails = JSON.parse(jsonRequest);
        } catch (e) {
            console.warn("[Book API] Could not parse jsonRequest for email", e);
        }
        // Send confirmation email (non-blocking)
        if (result.bookingId && result.supplierReference && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailService"].isEnabled()) {
            const customer = bookingDetails.customer;
            const service = bookingDetails.services?.[0];
            const searchRequest = service?.searchRequest;
            const bookingRequest = service?.bookingRequest?.[0];
            if (customer && searchRequest && bookingRequest) {
                const checkInDate = searchRequest.dates?.from || new Date().toISOString();
                const checkOutDate = searchRequest.dates?.to || new Date().toISOString();
                const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
                // Send email asynchronously (don't wait for it)
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailService"].sendBookingConfirmation({
                    to: customer.contact?.email || bookingDetails.reference?.voucherEmail,
                    customerName: `${customer.name?.first} ${customer.name?.last}`,
                    bookingId: result.bookingId,
                    supplierReference: result.supplierReference,
                    hotelName: "Hotel Name",
                    roomType: bookingRequest.code || "Room",
                    checkIn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(checkInDate), "MMM dd, yyyy"),
                    checkOut: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(checkOutDate), "MMM dd, yyyy"),
                    nights,
                    adults: searchRequest.pax?.[0]?.adults || 1,
                    children: searchRequest.pax?.[0]?.children?.length || 0,
                    totalPrice: result.totalPrice || 0,
                    currency: searchRequest.currencies?.[0] || "USD",
                    language: "en"
                }).then((emailResult)=>{
                    if (emailResult.success) {
                        console.log("[Book API] ✅ Confirmation email sent", {
                            bookingId: result.bookingId,
                            emailId: emailResult.emailId
                        });
                    } else {
                        console.warn("[Book API] ⚠️ Email failed (non-critical)", emailResult.error);
                    }
                }).catch((error)=>{
                    console.error("[Book API] Email error (non-critical):", error);
                });
            } else {
                console.warn("[Book API] Missing email data, skipping email");
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            bookingId: result.bookingId,
            supplierReference: result.supplierReference,
            status: result.status
        });
    } catch (error) {
        console.error("Book API Error:", error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Booking failed"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__54ccba0e._.js.map