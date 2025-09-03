import { Users, Briefcase, Building2, TrendingUp } from "lucide-react"

const statsData = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    changeType: "increase",
    icon: Users,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  },
  {
    title: "Active Job Posts",
    value: "3,254",
    change: "+8.2%",
    changeType: "increase",
    icon: Briefcase,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    title: "Companies",
    value: "1,023",
    change: "+15.8%",
    changeType: "increase",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Monthly Growth",
    value: "23.4%",
    change: "+3.1%",
    changeType: "increase",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-serif font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}