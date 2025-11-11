import { Home,User,Settings,Bell } from "lucide-react";
const LeftIconSidebar = ({ activeTab, onNavigate }) => {
  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
      <button
        onClick={() => onNavigate('/candidate/dashboard')}
        className={`p-3 rounded-lg transition-colors ${
          activeTab === 'dashboard'
            ? 'bg-teal-50 text-teal-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Dashboard"
      >
        <Home className="h-6 w-6" />
      </button>
      
      <button
        onClick={() => onNavigate('/candidate/profile-overview')}
        className={`p-3 rounded-lg transition-colors ${
          activeTab === 'profile'
            ? 'bg-teal-50 text-teal-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Profile"
      >
        <User className="h-6 w-6" />
      </button>
      
      <button
        className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <button
        onClick={() => onNavigate('/candidate/account-settings')}
        className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        title="Settings"
      >
        <Settings className="h-6 w-6" />
      </button>
    </div>
  );
};
export default LeftIconSidebar;