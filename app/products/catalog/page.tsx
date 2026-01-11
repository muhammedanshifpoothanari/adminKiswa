'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';

interface ProductType {
    _id: string;
    name: string;
    slug: string;
    description: string;
    features: string[];
    price: number;
    currency: string;
    category: { name: string };
    images: string[];
    specifications: Record<string, string>;
}

export default function CatalogPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const catalogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    function handlePrint() {
        window.print();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Hidden in Print */}
            <div className="p-6 border-b flex justify-between items-center print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Product Catalog</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                    </Button>
                </div>
            </div>

            {/* Catalog Content */}
            <div ref={catalogRef} className="p-8 max-w-4xl mx-auto">
                {/* Cover Page */}
                <div className="text-center py-16 border-b mb-8 print:page-break-after">
                    <h1 className="text-5xl font-bold tracking-tight mb-4">KISWA</h1>
                    <p className="text-xl text-gray-500 uppercase tracking-widest">Product Catalog 2026</p>
                    <p className="mt-8 text-sm text-gray-400">Premium Prayer Essentials</p>
                </div>

                {/* Products */}
                <div className="space-y-12">
                    {products.map((product, index) => (
                        <div key={product._id} className="print:page-break-inside-avoid">
                            <div className="grid md:grid-cols-2 gap-8 py-8 border-b">
                                {/* Image */}
                                <div className="space-y-4">
                                    {product.images?.[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                    )}
                                    {product.images?.length > 1 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.images.slice(1, 4).map((img, i) => (
                                                <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                                            {product.category?.name}
                                        </p>
                                        <h2 className="text-2xl font-bold">{product.name}</h2>
                                        <p className="text-2xl font-semibold mt-2">
                                            {product.price} {product.currency}
                                        </p>
                                    </div>

                                    <p className="text-gray-600">{product.description}</p>

                                    {product.features?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-sm uppercase tracking-wider mb-2">Features</h4>
                                            <ul className="space-y-1">
                                                {product.features.map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <span className="text-black">•</span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {Object.keys(product.specifications || {}).length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-sm uppercase tracking-wider mb-2">Specifications</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {Object.entries(product.specifications).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-gray-400">{key}:</span>{' '}
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <p className="text-xs text-gray-400">SKU: {product.slug}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center py-16 mt-8 print:page-break-before">
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="text-gray-600">For wholesale inquiries and custom orders</p>
                    <p className="mt-4 text-lg font-medium">info@kiswa.store</p>
                    <p className="text-sm text-gray-400 mt-8">© 2026 KISWA. All Rights Reserved.</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:page-break-after { page-break-after: always; }
                    .print\\:page-break-before { page-break-before: always; }
                    .print\\:page-break-inside-avoid { page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}
