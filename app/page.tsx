'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Loader2
} from "lucide-react"

interface DashboardData {
  stats: {
    revenue: { value: number; change: number; trend: string };
    orders: { value: number; thisMonth: number; change: number; trend: string };
    customers: { value: number; thisMonth: number; change: number; trend: string };
    activeSessions: number;
    products: number;
  };
  recentOrders: {
    _id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    paymentStatus: string;
    itemCount: number;
    createdAt: string;
  }[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Failed to load dashboard data</div>;
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `${data.stats.revenue.value.toLocaleString()} SAR`,
      change: `${data.stats.revenue.change >= 0 ? '+' : ''}${data.stats.revenue.change}%`,
      trend: data.stats.revenue.trend,
      icon: CreditCard
    },
    {
      label: "Orders",
      value: data.stats.orders.value.toString(),
      change: `${data.stats.orders.change >= 0 ? '+' : ''}${data.stats.orders.change}%`,
      trend: data.stats.orders.trend,
      icon: ShoppingBag
    },
    {
      label: "Customers",
      value: data.stats.customers.value.toString(),
      change: `${data.stats.customers.change >= 0 ? '+' : ''}${data.stats.customers.change}%`,
      trend: data.stats.customers.trend,
      icon: Users
    },
    {
      label: "Active Now",
      value: data.stats.activeSessions.toString(),
      change: "Live",
      trend: "up",
      icon: TrendingUp
    },
  ];

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Live performance metrics for Kiswa Store.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/products" className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" /> {data.stats.products} Products
          </Link>
          <Link href="/orders" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-black" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">View All</Link>
          </div>
          <div className="space-y-6">
            {data.recentOrders.length > 0 ? data.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-4 border-b last:border-0 first:pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-[10px] uppercase">
                    {order.orderNumber?.slice(-3) || 'ORD'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{order.orderNumber}</p>
                    <p className="text-[10px] text-gray-400">{getTimeAgo(order.createdAt)} • {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} • {order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{order.total?.toLocaleString()} SAR</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h3 className="text-lg font-bold mb-8">Top Products</h3>
          <div className="space-y-6">
            {data.topProducts.length > 0 ? data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border flex-shrink-0 flex items-center justify-center font-bold text-gray-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.sales} sold</p>
                </div>
                <p className="font-bold text-sm whitespace-nowrap">{p.revenue?.toLocaleString()} SAR</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-8">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
