import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  Eye, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Check,
  Star,
  FileText,
  Award
} from 'lucide-react';

const CandidateProfessionalProfile = () => {
  // Sample data - replace with your actual data from Redux/API
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    title: "Senior Product Designer",
    bio: "Human-centered designer focusing on complex SaaS systems and design systems.",
    email: "alex_johnson@example.com",
    phone: "+1 415 555 0127",
    location: "San Francisco, CA",
    role: "Java designer"
  });

  const [profileCompletion, setProfileCompletion] = useState({
    uploadedProfilePhoto: true,
    addedBio: true,
    addedWorkExperience: true,
    uploadedLatestResume: false
  });

  const [resume, setResume] = useState({
    filename: "Resume_Alex_2024.pdf",
    size: "950 KB",
    uploaded: true
  });

  const [portfolio, setPortfolio] = useState({
    filename: "Portfolio_Casestudies.pdf",
    uploaded: true
  });

  const [skills, setSkills] = useState([
    { id: 1, name: "UI Design", proficiency: 5, years: 7 },
    { id: 2, name: "Prototyping", proficiency: 4, years: 5 },
    { id: 3, name: "Design Systems", proficiency: 3, years: 3 }
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Visiol",
      duration: "Feb 2022 - Current",
      description: "Lead design for enterprise SaaS platform. Drive design system adoption across teams."
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Notion",
      duration: "Jan 2019 - Jan 2022",
      description: "Owned collaboration features and templates ecosystem. Improved activation by 53%."
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "M.S. Human-Computer Interaction",
      institution: "Carnegie Mellon University",
      year: ""
    },
    {
      id: 2,
      degree: "B.S. Cognitive Science",
      institution: "UC San Diego",
      year: ""
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: "HiAg UX Certification",
      issuer: "NN",
      field: "Google UX Design"
    }
  ]);

  const [analytics] = useState({
    profileViews: 284,
    recruiters: 45,
    clicks: 12
  });

  // Modal states
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);

  // Edit states
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);

  // Form states
  const [skillForm, setSkillForm] = useState({ name: '', proficiency: 3, years: 1 });
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', duration: '', description: '' });
  const [educationForm, setEducationForm] = useState({ degree: '', institution: '', year: '' });
  const [certificationForm, setCertificationForm] = useState({ name: '', issuer: '', field: '' });

  const completionPercentage = Object.values(profileCompletion).filter(Boolean).length * 25;

  // Handlers
  const handleDeleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleDeleteEducation = (id) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleDeleteCertification = (id) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  const handleAddSkill = () => {
    if (skillForm.name.trim()) {
      setSkills([...skills, { id: Date.now(), ...skillForm }]);
      setSkillForm({ name: '', proficiency: 3, years: 1 });
      setIsAddingSkill(false);
    }
  };

  const handleAddExperience = () => {
    if (experienceForm.title.trim() && experienceForm.company.trim()) {
      setExperiences([...experiences, { id: Date.now(), ...experienceForm }]);
      setExperienceForm({ title: '', company: '', duration: '', description: '' });
      setIsAddingExperience(false);
    }
  };

  const handleAddEducation = () => {
    if (educationForm.degree.trim() && educationForm.institution.trim()) {
      setEducation([...education, { id: Date.now(), ...educationForm }]);
      setEducationForm({ degree: '', institution: '', year: '' });
      setIsAddingEducation(false);
    }
  };

  const handleAddCertification = () => {
    if (certificationForm.name.trim()) {
      setCertifications([...certifications, { id: Date.now(), ...certificationForm }]);
      setCertificationForm({ name: '', issuer: '', field: '' });
      setIsAddingCertification(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              <button 
                onClick={() => setIsEditingBasicInfo(true)}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="flex items-start gap-4">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-2 border-slate-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{profileData.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{profileData.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Email</span>
                    <span className="text-slate-900">{profileData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone</span>
                    <span className="text-slate-900">{profileData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location</span>
                    <span className="text-slate-900">{profileData.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Role</span>
                    <span className="text-slate-900">{profileData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume & Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Resume & Documents</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Choose File
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{resume.filename}</p>
                    <p className="text-xs text-slate-500">{resume.size}</p>
                  </div>
                </div>
                <button className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Remove
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{portfolio.filename}</p>
                  </div>
                </div>
                <button className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-sm text-slate-600">
                Drag and drop your files here<br />
                <span className="text-xs text-slate-500">PDFs, PNGs up to 10MB</span>
              </p>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Skills & Expertise</h2>
              <button 
                onClick={() => setIsAddingSkill(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{skill.name}</span>
                      <span className="text-sm text-slate-500">{skill.years} years</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < skill.proficiency ? 'fill-teal-500 text-teal-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => setEditingSkill(skill)} className="text-slate-400 hover:text-slate-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingSkill && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="flex gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Years"
                    min="1"
                    value={skillForm.years}
                    onChange={(e) => setSkillForm({...skillForm, years: parseInt(e.target.value)})}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Proficiency (1-5)"
                    min="1"
                    max="5"
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({...skillForm, proficiency: parseInt(e.target.value)})}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddSkill} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                    Save
                  </button>
                  <button onClick={() => setIsAddingSkill(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Work Experience</h2>
              <button 
                onClick={() => setIsAddingExperience(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="border-b border-slate-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{exp.title} • {exp.company}</h3>
                      <p className="text-sm text-slate-500">{exp.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingExperience(exp)} className="text-slate-400 hover:text-slate-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExperience(exp.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>

            {isAddingExperience && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Job title"
                  value={experienceForm.title}
                  onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                  value={experienceForm.duration}
                  onChange={(e) => setExperienceForm({...experienceForm, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <textarea
                  placeholder="Description"
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 h-20"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddExperience} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                    Save
                  </button>
                  <button onClick={() => setIsAddingExperience(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Education</h2>
              <button 
                onClick={() => setIsAddingEducation(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{edu.degree} • {edu.institution}</h3>
                    {edu.year && <p className="text-sm text-slate-500">{edu.year}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingEducation(edu)} className="text-slate-400 hover:text-slate-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteEducation(edu.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingEducation && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Degree"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Year (optional)"
                  value={educationForm.year}
                  onChange={(e) => setEducationForm({...educationForm, year: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddEducation} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                    Save
                  </button>
                  <button onClick={() => setIsAddingEducation(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Certifications & Achievements</h2>
              <button 
                onClick={() => setIsAddingCertification(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            </div>

            <div className="space-y-3">
              {certifications.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-teal-600" />
                    <div>
                      <h3 className="font-medium text-slate-900">{cert.name}</h3>
                      <p className="text-sm text-slate-500">{cert.issuer} • {cert.field}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-slate-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCertification(cert.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingCertification && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Certification name"
                  value={certificationForm.name}
                  onChange={(e) => setCertificationForm({...certificationForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={certificationForm.issuer}
                  onChange={(e) => setCertificationForm({...certificationForm, issuer: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Field/Category"
                  value={certificationForm.field}
                  onChange={(e) => setCertificationForm({...certificationForm, field: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddCertification} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                    Save
                  </button>
                  <button onClick={() => setIsAddingCertification(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Completion</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(profileCompletion).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <Check className="w-4 h-4 text-teal-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={value ? "text-slate-900" : "text-slate-500"}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Public Profile
              </button>
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </button>
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Applications
              </button>
            </div>
          </div>

          {/* Profile Analytics */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Analytics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Profile Views (30d)</span>
                <span className="text-lg font-semibold text-slate-900">{analytics.profileViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Recruiters</span>
                <span className="text-lg font-semibold text-slate-900">{analytics.recruiters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Clicks</span>
                <span className="text-lg font-semibold text-slate-900">{analytics.clicks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfessionalProfile;