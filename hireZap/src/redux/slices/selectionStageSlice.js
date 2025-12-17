import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import selectionStageService from "../../services/selectionStageService";
import { Truck } from "lucide-react";

export const createSelectionStage = createAsyncThunk('selectionStage/create', async(stageData,thunkAPI)=>{
    try{
        const res = await selectionStageService.createSelectionStage(stageData);
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to create stages')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const fetchAllStages = createAsyncThunk('fetchAll/selectionStage', async(_, thunkAPI)=>{
    try{
        const res = await selectionStageService.fetchAllStages();
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to fetch all stages')
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const fetchStageById = createAsyncThunk('fetch/stage', async(stage_id, thunkAPI)=>{
    try{
        const res = await selectionStageService.fetchStageById(stage_id);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "failed to fetch stage details")
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const updateSelectionStage = createAsyncThunk('update/selectionStage', async({stageId, stageData},thunkAPI)=>{
    try{
        const res = await selectionStageService.updateSelectionStage({ stageId, stageData });
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Failed to update selected stage")
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const deleteSelectionStage = createAsyncThunk('delete/selectionStage', async(stageId,thunkAPI)=>{
    try{
        const res = await selectionStageService.deleteSelectionStage(stageId);
        return { ...res.data, stageId }
    }catch(err){
        const friendly = getFriendlyError(err, "failed to delete stage")
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const fetchInactiveStages = createAsyncThunk('fetchInactive/selectionStage', async(_, thunkAPI) => {
    try {
        const res = await selectionStageService.fetchInactiveStages();
        return res
    } catch(err) {
        const friendly = getFriendlyError(err, 'Failed to fetch inactive stages')
        return thunkAPI.rejectWithValue(friendly);
    }
})

export const reactivateSelectionStage = createAsyncThunk('reactivate/selectionStage', async(stageId, thunkAPI) => {
    try {
        const res = await selectionStageService.reactivateSelectionStage(stageId);
        return res
    } catch(err) {
        const friendly = getFriendlyError(err, "Failed to reactivate stage")
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const saveJobSelectionProcess = createAsyncThunk('save/selection-process', async({jobId,stageIds}, thunkAPI)=>{
    try{
        const res = await selectionStageService.saveJobSelectionProcess(jobId,stageIds)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to save the selection process')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const getJobSelectionProcess = createAsyncThunk('get/job/selection-process',async(jobId, thunkAPI)=>{
    try{
        const res = await selectionStageService.getJobSelectionProcess(jobId)
        console.log('Response from the api', res)
        return res
    }catch(err){
        console.error('Error in getJobSelectionProcess:', err); 
        const friendly = getFriendlyError(err, 'Failed fetch selection process of this job')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const deleteJobSelectionProcess = createAsyncThunk(
    'selectionStage/deleteJobProcess',
    async(jobId, thunkAPI) => {
        try {
            const res = await selectionStageService.deleteJobSelectionProcess(jobId);
            return res;
        } catch(err) {
            const friendly = getFriendlyError(err, 'Failed to delete selection process');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

const initialState = {
    stages:[],
    freeStages:[],
    premiumStages:[],
    inactiveStages:[],
    jobStages:[],
    selectedStage:null,
    stageLoading:false,
    error:null,
    successMessage:null
}

const selectionStageSlice = createSlice({
    name:'selectionStage',
    initialState,
    reducers:{
        clearStageError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        clearSelectedStage: (state) => {
            state.selectedStage = null;
        },
        resetStageState: (state) => {
            return initialState;
        },
        clearJobStages: (state) => {
            state.jobStages = [];
        },
    },
    extraReducers:(builder) => {
        builder
        .addCase(createSelectionStage.pending,(state)=>{
            state.stageLoading = true;
            state.error = false;
            state.successMessage = null;
        })
        .addCase(createSelectionStage.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.stages.push(action.payload.data);
            state.successMessage = action.payload.message || 'Stage created successfully';
            state.error = null;
        })
        .addCase(createSelectionStage.rejected,(state,action)=>{
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(fetchAllStages.pending,(state)=>{
            state.stageLoading = true;
            state.error = null;
        })
        .addCase(fetchAllStages.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.stages = action.payload.data || [];
            // Separate free and premium stages
            state.freeStages = state.stages.filter(s => !s.requiresPremium);
            state.premiumStages = state.stages.filter(s => s.requiresPremium);

            state.error = null;
        })
        .addCase(fetchAllStages.rejected, (state, action) => {
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(fetchStageById.pending,(state)=>{
            state.stageLoading = true;
            state.error = null;
        })
        .addCase(fetchStageById.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.selectedStage = action.payload;
            state.error = null;
        })
        .addCase(fetchStageById.rejected,(state,action)=>{
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(updateSelectionStage.pending,(state)=>{
            state.stageLoading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(updateSelectionStage.fulfilled,(state,action)=>{
            state.stageLoading = false;
            const index = state.stages.findIndex(s => s.id === action.payload.data.id);
            if (index !== -1) {
                state.stages[index] = action.payload.data;
            }
            state.successMessage = action.payload.message || 'Stage updated successfully';
            state.error = null;
        })
        .addCase(updateSelectionStage.rejected,(state,action)=>{
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(deleteSelectionStage.pending,(state)=>{
            state.stageLoading = true;
            state.error = false;
            state.successMessage = null;
        })
        .addCase(deleteSelectionStage.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.stages = state.stages.filter(s => s.id !== action.payload.stageId)
            state.freeStages = state.freeStages.filter(s => s.id !== action.payload.stageId)
            state.premiumStages = state.premiumStages.filter(s => s.id !== action.payload.stageId)
            state.successMessage = state.payload.message || 'Stage deleted successfully';
            state.error = null;
        })
        .addCase(deleteSelectionStage.rejected, (state,action)=>{
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(fetchInactiveStages.pending, (state) => {
            state.stageLoading = true;
            state.error = null;
        })
        .addCase(fetchInactiveStages.fulfilled, (state, action) => {
            state.stageLoading = false;
            state.inactiveStages = action.payload.data || [];
            state.error = null;
        })
        .addCase(fetchInactiveStages.rejected, (state, action) => {
            state.stageLoading = false;
            state.error = action.payload;
        })  
        .addCase(reactivateSelectionStage.pending, (state) => {
            state.stageLoading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(reactivateSelectionStage.fulfilled, (state, action) => {
            state.stageLoading = false;
            state.inactiveStages = state.inactiveStages.filter(s => s.id !== action.payload.data.id);
            state.stages.push(action.payload.data);
            state.successMessage = action.payload.message || 'Stage reactivated successfully';
            state.error = null;
        })
        .addCase(reactivateSelectionStage.rejected, (state, action) => {
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(saveJobSelectionProcess.pending,(state)=>{
            state.stageLoading=true;
            state.error=null;
            state.successMessage=null;
        })
        .addCase(saveJobSelectionProcess.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.successMessage=action.payload.message || 'Selection Process saved';
            state.error = null;
        })
        .addCase(saveJobSelectionProcess.rejected,(state,action)=>{
            state.stageLoading = false;
            state.error = action.payload
        })
        .addCase(getJobSelectionProcess.pending,(state)=>{
            state.stageLoading = true;
            state.error =null;
        })
        .addCase(getJobSelectionProcess.fulfilled,(state,action)=>{
            state.stageLoading = false;
            state.jobStages = action.payload.data || [];
            state.error= null;
        })
        .addCase(getJobSelectionProcess.rejected,(state,action)=>{
            state.stageLoading = false;
            state.error = action.payload;
        })
        .addCase(deleteJobSelectionProcess.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(deleteJobSelectionProcess.fulfilled, (state, action) => {
            state.loading = false;
            state.jobStages = [];
            state.successMessage = action.payload.message || 'Selection process deleted successfully';
            state.error = null;
        })
        .addCase(deleteJobSelectionProcess.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const {
    clearStageError,
    clearSuccessMessage,
    resetStageState,
    clearSelectedStage,
    clearJobStages
    } = selectionStageSlice.actions;
export default selectionStageSlice.reducer;