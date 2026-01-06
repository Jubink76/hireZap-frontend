import storageService from "../services/storageService";
import { useState } from "react";

export default function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const uploadFile = async (file, folder = "profiles", fileType = "image") => {
    if (!file) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const url = await storageService.uploadFile(file, folder, fileType);
      
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