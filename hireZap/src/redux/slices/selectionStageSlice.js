import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import selectionStageService from "../../services/selectionStageService";

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

const initialState = {
    stages:[],
    freeStages:[],
    premiumStages:[],
    inactiveStages:[],
    selectedStage:null,
    loading:false,
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
    },
    extraReducers:(builder) => {
        builder
        .addCase(createSelectionStage.pending,(state)=>{
            state.loading = true;
            state.error = false;
            state.successMessage = null;
        })
        .addCase(createSelectionStage.fulfilled,(state,action)=>{
            state.loading = false;
            state.stages.push(action.payload.data);
            state.successMessage = action.payload.message || 'Stage created successfully';
            state.error = null;
        })
        .addCase(createSelectionStage.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAllStages.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllStages.fulfilled,(state,action)=>{
            state.loading = false;
            state.stages = action.payload.data || [];
            // Separate free and premium stages
            state.freeStages = state.stages.filter(s => !s.requiresPremium);
            state.premiumStages = state.stages.filter(s => s.requiresPremium);

            state.error = null;
        })
        .addCase(fetchAllStages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchStageById.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchStageById.fulfilled,(state,action)=>{
            state.loading = false;
            state.selectedStage = action.payload;
            state.error = null;
        })
        .addCase(fetchStageById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateSelectionStage.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(updateSelectionStage.fulfilled,(state,action)=>{
            state.loading = false;
            const index = state.stages.findIndex(s => s.id === action.payload.data.id);
            if (index !== -1) {
                state.stages[index] = action.payload.data;
            }
            state.successMessage = action.payload.message || 'Stage updated successfully';
            state.error = null;
        })
        .addCase(updateSelectionStage.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteSelectionStage.pending,(state)=>{
            state.loading = true;
            state.error = false;
            state.successMessage = null;
        })
        .addCase(deleteSelectionStage.fulfilled,(state,action)=>{
            state.loading = false;
            state.stages = state.stages.filter(s => s.id !== action.payload.stageId)
            state.freeStages = state.freeStages.filter(s => s.id !== action.payload.stageId)
            state.premiumStages = state.premiumStages.filter(s => s.id !== action.payload.stageId)
            state.successMessage = state.payload.message || 'Stage deleted successfully';
            state.error = null;
        })
        .addCase(deleteSelectionStage.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchInactiveStages.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchInactiveStages.fulfilled, (state, action) => {
            state.loading = false;
            state.inactiveStages = action.payload.data || [];
            state.error = null;
        })
        .addCase(fetchInactiveStages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })  
        .addCase(reactivateSelectionStage.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(reactivateSelectionStage.fulfilled, (state, action) => {
            state.loading = false;
            state.inactiveStages = state.inactiveStages.filter(s => s.id !== action.payload.data.id);
            state.stages.push(action.payload.data);
            state.successMessage = action.payload.message || 'Stage reactivated successfully';
            state.error = null;
        })
        .addCase(reactivateSelectionStage.rejected, (state, action) => {
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
    } = selectionStageSlice.actions;
export default selectionStageSlice.reducer;