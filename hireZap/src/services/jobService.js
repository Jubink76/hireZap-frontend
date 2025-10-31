import jobApi from '../api/endpoints/jobApi'
import { getJobsByRecruiterId } from '../redux/slices/jobSlice'

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

}
export default jobService;