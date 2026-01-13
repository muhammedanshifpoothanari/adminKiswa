"use client"

import React, { useState } from "react"
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
    ChevronDown,
    BarChart3,
    Package,
    ListTree,
    UserCircle,
    ShieldCheck,
    Megaphone,
    LifeBuoy
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    href: string
    icon: any
    subItems?: { name: string; href: string }[]
}

const navItems: NavItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    {
        name: "CRM",
        href: "/crm",
        icon: Users,
        subItems: [
            { name: "Companies", href: "/crm" },
            { name: "Contacts", href: "/crm/contacts" },
            { name: "Outreach", href: "/outreach" },
        ]
    },
    { name: "Products", href: "/products", icon: Package },
    { name: "Categories", href: "/categories", icon: ListTree },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    {
        name: "Customers",
        href: "/customers",
        icon: UserCircle,
        subItems: [
            { name: "All Customers", href: "/customers" },
            { name: "Subscribers", href: "/customers/subscribers" },
        ]
    },
    {
        name: "Support",
        href: "/support",
        icon: LifeBuoy,
        subItems: [
            { name: "Messages", href: "/support/messages" },
        ]
    },
    { name: "Employees", href: "/employees", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    // State to track expanded items, strictly for UI toggle if needed. 
    // For now, we'll auto-expand if active.
    const [expanded, setExpanded] = useState<string[]>([])

    const toggleExpand = (name: string) => {
        setExpanded(prev =>
            prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
        )
    }

    return (
        <aside className="w-[var(--sidebar-width)] h-screen border-r bg-[var(--admin-sidebar)] sticky top-0 flex flex-col">
            <div className="h-[var(--header-height)] flex items-center px-6 border-b">
                <span className="text-xl font-bold tracking-tight">KISWA <span className="text-gray-400 font-normal">ADMIN</span></span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href)
                    const isExpanded = expanded.includes(item.name) || isActive

                    return (
                        <div key={item.href} className="space-y-1">
                            {item.subItems ? (
                                <>
                                    <div
                                        onClick={() => toggleExpand(item.name)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none",
                                            isActive
                                                ? "text-black bg-gray-100/50"
                                                : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </div>
                                        {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-1 mb-2 ml-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                            {item.subItems.map(sub => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className={cn(
                                                        "block px-4 py-2 text-sm transition-colors border-l-2",
                                                        pathname === sub.href
                                                            ? "bg-white text-black font-medium border-black"
                                                            : "text-gray-500 border-transparent hover:bg-gray-100 hover:text-black"
                                                    )}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive && !item.subItems
                                            ? "bg-black text-white"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </div>
                                </Link>
                            )}
                        </div>
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
