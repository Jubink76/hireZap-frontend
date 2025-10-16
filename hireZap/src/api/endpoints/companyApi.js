import { fetchCompany } from '../../redux/slices/companySlice';
import axiosInstance from '../axiosInstance';

const companyApi = {
    createCompany : (data) => axiosInstance.post('/company/create-company/',data),
    fetchCompany : () => axiosInstance.get('/company/details/'),
    fetchPendingCompanies :() => axiosInstance.get('/company/pending-companies/'),
}
export default companyApi