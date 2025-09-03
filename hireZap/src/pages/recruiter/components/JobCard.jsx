import { useState } from "react"
import {
  MoreVertical,
  Eye,
  FileText,
  Users,
  MapPin,
  DollarSign,
  Clock,
} from "lucide-react"

const getJobStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "paused":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "closed":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function JobCard({ job, onViewJob, onEditJob, onViewApplicants }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-1">{job.title}</h4>
            <p className="text-slate-600 text-sm mb-2">{job.company}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {job.posted}
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-48">
              <button
                onClick={() => {
                  onViewJob?.(job)
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Job
              </button>
              <button
                onClick={() => {
                  onEditJob?.(job)
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileText className="h-4 w-4 mr-2" />
                Edit Job
              </button>
              <button
                onClick={() => {
                  onViewApplicants?.(job)
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-4 w-4 mr-2" />
                View Applicants
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Users className="h-4 w-4 mr-1" />
            {job.applicants} applicants
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getJobStatusColor(job.status)}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          <button
            onClick={() => onViewApplicants?.(job)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  )
}