"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storage";
import toast from "react-hot-toast";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function AchievementModal({ isOpen, onClose, onSave, initialData }: AchievementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "Award",
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        type: "Award",
        imageUrl: "",
      });
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (file) {
        if (initialData?.imageUrl) {
          await deleteImage(initialData.imageUrl);
        }
        finalImageUrl = await uploadImage(file, "achievements");
      }
      await onSave({ ...formData, imageUrl: finalImageUrl });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Achievement" : "New Achievement"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="month" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="Award">Award</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Competition">Competition</option>
                <option value="Recognition">Recognition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image (Optional)</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.imageUrl && !file && (
                <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
              )}
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                <Upload className="w-4 h-4" />
                {file ? file.name : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
              {formData.imageUrl && !file && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Remove this image? It will be deleted from storage.")) return;
                    try {
                      await deleteImage(formData.imageUrl);
                      setFormData({ ...formData, imageUrl: "" });
                      toast.success("Image removed");
                    } catch {
                      toast.error("Failed to remove image");
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {saving ? "Saving..." : "Save Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
