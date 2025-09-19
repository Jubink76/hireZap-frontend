import axiosInstance from "../axiosInstance";

const authApi = {
    csrf_cookie: () => axiosInstance.get("/auth/csrf-cookie/"),
    register: (data) => axiosInstance.post("/auth/register/", data),
    resend_otp: (data) => axiosInstance.post("/auth/resend-otp/", data),
    register_otp:(data) => axiosInstance.post("/auth/register-otp/",data),
    verify_otp:(data) => axiosInstance.post("/auth/verify-otp/",data),
    login : (data) => axiosInstance.post("/auth/login/", data),
    logout : () => axiosInstance.post("/auth/logout/"),
    forgot_password: (data) => axiosInstance.post("/auth/forgot-password/",data),
    reset_password: (data) => axiosInstance.post("/auth/reset-password/",data),
    fetch_user: ()=> axiosInstance.get("/auth/fetch-user/"),
    refreshToken : () => axiosInstance.post("/auth/token/refresh/"),
    googleLogin: ({id_token, role}) => axiosInstance.post("/auth/google/", { id_token, role }),
    githubLogin: ({code, role}) => axiosInstance.post("/auth/github/",{code, role}),
}

export default authApi;