import telephonicApi from "../api/endpoints/telephonicApi";

const telephonicService = {
    getSettings: async(jobId) => {
        const response = await telephonicApi.getSettings(jobId);
        return response
    },
    updateSettings: async(jobId, settingsData) =>{
        const response = await telephonicApi.updateSettings(jobId, settingsData)
        return response
    },
    getCandidates: async(jobId, statusFileter=null) => {
        const response = await telephonicApi.getCandidates(jobId,statusFileter);
        return response;
    },
    getStats : async(jobId)=>{
        const response = await telephonicApi.getStats(jobId);
        return response;
    },
    scheduleInterview : async(scheduleData) => {
        const response = await telephonicApi.scheduleInterview(scheduleData);
        return response
    },
    bulkScheduleInterview : async(scheduleData) => {
        const response = await telephonicApi.bulkScheduleInterviews(scheduleData);
        return response;
    },
    rescheduleInterview : async(interviewId, scheduleData)=>{
        const response = await telephonicApi.rescheduleInterview(interviewId, scheduleData);
        return response;
    },
    startCall: async(interviewId) => {
        const response = await telephonicApi.startCall(interviewId);
        return response;
    },
    endCall: async(sessionId, durationSeconds, recordingFile = null, connectionQuality = 'good') =>{
        const response = await telephonicApi.endCall(
            sessionId,
            durationSeconds,
            recordingFile,
            connectionQuality
        );
        return response
    },
    getInterviewDetails: async(interviewId) => {
        const response = await telephonicApi.getInterviewDetails(interviewId);
        return  response;
    },
    anaylyzeInterview : async(interviewId, audioFilePath) => {
        const response = await telephonicApi.analyzeInterview(interviewId, audioFilePath);
        return response;
    },
    manualScoreOverride: async(interviewId, manualScore, manualDecision, overrideReason) =>{
        const response = await telephonicApi.manualScoreOverride(
            interviewId,
            manualScore,
            manualDecision,
            overrideReason
        );
        return response
    },
    moveToNextStage: async(interviewIds, feedback) => {
        const response = await telephonicApi.moveToNextStage(interviewIds, feedback);
        return response
    }
}
export default telephonicService;