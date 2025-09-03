import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { notify } from "../../utils/toast";

// Login thunk
export const loginUser = createAsyncThunk("auth/login", async(data, thunkAPI)=>{
    try{
        const res = await authService.login(data);
        notify.success("Login Successful");
        return res;
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

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
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
            });
    }
});

export const  {logout} = authSlice.actions;
export default authSlice.reducer;