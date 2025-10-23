import { fetchCompany } from '../../redux/slices/companySlice';
import axiosInstance from '../axiosInstance';

const companyApi = {
    createCompany : (data) => axiosInstance.post('/company/create-company/',data),
    fetchCompany : () => axiosInstance.get('/company/details/'),
    fetchPendingCompanies :() => axiosInstance.get('/company/pending-companies/'),
    fetchCompanyById : (companyId) => axiosInstance.get(`/company/fetch-company/${companyId}`),
    approveCompany : (companyId) => axiosInstance.post(`/company/approve-company/${companyId}/`),
    rejectCompany : (companyId) => axiosInstance.post(`/company/reject-company/${companyId}/`),
    fetchVerifiedCompanies : () => axiosInstance.get('/company/verified-companies/'),
    fetchRejectedCompanies : () => axiosInstance.get('/company/rejected-companies/'),
}
export default companyApi