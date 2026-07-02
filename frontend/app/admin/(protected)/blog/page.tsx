"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import { deleteImage } from "../../../../lib/storage";
import BlogModal from "../../../../components/admin/BlogModal";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getCollection("blog");
      // Sort by createdAt descending
      data.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setPosts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingPost) {
        await updateDocument("blog", editingPost.id, { ...data, updatedAt: new Date().toISOString() });
        toast.success("Post updated");
      } else {
        await createDocument("blog", { ...data, createdAt: new Date().toISOString() });
        toast.success("Post created");
      }
      fetchPosts();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (post: any) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        if (post.coverImage) {
          await deleteImage(post.coverImage);
        }
        await removeDocument("blog", post.id);
        toast.success("Post deleted");
        fetchPosts();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your articles and dev notes</p>
        </div>
        <button onClick={() => { setEditingPost(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Write Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-6">No blog posts yet.</p>
          <button onClick={() => { setEditingPost(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create First Post</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto border border-gray-100 dark:border-gray-700">
          <table className="w-full text-left whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Post</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                        <div className="text-xs text-gray-500">/{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setEditingPost(post); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-1">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(post)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1">
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

      <BlogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingPost} 
      />
    </div>
  );
}
