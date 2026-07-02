"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import { deleteImage } from "../../../../lib/storage";
import ProjectModal from "../../../../components/admin/ProjectModal";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getCollection("projects");
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingProject) {
        await updateDocument("projects", editingProject.id, data);
        toast.success("Project updated");
      } else {
        await createDocument("projects", { ...data, createdAt: new Date().toISOString() });
        toast.success("Project created");
      }
      fetchProjects();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (project: any) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        if (project.imageUrl) {
          await deleteImage(project.imageUrl);
        }
        await removeDocument("projects", project.id);
        toast.success("Project deleted");
        fetchProjects();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete project");
      }
    }
  };

  const openNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first project to showcase your work.</p>
          <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Get Started</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto border border-gray-100 dark:border-gray-700">
          <table className="w-full text-left whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Tech Stack</th>
                <th className="px-6 py-4 font-semibold">Featured</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{project.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">{tech}</span>
                      ))}
                      {project.techStack?.length > 3 && <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">+{project.techStack.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Yes</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(project)} className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-1">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(project)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1">
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

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingProject} 
      />
    </div>
  );
}
