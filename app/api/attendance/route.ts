import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let query: any = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        }

        const attendance = await Attendance.find(query)
            .populate('employee', 'firstName lastName')
            .sort({ date: -1 });

        return NextResponse.json(attendance);
    } catch (error) {
        console.error("Attendance GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        // Calculate hours worked if check-in and check-out are provided
        if (body.checkIn && body.checkOut) {
            const checkIn = new Date(body.checkIn);
            const checkOut = new Date(body.checkOut);
            body.hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }

        // Upsert - update if exists, create if not
        const attendance = await Attendance.findOneAndUpdate(
            { employee: body.employee, date: new Date(body.date).setHours(0, 0, 0, 0) },
            body,
            { upsert: true, new: true }
        );

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        console.error("Attendance POST Error:", error);
        return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
    }
}
