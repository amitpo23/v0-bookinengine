(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Rate limiting using in-memory store (for production, use Redis)
const rateLimitStore = new Map();
const RATE_LIMIT = {
    windowMs: 60 * 1000,
    maxRequests: 100
};
function getClientId(request) {
    // Get IP from various headers (for production behind proxy)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return ip;
}
function checkRateLimit(clientId) {
    const now = Date.now();
    const client = rateLimitStore.get(clientId);
    if (!client || now > client.resetTime) {
        // New window
        rateLimitStore.set(clientId, {
            count: 1,
            resetTime: now + RATE_LIMIT.windowMs
        });
        return true;
    }
    if (client.count >= RATE_LIMIT.maxRequests) {
        return false // Rate limit exceeded
        ;
    }
    client.count++;
    return true;
}
// Cleanup old entries every 5 minutes
setInterval(()=>{
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()){
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);
function middleware(request) {
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // Rate Limiting (for API routes)
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const clientId = getClientId(request);
        if (!checkRateLimit(clientId)) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                error: 'Too many requests',
                message: 'אתה מבצע יותר מדי בקשות. נסה שוב בעוד דקה.'
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '60'
                }
            });
        }
    }
    // CSRF Protection for state-changing methods
    if ([
        'POST',
        'PUT',
        'DELETE',
        'PATCH'
    ].includes(request.method)) {
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        // Allow same-origin requests
        if (origin && host && new URL(origin).host !== host) {
            // In production, verify CSRF token
            const csrfToken = request.headers.get('x-csrf-token');
            if (!csrfToken && request.nextUrl.pathname.startsWith('/api/')) {
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                    error: 'CSRF token missing',
                    message: 'בקשה לא חוקית'
                }), {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
    }
    return response;
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */ '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map