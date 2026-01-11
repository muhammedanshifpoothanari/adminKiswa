import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET() {
    try {
        await dbConnect();
        const companies = await Company.find({}).sort({ createdAt: -1 });
        return NextResponse.json(companies);
    } catch (error) {
        console.error("CRM GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        // Ensure contacts is an array
        if (body.contact && !body.contacts) {
            body.contacts = [body.contact];
            delete body.contact;
        }

        const company = await Company.create(body);
        return NextResponse.json(company, { status: 201 });
    } catch (error) {
        console.error("CRM POST Error:", error);
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
    }
}
