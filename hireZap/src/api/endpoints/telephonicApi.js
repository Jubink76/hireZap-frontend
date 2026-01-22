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
    joinCall: async (interviewId) => {
        const response = await axiosInstance.post('/telephonic-round/join-call/', { 
            interview_id: interviewId 
        });
        
        console.log('📍 telephonicApi.joinCall - Raw axios response:', response);
        
        return response; // Or response.data - check which one you're returning
    },
    endCall: async (sessionId, durationSeconds, recordingFile = null, connectionQuality = 'good') => {
        console.log('🔍 endCall API called with:', {
            sessionId,
            durationSeconds,
            hasRecording: !!recordingFile,
            recordingSize: recordingFile?.size,
            recordingType: recordingFile?.type,
            connectionQuality
        });
        
        const formData = new FormData();
        formData.append('call_session_id', sessionId);
        formData.append('duration_seconds', durationSeconds.toString());
        formData.append('connection_quality', connectionQuality);
        
        if (recordingFile) {
            // Make sure it's a File object
            if (recordingFile instanceof File || recordingFile instanceof Blob) {
                formData.append('recording_file', recordingFile, recordingFile.name || 'recording.webm');
                console.log('✅ Recording file appended to FormData');
            } else {
                console.error('❌ Invalid recording file type:', typeof recordingFile);
            }
        }
        
        // Log FormData contents
        console.log('📦 FormData contents:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}:`, {
                    name: value.name,
                    size: value.size,
                    type: value.type
                });
            } else {
                console.log(`  ${key}:`, value);
            }
        }
        
        try {
            const response = await axiosInstance.post('/telephonic-round/end-call/', formData, {
                headers: {
                    // Let browser set Content-Type with boundary for multipart/form-data
                    'Content-Type': undefined
                },
                // Increase timeout for file upload
                timeout: 60000, // 60 seconds
            });
            
            console.log('✅ End call API response:', response);
            return response;
            
        } catch (error) {
            console.error('❌ End call API error:', error);
            throw error;
        }
    },
    getInterviewStatus:async(interviewId) =>{
        const response = await axiosInstance.get(`/telephonic-round/status/${interviewId}`)
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