import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import resumeScreeningService from "../../services/resumeScreeningService";
import { getFriendlyError } from "../../utils/errorHandler";

//config ats
export const configureATS = createAsyncThunk("resume-screening/configureATS", async({jobId, configData}, thunkAPI)=>{
    try{
        const res = await resumeScreeningService.configureATS(jobId, configData);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to configure ATS")
        return thunkAPI.rejectWithValue(friendly)
    }
});

//Get ats config
export const getATSConfig = createAsyncThunk("resume-screening/getATSConfig", async(jobId, thunkAPI)=>{
    try{
        const res = await resumeScreeningService.getATSConfig(jobId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Failed to fetch ATS configuration")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// StartBulkScreening
export const startBulkScreening = createAsyncThunk("resume-screening/start-bulk-screening",async(jobId, thunkAPI)=>{
    try{
        const res = await resumeScreeningService.startBulkScreening(jobId)
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to start bulk screening")
        return thunkAPI.rejectWithValue(friendly)
    }
})

//Get screening progress
export const getScreeningProgress = createAsyncThunk("resume-screening/Get-screening-progress", async(jobId, thunkAPI)=>{
    try{
        const res = await resumeScreeningService.getScreeningProgress(jobId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to fetch screening progress");
        return thunkAPI.rejectWithValue(friendly);
    }
})

//Get screening results
export const getScreeningResults = createAsyncThunk("resume-screening/results", async({jobId, filters}, thunkAPI)=>{
    try{
        const res = await resumeScreeningService.getScreeningResults(jobId, filters);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to fetch screening results");
        return thunkAPI.rejectWithValue(friendly);
    }
})

//Move to next stage
export const moveToNextStage = createAsyncThunk("resume-sreening/move-to-next-stage", async({applicationIds, feedback}, thunkAPI)=>{
    try{
        const res = resumeScreeningService.moveToNextStage(applicationIds,feedback);
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,"Failed to move candidates to next stage");
        return thunkAPI.rejectWithValue(friendly);
    }
})

//pause screening
export const pauseScreening = createAsyncThunk("resume-screening/pause", async(jobId, thunkAPI)=>{
    try{
        const res = resumeScreeningService.pauseScreening(jobId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to pause sreening");
        return thunkAPI.rejectWithValue(friendly);
    }
})

//reset screening
export const resetScreening = createAsyncThunk(
    "resume-screening/reset",
    async (jobId, thunkAPI) => {
        try {
            const res = await resumeScreeningService.resetScreening(jobId);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, "Failed to reset screening");
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

const initialState = {
    // ATS Config
    atsConfig: null,
    atsConfigLoading: false,
    atsConfigError: null,
    
    // Screening Progress
    screeningProgress: null,
    screeningInProgress: false,
    progressLoading: false,
    progressError: null,
    
    // Screening Results
    screeningResults: [],
    resultsLoading: false,
    resultsError: null,
    
    // UI State
    loading: false,
    error: null,
    successMessage: null,

    lastWebSocketEvent: null,
}

const resumeScreeningSlice = createSlice({
    name:"resumeScreener",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.atsConfigError = null;
            state.progressError = null;
            state.resultsError = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        updateProgressFromWebSocket: (state, action) => {
        if (state.screeningProgress) {
            state.screeningProgress = {
                ...state.screeningProgress,
                ...action.payload,
            };
        } else {
            state.screeningProgress = action.payload;
        }
        state.screeningInProgress = action.payload.status === 'in_progress';
    
        console.log('✅ Redux: Updated state', {
            status: state.screeningProgress.status,
            screeningInProgress: state.screeningInProgress
        });
        },
    },
    extraReducers:(builder)=>{
        builder
        // configure ats
        .addCase(configureATS.pending,(state)=>{
            state.loading = true;
            state.error = false;
        })
        .addCase(configureATS.fulfilled, (state, action) => {
            state.loading = false;
            state.atsConfig = action.payload.data;
            state.successMessage = action.payload.message;
        })
        .addCase(configureATS.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // get ats configuration
        .addCase(getATSConfig.pending,(state)=>{
            state.atsConfigLoading = true;
            state.atsConfigError = null;
        })
        .addCase(getATSConfig.fulfilled, (state,action)=>{
            state.atsConfigLoading = false;
            state.atsConfig = action.payload.config
        })
        .addCase(getATSConfig.rejected, (state, action) => {
            state.atsConfigLoading = false;
            state.atsConfigError = action.payload?.error || 'Failed to fetch ATS config';
        })
        // Start Bulk Screening
        .addCase(startBulkScreening.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(startBulkScreening.fulfilled, (state, action) => {
            state.loading = false;
            state.screeningInProgress = true;
            state.successMessage = 'Screening started successfully';
        })
        .addCase(startBulkScreening.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.error || 'Failed to start screening';
        })
        // Get Screening Progress
      .addCase(getScreeningProgress.pending, (state) => {
        state.progressLoading = true;
        state.progressError = null;
      })
      .addCase(getScreeningProgress.fulfilled, (state, action) => {
        state.progressLoading = false;
        state.screeningProgress = action.payload.progress;
        state.screeningInProgress = action.payload.progress.status === 'in_progress';
      })
      .addCase(getScreeningProgress.rejected, (state, action) => {
        state.progressLoading = false;
        state.progressError = action.payload?.error || 'Failed to fetch progress';
      })
      // Get Screening Results
      .addCase(getScreeningResults.pending, (state) => {
        state.resultsLoading = true;
        state.resultsError = null;
      })
      .addCase(getScreeningResults.fulfilled, (state, action) => {
        state.resultsLoading = false;
        state.screeningResults = action.payload.results;
      })
      .addCase(getScreeningResults.rejected, (state, action) => {
        state.resultsLoading = false;
        state.resultsError = action.payload?.error || 'Failed to fetch results';
      })
      // Move to Next Stage
      .addCase(moveToNextStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToNextStage.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = `${action.payload.total_moved} candidates moved to next stage`;
      })
      .addCase(moveToNextStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to move candidates';
      })
      // Pause Screening
      .addCase(pauseScreening.pending, (state) => {
        state.loading = true;
      })
      .addCase(pauseScreening.fulfilled, (state) => {
        state.loading = false;
        state.screeningInProgress = false;
        state.successMessage = 'Screening paused';
      })
      .addCase(pauseScreening.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to pause screening';
      })
      //reset screening
      .addCase(resetScreening.pending, (state) => {
        state.loading = true;
        })
        .addCase(resetScreening.fulfilled, (state) => {
            state.loading = false;
            state.screeningProgress = null;
            state.screeningInProgress = false;
            state.screeningResults = [];
            state.successMessage = 'Screening reset successfully';
        })
        .addCase(resetScreening.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.error || 'Failed to reset screening';
        });

    }

})

export const {
    clearError,
    clearSuccessMessage,
    updateProgressFromWebSocket,
    resetResumeScreeningState,
} = resumeScreeningSlice.actions;

export default resumeScreeningSlice.reducer;