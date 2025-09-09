import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

// Single Profile Card Component
const CandidateProfileCard = () => {
  // Sample user data
  const user = {
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    joinDate: "Joined March 2023",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    initials: "SJ",
    profileCompletion: 85
  };

  // Sample stats data
  const stats = [
    { value: "24", label: "Applications", color: "text-cyan-600" },
    { value: "8", label: "Interviews", color: "text-green-600" },
    { value: "3", label: "Offers", color: "text-blue-600" },
    { value: "92%", label: "Success Rate", color: "text-purple-600" }
  ];

  return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg border bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar Section */}
              <div className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full mx-auto sm:mx-0">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="aspect-square h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-lg font-semibold">
                  {user.initials}
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-lg text-slate-600 mb-2">
                  {user.title}
                </p>
                
                {/* Location and Join Date */}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {user.joinDate}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-cyan-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${user.profileCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {user.profileCompletion}% Profile Complete
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:w-auto w-full">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white/50 rounded-lg border border-slate-100">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CandidateProfileCard;