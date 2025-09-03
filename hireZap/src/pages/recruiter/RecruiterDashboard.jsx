"use client"

import { useState } from "react"
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
} from "lucide-react"

// Import all components
import SideBar from "../recruiter/components/SideBar"
import DashboardHeader from "../recruiter/components/DashboardHeader"
import StatsCards from "../recruiter/components/StatsCards"
import JobsSection from "../recruiter/components/JobSection"
import RecentApplicants from "../recruiter/components/RecentApplicants"

// Sample data
const summaryStats = [
  {
    title: "Total Applicants",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    color: "bg-cyan-500",
  },
  {
    title: "Active Jobs",
    value: "24",
    change: "+3",
    changeType: "positive",
    icon: Briefcase,
    color: "bg-emerald-500",
  },
  {
    title: "Upcoming Interviews",
    value: "18",
    change: "Today",
    changeType: "neutral",
    icon: Calendar,
    color: "bg-amber-500",
  },
  {
    title: "Hire Rate",
    value: "68%",
    change: "+5.2%",
    changeType: "positive",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
]

const createdJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    applicants: 45,
    posted: "2 days ago",
    status: "active",
    skills: ["React", "TypeScript", "Node.js"],
    logo: "/creative-company-logo.png",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateLab",
    location: "New York, NY",
    salary: "$140k - $180k",
    type: "Full-time",
    applicants: 32,
    posted: "1 week ago",
    status: "active",
    skills: ["Strategy", "Analytics", "Leadership"],
    logo: "/abstract-tech-logo.png",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignStudio",
    location: "Austin, TX",
    salary: "$90k - $120k",
    type: "Full-time",
    applicants: 28,
    posted: "3 days ago",
    status: "paused",
    skills: ["Figma", "User Research", "Prototyping"],
    logo: "/ai-company-logo.png",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataFlow",
    location: "Seattle, WA",
    salary: "$130k - $170k",
    type: "Full-time",
    applicants: 52,
    posted: "5 days ago",
    status: "active",
    skills: ["Python", "Machine Learning", "SQL"],
    logo: "/cloud-company-logo.png",
  },
]

const recentApplicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Frontend Developer",
    avatar: "/professional-woman-headshot.png",
    experience: "5 years",
    location: "San Francisco, CA",
    appliedAt: "2 hours ago",
    status: "new",
    rating: 4.8,
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Product Manager",
    avatar: null,
    experience: "7 years",
    location: "New York, NY",
    appliedAt: "4 hours ago",
    status: "reviewed",
    rating: 4.6,
    skills: ["Strategy", "Analytics", "Leadership"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "UX Designer",
    avatar: null,
    experience: "4 years",
    location: "Austin, TX",
    appliedAt: "6 hours ago",
    status: "interview",
    rating: 4.9,
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: 4,
    name: "David Kim",
    position: "Data Scientist",
    avatar: null,
    experience: "6 years",
    location: "Seattle, WA",
    appliedAt: "1 day ago",
    status: "new",
    rating: 4.7,
    skills: ["Python", "Machine Learning", "SQL"],
  },
]

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Event handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    console.log("Tab changed to:", tab)
  }

  const handleAddCandidate = () => {
    console.log("Add candidate clicked")
  }

  const handleFilters = () => {
    console.log("Filters clicked")
  }

  const handleNotifications = () => {
    console.log("Notifications clicked")
  }

  const handleCreateNewJob = () => {
    console.log("Create new job clicked")
  }

  const handleViewJob = (job) => {
    console.log("View job:", job)
  }

  const handleEditJob = (job) => {
    console.log("Edit job:", job)
  }

  const handleViewApplicants = (job) => {
    console.log("View applicants for job:", job)
  }

  const handleViewProfile = (applicant) => {
    console.log("View profile:", applicant)
  }

  const handleSendMessage = (applicant) => {
    console.log("Send message to:", applicant)
  }

  const handleViewResume = (applicant) => {
    console.log("View resume:", applicant)
  }

  const handleViewAllCandidates = () => {
    console.log("View all candidates clicked")
  }

  // Get header configuration based on active tab
  const getHeaderConfig = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Recruitment Overview",
          subtitle: "Track your recruitment progress and manage candidates"
        }
      case "jobs":
        return {
          title: "Job Management",
          subtitle: "Create and manage your job postings"
        }
      case "selection":
        return {
          title: "Selection Procedure",
          subtitle: "Manage interview processes and candidate evaluation"
        }
      case "messages":
        return {
          title: "Messages",
          subtitle: "Communicate with candidates and team members"
        }
      case "talent":
        return {
          title: "Talent Pool",
          subtitle: "Browse and manage your candidate database"
        }
      case "reports":
        return {
          title: "Reports & Analytics",
          subtitle: "View recruitment metrics and performance data"
        }
      case "settings":
        return {
          title: "Settings",
          subtitle: "Manage your account and system preferences"
        }
      default:
        return {
          title: "Recruitment Overview",
          subtitle: "Track your recruitment progress and manage candidates"
        }
    }
  }

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Summary Cards */}
            <StatsCards stats={summaryStats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <JobsSection
                  jobs={createdJobs}
                  onCreateNewJob={handleCreateNewJob}
                  onViewJob={handleViewJob}
                  onEditJob={handleEditJob}
                  onViewApplicants={handleViewApplicants}
                />
              </div>

              {/* Recent Applicants */}
              <div>
                <RecentApplicants
                  applicants={recentApplicants}
                  onViewProfile={handleViewProfile}
                  onSendMessage={handleSendMessage}
                  onViewResume={handleViewResume}
                  onViewAllCandidates={handleViewAllCandidates}
                />
              </div>
            </div>
          </>
        )
      case "jobs":
        return (
          <div className="space-y-6">
            <JobsSection
              jobs={createdJobs}
              onCreateNewJob={handleCreateNewJob}
              onViewJob={handleViewJob}
              onEditJob={handleEditJob}
              onViewApplicants={handleViewApplicants}
            />
          </div>
        )
      case "selection":
        return (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Selection Procedure</h2>
            <p className="text-slate-600">Manage your selection processes and interview workflows.</p>
          </div>
        )
      case "messages":
        return (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Messages</h2>
            <p className="text-slate-600">Communicate with candidates and team members.</p>
          </div>
        )
      case "talent":
        return (
          <div className="space-y-6">
            <RecentApplicants
              applicants={recentApplicants}
              onViewProfile={handleViewProfile}
              onSendMessage={handleSendMessage}
              onViewResume={handleViewResume}
              onViewAllCandidates={handleViewAllCandidates}
            />
          </div>
        )
      case "reports":
        return (
          <div className="space-y-6">
            <StatsCards stats={summaryStats} />
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Detailed Reports</h2>
              <p className="text-slate-600">View comprehensive analytics and recruitment metrics.</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Settings</h2>
            <p className="text-slate-600">Manage your account and system preferences.</p>
          </div>
        )
      default:
        return null
    }
  }

  const headerConfig = getHeaderConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-teal-50">
      {/* Sidebar */}
      <SideBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <DashboardHeader
          title={headerConfig.title}
          subtitle={headerConfig.subtitle}
          onAddCandidate={handleAddCandidate}
          onFilters={handleFilters}
          onNotifications={handleNotifications}
        />

        {/* Dashboard Content */}
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}