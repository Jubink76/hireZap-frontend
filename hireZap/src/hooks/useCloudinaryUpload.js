// hooks/useCloudinaryUpload.js
import { useState } from "react";
import cloudinaryService from "../services/cloudinaryService";

export default function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const uploadFile = async (file, folder = "profiles", resourceType = "image") => {
    if (!file) return null;
    try {
      setLoading(true);
      setError(null);
      const url = await cloudinaryService.uploadFile(file, folder, resourceType);
      setUploadedUrl(url);
      return url;
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error, uploadedUrl };
}
