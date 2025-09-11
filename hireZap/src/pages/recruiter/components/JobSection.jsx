import { Briefcase, Plus } from "lucide-react";
import Pagination from "../../../components/Pagination";
import JobCard from "../../recruiter/components/JobCard";
const JobSection = ({ jobs, onCreateJob, onManageJob, currentPage, onPageChange, itemsPerPage }) => {
  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 transition-shadow hover:shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Your Created Jobs</h2>
        </div>
        <button 
          onClick={onCreateJob}
          className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center space-x-1"
        >
          <Plus className="h-3 w-3" />
          <span>Create Job</span>
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4">
        Manage your job postings
      </p>
      
      <div className="space-y-3">
        {currentJobs.slice(0, 3).map((job) => (
          <JobCard key={job.id} job={job} onManage={onManageJob} />
        ))}
      </div>


      <button className="w-full mt-4 text-teal-600 hover:text-teal-700 py-2 text-xs font-medium border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">
        View all jobs
      </button>
      
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            startIndex={startIndex}
          />
        </div>
      )}
    </div>
  );
};
export default JobSection;