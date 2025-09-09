"use client"
import { useState } from "react"
import {
  User,
  Briefcase,
  Users,
  Bell,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react"
import RecruiterProfileNavigationSidebar from '../recruiter/components/RecruiterProfileNavigationSidebar'
import RecruiterProfileHeader from '../recruiter/components/RecruiterProfileHeader'
import RecruiterProfileCard from '../recruiter/components/RecruiterProfileCard'
import RecruiterJobList from '../recruiter/components/RecruiterJobList'

const navigationItems = [
  { id: "overview", label: "Overview", icon: User, active: true },
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "jobs", label: "Job Management", icon: Briefcase },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
  { id: "settings", label: "Account Settings", icon: Settings },
]

const recentJobPostings = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", postedDate: "2 days ago", status: "Active", applicants: 24 },
  { id: 2, title: "Product Manager", department: "Product", postedDate: "1 week ago", status: "Reviewing", applicants: 18 },
  { id: 3, title: "UX Designer", department: "Design", postedDate: "2 weeks ago", status: "Interview Phase", applicants: 12 },
  { id: 4, title: "Data Scientist", department: "Analytics", postedDate: "3 weeks ago", status: "Closed", applicants: 31 },
]

export default function RecruiterProfileDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <RecruiterProfileNavigationSidebar
            navigationItems={navigationItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <main className="flex-1 min-w-0">
            <RecruiterProfileHeader />
            <RecruiterProfileCard />
            <RecruiterJobList jobs={recentJobPostings} />
          </main>
        </div>
      </div>
    </div>
  )
}
