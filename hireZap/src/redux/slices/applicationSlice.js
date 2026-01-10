import applicationServices from "../../services/applicationService";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";

//create application
export const createApplication = createAsyncThunk('create/application',async(data,thunkAPI)=>{
    try{
        const res = await applicationServices.createApplication(data)
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,data.is_draft ? 'Failed to save draft' : 'Failed to submit application')
        return thunkAPI.rejectWithValue(friendly);
    }
})

// fetch application by id
export const fetchApplicationById = createAsyncThunk('application/detail',async(id, thunkAPI)=>{
    try{
        const res = await applicationServices.getApplicationById(id)
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,"Failed to fetch application data")
        return thunkAPI.rejectWithValue(friendly)
    }
})

//fetch candiate applications
export const fetchMyApplications = createAsyncThunk('applications/fetchMy', async(includeDrafts = false, thunkAPI) => {
        try {
            const res = await applicationServices.getMyApplications(includeDrafts);
            console.log(res)
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to fetch your applications');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// withdraw application

// Withdraw application
export const withdrawApplication = createAsyncThunk(
    'applications/withdraw',
    async (id, thunkAPI) => {
        try {
            const res = await applicationServices.withdrawApplication(id);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to withdraw application');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Check if application exists for a job
export const checkApplicationExists = createAsyncThunk(
    'applications/checkExists',
    async (jobId, thunkAPI) => {
        try {
            const res = await applicationServices.checkApplicationExists(jobId);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to check application status');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Fetch applications for a job (Recruiter)
export const fetchJobApplications = createAsyncThunk(
    'applications/fetchJobApplications',
    async ({ jobId, status = null }, thunkAPI) => {
        try {
            const res = await applicationServices.getJobApplications(jobId, status);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to fetch job applications');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Fetch application statistics (Recruiter)
export const fetchApplicationStatistics = createAsyncThunk(
    'applications/fetchStatistics',
    async (jobId, thunkAPI) => {
        try {
            const res = await applicationServices.getApplicationStatistics(jobId);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to fetch application statistics');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Update application status (Recruiter)
export const updateApplicationStatus = createAsyncThunk(
    'applications/updateStatus',
    async ({ id, statusData }, thunkAPI) => {
        try {
            const res = await applicationServices.updateApplicationStatus(id, statusData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to update application status');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

export const fetchApplicationProgress = createAsyncThunk('fetch/applicationProgres', async(applicationId, thunkAPI)=>{
    try{
        const res = await applicationServices.getApplicationProgress(applicationId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch application progress')
        return thunkAPI.rejectWithValue(friendly);
    }
})

const initialState = {
    currentApplication: null,
    applicationData:null,
    myApplications:[],
    jobApplications:[],
    loading:false,
    error:null,
    submitting:false,
    statistics: null,
    applicationCheck: {
        has_applied: false,
        has_draft: false,
        application: null,
        draft: null,
    },
    successMessage: null,
}

const applicationSlice = createSlice({
    name:'application',
    initialState,
    reducers:{
        clearApplicationError: (state) =>{
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetApplicationState: (state) => {
            state.currentApplication = null;
            state.myApplications = [];
            state.jobApplications = [];
            state.statistics = null;
            state.applicationCheck = {
                has_applied: false,
                has_draft: false,
                application: null,
                draft: null,
            };
            state.loading = false;
            state.submitting = false;
            state.error = null;
            state.successMessage = null;
        },
        resetApplicationCheck: (state) => {
            state.applicationCheck = {
                has_applied: false,
                has_draft: false,
                application: null,
                draft: null,
            };
        },
    },
    extraReducers:(builder) =>{
        builder
            .addCase(createApplication.pending,(state)=>{
                state.submitting = true;
                state.error = false;
            })
            .addCase(createApplication.fulfilled,(state,action)=>{
                state.submitting = false;
                state.currentApplication = action.payload?.data || null;
                state.error = null;
            })
            .addCase(createApplication.rejected,(state,action)=>{
                state.submitting = false;
                state.error = action.payload
            })
            .addCase(fetchApplicationById.pending,(state,action)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationById.fulfilled,(state,action)=>{
                state.loading = false;
                state.currentApplication = action.payload?.data || null;
                state.error = null;
            })
            .addCase(fetchApplicationById.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyApplications.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled,(state,action)=>{
                console.log("fetchMyApplications.fulfilled - Raw action.payload:", action.payload);

                state.loading = false;
                // Check if the response indicates an error (defensive)
                if (action.payload?.success === false) {
                    console.error("Response has success:false", action.payload.error);
                    state.error = action.payload?.error || 'Failed to fetch applications';
                    state.myApplications = [];
                } else {
                    const applications = action.payload?.data || [];
                    console.log("Setting myApplications to:", applications);
                    console.log("Number of applications:", applications.length);
                    
                    state.myApplications = applications;
                    state.error = null;
                }
            })
            .addCase(fetchMyApplications.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })
            // Withdraw Application
            .addCase(withdrawApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload?.message || 'Application withdrawn successfully';
                
                // Update the application in the list
                const withdrawnApp = action.payload?.data;
                if (withdrawnApp) {
                    state.myApplications = state.myApplications.map(app =>
                        app.id === withdrawnApp.id ? withdrawnApp : app
                    );
                    
                    if (state.currentApplication?.id === withdrawnApp.id) {
                        state.currentApplication = withdrawnApp;
                    }
                }
                state.error = null;
            })
            .addCase(withdrawApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Check Application Exists
            .addCase(checkApplicationExists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkApplicationExists.fulfilled, (state, action) => {
                state.loading = false;
                state.applicationCheck = action.payload?.data || {
                    has_applied: false,
                    has_draft: false,
                    application: null,
                    draft: null,
                };
                state.error = null;
            })
            .addCase(checkApplicationExists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Job Applications (Recruiter)
            .addCase(fetchJobApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.jobApplications = action.payload?.data || [];
                state.error = null;
            })
            .addCase(fetchJobApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Application Statistics (Recruiter)
            .addCase(fetchApplicationStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload?.data || null;
                state.error = null;
            })
            .addCase(fetchApplicationStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update Application Status (Recruiter)
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload?.message || 'Application status updated';
                
                // Update the application in the list
                const updatedApp = action.payload?.data;
                if (updatedApp) {
                    state.jobApplications = state.jobApplications.map(app =>
                        app.id === updatedApp.id ? updatedApp : app
                    );
                }
                state.error = null;
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch application progress
            .addCase(fetchApplicationProgress.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationProgress.fulfilled, (state,action)=>{
                state.loading = false;
                state.applicationData = action.payload
                state.error = null
            })
            .addCase(fetchApplicationProgress.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export const {
    clearApplicationError,
    clearSuccessMessage,
    resetApplicationState,
    resetApplicationCheck } = applicationSlice.actions;
export default applicationSlice.reducer;