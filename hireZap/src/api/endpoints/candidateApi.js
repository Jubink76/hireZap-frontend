import axiosInstance from "../axiosInstance";

const candidateApi = {
    getProfile : () => axiosInstance.get("canidate/get_profile/"),
}