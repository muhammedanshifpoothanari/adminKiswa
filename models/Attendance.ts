import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
    employee: mongoose.Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
    notes?: string;
    hoursWorked?: number;
}

const AttendanceSchema = new Schema<IAttendance>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half_day', 'on_leave'],
        default: 'present'
    },
    notes: String,
    hoursWorked: Number
}, { timestamps: true });

// Compound index to prevent duplicate attendance records per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;
