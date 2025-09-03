import axiosInstance from "../axiosInstance";

const authApi = {
    register: (data) => axiosInstance.post("/auth/register/", data),
    login : (data) => axiosInstance.post("/auth/login/", data),
    logout : () => axiosInstance.post("/auth/logout/"),
    refreshToken : () => axiosInstance.post("/auth/token/refresh/")
}

export default authApi;