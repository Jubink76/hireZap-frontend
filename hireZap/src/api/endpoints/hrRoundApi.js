import axiosInstance from "../axiosInstance";

const hrRoundApi = {
    getSettings: async (jobId)=>{
        const res = await axiosInstance.get(`/hr-round/settings/${jobId}/`)
        return res
    },
    updateSettings: async (jobId, settingsData) => {
        const res = await axiosInstance.put(`/hr-round/settings/${jobId}/update/`, settingsData);
        return res
    },
    getInterviews: async (jobId, statusFilter = null) => {
        const url = statusFilter 
            ? `/hr-round/interviews/job/${jobId}/?status=${statusFilter}`
            : `/hr-round/interviews/job/${jobId}/`;
        const res = await axiosInstance.get(url);
        return res;
    },
    getInterviewByApplication: async (applicationId) => {
        const res = await axiosInstance.get(`/hr-round/interviews/application/${applicationId}/`);
        return res;
    },

    getInterviewDetails: async (interviewId) => {
        const res = await axiosInstance.get(`/hr-round/interview/${interviewId}/`);
        return res;
    },

    getUpcomingInterviews: async () => {
        const res = await axiosInstance.get('/hr-round/interviews/upcoming/');
        return res;
    },

    getStats: async (jobId) => {
        const res = await axiosInstance.get(`/hr-round/inteview/${jobId}/stats/`);
        return res;
    },

    // Scheduling
    scheduleInterview: async (scheduleData) => {
        const res = await axiosInstance.post('/hr-round/interview/schedule/', scheduleData);
        return res;
    },

    bulkScheduleInterviews: async (schedulesData) => {
        const res = await axiosInstance.post('/hr-round/interview/bulk-schedule', schedulesData);
        return res;
    },

    rescheduleInterview: async (interviewId, scheduleData) => {
        const res = await axiosInstance.put(`/hr-round/interview/${interviewId}/reschedule/`, scheduleData);
        return res;
    },

    cancelInterview: async (interviewId, reason) => {
        const res = await axiosInstance.post(`/hr-round/interview/${interviewId}/cancel/`, { reason });
        return res;
    },

    updateInterviewStatus: async (interviewId, status, cancellationReason = null) => {
        const res = await axiosInstance.patch(`/hhr-round/interview/${interviewId}/udpate/status/`, {
            status,
            cancellation_reason: cancellationReason
        });
        return res;
    },

    // Meeting Management
    startMeeting: async (interviewId) => {
        const res = await axiosInstance.post('/hr-round/meeting/start/', {
            interview_id: interviewId
        });
        return res;
    },

    joinMeeting: async (sessionId) => {
        const res = await axiosInstance.post('/hr-round/meeting/join/', {
            session_id: sessionId
        });
        return res;
    },

    endMeeting: async (sessionId) => {
        const res = await axiosInstance.post('/hr-round/meeting/end/', {
            session_id: sessionId
        });
        return res;
    },

    // Recording Management
    startRecording: async (sessionId) => {
        const res = await axiosInstance.post('/hr-round/interview/start-recording/', {
            session_id: sessionId
        });
        return res;
    },

    stopRecording: async (sessionId, durationSeconds = null) => {
        const res = await axiosInstance.post('/hr-round/interview/stop-recording/', {
            session_id: sessionId,
            duration_seconds: durationSeconds
        });
        return res;
    },

    getRecording: async (interviewId) => {
        const res = await axiosInstance.get(`/hr-round/interview/${interviewId}/recordings/`);
        return res;
    },

    uploadRecording: async (interviewId, videoFile, durationSeconds = null, resolution = null) => {
        const formData = new FormData();
        formData.append('interview_id', interviewId);
        formData.append('video_file', videoFile);
        
        if (durationSeconds) {
            formData.append('duration_seconds', durationSeconds);
        }
        if (resolution) {
            formData.append('resolution', resolution);
        }

        const res = await axiosInstance.post('/hr-round/interview/recording/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 120000 // 2 minutes for video upload
        });
        return res;
    },

    deleteRecording: async (interviewId) => {
        const res = await axiosInstance.delete(`/hr-round/interview/${interviewId}/delete/recording/`);
        return res;
    },

    // Notes Management
    getNotes: async (interviewId) => {
        const res = await axiosInstance.get(`/hr-round/interview/${interviewId}/notes/`);
        return res;
    },

    createNotes: async (notesData) => {
        const res = await axiosInstance.post('/hr-round/interview/create-note/', notesData);
        return res;
    },

    updateNotes: async (interviewId, notesData) => {
        const res = await axiosInstance.put(`/hr-round/interview/${interviewId}/update-note/`, notesData);
        return res;
    },

    finalizeNotes: async (interviewId) => {
        const res = await axiosInstance.post(`/hr-round/interview/${interviewId}/finalize-note/`);
        return res;
    },

    // Results Management
    getResult: async (interviewId) => {
        const res = await axiosInstance.get(`/hr-round/interview/${interviewId}/results/`);
        return res;
    },

    finalizeResult: async (resultData) => {
        const res = await axiosInstance.post('/hr-round/interview/results/finalize/', resultData);
        return res;
    },

    moveToNextStage: async (interviewId, nextStageId = null) => {
        const res = await axiosInstance.post('/hr-round/interview/move-to-next-stage/', {
            interview_id: interviewId,
            next_stage_id: nextStageId
        });
        return res;
    }
};

export default hrRoundApi;