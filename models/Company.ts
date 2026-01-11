import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    industry: string;
    location: string;
    valuation: string;
    status: 'prospect' | 'mql' | 'sql' | 'won' | 'lost';
    stage: 'Lead' | 'MQL' | 'MAL' | 'SAL' | 'Deal Won' | 'Repeat Client';

    // Multiple Contacts/Employees
    contacts: {
        name: string;
        role: string;
        email: string;
        phone: string;
    }[];

    // Additional Fields
    notes: string[];
    emailHistory: {
        subject: string;
        date: Date;
        body: string;
    }[];
    links: string[];
    previousOrders: mongoose.Types.ObjectId[];

    logo?: string;
    assignedEmployee?: mongoose.Types.ObjectId;
}

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    industry: String,
    location: String,
    valuation: String,
    status: { type: String, enum: ['prospect', 'mql', 'sql', 'won', 'lost'], default: 'prospect' },
    stage: { type: String, enum: ['Lead', 'MQL', 'MAL', 'SAL', 'Deal Won', 'Repeat Client'], default: 'Lead' },

    contacts: [{
        name: String,
        role: String,
        email: String,
        phone: String
    }],

    notes: [{ type: String }],
    emailHistory: [{
        subject: String,
        date: { type: Date, default: Date.now },
        body: String
    }],
    links: [{ type: String }],
    previousOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

    logo: String,
    assignedEmployee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
export default Company;
