import hrRoundApi from "../api/endpoints/hrRoundApi";

const hrRoundService = {
    getSettings: async (jobId) => {
        const res = await hrRoundApi.getSettings(jobId);
        return res;
    },

    updateSettings: async (jobId, settingsData) => {
        const res = await hrRoundApi.updateSettings(jobId, settingsData);
        return res;
    },

    // Interviews & Details
    getInterviews: async (jobId, statusFilter = null) => {
        const res = await hrRoundApi.getInterviews(jobId, statusFilter);
        return res;
    },

    getInterviewByApplication: async (applicationId) => {
        const res = await hrRoundApi.getInterviewByApplication(applicationId);
        return res;
    },

    getInterviewDetails: async (interviewId) => {
        const res = await hrRoundApi.getInterviewDetails(interviewId);
        return res;
    },

    getUpcomingInterviews: async () => {
        const res = await hrRoundApi.getUpcomingInterviews();
        return res;
    },

    getStats: async (jobId) => {
        const res = await hrRoundApi.getStats(jobId);
        return res;
    },

    // Scheduling
    scheduleInterview: async (scheduleData) => {
        const res = await hrRoundApi.scheduleInterview(scheduleData);
        return res;
    },

    bulkScheduleInterviews: async (schedulesData) => {
        const res = await hrRoundApi.bulkScheduleInterviews(schedulesData);
        return res;
    },

    rescheduleInterview: async (interviewId, scheduleData) => {
        const res = await hrRoundApi.rescheduleInterview(interviewId, scheduleData);
        return res;
    },

    cancelInterview: async (interviewId, reason) => {
        const res = await hrRoundApi.cancelInterview(interviewId, reason);
        return res;
    },

    updateInterviewStatus: async (interviewId, status, cancellationReason = null) => {
        const res = await hrRoundApi.updateInterviewStatus(interviewId, status, cancellationReason);
        return res;
    },

    // Meeting Management
    startMeeting: async (interviewId) => {
        const res = await hrRoundApi.startMeeting(interviewId);
        return res;
    },

    joinMeeting: async (sessionId) => {
        const res = await hrRoundApi.joinMeeting(sessionId);
        return res;
    },

    endMeeting: async (sessionId) => {
        const res = await hrRoundApi.endMeeting(sessionId);
        return res;
    },

    // Recording
    startRecording: async (sessionId) => {
        const res = await hrRoundApi.startRecording(sessionId);
        return res;
    },

    stopRecording: async (sessionId, durationSeconds = null) => {
        const res = await hrRoundApi.stopRecording(sessionId, durationSeconds);
        return res;
    },

    getRecording: async (interviewId) => {
        const res = await hrRoundApi.getRecording(interviewId);
        return res;
    },

    uploadRecording: async (interviewId, videoFile, durationSeconds = null, resolution = null) => {
        const res = await hrRoundApi.uploadRecording(interviewId, videoFile, durationSeconds, resolution);
        return res;
    },

    deleteRecording: async (interviewId) => {
        const res = await hrRoundApi.deleteRecording(interviewId);
        return res;
    },

    // Notes
    getNotes: async (interviewId) => {
        const res = await hrRoundApi.getNotes(interviewId);
        return res;
    },

    createNotes: async (notesData) => {
        const res = await hrRoundApi.createNotes(notesData);
        return res;
    },

    updateNotes: async (interviewId, notesData) => {
        const res = await hrRoundApi.updateNotes(interviewId, notesData);
        return res;
    },

    finalizeNotes: async (interviewId) => {
        const res = await hrRoundApi.finalizeNotes(interviewId);
        return res;
    },

    // Results
    getResult: async (interviewId) => {
        const res = await hrRoundApi.getResult(interviewId);
        return res;
    },

    finalizeResult: async (resultData) => {
        const res = await hrRoundApi.finalizeResult(resultData);
        return res;
    },

    moveToNextStage: async (interviewId, nextStageId = null) => {
        const res = await hrRoundApi.moveToNextStage(interviewId, nextStageId);
        return res
    }
};

export default hrRoundService;