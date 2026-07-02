"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function SkillModal({ isOpen, onClose, onSave, initialData }: SkillModalProps) {
  const [formData, setFormData] = useState({
    category: "Languages",
    proficiency: 50,
    showPercentage: true,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || "Languages",
        proficiency: initialData.proficiency || 50,
        showPercentage: initialData.showPercentage !== false, // default true
      });
      if (initialData.name) {
        setTags(initialData.name.split(',').map((t: string) => t.trim()).filter(Boolean));
      } else {
        setTags([]);
      }
    } else {
      setFormData({
        category: "Languages",
        proficiency: 50,
        showPercentage: true,
      });
      setTags([]);
    }
    setInputValue("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const finalName = tags.length > 0 ? tags.join(", ") : inputValue.trim();
    if (!finalName) {
      toast.error("Please add at least one skill");
      setSaving(false);
      return;
    }

    try {
      await onSave({ ...formData, name: finalName });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        if (!tags.includes(inputValue.trim())) {
          setTags([...tags, inputValue.trim()]);
        }
        setInputValue("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Skill" : "New Skill"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Skill Names *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5 font-medium border border-blue-200 dark:border-blue-800/50">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(idx)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. React.js (Press Enter to add)" 
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to add multiple skills to this category.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Languages">Languages</option>
              <option value="Frameworks">Frameworks & Libraries</option>
              <option value="Tools">Tools & Platforms</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Overall Proficiency ({formData.proficiency}%)</label>
            <input type="range" min="0" max="100" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})} className="w-full cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="showPercentage" 
              checked={formData.showPercentage} 
              onChange={e => setFormData({...formData, showPercentage: e.target.checked})} 
              className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="showPercentage" className="text-sm font-medium cursor-pointer">
              Show Percentage Bar
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {saving ? "Saving..." : "Save Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
