import jobApi from '../api/endpoints/jobApi'

const jobService = {
    async createJob(data){
        const res = await jobApi.createJob(data)
        return res
    },

}
export default jobService;