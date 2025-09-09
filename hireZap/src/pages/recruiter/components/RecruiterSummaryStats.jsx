"use client"
export default function RecruiterSummaryStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:w-auto w-full">
      <div className="text-center">
        <div className="text-2xl font-bold text-cyan-600">12</div>
        <div className="text-xs text-slate-500">Active Jobs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-600">156</div>
        <div className="text-xs text-slate-500">Total Applicants</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600">8</div>
        <div className="text-xs text-slate-500">Interviews Scheduled</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">5</div>
        <div className="text-xs text-slate-500">Hires This Month</div>
      </div>
    </div>
  )
}
