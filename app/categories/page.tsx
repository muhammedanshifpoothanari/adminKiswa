'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Grid, List, Download } from 'lucide-react';

interface CategoryType {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const url = editId ? `/api/categories/${editId}` : '/api/categories';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchCategories();
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this category?')) return;
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCategories();
    }

    function resetForm() {
        setFormData({ name: '', slug: '', description: '', image: '' });
        setEditId(null);
    }

    function handleEdit(cat: CategoryType) {
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            image: cat.image || ''
        });
        setEditId(cat._id);
        setOpen(true);
    }

    function handlePrintCatalog() {
        window.print();
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <div className="flex gap-2">
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handlePrintCatalog}>
                        <Download className="mr-2 h-4 w-4" /> Print Catalog
                    </Button>
                    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Image URL</Label>
                                    <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Saving...' : (editId ? 'Update Category' : 'Create Category')}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Card key={category._id} className="overflow-hidden group">
                            <div className="aspect-square bg-gray-100 relative">
                                {category.image ? (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                                        {category.name[0]}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 print:hidden">
                                    <Button size="icon" variant="secondary" onClick={() => handleEdit(category)}><Pencil className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(category._id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold">{category.name}</h3>
                                {category.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="print:hidden">
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                                        <TableCell>{category.isActive ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(category._id)}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No categories found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Print Catalog Section */}
            <div className="hidden print:block">
                <div className="text-center py-8">
                    <h1 className="text-4xl font-bold">KISWA Categories</h1>
                    <p className="text-gray-500">Product Category Catalog</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {categories.map(cat => (
                        <div key={cat._id} className="border p-4 rounded">
                            {cat.image && <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover mb-4" />}
                            <h2 className="text-xl font-bold">{cat.name}</h2>
                            <p className="text-gray-600">{cat.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                }
            `}</style>
        </div>
    );
}
