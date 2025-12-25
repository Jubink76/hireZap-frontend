import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import subscriptionPlanService from "../../services/subscriptionPlanService";
import { act } from "react";


export const createSubscriptionPlan = createAsyncThunk('create/subscriptionPlan', async(planData, thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.createSubscriptionPlan(planData)
        return {
            data: res.data ?? res,
            message: res.message ?? 'Plan created successfully',
        };
    }catch(err){
        const friendly = getFriendlyError(err,'Failed to create subscription plan')
        return thunkAPI.rejectWithValue(friendly)
    }
});

export const fetchAllPlans = createAsyncThunk('fetchAll/plans', async(userType=null, thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.fetchAllPlans(userType)
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch subscription plans')
        return thunkAPI.rejectWithValue(friendly)
    }
});

export const fetchInactivePlans = createAsyncThunk('fetch/inactive/plans',async(userType=null,thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.fetchInactivePlans(userType)
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to fetch inactive plans')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const updatePlan = createAsyncThunk('update/plan',async({planId,planData}, thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.updatePlan({planId,planData})
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to update plans')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const deletePlan = createAsyncThunk('delete/plan',async(planId, thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.deletePlan(planId)
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to delete plan')
        return thunkAPI.rejectWithValue(friendly)
    }
})

export const reactivatePlan = createAsyncThunk('reactivate/plan', async(planId, thunkAPI)=>{
    try{
        const res = await subscriptionPlanService.reactivatePlan(planId)
        return res
    }catch(err){
        const friendly = getFriendlyError(err, 'Failed to reactivate plan')
        return thunkAPI.rejectWithValue(friendly);
    }
})
const initialState = {
    plans : [],
    recruiterPlans : [],
    candidatePlans : [],
    inactivePlans : [],
    selectedPlan : [],
    loading : false,
    error : null,
    successMessage : null
}
const subscriptionPlanSlice = createSlice({
    name:'subscriptionplan',
    initialState,
    reducers:{
        clearPlanError:(state) =>{
            state.error = null;
        },
        clearSuccessMessage:(state) =>{
            state.successMessage = null;
        },
        clearSelectedPlan:(state) =>{
            state.selectedPlan = null;
        },
        resetPlanState:(state)=>{
            return initialState 
        }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(createSubscriptionPlan.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(createSubscriptionPlan.fulfilled,(state,action)=>{
            state.loading = false;
            console.log("action.payload",action.payload);
            console.log("action.payload.data",action.payload.data);
            state.plans.push(action.payload.data);
            
            if (action.payload.data.userType == 'recruiter'){
                state.recruiterPlans.push(action.payload.data);
            }else{
                state.candidatePlans.push(action.payload.data);
            }
            state.successMessage = action.payload.message || 'Plan created successfully';
        })
        .addCase(createSubscriptionPlan.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        
        .addCase(fetchAllPlans.pending, (state)=>{
            state.loading = true;
            state.error = false;
        })
        .addCase(fetchAllPlans.fulfilled, (state,action)=>{
            state.loading = false;
            state.plans = action.payload.data || [];

            state.recruiterPlans = state.plans.filter(p => p.userType === 'recruiter');
            state.candidatePlans = state.plans.filter(p => p.userType === 'candidate');
            state.error = null;
        })
        .addCase(fetchAllPlans.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(fetchInactivePlans.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchInactivePlans.fulfilled,(state,action)=>{
            state.loading = false;
            state.inactivePlans = action.payload.data || []
            state.error = null;
        })
        .addCase(fetchInactivePlans.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(updatePlan.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePlan.fulfilled,(state,action)=>{
            state.loading = false;
            const updatedPlan = action.payload.data;
            
            // Update in main plans array
            const planIndex = state.plans.findIndex(p => p.id === updatedPlan.id);
            if (planIndex !== -1) {
                state.plans[planIndex] = updatedPlan;
            }
            
            // Update in filtered arrays
            state.recruiterPlans = state.plans.filter(p => p.userType === 'recruiter');
            state.candidatePlans = state.plans.filter(p => p.userType === 'candidate');
            
            state.successMessage = action.payload.message || 'Plan updated successfully';
        })
        .addCase(updatePlan.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload
        })

        .addCase(deletePlan.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(deletePlan.fulfilled,(state,action)=>{
            state.loading = false;
            const deletedPlanId = action.meta.arg; // This is the planId passed to thunk
            
            state.plans = state.plans.filter(p => p.id !== deletedPlanId);
            state.recruiterPlans = state.recruiterPlans.filter(p => p.id !== deletedPlanId);
            state.candidatePlans = state.candidatePlans.filter(p => p.id !== deletedPlanId);
            
            state.successMessage = action.payload.message || 'Plan deleted successfully';
        })
        .addCase(deletePlan.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(reactivatePlan.pending,(state)=>{
            state.loading = false;
            state.error = null;
        })
        .addCase(reactivatePlan.fulfilled,(state,action)=>{
            state.loading = false;
            const reactivatedPlan = action.payload.data;
            
            // Remove from inactive
            state.inactivePlans = state.inactivePlans.filter(p => p.id !== reactivatedPlan.id);
            
            // Add to active plans
            state.plans.push(reactivatedPlan);
            
            // Update filtered arrays
            if (reactivatedPlan.userType === 'recruiter') {
                state.recruiterPlans.push(reactivatedPlan);
            } else {
                state.candidatePlans.push(reactivatedPlan);
            }
            
            state.successMessage = action.payload.message || 'Plan reactivated successfully';
            state.error = null;
        })
        .addCase(reactivatePlan.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const {
    clearPlanError,
    clearSuccessMessage,
    resetPlanState,
    clearSelectedPlan
} = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;