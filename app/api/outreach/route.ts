import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Outreach from '@/models/Outreach';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const employeeId = searchParams.get('employeeId');

        let query: any = {};
        if (month) {
            const [year, m] = month.split('-').map(Number);
            query.month = {
                $gte: new Date(year, m - 1, 1),
                $lt: new Date(year, m, 1)
            };
        }
        if (employeeId) query.employee = employeeId;

        const outreach = await Outreach.find(query)
            .populate('company', 'name industry')
            .populate('employee', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(outreach);
    } catch (error) {
        console.error("Outreach GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch outreach records' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const outreach = await Outreach.create(body);
        return NextResponse.json(outreach, { status: 201 });
    } catch (error) {
        console.error("Outreach POST Error:", error);
        return NextResponse.json({ error: 'Failed to create outreach' }, { status: 500 });
    }
}
