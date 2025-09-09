"use client"
import React from "react"
import { Edit } from "lucide-react"

export default function RecruiterProfileHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
        Recruiter Profile
      </h1>

      {/* Edit Button */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 
                   focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none 
                   ring-offset-background h-10 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Profile
      </button>
    </div>
  )
}
