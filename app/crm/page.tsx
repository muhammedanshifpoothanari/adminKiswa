"use client";

import { useEffect, useState, Fragment } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Trash2, X, Building, Mail, Phone, Link as LinkIcon, Users } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Contact {
    name: string;
    role: string;
    email: string;
    phone: string;
}

interface CompanyType {
    _id: string;
    name: string;
    industry: string;
    location: string;
    valuation: string;
    status: string;
    stage: string;
    contacts: Contact[];
    notes: string[];
    links: string[];
}

const STAGES = ['Lead', 'MQL', 'MAL', 'SAL', 'Deal Won', 'Repeat Client'];

export default function CRMPage() {
    const [companies, setCompanies] = useState<CompanyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        location: '',
        valuation: '',
        stage: 'Lead',
        contacts: [{ name: '', role: '', email: '', phone: '' }],
        notes: [''],
        links: ['']
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    async function fetchCompanies() {
        try {
            const res = await fetch('/api/crm/companies');
            if (res.ok) {
                const data = await res.json();
                setCompanies(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to load companies", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const url = editId ? `/api/crm/companies/${editId}` : '/api/crm/companies';
        const method = editId ? 'PUT' : 'POST';

        const payload = {
            name: formData.name,
            industry: formData.industry,
            location: formData.location,
            valuation: formData.valuation,
            stage: formData.stage,
            contacts: formData.contacts.filter(c => c.name || c.email),
            notes: formData.notes.filter(n => n.trim()),
            links: formData.links.filter(l => l.trim())
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchCompanies();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this company?')) return;
        await fetch(`/api/crm/companies/${id}`, { method: 'DELETE' });
        fetchCompanies();
    }

    async function updateStage(companyId: string, newStage: string) {
        await fetch(`/api/crm/companies/${companyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: newStage })
        });
        fetchCompanies();
    }

    function resetForm() {
        setFormData({
            name: '', industry: '', location: '', valuation: '', stage: 'Lead',
            contacts: [{ name: '', role: '', email: '', phone: '' }],
            notes: [''], links: ['']
        });
        setEditId(null);
    }

    function handleEdit(company: CompanyType) {
        setFormData({
            name: company.name,
            industry: company.industry || '',
            location: company.location || '',
            valuation: company.valuation || '',
            stage: company.stage,
            contacts: company.contacts?.length ? company.contacts : [{ name: '', role: '', email: '', phone: '' }],
            notes: company.notes?.length ? company.notes : [''],
            links: company.links?.length ? company.links : ['']
        });
        setEditId(company._id);
        setOpen(true);
    }

    // Contact Management
    function addContact() {
        setFormData({ ...formData, contacts: [...formData.contacts, { name: '', role: '', email: '', phone: '' }] });
    }
    function updateContact(idx: number, field: keyof Contact, value: string) {
        const updated = [...formData.contacts];
        updated[idx][field] = value;
        setFormData({ ...formData, contacts: updated });
    }
    function removeContact(idx: number) {
        setFormData({ ...formData, contacts: formData.contacts.filter((_, i) => i !== idx) });
    }

    // Notes Management
    function addNote() { setFormData({ ...formData, notes: [...formData.notes, ''] }); }
    function updateNote(idx: number, value: string) {
        const updated = [...formData.notes];
        updated[idx] = value;
        setFormData({ ...formData, notes: updated });
    }

    // Links Management
    function addLink() { setFormData({ ...formData, links: [...formData.links, ''] }); }
    function updateLink(idx: number, value: string) {
        const updated = [...formData.links];
        updated[idx] = value;
        setFormData({ ...formData, links: updated });
    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const { destination, draggableId } = result;
        const newStage = destination.droppableId;

        // Optimistic update
        setCompanies(prev => prev.map(c => c._id === draggableId ? { ...c, stage: newStage } : c));

        // Persist
        await updateStage(draggableId, newStage);
    };

    if (loading) return <div className="p-8">Loading CRM...</div>;

    return (
        <div className="p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">CRM Pipeline</h1>
                <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Deal</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editId ? 'Edit Company' : 'Add New Deal'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Industry</Label>
                                    <Input value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="City, Country" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Deal Value</Label>
                                    <Input value={formData.valuation} onChange={e => setFormData({ ...formData, valuation: e.target.value })} placeholder="e.g., $50,000" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Pipeline Stage</Label>
                                <Select value={formData.stage} onValueChange={val => setFormData({ ...formData, stage: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Contacts */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <Label className="flex items-center gap-2"><Users className="h-4 w-4" /> Contacts</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addContact}><Plus className="h-3 w-3 mr-1" />Add Contact</Button>
                                </div>
                                {formData.contacts.map((contact, i) => (
                                    <Card key={i} className="p-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Name" value={contact.name} onChange={e => updateContact(i, 'name', e.target.value)} />
                                            <Input placeholder="Role" value={contact.role} onChange={e => updateContact(i, 'role', e.target.value)} />
                                            <Input placeholder="Email" value={contact.email} onChange={e => updateContact(i, 'email', e.target.value)} />
                                            <div className="flex gap-2">
                                                <Input placeholder="Phone" value={contact.phone} onChange={e => updateContact(i, 'phone', e.target.value)} />
                                                {formData.contacts.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(i)}><X className="h-4 w-4" /></Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Notes */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <Label>Notes</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addNote}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                </div>
                                {formData.notes.map((note, i) => (
                                    <Textarea key={i} value={note} onChange={e => updateNote(i, e.target.value)} placeholder="Add a note..." rows={2} />
                                ))}
                            </div>

                            {/* Links */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <Label>Links</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addLink}><Plus className="h-3 w-3 mr-1" />Add</Button>
                                </div>
                                {formData.links.map((link, i) => (
                                    <Input key={i} value={link} onChange={e => updateLink(i, e.target.value)} placeholder="https://..." />
                                ))}
                            </div>

                            <Button type="submit" className="w-full">{editId ? 'Update Deal' : 'Create Deal'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex overflow-x-auto h-[calc(100vh-180px)] pb-4 gap-4">
                    {STAGES.map(stage => {
                        const stageCompanies = companies.filter(c => c.stage === stage);
                        return (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`bg-gray-100 rounded-lg p-4 w-72 flex-shrink-0 flex flex-col ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">{stage}</h3>
                                            <Badge variant="secondary">{stageCompanies.length}</Badge>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-3">
                                            {stageCompanies.map((company, index) => (
                                                <Draggable key={company._id} draggableId={company._id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Card className="cursor-grab active:cursor-grabbing">
                                                                <CardContent className="p-3">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <h4 className="font-semibold text-sm">{company.name}</h4>
                                                                        <div className="flex gap-1">
                                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelectedCompany(company); setViewOpen(true); }}>
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(company)}>
                                                                                <Pencil className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{company.industry}</p>
                                                                    <p className="text-xs text-muted-foreground">{company.location}</p>
                                                                    {company.valuation && <p className="text-sm font-medium mt-2">{company.valuation}</p>}
                                                                    {company.contacts?.length > 0 && (
                                                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                                            <Users className="h-3 w-3" /> {company.contacts.length} contact(s)
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Company Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Company Details</DialogTitle>
                    </DialogHeader>
                    {selectedCompany && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2"><Building className="h-5 w-5" /> {selectedCompany.name}</h2>
                                <p className="text-muted-foreground">{selectedCompany.industry} • {selectedCompany.location}</p>
                                <p className="text-lg font-semibold mt-2">{selectedCompany.valuation}</p>
                                <Badge className="mt-2">{selectedCompany.stage}</Badge>
                            </div>

                            {selectedCompany.contacts?.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Contacts</h4>
                                    <div className="space-y-2">
                                        {selectedCompany.contacts.map((c, i) => (
                                            <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                                                <p className="font-medium">{c.name} {c.role && <span className="text-muted-foreground">({c.role})</span>}</p>
                                                {c.email && <p className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" /> {c.email}</p>}
                                                {c.phone && <p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedCompany.notes?.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Notes</h4>
                                    {selectedCompany.notes.map((n, i) => <p key={i} className="text-sm text-muted-foreground">{n}</p>)}
                                </div>
                            )}

                            {selectedCompany.links?.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Links</h4>
                                    {selectedCompany.links.map((l, i) => (
                                        <a key={i} href={l} target="_blank" rel="noopener" className="block text-sm text-blue-600 hover:underline">{l}</a>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button variant="outline" className="flex-1" onClick={() => { setViewOpen(false); handleEdit(selectedCompany); }}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="destructive" onClick={() => { setViewOpen(false); handleDelete(selectedCompany._id); }}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
