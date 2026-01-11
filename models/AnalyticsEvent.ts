import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsEvent extends Document {
    eventType: string;
    url: string;
    timestamp: Date;
    sessionId: string;
    userId?: string;
    ip?: string;

    // Detailed Device Info
    device: {
        type?: string; // mobile, tablet, console, smarttv, wearable, embedded
        vendor?: string;
        model?: string;
    };
    os: {
        name?: string;
        version?: string;
    };
    browser: {
        name?: string;
        version?: string;
        major?: string;
    };
    engine: {
        name?: string;
        version?: string;
    };
    cpu: {
        architecture?: string;
    };

    // Location
    location: {
        country?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        timezone?: string;
    };

    metadata?: any;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
    eventType: { type: String, required: true, index: true },
    url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    sessionId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    ip: { type: String },

    device: {
        type: { type: String },
        vendor: { type: String },
        model: { type: String }
    },
    os: {
        name: { type: String },
        version: { type: String }
    },
    browser: {
        name: { type: String },
        version: { type: String },
        major: { type: String }
    },
    engine: {
        name: { type: String },
        version: { type: String }
    },
    cpu: {
        architecture: { type: String }
    },

    location: {
        country: { type: String },
        region: { type: String },
        city: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        timezone: { type: String }
    },

    metadata: { type: Schema.Types.Mixed }
});

// Prevent model recompilation error in Next.js hot reload
const AnalyticsEvent: Model<IAnalyticsEvent> = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

export default AnalyticsEvent;
