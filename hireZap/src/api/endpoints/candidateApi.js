import axiosInstance from "../axiosInstance";

const candidateApi = {
    // Profile operations
    getCompleteProfile: () => axiosInstance.get('/candidate/profile/'),
    updateProfile: (data) => axiosInstance.patch('/candidate/profile/', data),
    
    // Skills operations
    getSkills: () => axiosInstance.get('/candidate/skills/'),
    addSkill: (data) => axiosInstance.post('/candidate/skills/', data),
    deleteSkill: (skillId) => axiosInstance.delete(`/candidate/skills/${skillId}/`),
    
    // Education operations
    getEducations: () => axiosInstance.get('/candidate/educations/'),
    addEducation: (data) => axiosInstance.post('/candidate/educations/', data),
    deleteEducation: (educationId) => axiosInstance.delete(`/candidate/educations/${educationId}/`),
    
    // Experience operations
    getExperiences: () => axiosInstance.get('/candidate/experiences/'),
    addExperience: (data) => axiosInstance.post('/candidate/experiences/', data),
    deleteExperience: (experienceId) => axiosInstance.delete(`/candidate/experiences/${experienceId}/`),
    
    // Certification operations
    getCertifications: () => axiosInstance.get('/candidate/certifications/'),
    addCertification: (data) => axiosInstance.post('/candidate/certifications/', data),
    deleteCertification: (certificationId) => axiosInstance.delete(`/candidate/certifications/${certificationId}/`),
};
export default candidateApi;