import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { notify } from "../../utils/toast";
import { getFriendlyError } from "../../utils/errorHandler";

// csrf-cookie thunk
export const getCsrfCookie = createAsyncThunk("auth/csrf_cookie", async(_,thunkAPI)=>{
    try{
        await authService.csrf_cookie()
        return
    }catch(err){
        console.error("CSRF cookie error", err);
        return thunkAPI.rejectWithValue(err.message)
    }
})
// Login thunk
export const loginUser = createAsyncThunk("auth/login", async(data, thunkAPI)=>{
    try{
        const res = await authService.login(data);
        return res.user;
    }catch(err){
        const friendly = getFriendlyError(err, "invalid email or password")
        return thunkAPI.rejectWithValue(friendly)
    }
});

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await authService.register(data);
      console.log(res)
      return {
        email: data.email,
        message: res.message,
      };
    } catch (err) {
        console.error("Register API error:", err.response?.data || err.message);
        const friendly = getFriendlyError(err, "Registration failed.. Try again")
      return thunkAPI.rejectWithValue(friendly);
    }
  }
);

// complete registration thunk
export const completeRegistration = createAsyncThunk("auth/registerOtp", async(data, thunkAPI)=>{
    try{
        const res = await authService.registerOtp(data);
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,"Registration Failed")
        return thunkAPI.rejectWithValue(friendly)
    }
});


// Logout thunk
export const logoutUser = createAsyncThunk("auth/logout", async(_, thunkAPI) => {
    try{
        const res = await authService.logout()
        thunkAPI.dispatch(logout()) // It clear redux state immediately after successfull logout, no need extra reducer
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Logout failed")
        return thunkAPI.rejectWithValue(friendly);
    }
})

// resend otp thunk
export const resendOtp = createAsyncThunk("auth/resend_otp",async(data, thunkAPI)=>{
    try{
        const res = await authService.resendOtp(data);
        return res;
    }catch(err){
        const friendly = getFriendlyError(err, "Resend OTP failed")
        return thunkAPI.rejectWithValue(friendly);
    }
});

// verify email for forgot password
export const forgotPassword = createAsyncThunk("auth/forgot_password", async(data, thunkAPI) =>{
    try{
        const res = await authService.forgotPassword(data);
        notify.success(res?.message || "Email verified")
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,"Email is not registered")
        notify.error(friendly)
        return thunkAPI.rejectWithValue(friendly)   
    }
});

// verify otp for general purpose
export const verifyOtp = createAsyncThunk("auth/verify_otp",async(data,thunkApi)=>{
    try{
        const res = await authService.verifyOtp(data);
        return res;
    }catch(err){
        const friendly = getFriendlyError(err,"Verification failed")
        return thunkApi.rejectWithValue(friendly);
    }
});

// reset password thunk
export const resetPassword = createAsyncThunk("auth/reset_password", async(data,thunkAPI)=>{
    try{
        const res = await authService.ResetPassword(data);
        return res
    }catch(err){
        const friendly = getFriendlyError(err,"Password reset failed")
        return thunkAPI.rejectWithValue(friendly)
    }
})

// fetch current user thunk
export const fetchCurrentUser = createAsyncThunk("auth/current_user", async(_,thunkAPI)=>{
    try{
        const res = await authService.fetchUser();
        return res.data;
    }catch(err){
        const message = 
            err.response?.data?.message ||
            err.response?.data?.detail || 
            err.message || 
            "Failed to fetch user !!"
            notify.error(message)
            return thunkAPI.rejectWithValue(message)
    }
})


// Social login thunk - Google
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ id_token, role }, thunkAPI) => {
    try {
      const data = await authService.googleLogin({ id_token, role });
      notify.success("Google login successful");
      return data;
    } catch (err) {
      const friendly = getFriendlyError(err, "Google login failed");
      return thunkAPI.rejectWithValue(friendly);
    }
  }
);


const initialState = {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
    lastOtp: null,
    forgotPasswordMessage: null,
    resetPasswordMessage: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout : (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false
        },
    },
    extraReducers : (builder) =>{
        builder
            .addCase(googleLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            })
            .addCase(googleLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })
            .addCase(loginUser.pending, (state)=> {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state,action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isAdmin = action.payload?.is_admin || false;
            })
            .addCase(loginUser.rejected, (state,action) => {
                state.loading = false,
                state.user = null,
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state,action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state,action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resendOtp.pending,(state)=>{
                state.loading = true;
            })
            .addCase(resendOtp.fulfilled,(state,action)=>{
                state.loading = false;
                state.lastOtp = action.payload?.message;
            })
            .addCase(resendOtp.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(completeRegistration.pending,(state)=>{
                state.loading = true;
            })
            .addCase(completeRegistration.fulfilled,(state,action)=>{
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isAdmin = action.payload?.is_admin || false
            })
            .addCase(completeRegistration.rejected,(state,action)=>{
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(forgotPassword.pending,(state)=>{
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled,(state,action)=>{
                state.loading = false;
                state.forgotPasswordMessage = action.payload?.message;
            })
            .addCase(forgotPassword.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(resetPassword.pending,(state)=>{
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled,(state,action)=>{
                state.loading = false;
                state.forgotPasswordMessage = action.payload?.message;
            })
            .addCase(resetPassword.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchCurrentUser.pending,(state)=>{
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled,(state,action)=>{
                state.loading = false;
                const apiUser = action.payload;
                state.role = apiUser.role;
                state.error = false;
                state.isAuthenticated = true;

                if (state.role === "candidate"){
                    state.user = {
                        name: apiUser.name,
                        email: apiUser.email,
                        phone: apiUser.phone,

                    }
                }else if(state.role === 'recruiter'){
                    state.user = {
                        name: apiUser.name,
                        email: apiUser.email,
                    }
                }
            })
            .addCase(fetchCurrentUser.rejected,(state, action)=>{
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false
            })
    }
});

export const  {logout, setUser} = authSlice.actions;
export default authSlice.reducer;