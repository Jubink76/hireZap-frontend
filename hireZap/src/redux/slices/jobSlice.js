import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import jobService from '../../services/jobService';
import { AwardIcon, FerrisWheel } from "lucide-react";

// create job
export const createJob = createAsyncThunk('jobs/create-job',async(data,thunkAPI)=>{
    try{
        const res = await jobService.createJob(data)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Job creation failed')
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch active jobs
export const fetchActiveJobs = createAsyncThunk('jobs/fetch-active-jobs',async(_,thunkAPI)=>{
    try{
        const res = await jobService.fetchActiveJobs()
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to fetch jobs')
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch recruiter create jobs
export const getJobsByRecruiterId = createAsyncThunk('jobs/created-jobs', async(id,thunkAPI) =>{
    try{
        const res = await jobService.getJobsByRecruiterId(id)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to fetch jobs')
        return thunkAPI.rejectWithValue(friendly)
    }
})

const initialState = {
    jobs : [],
    selectedJob: null,
    allActiveJobs : [],
    recruiterJobs : [],
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
            state.recruiterJobs = [];
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
        .addCase(fetchActiveJobs.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchActiveJobs.fulfilled,(state,action)=>{
            state.loading = false;
            state.allActiveJobs = action.payload;
            state.error = null;
        })
        .addCase(fetchActiveJobs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.allActiveJobs = [];
        })
        .addCase(getJobsByRecruiterId.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getJobsByRecruiterId.fulfilled,(state,action)=>{
            state.loading = false;
            state.recruiterJobs = action.payload.jobs || [];
            state.error = false;
        })
        .addCase(getJobsByRecruiterId.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

    }
})
export const {clearJobError, resetJobState} = jobSlice.actions;
export default jobSlice.reducer;
