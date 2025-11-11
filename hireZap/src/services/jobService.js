import jobApi from '../api/endpoints/jobApi'

const jobService = {
    async createJob(data){
        const res = await jobApi.createJob(data)
        return res
    },
    async fetchActiveJobs(){
        const res = await jobApi.fetchActiveJobs()
        return res
    },
    async getJobsByRecruiterId(id){
        const res = await jobApi.getJobsByRecruiterId(id)
        return res
    },
    async fetchAllJobs(){
        const res = await jobApi.fetchAllJobs()
        return res
    },
    async fetchInactiveJobs(){
        const res = await jobApi.fetchInactiveJobs()
        return res
    },
    async fetchPausedJobs(){
        const res = await jobApi.fetchPausedJobs()
        return res
    },
    async fetchJobById(job_id){
        const res = await jobApi.fetchJobById(job_id)
        return res
    }
}
export default jobService;