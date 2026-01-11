import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import Employee from '@/models/Employee';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // format: YYYY-MM

        let startDate: Date, endDate: Date;

        if (month) {
            const [year, m] = month.split('-').map(Number);
            startDate = new Date(year, m - 1, 1);
            endDate = new Date(year, m, 0); // Last day of month
        } else {
            // Default to current month
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        // Get all employees
        const employees = await Employee.find({ status: 'active' });

        // Get all attendance records for the month
        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        });

        // Calculate stats for each employee
        const report = employees.map(emp => {
            const empAttendance = attendanceRecords.filter(
                a => a.employee.toString() === emp._id.toString()
            );

            const present = empAttendance.filter(a => a.status === 'present').length;
            const absent = empAttendance.filter(a => a.status === 'absent').length;
            const late = empAttendance.filter(a => a.status === 'late').length;
            const halfDay = empAttendance.filter(a => a.status === 'half_day').length;
            const onLeave = empAttendance.filter(a => a.status === 'on_leave').length;
            const totalHours = empAttendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);

            return {
                employee: {
                    _id: emp._id,
                    name: `${emp.firstName} ${emp.lastName}`,
                    department: emp.department,
                    role: emp.role
                },
                stats: {
                    present,
                    absent,
                    late,
                    halfDay,
                    onLeave,
                    totalDays: present + late + halfDay,
                    totalHours: Math.round(totalHours * 10) / 10,
                    attendanceRate: Math.round((present + late + halfDay) / (present + absent + late + halfDay + onLeave || 1) * 100)
                }
            };
        });

        return NextResponse.json({
            month: month || `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
            startDate,
            endDate,
            report
        });
    } catch (error) {
        console.error("Report Error:", error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
