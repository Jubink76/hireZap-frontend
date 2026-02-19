import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hrRoundService from "../../services/hrRoundService";
import { getFriendlyError } from "../../utils/errorHandler";

export const fetchHrRoundSettings = createAsyncThunk('hrRound/fetchSettings', async(jobId,thunkAPI)=>{
    try{
        const res = await hrRoundService.getSettings(jobId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch HR round settings');
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const updateHrRoundSettings = createAsyncThunk('hrRound/updateSettings', async({jobId, settingsData}, thunkAPI)=>{
    try{
        const res = await hrRoundService.updateSettings(jobId, settingsData);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to update settings');
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const fetchHrRoundInterviews = createAsyncThunk('hrRound/fetchInterviews',async ({ jobId, statusFilter }, thunkAPI) => {
    try {
        const response = await hrRoundService.getInterviews(jobId, statusFilter);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch interviews');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const fetchHrRoundStats = createAsyncThunk('hrRound/fetchStats',async (jobId, thunkAPI) => {
    try {
        const response = await hrRoundService.getStats(jobId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch stats');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const fetchInterviewDetails = createAsyncThunk('hrRound/fetchDetails',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.getInterviewDetails(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch interview details');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const scheduleHRInterview = createAsyncThunk('hrRound/schedule',async (scheduleData, thunkAPI) => {
    try {
        const response = await hrRoundService.scheduleInterview(scheduleData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to schedule interview');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const bulkScheduleHRInterviews = createAsyncThunk('hrRound/bulkSchedule',async (schedulesData, thunkAPI) => {
    try {
        const response = await hrRoundService.bulkScheduleInterviews(schedulesData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to bulk schedule interviews');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const rescheduleHRInterview = createAsyncThunk('hrRound/reschedule',async ({ interviewId, scheduleData }, thunkAPI) => {
    try {
        const response = await hrRoundService.rescheduleInterview(interviewId, scheduleData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to reschedule interview');
        return thunkAPI.rejectWithValue(friendly);
    }
});
export const cancelHRInterview = createAsyncThunk('hrRound/cancel',async ({ interviewId, reason }, thunkAPI) => {
    try {
        const response = await hrRoundService.cancelInterview(interviewId, reason);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to cancel interview');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const startHRMeeting = createAsyncThunk('hrRound/startMeeting',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.startMeeting(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to start meeting');
        return thunkAPI.rejectWithValue(friendly);
  }
});

export const joinHRMeeting = createAsyncThunk('hrRound/joinMeeting',async (sessionId, thunkAPI) => {
    try {
        const response = await hrRoundService.joinMeeting(sessionId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to join meeting');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const endHRMeeting = createAsyncThunk('hrRound/endMeeting',async (sessionId, thunkAPI) => {
    try {
        const response = await hrRoundService.endMeeting(sessionId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to end meeting');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const startRecording = createAsyncThunk('hrRound/startRecording',async (sessionId, thunkAPI) => {
    try {
        const response = await hrRoundService.startRecording(sessionId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to start recording');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const stopRecording = createAsyncThunk('hrRound/stopRecording',async ({ sessionId, durationSeconds }, thunkAPI) => {
    try {
        const response = await hrRoundService.stopRecording(sessionId, durationSeconds);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to stop recording');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const uploadRecording = createAsyncThunk('hrRound/uploadRecording',async ({ interviewId, videoFile, durationSeconds, resolution }, thunkAPI) => {
    try {
        const response = await hrRoundService.uploadRecording(
            interviewId, 
            videoFile, 
            durationSeconds, 
            resolution
        );
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to upload recording');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const fetchRecording = createAsyncThunk('hrRound/fetchRecording',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.getRecording(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch recording');
        return thunkAPI.rejectWithValue(friendly);
    }
});


export const deleteRecording = createAsyncThunk('hrRound/deleteRecording',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.deleteRecording(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to delete recording');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const fetchNotes = createAsyncThunk('hrRound/fetchNotes',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.getNotes(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch notes');
        return thunkAPI.rejectWithValue(friendly);
    }
});
export const createNotes = createAsyncThunk('hrRound/createNotes',async (notesData, thunkAPI) => {
    try {
        const response = await hrRoundService.createNotes(notesData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to create notes');
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const updateNotes = createAsyncThunk('hrRound/updateNotes',async ({ interviewId, notesData }, thunkAPI) => {
    try {
        const response = await hrRoundService.updateNotes(interviewId, notesData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to update notes');
        return thunkAPI.rejectWithValue(friendly);
    }
})


export const finalizeNotes = createAsyncThunk('hrRound/finalizeNotes',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.finalizeNotes(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to finalize notes');
        return thunkAPI.rejectWithValue(friendly);
    }
});


export const fetchResult = createAsyncThunk('hrRound/fetchResult',async (interviewId, thunkAPI) => {
    try {
        const response = await hrRoundService.getResult(interviewId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to fetch result');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const finalizeResult = createAsyncThunk('hrRound/finalizeResult',async (resultData, thunkAPI) => {
    try {
        const response = await hrRoundService.finalizeResult(resultData);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to finalize result');
        return thunkAPI.rejectWithValue(friendly);
    }
});

export const moveToNextStage = createAsyncThunk('hrRoun/moveToNextStage',async ({ interviewId, nextStageId }, thunkAPI) => {
    try {
        const response = await hrRoundService.moveToNextStage(interviewId, nextStageId);
        return response;
    } catch (err) {
        const friendly = getFriendlyError(err, 'Failed to move to next stage');
        return thunkAPI.rejectWithValue(friendly);
    }
});


const initialState = {
    settings: null,
    settingsLoading: false,
    settingsError: null,
    interviews: [],
    interviewsLoading: false,
    interviewsError: null,
    currentInterview: null,
    interviewDetailsLoading: false,
    interviewDetailsError: null,
    stats: null,
    statsLoading: false,
    statsError: null,
    activeMeeting: null,
    meetingLoading: false,
    meetingError: null,
    recording: null,
    recordingLoading: false,
    recordingError: null,
    isRecording: false,
    notes: null,
    notesLoading: false,
    notesError: null,
    result: null,
    resultLoading: false,
    resultError: null,
    selectedInterviews: [],
    filterStatus: 'all',
    successMessage: null,
    loading: false,
    error: null,
}
const hrRoundSlice = createSlice({
    name:'hrRound',
    initialState,
    reducers:{
        setFilterStatus : (state,action) =>{
            state.filterStatus = action.payload
        },
        setSelectedInterviews : (state,action) =>{
            state.selectedInterviews = action.payload;
        },
        toggleInterviewSelection : (state,action) => {
            const interviewId = action.payload;
            if (state.selectedInterviews.includes(interviewId)){
                state.selectedInterviews = state.selectedInterviews.filter(id=>id!=interviewId)
            }else{
                state.selectedInterviews.push(interviewId)
            }
        },
        clearSelectedInterviews : (state) => {
            state.selectedInterviews = [];
        },
        setActiveMeeting : (state,action)=>{
            state.activeMeeting = action.payload;
        },
        clearActiveMeeting: (state) => {
            state.activeMeeting = null;
        },
        setRecordingStatus: (state,action) =>{
            state.isRecording = action.payload
        },
        clearError: (state) => {
            state.error = null;
            state.settingsError = null;
            state.interviewsError = null;
            state.interviewDetailsError = null;
            state.meetingError = null;
            state.recordingError = null;
            state.notesError = null;
            state.resultError = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        updateInterviewFromWebSocket: (state, action) => {
            const updatedInterview = action.payload;
            const index = state.interviews.findIndex(
                i => i.id === updatedInterview.id
            );
            if (index !== -1) {
                state.interviews[index] = { ...state.interviews[index], ...updatedInterview };
            }
        },

        updateStatsFromWebSocket: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchHrRoundSettings.pending, (state) => {
            state.settingsLoading = true;
            state.settingsError = null;
        })
        .addCase(fetchHrRoundSettings.fulfilled, (state, action) => {
            state.settingsLoading = false;
            state.settings = action.payload.settings;
        })
        .addCase(fetchHrRoundSettings.rejected, (state, action) => {
            state.settingsLoading = false;
            state.settingsError = action.payload;
        })
        .addCase(updateHrRoundSettings.pending,(state)=>{
            state.settingsLoading = true;
            state.settingsError = null;
        })
        .addCase(updateHrRoundSettings.fulfilled, (state, action) => {
            state.settingsLoading = false;
            state.settings = action.payload.settings;
            state.successMessage = action.payload.message || 'Settings updated successfully';
        })
        .addCase(updateHrRoundSettings.rejected, (state, action) => {
            state.settingsLoading = false;
            state.settingsError = action.payload;
        })
        .addCase(fetchHrRoundInterviews.pending, (state) => {
            state.interviewsLoading = true;
            state.interviewsError = null;
        })
        .addCase(fetchHrRoundInterviews.fulfilled, (state, action) => {
            state.interviewsLoading = false;
            state.interviews = action.payload.interviews || [];
        })
        .addCase(fetchHrRoundInterviews.rejected, (state, action) => {
            state.interviewsLoading = false;
            state.interviewsError = action.payload;
        })
        .addCase(fetchHrRoundStats.pending, (state) => {
            state.statsLoading = true;
            state.statsError = null;
        })
        .addCase(fetchHrRoundStats.fulfilled, (state, action) => {
            state.statsLoading = false;
            state.stats = action.payload.stats;
        })
        .addCase(fetchHrRoundStats.rejected, (state, action) => {
            state.statsLoading = false;
            state.statsError = action.payload;
        })
        .addCase(fetchInterviewDetails.pending, (state) => {
            state.interviewDetailsLoading = true;
            state.interviewDetailsError = null;
        })
        .addCase(fetchInterviewDetails.fulfilled, (state, action) => {
            state.interviewDetailsLoading = false;
            state.currentInterview = action.payload.interview;
        })
        .addCase(fetchInterviewDetails.rejected, (state, action) => {
            state.interviewDetailsLoading = false;
            state.interviewDetailsError = action.payload;
        })
        .addCase(scheduleHRInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(scheduleHRInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview scheduled successfully';
        })
        .addCase(scheduleHRInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(bulkScheduleHRInterviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(bulkScheduleHRInterviews.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interviews scheduled successfully';
        })
        .addCase(bulkScheduleHRInterviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(rescheduleHRInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(rescheduleHRInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview rescheduled successfully';
        })
        .addCase(rescheduleHRInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(cancelHRInterview.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cancelHRInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Interview cancelled successfully';
        })
        .addCase(cancelHRInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(startHRMeeting.pending, (state) => {
            state.meetingLoading = true;
            state.meetingError = null;
        })
        .addCase(startHRMeeting.fulfilled, (state, action) => {
            state.meetingLoading = false;
            state.activeMeeting = action.payload;
            state.successMessage = 'Meeting started successfully';
            const interviewIndex = state.interviews.findIndex(
                i => i.id === action.payload.interview.id
            );
            if (interviewIndex !== -1) {
                state.interviews[interviewIndex] = {
                    ...state.interviews[interviewIndex],
                    status: 'in_progress',
                    meeting_session: action.payload.session,
                    zegocloud_config: action.payload.zegocloud_config
                };
            }
        })
        .addCase(startHRMeeting.rejected, (state, action) => {
            state.meetingLoading = false;
            state.meetingError = action.payload;
        })
        .addCase(joinHRMeeting.pending, (state) => {
            state.meetingLoading = true;
            state.meetingError = null;
        })
        .addCase(joinHRMeeting.fulfilled, (state, action) => {
            state.meetingLoading = false;
            state.activeMeeting = action.payload;
            state.successMessage = 'Joined meeting successfully';
        })
        .addCase(joinHRMeeting.rejected, (state, action) => {
            state.meetingLoading = false;
            state.meetingError = action.payload;
        })
        .addCase(endHRMeeting.pending, (state) => {
            state.meetingLoading = true;
                state.meetingError = null;
        })
        .addCase(endHRMeeting.fulfilled, (state, action) => {
            state.meetingLoading = false;
            state.activeMeeting = null;
            state.isRecording = false;
            state.successMessage = 'Meeting ended successfully';
        })
        .addCase(endHRMeeting.rejected, (state, action) => {
            state.meetingLoading = false;
            state.meetingError = action.payload;
        })
        .addCase(startRecording.pending, (state) => {
            state.recordingLoading = true;
            state.recordingError = null;
        })
        .addCase(startRecording.fulfilled, (state, action) => {
            state.recordingLoading = false;
            state.isRecording = true;
            state.successMessage = 'Recording started';
        })
        .addCase(startRecording.rejected, (state, action) => {
            state.recordingLoading = false;
            state.recordingError = action.payload;
        })
        .addCase(stopRecording.pending, (state) => {
            state.recordingLoading = true;
            state.recordingError = null;
        })
        .addCase(stopRecording.fulfilled, (state, action) => {
            state.recordingLoading = false;
            state.isRecording = false;
            state.successMessage = 'Recording stopped';
        })
        .addCase(stopRecording.rejected, (state, action) => {
            state.recordingLoading = false;
            state.recordingError = action.payload;
        })
        .addCase(uploadRecording.pending, (state) => {
            state.recordingLoading = true;
            state.recordingError = null;
        })
        .addCase(uploadRecording.fulfilled, (state, action) => {
            state.recordingLoading = false;
            state.recording = action.payload.recording;
            state.successMessage = 'Recording uploaded successfully';
        })
        .addCase(uploadRecording.rejected, (state, action) => {
            state.recordingLoading = false;
            state.recordingError = action.payload;
        })
        .addCase(fetchRecording.pending, (state) => {
            state.recordingLoading = true;
            state.recordingError = null;
        })
        .addCase(fetchRecording.fulfilled, (state, action) => {
            state.recordingLoading = false;
            state.recording = action.payload.recording;
        })
        .addCase(fetchRecording.rejected, (state, action) => {
            state.recordingLoading = false;
            state.recordingError = action.payload;
        })

        .addCase(fetchNotes.pending, (state) => {
            state.notesLoading = true;
            state.notesError = null;
        })
        .addCase(fetchNotes.fulfilled, (state, action) => {
            state.notesLoading = false;
            state.notes = action.payload.notes;
        })
        .addCase(fetchNotes.rejected, (state, action) => {
            state.notesLoading = false;
            state.notesError = action.payload;
        })
        .addCase(createNotes.pending, (state) => {
            state.notesLoading = true;
            state.notesError = null;
        })
        .addCase(createNotes.fulfilled, (state, action) => {
            state.notesLoading = false;
            state.notes = action.payload.notes;
            state.successMessage = 'Notes created successfully';
        })
        .addCase(createNotes.rejected, (state, action) => {
            state.notesLoading = false;
            state.notesError = action.payload;
        })
        .addCase(updateNotes.pending, (state) => {
            state.notesLoading = true;
            state.notesError = null;
        })
        .addCase(updateNotes.fulfilled, (state, action) => {
            state.notesLoading = false;
            state.notes = action.payload.notes;
            state.successMessage = 'Notes updated successfully';
        })
        .addCase(updateNotes.rejected, (state, action) => {
            state.notesLoading = false;
            state.notesError = action.payload;
        })
        .addCase(finalizeNotes.pending, (state) => {
            state.notesLoading = true;
            state.notesError = null;
        })
        .addCase(finalizeNotes.fulfilled, (state, action) => {
            state.notesLoading = false;
            state.notes = action.payload.notes;
            state.successMessage = 'Notes finalized successfully';
        })
        .addCase(finalizeNotes.rejected, (state, action) => {
            state.notesLoading = false;
            state.notesError = action.payload;
        })
        .addCase(fetchResult.pending, (state) => {
            state.resultLoading = true;
            state.resultError = null;
        })
        .addCase(fetchResult.fulfilled, (state, action) => {
            state.resultLoading = false;
            state.result = action.payload.result;
        })
        .addCase(fetchResult.rejected, (state, action) => {
            state.resultLoading = false;
            state.resultError = action.payload;
        })
        .addCase(finalizeResult.pending, (state) => {
            state.resultLoading = true;
            state.resultError = null;
        })
        .addCase(finalizeResult.fulfilled, (state, action) => {
            state.resultLoading = false;
            state.result = action.payload.result;
            state.successMessage = action.payload.message || 'Result finalized successfully';
        })
        .addCase(finalizeResult.rejected, (state, action) => {
            state.resultLoading = false;
            state.resultError = action.payload;
        })
        .addCase(moveToNextStage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(moveToNextStage.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message || 'Moved to next stage successfully';
            state.selectedInterviews = [];
        })
        .addCase(moveToNextStage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export const {
    setFilterStatus,
    setSelectedInterviews,
    toggleInterviewSelection,
    clearSelectedInterviews,
    setActiveMeeting,
    clearActiveMeeting,
    setRecordingStatus,
    clearError,
    clearSuccessMessage,
    updateInterviewFromWebSocket,
    updateStatsFromWebSocket,
} = hrRoundSlice.actions;

export default hrRoundSlice.reducer;