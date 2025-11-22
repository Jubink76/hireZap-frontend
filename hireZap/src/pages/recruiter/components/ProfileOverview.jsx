import React, { useEffect,useMemo } from 'react'
import ProfileInfo from '../../candidate/components/ProfileInfo'
import ProfileStats from '../../candidate/components/ProfileStats'
import RecruiterJobList from './RecruiterJobList'
import { useOutletContext } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import profileAvatar from '../../../assets/profile_avatar.jpg'
import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice'
import { fetchCompany } from '../../../redux/slices/companySlice'

const ProfileOverview = () => {
    const {user} = useSelector((state)=>state.auth)
    const { recruiterJobs, loading: jobsLoading, error } = useSelector((state) => state.job);
    const { company, loading: companyLoading } = useSelector((state) => state.company);

    const dispatch = useDispatch()
    const {openEditUserModal} = useOutletContext()

    useEffect(() => {
    if (user?.id) {
      dispatch(getJobsByRecruiterId(user.id));
      dispatch(fetchCompany());
    }
  }, [dispatch, user?.id]);

  // Merge company data with jobs
  const jobsWithCompany = useMemo(() => {
    if (!recruiterJobs || !company) return recruiterJobs || [];
    
    return recruiterJobs.map(job => ({
      ...job,
      company_name: company.company_name,
      company_logo: company.logo_url,
      company_id: company.id
    }));
  }, [recruiterJobs, company]);

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
      // Loading state
      if (jobsLoading || companyLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        );
      }


    return (
        <>
            <ProfileInfo 
              profile={user}
              onEdit={openEditUserModal}/>
            <ProfileStats stats={profileData.stats}/>
            <RecruiterJobList jobs={jobsWithCompany} />
        </>
    )
}

export default ProfileOverview;