import axiosInstance from "../axiosInstance";

const resumeScreeningApi = {
    configureATS:(jobId,configData) =>
        axiosInstance.post(`/resume-screening/jobs/${jobId}/ats-config/`, configData),
    getATSConfig:(jobId) =>
        axiosInstance.get(`/resume-screening/jobs/${jobId}/ats-config/`),
    startBulkScreening:(jobId) =>
        axiosInstance.post(`/resume-screening/jobs/${jobId}/start-bulk-screening/`),
    getScreeningProgress:(jobId) =>
        axiosInstance.get(`/resume-screening/jobs/${jobId}/screening-progress/`),
    getScreeningResults:(jobId, params = {}) =>
        axiosInstance.get(`/resume-screening/jobs/${jobId}/screening-results/`,{params}),
    pauseScreening:(jobId)=>
        axiosInstance.post(`/resume-screening/jobs/${jobId}/pause-screening/`),
    resetScreening:(jobId)=>
        axiosInstance.post(`/resume-screening/jobs/${jobId}/reset-screening/`),
    moveToNextStage:(applicationIds, feedback) =>
        axiosInstance.post('/resume-screening/applications/move-to-next-stage/',
            {
                application_ids:applicationIds,
                feedback
            }
        ),
};  
export default resumeScreeningApi;