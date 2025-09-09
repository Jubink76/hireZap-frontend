import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { notify } from "../../utils/toast";

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
        notify.success("Login Successful");
        return res.user;
    }catch(err){
        notify.error(err.message || "Login Failed");
        return thunkAPI.rejectWithValue(err.message)
    }
});

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await authService.register(data);
      return {
        email: data.email,
        message: res.message,
      };
    } catch (err) {
        console.error("Register API error:", err.response?.data || err.message);
        const message =
            err.response?.data?.message ||
            err.response?.data?.detail ||
            err.message ||
            "Registration failed";
        notify.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// complete registration thunk
export const completeRegistration = createAsyncThunk("auth/registerOtp", async(data, thunkAPI)=>{
    try{
        const res = await authService.registerOtp(data);
        notify.success("Registration successfull");
        return res;
    }catch(err){
        const message = 
        err.response?.data?.detail || 
        err.message || 
        "Registration Failed";
        notify.error(message)
        return thunkAPI.rejectWithValue(message)
    }
});


// Logout thunk
export const logoutUser = createAsyncThunk("auth/logout", async(_, thunkAPI) => {
    try{
        await authService.logout()
        notify.success("Logout successful");
    }catch(err){
        notify.error("Logout Failed");
        return thunkAPI.rejectWithValue(err.message);
    }
})

// resend otp thunk
export const resendOtp = createAsyncThunk("auth/resend_otp",async(data, thunkAPI)=>{
    try{
        const res = await authService.resendOtp(data);
        notify.success(res?.message || "OTP resent successfully")
        return res;
    }catch(err){
        const message =
        err.response?.data?.message || 
        err.response?.data?.detail ||
        err.message || 
        "Resend OTP failed!!"
        notify.error(message)
        return thunkAPI.rejectWithValue(message);
    }
});

// verify email for forgot password
export const forgotPassword = createAsyncThunk("auth/forgot_password", async(data, thunkAPI) =>{
    try{
        const res = await authService.forgotPassword(data);
        notify.success(res?.message || "Email verified")
        return res;
    }catch(err){
        const message = 
        err.response?.data?.message || 
        err.response?.data?.detail || 
        err.message || 
        "Invalid Email Id"
        notify.error(message)
        return thunkAPI.rejectWithValue(message)
    }
});

// verify otp for general purpose
export const verifyOtp = createAsyncThunk("auth/verify_otp",async(data,thunkApi)=>{
    try{
        const res = await authService.verifyOtp(data);
        console.log(res)
        if(res.verified){
            notify.success("Otp verification successful");
        }else{
            notify.error("Invalid OTP or expired")
            return thunkApi.rejectWithValue("Invalid OTP or expired ") 
        }
        return res;
    }catch(err){
        const message =
        err.response?.detail || 
        err.message ||
        "verification failed!!"
        notify.error(message)
        return thunkApi.rejectWithValue(message);
    }
});

// reset password thunk
export const resetPassword = createAsyncThunk("auth/reset_password", async(data,thunkAPI)=>{
    try{
        const res = await authService.ResetPassword(data);
        notify.success(res?.message || "Reset password successful!")
        return res
    }catch(err){
        const message = 
        err.response?.data?.message || 
        err.response?.data?.detail || 
        err.message || 
        "Reset password failed!!"
        notify.error(message)
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    user: null,
    token: null,
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
            });
    }
});

export const  {logout} = authSlice.actions;
export default authSlice.reducer;