"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import SkillModal from "../../../../components/admin/SkillModal";
import toast from "react-hot-toast";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getCollection("skills");
      setSkills(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingSkill) {
        await updateDocument("skills", editingSkill.id, data);
        toast.success("Skill updated");
      } else {
        await createDocument("skills", data);
        toast.success("Skill created");
      }
      fetchSkills();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (skill: any) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await removeDocument("skills", skill.id);
        toast.success("Skill deleted");
        fetchSkills();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete skill");
      }
    }
  };

  const openNew = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const openEdit = (skill: any) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your technical and soft skills</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-6">No skills added yet.</p>
          <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add First Skill</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto border border-gray-100 dark:border-gray-700">
          <table className="w-full text-left whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Skill Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Proficiency</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{skill.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">{skill.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 max-w-[150px]">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(skill)} className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-1">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(skill)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SkillModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingSkill} 
      />
    </div>
  );
}
