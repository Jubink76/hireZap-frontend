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
        console.log("active jobs ", res)
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

// fetch all jobs for admin
export const fetchAllJobs = createAsyncThunk('jobs/fetch-all-jobs/',async(_,thunkAPI) => {
    try{
        const res = await jobService.fetchAllJobs()
        return res
    }catch{
        const friendly = getFriendlyError(err,'Failed to fetch all jobs')
        return thunkAPI.rejectWithValue(friendly);
    }
})

// fetch all inactive jobs for admin
export const fetchInactiveJobs = createAsyncThunk('jobs/fetch-inactive-jobs',async(_,thunkAPI)=>{
    try{
        const res = await jobService.fetchInactiveJobs()
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch inactive jobs')
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch all paused Jobs for admin
export const fetchPausedJobs = createAsyncThunk('jobs/fetch-paused-jobs',async(_,thunkAPI)=>{
    try{
        const res = await jobService.fetchInactiveJobs()
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch paused jobs')
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch job by id
export const fetchJobById = createAsyncThunk('job/fetch-job', async(job_id,thunkAPI)=>{
    try{
        const res = await jobService.fetchJobById(job_id)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to fetch job details')
        return thunkAPI.rejectWithValue(friendly)
    }
})

const initialState = {
    jobs : [],
    selectedJob: null,
    currentJob: null,
    allActiveJobs : [],
    recruiterJobs : [],
    allJobs : [],
    inactiveJobs : [],
    pausedJobs : [],
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
            state.currentJob = null;
            state.allActiveJobs = [];
            state.recruiterJobs = [];
            state.allJobs = [];
            state.inactiveJobs = [];
            state.pausedJobs = [];
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
            state.allActiveJobs = action.payload?.jobs || [];
            state.error = null;
        })
        .addCase(fetchActiveJobs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getJobsByRecruiterId.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getJobsByRecruiterId.fulfilled,(state,action)=>{
            state.loading = false;
            state.recruiterJobs = action.payload.jobs || [];
            state.error = null;
        })
        .addCase(getJobsByRecruiterId.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAllJobs.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllJobs.fulfilled,(state,action)=>{
            state.loading = false;
            state.allJobs = action.payload?.jobs || [];
            state.error = null;
        })
        .addCase(fetchAllJobs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchInactiveJobs.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchInactiveJobs.fulfilled,(state,action)=>{
            state.loading = false;
            state.inactiveJobs = action.payload?.jobs || [];
            state.error = null;
        })
        .addCase(fetchInactiveJobs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchPausedJobs.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPausedJobs.fulfilled,(state,action)=>{
            state.loading = false;
            state.pausedJobs = action.payload?.jobs || [];
            state.error = null;
        })
        .addCase(fetchPausedJobs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchJobById.pending,(state)=>{
            state.loading = true;
            state.error = false;
        })
        .addCase(fetchJobById.fulfilled,(state,action)=>{
            state.loading = false;
            state.currentJob = action.payload?.job || null;
            state.error = false;
        })
        .addCase(fetchJobById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})
export const {clearJobError, resetJobState} = jobSlice.actions;
export default jobSlice.reducer;
