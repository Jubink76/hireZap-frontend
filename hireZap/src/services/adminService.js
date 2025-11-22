import adminApi from "../api/endpoints/adminApi";

const adminService = {
    async getDashboardStats() {
        const res = await adminApi.getDashboardStats();
        return res;
    },
    async getAllCandidates(page=1,pageSize=10,filters={}){
        const params = {page,page_size:pageSize,...filters};
        const res = await adminApi.getAllCandidates(params);
        return res;
    },
    async getAllRecruiters(page=1,pageSize=10){
        const params = {page,page_size:pageSize};
        const res = await adminApi.getAllRecruiters(params);
        return res;
    }

}
export default adminService;