'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, X } from 'lucide-react';

interface OrderType {
    _id: string;
    orderNumber: string;
    customer: { _id: string; firstName: string; lastName: string; email: string } | null;
    items: { product: string; name: string; quantity: number; price: number; total: number; image?: string }[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: { street: string; city: string; country: string };
    notes: string;
    createdAt: string;
}

interface CustomerType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ProductType {
    _id: string;
    name: string;
    price: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

    const [formData, setFormData] = useState({
        customerId: '',
        items: [{ productId: '', name: '', quantity: 1, price: 0 }],
        shippingAddress: { street: '', city: '', country: '' },
        notes: '',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'COD'
    });

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    async function fetchOrders() {
        const res = await fetch('/api/orders');
        if (res.ok) setOrders(await res.json());
    }

    async function fetchCustomers() {
        const res = await fetch('/api/customers');
        if (res.ok) setCustomers(await res.json());
    }

    async function fetchProducts() {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Calculate totals
        const items = formData.items.map(item => ({
            product: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
        }));
        const subtotal = items.reduce((sum, i) => sum + i.total, 0);

        const payload = {
            orderNumber: `ORD-${Date.now()}`,
            customer: formData.customerId || null,
            items,
            subtotal,
            tax: 0,
            shippingCost: 0,
            total: subtotal,
            status: formData.status,
            paymentStatus: formData.paymentStatus,
            paymentMethod: formData.paymentMethod,
            shippingAddress: formData.shippingAddress,
            notes: formData.notes
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchOrders();
        }
    }

    function resetForm() {
        setFormData({
            customerId: '',
            items: [{ productId: '', name: '', quantity: 1, price: 0 }],
            shippingAddress: { street: '', city: '', country: '' },
            notes: '',
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'COD'
        });
    }

    function addItem() {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', name: '', quantity: 1, price: 0 }]
        });
    }

    function updateItem(index: number, field: string, value: any) {
        const updated = [...formData.items];
        (updated[index] as any)[field] = value;

        // If product selected, fill name and price
        if (field === 'productId') {
            const product = products.find(p => p._id === value);
            if (product) {
                updated[index].name = product.name;
                updated[index].price = product.price;
            }
        }

        setFormData({ ...formData, items: updated });
    }

    function removeItem(index: number) {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'pending': return 'secondary';
            case 'processing': return 'default';
            case 'shipped': return 'default';
            case 'delivered': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Manual Order</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Manual Order</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer */}
                            <div className="space-y-2">
                                <Label>Customer (Optional)</Label>
                                <Select value={formData.customerId} onValueChange={val => setFormData({ ...formData, customerId: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select or leave empty for guest" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map(c => (
                                            <SelectItem key={c._id} value={c._id}>{c.firstName} {c.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Items */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Order Items</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                </div>
                                {formData.items.map((item, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-5">
                                            <Select value={item.productId} onValueChange={val => updateItem(i, 'productId', val)}>
                                                <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2">
                                            <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value))} />
                                        </div>
                                        <div className="col-span-3">
                                            <Input type="number" placeholder="Price" value={item.price} onChange={e => updateItem(i, 'price', parseFloat(e.target.value))} />
                                        </div>
                                        <div className="col-span-2">
                                            {formData.items.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)}><X className="h-4 w-4" /></Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-2">
                                <Label>Shipping Address</Label>
                                <Input placeholder="Street" value={formData.shippingAddress.street} onChange={e => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, street: e.target.value } })} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="City" value={formData.shippingAddress.city} onChange={e => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, city: e.target.value } })} />
                                    <Input placeholder="Country" value={formData.shippingAddress.country} onChange={e => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, country: e.target.value } })} />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Order Status</Label>
                                    <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Status</Label>
                                    <Select value={formData.paymentStatus} onValueChange={val => setFormData({ ...formData, paymentStatus: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <Select value={formData.paymentMethod} onValueChange={val => setFormData({ ...formData, paymentMethod: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="COD">Cash on Delivery</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Card">Card / Online</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>

                            <Button type="submit" className="w-full">Create Order</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>
                                        {order.customer ? (
                                            <div>
                                                <div>{order.customer.firstName} {order.customer.lastName}</div>
                                                <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                                            </div>
                                        ) : <span className="text-muted-foreground">Guest</span>}
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>{order.paymentStatus}</TableCell>
                                    <TableCell className="text-xs">{order.paymentMethod}</TableCell>
                                    <TableCell className="text-right font-medium">SAR {order.total?.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setViewOpen(true); }}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Order Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Number</p>
                                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="font-medium underline decoration-dotted">{selectedOrder.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label>Order Status</Label>
                                    <Select
                                        value={selectedOrder.status}
                                        onValueChange={async (val) => {
                                            // Optimistic update
                                            const updated = { ...selectedOrder, status: val };
                                            setSelectedOrder(updated as OrderType); // Cast needed if types mismatch slightly

                                            // API Call
                                            await fetch('/api/orders', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ _id: selectedOrder._id, status: val })
                                            });
                                            fetchOrders(); // Refresh list background
                                        }}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Status</Label>
                                    <Select
                                        value={selectedOrder.paymentStatus}
                                        onValueChange={async (val) => {
                                            const updated = { ...selectedOrder, paymentStatus: val };
                                            setSelectedOrder(updated as OrderType);

                                            await fetch('/api/orders', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ _id: selectedOrder._id, paymentStatus: val })
                                            });
                                            fetchOrders();
                                        }}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Items</h4>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 w-12"></th>
                                            <th className="text-left py-2">Product</th>
                                            <th className="text-center py-2">Qty</th>
                                            <th className="text-right py-2">Price</th>
                                            <th className="text-right py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="py-2">
                                                    {item.image ? (
                                                        <img src={item.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">IMG</div>
                                                    )}
                                                </td>
                                                <td className="py-2">{item.name}</td>
                                                <td className="text-center py-2">{item.quantity}</td>
                                                <td className="text-right py-2">SAR {item.price}</td>
                                                <td className="text-right py-2">SAR {item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm">Subtotal: SAR {selectedOrder.subtotal}</p>
                                    <p className="text-sm">Shipping: SAR {selectedOrder.shippingCost}</p>
                                    <p className="text-lg font-bold">Total: SAR {selectedOrder.total}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <p>{selectedOrder.shippingAddress?.street}</p>
                                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</p>
                            </div>

                            {selectedOrder.notes && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Notes</h4>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
