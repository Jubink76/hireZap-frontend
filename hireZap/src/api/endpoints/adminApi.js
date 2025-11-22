import axiosInstance from "../axiosInstance"

const adminApi = {
    getDashboardStats: () => axiosInstance.get('/admin/dashboard/'),

    getAllCandidates : (params) => axiosInstance.get('/admin/candidates/',{params}),

    getAllRecruiters : (params) => axiosInstance.get('/admin/recruiters/',{params}),
    
}

export default adminApi;