"use client"

import { useState } from "react"
import {
  User,
  Briefcase,
  Users,
  Bell,
  BarChart3,
  Settings as SettingsIcon,
  Building2,
  ChevronRight,
  LogOut,
} from "lucide-react"

import RecruiterProfileNavigationSidebar from "../recruiter/components/RecruiterProfileNavigationSidebar"

export default function RecruiterAccountSettings() {
  const [activeTab, setActiveTab] = useState("settings")

  const navigationItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "jobs", label: "Job Management", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
    { id: "settings", label: "Account Settings", icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <RecruiterProfileNavigationSidebar
            navigationItems={navigationItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="rounded-lg shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
              <div className="p-4 border-b">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  Account Settings
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Personal Information</h4>
                      <p className="text-sm text-slate-600">Update your profile details</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Company Settings</h4>
                      <p className="text-sm text-slate-600">
                        Manage company information and branding
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Notification Preferences</h4>
                      <p className="text-sm text-slate-600">Control recruitment notifications</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Billing & Subscription</h4>
                      <p className="text-sm text-slate-600">Manage your recruitment plan</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="h-px bg-slate-200 my-4"></div>

                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 w-full text-red-600 border border-red-200 hover:bg-red-50 bg-transparent">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
