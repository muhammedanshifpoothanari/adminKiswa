'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Grid, List, LayoutTemplate, AlignJustify, Award, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

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
    const [viewMode, setViewMode] = useState<'detailed' | 'grid' | 'magazine' | 'minimal'>('grid');

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    function handlePrint() {
        window.print();
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header - Hidden in Print */}
            <div className="p-6 border-b bg-white flex justify-between items-center sticky top-0 z-10 print:hidden shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
                        <p className="text-sm text-gray-500">{products.length} Products Available</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex bg-gray-100 p-1 rounded-lg mr-4 border">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-md ${viewMode === 'magazine' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('magazine')}
                            title="Magazine View"
                        >
                            <LayoutTemplate className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-md ${viewMode === 'detailed' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('detailed')}
                            title="Detailed View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-md ${viewMode === 'minimal' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('minimal')}
                            title="Minimal View"
                        >
                            <AlignJustify className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print / PDF
                    </Button>
                </div>
            </div>

            {/* Catalog Content */}
            <div ref={catalogRef} className={`p-8 mx-auto bg-white min-h-[calc(100vh-80px)] ${viewMode === 'grid' ? 'max-w-[1600px]' : viewMode === 'magazine' ? 'max-w-[1200px]' : 'max-w-5xl'}`}>
                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden mb-12 bg-black text-white print:mb-8 print:rounded-none print:text-black print:bg-white text-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596403163704-5f564dc38662?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay print:hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 print:hidden"></div>

                    <div className="relative z-10 py-24 px-6 md:px-12 flex flex-col items-center justify-center min-h-[400px] print:min-h-0 print:py-0 print:block">
                        <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase print:hidden">
                            Official Catalog
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 print:text-5xl print:text-black">
                            KISWA
                        </h1>
                        <div className="h-1 w-24 bg-white/50 rounded-full mb-8 print:bg-black print:w-20 print:mx-auto"></div>
                        <p className="text-xl md:text-2xl font-light text-gray-200 tracking-[0.3em] uppercase max-w-2xl mx-auto leading-relaxed print:text-gray-500 print:text-sm print:tracking-widest">
                            Collection 2026
                        </p>
                        <p className="mt-6 text-sm md:text-base text-gray-300 font-medium max-w-lg mx-auto print:text-gray-400 print:mt-4">
                            Discover our premium selection of prayer essentials, crafted with tradition and elegance in mind.
                        </p>
                    </div>
                </div>

                {/* Quality Promise / Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 border-b pb-12 print:hidden">
                    {[
                        { icon: <Award className="w-6 h-6" />, title: "Premium Quality", desc: "Finest materials & craftsmanship" },
                        { icon: <ShieldCheck className="w-6 h-6" />, title: "Authentic Design", desc: "Respecting Islamic traditions" },
                        { icon: <Truck className="w-6 h-6" />, title: "Global Shipping", desc: "Delivered to your doorstep" },
                        { icon: <Sparkles className="w-6 h-6" />, title: "Exclusive Items", desc: "Unique designs found nowhere else" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-900">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View Modes */}

                {/* 1. GRID VIEW (Premium) */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 print:break-inside-avoid">
                                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-black border-0">
                                            {product.category?.name}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2 pr-2">{product.name}</h3>
                                        <p className="font-bold text-lg whitespace-nowrap">{product.price} <span className="text-xs font-normal text-gray-500">{product.currency}</span></p>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-mono">
                                        <span>SKU: {product.slug}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. MAGAZINE VIEW (Editorial) */}
                {viewMode === 'magazine' && (
                    <div className="space-y-24">
                        {products.map((product, index) => (
                            <div key={product._id} className="print:page-break-inside-avoid">
                                <div className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Image Side */}
                                    <div className="w-full md:w-1/2">
                                        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative shadow-2xl">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="w-full md:w-1/2 space-y-8">
                                        <div>
                                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block">{product.category?.name}</span>
                                            <h2 className="text-4xl font-serif font-medium mb-4">{product.name}</h2>
                                            <p className="text-3xl font-light">{product.price} {product.currency}</p>
                                        </div>

                                        <div className="prose prose-gray">
                                            <p className="text-lg text-gray-600 leading-loose">{product.description}</p>
                                        </div>

                                        {product.features?.length > 0 && (
                                            <div className="border-t pt-6">
                                                <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Highlights</h4>
                                                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                    {product.features.map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-12 text-center text-xs text-gray-300 tracking-widest uppercase">
                                    Kiswastore Collection &mdash; {product.slug}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. MINIMAL VIEW */}
                {viewMode === 'minimal' && (
                    <div className="divide-y">
                        <div className="grid grid-cols-12 gap-4 pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                            <div className="col-span-1">Img</div>
                            <div className="col-span-4">Product</div>
                            <div className="col-span-3">Category</div>
                            <div className="col-span-2">SKU</div>
                            <div className="col-span-2 text-right">Price</div>
                        </div>
                        {products.map((product) => (
                            <div key={product._id} className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-gray-50 transition-colors print:break-inside-avoid">
                                <div className="col-span-1">
                                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                        {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <div className="col-span-4 font-medium text-gray-900">{product.name}</div>
                                <div className="col-span-3 text-sm text-gray-500">{product.category?.name}</div>
                                <div className="col-span-2 text-sm text-gray-400 font-mono">{product.slug}</div>
                                <div className="col-span-2 text-right font-medium">{product.price} {product.currency}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. DETAILED VIEW (Classic) */}
                {viewMode === 'detailed' && (
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
                )}

                {/* Footer */}
                <div className="text-center py-24 mt-12 print:page-break-before border-t">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-gray-600">For wholesale inquiries and custom orders</p>
                    <p className="mt-4 text-xl font-medium">info@kiswa.store</p>
                    <p className="text-sm text-gray-400 mt-8">© 2026 KISWA. All Rights Reserved.</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:page-break-after { page-break-after: always; }
                    .print\\:page-break-before { page-break-before: always; }
                    .print\\:page-break-inside-avoid { page-break-inside: avoid; }
                    .print\\:break-after-page { break-after: page; }
                }
            `}</style>
        </div>
    );
}
