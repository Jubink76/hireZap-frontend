import axiosInstance from "../axiosInstance";

const jobApi = {
    createJob  : (data) => axiosInstance.post('/job/create-job/',data),
    fetchActiveJobs : () => axiosInstance.get('job/fetch/active-jobs/'),
    getJobsByRecruiterId : (id) => axiosInstance.get('/job/created-jobs/',id)
}
export default jobApi;