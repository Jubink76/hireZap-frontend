const ProfileSection = ({ 
  profile = {}, 
  onEditProfile,
  onViewProfile 
}) => {
  const {
    name = 'Sarah Johnson',
    title = 'Senior Product Designer',
    avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    profileViews = 142,
    applications = 8,
    profileScore = 95
  } = profile;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-400/50 p-6 transition-shadow duration-300 hover:shadow-md">
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
        </div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{profileViews}</div>
            <div className="text-xs text-gray-600">Profile Views</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{applications}</div>
            <div className="text-xs text-gray-600">Applications</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{profileScore}%</div>
            <div className="text-xs text-gray-600">Profile Score</div>
          </div>
        </div>
        
        <button 
          onClick={onViewProfile}
          className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        >
          👤 View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
