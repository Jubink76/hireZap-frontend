import axiosInstance from "../axiosInstance";

const applicationApi = {
    createApplication: (data) => axiosInstance.post('/application/apply/', data),
    
    getApplicationById: (id) => axiosInstance.get(`/application/detail/${id}/`),
    
    getMyApplications: (includeDrafts = false) => 
        axiosInstance.get(`/application/my-applications/?include_drafts=${includeDrafts}`),
    
    checkApplicationExists: (jobId) => axiosInstance.get(`/application/check/${jobId}/`),
    
    withdrawApplication: (id) => axiosInstance.post(`/application/withdraw/${id}/`),
    
    getJobApplications: (jobId, status = null) => {
        const url = status 
            ? `/application/list/job/${jobId}/?status=${status}`
            : `/application/list/job/${jobId}/`;
        return axiosInstance.get(url);
    },
    
    updateApplicationStatus: (id, statusData) => 
        axiosInstance.patch(`/application/update/${id}/status/`, statusData),
    
    getApplicationStatistics: (jobId) => 
        axiosInstance.get(`/application/job/${jobId}/statistics/`),
}

export default applicationApi;