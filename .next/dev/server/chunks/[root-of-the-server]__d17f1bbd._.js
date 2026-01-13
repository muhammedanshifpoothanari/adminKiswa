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
"[project]/models/Order.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const OrderSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items: [
        {
            product: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            price: Number,
            total: Number
        }
    ],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        ],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'paid',
            'failed',
            'refunded'
        ],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        country: String
    },
    notes: String
}, {
    timestamps: true
});
const Order = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Order || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Order', OrderSchema);
const __TURBOPACK__default__export__ = Order;
}),
"[project]/models/Customer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const CustomerSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
            type: {
                type: String,
                enum: [
                    'billing',
                    'shipping'
                ],
                default: 'shipping'
            }
        }
    ],
    totalSpent: {
        type: Number,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    lastOrderDate: {
        type: Date
    }
}, {
    timestamps: true
});
const Customer = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Customer || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Customer', CustomerSchema);
const __TURBOPACK__default__export__ = Customer;
}),
"[project]/models/Product.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const ProductSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    features: [
        {
            type: String
        }
    ],
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'SAR'
    },
    salePrice: {
        type: Number
    },
    costPrice: {
        type: Number
    },
    stock: {
        type: Number,
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    category: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    specifications: {
        type: Map,
        of: String
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Product = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Product || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Product', ProductSchema);
const __TURBOPACK__default__export__ = Product;
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
"[project]/app/api/dashboard/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Order.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Customer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Product.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AnalyticsEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/AnalyticsEvent.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Get current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        // Total Revenue this month
        const ordersThisMonth = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            createdAt: {
                $gte: startOfMonth
            },
            paymentStatus: 'paid'
        });
        const revenueThisMonth = ordersThisMonth.reduce((sum, o)=>sum + (o.total || 0), 0);
        // Total Revenue last month
        const ordersLastMonth = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            createdAt: {
                $gte: startOfLastMonth,
                $lte: endOfLastMonth
            },
            paymentStatus: 'paid'
        });
        const revenueLastMonth = ordersLastMonth.reduce((sum, o)=>sum + (o.total || 0), 0);
        // Revenue change percentage
        const revenueChange = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1) : '0';
        // Total Orders
        const totalOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const ordersThisMonthCount = ordersThisMonth.length;
        const ordersLastMonthCount = ordersLastMonth.length;
        const orderChange = ordersLastMonthCount > 0 ? ((ordersThisMonthCount - ordersLastMonthCount) / ordersLastMonthCount * 100).toFixed(1) : '0';
        // Total Customers
        const totalCustomers = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        const customersThisMonth = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            createdAt: {
                $gte: startOfMonth
            }
        });
        const customersLastMonth = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            createdAt: {
                $gte: startOfLastMonth,
                $lte: endOfLastMonth
            }
        });
        const customerChange = customersLastMonth > 0 ? ((customersThisMonth - customersLastMonth) / customersLastMonth * 100).toFixed(1) : '0';
        // Active Sessions (from analytics - last 30 minutes)
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        const activeSessions = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AnalyticsEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].distinct('sessionId', {
            timestamp: {
                $gte: thirtyMinsAgo
            }
        });
        // Recent Orders
        const recentOrders = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
            createdAt: -1
        }).limit(5).populate('customer', 'firstName lastName');
        // Top Products by order count
        const topProductsAgg = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: '$items.name',
                    totalSales: {
                        $sum: '$items.quantity'
                    },
                    revenue: {
                        $sum: '$items.total'
                    }
                }
            },
            {
                $sort: {
                    totalSales: -1
                }
            },
            {
                $limit: 4
            }
        ]);
        // Format top products
        const topProducts = topProductsAgg.map((p)=>({
                name: p._id || 'Unknown Product',
                sales: p.totalSales,
                revenue: p.revenue
            }));
        // Total Products
        const totalProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            stats: {
                revenue: {
                    value: revenueThisMonth,
                    change: parseFloat(revenueChange),
                    trend: parseFloat(revenueChange) >= 0 ? 'up' : 'down'
                },
                orders: {
                    value: totalOrders,
                    thisMonth: ordersThisMonthCount,
                    change: parseFloat(orderChange),
                    trend: parseFloat(orderChange) >= 0 ? 'up' : 'down'
                },
                customers: {
                    value: totalCustomers,
                    thisMonth: customersThisMonth,
                    change: parseFloat(customerChange),
                    trend: parseFloat(customerChange) >= 0 ? 'up' : 'down'
                },
                activeSessions: activeSessions.length,
                products: totalProducts
            },
            recentOrders: recentOrders.map((o)=>({
                    _id: o._id,
                    orderNumber: o.orderNumber,
                    customer: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : 'Guest',
                    total: o.total,
                    status: o.status,
                    paymentStatus: o.paymentStatus,
                    itemCount: o.items?.length || 0,
                    createdAt: o.createdAt
                })),
            topProducts
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch dashboard data'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d17f1bbd._.js.map