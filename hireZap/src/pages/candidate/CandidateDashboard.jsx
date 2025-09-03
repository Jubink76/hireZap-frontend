import { useState } from "react"
import { Bookmark } from "lucide-react"
import JobCard from "../candidate/components/JobCard"
import ProfileSection from "../candidate/components/ProfileSection"
import FilterSection from "../candidate/components/FilterSection"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"
import PremiumCard from "../../components/PremiumCard"
import RecruitersList from "../../components/RecruitersList"

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Creative Solutions Inc.",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
    location: "Remote",
    salary: "$80,000 - $100,000",
    type: "Full-time",
    posted: "2 days ago",
    skills: ["UI/UX", "Figma", "Design Systems"],
    description: "Join our innovative team to design cutting-edge products that impact millions of users worldwide.",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "TechFlow Solutions",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop",
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    type: "Full-time",
    posted: "1 day ago",
    skills: ["React", "TypeScript", "Next.js"],
    description: "Build responsive web applications using modern JavaScript frameworks and cutting-edge technologies.",
  },
  {
    id: 3,
    title: "AI/ML Engineer",
    company: "DataMind Corp",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    location: "New York, NY",
    salary: "$110,000 - $150,000",
    type: "Full-time",
    posted: "3 days ago",
    skills: ["Python", "TensorFlow", "Machine Learning"],
    description: "Develop and deploy machine learning models to solve complex business problems and drive innovation.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    location: "Austin, TX",
    salary: "$95,000 - $130,000",
    type: "Full-time",
    posted: "1 week ago",
    skills: ["AWS", "Docker", "Kubernetes"],
    description: "Manage cloud infrastructure and automate deployment processes for high-scale applications.",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateLab",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    location: "Seattle, WA",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    posted: "4 days ago",
    skills: ["Strategy", "Analytics", "Agile"],
    description: "Lead product development from conception to launch, working with cross-functional teams.",
  },
  {
    id: 6,
    title: "UX Researcher",
    company: "UserFirst Design",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
    location: "Remote",
    salary: "$75,000 - $95,000",
    type: "Full-time",
    posted: "5 days ago",
    skills: ["User Research", "Analytics", "Prototyping"],
    description: "Conduct user research to inform design decisions and improve user experience across products.",
  },
]

const CandidateDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobTypes, setSelectedJobTypes] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [savedJobs, setSavedJobs] = useState([])

  const jobsPerPage = 4
  const totalPages = Math.ceil(mockJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const currentJobs = mockJobs.slice(startIndex, startIndex + jobsPerPage)

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleJobClick = (job) => {
    console.log("Job clicked:", job)
    // Handle job details navigation
  }

  const handleEditProfile = () => {
    console.log("Edit profile clicked")
    // Handle profile editing
  }

  const handleSearch = (query) => {
    console.log("Search query:", query)
    // Handle search functionality
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePremiumUpgrade = () => {
    console.log("Premium upgrade clicked")
    // Handle premium upgrade
  }

  const handleMessageRecruiter = (recruiter) => {
    console.log("Message recruiter:", recruiter)
    // Handle messaging recruiter
  }

  const handleViewAllRecruiters = () => {
    console.log("View all recruiters clicked")
    // Handle view all recruiters
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-slate-900">Explore Your Future</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Bookmark className="h-4 w-4" />
                <span>Saved Jobs ({savedJobs.length})</span>
              </button>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Profile & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Section */}
            <ProfileSection 
              onEditProfile={handleEditProfile}
            />
            
            {/* Filter Section */}
            <FilterSection
              selectedJobTypes={selectedJobTypes}
              setSelectedJobTypes={setSelectedJobTypes}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
              selectedSalaryRange={selectedSalaryRange}
              setSelectedSalaryRange={setSelectedSalaryRange}
            />
          </div>

          {/* Middle - Search and Job Cards */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />

            {/* Job Cards Grid - One per row */}
            <div className="space-y-6 mb-8">
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={toggleSaveJob}
                  isSaved={savedJobs.includes(job.id)}
                  onClick={handleJobClick}
                />
              ))}
            </div>

            {/* No Jobs Found Message */}
            {currentJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-2">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {/* Pagination */}
            {currentJobs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={jobsPerPage}
                totalItems={mockJobs.length}
                startIndex={startIndex}
              />
            )}
          </div>

          {/* Right Sidebar - Premium & Recruiters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Premium Card */}
            <div className="sticky top-24">
              <PremiumCard onUpgrade={handlePremiumUpgrade} />
            </div>
            
            {/* Recruiters List */}
            <div className="sticky top-96">
              <RecruitersList
                onMessageRecruiter={handleMessageRecruiter}
                onViewAll={handleViewAllRecruiters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard