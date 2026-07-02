import { auth } from "./firebase";

// The backend API base URL — comes from .env
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Get the current user's Firebase Auth token.
 * Returns null if no user is logged in.
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/**
 * Generic fetch wrapper with optional auth.
 */
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<any> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = await getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Public API helpers (no auth required)
// ---------------------------------------------------------------------------

/** Fetch a collection (projects, skills, etc.) */
export const apiGetCollection = async (collection: string) => {
  return apiFetch(`/${collection}`);
};

/** Fetch the profile document */
export const apiGetProfile = async () => {
  return apiFetch("/profile");
};

/** Submit a contact form message (public) */
export const apiSendMessage = async (data: { name: string; email: string; message: string }) => {
  return apiFetch("/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ---------------------------------------------------------------------------
// Admin API helpers (auth required)
// ---------------------------------------------------------------------------

/** Create a new document in a collection */
export const apiCreate = async (collection: string, data: any) => {
  return apiFetch(`/${collection}`, {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
};

/** Update a document in a collection */
export const apiUpdate = async (collection: string, id: string, data: any) => {
  return apiFetch(`/${collection}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, true);
};

/** Delete a document from a collection */
export const apiDelete = async (collection: string, id: string) => {
  return apiFetch(`/${collection}/${id}`, {
    method: "DELETE",
  }, true);
};

/** Update the profile */
export const apiUpdateProfile = async (data: any) => {
  return apiFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  }, true);
};

/** Upload a file to the backend */
export const apiUploadFile = async (file: File): Promise<{ url: string }> => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return response.json();
};

/** Fetch messages (admin only) */
export const apiGetMessages = async () => {
  return apiFetch("/messages", {}, true);
};

/** Verify auth token with backend */
export const apiVerifyToken = async (token: string) => {
  return apiFetch("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

/** Delete a file from Supabase storage via the backend */
export const apiDeleteFile = async (fileUrl: string) => {
  return apiFetch("/upload", {
    method: "DELETE",
    body: JSON.stringify({ fileUrl }),
  }, true);
};
