"use client"
import React from "react"
import { Briefcase } from "lucide-react"

export default function RecruiterProfileJobCard({ job }) {
  // Badge color classes based on status
  const badgeClasses =
    job.status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : job.status === "Interview Phase"
      ? "bg-cyan-100 text-cyan-700"
      : job.status === "Reviewing"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700"

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Briefcase className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-medium text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.department}</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-slate-500">{job.postedDate}</p>
          <p className="text-xs text-slate-400">{job.applicants} applicants</p>
        </div>

        {/* Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClasses}`}
        >
          {job.status}
        </span>

        {/* Manage job button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                     focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none
                     ring-offset-background h-8 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Manage Job
        </button>
      </div>
    </div>
  )
}
