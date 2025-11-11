import candidateApi from "../api/endpoints/candidateApi";
const candidateService = {
    // Profile methods
    async getCompleteProfile() {
        const res = await candidateApi.getCompleteProfile();
        return res;
    },
    
    async updateProfile(profileData) {
        const res = await candidateApi.updateProfile(profileData);
        return res;
    },
    
    // Skills methods
    async getSkills() {
        const res = await candidateApi.getSkills();
        return res;
    },
    
    async addSkill(skillData) {
        const res = await candidateApi.addSkill(skillData);
        return res;
    },
    
    async deleteSkill(skillId) {
        const res = await candidateApi.deleteSkill(skillId);
        return res;
    },
    
    // Education methods
    async getEducations() {
        const res = await candidateApi.getEducations();
        return res;
    },
    
    async addEducation(educationData) {
        const res = await candidateApi.addEducation(educationData);
        return res;
    },
    
    async deleteEducation(educationId) {
        const res = await candidateApi.deleteEducation(educationId);
        return res;
    },
    
    // Experience methods
    async getExperiences() {
        const res = await candidateApi.getExperiences();
        return res;
    },
    
    async addExperience(experienceData) {
        const res = await candidateApi.addExperience(experienceData);
        return res;
    },
    
    async deleteExperience(experienceId) {
        const res = await candidateApi.deleteExperience(experienceId);
        return res;
    },
    
    // Certification methods
    async getCertifications() {
        const res = await candidateApi.getCertifications();
        return res;
    },
    
    async addCertification(certificationData) {
        const res = await candidateApi.addCertification(certificationData);
        return res;
    },
    
    async deleteCertification(certificationId) {
        const res = await candidateApi.deleteCertification(certificationId);
        return res;
    }
};

export default candidateService;