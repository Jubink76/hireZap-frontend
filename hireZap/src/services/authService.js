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
        return res
    },
    async registerOtp(data){
        const res = await authApi.register_otp(data);
        return res
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
    async googleLogin({id_token,role}) {
        const res = await authApi.googleLogin({id_token,role});
        return res; 
    },
    async githubLogin({code, role}){
        const res = await authApi.githubLogin({code, role});
        return res;
    },
    async updateProfile(profileData) {
        const res = await authApi.updateProfile(profileData);
        return res;
    },

}

export default authService;