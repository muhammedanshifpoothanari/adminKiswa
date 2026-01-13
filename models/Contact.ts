import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
    type: 'Lead' | 'Client' | 'Partner' | 'Other';
    status: 'Active' | 'Inactive';
    notes?: string;
}

const ContactSchema = new Schema<IContact>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    role: { type: String },
    type: { type: String, enum: ['Lead', 'Client', 'Partner', 'Other'], default: 'Lead' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes: { type: String }
}, { timestamps: true });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
