import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    addresses: {
        street: string;
        city: string;
        state?: string;
        zip?: string;
        country: string;
        type: 'billing' | 'shipping';
    }[];
    totalSpent: number;
    orderCount: number;
    lastOrderDate?: Date;
}

const CustomerSchema = new Schema<ICustomer>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        type: { type: String, enum: ['billing', 'shipping'], default: 'shipping' }
    }],
    totalSpent: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    lastOrderDate: { type: Date }
}, { timestamps: true });

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
