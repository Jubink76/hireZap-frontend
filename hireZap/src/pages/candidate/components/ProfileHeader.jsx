import React from 'react';
import { Grid3X3 } from 'lucide-react';
import hireZapLogo from '../../../assets/hireZap.png';
import BackToHome from '../../../components/BackToHome';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProfileHeader = ({ pageName }) => {

  const {user} = useSelector((state)=>state.auth)
  const navigate = useNavigate()

  const backToHome = ()=>{
    if(user?.role ==='recruiter'){
      navigate('/recruiter/dashboard')
    }else{
      navigate('/candidate/dashboard')
    }
  }
  
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Page Name */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-white" />
            </div>
            <button className="cursor-pointer">
              <img 
                src={hireZapLogo} 
                alt="HireZap Logo" 
                className="h-12 lg:h-14"
              />
            </button>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{pageName}</h1>
        </div>
        
        {/* Right side - User Profile */}
        <div className="flex items-center">
          <BackToHome onClick={ backToHome }/>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;