import { Users, ArrowRight } from "lucide-react"
import RecruiterCard from "./RecruiterCard"

// Mock recruiters data
const mockRecruiters = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Senior Technical Recruiter",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    jobsCount: 12
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    title: "Talent Acquisition Lead",
    company: "Meta",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=80&h=80&fit=crop&crop=face",
    jobsCount: 8
  },
  {
    id: 3,
    name: "David Kim",
    title: "Engineering Recruiter",
    company: "Netflix",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    jobsCount: 15
  },
  {
    id: 4,
    name: "Sarah Wilson",
    title: "Product Recruiter",
    company: "Airbnb",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    jobsCount: 6
  },
  {
    id: 5,
    name: "Michael Johnson",
    title: "Design Recruiter",
    company: "Figma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    jobsCount: 9
  }
]

const RecruitersList = ({ recruiters = mockRecruiters, onMessageRecruiter, onViewAll }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 transition-shadow hover:shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Active Recruiters</h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4">
        Connect with top recruiters
      </p>

      <div className="space-y-3">
        {recruiters.slice(0, 4).map((recruiter) => (
          <RecruiterCard
            key={recruiter.id}
            recruiter={recruiter}
            onMessage={onMessageRecruiter}
          />
        ))}
      </div>

      <button 
        onClick={onViewAll}
        className="w-full mt-4 text-teal-600 hover:text-teal-700 py-2 text-xs font-medium border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
      >
        Discover more recruiters
      </button>
    </div>
  )
}

export default RecruitersList