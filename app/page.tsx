import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

const stats = [
  {
    label: "Total Revenue",
    value: "45,231.89 SAR",
    change: "+20.1%",
    trend: "up",
    icon: CreditCard
  },
  {
    label: "Orders",
    value: "+2350",
    change: "+180.1%",
    trend: "up",
    icon: ShoppingBag
  },
  {
    label: "Customers",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    icon: Users
  },
  {
    label: "Active Now",
    value: "+573",
    change: "-201",
    trend: "down",
    icon: TrendingUp
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Detailed performance metrics for Kiswa Store.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
            Manage Store
          </button>
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
        {/* Recent Orders - Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 first:pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-[10px] uppercase">
                    OR
                  </div>
                  <div>
                    <p className="font-bold text-sm">Order #KS-00{i}84</p>
                    <p className="text-[10px] text-gray-400">2 mins ago • 3 items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">499.00 SAR</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Products - Placeholder */}
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h3 className="text-lg font-bold mb-8">Popular Products</h3>
          <div className="space-y-6">
            {[
              { name: "Medina Silk Prayer Rug", sales: 124, price: "349.00 SAR" },
              { name: "Premium Velvet Abaya", sales: 89, price: "599.00 SAR" },
              { name: "Qalam Travel Set", sales: 76, price: "189.00 SAR" },
              { name: "Luxury Oud Wood Case", sales: 54, price: "99.00 SAR" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.sales} sales</p>
                </div>
                <p className="font-bold text-sm whitespace-nowrap">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
