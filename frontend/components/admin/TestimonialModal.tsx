"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storage";
import toast from "react-hot-toast";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function TestimonialModal({ isOpen, onClose, onSave, initialData }: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    avatarUrl: "",
    approved: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        role: "",
        company: "",
        message: "",
        avatarUrl: "",
        approved: true,
      });
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.avatarUrl;
      if (file) {
        if (initialData?.avatarUrl) {
          await deleteImage(initialData.avatarUrl);
        }
        finalImageUrl = await uploadImage(file, "testimonials");
      }
      await onSave({ ...formData, avatarUrl: finalImageUrl });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Testimonial" : "New Testimonial"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Senior Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Avatar Image</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.avatarUrl && !file && (
                <img src={formData.avatarUrl} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
              )}
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                <Upload className="w-4 h-4" />
                {file ? file.name : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
              {formData.avatarUrl && !file && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Remove avatar? It will be deleted from storage.")) return;
                    try {
                      await deleteImage(formData.avatarUrl);
                      setFormData({ ...formData, avatarUrl: "" });
                      toast.success("Avatar removed");
                    } catch {
                      toast.error("Failed to remove avatar");
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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="approved" checked={formData.approved} onChange={e => setFormData({...formData, approved: e.target.checked})} className="w-4 h-4" />
            <label htmlFor="approved" className="text-sm font-medium">Approved (Visible on public site)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {saving ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
