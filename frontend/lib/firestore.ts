/**
 * Firestore helper — now a thin wrapper around the backend API.
 * 
 * All database operations go through the Express backend.
 * This file maintains the same function signatures so existing 
 * imports throughout the project continue to work without changes.
 */

import { apiGetCollection, apiGetProfile, apiCreate, apiUpdate, apiDelete, apiUpdateProfile } from "./api";

// Generic helper to get a collection
export const getCollection = async (collectionName: string) => {
  return apiGetCollection(collectionName);
};

// Generic helper to get a single document
export const getDocument = async (collectionName: string, _id: string) => {
  if (collectionName === "profile") {
    return apiGetProfile();
  }
  // For other collections, fetch all and find by ID
  const items = await apiGetCollection(collectionName);
  return items.find((item: any) => item.id === _id) || null;
};

// Generic helper to create a document with an auto-generated ID
export const createDocument = async (collectionName: string, data: any) => {
  const result = await apiCreate(collectionName, data);
  return result.id;
};

// Generic helper to set a document with a specific ID (used for profile)
export const setDocument = async (collectionName: string, _id: string, data: any) => {
  if (collectionName === "profile") {
    return apiUpdateProfile(data);
  }
  return apiUpdate(collectionName, _id, data);
};

// Generic helper to update a document
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  return apiUpdate(collectionName, id, data);
};

// Generic helper to delete a document
export const removeDocument = async (collectionName: string, id: string) => {
  return apiDelete(collectionName, id);
};
