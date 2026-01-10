import axiosInstance from "../axiosInstance";

const telephonicApi = {
    getSettings: async(jobId)=>{
        const response = await axiosInstance.get(`/telephonic-round/settings/${jobId}/`);
        return response;
    },
    updateSettings: async (jobId, settingsData) => {
        const response = await axiosInstance.put(`/telephonic-round/settings/${jobId}/update/`,settingsData);
        return response;
    },
    getCandidates: async (jobId, statusFilter = null) => {
        const url = statusFilter ? `/telephonic-round/candidates/${jobId}/?status=${statusFilter}`: `/telephonic-round/candidates/${jobId}/`;
        const response = await axiosInstance.get(url);
        return response;
    },
    getStats: async (jobId) => {
        const response = await axiosInstance.get(`/telephonic-round/stats/${jobId}/`);
        return response;
    },
    scheduleInterview: async (scheduleData) => {
        const response = await axiosInstance.post('/telephonic-round/schedule/', scheduleData);
        return response;
    },
    bulkScheduleInterviews: async (schedulesData) => {
        const response = await axiosInstance.post('/telephonic-round/bulk-schedule/', schedulesData);
        return response;
    },
    rescheduleInterview: async (interviewId, scheduleData) => {
        const response = await axiosInstance.put(`/telephonic-round/reschedule/${interviewId}/`,scheduleData);
        return response;
    },
    startCall: async (interviewId) => {
        const response = await axiosInstance.post('/telephonic-round/start-call/', {interview_id: interviewId});
        return response;
    },
    endCall: async (sessionId, durationSeconds, recordingFile = null, connectionQuality = 'good') => {
        const formData = new FormData();
        formData.append('call_session_id', sessionId);
        formData.append('duration_seconds', durationSeconds);
        formData.append('connection_quality', connectionQuality);
        
        if (recordingFile) {
        formData.append('recording_file', recordingFile);
        }

        const response = await axiosInstance.post('/telephonic-round/end-call/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        return response;
    },
    getInterviewDetails: async (interviewId) => {
        const response = await axiosInstance.get(`/telephonic-round/details/${interviewId}/`);
        return response;
    },
    analyzeInterview: async (interviewId, audioFilePath) => {
        const response = await axiosInstance.post(`/telephonic-round/analyze/${interviewId}/`,{ audio_file_path: audioFilePath });
        return response;
    },
    manualScoreOverride: async (interviewId, manualScore, manualDecision, overrideReason) => {
        const response = await axiosInstance.post('/telephonic-round/manual-score/', {
            interview_id: interviewId,
            manual_score: manualScore,
            manual_decision: manualDecision,
            override_reason: overrideReason
        });
        return response;
    },
    moveToNextStage: async (interviewIds, feedback = 'Passed telephonic round') => {
        const response = await axiosInstance.post('/telephonic-round/move-next-stage/', {
            interview_ids: interviewIds,
            feedback: feedback
        });
        return response;
    },
}
export default telephonicApi;