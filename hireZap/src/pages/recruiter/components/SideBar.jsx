import { useState } from "react"
import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Settings,
  Home,
  BarChart3,
  Building,
  MoreVertical,
  UserCheck,
  Database,
} from "lucide-react"

const sidebarItems = [
  { icon: Home, label: "Dashboard", key: "dashboard" },
  { icon: Briefcase, label: "Jobs", key: "jobs" },
  { icon: UserCheck, label: "Selection Procedure", key: "selection" },
  { icon: MessageSquare, label: "Messages", key: "messages" },
  { icon: Database, label: "Talent Pool", key: "talent" },
  { icon: BarChart3, label: "Reports", key: "reports" },
  { icon: Settings, label: "Settings", key: "settings" },
]

export default function Sidebar({ activeTab = "dashboard", onTabChange }) {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-white/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-8 border-b border-white/20">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-serif font-bold text-slate-800">TalentHub</h1>
            <p className="text-sm text-slate-600">Recruiter Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange?.(item.key)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-cyan-100/50 text-cyan-700 border border-cyan-200/50 shadow-sm"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-semibold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">Jane Doe</p>
              <p className="text-xs text-slate-600 truncate">Senior Recruiter</p>
            </div>
            <button className="p-1 rounded-lg hover:bg-white/50 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}