import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobById, fetchActiveJobs } from '../../../redux/slices/jobSlice';
import { fetchCompanyById } from '../../../redux/slices/companySlice';
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  ArrowLeft,
  Share2,
  ChevronRight,
  Building2,
  Users,
  ExternalLink,
  Search
} from 'lucide-react';

const JobDetailView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobsCount, setSavedJobsCount } = useOutletContext();
  
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentJob, allActiveJobs, loading } = useSelector((state) => state.job);
  const { companiesById } = useSelector((state) => state.company);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
    // Fetch all jobs for the list
    dispatch(fetchActiveJobs());
  }, [jobId, dispatch]);

  useEffect(() => {
    if (currentJob?.company_id && !companiesById[currentJob.company_id]) {
      dispatch(fetchCompanyById(currentJob.company_id));
    }
  }, [currentJob, dispatch, companiesById]);

  // Helper functions
  const parseSkills = (skillsJson) => {
    if (!skillsJson) return [];
    if (Array.isArray(skillsJson)) return skillsJson;
    try {
      return JSON.parse(skillsJson);
    } catch {
      return [];
    }
  };

  const parseTextToArray = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    if (typeof text === 'string') {
      return text.split('\n').filter(item => item.trim() !== '');
    }
    return [text];
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const getDeadline = (deadlineString) => {
    if (!deadlineString) return 'Not specified';
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `${diffInDays} days left`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks left`;
    return `${Math.floor(diffInDays / 30)} months left`;
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setSavedJobsCount(prev => isSaved ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentJob?.job_title,
        text: `Check out this job: ${currentJob?.job_title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleApply = () => {
    navigate(`/candidate/jobs/${jobId}/apply`);
  };

  const handleBackToJobs = () => {
    navigate('/candidate/dashboard');
  };

  const handleJobClick = (selectedJobId) => {
    navigate(`/candidate/jobs/${selectedJobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="text-teal-600 hover:text-teal-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const companyData = companiesById[currentJob.company_id];
  
  // Process current job data
  const job = {
    id: currentJob.id,
    title: currentJob.job_title,
    company: companyData?.company_name || 'Unknown Company',
    logo: companyData?.logo_url || 'https://via.placeholder.com/80',
    coverImage: currentJob.cover_image || 'https://via.placeholder.com/1200x300',
    location: currentJob.location,
    salary: currentJob.compensation_range || 'Not specified',
    type: currentJob.employment_type || 'Not specified',
    workType: currentJob.work_type || '',
    posted: getTimeAgo(currentJob.created_at),
    skills: parseSkills(currentJob.skills_required),
    description: currentJob.role_summary || 'No description available',
    employeeCount: companyData?.employee_count || '200-500 employees',
    industry: companyData?.industry || 'Software · Technology',
    aboutCompany: companyData?.description || 'No description available',
    responsibilities: parseTextToArray(currentJob.key_responsibilities),
    requirements: parseTextToArray(currentJob.requirements),
    benefits: parseTextToArray(currentJob.benefits),
    applicants: '25 applicants',
    deadline: getDeadline(currentJob.application_deadline),
  };

  // Transform jobs list
  const jobsList = (allActiveJobs || []).map(j => {
    const company = companiesById[j.company_id];
    return {
      id: j.id,
      title: j.job_title,
      company: company?.company_name || 'Unknown Company',
      logo: company?.logo_url || 'https://via.placeholder.com/40',
      location: j.location,
      posted: getTimeAgo(j.created_at),
      skills: parseSkills(j.skills_required),
    };
  });

  // Filter jobs based on search
  const filteredJobs = jobsList.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Job List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleBackToJobs}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Job Listings</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto">
          {filteredJobs.map((j) => (
            <div
              key={j.id}
              onClick={() => handleJobClick(j.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                j.id === parseInt(jobId)
                  ? 'bg-teal-50 border-l-4 border-l-teal-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={j.logo}
                  alt={j.company}
                  className="w-12 h-12 rounded-lg flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {j.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{j.company}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {j.location.split(',')[0]}
                    </span>
                    <span>•</span>
                    <span>{j.posted}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {j.skills.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {j.skills.length > 2 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        +{j.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Job Detail Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
            <button
              onClick={handleBackToJobs}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Save"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cover Image */}
          {job.coverImage && (
            <div className="relative h-64">
              <img
                src={job.coverImage}
                alt="Job cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          {/* Job Header */}
          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 rounded-lg border-2 border-white shadow-md object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-700 mb-3">{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type}
                      {job.workType && ` · ${job.workType}`}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {job.posted}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm bg-green-50 text-green-800 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Apply Section */}
            <div className="mt-6 p-6 bg-teal-50 rounded-lg border border-teal-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Apply Now</h3>
                  <p className="text-sm text-gray-600">
                    Be among the first {job.applicants}
                  </p>
                  <p className="text-sm text-gray-600">
                    Application deadline: {job.deadline}
                  </p>
                </div>
              </div>
              <button
                onClick={handleApply}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Company Info */}
            {companyData && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About {job.company}
                </h3>
                <div className="flex items-start space-x-4 mb-4">
                  <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span className="text-gray-700">{job.employeeCount}</span>
                </div>
                <div className="flex items-start space-x-4 mb-4">
                  <Building2 className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span className="text-gray-700">{job.industry}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{job.aboutCompany}</p>
                <button className="mt-4 flex items-center text-teal-600 hover:text-teal-700 font-medium">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Company Page
                </button>
              </div>
            )}

            {/* About This Role */}
            {job.description && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Role</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Key Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mr-3 mt-2"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks */}
            {job.benefits.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mr-3 mt-2"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Apply Section */}
            <div className="mt-10 pt-8 border-t border-gray-200 mb-8">
              <button
                onClick={handleApply}
                className="w-full py-4 bg-teal-600 text-white text-lg font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <span>Apply for this Position</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailView;