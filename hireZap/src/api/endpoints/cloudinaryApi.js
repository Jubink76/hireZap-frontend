import axiosInstance from "../axiosInstance";

const cloudinaryApi = {
    getSignature: (folder) => axiosInstance.get("/auth/cloudinary/get-signature/",
        {    params: { folder } }),
};

export default cloudinaryApi;