import companyApi from "../api/endpoints/companyApi";

const companyService = {
    async createCompany(data){
        const res = await companyApi.createCompany(data)
        return res.data
    },
    async fetchCompany(){
        const res = await companyApi.fetchCompany()
        return res.data
    },
    async fetchPendingCompanies(){
        const res = await companyApi.fetchPendingCompanies()
        return res
    },
}
export default companyService;