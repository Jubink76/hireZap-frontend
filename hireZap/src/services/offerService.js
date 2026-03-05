import offerApi from "../api/endpoints/offerApi";

const offerService = {
    getRankedCandidates: async (jobId) => {
        const res = await offerApi.getRankedCandidates(jobId);
        return res;
    },

    getOfferByApplication: async (applicationId) => {
        const res = await offerApi.getOfferByApplication(applicationId);
        return res;
    },

    sendOffer: async (applicationId, offerData) => {
        const res = await offerApi.sendOffer(applicationId, offerData);
        return res;
    },

    bulkSendOffer: async (jobId, payload) => {
        const res = await offerApi.bulkSendOffer(jobId, payload);
        return res;
    },

    respondToOffer: async (offerId, responseData) => {
        const res = await offerApi.respondToOffer(offerId, responseData);
        return res;
    },
};

export default offerService;