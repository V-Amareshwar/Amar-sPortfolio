"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storage";
import toast from "react-hot-toast";

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function CertificationModal({ isOpen, onClose, onSave, initialData }: CertificationModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialUrl: "",
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
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialUrl: "",
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
        finalImageUrl = await uploadImage(file, "certifications");
      }
      await onSave({ ...formData, imageUrl: finalImageUrl });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Certification" : "New Certification"}</h2>
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
            <label className="block text-sm font-medium mb-1">Issuer *</label>
            <input required type="text" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Google, AWS, Coursera" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date</label>
              <input type="month" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
              <input type="month" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Credential URL</label>
            <input type="url" value={formData.credentialUrl} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="https://" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Certificate Image</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.imageUrl && !file && (
                <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
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
              {saving ? "Saving..." : "Save Certification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
