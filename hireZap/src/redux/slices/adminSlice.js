import adminService from "../../services/adminService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";

// Dashboard
export const fetchDashboardStats = createAsyncThunk('admin/dashboard-stats',async(_,thunkAPI) =>{
    try{
        const res = await adminService.getDashboardStats();
        return res
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to fetch dashboard stats')
        return thunkAPI.rejectWithValue(friendly)
    }
});

// Candidate
export const fetchAllCandidates = createAsyncThunk(
    'admin/candidates/fetch-all',
    async({page=1, pageSize=10, filters={}},thunkAPI)=>{
        try{
            const res = await adminService.getAllCandidates(page,pageSize,filters);
            return res
        }catch(err){
            const friendly = getFriendlyError(err, 'Failed to fetch candidates');
            return thunkAPI.rejectWithValue(friendly)
        }
    });

// Recruiters
export const fetchAllRecruiters = createAsyncThunk(
    'admin/recruiters/fetch-all',
    async ({ page = 1, pageSize = 10 }, thunkAPI) => {
        try {
            const res = await adminService.getAllRecruiters(page, pageSize);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to fetch recruiters');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

const initialState = {
    dashboardStats : null,
    //candidates
    candidates : [],
    candidatesPagination: null,
    selectedCandidate: null,
    searchResults: [],
    //recruiter
    recruiters:[],
    recruitersPagination: null,
    selectedRecruiter: null,
    // Jobs
    jobs: [],
    jobPagination: null,
    selectedJob: null,
    //applications
    applications: [],
    applicationPagination: null,
    selectedApplication: null,

    // loading states
    loading: false,
    dashboardLoading: false,
    candidatesLoading: false,
    recruitersLoading: false,
    jobsLoading: false,
    applicationLoading: false,

    //error states
    error: null,
    dashboardError: null,
    candidatesError: null,
    recruitersError: null,
    jobsError: null,
    applicationError: null,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers:{
        clearAdminError:(state)=>{
            state.error = null;
            state.dashboardError = null;
            state.candidatesError = null;
            state.recruitersError = null;
            state.jobsError = null;
            state.applicationError = null;
        },
        clearSelectedCandidate: (state) =>{
            state.selectedCandidate = null;
        },
        clearSelectedRecruiter: (state) => {
            state.selectedRecruiter = null;
        },
        clearSelectedJob: (state) => {
            state.selectedJob = null;
        },
        clearSelectedApplication: (state) => {
            state.selectedApplication = null;
        },
        resetAdminState: (state) => {
            return initialState;
        },
    },
    extraReducers:(builder) =>{
        builder
        .addCase(fetchDashboardStats.pending, (state)=>{
            state.dashboardLoading = true;
            state.dashboardError = null;
        })
        .addCase(fetchDashboardStats.fulfilled, (state, action) => {
            state.dashboardLoading = false;
            state.dashboardStats = action.payload.data;
            state.dashboardError = null;
        })
        .addCase(fetchDashboardStats.rejected, (state, action) => {
            state.dashboardLoading = false;
            state.dashboardError = action.payload;
        })

        // candidate
        .addCase(fetchAllCandidates.pending, (state) => {
            state.candidatesLoading = true;
            state.candidatesError = null;
        })
        .addCase(fetchAllCandidates.fulfilled, (state, action) => {
            state.candidatesLoading = false;
            state.candidates = action.payload.data || [];
            state.candidatespagination = action.payload.pagination || null;
            state.candidatesError = null;
        })
        .addCase(fetchAllCandidates.rejected, (state, action) => {
            state.candidatesLoading = false;
            state.candidatesError = action.payload;
        })
        .addCase(fetchAllRecruiters.pending, (state) => {
            state.recruitersLoading = true;
            state.recruitersError = null;
        })
        .addCase(fetchAllRecruiters.fulfilled, (state, action) => {
            state.recruitersLoading = false;
            state.recruiters = action.payload.data || [];
            state.recruitersPagination = action.payload.pagination || null;
            state.recruitersError = null;
        })
        .addCase(fetchAllRecruiters.rejected, (state, action) => {
            state.recruitersLoading = false;
            state.recruitersError = action.payload;
        })
    }
})

export const {
    clearAdminError,
    clearSelectedCandidate,
    clearSelectedRecruiter,
    clearSelectedJob,
    clearSelectedApplication,
    resetAdminState
} = adminSlice.actions;
export default adminSlice.reducer;