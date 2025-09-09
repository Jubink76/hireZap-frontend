"use client"
import React from "react"
import { ChevronLeft } from "lucide-react"
import appLogo from '../../../assets/app-logo.png'
export default function RecruiterProfileNavigationSidebar({
  navigationItems,
  activeTab,
  setActiveTab,
}) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      {/* Card container */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl sticky top-6">
        {/* Header */}
        <div className="pb-2 border-b border-slate-200 p-4">
           <div className="flex items-center">
                    <button className="cursor-pointer">
                        <img
                        src={appLogo}
                        alt="HireZap Logo"
                        className="h-16 lg:h-24"
                        />
                    </button>
                    {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none h-9 hover:bg-accent hover:text-accent-foreground">
                        <ChevronLeft className="h-8 w-12" />
                     </button> */}
            </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1 p-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.id === activeTab
                  ? "bg-cyan-100 text-cyan-700 font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
