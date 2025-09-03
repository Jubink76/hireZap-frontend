"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import RecentUsers from "./components/RecentUsers"
import StatsCards from "./components/StatsCards"
import DashboardContent from "./components/DashboardContent"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome back, Admin
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <StatsCards />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DashboardContent />
                  </div>
                  <div className="lg:col-span-1">
                    <RecentUsers />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== "dashboard" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
                </h2>
                <p className="text-slate-600">
                  This section is under development. Content for {activeTab} will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}