import { Mail, Phone, Award, Edit } from "lucide-react"

const ProfileSection = ({ profile, onEditProfile }) => {
  const defaultProfile = {
    name: "Sarah Johnson",
    title: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=80&h=80&fit=crop&crop=face",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    experience: "5+ years experience"
  }

  const userProfile = { ...defaultProfile, ...profile }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={userProfile.avatar}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-cyan-200"
        />
        <div>
          <h3 className="text-lg font-serif font-bold text-slate-900">{userProfile.name}</h3>
          <p className="text-slate-600">{userProfile.title}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>{userProfile.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span>{userProfile.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4" />
          <span>{userProfile.experience}</span>
        </div>
      </div>

      <button 
        onClick={onEditProfile}
        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <Edit className="h-4 w-4" />
        <span>Edit Profile</span>
      </button>
    </div>
  )
}

export default ProfileSection;