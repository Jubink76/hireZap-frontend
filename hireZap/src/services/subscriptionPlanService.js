import subscriptionPlanApi from "../api/endpoints/subscriptionPlanApi";

const subscriptionPlanService = {
    async createSubscriptionPlan(planData){
        const response = await subscriptionPlanApi.createSubscriptionPlan(planData);
        return response;
    },
    async fetchAllPlans(userType = null){
        const response = await subscriptionPlanApi.fetchAllPlans(userType);
        return response
    },
    async fetchInactivePlans(userType = null){
        const response = await subscriptionPlanApi.fetchInactivePlans(userType);
        return response
    },
    async updatePlan({planId, planData}){
        const response = await subscriptionPlanApi.updatePlan(planId, planData);
        return response
    },
    async deletePlan(planId){
        const response = await subscriptionPlanApi.deletePlan(planId);
        return response
    },
    async reactivatePlan(planId){
        const response = await subscriptionPlanApi.reactivatePlan(planId);
        return response
    }
}
export default subscriptionPlanService;