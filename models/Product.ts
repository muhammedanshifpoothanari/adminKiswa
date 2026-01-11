import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    sku: string;
    description?: string;
    features: string[];
    price: number;
    currency: string;
    salePrice?: number;
    costPrice?: number;
    stock: number;
    inStock: boolean;
    category: mongoose.Types.ObjectId;
    images: string[];
    specifications: Map<string, string>;
    isPublished: boolean;
    isFeatured: boolean;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String },
    features: [{ type: String }],
    price: { type: Number, required: true },
    currency: { type: String, default: 'SAR' },
    salePrice: { type: Number },
    costPrice: { type: Number },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    specifications: { type: Map, of: String },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
