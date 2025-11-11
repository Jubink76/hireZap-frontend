import { useState, useEffect } from 'react';
import { fetchActiveJobs } from '../../redux/slices/jobSlice';
import { fetchCompanyById } from '../../redux/slices/companySlice';
// Import all components
import DashboardHeader from '../candidate/components/DashboardHeader';
import ProfileSection from '../candidate/components/ProfileSection';
import FilterSection from './components/FilterSection';
import JobCard from '../candidate/components/JobCard';
import PremiumCard from '../../components/PremiumCard';
import RecruitersList from '../../components/RecruitersList';
import Pagination from '../../components/Pagination';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import profileAvatar from '../../assets/profile_avatar.jpg'
import CandidatePremiumModal from '../../modals/CandidatePremiumModal';

const CandidateDashboard = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {user, isAuthenticated} = useSelector((state)=>state.auth);
  const { allActiveJobs, loading, error } = useSelector((state) => state.job);
  const { companiesById } = useSelector(state => state.company);
  

  // State management
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('Any');

  const [isOpenPremiumModal, setIsOpenPremiumModal] = useState(false)

  const openPremiumModal = () => setIsOpenPremiumModal(true);
  const closePremiumModal = () => setIsOpenPremiumModal(false);

  useEffect(() => {
    console.log("🔄 Fetching active jobs...");
    dispatch(fetchActiveJobs());
  }, [dispatch]);

  useEffect(() => {
    if (allActiveJobs?.length > 0) {
      allActiveJobs.forEach(job => {
        if (job.company_id && !companiesById[job.company_id]) {
          dispatch(fetchCompanyById(job.company_id));
        }
      });
    }
  }, [allActiveJobs, dispatch]);

  // Pagination settings
  const jobsPerPage = 3;
  const jobs = allActiveJobs || [];
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const userProfile = {
    name: user?.full_name || 'Anonymous',
    title : user?.role || 'candidate',
    avatar : user?.profile_image_url || profileAvatar,
    profileViews: 0,
    applications: 0,
    profileScore: 0
  };


  // Event handlers
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (job) => {
    console.log('Job clicked:', job);
    // Navigate to job details page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleViewProfile = () => {
    navigate('/candidate/profile-overview')
  };

  const handleQuickApply = (job) => {
    console.log('Quick apply for job:', job);
    // Handle quick apply functionality
  };

  const handlePremiumUpgrade = () => {
    console.log('Premium upgrade clicked');
    // Handle premium upgrade
  };

  const handleMessageRecruiter = (recruiter) => {
    console.log('Message recruiter:', recruiter);
    // Handle messaging functionality
  };

  const handleViewAllRecruiters = () => {
    console.log('View all recruiters clicked');
    // Navigate to recruiters page
  };

  const transformJob = (job) => {
    const companyData = companiesById[job.company_id];
    return{ 
      id: job.id,
      title: job.job_title,
      company: companyData?.company_name || 'Unknown Company', 
      logo: companyData?.logo_url || "https://via.placeholder.com/40",
      coverImage: job.cover_image,
      location: job.location,
      salary: job.compensation_range || 'Not specified',
      type: job.employment_type,
      posted: getTimeAgo(job.created_at),
      skills: parseSkills(job.skills_required),
      description: job.role_summary,
      workType: job.work_type,
      applicationLink: job.application_link,
      applicationDeadline: job.application_deadline,
    }
  };

  const parseSkills = (skillsJson) => {
    if (!skillsJson) return [];
    try {
      return JSON.parse(skillsJson);
    } catch {
      return [];
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <DashboardHeader
        savedJobsCount={savedJobs.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      
      <div className="max-w-7xl mx-auto px-2 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Section Component */}
            <ProfileSection 
              profile={userProfile}
              onViewProfile={handleViewProfile}
            />
            
            {/* Filter Section Component */}
            <FilterSection 
              selectedJobTypes={selectedJobTypes}
              setSelectedJobTypes={setSelectedJobTypes}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
              selectedSalaryRange={selectedSalaryRange}
              setSelectedSalaryRange={setSelectedSalaryRange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Job Cards */}
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={transformJob(job)}
                  onSave={toggleSaveJob}
                  isSaved={savedJobs.includes(job.id)}
                  onClick={handleJobClick}
                  onQuickApply={handleQuickApply}
                  onOpenPremiumModal={openPremiumModal}
                />
              ))}
            </div>
            
            {/* Pagination Component */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={jobsPerPage}
              totalItems={jobs.length}
              startIndex={startIndex}
            />

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Premium Card Component */}
            <PremiumCard 
              onUpgrade={handlePremiumUpgrade}
            />
            
            {/* Recruiters List Component */}
            <RecruitersList 
              onMessageRecruiter={handleMessageRecruiter}
              onViewAll={handleViewAllRecruiters}
            />
          </div>
        </div>
      </div>
    </div>
      <CandidatePremiumModal
        isOpen={isOpenPremiumModal}              // ✅ Pass state here
        onClose={closePremiumModal}              // ✅ Pass function to close modal
      />       
    </>
  );
};

export default CandidateDashboard;
