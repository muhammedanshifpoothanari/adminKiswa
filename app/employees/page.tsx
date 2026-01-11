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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Eye, Calendar, Clock, FileText, Users } from 'lucide-react';

interface EmployeeType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    department: string;
    hireDate: string;
    salary?: number;
    status: string;
}

interface AttendanceType {
    _id: string;
    employee: { _id: string; firstName: string; lastName: string };
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: string;
    hoursWorked?: number;
}

interface ReportType {
    employee: { _id: string; name: string; department: string; role: string };
    stats: {
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        onLeave: number;
        totalDays: number;
        totalHours: number;
        attendanceRate: number;
    };
}

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'IT', 'HR', 'Finance', 'Customer Service'];
const ROLES = ['Manager', 'Senior', 'Associate', 'Intern', 'Director', 'Executive'];

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [attendance, setAttendance] = useState<AttendanceType[]>([]);
    const [report, setReport] = useState<{ month: string; report: ReportType[] } | null>(null);
    const [open, setOpen] = useState(false);
    const [attendanceOpen, setAttendanceOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('employees');
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        role: '', department: '', salary: 0, status: 'active'
    });

    const [attendanceForm, setAttendanceForm] = useState({
        employeeId: '', date: new Date().toISOString().split('T')[0],
        checkIn: '09:00', checkOut: '17:00', status: 'present', notes: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (activeTab === 'attendance') fetchAttendance();
        if (activeTab === 'reports') fetchReport();
    }, [activeTab, selectedMonth]);

    async function fetchEmployees() {
        const res = await fetch('/api/employees');
        if (res.ok) setEmployees(await res.json());
    }

    async function fetchAttendance() {
        const res = await fetch(`/api/attendance?startDate=${selectedMonth}-01`);
        if (res.ok) setAttendance(await res.json());
    }

    async function fetchReport() {
        const res = await fetch(`/api/attendance/report?month=${selectedMonth}`);
        if (res.ok) setReport(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editId ? `/api/employees/${editId}` : '/api/employees';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setOpen(false);
            resetForm();
            fetchEmployees();
        }
    }

    async function handleAttendanceSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            employee: attendanceForm.employeeId,
            date: attendanceForm.date,
            checkIn: new Date(`${attendanceForm.date}T${attendanceForm.checkIn}`),
            checkOut: new Date(`${attendanceForm.date}T${attendanceForm.checkOut}`),
            status: attendanceForm.status,
            notes: attendanceForm.notes
        };

        const res = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setAttendanceOpen(false);
            setAttendanceForm({ employeeId: '', date: new Date().toISOString().split('T')[0], checkIn: '09:00', checkOut: '17:00', status: 'present', notes: '' });
            fetchAttendance();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this employee?')) return;
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
    }

    function resetForm() {
        setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', department: '', salary: 0, status: 'active' });
        setEditId(null);
    }

    function handleEdit(emp: EmployeeType) {
        setFormData({
            firstName: emp.firstName, lastName: emp.lastName, email: emp.email,
            phone: emp.phone || '', role: emp.role, department: emp.department,
            salary: emp.salary || 0, status: emp.status
        });
        setEditId(emp._id);
        setOpen(true);
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'active': return 'default';
            case 'inactive': return 'secondary';
            case 'on_leave': return 'outline';
            case 'present': return 'default';
            case 'absent': return 'destructive';
            case 'late': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="employees"><Users className="mr-2 h-4 w-4" /> Employees</TabsTrigger>
                    <TabsTrigger value="attendance"><Calendar className="mr-2 h-4 w-4" /> Attendance</TabsTrigger>
                    <TabsTrigger value="reports"><FileText className="mr-2 h-4 w-4" /> Reports</TabsTrigger>
                </TabsList>

                {/* Employees Tab */}
                <TabsContent value="employees" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>{editId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
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
                                            <Label>Department</Label>
                                            <Select value={formData.department} onValueChange={val => setFormData({ ...formData, department: val })}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Salary (SAR)</Label>
                                            <Input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="on_leave">On Leave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">{editId ? 'Update Employee' : 'Create Employee'}</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Staff Directory</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((emp) => (
                                        <TableRow key={emp._id}>
                                            <TableCell className="font-medium">{emp.firstName} {emp.lastName}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.department}</TableCell>
                                            <TableCell>{emp.role}</TableCell>
                                            <TableCell><Badge variant={getStatusColor(emp.status) as any}>{emp.status}</Badge></TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" onClick={() => { setSelectedEmployee(emp); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}><Pencil className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(emp._id)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Label>Month:</Label>
                            <Input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-48" />
                        </div>
                        <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
                            <DialogTrigger asChild>
                                <Button><Clock className="mr-2 h-4 w-4" /> Record Attendance</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Record Attendance</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Employee</Label>
                                        <Select value={attendanceForm.employeeId} onValueChange={val => setAttendanceForm({ ...attendanceForm, employeeId: val })}>
                                            <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                                            <SelectContent>
                                                {employees.map(e => (
                                                    <SelectItem key={e._id} value={e._id}>{e.firstName} {e.lastName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Check In</Label>
                                            <Input type="time" value={attendanceForm.checkIn} onChange={e => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Check Out</Label>
                                            <Input type="time" value={attendanceForm.checkOut} onChange={e => setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={attendanceForm.status} onValueChange={val => setAttendanceForm({ ...attendanceForm, status: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="present">Present</SelectItem>
                                                <SelectItem value="absent">Absent</SelectItem>
                                                <SelectItem value="late">Late</SelectItem>
                                                <SelectItem value="half_day">Half Day</SelectItem>
                                                <SelectItem value="on_leave">On Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full">Save Attendance</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Check In</TableHead>
                                        <TableHead>Check Out</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendance.map((a) => (
                                        <TableRow key={a._id}>
                                            <TableCell className="font-medium">{a.employee?.firstName} {a.employee?.lastName}</TableCell>
                                            <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-'}</TableCell>
                                            <TableCell>{a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '-'}</TableCell>
                                            <TableCell>{a.hoursWorked?.toFixed(1) || '-'}</TableCell>
                                            <TableCell><Badge variant={getStatusColor(a.status) as any}>{a.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Label>Report Month:</Label>
                        <Input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-48" />
                        <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
                    </div>

                    {report && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Attendance Report - {report.month}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead className="text-center">Present</TableHead>
                                            <TableHead className="text-center">Absent</TableHead>
                                            <TableHead className="text-center">Late</TableHead>
                                            <TableHead className="text-center">Leave</TableHead>
                                            <TableHead className="text-center">Total Hours</TableHead>
                                            <TableHead className="text-center">Rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.report.map((r) => (
                                            <TableRow key={r.employee._id}>
                                                <TableCell className="font-medium">{r.employee.name}</TableCell>
                                                <TableCell>{r.employee.department}</TableCell>
                                                <TableCell className="text-center text-green-600 font-medium">{r.stats.present}</TableCell>
                                                <TableCell className="text-center text-red-600 font-medium">{r.stats.absent}</TableCell>
                                                <TableCell className="text-center text-yellow-600 font-medium">{r.stats.late}</TableCell>
                                                <TableCell className="text-center">{r.stats.onLeave}</TableCell>
                                                <TableCell className="text-center">{r.stats.totalHours}h</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={r.stats.attendanceRate >= 80 ? 'default' : r.stats.attendanceRate >= 60 ? 'secondary' : 'destructive'}>
                                                        {r.stats.attendanceRate}%
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Employee Detail Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Employee Profile</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                                <p className="text-muted-foreground">{selectedEmployee.role} - {selectedEmployee.department}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-muted-foreground">Email:</span> {selectedEmployee.email}</div>
                                <div><span className="text-muted-foreground">Phone:</span> {selectedEmployee.phone || 'N/A'}</div>
                                <div><span className="text-muted-foreground">Hire Date:</span> {new Date(selectedEmployee.hireDate).toLocaleDateString()}</div>
                                <div><span className="text-muted-foreground">Status:</span> <Badge variant={getStatusColor(selectedEmployee.status) as any}>{selectedEmployee.status}</Badge></div>
                                {selectedEmployee.salary && <div><span className="text-muted-foreground">Salary:</span> SAR {selectedEmployee.salary.toLocaleString()}</div>}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
