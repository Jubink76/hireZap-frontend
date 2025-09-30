import { useState } from "react";
import ProfileInfo from '../components/ProfileInfo'
import ProfileStats from "../components/ProfileStats";
import RecentApplicationsList from "../components/RecentApplicationsList";
import profileAvatar from '../../../assets/profile_avatar.jpg'
import { useSelector } from "react-redux";
const CandidateProfileOverview = () => {

  const {user} = useSelector((state)=>state.auth)
  // Sample profile data matching the design
  const profileData = {
    name: user?.full_name || 'Anonymous  ',
    title: "Senior Product Designer",
    location: "San Francisco, CA",
    joinedDate: "March 2024",
    profileComplete: 85,
    avatar: user?.profile_image_url || profileAvatar,
    stats: {
      totalApplications: 7,
      hired: 1,
      inProgress: 3,
      testsCompleted: 2
    }
  };

  const applicationsData = [
    {
      id: 1,
      position: "Senior Product Designer",
      company: "Google"
    },
    {
      id: 2,
      position: "UX Designer",
      company: "Apple"
    },
    {
      id: 3,
      position: "Product Designer",
      company: "Meta"
    },
    {
      id: 4,
      position: "Senior UX Researcher",
      company: "Netflix"
    }
  ];
  return (
    <>
      <ProfileInfo profile={profileData}/>
      <ProfileStats stats={profileData.stats}/>
      <RecentApplicationsList applications={applicationsData}/>
    </>
    
  );
};

export default CandidateProfileOverview;