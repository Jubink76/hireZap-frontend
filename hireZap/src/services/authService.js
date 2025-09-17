import authApi from "../api/endpoints/authApi";

const authService = {
    async register(data){
        const res = await authApi.register(data)
        return res
    },
    async login(data){
        return await authApi.login(data);
    },
    async logout(){
        const res = await authApi.logout()
    },
    async resendOtp(data){
        const res = await authApi.resend_otp(data);
        return res.data
    },
    async registerOtp(data){
        const res = await authApi.register_otp(data);
        return res.data
    },
    async verifyOtp(data){
        const res = await authApi.verify_otp(data);
        return res
    },
    async forgotPassword(data){
        const res = await authApi.forgot_password(data)
        return res
    },
    async ResetPassword(data){
        const res = await authApi.reset_password(data)
        return res
    },
    async csrf_cookie(){
        const res = await authApi.csrf_cookie();
        return res
    },
    async fetchUser(){
        const res = await authApi.fetch_user();
        return res
    },
    async googleLogin(token) {
        const res = await authApi.googleLogin(token);
        return res; 
    }
}

export default authService;