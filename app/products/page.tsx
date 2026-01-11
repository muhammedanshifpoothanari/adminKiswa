'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Grid, List, Eye, X, Download } from 'lucide-react';

interface ProductType {
    _id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    features: string[];
    price: number;
    currency: string;
    stock: number;
    inStock: boolean;
    category: { _id: string, name: string };
    images: string[];
    specifications: Record<string, string>;
    isPublished: boolean;
}

interface CategoryType {
    _id: string;
    name: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        description: '',
        features: [''],
        price: 0,
        currency: 'SAR',
        stock: 0,
        inStock: true,
        categoryId: '',
        images: [''],
        specifications: [{ key: '', value: '' }],
        isPublished: true
    });

    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    async function fetchProducts() {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
    }

    async function fetchCategories() {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editId ? `/api/products/${editId}` : '/api/products';
            const method = editId ? 'PUT' : 'POST';

            // Convert specifications array to object
            const specsObj: Record<string, string> = {};
            formData.specifications.forEach(s => {
                if (s.key) specsObj[s.key] = s.value;
            });

            const payload = {
                name: formData.name,
                slug: formData.slug,
                sku: formData.sku,
                description: formData.description,
                features: formData.features.filter(f => f.trim()),
                price: formData.price,
                currency: formData.currency,
                stock: formData.stock,
                inStock: formData.inStock,
                category: formData.categoryId,
                images: formData.images.filter(i => i.trim()),
                specifications: specsObj,
                isPublished: formData.isPublished
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setOpen(false);
                resetForm();
                fetchProducts();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProducts();
    }

    function resetForm() {
        setFormData({
            name: '', slug: '', sku: '', description: '', features: [''],
            price: 0, currency: 'SAR', stock: 0, inStock: true, categoryId: '',
            images: [''], specifications: [{ key: '', value: '' }], isPublished: true
        });
        setEditId(null);
    }

    function handleEdit(product: ProductType) {
        setFormData({
            name: product.name,
            slug: product.slug,
            sku: product.sku || '',
            description: product.description || '',
            features: product.features?.length ? product.features : [''],
            price: product.price,
            currency: product.currency || 'SAR',
            stock: product.stock,
            inStock: product.inStock,
            categoryId: product.category?._id || '',
            images: product.images?.length ? product.images : [''],
            specifications: Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })),
            isPublished: product.isPublished
        });
        setEditId(product._id);
        setOpen(true);
    }

    function addFeature() {
        setFormData({ ...formData, features: [...formData.features, ''] });
    }

    function updateFeature(index: number, value: string) {
        const updated = [...formData.features];
        updated[index] = value;
        setFormData({ ...formData, features: updated });
    }

    function removeFeature(index: number) {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    }

    function addImage() {
        setFormData({ ...formData, images: [...formData.images, ''] });
    }

    function updateImage(index: number, value: string) {
        const updated = [...formData.images];
        updated[index] = value;
        setFormData({ ...formData, images: updated });
    }

    function removeImage(index: number) {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    }

    function addSpec() {
        setFormData({ ...formData, specifications: [...formData.specifications, { key: '', value: '' }] });
    }

    function updateSpec(index: number, field: 'key' | 'value', value: string) {
        const updated = [...formData.specifications];
        updated[index][field] = value;
        setFormData({ ...formData, specifications: updated });
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <div className="flex gap-2">
                    {/* View Toggle */}
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>

                    <Button asChild variant="outline">
                        <a href="/products/catalog">
                            <Download className="mr-2 h-4 w-4" /> Catalog
                        </a>
                    </Button>

                    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (URL)</Label>
                                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SKU</Label>
                                        <Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map(c => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Price</Label>
                                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Currency</Label>
                                        <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SAR">SAR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="AED">AED</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value), inStock: parseInt(e.target.value) > 0 })} required />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                </div>

                                {/* Features */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Features</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={addFeature}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                    </div>
                                    {formData.features.map((f, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={f} onChange={(e) => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                                            {formData.features.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)}><X className="h-4 w-4" /></Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Images */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Image URLs</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={addImage}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                    </div>
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={img} onChange={(e) => updateImage(i, e.target.value)} placeholder="https://..." />
                                            {formData.images.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(i)}><X className="h-4 w-4" /></Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Specifications */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Specifications</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={addSpec}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                    </div>
                                    {formData.specifications.map((spec, i) => (
                                        <div key={i} className="grid grid-cols-2 gap-2">
                                            <Input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Key (e.g., Material)" />
                                            <Input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Value" />
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Saving...' : (editId ? 'Update Product' : 'Create Product')}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Instagram-like Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Card key={product._id} className="overflow-hidden group cursor-pointer" onClick={() => { setSelectedProduct(product); setViewOpen(true); }}>
                            <div className="aspect-square bg-gray-100 relative">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); handleEdit(product); }}><Pencil className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">{product.price} {product.currency}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">SKU</th>
                                    <th className="text-left py-2">Category</th>
                                    <th className="text-left py-2">Price</th>
                                    <th className="text-left py-2">Stock</th>
                                    <th className="text-right py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b">
                                        <td className="py-2 font-medium">{product.name}</td>
                                        <td className="py-2">{product.sku}</td>
                                        <td className="py-2">{product.category?.name}</td>
                                        <td className="py-2">{product.price} {product.currency}</td>
                                        <td className="py-2">
                                            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                                {product.stock > 0 ? product.stock : 'Out'}
                                            </Badge>
                                        </td>
                                        <td className="py-2 text-right space-x-1">
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}><Trash2 className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* View Product Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {selectedProduct.images?.map((img, i) => (
                                    <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded" />
                                ))}
                            </div>
                            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                            <p className="text-2xl font-semibold">{selectedProduct.price} {selectedProduct.currency}</p>
                            <p className="text-muted-foreground">{selectedProduct.description}</p>
                            <div>
                                <h4 className="font-semibold mb-2">Features:</h4>
                                <ul className="list-disc list-inside">
                                    {selectedProduct.features?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Specifications:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedProduct.specifications || {}).map(([k, v]) => (
                                        <div key={k}><span className="text-muted-foreground">{k}:</span> {v}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
