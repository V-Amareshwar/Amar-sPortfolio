"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storage";
import toast from "react-hot-toast";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function ProjectModal({ isOpen, onClose, onSave, initialData }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    techStack: [] as string[],
  });
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
        featured: false,
        techStack: [],
      });
    }
    setFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] });
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (file) {
        if (initialData?.imageUrl) {
          await deleteImage(initialData.imageUrl); // Delete old image
        }
        finalImageUrl = await uploadImage(file, "projects");
      }

      await onSave({ ...formData, imageUrl: finalImageUrl });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Project" : "New Project"}</h2>
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
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Live URL</label>
              <input type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tech Stack (Press Enter to add)</label>
            <input 
              type="text" 
              value={techInput} 
              onChange={e => setTechInput(e.target.value)} 
              onKeyDown={handleAddTech}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 mb-2" 
              placeholder="e.g. React, Node.js"
            />
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center gap-1">
                  {tech} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTech(tech)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Image</label>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.imageUrl && !file && (
                <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium">Featured Project (Shows on homepage)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
