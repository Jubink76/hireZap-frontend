import axiosInstance from "../api/axiosInstance";

const storageService = {
  /**
   * Upload any type of file
   * @param {File} file - The file to upload
   * @param {string} folder - Target folder (profiles, resumes, certificates)
   * @param {string} fileType - File type (image, resume, certificate)
   */
  uploadFile: async (file, folder = 'profiles', fileType = 'image') => {
    try {
      console.log(` Uploading ${fileType} to ${folder}...`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('file_type', fileType);
      
      const response = await axiosInstance.post('/auth/file/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log(' Upload complete:', response.url);
      return response.url;
      
    } catch (error) {
      console.error(' Upload error:', error);
      throw error;
    }
  },
  
  deleteFile: async (fileKey) => {
    try {
      await axiosInstance.post('/auth/delete-file/', { file_key: fileKey });
      return true;
    } catch (error) {
      console.error(' Delete error:', error);
      return false;
    }
  }
};

export default storageService;