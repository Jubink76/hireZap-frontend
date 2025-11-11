import axiosInstance from "../axiosInstance";

const jobApi = {
    createJob  : (data) => axiosInstance.post('/job/create-job/',data),
    fetchActiveJobs : () => axiosInstance.get('job/fetch/active-jobs/'),
    getJobsByRecruiterId : (id) => axiosInstance.get('/job/created-jobs/',id),
    fetchAllJobs : () => axiosInstance.get('/job/fetch/all-jobs/'),
    fetchInactiveJobs : () => axiosInstance.get('/job/fetch/inactive-jobs/'),
    fetchPausedJobs : () => axiosInstance.get('/jobs/fetch/paused-jobs/'),
    fetchJobById: (id) => axiosInstance.get(`/job/fetch/job-detail/${id}/`),

}
export default jobApi;