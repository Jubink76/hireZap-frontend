import { Search, Bookmark } from 'lucide-react';
import hireZapLogo from '../../../assets/hireZap.png'

const DashboardHeader = ({ savedJobsCount = 0, onSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4 w-full shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="cursor-pointer">
            <img 
              src={hireZapLogo} 
              alt="HireZap Logo" 
              className="h-12 lg:h-14"
            />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Explore Your Future</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch(searchQuery)}
              className="pl-10 pr-4 py-2 w-80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
            <Bookmark className="h-4 w-4" />
            <span className="text-sm font-medium">Saved Jobs ({savedJobsCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;