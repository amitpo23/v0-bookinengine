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
"[project]/lib/promotions/promotions-db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addPromotion",
    ()=>addPromotion,
    "calculateDiscount",
    ()=>calculateDiscount,
    "deletePromotion",
    ()=>deletePromotion,
    "getActivePromotions",
    ()=>getActivePromotions,
    "getAllPromotions",
    ()=>getAllPromotions,
    "getPromotionById",
    ()=>getPromotionById,
    "updatePromotion",
    ()=>updatePromotion
]);
const promotions = [
    {
        id: "MOBILE_FLASH_2024",
        title: "מבצע פלאש - הזמנה מהמובייל!",
        description: "קבלו 20% הנחה על כל ההזמנות מהמובייל - מוגבל לשעות הקרובות בלבד!",
        discountType: "percentage",
        discountValue: 20,
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        mobileOnly: true,
        active: true,
        imageUrl: "/mobile-flash-sale.jpg",
        terms: "ההנחה תקפה להזמנות מהמובייל בלבד. לא ניתן לשלב עם מבצעים אחרים."
    },
    {
        id: "EARLY_BIRD_2024",
        title: "מבצע הזמנה מוקדמת",
        description: "הזמינו 30 יום מראש וקבלו 15% הנחה!",
        discountType: "percentage",
        discountValue: 15,
        minNights: 2,
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        mobileOnly: false,
        active: true,
        imageUrl: "/early-bird-discount.jpg",
        terms: "ההנחה תקפה להזמנות של 2 לילות לפחות. תאריכי שהייה לפי זמינות."
    },
    {
        id: "WEEKEND_SPECIAL",
        title: 'מבצע סופ"ש',
        description: '500 ₪ הנחה על חבילות סופ"ש!',
        discountType: "fixed",
        discountValue: 500,
        minNights: 2,
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        mobileOnly: false,
        active: true,
        imageUrl: "/weekend-getaway.png",
        terms: "תקף לשישי-שבת בלבד. מינימום 2 לילות."
    }
];
function getAllPromotions() {
    return promotions.filter((p)=>p.active);
}
function getActivePromotions(isMobile) {
    return promotions.filter((p)=>{
        if (!p.active) return false;
        if (p.mobileOnly && !isMobile) return false;
        const now = new Date();
        const validFrom = new Date(p.validFrom);
        const validTo = new Date(p.validTo);
        return now >= validFrom && now <= validTo;
    });
}
function getPromotionById(id) {
    return promotions.find((p)=>p.id === id);
}
function addPromotion(promotion) {
    promotions.push(promotion);
}
function updatePromotion(id, updates) {
    const index = promotions.findIndex((p)=>p.id === id);
    if (index === -1) return false;
    promotions[index] = {
        ...promotions[index],
        ...updates
    };
    return true;
}
function deletePromotion(id) {
    const index = promotions.findIndex((p)=>p.id === id);
    if (index === -1) return false;
    promotions.splice(index, 1);
    return true;
}
function calculateDiscount(promotion, price, nights) {
    if (promotion.minNights && nights < promotion.minNights) {
        return {
            discountAmount: 0,
            finalPrice: price
        };
    }
    let discountAmount = 0;
    if (promotion.discountType === "percentage") {
        discountAmount = price * promotion.discountValue / 100;
    } else {
        discountAmount = promotion.discountValue;
    }
    discountAmount = Math.min(discountAmount, price);
    const finalPrice = Math.max(0, price - discountAmount);
    return {
        discountAmount,
        finalPrice
    };
}
}),
"[project]/app/api/admin/promotions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$promotions$2f$promotions$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/promotions/promotions-db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const template = searchParams.get("template");
    const promotions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$promotions$2f$promotions$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllPromotions"])();
    // Transform to expected format for admin
    const formattedPromotions = promotions.map((p)=>({
            id: p.id,
            code: p.id,
            title: p.title,
            description: p.description,
            discountType: p.discountType,
            discountValue: p.discountValue,
            minNights: p.minNights,
            validFrom: p.validFrom,
            validTo: p.validTo,
            usageCount: 0,
            maxUsage: undefined,
            active: p.active,
            mobileOnly: p.mobileOnly
        }));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        promotions: formattedPromotions
    });
}
async function POST(request) {
    try {
        const promotion = await request.json();
        if (!promotion.id || !promotion.title) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$promotions$2f$promotions$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addPromotion"])(promotion);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: promotion
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to create promotion"
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const { id, ...updates } = await request.json();
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Missing promotion ID"
            }, {
                status: 400
            });
        }
        const success = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$promotions$2f$promotions$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updatePromotion"])(id, updates);
        if (!success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Promotion not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to update promotion"
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Missing promotion ID"
            }, {
                status: 400
            });
        }
        const success = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$promotions$2f$promotions$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deletePromotion"])(id);
        if (!success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Promotion not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to delete promotion"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__292055b3._.js.map