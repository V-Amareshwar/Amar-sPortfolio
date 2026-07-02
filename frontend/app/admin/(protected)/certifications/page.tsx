"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { getCollection, createDocument, updateDocument, removeDocument } from "../../../../lib/firestore";
import { deleteImage } from "../../../../lib/storage";
import CertificationModal from "../../../../components/admin/CertificationModal";
import toast from "react-hot-toast";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const data = await getCollection("certifications");
      setCertifications(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingCert) {
        await updateDocument("certifications", editingCert.id, data);
        toast.success("Certification updated");
      } else {
        await createDocument("certifications", data);
        toast.success("Certification created");
      }
      fetchCertifications();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (cert: any) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        if (cert.imageUrl) {
          await deleteImage(cert.imageUrl);
        }
        await removeDocument("certifications", cert.id);
        toast.success("Certification deleted");
        fetchCertifications();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete certification");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Certifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your verified credentials</p>
        </div>
        <button onClick={() => { setEditingCert(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : certifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-6">No certifications added yet.</p>
          <button onClick={() => { setEditingCert(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add First Certification</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 flex p-4 gap-4 items-center">
              {cert.imageUrl ? (
                <img src={cert.imageUrl} alt={cert.title} className="w-20 h-20 object-contain bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex flex-col justify-center items-center text-gray-400">
                  <span className="text-xs">No img</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={cert.title}>{cert.title}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">{cert.issuer}</p>
                <p className="text-xs text-gray-500 mt-1">Issued: {cert.issueDate || "N/A"}</p>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-2">
                    View Credential <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 border-l pl-4 border-gray-100 dark:border-gray-700">
                <button onClick={() => { setEditingCert(cert); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cert)} className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingCert} 
      />
    </div>
  );
}
