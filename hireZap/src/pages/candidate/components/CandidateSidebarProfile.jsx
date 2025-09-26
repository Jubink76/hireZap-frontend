
const CandidateSidebarProfile = ({ candidate, onClick }) => (
  <button 
    onClick={() => onClick && onClick(candidate)}
    className="w-full bg-white/90 backdrop-blur-sm rounded-lg p-4 mt-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-600 transition-all duration-200 text-left cursor-pointer"
  >
    <div className="flex items-center space-x-3">
      <img 
        src={candidate?.avatar} 
        alt={candidate?.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-slate-900 truncate text-sm">{candidate?.name}</h3>
        <p className="text-xs text-slate-600 truncate">{candidate?.role}</p>
      </div>
    </div>
  </button>
);
export default CandidateSidebarProfile;