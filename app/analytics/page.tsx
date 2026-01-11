"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Users, Eye, ShoppingCart, Smartphone, MapPin, Monitor, Globe } from "lucide-react";

interface AnalyticsEvent {
    _id: string;
    eventType: string;
    url: string;
    timestamp: string;
    sessionId: string;
    ip: string;
    location?: {
        country?: string;
        city?: string;
        region?: string;
        timezone?: string;
    };
    device?: {
        type?: string;
        vendor?: string;
        model?: string;
    };
    os?: {
        name?: string;
        version?: string;
    };
    browser?: {
        name?: string;
        version?: string;
    };
    userAgent?: string;
    metadata?: Record<string, any>;
}

interface AnalyticsStats {
    totalPageViews: number;
    uniqueSessions: number;
    topProducts: { name: string; count: number }[];
    deviceStats: { name: string; value: number }[];
    recentActivity: AnalyticsEvent[];
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<AnalyticsEvent | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    useEffect(() => {
        fetch("/api/analytics/stats")
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load stats", err);
                setLoading(false);
            });
    }, []);

    function viewEventDetails(event: AnalyticsEvent) {
        setSelectedEvent(event);
        setDetailOpen(true);
    }

    if (loading) return <div className="p-8">Loading analytics...</div>;
    if (!stats) return <div className="p-8">Failed to load analytics data.</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">First-Party Analytics</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPageViews}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mobile Traffic</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.deviceStats.find(d => d.name === 'mobile')?.value || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Product Views</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.topProducts.length > 0 ? stats.topProducts[0].count : 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.topProducts}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stats.deviceStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                    {stats.deviceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex flex-wrap gap-4">
                            {stats.deviceStats.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="capitalize">{entry.name}: {entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity with View Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Stream</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-auto">
                        {stats.recentActivity.map((event, i) => (
                            <div key={i} className="flex items-center justify-between border-b last:border-0 py-3 hover:bg-gray-50 cursor-pointer rounded px-2" onClick={() => viewEventDetails(event)}>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="capitalize">{event.eventType.replace('_', ' ')}</Badge>
                                        {event.device?.type && <span className="text-xs text-muted-foreground"><Smartphone className="inline h-3 w-3" /> {event.device.type}</span>}
                                        {event.location?.country && <span className="text-xs text-muted-foreground"><MapPin className="inline h-3 w-3" /> {event.location.country}</span>}
                                    </div>
                                    <span className="text-xs text-muted-foreground truncate max-w-md">{event.url}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-muted-foreground text-right">
                                        {new Date(event.timestamp).toLocaleTimeString()}<br />
                                        {new Date(event.timestamp).toLocaleDateString()}
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && <p className="text-muted-foreground text-sm">No recent activity</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Event Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Event Details</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Event Type</h4>
                                    <p className="capitalize font-medium">{selectedEvent.eventType.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Timestamp</h4>
                                    <p>{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-sm font-semibold text-muted-foreground">URL</h4>
                                    <p className="text-sm break-all">{selectedEvent.url}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-muted-foreground">IP:</span> {selectedEvent.ip || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">Country:</span> {selectedEvent.location?.country || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">City:</span> {selectedEvent.location?.city || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">Timezone:</span> {selectedEvent.location?.timezone || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><Monitor className="h-4 w-4" /> Device & Browser</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-muted-foreground">Device Type:</span> {selectedEvent.device?.type || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">Vendor:</span> {selectedEvent.device?.vendor || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">Model:</span> {selectedEvent.device?.model || 'N/A'}</div>
                                    <div><span className="text-muted-foreground">OS:</span> {selectedEvent.os?.name} {selectedEvent.os?.version}</div>
                                    <div><span className="text-muted-foreground">Browser:</span> {selectedEvent.browser?.name} {selectedEvent.browser?.version}</div>
                                    <div><span className="text-muted-foreground">Session:</span> {selectedEvent.sessionId?.slice(0, 8)}...</div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><Globe className="h-4 w-4" /> User Agent</h3>
                                <p className="text-xs text-muted-foreground break-all bg-gray-50 p-3 rounded">{selectedEvent.userAgent || 'N/A'}</p>
                            </div>

                            {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-3">Metadata</h3>
                                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(selectedEvent.metadata, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
