import authApi from "../api/endpoints/authApi";

const authService = {
    async register(data){
        const res = await authApi.register(data)
        return res
    },
    async login(data){
        const res = await authApi.login(data)
        return res.data.user;
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
        return res.data
    },
    async csrf_cookie(){
        const res = await authApi.csrf_cookie();
        return res
    }
}

export default authService;