"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}

export default function ResumeModal({ isOpen, onClose, resumeUrl }: ResumeModalProps) {
  if (!isOpen) return null;

  // Convert Firebase Storage URL to a direct PDF viewing URL
  const viewUrl = resumeUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Resume</h2>
              <div className="flex items-center gap-3">
                {/* Open in new tab */}
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                {/* Download */}
                <a
                  href={viewUrl}
                  download
                  title="Download PDF"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <iframe
                src={`${viewUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title="Resume PDF Viewer"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
