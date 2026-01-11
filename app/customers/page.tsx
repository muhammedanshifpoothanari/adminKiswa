'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Mail, Phone, Eye, Send } from 'lucide-react';

interface CustomerType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    totalSpent: number;
    orderCount: number;
    notes?: string;
    addresses: { street: string; city: string; country: string; type: string }[];
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
        address: { street: '', city: '', country: '' }
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        const res = await fetch('/api/customers');
        if (res.ok) setCustomers(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const url = editId ? `/api/customers/${editId}` : '/api/customers';
        const method = editId ? 'PUT' : 'POST';

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
            addresses: formData.address.street ? [{ ...formData.address, type: 'shipping' }] : []
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchCustomers();
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this customer?')) return;
        const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCustomers();
    }

    function resetForm() {
        setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '', address: { street: '', city: '', country: '' } });
        setEditId(null);
    }

    function handleEdit(customer: CustomerType) {
        setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone || '',
            notes: (customer as any).notes || '',
            address: customer.addresses?.[0] || { street: '', city: '', country: '' }
        });
        setEditId(customer._id);
        setOpen(true);
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            <div className="border-t pt-4">
                                <Label className="mb-2 block">Address</Label>
                                <div className="space-y-2">
                                    <Input placeholder="Street" value={formData.address.street} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="City" value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
                                        <Input placeholder="Country" value={formData.address.country} onChange={e => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes (for outreach)</Label>
                                <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Internal notes about this customer..." />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Saving...' : (editId ? 'Update Customer' : 'Create Customer')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Database</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer._id}>
                                    <TableCell className="font-medium">{customer.firstName} {customer.lastName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" /> {customer.email}</span>
                                            {customer.phone && <span className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /> {customer.phone}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{customer.orderCount} orders</Badge>
                                    </TableCell>
                                    <TableCell>SAR {customer.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCustomer(customer); setViewOpen(true); }}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(customer._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={`mailto:${customer.email}`} title="Send Email">
                                                <Send className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Customer Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Customer Profile</DialogTitle>
                    </DialogHeader>
                    {selectedCustomer && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                                <p className="text-muted-foreground">{selectedCustomer.email}</p>
                                <p className="text-muted-foreground">{selectedCustomer.phone}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Orders</p>
                                    <p className="text-2xl font-bold">{selectedCustomer.orderCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Spent</p>
                                    <p className="text-2xl font-bold">SAR {selectedCustomer.totalSpent?.toFixed(2)}</p>
                                </div>
                            </div>
                            {selectedCustomer.addresses?.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Addresses</h4>
                                    {selectedCustomer.addresses.map((addr, i) => (
                                        <p key={i} className="text-sm">{addr.street}, {addr.city}, {addr.country}</p>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2 pt-4">
                                <Button asChild className="flex-1">
                                    <a href={`mailto:${selectedCustomer.email}`}><Mail className="mr-2 h-4 w-4" /> Send Email</a>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
