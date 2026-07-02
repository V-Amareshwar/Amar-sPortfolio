"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteImage } from "../../lib/storage";
import toast from "react-hot-toast";

// Very basic TipTap editor imports (assuming installed via Phase 1)
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function BlogModal({ isOpen, onClose, onSave, initialData }: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      editor?.commands.setContent(initialData.content);
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        published: false,
        tags: [],
      });
      editor?.commands.setContent('');
    }
    setFile(null);
  }, [initialData, isOpen, editor]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  }, [formData.title, initialData]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content) {
      toast.error("Content is required");
      return;
    }
    
    setSaving(true);
    try {
      let finalImageUrl = formData.coverImage;
      if (file) {
        if (initialData?.coverImage) {
          await deleteImage(initialData.coverImage);
        }
        finalImageUrl = await uploadImage(file, "blog");
      }
      await onSave({ ...formData, coverImage: finalImageUrl });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Post" : "New Post"}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt *</label>
            <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <div className="border rounded-md overflow-hidden dark:border-gray-600 min-h-[200px]">
              {/* Very basic toolbar */}
              <div className="bg-gray-100 dark:bg-gray-700 p-2 flex gap-2 border-b dark:border-gray-600">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Bold</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Italic</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>H2</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Bullet List</button>
              </div>
              <EditorContent editor={editor} className="p-4 prose dark:prose-invert max-w-none min-h-[200px]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tags (Press Enter to add)</label>
              <input 
                type="text" 
                value={tagInput} 
                onChange={e => setTagInput(e.target.value)} 
                onKeyDown={handleAddTag}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 mb-2" 
                placeholder="e.g. Next.js, Tutorial"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded flex items-center gap-1">
                    {tag} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <div className="flex items-center gap-3 flex-wrap">
                {formData.coverImage && !file && (
                  <img src={formData.coverImage} alt="Cover" className="w-20 h-12 object-cover rounded" />
                )}
                <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                  <Upload className="w-4 h-4" />
                  {file ? file.name : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
                {formData.coverImage && !file && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Remove cover image? It will be deleted from storage.")) return;
                      try {
                        await deleteImage(formData.coverImage);
                        setFormData({ ...formData, coverImage: "" });
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
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
            <label htmlFor="published" className="text-sm font-medium">Published (Visible on site)</label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 p-4">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {saving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
