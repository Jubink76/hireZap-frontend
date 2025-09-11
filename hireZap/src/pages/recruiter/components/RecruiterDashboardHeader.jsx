import {Filter, Plus, Bell} from 'lucide-react'
import hireZapLogo from '../../../assets/hireZap.png'

const RecruiterDashboardHeader = ({ searchQuery, setSearchQuery, onAddCandidate }) => {
  
  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4 w-full shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="cursor-pointer">
            <img 
              src={hireZapLogo} 
              alt="HireZap Logo" 
              className="h-12 lg:h-14 mx-auto"
            />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Recruiter Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-teal-600 hover:cursor-pointer text-slate-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          <button 
            onClick={onAddCandidate}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Add Candidate</span>
          </button>
          
          <button className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 hover:cursor-pointer transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardHeader;