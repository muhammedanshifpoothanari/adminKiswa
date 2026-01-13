import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Ensure model is registered

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category');
        const query: any = {};

        if (categoryId) {
            query.category = categoryId;
        }

        // Pre-load category to confirm model registration
        if (!mongoose.models.Category) {
            console.log("Registering Category model...", Category);
        }
        const products = await Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 });
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
