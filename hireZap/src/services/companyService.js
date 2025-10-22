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
    async fetchCompanyById(companyId){
        const res = await companyApi.fetchCompanyById(companyId)
        return res
    },
    async approveCompany(companyId){
        const res = await companyApi.approveCompany(companyId)
        return res
    },
    async rejectCompany(companyId){
        const res = await companyApi.rejectCompany(companyId)
        return res
    }
}
export default companyService;