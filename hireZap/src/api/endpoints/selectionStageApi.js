import axiosInstance from "../axiosInstance"

const selectionStageApi = {
    createSelectionStage: (data) => axiosInstance.post('/selection-process/create-stage/',data),
    fetchAllStages: () => axiosInstance.get('/selection-process/all-stages/'),
    fetchStageById: (id) => axiosInstance.get(`/selection-process/stage/${id}`),
    fetchInactiveStages:() => axiosInstance.get('/selection-process/stages/inactive/'),
    reactivateSelectionStage:(id) => axiosInstance.patch(`/selection-process/stages/${id}/reactivate/`),
    updateSelectionStage : ({stageId,stageData}) => axiosInstance.put(`/selection-process/update-stage/${stageId}`, stageData),
    deleteSelectionStage : (stageId) => axiosInstance.delete(`/selection-process/delete-stage/${stageId}`)
}
export default selectionStageApi;