"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import { deleteImage } from "../../../../lib/storage";
import TestimonialModal from "../../../../components/admin/TestimonialModal";
import toast from "react-hot-toast";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getCollection("testimonials");
      setTestimonials(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingTestimonial) {
        await updateDocument("testimonials", editingTestimonial.id, data);
        toast.success("Testimonial updated");
      } else {
        await createDocument("testimonials", { ...data, createdAt: new Date().toISOString() });
        toast.success("Testimonial created");
      }
      fetchTestimonials();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (testimonial: any) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        if (testimonial.avatarUrl) {
          await deleteImage(testimonial.avatarUrl);
        }
        await removeDocument("testimonials", testimonial.id);
        toast.success("Testimonial deleted");
        fetchTestimonials();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete testimonial");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage reviews and recommendations</p>
        </div>
        <button onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-6">No testimonials added yet.</p>
          <button onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add First Testimonial</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 p-6 flex flex-col relative">
              <div className="flex items-center gap-4 mb-4">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 object-cover rounded-full" />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role} {t.company && `at ${t.company}`}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic flex-1 text-sm">"{t.message}"</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                {t.approved ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Approved</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                )}
                <div className="flex gap-2">
                  <button onClick={() => { setEditingTestimonial(t); setIsModalOpen(true); }} className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t)} className="p-1 text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingTestimonial} 
      />
    </div>
  );
}
