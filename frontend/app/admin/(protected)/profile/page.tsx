"use client";

import React, { useEffect, useState } from "react";
import { getDocument, setDocument } from "../../../../lib/firestore";
import { uploadImage, deleteImage } from "../../../../lib/storage";
import toast from "react-hot-toast";
import { Upload, Trash2 } from "lucide-react";

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    bio: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    availabilityStatus: "Open to Work",
    currentlyLearning: "",
    photoUrl: "",
    resumeUrl: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getDocument("profile", "main");
        if (data) {
          setFormData(data as any);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalPhotoUrl = formData.photoUrl;
      let finalResumeUrl = formData.resumeUrl;

      if (photoFile) {
        if (formData.photoUrl) await deleteImage(formData.photoUrl);
        finalPhotoUrl = await uploadImage(photoFile, "profile");
      }

      if (resumeFile) {
        if (formData.resumeUrl) await deleteImage(formData.resumeUrl);
        finalResumeUrl = await uploadImage(resumeFile, "profile");
      }

      const updatedData = { ...formData, photoUrl: finalPhotoUrl, resumeUrl: finalResumeUrl };
      await setDocument("profile", "main", updatedData);
      setFormData(updatedData);
      setPhotoFile(null);
      setResumeFile(null);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 md:p-8 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your main portfolio identity.</p>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6 border border-gray-100 dark:border-gray-700">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tagline (Hero Section)</label>
            <input required type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Building scalable web experiences" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio (About Section)</label>
            <textarea required rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Availability Status</label>
            <select value={formData.availabilityStatus} onChange={e => setFormData({...formData, availabilityStatus: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
              <option value="Open to Work">Open to Work</option>
              <option value="Open to Internships">Open to Internships</option>
              <option value="Currently Busy">Currently Busy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currently Learning</label>
            <input type="text" value={formData.currentlyLearning} onChange={e => setFormData({...formData, currentlyLearning: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Rust & WebAssembly" />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input type="url" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter URL</label>
            <input type="url" value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Photo</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.photoUrl && !photoFile && (
                <img src={formData.photoUrl} alt="Profile" className="w-16 h-16 object-cover rounded-full" />
              )}
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                <Upload className="w-4 h-4" />
                {photoFile ? photoFile.name : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
              </label>
              {formData.photoUrl && !photoFile && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Remove profile photo? This will delete it from storage.")) return;
                    try {
                      await deleteImage(formData.photoUrl);
                      const updated = { ...formData, photoUrl: "" };
                      await setDocument("profile", "main", updated);
                      setFormData(updated);
                      toast.success("Photo removed");
                    } catch {
                      toast.error("Failed to remove photo");
                    }
                  }}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md border border-red-200 dark:border-red-800 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Resume PDF</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.resumeUrl && !resumeFile && (
                <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Current Resume</a>
              )}
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                <Upload className="w-4 h-4" />
                {resumeFile ? resumeFile.name : "Upload Resume"}
                <input type="file" accept="application/pdf" className="hidden" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
              </label>
              {formData.resumeUrl && !resumeFile && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Remove resume? This will delete it from storage.")) return;
                    try {
                      await deleteImage(formData.resumeUrl);
                      const updated = { ...formData, resumeUrl: "" };
                      await setDocument("profile", "main", updated);
                      setFormData(updated);
                      toast.success("Resume removed");
                    } catch {
                      toast.error("Failed to remove resume");
                    }
                  }}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md border border-red-200 dark:border-red-800 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
