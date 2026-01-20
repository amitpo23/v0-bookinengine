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
                return {};
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
            const bookingID = response?.bookRes?.content?.bookingID || response?.content?.bookingID || response?.bookingId || response?.bookingID || "";
            const supplierReference = response?.bookRes?.content?.services?.[0]?.supplier?.reference || response?.content?.services?.[0]?.supplier?.reference || response?.supplierReference || "";
            const status = response?.bookRes?.content?.status || response?.content?.status || response?.status || "";
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
                const price = extractPriceFromRoom(roomItem);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/api/medici-client.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$knowaa$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/knowaa-client.ts [app-route] (ecmascript)");
;
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
            // Use existing mediciApi client which works
            const results = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$medici$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["mediciApi"].searchHotels({
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
            const results = await knowaaClient.searchHotels({
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
            const result = await knowaaClient.preBook({
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
            const result = await knowaaClient.book({
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

//# sourceMappingURL=%5Broot-of-the-server%5D__727cee5e._.js.map