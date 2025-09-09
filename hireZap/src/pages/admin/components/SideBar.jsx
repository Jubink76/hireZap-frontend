import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "recruiters", label: "Recruiters", icon: UserCheck },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "job-posts", label: "Job Posts", icon: Briefcase },
  { id: "verifications", label: "Verifications", icon: ShieldCheck },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <div className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white/90 backdrop-blur-sm border-r border-slate-200 transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-6">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-full bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-cyan-100 text-cyan-700 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}