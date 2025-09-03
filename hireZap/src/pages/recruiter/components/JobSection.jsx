import { Briefcase } from "lucide-react"
import JobCard from "./JobCard"

export default function JobsSection({ 
  jobs, 
  onCreateNewJob, 
  onViewJob, 
  onEditJob, 
  onViewApplicants 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-800">Your Created Jobs</h3>
            <p className="text-slate-600 text-sm mt-1">Manage your active job postings</p>
          </div>
          <button 
            onClick={onCreateNewJob}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/70 transition-colors text-sm font-medium text-slate-700 flex items-center"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Create New Job
          </button>
        </div>
      </div>
      
      {/* Jobs List */}
      <div className="p-6 space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onViewJob={onViewJob}
            onEditJob={onEditJob}
            onViewApplicants={onViewApplicants}
          />
        ))}
      </div>
    </div>
  )
}