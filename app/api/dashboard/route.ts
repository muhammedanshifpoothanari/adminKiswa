import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import Product from '@/models/Product';
import AnalyticsEvent from '@/models/AnalyticsEvent';

export async function GET() {
    try {
        await dbConnect();

        // Get current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total Revenue this month
        const ordersThisMonth = await Order.find({
            createdAt: { $gte: startOfMonth },
            paymentStatus: 'paid'
        });
        const revenueThisMonth = ordersThisMonth.reduce((sum, o) => sum + (o.total || 0), 0);

        // Total Revenue last month
        const ordersLastMonth = await Order.find({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            paymentStatus: 'paid'
        });
        const revenueLastMonth = ordersLastMonth.reduce((sum, o) => sum + (o.total || 0), 0);

        // Revenue change percentage
        const revenueChange = revenueLastMonth > 0
            ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
            : '0';

        // Total Orders
        const totalOrders = await Order.countDocuments();
        const ordersThisMonthCount = ordersThisMonth.length;
        const ordersLastMonthCount = ordersLastMonth.length;
        const orderChange = ordersLastMonthCount > 0
            ? ((ordersThisMonthCount - ordersLastMonthCount) / ordersLastMonthCount * 100).toFixed(1)
            : '0';

        // Total Customers
        const totalCustomers = await Customer.countDocuments();
        const customersThisMonth = await Customer.countDocuments({ createdAt: { $gte: startOfMonth } });
        const customersLastMonth = await Customer.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });
        const customerChange = customersLastMonth > 0
            ? ((customersThisMonth - customersLastMonth) / customersLastMonth * 100).toFixed(1)
            : '0';

        // Active Sessions (from analytics - last 30 minutes)
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        const activeSessions = await AnalyticsEvent.distinct('sessionId', {
            timestamp: { $gte: thirtyMinsAgo }
        });

        // Recent Orders
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'firstName lastName');

        // Top Products by order count
        const topProductsAgg = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.name', totalSales: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total' } } },
            { $sort: { totalSales: -1 } },
            { $limit: 4 }
        ]);

        // Format top products
        const topProducts = topProductsAgg.map(p => ({
            name: p._id || 'Unknown Product',
            sales: p.totalSales,
            revenue: p.revenue
        }));

        // Total Products
        const totalProducts = await Product.countDocuments();

        return NextResponse.json({
            stats: {
                revenue: {
                    value: revenueThisMonth,
                    change: parseFloat(revenueChange as string),
                    trend: parseFloat(revenueChange as string) >= 0 ? 'up' : 'down'
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
            recentOrders: recentOrders.map(o => ({
                _id: o._id,
                orderNumber: o.orderNumber,
                customer: o.customer ? `${(o.customer as any).firstName} ${(o.customer as any).lastName}` : 'Guest',
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
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
