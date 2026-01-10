import { Search, Bell, User } from "lucide-react"

export function AdminHeader() {
    return (
        <header className="h-[var(--header-height)] border-b bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for orders, products..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold leading-none">Admin User</p>
                        <p className="text-[10px] text-gray-400">Owner</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                        AU
                    </div>
                </div>
            </div>
        </header>
    )
}
