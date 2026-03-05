import axiosInstance from "../axiosInstance";

const offerApi = {
    getRankedCandidates: async (jobId) => {
        const res = await axiosInstance.get(`/offer/jobs/${jobId}/offer-stage/`);
        return res;
    },

    getOfferByApplication: async (applicationId) => {
        const res = await axiosInstance.get(`/offer/applications/${applicationId}/offer/`);
        return res;
    },

    sendOffer: async (applicationId, offerData) => {
        const res = await axiosInstance.post(`/offer/applications/${applicationId}/offer/send/`, offerData);
        return res;
    },


    bulkSendOffer: async (jobId, payload) => {
        const res = await axiosInstance.post(`/offer/jobs/${jobId}/offer/bulk-send/`, payload);
        return res;
    },

    respondToOffer: async (offerId, responseData) => {
        const res = await axiosInstance.post(`/offer/${offerId}/respond/`, responseData);
        return res;
    },
};

export default offerApi;