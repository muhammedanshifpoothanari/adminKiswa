module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

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
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kiswastore';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/models/AnalyticsEvent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const AnalyticsEventSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    eventType: {
        type: String,
        required: true,
        index: true
    },
    url: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        index: true
    },
    ip: {
        type: String
    },
    device: {
        type: {
            type: String
        },
        vendor: {
            type: String
        },
        model: {
            type: String
        }
    },
    os: {
        name: {
            type: String
        },
        version: {
            type: String
        }
    },
    browser: {
        name: {
            type: String
        },
        version: {
            type: String
        },
        major: {
            type: String
        }
    },
    engine: {
        name: {
            type: String
        },
        version: {
            type: String
        }
    },
    cpu: {
        architecture: {
            type: String
        }
    },
    location: {
        country: {
            type: String
        },
        region: {
            type: String
        },
        city: {
            type: String
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        timezone: {
            type: String
        }
    },
    metadata: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.Mixed
    }
});
// Prevent model recompilation error in Next.js hot reload
const AnalyticsEvent = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.AnalyticsEvent || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('AnalyticsEvent', AnalyticsEventSchema);
const __TURBOPACK__default__export__ = AnalyticsEvent;
}),
"[project]/lib/analytics-storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEvents",
    ()=>getEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AnalyticsEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/AnalyticsEvent.ts [app-route] (ecmascript)");
;
;
async function getEvents() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Return plain objects to avoid serialization issues with Next.js Client Components if passed directly
        // Sort by timestamp desc
        const events = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AnalyticsEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
            timestamp: -1
        }).lean();
        // Convert _id and Date objects to string if needed, but for now returned as is.
        // If passing to client, need to serialize.
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Failed to read events from MongoDB:", error);
        return [];
    }
}
}),
"[project]/app/api/analytics/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/analytics-storage.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const events = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analytics$2d$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEvents"])();
        const totalPageViews = events.filter((e)=>e.eventType === 'page_view').length;
        const uniqueSessions = new Set(events.map((e)=>e.sessionId)).size;
        // Top Products
        const productViews = events.filter((e)=>e.eventType === 'product_view').reduce((acc, event)=>{
            const name = event.metadata?.name || 'Unknown Product';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});
        const topProducts = Object.entries(productViews).map(([name, count])=>({
                name,
                count
            })).sort((a, b)=>b.count - a.count).slice(0, 5);
        // Device Usage
        const deviceUsage = events.filter((e)=>e.eventType === 'page_view').reduce((acc, event)=>{
            const type = event.device?.type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        const deviceStats = Object.entries(deviceUsage).map(([name, value])=>({
                name,
                value
            }));
        // Recent Activity
        const recentActivity = events.sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            totalPageViews,
            uniqueSessions,
            topProducts,
            deviceStats,
            recentActivity
        });
    } catch (error) {
        console.error('Error getting analytics stats:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6b0fe35c._.js.map