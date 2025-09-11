import { Search, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const RecentApplicants = ({ applicants, onSearchCandidates }) => {
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 transition-shadow hover:shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Recent Applicants</h2>
        </div>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1">
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4">
        Latest candidate applications
      </p>
      
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search candidates"
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          onChange={(e) => onSearchCandidates(e.target.value)}
        />
      </div>
      
      <div className="space-y-3">
        {applicants.slice(0, 4).map((applicant) => (
          <div key={applicant.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-teal-600">
            <div className="flex items-start space-x-2">
              <img 
                src={applicant.avatar} 
                alt={applicant.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 overflow-hidden">
                <h4 className="font-medium text-slate-900 truncate text-sm">{applicant.name}</h4>
                <p className="text-xs text-slate-600 truncate">{applicant.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-500 truncate">{applicant.location}</span>
                  <Clock className="h-3 w-3 ml-2 text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-500">{applicant.applied}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                  ⭐ {applicant.rating}
                </span>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  applicant.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  applicant.status === 'Reviewed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {applicant.status}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {applicant.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-teal-600 hover:text-teal-700 py-2 text-xs font-medium border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">
        View more applicants
      </button>
    </div>
  );
};

export default RecentApplicants;