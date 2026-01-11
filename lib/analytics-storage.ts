import dbConnect from '@/lib/mongodb';
import AnalyticsEvent, { IAnalyticsEvent } from '@/models/AnalyticsEvent';

// We just re-export the interface for convenience
export type { IAnalyticsEvent as AnalyticsEvent };

export async function getEvents(): Promise<IAnalyticsEvent[]> {
    try {
        await dbConnect();
        // Return plain objects to avoid serialization issues with Next.js Client Components if passed directly
        // Sort by timestamp desc
        const events = await AnalyticsEvent.find({}).sort({ timestamp: -1 }).lean();

        // Convert _id and Date objects to string if needed, but for now returned as is.
        // If passing to client, need to serialize.
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Failed to read events from MongoDB:", error);
        return [];
    }
}
