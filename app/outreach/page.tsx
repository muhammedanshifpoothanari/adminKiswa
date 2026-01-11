'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Trash2, Phone, Mail, Calendar, Users, X } from 'lucide-react';

interface OutreachType {
    _id: string;
    company: { _id: string; name: string; industry: string };
    employee: { _id: string; firstName: string; lastName: string };
    month: string;
    activities: { type: string; date: string; notes: string; outcome?: string }[];
    status: string;
    notes: string;
}

interface CompanyType {
    _id: string;
    name: string;
}

interface EmployeeType {
    _id: string;
    firstName: string;
    lastName: string;
}

const ACTIVITY_TYPES = ['call', 'email', 'meeting', 'demo', 'follow-up'];

export default function OutreachPage() {
    const [outreachList, setOutreachList] = useState<OutreachType[]>([]);
    const [companies, setCompanies] = useState<CompanyType[]>([]);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedOutreach, setSelectedOutreach] = useState<OutreachType | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [formData, setFormData] = useState({
        companyId: '',
        employeeId: '',
        month: selectedMonth,
        status: 'active',
        notes: '',
        activities: [{ type: 'call', date: new Date().toISOString().split('T')[0], notes: '', outcome: '' }]
    });

    useEffect(() => {
        fetchCompanies();
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchOutreach();
    }, [selectedMonth]);

    async function fetchOutreach() {
        const res = await fetch(`/api/outreach?month=${selectedMonth}`);
        if (res.ok) setOutreachList(await res.json());
    }

    async function fetchCompanies() {
        const res = await fetch('/api/crm/companies');
        if (res.ok) {
            const data = await res.json();
            setCompanies(Array.isArray(data) ? data : []);
        }
    }

    async function fetchEmployees() {
        const res = await fetch('/api/employees');
        if (res.ok) setEmployees(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const [year, month] = formData.month.split('-').map(Number);
        const payload = {
            company: formData.companyId,
            employee: formData.employeeId,
            month: new Date(year, month - 1, 1),
            status: formData.status,
            notes: formData.notes,
            activities: formData.activities.filter(a => a.notes)
        };

        const res = await fetch('/api/outreach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchOutreach();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this outreach record?')) return;
        await fetch(`/api/outreach/${id}`, { method: 'DELETE' });
        fetchOutreach();
    }

    async function addActivity(outreachId: string, activity: any) {
        const outreach = outreachList.find(o => o._id === outreachId);
        if (!outreach) return;

        await fetch(`/api/outreach/${outreachId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                activities: [...outreach.activities, activity]
            })
        });
        fetchOutreach();
    }

    function resetForm() {
        setFormData({
            companyId: '', employeeId: '', month: selectedMonth, status: 'active', notes: '',
            activities: [{ type: 'call', date: new Date().toISOString().split('T')[0], notes: '', outcome: '' }]
        });
    }

    function addFormActivity() {
        setFormData({
            ...formData,
            activities: [...formData.activities, { type: 'call', date: new Date().toISOString().split('T')[0], notes: '', outcome: '' }]
        });
    }

    function updateFormActivity(index: number, field: string, value: string) {
        const updated = [...formData.activities];
        (updated[index] as any)[field] = value;
        setFormData({ ...formData, activities: updated });
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'active': return 'default';
            case 'completed': return 'secondary';
            case 'paused': return 'outline';
            default: return 'secondary';
        }
    }

    function getActivityIcon(type: string) {
        switch (type) {
            case 'call': return <Phone className="h-3 w-3" />;
            case 'email': return <Mail className="h-3 w-3" />;
            case 'meeting': return <Users className="h-3 w-3" />;
            default: return <Calendar className="h-3 w-3" />;
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Outreach Tracking</h1>
                <div className="flex items-center gap-4">
                    <Input
                        type="month"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="w-48"
                    />
                    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> New Outreach</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Outreach Record</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Select value={formData.companyId} onValueChange={val => setFormData({ ...formData, companyId: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                                        <SelectContent>
                                            {companies.map(c => (
                                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Employee</Label>
                                    <Select value={formData.employeeId} onValueChange={val => setFormData({ ...formData, employeeId: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map(e => (
                                                <SelectItem key={e._id} value={e._id}>{e.firstName} {e.lastName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Month</Label>
                                        <Input type="month" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Activities</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={addFormActivity}>
                                            <Plus className="h-3 w-3 mr-1" /> Add
                                        </Button>
                                    </div>
                                    {formData.activities.map((activity, i) => (
                                        <Card key={i} className="p-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Select value={activity.type} onValueChange={val => updateFormActivity(i, 'type', val)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {ACTIVITY_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input type="date" value={activity.date} onChange={e => updateFormActivity(i, 'date', e.target.value)} />
                                            </div>
                                            <Textarea
                                                placeholder="Activity notes..."
                                                value={activity.notes}
                                                onChange={e => updateFormActivity(i, 'notes', e.target.value)}
                                                className="mt-2"
                                                rows={2}
                                            />
                                            <Input
                                                placeholder="Outcome (optional)"
                                                value={activity.outcome}
                                                onChange={e => updateFormActivity(i, 'outcome', e.target.value)}
                                                className="mt-2"
                                            />
                                        </Card>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label>General Notes</Label>
                                    <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>

                                <Button type="submit" className="w-full">Create Outreach</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Outreach</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{outreachList.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {outreachList.filter(o => o.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {outreachList.filter(o => o.status === 'completed').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {outreachList.reduce((sum, o) => sum + (o.activities?.length || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Outreach Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Outreach Records - {selectedMonth}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Activities</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {outreachList.map((outreach) => (
                                <TableRow key={outreach._id}>
                                    <TableCell className="font-medium">
                                        {outreach.company?.name || 'Unknown'}
                                        <span className="block text-xs text-muted-foreground">{outreach.company?.industry}</span>
                                    </TableCell>
                                    <TableCell>
                                        {outreach.employee?.firstName} {outreach.employee?.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {outreach.activities?.slice(0, 3).map((a, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {getActivityIcon(a.type)} {a.type}
                                                </Badge>
                                            ))}
                                            {outreach.activities?.length > 3 && (
                                                <Badge variant="secondary">+{outreach.activities.length - 3}</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(outreach.status) as any}>{outreach.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedOutreach(outreach); setViewOpen(true); }}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(outreach._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {outreachList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No outreach records for this month
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Outreach Details</DialogTitle>
                    </DialogHeader>
                    {selectedOutreach && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">{selectedOutreach.company?.name}</h3>
                                <p className="text-muted-foreground">Assigned to: {selectedOutreach.employee?.firstName} {selectedOutreach.employee?.lastName}</p>
                                <Badge variant={getStatusColor(selectedOutreach.status) as any} className="mt-2">{selectedOutreach.status}</Badge>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Activity Timeline</h4>
                                <div className="space-y-3">
                                    {selectedOutreach.activities?.map((a, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="mt-1">{getActivityIcon(a.type)}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium capitalize">{a.type}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{a.notes}</p>
                                                {a.outcome && <p className="text-sm text-green-600">Outcome: {a.outcome}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedOutreach.notes && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Notes</h4>
                                    <p className="text-sm text-muted-foreground">{selectedOutreach.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
