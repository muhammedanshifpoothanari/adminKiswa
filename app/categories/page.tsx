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

    // View/Catalog States
    const [selectedViewCategory, setSelectedViewCategory] = useState<CategoryType | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Catalog Customization
    const [catalogLayout, setCatalogLayout] = useState<'editorial' | 'boutique' | 'minimal'>('editorial');
    const [catalogTheme, setCatalogTheme] = useState<'noir' | 'navy' | 'gold' | 'burgundy'>('noir');

    const themes = {
        noir: { text: 'text-black', border: 'border-black', bg: 'bg-black', accent: 'bg-gray-900', secondary: 'text-gray-600' },
        navy: { text: 'text-slate-900', border: 'border-slate-800', bg: 'bg-slate-900', accent: 'bg-slate-800', secondary: 'text-slate-600' },
        gold: { text: 'text-yellow-900', border: 'border-yellow-700', bg: 'bg-yellow-900', accent: 'bg-yellow-800', secondary: 'text-yellow-700' },
        burgundy: { text: 'text-rose-950', border: 'border-rose-900', bg: 'bg-rose-950', accent: 'bg-rose-900', secondary: 'text-rose-800' }
    };

    const currentTheme = themes[catalogTheme];

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

    async function handleViewCatalog(cat: CategoryType) {
        setSelectedViewCategory(cat);
        setLoadingProducts(true);
        try {
            const res = await fetch(`/api/products?category=${cat._id}`);
            if (res.ok) {
                setCategoryProducts(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch products for catalog", error);
        } finally {
            setLoadingProducts(false);
        }
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
                                    <Button size="icon" variant="secondary" onClick={() => handleViewCatalog(category)}><Grid className="h-4 w-4" /></Button>
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



            {/* View Products & Catalog Modal */}
            < Dialog open={!!selectedViewCategory
            } onOpenChange={(val) => !val && setSelectedViewCategory(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:shadow-none print:border-none">
                    <DialogHeader className="print:hidden border-b pb-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <DialogTitle>Customize Catalog: {selectedViewCategory?.name}</DialogTitle>
                            <div className="flex gap-2">
                                <Button onClick={() => window.print()} className="gap-2">
                                    <Download className="h-4 w-4" /> Print / PDF
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-8 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Layout Style</Label>
                                <div className="flex gap-2">
                                    {['editorial', 'boutique', 'minimal'].map((style) => (
                                        <Button
                                            key={style}
                                            variant={catalogLayout === style ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCatalogLayout(style as any)}
                                            className="capitalize"
                                        >
                                            {style}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Color Theme</Label>
                                <div className="flex gap-2">
                                    {Object.keys(themes).map((theme) => (
                                        <button
                                            key={theme}
                                            onClick={() => setCatalogTheme(theme as any)}
                                            className={`w-8 h-8 rounded-full border-2 ${catalogTheme === theme ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-transparent'}`}
                                            style={{ backgroundColor: theme === 'noir' ? '#000' : theme === 'navy' ? '#0f172a' : theme === 'gold' ? '#854d0e' : '#881337' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Printable Catalog Content with Dynamic Theme */}
                        <div className={`print-section bg-white min-h-screen w-full ${catalogLayout === 'boutique' ? 'font-sans' : 'font-serif'} ${currentTheme.text}`}>

                            {/* --- COVER PAGE --- */}
                            <div className={`min-h-[100vh] flex flex-col items-center justify-center text-center break-after-page p-10 bg-white relative overflow-hidden`}>
                                {/* Watermark Graphic */}
                                <div className={`absolute top-0 right-0 w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-5 translate-x-1/2 -translate-y-1/2 pointer-events-none ${currentTheme.bg}`}></div>
                                <div className={`absolute bottom-0 left-0 w-[60vh] h-[60vh] rounded-full blur-[120px] opacity-5 -translate-x-1/2 translate-y-1/2 pointer-events-none ${currentTheme.bg}`}></div>

                                {catalogLayout === 'editorial' && (
                                    <div className={`border-4 ${currentTheme.border} p-12 w-full max-w-2xl flex flex-col items-center justify-center space-y-8 z-10`}>
                                        <h1 className="text-6xl font-extrabold tracking-[0.5em] uppercase">KISWA</h1>
                                        <div className={`h-px w-24 ${currentTheme.bg}`}></div>
                                        <div className="space-y-2">
                                            <h2 className={`text-4xl font-light uppercase tracking-widest ${currentTheme.text}`}>{selectedViewCategory?.name}</h2>
                                            <p className={`text-sm tracking-widest uppercase ${currentTheme.secondary}`}>Collection 2026</p>
                                        </div>
                                    </div>
                                )}

                                {catalogLayout === 'boutique' && (
                                    <div className={`w-full max-w-3xl border-y-8 ${currentTheme.border} py-24 z-10`}>
                                        <h1 className="text-8xl font-black tracking-tighter uppercase mb-4">KISWA</h1>
                                        <div className={`${currentTheme.bg} text-white py-4 px-8 inline-block transform -rotate-2 shadow-xl`}>
                                            <h2 className="text-4xl font-bold uppercase tracking-widest">{selectedViewCategory?.name}</h2>
                                        </div>
                                        <p className={`mt-8 text-xl tracking-widest font-mono uppercase ${currentTheme.secondary}`}>Premium Catalog / Vol. 26</p>
                                    </div>
                                )}

                                {catalogLayout === 'minimal' && (
                                    <div className="absolute top-10 left-10 right-10 bottom-10 border border-gray-100 flex flex-col justify-between p-12 z-10">
                                        <h1 className="text-xl tracking-[0.5em] uppercase text-left font-light">Kiswa Store</h1>
                                        <div className="text-right">
                                            <h2 className="text-8xl font-thin uppercase tracking-tighter opacity-80">{selectedViewCategory?.name}</h2>
                                            <p className={`${currentTheme.secondary} mt-4 tracking-widest uppercase text-sm`}>Curated Selection</p>
                                        </div>
                                    </div>
                                )}

                                <div className={`absolute bottom-10 w-full text-center ${currentTheme.secondary}`}>
                                    <p className="text-[10px] uppercase tracking-[0.3em]">www.kiswastore.com</p>
                                </div>
                            </div>

                            {/* --- CONTENT PAGES --- */}
                            <div className="p-0">
                                {loadingProducts ? (
                                    <div className="text-center py-20">Loading...</div>
                                ) : (
                                    <>
                                        {/* LAYOUT: EDITORIAL (Alternating) */}
                                        {catalogLayout === 'editorial' && (
                                            <div className="flex flex-col">
                                                {categoryProducts.map((product, idx) => (
                                                    <div key={product._id} className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center min-h-[50vh] break-inside-avoid page-break-after-auto border-b border-gray-100 last:border-0 relative overflow-hidden`}>
                                                        {/* Background Graphic */}
                                                        <div className={`absolute top-0 ${idx % 2 === 0 ? 'right-0' : 'left-0'} w-full h-full opacity-[0.02] pointer-events-none`}>
                                                            <h1 className={`text-[20rem] font-bold ${currentTheme.text} leading-none select-none`}>{idx + 1}</h1>
                                                        </div>

                                                        <div className="w-1/2 p-12 z-10">
                                                            <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden shadow-xl">
                                                                <img src={product.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" />
                                                            </div>
                                                        </div>
                                                        <div className="w-1/2 p-16 space-y-8 z-10">
                                                            <div>
                                                                <h4 className={`text-4xl font-thin uppercase tracking-widest ${currentTheme.text}`}>{product.name}</h4>
                                                                <p className={`text-xs tracking-[0.2em] mt-2 ${currentTheme.secondary}`}>{product.sku}</p>
                                                            </div>
                                                            <div className={`w-12 h-0.5 ${currentTheme.bg} opacity-30`}></div>
                                                            <p className={`text-base font-light leading-loose max-w-sm ${currentTheme.secondary}`}>
                                                                {product.description || "Designed for the modern connoisseur, finding balance between elegance and function."}
                                                            </p>
                                                            <div className={`text-2xl font-serif italic ${currentTheme.text}`}>SAR {product.price}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* LAYOUT: BOUTIQUE (Grid with Hero) */}
                                        {catalogLayout === 'boutique' && (
                                            <div className="p-10">
                                                <div className="grid grid-cols-2 gap-10">
                                                    {categoryProducts.map((product, idx) => (
                                                        <div key={product._id} className={`break-inside-avoid mb-10 ${idx % 3 === 0 ? 'col-span-2 flex gap-8 items-center bg-gray-50/50 p-8 rounded-xl' : 'block'}`}>
                                                            {idx % 3 === 0 ? (
                                                                // Feature Row
                                                                <>
                                                                    <div className="w-1/2 aspect-square bg-white shadow-lg overflow-hidden">
                                                                        <img src={product.images?.[0]} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="w-1/2 space-y-6">
                                                                        <span className={`${currentTheme.bg} text-white text-xs px-3 py-1 uppercase tracking-wider font-bold rounded-sm`}>Featured Collection</span>
                                                                        <h4 className={`text-5xl font-black uppercase tracking-tighter ${currentTheme.text}`}>{product.name}</h4>
                                                                        <div className={`h-1 w-20 ${currentTheme.bg}`}></div>
                                                                        <p className={`${currentTheme.secondary} text-lg leading-relaxed`}>{product.description}</p>
                                                                        <p className="text-4xl font-bold">SAR {product.price}</p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                // Standard Card
                                                                <div className="space-y-4 text-center group">
                                                                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative shadow-md">
                                                                        <img src={product.images?.[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                        {product.isBestSeller && <div className={`absolute top-0 right-0 ${currentTheme.bg} text-white text-[10px] uppercase px-3 py-1`}>Top Pick</div>}
                                                                        <div className={`absolute inset-0 border-4 ${currentTheme.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-xl font-bold uppercase ${currentTheme.text}`}>{product.name}</h4>
                                                                        <p className={`text-sm font-mono ${currentTheme.secondary}`}>SAR {product.price}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* LAYOUT: MINIMAL (List) */}
                                        {catalogLayout === 'minimal' && (
                                            <div className="p-20 space-y-20">
                                                {categoryProducts.map((product) => (
                                                    <div key={product._id} className="break-inside-avoid flex items-start gap-16 group">
                                                        <div className="w-1/3 aspect-[3/4] bg-gray-100 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-sm">
                                                            <img src={product.images?.[0]} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className={`w-2/3 pt-10 border-t ${currentTheme.border}`}>
                                                            <div className="flex justify-between items-baseline mb-8">
                                                                <h4 className={`text-5xl font-thin tracking-wide uppercase ${currentTheme.text}`}>{product.name}</h4>
                                                                <span className="font-mono text-lg">SAR {product.price}</span>
                                                            </div>
                                                            <div className={`grid grid-cols-2 gap-12 text-sm ${currentTheme.secondary} font-light leading-relaxed`}>
                                                                <p className="border-l border-gray-200 pl-4">{product.description || "No description available."}</p>
                                                                <div className="space-y-4">
                                                                    <h5 className="font-medium uppercase tracking-widest text-xs">Specifications</h5>
                                                                    <ul className="space-y-2">
                                                                        {product.features?.map((f: string, i: number) => <li key={i} className="flex items-center gap-2"><span className={`w-1 h-1 rounded-full ${currentTheme.bg}`}></span> {f}</li>)}
                                                                        <li className="flex items-center gap-2"><span className={`w-1 h-1 rounded-full ${currentTheme.bg}`}></span> Premium Finish</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="fixed bottom-0 left-0 w-full p-6 bg-white print:block hidden border-t border-gray-100">
                                <div className={`flex justify-between items-center text-[8px] uppercase tracking-widest ${currentTheme.secondary} font-sans`}>
                                    <span>{selectedViewCategory?.name} Collection</span>
                                    <span>KISWA Store © 2026</span>
                                    <span>Page <span className="page-number"></span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >

            <style jsx global>{`
                @media print {
                    /* Hide everything basically */
                    body > * { display: none !important; }
                    
                    /* Show only the dialog content/wrapper if it is effectively the print target */
                    /* But Shadcn Dialog uses portals... so we need to target the portal content */
                    
                    /* Better strategy: when printing, we assume the dialog is open and focused */
                    /* We hide the main app wrapper? Depends on next/layout structure */
                    
                    /* Target strictly the printable area */
                    [role="dialog"] {
                        display: block !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                        z-index: 9999 !important;
                    }
                    
                    /* Hide dialog overlay/backdrop */
                    [data-state="open"] > div[data-aria-hidden="true"] {
                        display: none !important;
                    }

                    /* Hide dialog close button and header controls */
                    button { display: none !important; }

                    .print-section {
                        display: block !important;
                        width: 100% !important;
                    }
                }
            `}</style>
        </div >
    );
}
