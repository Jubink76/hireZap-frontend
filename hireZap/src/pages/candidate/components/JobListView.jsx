import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MapPin, Clock, Bookmark } from 'lucide-react';

const JobListView = () => {
  const navigate = useNavigate();
  const { savedJobsCount, setSavedJobsCount } = useOutletContext();
  
  const [savedJobs, setSavedJobs] = useState([]);

  // Sample jobs data
  const jobs = [
    {
      id: 1,
      title: 'Senior Product Designer',
      company: 'Creative Solutions Inc.',
      logo: 'https://via.placeholder.com/40',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$140k - $170k',
      type: 'Full-time',
      posted: '3 days ago',
      skills: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
      description: 'We\'re seeking a Senior Product Designer to lead end-to-end design across core experiences.',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    },
    {
      id: 2,
      title: 'Lead Product Designer',
      company: 'PixelCraft Labs',
      logo: 'https://via.placeholder.com/40',
      location: 'Remote',
      salary: '$150k - $180k',
      type: 'Full-time',
      posted: '5 days ago',
      skills: ['Product Design', 'Leadership', 'User Research'],
      description: 'Lead our design team and shape the future of our product.',
      coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    },
  ];

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSaved = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      setSavedJobsCount(newSaved.length);
      return newSaved;
    });
  };

  const handleJobClick = (jobId) => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recommended Jobs</h1>
        <p className="text-gray-600">Based on your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleJobClick(job.id)}
          >
            {/* Cover Image */}
            <div className="relative h-40 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg">
              <img
                src={job.coverImage}
                alt="Job cover"
                className="w-full h-full object-cover rounded-t-lg opacity-80"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveJob(job.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  savedJobs.includes(job.id)
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-600'
                } hover:bg-teal-600 hover:text-white transition-colors`}
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-10 h-10 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t text-sm text-gray-600">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs">{job.location.split(',')[0]}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">{job.posted}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListView;