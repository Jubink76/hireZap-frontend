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
    }
}
export default selectionStageService;