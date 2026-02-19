// services/cloudinaryService.js
import axiosInstance from "../api/axiosInstance";

const cloudinaryService = {
  uploadFile: async (file, folder = 'profiles', resourceType = 'image') => {
    try {
      console.log(' Requesting signature from Django...');
      
      // Since axiosInstance returns response.data directly, we don't destructure
      const data = await axiosInstance.get('/auth/cloudinary/get-signature/', {
        params: {
          folder,
          resource_type: resourceType
        },
        withCredentials: true,
      });

      console.log(' Signature received:', data);

      if (!data || !data.signature) {
        throw new Error('Invalid signature response from server');
      }

      const { signature, timestamp, cloud_name, api_key } = data;

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', api_key);
      formData.append('folder', folder);

      console.log(' Uploading to Cloudinary...');
      
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      }

      const result = await uploadResponse.json();
      console.log(' Cloudinary upload complete:', result.secure_url);
      
      return result.secure_url;
    } catch (error) {
      console.error(' Cloudinary service error:', error);
      throw error;
    }
  },
};

export default cloudinaryService;