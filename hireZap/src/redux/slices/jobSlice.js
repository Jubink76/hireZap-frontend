import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import jobService from '../../services/jobService';

export const createJob = createAsyncThunk('jobs/create-job',async(data,thunkAPI)=>{
    try{
        const res = await jobService.createJob(data)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Job creation failed')
        return thunkAPI.rejectWithValue(friendly)
    }
})

const initialState = {
    jobs : [],
    selectedJob: null,
    allActiveJobs : [],
    loading: false,
    error: null,
    hasJobs: false
}

const jobSlice = createSlice({
    name : 'job',
    initialState,
    reducers : {
        clearJobError : (state) =>{
            state.error = null;
        },
        resetJobState: (state) => {
            state.jobs = [];
            state.selectedJob = null;
            state.allActiveJobs = [];
            state.loading = false;
            state.error = null;
            state.hasJobs = false;
        },
    },
    extraReducers: (builder)=>{
        builder
        .addCase(createJob.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(createJob.fulfilled,(state,action) =>{
            state.loading = false;
            state.jobs = action.payload;
            state.error = null;
        })
        .addCase(createJob.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})
export const {clearJobError, resetJobState} = jobSlice.actions;
export default jobSlice.reducer;
