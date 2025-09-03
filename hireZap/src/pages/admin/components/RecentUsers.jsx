import { Clock, MoreVertical } from "lucide-react"

// Mock recent users data
const recentUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "/placeholder.svg",
    joinedAt: "2 hours ago",
    status: "active",
    role: "Job Seeker"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@techcorp.com",
    avatar: "/placeholder.svg",
    joinedAt: "5 hours ago",
    status: "pending",
    role: "Recruiter"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@startup.io",
    avatar: "/placeholder.svg",
    joinedAt: "1 day ago",
    status: "active",
    role: "Company Admin"
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@design.co",
    avatar: "/placeholder.svg",
    joinedAt: "2 days ago",
    status: "active",
    role: "Job Seeker"
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.w@enterprise.com",
    avatar: "/placeholder.svg",
    joinedAt: "3 days ago",
    status: "inactive",
    role: "Recruiter"
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700"
    case "pending":
      return "bg-yellow-100 text-yellow-700"
    case "inactive":
      return "bg-slate-100 text-slate-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export default function RecentUsers() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200">
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-serif font-semibold text-slate-900">Recent Users</h2>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.name} avatar`}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">{user.name}</h4>
                <p className="text-sm text-slate-600 truncate">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs text-slate-500">{user.role}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-right">
                {user.joinedAt}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            View All Users
          </button>
        </div>
      </div>
    </div>
  )
}