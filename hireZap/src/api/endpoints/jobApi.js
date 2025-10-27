import axiosInstance from "../axiosInstance";

const jobApi = {
    createJob  : (data) => axiosInstance.post('/job/create-job/',data),
}
export default jobApi;