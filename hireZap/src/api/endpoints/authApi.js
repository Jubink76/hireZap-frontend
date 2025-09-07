import axiosInstance from "../axiosInstance";

const authApi = {
    csrf_cookie: () => axiosInstance.get("/auth/csrf_cookie/"),
    register: (data) => axiosInstance.post("/auth/register/", data),
    resend_otp: (data) => axiosInstance.post("/auth/resend_otp/", data),
    register_otp:(data) => axiosInstance.post("/auth/register_otp/",data),
    verify_otp:(data) => axiosInstance.post("/auth/verify_otp/",data),
    login : (data) => axiosInstance.post("/auth/login/", data),
    logout : () => axiosInstance.post("/auth/logout/"),
    refreshToken : () => axiosInstance.post("/auth/token/refresh/")
}

export default authApi;