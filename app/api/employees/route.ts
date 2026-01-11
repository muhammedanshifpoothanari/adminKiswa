import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function GET() {
    try {
        await dbConnect();
        const employees = await Employee.find({}).sort({ createdAt: -1 });
        return NextResponse.json(employees);
    } catch (error) {
        console.error("Employees GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const employee = await Employee.create(body);
        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        console.error("Employees POST Error:", error);
        return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
}
