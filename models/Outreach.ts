import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOutreach extends Document {
    company: mongoose.Types.ObjectId;
    employee: mongoose.Types.ObjectId;
    month: Date;
    activities: {
        type: 'call' | 'email' | 'meeting' | 'demo' | 'follow-up';
        date: Date;
        notes: string;
        outcome?: string;
    }[];
    status: 'active' | 'completed' | 'paused';
    notes: string;
}

const OutreachSchema = new Schema<IOutreach>({
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Date, required: true },
    activities: [{
        type: { type: String, enum: ['call', 'email', 'meeting', 'demo', 'follow-up'] },
        date: { type: Date, default: Date.now },
        notes: String,
        outcome: String
    }],
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    notes: String
}, { timestamps: true });

const Outreach: Model<IOutreach> = mongoose.models.Outreach || mongoose.model<IOutreach>('Outreach', OutreachSchema);
export default Outreach;
