"use client"
import React from "react"
import { Briefcase, Badge } from "lucide-react"

// This is your self-contained RecruiterJobList component
export default function RecruiterJobList({ jobs }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-slate-200">
        <h2 className="flex items-center gap-2 text-slate-900 text-lg font-semibold">
          <Briefcase className="h-5 w-5 text-cyan-600" />
          Recent Job Postings
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {/* Job Info */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500">{job.department}</p>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">{job.postedDate}</p>
                <p className="text-xs text-slate-400">{job.applicants} applicants</p>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : job.status === "Interview Phase"
                    ? "bg-cyan-100 text-cyan-700"
                    : job.status === "Reviewing"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {job.status}
              </span>

              {/* Manage Button */}
              <button className="px-3 py-1.5 rounded-md text-sm bg-cyan-600 hover:bg-cyan-700 text-white">
                Manage Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
