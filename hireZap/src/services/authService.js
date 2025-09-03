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
}

export default authService;