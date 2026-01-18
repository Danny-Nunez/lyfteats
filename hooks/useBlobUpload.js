import React, { useState, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook to replace next-s3-upload's useS3Upload
 * Uploads files to Vercel Blob Storage via our API endpoint
 */
export const useBlobUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadToBlob = useCallback(async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/s3-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        url: response.data.url,
        key: response.data.key,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const FileInput = React.forwardRef(({ onChange, ...props }, ref) => {
    const handleChange = async (e) => {
      const file = e.target.files?.[0];
      if (file && onChange) {
        try {
          const result = await uploadToBlob(file);
          onChange(file, result);
        } catch (error) {
          console.error("Upload failed:", error);
          onChange(file, null);
        }
      }
    };

    return (
      <input
        ref={ref}
        type="file"
        onChange={handleChange}
        style={{ display: "none" }}
        {...props}
      />
    );
  });

  FileInput.displayName = "FileInput";

  const openFileDialog = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const result = await uploadToBlob(file);
          // Trigger onChange if FileInput was used
          const event = new CustomEvent("blobUploaded", { detail: result });
          document.dispatchEvent(event);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    };
    input.click();
  }, [uploadToBlob]);

  return {
    FileInput,
    openFileDialog,
    uploadToS3: uploadToBlob, // Keep same name for compatibility
    uploadToBlob,
    uploading,
  };
};

export default useBlobUpload;

