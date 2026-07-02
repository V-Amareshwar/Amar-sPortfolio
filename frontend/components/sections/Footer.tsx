"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-semibold text-lg">Portfolio.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Built with Next.js, Tailwind CSS & Firebase.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
