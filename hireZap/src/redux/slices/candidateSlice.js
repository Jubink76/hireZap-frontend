import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendlyError } from "../../utils/errorHandler";
import candidateService from "../../services/candidateService";

// Fetch complete profile (profile + education + experience + skills + certifications)
export const fetchCompleteProfile = createAsyncThunk(
    'candidate/fetchCompleteProfile',
    async (_, thunkAPI) => {
        try {
            const res = await candidateService.getCompleteProfile();
            console.log("Complete profile data:", res);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to fetch profile');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Update profile
export const updateProfile = createAsyncThunk(
    'candidate/updateProfile',
    async (profileData, thunkAPI) => {
        try {
            const res = await candidateService.updateProfile(profileData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to update profile');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Add skill
export const addSkill = createAsyncThunk(
    'candidate/addSkill',
    async (skillData, thunkAPI) => {
        try {
            const res = await candidateService.addSkill(skillData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to add skill');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Delete skill
export const deleteSkill = createAsyncThunk(
    'candidate/deleteSkill',
    async (skillId, thunkAPI) => {
        try {
            const res = await candidateService.deleteSkill(skillId);
            return { skillId, ...res };
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to delete skill');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Add education
export const addEducation = createAsyncThunk(
    'candidate/addEducation',
    async (educationData, thunkAPI) => {
        try {
            const res = await candidateService.addEducation(educationData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to add education');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Delete education
export const deleteEducation = createAsyncThunk(
    'candidate/deleteEducation',
    async (educationId, thunkAPI) => {
        try {
            const res = await candidateService.deleteEducation(educationId);
            return { educationId, ...res };
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to delete education');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Add experience
export const addExperience = createAsyncThunk(
    'candidate/addExperience',
    async (experienceData, thunkAPI) => {
        try {
            const res = await candidateService.addExperience(experienceData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to add experience');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Delete experience
export const deleteExperience = createAsyncThunk(
    'candidate/deleteExperience',
    async (experienceId, thunkAPI) => {
        try {
            const res = await candidateService.deleteExperience(experienceId);
            return { experienceId, ...res };
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to delete experience');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Add certification
export const addCertification = createAsyncThunk(
    'candidate/addCertification',
    async (certificationData, thunkAPI) => {
        try {
            const res = await candidateService.addCertification(certificationData);
            return res;
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to add certification');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

// Delete certification
export const deleteCertification = createAsyncThunk(
    'candidate/deleteCertification',
    async (certificationId, thunkAPI) => {
        try {
            const res = await candidateService.deleteCertification(certificationId);
            return { certificationId, ...res };
        } catch (err) {
            const friendly = getFriendlyError(err, 'Failed to delete certification');
            return thunkAPI.rejectWithValue(friendly);
        }
    }
);

const initialState = {
    profile: null,
    educations: [],
    experiences: [],
    skills: [],
    certifications: [],
    stats: null,
    loading: false,
    error: null,
    profileLoaded: false,
};

const candidateSlice = createSlice({
    name: 'candidate',
    initialState,
    reducers: {
        clearCandidateError: (state) => {
            state.error = null;
        },
        resetCandidateState: (state) => {
            state.profile = null;
            state.educations = [];
            state.experiences = [];
            state.skills = [];
            state.certifications = [];
            state.stats = null;
            state.loading = false;
            state.error = null;
            state.profileLoaded = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch complete profile
            .addCase(fetchCompleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompleteProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.profile || null;
                state.educations = action.payload.educations || [];
                state.experiences = action.payload.experiences || [];
                state.skills = action.payload.skills || [];
                state.certifications = action.payload.certifications || [];
                state.stats = action.payload.stats || null;
                state.profileLoaded = true;
                state.error = null;
            })
            .addCase(fetchCompleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.profileLoaded = false;
            })
            
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.profile || state.profile;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add skill
            .addCase(addSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSkill.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.skill) {
                    state.skills.push(action.payload.skill);
                }
                state.error = null;
            })
            .addCase(addSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete skill
            .addCase(deleteSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = state.skills.filter(
                    skill => skill.id !== action.payload.skillId
                );
                state.error = null;
            })
            .addCase(deleteSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add education
            .addCase(addEducation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEducation.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.education) {
                    state.educations.push(action.payload.education);
                }
                state.error = null;
            })
            .addCase(addEducation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete education
            .addCase(deleteEducation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEducation.fulfilled, (state, action) => {
                state.loading = false;
                state.educations = state.educations.filter(
                    edu => edu.id !== action.payload.educationId
                );
                state.error = null;
            })
            .addCase(deleteEducation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add experience
            .addCase(addExperience.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExperience.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.experience) {
                    state.experiences.push(action.payload.experience);
                }
                state.error = null;
            })
            .addCase(addExperience.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete experience
            .addCase(deleteExperience.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExperience.fulfilled, (state, action) => {
                state.loading = false;
                state.experiences = state.experiences.filter(
                    exp => exp.id !== action.payload.experienceId
                );
                state.error = null;
            })
            .addCase(deleteExperience.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add certification
            .addCase(addCertification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCertification.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.certification) {
                    state.certifications.push(action.payload.certification);
                }
                state.error = null;
            })
            .addCase(addCertification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete certification
            .addCase(deleteCertification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCertification.fulfilled, (state, action) => {
                state.loading = false;
                state.certifications = state.certifications.filter(
                    cert => cert.id !== action.payload.certificationId
                );
                state.error = null;
            })
            .addCase(deleteCertification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCandidateError, resetCandidateState } = candidateSlice.actions;
export default candidateSlice.reducer;