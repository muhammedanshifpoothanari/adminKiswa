import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer'; // Ensure model loaded

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const orders = await Order.find({})
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const order = await Order.create(body);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order Create Error", error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(_id, updateData, { new: true });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order Update Error", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
