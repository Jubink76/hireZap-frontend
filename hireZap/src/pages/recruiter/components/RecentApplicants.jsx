import React, { useState } from "react"
import {
  Search,
  MoreVertical,
  Eye,
  MessageSquare,
  FileText,
  MapPin,
  Clock,
  Star,
} from "lucide-react"

const getStatusColor = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "reviewed":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "interview":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function RecentApplicants({ applicants, onViewProfile, onSendMessage, onViewResume, onViewAllCandidates }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-800">Recent Applicants</h3>
            <p className="text-slate-600 text-sm mt-1">Engage with new talent</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 pb-4 border-b border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Applicants List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredApplicants.map((applicant) => (
          <div
            key={applicant.id}
            className="p-6 border-b border-white/20 last:border-b-0 hover:bg-white/30 transition-colors"
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-semibold">
                {applicant.avatar ? (
                  <img src={applicant.avatar} alt={applicant.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  applicant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{applicant.name}</h4>
                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === applicant.id ? null : applicant.id)}
                      className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {dropdownOpen === applicant.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-48">
                        <button
                          onClick={() => {
                            onViewProfile?.(applicant)
                            setDropdownOpen(null)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            onSendMessage?.(applicant)
                            setDropdownOpen(null)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </button>
                        <button
                          onClick={() => {
                            onViewResume?.(applicant)
                            setDropdownOpen(null)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">{applicant.position}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {applicant.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {applicant.appliedAt}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current text-amber-400" />
                    {applicant.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {applicant.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {applicant.skills.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        +{applicant.skills.length - 2}
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(applicant.status)}`}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/20">
        <button 
          onClick={onViewAllCandidates}
          className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/70 transition-colors text-sm font-medium text-slate-700"
        >
          View All Candidates
        </button>
      </div>
    </div>
  )
}

export default RecentApplicants;