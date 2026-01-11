import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Outreach from '@/models/Outreach';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const outreach = await Outreach.findById(id)
            .populate('company')
            .populate('employee');
        if (!outreach) {
            return NextResponse.json({ error: 'Outreach not found' }, { status: 404 });
        }
        return NextResponse.json(outreach);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch outreach' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const outreach = await Outreach.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(outreach);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update outreach' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        await Outreach.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Outreach deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete outreach' }, { status: 500 });
    }
}
