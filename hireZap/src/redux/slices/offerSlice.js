import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import offerService from "../../services/offerService";
import { getFriendlyError } from "../../utils/errorHandler";

export const fetchRankedCandidates = createAsyncThunk(
    'offer/fetchRankedCandidates',
    async (jobId, thunkAPI) => {
        try {
            const res = await offerService.getRankedCandidates(jobId);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(getFriendlyError(err, 'Failed to fetch offer candidates'));
        }
    }
);

export const fetchOfferByApplication = createAsyncThunk(
    'offer/fetchOfferByApplication',
    async (applicationId, thunkAPI) => {
        try {
            const res = await offerService.getOfferByApplication(applicationId);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(getFriendlyError(err, 'Failed to fetch offer details'));
        }
    }
);

export const sendOffer = createAsyncThunk(
    'offer/sendOffer',
    async ({ applicationId, offerData }, thunkAPI) => {
        try {
            const res = await offerService.sendOffer(applicationId, offerData);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(getFriendlyError(err, 'Failed to send offer'));
        }
    }
);

export const bulkSendOffer = createAsyncThunk(
    'offer/bulkSendOffer',
    async ({ jobId, payload }, thunkAPI) => {
        try {
            const res = await offerService.bulkSendOffer(jobId, payload);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(getFriendlyError(err, 'Failed to bulk send offers'));
        }
    }
);

export const respondToOffer = createAsyncThunk(
    'offer/respondToOffer',
    async ({ offerId, responseData }, thunkAPI) => {
        try {
            const res = await offerService.respondToOffer(offerId, responseData);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(getFriendlyError(err, 'Failed to respond to offer'));
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
    candidates: [],          
    candidatesLoading: false,
    total: 0,

    selectedCandidates: [],  

    currentOffer: null,    
    offerLoading: false,

    loading: false,
    error: null,
    successMessage: null,
};

const offerSlice = createSlice({
    name: 'offer',
    initialState,
    reducers: {
        toggleCandidateSelection: (state, action) => {
            const id = action.payload;
            if (state.selectedCandidates.includes(id)) {
                state.selectedCandidates = state.selectedCandidates.filter(c => c !== id);
            } else {
                state.selectedCandidates.push(id);
            }
        },
        clearSelectedCandidates: (state) => {
            state.selectedCandidates = [];
        },
        selectAllCandidates: (state, action) => {
            state.selectedCandidates = action.payload; // array of application_ids
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        // Optimistic update when offer is sent for a single candidate
        updateCandidateOfferStatus: (state, action) => {
            const { applicationId, offerStatus, offerId } = action.payload;
            const idx = state.candidates.findIndex(c => c.application_id === applicationId);
            if (idx !== -1) {
                state.candidates[idx].offer_status = offerStatus;
                state.candidates[idx].offer_id = offerId;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchRankedCandidates
            .addCase(fetchRankedCandidates.pending, (state) => {
                state.candidatesLoading = true;
                state.error = null;
            })
            .addCase(fetchRankedCandidates.fulfilled, (state, action) => {
                state.candidatesLoading = false;
                state.candidates = action.payload.candidates || [];
                state.total = action.payload.total || 0;
            })
            .addCase(fetchRankedCandidates.rejected, (state, action) => {
                state.candidatesLoading = false;
                state.error = action.payload;
            })

            // fetchOfferByApplication
            .addCase(fetchOfferByApplication.pending, (state) => {
                state.offerLoading = true;
            })
            .addCase(fetchOfferByApplication.fulfilled, (state, action) => {
                state.offerLoading = false;
                state.currentOffer = action.payload?.offer ?? action.payload ?? null;
            })
            .addCase(fetchOfferByApplication.rejected, (state, action) => {
                state.offerLoading = false;
                state.error = action.payload;
            })

            // sendOffer
            .addCase(sendOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Offer sent successfully!';
                // Update the candidate's offer_status in the list
                const offer = action.payload.offer;
                if (offer) {
                    const idx = state.candidates.findIndex(
                        c => c.application_id === offer.application_id
                    );
                    if (idx !== -1) {
                        state.candidates[idx].offer_status = offer.status;
                        state.candidates[idx].offer_id = offer.id;
                    }
                }
            })
            .addCase(sendOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // bulkSendOffer
            .addCase(bulkSendOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bulkSendOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCandidates = [];
                state.successMessage = `Offers sent to ${action.payload.sent_count} candidate(s)`;
            })
            .addCase(bulkSendOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // respondToOffer
            .addCase(respondToOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(respondToOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Response recorded successfully';
                const offer = action.payload.offer;
                if (offer) {
                    const idx = state.candidates.findIndex(
                        c => c.application_id === offer.application_id
                    );
                    if (idx !== -1) {
                        state.candidates[idx].offer_status = offer.status;
                        state.candidates[idx].application_status =
                            offer.status === 'accepted' ? 'hired' : 'rejected';
                    }
                }
            })
            .addCase(respondToOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    toggleCandidateSelection,
    clearSelectedCandidates,
    selectAllCandidates,
    clearError,
    clearSuccessMessage,
    updateCandidateOfferStatus,
} = offerSlice.actions;

export default offerSlice.reducer;