import { useState } from 'react';

// Import all components
import DashboardHeader from '../candidate/components/DashboardHeader';
import ProfileSection from '../candidate/components/ProfileSection';
import FilterSection from './components/FilterSection';
import JobCard from '../candidate/components/JobCard';
import PremiumCard from '../../components/PremiumCard';
import RecruitersList from '../../components/RecruitersList';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileAvatar from '../../assets/profile_avatar.jpg'
// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechFlow",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=150&fit=crop",
    location: "Remote",
    salary: "$120k - $150k",
    type: "Full-time",
    posted: "2h",
    skills: ["React", "TypeScript", "GraphQL", "CSS"],
    description: "Lead the development of cutting-edge web applications using React and TypeScript. Collaborate with design and backend teams to deliver seamless user experiences."
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Nike",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=150&fit=crop",
    location: "Hybrid",
    salary: "$100k - $130k",
    type: "Full-time",
    posted: "1d",
    skills: ["Figma", "Prototyping", "User Research"],
    description: "Create intuitive interfaces and impactful user journeys. Work closely with product and engineering to ship beautiful experiences."
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Microsoft",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=150&fit=crop",
    location: "Remote",
    salary: "$140k - $180k",
    type: "Full-time",
    posted: "3d",
    skills: ["Python", "TensorFlow", "SQL", "ML Ops"],
    description: "Build predictive models and analyze large datasets to uncover insights. Partner with cross-functional teams to drive data-informed decisions."
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Apple",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=150&fit=crop",
    location: "Cupertino, CA",
    salary: "$110k - $140k",
    type: "Full-time",
    posted: "5d",
    skills: ["Sketch", "Figma", "Prototyping", "User Testing"],
    description: "Design innovative user experiences for millions of users worldwide. Work on cutting-edge products that shape the future of technology."
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Amazon",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=150&fit=crop",
    location: "Seattle, WA",
    salary: "$130k - $160k",
    type: "Full-time",
    posted: "1w",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    description: "Build and maintain scalable cloud infrastructure. Work with cutting-edge technologies to support millions of users worldwide."
  },
  {
    id: 6,
    title: "Backend Developer",
    company: "Google",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=150&fit=crop",
    location: "Mountain View, CA",
    salary: "$150k - $180k",
    type: "Full-time",
    posted: "2w",
    skills: ["Java", "Go", "MySQL", "Microservices"],
    description: "Develop high-performance backend systems that serve billions of requests. Join a team of world-class engineers building the future of search and AI."
  }
];

const CandidateDashboard = () => {

  const {user, loading, isAuthenticated} = useSelector((state)=>state.auth);
  // State management
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('Any');

  // Pagination settings
  const jobsPerPage = 3;
  const totalPages = Math.ceil(mockJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = mockJobs.slice(startIndex, startIndex + jobsPerPage);

  const userProfile = {
    name: user?.full_name || 'Anonymous',
    title : user?.role || 'candidate',
    avatar : user?.profile_image_url || profileAvatar,
    profileViews: 0,
    applications: 0,
    profileScore: 0
  };



  const navigate = useNavigate()
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
    navigate('/candidate/profile-dashboard')
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

  return (
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
                  job={job}
                  onSave={toggleSaveJob}
                  isSaved={savedJobs.includes(job.id)}
                  onClick={handleJobClick}
                  onQuickApply={handleQuickApply}
                />
              ))}
            </div>
            
            {/* Pagination Component */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={jobsPerPage}
              totalItems={mockJobs.length}
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
  );
};

export default CandidateDashboard;
