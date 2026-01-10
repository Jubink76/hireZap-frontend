import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import telephonicService from '../../services/telephonicService';
import { getFriendlyError } from "../../utils/errorHandler";

// settings
export const fetchTelephonicSettings = createAsyncThunk('fetch/telephonicSettings', async(jobId, thunkAPI)=>{
    try{
        const response = await telephonicService.getSettings(jobId);
        return response
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to fetch settings');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const updateTelephonicSettings = createAsyncThunk('telephonic/updateSettings', async({jobId, settingsData}, thunkAPI)=>{
    try{
        const response = await telephonicService.updateSettings(jobId, settingsData);
        return response
    }catch(err){
        const friendly = getFriendlyError(err, 'update settings failed');
        return thunkAPI.rejectWithValue(friendly);
    }
});

// candidates
export const fetchTelephonicCandidates = createAsyncThunk('fetch/telephonicCandidates', async({jobId, statusFilter}, thunkAPI) =>{
    try{
        const response = await telephonicService.getCandidates(jobId, statusFilter);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to fetch telephonic round candidates');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const fetchTelephonicStats = createAsyncThunk('fetch/telephonicStats', async(jobId, thunkAPI)=>{
    try{
        const response = await telephonicService.getStats(jobId);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to fetch stats')
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const scheduleInterview = createAsyncThunk('schedule/interview', async(scheduleData, thunkAPI)=>{
    try{
        const response = await telephonicService.scheduleInterview(scheduleData);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to schedule interview');
        return response;
    }
})

export const bulkScheduleInterviews = createAsyncThunk('bulkschedule/interview', async(scheduleData, thunkAPI)=>{
    try{
        const response = await telephonicService.bulkScheduleInterview(scheduleData);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err,'failed to bulkscheudule interview');
        return response
    }
})

export const rescheduleInterview = createAsyncThunk('reschedule/interview', async({interviewId, scheduleData}, thunkAPI)=>{
    try{
        const response = await telephonicService.rescheduleInterview(interviewId, scheduleData);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to reschedule interview');
        return thunkAPI.rejectWithValue(friendly);
    }
})

// call management
export const startCall = createAsyncThunk('start/call', async(interviewId, thunkAPI)=>{
    try{
        const response = await telephonicService.startCall(interviewId);
        return response
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to start a call');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const endCall = createAsyncThunk('end/call', async({sessionId, durationSeconds, recordingFile, connectionQuality}, thunkAPI)=>{
    try{
        const response = await telephonicService.endCall(sessionId,durationSeconds,recordingFile, connectionQuality);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to end call');
        return thunkAPI.rejectWithValue(friendly);
    }
})

// interview details
export const fetchInterviewDetails = createAsyncThunk('fetch/interviewDetail', async(interviewId, thunkAPI)=>{
    try{
        const response = await telephonicService.getInterviewDetails(interviewId);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'failed to fetch interview details');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const analyzeInterview = createAsyncThunk('analyze/interview', async({interviewId, audioFilePath}, thunkAPI)=>{
    try{
        const response = await telephonicService.anaylyzeInterview(interviewId, audioFilePath);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to analayze interview');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const overrideScore = createAsyncThunk('override/score', async({interviewId, manualScore, manualDecision, overrideReason}, thunkAPI)=>{
    try{
        const response = await telephonicService.manualScoreOverride(interviewId, manualScore, manualDecision, overrideReason);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to override score');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const moveToNextStage = createAsyncThunk('move/next-stage', async({interviewIds, feedback}, thunkAPI)=>{
    try{
        const response = await telephonicService.moveToNextStage(interviewIds, feedback);
        return response;
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to move to next stage');
        return thunkAPI.rejectWithValue(friendly);
    }
})

const initialState = {
    // Settings
  settings: null,
  settingsLoading: false,
  settingsError: null,

  // Candidates & Interviews
  candidates: [],
  candidatesLoading: false,
  candidatesError: null,

  // Statistics
  stats: null,
  statsLoading: false,
  statsError: null,

  // Active Interview
  activeInterview: null,
  interviewDetails: null,
  interviewDetailsLoading: false,
  interviewDetailsError: null,

  // Call Session
  activeCallSession: null,
  callLoading: false,
  callError: null,

  // UI State
  selectedCandidates: [],
  filterStatus: 'all',
  
  // Success Messages
  successMessage: null,
  
  // General Loading & Error
  loading: false,
  error: null,
};

const telephonicSlice =  createSlice({
    name:'telephonic',
    initialState,
    reducers:{
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
        
        setSelectedCandidates: (state, action) => {
            state.selectedCandidates = action.payload;
        },
        
        toggleCandidateSelection: (state, action) => {
            const candidateId = action.payload;
            if (state.selectedCandidates.includes(candidateId)) {
                state.selectedCandidates = state.selectedCandidates.filter(id => id !== candidateId);
            } else {
                state.selectedCandidates.push(candidateId);
            }
        },
        
        clearSelectedCandidates: (state) => {
            state.selectedCandidates = [];
        },
        
        // Active Call Session
        setActiveCallSession: (state, action) => {
            state.activeCallSession = action.payload;
        },
        
        clearActiveCallSession: (state) => {
            state.activeCallSession = null;
        },
        
        // Messages
        clearError: (state) => {
            state.error = null;
            state.settingsError = null;
            state.candidatesError = null;
            state.statsError = null;
            state.interviewDetailsError = null;
            state.callError = null;
        },
        
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        
        // WebSocket Updates
        updateCandidateFromWebSocket: (state, action) => {
            const updatedCandidate = action.payload;
            const index = state.candidates.findIndex(
                c => c.interview_id === updatedCandidate.interview_id
            );
            if (index !== -1) {
                state.candidates[index] = { ...state.candidates[index], ...updatedCandidate };
            }
        },
        
        updateStatsFromWebSocket: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchTelephonicSettings.pending, (state)=>{
            state.settingsLoading = true;
            state.settingsError = null;
        })
        .addCase(fetchTelephonicSettings.fulfilled, (state, action) => {
            state.settingsLoading = false;
            state.settings = action.payload.settings;
        })
        .addCase(fetchTelephonicSettings.rejected, (state, action) => {
            state.settingsLoading = false;
            state.settingsError = action.payload;
        })
        .addCase(updateTelephonicSettings.pending, (state) => {
            state.settingsLoading = true;
            state.settingsError = null;
        })
        .addCase(updateTelephonicSettings.fulfilled, (state, action) => {
            state.settingsLoading = false;
            state.settings = action.payload.settings;
            state.successMessage = action.payload.message || 'Settings updated successfully';
        })
        .addCase(updateTelephonicSettings.rejected, (state, action) => {
            state.settingsLoading = false;
            state.settingsError = action.payload;
        })
        .addCase(fetchTelephonicCandidates.pending, (state) => {
            state.candidatesLoading = true;
            state.candidatesError = null;
        })
        .addCase(fetchTelephonicCandidates.fulfilled, (state, action) => {
            state.candidatesLoading = false;
            state.candidates = action.payload.candidates;
            state.stats = action.payload.stats; // Stats included in candidates response
        })
        .addCase(fetchTelephonicCandidates.rejected, (state, action) => {
            state.candidatesLoading = false;
            state.candidatesError = action.payload;
        })
        .addCase(fetchTelephonicStats.pending, (state) => {
            state.statsLoading = true;
            state.statsError = null;
        })
        .addCase(fetchTelephonicStats.fulfilled, (state, action) => {
            state.statsLoading = false;
            state.stats = action.payload.stats;
        })
        .addCase(fetchTelephonicStats.rejected, (state, action) => {
            state.statsLoading = false;
            state.statsError = action.payload;
        })
        .addCase(scheduleInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(scheduleInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview scheduled successfully';
            // Update candidate in list
            const interviewId = action.payload.interview_id;
            const index = state.candidates.findIndex(c => c.interview_id === interviewId);
            if (index !== -1) {
            state.candidates[index].interview_status = 'scheduled';
            state.candidates[index].scheduled_at = action.payload.scheduled_at;
            }
        })
        .addCase(scheduleInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(bulkScheduleInterviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(bulkScheduleInterviews.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interviews scheduled successfully';
        })
        .addCase(bulkScheduleInterviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(rescheduleInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(rescheduleInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview rescheduled successfully';
        })
        .addCase(rescheduleInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(startCall.pending, (state) => {
            state.callLoading = true;
            state.callError = null;
        })
        .addCase(startCall.fulfilled, (state, action) => {
            state.callLoading = false;
            state.activeCallSession = action.payload;
            state.successMessage = action.payload.message || 'Call started successfully';
        })
        .addCase(startCall.rejected, (state, action) => {
            state.callLoading = false;
            state.callError = action.payload;
        })
        .addCase(endCall.pending, (state) => {
            state.callLoading = true;
            state.callError = null;
        })
        .addCase(endCall.fulfilled, (state, action) => {
            state.callLoading = false;
            state.activeCallSession = null;
            state.successMessage = action.payload.message || 'Call ended successfully';
        })
        .addCase(endCall.rejected, (state, action) => {
            state.callLoading = false;
            state.callError = action.payload;
        })
        .addCase(fetchInterviewDetails.pending, (state) => {
            state.interviewDetailsLoading = true;
            state.interviewDetailsError = null;
        })
        .addCase(fetchInterviewDetails.fulfilled, (state, action) => {
            state.interviewDetailsLoading = false;
            state.interviewDetails = action.payload.interview;
        })
        .addCase(fetchInterviewDetails.rejected, (state, action) => {
            state.interviewDetailsLoading = false;
            state.interviewDetailsError = action.payload;
        })
        .addCase(analyzeInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(analyzeInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview analyzed successfully';
        })
        .addCase(analyzeInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(overrideScore.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(overrideScore.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Score overridden successfully';
        })
        .addCase(overrideScore.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(moveToNextStage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(moveToNextStage.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Candidates moved successfully';
            state.selectedCandidates = []; // Clear selection
        })
        .addCase(moveToNextStage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export const {
  setFilterStatus,
  setSelectedCandidates,
  toggleCandidateSelection,
  clearSelectedCandidates,
  setActiveCallSession,
  clearActiveCallSession,
  clearError,
  clearSuccessMessage,
  updateCandidateFromWebSocket,
  updateStatsFromWebSocket,
} = telephonicSlice.actions;

export default telephonicSlice.reducer;