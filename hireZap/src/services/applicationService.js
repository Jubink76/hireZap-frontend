import applicationApi from "../api/endpoints/applicationApi";

const applicationServices = {
    async createApplication(data){
        const res = await applicationApi.createApplication(data);
        return res;
    },
    async getApplicationById(id){
        const res = await applicationApi.getApplicationById(id);
        return res;
    },
    async getMyApplications(includeDrafts = false) {
        const res = await applicationApi.getMyApplications(includeDrafts);
        return res;
    },
    
    async withdrawApplication(id) {
        const res = await applicationApi.withdrawApplication(id);
        return res;
    },
    
    async checkApplicationExists(jobId) {
        const res = await applicationApi.checkApplicationExists(jobId);
        return res;
    },
    // Recruiter services
    async getJobApplications(jobId, status = null) {
        const res = await applicationApi.getJobApplications(jobId, status);
        return res;
    },

    async getApplicationStatistics(jobId) {
        const res = await applicationApi.getApplicationStatistics(jobId);
        return res;
    },
    
    async updateApplicationStatus(id, statusData) {
        const res = await applicationApi.updateApplicationStatus(id, statusData);
        return res;
    },
}
export default applicationServices;