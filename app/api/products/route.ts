import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Ensure model is registered

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        // Pre-load category to confirm model registration
        const products = await Product.find({}).populate('category', 'name slug').sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Product GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Product POST Error:", error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
