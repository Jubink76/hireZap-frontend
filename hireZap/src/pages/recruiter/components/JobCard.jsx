import { Plus, Briefcase, ArrowRight, MapPin, DollarSign, Calendar } from "lucide-react";

const JobCard = ({ job, onManage }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-teal-600">
    <div className="flex items-start space-x-2">
      <img 
        src={job.logo} 
        alt={job.company}
        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0 overflow-hidden">
        <h4 className="font-medium text-slate-900 truncate text-sm">{job.title}</h4>
        <p className="text-xs text-slate-600 truncate">{job.company}</p>
        <div className="flex items-center space-x-1 mt-1">
          <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate">{job.location}</span>
          <DollarSign className="h-3 w-3 ml-2 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500">{job.salary}</span>
          <Calendar className="h-3 w-3 ml-2 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500">{job.posted}</span>
        </div>
      </div>
    </div>
    
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
          {job.applicants} applicants
        </span>
        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          job.status === 'Active' ? 'bg-green-100 text-green-800' :
          job.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {job.status}
        </div>
      </div>
      <button 
        onClick={() => onManage(job)}
        className="flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium whitespace-nowrap"
      >
        <span>Manage</span>
      </button>
    </div>

    <div className="flex flex-wrap gap-1 mt-2">
      {job.skills.slice(0, 3).map((skill, index) => (
        <span 
          key={index}
          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);
export default JobCard;