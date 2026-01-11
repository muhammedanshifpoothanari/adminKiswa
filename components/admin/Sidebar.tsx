"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    MessageSquare,
    LogOut,
    ChevronRight,
    BarChart3,
    Package,
    ListTree,
    UserCircle,
    ShieldCheck,
    Megaphone
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "CRM", href: "/crm", icon: Users },
    { name: "Outreach", href: "/outreach", icon: Megaphone },
    { name: "Products", href: "/products", icon: Package },
    { name: "Categories", href: "/categories", icon: ListTree },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Customers", href: "/customers", icon: UserCircle },
    { name: "Employees", href: "/employees", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-[var(--sidebar-width)] h-screen border-r bg-[var(--admin-sidebar)] sticky top-0 flex flex-col">
            <div className="h-[var(--header-height)] flex items-center px-6 border-b">
                <span className="text-xl font-bold tracking-tight">KISWA <span className="text-gray-400 font-normal">ADMIN</span></span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                                isActive
                                    ? "bg-black text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-error transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
