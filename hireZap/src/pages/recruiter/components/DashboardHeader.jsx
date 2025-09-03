import { Filter, UserCheck, Bell } from "lucide-react"

export default function DashboardHeader({ 
  title = "Recruitment Overview", 
  subtitle = "Track your recruitment progress and manage candidates",
  onAddCandidate,
  onFilters,
  onNotifications 
}) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-800">{title}</h1>
            <p className="text-slate-600 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onFilters}
              className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/70 transition-colors text-sm font-medium text-slate-700 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button 
              onClick={onAddCandidate}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white shadow-lg rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Add Candidate
            </button>
            <button 
              onClick={onNotifications}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}