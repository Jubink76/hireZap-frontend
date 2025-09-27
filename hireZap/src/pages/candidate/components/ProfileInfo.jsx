import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

const ProfileInfo = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 w-full">
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
          <img
            src={profile?.avatar}
            alt={profile?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{profile?.name}</h2>
          <p className="text-slate-500 text-lg mb-4">{profile.title}</p>
          
          <div className="flex items-center gap-6 text-slate-500 mb-6 flex-wrap"> {/* Added flex-wrap for responsiveness */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined {profile.joinedDate}</span>
            </div>
          </div>
          
          <div className="text-slate-600">
            <span className="font-semibold text-slate-900">{profile.profileComplete}%</span> Profile Complete
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;