import { useState } from "react"
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronDown
} from "lucide-react"

// Mock recent job posts for admin review
const recentJobPosts = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Creative Solutions Inc.",
    logo: "/placeholder.svg",
    location: "Remote",
    salary: "$80,000 - $100,000",
    type: "Full-time",
    posted: "2 days ago",
    status: "active",
    applicants: 23,
    skills: ["UI/UX", "Figma", "Design Systems"],
    description: "Join our innovative team to design cutting-edge products that impact millions of users worldwide.",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "TechFlow Solutions",
    logo: "/placeholder.svg",
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    type: "Full-time",
    posted: "1 day ago",
    status: "pending",
    applicants: 45,
    skills: ["React", "TypeScript", "Next.js"],
    description: "Build responsive web applications using modern JavaScript frameworks and cutting-edge technologies.",
  },
  {
    id: 3,
    title: "AI/ML Engineer",
    company: "DataMind Corp",
    logo: "/placeholder.svg",
    location: "New York, NY",
    salary: "$110,000 - $150,000",
    type: "Full-time",
    posted: "3 days ago",
    status: "active",
    applicants: 67,
    skills: ["Python", "TensorFlow", "Machine Learning"],
    description: "Develop and deploy machine learning models to solve complex business problems and drive innovation.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    logo: "/placeholder.svg",
    location: "Austin, TX",
    salary: "$95,000 - $130,000",
    type: "Full-time",
    posted: "1 week ago",
    status: "expired",
    applicants: 34,
    skills: ["AWS", "Docker", "Kubernetes"],
    description: "Manage cloud infrastructure and automate deployment processes for high-scale applications.",
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700"
    case "pending":
      return "bg-yellow-100 text-yellow-700"
    case "expired":
      return "bg-red-100 text-red-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export default function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const jobsPerPage = 3
  const totalPages = Math.ceil(recentJobPosts.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const currentJobs = recentJobPosts.slice(startIndex, startIndex + jobsPerPage)

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200">
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-serif font-semibold text-slate-900">Recent Job Posts</h2>
          
          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-9 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-32 h-9 px-3 py-2 border border-slate-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span className="text-sm">
                  {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-32 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  {["all", "active", "pending", "expired"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status)
                        setDropdownOpen(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300 hover:bg-cyan-50/30"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-serif font-semibold text-slate-900">
                            {job.title}
                          </h3>
                          <p className="text-slate-700 font-medium">{job.company}</p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{job.posted}</span>
                        </div>
                        <div className="text-cyan-600 font-medium">
                          {job.applicants} applicants
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-4">
                    <button className="p-2 text-slate-400 hover:text-cyan-600 rounded transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 rounded transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 rounded transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(startIndex + jobsPerPage, recentJobPosts.length)} of {recentJobPosts.length} job posts
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page 
                      ? "bg-cyan-600 text-white hover:bg-cyan-700" 
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}