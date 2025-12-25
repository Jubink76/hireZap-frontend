import axiosInstance from "../axiosInstance";

const subscriptionPlanApi = {
    createSubscriptionPlan: (planData) => axiosInstance.post('/subscription/create/plan/', planData),
    fetchAllPlans:(userType=null)=>{
        const params = userType?{user_type:userType} :{};
        return axiosInstance.get('/subscription/plans/',{params});
    },
    fetchInactivePlans:(userType=null)=>{
        const params = userType?{user_type:userType}: {};
        return axiosInstance.get('/subscription/plans/inactive/',{params})
    },
    updatePlan:(planId,planData) => axiosInstance.put(`/subscription/plans/${planId}/update/`,planData),
    deletePlan:(planId) => axiosInstance.delete(`/subscription/plans/${planId}/delete/`),
    reactivatePlan:(planId) => axiosInstance.patch(`/subscription/plans/${planId}/reactivate/`),
}
export default  subscriptionPlanApi;