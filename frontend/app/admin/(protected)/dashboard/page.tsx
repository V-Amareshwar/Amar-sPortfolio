"use client";

import React, { useEffect, useState } from "react";
import { getCollection } from "../../../../lib/firestore";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    blog: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, skills, certs, blog] = await Promise.all([
          getCollection("projects"),
          getCollection("skills"),
          getCollection("certifications"),
          getCollection("blog")
        ]);

        setStats({
          projects: projects.length,
          skills: skills.length,
          certifications: certs.length,
          blog: blog.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back. Manage your portfolio content here.</p>
      </header>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Projects</h3>
            <p className="text-4xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.projects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Skills</h3>
            <p className="text-4xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.skills}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Certifications</h3>
            <p className="text-4xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.certifications}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Blog Posts</h3>
            <p className="text-4xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.blog}</p>
          </div>
        </div>
      )}
    </div>
  );
}
