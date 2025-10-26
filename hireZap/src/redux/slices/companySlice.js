import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companyService from '../../services/companyService';
import { notify} from '../../utils/toast';
import { getFriendlyError } from '../../utils/errorHandler';

export const createCompany = createAsyncThunk('company/crreate', async(data, thunkAPI)=>{
    try{
        const res = await companyService.createCompany(data);
        notify.success(res?.success || 'Company created succesfully')
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Company creation failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch company by recruiter
export const fetchCompany = createAsyncThunk('company/fetch',async(_,thunkAPI)=>{
    try{
        const res = await companyService.fetchCompany();
        console.log("API returned company:", res);
        return res
    }catch(err){
        if (err.response?.status === 404) {
            return null;
        }
        const friendly = getFriendlyError(err, "Feching company details failed")
        return thunkAPI.rejectWithValue(friendly)
    };
});

// pending companies
export const fetchPendingCompanies = createAsyncThunk('company/fetchPending',async(_,thunkAPI)=>{
    try{
        const res = await companyService.fetchPendingCompanies();
        console.log("🎯 Thunk received from service:", res);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Pending companies fetching failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch company By id 
export const fetchCompanyById = createAsyncThunk('company/fetchCompany', async(companyId,thunkAPI)=>{
    try{
        const res = await companyService.fetchCompanyById(companyId);
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Fetching company detail failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// approve company
export const approveCompany = createAsyncThunk('company/approveComany', async(companyId,thunkAPI)=>{
    try{
        const res = await companyService.approveCompany(companyId)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Company verification failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// reject company

export const rejectCompany = createAsyncThunk('company/rejectCompany', async(companyId, thunkApI) => {
    try{
        const res = await companyService.rejectCompany(companyId)
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Reject company failed")
        return thunkApI.rejectWithValue(friendly)
    }
})

// fetch verified companies

export const fetchVerifiedCompanies = createAsyncThunk('company/verified-companies', async(_,thunkAPI)=>{
    try{
        const res = await companyService.fetchVerifiedCompanies()
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Fetch verified companies failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch rejected companies

export const fetchRejectedCompanies = createAsyncThunk('company/rejected-companies', async(_,thunkAPI)=>{
    try{
        const res = await companyService.fetchRejectedCompanies()
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Fetch rejected companies failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// update company details

export const updateCompany = createAsyncThunk('company/update-company', async({id,data},thunkAPI)=>{
    try{
        const res = await companyService.updateCompany({ companyId: id, data })
        return res
    }catch(err){
        const friendly = getFriendlyError(err, "Update company failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

const initialState = {
    company: null,
    pendingCompanies:[],
    verifiedCompanies:[],
    rejectedCompanies:[],
    selectedCompany : null,
    loading: false,
    error : null,
    hasCompany: false,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clearCompanyError: (state) => {
            state.error = null;
        },
        resetCompanyState: (state) =>{
            state.company = null;
            state.pendingCompanies = [];
            state.verifiedCompanies = [];
            state.rejectedCompanies = [];
            state.selectedCompany = null;
            state.loading = false;
            state.error = null;
            state.hasCompany = false;
        },
        updateCompanyStatus : (state,action) => {
            const {company, status, reason } = action.payload;

            if (state.company && state.company.id === company.id){
                state.company = {
                    ...state.company,
                    ...company,
                    verification_status: status,
                    rejection_reason: reason || null
                };
                state.hasCompany = status === 'verified' || status === 'pending';
            }
        },
        triggerCompanyRefresh: (state) =>{
            state.loading = true;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(createCompany.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(createCompany.fulfilled, (state,action)=>{
            state.loading = false;
            state.company = action.payload.company;
            state.hasCompany = true;
        })
        .addCase(createCompany.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchCompany.pending,(state)=>{
            state.loading = true
            state.error = null;
        })
        .addCase(fetchCompany.fulfilled,(state,action)=>{
            state.loading = false;
            if (action.payload === null) {
                state.company = null;
                state.hasCompany = false;
            } else {
                state.company = action.payload;
                state.hasCompany = true;
            }
        })
        .addCase(fetchCompany.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.hasCompany = false;
        })
        .addCase(fetchPendingCompanies.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPendingCompanies.fulfilled,(state,action)=>{
            state.loading = false;
            state.pendingCompanies = action.payload;
            state.error = null;
        })
        .addCase(fetchPendingCompanies.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload
        })
        .addCase(fetchCompanyById.pending,(state)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(fetchCompanyById.fulfilled,(state,action)=>{
            state.loading = false;
            state.selectedCompany = action.payload;
            state.error = null;
        })
        .addCase(fetchCompanyById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(approveCompany.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(approveCompany.fulfilled,(state,action)=>{
            state.loading = false;
            if (state.selectedCompany && state.selectedCompany.id === action.payload.company.id) {
                state.selectedCompany = action.payload.company;
            }
            state.pendingCompanies = state.pendingCompanies.filter(
                c => c.id !== action.payload.company.id
            );
            state.error = null;

        })
        .addCase(approveCompany.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(rejectCompany.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(rejectCompany.fulfilled,(state,action)=>{
            state.loading = false;
            if (state.selectedCompany && state.selectedCompany.id === action.payload.company.id) {
                state.selectedCompany = action.payload.company;
            }
            state.pendingCompanies = state.pendingCompanies.filter(
                c => c.id !== action.payload.company.id
            );
            state.error = null;
        })
        .addCase(rejectCompany.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchVerifiedCompanies.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchVerifiedCompanies.fulfilled,(state,action)=>{
            state.loading = false;
            state.verifiedCompanies = action.payload
            state.error = null;
        })
        .addCase(fetchVerifiedCompanies.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchRejectedCompanies.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchRejectedCompanies.fulfilled,(state,action)=>{
            state.loading = false;
            state.rejectedCompanies = action.payload;
            state.error = null;
        })
        .addCase(fetchRejectedCompanies.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateCompany.pending,(state,action)=>{
            state.loading = true;
            state.error = false;
        })
        .addCase(updateCompany.fulfilled,(state,action)=>{
            state.loading = false;
            state.company = action.payload
            state.hasCompany = true;
        })
        .addCase(updateCompany.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { clearCompanyError, resetCompanyState,updateCompanyStatus,triggerCompanyRefresh } = companySlice.actions;
export default companySlice.reducer;