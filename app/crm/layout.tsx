import Link from 'next/link';
import { LayoutDashboard, MessageSquare, Plus, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CRMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-black text-xl mb-8">
                        <span className="bg-black text-white px-2 py-1 rounded">CRM</span>
                        <span>Outreach</span>
                    </div>

                    <nav className="space-y-1">
                        <Link href="/crm" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-black">
                            <LayoutDashboard className="w-4 h-4" />
                            Pipeline
                        </Link>
                        <Link href="/crm/contacts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 hover:text-black">
                            <Users className="w-4 h-4" />
                            Contacts
                        </Link>
                        <Link href="/crm/outreach" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 hover:text-black">
                            <MessageSquare className="w-4 h-4" />
                            Outreach
                        </Link>
                        <Link href="/crm/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 hover:text-black">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="p-4 mt-auto border-t">
                    <Button className="w-full bg-black text-white hover:bg-gray-800 gap-2">
                        <Plus className="w-4 h-4" /> New Deal
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                    <h1 className="text-lg font-bold">Sales Pipeline</h1>
                    <div className="flex items-center gap-4">
                        {/* User profile etc */}
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
