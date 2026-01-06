import resumeScreeningApi from "../api/endpoints/resumeScreeningApi";

const resumeScreeningService = {
    async configureATS(jobId, configData) {
        const response = await resumeScreeningApi.configureATS(jobId, configData);
        return response;
    },

    async getATSConfig(jobId) {
        const response = await resumeScreeningApi.getATSConfig(jobId);
        return response;
    },

    async startBulkScreening(jobId) {
        const response = await resumeScreeningApi.startBulkScreening(jobId);
        return response;
    },

    async getScreeningProgress(jobId) {
        const response = await resumeScreeningApi.getScreeningProgress(jobId);
        return response;
    },

    async getScreeningResults(jobId, params = {}) {
        const response = await resumeScreeningApi.getScreeningResults(jobId, params);
        return response;
    },

    async pauseScreening(jobId) {
        const response = await resumeScreeningApi.pauseScreening(jobId);
        return response;
    },

    async resetScreening(jobId) {  
        const response = await resumeScreeningApi.resetScreening(jobId);
        return response;
    },

    async moveToNextStage(applicationIds, feedback) {
        const response = await resumeScreeningApi.moveToNextStage(
            applicationIds,
            feedback
        );
        return response;
    },
};

export default resumeScreeningService;