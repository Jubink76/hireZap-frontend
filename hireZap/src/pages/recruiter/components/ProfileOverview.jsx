import React from 'react'
import ProfileInfo from '../../candidate/components/ProfileInfo'
import ProfileStats from '../../candidate/components/ProfileStats'
import RecruiterJobList from './RecruiterJobList'
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import profileAvatar from '../../../assets/profile_avatar.jpg'

const ProfileOverview = () => {
    const {user} = useSelector((state)=>state.auth)
    const {openEditUserModal} = useOutletContext()
    const profileData = {
        ...user,
        joinedDate: new Date(user?.created_at).toLocaleString("default", {
          month: "long",
          year: "numeric"
        }),
        profileComplete: 85, // you can compute this later
        avatar: user?.profile_image_url || profileAvatar,
        stats: {
          totalApplications: 7,
          hired: 1,
          inProgress: 3,
          testsCompleted: 2
        },
      };

    const jobsData = [
        {
        id: 1,
        title: "Senior Frontend Developer",
        department: "Engineering",
        postedDate: "2 days ago",
        applicants: 45,
        status: "Active"
        },
        {
        id: 2,
        title: "Product Manager",
        department: "Product",
        postedDate: "5 days ago", 
        applicants: 32,
        status: "Interview Phase"
        },
        {
        id: 3,
        title: "UX Designer",
        department: "Design",
        postedDate: "1 week ago",
        applicants: 28,
        status: "Reviewing"
        },
        {
        id: 4,
        title: "DevOps Engineer",
        department: "Engineering",
        postedDate: "10 days ago",
        applicants: 19,
        status: "Active"
        }
    ];

    return (
        <>
            <ProfileInfo 
            profile={user}
            onEdit={openEditUserModal}/>
            <ProfileStats stats={profileData.stats}/>
            <RecruiterJobList jobs={jobsData}/>
        </>
    )
}

export default ProfileOverview;