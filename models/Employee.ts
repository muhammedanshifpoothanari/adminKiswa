import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    department: string;
    hireDate: Date;
    salary?: number;
    status: 'active' | 'inactive' | 'on_leave';
    avatar?: string;
    address?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    };
}

const EmployeeSchema = new Schema<IEmployee>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: { type: String, required: true },
    department: { type: String, required: true },
    hireDate: { type: Date, default: Date.now },
    salary: Number,
    status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
    avatar: String,
    address: String,
    emergencyContact: {
        name: String,
        phone: String,
        relation: String
    }
}, { timestamps: true });

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
export default Employee;
