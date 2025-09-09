"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import { ChevronRight, LogOut } from "lucide-react"

export default function AdminAccountSettings() {
  const [activeTab, setActiveTab] = useState("settings")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Settings</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">Manage your account & preferences</div>
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
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="p-6">
            {/* Settings Card */}
            <div className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm rounded-lg">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-serif font-semibold text-slate-900">
                  Account Settings
                </h2>
                <p className="text-sm text-slate-600">
                  Manage your admin account preferences and company details
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Personal Information
                    </h4>
                    <p className="text-sm text-slate-600">
                      Update your profile details
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Company Settings
                    </h4>
                    <p className="text-sm text-slate-600">
                      Manage company information and branding
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Notification Preferences
                    </h4>
                    <p className="text-sm text-slate-600">
                      Control system notifications
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Billing & Subscription
                    </h4>
                    <p className="text-sm text-slate-600">
                      Manage your plan and billing info
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>

                <hr className="border-slate-200" />

                <button className="w-full flex items-center justify-center px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 bg-transparent font-medium transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
