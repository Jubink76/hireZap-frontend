import { useState,useEffect } from "react";
import ProfileInfo from '../components/ProfileInfo'
import ProfileStats from "../components/ProfileStats";
import RecentApplicationsList from "../components/RecentApplicationsList";
import profileAvatar from '../../../assets/profile_avatar.jpg'
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { fetchMyApplications } from "../../../redux/slices/applicationSlice";
const CandidateProfileOverview = () => {
  const {user} = useSelector((state)=>state.auth)
  const { myApplications, loading } = useSelector((state) => state.application);
  const {openEditUserModal} = useOutletContext()

  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(fetchMyApplications(false));
    }, [dispatch]);

  const profileData = {
    ...user,
    joinedDate: new Date(user?.created_at).toLocaleString("default", {
      month: "long",
      year: "numeric"
    }),
    profileComplete: 85, 
    avatar: user?.profile_image_url || profileAvatar,
    stats: {
      totalApplications: 7,
      hired: 1,
      inProgress: 3,
      testsCompleted: 2
    },
  };

  return (
    <>
      <ProfileInfo 
      profile={user}
      onEdit={openEditUserModal}
      text="Edit Profile"/>
      <ProfileStats stats={profileData.stats}/>
      <RecentApplicationsList applications={myApplications}/>
    </>
    
  );
};

export default CandidateProfileOverview;