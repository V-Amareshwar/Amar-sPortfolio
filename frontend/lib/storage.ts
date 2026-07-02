import { apiUploadFile, apiDeleteFile } from "./api";

/**
 * Upload an image/file via the backend API.
 * The backend handles Supabase Storage.
 */
export const uploadImage = async (file: File, _folder: string): Promise<string> => {
  const result = await apiUploadFile(file);
  return result.url;
};

/**
 * Delete an image/file from Supabase Storage via the backend API.
 */
export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return;
  try {
    await apiDeleteFile(imageUrl);
  } catch (error) {
    console.error("Failed to delete image:", error);
    throw error;
  }
};
