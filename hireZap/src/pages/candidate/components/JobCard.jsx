import { Bookmark, MapPin, Clock } from 'lucide-react';

const JobCard = ({ 
  job, 
  onSave, 
  isSaved = false, 
  onClick,
  onQuickApply
}) => {
  const {
    id,
    title,
    company,
    logo,
    coverImage,
    location,
    salary,
    type,
    posted,
    skills = [],
    description
  } = job;

  const handleSave = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(id);
    }
  };

  const handleQuickApply = (e) => {
    e.stopPropagation();
    if (onQuickApply) {
      onQuickApply(job);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-400/50 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg">
        <img
          src={coverImage}
          alt="Job cover"
          className="w-full h-full object-cover rounded-t-lg opacity-80"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full ${
              isSaved 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600'
            } hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt={company}
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{company}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 text-xs rounded-full ${
              type === 'Full-time' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {type}
            </span>
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              {location}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-700">{description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{posted}</span>
            </span>
          </div>
          <button 
            onClick={handleQuickApply}
            className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
          >
            ⚡ Quick Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
