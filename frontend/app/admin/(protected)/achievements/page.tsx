"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import { deleteImage } from "../../../../lib/storage";
import AchievementModal from "../../../../components/admin/AchievementModal";
import toast from "react-hot-toast";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await getCollection("achievements");
      setAchievements(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingAchievement) {
        await updateDocument("achievements", editingAchievement.id, data);
        toast.success("Achievement updated");
      } else {
        await createDocument("achievements", data);
        toast.success("Achievement created");
      }
      fetchAchievements();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (achievement: any) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        if (achievement.imageUrl) {
          await deleteImage(achievement.imageUrl);
        }
        await removeDocument("achievements", achievement.id);
        toast.success("Achievement deleted");
        fetchAchievements();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete achievement");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your awards and hackathons</p>
        </div>
        <button onClick={() => { setEditingAchievement(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Achievement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : achievements.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-6">No achievements added yet.</p>
          <button onClick={() => { setEditingAchievement(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add First Achievement</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
              {achievement.imageUrl && (
                <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">{achievement.type}</span>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{achievement.description}</p>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2 bg-gray-50 dark:bg-gray-800/50">
                <button onClick={() => { setEditingAchievement(achievement); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(achievement)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AchievementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingAchievement} 
      />
    </div>
  );
}
