import { NextResponse } from 'next/server';
import { getEvents, AnalyticsEvent } from '@/lib/analytics-storage';

export async function GET() {
    try {
        const events = await getEvents();

        const totalPageViews = events.filter(e => e.eventType === 'page_view').length;
        const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

        // Top Products
        const productViews = events
            .filter(e => e.eventType === 'product_view')
            .reduce((acc, event) => {
                const name = event.metadata?.name || 'Unknown Product';
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const topProducts = Object.entries(productViews)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Device Usage
        const deviceUsage = events
            .filter(e => e.eventType === 'page_view')
            .reduce((acc, event) => {
                const type = event.device?.type || 'unknown';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const deviceStats = Object.entries(deviceUsage).map(([name, value]) => ({ name, value }));

        // Recent Activity
        const recentActivity = events
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);

        return NextResponse.json({
            totalPageViews,
            uniqueSessions,
            topProducts,
            deviceStats,
            recentActivity
        });
    } catch (error) {
        console.error('Error getting analytics stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
