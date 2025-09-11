import { MessageCircle, Building } from "lucide-react"

const RecruiterCard = ({ recruiter, onMessage }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-teal-600">
      <div className="flex items-start space-x-2">
        <img
          src={recruiter.avatar}
          alt={recruiter.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className="font-medium text-slate-900 truncate text-sm">{recruiter.name}</h4>
          <p className="text-xs text-slate-600 truncate">{recruiter.title}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Building className="h-3 w-3 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 truncate">{recruiter.company}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
          {recruiter.jobsCount} positions
        </span>
        <button 
          onClick={() => onMessage(recruiter)}
          className="flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium whitespace-nowrap"
        >
          <MessageCircle className="h-3 w-3" />
          <span>Message</span>
        </button>
      </div>
    </div>
  )
}

export default RecruiterCard