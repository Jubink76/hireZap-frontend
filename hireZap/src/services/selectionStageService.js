import selectionStageApi from "../api/endpoints/selectionStageApi";

const selectionStageService = {
    async createSelectionStage(stageData){
        const res = selectionStageApi.createSelectionStage(stageData);
        return res;
    },
    async fetchAllStages(){
        const res = selectionStageApi.fetchAllStages();
        return res;
    },
    async fetchStageById(id){
        const res = selectionStageApi.fetchStageById(id);
        return res
    },
    async updateSelectionStage({stageId, stageData}){
        const res = selectionStageApi.updateSelectionStage({stageId, stageData});
        return res
    },
    async deleteSelectionStage(stageId){
        const res = selectionStageApi.deleteSelectionStage(stageId);
        return res
    },
    fetchInactiveStages: async () => {
        const res = await selectionStageApi.fetchInactiveStages();
        return res;
    },
    reactivateSelectionStage: async (stageId) => {
        const res = await selectionStageApi.reactivateSelectionStage(stageId);
        return res;
    },
    saveJobSelectionProcess: async (jobId, stageIds) => {
        const response = await selectionStageApi.saveJobSelectionProcess(jobId, stageIds);
        return response;
    },
    
    getJobSelectionProcess: async (jobId) => {
        console.log('Fetching stages for job:', jobId);
        const response = await selectionStageApi.getJobSelectionProcess(jobId);
        console.log('API response:', response);
        return response;
    },
    
    deleteJobSelectionProcess: async (jobId) => {
        const response = await selectionStageApi.deleteJobSelectionProcess(jobId);
        return response;
    }
}

export default selectionStageService;