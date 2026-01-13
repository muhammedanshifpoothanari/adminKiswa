"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Mail, Phone, Building, User } from 'lucide-react';

interface ContactType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    type: string;
    status: string;
    notes: string;
    source?: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<ContactType[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', role: '', type: 'Lead', status: 'Active', notes: ''
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    async function fetchContacts() {
        const res = await fetch('/api/crm/contacts');
        if (res.ok) setContacts(await res.json());
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/crm/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setOpen(false);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                company: '', role: '', type: 'Lead', status: 'Active', notes: ''
            });
            fetchContacts();
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Contact</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Contact</DialogTitle>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={formData.type} onValueChange={val => setFormData({ ...formData, type: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lead">Lead</SelectItem>
                                            <SelectItem value="Client">Client</SelectItem>
                                            <SelectItem value="Partner">Partner</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">Create Contact</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map(contact => (
                        <Card key={contact._id}>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{contact.firstName} {contact.lastName}</h3>
                                        <p className="text-sm text-gray-500">{contact.role} {contact.company && `at ${contact.company}`}</p>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${contact.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {contact.status}
                                    </div>
                                </div>

                                <div className="space-y-1 pt-2">
                                    {contact.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="h-4 w-4" /> {contact.email}</div>}
                                    {contact.phone && <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="h-4 w-4" /> {contact.phone}</div>}
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{contact.type}</span>
                                    {contact.source && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border capitalize">{contact.source}</span>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {contacts.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No contacts found. Add one to get started.</div>}
                </div>
            )}
        </div>
    );
}
