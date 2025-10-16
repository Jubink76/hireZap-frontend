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

const initialState = {
    company: null,
    pendingCompanies:[],
    loading: false,
    error : null,
    hascompany: false,
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
            state.loading = false;
            state.error = null;
            state.hascompany = false;
        },
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
            state.hascompany = true;
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
            state.company = action.payload
            state.hascompany = true;
        })
        .addCase(fetchCompany.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.hascompany = false;
        })
        .addCase(fetchPendingCompanies.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPendingCompanies.fulfilled,(state,action)=>{
            state.loading = false;
            state.pendingCompanies = action.payload;
            console.log("📦 Payload type:", typeof action.payload);
            console.log("📦 Payload:", action.payload);
            console.log("📦 Is array?", Array.isArray(action.payload));
            state.error = null;
        })
        .addCase(fetchPendingCompanies.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload
        })

    }
})

export const { clearCompanyError, resetCompanyState } = companySlice.actions;
export default companySlice.reducer;